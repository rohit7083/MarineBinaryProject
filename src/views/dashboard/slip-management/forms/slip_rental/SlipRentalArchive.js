// ** React Imports
import { useState } from "react";

// ** Table Columns and Data
import { data, reOrderColumns } from "./Data";
import { Controller } from "react-hook-form";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import { ChevronDown, Search } from "react-feather";
import DataTable from "react-data-table-component";
import { useForm } from "react-hook-form";
import Select from "react-select";
// ** Reactstrap Imports
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Input,
  Label,
} from "reactstrap";

const DataTablesReOrder = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({});
  // ** States
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // ** Function to handle filter
  const handleFilter = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.length) {
      const updatedData = data.filter((item) => {
        const searchStr = value.toLowerCase();
        return (
          item.full_name.toLowerCase().includes(searchStr) ||
          item.post.toLowerCase().includes(searchStr) ||
          item.email.toLowerCase().includes(searchStr) ||
          item.age.toLowerCase().includes(searchStr) ||
          item.salary.toLowerCase().includes(searchStr) ||
          item.start_date.toLowerCase().includes(searchStr)
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

  // ** Custom Pagination Component
  const CustomPagination = () => (
    <ReactPaginate
      nextLabel=">"
      previousLabel="<"
      breakLabel="..."
      pageRangeDisplayed={2}
      forcePage={currentPage}
      pageCount={Math.ceil(filteredData.length / 7) || 1}
      onPageChange={handlePagination}
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextClassName="page-item next-item"
      previousClassName="page-item prev-item"
    />
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <CardTitle tag="h4">Slip Rental Archive</CardTitle>

        <div className="d-flex align-items-center gap-2">
          {/* <div className="d-flex align-items-center">
            <Label className="me-1 mb-0" htmlFor="search-input">
              Search
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleFilter}
              placeholder="Search..."
              style={{ minWidth: "250px" }} // Adjust width as needed
            />
          </div> */}
          {/* <Button color="relief-primary">Send Rental Invoice</Button> */}
          <Button color="relief-primary">Take Slip Payment</Button>
        </div>
      </CardHeader>

      <Row className="container mb-3 mt-2">
        <Col md="12">
          <div className="p-1 border rounded shadow-sm">
            <Row>
              <Col md="6" className="mb-3">
                <Label className="form-label" for="card-expiry-year">
                  From Month
                </Label>
                <Controller
                  name="cardExpiryYear"
                  control={control}
                  rules={{
                    required: "Expiry Year is required",
                    message: "Expiry Year cannot be in the past",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Year"
                      className={`react-select ${
                        errors.cardExpiryYear ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      isClearable
                    />
                  )}
                />
              </Col>

              <Col md="6" className="mb-3">
                <Label className="form-label" for="card-expiry-month">
                  From Year
                </Label>
                <Controller
                  name="cardExpiryMonth"
                  control={control}
                  rules={{
                    required: "Expiry Month is required",
                    min: 1,
                    max: 12,
                    message: "Expiry Month must be between 1 and 12",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Month"
                      className={`react-select ${
                        errors.cardExpiryMonth ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      isClearable
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                    />
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mb-3">
                <Label className="form-label" for="card-expiry-year">
                  To Month
                </Label>
                <Controller
                  name="cardExpiryYear"
                  control={control}
                  rules={{
                    required: "Expiry Year is required",
                    message: "Expiry Year cannot be in the past",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Year"
                      className={`react-select ${
                        errors.cardExpiryYear ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      isClearable
                    />
                  )}
                />
              </Col>

              <Col md="6" className="mb-3">
                <Label className="form-label" for="card-expiry-month">
                  To Year{" "}
                </Label>
                <Controller
                  name="cardExpiryMonth"
                  control={control}
                  rules={{
                    required: "Expiry Month is required",
                    min: 1,
                    max: 12,
                    message: "Expiry Month must be between 1 and 12",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Month"
                      className={`react-select ${
                        errors.cardExpiryMonth ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      isClearable
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                    />
                  )}
                />
              </Col>
            </Row>

            <Row className="mt-1">
              <Col md="12" className="text-end">
                <Button color="relief-primary">
                  <Search className="me-1" size={20} />
                  Search
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <div className="react-dataTable">
        <DataTable
          noHeader
          columns={reOrderColumns}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
          pagination
          paginationComponent={CustomPagination}
          paginationDefaultPage={currentPage + 1}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          data={filteredData}
        />
      </div>
    </Card>
  );
};

export default DataTablesReOrder;
