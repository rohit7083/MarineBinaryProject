// ** React Imports
import { Fragment, useState, forwardRef } from "react";
import { Link } from "react-router-dom";
// ** Table Data & Columns
import { Tooltip } from "reactstrap";
import { useNavigate } from "react-router-dom";

import { data, columns } from "../product_management/Data";
import addCustomer from "../../../../assets/icons/person-circle-plus.svg";
import importDataicon from "../../../../assets/icons/folder-upload.svg";
import ExportDataicon from "../../../../assets/icons/file-import.svg";
import AddCustomer from "./AddCustomer"
import ExportData from '../customer_management/ExportData'
import ImportData from '../customer_management/ImportData'
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
  const [exportData, setExportdata] = useState(false);
  const [importDataState, setImportData] = useState(false);

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
  const navigate = useNavigate();

  return (
    <Fragment>
      <Card>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
          <CardTitle tag="h4">
            {/* <Button color="primary" outline onClick={() => navigate(-1)} className="d-flex align-items-center">
      <ArrowLeft size={10} className="me-1" /> Previous
    </Button> */}
            Customer List
          </CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <div className="d-flex justify-content-end gap-2">
              <div>
                  <img
                    src={addCustomer}
                    id="ANP"
                    alt="Shopping Bag"
                    width="25"
                    onClick={() => setShow(true)}  
                    style={{cursor:"pointer"}}
                  />
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen.ANP}
                    target="ANP"
                    toggle={() => toggleTooltip("ANP")}
                  >
                    Add Customer
                  </Tooltip>
              </div>
              <div>
                <img
                  id="importProduct"
                  width="25"
                  height="25"
                  src={importDataicon}
                  alt="importProduct"
                  onClick={() => setImportData(true)}
                  style={{ cursor: "pointer" }}
                />

                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.importProduct}
                  target="importProduct"
                  toggle={() => toggleTooltip("importProduct")}
                >
                  Import Data
                </Tooltip>
              </div>

              <div>
                  <img
                    width="25"
                    height="25"
                    id="addProductCate"
                    src={ExportDataicon}
                    alt="sorting-answers"
                    onClick={() => setExportdata(true)}

                    style={{ cursor: "pointer" }}

                  />
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen.addProductCate}
                    target="addProductCate"
                    toggle={() => toggleTooltip("addProductCate")}
                  >
                    Export Data
                  </Tooltip>
              </div>
            </div>
          </div>
        </CardHeader>
        <Row className="justify-content-between mx-0">
          {/* Left Side - Button */}
          <Col md="6" sm="12" className="d-flex align-items-center mt-1"></Col>

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
      <AddCustomer show={show} setShow={setShow} />
      <ExportData show={exportData} setShow={setExportdata} />
      <ImportData show={importDataState} setShow={setImportData} />


    </Fragment>
  );
};

export default DataTableWithButtons;
