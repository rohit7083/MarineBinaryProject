import { useForm, Controller } from "react-hook-form";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import useJwt from "@src/auth/jwt/useJwt";

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
} from "reactstrap";
import React, { Fragment, useEffect, useState } from "react";
import {
  Home,
  Check,
  X,
  Briefcase,
  CreditCard,
  CheckSquare,
  Watch,
} from "react-feather";
import { data } from "jquery";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const CardPayment = () => {
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "card",
    },
  });
  const [loading, setLoading] = useState(false);
  const [memberDetail, setMemberDetails] = useState();
  const { token } = useParams();

  const getMember = async () => {
    try {
      setLoading(true);
      const res = await useJwt.getMemberDetails(token);
      console.log("res", res);
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

  const [cardDetails, setCardDetails] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });

  const handleInputFocus = (e) => {
    setCardDetails((prev) => ({
      ...prev,
      focus: e.target.name,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValue(name, value); // Update React Hook Form

    if (name === "expiryMonth" || name === "expiryYear") {
      const updatedMonth =
        name === "expiryMonth" ? value : watch("expiryMonth");
      const updatedYear = name === "expiryYear" ? value : watch("expiryYear");

      const formattedExpiry =
        updatedMonth && updatedYear
          ? `${updatedMonth}/${updatedYear.slice(-2)}`
          : "";

      setCardDetails((prev) => ({
        ...prev,
        expiry: formattedExpiry,
      }));
    } else {
      // ✅ Handle other fields like name, number, cvc
      setCardDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Expiry Month Options
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: (currentYear + i).toString().slice(-2), // Get last two digits (e.g., "25" for 2025)
    label: currentYear + i,
  }));

  const selectedOption = watch("paymentMethod");

  console.log("selectedOption ", selectedOption);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Row className="d-flex justify-content-center mt-3">
      <Col xs="8">
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Member Details</CardTitle>
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
                        {memberDetail?.countryCode} {memberDetail?.mobileNumber}
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
        <Row>
          <Col xl="8" xs="12">
            <Card className="card-payment">
              <CardHeader>
                <CardTitle tag="h4">Payment Method</CardTitle>
                {/* <CardTitle className="text-primary" tag="h4">
                $455.60
              </CardTitle> */}
              </CardHeader>

              <Form className="form" onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                  <Col xs={12}>
                    <Row className="custom-options-checkable">
                      <Col md={6} className="mb-md-0 mb-2">
                        <Controller
                          name="paymentMethod"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="radio"
                              id="card"
                              {...field}
                              value="card"
                              checked={field.value === "card"}
                              className="custom-option-item-check"
                            />
                          )}
                        />
                        <label
                          className="custom-option-item px-2 py-1"
                          htmlFor="card"
                        >
                          <CreditCard className="font-medium-10 me-50 mb-1" />
                          <span className="d-flex align-items-center mb-50">
                            <span className="custom-option-item-title h4 fw-bolder mb-0">
                              Credit/Debit Card
                            </span>
                          </span>
                        </label>
                      </Col>

                      {/* Cheque ACH Option */}
                      <Col md={6} className="mb-md-0 mb-2">
                        <Controller
                          name="paymentMethod"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="radio"
                              id="ach"
                              {...field}
                              value="ach"
                              checked={field.value === "ach"}
                              className="custom-option-item-check"
                            />
                          )}
                        />
                        <label
                          className="custom-option-item px-2 py-1"
                          htmlFor="ach"
                        >
                          <CheckSquare className="font-medium-10 me-50 mb-1" />
                          <span className="d-flex align-items-center mb-50">
                            <span className="custom-option-item-title h4 fw-bolder mb-0">
                              Cheque ACH
                            </span>
                          </span>
                        </label>
                      </Col>
                    </Row>
                  </Col>
                </CardBody>

                <CardHeader>
                  <CardTitle tag="h4">Payment Information</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    {selectedOption === "ach" && (
                      <>
                          <Col sm="6" className="mb-2">
        <Label for="bankName">Bank Name</Label>
        <Controller
          name="bankName"
          control={control}
          rules={{ required: "Bank Name is required" }}
          render={({ field }) => (
            <Input {...field} placeholder="Enter Bank Name" />
          )}
        />
        {errors.bankName && (
          <p className="text-danger">{errors.bankName.message}</p>
        )}
      </Col>

      <Col sm="6" className="mb-2">
        <Label for="accountName">Account Name</Label>
        <Controller
          name="accountName"
          control={control}
          rules={{ required: "Account Name is required" }}
          render={({ field }) => (
            <Input {...field} placeholder="Enter Account Name" />
          )}
        />
        {errors.accountName && (
          <p className="text-danger">{errors.accountName.message}</p>
        )}
      </Col>

      <Col sm="6" className="mb-2">
        <Label for="accountNumber">Account Number</Label>
        <Controller
          name="accountNumber"
          control={control}
          rules={{
            required: "Account Number is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Only numbers allowed",
            },
          }}
          render={({ field }) => (
            <Input {...field} placeholder="Enter Account Number" />
          )}
        />
        {errors.accountNumber && (
          <p className="text-danger">{errors.accountNumber.message}</p>
        )}
      </Col>

      <Col sm="6" className="mb-2">
        <Label for="routingNumber">Routing Number</Label>
        <Controller
          name="routingNumber"
          control={control}
          rules={{ required: "Routing Number is required" }}
          render={({ field }) => (
            <Input {...field} placeholder="Enter Routing Number" />
          )}
        />
        {errors.routingNumber && (
          <p className="text-danger">{errors.routingNumber.message}</p>
        )}
      </Col>

                      </>
                    )}
                    {selectedOption === "card" && (
                      <>
                        <Container>
                          <Row className="justify-content-center align-items-center">
                            {/* Credit Card Preview on Left */}
                            <Col md={6} className="text-center">
                              <Cards
                                cvc={cardDetails.cvc}
                                expiry={cardDetails.expiry}
                                focused={cardDetails.focus}
                                name={cardDetails.name}
                                number={cardDetails.number}
                              />
                            </Col>

                            {/* Form on Right */}
                            <Col md={6}>
                              <Row>
                                <Col sm="6" className="mb-2">
                                  <Label for="number">Card Number</Label>
                                  <Controller
                                    name="number"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                      <Input
                                        type="tel"
                                        maxLength="19"
                                        name="number"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          setCardDetails((prev) => ({
                                            ...prev,
                                            number: e.target.value,
                                          }));
                                        }}
                                        onFocus={handleInputFocus}
                                        placeholder="Card Number"
                                      />
                                    )}
                                  />
                                  {errors.number && (
                                    <p className="text-danger">
                                      {errors.number.message}
                                    </p>
                                  )}
                                </Col>

                                <Col sm="6" className="mb-2">
                                  <Label for="name">Name On Card</Label>

                                  <Controller
                                    name="name"
                                    control={control}
                                    rules={{
                                      required: "Cardholder name is required",
                                    }}
                                    render={({ field }) => (
                                      <Input
                                        type="text"
                                        placeholder="Cardholder Name"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e); // for RHF
                                          handleInputChange(e); // for card image
                                        }}
                                        onFocus={handleInputFocus}
                                      />
                                    )}
                                  />

                                  {errors.name && (
                                    <p className="text-danger">
                                      {errors.name.message}
                                    </p>
                                  )}
                                </Col>
                              </Row>
                              <Row>
                                <Col sm="6" className="mb-2">
                                  <Label for="name">Card Type</Label>
                                  <Input
                                    type="text"
                                    {...register("cardType", {
                                      required: "Card Name is required",
                                    })}
                                    placeholder="Enter Card Name"
                                    // value={cardDetails.name}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                  />
                                  {errors.name && (
                                    <p className="text-danger">
                                      {errors.name.message}
                                    </p>
                                  )}
                                </Col>
                                <Col sm="6" className="mb-2">
                                  <Label for="cvc">CVV</Label>
                                  <Controller
                                    name="cvc"
                                    control={control}
                                    rules={{ required: "CVV is required" }}
                                    render={({ field }) => (
                                      <Input
                                        type="text"
                                        name="cvc"
                                        placeholder="Enter CVV"
                                        maxLength="3"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e); // React Hook Form state
                                          handleInputChange(e); // Update card preview only
                                        }}
                                        onFocus={handleInputFocus}
                                      />
                                    )}
                                  />

                                  {errors.cvc && (
                                    <p className="text-danger">
                                      {errors.cvc.message}
                                    </p>
                                  )}
                                </Col>
                              </Row>

                              <Row>
                                <Col sm="6" className="mb-2">
                                  <Label for="expiryMonth">Expiry Month</Label>
                                  <Controller
                                    name="expiryMonth"
                                    control={control}
                                    rules={{
                                      required: "Expiry month is required",
                                    }}
                                    render={({ field }) => (
                                      <Input
                                        type="select"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          handleInputChange(e);
                                        }}
                                        onFocus={handleInputFocus}
                                      >
                                        <option value="">Select Month</option>
                                        {months.map((month) => (
                                          <option
                                            key={month.value}
                                            value={month.value}
                                          >
                                            {month.label}
                                          </option>
                                        ))}
                                      </Input>
                                    )}
                                  />

                                  {errors.expiryMonth && (
                                    <p className="text-danger">
                                      {errors.expiryMonth.message}
                                    </p>
                                  )}
                                </Col>

                                <Col sm="6" className="mb-2">
                                  <Label for="expiryYear">Expiry Year</Label>
                                  <Controller
                                    name="expiryYear"
                                    control={control}
                                    rules={{
                                      required: "Expiry year is required",
                                    }}
                                    render={({ field }) => (
                                      <Input
                                        type="select"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          handleInputChange(e);
                                        }}
                                        onFocus={handleInputFocus}
                                      >
                                        <option value="">Select Year</option>
                                        {years.map((year) => (
                                          <option
                                            key={year.value}
                                            value={year.value}
                                          >
                                            {year.label}
                                          </option>
                                        ))}
                                      </Input>
                                    )}
                                  />

                                  {errors.expiryYear && (
                                    <p className="text-danger">
                                      {errors.expiryYear.message}
                                    </p>
                                  )}
                                </Col>
                              </Row>
                              <Row></Row>
                            </Col>
                          </Row>
                        </Container>
                      </>
                    )}
                    <Col className="d-flex justify-content-end mt-3">
                      <Button color="primary" type="submit">
                        Make Payment
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Form>
            </Card>
          </Col>

          <Col xl="4" xs="12">
            <div
              className="amount-payable checkout-options"
              style={{ maxWidth: "400px", margin: "auto" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Price Details</CardTitle>
                </CardHeader>
                <CardBody>
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
                      <div className="details-title">Price of items</div>
                      <div className="detail-amt">
                        <strong>$ {memberDetail?.amount}</strong>
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
                      {/* <div className="details-title">Delivery Charges</div>
                      <div className="detail-amt discount-amt text-success">
                        Free
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
                      <div className="detail-amt">$ {memberDetail?.amount}</div>
                    </li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Terms & Conditions</CardTitle>
                </CardHeader>
                <CardBody>
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
                      <div className="form-check form-check-inline">
                        <Input type="checkbox" id="basic-cb-unchecked" />
                        <Label
                          for="basic-cb-unchecked"
                          className="form-check-label"
                        >
                          I authorize Locktrust to initiate single
                          ACH/electronic debit[s] to my account in the amount of
                          $ 50 USD from on 2025-02-26
                        </Label>
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
                      <div className="form-check form-check-inline">
                        <Input type="checkbox" id="basic-cb-unchecked" />
                        <Label
                          for="basic-cb-unchecked"
                          className="form-check-label"
                        >
                          I agree that ACH transactions I authorize comply with
                          all applicable law.{" "}
                        </Label>
                      </div>
                    </li>
                  </ul>
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
                      <div className="form-check form-check-inline">
                        <Input type="checkbox" id="basic-cb-unchecked" />
                        <Label
                          for="basic-cb-unchecked"
                          className="form-check-label"
                        >
                          I agree to the{" "}
                          <span
                            style={{
                              color: "blue",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Privacy Policy
                          </span>
                          ,
                          <span
                            style={{
                              color: "blue",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            security policy
                          </span>
                          ,
                          <span
                            style={{
                              color: "blue",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            user agreement
                          </span>{" "}
                          and
                          <span
                            style={{
                              color: "blue",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            {" "}
                            term of service
                          </span>{" "}
                        </Label>
                      </div>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default CardPayment;
