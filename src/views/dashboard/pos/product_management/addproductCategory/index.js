import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ArrowLeft, ChevronDown, Edit, Plus } from "react-feather";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Col, Input, Row, Spinner } from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import NavItems from "../NavItems";
const index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [dataUid, setDataUid] = useState(null);
  const [datarow, setDatarow] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [parentData, setparentData] = useState([]);

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
      const { data } = await useJwt.getProductCategory();
      const { content } = data;
      setTableData({ count: content.result.length, results: content.result });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (row) => {
    navigate("/pos/product_management/add-category", {
      state: { row: row, uid: row.uid, parentCategoryData: parentData },
    });
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
          row.parentUid?.name.toLowerCase().includes(value.toLowerCase()) ||
          row.name?.toLowerCase().includes(value.toLowerCase()) ||
          row.id?.toString().includes(value)
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
      name: "Parent Category",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.parentUid?.name || "N/A",
    },

    {
      name: "Categroy Name",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.name,
    },

    {
      name: "variation",
      sortable: true,
      // minWidth: "150px",
      selector: (row) =>
        row?.attributeKeys.map((attr) => attr.attributeName).join(", ") ||
        "N/A",
    },

    {
      name: "Required",
      sortable: true,
      // minWidth: "150px",
      selector: (row) =>
        row?.attributeKeys.map((attr) => attr.isRequired).join(", ") || "N/A",
    },

    {
      name: "Actions",
      minWidth: "150px",
      cell: (row) => {
        const [data, setData] = useState([]);
        console.log("row action", row);

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
                const response = await useJwt.deleteProductCategory(uid);
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
            {/* <UncontrolledDropdown>
              <DropdownToggle
                className="icon-btn hide-arrow"
                color="transparent"
                size="sm"
                caret
              >
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => handleEdit(row)}>
                  <Edit className="me-50" size={15} />
                  <span className="align-middle">Edit</span>
                </DropdownItem>

              </DropdownMenu>
            </UncontrolledDropdown> */}

            <span style={{ cursor: "pointer" }} onClick={() => handleEdit(row)}>
              <Edit className="me-50" size={15} />
            </span>
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
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            {/* Left side */}
            <h3 className="d-flex align-items-center mb-0">
              <ArrowLeft
                style={{
                  cursor: "pointer",
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
                onClick={() => navigate(-1)}
              />
              <span className="ms-2">Add Product Category</span>
            </h3>

            {/* Right side */}
            <div className="d-flex align-items-center gap-2">
              <Link
                to="/pos/product_management/add-category"
                state={{
                  parentCategoryData: tableData.results,
                }}
              >
                <Button size="sm" color="primary">
                  <Plus size={15} />
                  <span className="align-middle">Add Category</span>
                </Button>
              </Link>
              <NavItems />
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
                    bsSize="sm"
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
              <Col xl="6" className="d-flex justify-content-end  ">
                <div className="w-48  d-flex mx-2">
                  <label className="mx-1" htmlFor="search-invoice">
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
