// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from "react";
import { Link } from "react-router-dom";
// ** Table Data & Columns
import { Tooltip } from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/react/libs/tables/react-dataTable-component.scss";

import { data, serverSideColumns } from "./Data";
import addProductIcon from "../../../../../assets/icons/shopping-bag-add.svg";
import importIcon from "../../../../../assets/icons/file-import.svg";
import AddCategoryIcon from "../../../../../assets/icons/category-alt.svg";
import addStocks from "../../../../../assets/icons/supplier-alt.svg";
import ManageStocks from "../../../../../assets/icons/workflow-setting.svg";
import addTax from "../../../../../assets/icons/calendar-event-tax.svg";
// ** Add New Modal Component
import AddTax from "./AddTax";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {
  ChevronDown,
  Share,
  Printer,
  FileText,
  File,
  Grid,
  Copy,
  Plus,
  Edit2,
  Trash,
} from "react-feather";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className="form-check">
    <Input type="checkbox" ref={ref} {...props} />
  </div>
));

const MySwal = withReactContent(Swal);

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
  }).then(async function (result) {
    if (result.value) {
      try {
        // Call delete API
        const response = await useJwt.deleteTax(uid);
        if (response.status === 204) {
          setData((prevData) => {
            const newData = prevData.filter((item) => item.uid !== uid);
            return newData;
          });
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

const DataTableWithButtons = () => {
  // const [modal, setModal] = useState(false);
  const [isDataUpdated,setIsDataUpdated]=useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [uid, setUid] = useState(null);
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
    const value = e.target.value;
    let updatedData = [];
    setSearchValue(value);

    const status = {
      1: { title: "Current", color: "light-primary" },
      2: { title: "Professional", color: "light-success" },
      3: { title: "Rejected", color: "light-danger" },
      4: { title: "Resigned", color: "light-warning" },
      5: { title: "Applied", color: "light-info" },
    };

    if (value.length) {
      updatedData = data.filter((item) => {
        const startsWith =
          item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.post.toLowerCase().startsWith(value.toLowerCase()) ||
          item.email.toLowerCase().startsWith(value.toLowerCase()) ||
          item.age.toLowerCase().startsWith(value.toLowerCase()) ||
          item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
          item.start_date.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.status].title
            .toLowerCase()
            .startsWith(value.toLowerCase());

        const includes =
          item.full_name.toLowerCase().includes(value.toLowerCase()) ||
          item.post.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.age.toLowerCase().includes(value.toLowerCase()) ||
          item.salary.toLowerCase().includes(value.toLowerCase()) ||
          item.start_date.toLowerCase().includes(value.toLowerCase()) ||
          status[item.status].title.toLowerCase().includes(value.toLowerCase());

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData(updatedData);
      setSearchValue(value);
    }
  };

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

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


  const handleEdit = (row) => {
    setShow(true);
    setUid(row?.uid);
    console.log("row", row);
    setRow(row);
  };
  const column = [
    ...serverSideColumns,
    {
      name: "Actions",
      sortable: true,
      minWidth: "150px",
      cell: (row) => {
        return (
          <div className="d-flex">
            <span
              style={{ margin: "0.5rem" }}
              onClick={() => handleEdit(row)}
            >
              <Edit2 className="font-medium-3 text-body" />
            </span>

            <Link style={{ margin: "0.5rem" }}>
              {" "}
              <span
                color="danger"
                style={{ cursor: "pointer", color: "red" }}
                onClick={() => handleDelete(row.uid)}
              >
                <Trash className="font-medium-3 text-body" />
              </span>
            </Link>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await useJwt.getAlltax();
        setData(res?.data?.content?.result);
        console.log(res);
      } catch (error) {
        console.log("error in Vendar data ", error);
      }
    })();
}, [isDataUpdated]);
  return (
    <Fragment>
      <Card>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
          <CardTitle tag="h4">Add Product Taxes</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <div className="d-flex justify-content-end gap-2">
              <div>
                <Link to="/dashboard/pos/product_management/addProduct">
                  <img
                    src={addProductIcon}
                    id="ANP"
                    alt="Shopping Bag"
                    width="25"
                  />
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen.ANP}
                    target="ANP"
                    toggle={() => toggleTooltip("ANP")}
                  >
                    Add New Producct
                  </Tooltip>
                </Link>
              </div>
              <div>
                <img
                  id="importProduct"
                  width="25"
                  height="25"
                  src={importIcon}
                  alt="importProduct"
                  onClick={() => setShow(true)}
                  style={{ cursor: "pointer" }}
                />

                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.importProduct}
                  target="importProduct"
                  toggle={() => toggleTooltip("importProduct")}
                >
                  Import Product
                </Tooltip>
              </div>

              <div>
                <Link to="/dashboard/pos/product_management/addproductCategory">
                  <img
                    width="25"
                    height="25"
                    id="addProductCate"
                    src={AddCategoryIcon}
                    alt="sorting-answers"
                  />
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen.addProductCate}
                    target="addProductCate"
                    toggle={() => toggleTooltip("addProductCate")}
                  >
                    Add Product Category
                  </Tooltip>
                </Link>
              </div>
              <div>
                <Link to="/dashboard/pos/product_management/addTaxes">
                  <img
                    width="25"
                    height="25"
                    id="addProducttaxes"
                    src={addTax}
                    alt="addProducttaxes"
                  />
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen.addProducttaxes}
                    target="addProducttaxes"
                    toggle={() => toggleTooltip("addProducttaxes")}
                  >
                    Add Product Taxes
                  </Tooltip>
                </Link>
              </div>
              <div>
                <Link>
                  <img
                    width="25"
                    height="25"
                    id="addStock"
                    src={addStocks}
                    alt="list-is-empty"
                  />
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen.addStock}
                    target="addStock"
                    toggle={() => toggleTooltip("addStock")}
                  >
                    Add Stock
                  </Tooltip>
                </Link>
              </div>

              <div>
                <Link>
                  <img
                    width="25"
                    height="25"
                    id="stockManage"
                    src={ManageStocks}
                    alt="list-is-empty"
                  />
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen.stockManage}
                    target="stockManage"
                    toggle={() => toggleTooltip("stockManage")}
                  >
                    Stock Manage
                  </Tooltip>
                </Link>
              </div>
            </div>
          </div>
        </CardHeader>

        <Row className="justify-content-between mx-0">
          {/* Left Side - Button */}
          <Col md="6" sm="12" className="d-flex align-items-center mt-1">
            <Button
              className="me-2"
              color="primary"
              onClick={() => setShow(true)}
            >
              <Plus size={15} />
              <span className="align-middle ms-50">Add Taxes</span>
            </Button>
          </Col>

          {/* Right Side - Search Bar */}
          <Col
            md="6"
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

        <div className="mt-2 react-dataTable react-dataTable-selectable-rows">
          <DataTable
            noHeader
            pagination
            selectableRows
            columns={column}
            paginationPerPage={8}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            selectableRowsComponent={BootstrapCheckbox}
            // data={searchValue.length ? filteredData : data}
            data={data}
          />
        </div>
      </Card>
      <AddTax show={show} setShow={setShow} uid={uid} setIsDataUpdated={setIsDataUpdated} row={row} />
    </Fragment>
  );
};

export default DataTableWithButtons;
