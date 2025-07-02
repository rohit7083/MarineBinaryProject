// import React, { useState, useRef, useEffect } from "react";
// import Event_Info from "./Event_info";
// // import VenueLocation from "./steps-with-validation/VenueLocation";
// // import LogisticsServices from "./steps-with-validation/LogisticsServices";
// // import VendorsCoordination from "./steps-with-validation/VendorsCoordination";
// // import FinalReview from "./steps-with-validation/FinalReview";

// // Custom Components
// import Wizard from "@components/wizard";

// // Icons
// import { User, MapPin, Settings, Users, Clipboard } from "react-feather";

// const index = () => {
//   const ref = useRef(null);
//   const [stepper, setStepper] = useState(null);
//   const [fetchLoader, setFetchLoader] = useState(false);

//   const [formData, setFormData] = useState({
//         EventInfo: {},
//     clientInfo: {},
//     venueLocation: {},
//     logistics: {},
//     vendors: {},
//   });

//   useEffect(() => {
//     // Optional: Fetch existing data to prefill
//   }, []);

//   const steps = [
//     {
//       id: "Event-info",
//       title: "Event Information",
//       subtitle: "Enter Event details",
//       icon: <User size={18} />,
//       content: (
//         <Event_Info
//           stepper={stepper}
//           formData={{ ...formData.EventInfo }}
//           setFormData={setFormData}
//           fetchLoader={fetchLoader}
//         />
//       ),
//     },
//     {
//       id: "venue-location",
//       title: "Venue & Location",
//       subtitle: "Choose venue & setup",
//       icon: <MapPin size={18} />,
//       content: (
//         <Event_Info
//           stepper={stepper}
//           formData={{ ...formData.venueLocation }}
//           setFormData={setFormData}
//           fetchLoader={fetchLoader}
//         />
//       ),
//     },
//     {
//       id: "logistics",
//       title: "Logistics & Services",
//       subtitle: "Plan services",
//       icon: <Settings size={18} />,
//       content: (
//         <Event_Info
//           stepper={stepper}
//           formData={{ ...formData.logistics }}
//           setFormData={setFormData}
//           fetchLoader={fetchLoader}
//         />
//       ),
//     },
//     {
//       id: "vendors",
//       title: "Vendors & Coordination",
//       subtitle: "Manage vendors",
//       icon: <Users size={18} />,
//       content: (
//         <Event_Info
//           stepper={stepper}
//           formData={{ ...formData.vendors }}
//           setFormData={setFormData}
//           fetchLoader={fetchLoader}
//         />
//       ),
//     },
//     {
//       id: "review",
//       title: "Review",
//       subtitle: "Final review & submit",
//       icon: <Clipboard size={18} />,
//       content: (
//         <Event_Info
//           stepper={stepper}
//           formData={formData}
//           fetchLoader={fetchLoader}
//         />
//       ),
//     },
//   ];

//   return (
//     <div className="modern-horizontal-wizard">
//       <Wizard
//         type="modern-horizontal"
//         ref={ref}
//         steps={steps}
//         options={{ linear: false }}
//         instance={(el) => setStepper(el)}
//       />
//     </div>
//   );
// };

// export default index;

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "@styles/react/libs/tables/react-dataTable-component.scss";

import { ChevronDown, Edit2, Eye, Plus, Trash } from "react-feather";
import {
  Table as ReactstrapTable,
  Input,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
} from "reactstrap";
import Add_parkDetails from "../parking_pass/Add_parkDetails";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { debounce } from "lodash";
import { Spinner } from "reactstrap";
import withReactContent from "sweetalert2-react-content";
import useJwt from "@src/auth/jwt/useJwt";
const index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [dataUid, setDataUid] = useState(null);
  const [datarow, setDatarow] = useState(null);
  const [show, setShow] = useState(false);

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
    // {{ }}
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
          row.parkingAmount?.toString().includes(value)
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

  const columns = [
    {
      name: "Id",
      sortable: true,
      minWidth: "100px",
      selector: (row, index) => index + 1,
    },

    {
      name: "Event Name",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.eventName,
    },

    {
      name: "Description",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.eventDescription,
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
                const response = await useJwt.DeleteEvent(uid);
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
            {/* <span
              color="danger"
              style={{ cursor: "pointer", color: "red" }}
              // onClick={() => handleDelete(row.uid)}
            > */}
            {/* <Badge color="danger" style={{ cursor: "pointer" }}>
              Sell
            </Badge> */}
            {/* </span> */}
            <Link
              style={{ margin: "0.5rem" }}
              to={`/CreateEvent`}
              state={{ Rowdata: row, uid: row.uid }}
            >
              <span
                color="danger"
                style={{ margin: "1rem", cursor: "pointer", color: "red" }}
               
              >
                <Edit2 className="font-medium-3 text-body" />
              </span>
            </Link>
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
        </CardBody>
      </Card>
    </>
  );
};

export default index;
