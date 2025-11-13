import CryptoJS from "crypto-js";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

//import jwt
import useJwt from "@src/auth/jwt/useJwt";

// ** PrimeReact
import { Toast } from "primereact/toast";
import { Navigate, useNavigate } from "react-router-dom";

function SwitchSlipForm({ payer, ammountTobePaid, payloadsent, responseData }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      finalPayment: ammountTobePaid || "",
      paymentMode: null,
      pin: ["", "", "", ""],
      cardNumber: "",
      cardType: "",
      cardExpiryYear: "",
      cardExpiryMonth: "",
      cardCvv: "",
      nameOnCard: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
  });
  const navigate = useNavigate();
  const [paymentMode, setPaymentMode] = useState("");
  const [cardType, setCardType] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const payerfromParent = payer;
  const today = new Date().toISOString().split("T")[0];
  const toast = useRef(null);

  const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";

  // Encryption functions
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

  // useEffect to auto-fill amount when ammountTobePaid prop changes
  useEffect(() => {
    if (ammountTobePaid) {
      setValue("finalPayment", ammountTobePaid);
    }
  }, [ammountTobePaid, setValue]);

  // Payment Mode Options
  const paymentModeOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Credit Card", label: "Credit Card" },
  ];

  // Year Options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => ({
    value: currentYear + i,
    label: (currentYear + i).toString(),
  }));

  // Month Options
  const months = [
    { value: 1, label: "01 - January" },
    { value: 2, label: "02 - February" },
    { value: 3, label: "03 - March" },
    { value: 4, label: "04 - April" },
    { value: 5, label: "05 - May" },
    { value: 6, label: "06 - June" },
    { value: 7, label: "07 - July" },
    { value: 8, label: "08 - August" },
    { value: 9, label: "09 - September" },
    { value: 10, label: "10 - October" },
    { value: 11, label: "11 - November" },
    { value: 12, label: "12 - December" },
  ];

  // Handle Payment Mode Change
  const handlepaymentMode = (selectedOption) => {
    setPaymentMode(selectedOption?.value || "");
  };

  // Handle Card Number Change
  const handleOnchangeCardNum = (e, field) => {
    const value = e.target.value.replace(/\D/g, "");
    field.onChange(value);

    // Detect card type
    if (value.startsWith("34") || value.startsWith("37")) {
      setCardType("Amex");
      setValue("cardType", "Amex");
    } else if (value.startsWith("4")) {
      setCardType("Visa");
      setValue("cardType", "Visa");
    } else if (value.startsWith("5")) {
      setCardType("Mastercard");
      setValue("cardType", "Mastercard");
    } else if (value.startsWith("6")) {
      setCardType("Discover");
      setValue("cardType", "Discover");
    } else {
      setCardType("");
      setValue("cardType", "");
    }
  };

  // Get CVV Length
  const getCvvLength = (type) => {
    return type === "Amex" ? 4 : 3;
  };

  // Handle Year Change
  const handleYearChange = (selectedOption) => {
    const selectedYear = selectedOption?.value;
    if (selectedYear === currentYear) {
      const currentMonth = new Date().getMonth() + 1;
      setAvailableMonths(months.filter((m) => m.value >= currentMonth));
    } else {
      setAvailableMonths(months);
    }
  };

  // Get ReadOnly Style
  const getReadOnlyStyle = () => ({
    backgroundColor: "#e9ecef",
    cursor: "not-allowed",
  });

  // Form Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Encrypt PIN
      const pin = data.pin.join("");
      const encryptedPin = encryptAES(pin);

      if (data.paymentMode.value === "Cash") {
        const payload = {
          ...payloadsent,
          switchDate: today,
          fromAmount: responseData.fromAmount,
          toAmount: responseData.toAmount,
          fromExtraDays: responseData.fromDays,
          toExtraDays: responseData.toDays,
          paymentMode: "Cash",
          pin: encryptedPin,
          payment: {},
        };

        console.log("Cash Payload:", payload);
        const response = await useJwt.postSwitchSlip(payload);
        console.log("Cash Response:", response);
        setTimeout(() => {
          navigate("/dashboard/slipmember_list");
        }, [2000]);
        if (response?.data?.code === 200 || 201) {
          toast.current.show({
            severity: "success",
            summary: "Slip Switched",
            detail: "Slip switched successfully",
            life: 2000,
          });
          setTimeout(() => {
            Navigate("/dashboard/slipmember_list");
          }, [2000]);
          re -= set();
          setPaymentMode("");
          setCardType("");

          setTimeout(() => {
            navigate("/dashboard/slipmember_list");
          }, [2000]);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Slip Switched",
            detail: "Slip switched Failed",
            life: 2000,
          });
        }
      } else if (data.paymentMode.value === "Credit Card") {
        const payload = {
          ...payloadsent,
          switchDate: today,
          fromAmount: responseData.fromAmount,
          toAmount: responseData.toAmount,
          fromExtraDays: responseData.fromDays,
          toExtraDays: responseData.toDays,
          paymentMode: "CreditCard",

          payment: {
            cardNumber: data.cardNumber,
            cardType: cardType,
            cardExpiryMonth: data.cardExpiryMonth.toString(),
            cardExpiryYear: data.cardExpiryYear.toString(),
            cardCvv: data.cardCvv,
            nameOnCard: data.nameOnCard,
          },
        };

        console.log("Credit Card Payload:", payload);
        const response = await useJwt.postSwitchSlip(payload);
        console.log("Credit Card Response:", response);
        setTimeout(() => {
          navigate("/dashboard/slipmember_list");
        }, [2000]);
        if (response?.data?.code === 200 || 201) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Payment Failed",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/dashboard/slipmember_list");
          }, [2000]);
          reset();
          setPaymentMode("");
          setCardType("");
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to switch Slip",
            life: 2000,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error submitting payment. Please try again.";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <h3>Payment From: {payerfromParent}</h3>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="finalPayment">
              Total Amount <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              name="finalPayment"
              control={control}
              rules={{
                required: "Final Payment is required",
                validate: (value) =>
                  parseFloat(value) >= 0 || "Final Payment cannot be negative",
              }}
              render={({ field }) => (
                <Input
                  placeholder="Final Amount"
                  invalid={errors.finalPayment && true}
                  {...field}
                  value={ammountTobePaid || field.value}
                  readOnly
                  style={getReadOnlyStyle()}
                />
              )}
            />
            {errors.finalPayment && (
              <FormFeedback>{errors.finalPayment.message}</FormFeedback>
            )}
          </Col>
        </Row>

        <Row>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="paymentMode">
              Payment Mode <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              name="paymentMode"
              control={control}
              rules={{
                required: "Payment Mode is required",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={paymentModeOptions}
                  className={`react-select ${
                    errors.paymentMode ? "is-invalid" : ""
                  }`}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handlepaymentMode(selectedOption);
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

        {/* Cash Payment */}
        {paymentMode === "Cash" && (
          <Row className="mb-2">
            <Col sm="4">
              <Label className="form-label" for="pin">
                Enter Pin <span style={{ color: "red" }}>*</span>
              </Label>
              <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                {[...Array(4)].map((_, index) => (
                  <Controller
                    key={index}
                    name={`pin[${index}]`}
                    control={control}
                    rules={{
                      required: "All pin digits are required",
                      pattern: {
                        value: /^[0-9]$/,
                        message: "Each pin digit must be a number",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        maxLength={1}
                        type="password"
                        id={`pin-input-${index}`}
                        className={`auth-input height-50 text-center numeral-mask mx-25 mb-1 ${
                          errors.pin?.[index] ? "is-invalid" : ""
                        }`}
                        autoFocus={index === 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!/^[0-9]$/.test(value) && value !== "") return;

                          field.onChange(e);

                          if (value && index < 3) {
                            const nextInput = document.getElementById(
                              `pin-input-${index + 1}`
                            );
                            nextInput?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            !field.value &&
                            index > 0
                          ) {
                            const prevInput = document.getElementById(
                              `pin-input-${index - 1}`
                            );
                            prevInput?.focus();
                          }
                        }}
                      />
                    )}
                  />
                ))}
              </div>
              {errors.pin && errors.pin.some((err) => err) && (
                <FormFeedback className="d-block">
                  {errors.pin.find((err) => err)?.message ||
                    "All pin digits are required"}
                </FormFeedback>
              )}
            </Col>
          </Row>
        )}

        {/* Credit Card Payment */}
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
                <Label className="form-label" for="cardNumber">
                  Card Number <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardNumber"
                  rules={{
                    required: "Card Number is required",
                    validate: (value) => {
                      if (!value) return "Card Number is required";
                      if (cardType === "Amex" && value.length !== 15) {
                        return "Amex card must be 15 digits";
                      }
                      if (cardType !== "Amex" && value.length !== 16) {
                        return "Card number must be 16 digits";
                      }
                      return true;
                    },
                  }}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter Card Number"
                      invalid={!!errors.cardNumber}
                      maxLength={cardType === "Amex" ? 15 : 16}
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
                <Label className="form-label" for="cardType">
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
                      invalid={!!errors.cardType}
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
                <Label className="form-label" for="cardExpiryYear">
                  Card Expiry Year <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardExpiryYear"
                  control={control}
                  rules={{
                    required: "Expiry Year is required",
                    validate: (value) => {
                      if (!value) return "Expiry Year is required";
                      if (value < currentYear)
                        return "Expiry Year cannot be in the past";
                      return true;
                    },
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
                      value={years.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value || "");
                        handleYearChange(selectedOption);
                      }}
                    />
                  )}
                />
                {errors.cardExpiryYear && (
                  <FormFeedback className="d-block">
                    {errors.cardExpiryYear.message}
                  </FormFeedback>
                )}
              </Col>

              <Col md="6" className="mb-1">
                <Label className="form-label" for="cardExpiryMonth">
                  Card Expiry Month <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardExpiryMonth"
                  control={control}
                  rules={{
                    required: "Expiry Month is required",
                    validate: (value) => {
                      if (!value) return "Expiry Month is required";
                      if (value < 1 || value > 12)
                        return "Expiry Month must be between 1 and 12";
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={
                        availableMonths.length > 0 ? availableMonths : months
                      }
                      placeholder="Select Month"
                      className={`react-select ${
                        errors.cardExpiryMonth ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      isClearable
                      value={(availableMonths.length > 0
                        ? availableMonths
                        : months
                      ).find((option) => option.value === field.value)}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                    />
                  )}
                />
                {errors.cardExpiryMonth && (
                  <FormFeedback className="d-block">
                    {errors.cardExpiryMonth.message}
                  </FormFeedback>
                )}
              </Col>
            </Row>

            <Row>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="cardCvv">
                  Card CVV <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="cardCvv"
                  control={control}
                  rules={{
                    required: "CVV is required",
                    validate: (value) => {
                      if (!value) return "CVV is required";
                      const requiredLength = getCvvLength(cardType);
                      if (value.length !== requiredLength) {
                        return `CVV must be ${requiredLength} digits`;
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="password"
                      maxLength={getCvvLength(cardType)}
                      placeholder={`Enter ${getCvvLength(cardType)} digit CVV`}
                      invalid={!!errors.cardCvv}
                      {...field}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        if (numericValue.length <= getCvvLength(cardType)) {
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
                <Label className="form-label" for="nameOnCard">
                  Card Holder's Name <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="nameOnCard"
                  control={control}
                  rules={{
                    required: "Card Holder's Name is required",
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Only alphabetic characters and spaces allowed",
                    },
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Name must be at most 50 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Enter Card Holder's Name"
                      invalid={!!errors.nameOnCard}
                      {...field}
                      onChange={(e) => {
                        const onlyAlphabetsAndSpaces = e.target.value.replace(
                          /[^a-zA-Z ]/g,
                          ""
                        );
                        field.onChange(onlyAlphabetsAndSpaces);
                      }}
                    />
                  )}
                />
                {errors.nameOnCard && (
                  <FormFeedback>{errors.nameOnCard.message}</FormFeedback>
                )}
              </Col>
            </Row>
          </>
        )}

        {/* Form Action Buttons */}
        <div className="d-flex justify-content-end mt-3">
          <Button
            type="button"
            color="secondary"
            onClick={() => {
              reset();
              setPaymentMode("");
              setCardType("");
              setAvailableMonths([]);
            }}
            className="me-2"
          >
            Reset
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={loading}
            onClick={() => clearErrors()}
          >
            {loading ? (
              <>
                Loading... <Spinner size="sm" />
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default SwitchSlipForm;
