import { Spinner } from "reactstrap";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { Fragment, useState, useEffect, memo } from "react";
import { serverSideColumns  } from "../../../dashboard/Ship/SlipList/data";
import { getData } from "../../../dashboard/Ship/SlipList/store";
import { useSelector, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
} from "reactstrap";
import useJwt from '@src/auth/jwt/useJwt'

const DataTableServerSide = () => {


  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#333", // Dark header background
        color: "#fff", // White text
        fontSize: "16px",
        fontWeight: "bold",
      
      },
    },
    headCells: {
      style: {
        color: "#fff", // White text for header cells
      },
    },
    rows: {
      style: {
        backgroundColor: "#f8f9fa", // Light color for default row
      },
      stripedStyle: {
        backgroundColor: "#ffffff", // Slightly different light color for alternating rows
      },
    },
  };
  





  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.dataTables);

  // ** States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);

  const dataToRender = () => {
    const limit = currentPage * rowsPerPage;
    const start = limit - rowsPerPage;
    // console.log({
    //   data: data.slice(start, limit),
    //   default: data,
    //   limit,
    //   start,
    // });
    return store.data
      .filter((item) => {
        const idMatch = item.id.toString().includes(searchValue); // Ensure search matches the id as a string
        const categoryMatch = item.shipTypeName
          .toLowerCase()
          .includes(searchValue.toLowerCase());

        return  categoryMatch || idMatch ;
      })
      .slice(start, limit);
  };

  // ** Function to handle filter
  const handleFilter = (e) => {
    const query = e.target.value;
    setSearchValue(query);
    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        q: query,
      })
    );
  };

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    dispatch(
      getData({
        page: page.selected + 1,
        perPage: rowsPerPage,
        q: searchValue,
      })
    );
    setCurrentPage(page.selected + 1);
  };

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const perPage = parseInt(e.target.value);

    // dispatch(
    //   getData({
    //     page: currentPage,
    //     perPage: parseInt(e.target.value),
    //     q: searchValue,
    //   })
    // );
    // setRowsPerPage(parseInt(e.target.value));
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await useJwt.getslipCatogory(); // Assuming this fetches all categories
        setData(response.data); //
        setLoading(true); // Set loading to true when data fetching starts
        await dispatch(
          getData({
            page: currentPage,
            perPage: rowsPerPage,
            q: searchValue,
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);

      } finally {
        setLoading(false); // Set loading to false when data fetching completes
      }
    };
    fetchData();
  }, [dispatch, currentPage, rowsPerPage, searchValue]);

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(data.length / rowsPerPage);

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
        onPageChange={handlePagination}
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
  
  const [loading, setLoading] = useState(true); // Add loading state

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Slip Category</CardTitle>
          <Link to="/dashboard/SlipCategory">
            <Button.Ripple color="primary">Add Category +</Button.Ripple>
          </Link>
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
                <option value={2}>2</option>
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
        {/* <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            paginationServer
            className='react-dataTable'
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={dataToRender()}
          />
        </div> */}

        {/* Add search and filter controls here */}

        {loading ? (
          <div className="text-center">
            <Spinner className="me-25 " color="primary" />
          </div>
        ) : (
          // <div className="react-dataTable">
          //   <DataTable
          //     noHeader
          //     pagination
          //     paginationServer
          //     className="react-dataTable"
          //     columns={serverSideColumns}
          //     sortIcon={<ChevronDown size={10} />}
          //     paginationComponent={CustomPagination}
          //     data={dataToRender()}
            
          //   />
          // </div>

<div style={{ marginTop: "20px" }}> 

  
<DataTable
  noHeader
  pagination
  paginationServer
  className="react-dataTable"
  columns={serverSideColumns}
  sortIcon={<ChevronDown size={10} />}
  paginationComponent={CustomPagination}
  data={dataToRender()}
  customStyles={customStyles}  // Apply alternating row colors
  striped  // Enables row striping
/>
</div>
        )}
      </Card>
    </Fragment>
  );
};

export default memo(DataTableServerSide);
