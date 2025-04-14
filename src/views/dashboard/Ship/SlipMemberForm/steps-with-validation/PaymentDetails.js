import { Fragment } from "react";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import Flatpickr from "react-flatpickr";
import { Spinner } from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import useJwt from "@src/auth/jwt/useJwt";
import QRCode from "react-qr-code";
import QrCodePayment from "./QrCodePayment";
import {
  Label,
  Row,
  Col,
  Button,
  Form,
  Input,
  FormFeedback,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import PersonalInfo from "./MemberDetails";
import GenrateOtp from "./GenrateOtp";
import Cash_otp from "./Cash_otp";
import { format } from "date-fns";
import React from "react";
import { UncontrolledAlert } from "reactstrap";
import { Send } from "react-feather";
import { DollarSign, Percent } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const paymentModes = {
  "Credit Card": [
    "cardNumber",
    "cardType",
    "cardExpiryYear",
    "cardExpiryMonth",
    "cardCvv",
    "nameOnCard",
    "address",
    "city",
    "state",
    "country",
    "pinCode",
  ],
  "Card Swipe": ["cardSwipeTransactionId"],
  Cheque21: [
    "bankName",
    "nameOnAccount",
    "routingNumber",
    "accountNumber",
    "chequeNumber",
    "chequeImage",
  ],
  ChequeACH: [
    "bankName",
    "nameOnAccount",
    "routingNumber",
    "accountNumber",
    "chequeNumber",
  ],
};
import { useParams } from "react-router-dom";
const Address = ({
  stepper,
  formData,
  slipIID,
  memberID,
  formStatus,
  fetchLoader,
  slipId,
}) => {
  const colourOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Annual", label: "Annual" },
  ];

  const CompanyOptions = [
    { value: "WesternUnion", label: "WesternUnion" },
    { value: "MoneyGrams", label: "MoneyGrams" },
    { value: "Other", label: "Other" },
  ];

  const colourOptions3 = [
    { value: "1", label: "Credit Card" },
    { value: "2", label: "Card Swipe" },
    { value: "3", label: "Cash" },
    { value: "4", label: "Cheque21" },
    { value: "5", label: "ChequeACH" },
    { value: "6", label: "Money Order" },
    { value: "7", label: "Payment Link" },
    { value: "8", label: "QR Code" },
  ];

  const AccountType = [
    { value: "8", label: "Personal Checking Account" },
    { value: "9", label: "Personal Saving Account" },
    { value: "10", label: "Business Checking Account" },
    { value: "11", label: "Business Savings Account" },
  ];
  // Create month and year options
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

  const [isPercentage, setIsPercentage] = useState(true);
  const [value, setValuee] = useState("");
  const [qr, setQr] = useState(null);
  const MySwal = withReactContent(Swal);

  // const [paidInOption, setPaidInOption] = useState(null);

  const [picker, setPicker] = useState(new Date());
  const [totalPayment, setFinalPayment] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);

  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [discounttoggle, setDiscountToggle] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [discountTypee, setdiscountTypee] = useState(null);
  const [otp, setOtp] = useState("");
  const [paymentMode, setpaymentMode] = useState(null);
  const [marketPrices, setMarketPrices] = useState(null);
  const [rentalPriceState, setRentalPrice] = useState("");
  const [show, setShow] = useState(false);
  const [slipDetail, setSlipDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [errMsz, setErrMsz] = useState("");
  const [otpVerify, setotpVerify] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [discountTypedStatus, setdiscountTypedStatus] = useState(null);

  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("");

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

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm({});

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

  const { slipuid } = useParams();

  useEffect(() => {
    console.log({ errors });
  }, [errors]);

  const detectedCardType = (number) => {
    const patterns = {
      Visa: /^4/,
      MasterCard: /^5[1-5]/,
      Discover: /^6/,
      RuPay: /^(60|65)\d{0,}/, // Updated pattern for RuPay
      ChinaUnionPay: /^62/,
      Amex: /^3[47]\d{0,}/, // Fixed pattern for AMEX
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

  const fetchMarketPrices = async () => {
    try {
      const response = await useJwt.getslip();

      const { marketAnnualPrice, id, marketMonthlyPrice } =
        response.data.content.result.find((item) => {
          // const fakeID = 18;
          if (item.id === slipIID) {
            return item;
          }
        });

      if (!marketAnnualPrice || !marketMonthlyPrice || !id) {
        console.log("Not Found Slip Chanrges");
        return;
      }

      /*
      const paydata = response.data.content.result.map((item) => ({
        marketAnnualPrice: item.marketAnnualPrice,
        marketMonthlyPrice: item.marketMonthlyPrice,
        id: item.id,
      }));
*/

      // console.log("filteredData", filteredData);

      setSlipDetail({
        Monthly: marketMonthlyPrice,
        Annual: marketAnnualPrice,
        id,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(slipDetail);

  const getReadOnlyStyle = () => {
    return {
      color: "#000",
      backgroundColor: "#fff",
      opacity: 1,
    };
  };

  useEffect(() => {
    if (slipIID) fetchMarketPrices();
  }, [slipIID]);

  // const handlePaidInChange = (option) => {
  //   console.log("handlePaidInChange function", slipDetail);
  //   if (option?.value === "Monthly") {
  //     setValue("rentalPrice", slipDetail.marketMonthlyPrice);

  //     console.log("rentalPrice", slipDetail.marketMonthlyPrice);
  //   } else if (option?.value === "Annual") {
  //     setValue("rentalPrice", slipDetail.marketAnnualPrice);
  //     console.log("rentalPrice", slipDetail.marketAnnualPrice);
  //   } else {
  //     setValue("rentalPrice", "");

  //     console.log("Cleared Rental Price");
  //   }
  // };

  const handleDiscount = (event) => {
    console.clear();
    const isToggled = event.target.checked;
    console.log("is toggled", isToggled);

    setDiscountToggle(isToggled);

    if (!isToggled) {
      setOtpVisible(false);
    }
  };

  const handlepaymentMode = (selectedOption) => {
    const selectedType = selectedOption?.label; // Extract the value

    if (selectedType) {
      setpaymentMode(selectedType);
    }
  };

  useEffect(() => {
    const rentalPrice = getValues("rentalPrice");
    const uid = watch("uid");

    setRentalPrice(rentalPrice);

    if (formData[0]?.otpVerify) {
      setDiscountToggle(true);
    }

    if (!uid && rentalPrice) {
      setFinalPayment(rentalPrice);
      setValue("finalPayment", rentalPrice);
    }
  }, [watch("rentalPrice")]);

  //Discount Calculations

  const handlePercentageChange = (e) => {
    // {{debugger}}
    const percentage = parseFloat(e.target.value);
    console.log(percentage);
    if (!isNaN(percentage)) {
      const discountValue = (percentage / 100) * rentalPriceState;
      setValue("calDisAmount", discountValue);
      setValue("finalPayment", rentalPriceState - discountValue);
    } else {
      setValue("finalPayment", rentalPriceState);
    }
  };

  const handleFlatChange = (e) => {
    // {{debugger}}

    const amount = Number(e.target.value);
    setValue("calDisAmount", amount);
    const finalPaymentcal = rentalPriceState - amount;
    setValue("finalPayment", finalPaymentcal);
    setFinalPayment(finalPaymentcal);
    console.log(finalPaymentcal);
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    field.onChange(value); // Sync with React Hook Form

    if (isPercentage) {
      handlePercentageChange(e);
    } else {
      handleFlatChange(e);
    }
  };

  const validateContractDate = (value) => {
    const contractDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight for comparison
    if (isNaN(contractDate)) {
      return "Invalid Contract Date";
    }
  };

  const validateCardSwipeTransactionId = (value) => {
    if (!value) {
      return "Card Swipe Transaction ID is required";
    }
    if (value.length < 6) {
      return "Transaction ID must be at least 6 characters";
    }
    return true;
  };

  const validateFutureDate = (value, fieldName) => {
    const today = new Date();
    const selectedDate = new Date(value);
    // if (selectedDate <= today) {
    //   // Manually set error if the date is in the past
    //   errors(fieldName, {
    //     type: "manual",
    //     message: "The date must be in the future",
    //   });
    //   return false;
    // } else {
    //   // Clear any previous errors
    //   // clearErrors(fieldName);
    //   return true;
    // }
  };

  const handleButtonClick = () => {
    // Toggle the value
    const newIsPercentage = !isPercentage;
    setIsPercentage(newIsPercentage);

    // Prepare data
    const discountType = newIsPercentage ? "Percentage" : "Flat";
    const handleTypeDiscount = {
      discountType: discountType,
    };
    console.log(handleTypeDiscount);
    // {{debugger}}

    setdiscountTypedStatus(handleTypeDiscount);
  };
  const statusThree = () => {
    if (formStatus === 3) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (Object.keys(formData)?.length) {
      const data = { ...formData }["0"];
      let pmVal =
        colourOptions3?.find((x) => x.value == data.paymentMode) || null;
      let paidInVal =
        colourOptions?.find((x) => x.value == data.paidIn) || null;
      let accoTypeValue =
        AccountType?.find((x) => x.value == data.accountType) || null;

      // Update state if needed
      setpaymentMode(pmVal?.label || "");

      const updatedData = {
        ...data,
        paymentMode: pmVal,
        paidIn: paidInVal,
        accountType: accoTypeValue,
      };

      reset(updatedData);
    }
  }, [setValue, reset, formData]);

  const companyName = watch("companyName");
  const accType = watch("accountType");
  const acctypeValue = accType?.value;
  console.log(acctypeValue);
  // {{debugger}}
  const onSubmit = async (data) => {
    setErrMsz("");
    data.paymentMode = data.paymentMode?.value;

    console.log("Payment data:", data);
    const formData = new FormData();
    formData.append("SlipId", slipIID);
    formData.append("contractDate", data.contractDate);
    formData.append("paidIn", data.paidIn?.value);
    formData.append("rentalPrice", data.rentalPrice);
    formData.append("finalPayment", data.finalPayment);
    formData.append("renewalDate", data.renewalDate);
    formData.append("nextPaymentDate", data.nextPaymentDate);
    formData.append("paymentMode", data.paymentMode);
    formData.append("otpVerify", otpVerify);
    formData.append("memberId", memberID);

    if (otpVerify) {
      formData.append("discountAmount", Number(data.discountAmount));
      formData.append("calDisAmount", data.calDisAmount);
      // {{debugger}}

      formData.append("discountType", discountTypedStatus.discountType);
    }

    if (paymentMode === "Credit Card") {
      formData.append("cardNumber", data.cardNumber);
      formData.append("cardType", data.cardType);
      formData.append("cardExpiryYear", data.cardExpiryYear);
      formData.append("cardExpiryMonth", data.cardExpiryMonth);
      formData.append("cardCvv", data.cardCvv);

      formData.append("nameOnCard", data.nameOnCard);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("country", data.country);
      formData.append("pinCode", data.pinCode);
    } else if (paymentMode === "Card Swipe") {
      formData.append("cardSwipeTransactionId", data.cardSwipeTransactionId);
    } else if (paymentMode === "Cheque21") {
      if (!file) {
        alert("Please select a file first.");
        return;
      }
      formData.append("bankName", data.bankName);
      formData.append("nameOnAccount", data.nameOnAccount);
      formData.append("routingNumber", data.routingNumber);
      formData.append("accountNumber", data.accountNumber);
      formData.append("chequeNumber", data.chequeNumber);
      formData.append("chequeImage", file);
    } else if (paymentMode === "ChequeACH") {
      // {{debugger}}
      formData.append("bankName", data.bankName);
      formData.append("nameOnAccount", data.nameOnAccount);
      formData.append("routingNumber", data.routingNumber);
      formData.append("accountNumber", data.accountNumber);
      formData.append("accountType", data.accountType?.value);
    } else if (paymentMode === "Money Order") {
      formData.append("companyName", data.companyName?.value);
      if (companyName?.label !== "Other") {
        formData.append("mtcn", data.mtcn);
      } else {
        formData.append("otherCompanyName", data.otherCompanyName);
        formData.append("otherTransactionId", data.otherTransactionId);
      }
    } else {
      console.log("Choose differant payment Method ");
    }

    try {
      setLoading(true);

      const response = await useJwt.createPayment(formData);
      const { qr_code_base64 } = response?.data;
      setQr(qr_code_base64);
      if (qr_code_base64) {
        setShowQrModal(true);
      }
      // console.log("API Response:", response);
      // MySwal.fire({
      //   title: "Successfully Completed",
      //   text: " Your Pyament is Successfully Completed",
      //   icon: "success",
      //   customClass: {
      //     confirmButton: "btn btn-primary",
      //   },
      //   buttonsStyling: false,
      // }).then(() => {
      //   if (Object.keys(errors).length === 0) {
          // {{debugger}}
          // if (qr) {

          // setShowQrModal(true);

          // } else {
          stepper.next();
          // }
      //   }
      // });
    } catch (error) {
      console.error("Error submitting data:", error);

      if (error.response && error.response.data) {
        const { status, content } = error.response.data;

        setErrMsz((prev) => {
          const newMsz = content || "An unexpected error occurred";
          return prev !== newMsz ? newMsz : prev + " ";
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoader)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4rem",
        }}
      >
        <Spinner
          color="primary"
          style={{
            height: "5rem",
            width: "5rem",
          }}
        />
      </div>
    );

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Payment</h5>
        <small>Enter Your Payment Details.</small>
      </div>

      {errMsz && (
        <React.Fragment>
          <UncontrolledAlert color="danger">
            <div className="alert-body">
              <span className="text-danger fw-bold">{errMsz}</span>
            </div>
          </UncontrolledAlert>
        </React.Fragment>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <>
          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label" for="contractDate">
                Contract Date <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="contractDate"
                control={control}
                rules={{
                  required: "Contract Date is required",
                }}
                render={({ field }) => (
                  <Flatpickr
                    id="contractDate"
                    name="contractDate"
                    className={`form-control ${
                      errors.contractDate ? "is-invalid" : ""
                    }`}
                    options={{
                      altInput: true,
                      altFormat: "Y-m-d",
                      dateFormat: "Y-m-d",
                    }}
                    value={field.value}
                    // onChange={(date) => {
                    //   const formattedDate = date[0]
                    //     ?.toISOString()
                    //     .split("T")[0];
                    //   field.onChange(formattedDate);

                    //   // Calculate Renewal Date (365 days later)
                    //   const renewalDate = new Date(date[0]);
                    //   renewalDate.setFullYear(renewalDate.getFullYear() + 1); // Ensures year increment without affecting the day

                    //   const formattedRenewalDate = renewalDate
                    //     .toISOString()
                    //     .split("T")[0];

                    //   // Set Renewal Date value in the form
                    //   setValue("renewalDate", formattedRenewalDate, {
                    //     shouldValidate: true,
                    //   });
                    // }}

                    onChange={(date) => {
                      if (!date[0]) return;

                      const selectedDate = date[0];

                      // Format Contract Date Correctly
                      const formattedDate =
                        selectedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
                      field.onChange(formattedDate);

                      // Calculate Renewal Date (1 year later)
                      const renewalDate = new Date(selectedDate);
                      renewalDate.setFullYear(renewalDate.getFullYear() + 1);

                      // Format Renewal Date Correctly
                      const formattedRenewalDate =
                        renewalDate.toLocaleDateString("en-CA"); // YYYY-MM-DD

                      // Set Renewal Date value in the form
                      setValue("renewalDate", formattedRenewalDate, {
                        shouldValidate: true,
                      });
                    }}
                  />
                )}
              />
              {errors.contractDate && (
                <FormFeedback>{errors.contractDate.message}</FormFeedback>
              )}
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label" for="paidIn">
                Paid In <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                control={control}
                rules={{
                  required: "Paid In is required",
                }}
                name="paidIn"
                render={({ field }) => (
                  // <Select
                  //   {...field}
                  //   theme={selectThemeColors}
                  //   className="react-select"
                  //   isDisabled={statusThree()}
                  //   classNamePrefix="select"
                  //   isClearable
                  //   options={colourOptions}
                  //   onChange={(option) => {

                  //     const { value } = option;
                  //     field.onChange(option);
                  //     setValue("rentalPrice", slipDetail[option?.value] );

                  //   }}
                  //   isInvalid={!!errors.paidIn}
                  // />

                  <Select
                    {...field}
                    theme={selectThemeColors}
                    className="react-select"
                    isDisabled={statusThree()}
                    classNamePrefix="select"
                    isClearable
                    options={colourOptions}
                    onChange={(option) => {
                      field.onChange(option); // Ensure field can accept object
                      setValue("rentalPrice", slipDetail[option?.value] || ""); // Avoid undefined errors
                    }}
                    isInvalid={!!errors.paidIn}
                  />
                )}
              />
              {errors.paidIn && (
                <FormFeedback>{errors.paidIn.message}</FormFeedback>
              )}
            </Col>
          </Row>
          {console.log("paymentMode", watch("paymentMode"))}
          <Row>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="landmark">
                Rental Price
                <span style={{ color: "red" }}>*</span>
              </Label>

              <Controller
                name="rentalPrice"
                rules={{
                  required: "Monthly Value is required",
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder=""
                    readOnly
                    invalid={errors.rentalPrice && true}
                    {...field}
                  />
                )}
              />
            </Col>
          </Row>

          <div className="content-header">
            <h5 className="mb-0 my-2">Discount</h5>
            <small>Get Discount Using OTP</small>
          </div>
          <Row>
            <Col md="auto" className="mb-1 ">
              <Label className="form-label" for="hf-picker">
                Do You Want Discount..?
              </Label>

              <div
                className="my-2 form-check form-switch d-flex "
                style={{ marginLeft: "-47px" }}
              >
                <Label
                  className="me-1"
                  htmlFor="distype"
                  style={{ textAlign: "left" }}
                >
                  No
                </Label>

                <Input
                  type="switch"
                  name="distype"
                  id="distype"
                  onChange={handleDiscount}
                  style={{ margin: 0 }}
                  disabled={otpVerify || formData[0]?.otpVerify}
                  checked={discounttoggle} // This controls the checked state
                />

                <Label
                  className="ms-1"
                  htmlFor="distype"
                  style={{ textAlign: "left" }}
                >
                  Yes
                </Label>
              </div>
            </Col>

            {discounttoggle && (
              <Col md="auto" className="mb-1 my-3">
                <GenrateOtp
                  otpVerify={otpVerify}
                  setotpVerify={setotpVerify}
                  slipIID={slipIID}
                  memberId={memberID}
                  fetchDiscountFields={formData[0]?.otpVerify}
                />
              </Col>
            )}

            {/* || formData[0]?.otpVerify */}
          </Row>

          {(otpVerify || formData[0]?.otpVerify) && (
            <Row className="mb-1">
              <div className="d-flex align-items-center justify-content-between w-100">
                <Col xs="auto" className="p-0 mt-2">
                  <Button
                    color={isPercentage ? "success" : "warning"} // Set color based on isPercentage
                    outline={true}
                    disabled={formData[0]?.otpVerify}
                    className="me-2 d-flex align-items-center justify-content-center p-1"
                    style={{
                      height: "35px",
                      fontSize: "10px",
                      padding: "0.2rem 0.4rem",
                    }}
                    // onClick={() => setIsPercentage(!isPercentage)}
                    onClick={handleButtonClick}
                  >
                    {isPercentage ? (
                      <Percent className="w-3 h-3" />
                    ) : (
                      <DollarSign className="w-4 h-4" />
                    )}
                  </Button>
                </Col>

                {/* <Col className="p-0 me-1"> */}
                <Col className="me-1">
                  <Label className="form-label" for="hf-picker">
                    Enter
                    <strong>
                      {isPercentage ? " Percentage " : " Amount  "}
                    </strong>{" "}
                    For Discount
                    <span style={{ color: "red" }}>*</span>
                  </Label>

                  <InputGroup className="flex-grow-1">
                    <Controller
                      name="discountAmount"
                      rules={{
                        required: "Discount Type is required",
                      }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          readOnly={formData[0]?.otpVerify}
                          placeholder={
                            isPercentage ? "Enter percentage" : "Enter amount"
                          }
                          onChange={(e) => handleInputChange(e, field)}
                        />
                      )}
                    />
                    <InputGroupText className="bg-white text-muted">
                      {isPercentage ? "%" : "$"}
                    </InputGroupText>
                  </InputGroup>
                </Col>
                {/* 
              <Col className="me-1">
                <Label className="form-label" for="hf-picker">
                  Enter
                  <strong>
                    {isPercentage ? " Percentage " : " Amount "}
                  </strong>{" "}
                  For Discount
                  <span style={{ color: "red" }}>*</span>
                </Label>

                <InputGroup className="flex-grow-1">
                  <Controller
                    name="discountAmount"
                    rules={{
                      required: "Discount is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numeric values are allowed",
                      },
                      validate: (value) => {
                        if (isPercentage) {
                          return (
                            (value > 0 && value <= 100) ||
                            "Percentage must be between 1 and 100"
                          );
                        } else {
                          return value > 0 || "Amount must be greater than 0";
                        }
                      },
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        readOnly={formData[0]?.otpVerify}
                        placeholder={
                          isPercentage ? "Enter percentage" : "Enter amount"
                        }
                        onChange={(e) => handleInputChange(e, field)}
                        invalid={errors.discountAmount ? true : false} // Show error style
                      />
                    )}
                  />
                  <InputGroupText className="bg-white text-muted">
                    {isPercentage ? "%" : "$"}
                  </InputGroupText>
                </InputGroup>
                {errors.discountAmount && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {errors.discountAmount.message}
                  </div>
                )}
              </Col> */}

                <Col className="p-0 ">
                  <Label className="form-label" for="landmark">
                    Total Discount Amount{" "}
                  </Label>
                  <Controller
                    name="calDisAmount"
                    control={control}
                    rules={{
                      required: "Discount Amount is required",
                    }}
                    render={({ field }) => (
                      <Input
                        value={getValues("calDisAmount") || ""}
                        style={{ color: "#000" }}
                        placeholder="Total Discount"
                        readOnly={formData[0]?.otpVerify}
                        invalid={errors.calDisAmount && true}
                        {...field}
                      />
                    )}
                  />
                </Col>
              </div>
            </Row>
          )}

          <Row>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="landmark">
                Total Amount <span style={{ color: "red" }}>*</span>
              </Label>

              <Controller
                name="finalPayment"
                control={control}
                rules={{
                  required: "Final Payment is required",
                }}
                render={({ field }) => (
                  <Input
                    placeholder="Final Amount"
                    invalid={errors.finalPayment && true}
                    {...field}
                    readOnly
                  />
                )}
              />

              {errors.finalPayment && (
                <FormFeedback>{errors.finalPayment.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <Row>
            {/* <Col md="6" className="mb-1">
            <Label className="form-label" for="hf-picker">
              Renewal Date <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              name="renewalDate"
              control={control}
              rules={{
                required: "Renewal date is required",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1); // Calculate tomorrow's date
                  tomorrow.setHours(0, 0, 0, 0); 

                  if (selectedDate < tomorrow) {
                    return "Renewal date cannot be today or in the past.";
                  }

                  return true;
                },
              }}
              render={({ field }) => (
                <Flatpickr
                  id="hf-picker"
                  className={`form-control ${
                    errors.renewalDate ? "is-invalid" : ""
                  }`}
                  options={{
                    altInput: true,
                    altFormat: "Y-m-d",
                    dateFormat: "Y-m-d",
                   
                  }}
                  value={field.value || ""}
                  onChange={(date) => {
                    const formattedDate = date[0]?.toISOString().split("T")[0]; // Format date to 'YYYY-MM-DD'
                    field.onChange(formattedDate); // Update form value
                  }}
                />
              )}
            />
            {errors.renewalDate && (
              <FormFeedback>{errors.renewalDate.message}</FormFeedback>
            )}
          </Col> */}

            <Col md="6" className="mb-1">
              <Label className="form-label" for="renewalDate">
                Renewal Date <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="renewalDate"
                control={control}
                rules={{
                  required: "Renewal date is required",
                }}
                render={({ field }) => (
                  <Flatpickr
                    id="renewalDate"
                    className="form-control"
                    options={{
                      altInput: true,
                      altFormat: "Y-m-d",
                      dateFormat: "Y-m-d",
                    }}
                    value={field.value}
                    onChange={() => {}} // Disable manual changes
                    readOnly={true}
                  />
                )}
              />
              {errors.renewalDate && (
                <FormFeedback>{errors.renewalDate.message}</FormFeedback>
              )}
            </Col>
            <Col md="6" className="mb-1">
              <Label className="form-label" for="hf-picker">
                Next Payment Date <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="nextPaymentDate"
                control={control}
                rules={{
                  required: "Next Payment date is required",
                  validate: validateFutureDate,
                }}
                render={({ field }) => (
                  <Flatpickr
                    id="hf-picker"
                    className={`form-control ${
                      errors.nextPaymentDate ? "is-invalid" : ""
                    }`}
                    options={{
                      altInput: true,
                      altFormat: "Y-m-d",
                      dateFormat: "Y-m-d",
                      minDate: "today", // Disable past dates
                    }}
                    value={field.value}
                    onChange={(date) => {
                      const formattedDate = format(date[0], "yyyy-MM-dd"); // Format date
                      field.onChange(formattedDate); // Update value in the form
                    }}
                  />
                )}
              />
              {errors.nextPaymentDate && (
                <FormFeedback>{errors.nextPaymentDate.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <Row>
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
                    isDisabled={statusThree()}
                    onChange={(selectedOption) => {
                      const value = selectedOption ? selectedOption.value : "";
                      field.onChange(selectedOption); // Update React Hook Form with the value
                      handlepaymentMode(selectedOption); // Run your custom function with the full option
                    }}
                    menuPlacement="top"
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

          {/*   ===================== Cash =============================  */}

          {paymentMode === "Cash" && (
            <>
              {/* { formData[0]?.cashOtpVerify ? (
                    <React.Fragment>
                      <Alert color="success">
                        <div className="alert-body " style={{ marginTop: "10px" }}>
                          <span className="ms-1">OTP Verified Successfully ! </span>
                          <ThumbsUp size={15} />
                        </div>
                      </Alert>
                    </React.Fragment>
            ):( */}
              <Cash_otp
                showModal={showModal}
                setShowModal={setShowModal}
                totalPayment={totalPayment}
                slipIID={slipIID}
                memberId={memberID}
                cashOtpVerify={formData[0]?.cashOtpVerify}
              />

              {/* )} */}
            </>
          )}

          {/*   ===================== credit card =============================  */}

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
                        readOnly={statusThree()}
                        onChange={(e) => handleOnchangeCardNum(e, field)}
                      />
                    )}
                  />
                  {errors.cardNumber && (
                    <FormFeedback>{errors.cardNumber.message}</FormFeedback>
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
                        style={getReadOnlyStyle()}
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
                    Card Expiry Year <span style={{ color: "red" }}>*</span>
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
                        // Extract the `value` on change
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption?.value || "");
                          handleYearChange(selectedOption); // Update available months based on year
                        }}
                      />
                    )}
                  />
                  {errors.cardExpiryYear && (
                    <FormFeedback>{errors.cardExpiryYear.message}</FormFeedback>
                  )}
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="card-expiry-month">
                    Card Expiry Month <span style={{ color: "red" }}>*</span>
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
                        type="text" // Change type to text
                        maxLength={getCvvLength(cardType)} // Dynamically set maxLength
                        placeholder="Enter CVV Number"
                        invalid={!!errors.cardCvv}
                        {...field}
                        readOnly={statusThree()}
                      />
                    )}
                  />

                  {errors.cardCvv && (
                    <FormFeedback>{errors.cardCvv.message}</FormFeedback>
                  )}
                </Col>
                <Col md="6" className="mb-1">
                  <Label className="form-label" for="card-holder-name">
                    Card Holder's Name <span style={{ color: "red" }}>*</span>
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
                        readOnly={statusThree()}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  {errors.nameOnCard && (
                    <FormFeedback>{errors.nameOnCard.message}</FormFeedback>
                  )}
                </Col>
              </Row>

              {/* Address Fields */}
              <Row>
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
                        readOnly={statusThree()}
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
                        readOnly={statusThree()}
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
                        readOnly={statusThree()}
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
                        readOnly={statusThree()}
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
                        readOnly={statusThree()}
                      />
                    )}
                  />
                  {errors.pinCode && (
                    <FormFeedback>{errors.pinCode.message}</FormFeedback>
                  )}
                </Col>
              </Row>
            </>
          )}

          {/* //* ============================ Cheque21 Details =========================  */}

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
                        message: "Bank Name must be at least 3 characters",
                      },
                    }}
                    name="bankName"
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Bank Name"
                        invalid={!!errors.bankName}
                        {...field}
                        readOnly={statusThree()}
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
                        message: "Account Name must be at least 3 characters",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Account Name"
                        invalid={!!errors.nameOnAccount}
                        {...field}
                        readOnly={statusThree()}
                      />
                    )}
                  />
                  {errors.nameOnAccount && (
                    <FormFeedback>{errors.nameOnAccount.message}</FormFeedback>
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
                      required: "Routing Number is required",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "Routing Number must be exactly 9 digits",
                      },
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Enter Routing Number"
                        invalid={!!errors.routingNumber}
                        readOnly={statusThree()}
                        {...field}
                      />
                    )}
                  />
                  {errors.routingNumber && (
                    <FormFeedback>{errors.routingNumber.message}</FormFeedback>
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
                        value: 10,
                        message: "Account Number must be at least 10 digits",
                      },
                      maxLength: {
                        value: 17,
                        message: "Account Number can't exceed 17 digits",
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
                        readOnly={statusThree()}
                      />
                    )}
                  />
                  {errors.accountNumber && (
                    <FormFeedback>{errors.accountNumber.message}</FormFeedback>
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
                        message: "Cheque Number must be at least 6 digits",
                      },
                      maxLength: {
                        value: 10,
                        message: "Cheque Number cannot exceed 10 digits",
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
                        readOnly={statusThree()}
                      />
                    )}
                  />
                  {errors.chequeNumber && (
                    <FormFeedback>{errors.chequeNumber.message}</FormFeedback>
                  )}
                </Col>
              </Row>

              {/* <Row> */}
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
                      readOnly={statusThree()}
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
              {/* </Row> */}
            </>
          )}

          {/* //* ============================ ChequeACH =========================  */}
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
                        isDisabled={statusThree()}
                        // onChange={(selectedOption) => {
                        //   const value = selectedOption ? selectedOption.value : "";
                        //   field.onChange(selectedOption); // Update React Hook Form with the value
                        //   handlepaymentMode(selectedOption); // Run your custom function with the full option
                        // }}
                      />
                    )}
                  />
                  {errors.accountType && (
                    <FormFeedback>{errors.accountType.message}</FormFeedback>
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
                        message: "Bank Name must be at least 3 characters",
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
                        readOnly={statusThree()}
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
                        message: "Account Name must be at least 3 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Account Name can't exceed 50 characters",
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
                        readOnly={statusThree()}
                      />
                    )}
                  />
                  {errors.nameOnAccount && (
                    <FormFeedback>{errors.nameOnAccount.message}</FormFeedback>
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
                      required: "Routing Number is required",
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Enter Routing Number"
                        invalid={!!errors.routingNumber}
                        {...field}
                        readOnly={statusThree()}
                      />
                    )}
                  />
                  {errors.routingNumber && (
                    <FormFeedback>{errors.routingNumber.message}</FormFeedback>
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
                        value: 10,
                        message: "Account Number must be at least 10 digits",
                      },
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Enter Account Number"
                        invalid={!!errors.accountNumber}
                        {...field}
                        readOnly={statusThree()}
                      />
                    )}
                  />
                  {errors.accountNumber && (
                    <FormFeedback>{errors.accountNumber.message}</FormFeedback>
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
          {/* ===================== card Swipe ==========================*/}

          {paymentMode === "Card Swipe" && (
            <>
              <Row>
                <Col md="12" className="mb-1">
                  <Label className="form-label" for="cardSwipeTransactionId">
                    Card Swipe Transaction ID
                    <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Controller
                    id="cardSwipeTransactionId"
                    name="cardSwipeTransactionId"
                    rules={{
                      validate: validateCardSwipeTransactionId, // Custom validation function
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Transaction ID"
                        invalid={!!errors.cardSwipeTransactionId}
                        {...field}
                        readOnly={statusThree()}
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

          {/* ===================== Money order ==========================*/}

          {paymentMode === "Money Order" && (
            <>
              <Row>
                <Col md="12" className="mb-1">
                  <Label className="form-label" for="">
                    Company Name <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Controller
                    control={control}
                    rules={{
                      required: "Company name is required",
                    }}
                    name="companyName"
                    render={({ field }) => (
                      <Select
                        {...field}
                        theme={selectThemeColors}
                        className="react-select"
                        isDisabled={statusThree()}
                        classNamePrefix="select"
                        isClearable
                        options={CompanyOptions}
                        isInvalid={!!errors.companyName}
                      />
                    )}
                  />
                  {errors.companyName && (
                    <FormFeedback>{errors.companyName.message}</FormFeedback>
                  )}
                </Col>

                {companyName?.label !== "Other" && (
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="mtcn">
                      MTCN Number
                      <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      id="mtcn"
                      name="mtcn"
                      // rules={{
                      //   validate: validateCardSwipeTransactionId, // Custom validation function
                      // }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter mtcn Number "
                          // invalid={!!errors.cardSwipeTransactionId}
                          {...field}
                          // readOnly={statusThree()}
                        />
                      )}
                    />
                    {errors.mtcn && (
                      <FormFeedback>{errors.mtcn.message}</FormFeedback>
                    )}
                  </Col>
                )}
              </Row>

              {companyName?.label === "Other" && (
                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="otherTransactionId">
                      Other Transaction ID
                      <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      id="otherTransactionId"
                      name="otherTransactionId"
                      // rules={{
                      //   validate: validateCardSwipeTransactionId, // Custom validation function
                      // }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter Pincode"
                          invalid={!!errors.pinCode}
                          {...field}
                          readOnly={statusThree()}
                        />
                      )}
                    />
                    {errors.otherTransactionId && (
                      <FormFeedback>
                        {errors.otherTransactionId.message}
                      </FormFeedback>
                    )}
                  </Col>

                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="landmark">
                      Other Company Name
                      <span style={{ color: "red" }}>*</span>
                    </Label>

                    <Controller
                      name="otherCompanyName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="otherCompanyName"
                          invalid={errors.otherCompanyName && true}
                          {...field}
                        />
                      )}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}

          {showQrModal && (
            <QrCodePayment
              setShowQrModal={setShowQrModal}
              showQrModal={showQrModal}
              qr={qr}
            />
          )}
          <div className="d-flex justify-content-between">
            <Button
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
            </Button>
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
                onClick={() => clearErrors()}
              >
                <span className="align-middle d-sm-inline-block d-none">
                  {loading ? (
                    <>
                      Loading.. <Spinner size="sm" />{" "}
                    </>
                  ) : (
                    "Submit"
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
        </>
      </Form>
    </Fragment>
  );
};

export default Address;
