// ** React Imports
import { Fragment, useState, forwardRef } from "react";
import { Link } from "react-router-dom";
// ** Table Data & Columns
import { Tooltip } from "reactstrap";

import { data, columns } from "../Data";
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

const DataTableWithButtons = () => {
  // ** States
  // const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);

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

  // ** Function to handle Modal toggle
  // const handleModal = () => setModal(!modal);

  // ** Function to handle filter
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

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

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

        <div className="react-dataTable react-dataTable-selectable-rows">
          <DataTable
            noHeader
            pagination
            selectableRows
            columns={columns}
            paginationPerPage={7}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            selectableRowsComponent={BootstrapCheckbox}
            data={searchValue.length ? filteredData : data}
          />
        </div>
      </Card>
      <AddTax show={show} setShow={setShow} />
    </Fragment>
  );
};

export default DataTableWithButtons;
