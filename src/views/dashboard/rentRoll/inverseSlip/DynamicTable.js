// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import Summery from "../viewSlip/Summery";

// ** Reactstrap Imports
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

// ** Auth
import useJwt from "@src/auth/jwt/useJwt";

const DynamicTable = () => {
  // ** States
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [total, setTotal] = useState(0);
  const [paymentMonths, setPaymentMonths] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [summeryData, setSummerydata] = useState({});

  const indexColumn = {
    name: "Sr",
    width: "70px",
    center: true,
    selector: (row) => row.rowIndex || "",
    cell: (row) =>
      row.isMonthTotalRow ? (
        <div className="fw-bold border-top text-center">-</div>
      ) : (
        <div className="text-center">{row.rowIndex}</div>
      ),
  };
  // ** Static First Column
  const staticColumn = {
    sortable: true,
    name: "Slip Name",
    minWidth: "225px",
    selector: (row) => row.slipName || row.full_name,
    cell: (row) => (
      <div className={row.isMonthTotalRow ? "fw-bold border-top" : "fw-bold"}>
        {row.slipName || row.full_name || "-"}
      </div>
    ),
  };

  const slipTypeColumn = {
    sortable: true,
    name: "Slip Type",
    minWidth: "225px",
    selector: (row) => row.slipType,
    cell: (row) => (
      <div className={row.slipType ? "fw-bold border-top" : "fw-bold"}>
        {row.slipType || "-"}
      </div>
    ),
  };

  const memberNameColumn = {
    sortable: true,
    name: "Member Name",
    minWidth: "225px",
    selector: (row) => row.memberName,
    cell: (row) => (
      <div className={row.isMonthTotalRow ? "fw-bold border-top" : "fw-bold"}>
        {row.memberName || "-"}
      </div>
    ),
  };

  const LeasrStartColumn = {
    sortable: true,
    name: "Lease Start",
    minWidth: "150px",
    selector: (row) => row.contractDate,
    cell: (row) => (
      <div className={row.contractDate ? "fw-bold border-top" : "fw-bold"}>
        {row.contractDate || "-"}
      </div>
    ),
  };
  const leaserEndColumn = {
    sortable: true,
    name: "Lease End",
    minWidth: "150px",
    selector: (row) => row.nextPaymentDate,
    cell: (row) => (
      <div className={row.nextPaymentDate ? "fw-bold border-top" : "fw-bold"}>
        {row.nextPaymentDate || "-"}
      </div>
    ),
  };
  const LeaserTypeColumn = {
    sortable: true,
    name: "Lease Type",
    minWidth: "225px",
    selector: (row) => row.paidIn,
    cell: (row) => (
      <div className={row.paidIn ? "fw-bold border-top" : "fw-bold"}>
        {row.paidIn || "-"}
      </div>
    ),
  };

  const rentalPriceColumn = {
    sortable: true,
    name: "Rental Price",
    minWidth: "225px",
    selector: (row) => row.rentalPrice,
    cell: (row) => (
      <div className={row.rentalPrice ? "fw-bold border-top" : "fw-bold"}>
        {row.rentalPrice || "-"}
      </div>
    ),
  };
  const marketRentalColumn = {
    sortable: true,
    name: "Market Rental",
    minWidth: "225px",
    selector: (row) => row.marketRent,
    cell: (row) => (
      <div className={row.marketRent ? "fw-bold border-top" : "fw-bold"}>
        {row.marketRent || "-"}
      </div>
    ),
  };
  const rentGapColumn = {
    sortable: true,
    name: "Rent Gap",
    minWidth: "225px",
    selector: (row) => row.rentGap,
    cell: (row) => (
      <div className={row.rentGap ? "fw-bold border-top" : "fw-bold"}>
        {row.rentGap || "-"}
      </div>
    ),
  };
  const depositeColumn = {
    sortable: true,
    name: "Security Deposit",
    minWidth: "225px",
    selector: (row) => row.deposite,
    cell: (row) => (
      <div className={row.deposite ? "fw-bold border-top" : "fw-bold"}>
        {row.deposite || "-"}
      </div>
    ),
  };

  // ** Static Total Paid Column (Only Success Payments)
  const totalPaidColumn = {
    sortable: true,
    name: "Total Paid",
    minWidth: "150px",
    center: true,
    selector: (row) => row.totalPaid || 0,
    cell: (row) => (
      <div
        className={
          row.isMonthTotalRow ? "text-center fw-bold border-top" : "text-center"
        }
      >
        {row.totalPaid ? `$${row.totalPaid.toLocaleString()}` : "$0"}
      </div>
    ),
  };

  // ** Static Expected Amount Column (Success + Pending Payments)
  const expectedAmountColumn = {
    sortable: true,
    name: "Expected Amount",
    minWidth: "150px",
    center: true,
    selector: (row) => row.expectedAmount || 0,
    cell: (row) => (
      <div
        className={
          row.isMonthTotalRow ? "text-center fw-bold border-top" : "text-center"
        }
      >
        {row.expectedAmount ? `$${row.expectedAmount.toLocaleString()}` : "$0"}
      </div>
    ),
  };

  // ** Static Pending Amount Column
  const pendingAmountColumn = {
    sortable: true,
    name: "Pending Amount",
    minWidth: "150px",
    center: true,
    selector: (row) => row.pendingAmount || 0,
    cell: (row) => (
      <div
        className={
          row.isMonthTotalRow ? "text-center fw-bold border-top" : "text-center"
        }
      >
        {row.pendingAmount ? `$${row.pendingAmount.toLocaleString()}` : "$0"}
      </div>
    ),
  };

  // ** Helper function to calculate amounts for a slip
  const calculateSlipAmounts = (slip) => {
    let totalPaid = 0; // Only success payments
    let expectedAmount = 0; // Success + Pending payments
    let pendingAmount = 0; // Only pending payments

    if (slip.payments && Array.isArray(slip.payments)) {
      slip.payments.forEach((payment) => {
        const amount = payment.amountPaid || 0;

        if (payment.paymentStatus === "success") {
          totalPaid += amount;
          expectedAmount += amount;
        } else if (payment.paymentStatus === "pending") {
          pendingAmount += amount;
          expectedAmount += amount;
        }
      });
    }

    return {
      totalPaid,
      expectedAmount,
      pendingAmount,
    };
  };

  // ** Calculate Month Totals for Current Page Data
  const calculateCurrentPageTotals = (currentPageData) => {
    const monthTotals = {};
    let totalPaidSum = 0;
    let expectedAmountSum = 0;
    let totalPendingSum = 0;

    // Initialize month totals
    paymentMonths.forEach((month) => {
      monthTotals[month] = 0;
    });

    // Calculate totals for current page data only
    currentPageData.forEach((slip) => {
      if (!slip.isMonthTotalRow) {
        totalPaidSum += slip.totalPaid || 0;
        expectedAmountSum += slip.expectedAmount || 0;
        totalPendingSum += slip.pendingAmount || 0;

        // Calculate month-wise totals
        paymentMonths.forEach((month) => {
          if (slip.payments && Array.isArray(slip.payments)) {
            const payment = slip.payments.find((p) => p.paymentMonth === month);
            if (payment && payment.paymentStatus === "success") {
              monthTotals[month] += payment.amountPaid || 0;
            }
          }
        });
      }
    });

    return {
      monthTotals,
      totalPaidSum,
      expectedAmountSum,
      totalPendingSum,
    };
  };

  // ** Create Month Total Row for Current Page
  const createCurrentPageTotalRow = (currentPageData) => {
    const totals = calculateCurrentPageTotals(currentPageData);

    const monthTotalRow = {
      slipName: "Month Total",
      isMonthTotalRow: true,
      totalPaid: totals.totalPaidSum,
      expectedAmount: totals.expectedAmountSum,
      pendingAmount: totals.totalPendingSum,
    };

    // Add month totals to the row
    paymentMonths.forEach((month) => {
      monthTotalRow[`month_${month}`] = totals.monthTotals[month] || 0;
    });

    return monthTotalRow;
  };

  // ** Calculate Overall Totals for Export
  const calculateOverallTotals = (data) => {
    const monthTotals = {};
    let totalPaidSum = 0;
    let expectedAmountSum = 0;
    let totalPendingSum = 0;

    // Initialize month totals
    paymentMonths.forEach((month) => {
      monthTotals[month] = 0;
    });

    // Calculate totals for all data
    data.forEach((slip) => {
      if (!slip.isMonthTotalRow) {
        totalPaidSum += slip.totalPaid || 0;
        expectedAmountSum += slip.expectedAmount || 0;
        totalPendingSum += slip.pendingAmount || 0;

        // Calculate month-wise totals
        paymentMonths.forEach((month) => {
          if (slip.payments && Array.isArray(slip.payments)) {
            const payment = slip.payments.find((p) => p.paymentMonth === month);
            if (payment && payment.paymentStatus === "success") {
              monthTotals[month] += payment.amountPaid || 0;
            }
          }
        });
      }
    });

    return {
      monthTotals,
      totalPaidSum,
      expectedAmountSum,
      totalPendingSum,
    };
  };

  // ** Export to Excel Function
  const exportToExcel = () => {
    try {
      setExporting(true);

      // Get filtered data for export (without pagination)
      let exportData = [...allData];

      // Apply search filter if exists
      if (searchValue) {
        exportData = exportData.filter((item) => {
          const searchFields = [
            item.slipName,
            item.full_name,
            item.totalPaid?.toString(),
            item.expectedAmount?.toString(),
            item.pendingAmount?.toString(),
            ...(item.payments || []).map((p) => p.paymentMonth),
          ];
          return searchFields.some(
            (field) =>
              field &&
              field.toString().toLowerCase().includes(searchValue.toLowerCase())
          );
        });
      }

      // Prepare data for Excel
      const excelData = exportData.map((slip) => {
        const row = {
          "Slip No./ Month": slip.slipName || slip.full_name || "-",
        };

        // Add dynamic month columns
        paymentMonths.forEach((month) => {
          const payment = slip.payments?.find((p) => p.paymentMonth === month);
          const amount = payment ? payment.amountPaid : 0;
          row[month] = amount > 0 ? amount : 0;
        });

        // Add static columns
        row["Total Paid"] = slip.totalPaid || 0;
        row["Expected Amount"] = slip.expectedAmount || 0;
        row["Pending Amount"] = slip.pendingAmount || 0;

        return row;
      });

      // Calculate and add overall totals row
      const overallTotals = calculateOverallTotals(exportData);
      const totalRow = {
        "Slip No./ Month": "OVERALL TOTAL",
      };

      // Add month totals to total row
      paymentMonths.forEach((month) => {
        totalRow[month] = overallTotals.monthTotals[month] || 0;
      });

      totalRow["Total Paid"] = overallTotals.totalPaidSum;
      totalRow["Expected Amount"] = overallTotals.expectedAmountSum;
      totalRow["Pending Amount"] = overallTotals.totalPendingSum;

      // Add total row to excel data
      excelData.push(totalRow);

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 25 }, // Slip No./ Month
        ...paymentMonths.map(() => ({ wch: 15 })), // Dynamic month columns
        { wch: 15 }, // Total Paid
        { wch: 15 }, // Expected Amount
        { wch: 15 }, // Pending Amount
      ];
      ws["!cols"] = colWidths;

      // Style the total row (make it bold)
      const totalRowIndex = excelData.length;
      const range = XLSX.utils.decode_range(ws["!ref"]);

      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({
          r: totalRowIndex - 1,
          c: col,
        });
        if (!ws[cellRef]) ws[cellRef] = {};
        if (!ws[cellRef].s) ws[cellRef].s = {};
        ws[cellRef].s.font = { bold: true };
      }

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Rent Roll Data");

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `Rent_Roll_Export_${currentDate}.xlsx`;

      // Write and download file
      XLSX.writeFile(wb, filename);

      console.log("Excel file exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error occurred while exporting to Excel. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // ** Fetch API Data and Generate Dynamic Columns
  const fetchViewRentRoll = async () => {
    try {
      setLoading(true);
      const response = await useJwt.getInversionRentRoll();
      console.log("API Response:", response);
      setSummerydata(response?.data || {});

      if (response?.data?.slips && response.data.slips.length > 0) {
        const slips = response.data.slips;

        // Extract unique payment months from all slips
        const allPaymentMonths = new Set();
        slips.forEach((slip) => {
          if (slip.payments && Array.isArray(slip.payments)) {
            slip.payments.forEach((payment) => {
              if (payment.paymentMonth) {
                allPaymentMonths.add(payment.paymentMonth);
              }
            });
          }
        });

        // Convert Set to Array and sort if needed
        const months = Array.from(allPaymentMonths);
        setPaymentMonths(months);

        console.log("Payment Months:", months);

        // Process slips to calculate amounts
        const processedSlips = slips.map((slip) => {
          const amounts = calculateSlipAmounts(slip);
          return {
            ...slip,
            totalPaid: amounts.totalPaid,
            expectedAmount: amounts.expectedAmount,
            pendingAmount: amounts.pendingAmount,
          };
        });

        // Generate dynamic columns based on payment months
        const dynamicColumns = months.map((month) => ({
          name: month,
          sortable: true,
          minWidth: "150px",
          center: true,
          selector: (row) => {
            if (row.isMonthTotalRow) {
              return row[`month_${month}`] || 0;
            }
            const payment = row.payments?.find((p) => p.paymentMonth === month);
            return payment ? payment.amountPaid : 0;
          },
          cell: (row) => {
            if (row.isMonthTotalRow) {
              const total = row[`month_${month}`] || 0;
              return (
                <div className="text-center fw-bold border-top">
                  {total > 0 ? `$${total.toLocaleString()}` : "$0"}
                </div>
              );
            }
            const payment = row.payments?.find((p) => p.paymentMonth === month);
            const amount = payment ? payment.amountPaid : 0;
            const paymentStatus = payment ? payment.paymentStatus : null;

            // Determine background color based on payment status
            let bgColor = "";
            if (paymentStatus === "success") {
              bgColor = "text-success";
            } else if (paymentStatus === "pending") {
              bgColor = "text-warning";
            } else if (paymentStatus === "error") {
              bgColor = "text-danger";
            }

            return (
              <div className={`text-center ${bgColor} rounded px-1`}>
                {amount ? `$${amount.toLocaleString()}` : "-"}
              </div>
            );
          },
        }));

        // Combine static column with dynamic columns and additional static columns
        const finalColumns = [
          indexColumn,
          staticColumn,
          slipTypeColumn,
          memberNameColumn,
          LeasrStartColumn,
          leaserEndColumn,

          rentalPriceColumn,
          marketRentalColumn,
          rentGapColumn,
          depositeColumn,
          LeaserTypeColumn,
          ...dynamicColumns,
          totalPaidColumn,
          expectedAmountColumn,
          pendingAmountColumn,
        ];

        setColumns(finalColumns);
        setAllData(processedSlips); // Store processed slip data
        setTotal(processedSlips.length);
      } else {
        // If no data, show all columns but empty
        const finalColumns = [
          indexColumn,
          staticColumn,
          slipTypeColumn,
          memberNameColumn,
          LeasrStartColumn,
          leaserEndColumn,

          rentalPriceColumn,
          marketRentalColumn,
          rentGapColumn,
          depositeColumn,
          LeaserTypeColumn,
          totalPaidColumn,
          expectedAmountColumn,
          pendingAmountColumn,
        ];
        setColumns(finalColumns);
        setAllData([]);
        setTotal(0);
        setPaymentMonths([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set static columns even on error
      const finalColumns = [
        indexColumn,
        staticColumn,
        slipTypeColumn,
        memberNameColumn,
        LeasrStartColumn,
        leaserEndColumn,

        rentalPriceColumn,
        marketRentalColumn,
        rentGapColumn,
        depositeColumn,
        LeaserTypeColumn,
        totalPaidColumn,
        expectedAmountColumn,
        pendingAmountColumn,
      ];
      setColumns(finalColumns);
      setAllData([]);
      setTotal(0);
      setPaymentMonths([]);
    } finally {
      setLoading(false);
    }
  };

  // ** Function to apply filters and pagination
  const applyFiltersAndPagination = (data = allData) => {
    let filteredData = [...data];

    // Apply search filter
    if (searchValue) {
      filteredData = filteredData.filter((item) => {
        const searchFields = [
          item.slipName,
          item.full_name,
          item.totalPaid?.toString(),
          item.expectedAmount?.toString(),
          item.pendingAmount?.toString(),
          ...(item.payments || []).map((p) => p.paymentMonth),
        ];
        return searchFields.some(
          (field) =>
            field &&
            field.toString().toLowerCase().includes(searchValue.toLowerCase())
        );
      });
    }

    // Update total count
    setTotal(filteredData.length);

    // Pagination slice
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    let currentPageData = filteredData.slice(startIndex, endIndex);

    // 🔥 Assign index numbers
    currentPageData = currentPageData.map((item, idx) => ({
      ...item,
      rowIndex: startIndex + idx + 1,
    }));

    // Add month total row
    if (currentPageData.length > 0) {
      const monthTotalRow = createCurrentPageTotalRow(currentPageData);
      return [...currentPageData, monthTotalRow];
    }

    return currentPageData;
  };

  // ** Function to handle filter
  const handleFilter = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page when searching

    const filteredData = applyFiltersAndPagination(allData);
    setTableData(filteredData);
  };

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    const selectedPage = page.selected + 1;
    setCurrentPage(selectedPage);

    const filteredData = applyFiltersAndPagination(allData);
    setTableData(filteredData);
  };

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const value = parseInt(e.target.value);
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(total / rowsPerPage);

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

  // ** useEffect to fetch data on component mount
  useEffect(() => {
    fetchViewRentRoll();
  }, []);

  // ** useEffect to handle data changes
  useEffect(() => {
    if (allData.length > 0) {
      const filteredData = applyFiltersAndPagination();
      setTableData(filteredData);
    } else {
      setTableData([]);
    }
  }, [currentPage, rowsPerPage, searchValue, allData, paymentMonths]);

  // ** Custom Loading Component
  const LoadingComponent = () => (
    <div className="d-flex justify-content-center p-3">
      <Spinner color="primary" />
      <span className="ms-2">Loading table data...</span>
    </div>
  );

  // ** Custom No Data Component
  const NoDataComponent = () => (
    <div className="d-flex justify-content-center p-3">
      <span>No data available</span>
    </div>
  );

  const tinyBox = {
  width: "14px",
  height: "14px",
  padding: 0,
  minWidth: "14px",
  minHeight: "14px",
  borderRadius: "3px",
  marginRight: "4px"
};

  return (
    <Fragment>
      <Card className="overflow-hidden">
        <CardHeader className="">
          <CardTitle>Inverse Rent Roll</CardTitle>
        </CardHeader>
        <Summery summeryData={summeryData} />

        <CardBody>
         
         <Row className="align-items-center mb-1">
            <Col className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center gap-1">
                <Button color="success" size="sm" style={tinyBox} />
                <Label className="mb-0">Success</Label>
              </div>

              <div className="d-flex align-items-center gap-1">
                <Button color="danger" size="sm" style={tinyBox} />
                <Label className="mb-0">Failed</Label>
              </div>

              <div className="d-flex align-items-center gap-1">
                <Button color="warning" size="sm" style={tinyBox} />
                <Label className="mb-0">Pending</Label>
              </div>
            </Col>

            <Col className="d-flex justify-content-end align-items-center">
              <Button.Ripple
                color="secondary"
                className="me-2"
                onClick={fetchViewRentRoll}
                disabled={loading}
                size="sm"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button.Ripple>

              <Button.Ripple
                color="primary"
                onClick={exportToExcel}
                disabled={exporting || allData.length === 0}
                size="sm"
              >
                {exporting ? "Exporting..." : "Export"}
              </Button.Ripple>
            </Col>
          </Row>
          {/* <div className="d-flex justify-content-end align-items-end">
            <Button.Ripple
              color="secondary"
              className="me-2"
              onClick={fetchViewRentRoll}
              disabled={loading}
              size="sm"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button.Ripple>
            <Button.Ripple
              color="primary"
              onClick={exportToExcel}
              disabled={exporting || allData.length === 0}
              size="sm"
            >
              {exporting ? "Exporting..." : "Export"}
            </Button.Ripple>
          </div> */}
          {loading ? (
            <LoadingComponent />
          ) : (
            <>
              <Row className="mx-0 mt-1 mb-50">
                <Col sm="6">
                  <div className="d-flex align-items-center">
                    <Label for="sort-select">show</Label>
                    <Input
                      className="dataTable-select"
                      type="select"
                      id="sort-select"
                      value={rowsPerPage}
                      onChange={(e) => handlePerPage(e)}
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
              <div className="react-dataTable">
                <DataTable
                  noHeader
                  pagination
                  paginationServer // <-- CRITICAL
                  responsive
                  className="react-dataTable"
                  columns={columns}
                  data={tableData}
                  sortIcon={<ChevronDown size={10} />}
                  noDataComponent={<NoDataComponent />}
                  paginationComponent={CustomPagination}
                />
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default DynamicTable;
