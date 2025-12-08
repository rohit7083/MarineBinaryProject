// ** React Imports
import { debounce } from "lodash";
import { Fragment, memo, useCallback, useContext, useEffect, useState } from "react";

import { Spinner } from "reactstrap";
// ** Table Columns
import "@styles/react/libs/tables/react-dataTable-component.scss";
// ** Third Party Components
import { AbilityContext } from "@src/utility/context/Can";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit2, Trash } from "react-feather";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AddRoles from "../user_rolls/roles-permissions/roles/AddRoles";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
} from "reactstrap";
// ** Jwt Class
import useJwt from "@src/auth/jwt/useJwt";

// ** Component
import RoleCards from "../user_rolls/roles-permissions/roles/RoleCards";
const defaultRowDetails = {
  show: false,
  row: {},
  modalType: "Add",
};
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
  const [rowDetails, setRowDetails] = useState({ ...defaultRowDetails });
  const ability = useContext(AbilityContext);

  const handleEditClick = (row = {}) => {
    const { show } = rowDetails;
    const hasRowData = Object.keys(row).length > 0;

    setRowDetails({
      show: !show,
      modalType: hasRowData ? "Edit" : "Add",
      row: hasRowData ? { ...row } : {},
    });
  };

  // ** Get data on mount
  const MySwal = withReactContent(Swal);

  async function fetchTableData() {
    setLoading(true);
    try {
      const { data } = await useJwt.userpermission();
      const { content } = data;
      setTableData({ count: content.count, results: content.result });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleFilter = (value) => {
    setSearchTerm(value);
    if (value) {
      const filteredResults = tableData?.results.filter((row) =>
        row?.roleName?.toLowerCase().includes(value.toLowerCase())
      );

      setTableData((prev) => ({
        ...prev,
        results: filteredResults,
      }));
    } else {
      fetchTableData((currentPage - 1) * rowsPerPage, rowsPerPage);
    }
  };

  const debouncedFilter = useCallback(debounce(handleFilter, 300), []);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    const newLimit = parseInt(e.target.value);
    setRowsPerPage(newLimit);
    setCurrentPage(1);
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
          // {{ }}
          // Call delete API
          const response = await useJwt.deleteRole(uid);

          if (response.status === 204) {
            const newData = tableData.results.filter(
              (item) => item.uid !== uid
            );

            setTableData((prevData) => ({
              ...prevData,
              results: newData,
            }));

            MySwal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Your Role has been deleted.",
              customClass: {
                confirmButton: "btn btn-success",
              },
            });
          }
        } catch (error) {
          console.error("Error deleting item:", error);
          MySwal.fire({
            icon: "error",
            title: "Can not Delete!",
            text: `${error.response?.data?.content || "Something went wrong."}`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        }
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        // Show cancellation message
        MySwal.fire({
          title: "Cancelled",
          text: "Your Role is safe :)",
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
      selector: (row, index) => index + 1,
    },
    {
      name: "Role Name",
      sortable: true,
      minWidth: "250px",
      selector: (row) => row.roleName,
    },
    {
      name: "Actions",
      minWidth: "150px",
      cell: (row) => (
        <>
          {ability.can("update", "user management") ? (
            <span
              color="danger"
              style={{ margin: "1rem", cursor: "pointer", color: "red" }}
              // onClick={() => {
              //   setDataUid(row.uid);
              //   setDatarow(row);
              //   setShowModal((x) => !x);
              // }}
              onClick={() => handleEditClick(row)}
            >
              <Edit2 className="font-medium-3 text-body" />
            </span>
          ) : null}
          {ability.can("delete", "user management") ? (
            <span
              color="danger"
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDelete(row.uid)}
            >
              <Trash className="font-medium-3 text-body" />
            </span>
          ) : null}
        </>
      ),
    },
  ];

  const CustomPagination = () => {
    // const count = Math.ceil(tableData.count / rowsPerPage);
    const count = Math.ceil(tableData.results.length / rowsPerPage);

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

  const dataToRender = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tableData.results.slice(startIndex, endIndex);

    // return tableData?.results;
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
              name="search"
              placeholder="Search..."
              type="text"
              bsSize="sm"
              id="search-input"
              onChange={(e) => debouncedFilter(e.target.value)}
            />
          </Col>
        </Row>
        {loading ? (
          <div
            style={{
              minHeight: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner
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
      <AddRoles
        {...rowDetails}
        // show={show}
        toggle={() => handleEditClick()}
        // uid={""}
        // modalType={"Add"}
      />
    </Fragment>
  );
};

export default memo(DataTableServerSide);
