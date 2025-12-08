import { Fragment, memo, useEffect, useRef, useState } from "react";

// ** Custom Components

// ** PrimeReact
import { Toast } from "primereact/toast";

// ** Table Columns
import { qrCodeColumns } from "./Data";

// ** Third Party Components
import DataTable from "react-data-table-component";
import { ChevronDown, Download } from "react-feather";
import ReactPaginate from "react-paginate";

// ** Third Party Components
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";

// ** XLSX for Excel Export
import * as XLSX from "xlsx";

// ** Reactstrap Imports
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

// ** Auth
import useJwt from "@src/auth/jwt/useJwt";

function Index() {
  // ** States
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewQRModal, setViewQRModal] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const toast = useRef(null);

  // ** Get Payment Mode Display Text
  const getPaymentModeText = (paymentMode) => {
    if (!paymentMode || paymentMode === 1 || paymentMode === "1") {
      return "Credit Card";
    }
    return paymentMode;
  };

  // ** Format Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  // ** Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // ** Format Date for Excel
  const formatDateForExcel = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // ** Download QR Code with Complete Payment Details as PDF
  const downloadQRCodeWithDetails = (qrData) => {
    try {
      if (!qrData || !qrData.qrCodeBase64) {
        toast.current.show({
          severity: "error",
          summary: "Download Failed",
          detail: "QR Code not available.",
          life: 3000,
        });
        return;
      }

      // Create a new window for PDF generation
      const printWindow = window.open("", "", "width=800,height=600");

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background: #ffffff;
            }
            
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              border: 2px solid #e0e0e0;
              background: #ffffff;
            }
            
            .header {
              background: linear-gradient(135deg, #7367f0 0%, #9e95f5 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            
            .header h1 {
              font-size: 32px;
              margin: 0;
              font-weight: bold;
            }
            
            .qr-section {
              text-align: center;
              padding: 40px 20px;
              background: #f8f9fa;
            }
            
            .qr-code-wrapper {
              display: inline-block;
              padding: 15px;
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            
            .qr-code-wrapper img {
              width: 250px;
              height: 250px;
              display: block;
            }
            
            .details-section {
              padding: 30px 40px;
            }
            
            .detail-row {
              display: flex;
              padding: 15px 0;
              border-bottom: 1px solid #e0e0e0;
              align-items: center;
            }
            
            .detail-row:last-child {
              border-bottom: none;
            }
            
            .detail-label {
              font-weight: bold;
              color: #5e5873;
              width: 180px;
              flex-shrink: 0;
            }
            
            .detail-value {
              color: #000000;
              flex: 1;
              word-break: break-word;
            }
            
            .detail-value.amount {
              color: #28c76f;
              font-weight: bold;
              font-size: 18px;
            }
            
            .detail-value.error {
              color: #ea5455;
            }
            
            .status-badge {
              display: inline-block;
              padding: 5px 15px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 14px;
            }
            
            .status-success {
              background: #28c76f;
              color: white;
            }
            
            .status-pending {
              background: #ff9f43;
              color: white;
            }
            
            .status-failed {
              background: #ea5455;
              color: white;
            }
            
            .status-default {
              background: #6c757d;
              color: white;
            }
            
            .footer {
              background: #f0f0f0;
              padding: 20px;
              text-align: center;
              color: #999999;
              font-size: 12px;
            }
            
            .footer p {
              margin: 5px 0;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .receipt-container {
                border: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1>Payment Receipt</h1>
            </div>
            
            <div class="qr-section">
              <div class="qr-code-wrapper">
                <img src="data:image/png;base64,${
                  qrData.qrCodeBase64
                }" alt="QR Code" />
              </div>
            </div>
            
            <div class="details-section">
              <div class="detail-row">
                <div class="detail-label">Event Name:</div>
                <div class="detail-value">${qrData.eventName || "N/A"}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Customer Name:</div>
                <div class="detail-value">${qrData.customerName || "N/A"}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Phone Number:</div>
                <div class="detail-value">${qrData.customerPhone || "N/A"}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">QR Code Type:</div>
                <div class="detail-value">${qrData.qrCodeType || "N/A"}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Amount:</div>
                <div class="detail-value amount">${formatCurrency(
                  qrData.amount
                )}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Transaction ID:</div>
                <div class="detail-value">${qrData.transactionId || "N/A"}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Payment Mode:</div>
                <div class="detail-value">${getPaymentModeText(
                  qrData.paymentMode
                )}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value">
                  <span class="status-badge status-${
                    qrData.status === "SUCCESS"
                      ? "success"
                      : qrData.status === "PENDING"
                      ? "pending"
                      : qrData.status === "FAILED"
                      ? "failed"
                      : "default"
                  }">
                    ${(qrData.status || "UNKNOWN").toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Transaction Date:</div>
                <div class="detail-value">${formatDate(
                  qrData.transactionDate
                )}</div>
              </div>
              
              ${
                qrData.errorMessage
                  ? `
              <div class="detail-row">
                <div class="detail-label">Error Message:</div>
                <div class="detail-value error">${qrData.errorMessage}</div>
              </div>
              `
                  : ""
              }
            </div>
            
            <div class="footer">
              <p>Generated on ${new Date().toLocaleString("en-IN")}</p>
              <p>This is a computer generated receipt</p>
            </div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load
      printWindow.onload = function () {
        setTimeout(() => {
          printWindow.print();

          // Close the window after printing (optional)
          setTimeout(() => {
            printWindow.close();
          }, 500);

          toast.current.show({
            severity: "success",
            summary: "PDF Generated",
            detail: "Payment receipt is ready to download.",
            life: 2000,
          });
        }, 250);
      };
    } catch (error) {
      console.error("Download error:", error);
      toast.current.show({
        severity: "error",
        summary: "Download Failed",
        detail: "Could not download payment receipt.",
        life: 3000,
      });
    }
  };

  // ** Export to Excel Function
  const handleExportToExcel = () => {
    try {
      if (filteredData.length === 0) {
        toast.current.show({
          severity: "warn",
          summary: "No Data",
          detail: "No data available to export.",
          life: 3000,
        });
        return;
      }

      // Prepare data for Excel
      const excelData = filteredData.map((item, index) => ({
        "Sr. No": index + 1,
        "Transaction Date": formatDateForExcel(item.transactionDate),
        "Event Name": item.eventName || "N/A",
        "Customer Name": item.customerName || "N/A",
        "Customer Phone": item.customerPhone || "N/A",
        "QR Code Type": item.qrCodeType || "N/A",
        Amount: item.amount || 0,
        "Transaction ID": item.transactionId || "N/A",
        "Payment Mode": getPaymentModeText(item.paymentMode),
        Status: item.status || "N/A",
        "Error Message": item.errorMessage || "-",
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      ws["!cols"] = [
        { wch: 8 }, // Sr. No
        { wch: 20 }, // Transaction Date
        { wch: 25 }, // Event Name
        { wch: 20 }, // Customer Name
        { wch: 15 }, // Customer Phone
        { wch: 15 }, // QR Code Type
        { wch: 12 }, // Amount
        { wch: 20 }, // Transaction ID
        { wch: 15 }, // Payment Mode
        { wch: 12 }, // Status
        { wch: 30 }, // Error Message
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Payment Transactions");

      // Generate filename with date
      const today = new Date().toISOString().split("T")[0];
      const filename = `Event_Payments_${today}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);

      toast.current.show({
        severity: "success",
        summary: "Export Successful",
        detail: `${filteredData.length} transactions exported successfully.`,
        life: 3000,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.current.show({
        severity: "error",
        summary: "Export Failed",
        detail: "Unable to export data. Please try again.",
        life: 3000,
      });
    }
  };

  // ** Fetch Data
  const fetchData = async (page = 1, perPage = rowsPerPage, q = "") => {
    try {
      setLoading(true);
      const response = await useJwt.getEventQRPaymentList();
      const result = response?.data?.content?.result || [];

      // Flatten the data since each event can have multiple payments
      const transformedData = result.flatMap((item) => {
        // Check if payments array exists and has items
        if (!item.payments || item.payments.length === 0) {
          return [];
        }

        // Map each payment to a separate row
        return item.payments.map((payment, paymentIndex) => {
          const customer = payment.customer || {};
          return {
            id: `${item.id}-${payment.id}` || `${item.id}-${paymentIndex}`,
            transactionDate: payment.paymentDate,
            eventName: item.eventName,
            customerName:
              customer.name ||
              payment.customerName ||
              item.customerName ||
              "N/A",
            customerPhone:
              customer.phone ||
              customer.mobile ||
              payment.phoneNumber ||
              item.phoneNumber ||
              "N/A",
            qrCodeType: item.qrCodeType,
            qrCodeBase64: item.qrCodeBase64,
            amount: payment.finalPayment,
            status: payment.paymentStatus,
            transactionId: payment.transactionId,
            paymentMode: payment.paymentMode,
            errorMessage: payment.errorMessage,
          };
        });
      });

      console.log("the data is ready", transformedData);

      let filtered = transformedData;

      // Apply search filter
      if (q) {
        filtered = filtered.filter(
          (item) =>
            item.eventName?.toLowerCase().includes(q.toLowerCase()) ||
            item.qrCodeType?.toLowerCase().includes(q.toLowerCase()) ||
            item.customerName?.toLowerCase().includes(q.toLowerCase()) ||
            item.customerPhone?.toLowerCase().includes(q.toLowerCase()) ||
            item.transactionId?.toLowerCase().includes(q.toLowerCase())
        );
      }

      // Apply date range filter
      if (startDate || endDate) {
        filtered = filtered.filter((item) => {
          if (!item.transactionDate) return false;

          const itemDate = new Date(item.transactionDate);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;

          // Set time to start of day for proper comparison
          if (start) start.setHours(0, 0, 0, 0);
          if (end) end.setHours(23, 59, 59, 999);

          if (start && end) {
            return itemDate >= start && itemDate <= end;
          } else if (start) {
            return itemDate >= start;
          } else if (end) {
            return itemDate <= end;
          }
          return true;
        });
      }

      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filtered.slice(startIndex, endIndex);

      setData(paginatedData);
      setAllData(transformedData);
      setFilteredData(filtered);
      setTotal(filtered.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching QR Code data:", error);
      toast.current.show({
        severity: "error",
        summary: "Fetch Error",
        detail: "Failed to load QR Codes. Please try again.",
        life: 3000,
      });
      setData([]);
      setTotal(0);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, searchValue);
  }, [currentPage, rowsPerPage, searchValue, startDate, endDate]);

  // ** Handlers
  const handleFilter = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleDelete = async (row) => {
    try {
      const res = await useJwt.deleteQrCode(row.id);
      if (res.status === 204 || res.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Deleted",
          detail: "The QR code has been removed.",
          life: 2000,
        });
        fetchData(currentPage, rowsPerPage, searchValue);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.current.show({
        severity: "error",
        summary: "Delete Failed",
        detail: "Unable to delete QR Code. Please try again.",
        life: 3000,
      });
    }
  };

  const handleDownload = (row) => {
    downloadQRCodeWithDetails(row);
  };

  const handleViewDetails = (row) => {
    console.log("Selected QR Code:", row);
    setSelectedQRCode(row);
    setViewQRModal(true);
  };

  const toggleViewQRModal = () => {
    setViewQRModal(!viewQRModal);
    if (!viewQRModal) setSelectedQRCode(null);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchValue("");
    setCurrentPage(1);
  };

  const CustomPagination = () => {
    const count = Math.ceil(total / rowsPerPage);
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage - 1}
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

  const downloadQRCode = () => {
    if (selectedQRCode) {
      downloadQRCodeWithDetails(selectedQRCode);
    }
  };

  return (
    <Fragment>
      <Toast ref={toast} />
      <Card>
        <CardHeader className="border-bottom">
          <div className="d-flex justify-content-between align-items-center w-100">
            <h3 className="mb-0">Event Payment Listing</h3>
            <Button
              color="primary"
              onClick={handleExportToExcel}
              disabled={loading || filteredData.length === 0}
              size={'sm'}
            >
              <Download size={14} className="me-1" />
              Export to Excel ({filteredData.length})
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <Row className="mx-0 mt-1 mb-50">
            {/* Top row: Entries selector and search */}
            <Col sm="6" className="d-flex align-items-center">
              <Label for="sort-select">Show</Label>
              <Input
                className="dataTable-select mx-1"
                type="select"
                id="sort-select"
                value={rowsPerPage}
                onChange={handlePerPage}
                style={{ width: "80px" }}
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              <Label for="sort-select">entries</Label>
            </Col>

            <Col
              sm="6"
              className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
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
                placeholder="Search..."
                style={{ minWidth: "200px" }}
              />
            </Col>
          </Row>

          {/* Date Range Filters */}
          <Row className="mx-0 mt-2 mb-2">
            <Col md="5" sm="12" className="mb-1 mb-md-0">
              <Label for="start-date">Start Date</Label>
              <Flatpickr
                value={startDate}
                id="start-date"
                className="form-control"
                onChange={(date) => setStartDate(date[0])}
                options={{
                  altInput: true,
                  altFormat: "F j, Y",
                  dateFormat: "Y-m-d",
                  maxDate: endDate || null,
                }}
                placeholder="Select start date"
              />
            </Col>

            <Col md="5" sm="12" className="mb-1 mb-md-0">
              <Label for="end-date">End Date</Label>
              <Flatpickr
                value={endDate}
                id="end-date"
                className="form-control"
                onChange={(date) => setEndDate(date[0])}
                options={{
                  altInput: true,
                  altFormat: "F j, Y",
                  dateFormat: "Y-m-d",
                  minDate: startDate || null,
                }}
                placeholder="Select end date"
              />
            </Col>

            <Col md="2" sm="12" className="d-flex align-items-end">
              <Button
                color="secondary"
                outline
                block
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>

          <div className="react-dataTable mt-3">
            <DataTable
              noHeader
              pagination
              paginationServer
              className="react-dataTable"
              columns={qrCodeColumns({
                onViewDetails: handleViewDetails,
                onDelete: handleDelete,
                onDownload: handleDownload,
              })}
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              data={data}
              progressPending={loading}
              progressComponent={
                <div className="text-center p-3">
                  <Spinner color="primary" />
                </div>
              }
              noDataComponent={
                <div className="text-center p-3">
                  <p className="mb-0">No payment records found</p>
                </div>
              }
            />
          </div>
        </CardBody>
      </Card>

      {/* View QR Code Modal - Responsive */}
      <Modal
        isOpen={viewQRModal}
        toggle={toggleViewQRModal}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalHeader toggle={toggleViewQRModal}>Payment Details</ModalHeader>

        <ModalBody>
          {selectedQRCode && (
            <Row>
              <Col xs="12" lg="6" md="12" className="text-center mb-3 mb-md-0">
                <div className="qr-code-container mb-3">
                  <img
                    src={`data:image/png;base64,${selectedQRCode.qrCodeBase64}`}
                    alt="QR Code"
                    className="img-fluid border rounded"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                </div>
              </Col>
              <Col xs="12" lg="6" md="12">
                <div className="payment-details">
                  <h5 className="text-primary mb-3">
                    {selectedQRCode.eventName}
                  </h5>

                  <div className="mb-2">
                    <strong>Customer:</strong> {selectedQRCode.customerName}
                  </div>

                  <div className="mb-2">
                    <strong>Phone:</strong> {selectedQRCode.customerPhone}
                  </div>

                  <div className="mb-2">
                    <strong>QR Code Type:</strong> {selectedQRCode.qrCodeType}
                  </div>

                  <div className="mb-2">
                    <strong>Amount:</strong>{" "}
                    <span className="text-success">
                      {formatCurrency(selectedQRCode.amount)}
                    </span>
                  </div>

                  <div className="mb-2">
                    <strong>Transaction ID:</strong>{" "}
                    {selectedQRCode.transactionId || "N/A"}
                  </div>

                  <div className="mb-2">
                    <strong>Payment Mode:</strong>{" "}
                    {getPaymentModeText(selectedQRCode.paymentMode)}
                  </div>

                  <div className="mb-2">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge bg-${
                        selectedQRCode.status === "SUCCESS"
                          ? "success"
                          : selectedQRCode.status === "PENDING"
                          ? "warning"
                          : "danger"
                      }`}
                    >
                      {selectedQRCode.status}
                    </span>
                  </div>

                  {selectedQRCode.errorMessage && (
                    <div className="mb-2">
                      <strong>Error:</strong>{" "}
                      <span className="text-danger">
                        {selectedQRCode.errorMessage}
                      </span>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={downloadQRCode}>
            Download Receipt
          </Button>
          <Button color="secondary" onClick={toggleViewQRModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
}

export default memo(Index);
