// ** React Imports
import { Fragment, useEffect, useState } from "react";
// ** Table Data & Columns
import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { serverSideColumns } from "./Data";
// ** Add New Modal Component
import AddTax from "./AddTax";

// ** Third Party Components
import DataTable from "react-data-table-component";
import {
  ArrowLeft,
  ChevronDown,
  Edit,
  MoreVertical,
  Plus,
  Trash,
} from "react-feather";
import ReactPaginate from "react-paginate";

// ** Reactstrap Imports
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Row,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import NavItems from "../NavItems";

const MySwal = withReactContent(Swal);

const DataTableWithButtons = () => {
  // const [modal, setModal] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState({
    ANP: false,
    importProduct: false,
    addProductCate: false,
    addProducttaxes: false,
    addStock: false,
    stockManage: false,
  });
  const toggleTooltip = (tooltip) => {
    setTooltipOpen((prevState) => ({
      ...prevState,
      [tooltip]: !prevState[tooltip],
    }));
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [row, setRow] = useState(null);

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    if (value.length) {
      const updatedData = data.filter((item) => {
        // Adjust based on your API response structure
        return (
          item?.taxName?.toLowerCase().includes(value) ||
          String(item?.taxType)?.toLowerCase().includes(value) ||
          String(item?.taxValue)?.toLowerCase().includes(value)
        );
      });
      setFilteredData(updatedData);
    } else {
      setFilteredData(data);
    }
  };

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  const tableData = async () => {
    try {
      //
      setLoading(true);
      const res = await useJwt.getAlltax();
      setData(res?.data?.content?.result);
      console.log(res);
    } catch (error) {
      console.log("error in Vendar data ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tableData();
  }, []);

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=""
      nextLabel=""
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={
        searchValue.length
          ? Math.ceil(filteredData.length / 7)
          : Math.ceil(data.length / 7) || 1
      }
      breakLabel="..."
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextClassName="page-item next-item"
      previousClassName="page-item prev-item"
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
    />
  );

  const handleDelete = async (uid) => {
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
    }).then(async (result) => {
      if (result.value) {
        try {
          const response = await useJwt.deleteTax(uid);
          if (response?.status === 204) {
            await tableData();
            MySwal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Your Record has been deleted.",
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

  /**
   *
   * @param {
   *
   */

  const handleEdit = (row) => {
    setShow(true);
    setUid(row?.uid);

    setRow(row);
  };
  const column = [
    ...serverSideColumns,
    {
      name: "Actions",
      sortable: true,
      // minWidth: "150px",
      cell: (row) => {
        return (
          // <div className="d-flex">
          //   <span style={{ margin: "0.5rem" }} onClick={() => handleEdit(row)}>
          //     <Edit2 className="font-medium-3 text-body" />
          //   </span>

          //   <span
          //     color="danger"
          //     style={{ cursor: "pointer", color: "red" }}
          //     onClick={() => handleDelete(row.uid)}
          //   >
          //     <Trash className="font-medium-3 text-body" />
          //   </span>
          // </div>
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
              <DropdownItem onClick={() => handleDelete(row.uid)}>
                <Trash className="me-50" size={15} />
                <span className="align-middle">Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center border-bottom flex-wrap">
          {/* Left side */}
          <CardTitle tag="h4" className="d-flex align-items-center gap-2 mb-0">
            <ArrowLeft
              style={{
                cursor: "pointer",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
              onClick={() => window.history.back()}
            />
            Add Product Taxes
          </CardTitle>

          {/* Right side */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
            <Button
              color="primary"
              size="sm"
              onClick={() => setShow(true)}
              className="d-flex align-items-center gap-1"
            >
              <Plus size={15} />
              <span>Add Taxes</span>
            </Button>

            <NavItems />
          </div>
        </CardHeader>

        <Row className="justify-content-between mx-0">
          {/* Left Side - Button */}

          {/* Right Side - Search Bar */}
          <Col
            md="12"
            sm="12"
            className="d-flex align-items-center justify-content-end mt-1"
          >
            <Label className="me-1" htmlFor="search-input">
              Search
            </Label>
            <Input
              className="dataTable-filter mb-50 w-25"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>
        {loading ? (
          <>
            <div className="text-center">
              <Spinner
                className="me-25 spinner-border"
                color="primary"
                style={{ width: "4rem", height: "4rem" }}
              />
            </div>
          </>
        ) : (
          <div className="mt-2 react-dataTable react-dataTable-selectable-rows">
            <DataTable
              noHeader
              pagination
              columns={column}
              paginationPerPage={8}
              className="react-dataTable"
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              paginationDefaultPage={currentPage + 1}
              // selectableRowsComponent={BootstrapCheckbox}
              data={searchValue.length ? filteredData : data}
              // data={data}
            />
          </div>
        )}
      </Card>
      <AddTax
        show={show}
        setShow={setShow}
        uid={uid}
        resetTable={tableData}
        row={row}
      />
    </Fragment>
  );
};

export default DataTableWithButtons;
