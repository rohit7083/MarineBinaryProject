import React from "react";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Spinner } from "reactstrap";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { Fragment, useState, useEffect, memo } from "react";
import { serverSideColumns } from "../../../dashboard//Ship/SlipDetailList/data";
import { getData } from "../../../dashboard/Ship/SlipDetailList/store";
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
import useJwt from "@src/auth/jwt/useJwt";

const DataTableServerSide = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.dataTables);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // const dataToRender = () => {
  //   const limit = currentPage * rowsPerPage;
  //   const start = limit - rowsPerPage;
  //   console.log({
  //     data: data.slice(start, limit),
  //     default: data,
  //     limit,
  //     start,
  //   });
  //   return store.data
  //     .filter((item) => {
  //       const slipNameMatch = item.slipName.toLowerCase().includes(searchValue.toLowerCase());
  //       const idMatch = item.id.toString().includes(searchValue); // Ensure search matches the id as a string
  //       const categoryMatch = item.category.shipTypeName.toLowerCase().includes(searchValue.toLowerCase());

  //       return slipNameMatch || idMatch || categoryMatch;
  //     })
  //     .slice(start, limit);
  // };


  const dataToRender = () => {
    const limit = currentPage * rowsPerPage;
    const start = limit - rowsPerPage;

    // console.log({
    //     data: data.slice(start, limit),
    //     default: data,
    //     limit,
    //     start,
    // });

    return store.data
        .filter((item) => {
            const slipNameMatch = item.slipName?.toLowerCase().includes(searchValue.toLowerCase()) || false;
            const idMatch = item.id?.toString().includes(searchValue) || false;
            // const categoryMatch = item.category.shipTypeName.toLowerCase().includes(searchValue.toLowerCase()) || false;
            const categoryMatch = 
            item.category?.shipTypeName?.toLowerCase().includes(searchValue.toLowerCase()) || false;
          
            return slipNameMatch || idMatch || categoryMatch;
        })
        .slice(start, limit);
};

  const handlePagination = (page) => {
    dispatch(
            getData({
              page: page.selected + 1,
              perPage: rowsPerPage,
              q: searchValue,
            })
          );
    console.log(page);

    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    const perPage = parseInt(e.target.value);
  };

  const CustomPagination = () => {
    const count = Math.ceil(data.length / rowsPerPage);
    // console.log({count})
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
  const handleFilter = (e) => {
    const query = e.target.value;
    setSearchValue(query);

    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        q: query, // Send the search query to the API (which should handle filtering)
      })
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await useJwt.getslip();
        console.log(data);
        const { result } = data.content;
        setData(result);
        setLoading(true); // Set loading to true when data fetching starts
        await dispatch(
                    getData({
                      page: currentPage,
                      perPage: rowsPerPage,
                      q: searchValue, // Apply search query
                    })
                  );
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false); // Set loading to false when data fetching completes
      }
    })();
  }, [dispatch, currentPage, rowsPerPage, searchValue]);

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Slip Details</CardTitle>
          <Link to="/dashboard/slip-details">
            <Button.Ripple color="primary">Add Slip Details +</Button.Ripple>
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
            <Spinner className="me-25 " color="primary" />
          </div>
        ) : (
        <div className="react-dataTable">
          <DataTable
            noHeader
            pagination
            paginationServer
            className="react-dataTable"
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={dataToRender()} // Render the filtered data
          />
        </div>
                )}

      </Card>
    </Fragment>
  );
};

export default memo(DataTableServerSide);

// import { Spinner } from "reactstrap";
// import { Button } from "reactstrap";
// import { Link } from "react-router-dom";
// import { Fragment, useState, useEffect, memo } from "react";
// import { serverSideColumns } from "../../../dashboard//Ship/SlipDetailList/data";
// import { getData } from "../../../dashboard/Ship/SlipDetailList/store";
// import { useSelector, useDispatch } from "react-redux";
// import ReactPaginate from "react-paginate";
// import { ChevronDown } from "react-feather";
// import DataTable from "react-data-table-component";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   Input,
//   Label,
//   Row,
//   Col,
// } from "reactstrap";
// import useJwt from '@src/auth/jwt/useJwt'

// const DataTableServerSide = () => {
//   // ** Store Vars
//   const dispatch = useDispatch();
//   const store = useSelector((state) => state.dataTables);

//   // ** States
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(7);
//   const [searchValue, setSearchValue] = useState("");
//   const [tableData, setTableData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ** Function to handle filter (search by slipName and id)
// const handleFilter = (e) => {
//   const query = e.target.value;
//   setSearchValue(query);

//   dispatch(
//     getData({
//       page: currentPage,
//       perPage: rowsPerPage,
//       q: query, // Send the search query to the API (which should handle filtering)
//     })
//   );
// };

//   // ** Function to handle Pagination and get data
//   const handlePagination = (page) => {
//     dispatch(
//       getData({
//         page: page.selected + 1,
//         perPage: rowsPerPage,
//         q: searchValue,
//       })
//     );
//     setCurrentPage(page.selected + 1);
//   };

//   // ** Function to handle per page
//   const handlePerPage = (e) => {
//     const perPage = parseInt(e.target.value);
//     setRowsPerPage(perPage);
//     dispatch(
//       getData({
//         page: currentPage,
//         perPage,
//         q: searchValue,
//       })
//     );
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await useJwt.getslip(); // Assuming this fetches all categories
//         setData(response.data); //
//         setLoading(true); // Set loading to true when data fetching starts
//         await dispatch(
//           getData({
//             page: currentPage,
//             perPage: rowsPerPage,
//             q: searchValue, // Apply search query
//           })
//         );
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
// setLoading(false); // Set loading to false when data fetching completes
//       }
//     };
//     fetchData();
//   }, [dispatch, currentPage, rowsPerPage, searchValue]);

//   // ** Custom Pagination
//   const CustomPagination = () => {
//     const count = Math.ceil(store.total / rowsPerPage);

//     return (
//       <ReactPaginate
//         previousLabel={""}
//         nextLabel={""}
//         breakLabel="..."
//         pageCount={Math.ceil(count) || 1}
//         marginPagesDisplayed={2}
//         pageRangeDisplayed={2}
//         activeClassName="active"
//         forcePage={currentPage !== 0 ? currentPage - 1 : 0}
//         onPageChange={handlePagination}
//         pageClassName="page-item"
//         breakClassName="page-item"
//         nextLinkClassName="page-link"
//         pageLinkClassName="page-link"
//         breakLinkClassName="page-link"
//         previousLinkClassName="page-link"
//         nextClassName="page-item next-item"
//         previousClassName="page-item prev-item"
//         containerClassName={
//           "pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
//         }
//       />
//     );
//   };

//   // ** Table data to render (filter by slipName and id)
//   const dataToRender = () => {
//     // Filter the data based on searchValue, applying to both `slipName` and `id`
//     return store.data.filter((item) => {
//       const slipNameMatch = item.slipName.toLowerCase().includes(searchValue.toLowerCase());
//       const idMatch = item.id.toString().includes(searchValue); // Ensure search matches the id as a string
//       const categoryMatch = item.category.shipTypeName.toLowerCase().includes(searchValue.toLowerCase());

//       return slipNameMatch || idMatch || categoryMatch;
//     });

//     // console.log({data:data.slice(start, limit),default:data,limit,start})
//     return data.slice(start, limit);
//   };

//   return (
//     <Fragment>
//       <Card>
//         <CardHeader className="border-bottom">
//           <CardTitle tag="h4">Slip Details</CardTitle>
//           <Link to="/dashboard/SlipDetails">
//             <Button.Ripple color="success">Add Slip Details +</Button.Ripple>
//           </Link>
//         </CardHeader>
//         <Row className="mx-0 mt-1 mb-50">
//           <Col sm="6">
//             <div className="d-flex align-items-center">
//               <Label for="sort-select">show</Label>
//               <Input
//                 className="dataTable-select"
//                 type="select"
//                 id="sort-select"
//                 value={rowsPerPage}
//                 onChange={handlePerPage}
//               >
//                 <option value={2}>2</option>
//                 <option value={7}>7</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//                 <option value={75}>75</option>
//                 <option value={100}>100</option>
//               </Input>
//               <Label for="sort-select">entries</Label>
//             </div>
//           </Col>
//           <Col
//             className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
//             sm="6"
//           >
//             <Label className="me-1" for="search-input">
//               Search
//             </Label>
//             <Input
//               className="dataTable-filter"
//               type="text"
//               bsSize="sm"
//               id="search-input"
//               value={searchValue}
//               onChange={handleFilter}
//             />
//           </Col>
//         </Row>

//         {loading ? (
//           <div className="text-center">
//             <Spinner className="me-25" color="primary" />
//           </div>
//         ) : (
//           <div className="react-dataTable">
//             <DataTable
//               noHeader
//               pagination
//               paginationServer
//               className="react-dataTable"
//               columns={serverSideColumns}
//               sortIcon={<ChevronDown size={10} />}
//               paginationComponent={CustomPagination}
//               data={dataToRender()} // Render the filtered data
//             />
//           </div>
//         )}
//   </Card>
// </Fragment>
//   );
// };

// export default memo(DataTableServerSide);
