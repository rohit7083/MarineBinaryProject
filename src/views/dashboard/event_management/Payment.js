import React, { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import Select from "react-select";
import { useState } from "react";
import GenerateDiscountOtp from "./GenerateDiscountOtp";
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
import { useForm, Controller, set } from "react-hook-form";
import { selectThemeColors } from "@utils";

function Payment({ stepper }) {
  const CompanyOptions = [
    { value: "WesternUnion", label: "WesternUnion" },
    { value: "MoneyGrams", label: "MoneyGrams" },
    { value: "Other", label: "Other" },
  ];
  const [mode, setMode] = useState("flat"); // "flat" or "percentage"
  const [value, setValuedis] = useState("");

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
    defaultValues: { advancePayment: false, finalAmount: "25000" },
  });
  const [paymentMode, setpaymentMode] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const advancePayment = watch("advancePayment");

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

  useEffect(() => {
    if (!advancePayment) {
      setValue("advance", "");
      setValue("remainingPayment", "");
    }
  }, [advancePayment]);

  /*
  useEffect(() => {
    {{debugger}}
  if (!isDiscount) {
    setValue("PfinalAmount", handleFinal);
  } 
   if (isDiscount && mode === "flat" && !advancePayment) {
    const afterDiscount = handleFinal - value;
    setValue("PfinalAmount", afterDiscount);
    console.log("After flat discount:", afterDiscount);
  } 
   if (isDiscount && mode === "percentage" && !advancePayment) {
    const percentage = (handleFinal * value) / 100;
    const afterDiscount = handleFinal - percentage;
    setValue("PfinalAmount", afterDiscount);
    console.log("After percentage discount:", afterDiscount);
  }
   if(advancePayment && handleAdvance){
    setValue("PfinalAmount", handleAdvance);
  }
   if(isDiscount && advancePayment && handleAdvance){
    const remaining2 = CurrentAmount - handleAdvance;
    setValue("remainingPayment", remaining2);

  }
}, [isDiscount,handleAdvance, advancePayment,mode, value, handleFinal, setValue]);
*/


// calculation for discount
  useEffect(() => {
    if (
      watch("discount") &&
      watch("discount_amt") &&
      mode === "flat" &&
      !watch("advancePayment")
    ) {
      const afterDiscount = handleFinal - watch("discount_amt");
      setValue("PfinalAmount", afterDiscount);
    } else if (
      watch("discount") &&
      watch("discount_amt") &&
      mode === "percentage" &&
      !watch("advancePayment")
    ) {
      const percentageAmount = (handleFinal * watch("discount_amt")) / 100;
      const afterDiscount = handleFinal - percentageAmount;
      setValue("PfinalAmount", afterDiscount);
    }
  }, [watch("discount"), watch("discount_amt"), mode,watch("advancePayment")]);


  // ** Advance payment calculation
  useEffect(() => {

    if (!watch("discount") && watch("advance") && watch("advancePayment")) {
      const afterDiscount = handleFinal - watch("advance");
      setValue("PfinalAmount", watch("advance"));
      setValue("remainingPayment", afterDiscount);
    }
  }, [watch("advance"), watch("advancePayment"),watch("discount")]);



  // Adv dis calculation
  useEffect(() => {
    if (watch("discount") && mode === "flat" && watch("advancePayment")) {
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
      mode === "percentage" &&
      watch("advancePayment")
    ) {
      if (watch("discount_amt") && watch("advance")) {
        // debugger
        const percentageAmount =
          (handleFinal * watch("discount_amt")) / 100 
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
        const percentageAmount =
          (handleFinal * watch("discount_amt")) / 100 
        const afterDiscount = handleFinal - percentageAmount ;

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
    // {{debugger}}
    if (
      !watch("discount") &&
      !watch("advancePayment") &&
      watch("PfinalAmount")
    ) {
      setValue("PfinalAmount", "");
    }
  }, [watch("discount"), watch("advancePayment")]);


  const onSubmit = async (data) => {
    stepper.next();

  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>

      <h4 className="mb-2">Payment Information</h4>
      <Row>
        <Col md="8" className="mb-1">
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
                  readOnly={true}
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

          <Col check className="mb-2">
            <Label check>
              <Controller
                name="discount"
                control={control}
                render={({ field }) => <Input {...field} type="checkbox" />}
              />{" "}
              Discount
            </Label>
          </Col>
          {isDiscount && (
            <>
              <GenerateDiscountOtp
                setShowModal={setShowModal}
                showModal={showModal}
                mode={mode}
                setMode={setMode}
                setValueInParent={setValue}
                keyName="discount_amt"
              />
            </>
          )}

          <Row>
            <Col check className="mb-2">
              <Label check>
                <Controller
                  name="advancePayment"
                  control={control}
                  render={({ field }) => <Input {...field} type="checkbox" />}
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
                    rules={{ required: "Advance payment is required", min: 0 }}
                    render={({ field }) => (
                      <Input
                        type="number"
                        defaultValue="1"
                        id="advance"
                        placeholder="Enter advance amount"
                        invalid={!!errors.advance}
                        {...field}
                      />
                    )}
                  />
                  {errors.advancePayment && (
                    <FormFeedback>{errors.advancePayment.message}</FormFeedback>
                  )}
                </Col>
                <Col md="12" className="mb-1">
                  <Label for="advancePayment">Remaining Payment</Label>
                  <Controller
                    name="remainingPayment"
                    control={control}
                    defaultValue="0"
                    rules={{
                      required: "Remaining payment is required",
                      min: 0,
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
                  {errors.advancePayment && (
                    <FormFeedback>{errors.advancePayment.message}</FormFeedback>
                  )}
                </Col>
              </>
            )}

            <Col md="12" className="mb-1">
              <Label for="finalInvoice">Currently Amount Payable</Label>
              <Controller
                name="PfinalAmount"
                control={control}
                rules={{ required: "Final  amount is required", min: 0 }}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="PfinalAmount"
                    readOnly={true}
                    placeholder="Enter total  amount"
                    invalid={!!errors.PfinalAmount}
                    {...field}
                  />
                )}
              />
              {errors.finalAmount && (
                <FormFeedback>{errors.finalAmount.message}</FormFeedback>
              )}
            </Col>

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
                      field.onChange(selectedOption); // Update React Hook Form with the value
                      handlepaymentMode(selectedOption); // Run your custom function with the full option
                    }}
                    menuPlacement="top"
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
              {/* <Cash_otp
            showModal={showModal}
            setErrMsz={setErrMsz}
            setShowModal={setShowModal}
            totalPayment={totalPayment}
            slipIID={slipIID || sId}
            memberId={memberID || mId}
            cashOtpVerify={formData[0]?.cashOtpVerify}
          /> */}

              {/* )} */}
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
                      //   maxLength: cardType === "Amex" ? 15 : 16,
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Card Number"
                        invalid={!!errors.cardNumber}
                        {...field}
                        // isDisabled={statusThree}

                        // onChange={(e) => handleOnchangeCardNum(e, field)}
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
                        // value={cardType}
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
                    Card Expiry Year <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Controller
                    name="cardExpiryYear"
                    control={control}
                    rules={{
                      required: "Expiry Year is required",
                      //   min: currentYear,
                      message: "Expiry Year cannot be in the past",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        // options={years}
                        placeholder="Select Year"
                        className={`react-select ${
                          errors.cardExpiryYear ? "is-invalid" : ""
                        }`}
                        classNamePrefix="select"
                        isClearable
                        // Set the selected value
                        // value={years.find((option) => option.value === field.value)}
                        // Extract the `value` on change
                        // onChange={(selectedOption) => {
                        //   field.onChange(selectedOption?.value || "");
                        //   handleYearChange(selectedOption); // Update available months based on year
                        // }}
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
                      //   maxLength: getCvvLength(cardType), // Dynamically set maxLength
                    }}
                    render={({ field }) => (
                      <Input
                        type="text" // Change type to text
                        // maxLength={getCv/vLength(cardType)} // Dynamically set maxLength
                        placeholder="Enter CVV Number"
                        invalid={!!errors.cardCvv}
                        {...field}
                        // isDisabled={statusThree}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          //   if (numericValue.length <= getCvvLength(cardType)) {
                          //     field.onChange(numericValue);
                          //   }
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
                          const onlyNumbers = e.target.value.replace(/\D/g, "");
                          field.onChange(onlyNumbers);
                        }}
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
                        // isDisabled={statusThree}

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
                        // isDisabled={statusThree}
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
                        // isDisabled={statusThree}
                      />
                    )}
                  />
                  {errors.chequeNumber && (
                    <FormFeedback>{errors.chequeNumber.message}</FormFeedback>
                  )}
                </Col>
              </Row>

              {/* <Row> */}
              {/* <Card>
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
                    <Button color="danger" outline onClick={handleRemoveFile}>
                      Remove File
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card> */}
              {/* </Row> */}
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
                        // isDisabled={statusThree}
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
                        // isDisabled={statusThree}
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
                  {/* {loading ? (
                <>
                  Loading.. <Spinner size="sm" />{" "}
                </>
              ) : ( */}
                  <>Submit</>
                  {/* )} */}
                </span>
                {/* {loading ? null : (
              <ArrowRight
                size={14}
                className="align-middle ms-sm-25 ms-0"
              ></ArrowRight>
            )} */}
              </Button>
            </div>
          </div>
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
                      <strong>$ {handleAdvance ? handleAdvance : "0"}</strong>
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
                      <strong>$ {handleRemaining || "0"} </strong>
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
                    {/* <div className="details-title">Discount</div>
                    <div className="detail-amt discount-amt text-danger">
                      {isDiscount ? isDiscount : "0"}
                      {mode === "percentage" ? " %" : " $"}
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
                    <div className="detail-amt">
                      $ {advancePayment ? handleAdvance : handleFinal}
                    </div>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>

      {/* {showQrModal && (
        <QrCodePayment
          setShowQrModal={setShowQrModal}
          showQrModal={showQrModal}
          qr={qr}
        />
      )} */}

      </Form>
    </>
  );
}

export default Payment;
