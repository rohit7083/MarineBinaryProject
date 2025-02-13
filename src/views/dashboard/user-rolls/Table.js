// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
import { debounce } from "lodash";
import { Spinner } from "reactstrap";
// ** Table Columns
import "@styles/react/libs/tables/react-dataTable-component.scss";
// ** Third Party Components
import ReactPaginate from "react-paginate";
import { ChevronDown, Edit2, Trash } from "react-feather";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
// ** Jwt Class
import useJwt from "@src/auth/jwt/useJwt";

// ** Component
import RoleCards from "../user_rolls/roles-permissions/roles/RoleCards";
import Role_modal from "../user_rolls/roles-permissions/roles/Role_modal";

const DataTableServerSide = () => {
  // ** States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [RowData, setRowData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dataUid, setDataUid] = useState(null);
  const [datarow, setDatarow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState({
    count: 0,
    results: [],
  });

  // ** Get data on mount
  const MySwal = withReactContent(Swal);

  async function fetchTableData(offset = 0, limit = 10) {
    try {
      const { data } = await useJwt.userpermission(
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
  // ** Function to handle filter

  // const handleFilter = (value) => {
  //   setSearchTerm(value);
  //   if (value) {
  //     const filteredData = data.results.filter((row) =>
  //       row.roleName.toLowerCase().includes(value.toLowerCase())
  //     );
  //     setTableData(filteredData);
  //   } else {
  //     setTableData(data.results);
  //   }
  //   setCurrentPage(1);
  // };

  const debouncedFilter = debounce((value) => handleFilter(value), 300);

  const handleFilter = (value) => {
    setSearchTerm(value);

    if (value) {
      const filteredResults = tableData.results.filter((row) =>
        row.roleName.toLowerCase().includes(value.toLowerCase())
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

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
    fetchTableData(page.selected * 10, 10);
  };

  // ** Function to handle per page
  const handlePerPage = (e) => {
    // dispatch(
    //   getData({
    //     page: currentPage,
    //     perPage: parseInt(e.target.value),
    //     q: searchValue
    //   })
    // )
    // setRowsPerPage(parseInt(e.target.value))
  };

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
          const response = await useJwt.deleteRole(uid);
          if (response.status === 204) {
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

  const columns = [
    {
      name: "Id",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.id,
    },
    {
      name: "Role Name",
      sortable: true,
      minWidth: "250px",
      selector: (row) => row.roleName,
    },
    {
      name: "Actions",
      minWidth: "400px",
      cell: (row) => (
        <>
          <span
            color="danger"
            style={{ margin: "1rem", cursor: "pointer", color: "red" }}
            onClick={() => {
              setDataUid(row.uid);
              setDatarow(row);
              setShowModal((x) => !x);
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
      ),
    },
  ];

  // ** Custom Pagination
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
    return tableData.results;
    // const filters = {
    //   q: searchValue
    // }

    // const isFiltered = Object.keys(filters).some(function (k) {
    //   return filters[k].length > 0
    // })

    // if (store.data.length > 0) {
    //   return store.data
    // } else if (store.data.length === 0 && isFiltered) {
    //   return []
    // } else {
    //   return store.allData.slice(0, rowsPerPage)
    // }
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Roles Details</CardTitle>
          <RoleCards />
        </CardHeader>
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6">
            <div className="d-flex align-items-center">
              <Label for="sort-select">show</Label>
              <Input
                className="dataTable-select"
                type="select"
                id="sort-select"
                value={rowsPerPage}
                onChange={handlePerPage}
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              <Label for="sort-select">entries</Label>
            </div>
          </Col>

          <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="6"
          >
            <Label className="me-1" for="search-input">
              Search
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleFilter}
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
          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              paginationServer
              className="react-dataTable"
              columns={columns}
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              data={dataToRender()}
            />
          </div>
        )}
      </Card>
      <Role_modal show={showModal} uid={dataUid} row={datarow} />
    </Fragment>
  );
};

export default memo(DataTableServerSide);
