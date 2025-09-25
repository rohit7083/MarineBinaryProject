import { forwardRef, Fragment, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { Link, useNavigate } from "react-router-dom";

import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import NavItems from "../product_management/NavItems";

import { serverSideColumns } from "./Data";

import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className="form-check">
    <Input type="checkbox" ref={ref} {...props} />
  </div>
));

const DataTableWithButtons = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);

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
  const [loading, setLoading] = useState(true);

  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

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

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await useJwt.getAllVendor();
        setData(res.data.content.result);
      } catch (error) {
        console.log("error in Vendar data ", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Fragment>
      <Card>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
          <CardTitle tag="h4">
            {" "}
            <ArrowLeft
              style={{
                cursor: "pointer",
                marginRight: "10px",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
              onClick={() => window.history.back()}
            />
            Vendor List
          </CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <div className="d-flex justify-content-end gap-2">
              <div>
                <Link to="/pos/VendorManage/addVendor">
                  <Button size="sm" color="primary">
                    {/* <PlusCircle size={13}/> */}
                    Add Vendor
                  </Button>
                </Link>
              </div>
              <div>
                <Link to="/pos/vendor_typeList">
                  <Button size="sm" color="primary">
                    Vendor Types
                  </Button>
                </Link>
              </div>
              <div>
                <NavItems />
              </div>
            </div>
          </div>
        </CardHeader>
        <Row className="justify-content-between mx-0">
          <Col md="6" sm="12" className="d-flex align-items-center mt-1"></Col>
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
              // onChange={handleFilter}
            />
          </Col>
        </Row>
        {loading ? (
          <div className="text-center">
            <Spinner
              className="me-25 spinner-border"
              color="primary"
              style={{ width: "4rem", height: "4rem" }}
            />
          </div>
        ) : (
          <div className="react-dataTable react-dataTable-selectable-rows">
            <DataTable
              noHeader
              pagination
              // selectableRows
              columns={serverSideColumns}
              paginationPerPage={7}
              className="react-dataTable"
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              paginationDefaultPage={currentPage + 1}
              selectableRowsComponent={BootstrapCheckbox}
              data={data}
            />
          </div>
        )}
      </Card>
    </Fragment>
  );
};

export default DataTableWithButtons;
