// ** React Imports
import { Fragment } from "react";
import { useState } from "react";
// ** Third Party Components
import Cleave from "cleave.js/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";
import Select from "react-select";

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";

const Address = ({ stepper }) => {
  const [picker, setPicker] = useState(new Date());
  const [nextPayment, setnextPayment] = useState(new Date());

  const colourOptions = [
    { value: "Annually", label: "Annually" },
    { value: "Monthly", label: "Monthly" },
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

  const [availableMonths, setAvailableMonths] = useState(months); // Initially show all months
  const [selectedYear, setSelectedYear] = useState(currentYear);

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

  const [showOTPFields, setShowOTPFields] = useState(false);
  const [discounttoggle, setDiscountToggle] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false); // Tracks OTP button visibility
  const [discountTypee, setdiscountTypee] = useState(null);
  const [otp, setOtp] = useState("");
  const [PaymentType, setPaymentType] = useState(null);

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
    console.log(selectMyType.value);
    setdiscountTypee(selectMyType.label);
    // setValue('discountType', selectedOption?.value || '');
  };

  const handlePaymentType = (selectPayType) => {
    // console.log(selectMyType);
    console.log(selectPayType.value);
    setPaymentType(selectPayType.label);
  };

  const defaultValues = {
    PaymentType: "", // For conditional validation
    cardSwipeTransactionId: "", // For Card Swipe Transaction ID
    contractDate: "", // Assuming it's nullable or optional
    // paidIn: {
    //   value: "", // Nested object field
    // },
    pincode: "", // For Monthly Value
    Userotp: "", // For User OTP
    // discountType: {
    //   value: "", // Nested object field
    // },
    discountAmount: 0, // Default to 0 or a positive value
    calDisAmount: 0, // Default to 0 or a positive value
    finalPayment: 0, // Default to 0 or a positive value
    renewalDate: "", // Assuming it's a nullable date
    nextPaymentDate: "", // Assuming it's a nullable date
    paymentMode: {
      value: "", // Nested object field
    },
    cardType: "", // Default card type
    cardNumber: "", // Placeholder for card number (16 digits)
    nameOnCard: "", // Placeholder for card holder's name
    cardCvv: "", // Placeholder for 3-digit CVV
    cardExpiryYear: "", // Placeholder for expiry year
    cardExpiryMonth: "", // Placeholder for expiry month
    address: "", // Placeholder for address
    city: "", // Placeholder for city
    state: "", // Placeholder for state
    country: "", // Placeholder for country
    pinCode: "", // Placeholder for 6-digit pincode

    // Bank Details (if PaymentType is Cheque)
    bankName: "", // Placeholder for bank name
    nameOnAccount: "", // Placeholder for account name
    routingNumber: "", // Placeholder for routing number
    accountNumber: "", // Placeholder for account number
    chequeNumber: "", // Placeholder for cheque number
  };

  const PaymentValidationSchema = yup.object().shape({
    // contractDate: yup.date().required("Contract Date is required"),
    paidIn: yup
      .object()
      .shape({
        value: yup.string().required("Paid In is required"),
      })
      .nullable()
      .required("Paid In is required"),
    pincode: yup.string().required("Monthly Value is required"),
    Userotp: yup.string().required("Userotp Value is required"),

    discountType: yup.object().shape({
      value: yup.string().required("Discount type is required"),
    }),
    discountAmount: yup
      .number()
      .positive("Discount amount must be positive")
      .required("Discount amount is required"),
    calDisAmount: yup
      .number()
      .positive("Calculated discount amount must be positive")
      .required("Calculated discount amount is required"),
    finalPayment: yup
      .number()
      .positive("Final payment must be positive")
      .required("Total amount is required"),
    renewalDate: yup
      .date()
      .required("Renewal Date is required")
      .nullable()
      .min(new Date(), "Renewal Date cannot be in the past"), // Optional: Prevent selecting a date in the past
    nextPaymentDate: yup.date().required("Next Payment Date is required"),
    PaymentType: yup.string().required("Payment Type is required"),

    cardType: yup.string().required("Card Type is required"),
    cardNumber: yup
      .string()
      .matches(/^\d{16}$/, "Card Number must be 16 digits")
      .required("Card Number is required"),
    nameOnCard: yup.string().required("Card Holder's Name is required"),
    cardCvv: yup
      .string()
      .matches(/^\d{3}$/, "CVV must be 3 digits")
      .required("Card CVV is required"),
    cardExpiryYear: yup.string().required("Card Expiry Year is required"),
    cardExpiryMonth: yup.string().required("Card Expiry Month is required"),

    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),

    pinCode: yup
      .string()
      .matches(/^\d{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),

    // Bank Name validation for text input
    bankName: yup
      .string()
      .required("Bank Name is required")
      .matches(
        /^[a-zA-Z\s-]+$/,
        "Bank Name must contain only alphabetic characters, hyphens, and spaces"
      ),

    nameOnAccount: yup
      .string()
      .required("Account Name is required")
      .matches(
        /^[a-zA-Z\s-]+$/,
        "Account Name must contain only alphabetic characters, hyphens, and spaces"
      ),

    routingNumber: yup
      .string()
      .matches(/^\d{9}$/, "Routing Number must be exactly 9 digits")
      .when("PaymentType", {
        is: "Cheque",
        then: (schema) => schema.required("Routing Number is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    accountNumber: yup
      .string()
      .matches(/^\d+$/, "Account Number must be a valid number")
      .when("PaymentType", {
        is: "Cheque",
        then: (schema) => schema.required("Account Number is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    chequeNumber: yup
      .string()
      .matches(/^\d+$/, "Cheque Number must be a valid number")
      .when("PaymentType", {
        is: "Cheque",
        then: yup.string().required("Cheque Number is required"),
        otherwise: yup.string().notRequired(),
      }),

    cardSwipeTransactionId: yup.string().required("Transaction ID is required"),
  });

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues,

    resolver: yupResolver(PaymentValidationSchema),
  });

  const [MonYearValue, setMonYearValue] = useState(0);
  const handleMonYear = (e) => {
    let MonthlyAnnual = e.target.value;

    setMonYearValue(MonthlyAnnual);
  };

  const totalAmount = MonYearValue;
  const [calculatedDiscount, setCalculatedDiscount] = useState(0); // For storing calculated discount value

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
    console.log(amount);
    setValue("calDisAmount", amount); // Update the calculated field

    setValue("finalPayment", totalAmount - amount); // Update the calculated field
  };

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      stepper.next();
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
            message: `Please enter a valid ${key}`,
          });
        }
      }
    }
  };

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
            <Flatpickr
              value={picker}
              id="hf-picker"
              name="contractDate"
              className="form-control"
              onChange={(date) => setPicker(date)}
              options={{
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
              }}
              style={{ color: "black" }} // Apply black color
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
              name="paidIn"
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  {...field}
                  isClearable
                  options={colourOptions}
                  invalid={!!errors.paidIn}
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
              Monthly Value
              <span style={{ color: "red" }}>*</span>
            </Label>

            <Controller
              id="MonYear"
              name="MonYear"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="658921"
                  invalid={errors.MonYear && true}
                  {...field}
                  onChange={(e) => {
                    handleMonYear(e); // Call the handler if needed
                    field.onChange(e); // Update the react-hook-form value
                  }}
                />
              )}
            />
            {errors.pincode && (
              <FormFeedback>{errors.pincode.message}</FormFeedback>
            )}
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

        <Row className="my-2">
          <Col md="4" className="mb-1">
            <Label className="form-label" for="hf-picker">
              Discount type <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              control={control}
              name="discountType"
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  {...field}
                  isClearable
                  options={colourOptions2}
                  invalid={!!errors.discountType}
                  onChange={handleDisType}
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
              id="discountAmount"
              name="discountAmount"
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
                    field.onChange(e);
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
            <Flatpickr
              value={picker}
              id="hf-picker"
              name="renewalDate"
              className="form-control"
              onChange={(date) => setPicker(date)}
              options={{
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
                disable: [
                  (date) => {
                    // Disable today's date
                    const today = new Date();
                    return (
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear()
                    );
                  },
                ],
              }}
              style={{ color: "black" }}
            />
            {errors.renewalDate && (
              <FormFeedback>{errors.renewalDate.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="hf-picker">
              Next Payment Date <span style={{ color: "red" }}>*</span>
            </Label>
            <Flatpickr
              value={nextPayment}
              id="hf-picker"
              name="nextPaymentDate"
              className="form-control"
              onChange={(date) => setnextPayment(date)}
              options={{
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
                disable: [
                  (date) => {
                    // Disable today's date
                    const today = new Date();
                    return (
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear()
                    );
                  },
                ],
              }}
              style={{ color: "black" }}
            />
            {errors.address && (
              <FormFeedback>{errors.address.message}</FormFeedback>
            )}
          </Col>
        </Row>

        <Row>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="hf-picker">
              Payment Mode <span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              // defaultValue={colourOptions[0]}
              name="paymentMode"
              options={colourOptions3}
              onChange={handlePaymentType}
              isClearable
            />

            {errors.paymentMode && (
              <FormFeedback>{errors.paymentMode.message}</FormFeedback>
            )}
          </Col>
        </Row>

        {/* // ===================== credit card  */}

        {PaymentType == "Credit Card" && (
          <>
            <Row>
              <div className="content-header">
                <h5 className="mb-0 my-2">Credit Card Details</h5>
                <small>Fill Credit card Details</small>
              </div>
            </Row>

            <Row>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="card-type">
                  Card Type <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={colourOptions4}
                      placeholder="Select Card Type"
                      isClearable
                      className="react-select"
                      classNamePrefix="select"
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
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="cardNumber"
                      placeholder="Enter Account Number"
                      invalid={!!errors.cardNumber} // Highlights field in case of error
                      {...field} // Binds the field to react-hook-form
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
                      placeholder="Enter Account Number"
                      invalid={!!errors.nameOnCard} // Highlights field in case of error
                      {...field} // Binds the field to react-hook-form
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
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter CVV Number"
                      invalid={!!errors.cardCvv} // Highlights field in case of error
                      {...field} // Binds the field to react-hook-form
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
                  defaultValue={null}
                  rules={{ required: "Year is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={years}
                      placeholder="Select Year"
                      className="react-select"
                      classNamePrefix="select"
                      isClearable
                      onChange={handleYearChange} // Handle year change
                      value={years.find((year) => year.value === field.value)} // Set the selected year value
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
                  defaultValue={null}
                  rules={{ required: "Month is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={availableMonths} // Use the dynamically updated available months
                      placeholder="Select Month"
                      className="react-select"
                      classNamePrefix="select"
                      isClearable
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
                <Label className="form-label" for="address">
                  Address <span style={{ color: "red" }}>*</span>
                </Label>

                <Controller
                  name="nameOnCard"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter address "
                      invalid={!!errors.nameOnCard} // Highlights field in case of error
                      {...field} // Binds the field to react-hook-form
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
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter city "
                      invalid={!!errors.city} // Highlights field in case of error
                      {...field} // Binds the field to react-hook-form
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
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter state "
                      invalid={!!errors.state} // Highlights field in case of error
                      {...field} // Binds the field to react-hook-form
                    />
                  )}
                />
                {errors.state && (
                  <FormFeedback>{errors.state.message}</FormFeedback>
                )}
              </Col>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="country">
                  Country
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter country "
                      invalid={!!errors.country} // Highlights field in case of error
                      {...field} // Binds the field to react-hook-form
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
                  Pincode
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="pinCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter Pincode"
                      invalid={!!errors.pinCode} // Highlights field in case of error

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

        {PaymentType == "Cheque" && (
          <>
            <div className="content-header">
              <h5 className="mb-0 my-2">Bank Details</h5>
              <small>Fill Bank Details</small>
            </div>
            <Row>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="payment-input-name">
                  Bank Name
                  <span style={{ color: "red" }}>*</span>
                </Label>

                <Controller
                  control={control}
                  name="bankName"
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter Bank Name"
                      invalid={errors.bankName && true}
                      {...field}
                    />
                  )}
                />
                {errors.bankName && (
                  <FormFeedback>{errors.bankName.message}</FormFeedback> // Displays the error message
                )}
              </Col>

              <Col md="6" className="mb-1">
                <Label className="form-label" for="hf-picker">
                  Account Name
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="nameOnAccount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter Account Name"
                      invalid={!!errors.nameOnAccount} // Highlights field in case of error
                      {...field} // This will bind the input to react-hook-form
                    />
                  )}
                />
                {errors.nameOnAccount && (
                  <FormFeedback>{errors.nameOnAccount.message}</FormFeedback> // Show the validation message
                )}
              </Col>
            </Row>

            <Row>
              <Col md="4" className="mb-1">
                <Label className="form-label" for="hf-picker">
                  Rounting Number
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="routingNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Enter Account Number"
                      id="payment-routingNumber"
                      invalid={!!errors.routingNumber} // Highlights field in case of error
                      {...field} // Binds the field to react-hook-form
                    />
                  )}
                />

                {errors.routingNumber && (
                  <FormFeedback>{errors.routingNumber.message}</FormFeedback>
                )}
              </Col>
              <Col md="4" className="mb-1">
                <Label className="form-label" for="hf-picker">
                  Account Number
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Enter Account Number"
                      id="payment-account-number"
                      invalid={!!errors.accountNumber} // Highlights field in case of error
                      {...field} // Binds the field to react-hook-form
                    />
                  )}
                />
                {errors.accountNumber && (
                  <FormFeedback>{errors.accountNumber.message}</FormFeedback>
                )}
              </Col>

              <Col md="4" className="mb-1">
                <Label className="form-label" for="hf-picker">
                  Cheque Number
                  <span style={{ color: "red" }}>*</span>
                </Label>

                <Controller
                  name="chequeNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Enter Cheque Number"
                      id="payment-cvv"
                      invalid={!!errors.chequeNumber} // Highlights the field if there's an error
                      {...field} // Binds the input field to React Hook Form
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
        {PaymentType == "Card Swipe" && (
          <>
            <Row>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="hf-picker">
                  Card Swipe Transaction ID
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  id="cardSwipeTransactionId"
                  name="cardSwipeTransactionId"
                  control={control}
                  render={({ field }) => (
                    <Input
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
