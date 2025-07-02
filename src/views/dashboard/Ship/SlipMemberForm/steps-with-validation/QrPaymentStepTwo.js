import { useForm, Controller, set } from "react-hook-form";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CryptoJS from 'crypto-js';

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
import { useParams, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const CardPayment = () => {
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "card",
    },
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
       console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  const AccountType = [
    { value: "8", label: "Personal Checking Account" },
    { value: "9", label: "Personal Saving Account" },
    { value: "10", label: "Business Checking Account" },
    { value: "11", label: "Business Savings Account" },
  ];
  useEffect(() => {
    getMember();
  }, []);

  const [cardDetails, setCardDetails] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    nameOnCard: "",
    cardNumber: "",
  });

  const handleInputFocus = (e) => {
    setCardDetails((prev) => ({
      ...prev,
      focus: e.target.name,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setValue(name, value); // React Hook Form update
  
    if (name === "cardExpiryYear") {
      setSelectedYear(value); // update year selection state
    }
  
    if (name === "cardExpiryMonth" || name === "cardExpiryYear") {
      const updatedMonth =
        name === "cardExpiryMonth" ? value : watch("cardExpiryMonth");
      const updatedYear =
        name === "cardExpiryYear" ? value : watch("cardExpiryYear");
  
      const formattedExpiry =
        updatedMonth && updatedYear
          ? `${updatedMonth}/${updatedYear.slice(-2)}`
          : "";
  
      setCardDetails((prev) => ({
        ...prev,
        expiry: formattedExpiry,
      }));
    } else {
      setCardDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-based index (0 = January)

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return {
      value: year,
      label: year,
    };
  });
  const [selectedYear, setSelectedYear] = useState("");

  // Generate the months array starting from the current month
  const getFilteredMonths = (selectedYear) => {
    const allMonths = [
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
  
    if (selectedYear === String(currentYear)) {
      return allMonths.slice(currentMonth); // Exclude past months for current year
    }
    return allMonths;
  };
  

  const selectedOption = watch("paymentMethod");

  console.log("selectedOption ", selectedOption);

  const onSubmit = async (data) => {
    setErr("");
    const { cvc, ...rest } = data;

let payload={};
   if (memberDetail?.slipId) {
        
    payload={  
      finalPayment: Number(memberDetail?.amount),
      slipId: memberDetail?.slipId,
      memberId: memberDetail?.memberId,
      paymentMode: selectedOption === "ach" ? 5 : 1,
      }}
      else{
        payload={
      finalPayment: Number(memberDetail?.amount),
      eventId: memberDetail?.eventId,
      memberId: memberDetail?.memberId,
      paymentMode: selectedOption === "ach" ? 5 : 1,
        }
      }
   

    if (selectedOption === "card") {
      payload.cardExpiryYear = Number(data.cardExpiryYear);
      payload.cardExpiryMonth = Number(data.cardExpiryMonth);
      payload.cardCvv = cvc;
      payload.cardNumber = data.cardNumber.replace(/\s+/g, ""); // Remove spaces from card number

      payload.cardType = data.cardType;
      payload.nameOnCard = data.nameOnCard;
      payload.accountType = Number(data?.accountType?.value);
    } else {
      payload.accountNumber = data.accountNumber;
      payload.routingNumber = data.routingNumber;
      payload.bankName = data.bankName;
      payload.nameOnAccount = data.nameOnAccount;
      payload.accountType = Number(data?.accountType?.value);
    }

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

  const detectCardType = (number) => {
    const re = {
      visa: /^4[0-9]{0,}$/,
      mastercard: /^(5[1-5][0-9]{0,}|2[2-7][0-9]{0,})$/,
      amex: /^3[47][0-9]{0,}$/,
      discover:
        /^6(?:011|5[0-9]{2}|22[1-9][0-9]|22[2-8][0-9]|229[0-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
    };

    if (re.visa.test(number)) return "Visa";
    if (re.mastercard.test(number)) return "MasterCard";
    if (re.amex.test(number)) return "American Express";
    if (re.discover.test(number)) return "Discover";
    return "unknown";
  };

  const watchInputes = watch([
    "cardNumber",
    "nameOnCard",
    "cvc",
    "accountType",
    "bankName",
    "nameOnAccount",
    "accountNumber",
    "routingNumber",
  ]);

  useEffect(() => {
    const sanitizeValue = (value, type) => {
      if (!value) return value;

      switch (type) {
        case "cardNumber":
          return value
            .replace(/\s+/g, "")
            .replace(/[^0-9]/g, "")
            .slice(0, 16);
        case "nameOnCard":
        case "bankName":
          return value.replace(/[^a-zA-Z\s]/g, "");
        case "cvc":
          return value.replace(/[^0-9]/g, "").slice(0, 3);
        case "accountNumber":
          return value.replace(/[^0-9]/g, "");
        case "routingNumber":
          return value.replace(/[^0-9]/g, "").slice(0, 9);
        default:
          return value;
      }
    };

    const fieldNames = [
      "cardNumber",
      "nameOnCard",
      "cvc",
      "accountType",
      "bankName",
      "nameOnAccount",
      "accountNumber",
      "routingNumber",
    ];
    fieldNames.forEach((fieldName, index) => {
      const watchedValue = watchInputes[index];
      const sanitized = sanitizeValue(watchedValue, fieldName);

      if (watchedValue !== sanitized) {
        setValue(fieldName, sanitized);
      }
    });
  }, [watchInputes.join("|")]);


    const maskCardNumberForCard = (number = "") => {
    const clean = number.replace(/\D/g, "");
    const len = clean.length;

    if (len <= 6) return clean; // Not enough digits to mask

    const first4 = clean.slice(0, 4);
    const middleLen = len - 6; // number of *s
    const maskedMiddle = "*".repeat(middleLen);
    const last2 = clean.slice(-2);

    return first4 + maskedMiddle + last2;
  };

   const maskCVC = (cvc = "") => {
    return cvc ? "*".repeat(cvc.length) : "";
  };

  return (
    <Row className="d-flex justify-content-center mt-3">
      <Col xs="10">
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
                <Container>
                  <Col sm="12" className="mb-2  mt-2">
                    {err && (
                      <React.Fragment>
                        <UncontrolledAlert color="danger">
                          <div className="alert-body">
                            <span className="text-danger fw-bold">
                              <strong>Error :</strong> {err}
                            </span>
                          </div>
                        </UncontrolledAlert>
                      </React.Fragment>
                    )}
                  </Col>
                </Container>
                <CardHeader>
                  <CardTitle tag="h4">Payment Information</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    {selectedOption === "ach" && (
                      <>
                        <Col sm="6" className="mb-2">
                          <Label className="form-label" for="acctype">
                            Account Type <span style={{ color: "red" }}>*</span>
                          </Label>

                          <Controller
                            name="accountType"
                            control={control}
                            rules={{
                              required: "Account Typed is required",
                            }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={AccountType}
                                className={`react-select ${
                                  errors.accountType ? "is-invalid" : ""
                                }`}
                              />
                            )}
                          />
                          {errors.accountType && (
                            <p className="text-danger">
                              {errors.accountType.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="bankName">Bank Name</Label>
                          <Controller
                            name="bankName"
                            control={control}
                            rules={{
                              required: "Bank Name is required",
                              pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message:
                                  "Only alphabetic characters are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input {...field} placeholder="Enter Bank Name" />
                            )}
                          />
                          {errors.bankName && (
                            <p className="text-danger">
                              {errors.bankName.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="nameOnAccount">Account Name</Label>
                          <Controller
                            name="nameOnAccount"
                            control={control}
                            rules={{
                              required: "Account Name is required",
                              pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message:
                                  "Only alphabetic characters are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Account Name"
                              />
                            )}
                          />
                          {errors.nameOnAccount && (
                            <p className="text-danger">
                              {errors.nameOnAccount.message}
                            </p>
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
                              <Input
                                {...field}
                                placeholder="Enter Account Number"
                              />
                            )}
                          />
                          {errors.accountNumber && (
                            <p className="text-danger">
                              {errors.accountNumber.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="routingNumber">Routing Number</Label>
                          <Controller
                            name="routingNumber"
                            control={control}
                            rules={{
                              required: "Routing Number is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Only numbers allowed",
                              },
                              maxLength: {
                                value: 9,
                                message:
                                  "Routing Number must be exactly 9 digits",
                              },
                              minLength: {
                                value: 9,
                                message:
                                  "Routing Number must be exactly 9 digits",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Routing Number"
                                maxLength={9} // Also prevents typing beyond 9 digits in UI
                              />
                            )}
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
                        <Container>
                          <Row className="justify-content-center align-items-center">
                            {/* Credit Card Preview on Left */}
                            <Col md={6} className="text-center">
                              {/* <Cards
                                number={cardDetails.cardNumber}
                                name={cardDetails.nameOnCard}
                                expiry={cardDetails.expiry}
                                cvc={cardDetails.cvc}
                                focused={cardDetails.focus}
                              /> */}
                               <Cards
                                  number={maskCardNumberForCard(
                                    cardDetails.cardNumber
                                  )} // ⚠️ only partially masked
                                  name={cardDetails.nameOnCard}
                                  expiry={cardDetails.expiry}
                                  cvc={maskCVC(cardDetails.cvc)} // Shows ***
                                  focused={cardDetails.focus}
                                />
                            </Col>

                            {/* Form on Right */}
                            <Col md={6}>
                              <Row>
                                <Col sm="6" className="mb-2">
                                  <Label for="number">Card Number</Label>
                                  {/*    <Controller
                                    name="cardNumber"
                                    control={control}
                                    rules={{
                                      required: "CardNumber  is required",
                                      pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Only number allowed",
                                      },
                                      maxLength: {
                                        value: 16,
                                        message: "Maximum 16 digits allowed",
                                      },
                                    }}
                                    render={({ field }) => (
                                      <Input
                                        type="tel"
                                        maxLength="19"
                                        name="cardNumber"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          setCardDetails((prev) => ({
                                            ...prev,
                                            cardNumber: e.target.value,
                                          }));
                                        }}
                                        onFocus={handleInputFocus}
                                        placeholder="Card Number"
                                      />
                                    )}
                                  />
                                  {errors.cardNumber && (
                                    <p className="text-danger">
                                      {errors.cardNumber.message}
                                    </p>
                                  )}
                                </Col> */}

                                  <Controller
                                    name="cardNumber"
                                    control={control}
                                    rules={{
                                      required: "CardNumber  is required",
                                      pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Only number allowed",
                                      },
                                      maxLength: {
                                        value: 16,
                                        message: "Maximum 16 digits allowed",
                                      },
                                    }}
                                    render={({ field }) => (
                                      <Input
                                        type="tel"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e); // update RHF
                                          const value = e.target.value;

                                          setCardDetails((prev) => ({
                                            ...prev,
                                            cardNumber: value,
                                          }));

                                          const cardType =
                                            detectCardType(value); // 🧠 auto-detect type
                                          setValue("cardType", cardType); // update RHF field
                                          setCardDetails((prev) => ({
                                            ...prev,
                                            cardType: cardType,
                                          }));
                                        }}
                                        onFocus={handleInputFocus}
                                        placeholder="Card Number"
                                      />
                                    )}
                                  />
                                  {errors.cardNumber && (
                                    <p className="text-danger">
                                      {errors.cardNumber.message}
                                    </p>
                                  )}
                                </Col>

                                <Col sm="6" className="mb-2">
                                  <Label for="name">Name On Card</Label>

                                  <Controller
                                    name="nameOnCard"
                                    control={control}
                                    rules={{
                                      required: "Cardholder name is required",
                                      pattern: {
                                        value: /^[A-Za-z\s]+$/, // only letters and spaces allowed
                                        message:
                                          "Only alphabetic characters are allowed",
                                      },
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

                                  {errors.nameOnCard && (
                                    <p className="text-danger">
                                      {errors.nameOnCard.message}
                                    </p>
                                  )}
                                </Col>
                              </Row>
                              <Row>
                                <Col sm="6" className="mb-2">
                                  <Label for="cardType">Card Type</Label>
                                  <Controller
                                    name="cardType"
                                    control={control}
                                    rules={{
                                      required: "Card Type is required",
                                      pattern: {
                                        value: /^[A-Za-z ]+$/,
                                        message:
                                          "Only alphabetic characters are allowed",
                                      },
                                    }}
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        id="cardType"
                                        disabled={true}
                                        onChange={(e) => {
                                          field.onChange(e); // keep react-hook-form state updated
                                          handleInputChange(e); // your custom logic
                                        }}
                                        onFocus={handleInputFocus}
                                        invalid={!!errors.cardType}
                                      />
                                    )}
                                  />
                                </Col>

                                <Col sm="6" className="mb-2">
                                  <Label for="cardCvv">CVV</Label>
                                  <Controller
                                    name="cvc"
                                    control={control}
                                    rules={{
                                      required: "CVV is required",
                                      pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Only Numbers allowed",
                                      },
                                    }}
                                    render={({ field }) => (
                                      <Input
                                        type="text"
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

                                  {errors.cardCvv && (
                                    <p className="text-danger">
                                      {errors.cardCvv.message}
                                    </p>
                                  )}
                                </Col>
                              </Row>

                              <Row>
                                <Col sm="6" className="mb-2">
                                  <Label for="cardExpiryYear">
                                    Expiry Year
                                  </Label>
                                  <Controller
                                    name="cardExpiryYear"
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
                                  {errors.cardExpiryYear && (
                                    <p className="text-danger">
                                      {errors.cardExpiryYear.message}
                                    </p>
                                  )}
                                </Col>

                                <Col sm="6" className="mb-2">
                                  <Label for="cardExpiryMonth">
                                    Expiry Month
                                  </Label>
                                  <Controller
                                    name="cardExpiryMonth"
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
                                        {getFilteredMonths(selectedYear).map((month) => (
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
                                  {errors.cardExpiryMonth && (
                                    <p className="text-danger">
                                      {errors.cardExpiryMonth.message}
                                    </p>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Container>
                      </>
                    )}
                    <Row>
                      <Col className="d-flex justify-content-end mt-3">
                        <Button
                          color="secondary"
                          className="me-2"
                          onClick={() => reset()}
                        >
                          Reset
                        </Button>
                        <Button
                          color="primary"
                          disabled={loadPayment}
                          type="submit"
                        >
                          {loadPayment ? (
                            <>
                              Loading... <Spinner size="sm" />
                            </>
                          ) : (
                            " Make Payment"
                          )}
                        </Button>
                      </Col>
                    </Row>
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
                      <div className="details-title">Amount</div>
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
                        <Input
                          type="checkbox"
                          checked
                          id="basic-cb-unchecked"
                        />
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
                        <Input
                          type="checkbox"
                          checked
                          id="basic-cb-unchecked"
                        />
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
                        <Input
                          type="checkbox"
                          checked
                          id="basic-cb-unchecked"
                        />
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
