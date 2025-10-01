import CryptoJS from "crypto-js";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { useLocation } from "react-router-dom";
import Select from "react-select";

import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row,
    Spinner,
    UncontrolledAlert,
} from "reactstrap";
import Qr_Payment from "../../../../event_management/Qr_Payment";
// import Qr_Payment from "./Qr_Payment";

function Payment({ stepper }) {
  const CompanyOptions = [
    { value: "WesternUnion", label: "WesternUnion" },
    { value: "MoneyGrams", label: "MoneyGrams" },
    { value: "Other", label: "Other" },
  ];
  const navigate = useNavigate();
  const [mode, setMode] = useState("");
  const [value, setValuedis] = useState("");
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  console.log("location rrom oayment", location.state);
  const uidOfEvent = location?.state?.uidOfEvent;
  const myData = location?.state?.resAlldata;
  console.log(myData);

  const myallData = location?.state?.resAlldata?.alldata;
  const bookedDataForExtra = location?.state?.resAlldata?.preBookingData;
  const roomBookingUid = location?.state?.roomUid;
  const { finalAmount } = location?.state;
  //this is for extend date payment
  const ExtendDateData = location?.state?.extendResDate;
  const { payableAmount } = location?.state?.extendResDate || {};

  // for pending payments
  const pendingPayment = location?.state.row || {};
  const { checkInDate, checkOutDate, remainingAmount, paymentStatus } =
    pendingPayment;

  console.log("ExtendDateData", pendingPayment);
  const today = new Date().toISOString().split("T")[0];
  const AccountType = [
    { value: "8", label: "Personal Checking Account" },
    { value: "9", label: "Personal Saving Account" },
    { value: "10", label: "Business Checking Account" },
    { value: "11", label: "Business Savings Account" },
  ];
  const colourOptions3 = [
    { value: "1", label: "Credit Card" },
    { value: "2", label: "Card Swipe" },
    { value: "3", label: "Cash" },
    { value: "4", label: "Cheque21" },
    { value: "5", label: "ChequeACH" },
    { value: "7", label: "Payment Link" },
    { value: "8", label: "QR Code" },
  ];
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      advancePayment: false,
      discount: false,

      finalAmount: !ExtendDateData ? finalAmount || 0 : payableAmount || 0,
    },
  });
  const toast = useRef(null);

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      marginTop: "5rem", // adds space when menuPlacement is "bottom"
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
    }),
  };
  // {{ }}
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
  const currentMonth = new Date().getMonth() + 1;

  const years = Array.from({ length: 10 }, (_, i) => {
    return {
      value: currentYear + i,
      label: currentYear + i,
    };
  });

  useEffect(() => {
    if (pendingPayment && paymentStatus === "Pending") {
      setValue("finalAmount", remainingAmount);
    }
  }, [pendingPayment, remainingAmount]);

  const handleYearChange = (selectedYear) => {
    const selectedYearValue = selectedYear ? selectedYear.value : currentYear;

    if (selectedYearValue === currentYear) {
      const currentMonth = new Date().getMonth() + 1; // Current month (1-12)
      const filteredMonths = months.filter(
        (month) => month.value >= currentMonth
      );
      setAvailableMonths(filteredMonths);
    } else {
      // If it's a future year, show all months
      setAvailableMonths(months);
    }
  };
  useEffect(() => {
    setAvailableMonths(months);
  }, []);

  useEffect(() => {
    if (finalAmount) {
      setValue("finalAmount", finalAmount);
    }
  }, [finalAmount]);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qr, setQr] = useState(null);
  const [paymentMode, setpaymentMode] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const advancePayment = watch("advancePayment");
  const [verify, setVerify] = useState(false);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [errorMessage, setErrorMsz] = useState("");
  const [cardType, setCardType] = useState("");

  const handlepaymentMode = (selectedOption) => {
    const selectedType = selectedOption?.label; // Extract the value

    if (selectedType) {
      setpaymentMode(selectedType);
    }
  };
  const [showModal, setShowModal] = useState(false);

  const handleAdvance = watch("advance");
  const handleRemaining = watch("remainingPayment");
  const handleFinal = watch("finalAmount");
  const isDiscount = watch("discount");
  const CurrentAmount = watch("PfinalAmount");

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const renderFilePreview = (file) => {
    if (file && file.type.startsWith("image")) {
      return (
        <img
          className="rounded mt-2"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="100"
        />
      );
    }
    return null;
  };

  // encrypt the pin number
  const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";

  function generateKey(secretKey) {
    return CryptoJS.SHA256(secretKey);
  }

  function generateIV() {
    return CryptoJS.lib.WordArray.random(16);
  }

  function encryptAES(plainText) {
    const key = generateKey(SECRET_KEY);
    const iv = generateIV();

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
  }

  const detectedCardType = (number) => {
    const patterns = {
      Visa: /^4/,
      MasterCard: /^5[1-5]/,
      Discover: /^6/,
      RuPay: /^(60|65)\d{0,}/,
      ChinaUnionPay: /^62/,
      Amex: /^3[47]\d{0,}/,
    };

    for (let [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) return type; // Check for matching card type
    }
    return "";
  };

  const getCvvLength = (cardType) => {
    return cardType === "Amex" ? 4 : 3;
  };

  const handleOnchangeCardNum = (e, field) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    let detectedType = detectedCardType(value);

    if (detectedType === "Amex") {
      value = value.slice(0, 15);
    } else {
      value = value.slice(0, 16);
    }
    setCardType(detectedType); // Update state for UI
    setValue("cardType", detectedType); // Update form field
    field.onChange(value); // Update React Hook Form
  };

  useEffect(() => {
    if (!advancePayment) {
      setValue("advance", "");
      setValue("remainingPayment", "");
    }
  }, [advancePayment]);

  // calculation for discount
  useEffect(() => {
    if (
      watch("discount") &&
      watch("discount_amt") &&
      mode === "Flat" &&
      !watch("advancePayment")
    ) {
      const afterDiscount = handleFinal - watch("discount_amt");
      setValue("PfinalAmount", afterDiscount);
    } else if (
      watch("discount") &&
      watch("discount_amt") &&
      mode === "Percentage" &&
      !watch("advancePayment")
    ) {
      const percentageAmount = (handleFinal * watch("discount_amt")) / 100;
      const afterDiscount = handleFinal - percentageAmount;
      setValue("PfinalAmount", afterDiscount);
    }
  }, [watch("discount"), watch("discount_amt"), mode, watch("advancePayment")]);

  // ** Advance payment calculation
  useEffect(() => {
    if (!watch("discount") && watch("advance") && watch("advancePayment")) {
      const afterDiscount = handleFinal - watch("advance");
      setValue("PfinalAmount", watch("advance"));
      setValue("remainingPayment", afterDiscount);
    }
  }, [watch("advance"), watch("advancePayment"), watch("discount")]);

  // Adv dis calculation
  useEffect(() => {
    if (watch("discount") && mode === "Flat" && watch("advancePayment")) {
      if (watch("discount_amt") && watch("advance")) {
        const afterDiscount =
          handleFinal - watch("discount_amt") - watch("advance");

        setValue("remainingPayment", afterDiscount);
        setValue("PfinalAmount", watch("advance"));
      }
      if (!watch("discount_amt") && watch("advance")) {
        const afterDiscount = handleFinal - watch("advance");
        setValue("remainingPayment", afterDiscount);
        setValue("PfinalAmount", watch("advance"));
      }
      if (watch("discount_amt") && !watch("advance")) {
        const afterDiscount = handleFinal - watch("discount_amt");
        setValue("remainingPayment", afterDiscount);
      }
    } else if (
      watch("discount") &&
      mode === "Percentage" &&
      watch("advancePayment")
    ) {
      if (watch("discount_amt") && watch("advance")) {
        //
        const percentageAmount = (handleFinal * watch("discount_amt")) / 100;
        const afterDiscount = handleFinal - percentageAmount - watch("advance");

        setValue("remainingPayment", afterDiscount);
        setValue("PfinalAmount", watch("advance"));
      }
      if (!watch("discount_amt") && watch("advance")) {
        const afterDiscount = handleFinal - watch("advance");
        setValue("remainingPayment", afterDiscount);
        setValue("PfinalAmount", watch("advance"));
      }
      if (watch("discount_amt") && !watch("advance")) {
        const percentageAmount = (handleFinal * watch("discount_amt")) / 100;
        const afterDiscount = handleFinal - percentageAmount;

        setValue("remainingPayment", afterDiscount);
        setValue("PfinalAmount", afterDiscount);
      }
    }
  }, [
    watch("discount"),
    watch("discount_amt"),
    mode,
    watch("advance"),
    watch("advancePayment"),
  ]);

  useEffect(() => {
    if (
      !watch("discount") &&
      !watch("advancePayment") &&
      watch("PfinalAmount")
    ) {
      setValue("PfinalAmount", "");
    }
  }, [watch("discount"), watch("advancePayment")]);

  useEffect(() => {
    if (!watch("advancePayment") && !watch("discount")) {
      setValue("PfinalAmount", watch("finalAmount"));
    }
  }, [
    !watch("advancePayment"),
    !watch("discount"),
    setValue,
    watch("finalAmount"),
  ]);

  useEffect(() => {
    if (verify) {
      if (mode === "Flat") {
        const discountAmt = watch("discount_amt");
        setDiscountAmt(discountAmt);
      }
      if (mode === "Percentage") {
        const discountpercentage = (watch("discount_amt") / 100) * handleFinal;

        setDiscountPercentage(discountpercentage);
      }
    }
  }, [mode, handleFinal, watch("discount_amt")]);
  const disAmt = watch("discount_amt");
  const renderFileSize = (size) => {
    if (size) {
      if (Math.round(size / 100) / 10 > 1000) {
        return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
      } else {
        return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
      }
    }
    return null;
  };
  const onSubmit = async (data) => {
    setErrorMsz("");
    setLoading(true);

    const otpArray = data.otp || [];
    const pin = otpArray?.join("");

    const formData = new FormData();

    const encrypted = encryptAES(pin);

    let bookingUid;

    // Determine bookingUid based on payment conditions
    if (payableAmount) {
      bookingUid = ExtendDateData?.bookingUid;
    } else if (pendingPayment && remainingAmount) {
      bookingUid = pendingPayment?.uid;
    } else {
      bookingUid = roomBookingUid;
    }

    // console.log("extra data ",extraData);
    if (location?.state?.extraRoomMode) {
      formData.append(`roomBookings[${0}].roomSearch.uid`, myData?.searchUid);

      formData.append(`roomBookings[${0}].subtotal`, finalAmount);
      formData.append(`roomBookings[${0}].finalAmount`, finalAmount);
      formData.append(
        `roomBookings[${0}].numberOfDays`,
        bookedDataForExtra[0]?.totalNoOfDays
      );

      // bookedDataForExtra.forEach((x) => {
      formData.append(
        `roomBookings[${0}].checkInDate`,
        bookedDataForExtra[0]?.checkInDate
      );
      formData.append(
        `roomBookings[${0}].checkOutDate`,
        bookedDataForExtra[0]?.checkOutDate
      );
      formData.append(
        `roomBookings[${0}].numberOfGuests`,
        bookedDataForExtra[0]?.numberOfGuests
      );

      formData.append(`roomBookings[${0}].specialRequirement`, "none");
      // });
    }

    // Basic booking details
    if (!location?.state?.extraRoomMode) {
      formData.append("roomBooking.uid", bookingUid);
      formData.append("roomBooking.isAdvancesPaymnet", data?.advancePayment);
    }
    if (data?.advancePayment) {
      formData.append("roomBooking.remainingAmount", data?.remainingPayment);
      formData.append("roomBooking.advancePaymentAmout", data?.advance);
    }

    // Payment common details
    formData.append("payment.finalPayment", data?.PfinalAmount);
    formData.append("payment.paymentMode", data?.paymentMode?.value);

    // Payment mode-specific details
    const paymentModeLabel = watch("paymentMode")?.label;

    if (paymentModeLabel === "Credit Card") {
      formData.append("payment.cardNumber", data.cardNumber);
      formData.append("payment.cardType", data.cardType);
      formData.append("payment.cardExpiryYear", data.cardExpiryYear);
      formData.append("payment.cardExpiryMonth", data.cardExpiryMonth);
      formData.append("payment.cardCvv", data.cardCvv);
      formData.append("payment.nameOnCard", data.nameOnCard);
    } else if (paymentModeLabel === "Card Swipe") {
      formData.append(
        "payment.cardSwipeTransactionId",
        data?.cardSwipeTransactionId
      );
    } else if (paymentModeLabel === "Cash") {
      formData.append("roomBooking.pin", encrypted);
    } else if (paymentModeLabel === "Cheque21") {
      if (!file) {
        alert("Please select a file first.");
        return;
      }
      formData.append("payment.bankName", data.bankName);
      formData.append("payment.nameOnAccount", data.nameOnAccount);
      formData.append("payment.routingNumber", data.routingNumber);
      formData.append("payment.accountNumber", data.accountNumber);
      formData.append("payment.chequeNumber", data.chequeNumber);
      formData.append("payment.chequeImage", file);
    } else if (paymentModeLabel === "ChequeACH") {
      formData.append("payment.bankName", data.bankName);
      formData.append("payment.nameOnAccount", data.nameOnAccount);
      formData.append("payment.routingNumber", data.routingNumber);
      formData.append("payment.accountNumber", data.accountNumber);
      formData.append("payment.accountType", data.accountType?.value);
    } else {
      console.log("Choose a different payment method.");
    }

    try {
      let res;
      // {{ }}
      if (location?.state?.extraRoomMode) {
        res = await useJwt.addExtraRoom(uidOfEvent, formData);
      } else {
        res = await useJwt.bookingPayment(formData);
      }

      const { qr_code_base64 } = res?.data;
      setQr(qr_code_base64);
      if (qr_code_base64) {
        setShowQrModal(true);
      }

      if (res?.data?.status == "success") {
        const payload = {
          bookingUid: ExtendDateData?.bookingUid,
          noOfDays: ExtendDateData?.extendedDays,
          noOfGuest: ExtendDateData?.totalExtraPeopleAmount,
          newCheckOutDate: ExtendDateData?.newCheckOutDate,
          payableAmount: ExtendDateData?.payableAmount,
        };

        if (payableAmount > 0) {
          if (res?.status) {
            try {
              const res = await useJwt.ExtendDataUpdate(payload);
              console.log("ExtendDataUpdate", res);
            } catch (error) {
              console.log("ExtendDataUpdate", error);
            }
          }
        }

        if (res?.data?.status === "success") {
          toast.current.show({
            severity: "success",
            summary: "Successfully",
            detail: "Payment Completed Successfully.",
            life: 2000,
          });

          setTimeout(() => {
            navigate("/bookingListing");
          }, 1999);
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail: "Payment Failed. Please try again.",
          life: 2000,
        });
      }
    } catch (error) {
      console.error(error);

      const errMsz =
        error?.response?.data?.content ||
        "An error occurred while processing your request.";
      setErrorMsz(errMsz);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />

      <Form onSubmit={handleSubmit(onSubmit)}>
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
          Payment Information
        </CardTitle>
        <Row>
          <Col sm="12">
            {errorMessage && (
              <React.Fragment>
                <UncontrolledAlert color="danger">
                  <div className="alert-body">
                    <span className="text-danger fw-bold">
                      <strong>Error ! </strong>
                      {errorMessage}
                    </span>
                  </div>
                </UncontrolledAlert>
              </React.Fragment>
            )}
          </Col>

          <Col md="8" className="mb-1">
            <Card>
              <CardBody>
                <Col md="12" className="mb-1">
                  <Label for="finalInvoice">Final Amount</Label>
                  <Controller
                    name="finalAmount"
                    control={control}
                    rules={{ required: "Final  amount is required", min: 0 }}
                    render={({ field }) => (
                      <Input
                        type="number"
                        id="finalAmount"
                        disabled={true}
                        placeholder="Enter total  amount"
                        invalid={!!errors.finalAmount}
                        {...field}
                      />
                    )}
                  />
                  {errors.finalAmount && (
                    <FormFeedback>{errors.finalAmount.message}</FormFeedback>
                  )}
                </Col>

                <Row>
                  {/* {pendingPayment && today < checkInDate && ( */}
                  {!location?.state?.extraRoomMode && (
                    <>
                      {!payableAmount && (
                        <>
                          <Col check className="mb-2">
                            <Label check>
                              <Controller
                                name="advancePayment"
                                control={control}
                                render={({ field }) => (
                                  <Input {...field} type="checkbox" />
                                )}
                              />{" "}
                              Advance Payment
                            </Label>
                          </Col>

                          {advancePayment && (
                            <>
                              <Col md="12" className="mb-1">
                                <Label for="">Advance Payment</Label>
                                <Controller
                                  name="advance"
                                  control={control}
                                  rules={{
                                    required: "Advance payment is required",
                                    min: {
                                      value: 0,
                                      message: "Value cannot be negative",
                                    },
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      type="number"
                                      defaultValue="1"
                                      id="advance"
                                      placeholder="Enter advance amount"
                                      invalid={!!errors.advance}
                                      onWheel={(e) => e.target.blur()}
                                      {...field}
                                      onChange={(e) => {
                                        // Remove everything that's not a digit
                                        const onlyNumbers =
                                          e.target.value.replace(/\D/g, ""); // \D = non-digit
                                        field.onChange(onlyNumbers);
                                      }}
                                    />
                                  )}
                                />
                                {errors.advance && (
                                  <FormFeedback>
                                    {errors.advance.message}
                                  </FormFeedback>
                                )}
                              </Col>
                              <Col md="12" className="mb-1">
                                <Label for="advancePayment">
                                  Remaining Payment
                                </Label>
                                <Controller
                                  name="remainingPayment"
                                  control={control}
                                  defaultValue="0"
                                  rules={{
                                    required: "Remaining payment is required",
                                    min: {
                                      value: 0,
                                      message: "Amount cannot be negative",
                                    },
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      type="number"
                                      id="remainingPayment"
                                      placeholder="Enter Remaining amount"
                                      disabled={true}
                                      invalid={!!errors.advancePayment}
                                      {...field}
                                    />
                                  )}
                                />
                                {errors.remainingPayment && (
                                  <FormFeedback>
                                    {errors.remainingPayment.message}
                                  </FormFeedback>
                                )}
                              </Col>
                            </>
                          )}
                        </>
                      )}
                      <Col md="12" className="mb-1">
                        <Label for="finalInvoice">
                          Currently Amount Payable
                        </Label>
                        <Controller
                          name="PfinalAmount"
                          control={control}
                          rules={{
                            required: "Final amount is required",
                            // min: {
                            //   value: 0,
                            //   message: "Amount cannot be negative",
                            // },
                          }}
                          render={({ field }) => (
                            <Input
                              type="number"
                              id="PfinalAmount"
                              disabled={true}
                              placeholder="Enter total  amount"
                              invalid={!!errors.PfinalAmount}
                              {...field}
                            />
                          )}
                        />
                        {errors.PfinalAmount && (
                          <FormFeedback>
                            {errors.PfinalAmount.message}
                          </FormFeedback>
                        )}
                      </Col>
                    </>
                  )}
                  {/* )} */}
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="hf-picker">
                      Payment Mode <span style={{ color: "red" }}>*</span>
                    </Label>

                    <Controller
                      name="paymentMode"
                      control={control}
                      rules={{
                        required: "payment Mode  is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={colourOptions3}
                          className={`react-select ${
                            errors.paymentMode ? "is-invalid" : ""
                          }`}
                          onChange={(selectedOption) => {
                            const value = selectedOption
                              ? selectedOption.value
                              : "";
                            field.onChange(selectedOption); // Update React Hook Form with the value
                            handlepaymentMode(selectedOption); // Run your custom function with the full option
                          }}
                          menuPlacement={!payableAmount ? "top" : "auto"}
                          styles={customStyles}
                          // isDisabled={statusThree}
                        />
                      )}
                    />

                    {errors.paymentMode && (
                      <FormFeedback className="d-block">
                        {errors.paymentMode.value?.message ||
                          errors.paymentMode.message}
                      </FormFeedback>
                    )}
                  </Col>
                </Row>

                {paymentMode === "Cash" && (
                  <>
                    <Row>
                      <Label className="form-label" for="companyName">
                        Enter 4 digit Pin{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Col md="6" className="mb-1">
                        <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                          {[...Array(4)].map((_, index) => (
                            <Controller
                              key={index}
                              name={`otp[${index}]`}
                              control={control}
                              rules={{
                                required: "All OTP digits are required",
                                pattern: {
                                  value: /^[0-9]$/,
                                  message: "Each OTP digit must be a number",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  maxLength="1"
                                  className={`auth-input height-50 text-center numeral-mask mx-25 mb-1 ${
                                    errors.otp?.[index] ? "is-invalid" : ""
                                  }`}
                                  autoFocus={index === 0}
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    // Update the value in the form
                                    field.onChange(e);

                                    // If value is entered, focus on the next input
                                    if (value && index < 5) {
                                      const nextInput = document.getElementById(
                                        `otp-input-${index + 1}`
                                      );
                                      if (nextInput) {
                                        nextInput.focus();
                                      }
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    // If Backspace is pressed and the field is empty, focus on the previous input
                                    if (
                                      e.key === "Backspace" &&
                                      !field.value &&
                                      index > 0
                                    ) {
                                      const prevInput = document.getElementById(
                                        `otp-input-${index - 1}`
                                      );
                                      if (prevInput) {
                                        prevInput.focus();
                                      }
                                    }
                                  }}
                                  id={`otp-input-${index}`} // Adding an ID to each input for easier targeting
                                />
                              )}
                            />
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </>
                )}

                {paymentMode === "Credit Card" && (
                  <>
                    <Row>
                      <div className="content-header">
                        <h5 className="mb-0 my-2">Credit Card Details</h5>
                        <small>Fill Credit Card Details</small>
                      </div>
                    </Row>

                    <Row>
                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="payment-card-number">
                          Card Number <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="cardNumber"
                          rules={{
                            required: "Card Number is required",
                            maxLength: cardType === "Amex" ? 15 : 16,
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Card Number"
                              invalid={!!errors.cardNumber}
                              {...field}
                              // isDisabled={statusThree}

                              onChange={(e) => handleOnchangeCardNum(e, field)}
                            />
                          )}
                        />
                        {errors.cardNumber && (
                          <FormFeedback>
                            {errors.cardNumber.message}
                          </FormFeedback>
                        )}
                      </Col>

                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="card-type">
                          Card Type <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="cardType"
                          rules={{
                            required: "Card Type is required",
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              value={cardType}
                              readOnly
                              invalid={!!errors.nameOnCard}
                              {...field}
                              // style={getReadOnlyStyle()}
                            />
                          )}
                        />
                        {errors.cardType && (
                          <FormFeedback>{errors.cardType.message}</FormFeedback>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="card-expiry-year">
                          Card Expiry Year{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="cardExpiryYear"
                          control={control}
                          rules={{
                            required: "Expiry Year is required",
                            min: currentYear,
                            message: "Expiry Year cannot be in the past",
                          }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={years}
                              placeholder="Select Year"
                              className={`react-select ${
                                errors.cardExpiryYear ? "is-invalid" : ""
                              }`}
                              classNamePrefix="select"
                              isClearable
                              // Set the selected value
                              value={years.find(
                                (option) => option.value === field.value
                              )}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || "");
                                handleYearChange(selectedOption); // Update available months based on year
                              }}
                            />
                          )}
                        />
                        {errors.cardExpiryYear && (
                          <FormFeedback>
                            {errors.cardExpiryYear.message}
                          </FormFeedback>
                        )}
                      </Col>

                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="card-expiry-month">
                          Card Expiry Month{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="cardExpiryMonth"
                          control={control}
                          rules={{
                            required: "Expiry Month is required",
                            min: 1,
                            max: 12,
                            message: "Expiry Month must be between 1 and 12",
                          }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={availableMonths}
                              placeholder="Select Month"
                              className={`react-select ${
                                errors.cardExpiryMonth ? "is-invalid" : ""
                              }`}
                              classNamePrefix="select"
                              isClearable
                              value={availableMonths.find(
                                (option) => option.value === field.value
                              )}
                              // Extract the `value` on change
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || "")
                              }
                            />
                          )}
                        />
                        {errors.cardExpiryMonth && (
                          <FormFeedback>
                            {errors.cardExpiryMonth.message}
                          </FormFeedback>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="payment-cvv">
                          Card CVV <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="cardCvv"
                          control={control}
                          rules={{
                            required: "CVV is required",
                            maxLength: getCvvLength(cardType), // Dynamically set maxLength
                          }}
                          render={({ field }) => (
                            <Input
                              type="password" // Change type to text
                              maxLength={getCvvLength(cardType)} // Dynamically set maxLength
                              placeholder="Enter CVV Number"
                              invalid={!!errors.cardCvv}
                              {...field}
                              // isDisabled={statusThree}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                if (
                                  numericValue.length <= getCvvLength(cardType)
                                ) {
                                  field.onChange(numericValue);
                                }
                              }}
                            />
                          )}
                        />

                        {errors.cardCvv && (
                          <FormFeedback>{errors.cardCvv.message}</FormFeedback>
                        )}
                      </Col>
                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="card-holder-name">
                          Card Holder's Name{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="nameOnCard"
                          control={control}
                          rules={{ required: "Card Holder's Name is required" }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Card Holder's Name"
                              invalid={!!errors.nameOnCard}
                              {...field}
                              // isDisabled={statusThree}
                              onChange={(e) => {
                                const onlyAlphabetsAndSpaces =
                                  e.target.value.replace(
                                    /[^a-zA-Z\s]/g, // allow letters and spaces
                                    ""
                                  );
                                field.onChange(onlyAlphabetsAndSpaces);
                              }}
                            />
                          )}
                        />
                        {errors.nameOnCard && (
                          <FormFeedback>
                            {errors.nameOnCard.message}
                          </FormFeedback>
                        )}
                      </Col>
                    </Row>

                    {/* Address Fields */}
                    {/* <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="address">
                      Address <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="address"
                      control={control}
                      rules={{
                        required: "Address is required",
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter Address"
                          invalid={!!errors.address}
                          {...field}
                          // isDisabled={statusThree}
                          onChange={(e) => {
                            const onlyAlphabets = e.target.value.replace(
                              /[^a-zA-Z]/g,
                              ""
                            );
                            field.onChange(onlyAlphabets);
                          }}
                        />
                      )}
                    />
                    {errors.address && (
                      <FormFeedback>{errors.address.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="city">
                      City <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="city"
                      rules={{
                        required: "City is required",
                      }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter City"
                          invalid={!!errors.city}
                          {...field}
                          // isDisabled={statusThree}
                          onChange={(e) => {
                            const onlyAlphabets = e.target.value.replace(
                              /[^a-zA-Z]/g,
                              ""
                            );
                            field.onChange(onlyAlphabets);
                          }}
                        />
                      )}
                    />
                    {errors.city && (
                      <FormFeedback>{errors.city.message}</FormFeedback>
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="state">
                      State <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="state"
                      rules={{
                        required: "State is required",
                      }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter State"
                          invalid={!!errors.state}
                          {...field}
                          // isDisabled={statusThree}
                          onChange={(e) => {
                            const onlyAlphabets = e.target.value.replace(
                              /[^a-zA-Z]/g,
                              ""
                            );
                            field.onChange(onlyAlphabets);
                          }}
                        />
                      )}
                    />
                    {errors.state && (
                      <FormFeedback>{errors.state.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="country">
                      Country <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="country"
                      rules={{
                        required: "Country is required",
                      }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter Country"
                          invalid={!!errors.country}
                          {...field}
                          // isDisabled={statusThree}
                          onChange={(e) => {
                            const onlyAlphabets = e.target.value.replace(
                              /[^a-zA-Z]/g,
                              ""
                            );
                            field.onChange(onlyAlphabets);
                          }}
                        />
                      )}
                    />
                    {errors.country && (
                      <FormFeedback>{errors.country.message}</FormFeedback>
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="pincode">
                      Pincode <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="pinCode"
                      rules={{
                        required: "Pincode is required",
                        pattern: {
                          value: /^\d{6}$/,
                          message: "Pincode must be exactly 6 digits",
                        },
                      }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter Pincode"
                          invalid={!!errors.pinCode}
                          {...field}
                          onChange={(e) => {
                            // Allow only numbers
                            const onlyNumbers = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            field.onChange(onlyNumbers);
                          }}
                        />
                      )}
                    />
                    {errors.pinCode && (
                      <FormFeedback>{errors.pinCode.message}</FormFeedback>
                    )}
                  </Col>
                </Row> */}
                  </>
                )}

                {paymentMode === "Cheque21" && (
                  <>
                    <div className="content-header">
                      <h5 className="mb-0 my-2">Bank Details</h5>
                      <small>Fill Bank Details</small>
                    </div>
                    <Row>
                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="bankName">
                          Bank Name <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          control={control}
                          rules={{
                            required: "Bank Name is required",
                            minLength: {
                              value: 3,
                              message:
                                "Bank Name must be at least 3 characters",
                            },
                          }}
                          name="bankName"
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Bank Name"
                              invalid={!!errors.bankName}
                              {...field}
                              onChange={(e) => {
                                const onlyAlphabetsAndSpaces =
                                  e.target.value.replace(
                                    /[^a-zA-Z\s]/g, // allow letters and spaces
                                    ""
                                  );
                                field.onChange(onlyAlphabetsAndSpaces);
                              }}
                            />
                          )}
                        />
                        {errors.bankName && (
                          <FormFeedback>{errors.bankName.message}</FormFeedback>
                        )}
                      </Col>

                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="nameOnAccount">
                          Account Name <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="nameOnAccount"
                          control={control}
                          rules={{
                            required: "Account Name is required",
                            minLength: {
                              value: 3,
                              message:
                                "Account Name must be at least 3 characters",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Account Name"
                              invalid={!!errors.nameOnAccount}
                              {...field}
                              // isDisabled={statusThree}
                              onChange={(e) => {
                                const onlyAlphabetsAndSpaces =
                                  e.target.value.replace(
                                    /[^a-zA-Z\s]/g, // allow letters and spaces
                                    ""
                                  );
                                field.onChange(onlyAlphabetsAndSpaces);
                              }}
                            />
                          )}
                        />
                        {errors.nameOnAccount && (
                          <FormFeedback>
                            {errors.nameOnAccount.message}
                          </FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" className="mb-1">
                        <Label className="form-label" for="routingNumber">
                          Routing Number <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="routingNumber"
                          rules={{
                            required: "Routing number is required",
                            pattern: {
                              value: /^[0-9]{9}$/,
                              message:
                                "Routing number must be exactly 9 digits",
                            },
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Enter Routing Number"
                              invalid={!!errors.routingNumber}
                              // isDisabled={statusThree}
                              {...field}
                              onChange={(e) => {
                                // Allow only numbers
                                let value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );

                                // Allow only 9 digits max
                                value = value.slice(0, 9);

                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        {errors.routingNumber && (
                          <FormFeedback>
                            {errors.routingNumber.message}
                          </FormFeedback>
                        )}
                      </Col>

                      <Col md="4" className="mb-1">
                        <Label className="form-label" for="accountNumber">
                          Account Number <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="accountNumber"
                          rules={{
                            required: "Account Number is required",
                            minLength: {
                              value: 8,
                              message:
                                "Account Number must be at least 8 digits",
                            },
                            maxLength: {
                              value: 16,
                              message: "Account Number can't exceed 16 digits",
                            },
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Account Number must be numeric",
                            },
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Enter Account Number"
                              invalid={!!errors.accountNumber}
                              {...field}
                              // isDisabled={statusThree}
                              onChange={(e) => {
                                // allow only digits
                                let value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );

                                // restrict to max 16 digits
                                if (value.length > 16) {
                                  value = value.slice(0, 16);
                                }

                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        {errors.accountNumber && (
                          <FormFeedback>
                            {errors.accountNumber.message}
                          </FormFeedback>
                        )}
                      </Col>

                      <Col md="4" className="mb-1">
                        <Label className="form-label" for="chequeNumber">
                          Cheque Number <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="chequeNumber"
                          control={control}
                          rules={{
                            required: "Cheque Number is required",
                            minLength: {
                              value: 6,
                              message:
                                "Cheque Number must be at least 6 digits",
                            },
                            maxLength: {
                              value: 12,
                              message: "Cheque Number cannot exceed 12 digits",
                            },
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Cheque Number must be numeric",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Enter Cheque Number"
                              invalid={!!errors.chequeNumber}
                              {...field}
                              maxLength="12"
                              // isDisabled={statusThree}
                              onChange={(e) => {
                                // allow only digits
                                let value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );

                                // restrict to max 12 digits
                                if (value.length > 12) {
                                  value = value.slice(0, 12);
                                }

                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        {errors.chequeNumber && (
                          <FormFeedback>
                            {errors.chequeNumber.message}
                          </FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Card>
                        <CardHeader>
                          <CardTitle tag="h4">
                            Upload Cheque Image
                            <span style={{ color: "red" }}>*</span>
                          </CardTitle>
                        </CardHeader>
                        <CardBody>
                          <FormGroup>
                            <Label for="fileUpload">Upload File:</Label>
                            <Input
                              type="file"
                              id="fileUpload"
                              onChange={handleFileChange}
                              accept="image/*"
                              // isDisabled={statusThree}
                            />
                          </FormGroup>

                          {file && (
                            <div className="mt-3">
                              <h6>File Details:</h6>
                              <p>Name: {file.name}</p>
                              <p>Size: {renderFileSize(file.size)}</p>
                              {renderFilePreview(file)}
                              <div className="d-flex justify-content-end mt-2">
                                <Button
                                  color="danger"
                                  outline
                                  onClick={handleRemoveFile}
                                >
                                  Remove File
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </Row>
                  </>
                )}

                {paymentMode === "ChequeACH" && (
                  <>
                    <div className="content-header">
                      <h5 className="mb-0 my-2">Bank Details</h5>
                      <small>Fill Bank Details</small>
                    </div>

                    <Row>
                      <Col md="12" className="mb-1">
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
                              // isDisabled={statusThree}

                              // onChange={(selectedOption) => {
                              //   const value = selectedOption ? selectedOption.value : "";
                              //   field.onChange(selectedOption); // Update React Hook Form with the value
                              //   handlepaymentMode(selectedOption); // Run your custom function with the full option
                              // }}
                            />
                          )}
                        />
                        {errors.accountType && (
                          <FormFeedback>
                            {errors.accountType.message}
                          </FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="bankName">
                          Bank Name <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          control={control}
                          rules={{
                            required: "Bank Name is required",
                            minLength: {
                              value: 3,
                              message:
                                "Bank Name must be at least 3 characters",
                            },
                            maxLength: {
                              value: 50,
                              message: "Bank Name can't exceed 50 characters",
                            },
                            pattern: {
                              value: /^[A-Za-z ]+$/,
                              message:
                                "Bank Name Can Only contain letters and Spaces",
                            },
                          }}
                          name="bankName"
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Bank Name"
                              invalid={!!errors.bankName}
                              {...field}
                              // isDisabled={statusThree}

                              onChange={(e) => {
                                const onlyAlphabetsAndSpaces =
                                  e.target.value.replace(
                                    /[^a-zA-Z\s]/g, // allow letters and spaces
                                    ""
                                  );
                                field.onChange(onlyAlphabetsAndSpaces);
                              }}
                            />
                          )}
                        />
                        {errors.bankName && (
                          <FormFeedback>{errors.bankName.message}</FormFeedback>
                        )}
                      </Col>

                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="nameOnAccount">
                          Account Name <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="nameOnAccount"
                          control={control}
                          rules={{
                            required: "Account Name is required",
                            minLength: {
                              value: 3,
                              message:
                                "Account Name must be at least 3 characters",
                            },
                            maxLength: {
                              value: 50,
                              message:
                                "Account Name can't exceed 50 characters",
                            },
                            pattern: {
                              value: /^[A-Za-z. ]+$/,
                              message:
                                "Account Name can only contain letters, dots, and spaces",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Account Name"
                              invalid={!!errors.nameOnAccount}
                              {...field}
                              // isDisabled={statusThree}

                              onChange={(e) => {
                                const onlyAlphabetsAndSpaces =
                                  e.target.value.replace(
                                    /[^a-zA-Z\s]/g, // allow letters and spaces
                                    ""
                                  );
                                field.onChange(onlyAlphabetsAndSpaces);
                              }}
                            />
                          )}
                        />
                        {errors.nameOnAccount && (
                          <FormFeedback>
                            {errors.nameOnAccount.message}
                          </FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="routingNumber">
                          Routing Number <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="routingNumber"
                          rules={{
                            required: "Routing number is required",
                            pattern: {
                              value: /^[0-9]{9}$/,
                              message:
                                "Routing number must be exactly 9 digits",
                            },
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Enter Routing Number"
                              invalid={!!errors.routingNumber}
                              {...field}
                              onChange={(e) => {
                                // Allow only numbers
                                let value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );

                                // Allow only 9 digits max
                                value = value.slice(0, 9);

                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        {errors.routingNumber && (
                          <FormFeedback>
                            {errors.routingNumber.message}
                          </FormFeedback>
                        )}
                      </Col>

                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="accountNumber">
                          Account Number <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="accountNumber"
                          rules={{
                            required: "Account Number is required",
                            minLength: {
                              value: 8,
                              message:
                                "Account Number must be at least 8 digits",
                            },
                            maxLength: {
                              value: 16,
                              message: "Account Number can't exceed 16 digits",
                            },
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Account Number must be numeric",
                            },
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Enter Account Number"
                              invalid={!!errors.accountNumber}
                              {...field}
                              // isDisabled={statusThree}
                              onChange={(e) => {
                                // allow only digits
                                let value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );

                                // restrict to max 16 digits
                                if (value.length > 16) {
                                  value = value.slice(0, 16);
                                }

                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        {errors.accountNumber && (
                          <FormFeedback>
                            {errors.accountNumber.message}
                          </FormFeedback>
                        )}
                      </Col>

                      {/* <Col md="4" className="mb-1">
                    <Label className="form-label" for="chequeNumber">
                      Cheque Number <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="chequeNumber"
                      control={control}
                      rules={{
                        required: "Cheque Number is required",
                      }}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Enter Cheque Number"
                          invalid={!!errors.chequeNumber}
                          {...field}
                          readOnly={statusThree()}
                        />
                      )}
                    />
                    {errors.chequeNumber && (
                      <FormFeedback>{errors.chequeNumber.message}</FormFeedback>
                    )}
                  </Col> */}
                    </Row>
                  </>
                )}

                {paymentMode === "Card Swipe" && (
                  <>
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
                            required: "Card Swipe Transaction ID is required",
                            //   validate: validateCardSwipeTransactionId,
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Transaction ID"
                              invalid={!!errors.cardSwipeTransactionId}
                              {...field}
                              // disabled={statusThree}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
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
                  </>
                )}
                <div className="d-flex justify-content-between">
                  {/* <Button
                type="button"
                color="primary"
                className="btn-prev"
                onClick={() => stepper.previous()}
              >
                <ArrowLeft
                  size={14}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
                <span className="align-middle d-sm-inline-block d-none">
                  Previous
                </span>
              </Button> */}
                  <div className="d-flex">
                    <Button
                      type="reset"
                      onClick={() => reset()}
                      className="btn-reset me-2"
                    >
                      <span className="align-middle d-sm-inline-block d-none">
                        Reset
                      </span>
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      className="btn-next"
                      disabled={loading}
                      onClick={() => clearErrors()}
                    >
                      <span className="align-middle d-sm-inline-block d-none">
                        {loading ? (
                          <>
                            Loading.. <Spinner size="sm" />{" "}
                          </>
                        ) : (
                          <>Submit</>
                        )}
                      </span>
                      {loading ? null : (
                        <ArrowRight
                          size={14}
                          className="align-middle ms-sm-25 ms-0"
                        ></ArrowRight>
                      )}
                    </Button>
                  </div>
                </div>
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
                  <CardTitle tag="h4">Payment Summary</CardTitle>
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
                      <div className="details-title">Total Amount</div>
                      <div className="detail-amt">
                        <strong>$ {handleFinal || "0"}</strong>
                      </div>
                    </li>
                    {/* <li
                      className="price-detail"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      {verify && (
                        <>
                          <div className="details-title">Discount Amount</div>
                          <div className="detail-amt discount-amt text-danger">
                            {isDiscount ? isDiscount : "0"}{" "}
                            {mode === "Percentage"
                              ? -discountPercentage.toFixed(2)
                              : -discountAmt}
                          </div>
                        </>
                      )}
                    </li> */}

                    {!payableAmount && (
                      <>
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
                            <strong>
                              $ {handleAdvance ? handleAdvance : "0"}
                            </strong>
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
                            <strong>${handleRemaining ?? 0}</strong>
                          </div>
                        </li>
                      </>
                    )}
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
                      <div className="detail-amt">$ {CurrentAmount}</div>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>

        {showQrModal && (
          <>
            <Qr_Payment
              setShowQrModal={setShowQrModal}
              showQrModal={showQrModal}
              qr={qr}
            />
          </>
        )}
      </Form>
    </>
  );
}

export default Payment;
