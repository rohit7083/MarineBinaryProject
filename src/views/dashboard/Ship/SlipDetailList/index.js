// import React from "react";
// import "@styles/react/libs/tables/react-dataTable-component.scss";
// import { Spinner } from "reactstrap";
// import { Button } from "reactstrap";
// import { Link } from "react-router-dom";
// import { Fragment, useState, useEffect, memo } from "react";
// import { serverSideColumns } from "../../../dashboard//Ship/SlipDetailList/data";
// import { getData } from "../../../dashboard/Ship/SlipDetailList/store";
// import { useSelector, useDispatch } from "react-redux";
// import ReactPaginate from "react-paginate";
// import { ChevronDown, Plus } from "react-feather";
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
// import useJwt from "@src/auth/jwt/useJwt";

// const DataTableServerSide = () => {
//   const dispatch = useDispatch();
//   const store = useSelector((state) => state.dataTables);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchValue, setSearchValue] = useState("");
//   const [tableData, setTableData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

 

//   const dataToRender = () => {
//     const limit = currentPage * rowsPerPage;
//     const start = limit - rowsPerPage;

//       return store.data
//       .filter((item) => {
//         const slipNameMatch =
//           item.slipName?.toLowerCase().includes(searchValue.toLowerCase()) ||
//           false;
//         const idMatch = item.id?.toString().includes(searchValue) || false;
//         // const categoryMatch = item.category.shipTypeName.toLowerCase().includes(searchValue.toLowerCase()) || false;
//         const categoryMatch =
//           item.category?.shipTypeName
//             ?.toLowerCase()
//             .includes(searchValue.toLowerCase()) || false;

//         return slipNameMatch || idMatch || categoryMatch;
//       })
//       .slice(start, limit);
//   };

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

//   const handlePerPage = (e) => {
//     // const perPage = parseInt(e.target.value);
//     const perPage = parseInt(e.target.value);
//     setRowsPerPage(perPage); // Update state
//     setCurrentPage(1); // Reset to first page
//     dispatch(
//       getData({
//         page: 1,
//         perPage: perPage,
//         q: searchValue
//       })
//     );
//   }
//   ;

//   const CustomPagination = () => {
//     // {{debugger}}
//     const count = Math.ceil(data.length / rowsPerPage);
//     // console.log({count})
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
//   const handleFilter = (e) => {
//     const query = e.target.value;
//     setSearchValue(query);

//     dispatch(
//       getData({
//         page: currentPage,
//         perPage: rowsPerPage,
//         q: query,
//       })
//     );
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await useJwt.getslip();
//         console.log("getslip",data);
//         const { result } = data.content;
//         setData(result);
//         setLoading(true);
//         await dispatch(
//           getData({
//             page: currentPage,
//             perPage: rowsPerPage,
//             q: searchValue, 
//           })
//         );
//       } catch (e) {
//         console.log(e);
//       } finally {
//         setLoading(false); // Set loading to false when data fetching completes
//       }
//     })();
//   }, [dispatch]);

//   return (
//     <Fragment>
//       <Card>
//         <CardHeader className="border-bottom">
//           <CardTitle tag="h4">Slip Details</CardTitle>
//           <Link to="/dashboard/slip-details">
//             <Button.Ripple color="primary">
//               <Plus size={14} /> Add Slip Details</Button.Ripple>
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
//                 {[7,10,25,50,75,100].map((num)=>(
//                   <option key={num} value={num}>
//                     {num}
//                   </option>
//                 ))}
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
//           <div
//             className="text-center "
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               marginTop: "4rem",
//             }}
//           >
//             <Spinner
//               className="me-25 "
//               style={{
//                 height: "5rem",
//                 width: "5rem",
//               }}
//               color="primary"
//             />
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
//       </Card>
//     </Fragment>
//   );
// };

// export default memo(DataTableServerSide);





import React, { Fragment, useState, useEffect, memo } from "react";
import {
  
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
  Spinner,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ChevronDown, Plus } from "react-feather";
import DataTable from "react-data-table-component";
import useJwt from "@src/auth/jwt/useJwt";
import { serverSideColumns } from "../../../dashboard/Ship/SlipDetailList/data";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const DataTableServerSide = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await useJwt.getslip();
        console.log("API Response:", data); // Log here
  
        const result = data?.content?.result || []; // Adjust depending on structure
        console.log("Parsed Result:", result); // Log here
  
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error("API Error:", error);
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  // Filter handler
  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    const filtered = data.filter((item) => {
      const slipMatch = item.slipName?.toLowerCase().includes(value);
      const idMatch = item.id?.toString().includes(value);
      const catMatch = item.category?.shipTypeName?.toLowerCase().includes(value);
      return slipMatch || idMatch || catMatch;
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination handlers
  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const CustomPagination = () => {
    const filtered = filteredData.filter((item) => item); // again filter here

    const pageCount = Math.ceil(filtered.length / rowsPerPage);

    return (
      <ReactPaginate
        previousLabel=""
        nextLabel=""
        breakLabel="..."
        pageCount={pageCount || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handlePagination}
        forcePage={currentPage - 1}
        containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
        activeClassName="active"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item prev-item"
        nextClassName="page-item next-item"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
      />
    );
  };

  // Paginate filtered data
  const paginatedData = () => {
    const filtered = filteredData.filter((item) => item); // filter here

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Slip Details</CardTitle>
          <Link to="/dashboard/slip-details">
            <Button.Ripple color="primary">
                         <Plus size={14} /> Add Slip Details</Button.Ripple>

          </Link>
        </CardHeader>

        {/* Filter and Pagination Controls */}
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6">
            <div className="d-flex align-items-center">
              <Label for="sort-select">Show</Label>
              <Input
                className="dataTable-select"
                type="select"
                id="sort-select"
                value={rowsPerPage}
                onChange={handlePerPage}
              >
                {[7, 10, 25, 50, 75, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Input>
              <Label className="ms-1">entries</Label>
            </div>
          </Col>
          <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1" sm="6">
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
          <div
            className="text-center"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "4rem" }}
          >
            <Spinner style={{ height: "5rem", width: "5rem" }} color="primary" />
          </div>
        ) : (
          <div className="react-dataTable" style={{ marginTop: "2rem" }}>
            <DataTable
              noHeader
              pagination
              paginationServer
              className="react-dataTable"
              columns={serverSideColumns(currentPage, rowsPerPage)}
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              data={paginatedData()}
              striped
            />
          </div>
        )}
      </Card>
    </Fragment>
  );
};

export default memo(DataTableServerSide);

