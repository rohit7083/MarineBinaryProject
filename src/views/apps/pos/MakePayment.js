import useJwt from "@src/auth/jwt/useJwt";
import CryptoJS from "crypto-js";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Select from "react-select";
import GenerateReceipt from "./GenerateRecipt";
import DiscountModal from "./modal/DiscountModal";
const PaymentSummary = () => {
  const { billing, items, selectedCustomerDetails } = useSelector(
    (store) => store.cartSlice
  );
  const [paymentMode, setPaymentMode] = useState(null);
  const [cardType, setCardType] = useState("");
  const [discountModal, setDiscountModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [showModal, setShowModal] = useState(false);
  const [txnId, setTxnId] = useState({});
  const [paymentLoader, setPaymentLoader] = useState(false);
  const toast = useRef(null);

  const [discountData, setDiscountData] = useState();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: ["", "", "", ""] },
  });
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
  const years = Array.from({ length: 10 }, (_, i) => {
    return {
      value: currentYear + i,
      label: currentYear + i,
    };
  });

  const colourOptions = [
    { value: "3", label: "Cash" },
    { value: "1", label: "Credit Card" },
  ];
  const watchOtp = watch("otp");
  const [availableMonths, setAvailableMonths] = useState([]);

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
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !watchOtp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-cash-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...watchOtp];
    newOtp[index] = value;
    setValue(`otp.${index}`, value);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-cash-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };
  const isDiscountApply = watch("isDiscountApply");

  const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";
  const encryptAES = (plainText) => {
    const key = CryptoJS.SHA256(SECRET_KEY);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
  };

  const onSubmit = async (data) => {
    let disCountUid;
    if (isDiscountApply === (false || undefined)) {
      const payload = {
        uids: items?.map((x) => x?.posId),
        isDiscountApply: false,
        totalAmount: billing?.total,
        subtotal: billing?.total,
        customerUid:
          selectedCustomerDetails.value || selectedCustomerDetails?.uid,
      };
      try {
        setPaymentLoader(true);

        const discountRes = await useJwt.posProductdis(payload);
        if (discountRes?.status === 200) {
          disCountUid = discountRes?.data?.uid;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const encryptedPin = encryptAES(data.otp.join(""));

    const formData = new FormData();

    formData.append("posOrder.uid", disCountUid || discountData?.disCountUid);
    formData.append("payment.paymentMode", data.paymentMode.value);
    formData.append("payment.finalPayment", billing?.total);
    if (data.paymentMode.value == 1) {
      formData.append("payment.cardNumber", data?.cardNumber);
      formData.append("payment.cardType", data?.cardType);
      formData.append("payment.cardExpiryMonth", data?.cardExpiryMonth);
      formData.append("payment.cardExpiryYear", data?.cardExpiryYear);
      formData.append("payment.cardCvv", data?.cardCvv);
      formData.append("payment.nameOnCard", data?.nameOnCard);
    } else {
      formData.append("pin", encryptedPin);
    }
    try {
      setPaymentLoader(true);

      const res = await useJwt.posPayment(formData);
      if (res?.data?.status !== "error") {
        const resId = res?.data?.transaction_id;
        setTxnId(resId);
        toast.current.show({
          severity: "success",
          summary: "Payment Successful",
          detail: "Your transaction was completed successfully.",
          life: 2000,
        });
        setShowModal(true);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Payment Failed",
          detail:
            "Something went wrong while processing your payment. Please try again.",
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.current.show({
          severity: "error",
          summary: "Invalid Card Details",
          detail: `${error.response?.data?.content}`,
          life: 2000,
        });
      }
    } finally {
      setPaymentLoader(false);
    }
  };

  return (
    <Card className="mt-3 shadow-sm border-0">
      <CardBody>
        <CardTitle tag="h5">Payment Summary</CardTitle>
        <Toast ref={toast} />

        <div className="d-flex justify-content-between mb-1">
          <span>Subtotal:</span>
          <span>${Number(billing?.subtotal || 0).toFixed(2)}</span>
        </div>
        {discountData?.calculatedDiscount > 0 && (
          <div className="d-flex justify-content-between mb-1">
            <span>Discount:</span>
            <span>-${discountData.calculatedDiscount}</span>
          </div>
        )}
        {/* <div className="d-flex justify-content-between mb-1">
          <span>Tax:</span>
          <span>${billing?.tax}</span>
        </div> */}
        <hr />
        <div className="d-flex justify-content-between fw-bold mb-3">
          <span>Grand Total:</span>
          <span>
            {Number(discountData?.calculatedDiscount) > 0 ? (
              <>
                $
                {(
                  Number(billing?.total) -
                  Number(discountData?.calculatedDiscount)
                ).toFixed(2)}
              </>
            ) : (
              <>${Number(billing?.total).toFixed(2)}</>
            )}
          </span>
        </div>

        <Col md="12" className="mb-2">
          <Controller
            name="isDiscountApply"
            control={control}
            render={({ field }) => (
              <div className="form-check">
                <Input
                  type="checkbox"
                  disabled={discountData?.status}
                  id="isDiscountApply"
                  checked={field.value || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    field.onChange(checked);
                 
                      setDiscountModal(checked);
                   
                  }}
                  className="form-check-input"
                />
                <Label for="isDiscountApply" className="form-check-label">
                  Apply Discount
                </Label>
              </div>
            )}
          />
        </Col>

        <DiscountModal
          isOpen={discountModal}
          toggle={() => setDiscountModal(!discountModal)}
          control={control}
          watchOtp={otpDigits}
          handleOtpChange={handleOtpChange}
          handleOtpKeyDown={handleOtpKeyDown}
          setDiscountData={setDiscountData}
        />

        <Row>
          <Col md="12" className="">
            <Label>Payment Mode</Label>
            <Controller
              name="paymentMode"
              control={control}
              rules={{ required: "Payment mode required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={colourOptions}
                  onChange={(option) => {
                    field.onChange(option);
                    setPaymentMode(option.label);
                  }}
                />
              )}
            />
            {errors.paymentMode && (
              <FormFeedback>{errors.paymentMode.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <form onSubmit={handleSubmit(onSubmit)}>
          {paymentMode === "Cash" && (
            <>
              <Row className="mt-2">
                <Label className="form-label" for="companyName">
                  Enter 4 digit Pin <span style={{ color: "red" }}>*</span>
                </Label>

                <Col md="12" className="mb-1">
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

          {/* CREDIT CARD PAYMENT SECTION */}
          {paymentMode === "Credit Card" && (
            <>
              <Col md="12" className="mb-2">
                <Label>
                  Card Number <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardNumber"
                  control={control}
                  rules={{
                    required: "Card Number is required",
                    minLength: {
                      value: cardType === "Amex" ? 15 : 16,
                      message:
                        cardType === "Amex"
                          ? "Card number must be 15 digits"
                          : "Card number must be 16 digits",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Card number must contain only numbers",
                    },
                  }}
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
                  <FormFeedback>{errors.cardNumber?.message}</FormFeedback>
                )}
              </Col>

              <Col md="12" className="mb-2">
                <Label>
                  Card Type <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardType"
                  control={control}
                  rules={{ required: "Card Type is required" }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      value={cardType}
                      readOnly
                      invalid={!!errors.cardType}
                      {...field}
                    />
                  )}
                />
                {errors.cardType && (
                  <FormFeedback>{errors.cardType?.message}</FormFeedback>
                )}
              </Col>

              <Col md="12" className="mb-2">
                <Label>
                  Expiry Year <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardExpiryYear"
                  control={control}
                  rules={{
                    required: "Expiry Year is required",
                    validate: (v) =>
                      v >= currentYear || "Expiry year cannot be in the past",
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
                      value={years.find((opt) => opt.value === field.value)}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                    />
                  )}
                />
                {errors.cardExpiryYear && (
                  <FormFeedback>{errors.cardExpiryYear?.message}</FormFeedback>
                )}
              </Col>

              <Col lg="12" className="mb-2">
                <Label>
                  Expiry Month <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardExpiryMonth"
                  control={control}
                  rules={{
                    required: "Expiry Month is required",
                    min: { value: 1, message: "Invalid month" },
                    max: { value: 12, message: "Invalid month" },
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
                        (opt) => opt.value === field.value
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                    />
                  )}
                />
                {errors.cardExpiryMonth && (
                  <FormFeedback>{errors.cardExpiryMonth?.message}</FormFeedback>
                )}
              </Col>

              <Col md="12" className="mb-2">
                <Label>
                  CVV <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardCvv"
                  control={control}
                  rules={{
                    required: "CVV is required",
                    minLength: {
                      value: getCvvLength(cardType),
                      message: `CVV must be ${getCvvLength(cardType)} digits`,
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "CVV must be numeric",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="password"
                      maxLength={getCvvLength(cardType)}
                      placeholder="Enter CVV"
                      invalid={!!errors.cardCvv}
                      {...field}
                    />
                  )}
                />
                {errors.cardCvv && (
                  <FormFeedback>{errors.cardCvv?.message}</FormFeedback>
                )}
              </Col>

              <Col md="12" className="mb-2">
                <Label>
                  Card Holder Name <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="nameOnCard"
                  control={control}
                  rules={{
                    required: "Card Holder Name is required",
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Name can only contain letters and spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter Card Holder Name"
                      invalid={!!errors.nameOnCard}
                      {...field}
                      onChange={(e) => {
                        // prevent user from typing numbers or special chars
                        const cleanedValue = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        field.onChange(cleanedValue);
                      }}
                    />
                  )}
                />
                {errors.nameOnCard && (
                  <FormFeedback>{errors.nameOnCard?.message}</FormFeedback>
                )}
              </Col>
            </>
          )}

          <Button
            color="success"
            type="submit"
            block
            disabled={paymentLoader}
            className="mt-1"
          >
            {paymentLoader ? (
              <>
                Loading.. <Spinner size="sm" />
              </>
            ) : (
              "            Complete Payment"
            )}
          </Button>
        </form>
      </CardBody>
      {/* <Button onClick={() => setShowModal(true)}>Click</Button> */}
      <GenerateReceipt
        setShowModal={setShowModal}
        txnId={txnId}
        showModal={showModal}
        discountData={discountData}
      />
    </Card>
  );
};

export default PaymentSummary;
