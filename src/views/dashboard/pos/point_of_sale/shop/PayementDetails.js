import useJwt from "@src/auth/jwt/useJwt";
import CryptoJS from "crypto-js";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import CartSummery from "../CartSummery";
import DiscountModal from "./DiscountModal";

const getVariationUids = async (uids) => {
  try {
    const response = await useJwt.getVariationUid(uids);
    console.log("Variation UIDs:", response);
    return response;
  } catch (error) {
    console.error("Error fetching variation UIDs:", error);
    return [];
  }
};

export default function Payment() {
  const location = useLocation();

  const customerUid = location.state?.customeUid || null;
  const selectedProduct = location.state?.selecltedProductList;
  const navigate = useNavigate();
  const toast = useRef(null);

  const [paymentMode, setPaymentMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [discountModal, setDiscountModal] = useState(false);
  const [verifyDiscount, setVerifyDiscount] = useState(false);

  const colourOptions = [
    { value: "3", label: "Cash" },
    { value: "1", label: "Credit Card" },
  ];

  const discountOptions = [
    { value: "percentage", label: "Percentage" },
    { value: "flat", label: "Flat" },
  ];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMode: null,
      pin: "",
      cardNumber: "",
      cardType: "",
      cardExpiryMonth: "",
      cardExpiryYear: "",
      cardCvv: "",
      nameOnCard: "",
      isDiscountApply: false,
      discountType: null,
      discount: 0,
      finalAmount: 0,
      otp: ["", "", "", ""],
    },
  });

  const [posUid, setPosUid] = useState(null);
  const [caldis, setCaldis] = useState(0);
  const [finalAmt, setFinalAmt] = useState(0);

  const handleValuesChange = ({ caldis, finalAmt }) => {
    setCaldis(caldis);
    setFinalAmt(finalAmt);
  };

  useEffect(() => {
    if (verifyDiscount) {
      setValue("finalAmount", finalAmt);
      setValue("caldis", caldis);
    }
  }, [verifyDiscount, caldis, finalAmt, setValue]);

  const watchSubtotal = watch("finalAmount");

  const handleNoDiscount = async () => {
    const payload = {
      uids: uids?.map((x) => x),
      isDiscountApply: false,
      subtotal: watchSubtotal,
      totalAmount: watchSubtotal,
      customerUid: customerUid,
      // slipUid:
    };

    try {
      // {{ }}
      const res = await useJwt.posProductdis(payload);
      if (res?.data?.code === 200) {
        setPosUid(res?.data?.uid);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleNoDiscount();
  }, []);

  const watchDiscountApply = watch("isDiscountApply");
  const watchDiscountType = watch("discountType");
  const watchDiscountValue = watch("discount");

  const subtotal = selectedProduct.reduce(
    (sum, p) => sum + (p.totalPrice || 0),
    0
  );
  const discountAmount = (() => {
    if (!watchDiscountApply) return 0;

    const rawValue = Number(watchDiscountValue) || 0;
    if (!watchDiscountType || rawValue <= 0) return 0;

    switch (watchDiscountType.value) {
      case "percentage":
        return subtotal * (rawValue / 100);

      case "flat":
        return rawValue > subtotal ? subtotal : rawValue; // cap flat discount

      default:
        return 0;
    }
  })();
  const totalToPay = Math.max(subtotal - discountAmount, 0);

  useEffect(() => {
    setValue("finalAmount", totalToPay);
  }, [totalToPay, setValue]);

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
  const onSubmit = () => {};

  const handleDiscountSuccess = (payload) => {
    toast.current.show({
      severity: "success",
      summary: "Discount Applied",
      detail: `Discount of $${payload.calculatedDiscount} applied!`,
      life: 2000,
    });
    setDiscountModal(false);
  };

  const watchOtp = watch("otp");
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

  const [cardType, setCardType] = useState("");
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

  return (
    <>
      <Toast ref={toast} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {/* Payment Form */}
          <Col xl="6" lg="12" md="12" className="mb-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  <ArrowLeft
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(-1)}
                  />{" "}
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  {/* Payment Mode */}
                  <Col md="12" className="mb-2">
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

                  {/* Discount */}
                  <Col md="12" className="mb-2">
                    <Controller
                      name="isDiscountApply"
                      control={control}
                      render={({ field }) => (
                        <div className="form-check">
                          <Input
                            type="checkbox"
                            disabled={verifyDiscount}
                            id="isDiscountApply"
                            checked={field.value || false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);

                              // Open modal if checked, close if unchecked
                              setDiscountModal(checked);
                            }}
                            className="form-check-input"
                          />
                          <Label
                            for="isDiscountApply"
                            className="form-check-label"
                          >
                            Apply Discount
                          </Label>
                        </div>
                      )}
                    />
                  </Col>
                  <Col md="12" className="mb-2">
                    <Label>Calculated Discount</Label>
                    <Controller
                      name="caldis"
                      control={control}
                      defaultValue={caldis || 0}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          value={Number(field.value).toFixed(2)}
                          disabled
                        />
                      )}
                    />
                  </Col>
                  {/* Final Amount */}
                  <Col md="12" className="mb-2">
                    <Label>Amount to Pay</Label>
                    <Controller
                      name="finalAmount"
                      control={control}
                      render={({ field }) => (
                        <Input type="number" disabled {...field} />
                      )}
                    />
                  </Col>

                  {/* Cash PIN */}
                  {paymentMode === "Cash" && (
                    <Col md="8" className="mb-1">
                      <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                        <Row className="mt-1">
                          <Label className="form-label">
                            Enter 4 digit Pin{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Col md="12" className="mb-1">
                            <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                              {watchOtp.map((digit, index) => (
                                <Input
                                  key={index}
                                  id={`otp-cash-${index}`}
                                  maxLength="1"
                                  className="auth-input height-50 text-center numeral-mask mx-25 mb-1"
                                  value={digit}
                                  onChange={(e) =>
                                    handleOtpChange(e.target.value, index)
                                  }
                                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                  autoFocus={index === 0}
                                />
                              ))}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  )}

                  {/* Credit Card */}
                  {paymentMode === "Credit Card" && (
                    <>
                      <Row>
                        <div className="content-header">
                          <h5 className="mb-0 my-2">Credit Card Details</h5>
                          <small>Fill Credit Card Details</small>
                        </div>
                      </Row>

                      <Row>
                        {/* Card Number */}
                        <Col md="6" className="mb-2">
                          <Label>
                            Card Number <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Controller
                            name="cardNumber"
                            control={control}
                            rules={{
                              required: "Card Number is required",
                              maxLength: cardType === "Amex" ? 15 : 16,
                            }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Enter Card Number"
                                invalid={!!errors.cardNumber}
                                {...field}
                                onChange={(e) =>
                                  handleOnchangeCardNum(e, field)
                                }
                              />
                            )}
                          />
                          {errors.cardNumber && (
                            <FormFeedback>
                              {errors.cardNumber?.message}
                            </FormFeedback>
                          )}
                        </Col>

                        <Col md="6" className="mb-2">
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
                            <FormFeedback>
                              {errors.cardType?.message}
                            </FormFeedback>
                          )}
                        </Col>

                        <Col md="6" className="mb-2">
                          <Label>
                            Card Expiry Year{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Controller
                            name="cardExpiryYear"
                            control={control}
                            rules={{
                              required: "Expiry Year is required",
                              min: currentYear,
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
                                  (opt) => opt.value === field.value
                                )}
                                onChange={(selectedOption) => {
                                  field.onChange(selectedOption?.value || "");
                                  handleYearChange(selectedOption);
                                }}
                              />
                            )}
                          />
                          {errors.cardExpiryYear && (
                            <FormFeedback>
                              {errors.cardExpiryYear?.message}
                            </FormFeedback>
                          )}
                        </Col>

                        <Col md="6" className="mb-2">
                          <Label>
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
                            <FormFeedback>
                              {errors.cardExpiryMonth?.message}
                            </FormFeedback>
                          )}
                        </Col>
                        <Col>
                          <Label>
                            Card CVV <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Controller
                            name="cardCvv"
                            control={control}
                            rules={{
                              required: "CVV is required",
                              maxLength: getCvvLength(cardType),
                            }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                maxLength={getCvvLength(cardType)}
                                placeholder="Enter CVV Number"
                                invalid={!!errors.cardCvv}
                                {...field}
                                onChange={(e) => {
                                  const numericValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  if (
                                    numericValue.length <=
                                    getCvvLength(cardType)
                                  ) {
                                    field.onChange(numericValue);
                                  }
                                }}
                              />
                            )}
                          />
                          {errors.cardCvv && (
                            <FormFeedback>
                              {errors.cardCvv?.message}
                            </FormFeedback>
                          )}
                        </Col>

                        <Col md="6" className="mb-2">
                          <Label>
                            Card Holder's Name{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Controller
                            name="nameOnCard"
                            control={control}
                            rules={{
                              required: "Card Holder's Name is required",
                            }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Enter Card Holder's Name"
                                invalid={!!errors.nameOnCard}
                                {...field}
                                onChange={(e) => {
                                  const onlyAlphabets = e.target.value.replace(
                                    /[^a-zA-Z ]/g,
                                    ""
                                  );
                                  field.onChange(onlyAlphabets);
                                }}
                              />
                            )}
                          />
                          {errors.nameOnCard && (
                            <FormFeedback>
                              {errors.nameOnCard?.message}
                            </FormFeedback>
                          )}
                        </Col>
                      </Row>
                    </>
                  )}
                </Row>

                <div className="d-flex justify-content-between mt-3 flex-wrap gap-2">
                  <Button type="reset" onClick={() => reset()}>
                    Reset
                  </Button>
                  <Button type="submit" color="primary" disabled={loading}>
                    {loading ? (
                      <>
                        {" "}
                        loading... <Spinner size="sm" />
                      </>
                    ) : (
                      "Submit"
                    )}{" "}
                    {/* <ArrowRight size={14} /> */}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="12" lg="12" md="12">
            <CartSummery data={selectedProduct} />
          </Col>
          {/* Cart Summary */}
        </Row>
      </Form>

      <DiscountModal
        showModal={discountModal}
        toggleModal={() => setDiscountModal(false)}
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        watchDiscountApply={watchDiscountApply}
        discountOptions={discountOptions}
        discountAmount={discountAmount}
        loading={loading}
        onSubmit={handleDiscountSuccess}
        finalAmount={totalToPay}
        setValue={setValue}
        cart={selectedProduct}
        customerUid={customerUid}
        uids={[]}
        setVerifyDiscount={setVerifyDiscount}
        onValuesChange={handleValuesChange}
        setPosUid={setPosUid}
      />
    </>
  );
}
