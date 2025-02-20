import React from "react";

import { Spinner } from "reactstrap";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { Fragment, useState, useEffect, memo } from "react";
import { serverSideColumns } from "../../../dashboard/Ship/SlipMemberList/data";
import { getData } from "../../../dashboard/Ship/SlipMemberList/store";
import { useSelector, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import "@styles/react/libs/tables/react-dataTable-component.scss";
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

  
  const dataToRender = () => {
    const limit = currentPage * rowsPerPage;
    const start = limit - rowsPerPage;

    return store.data
      .filter((item) => {
        if (item.vessel === null) {
         
          return false;
        }
        const slipNameMatch =
          item.slipName?.toLowerCase().includes(searchValue.toLowerCase()) ||
          false;
        const idMatch = item.id?.toString().includes(searchValue) || false;
        const categoryMatch =
          item.category?.shipTypeName
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) || false;

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
        q: query,
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
        setLoading(true);
        await dispatch(
          getData({
            page: currentPage,
            perPage: rowsPerPage,
            q: searchValue,
          })
        );
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, currentPage, rowsPerPage, searchValue]);

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Slip Members </CardTitle>
          <Link to="/dashboard/SlipMemberForm">
            <Button.Ripple color="primary">Add Vessels +</Button.Ripple>
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
          <div className="react-dataTable" style={{ marginTop: "2rem" }}>
            <DataTable
              noHeader
              pagination
              paginationServer
              className="react-dataTable"
              columns={serverSideColumns}
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              data={dataToRender()}
              striped
            />
          </div>
        )}
      </Card>
    </Fragment>
  );
};

export default memo(DataTableServerSide);
