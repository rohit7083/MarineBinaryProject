// ** React Imports
import useJwt from "@src/auth/jwt/useJwt";
import { useEffect, useRef, useState } from "react";

// ** Table Columns and Data
import { reOrderColumns } from "./Data";

// ** Third Party Components
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";

// ** PrimeReact
import { Toast } from "primereact/toast";

// ** Reactstrap Imports
import {
    Badge,
    Button,
    Card,
    CardHeader,
    CardTitle,
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

const DataTablesReOrder = ({SlipData}) => {
  // ** States
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [formatedData, setFormatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState();
  const toast = useRef(null);
const memberId=SlipData?.member?.id;
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
    if (!dateString || dateString === "-") return "N/A";
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

  // ** Get Payment Mode Display Text
  const getPaymentModeText = (paymentMode) => {
    if (!paymentMode || paymentMode === 1 || paymentMode === "1") {
      return "Credit Card";
    }
    return paymentMode;
  };

  // ** Download Payment Receipt as PDF
  const downloadPaymentReceipt = (paymentData) => {
    try {
      if (!paymentData) {
        toast.current.show({
          severity: "error",
          summary: "Download Failed",
          detail: "Payment data not available.",
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
            
            .details-section {
              padding: 40px;
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
              width: 200px;
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
              font-size: 20px;
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
            
            <div class="details-section">
              <div class="detail-row">
                <div class="detail-label">Transaction ID:</div>
                <div class="detail-value">${
                  paymentData.transactionId || "N/A"
                }</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Bank Reference:</div>
                <div class="detail-value">${paymentData.bankRef || "-"}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Amount:</div>
                <div class="detail-value amount">${formatCurrency(
                  paymentData.amount
                )}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value">
                  <span class="status-badge status-${
                    paymentData.status?.toUpperCase() === "SUCCESS"
                      ? "success"
                      : paymentData.status?.toUpperCase() === "PENDING"
                      ? "pending"
                      : paymentData.status?.toUpperCase() === "FAILED"
                      ? "failed"
                      : "default"
                  }">
                    ${(paymentData.status || "UNKNOWN").toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Payment Date:</div>
                <div class="detail-value">${formatDate(
                  paymentData.paymentDate
                )}</div>
              </div>
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

  // ** Handle View Details
  const handleViewDetails = (row) => {
    
     ("Selected Payment:", row);
    setSelectedPayment(row);
    setViewModal(true);
  };

  // ** Handle Download
  const handleDownload = (row) => {
    downloadPaymentReceipt(row);
  };

  // ** Toggle View Modal
  const toggleViewModal = () => {
    setViewModal(!viewModal);
    if (!viewModal) setSelectedPayment(null);
  };

  // ** Download from Modal
  const downloadFromModal = () => {
    if (selectedPayment) {
      downloadPaymentReceipt(selectedPayment);
    }
  };

  // ** Function to handle filter
  const handleFilter = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.length) {
      const updatedData = formatedData.filter((item) => {
        const searchStr = value.toLowerCase();
        return (
          item.transactionId?.toLowerCase().includes(searchStr) ||
          item.bankRef?.toLowerCase().includes(searchStr) ||
          item.amount?.toString().toLowerCase().includes(searchStr) ||
          item.status?.toLowerCase().includes(searchStr) ||
          item.paymentDate?.toLowerCase().includes(searchStr)
        );
      });
      setFilteredData(updatedData);
    } else {
      setFilteredData(formatedData);
    }
  };

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  // ** Fetch Payment Data
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        if (memberId) {
          
          const response = await useJwt.getOtherPayment(memberId);
       
        const result = response?.data?.content?.result || [];

        const formattedData = result.map((item, index) => ({
          id: index + 1,
          transactionId: item.transactionId || "N/A",
          bankRef: item.bankTransactionId || "-",
          amount: item.finalPayment || "0",
          status: item.paymentStatus || "Pending",
          paymentDate: item.paymentDate || "-",
          rawData: item, // Store raw data for additional details if needed
        }));

        setFormatedData(formattedData);
        setFilteredData(formattedData);
         ("Formatted data:", formattedData);
         ("Payment response:", response);
         }
      } catch (error) {
         ("Error fetching payment data:", error);
        toast.current?.show({
          severity: "error",
          summary: "Fetch Error",
          detail: "Failed to load payment data. Please try again.",
          life: 3000,
        });
        setFormatedData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [memberId]);

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
    <>
      <Toast ref={toast} />

      <Card className="overflow-hidden">
        <CardHeader className="d-flex justify-content-between align-items-center">
          <CardTitle tag="h4">Other Payment</CardTitle>

          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center">
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
                style={{ minWidth: "250px" }}
              />
            </div>
          </div>
        </CardHeader>

        <div className="react-dataTable">
          {loading ? (
            <div className="text-center p-5">
              <Spinner color="primary" />
              <p className="mt-2">Loading payment data...</p>
            </div>
          ) : (
            <DataTable
              noHeader
              columns={reOrderColumns({
                onViewDetails: handleViewDetails,
                onDownload: handleDownload,
              })}
              sortIcon={<ChevronDown size={10} />}
              pagination
              paginationComponent={CustomPagination}
              paginationDefaultPage={currentPage + 1}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              data={filteredData}
              noDataComponent={
                <div className="p-5">
                  <p>No payment records found</p>
                </div>
              }
            />
          )}
        </div>
      </Card>

      {/* View Payment Details Modal */}
      <Modal
        isOpen={viewModal}
        toggle={toggleViewModal}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalHeader toggle={toggleViewModal}>Payment Details</ModalHeader>

        <ModalBody>
          {selectedPayment && (
            <Row>
              <Col xs="12">
                <div className="payment-details">
                  <h5 className="text-primary mb-3">Transaction Information</h5>

                  <div className="border-bottom">
                    <div className="mb-2">
                      <strong>Transaction ID:</strong>
                      <div className="mt-1">
                        {selectedPayment.transactionId}
                      </div>
                    </div>
                  </div>

                  <div className=" border-bottom">
                    <div className="mb-2">
                      <strong>Bank Reference:</strong>
                      <div className="mt-1 text-muted">
                        {selectedPayment.bankRef}
                      </div>
                    </div>
                  </div>

                  <div className=" border-bottom">
                    <div className="mb-2">
                      <strong>Amount:</strong>
                      <div className="mt-1">
                        <span
                          className="text-success fw-bold"
                          style={{ fontSize: "1.2rem" }}
                        >
                          {formatCurrency(selectedPayment.amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-bottom">
                    <div className="mb-2">
                      <strong>Status:</strong>
                      <div className="mt-1">
                        <Badge
                          color={
                            selectedPayment.status?.toUpperCase() === "SUCCESS"
                              ? "success"
                              : selectedPayment.status?.toUpperCase() ===
                                "PENDING"
                              ? "warning"
                              : selectedPayment.status?.toUpperCase() ===
                                "FAILED"
                              ? "danger"
                              : "secondary"
                          }
                          pill
                        >
                          {selectedPayment.status?.toUpperCase() || "UNKNOWN"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <strong>Payment Date:</strong>
                    <div className="mt-1">
                      {formatDate(selectedPayment.paymentDate)}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={downloadFromModal}>
            Download Receipt
          </Button>
          <Button color="secondary" onClick={toggleViewModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DataTablesReOrder;
