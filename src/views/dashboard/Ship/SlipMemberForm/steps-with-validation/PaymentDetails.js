import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { selectThemeColors } from "@utils";
import CryptoJS from "crypto-js";
import { format } from "date-fns";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import Flatpickr from "react-flatpickr";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
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
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SuccessPayment from "../../../../dashboard/SuccessPayment";
import ContractType from "../ContractType";
import QrCodePayment from "./QrCodePayment";
const Address = ({
  stepper,
  formData,
  slipIID,
  memberID,
  mId,
  sId,
  formStatus,
  fetchLoader,
  slipId,
  isAssigned,
  isAssignedStatus,
  member,
  slipDetails,
}) => {
  const colourOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Annual", label: "Full Payment (Annual)" },
  ];
  const toast = useRef(null);

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

  const [contractResponse, setContractResponse] = useState(null);
  const [submitedOTP, setIsSubmitedOTP] = useState(false);
  const [storeToken, setStoreToken] = useState(null);
  const [finalOtp, setFinalOtp] = useState(false);

  const [isVerify, setIsverify] = useState(false);
  const [discountOtpLoader, setDiscountOtpLoader] = useState(false);
  const [contractTypeName, setContractTypeName] = useState(null);
  const [contractTypeStatus, setContractTypeStatus] = useState(false);
  const [isPercentage, setIsPercentage] = useState(true);
  const [value, setValuee] = useState("");
  const [qr, setQr] = useState(null);
  const MySwal = withReactContent(Swal);
  const [isAssign, setIsassign] = useState(false);
  const [couponLoader, setCoupanLoader] = useState();
  const [totalPayment, setFinalPayment] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [checkMember, setMember] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [discounttoggle, setDiscountToggle] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [paymentMode, setpaymentMode] = useState(null);
  const [marketPrices, setMarketPrices] = useState(null);
  const [rentalPriceState, setRentalPrice] = useState("");
  const [show, setShow] = useState(false);
  const [slipDetail, setSlipDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [errMsz, setErrMsz] = useState("");
  const [isCouponCodeVerify, setIsCouponCodeVerify] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [transactionId, setTransactionID] = useState(null);
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
        (month) => month.value >= currentMonth,
      );
      setAvailableMonths(filteredMonths);
    } else {
      // If it's a future year, show all months
      setAvailableMonths(months);
    }
  };

  // useEffect(() => {
  //   if (contractResponse) {
  //     reset({
  //       contractDate: contractResponse?.payload?.startDate,
  //       renewalDate: contractResponse?.payload?.endDate,
  //     });
  //   }
  // }, [contractResponse]);

  const watchDiscountAmount = watch("discountAmount");

  useEffect(() => {
    const assignDone = isAssigned?.isAssigned;

    setIsassign(assignDone);
  }, [isAssigned]);

  useEffect(() => {
    setAvailableMonths(months);
  }, []);

  const { slipuid } = useParams();

  useEffect(() => {
    ({ errors });
  }, [errors]);

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

  const fetchMarketPrices = async () => {
    try {
      const response = await useJwt.getslip();
      response;

      const result = response.data.content.result.find(
        (item) => item.id === (slipIID ?? sId),
      );
      sId;

      if (!result) {
        ("Not Found Slip Charges");
        return;
      }

      const { marketAnnualPrice, id, marketMonthlyPrice } = result;

      if (
        marketAnnualPrice === undefined ||
        marketMonthlyPrice === undefined ||
        id === undefined
      ) {
        ("Invalid slip charge data");
        return;
      }

      setSlipDetail({
        Monthly: marketMonthlyPrice,
        Annual: marketAnnualPrice,
        id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getReadOnlyStyle = () => {
    return {
      color: "#000",
      backgroundColor: "#fff",
      opacity: 1,
    };
  };

  useEffect(() => {
    if (slipIID || sId) fetchMarketPrices();
  }, [slipIID, sId]);

  const handleDiscount = (event) => {
    const isToggled = event.target.checked;

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

  const depositAmount = Number(watch("deposite"));
  const WatchcalDisAmount = Number(watch("calDisAmount"));

  // useEffect(() => {
  //   const rentalPrice = getValues("rentalPrice");
  //   const uid = watch("uid");

  //   setRentalPrice(rentalPrice);

  //   if (formData[0]?.otpVerify) {
  //     setDiscountToggle(true);
  //   }

  //   if (!uid && rentalPrice) {
  //     setFinalPayment(rentalPrice);
  //     setValue(
  //       "finalPayment",
  //       rentalPrice + depositAmount - (WatchcalDisAmount || 0),
  //     );
  //   }
  // }, [watch("rentalPrice"), depositAmount, WatchcalDisAmount]);

  //Discount Calculations

  const handlePercentageChange = (e) => {
    const percentage = parseFloat(e.target.value);
    if (!isNaN(percentage)) {
      const discountValue = (percentage / 100) * rentalPriceState;
      setValue("calDisAmount", discountValue);
      setValue(
        "finalPayment",
        rentalPriceState - discountValue + depositAmount,
      );
    } else {
      setValue("finalPayment", rentalPriceState + depositAmount);
    }
  };

  const handleFlatChange = (e) => {
    const amount = Number(e.target.value);
    setValue("calDisAmount", amount);
    const finalPaymentcal = rentalPriceState - amount;
    setValue("finalPayment", finalPaymentcal + depositAmount);
    setFinalPayment(finalPaymentcal);
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value.replace(/\D/g, "");
    field.onChange(value); // Sync with React Hook Form

    if (isPercentage) {
      handlePercentageChange(e);
    } else {
      handleFlatChange(e);
    }
  };

  const validateCardSwipeTransactionId = (value) => {
    if (!value) {
      return "Card Swipe Transaction ID is required";
    }

    if (value.length < 6) {
      return "Transaction ID must be at least 6 characters";
    }

    // ✅ Allow only letters and numbers (A–Z, a–z, 0–9)
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return "Transaction ID must contain only letters and numbers";
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

  // const handleButtonClick = () => {
  //   const newIsPercentage = !isPercentage;
  //   setIsPercentage(newIsPercentage);

  //   const discountType = newIsPercentage ? "Percentage" : "Flat";
  //   const handleTypeDiscount = {
  //     discountType: discountType,
  //   };

  //   setdiscountTypedStatus(handleTypeDiscount?.discountType);
  // };

  useEffect(() => {
    if (member || memberID) {
      setMember(false); // member is now filled
    } else {
      setMember(true); // still missing
    }
  }, [mId, memberID]);

  useEffect(() => {
    if (isAssigned) {
      if (Object.keys(formData)?.length) {
        const data = { ...formData }["0"];
        let pmVal =
          colourOptions3?.find((x) => x.value == data.paymentMode) || null;
        let paidInVal =
          colourOptions?.find((x) => x.value == data.paidIn) || null;
        let accoTypeValue =
          AccountType?.find((x) => x.value == data.accountType) || null;

        let discountType = discountOptions?.find(
          (x) => x.value == data?.discountType || null,
        );
        // Update state if needed
        setpaymentMode(pmVal?.label || "");
        const isDiscount = Boolean(
          data?.otpVerify || isAssigned?.isOneMonthFree,
        );

        const updatedData = {
          // ...data,
          contractType: data?.contractDate,
          paymentMode: pmVal,
          paidIn: paidInVal,
          accountType: accoTypeValue,
          // finalPayment:isAssigned?.finalPayment,
          finalPayment: isAssigned?.finalPayment,
          rentalPrice: isAssigned?.rentalPrice || data?.rentalPrice,
          discountAmount: isAssigned?.discountAmount,
          calDisAmount: isAssigned?.calDisAmount,
          distype: isDiscount,
          couponCode: isAssigned?.couponCode,
          deposite: isAssigned?.deposite || data?.deposite,
          discountType: discountType,
        };

        reset(updatedData);
      }
    }
  }, [setValue, reset, isAssigned, formData]);

  const companyName = watch("companyName");
  const accType = watch("accountType");
  const acctypeValue = accType?.value;

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
  const watchpaidIn = watch("paidIn");

  const onSubmit = async (data) => {
    const pinArray = data.pin || [];
    // const isValid =
    //   pinArray.length === 4 &&
    //   pinArray.every((d) => d !== "" && d !== undefined);
    // if (!isValid) {
    //   console.error("Invalid pin input");
    //   return;
    // }

    if (
      discounttoggle &&
      watchdiscountType?.value != "FreeDuration" &&
      (storeToken == null || finalOtp === false)
    ) {
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail:
          "Please complete OTP verification before applying the discount.",
        life: 2000,
      });

      return;
    }
    const selectedUserStr = localStorage.getItem("selectedBranch");
    const selectedBranch = JSON.parse(selectedUserStr);
    let branchUid = selectedBranch.uid;
    const encrypted = encryptAES(pinArray.join(""));

    setErrMsz("");
    data.paymentMode = data.paymentMode?.value;
    const formData = new FormData();

    formData.append("contractType", contractResponse?.payload?.contractType);

    if (contractTypeName == "long") {
      const yearCount = contractResponse?.data?.annualCount || 0;
      const monthCount = contractResponse?.data?.monthCount || 0;
      const TotalMonths = yearCount * 12 + monthCount;

      formData.append("noOfMonths", TotalMonths);
    }
    formData.append("SlipId", slipIID || sId);
    formData.append("contractDate", contractResponse?.payload?.startDate);
    formData.append("paidIn", data.paidIn?.value || "Annual");
    formData.append("rentalPrice", data.rentalPrice);
    formData.append("finalPayment", data.finalPayment);
    formData.append("deposite", data.deposite);
    formData.append("branch.uid", branchUid);
    formData.append("renewalDate", contractResponse?.payload?.endDate);
    if (
      discounttoggle &&
      watchdiscountType?.value !== "FreeDuration" &&
      finalOtp
    ) {
      formData.append("otpVerify", true);
    } else {
      formData.append("otpVerify", false);
    }
    if (contractTypeName == "long") {
      formData.append("nextPaymentDate", data.nextPaymentDate);
    }
    formData.append("paymentMode", data.paymentMode);

    // formData.append("OtpVerify", otpVerify);

    formData.append("memberId", memberID || mId);

    if (discounttoggle && watchdiscountType?.value !== "FreeDuration") {
      formData.append("discountAmount", Number(data.discountAmount));
      formData.append("calDisAmount", data.calDisAmount || data.discountAmount);
      formData.append("discountType", watchdiscountType?.value);
      formData.append("isOneMonthFree", false);
    }
    if (discounttoggle && watchdiscountType?.value === "FreeDuration") {
      formData.append("isOneMonthFree", true);
      formData.append("couponCode", data.couponCode);
      formData.append("discountType", "FreeDuration");
    }
    if (contractTypeName == "short") {
      formData.append("noOfDays", contractResponse?.totalDays);
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
    } else if (paymentMode === "Cash") {
      formData.append("pin", encrypted);
    } else if (paymentMode === "ChequeACH") {
      formData.append("bankName", data.bankName);
      formData.append("nameOnAccount", data.nameOnAccount);
      formData.append("routingNumber", data.routingNumber);
      formData.append("accountNumber", data.accountNumber);
      formData.append("accountType", data.accountType?.value);
    } else if (paymentMode === "Money Order") {
      formData.append("companyName", data.companyName?.value);

      if (companyName?.label !== "Other") {
        formData.append("mtcn", data.mtcn);
      }
      if (companyName?.label == "Other") {
        formData.append("otherCompanyName", data.otherCompanyName);

        formData.append("otherTransactionId", data.otherTransactionId);
      }
    } else {
      ("Choose differant payment Method ");
    }
    isAssignedStatus;

    if (isAssigned?.isAssigned) {
      stepper.next();
    } else {
      if (
        (typeof mId !== "undefined" && mId !== null) ||
        (typeof memberID !== "undefined" && memberID !== null)
      ) {
        try {
          setLoading(true);
          const response = await useJwt.createPayment(formData);
          response;
          setTransactionID(response?.data?.transaction_id);
          const { qr_code_base64 } = response?.data;
          setQr(qr_code_base64);
          if (qr_code_base64) {
            setShowQrModal(true);
          }

          if (response?.status === 200) {
            if (
              paymentMode !== "Payment Link" &&
              paymentMode !== "QR Code" &&
              paymentMode !== "Credit Card"
            ) {
              // toast.current.show({
              //   severity: "success",
              //   summary: "Successfully",
              //   detail: "Payment completed successfully.",
              //   life: 2000,
              // });

              setModal(true);
              setTimeout(() => {
                stepper.next();
              }, 2000);
            } else {
              if (paymentMode === "Credit Card") {
                if (response?.data?.status === "success") {
                  // toast.current.show({
                  //   severity: "success",
                  //   summary: " Successfully",
                  //   detail: "Payment completed successfully.",
                  //   life: 2000,
                  // });
                  setModal(true);
                  setTimeout(() => {
                    stepper.next();
                  }, 2000);
                } else {
                  toast.current.show({
                    severity: "error",
                    summary: "Failed",
                    detail: "Payment Failed. Please try again.",
                    life: 2000,
                  });
                }
              }

              if (paymentMode === "Payment Link") {
                // Show SweetAlert instead of auto-stepping
                MySwal.fire({
                  title: "Payment Link Sent Successfully",
                  text: "Payment link has been sent to your email address.",
                  icon: "success",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                  buttonsStyling: false,
                }).then(() => {
                  stepper.next(); // Go to next step after user closes the alert
                });
              }

              if (paymentMode === "QR Code") {
                toast.current.show({
                  severity: "info",
                  summary: "Payment Required",
                  detail: "Please make a payment using this QR code.",
                  life: 4000,
                });
              }
            }
          }
        } catch (error) {
          console.error("Error submitting data:", error);
          toast.current.show({
            severity: "error",
            summary: "Failed",
            detail: `${error.response.data.content || "Something went wrong!"}`,
            life: 2000,
          });
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
      }
    }
  };

  const totalFinalPayment = watch("finalPayment");

  useEffect(() => {}, [contractTypeStatus]);

  const watchBillingCycle = watch("paidIn");

  useEffect(() => {
    if (isAssigned && isAssignedStatus === true) return;
    const yearCount = contractResponse?.data?.annualCount || 0;
    const monthCount = contractResponse?.data?.monthCount || 0;
    const monthlyAmount = contractResponse?.data?.monthlyAmount || 0;
    const yearlyAmount = contractResponse?.data?.annualAmount || 0;
    const shortTermAmount = contractResponse?.data?.totalAmount || 0;
    const TotalMonths = yearCount * 12 + monthCount;

    if (contractResponse?.payload?.contractType == "longTerm") {
      if (watchBillingCycle?.value == "Monthly") {
        // monthly
        if (yearCount == 0 && monthCount >= 1) {
          const perMonthPrice = (monthlyAmount / monthCount).toFixed(2);
          setValue("rentalPrice", perMonthPrice || 0);
        } else if (yearCount >= 1 && monthCount === 0) {
          const yearIntoMonth = yearCount * 12;
          const permonthPrice = yearlyAmount / yearIntoMonth;
          setValue("rentalPrice", permonthPrice.toFixed(2) || 0);
        } else if (yearCount >= 1 && monthCount >= 1) {
          const yearIntoMonth = yearCount * 12;
          const permonthPrice = yearlyAmount / yearIntoMonth;
          const permonth = monthlyAmount / monthCount;
          setValue("rentalPrice", permonth.toFixed(2) || 0);
        }
      } else if (watchBillingCycle?.value == "Annual") {
        // yearly
        if (yearCount == 0 && monthCount >= 1) {
          setValue("rentalPrice", monthlyAmount);
        } else if (yearCount >= 1 && monthCount === 0) {
          setValue("rentalPrice", yearlyAmount.toFixed(2) || 0);
        } else if (yearCount >= 1 && monthCount >= 1) {
          const yearIntoMonth = yearCount * 12;

          const permonthPrice = yearlyAmount / yearIntoMonth;
          const finalAnnualprice = permonthPrice * monthCount + yearlyAmount;
          setValue("rentalPrice", finalAnnualprice.toFixed(2) || 0);
        }
      }
    } else {
      setValue("rentalPrice", shortTermAmount);
    }
  }, [contractResponse, watchBillingCycle, isAssignedStatus, isAssigned]);

  const watchdiscountType = watch("discountType");

  const discountOptions = [
    { value: "flat", label: "Flat" },
    { value: "percentage", label: "Percentage" },
    ...(contractTypeName === "long"
      ? [{ value: "FreeDuration", label: "Free Duration" }]
      : []),
  ];

  useEffect(() => {
    if (isAssigned && isAssignedStatus === true) return;

    if (watchdiscountType) {
      if (watchdiscountType?.value == "flat") {
        setIsPercentage("flat");
      } else {
        setIsPercentage("percentage");
      }
    }
  }, [watchdiscountType]);

  const watchrentalPrice = watch("rentalPrice");

  useEffect(() => {
    if (
      !discounttoggle ||
      (discounttoggle && watchdiscountType?.value == "FreeDuration")
    ) {
      const withoutDiscountPayment =
        Number(watchrentalPrice || 0) + Number(depositAmount || 0);

      setValue("finalPayment", withoutDiscountPayment.toFixed(2));
    } else {
      if (discounttoggle && watchdiscountType?.value == "flat") {
        const withFlatDiscountPayment =
          Number(watchrentalPrice || 0) -
          Number(watchDiscountAmount || 0) +
          Number(depositAmount || 0);
        setValue("finalPayment", withFlatDiscountPayment.toFixed(2));
      }
    }

    if (discounttoggle && watchdiscountType?.value == "percentage") {
      const discountValue =
        Number(watchrentalPrice * watchDiscountAmount) / 100;
      setValue("calDisAmount", discountValue.toFixed(2));
      const withPercentageDiscountPayment =
        Number(watchrentalPrice || 0) -
        Number(WatchcalDisAmount || 0) +
        Number(depositAmount || 0);
      setValue("finalPayment", withPercentageDiscountPayment.toFixed(2));
    }
  }, [
    discounttoggle,
    depositAmount,
    watchdiscountType,
    watchrentalPrice,
    watchDiscountAmount,
    WatchcalDisAmount,
    setValue,
    isAssigned,
    isAssignedStatus,
  ]);

  const watchCalDisAmount = watch("calDisAmount");
  const handleGenerateOtp = async () => {
    try {
      setDiscountOtpLoader(true);
      const payload = {
        type: 1,
        slipId: slipIID || sId,
        memberId: memberID || mId,
        slipAmount: watchrentalPrice,
        discountType:
          watchdiscountType?.value == "percentage" ? "Percentage" : "Flat",
        discountAmount: watchDiscountAmount,
        calculatedDiscount:
          watchdiscountType?.value == "percentage"
            ? watchCalDisAmount
            : watchDiscountAmount,
      };
      const res = await useJwt.discountOnContractslip(payload);
      if (res?.status == 200) {
        setValue("otpForDiscount", null);

        setIsverify(true);
        const token = res?.data?.content || "";
        setStoreToken(token);
        toast.current.show({
          severity: "success",
          summary: "Successfully",
          detail: "OTP send successfully.",
          life: 2000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: `${error.response.data.content || "Something went wrong!"}`,
        life: 2000,
      });
    } finally {
      setDiscountOtpLoader(false);
    }
  };

  useEffect(() => {
    if (watchdiscountType) {
      setIsverify(false);
    }
  }, [watchdiscountType]);

  const watchotpForDiscount = watch("otpForDiscount");
  const handleVerify = async () => {
    try {
      setIsSubmitedOTP(true);
      const encrypted = encryptAES(watchotpForDiscount);
      const payload = {
        otp: encrypted,
      };
      const res = await useJwt.verifyDiscountOtp(storeToken, payload);

      if (res?.status) {
        toast.current.show({
          severity: "success",
          summary: "Successfully",
          detail: "Your discount has been applied successfully.",
          life: 2000,
        });
        setFinalOtp(res?.status == 200);
      }
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: `${error.response.data.content || "Something went wrong!"}`,
        life: 2000,
      });
    } finally {
      setIsSubmitedOTP(false);
    }
  };

  const watchcouponCode = watch("couponCode");
  const handleFreeDurationVerify = async () => {
    try {
      setCoupanLoader(true);
      const userData = JSON.parse(localStorage.getItem("userData"));
      const loginUserUid = userData?.uid;

      const payload = {
        couponCode: watchcouponCode,
      };
      const res = await useJwt.applyCoupon(loginUserUid, payload);

      if (res?.status == 200) {
        setIsCouponCodeVerify(true);
        toast.current.show({
          severity: "success",
          summary: "Successfully",
          detail: "Free Duration Coupon applied successfully.",
          life: 2000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: `${error?.response?.data?.content}`,
        life: 2000,
      });
    } finally {
      setCoupanLoader(false);
    }
  };

  const today = new Date();
  let nextDate = new Date(today);

  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (finalOtp === true && watchdiscountType) {
      setFinalOtp(false);
    }
  }, [watchdiscountType]);

  useEffect(() => {
    if (watchpaidIn?.value == "Monthly") {
      const nextMonthDate = nextDate.setMonth(today.getMonth() + 1);
      const formattedDateMonth = new Date(nextMonthDate)
        .toISOString()
        .split("T")[0];

      setValue("nextPaymentDate", formattedDateMonth);
    } else {
      const nextYearDate = nextDate.setFullYear(today.getFullYear() + 1);
      const formattedDateYear = new Date(nextYearDate)
        .toISOString()
        .split("T")[0];

      setValue("nextPaymentDate", formattedDateYear);
    }
  }, [watchpaidIn, setValue]);

  // useEffect(()=>{
  // if (!discounttoggle) {

  // }
  // },[])

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

  const showForm = contractTypeStatus || (sId && isAssignedStatus);

  return (
    <Fragment>
      <Toast ref={toast} />

      <div className="content-header">
        <h5 className="mb-0">Payment</h5>
        <small>Enter Your Payment Details.</small>
      </div>

      {errMsz && (
        <React.Fragment>
          <UncontrolledAlert color="danger">
            <div className="alert-body">
              <span className="text-danger fw-bold">
                <strong>Error : </strong>
                {errMsz}
              </span>
            </div>
          </UncontrolledAlert>
        </React.Fragment>
      )}

      {checkMember && (
        <React.Fragment>
          <UncontrolledAlert color="danger">
            <div className="alert-body">
              <span className="text-danger fw-bold">
                <strong>Error : </strong>
                Please fill the Member form first to proceed.
              </span>
            </div>
          </UncontrolledAlert>
        </React.Fragment>
      )}

      <Row>
        <ContractType
          formData={formData}
          isAssigned={isAssigned}
          isAssignedStatus={isAssignedStatus}
          setContractResponse={setContractResponse}
          slipId={slipId}
          setContractTypeName={setContractTypeName}
          slipDetails={slipDetails}
          setContractTypeStatus={setContractTypeStatus}
        />
      </Row>

      {showForm && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <>
            <Row>
              {contractTypeName !== "short" && (
                <Col md="6" className="mb-1">
                  <Label className="form-label" for="paidIn">
                    Billing Cycle <span style={{ color: "red" }}>*</span>
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
                        isDisabled={isAssignedStatus}
                        classNamePrefix="select"
                        isClearable
                        options={colourOptions}
                        onChange={(option) => {
                          field.onChange(option); // Ensure field can accept object
                        }}
                        isInvalid={!!errors.paidIn}
                      />
                    )}
                  />
                  {errors.paidIn && (
                    <FormFeedback>{errors.paidIn.message}</FormFeedback>
                  )}
                </Col>
              )}
              {/* <Col md="4" className="mb-1">
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
                      // value={field.value}
                     
                    />
                  )}
                />
                {errors.contractDate && (
                  <FormFeedback>{errors.contractDate.message}</FormFeedback>
                )}
              </Col>
              <Col md="4" className="mb-1">
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
                      onChange={(selectedDates) =>
                        field.onChange(selectedDates[0])
                      } // onChange={() => {}} // Disable manual changes
                      // disabled={true}
                    />
                  )}
                />
                {errors.renewalDate && (
                  <FormFeedback>{errors.renewalDate.message}</FormFeedback>
                )}
              </Col> */}

              <Col md="6" className="mb-1">
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
                      disabled={isAssignedStatus}
                    />
                  )}
                />
              </Col>
            </Row>

            <Row className="mb-1 mt-2">
              <Col md="3">
                <Label className="form-label" for="hf-picker">
                  Do You Want Discount..?
                </Label>

                <div
                  className="my-1 form-check form-switch d-flex "
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
                    disabled={isAssignedStatus}
                    defa
                    checked={watch("distype")}
                    onChange={(e) => {
                      setValue("distype", e.target.checked);
                      handleDiscount(e);
                    }}
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
            </Row>

            <Row className={"mb-2"}>
              {(discounttoggle || watch("distype")) && (
                <>
                  <Col md="3" className="mb-1">
                    <Label className="form-label" for="paidIn">
                      Discount Type <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      control={control}
                      rules={{
                        required: "Discount is required",
                      }}
                      name="discountType"
                      render={({ field }) => (
                        <Select
                          {...field}
                          theme={selectThemeColors}
                          disabled={isAssignedStatus}
                          className={`react-select ${
                            errors.discountType ? "is-invalid" : ""
                          }`} // isDisabled={statusThree()}
                          classNamePrefix="select"
                          isClearable
                          options={discountOptions}
                          onChange={(option) => {
                            field.onChange(option || null);
                          }}
                        />
                      )}
                    />
                    {errors.discountType && (
                      <FormFeedback className="d-block">
                        {errors.discountType.value?.message ||
                          errors.discountType.message}
                      </FormFeedback>
                    )}
                  </Col>

                  {watchdiscountType?.value == "FreeDuration" && (
                    <>
                      <Col md="3" className="mb-1">
                        <Label className="form-label" for="mtcn">
                          Coupon Code
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          id="couponCode"
                          name="couponCode"
                          rules={{
                            required: "Coupon Code is required",
                            // pattern: {
                            //   value: /^[0-9]{10}$/,
                            //   message: "couponCode Number must be exactly 10 digits",
                            // },
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter coupon Code  "
                              invalid={!!errors.mtcn}
                              {...field}
                              // defaultValue="ABC"
                              disabled={isCouponCodeVerify || isAssignedStatus}
                              // readOnly={statusThree()}

                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^a-zA-Z0-9]/g,
                                  "",
                                );
                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        {errors.mtcn && (
                          <FormFeedback>{errors.mtcn.message}</FormFeedback>
                        )}
                      </Col>

                      <Col md="3" className="mt-2">
                        <Button
                          disabled={couponLoader || isCouponCodeVerify}
                          onClick={handleFreeDurationVerify}
                        >
                          {couponLoader ? (
                            <>
                              Loading.. <Spinner size="sm" />{" "}
                            </>
                          ) : (
                            <>Verify</>
                          )}
                        </Button>
                      </Col>
                    </>
                  )}

                  {(watchdiscountType?.value == "percentage" ||
                    watchdiscountType?.value == "flat") && (
                    <>
                      <Col className="me-1">
                        <Label className="form-label" for="hf-picker">
                          Enter
                          <strong>
                            {isPercentage == "percentage"
                              ? " Percentage "
                              : " Amount  "}
                          </strong>{" "}
                          For Discount
                          <span style={{ color: "red" }}>*</span>
                        </Label>

                        <InputGroup className="flex-grow-1">
                          <Controller
                            name="discountAmount"
                            rules={{
                              required: "Discount amount is required",
                              validate: (value) => {
                                if (isPercentage === "percentage") {
                                  return (
                                    parseFloat(value) <= 100 ||
                                    "Percentage cannot exceed 100"
                                  );
                                }
                                return true;
                              },
                            }}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="text"
                                disabled={isAssignedStatus}
                                readOnly={formData[0]?.otpVerify}
                                placeholder={
                                  isPercentage === "percentage"
                                    ? "Enter percentage"
                                    : "Enter amount"
                                }
                                onChange={(e) => {
                                  let value = e.target.value;

                                  if (isPercentage === "percentage") {
                                    // allow decimal values (e.g. 10.5)
                                    value = value.replace(/[^0-9.]/g, "");

                                    // allow only one decimal point
                                    const parts = value.split(".");
                                    if (parts.length > 2) {
                                      value = parts[0] + "." + parts[1];
                                    }
                                  } else {
                                    // allow only integers for amount
                                    value = value.replace(/\D/g, "");
                                  }

                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          <InputGroupText className="bg-white text-muted">
                            {isPercentage == "percentage" ? "%" : "$"}
                          </InputGroupText>
                        </InputGroup>
                        {errors.discountAmount && (
                          <FormFeedback className="d-block">
                            {errors.discountAmount.value?.message ||
                              errors.discountAmount.message}
                          </FormFeedback>
                        )}
                      </Col>
                      {watchdiscountType?.value != "flat" && (
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
                                disabled={true}
                                invalid={errors.calDisAmount && true}
                                {...field}
                              />
                            )}
                          />
                          {errors.calDisAmount && (
                            <FormFeedback className="d-block">
                              {errors.calDisAmount.value?.message ||
                                errors.calDisAmount.message}
                            </FormFeedback>
                          )}
                        </Col>
                      )}
                      <Col md="3" className="mt-2">
                        <Button
                          disabled={discountOtpLoader || isAssignedStatus}
                          onClick={handleGenerateOtp}
                        >
                          {discountOtpLoader ? (
                            <>
                              <Spinner size="sm" /> Generating..{" "}
                            </>
                          ) : (
                            "Generate otp"
                          )}
                        </Button>
                      </Col>
                    </>
                  )}
                </>
              )}
            </Row>
            {isVerify == true &&
              (watchdiscountType?.value == "flat" ||
                watchdiscountType?.value == "percentage") && (
                <Row className={"mb-2"}>
                  <Col md={3} className="mt-0">
                    <Label className="form-label" for="otpForDiscount">
                      Enter OTP
                    </Label>

                    <Controller
                      name="otpForDiscount"
                      control={control}
                      rules={{
                        required: "OTP is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "OTP must be exactly 6 digits",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter OTP"
                          maxLength={6}
                          inputMode="numeric"
                          disabled={finalOtp ? true : false}
                          style={{ color: "#000" }}
                          invalid={errors.otpForDiscount && true}
                          onChange={(e) => {
                            // sanitize: allow only digits
                            const value = e.target.value.replace(/\D/g, "");

                            // limit to 6 digits
                            field.onChange(value.slice(0, 6));
                          }}
                        />
                      )}
                    />

                    {errors.otpForDiscount && (
                      <span className="text-danger">
                        {errors.otpForDiscount.message}
                      </span>
                    )}
                  </Col>

                  <Col md="3" className="mt-2">
                    <Button
                      disabled={finalOtp ? true : false}
                      onClick={handleVerify}
                      color="primary"
                    >
                      {submitedOTP ? (
                        <>
                          Loading.. <Spinner size="sm" />{" "}
                        </>
                      ) : (
                        <>Verify</>
                      )}
                    </Button>
                  </Col>
                </Row>
              )}
            <Row>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="deposit">
                  Security Deposit <span style={{ color: "red" }}>*</span>
                </Label>

                <Controller
                  name="deposite"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value !== "" && !isNaN(value) && parseFloat(value) >= 0
                        ? true
                        : "Enter a valid non-negative number",
                  }}
                  render={({ field: { onChange, ...rest } }) => (
                    <Input
                      type="text"
                      placeholder="Enter Security Deposit Amount"
                      invalid={!!errors.deposite}
                      disabled={isAssignedStatus}
                      onChange={(e) => {
                        // Sanitize input: digits only
                        const sanitized = e.target.value.replace(/[^0-9]/g, "");
                        onChange(sanitized);
                      }}
                      {...rest}
                    />
                  )}
                />

                {errors.deposite && (
                  <FormFeedback>{errors.deposite.message}</FormFeedback>
                )}
              </Col>

              <Col md="12" className="mb-1">
                <Label className="form-label" for="landmark">
                  Total Amount <span style={{ color: "red" }}>*</span>
                </Label>

                <Controller
                  name="finalPayment"
                  control={control}
                  rules={{
                    required: "Final Payment is required",
                    validate: (value) =>
                      parseFloat(value) > 0 ||
                      "Final Payment cannot be negative or Zero",
                  }}
                  render={({ field }) => (
                    <Input
                      disabled={isAssignedStatus}
                      placeholder="Final Amount"
                      invalid={errors.finalPayment && true}
                      {...field}
                      style={{ fontWeight: "bold" }}
                      readOnly
                    />
                  )}
                />

                {errors.finalPayment && (
                  <FormFeedback>{errors.finalPayment.message}</FormFeedback>
                )}
              </Col>
            </Row>

            {contractTypeName == "long" && (
              <Row>
                <Col md="12" className="mb-1">
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
                        disabled={isAssignedStatus}
                        value={field.value}
                        onChange={(date) => {
                          const formattedDate = format(date[0], "yyyy-MM-dd"); // Format date
                          field.onChange(formattedDate); // Update value in the form
                        }}
                      />
                    )}
                  />
                  {errors.nextPaymentDate && (
                    <FormFeedback>
                      {errors.nextPaymentDate.message}
                    </FormFeedback>
                  )}
                </Col>
              </Row>
            )}
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
                      isDisabled={isAssignedStatus}
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

            {/*   ===================== Cash =============================  */}

            {isAssignedStatus !== true && (
              <>
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
                    <Row className="mb-2">
                      <Col sm="4">
                        <Label className="form-label" for="hf-picker">
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
                                  id={`pin-input-${index}`}
                                  className={`auth-input height-50 text-center numeral-mask mx-25 mb-1 ${
                                    errors.pin?.[index] ? "is-invalid" : ""
                                  }`}
                                  autoFocus={index === 0}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (!/^[0-9]$/.test(value) && value !== "")
                                      return;

                                    field.onChange(e);

                                    if (value && index < 5) {
                                      const nextInput = document.getElementById(
                                        `pin-input-${index + 1}`,
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
                                        `pin-input-${index - 1}`,
                                      );
                                      prevInput?.focus();
                                    }
                                  }}
                                />
                              )}
                            />
                          ))}
                        </div>
                      </Col>
                    </Row>
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
                                (option) => option.value === field.value,
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
                                (option) => option.value === field.value,
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
                                  "",
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
                          rules={{
                            required: "Card Holder's Name is required",
                            pattern: {
                              value: /^[A-Za-z ]+$/, // allow alphabets and spaces only
                              message:
                                "Only alphabetic characters and spaces allowed",
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
                                // Allow only letters and spaces
                                const onlyAlphabetsAndSpaces =
                                  e.target.value.replace(/[^a-zA-Z ]/g, "");
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
                            minLength: {
                              value: 5,
                              message: "Address must be at least 5 characters",
                            },
                            maxLength: {
                              value: 200,
                              message: "Address cannot exceed 200 characters",
                            },
                            pattern: {
                              value: /^[a-zA-Z0-9 ,\-.]*$/,
                              message:
                                "Only letters, numbers, spaces, commas, dashes, and periods are allowed",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Address"
                              invalid={!!errors.address}
                              {...field}
                              // isDisabled={statusThree}
                              onChange={(e) => {
                                const allowedChars = e.target.value.replace(
                                  /[^a-zA-Z0-9\s,.\-]/g,
                                  "",
                                );
                                field.onChange(allowedChars);
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
                              onChange={(e) => {
                                const onlyAlphabets = e.target.value.replace(
                                  /[^a-zA-Z ]/g,
                                  "",
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
                              onChange={(e) => {
                                const onlyAlphabets = e.target.value.replace(
                                  /[^a-zA-Z ]/g,
                                  "",
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
                              onChange={(e) => {
                                const onlyAlphabets = e.target.value.replace(
                                  /[^a-zA-Z ]/g,
                                  "",
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
                        <Label className="form-label" for="pinCode">
                          Zip Code <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="pinCode"
                          control={control}
                          rules={{
                            required: "Zip Code is required",
                            pattern: {
                              value: /^\d{5}$/, // ✅ exactly 5 digits
                              message: "Zip Code must be exactly 5 digits",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Zip Code"
                              invalid={!!errors.pinCode}
                              {...field}
                              onChange={(e) => {
                                // allow only numbers
                                const onlyNumbers = e.target.value.replace(
                                  /\D/g,
                                  "",
                                );
                                field.onChange(onlyNumbers);
                              }}
                              maxLength={5} // optional: prevent typing more than 5 digits
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
                              disabled={isAssign}
                              onChange={(e) => {
                                const onlyAlphabetsAndSpaces =
                                  e.target.value.replace(/[^a-zA-Z ]/g, "");
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
                                const onlyAlphabets = e.target.value.replace(
                                  /[^a-zA-Z ]/g,
                                  "",
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
                              message:
                                "Routing Number must be exactly 9 digits",
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
                              value: 10,
                              message:
                                "Account Number must be at least 10 digits",
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
                          <FormFeedback>
                            {errors.chequeNumber.message}
                          </FormFeedback>
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
                                const onlyAlphabets = e.target.value.replace(
                                  /[^a-zA-Z ]/g,
                                  "",
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
                                const onlyAlphabets = e.target.value.replace(
                                  /[^a-zA-Z ]/g,
                                  "",
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
                              // isDisabled={statusThree}
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
                              value: 10,
                              message:
                                "Account Number must be at least 10 digits",
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
                {/* ===================== card Swipe ==========================*/}

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
                            validate: validateCardSwipeTransactionId,
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
                                const alphanumericValue =
                                  e.target.value.replace(/[^a-zA-Z0-9]/g, "");
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
                              // isDisabled={statusThree()}
                              classNamePrefix="select"
                              isClearable
                              options={CompanyOptions}
                              isInvalid={!!errors.companyName}
                            />
                          )}
                        />
                        {errors.companyName && (
                          <FormFeedback>
                            {errors.companyName.message}
                          </FormFeedback>
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
                            rules={{
                              required: "MTCN Number is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message:
                                  "MTCN Number must be exactly 10 digits",
                              },
                            }}
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Enter mtcn Number "
                                invalid={!!errors.mtcn}
                                {...field}
                                // readOnly={statusThree()}

                                onChange={(e) => {
                                  const numericValue = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  );
                                  // if (numericValue.length <= getCvvLength(cardType)) {
                                  field.onChange(numericValue);
                                  // }
                                }}
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
                          <Label
                            className="form-label"
                            for="otherTransactionId"
                          >
                            Other Transaction ID{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>

                          <Controller
                            name="otherTransactionId"
                            control={control}
                            rules={{
                              required: "Transaction ID is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message:
                                  "Transaction ID must be exactly 10 digits",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Enter Transaction ID"
                                invalid={!!errors.otherTransactionId}
                                {...field}
                                onChange={(e) => {
                                  const numericValue = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  );
                                  field.onChange(numericValue);
                                }}
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
                          <Label className="form-label" for="otherCompanyName">
                            Other Company Name{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>

                          <Controller
                            name="otherCompanyName"
                            control={control}
                            rules={{
                              required: "Company Name is required",
                              pattern: {
                                value: /^[A-Za-z0-9 ]+$/, // only letters, numbers, spaces
                                message: "Special characters are not allowed",
                              },
                            }}
                            render={({ field }) => (
                              <div>
                                <Input
                                  id="otherCompanyName"
                                  placeholder="Enter Other Company Name"
                                  invalid={!!errors.otherCompanyName}
                                  {...field}
                                  onChange={(e) => {
                                    // Only allow letters and spaces
                                    const value = e.target.value.replace(
                                      /[^a-zA-Z ]/g,
                                      "",
                                    );
                                    field.onChange(value);
                                  }}
                                />
                                {errors.otherCompanyName && (
                                  <span className="text-danger small">
                                    {errors.otherCompanyName.message}
                                  </span>
                                )}
                              </div>
                            )}
                          />
                        </Col>
                      </Row>
                    )}
                  </>
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

                {isAssignedStatus !== true ? (
                  <Button
                    type="submit"
                    color="primary"
                    className="btn-next"
                    disabled={loading || checkMember}
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
                ) : (
                  <Button color="primary" onClick={() => stepper.next()}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          </>
        </Form>
      )}

      <SuccessPayment
        setModal={setModal}
        modal={modal}
        slipPayment={totalFinalPayment}
        memberID={memberID || mId}
        transactionId={transactionId}
      />
    </Fragment>
  );
};

export default Address;
