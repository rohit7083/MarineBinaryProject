import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit2, Eye, Trash } from "react-feather";
import { Table as ReactstrapTable, Input, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { debounce } from "lodash";
import { Spinner } from "reactstrap";
import withReactContent from "sweetalert2-react-content";
import useJwt from "@src/auth/jwt/useJwt";
import Createuser from "./Createuser";
import CreateuserModal from "./CreateUserModal";
const CustomTable = ({ data }) => {
  // const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [RowData, setRowData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dataUid, setDataUid] = useState(null);
  const [datarow, setDatarow] = useState(null);

  const [tableData, setTableData] = useState({
  
    count: 0,
    results: [],
  });
  console.log("table",tableData);
  
  const [loading, setLoading] = useState(true);
  // ** Get data on mount
  const MySwal = withReactContent(Swal);

  async function fetchTableData(offset = 0, limit = 10) {
    try {
      const { data } = await useJwt.getallSubuser(
        `?offset=${offset}&limit=${limit}`
      );
      setLoading(true);
      const { content } = data;

      setTableData({ count: content.count, results: content.result });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // ?offset=10&limit=10
  useEffect(() => {
    fetchTableData();
  }, []);

  const handlePerPage = (e) => {
    // setRowsPerPage(Number(e.target.value));
  };

  // const handleFilter = (value) => {
  //   setSearchTerm(value);
  //   if (value) {
  //     const filteredData = data.results.filter((row) =>
  //       row.firstName.toLowerCase().includes(value.toLowerCase())
  //     );
  //     setTableData(filteredData);
  //   } else {
  //     setTableData(data.results);
  //   }

  // };
  const debouncedFilter = debounce((value) => handleFilter(value), 300);

  const handleFilter = (value) => {
    setSearchTerm(value);

    if (value) {
      const filteredResults = tableData.results.filter(
        (row) =>
          row.firstName.toLowerCase().includes(value.toLowerCase()) ||
          row.lastName.toLowerCase().includes(value.toLowerCase()) ||
          row.emailId.toLowerCase().includes(value.toLowerCase()) ||
          row.mobileNum.includes(value)
      );

      // Update table data with filtered results
      setTableData((prev) => ({
        ...prev,
        results: filteredResults,
      }));
    } else {
      // Re-fetch the data or reset it to its original state
      fetchTableData((currentPage - 1) * rowsPerPage, rowsPerPage);
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
    fetchTableData(page.selected * 10, 10);
  };

  const handleAssignedToChange = (value) => {
    setRole(value);
  };

  const columns = [
    {
      name: "Id",
      sortable: true,
      minWidth: "150px",
      selector: (row, index) => index + 1,
    },

    {
      name: "First Name",
      sortable: true,
      minWidth: "250px",
      selector: (row) => row.firstName,
    },
    {
      name: "Last Name",
      sortable: true,
      minWidth: "250px",
      selector: (row) => row.lastName,
    },
    {
      name: "Email ID",
      sortable: true,
      minWidth: "250px",
      selector: (row) => row.emailId,
    },
    {
      name: "Mobile Number",
      sortable: true,
      minWidth: "250px",
      selector: (row) => `${row.countryCode}${row.mobileNum}`,
    },

    {
      name: "Roll Name",
      sortable: true,
      minWidth: "250px",
      selector: (row) => row.userRoles.roleName,
    },

    {
      name: "Actions",
      minWidth: "400px",
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
                const response = await useJwt.deleteSubUser(uid);
                if (response.status === 204) {
                  setData((prevData) =>
                    prevData.filter((item) => item.uid !== uid)
                  );
                  // Show success message
                  MySwal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    customClass: {
                      confirmButton: "btn btn-success",
                    },
                  });
                  window.location.reload(true);
                }
              } catch (error) {
                console.error("Error deleting item:", error);
              }
            } else if (result.dismiss === MySwal.DismissReason.cancel) {
              // Show cancellation message
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
            {/* <Link to={`/apps/user/view/${row.uid}`}>
            <Eye className="font-medium-3 text-body" />
          </Link> */}
            <span
              color="danger"
              style={{ margin: "1rem", cursor: "pointer", color: "red" }}
              onClick={() => {
                setShowModal(false); // Reset state
                setTimeout(() => {
                  setDataUid(row.uid);
                  setDatarow(row);
                  setShowModal(true); // Open modal
                }, 0); // Slight delay to ensure React detects state change
              }}
            >
              <Edit2 className="font-medium-3 text-body" />
            </span>

            <span
              color="danger"
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDelete(row.uid)}
            >
              <Trash className="font-medium-3 text-body" />
            </span>
          </>
        );
      },
    },
  ];

  // useEffect(() => {
  //   if (data && data.results) {
  //     setTableData(data.results);
  //   }

  // console.log("showmodal", showModal);
  // }, [data]);

  // ** Custom Pagination
  const CustomPagination = () => {
    const pageCount = Math.ceil(tableData.count / rowsPerPage);
console.log(pageCount);

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage - 1}
        onPageChange={handlePagination}
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
    return tableData.results;
  };

  return (
    <>
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
          <Col
            xl="6"
            className="d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pe-lg-1 p-0 mt-lg-0 mt-1"
          >
            <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
              <label className="mb-0" htmlFor="search-invoice">
                Search:
              </label>
              <Input
                type="text"
                value={searchTerm}
                id="search-invoice"
                className="ms-50 w-100"
                onChange={(e) => debouncedFilter(e.target.value)}
              />
            </div>

            <div className="mx-2">
              <Createuser />
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
      <CreateuserModal show={showModal} uid={dataUid} row={datarow} />
    </>
  );
};

export default CustomTable;
