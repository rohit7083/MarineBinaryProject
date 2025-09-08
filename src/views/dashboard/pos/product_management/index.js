// // ** React Imports
// import { forwardRef, Fragment, useState } from "react";
// // ** Table Data & Columns
// import "@styles/react/libs/tables/react-dataTable-component.scss";
// import { useNavigate } from "react-router-dom";

// import { columns, data } from "./Data";
// // ** Add New Modal Component

// // ** Third Party Components
// import DataTable from "react-data-table-component";
// import { ChevronDown } from "react-feather";
// import ReactPaginate from "react-paginate";

// // ** Reactstrap Imports
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   Col,
//   Input,
//   Label,
//   Row,
// } from "reactstrap";
// import NavItems from "./NavItems";

// // ** Bootstrap Checkbox Component
// const BootstrapCheckbox = forwardRef((props, ref) => (
//   <div className="form-check">
//     <Input type="checkbox" ref={ref} {...props} />
//   </div>
// ));

// const DataTableWithButtons = () => {
//   // ** States
//   // const [modal, setModal] = useState(false);
//   const [show, setShow] = useState(false);

//   const [tooltipOpen, setTooltipOpen] = useState({
//     ANP: false,
//     importProduct: false,
//     addProductCate: false,
//     addProducttaxes: false,
//     addStock: false,
//     stockManage: false,
//   });
//   const toggleTooltip = (tooltip) => {
//     setTooltipOpen((prevState) => ({
//       ...prevState,
//       [tooltip]: !prevState[tooltip],
//     }));
//   };

//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchValue, setSearchValue] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   // ** Function to handle Modal toggle
//   // const handleModal = () => setModal(!modal);

//   // ** Function to handle filter
//   const handleFilter = (e) => {
//     const value = e.target.value;
//     let updatedData = [];
//     setSearchValue(value);

//     const status = {
//       1: { title: "Current", color: "light-primary" },
//       2: { title: "Professional", color: "light-success" },
//       3: { title: "Rejected", color: "light-danger" },
//       4: { title: "Resigned", color: "light-warning" },
//       5: { title: "Applied", color: "light-info" },
//     };

//     if (value.length) {
//       updatedData = data.filter((item) => {
//         const startsWith =
//           item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
//           item.post.toLowerCase().startsWith(value.toLowerCase()) ||
//           item.email.toLowerCase().startsWith(value.toLowerCase()) ||
//           item.age.toLowerCase().startsWith(value.toLowerCase()) ||
//           item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
//           item.start_date.toLowerCase().startsWith(value.toLowerCase()) ||
//           status[item.status].title
//             .toLowerCase()
//             .startsWith(value.toLowerCase());

//         const includes =
//           item.full_name.toLowerCase().includes(value.toLowerCase()) ||
//           item.post.toLowerCase().includes(value.toLowerCase()) ||
//           item.email.toLowerCase().includes(value.toLowerCase()) ||
//           item.age.toLowerCase().includes(value.toLowerCase()) ||
//           item.salary.toLowerCase().includes(value.toLowerCase()) ||
//           item.start_date.toLowerCase().includes(value.toLowerCase()) ||
//           status[item.status].title.toLowerCase().includes(value.toLowerCase());

//         if (startsWith) {
//           return startsWith;
//         } else if (!startsWith && includes) {
//           return includes;
//         } else return null;
//       });
//       setFilteredData(updatedData);
//       setSearchValue(value);
//     }
//   };

//   // ** Function to handle Pagination
//   const handlePagination = (page) => {
//     setCurrentPage(page.selected);
//   };

//   // ** Custom Pagination
//   const CustomPagination = () => (
//     <ReactPaginate
//       previousLabel=""
//       nextLabel=""
//       forcePage={currentPage}
//       onPageChange={(page) => handlePagination(page)}
//       pageCount={
//         searchValue.length
//           ? Math.ceil(filteredData.length / 7)
//           : Math.ceil(data.length / 7) || 1
//       }
//       breakLabel="..."
//       pageRangeDisplayed={2}
//       marginPagesDisplayed={2}
//       activeClassName="active"
//       pageClassName="page-item"
//       breakClassName="page-item"
//       nextLinkClassName="page-link"
//       pageLinkClassName="page-link"
//       breakLinkClassName="page-link"
//       previousLinkClassName="page-link"
//       nextClassName="page-item next-item"
//       previousClassName="page-item prev-item"
//       containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
//     />
//   );

//   // ** Converts table to CSV
//   function convertArrayOfObjectsToCSV(array) {
//     let result;

//     const columnDelimiter = ",";
//     const lineDelimiter = "\n";
//     const keys = Object.keys(data[0]);

//     result = "";
//     result += keys.join(columnDelimiter);
//     result += lineDelimiter;

//     array.forEach((item) => {
//       let ctr = 0;
//       keys.forEach((key) => {
//         if (ctr > 0) result += columnDelimiter;

//         result += item[key];

//         ctr++;
//       });
//       result += lineDelimiter;
//     });

//     return result;
//   }

//   // ** Downloads CSV
//   function downloadCSV(array) {
//     const link = document.createElement("a");
//     let csv = convertArrayOfObjectsToCSV(array);
//     if (csv === null) return;

//     const filename = "export.csv";

//     if (!csv.match(/^data:text\/csv/i)) {
//       csv = `data:text/csv;charset=utf-8,${csv}`;
//     }

//     link.setAttribute("href", encodeURI(csv));
//     link.setAttribute("download", filename);
//     link.click();
//   }
//   const navigate = useNavigate();

//   return (
//     <Fragment>
//       <Card>
// <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
//   <CardTitle tag="h4">Product List</CardTitle>
//   <div className="d-flex mt-md-0 mt-1">
//     <div className="d-flex  mt-2 justify-content-start gap-2">
//       <NavItems />
//     </div>
//   </div>
// </CardHeader>
//         <Row className="justify-content-between mx-0">
//           {/* Left Side - Button */}
//           <Col md="6" sm="12" className="d-flex align-items-center mt-1"></Col>

//           {/* Right Side - Search Bar */}
//           <Col
//             md="6"
//             sm="12"
//             className="d-flex align-items-center justify-content-end mt-1"
//           >
//             <Label className="me-1" htmlFor="search-input">
//               Search
//             </Label>
//             <Input
//               className="dataTable-filter mb-50 w-25"
//               type="text"
//               bsSize="sm"
//               id="search-input"
//               value={searchValue}
//               onChange={handleFilter}
//             />
//           </Col>
//         </Row>

//         <div className="react-dataTable react-dataTable-selectable-rows">
//           <DataTable
//             noHeader
//             pagination
//             selectableRows
//             columns={columns}
//             paginationPerPage={7}
//             className="react-dataTable"
//             sortIcon={<ChevronDown size={10} />}
//             paginationComponent={CustomPagination}
//             paginationDefaultPage={currentPage + 1}
//             selectableRowsComponent={BootstrapCheckbox}
//             // data={searchValue.length ? filteredData : data}
//           />
//         </div>
//       </Card>
//     </Fragment>
//   );
// };

// export default DataTableWithButtons;

import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import NavItems from "./NavItems";

import useJwt from "@src/auth/jwt/useJwt";
import { debounce } from "lodash";
import {
  ChevronDown,
  Edit,
  Eye,
  MoreVertical,
  Trash
} from "react-feather";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
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
      const { data } = await useJwt.getAllProduct();
      const { content } = data;

      setTableData({ count: content.count, results: content?.result });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (row) => {
    navigate("/dashboard/pos/product_management/addProduct_index", { state: { row } });
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
      name: "Product Name",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.name,
    },
    {
      name: "Product Type",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.productType,
    },

    {
      name: "Vendor",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.vendorUid.vendorName,
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
                const response = await useJwt.deleteProduct(uid);
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
              <DropdownMenu>
                
                  <DropdownItem onClick={() => handleEdit(row)}>
                    <Edit className="me-50" size={15} />
                    <span className="align-middle">Edit</span>
                  </DropdownItem>
              
                {/* {row?.paymentStatus === "Pending" && (
                  <DropdownItem onClick={() => handlePayment(row)}>
                    <DollarSign className="me-50" size={15} />{" "}
                    <span className="align-middle">Payment</span>
                  </DropdownItem>
                )} */}
                <DropdownItem onClick={() => handleEdit(row)}>
                  <Eye className="me-50" size={15} />{" "}
                  <span className="align-middle">View</span>
                </DropdownItem>

                <DropdownItem onClick={() => handleDelete(row.uid)}>
                    <Trash className="me-50" size={15} />{" "}
                    <span className="align-middle">Delete</span>
                  </DropdownItem>
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
          <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
            <CardTitle tag="h4">Product List</CardTitle>
            <div className="d-flex mt-md-0 mt-1">
              <div className="d-flex   justify-content-start gap-2">
                <NavItems />
              </div>
            </div>
          </CardHeader>

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
