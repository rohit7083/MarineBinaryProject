// ** React Imports
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
// ** Reactstrap Imports
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
import { format } from "date-fns";
import React from "react";
import { UncontrolledAlert } from "reactstrap";
import { Send } from "react-feather";
import { DollarSign, Percent } from "lucide-react";

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

const Address = ({ stepper, formData, slipIID, memberID }) => {
  const colourOptions = [
    { value: null, label: "select" },
    { value: "Monthly", label: "Monthly" },
    { value: "Annual", label: "Annual" },
  ];

  const colourOptions2 = [
    { value: "Percentage", label: "Percentage" },
    { value: "Flat", label: "Flat" },
  ];

  const colourOptions3 = [
    { value: "1", label: "Credit Card" },
    { value: "2", label: "Card Swipe" },
    { value: "3", label: "Cash" },
    { value: "4", label: "Cheque21" },
    { value: "5", label: "ChequeACH" },
  ];

  const colourOptions4 = [
    { value: "Visa", label: "Visa" },
    { value: "Rupey", label: "Rupey" },
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

  const handleValueChange = (e) => {
    const newValue = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(newValue) || newValue === "") {
      setValuee(newValue);
    }
  };
  const [paidInOption, setPaidInOption] = useState(null);

  const [picker, setPicker] = useState(new Date());
  const [nextPayment, setnextPayment] = useState(new Date());
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [discounttoggle, setDiscountToggle] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [discountTypee, setdiscountTypee] = useState(null);
  const [otp, setOtp] = useState("");
  const [paymentMode, setpaymentMode] = useState(null);
  const [marketPrices, setMarketPrices] = useState(null);
  const [calculatedDiscount, setCalculatedDiscount] = useState(0);
  const [rentalPrice, setRentalPrice] = useState("");
  const [show, setShow] = useState(false);
  const [slipDetail, setSlipDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [errMsz, setErrMsz] = useState("");
  const [otpVerify, setotpVerify] = useState(false);

  const [discountTypedStatus, setdiscountTypedStatus] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
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
  } = useForm({
    
  });

  // Update available months based on the selected year
  const handleYearChange = (selectedYear) => {
    const selectedYearValue = selectedYear ? selectedYear.value : currentYear;

    if (selectedYearValue === currentYear) {
      // Filter months to show only the ones that are still available in the current year
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
    // Initially, display all months
    setAvailableMonths(months);
  }, []);

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

//   const fetchMarketPrices = async () => {
//     try {
//       const response = await useJwt.getslip();
//       const paydata = response.data.content.result.map((item) => ({
//         marketAnnualPrice: item.marketAnnualPrice,
//         marketMonthlyPrice: item.marketMonthlyPrice,
//         id: item.id,
//       }));

//       const filteredData = paydata.find((item) => item.id === slipIID);
//       console.log("filteredData", filteredData);

//       setSlipDetail(filteredData || {});
//     } catch (error) {
//       console.log(error);
//     }
//   };
// console.log(slipDetail);

const getReadOnlyStyle = () => {
  return {
    color: "#000",
    backgroundColor: "#fff",
    opacity: 1,
  };
};
const fetchMarketPrices = async () => {
  try {
    const response = await useJwt.getslip();
    const paydata = response.data.content.result.map((item) => ({
      marketAnnualPrice: item.marketAnnualPrice,
      marketMonthlyPrice: item.marketMonthlyPrice,
      id: item.id,
    }));

    const filteredData = paydata.find((item) => item.id === slipIID);
    console.log("filteredData", filteredData);

    setSlipDetail(filteredData || {});

    // Recalculate rentalPrice after slipDetail is set
    if (paidInOption) {
      if (paidInOption.value === "Monthly") {
        setValue("rentalPrice", filteredData?.marketMonthlyPrice || "");
        console.log("rentalPrice", filteredData?.marketMonthlyPrice);
      } else if (paidInOption.value === "Annual") {
        setValue("rentalPrice", filteredData?.marketAnnualPrice || "");
        console.log("rentalPrice", filteredData?.marketAnnualPrice);
      } else {
        setValue("rentalPrice", ""); // Clear rental price if no valid option
        console.log("Cleared Rental Price");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Fetch data once when the component mounts
useEffect(() => {

  fetchMarketPrices();
}, []);

// Handle option change
// const handlePaidInChange = (option) => {
//   setPaidInOption(option);
//   // Recalculate rentalPrice immediately after setting paidInOption
//   if (slipDetail) {
//     if (option.value === "Monthly") {
//       setValue("rentalPrice", slipDetail?.marketMonthlyPrice || "");
//       console.log("rentalPrice", slipDetail?.marketMonthlyPrice);
//     } else if (option.value === "Annual") {
//       setValue("rentalPrice", slipDetail?.marketAnnualPrice || "");
//       console.log("rentalPrice", slipDetail?.marketAnnualPrice);
//     } else {
//       setValue("rentalPrice", ""); 
//       console.log("Cleared Rental Price");
//     }
//   }
// };

  
  // const handlePaidInChange = (option) => {
  //   // debugger
  //   console.log(slipDetail);
    
  //   // {{debugger}}/
  //   if (option?.value === "Monthly") {
  //     // setRentalPrice(slipDetail.marketMonthlyPrice);
  //     setValue("rentalPrice", slipDetail.marketMonthlyPrice);
  //     console.log("rentalPrice", slipDetail.marketMonthlyPrice);
  //   } else if (option?.value === "Annual") {
  //     setRentalPrice(slipDetail.marketAnnualPrice);
  //     setValue("rentalPrice", slipDetail.marketAnnualPrice);
  //     console.log("rentalPrice", slipDetail.marketAnnualPrice);
  //   } else {
  //     setRentalPrice(""); // Clear rental price if no valid
  //     setValue("rentalPrice", "");

  //     console.log("Cleared Rental Price");
  //   }
  // };

  const handleDiscount = (event) => {
    // Handle OTP button click (can trigger OTP API here)
    const isToggled = event.target.checked;

    setDiscountToggle(isToggled); // Update toggle state
    if (!isToggled) {
      // Reset all states if toggled to "No"
      setOtpVisible(false);
    }
  };

  const handlepaymentMode = (selectedOption) => {
    // Ensure that we are getting the correct value
    const selectedType = selectedOption?.label; // Extract the value

    if (selectedType) {
      setpaymentMode(selectedType); // Update the  paymentMode state
    }
  };

  useEffect(() => {
    // {{debugger}}
    const rentalPrice = getValues("rentalPrice"); // Get the current value
    if (rentalPrice) {
      setValue("finalPayment", rentalPrice); // Set the default value
    }
  }, [watch("rentalPrice")]);

  //Discount Calculations

  const handlePercentageChange = (e) => {
    const percentage = parseFloat(e.target.value);
    console.log(percentage);

    if (!isNaN(percentage)) {
      const discountValue = (percentage / 100) * rentalPrice;
      setCalculatedDiscount(discountValue);

      setValue("finalPayment", rentalPrice - discountValue);
      setValue("calDisAmount", discountValue);
    } else {
      setCalculatedDiscount(0);
      setValue("finalPayment", rentalPrice); // Reset to original value
    }
  };

  const handleFlatChange = (e) => {
    const amount = e.target.value;
    setValue("calDisAmount", amount); // Update the calculated field

    setValue("finalPayment", rentalPrice - amount); // Update the calculated field
  };

  const validateContractDate = (value) => {
    const contractDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight for comparison
    if (isNaN(contractDate)) {
      return "Invalid Contract Date";
    }
    if (contractDate < today) {
      return "Contract Date cannot be in the past";
    }
    return true;
  };

  // Custom validation for checking if value is a number
  const validateNumber = (value) => {
    if (isNaN(value)) {
      return "This field must be a number";
    }
    return true;
  };

  const validPainIn = (value) => {
    if (isNaN(value)) {
      return "This Feild Is required";
    }
  };

  // Validate if the value is a positive number
  const validatePositiveNumber = (value) => {
    if (value <= 0) {
      return "Value must be positive";
    }
    return true;
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
    const discountType = newIsPercentage ? "Percentage" : "flat";
    const handleTypeDiscount = {
      discountType: discountType,
    };
    console.log(handleTypeDiscount);

    setdiscountTypedStatus(handleTypeDiscount);
  };

  const onSubmit = async (data) => {
    console.log("Payment data:", data);
    const formData = new FormData();
    formData.append("SlipId", slipIID);
    formData.append("contractDate", data.contractDate);
    formData.append("paidIn", data.paidIn);
    formData.append("rentalPrice", data.rentalPrice);
    formData.append("finalPayment", data.finalPayment);
    formData.append("renewalDate", data.renewalDate);
    formData.append("nextPaymentDate", data.nextPaymentDate);
    formData.append("paymentMode", data.paymentMode);
    formData.append("otpVerify", otpVerify);
    formData.append("memberId", memberID);

    if (otpVerify) {
      formData.append("discountAmount", data.discountAmount);
      formData.append("calDisAmount", data.calDisAmount);
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
      formData.append("bankName", data.bankName);
      formData.append("nameOnAccount", data.nameOnAccount);
      formData.append("routingNumber", data.routingNumber);
      formData.append("accountNumber", data.accountNumber);
      formData.append("chequeNumber", data.chequeNumber);
    } else {
      console.log("Choose differant payment Method ");
    }

    try {
      setLoading(true); // Start loading

      const response = await useJwt.createPayment(formData); // API call
      console.log("API Response:", response);
    } catch (error) {
      console.error("Error submitting data:", error);

      if (error.response && error.response.data) {
        const { status, content } = error.response.data;
        console.log(content);

        switch (status) {
          case 400:
          case 401:
          case 403:
          case 500:
            setErrMsz(content);
            break;
          default:
            setErrMsz("Something went wrong. Please try again.");
        }
      }
    } finally {
      setLoading(false); // ✅ Stop loading after API call (fix)
    }
  };

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
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="hf-picker">
              Contract Date <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              name="contractDate"
              control={control}
              rules={{
                required: "Contract Date is required",
                validate: validateContractDate,
              }}
              render={({ field }) => (
                <Flatpickr
                  id="contractDate"
                  className={`form-control ${
                    errors.contractDate ? "is-invalid" : ""
                  }`}
                  options={{
                    altInput: true,
                    altFormat: "Y-m-d", // Format for display
                    dateFormat: "Y-m-d", // Ensures the value is in YYYY-MM-DD format
                    minDate: "today", // Disable all dates before today
                  }}
                  value={field.value}
                  onChange={(date) => {
                    const formattedDate = format(date[0], "yyyy-MM-dd"); // Format date
                    field.onChange(formattedDate); // Update value in the form
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
                <Select
                  {...field}
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  isClearable
                  options={colourOptions}
                  value={colourOptions.find(
                    (option) => option.value === field.value
                  )} // Match selected option
                  onChange={(option) => {
                    const selectedValue = option ? option.value : "";

                    field.onChange(selectedValue);
                    handlePaidInChange(option); // Update rental price
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
                validate: validateNumber,
              }}
              control={control}
              render={({ field }) => (
                <Input
                  placeholder=""
                  readOnly
                  invalid={errors.rentalPrice && true}
                  {...field}
                  onChange={(e) => {
                    handlerentalPrice(e); // Call the handler if needed
                    field.onChange(e); // Update the react-hook-form value
                  }}
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
              />
            </Col>
          )}
        </Row>
        {/* {otpVerify && ( */}
        {/* <Col md="4" className="mb-1">
              <Label className="form-label" for="hf-picker">
                Discount Type <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                control={control}
                name="discountType"
                rules={{
                  required: "discountType is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    isClearable
                    options={colourOptions2}
                    value={colourOptions2.find(
                      (option) => option.value === field.value
                    )} // Match selected option
                    onChange={(option) => {
                      field.onChange(option ? option.value : ""); // Pass only the value
                      handleDisType(option); // Perform additional logic if needed
                    }}
                  />
                )}
              />
              {errors.discountType && (
                <FormFeedback>{errors.discountType.message}</FormFeedback>
              )}
            </Col>

            <Col md="4" className="mb-1">
              <Label className="form-label" for="hf-picker">
                {discountTypee == "Flat" ? "Discount Amount" : "Discount %"}
              </Label>
              <Controller
                name="discountAmount"
                rules={{
                  required: "Discount Type is required",
                  validate: validatePositiveNumber,
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder={
                      discountTypee == "Flat"
                        ? "Enter Discount Amount"
                        : "Enter Percentage %"
                    }
                    invalid={errors.discountAmount && true}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value); // Sync with React Hook Form
                      if (discountTypee === "Percentage")
                        handlePercentageChange(e);
                      if (discountTypee === "Flat") handleFlatChange(e);
                    }}
                  />
                )}
              />
              {errors.discountAmount && (
                <FormFeedback>{errors.discountAmount.message}</FormFeedback>
              )}
            </Col>
            <Col md="4" className="mb-1">
              <Label className="form-label" for="landmark">
                Calculate Discount Amount{" "}
                <span style={{ color: "red" }}>*</span>
              </Label>

              <Controller
                id="calDisAmount"
                name="calDisAmount"
                rules={{
                  required: "Discount Amount is required",
                  validate: validateNumber,
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    value={getValues("calDisAmount") || ""}
                    style={{ color: "#000" }}
                    placeholder="After DisCount value"
                    readOnly
                    invalid={errors.calDisAmount && true}
                    {...field}
                  />
                )}
              />

              {errors.calDisAmount && (
                <FormFeedback>{errors.calDisAmount.message}</FormFeedback>
              )}
            </Col> */}
        {otpVerify && (
          <Row className="mb-1">
            <div className="d-flex align-items-center justify-content-between w-100">
              <Col xs="auto" className="p-0 mt-2">
                <Button
                  color={isPercentage ? "success" : "warning"} // Set color based on isPercentage
                  outline={true}
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
                  Discount Amount Or Percentage
                  <span style={{ color: "red" }}>*</span>
                </Label>

                <InputGroup className="flex-grow-1">
                  <Controller
                    name="discountAmount"
                    rules={{
                      required: "Discount Type is required",
                      validate: validatePositiveNumber,
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder={
                          isPercentage ? "Enter percentage" : "Enter amount"
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value); // Sync with React Hook Form
                          if (isPercentage) {
                            handlePercentageChange(e);
                          } else {
                            handleFlatChange(e);
                          }
                        }}
                      />
                    )}
                  />
                  <InputGroupText className="bg-white text-muted">
                    {isPercentage ? "%" : "$"}
                  </InputGroupText>
                </InputGroup>
              </Col>
              <Col className="p-0 ">
                <Label className="form-label" for="landmark">
                  Discount Amount{" "}
                </Label>
                <Controller
                  name="calDisAmount"
                  control={control}
                  rules={{
                    required: "Discount Amount is required",
                    validate: validateNumber,
                  }}
                  render={({ field }) => (
                    <Input
                      value={getValues("calDisAmount") || ""}
                      style={{ color: "#000" }}
                      placeholder="After DisCount value"
                      // readOnly
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
                validate: validateNumber,
              }}
              render={({ field }) => (
                <Input
                  placeholder="Final Amount"
                  invalid={errors.finalPayment && true}
                  {...field}
                  readOnly
                  value={watch("finalPayment") || ""} // Use watch instead of getValues
                  onChange={(e) => {
                    handleFinalValue(e); // Call the handler if needed
                    field.onChange(e); // Update react-hook-form value
                  }}
                />
              )}
            />
            {errors.finalPayment && (
              <FormFeedback>{errors.finalPayment.message}</FormFeedback>
            )}
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
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
                  tomorrow.setHours(0, 0, 0, 0); // Normalize time to midnight

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
                    minDate: new Date(
                      new Date().setDate(new Date().getDate() + 1)
                    ), // Tomorrow's date as the minimum date
                  }}
                  value={field.value}
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
          {/* <Col md="12" className="mb-1">
            <Label className="form-label" for="hf-picker">
              Otp verification For the Cash Payment{" "}
              <span style={{ color: "red" }}>*</span>
            </Label>
            <br />
            <Button color="primary" outline>
              <Send className="me-1" size={20} />
              Generate otp
            </Button>

            {errors.paymentMode && (
              <FormFeedback className="d-block">
                {errors.paymentMode.value?.message ||
                  errors.paymentMode.message}
              </FormFeedback>
            )}
          </Col> */}
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
                  onChange={(selectedOption) => {
                    const value = selectedOption ? selectedOption.value : "";
                    field.onChange(value); // Update React Hook Form with the value
                    handlepaymentMode(selectedOption); // Run your custom function with the full option
                  }}
                  value={colourOptions3.find(
                    (option) => option.value === field.value
                  )} // To set the selected option correctly
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
                  <FormFeedback>{errors.cardExpiryMonth.message}</FormFeedback>
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
                    validate: validateNumber,
                  }}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Enter Routing Number"
                      invalid={!!errors.routingNumber}
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
                    validate: validateNumber,
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
                    validate: validateNumber,
                  }}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Enter Cheque Number"
                      invalid={!!errors.chequeNumber}
                      {...field}
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
                  />
                </FormGroup>

                {file && (
                  <div className="mt-3">
                    <h6>File Details:</h6>
                    <p>Name: {file.name}</p>
                    <p>Size: {renderFileSize(file.size)}</p>
                    {renderFilePreview(file)}
                    <div className="d-flex justify-content-end mt-2">
                      <Button color="danger" outline onClick={handleRemoveFile}>
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
                    validate: validateNumber,
                  }}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Enter Routing Number"
                      invalid={!!errors.routingNumber}
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
                    validate: validateNumber,
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
                    validate: validateNumber,
                  }}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Enter Cheque Number"
                      invalid={!!errors.chequeNumber}
                      {...field}
                    />
                  )}
                />
                {errors.chequeNumber && (
                  <FormFeedback>{errors.chequeNumber.message}</FormFeedback>
                )}
              </Col>
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
              color="primary"
              onClick={() => reset()}
              className="btn-reset me-2"
            >
              <span className="align-middle d-sm-inline-block d-none">
                Reset
              </span>
            </Button>
            <Button type="submit" color="primary" className="btn-next">
              <span className="align-middle d-sm-inline-block d-none">
                {loading ? <Spinner size="sm" /> : "Submit"}
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
      </Form>
    </Fragment>
  );
};

export default Address;
