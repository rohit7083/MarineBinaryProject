// import { useState } from "react";
// import { useSelector } from "react-redux";
// import {
//     Button,
//     Card,
//     CardBody,
//     Col,
//     Modal,
//     ModalBody,
//     ModalFooter,
//     ModalHeader,
//     Row,
//     Table,
// } from "reactstrap";

// const PaymentReceiptModal = () => {
//   const [showModal, setShowModal] = useState(false);
//   const { billing, items, selectedCustomerDetails } = useSelector(
//     (store) => store.cartSlice
//   );
//   console.clear();
//   console.log(billing);
//   console.log(items);

//   const mappedItems = items.map((item) => ({
//     description: `${item.productName} - ${item.attributes
//       .map((a) => `${a.attributeName}: ${a.value}`)
//       .join(", ")}`,
//     quantity: item.qty,
//     price: item.finalAmount,
//   }));

//   const receiptData = {
//     receiptNo: "RCP-2025-00142",
//     date: new Date().toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     }),
//     customerName: `${selectedCustomerDetails.label}`,
//     customerEmail: `${selectedCustomerDetails.emailId}`,
//     paymentMethod: "Credit Card (**** 4532)",
//     transactionId: "TXN-8956423178",
//     items: mappedItems,
//     subtotal: `${billing?.subtotal}`,
//     tax: 0.0,
//     total: `${billing?.total}`,
//   };

//   const toggle = () => setShowModal(!showModal);

//   const handlePrint = () => window.print();

//   const handleDownload = () => {
//     const content = `
// PAYMENT RECEIPT
// -------------------------------------
// Receipt No: ${receiptData.receiptNo}
// Date: ${receiptData.date}

// Customer: ${receiptData.customerName}
// Email: ${receiptData.customerEmail}

// Payment: ${receiptData.paymentMethod}
// Transaction: ${receiptData.transactionId}

// Items
// -------------------------------------
// ${receiptData.items
//   .map(
//     (item) =>
//       `${item.description} x${item.quantity} - $${(
//         item.price * item.quantity
//       ).toFixed(2)}`
//   )
//   .join("\n")}
// Subtotal: $${Number(receiptData.subtotal || 0)}
// Tax: $${Number(receiptData.tax || 0)}
// TOTAL: $${Number(receiptData.total || 0)}

// -------------------------------------
// Thank you for your business!
//     `;
//     const blob = new Blob([content], { type: "text/plain" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `receipt-${receiptData.receiptNo}.txt`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="container mt-3">
//       <Button color="primary" size="sm" onClick={toggle}>
//         View Receipt
//       </Button>

//       <Modal isOpen={showModal} toggle={toggle} size="sm" centered>
//         <ModalHeader toggle={toggle} className="bg-success text-white py-2">
//           <span className="d-flex align-items-center small">
//             <svg
//               width="16"
//               height="16"
//               fill="currentColor"
//               className="me-1"
//               viewBox="0 0 16 16"
//             >
//               <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
//             </svg>
//             Payment Receipt
//           </span>
//         </ModalHeader>

//         <ModalBody
//           className="p-2"
//           id="receipt-content"
//           style={{ maxHeight: "70vh", overflowY: "auto" }}
//         >
//           <div className="text-center mb-2">
//             <h6 className="text-success mb-0 small">Payment Successful!</h6>
//             <small className="text-muted">Transaction completed</small>
//           </div>

//           <Card className="bg-light mb-2">
//             <CardBody className="p-1">
//               <Row className="g-1">
//                 <Col xs="6">
//                   <small className="text-muted d-block">Receipt No.</small>
//                   <strong className="small">{receiptData.receiptNo}</strong>
//                 </Col>
//                 <Col xs="6" className="text-end">
//                   <small className="text-muted d-block">Date</small>
//                   <strong className="small">{receiptData.date}</strong>
//                 </Col>
//               </Row>
//             </CardBody>
//           </Card>

//           <div className="mb-2 small">
//             <div className="mb-1">
//               <span className="text-muted">Name: </span>
//               <strong>{receiptData.customerName}</strong>
//             </div>
//             <div>
//               <span className="text-muted">Email: </span>
//               <strong>{receiptData.customerEmail}</strong>
//             </div>
//           </div>

//           <div className="mb-2 small">
//             <div className="mb-1">
//               <span className="text-muted">Payment: </span>
//               <strong>{receiptData.paymentMethod}</strong>
//             </div>
//             <div>
//               <span className="text-muted">Transaction: </span>
//               <strong>{receiptData.transactionId}</strong>
//             </div>
//           </div>

//           <Table size="sm" borderless className="mb-1 small">
//             <thead>
//               <tr className="border-bottom">
//                 <th className="text-muted">Description</th>
//                 <th className="text-muted text-center">Qty</th>
//                 <th className="text-muted text-end">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {receiptData.items.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.description}</td>
//                   <td className="text-center">{item.quantity}</td>
//                   <td className="text-end">
//                     ${(item.price * item.quantity).toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           <div className="border-top pt-1 small">
//             <div className="d-flex justify-content-between mb-1">
//               <span className="text-muted">Subtotal</span>
//               <span>${receiptData.subtotal}</span>
//             </div>
//             <div className="d-flex justify-content-between mb-1">
//               <span className="text-muted">Tax</span>
//               <span>${receiptData.tax}</span>
//             </div>
//             <div className="d-flex justify-content-between border-top pt-1">
//               <strong>Total</strong>
//               <strong className="text-success">${receiptData.total}</strong>
//             </div>
//           </div>

//           <div className="text-center mt-2 p-2 bg-light rounded small">
//             Thank you for your business!
//           </div>
//         </ModalBody>

//         <ModalFooter className="bg-light p-1">
//           <Button color="secondary" size="sm" outline onClick={toggle}>
//             Close
//           </Button>
//           <Button color="info" size="sm" onClick={handleDownload}>
//             Download
//           </Button>
//           <Button color="success" size="sm" onClick={handlePrint}>
//             Print
//           </Button>
//         </ModalFooter>
//       </Modal>

//       <style>{`

// @media print {
//   body * { display: none; } /* hide everything */
//   #receipt-content {
//     display: block; /* show receipt */
//     position: relative;
//     top: 0;
//     left: 0;
//     width: 80mm; /* thermal printer width */
//     font-family: monospace;
//     font-size: 12px;
//     line-height: 1.2;
//   }
//   #receipt-content table {
//     width: 100%;
//     border-collapse: collapse;
//   }
//   #receipt-content th, #receipt-content td {
//     padding: 2px 0;
//   }
// }

//       `}</style>
//     </div>
//   );
// };

// export default PaymentReceiptModal;
import useJwt from "@src/auth/jwt/useJwt";
import { useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";

import { useSelector } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";

const PaymentReceiptModal = ({
  showModal,
  txnId,
  setShowModal,
  discountData,
}) => {
  const [downLoader, setDownloader] = useState(false);
  const { billing, items, selectedCustomerDetails } = useSelector(
    (store) => store.cartSlice
  );

  console.log(discountData);

  const mappedItems = items.map((item) => ({
    description: `${item.productName} - ${item.attributes
      .map((a) => `${a.attributeName}: ${a.value}`)
      .join(", ")}`,
    quantity: item.qty,
    price: item.finalAmount,
  }));

  const receiptData = {
    receiptNo: "RCP-2025-00142",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    customerName: `${
      selectedCustomerDetails.label || selectedCustomerDetails?.firstName
    }`,
    customerEmail: `${selectedCustomerDetails.emailId}`,
    transactionId: `${txnId}`,
    items: mappedItems,
    subtotal: `${billing?.subtotal}`,
    discount: `${discountData?.calculatedDiscount}`,
    tax: 0.0,
    total: `${billing?.total}`,
  };

  const toggle = () => setShowModal(!showModal);

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    try {
      setDownloader(true);

      // Call the API
      const res = await useJwt.downloadReceipt(txnId); // make sure the function name is correct
      console.log(res);

      // Convert raw PDF text into binary
      const pdfText = res.data;
      const byteArray = new TextEncoder().encode(pdfText);

      // Create a Blob
      const file = new Blob([byteArray], { type: "application/pdf" });

      // Create a temporary download link
      const fileURL = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `receipt_${txnId}.pdf`);
      link.click();
      window.URL.revokeObjectURL(fileURL);

      // Cleanup
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    } finally {
      setDownloader(false);
    }
  };

  return (
    <div className="container mt-3">
      {/* <Button color="primary" size="sm" onClick={toggle}>
        View Receipt
      </Button> */}

      <Modal isOpen={showModal} toggle={toggle} size="sm" centered>
        <ModalHeader
          toggle={toggle}
          className="bg-success text-white py-2 no-print"
        >
          <span className="d-flex align-items-center small">
            <svg
              width="16"
              height="16"
              fill="currentColor"
              className="me-1"
              viewBox="0 0 16 16"
            >
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
            </svg>
            Payment Receipt
          </span>
        </ModalHeader>

        <ModalBody
          className="p-2"
          id="receipt-content"
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <div className="text-center mb-2">
            <h6 style={{ fontSize: "16pt", margin: 0, fontWeight: "bold" }}>
              LongCove
            </h6>
            <div className="small text-muted">
              14629 Rainbarrel Road
              <br />
              Charlotte, NC 28278, USA
              <br />
              +1 (704) 588-1467
            </div>

            <div className="mt-2">
              <h6 className="text-success mb-0 small">Payment Successful!</h6>
              {/* <small className="text-muted">Transaction completed</small> */}
            </div>
          </div>

          <Card className="bg-light mb-2 print-card">
            <CardBody className="p-1">
              <Row className="g-1">
                <Col xs="6">
                  <small className="text-muted d-block">Receipt No.</small>
                  <strong className="small">{receiptData.receiptNo}</strong>
                </Col>
                <Col xs="6" className="text-end">
                  <small className="text-muted d-block">Date</small>
                  <strong className="small">{receiptData.date}</strong>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <div className="mb-1 small">
            <div className="mb-1">
              <span className="text-muted">Name: </span>
              <strong>{receiptData.customerName}</strong>
            </div>
            <div>
              <span className="text-muted">Email: </span>
              <strong>{receiptData.customerEmail}</strong>
            </div>
          </div>

          <div className="mb-2 small">
            <div>
              <span className="text-muted">Transaction: </span>
              <strong>{receiptData.transactionId}</strong>
            </div>
          </div>

          <Table size="sm" borderless className="mb-1 small print-table">
            <thead>
              <tr className="border-bottom">
                <th className="text-muted">Description</th>
                <th className="text-muted text-center">Qty</th>
                <th className="text-muted text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="border-top pt-1 small">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Subtotal</span>
              <span>${receiptData.subtotal}</span>
            </div>
            {receiptData?.discount > 0 && (
              <>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Discount</span>
                  <span className="text-success">
                    -${receiptData?.discount}
                  </span>{" "}
                  {/* green */}
                </div>
              </>
            )}
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Tax</span>
              <span>${receiptData.tax}</span>
            </div>
            <div className="d-flex justify-content-between border-top pt-1">
              <strong>Total</strong>
              {Number(receiptData?.discount) > 0 ? (
                <span>
                  <s>${Number(receiptData.total).toFixed(2)}</s>{" "}
                  <strong className="text-success">
                    $
                    {(
                      Number(receiptData.total) - Number(receiptData.discount)
                    ).toFixed(2)}
                  </strong>
                </span>
              ) : (
                <strong>${Number(receiptData.total).toFixed(2)}</strong>
              )}
            </div>
          </div>

          <div className="text-center mt-2 p-2 bg-light rounded small">
            Thanks for shopping with us! See you again soon.
          </div>
        </ModalBody>

        <ModalFooter className="bg-light p-1 no-print">
          <Button color="secondary" size="sm" outline onClick={toggle}>
            Close
          </Button>
          <Button
            color="info"
            size="sm"
            disabled={downLoader}
            onClick={handleDownload}
          >
            {downLoader ? <SyncLoader size={10} /> : "Download"}
          </Button>
          <Button color="success" size="sm" onClick={handlePrint}>
            Print
          </Button>
        </ModalFooter>
      </Modal>

      <style>{`
      
@media print {
  @page {
    size: auto;
    margin: 10mm;
  }
  
  /* Hide everything except receipt content */
  body * {
    visibility: hidden;
  }
  
  .no-print {
    display: none !important;
  }
  
  #receipt-content,
  #receipt-content * {
    visibility: visible;
  }
 #receipt-content {
  position: relative;
  width: 100mm;
  max-width: 100%;
  margin: 20px auto;
  padding: 12mm;
  background: white;
  font-size: 11pt;
  line-height: 1.4;
   height: auto !important;
    max-height: none !important;
  color: #000;
  border: 2px solid #000;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow-y: auto;       /* scroll only on preview if content exceeds box */
  max-height: 90vh;       /* limit height only in preview */
}

  /* Clean card styling for print */
  .print-card {
    background: #f8f9fa !important;
    border: 1px solid #dee2e6 !important;
    margin-bottom: 8px !important;
    padding: 8px !important;
  }
  
  /* Table styling for print */
  .print-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
  }
  
  .print-table th,
  .print-table td {
    padding: 4px 2px;
    border-bottom: 1px solid #dee2e6;
  }
  
  .print-table thead tr {
    border-bottom: 2px solid #000 !important;
  }
  
  /* Text styling */
  .text-muted {
    color: #6c757d !important;
  }
  
  .text-success {
    color: #198754 !important;
  }
  
  .text-center {
    text-align: center;
  }
  
  .text-end {
    text-align: right;
  }
  
  .border-top {
    border-top: 1px solid #dee2e6 !important;
    padding-top: 6px !important;
  }
  
  .border-bottom {
    border-bottom: 1px solid #dee2e6 !important;
  }
  
  /* Remove bootstrap modal styles */
  .modal-content,
  .modal-dialog {
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }
  
  /* Ensure proper spacing */
  .mb-1 {
    margin-bottom: 4px !important;
  }
  
  .mb-2 {
    margin-bottom: 8px !important;
  }
  
  .mt-2 {
    margin-top: 8px !important;
  }
  
  .pt-1 {
    padding-top: 4px !important;
  }
  
  .p-2 {
    padding: 8px !important;
  }
  
  /* Background for thank you section */
  .bg-light {
    background: #f8f9fa !important;
  }
  
  .rounded {
    border-radius: 4px !important;
  }
  
  strong {
    font-weight: bold;
  }
  
  small, .small {
    font-size: 10pt;
  }
  
  h6 {
    font-size: 14pt;
    margin: 0;
    font-weight: bold;
  }


 
}
      `}</style>
    </div>
  );
};

export default PaymentReceiptModal;
