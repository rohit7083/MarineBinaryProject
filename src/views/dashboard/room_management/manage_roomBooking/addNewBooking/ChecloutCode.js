import useJwt from "@src/auth/jwt/useJwt";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
} from "reactstrap";

import { ArrowLeft } from "react-feather";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ClientDetails from "./ClientDetails";
import OtpGenerate from "./OtpGenerate";

const Checkout = () => {
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const [verify, setVerify] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(""); // "flat" or "percentage"

  const MySwal = withReactContent(Swal);
  const [selectMem, setSelectedMember] = useState({});
  const [memberAppendData, setMemberAppendData] = useState({});

  const location = useLocation();
  {
    {
    }
  }
  const bookingData = location.state?.preBookingData;
  const alldata = location.state?.alldata;
  const searchId = location.state?.searchId;
  const searchuid = location.state?.searchUid;

  const [discountAmt, setDiscountAmt] = useState({});
  const [loading, setLoading] = useState(false);
  const [memberDetail, setMemberDetails] = useState();
  const { token } = useParams();
  const navigate = useNavigate();
  const [loadPayment, setLoadPayment] = useState(false);
  const [err, setErr] = useState("");
  const getMember = async () => {
    try {
      setLoading(true);
      const res = await useJwt.getMemberDetails(token);
      console.log("res", res);
      // const eventId=res?.data?.eventId;

      setMemberDetails(res?.data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMember();
  }, []);

  const onSubmit = async (data) => {
    setErr("");

    let memberdata;
    if (selectMem?.uid) {
      memberdata = { uid: selectMem?.uid };
    } else {
      memberdata = {
        ...memberAppendData,
      };
    }

    const payload = {
      roomSearch: {
        uid: searchuid,
      },
      member: memberdata,
      checkInDate: alldata?.checkInDate,
      checkOutDate: alldata?.checkOutDate,
      numberOfGuests: alldata?.numberOfGuests,
      subtotal: alldata?.totalAmount,
      isDiscountApply: isDiscount,
      discountType: discountAmt?.type,
      discountAmount: discountAmt?.enterValue,
      discountedFinalAmount: discountAmt?.discountValue || 0,
      finalAmount: alldata?.totalAmount - discountAmt?.discountValue,
    };

    try {
      setLoadPayment(true);
      const res = await useJwt.PreviewSubmit(payload);
      console.log(res);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log("Error data", error.response.data);
        console.log("Error status", error.response.status);
        console.log("Error headers", error.response.headers);
        setErr(error.response.data.content);
      }
    } finally {
      setLoadPayment(false);
    }
  };

  const isDiscount = watch("discount");
  const date = new Date(bookingData["0"]?.checkInDate);
  const day = String(date.getDate()).padStart(2, "0"); // "17"
  const monthYear = date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const outDate = new Date(bookingData["0"]?.checkOutDate);
  const outDay = String(outDate.getDate()).padStart(2, "0"); // "20"
  const outMonthYear = outDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <Row className="d-flex justify-content-center mt-3">
      <Col xs="12">
        <Row>
          <Col xl="8" xs="12">
            <Card>
              <CardBody>
                <CardTitle className="mb-1" tag="h4">
                  <ArrowLeft
                    style={{
                      cursor: "pointer",
                      transition: "color 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#9289F3")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#6E6B7B")
                    }
                    onClick={() => window.history.back()}
                  />{" "}
                  Review your Booking
                </CardTitle>
                <Row>
                  <Col>
                    <CardText className="">Check In</CardText>
                    <CardTitle className="m-auto">
                      <span
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          fontSize: "2em",
                        }}
                      >
                        {day}
                      </span>{" "}
                      <span style={{ fontSize: "0.8em" }}>{monthYear}</span>
                    </CardTitle>
                  </Col>
                  <Col>
                    {" "}
                    <CardText className="">Check Out</CardText>
                    <CardTitle className="m-auto">
                      <span
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          fontSize: "2em",
                        }}
                      >
                        {outDay}
                      </span>{" "}
                      <span style={{ fontSize: "0.8em" }}>{outMonthYear}</span>{" "}
                    </CardTitle>
                  </Col>

                  <Col>
                    {" "}
                    <CardText className="">Total Days</CardText>
                    <CardTitle className="m-auto">
                      <span
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          fontSize: "2em",
                        }}
                      >
                        {alldata?.numberOfDays}
                      </span>
                      <span style={{ fontSize: "0.8em" }}>Nights</span>
                    </CardTitle>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col xl="4" xs="12">
            <Card>
              <CardBody>
                <CardTitle>Booking Information</CardTitle>
                {bookingData?.map((x, index) => (
                  <CardText key={index}>
                    Room No {x?.label} : $ {x?.fields?.amount} x{" "}
                    {x?.totalNoOfDays} Night
                  </CardText>
                ))}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl="8" xs="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Guest Details 11</CardTitle>
              </CardHeader>

              <CardBody>
                {" "}
                <ClientDetails
                  setMemberAppendData={setMemberAppendData}
                  memberAppendData={memberAppendData}
                  setSelectedMember={setSelectedMember}
                />
              </CardBody>
            </Card>
          </Col>

          <Col xl="4" xs="12">
            <div
              className="amount-payable checkout-options"
              style={{ maxWidth: "400px", margin: "auto" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="1em"
                      height="1em"
                    >
                      <path
                        fill="currentColor"
                        d="M12.79 21L3 11.21v2c0 .53.21 1.04.59 1.41l7.79 7.79c.78.78 2.05.78 2.83 0l6.21-6.21c.78-.78.78-2.05 0-2.83z"
                      ></path>
                      <path
                        fill="currentColor"
                        d="M11.38 17.41c.39.39.9.59 1.41.59s1.02-.2 1.41-.59l6.21-6.21c.78-.78.78-2.05 0-2.83L12.62.58C12.25.21 11.74 0 11.21 0H5C3.9 0 3 .9 3 2v6.21c0 .53.21 1.04.59 1.41zM5 2h6.21L19 9.79L12.79 16L5 8.21z"
                      ></path>
                      <circle
                        cx="7.25"
                        cy="4.25"
                        r="1.25"
                        fill="currentColor"
                      ></circle>
                    </svg>{" "}
                    Discount
                  </CardTitle>
                </CardHeader>

                <CardBody>
                  <Col check className="mb-1">
                    <Label check>
                      <Controller
                        name="discount"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} type="checkbox" disabled={verify} />
                        )}
                      />{" "}
                      Discount
                    </Label>
                  </Col>
                  {isDiscount && (
                    <>
                      <OtpGenerate
                        setShowModal={setShowModal}
                        showModal={showModal}
                        mode={mode}
                        setMode={setMode}
                        setValueInParent={setValue}
                        alldata={alldata}
                        searchId={searchId}
                        setVerify={setVerify}
                        verify={verify}
                        discountAmt={discountAmt}
                        setDiscountAmt={setDiscountAmt}
                      />
                    </>
                  )}

                  {/* <Input type="text" placeholder="Enter Discount Amount" /> */}
                </CardBody>
                <hr />
                <CardHeader>
                  <CardTitle tag="h4">Price Details</CardTitle>
                </CardHeader>
                <CardBody>
                  <div
                    className="amount-payable checkout-options"
                    style={{ maxWidth: "400px", margin: "auto" }}
                  >
                    <ul
                      className="list-unstyled price-details"
                      style={{ padding: 0 }}
                    >
                      <li
                        className="price-detail"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <div className="details-title">Total Amount</div>
                        <div className="detail-amt">
                          <strong>$ {alldata?.totalAmount}</strong>
                        </div>
                      </li>
                      <li
                        className="price-detail"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        {/* {verify && ( */}
                        <>
                          <div className="details-title">Discount Amount</div>
                          <div className="detail-amt discount-amt text-danger">
                            {/* {isDiscount ? isDiscount : "0"}{" "}
                                            {mode === "Percentage"
                                              ? -discountPercentage.toFixed(2)
                                              : -discountAmt} */}
                            {discountAmt?.discountValue
                              ? `- $ ${discountAmt?.discountValue}`
                              : "$ 0"}
                          </div>
                        </>
                        {/* )} */}
                      </li>
                      <li
                        className="price-detail"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      ></li>

                      <li
                        className="price-detail"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        {/* <div className="details-title">Remaining Amount</div>
                        <div className="detail-amt">
                          <strong> 8 </strong>
                        </div> */}
                      </li>
                    </ul>
                    <hr />
                    <ul
                      className="list-unstyled price-details"
                      style={{ padding: 0 }}
                    >
                      <li
                        className="price-detail"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                        }}
                      >
                        <div className="details-title">Amount Payable</div>
                        <div className="detail-amt">
                          {alldata?.totalAmount - discountAmt?.discountValue ||
                            0}
                        </div>
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
        <Button
          type="submit"
          color="primary"
          className="btn-next"
          onClick={() => handleSubmit(onSubmit)()}
        >
          Submit
        </Button>
      </Col>
    </Row>
  );
};

export default Checkout;
