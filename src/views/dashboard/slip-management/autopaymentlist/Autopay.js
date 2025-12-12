import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import { debounce } from "lodash";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
import { Badge } from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const index = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  
  const [tableData, setTableData] = useState({
    count: 0,
    results: [],
  });

  const [loading, setLoading] = useState(true);
  const MySwal = withReactContent(Swal);
  const [mode, setMode] = useState("create");
  useEffect(() => {
    if (!Array.isArray(data)) {
      console.warn("Expected array but got:", data);
      setTableData({ count: 0, results: [] });
      return;
    }

    setTableData({
      count: data.length,
      results: data,
    });
  }, [data]);

  const handlePerPage = (e) => {
    const newLimit = parseInt(e.target.value);
    setRowsPerPage(newLimit);
    setCurrentPage(1);
  };

  const debouncedFilter = debounce((value) => handleFilter(value), 300);

  const handleFilter = (value) => {
    setSearchTerm(value);

    if (value) {
      const filteredResults = tableData.results.filter(
        (row) =>
          row.member?.firstName?.toLowerCase().includes(value.toLowerCase()) ||
          row.paymentStatus?.toLowerCase().includes(value.toLowerCase()) ||
          row.roomNumber?.toString().includes(value) ||
          row.finalAmount?.toString().includes(value)
      );

      setTableData((prev) => ({
        ...prev,
        results: filteredResults,
      }));
    } else {
      fetchTableData((currentPage - 1) * rowsPerPage, rowsPerPage);
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };



  const paymentStatusColor = {
    success: "light-success",
    error: "light-danger",
    pending: "light-warning",
  };

  const columns = [
    {
      name: "Id",
      sortable: true,
      // minWidth: "100px",
      selector: (row, index) => index + 1,
    },

    {
      name: "Payment From",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.paymentFrom || "-",
    },
    {
      name: "Customer Name",
      sortable: true,
      selector: (row) => {
        // Prefer member if available, else customer
        const memberName =
          row.member?.firstName && row.member?.lastName
            ? `${row.member.firstName} ${row.member.lastName}`
            : null;

        const customerName =
          row.customer?.firstName && row.customer?.lastName
            ? `${row.customer.firstName} ${row.customer.lastName}`
            : null;

        return memberName || customerName || "N/A"; // fallback if both missing
      },
    },
    {
      name: "Email ID",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row?.member?.emailId || row?.customer?.emailId,
    },
    {
      name: "F.Amount",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.finalPayment,
    },

    {
      name: "Transaction ID",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => row.transactionId,
    },
    {
      name: "Status",
      sortable: true,
      // minWidth: "150px",
      selector: (row) => {
        return (
          <Badge
            color={
              paymentStatusColor[row?.paymentStatus?.toLowerCase()] ||
              "secondary"
            }
            pill
          >
            {row?.paymentStatus}
          </Badge>
        );
      },
    },
    {
      name: "Payment Date",
      sortable: true,
      selector: (row) => {
        const date = new Date(row.paymentDate);
        const formattedDate = date.toISOString().split("T")[0];
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedTime = `${formattedHours}:${minutes} ${ampm}`;

        return `${formattedDate} ${formattedTime}`;
      },
    },
  ];

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

  const dataToRender = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tableData.results.slice(startIndex, endIndex);
  };

  return (
    <>
      <div className="react-dataTable">
        <DataTable
          noHeader
          pagination
          subHeader
          responsive
          paginationServer
          columns={columns}
          sortIcon={<ChevronDown />}
          className="react-dataTable"
          // data={tableData}
          striped
          paginationComponent={CustomPagination}
          data={dataToRender()}
        />
      </div>
    </>
  );
};

export default index;
