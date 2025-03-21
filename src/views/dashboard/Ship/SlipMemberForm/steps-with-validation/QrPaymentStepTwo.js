import { useForm, Controller } from "react-hook-form";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

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
import React, { Fragment, useState } from "react";
import {
  Home,
  Check,
  X,
  Briefcase,
  CreditCard,
  CheckSquare,
  Watch,
} from "react-feather";

const CardPayment = () => {
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: {
    paymentMethod: "card", // Default selection
  },});

  const onSubmit = (data) => {
    console.log("Payment Data:", data);
  };

  const [cardDetails, setCardDetails] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });

  const handleInputFocus = (e) => {
    setCardDetails({ ...cardDetails, focus: e.target.name });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
    setValue(name, value); // Update react-hook-form state
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

  // Expiry Year Options (current year + next 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: (currentYear + i).toString().slice(-2), // Get last two digits (e.g., "25" for 2025)
    label: currentYear + i,
  }));

  const selectedOption = watch("paymentMethod");

  console.log("selectedOption ", selectedOption);

  return (
    <Row className="d-flex justify-content-center mt-3">
      <Col xs="8">
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Member Details</CardTitle>
            {/* <Button color='primary' size='sm' onClick={() => setShow(true)}>
            Edit Address
          </Button> */}
          </CardHeader>
          <CardBody>
            <Row>
              <Col xl="7" xs="12">
                <Row tag="dl" className="mb-0">
                  <Col tag="dt" sm="4" className="fw-bolder mb-1">
                    Company Name:
                  </Col>
                  <Col tag="dd" sm="8" className="mb-1">
                    PIXINVENT
                  </Col>

                  <Col tag="dt" sm="4" className="fw-bolder mb-1">
                    Billing Email:
                  </Col>
                  <Col tag="dd" sm="8" className="mb-1">
                    themeselection@ex.com
                  </Col>

                  <Col tag="dt" sm="4" className="fw-bolder mb-1">
                    Tax ID:
                  </Col>
                  <Col tag="dd" sm="8" className="mb-1">
                    TAX-357378
                  </Col>

                  <Col tag="dt" sm="4" className="fw-bolder mb-1">
                    VAT Number:
                  </Col>
                  <Col tag="dd" sm="8" className="mb-1">
                    SDF754K77
                  </Col>

                  <Col tag="dt" sm="4" className="fw-bolder mb-1">
                    Billing Address:
                  </Col>
                  <Col tag="dd" sm="8" className="mb-1">
                    100 Water Plant Avenue, Building 1303 Wake Island
                  </Col>
                </Row>
              </Col>
              <Col xl="5" xs="12">
                <Row tag="dl" className="mb-0">
                  <Col tag="dt" sm="4" className="fw-bolder mb-1">
                    Contact:
                  </Col>
                  <Col tag="dd" sm="8" className="mb-1">
                    +1 (605) 977-32-65
                  </Col>

                  <Col tag="dt" sm="4" className="fw-bolder mb-1">
                    Country:
                  </Col>
                  <Col tag="dd" sm="8" className="mb-1">
                    Wake Island
                  </Col>

                  <Col tag="dt" sm="4" className="fw-bolder mb-1">
                    State:
                  </Col>
                  <Col tag="dd" sm="8" className="mb-1">
                    Capholim
                  </Col>

                  <Col tag="dt" sm="4" className="fw-bolder mb-1">
                    Zipcode:
                  </Col>
                  <Col tag="dd" sm="8" className="mb-1">
                    403114
                  </Col>
                </Row>
              </Col>
            </Row>
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
                            checked={field.value === "ach"} // ✅ Ensures correct selection
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
              {/* </Card> */}

              {/* <Card className="card-payment"> */}
              <CardHeader>
                <CardTitle tag="h4">Payment Information</CardTitle>
              </CardHeader>
              <CardBody>
                <Form className="form" onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    {selectedOption === "ach" && (
                      <>
                        <Col sm="6" className="mb-2">
                          <Label for="bankName">Bank Name</Label>
                          <Input
                            {...register("bankName", {
                              required: "Bank Name is required",
                            })}
                            placeholder="Enter Bank Name"
                          />
                          {errors.bankName && (
                            <p className="text-danger">
                              {errors.bankName.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="accountName">Account Name</Label>
                          <Input
                            {...register("accountName", {
                              required: "Account Name is required",
                            })}
                            placeholder="Enter Account Name"
                          />
                          {errors.accountName && (
                            <p className="text-danger">
                              {errors.accountName.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="accountNumber">Account Number</Label>
                          <Input
                            type="text"
                            {...register("accountNumber", {
                              required: "Account Number is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Only numbers allowed",
                              },
                            })}
                            placeholder="Enter Account Number"
                          />
                          {errors.accountNumber && (
                            <p className="text-danger">
                              {errors.accountNumber.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="routingNumber">Routing Number</Label>
                          <Input
                            type="text"
                            {...register("routingNumber", {
                              required: "Routing Number is required",
                            })}
                            placeholder="Enter Routing Number"
                          />
                          {errors.routingNumber && (
                            <p className="text-danger">
                              {errors.routingNumber.message}
                            </p>
                          )}
                        </Col>
                      </>
                    )}
                    {selectedOption === "card" && (
                      <>
                        {/* <Col sm="6" className="mb-2">
                    <Label for="expiryMonth">Expiry Month</Label>
                    <Controller
                      name="expiryMonth"
                      control={control}
                      rules={{ required: "Expiry month is required" }}
                      render={({ field }) => (
                        <Input type="select" {...field}>
                          <option value="">Select Month</option>
                          {months.map((month) => (
                            <option key={month.value} value={month.value}>
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
                      rules={{ required: "Expiry year is required" }}
                      render={({ field }) => (
                        <Input type="select" {...field}>
                          <option value="">Select Year</option>
                          {years.map((year) => (
                            <option key={year.value} value={year.value}>
                              {year.label}
                            </option>
                          ))}
                        </Input>
                      )}
                    />
                    {errors.expiryYear && (
                      <p className="text-danger">{errors.expiryYear.message}</p>
                    )}
                  </Col>

                  <Col sm="6" className="mb-2">
                    <Label for="cardNumber">Card Number</Label>
                    <Input
                      type="text"
                      {...register("cardNumber", {
                        required: "Card Number is required",
                        pattern: {
                          value: /^[0-9]{16}$/,
                          message: "Card Number must be 16 digits",
                        },
                      })}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && (
                      <p className="text-danger">{errors.cardNumber.message}</p>
                    )}
                  </Col>

                  <Col sm="6" className="mb-2">
                    <Label for="cvv">CVV / CVC</Label>
                    <Input
                      type="password"
                      {...register("cvv", {
                        required: "CVV is required",
                        pattern: {
                          value: /^[0-9]{3,4}$/,
                          message: "Must be 3 or 4 digits",
                        },
                      })}
                      placeholder="123"
                    />
                    {errors.cvv && (
                      <p className="text-danger">{errors.cvv.message}</p>
                    )}
                  </Col>

                  <Col sm="6" className="mb-2">
                    <Label for="NameOnCard"> Name On Card</Label>
                    <Input
                      {...register("NameOnCard", {
                        required: "Card Name is required",
                      })}
                      placeholder="Enter card Name"
                    />
                    {errors.NameOnCard && (
                      <p className="text-danger">{errors.NameOnCard.message}</p>
                    )}
                  </Col>

                  <Col sm="6" className="mb-2">
                    <Label for="CardType">Card Type</Label>
                    <Input
                      {...register("CardType", {
                        required: "Card Type is required",
                      })}
                      placeholder="Enter Card Type"
                    />
                    {errors.CardType && (
                      <p className="text-danger">{errors.CardType.message}</p>
                    )}
                  </Col> */}

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
                                  <Input
                                    type="tel"
                                    {...register("number", {
                                      required: "Card Number is required",
                                    })}
                                    placeholder="Enter Card Number"
                                    maxLength="19"
                                    value={cardDetails.number}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                  />
                                  {errors.number && (
                                    <p className="text-danger">
                                      {errors.number.message}
                                    </p>
                                  )}
                                </Col>

                                <Col sm="6" className="mb-2">
                                  <Label for="name">Name On Card</Label>
                                  <Input
                                    type="text"
                                    {...register("name", {
                                      required: "Card Name is required",
                                    })}
                                    placeholder="Enter Card Name"
                                    value={cardDetails.name}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                  />
                                  {errors.name && (
                                    <p className="text-danger">
                                      {errors.name.message}
                                    </p>
                                  )}
                                </Col>
                              </Row>
                              {/* <Row>
       
        
        <Col sm="6" className="mb-2">
          <Label for="name">Card Type</Label>
          <Input
            type="text"
            {...register("cardType", { required: "Card Name is required" })}
            placeholder="Enter Card Name"
            value={cardDetails.name}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </Col>
      </Row> */}

                              <Row>
                                <Col sm="6" className="mb-2">
                                  <Label for="expiry">Expiry Date</Label>
                                  <Input
                                    type="text"
                                    {...register("expiry", {
                                      required: "Expiry Date is required",
                                    })}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    value={cardDetails.expiry}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                  />
                                  {errors.expiry && (
                                    <p className="text-danger">
                                      {errors.expiry.message}
                                    </p>
                                  )}
                                </Col>

                                <Col sm="6" className="mb-2">
                                  <Label for="cvc">CVV</Label>
                                  <Input
                                    type="text"
                                    {...register("cvc", {
                                      required: "CVV is required",
                                    })}
                                    placeholder="Enter CVV"
                                    maxLength="3"
                                    value={cardDetails.cvc}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                  />
                                  {errors.cvc && (
                                    <p className="text-danger">
                                      {errors.cvc.message}
                                    </p>
                                  )}
                                </Col>
                              </Row>
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
                </Form>
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
                      <div className="details-title">Price of 3 items</div>
                      <div className="detail-amt">
                        <strong>$699.30</strong>
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
                      <div className="details-title">Delivery Charges</div>
                      <div className="detail-amt discount-amt text-success">
                        Free
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
                      <div className="detail-amt">$699.30</div>
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
