import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import useJwt from "@src/auth/jwt/useJwt";
import { debounce } from "lodash";
import { ChevronDown, Edit2, MoreVertical, Settings } from "react-feather";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import {
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
const index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
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
      const { data } = await useJwt.getSettings();
      const { content } = data;
      console.log("getSettings", content);

      setTableData({ count: content.count, results: content?.result });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (row) => {
    navigate("/crm/email_sms_setting", { state: { row } });
  };

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
    setSearchTerm(value);

    if (value) {
      const filteredResults = tableData.results.filter(
        (row) =>
          row.member?.firstName?.toLowerCase().includes(value.toLowerCase()) ||
          row.paymentStatus?.toLowerCase().includes(value.toLowerCase()) ||
          row.roomNumber?.toString().includes(value) ||
          row.finalAmount?.toString().includes(value)
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

  const handlePayment = (row) => {
    navigate("/search-rooms/previewBooking/roomPayment", { state: { row } });
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
      minWidth: "100px",
      selector: (row, index) => index + 1,
    },

    {
      name: "siteName",
      sortable: true,
      selector: (row) => row.siteName,
    },

    {
      name: "email",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.email,
    },

    {
      name: "phoneNumber",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.phoneNumber,
    },

    {
      name: "emailKey",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.emailKey,
    },

    {
      name: "smsAccountSID",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.smsAccountSID,
    },

    {
      name: "Actions",
      minWidth: "150px",
      cell: (row) => {
        const [data, setData] = useState([]);

        const MySwal = withReactContent(Swal);

        const handleDelete = async (uid) => {
          // Show confirmation modal
          return MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-danger ms-1",
            },
            buttonsStyling: false,
          }).then(async function (result) {
            if (result.value) {
              try {
                // Call delete API
                const response = await useJwt.DeleteVendorType(uid);
                if (response?.status === 204) {
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
                    text: "Your file has been deleted.",
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
                text: "Your imaginary file is safe :)",
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
              >
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu end container="body">
                <DropdownItem onClick={() => handleEdit(row)}>
                  <Edit2 className="me-50" size={15} />{" "}
                  <span className="align-middle">Edit</span>
                </DropdownItem>

                {/* <DropdownItem onClick={() => handleDelete(row.uid)}>
                    <Trash className="me-50" size={15} />{" "}
                    <span className="align-middle">Delete</span>
                  </DropdownItem> */}
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

  // ** Table data to render
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
            <h3 className="">Email-Sms Settings List</h3>

            <div className="mx-2">
              <Row
                className="px-2
               mt-1 "
              >
                <Col xs="auto">
                  <Link to={"/crm/email_sms_setting"}>
                    <Button
                      // color="danger"
                      color="primary"
                      size="sm"
                      className="text-nowrap mb-1"
                    >
                      <Settings size={14} /> Create Setting
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
        </CardBody>
      </Card>
    </>
  );
};

export default index;
