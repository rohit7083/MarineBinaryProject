import { useForm, Controller, set } from "react-hook-form";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import cashpayment from "../../../../../src/assets/images/cashPayment.png";
import cardSwipe from "../../../../../src/assets/images/cardSwipe.png";

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
import React, { Fragment, useEffect, useRef, useState } from "react";
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
import { BarLoader, BeatLoader } from "react-spinners";
import GenrateOtp from "./GenrateOtp";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
const Payment_section = ({ FinalAmountRes }) => {
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
      Cash: FinalAmountRes?.totalAmount || "",
    },
  });

  const MySwal = withReactContent(Swal);

  const [loading, setLoading] = useState(false);
  const [memberDetail, setMemberDetails] = useState();
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [loadPayment, setLoadPayment] = useState(false);
  const [err, setErr] = useState("");
  const getMember = async () => {
    try {
      setLoading(true);
      // const res = await useJwt.getMemberDetails(token);
      console.log("res", res);
      setMemberDetails(res?.data);
    } catch (error) {
      console.log("error", error);
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

  const validateCardSwipeTransactionId = (value) => {
    if (!value) {
      return "Card Swipe Transaction ID is required";
    }
    if (value.length < 6) {
      return "Transaction ID must be at least 6 characters";
    }
    if (!/^\d+$/.test(value)) {
      return "Transaction ID must contain only numbers";
    }
    return true;
  };
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

  // Generate the years array (next 10 years)
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return {
      value: year,
      label: year,
    };
  });
  const [selectedYear, setSelectedYear] = useState("");

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
      return allMonths.slice(currentMonth);
    }
    return allMonths;
  };

  const selectedOption = watch("paymentMethod");

  console.log("selectedOption ", selectedOption);

  const onSubmit = async (data) => {
    setErr("");


    

    const { cvc, ...rest } = data;

    let payload = {
      allocation: {
        uid: FinalAmountRes?.allocationUid,
      },

      finalPayment: FinalAmountRes?.totalAmount,
      paymentMode:
        selectedOption === "Cash" ? 3 : selectedOption === "cardSwipe" ? 2 : 1,
    };

    if (selectedOption === "cardSwipe") {
      payload = {
        ...payload,
        cardSwipeTransactionId: data.cardSwipeTransactionId,
      };
    } else if (selectedOption === "card") {
      payload = {
        ...payload,
        cardExpiryYear: Number(data.cardExpiryYear),
        cardExpiryMonth: Number(data.cardExpiryMonth),
        cardCvv: cvc,
        cardNumber: data.cardNumber.replace(/\s+/g, ""),
        cardType: data.cardType,
        nameOnCard: data.nameOnCard,
        accountType: data?.accountType,
      };
    }
    else{
console.log("NA");

    }
  

    

    const { allocation } = payload;
    delete payload.allocation;

    try {
      setLoadPayment(true);
      const res = await useJwt.ParkingPayment({ allocation, payment: payload });
      console.log(res);
      toast.current.show({
        severity: "success",
        summary: "Payment Successful",
        detail: "Thank you! Your payment has been completed.",
        life: 3000,
      });

      setTimeout(() => {
        navigate("/parking_pass");
      }, 2000);
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
    ];
    fieldNames.forEach((fieldName, index) => {
      const watchedValue = watchInputes[index];
      const sanitized = sanitizeValue(watchedValue, fieldName);

      if (watchedValue !== sanitized) {
        setValue(fieldName, sanitized);
      }
    });
  }, [watchInputes.join("|")]);

  useEffect(() => {
    if (FinalAmountRes?.totalAmount) {
      setValue("Cash", FinalAmountRes?.totalAmount);
    }
  }, [FinalAmountRes]);

  useEffect(() => {
    console.clear();
    console.log(watch("Cash"));
  }, [watch("Cash")]);

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
      <Toast ref={toast} />

      <Col xs="12">
        <Row>
          <Col xl="12" xs="12">
            <Card className="card-payment">
              <CardHeader>
                <CardTitle tag="h4">Payment Method</CardTitle>
                <CardTitle className="text-success" tag="h4">
                <span style={{color:"rgb(94, 88, 115)"}}>  Amount : </span> $ {FinalAmountRes?.totalAmount}
                </CardTitle>
              </CardHeader>

              <Form className="form" onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                  <Col xs={12}>
                    <Row className="custom-options-checkable">
                      <Col md={4} className="mb-md-0 mb-2">
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
                      <Col md={4} className="mb-md-0 mb-2">
                        <Controller
                          name="paymentMethod"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="radio"
                              id="Cash"
                              {...field}
                              value="Cash"
                              checked={field.value === "Cash"}
                              className="custom-option-item-check"
                            />
                          )}
                        />
                        <label
                          className="custom-option-item px-2 py-1"
                          htmlFor="Cash"
                        >
                          <CheckSquare className="font-medium-10 me-50 mb-1" />
                          <span className="d-flex align-items-center mb-50">
                            <span className="custom-option-item-title h4 fw-bolder mb-0">
                              Cash
                            </span>
                          </span>
                        </label>
                      </Col>

                      <Col md={4} className="mb-md-0 mb-2">
                        <Controller
                          name="paymentMethod"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="radio"
                              id="cardSwipe"
                              {...field}
                              value="cardSwipe"
                              checked={field.value === "cardSwipe"}
                              className="custom-option-item-check"
                            />
                          )}
                        />
                        <label
                          className="custom-option-item px-2 py-1"
                          htmlFor="cardSwipe"
                        >
                          <CheckSquare className="font-medium-10 me-50 mb-1" />
                          <span className="d-flex align-items-center mb-50">
                            <span className="custom-option-item-title h4 fw-bolder mb-0">
                              card Swipe
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
                    {selectedOption === "Cash" && (
                      <>
                        <Container>
                          <Row className="justify-content-center align-items-center">
                            <Col md={6}>
                              <img src={cashpayment} width={300} height={240} />
                            </Col>
                            <Col md={6}>
                              <CardTitle>Total Amount To Pay </CardTitle>

                              {/* <GenrateOtp /> */}
                              <Row>
                                <Col md="12" className="mb-1">
                                  <Label className="form-label" for="Cash">
                                    Total Amount
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Controller
                                    id="Cash"
                                    name="Cash"
                                    rules={{
                                      required: "Cash is required",
                                      // validate: validateCardSwipeTransactionId,
                                    }}
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        type="text"
                                        placeholder="Total Cash"
                                        defaultValues={
                                          FinalAmountRes?.totalAmount
                                        }
                                        invalid={!!errors.Cash}
                                        {...field}
                                        disabled={true}
                                        // onChange={(e) => {
                                        //   const numericValue =
                                        //     e.target.value.replace(/\D/g, "");
                                        //   field.onChange(numericValue);
                                        // }}
                                      />
                                    )}
                                  />
                                  {errors.Cash && (
                                    <FormFeedback>
                                      {errors.Cash.message}
                                    </FormFeedback>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Container>
                      </>
                    )}
                    {selectedOption === "card" && (
                      <>
                        <Container>
                          <Row className="justify-content-center align-items-center">
                            {/* Credit Card Preview on Left */}
                            <Col md={6} className="text-center">
                              <Col
                                md={6}
                                className="text-center position-relative"
                              >
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
                            </Col>

                            {/* Form on Right */}
                            <Col md={6}>
                              <Row>
                                <Col sm="6" className="mb-2">
                                  <Label for="number">Card Number</Label>

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
                                        // readOnly={true}
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
                                        type="password"
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
                                        {getFilteredMonths(selectedYear).map(
                                          (month) => (
                                            <option
                                              key={month.value}
                                              value={month.value}
                                            >
                                              {month.label}
                                            </option>
                                          )
                                        )}
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

                    {selectedOption === "cardSwipe" && (
                      <>
                        <Container>
                          <Row className="justify-content-center align-items-center">
                            <Col md={6}>
                              <img src={cardSwipe} width={300} height={240} />
                            </Col>
                            <Col md={6}>
                              <CardTitle>
                                Please Swipe Your Card to Continue{" "}
                              </CardTitle>
                              <Row>
                                <Col md="12" className="mb-1">
                                  <Label
                                    className="form-label"
                                    for="cardSwipeTransactionId"
                                  >
                                    Card Swipe Transaction ID
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Controller
                                    id="cardSwipeTransactionId"
                                    name="cardSwipeTransactionId"
                                    rules={{
                                      required:
                                        "Card Swipe Transaction ID is required",
                                      validate: validateCardSwipeTransactionId,
                                    }}
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        type="text"
                                        placeholder="Enter Transaction ID"
                                        invalid={
                                          !!errors.cardSwipeTransactionId
                                        }
                                        {...field}
                                        // disabled={statusThree}
                                        onChange={(e) => {
                                          const numericValue =
                                            e.target.value.replace(/\D/g, "");
                                          field.onChange(numericValue);
                                        }}
                                      />
                                    )}
                                  />
                                  {errors.cardSwipeTransactionId && (
                                    <FormFeedback>
                                      {errors.cardSwipeTransactionId.message}
                                    </FormFeedback>
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
                          size="sm"
                          onClick={() => reset()}
                        >
                          Reset
                        </Button>
                        <Button
                          color="primary"
                          size="sm"
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
        </Row>
      </Col>
    </Row>
  );
};

export default Payment_section;

//    <Col xl="4" xs="12">
//             <div
//               className="amount-payable checkout-options"
//               style={{ maxWidth: "400px", margin: "auto" }}
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle tag="h4">Price Details</CardTitle>
//                 </CardHeader>
//                 <CardBody>
//                   <ul
//                     className="list-unstyled price-details"
//                     style={{ padding: 0 }}
//                   >
//                     <li
//                       className="price-detail"
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       <div className="details-title">Price of items</div>
//                       <div className="detail-amt">
//                         <strong>$ {memberDetail?.amount}</strong>
//                       </div>
//                     </li>
//                     <li
//                       className="price-detail"
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       {/* <div className="details-title">Delivery Charges</div>
//                       <div className="detail-amt discount-amt text-success">
//                         Free
//                       </div> */}
//                     </li>
//                   </ul>
//                   <hr />
//                   <ul
//                     className="list-unstyled price-details"
//                     style={{ padding: 0 }}
//                   >
//                     <li
//                       className="price-detail"
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       <div className="details-title">Amount Payable</div>
//                       <div className="detail-amt">$ {memberDetail?.amount}</div>
//                     </li>
//                   </ul>
//                 </CardBody>
//               </Card>

//             </div>
//           </Col>
