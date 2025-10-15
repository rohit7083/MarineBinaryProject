import useJwt from "@src/auth/jwt/useJwt";
import CryptoJS from "crypto-js";
import Lottie from "lottie-react";
import moment from "moment";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardText,
    CardTitle,
    Col,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Spinner,
    UncontrolledAlert,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SingleCheck from "../../../assets/images/SingleCheck.json";
import GenerateDiscountOtp from "./GenerateDiscountOtp";
import Qr_Payment from "./Qr_Payment";
function Payment({ stepper, allEventData, updateData, paymentData }) {
  const { remainingAmount, totalAmount } = paymentData?.Rowdata || {};

  const CompanyOptions = [
    { value: "WesternUnion", label: "WesternUnion" },
    { value: "MoneyGrams", label: "MoneyGrams" },
    { value: "Other", label: "Other" },
  ];
  const [mode, setMode] = useState(""); // "flat" or "percentage"
  const [value, setValuedis] = useState("");
  const [loading, setLoading] = useState(false);
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

  const AmtDiffernce =
    updateData?.data?.totalAmount - updateData?.listData?.Rowdata?.totalAmount;
  console.log("AmtDiffernce", AmtDiffernce);

  let finalAmtRemain;

  const remainingAmt = updateData?.listData?.Rowdata?.remainingAmount || 0;
  const uid = updateData?.listData?.uid;
  // {{ }}
  if (remainingAmt >= 0 && uid) {
    finalAmtRemain = Number(remainingAmt) + Number(AmtDiffernce);
  } else {
    finalAmtRemain = allEventData?.totalAmount || 0;
  }

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
      finalAmount: finalAmtRemain,
    },
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
  const currentMonth = new Date().getMonth() + 1;

  const years = Array.from({ length: 10 }, (_, i) => {
    return {
      value: currentYear + i,
      label: currentYear + i,
    };
  });

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
    if (
      updateData?.listData?.Rowdata?.remainingAmount >= 0 &&
      updateData?.listData?.uid &&
      paymentData?.step !== 2
    ) {
      setValue("finalAmount", AmtDiffernce);
      console.log(finalAmtRemain);
    } else if (paymentData?.step === 2) {
      setValue("finalAmount", paymentData?.Rowdata?.remainingAmount);
    } else {
      if (allEventData?.totalAmount) {
        setValue("finalAmount", allEventData?.totalAmount);
      }
    }
  }, [allEventData, updateData, setValue, AmtDiffernce]);
  const MySwal = withReactContent(Swal);

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
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const handlepaymentMode = (selectedOption) => {
    const selectedType = selectedOption?.label; // Extract the value

    if (selectedType) {
      setpaymentMode(selectedType);
    }
  };
  const [showModal, setShowModal] = useState(false);

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
  const formatDate = (date, fmt) => (date ? moment(date).format(fmt) : null);
 const PayMode=(watch("paymentMode"));

  const onSubmit = async (data) => {
    setErrorMsz("");
    const otpArray = data.otp || [];
    const pin = otpArray?.join("");
    const encrypted = encryptAES(pin);

    let formData = new FormData();

    if (!updateData?.listData?.uid || paymentData?.step === 2) {
      if (allEventData?.eventUid || paymentData?.uid) {
        formData.append("event.uid", allEventData.eventUid || paymentData?.uid);
      }

      if (data?.advancePayment !== undefined) {
        formData.append("event.isAdvancesPaymnet", data.advancePayment);
      }

      if (data?.advancePayment && data?.remainingPayment !== undefined) {
        formData.append("event.remainingAmount", data.remainingPayment);
      }

      if (data?.advance !== undefined) {
        formData.append("event.advancePaymentAmout", data.advance);
      }

      if (data?.discount !== undefined) {
        formData.append("event.isDiscountApply", data.discount);

        if (data.discount) {
          if (disAmt !== undefined) {
            formData.append("event.discountAmount", disAmt);
          }

          if (mode) {
            formData.append("event.discountType", mode);
            formData.append(
              "event.discountedFinalAmount",
              mode === "Percentage" ? discountPercentage : discountAmt
            );
          }
        }
      }
    }

    if (updateData?.listData?.uid && paymentData?.step !== 2) {
      formData.append("event.uid", updateData?.listData?.uid);
      formData.append("event.eventName", updateData?.data?.eventName);
      formData.append(
        "event.eventDescription",
        updateData?.data?.eventDescription
      );
      formData.append(
        "event.eventStartDate",
        formatDate(updateData?.data?.startDateTime, "YYYY-MM-DD")
      );
      formData.append(
        "event.eventEndDate",
        formatDate(updateData?.data?.startDateTime, "YYYY-MM-DD")
      );
      formData.append(
        "event.eventStartTime",
        formatDate(updateData?.data.startDateTime, "HH:mm")
      );
      formData.append(
        "event.eventEndTime",
        formatDate(updateData?.data.endDateTime, "HH:mm")
      );
      formData.append("event.amount", updateData?.data?.amount);
      formData.append("event.isExtraStaff", updateData?.data?.isExtraStaff);
      formData.append("event.extraNoOfStaff", updateData?.data?.extraNoOfStaff);
      formData.append(
        "event.extraNoOfStaffAmount",
        updateData?.data?.extraNoOfStaffAmount
      );
      formData.append("event.totalAmount", updateData?.data?.totalAmount);
      formData.append(
        "event.isRecurringEvent",
        updateData?.data?.isRecurringEvent
      );
      formData.append("event.venue.uid", updateData?.data?.venue?.value);
      formData.append(
        "event.eventType.uid",
        updateData?.data?.eventType?.value
      );
      formData.append(
        "event.member.uid",
        updateData?.data?.selectedMember?.value
      );
      formData.append("payment.finalPayment", AmtDiffernce);
    }

    if (data?.PfinalAmount !== undefined) {
      formData.append("payment.finalPayment", data.PfinalAmount);
    }

    if (data?.paymentMode?.value) {
      formData.append("payment.paymentMode", data.paymentMode.value);

      switch (data.paymentMode.label) {
        case "Credit Card":
          if (data.cardNumber)
            formData.append("payment.cardNumber", data.cardNumber);
          if (data.cardType) formData.append("payment.cardType", data.cardType);
          if (data.cardExpiryYear)
            formData.append("payment.cardExpiryYear", data.cardExpiryYear);
          if (data.cardExpiryMonth)
            formData.append("payment.cardExpiryMonth", data.cardExpiryMonth);
          if (data.cardCvv) formData.append("payment.cardCvv", data.cardCvv);
          if (data.nameOnCard)
            formData.append("payment.nameOnCard", data.nameOnCard);
          break;

        case "Card Swipe":
          if (data.cardSwipeTransactionId) {
            formData.append(
              "payment.cardSwipeTransactionId",
              data.cardSwipeTransactionId
            );
          }
          break;

        case "Cash":
          if (data?.otp) {
            // const pin = Number(data.otp.join(""));
            // const encryptedPin = encryptAES(pin); // encrypt here
            formData.append("event.pin", encrypted);
          }
          break;

        case "Cheque21":
          if (!file) {
            alert("Please select a file first.");
            return;
          }
          if (data.bankName) formData.append("payment.bankName", data.bankName);
          if (data.nameOnAccount)
            formData.append("payment.nameOnAccount", data.nameOnAccount);
          if (data.routingNumber)
            formData.append("payment.routingNumber", data.routingNumber);
          if (data.accountNumber)
            formData.append("payment.accountNumber", data.accountNumber);
          if (data.chequeNumber)
            formData.append("payment.chequeNumber", data.chequeNumber);
          formData.append("payment.chequeImage", file);
          break;

        case "ChequeACH":
          if (data.bankName) formData.append("payment.bankName", data.bankName);
          if (data.nameOnAccount)
            formData.append("payment.nameOnAccount", data.nameOnAccount);
          if (data.routingNumber)
            formData.append("payment.routingNumber", data.routingNumber);
          if (data.accountNumber)
            formData.append("payment.accountNumber", data.accountNumber);
          if (data.accountType?.value)
            formData.append("payment.accountType", data.accountType.value);
          break;

        default:
          console.log("Choose a valid payment method");
      }
    }

    if (AmtDiffernce > 0 && updateData?.listData?.uid) {
      try {
        setLoading(true);
        const updateRes = await useJwt.UpdateEventAndPayment(formData);
        if (updateRes) {
          setModal(true);
          setTimeout(() => {
            setModal(false);
            stepper.next();
          }, 4000);
        }
        console.log(updateData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (!updateData?.listData?.uid || updateData?.listData?.step === 2) {
      try {
        setLoading(true);
        const res = await useJwt.payment(formData);
        const { qr_code_base64 } = res?.data;
        setQr(qr_code_base64);
        if (qr_code_base64) {
          setShowQrModal(true);
        }
        if (res?.data?.status === "success") {
          {{  }}
          if (PayMode?.value == 7) {
             MySwal.fire({
                  title: "Payment Link Sent Successfully",
                  text: "Payment link has been sent to your email address.",
                  icon: "success",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                  buttonsStyling: false,
                })
          } else {
            setModal(true);
            setTimeout(() => {
              setModal(false);
              stepper.next();
            }, 4000);
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

        if (error.res) {
          console.error("Error verifying OTP:", error);

          const errorMessage = error?.res?.data?.content;
          setErrorMsz(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOk = () => {
    toggle();
    stepper.next();
  };
  const toast = useRef(null);

  return (
    <>
      <Modal isOpen={modal} toggle={toggle} centered size="sm">
        <ModalHeader
          toggle={toggle}
          style={{
            borderBottom: "none",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "1.25rem",
          }}
        >
          🎉 Payment Successful
        </ModalHeader>

        <ModalBody style={{ textAlign: "center", paddingTop: 0 }}>
          <div
            style={{
              position: "relative",
              width: 150,
              height: 150,
              margin: "0 auto",
            }}
          >
            <Lottie
              animationData={SingleCheck} // you can swap this with a 'success' or 'confetti' animation JSON
              loop={true}
              style={{
                position: "absolute",

                width: 150,
                height: 150,
              }}
            />
          </div>

          <CardTitle tag="h5" style={{ marginTop: "10px", fontWeight: "800" }}>
            Your payment has been successfully processed.
          </CardTitle>
          <CardText
            style={{ color: "#555", fontSize: "0.81rem", marginTop: "5px" }}
          >
            {/* A receipt has been sent to your email. Thank you for your purchase! */}
          </CardText>
        </ModalBody>

        <ModalFooter style={{ borderTop: "none", justifyContent: "center" }}>
          <Button
            color="success"
            onClick={handleOk}
            style={{ borderRadius: "8px", padding: "8px 20px" }}
          >
            OK
          </Button>
        </ModalFooter>
      </Modal>
      <Toast ref={toast} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className="mb-2">Payment Information</h4>
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
            <Col md="12" className="mb-1">
              <Label for="finalInvoice">
                {remainingAmount > 0
                  ? "Final Amount (Remaining)"
                  : "Final Amount"}
              </Label>
              <Controller
                name="finalAmount"
                control={control}
                rules={{
                  required: "Final  amount is required",
                  ...(!updateData?.listData?.uid && {
                    min: 0,
                  }),
                }}
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
            {!updateData?.listData?.uid && (
              <>
                <Col check className="mb-2">
                  <Label check>
                    <Controller
                      name="discount"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} type="checkbox" disabled={verify} />
                      )}
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
                      allEventData={allEventData}
                      setVerify={setVerify}
                      verify={verify}
                    />
                  </>
                )}
              </>
            )}
            <Row>
              {!updateData?.listData?.uid || paymentData?.step == 2 ? (
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
                            ...(AmtDiffernce > 0
                              ? {
                                  min: {
                                    value: AmtDiffernce,
                                    message: (
                                      <>
                                        Advance payment must be at least{" "}
                                        <span style={{ fontWeight: "bold" }}>
                                          ${AmtDiffernce}
                                        </span>
                                      </>
                                    ),
                                  },
                                }
                              : {
                                  min: {
                                    value: 0,
                                    message:
                                      "Advance payment cannot be less than 0",
                                  },
                                }),
                          }}
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
                        {errors.advance && (
                          <FormFeedback>{errors.advance.message}</FormFeedback>
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
                          <FormFeedback>
                            {errors.advancePayment.message}
                          </FormFeedback>
                        )}
                      </Col>
                    </>
                  )}

                  <Col md="12" className="mb-1">
                    <Label for="finalInvoice">Currently Amount Payable</Label>
                    <Controller
                      name="PfinalAmount"
                      control={control}
                      rules={{
                        required: "Final amount is required",
                        min: {
                          value: 0,
                          message: "Amount cannot be negative",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="number"
                          id="PfinalAmount"
                          disabled={true}
                          placeholder="Your Currently Amount Payable Here"
                          invalid={!!errors.PfinalAmount}
                          {...field}
                        />
                      )}
                    />
                    {errors.finaPfinalAmountlAmount && (
                      <FormFeedback>{errors.PfinalAmount.message}</FormFeedback>
                    )}
                  </Col>
                </>
              ) : null}

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
                <Row>
                  <Label className="form-label" for="companyName">
                    Enter 4 digit Pin <span style={{ color: "red" }}>*</span>
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
                            const onlyAlphabetsAndSpace =
                              e.target.value.replace(
                                /[^a-zA-Z\s]/g, // allows A-Z, a-z, and spaces
                                ""
                              );
                            field.onChange(onlyAlphabetsAndSpace);
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
                            const onlyAlphabetsAndSpace =
                              e.target.value.replace(
                                /[^a-zA-Z\s]/g, // allows A-Z, a-z, and spaces
                                ""
                              );
                            field.onChange(onlyAlphabetsAndSpace);
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
                          onChange={(e) => {
                            const onlyAlphabetsAndSpace =
                              e.target.value.replace(
                                /[^a-zA-Z\s]/g, // allows A-Z, a-z, and spaces
                                ""
                              );
                            field.onChange(onlyAlphabetsAndSpace);
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
                          onChange={(e) => {
                            // Allow only numbers
                            let value = e.target.value.replace(/[^0-9]/g, "");

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
                          message: "Account Number must be at least 10 digits",
                        },
                        maxLength: {
                          value: 16,
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
                          onChange={(e) => {
                            // allow only digits
                            let value = e.target.value.replace(/[^0-9]/g, "");

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
                          message: "Cheque Number must be at least 6 digits",
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
                            let value = e.target.value.replace(/[^0-9]/g, "");

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
                      <FormFeedback>{errors.chequeNumber.message}</FormFeedback>
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
                        required: "Routing Number is required",
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
                            let value = e.target.value.replace(/[^0-9]/g, "");

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
                          message: "Account Number must be at least 8 digits",
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
                          onChange={(e) => {
                            // allow only digits
                            let value = e.target.value.replace(/[^0-9]/g, "");

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
                            // Allow only letters and numbers
                            const alphanumericValue = e.target.value.replace(
                              /[^a-zA-Z0-9]/g,
                              ""
                            );
                            field.onChange(alphanumericValue);
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
                    </li>

                    {!AmtDiffernce > 0 && (
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
                            <strong>$ {handleRemaining || "0"} </strong>
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
          <Qr_Payment
            setShowQrModal={setShowQrModal}
            showQrModal={showQrModal}
            qr={qr}
          />
        )}
      </Form>
    </>
  );
}

export default Payment;
