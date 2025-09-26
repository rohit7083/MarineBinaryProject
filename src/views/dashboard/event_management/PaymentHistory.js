import { ArrowLeft } from "react-feather";
import { FaCreditCard, FaMoneyBillAlt, FaQrcode } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Badge, Card, CardBody, CardTitle, Col, Row, Table } from "reactstrap";

const PaymentHistory = ({ stepper, updateData }) => {
  const user = {
    discountAmount: 500,
    advancePaid: 2000,
    remainingAmount: 1000,
    totalAmount: 3500,
  };

  // {{debugger}}
  const location = useLocation();
{{debugger}}
  const paymentHistoryData = location?.state?.Rowdata;
  console.log("paymenthostory data ", paymentHistoryData);
  const {
    lastName,
    firstName,
    phoneNumber,
    countryCode,
    emailId,
    address,
    city,
    country,
    postalCode,
    state,
  } = paymentHistoryData?.member;
  const transactions = [
    {
      id: 1,
      date: "2025-05-25",
      amount: 1500,
      mode: "Card",
      status: "Success",
      transactionId: "TXN001",
    },
    {
      id: 2,
      date: "2025-05-20",
      amount: 500,
      mode: "UPI",
      status: "Failed",
      transactionId: "TXN002",
    },
    // add more...
  ];
  const getPaymentIcon = (mode) => {
    switch (mode) {
      case "Card":
        return <FaCreditCard />;
      case "Cash":
        return <FaMoneyBillAlt />;
      case "UPI":
        return <FaQrcode />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    return (
      <Badge color={status === "success" ? "success" : "danger"}>
        {status}
      </Badge>
    );
  };

  return (
    <>
      <CardTitle className="mb-1" tag="h4">
        <ArrowLeft
          style={{
            cursor: "pointer",
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
          onClick={() => window.history.back()}
        />{" "}
        Payment History
      </CardTitle>
      <Row>
        <Col md="12">
          <Card className="border-2">
            <CardBody>
              <CardTitle tag="h5">{firstName + " " + lastName}</CardTitle>
              <p>Email: {emailId}</p>
              <p>Phone No: {countryCode + phoneNumber}</p>
              <p>
                Address :{" "}
                {address +
                  "," +
                  city +
                  "," +
                  state +
                  "," +
                  country +
                  "," +
                  postalCode}
              </p>
              <Row className="mt-3">
                <Col md="3">
                  <div
                    className="d-flex align-items-center rounded-4 shadow-sm p-1"
                    style={{ backgroundColor: "#AED6F1", color: "black" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="2em"
                      height="2em"
                      className="me-1"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        d="M6 10h2.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1-.45-1-1s.45-1 1-1H10M8 4.5v1.167M8 9.5v2M14.5 8a6.5 6.5 0 1 1-13 0a6.5 6.5 0 0 1 13 0Z"
                      ></path>
                    </svg>

                    <div>
                      <strong
                        className="text-uppercase  d-block"
                        style={{ fontSize: "10px", marginBottom: "0.2rem" }}
                      >
                        Total Amount
                      </strong>
                      <p className="mb-0 fw-bold fs-4">
                        <strong>
                          {" "}
                          $ {paymentHistoryData?.totalAmount || 0}
                        </strong>
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md="3">
                  <div
                    className="d-flex align-items-center rounded-4 shadow-sm p-1"
                    style={{ backgroundColor: "#f7bab9", color: "black" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 14 14"
                      width="2em"
                      height="2em"
                      className="me-1"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5.83.998a1.895 1.895 0 0 1 2.392 0l.333.271l.423-.068a1.895 1.895 0 0 1 2.072 1.196l.152.4l.401.153A1.895 1.895 0 0 1 12.8 5.022l-.068.423l.27.333a1.895 1.895 0 0 1 0 2.392l-.27.333l.068.423a1.895 1.895 0 0 1-1.196 2.072l-.4.153l-.153.4a1.895 1.895 0 0 1-2.072 1.196l-.423-.068l-.333.271a1.895 1.895 0 0 1-2.392 0l-.333-.27l-.423.067a1.895 1.895 0 0 1-2.072-1.196l-.153-.4l-.4-.153a1.895 1.895 0 0 1-1.196-2.072l.068-.423l-.271-.333a1.895 1.895 0 0 1 0-2.392l.27-.333l-.067-.423A1.895 1.895 0 0 1 2.449 2.95l.4-.152l.153-.401A1.895 1.895 0 0 1 5.074 1.2l.423.068zM4.526 9.474l5-5"></path>
                        <path d="M5.026 5.474a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m4 4a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1"></path>
                      </g>
                    </svg>{" "}
                    <div>
                      <strong
                        className="text-uppercase  d-block"
                        style={{ fontSize: "10px", marginBottom: "0.2rem" }}
                      >
                        Discount Amount
                      </strong>
                      <p className="mb-0 fw-bold fs-4">
                        <strong>
                          $ {paymentHistoryData?.discountAmount || 0}
                        </strong>
                      </p>
                    </div>
                  </div>
                </Col>

                <Col md="3">
                  <div
                    className="d-flex align-items-center rounded-4 shadow-sm p-1"
                    style={{ backgroundColor: "#7dcea0", color: "black" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 14 14"
                      width="2em"
                      height="2em"
                      className="me-1"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 10.02v1.01m0-6.02v.94m0 7.54c3.5 0 6-1.24 6-4c0-3-1.5-5-4.5-6.5l1.18-1.52a.66.66 0 0 0-.56-1H4.88a.66.66 0 0 0-.56 1L5.5 3C2.5 4.51 1 6.51 1 9.51c0 2.74 2.5 3.98 6 3.98Z"></path>
                        <path d="M6 9.56A1.24 1.24 0 0 0 7 10a1.12 1.12 0 0 0 1.19-1A1.12 1.12 0 0 0 7 8a1.12 1.12 0 0 1-1.19-1A1.11 1.11 0 0 1 7 6a1.26 1.26 0 0 1 1 .4"></path>
                      </g>
                    </svg>

                    <div>
                      <strong
                        className="text-uppercase  d-block"
                        style={{ fontSize: "10px", marginBottom: "0.2rem" }}
                      >
                        Paid Amount
                      </strong>
                      <p className="mb-0 fw-bold fs-4">
                        <strong>
                          {" "}
                          $ {paymentHistoryData?.advancePaid || 0}{" "}
                        </strong>
                      </p>
                    </div>
                  </div>
                </Col>

                <Col md="3">
                  <div
                    className="d-flex align-items-center rounded-4 shadow-sm p-1"
                    style={{ backgroundColor: "#f3dd77", color: "black" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="2em"
                      height="2em"
                      className="me-1"
                    >
                      <path
                        fill="currentColor"
                        d="M5 17v2V5zm.616 3q-.672 0-1.144-.472T4 18.385V5.615q0-.67.472-1.143Q4.944 4 5.616 4h12.769q.67 0 1.143.472q.472.472.472 1.144v2.942h-1V5.616q0-.27-.173-.443T18.385 5H5.615q-.269 0-.442.173T5 5.616v12.769q0 .269.173.442t.443.173h12.769q.269 0 .442-.173t.173-.442v-2.943h1v2.943q0 .67-.472 1.143q-.472.472-1.143.472zm8-4q-.672 0-1.144-.472T12 14.385v-4.77q0-.67.472-1.143Q12.944 8 13.616 8h5.769q.67 0 1.143.472q.472.472.472 1.144v4.769q0 .67-.472 1.143q-.472.472-1.143.472zm5.769-1q.269 0 .442-.173t.173-.442v-4.77q0-.269-.173-.442T19.385 9h-5.77q-.269 0-.442.173T13 9.616v4.769q0 .269.173.442t.443.173zM16 13.5q.625 0 1.063-.437T17.5 12t-.437-1.062T16 10.5t-1.062.438T14.5 12t.438 1.063T16 13.5"
                      ></path>
                    </svg>
                    <div>
                      <strong
                        className="text-uppercase small d-block "
                        style={{ fontSize: "10px", marginBottom: "0.2rem" }}
                      >
                        Remaining Amount
                      </strong>
                      <p
                        className="mb-0 fw-bold fs-4"
                        style={{ marginBottom: "0.1rem" }}
                      >
                        <strong>
                          {" "}
                          ${" "}
                          {Number(
                            paymentHistoryData?.remainingAmount || 0
                          ).toFixed(2)}{" "}
                        </strong>
                      </p>
                    </div>
                  </div>
                </Col>

              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Card>
        <CardBody>
          <h5 className="mt-1">Recent Transactions</h5>
          <Table responsive bordered hover>
            <thead className="thead-light">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Amount ($)</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistoryData?.payments.slice(0, 5).map((txn, index) => (
                <tr key={txn.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(txn.paymentDate).toLocaleDateString()}</td>
                  <td>{txn.finalPayment}</td>
                  <td>
                    {getPaymentIcon(txn.mode)} {txn.paymentMode || "N/A"}
                  </td>
                  <td>{getStatusBadge(txn.paymentStatus)}</td>
                  <td>{txn.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};

export default PaymentHistory;
