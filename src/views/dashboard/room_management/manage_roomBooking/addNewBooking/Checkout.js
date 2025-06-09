import { useForm, Controller, set } from "react-hook-form";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  Row,
  Col,
  Container,
  InputGroup,
  InputGroupText,
  FormGroup,
  FormFeedback,
  Spinner,
  UncontrolledAlert,
  CardText,
} from "reactstrap";
import React, { Fragment, useEffect, useState } from "react";

import { data } from "jquery";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

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

  const MySwal = withReactContent(Swal);

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
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMember();
  }, []);

  const onSubmit = async (data) => {
    setErr("");

    try {
      setLoadPayment(true);
      const res = await useJwt.totalPayment(token, payload);
      console.log(res);
      if (res.status === 200) {
        return MySwal.fire({
          title: "  Success",
          text: "Your Payment Completed  Successfully",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          navigate("/dashbord");
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log("Error data", error.response.data);
        console.log("Error status", error.response.status);
        console.log("Error headers", error.response.headers);
        setErr(error.response.data.content);
      }
    } finally {
      setLoadPayment(false);
    }
    console.log(data);
  };

  return (
    <Row className="d-flex justify-content-center mt-3">
      <Col xs="12">
        <Row>
          <Col xl="8" xs="12">
            <Card>
              <CardBody>
                <CardTitle className="mb-1" tag="h4">
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
                        09
                      </span>{" "}
                      <span style={{ fontSize: "0.8em" }}>Jun 2025</span>
                    </CardTitle>
                    <CardText
                      className=""
                      style={{ fontSize: "0.8em", margin: "-1em 0.5em" }}
                    >
                      Monday
                    </CardText>
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
                        12
                      </span>{" "}
                      <span style={{ fontSize: "0.8em" }}>Jun 2025</span>{" "}
                    </CardTitle>
                    <CardText
                      className=""
                      style={{ fontSize: "0.8em", margin: "-1em 0.5em" }}
                    >
                      Saturday
                    </CardText>
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
                        03
                      </span>
                      <span style={{ fontSize: "0.8em" }}>Days</span>
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
                <CardText>Room 201 : $ 550 x 1 Night</CardText>
                <CardText>Room 202 : $ 550 x 1 Night</CardText>
                <CardText>Room 205 : $ 650 x 2 Night</CardText>

              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl="8" xs="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Guest Details</CardTitle>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <>
                    <div className="text-center">
                      Please Wait ..
                      <BeatLoader className="mt-1" />
                    </div>
                  </>
                ) : (
                  <>
                    <Row>
                      <Col xl="7" xs="12">
                        <Row tag="dl" className="mb-0">
                          <Col tag="dt" sm="4" className="fw-bolder mb-1">
                            First Name:
                          </Col>
                          <Col tag="dd" sm="8" className="mb-1">
                            {memberDetail?.firstName}
                          </Col>

                          <Col tag="dt" sm="4" className="fw-bolder mb-1">
                            Last Name :
                          </Col>
                          <Col tag="dd" sm="8" className="mb-1">
                            {memberDetail?.lastName}
                          </Col>

                          <Col tag="dt" sm="4" className="fw-bolder mb-1">
                            Email:
                          </Col>
                          <Col tag="dd" sm="8" className="mb-1">
                            {memberDetail?.memberEmail}
                          </Col>

                          <Col tag="dt" sm="4" className="fw-bolder mb-1">
                            Address:
                          </Col>
                          <Col tag="dd" sm="8" className="mb-1">
                            {memberDetail?.address}
                          </Col>

                          <Col tag="dt" sm="4" className="fw-bolder mb-1">
                            Mobile Number :
                          </Col>
                          <Col tag="dd" sm="8" className="mb-1">
                            {memberDetail?.countryCode}{" "}
                            {memberDetail?.mobileNumber}
                          </Col>
                        </Row>
                      </Col>
                      <Col xl="5" xs="12">
                        <Row tag="dl" className="mb-0">
                          <Col tag="dt" sm="4" className="fw-bolder mb-1">
                            State :{" "}
                          </Col>
                          <Col tag="dd" sm="8" className="mb-1">
                            {memberDetail?.state}
                          </Col>

                          <Col tag="dt" sm="4" className="fw-bolder mb-1">
                            Country:
                          </Col>
                          <Col tag="dd" sm="8" className="mb-1">
                            {memberDetail?.country}
                          </Col>

                          <Col tag="dt" sm="4" className="fw-bolder mb-1">
                            Postal Code :
                          </Col>
                          <Col tag="dd" sm="8" className="mb-1">
                            {memberDetail?.postalCode}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                )}
              </CardBody>
            </Card>
            {/* </Card> */}
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
                  <Input type="text" placeholder="Enter Discount Amount" />
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
                          <strong>$4</strong>
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
                      >
                        <div className="details-title">Advance Amount</div>
                        <div className="detail-amt">
                          <strong>$0</strong>
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
                        <div className="details-title">Remaining Amount</div>
                        <div className="detail-amt">
                          <strong> 8 </strong>
                        </div>
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
                        <div className="detail-amt">$ 10</div>
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
        <Button type="submit" color="primary" className="btn-next">
          Submit
        </Button>
      </Col>
    </Row>
  );
};

export default Checkout;
