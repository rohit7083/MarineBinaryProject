// ** React Imports
import { Fragment } from "react";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import useJwt from "@src/auth/jwt/useJwt";
// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
import PersonalInfo from "./MemberDetails";

const Address = ({ stepper, combinedData, setCombinedData }) => {
  const colourOptions = [
    { value: "yearly", label: "yearly" },
    { value: "monthly", label: "monthly" },
  ];

  const colourOptions2 = [
    { value: "Percentage", label: "Percentage" },
    { value: "Flat", label: "Flat" },
  ];

  const colourOptions3 = [
    { value: "Credit Card", label: "Credit Card" },
    { value: "Card Swipe", label: "Card Swipe" },
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
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
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed

  // Generate year options for the next 30 years
  const years = Array.from({ length: 30 }, (_, i) => ({
    value: currentYear + i,
    label: (currentYear + i).toString(),
  }));
  const [picker, setPicker] = useState(new Date());
  const [nextPayment, setnextPayment] = useState(new Date());
  const [availableMonths, setAvailableMonths] = useState(months); // Initially show all months
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showOTPFields, setShowOTPFields] = useState(false);
  const [discounttoggle, setDiscountToggle] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false); // Tracks OTP button visibility
  const [discountTypee, setdiscountTypee] = useState(null);
  const [otp, setOtp] = useState("");
  const [paymentType, setPaymentType] = useState(null);
  const [marketPrices, setMarketPrices] = useState(null);
  const [calculatedDiscount, setCalculatedDiscount] = useState(0); // For storing calculated discount value
  // const [rentalPrice, setRentalPrice] = useState(""); // State to store rental price

  // Handle changes in the "Paid In" dropdown
  const handlePaidInChange = (option) => {
    console.log("Option selected:", option);
    if (option?.value === "monthly") {
      // setRentalPrice(slipDetail.marketMonthlyPrice); // Update rental price to monthly value
      setValue('MonYear',slipDetail.marketMonthlyPrice);

      console.log(
        "Updated Rental Price (Monthly):",
        slipDetail.marketMonthlyPrice
      );
    } else if (option?.value === "yearly") {
      // setRentalPrice(slipDetail.marketAnnualPrice); // Update rental price to yearly value
      setValue('MonYear',slipDetail.marketAnnualPrice);

      console.log(
        "Updated Rental Price (Yearly):",
        slipDetail.marketAnnualPrice
      );
    } else {
      // setRentalPrice(""); // Clear rental price if no valid option
      console.log("Cleared Rental Price");
    }
  };

  // Log rentalPrice whenever it updates
  // useEffect(() => {
  //   console.log("Rental Price updated:", rentalPrice);
  // }, [rentalPrice]);

  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(year.value); // Update the selected year

    // Determine the available months for the selected year
    if (year.value === currentYear) {
      // If the selected year is the current year, only show months from the current month onwards
      const remainingMonths = months.filter(
        (month) => parseInt(month.value) >= currentMonth
      );
      setAvailableMonths(remainingMonths);
    } else {
      // If it's a future year, show all months
      setAvailableMonths(months);
    }

    // Reset the month value when the year changes
    setValue("cardExpiryMonth", null);
  };

  const handleOTPClick = () => {
    setOtpVisible(true); // Show OTP state
    // Handle OTP button click (can trigger OTP API here)
    setShowOTPFields(true);
  };
  const handleDiscount = (event) => {
    // Handle OTP button click (can trigger OTP API here)
    const isToggled = event.target.checked;

    setDiscountToggle(isToggled); // Update toggle state
    if (!isToggled) {
      // Reset all states if toggled to "No"
      setOtpVisible(false);
      setShowOTPFields(false);
    }
  };

  const handleDisType = (selectMyType) => {
    // console.log(selectMyType);
    setdiscountTypee(selectMyType.label);
    // setValue('discountType', selectedOption?.value || '');
  };

  const handlePaymentType = (selectedOption) => {
    // Ensure that we are getting the correct value
    const selectedType = selectedOption?.value; // Extract the value

    if (selectedType) {
      setPaymentType(selectedType); // Update the payment type state
      console.log(selectedType); // Log the selected payment type (this should no longer be undefined)
    }
  };

  const [MonYearValue, setMonYearValue] = useState(0);
  const handleMonYear = (e) => {
    let MonthlyAnnual = e.target.value;
console.log(e.target.value);

    setMonYearValue(MonthlyAnnual);
    
  };

  const totalAmount = MonYearValue;
// console.log(totalAmount,"total amount");

  const handleFinalValue = (e) => {
    const finalAmount = e.target.value;

    setValue(finalAmount);
  };

  const handlePercentageChange = (e) => {
    const percentage = parseFloat(e.target.value);
    if (!isNaN(percentage)) {
      const discountValue = (percentage / 100) * totalAmount;
      setCalculatedDiscount(discountValue);

      setValue("finalPayment", totalAmount - discountValue); // Update the calculated field
      // console.log("MonYearValue=",MonYearValue,"discountValue",discountValue,"both",MonYearValue - discountValue);

      setValue("calDisAmount", discountValue);
    } else {
      setCalculatedDiscount(0);
      setValue("finalPayment", totalAmount); // Reset to original value
    }
  };

  const handleFlatChange = (e) => {
    const amount = e.target.value;
    // console.log(amount);
    setValue("calDisAmount", amount); // Update the calculated field

    setValue("finalPayment", totalAmount - amount); // Update the calculated field
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

  // Validate card number to ensure it contains exactly 16 digits
  const validateCardNumber = (value) => {
    if (!/^\d{16}$/.test(value)) {
      return "Card Number must be 16 digits";
    }
    return true;
  };

  // Validate CVV for 3 or 4 digits
  const validateCardCvv = (value) => {
    if (!/^\d{3,4}$/.test(value)) {
      return "CVV must be 3 or 4 digits";
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
    if (selectedDate <= today) {
      // Manually set error if the date is in the past
      setError(fieldName, {
        type: "manual",
        message: "The date must be in the future",
      });
      return false;
    } else {
      // Clear any previous errors
      clearErrors(fieldName);
      return true;
    }
  };

  // const defaultValues={
  //   contractDate: "17-12-2024 ",
  //     paidIn: "",
  //     MonYear: "2000",
  //     slipName: "yourSlip",
  //     distype: false,
  //     discountType: "Flat",
  //     discountAmount: "200",
  //     calDisAmount: "200",
  //     finalPayment: "1800",
  //     renewalDate: "26-8-2024",
  //     nextPaymentDate: "6-1-2029",

  // cardType: "",
  // cardNumber: "",
  // nameOnCard: "",
  // cardCvv: "",
  // cardExpiryYear: "",
  // cardExpiryMonth: "",
  // address: "",
  // city: "",
  // state:"",
  // country: "",
  // pinCode: "",

  // bankName: "",
  // nameOnAccount: "",
  // routingNumber: "",
  // accountNumber: "",
  // chequeNumber: "",

  // cardSwipeTransactionId: "",
  // }

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    // defaultValues,
    defaultValues: combinedData.paymentInfo, // Initialize with existing data
  });

  const onSubmit = (data) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value !== undefined && value !== null
      )
    );
    console.log(cleanData);

    if (Object.keys(errors).length === 0) {
      console.log(data); // Display data only if no errors
    } else {
      console.log("Validation failed", errors); // Log errors
    }

    setCombinedData((prev) => ({
      ...prev,
      paymentInfo: data,
    }));
    stepper.next();
  };
  const [slipDetail, setSlipDetail] = useState({});

  useEffect(() => {
    console.log(errors);
    console.log(combinedData);

    // Fetch the API data when the component mounts
    const fetchMarketPrices = async () => {
      try {
        const response = await useJwt.getslipDetail();
        // console.log("API Response:", response.data.content.result);

        const selectedSlip = response.data.content.result.find(
          (item) => item.id === combinedData.selectedSlipId
        );
        if (selectedSlip) {
          console.log("Selected Slip:", selectedSlip);
          setSlipDetail({
            marketAnnualPrice: selectedSlip.marketAnnualPrice,
            marketMonthlyPrice: selectedSlip.marketMonthlyPrice,
          });
        } else {
          console.error(
            "No slip found for the given ID:",
            combinedData.selectedSlipId
          );
        }
        // console.log("selected",selectedSlip.marketAnnualPrice);
      } catch (error) {
        console.error("Error fetching market prices:", error);
      }
    };
    fetchMarketPrices();
  }, [errors, combinedData.selectedSlipId]);
  // console.log("slipDetail",slipDetail);

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Payment</h5>
        <small>Enter Your Payment Details.</small>
      </div>
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
                    altFormat: "F j, Y",
                    dateFormat: "Y-m-d",
                    minDate: "today", // Disable all dates before today
                  }}
                  value={field.value}
                  onChange={(date) => field.onChange(date[0])} // Update value in the form
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
                    field.onChange(option ? option.value : "");
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
              id="MonYear"
              name="MonYear"
              rules={{
                required: "Monthly Value is required",
                validate: validateNumber,
              }}
              control={control}
              render={({ field }) => (
                <Input
                  placeholder=""
                  readOnly  
                  invalid={errors.MonYear && true}
                  {...field}
                  onChange={(e) => {
                    handleMonYear(e); // Call the handler if needed
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
              {/* "No" label to the left */}
              <Label
                className="me-1"
                htmlFor="distype"
                style={{ textAlign: "left" }}
              >
                No
              </Label>

              {/* Toggle switch */}
              <Input
                type="switch"
                name="distype"
                id="distype"
                onChange={handleDiscount}
                style={{ margin: 0 }}
              />

              {/* "Yes" label to the right */}
              <Label
                className="ms-1"
                htmlFor="distype"
                style={{ textAlign: "left" }}
              >
                Yes
              </Label>
            </div>
          </Col>
          {discounttoggle && !otpVisible && (
            <Col md="auto" className="mb-1 my-3">
              <Button.Ripple color="primary" onClick={handleOTPClick}>
                OTP
              </Button.Ripple>

              {errors.landmark && (
                <FormFeedback>{errors.landmark.message}</FormFeedback>
              )}
            </Col>
          )}
          {showOTPFields && discounttoggle && otpVisible && (
            <>
              {/* Centered OTP Input */}
              <Col md="auto" className="mb-1 my-3">
                <Controller
                  name="Userotp"
                  id="Userotp"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      invalid={errors.pincode && true}
                      {...field}
                    />
                  )}
                />
                {errors.Userotp && (
                  <FormFeedback>{errors.Userotp.message}</FormFeedback>
                )}
              </Col>

              {/* Centered Verify OTP Button */}
              <Col md="auto" className="mb-1 my-3">
                <Button.Ripple color="success" name="otpVerify">
                  Verify OTP
                </Button.Ripple>
              </Col>

              <p className="">
                <span>Didn’t get the code?</span>{" "}
                <a href="/" onClick={(e) => e.preventDefault()}>
                  Resend
                </a>{" "}
                <span>or</span>{" "}
                <a href="/" onClick={(e) => e.preventDefault()}>
                  Call us
                </a>
              </p>
            </>
          )}
        </Row>

        <Row>
          <Col md="4" className="mb-1">
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
              Calculate Discount Amount <span style={{ color: "red" }}>*</span>
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
          </Col>
        </Row>

        <Row>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="landmark">
              Total Amount <span style={{ color: "red" }}>*</span>
            </Label>

            <Controller
              id="finalPayment"
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
                  value={getValues("finalPayment") || ""}
                  onChange={(e) => {
                    handleFinalValue(e); // Call the handler if needed
                    field.onChange(e); // Update the react-hook-form value
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
                required: "ReNewal date is required",

                validate: validateFutureDate,
              }} // Apply custom validation for future date
              render={({ field }) => (
                <Flatpickr
                  id="hf-picker"
                  className={`form-control ${
                    errors.renewalDate ? "is-invalid" : ""
                  }`}
                  options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "Y-m-d",
                    minDate: "today", // Disable past dates
                  }}
                  value={field.value}
                  onChange={(date) => field.onChange(date[0])} // Set the selected date
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
              }} // Apply custom validation for future date
              render={({ field }) => (
                <Flatpickr
                  id="hf-picker"
                  className={`form-control ${
                    errors.nextPaymentDate ? "is-invalid" : ""
                  }`}
                  options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "Y-m-d",
                    minDate: "today", // Disable past dates
                  }}
                  value={field.value}
                  onChange={(date) => field.onChange(date[0])} // Update value in the form
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
              name="PaymentType"
              control={control}
              rules={{
                required: "Payment Mode is required",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={colourOptions3}
                  className={`react-select ${
                    errors.PaymentType ? "is-invalid" : ""
                  }`}
                  onChange={(selectedOption) => {
                    const value = selectedOption ? selectedOption.value : "";
                    field.onChange(value); // Update React Hook Form with the value
                    handlePaymentType(selectedOption); // Run your custom function with the full option
                  }}
                  value={colourOptions3.find(
                    (option) => option.value === field.value
                  )} // To set the selected option correctly
                />
              )}
            />

            {errors.PaymentType && (
              <FormFeedback className="d-block">
                {errors.PaymentType.value?.message ||
                  errors.PaymentType.message}
              </FormFeedback>
            )}
          </Col>
        </Row>

        {/* // ===================== credit card  */}

        {paymentType === "Credit Card" && (
          <>
            <Row>
              <div className="content-header">
                <h5 className="mb-0 my-2">Credit Card Details</h5>
                <small>Fill Credit Card Details</small>
              </div>
            </Row>

            <Row>
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
                    <Select
                      {...field}
                      options={colourOptions4}
                      placeholder="Select Card Type"
                      className={`react-select ${
                        errors.cardType ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      isClearable
                      // Set the selected value
                      value={colourOptions4.find(
                        (option) => option.value === field.value
                      )}
                      // Extract the `value` on change
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                    />
                  )}
                />
                {errors.cardType && (
                  <FormFeedback>{errors.cardType.message}</FormFeedback>
                )}
              </Col>

              <Col md="6" className="mb-1">
                <Label className="form-label" for="payment-card-number">
                  Card Number <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardNumber"
                  rules={{
                    required: "Card Number is required",
                    validate: validateCardNumber,
                  }}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter Card Number"
                      invalid={!!errors.cardNumber}
                      {...field}
                    />
                  )}
                />
                {errors.cardNumber && (
                  <FormFeedback>{errors.cardNumber.message}</FormFeedback>
                )}
              </Col>
            </Row>

            <Row>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="card-holder-name">
                  Card Holder's Name <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="nameOnCard"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter Card Holder's Name"
                      invalid={!!errors.nameOnCard}
                      {...field}
                    />
                  )}
                />
                {errors.nameOnCard && (
                  <FormFeedback>{errors.nameOnCard.message}</FormFeedback>
                )}
              </Col>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="payment-cvv">
                  Card CVV <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardCvv"
                  control={control}
                  rules={{
                    required: "CVV is required",
                    validate: validateCardCvv,
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
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
                    min: new Date().getFullYear(),
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
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
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
                      // Set the selected value
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

        {/* //* ============================ Bank Details   */}

        {paymentType === "Cheque" && (
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

        {/* ===================== card Swipe */}

        {paymentType === "Card Swipe" && (
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
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default Address;
