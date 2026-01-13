import useJwt from "@src/auth/jwt/useJwt";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import React, { useEffect, useState } from "react";
import { CreditCard } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Container,
    Form,
    Input,
    Label,
    Row,
    Spinner,
    UncontrolledAlert,
} from "reactstrap";

import TokenExpire from "../../../pages/authentication/slip/TokenExpire";

const CardPayment = () => {
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const MySwal = withReactContent(Swal);

  const [loading, setLoading] = useState(false);
  const [memberDetail, setMemberDetails] = useState();
  const [isValidLink, setIsValidLink] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();
  const [loadPayment, setLoadPayment] = useState(false);
  const [err, setErr] = useState("");
  const [qrCodeType, setQrCodeType] = useState("");
  const [passBooked, setPassBooked] = useState("");
  const getMember = async () => {
    try {
      setLoading(true);
      const res = await useJwt.decodeQrToken(token);
       ("the Qr code type : ", res.data.qrCodeType);
      setQrCodeType(res.data.qrCodeType);

      if (res?.data?.status === "false") {
        setIsValidLink(true);
      } else {
        setIsValidLink(false);
      }

      setMemberDetails(res?.data);
    } catch (error) {
       ("the response error", error.response.data.content);
      if (
        error.response.data.content ===
        "The maximum number of people has already been reached."
      ) {
        setPassBooked("The maximum number of people has already been reached.");
      }
      console.error("error", error);
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

    setValue(name, value);

    if (name === "cardExpiryYear") {
      setSelectedYear(value);
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
  const currentMonth = currentDate.getMonth();

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

  const onSubmit = async (data) => {
    setErr("");
    const { cvc, ...rest } = data;

    let payload = {
      paymentMode: 1,
      cardType: data.cardType,
      cardNumber: Number(data.cardNumber.replace(/\s+/g, "")),
      cardCvv: Number(cvc),
      cardExpiryYear: Number(data.cardExpiryYear),
      cardExpiryMonth: Number(data.cardExpiryMonth),
      nameOnCard: data.nameOnCard,
      address: data.address || memberDetail?.address,
      city: memberDetail?.city,
      state: memberDetail?.state,
      country: memberDetail?.country,
      pinCode: memberDetail?.zipCode,
      finalPayment: Number(memberDetail?.amount),
      eventQrCode: {
        id: memberDetail?.qrCodeEventId,
      },
    };

    // Agar qrCodeType "other" hai to customer object add karo
    if (qrCodeType === "other") {
      payload.customer = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.memberPhone,
        emailId: data.memberEmail,
        address: data.customerAddress,
        city: data.customerCity,
        state: data.customerState,
        country: data.customerCountry,
        pinCode: data.zipCode,
      };
    }

     ("Final Payload:", payload);

    try {
      setLoadPayment(true);

      const res = await useJwt.payQrCodePayment(token, payload);
       (res);
      if (res.data.status === "error") {
        return MySwal.fire({
          title: "Failed",
          text: "Your Payment Failed",
          icon: "error", // corrected icon
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          navigate("/dashbord");
        });
      }
    } catch (error) {
       (error);
      if (error.response) {
         ("Error data", error.response);
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

  const watchInputes = watch(["cardNumber", "nameOnCard", "cvc"]);

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
          return value.replace(/[^a-zA-Z\s]/g, "");
        case "cvc":
          return value.replace(/[^0-9]/g, "").slice(0, 3);
        default:
          return value;
      }
    };

    const fieldNames = ["cardNumber", "nameOnCard", "cvc"];
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

    if (len <= 6) return clean;

    const first4 = clean.slice(0, 4);
    const middleLen = len - 6;
    const maskedMiddle = "*".repeat(middleLen);
    const last2 = clean.slice(-2);

    return first4 + maskedMiddle + last2;
  };

  const maskCVC = (cvc = "") => {
    return cvc ? "*".repeat(cvc.length) : "";
  };

  if (!isValidLink) return <TokenExpire />;

  return passBooked ? (
    <Row className="d-flex justify-content-center mt-5">
      <Col xs="12" md="8" lg="6">
        <Card className="text-center border-danger shadow-sm p-4">
          <CardBody>
            <div className="mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                fill="red"
                className="bi bi-x-circle mb-3"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </div>
            <h2 className="text-danger mb-2">Oops! Fully Booked</h2>
            <p className="text-muted mb-3">
              Sorry, all passes for this event have been booked.
            </p>
            <Button color="primary" onClick={() => navigate("/events")}>
              Explore Other Events
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  ) : (
    <Row className="d-flex justify-content-center mt-3">
      <Col xs="10">
        {qrCodeType !== "other" && (
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
                          {memberDetail?.countryCode}{" "}
                          {memberDetail?.memberPhone}
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
                          {memberDetail?.zipCode}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}
            </CardBody>
          </Card>
        )}

        <Row>
          <Col xl="8" xs="12">
            <Card className="card-payment">
              <CardHeader>
                <CardTitle tag="h4">Payment Method</CardTitle>
              </CardHeader>

              <Form className="form" onSubmit={handleSubmit(onSubmit)}>
                {qrCodeType === "other" && (
                  <>
                    <CardHeader>
                      <CardTitle tag="h4">Customer Details</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md="6" className="mb-1">
                          <Label for="firstName">
                            First Name <span className="text-danger">*</span>
                          </Label>
                          <Controller
                            name="firstName"
                            control={control}
                            rules={{
                              required: "First name is required",
                              pattern: {
                                value: /^[A-Za-z ]+$/,
                                message:
                                  "Only alphabets and spaces are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter First Name"
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^A-Za-z ]/g,
                                    ""
                                  );
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          {errors.firstName && (
                            <p className="text-danger">
                              {errors.firstName.message}
                            </p>
                          )}
                        </Col>

                        <Col md="6" className="mb-1">
                          <Label for="lastName">
                            Last Name <span className="text-danger">*</span>
                          </Label>
                          <Controller
                            name="lastName"
                            control={control}
                            rules={{
                              required: "Last name is required",
                              pattern: {
                                value: /^[A-Za-z ]+$/,
                                message:
                                  "Only alphabets and spaces are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Last Name"
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^A-Za-z ]/g,
                                    ""
                                  );
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          {errors.lastName && (
                            <p className="text-danger">
                              {errors.lastName.message}
                            </p>
                          )}
                        </Col>
                      </Row>

                      <Row>
                        <Col md="6" className="mb-1">
                          <Label for="memberPhone">
                            Phone Number <span className="text-danger">*</span>
                          </Label>
                          <Controller
                            name="memberPhone"
                            control={control}
                            rules={{
                              required: "Phone number is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Enter valid 10 digit number",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Phone Number"
                                maxLength={10}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          {errors.memberPhone && (
                            <p className="text-danger">
                              {errors.memberPhone.message}
                            </p>
                          )}
                        </Col>

                        <Col md="6" className="mb-1">
                          <Label for="memberEmail">
                            Email <span className="text-danger">*</span>
                          </Label>
                          <Controller
                            name="memberEmail"
                            control={control}
                            rules={{
                              required: "Email is required",
                              pattern: {
                                value: /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]+$/,
                                message: "Enter valid email",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Email"
                                onChange={(e) => {
                                  let value = e.target.value;
                                  value = value.replace(/[^A-Za-z0-9@.]/g, "");
                                  const parts = value.split("@");
                                  if (parts.length > 2) {
                                    value =
                                      parts[0] + "@" + parts.slice(1).join("");
                                  }
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          {errors.memberEmail && (
                            <p className="text-danger">
                              {errors.memberEmail.message}
                            </p>
                          )}
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12" className="mb-1">
                          <Label for="customerAddress">
                            Address <span className="text-danger">*</span>
                          </Label>
                          <Controller
                            name="customerAddress"
                            control={control}
                            rules={{ required: "Address is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Address"
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^A-Za-z0-9,.\s]/g,
                                    ""
                                  );
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          {errors.customerAddress && (
                            <p className="text-danger">
                              {errors.customerAddress.message}
                            </p>
                          )}
                        </Col>
                      </Row>

                      <Row>
                        <Col md="6" className="mb-1">
                          <Label for="customerCity">
                            City <span className="text-danger">*</span>
                          </Label>
                          <Controller
                            name="customerCity"
                            control={control}
                            rules={{ required: "City is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter City"
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^A-Za-z0-9\s]/g,
                                    ""
                                  );
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          {errors.customerCity && (
                            <p className="text-danger">
                              {errors.customerCity.message}
                            </p>
                          )}
                        </Col>

                        <Col md="6" className="mb-1">
                          <Label for="customerState">
                            State <span className="text-danger">*</span>
                          </Label>
                          <Controller
                            name="customerState"
                            control={control}
                            rules={{
                              required: "State is required",
                              pattern: {
                                value: /^[a-zA-Z0-9 ]*$/,
                                message:
                                  "Only letters, numbers, and spaces are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter State"
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^a-zA-Z0-9 ]/g,
                                    ""
                                  );
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          {errors.customerState && (
                            <p className="text-danger">
                              {errors.customerState.message}
                            </p>
                          )}
                        </Col>
                      </Row>

                      <Row>
                        <Col md="6" className="mb-1">
                          <Label for="customerCountry">
                            Country <span className="text-danger">*</span>
                          </Label>
                          <Controller
                            name="customerCountry"
                            control={control}
                            rules={{
                              required: "Country is required",
                              pattern: {
                                value: /^[a-zA-Z ]*$/,
                                message: "Only letters and spaces are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Country"
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^a-zA-Z ]/g,
                                    ""
                                  );
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          {errors.customerCountry && (
                            <p className="text-danger">
                              {errors.customerCountry.message}
                            </p>
                          )}
                        </Col>

                        <Col md="6" className="mb-1">
                          <Label for="zipCode">
                            Zip Code <span className="text-danger">*</span>
                          </Label>
                          <Controller
                            name="zipCode"
                            control={control}
                            rules={{
                              required: "Zip Code is required",
                              pattern: {
                                value: /^[0-9]{5}$/,
                                message: "Zip Code must be exactly 5 digits",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Zip Code"
                                maxLength={5}
                                onChange={(e) => {
                                  const value = e.target.value
                                    .replace(/[^0-9]/g, "")
                                    .slice(0, 5);
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          {errors.zipCode && (
                            <p className="text-danger">
                              {errors.zipCode.message}
                            </p>
                          )}
                        </Col>
                      </Row>
                    </CardBody>
                  </>
                )}

                <CardBody>
                  <Col xs={12}>
                    <Row className="custom-options-checkable">
                      <Col md={12} className="mb-md-0 mb-2">
                        <label
                          className="custom-option-item px-2 py-1"
                          style={{ cursor: "default" }}
                        >
                          <CreditCard className="font-medium-10 me-50 mb-1" />
                          <span className="d-flex align-items-center mb-50">
                            <span className="custom-option-item-title h4 fw-bolder mb-0">
                              Credit/Debit Card
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
                    <Container>
                      <Row className="justify-content-center align-items-center">
                        <Col md={6} className="text-center">
                          <Cards
                            number={maskCardNumberForCard(
                              cardDetails.cardNumber
                            )}
                            name={cardDetails.nameOnCard}
                            expiry={cardDetails.expiry}
                            cvc={maskCVC(cardDetails.cvc)}
                            focused={cardDetails.focus}
                          />
                        </Col>

                        <Col md={6}>
                          <Row>
                            <Col sm="6" className="mb-2">
                              <Label for="number">
                                Card Number{" "}
                                <span className="text-danger">*</span>
                              </Label>
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
                                      field.onChange(e);
                                      const value = e.target.value;

                                      setCardDetails((prev) => ({
                                        ...prev,
                                        cardNumber: value,
                                      }));

                                      const cardType = detectCardType(value);
                                      setValue("cardType", cardType);
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
                              <Label for="name">
                                Name On Card{" "}
                                <span className="text-danger">*</span>
                              </Label>

                              <Controller
                                name="nameOnCard"
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
                                      field.onChange(e);
                                      handleInputChange(e);
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
                                      field.onChange(e);
                                      handleInputChange(e);
                                    }}
                                    onFocus={handleInputFocus}
                                    invalid={!!errors.cardType}
                                  />
                                )}
                              />
                            </Col>

                            <Col sm="6" className="mb-2">
                              <Label for="cardCvv">
                                CVV <span className="text-danger">*</span>
                              </Label>
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
                                      field.onChange(e);
                                      handleInputChange(e);
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
                                Expiry Year{" "}
                                <span className="text-danger">*</span>
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
                                Expiry Month{" "}
                                <span className="text-danger">*</span>
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
