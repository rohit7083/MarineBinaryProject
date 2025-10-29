// ** React Imports
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
// ** Reactstrap Imports
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

// ** Third Party Components
import CryptoJS from "crypto-js";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Custom Components
import PaymentModeSection from "./PaymentModeSection";

//jwt import
import useJwt from "@src/auth/jwt/useJwt";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

const colourOptions = [
  { value: "Monthly", label: "Monthly" },
  { value: "Annual", label: "Annual" },
];

// Secret key for encryption (move this to environment variables in production)
const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";

const EditUserExample = ({ setShow, show, customerData, slip }) => {
  // ** States
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [cardOptions, setCardOptions] = useState([]);
  const [loader, setLoader] = useState(false);
  // ** Hooks
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm({});

  // Watch paidIn to update finalPayment automatically
  const watchPaidIn = watch("paidIn");

  // ** Effect to load existing cards when modal opens
  useEffect(() => {
    if (show && slip?.member) {
      updateCardOptions(slip.member);
    }
  }, [show, slip]);
  const toast = useRef(null);

  // ** Effect to update finalPayment when paidIn changes
  useEffect(() => {
    if (watchPaidIn && slip) {
      const amount =
        watchPaidIn.value === "Annual"
          ? slip.marketAnnualPrice
          : slip.marketMonthlyPrice;
      setValue("finalPayment", amount);
    }
  }, [watchPaidIn, slip, setValue]);

  // Encryption helper functions
  function generateKey(secretKey) {
    return CryptoJS.SHA256(secretKey);
  }

  function generateIV() {
    return CryptoJS.lib.WordArray.random(16);
  }

  function encryptAES(plainText) {
    if (!plainText) return "";

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

  const onSubmit = async (data) => {
    console.log("Form data received:", data);

    try {
      // Raw values from RHF
      const rawValues = getValues();

      // Serialize values: turn Select objects into {value,label} and keep primitives as-is
      const serialized = JSON.parse(
        JSON.stringify(rawValues, (k, v) => {
          if (v && typeof v === "object" && "value" in v && "label" in v) {
            return { value: v.value, label: v.label };
          }
          return v;
        })
      );

      console.log("Serialized values:", serialized);

      // Get payment mode
      const paymentModeValue = serialized.paymentMode?.value || "";
      const paymentModeLabel = serialized.paymentMode?.label || "";

      console.log("Payment Mode:", paymentModeLabel, paymentModeValue);

      // Base payload - common fields for all payment modes
      const basePayload = {
        SlipId: slip?.id || "",
        memberId: slip?.member?.id ? slip.member.id : 0,
        contractDate: serialized.contractDate || "",
        renewalDate: serialized.renewalDate || "",
        nextPaymentDate: serialized.nextPaymentDate || "",
        paidIn: serialized.paidIn?.value || "",
        finalPayment: serialized.finalPayment || 0.0,
        paymentMode: paymentModeValue,
      };

      // Basic validation check for required fields
      const requiredFields = [
        "contractDate",
        "renewalDate",
        "nextPaymentDate",
        "paidIn",
        "finalPayment",
        "paymentMode",
      ];
      let isValid = true;

      requiredFields.forEach((field) => {
        const value = getValues(field);
        if (!value || (typeof value === "object" && !value.value)) {
          setError(field, {
            type: "manual",
            message: "This field is required",
          });
          isValid = false;
        }
      });

      if (!isValid) {
        console.error("Basic validation failed");
        return;
      }

      // Initialize final payload with base fields
      let payload = { ...basePayload };

      // Add payment-mode-specific fields based on selection
      switch (paymentModeLabel) {
        case "Cash":
          console.log("Processing Cash payment...");

          // Validate PIN
          const pinArray = serialized.pin || [];
          const pinValue = pinArray.join("");

          if (!pinValue || pinValue.length !== 4) {
            setError("pin[0]", {
              type: "manual",
              message: "Please enter all 4 PIN digits",
            });
            console.error("Cash: PIN validation failed");
            return;
          }

          // Encrypt PIN for Cash payment
          const encryptedPin = encryptAES(pinValue);

          payload = {
            ...payload,
            pin: encryptedPin,
          };
          console.log("Cash payload prepared");
          break;

        case "Credit Card":
          console.log("Processing Credit Card payment...");

          // Validate Credit Card fields
          if (
            !serialized.cardNumber ||
            !serialized.cardType ||
            !serialized.cardCvv ||
            !serialized.cardExpiryYear ||
            !serialized.cardExpiryMonth ||
            !serialized.nameOnCard ||
            !serialized.address ||
            !serialized.city ||
            !serialized.state ||
            !serialized.country ||
            !serialized.pinCode
          ) {
            alert("Please fill all Credit Card details");
            console.error("Credit Card: Missing required fields");
            return;
          }

          payload = {
            ...payload,
            cardType: serialized.cardType || "",
            cardNumber: serialized.cardNumber || "",
            cardCvv: serialized.cardCvv || "",
            cardExpiryYear: serialized.cardExpiryYear || "",
            cardExpiryMonth: serialized.cardExpiryMonth || "",
            nameOnCard: serialized.nameOnCard || "",
            address: serialized.address || "",
            city: serialized.city || "",
            state: serialized.state || "",
            country: serialized.country || "",
            pinCode: serialized.pinCode || "",
          };
          console.log("Credit Card payload prepared");
          break;

        case "Card Swipe":
          console.log("Processing Card Swipe payment...");

          if (!serialized.cardSwipeTransactionId) {
            setError("cardSwipeTransactionId", {
              type: "manual",
              message: "Card Swipe Transaction ID is required",
            });
            console.error("Card Swipe: Transaction ID missing");
            return;
          }

          payload = {
            ...payload,
            cardSwipeTransactionId: serialized.cardSwipeTransactionId || "",
          };
          console.log("Card Swipe payload prepared");
          break;

        case "Cheque21":
          console.log("Processing Cheque21 payment...");

          // Validate that file is uploaded for Cheque21
          const chequeImageFile = rawValues.checkImage;

          if (!chequeImageFile) {
            setError("checkImage", {
              type: "manual",
              message: "Cheque image is required for Cheque21 payment mode",
            });
            console.error("Cheque21: File not found");
            return;
          }

          // Validate other Cheque21 fields
          if (
            !serialized.bankName ||
            !serialized.nameOnAccount ||
            !serialized.routingNumber ||
            !serialized.accountNumber ||
            !serialized.chequeNumber
          ) {
            alert("Please fill all Cheque21 details");
            console.error("Cheque21: Missing required fields");
            return;
          }

          payload = {
            ...payload,
            bankName: serialized.bankName || "",
            nameOnAccount: serialized.nameOnAccount || "",
            routingNumber: serialized.routingNumber || "",
            accountNumber: serialized.accountNumber || "",
            chequeNumber: serialized.chequeNumber || "",
            documentUid: serialized.documentUid || "",
          };
          console.log("Cheque21 payload prepared, file:", chequeImageFile.name);
          break;

        case "ChequeACH":
          console.log("Processing ChequeACH payment...");

          if (
            !serialized.accountType?.value ||
            !serialized.bankName ||
            !serialized.nameOnAccount ||
            !serialized.routingNumber ||
            !serialized.accountNumber
          ) {
            alert("Please fill all ChequeACH details");
            console.error("ChequeACH: Missing required fields");
            return;
          }

          payload = {
            ...payload,
            accountType: serialized.accountType?.value || "",
            bankName: serialized.bankName || "",
            nameOnAccount: serialized.nameOnAccount || "",
            routingNumber: serialized.routingNumber || "",
            accountNumber: serialized.accountNumber || "",
          };
          console.log("ChequeACH payload prepared");
          break;

        case "Money Order":
          console.log("Processing Money Order payment...");

          // Validate company name
          if (!serialized.companyName?.value) {
            setError("companyName", {
              type: "manual",
              message: "Company Name is required",
            });
            console.error("Money Order: Company name missing");
            return;
          }

          payload = {
            ...payload,
            companyName: serialized.companyName?.value || "",
          };

          console.log("Company selected:", serialized.companyName?.label);

          // Add MTCN or Other company details based on company selection
          if (serialized.companyName?.label === "Other") {
            // Validate Other company fields
            if (!serialized.otherCompanyName) {
              setError("otherCompanyName", {
                type: "manual",
                message: "Other Company Name is required",
              });
              console.error("Money Order: Other company name missing");
              return;
            }
            if (!serialized.otherTransactionId) {
              setError("otherTransactionId", {
                type: "manual",
                message: "Transaction ID is required",
              });
              console.error("Money Order: Other transaction ID missing");
              return;
            }

            payload.otherCompanyName = serialized.otherCompanyName || "";
            payload.otherTransactionId = serialized.otherTransactionId || "";
            console.log("Money Order (Other) payload prepared:", {
              otherCompanyName: payload.otherCompanyName,
              otherTransactionId: payload.otherTransactionId,
            });
          } else {
            // Validate MTCN
            if (!serialized.mtcn) {
              setError("mtcn", {
                type: "manual",
                message: "MTCN Number is required",
              });
              console.error("Money Order: MTCN missing");
              return;
            }
            payload.mtcn = serialized.mtcn || "";
            console.log(
              "Money Order (Standard) payload prepared, MTCN:",
              payload.mtcn
            );
          }
          break;

        case "Payment Link":
          console.log("Processing Payment Link...");
          // Add any specific fields for Payment Link if needed
          break;

        case "QR Code":
          console.log("Processing QR Code...");
          // Add any specific fields for QR Code if needed
          break;

        default:
          console.warn("Unknown payment mode:", paymentModeLabel);
          alert("Please select a valid payment mode");
          return;
      }

      console.log("Final payload before FormData:", payload);

      // Create FormData
      const formData = new FormData();

      // Append all payload fields
      for (const key in payload) {
        if (
          payload[key] !== undefined &&
          payload[key] !== null &&
          payload[key] !== ""
        ) {
          formData.append(key, payload[key]);
          console.log(`Appended to FormData: ${key} = ${payload[key]}`);
        }
      }

      // ✅ Append file separately for Cheque21
      if (paymentModeLabel === "Cheque21" && rawValues.checkImage) {
        formData.append("chequeImage", rawValues.checkImage);
        console.log("Cheque image file appended:", rawValues.checkImage.name);
      }

      // ✅ Append contract file if exists
      if (rawValues.fiazan) {
        formData.append("contractFile", rawValues.fiazan);
        console.log("Contract file appended:", rawValues.fiazan.name);
      }

      console.log("=== FormData Contents ===");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      setLoader(true);
      // ** Hit API
      console.log("🚀 Calling API with FormData...");
      const response = await useJwt.renewContract(formData);

      console.log("✅ API Response:", response);

      if (response?.data?.status === "success") {
        toast.current.show({
          severity: "success",
          summary: "Successfully",
          detail: "Contract renewed successfully.!",
          life: 2000,
        });

        setTimeout(() => {
          setShow(false);
          reset();
        }, 1999);
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: `${error.response?.data?.message || error.message}`,
        life: 2000,
      });
    } finally {
      setLoader(false);
    }
  };

  const updateCardOptions = (member) => {
    if (member && member.cards && member.cards.length > 0) {
      const cardOpts = member.cards.map((card) => ({
        value: card.cardNumber,
        label: `**** **** **** ${card.cardNumber.slice(-4)} (${
          card.cardType || "Card"
        })`,
        cardData: card,
      }));
      setCardOptions(cardOpts);
    } else {
      setCardOptions([]);
    }
    setValue("existingCard", null);
  };

  return (
    <Fragment>
      <Toast ref={toast} />

      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <div className="text-center mb-2">
            <h1 className="mb-1">Renewal Contract</h1>
            <p>Updating user details will receive a privacy audit.</p>
          </div>

          <Form
            tag="form"
            className="gy-1 pt-75"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Row>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="contractDate">
                  New Contract Date <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="contractDate"
                  control={control}
                  rules={{ required: "Contract Date is required" }}
                  render={({ field }) => (
                    <Flatpickr
                      id="contractDate"
                      className={`form-control ${
                        errors.contractDate ? "is-invalid" : ""
                      }`}
                      options={{
                        altInput: true,
                        altFormat: "Y-m-d",
                        dateFormat: "Y-m-d",
                      }}
                      value={field.value}
                      onChange={(date) => {
                        const formattedDate = date[0]
                          ?.toISOString()
                          .split("T")[0];
                        field.onChange(formattedDate);

                        const startDate = new Date(date[0]);

                        const endDate = new Date(startDate);
                        endDate.setFullYear(endDate.getFullYear() + 1);
                        const formattedEndDate = endDate
                          .toISOString()
                          .split("T")[0];
                        setValue("renewalDate", formattedEndDate, {
                          shouldValidate: true,
                        });

                        const paidInValue = getValues("paidIn");
                        if (paidInValue) {
                          let nextPaymentDate = new Date(startDate);
                          if (paidInValue.value === "Monthly") {
                            nextPaymentDate.setMonth(
                              nextPaymentDate.getMonth() + 1
                            );
                          } else if (paidInValue.value === "Annual") {
                            nextPaymentDate.setFullYear(
                              nextPaymentDate.getFullYear() + 1
                            );
                          }
                          const formattedNextPaymentDate = nextPaymentDate
                            .toISOString()
                            .split("T")[0];
                          setValue(
                            "nextPaymentDate",
                            formattedNextPaymentDate,
                            { shouldValidate: true }
                          );
                        }
                      }}
                    />
                  )}
                />
                {errors.contractDate && (
                  <FormFeedback className="d-block">
                    {errors.contractDate.message}
                  </FormFeedback>
                )}
              </Col>

              <Col md="6" className="mb-1">
                <Label className="form-label" for="paidIn">
                  Paid In <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  control={control}
                  rules={{ required: "Paid In is required" }}
                  name="paidIn"
                  render={({ field }) => (
                    <Select
                      {...field}
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      isClearable
                      options={colourOptions}
                      onChange={(option) => {
                        field.onChange(option);

                        const contractDateValue = getValues("contractDate");
                        if (contractDateValue && option) {
                          const startDate = new Date(contractDateValue);
                          let nextPaymentDate = new Date(startDate);

                          if (option.value === "Monthly") {
                            nextPaymentDate.setMonth(
                              nextPaymentDate.getMonth() + 1
                            );
                          } else if (option.value === "Annual") {
                            nextPaymentDate.setFullYear(
                              nextPaymentDate.getFullYear() + 1
                            );
                          }

                          const formattedNextPaymentDate = nextPaymentDate
                            .toISOString()
                            .split("T")[0];
                          setValue(
                            "nextPaymentDate",
                            formattedNextPaymentDate,
                            { shouldValidate: true }
                          );
                        }
                      }}
                    />
                  )}
                />
                {errors.paidIn && (
                  <FormFeedback className="d-block">
                    {errors.paidIn.message}
                  </FormFeedback>
                )}
              </Col>
            </Row>

            <Row>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="renewalDate">
                  Contract Renewal Date <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="renewalDate"
                  control={control}
                  rules={{ required: "Renewal date is required" }}
                  render={({ field }) => (
                    <Flatpickr
                      id="renewalDate"
                      className={`form-control ${
                        errors.renewalDate ? "is-invalid" : ""
                      }`}
                      options={{
                        altInput: true,
                        altFormat: "Y-m-d",
                        dateFormat: "Y-m-d",
                        clickOpens: false,
                      }}
                      value={field.value}
                      onChange={() => {}}
                    />
                  )}
                />
                {errors.renewalDate && (
                  <FormFeedback className="d-block">
                    {errors.renewalDate.message}
                  </FormFeedback>
                )}
              </Col>

              <Col md="6" className="mb-1">
                <Label className="form-label" for="nextPaymentDate">
                  Next Payment Date <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="nextPaymentDate"
                  control={control}
                  rules={{ required: "Next Payment date is required" }}
                  render={({ field }) => (
                    <Flatpickr
                      id="nextPaymentDate"
                      className={`form-control ${
                        errors.nextPaymentDate ? "is-invalid" : ""
                      }`}
                      options={{
                        altInput: true,
                        altFormat: "Y-m-d",
                        dateFormat: "Y-m-d",
                        minDate: "today",
                      }}
                      value={field.value}
                      onChange={(date) => {
                        const formattedDate = date[0]
                          ?.toISOString()
                          .split("T")[0];
                        field.onChange(formattedDate);
                      }}
                    />
                  )}
                />
                {errors.nextPaymentDate && (
                  <FormFeedback className="d-block">
                    {errors.nextPaymentDate.message}
                  </FormFeedback>
                )}
              </Col>
            </Row>

            <Row>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="finalPayment">
                  Total Amount <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="finalPayment"
                  control={control}
                  rules={{ required: "Final Payment is required" }}
                  render={({ field }) => (
                    <Input
                      placeholder="Final Amount"
                      invalid={errors.finalPayment && true}
                      readOnly
                      disabled
                      {...field}
                    />
                  )}
                />
                {errors.finalPayment && (
                  <FormFeedback>{errors.finalPayment.message}</FormFeedback>
                )}
              </Col>
            </Row>

            <FormGroup>
              <Label for="fileInput">New Contract Upload</Label>
              <Controller
                name="fiazan"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    type="file"
                    id="fileInput"
                    onChange={(e) => {
                      onChange(e.target.files[0]);
                    }}
                    {...field}
                  />
                )}
              />
            </FormGroup>

            {/* Payment Mode Section Component */}
            <PaymentModeSection
              control={control}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
              showCardDetail={showCardDetail}
              setShowCardDetail={setShowCardDetail}
            />

            <Col xs={12} className="text-center mt-2 pt-50">
              <Button
                type="submit"
                disabled={loader}
                className="me-1"
                color="primary"
              >
                {loader ? (
                  <>
                    Loading... <Spinner size={"sm"} />
                  </>
                ) : (
                  <>submit</>
                )}
              </Button>
              <Button
                type="button"
                color="secondary"
                outline
                onClick={() => {
                  reset();
                  setShowCardDetail(false);
                  setShow(false);
                }}
              >
                Discard
              </Button>
            </Col>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default EditUserExample;
