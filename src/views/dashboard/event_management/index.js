import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Calendar,
  ChevronDown,
  DollarSign,
  Edit,
  MoreVertical,
  Plus,
  PlusCircle,
  Trash,
  Trash2,
} from "react-feather";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CancleRooms from "./cancleRooms/CancleRooms";
const index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [dataUid, setDataUid] = useState(null);
  const [datarow, setDatarow] = useState(null);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const [tableData, setTableData] = useState({
    count: 0,
    results: [],
  });

  const [loading, setLoading] = useState(true);
  const MySwal = withReactContent(Swal);
  const [mode, setMode] = useState("create");

  async function fetchTableData() {
    try {
      setLoading(true);
      const { data } = await useJwt.getAllEvents();
      const { content } = data;
      console.log("getAllEvents", content);

      setTableData({ count: content.count, results: content?.result });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTableData();
  }, [currentPage, rowsPerPage]);

  const handlePerPage = (e) => {
    const newLimit = parseInt(e.target.value);
    setRowsPerPage(newLimit);
    setCurrentPage(1);
  };

  const debouncedFilter = debounce((value) => handleFilter(value), 300);

  const handleFilter = (value) => {
    // {{ }}
    setSearchTerm(value);

    if (value) {
      const filteredResults = tableData.results.filter(
        (row) =>
          row.eventName?.toLowerCase().includes(value.toLowerCase()) ||
          row.perDayDueChargesType
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          row.totalAmount?.toString().includes(value)
      );

      setTableData((prev) => ({
        ...prev,
        results: filteredResults,
      }));
    } else {
      fetchTableData((currentPage - 1) * rowsPerPage, rowsPerPage);
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handleAssignedToChange = (value) => {
    setRole(value);
  };

  const handleEdit = (row) => {
    navigate("/CreateEvent", {
      state: {
        Rowdata: row,
        uid: row.uid,
      },
    });
  };

  const handlePayment = (row) => {
    navigate("/CreateEvent", {
      state: {
        Rowdata: row,
        uid: row.uid,
        step: 2,
      },
    });
  };

  const handlePaymentHistory = (row) => {
    navigate("/PaymentHistory", {
      state: {
        Rowdata: row,
      },
    });
  };

  const handleAddExtraRoom = (row) => {
    navigate("/addNew_room_booking", {
      state: {
        Rowdata: row,
        mode: "addExtraRoom",
        uidOfEvent: row.uid,
      },
    });
  };

  const handleRoomCancle = (row) => {
    // navigate("/addNew_room_booking", {
    //   state: {
    //     Rowdata: row,
    //     uidOfEvent: row.uid,
    //   },
    // });
    setDatarow(row);
    setShow(true);
  };
  const paymentStatusColor = {
    success: "light-success",
    error: "light-danger",
    pending: "light-warning",
  };
  const columns = [
    {
      name: "Id",
      sortable: true,
      // minWidth: "100px",
      selector: (row, index) => index + 1,
    },

    {
      name: "Event Name",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.eventName,
    },

    {
      name: "Start Date & Time",
      sortable: true,
      minWidth: "250px",
      selector: (row) => `${row.eventStartDate} - ${row.eventStartTime}`,
    },
    {
      name: "End Date & Time",
      sortable: true,
      minWidth: "250px",
      selector: (row) => `${row.eventEndDate} - ${row.eventEndTime}`,
    },

    {
      name: "Total Amt",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.totalAmount,
    },
    {
      name: "Payment Status",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => {
        return (
          <Badge
            color={
              paymentStatusColor[row?.paymentStatus?.toLowerCase()] ||
              "light-primary"
            }
            pill
          >
            {row.paymentStatus}
          </Badge>
        );
      },
    },
    {
      name: "Remaining Amt",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.remainingAmount,
    },

    {
      name: "Actions",
      minWidth: "150px",
      cell: (row) => {
        const [data, setData] = useState([]);

        const MySwal = withReactContent(Swal);

        const handleCancle = async (uid) => {
          // Show confirmation modal
          return MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes,Cancel Event",
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-danger ms-1",
            },
            buttonsStyling: false,
          }).then(async function (result) {
            if (result.value) {
              try {
                // Call delete API
                const response = await useJwt.cancleEvent(uid);
                if (response?.status === 200) {
                  setTableData((prevData) => {
                    const newData = prevData.results.filter(
                      (item) => item.uid !== uid
                    );
                    return {
                      ...prevData,
                      results: newData,
                      count: prevData.count - 1, // Adjust the count if needed
                    };
                  });
                  MySwal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Your Event has been Cancle.",
                    customClass: {
                      confirmButton: "btn btn-success",
                    },
                  });
                }
              } catch (error) {
                console.error("Error deleting item:", error);
              }
            } else if (result.dismiss === MySwal.DismissReason.cancel) {
              MySwal.fire({
                title: "Cancelled",
                text: "Your Event is safe :)",
                icon: "error",
                customClass: {
                  confirmButton: "btn btn-success",
                },
              });
            }
          });
        };
        return (
          <>
            <UncontrolledDropdown>
              <DropdownToggle
                className="icon-btn hide-arrow"
                color="transparent"
                size="sm"
                caret
                // strategy="fixed"
              >
                <MoreVertical size={15} />
              </DropdownToggle>

             <DropdownMenu end container="body">

                <DropdownItem onClick={() => handleEdit(row)}>
                  <Edit className="me-50" size={15} />
                  <span className="align-middle">Edit</span>
                </DropdownItem>

                {row?.remainingAmount > 0 && (
                  <DropdownItem
                    onClick={() =>
                      handlePayment({ ...row, setting: "payment" })
                    }
                  >
                    <DollarSign className="me-50" size={15} />{" "}
                    <span className="align-middle">Payment</span>
                  </DropdownItem>
                )}
                <DropdownItem onClick={() => handlePaymentHistory(row)}>
                  <Calendar className="me-50" size={15} />{" "}
                  <span className="align-middle">Payment History</span>
                </DropdownItem>
              

                <DropdownItem onClick={() => handleAddExtraRoom(row)}>
                  <PlusCircle className="me-50" size={15} />{" "}
                  <span className="align-middle">Add Extra Room</span>
                </DropdownItem>

               
                <DropdownItem onClick={() => handleCancle(row.uid)}>
                  <Trash2 className="me-50" size={15} />{" "}
                  <span className="align-middle">Cancle Event</span>
                </DropdownItem>
                {row?.roomBookings?.length > 0 && (
                  <DropdownItem onClick={() => handleRoomCancle(row)}>
                    <Trash className="me-50" size={15} />{" "}
                    <span className="align-middle">Cancle Room</span>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    },
  ];

  const CustomPagination = () => {
    const count = Math.ceil(tableData.count / rowsPerPage);
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={Math.ceil(count) || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName="page-item"
        breakClassName="page-item"
        nextLinkClassName="page-link"
        pageLinkClassName="page-link"
        breakLinkClassName="page-link"
        previousLinkClassName="page-link"
        nextClassName="page-item next-item"
        previousClassName="page-item prev-item"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
        }
      />
    );
  };

  const dataToRender = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tableData.results.slice(startIndex, endIndex);
  };

  return (
    <>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center flex-wrap ">
            <h3 className="">Event Management</h3>

            <div className="mx-2">
              <Row
                className="px-2
               mt-1 "
              >
                <Col xs="auto">
                  <Link to={"/CreateEvent"}>
                    <Button
                      // color="danger"
                      color="primary"
                      size="sm"
                      className="text-nowrap mb-1"
                    >
                      <Plus size={14} /> Create Event
                    </Button>
                  </Link>
                </Col>
              </Row>{" "}
            </div>
          </div>
          <hr />
          <div className="app-user-list">{/* <Table /> */}</div>
          <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
            <Row>
              <Col xl="6" className="d-flex align-items-center p-0">
                <div className="d-flex align-items-center w-100">
                  <label htmlFor="rows-per-page">Show</label>
                  <Input
                    className="mx-50"
                    type="select"
                    id="rows-per-page"
                    value={rowsPerPage}
                    onChange={handlePerPage}
                    style={{ width: "5rem" }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </Input>
                  <label htmlFor="rows-per-page">Entries</label>
                </div>
              </Col>
              <Col xl="6" className="d-flex justify-content-end p-0 ">
                <div className="w-48  d-flex mx-2">
                  <label className="mt-1 mx-1" htmlFor="search-invoice">
                    Search:
                  </label>

                  <Input
                    className="dataTable-filter"
                    name="search"
                    placeholder="Search..."
                    type="text"
                    bsSize="sm"
                    id="search-input"
                    onChange={(e) => debouncedFilter(e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </div>
          {loading ? (
            <div className="text-center">
              <Spinner
                className="me-25 spinner-border"
                color="primary"
                style={{ width: "4rem", height: "4rem" }}
              />
            </div>
          ) : (
            <div className="react-dataTable">
              <DataTable
                noHeader
                pagination
                subHeader
                responsive
                paginationServer
                columns={columns}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                // data={tableData}
                striped
                paginationComponent={CustomPagination}
                data={dataToRender()}
              />
            </div>
          )}

          <CancleRooms datarow={datarow} setShow={setShow} show={show} />
        </CardBody>
      </Card>
    </>
  );
};

export default index;
