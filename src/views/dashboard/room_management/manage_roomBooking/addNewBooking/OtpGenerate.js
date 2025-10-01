import useJwt from "@src/auth/jwt/useJwt";
import CryptoJS from "crypto-js";
import { Fragment, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import WatchNew from "../../../../../../src/assets/images/updatedWatchnew.jpg";

const OtpGenerate = ({
  setMode,
  mode,
  setDiscountAmt,
  discountAmt,
  setValuedis,
  showModal,
  setShowModal,
  alldata,
  verify,
  setVerify,
  searchId,
  setAccessTokenOtp,
  accessTokenotp,
}) => {
  const [loading, setLoading] = useState(false);
  const [countdownEndTime, setCountdownEndTime] = useState(Date.now() + 30000); // 30s default
  const [errorMessage, setErrorMsz] = useState("");
  const [otpStage, setOtpStage] = useState(0); // 0: initial countdown, 1: Resend, 2: Call Us
  const [isCounting, setIsCounting] = useState(true); // countdown active

  const discountTypeOptions = [
    { label: "Flat ($)", value: "Flat" },
    { label: "Percentage (%)", value: "Percentage" },
  ];

  const { control: formControl, handleSubmit, watch, formState: { errors: formErrors } } = useForm();

  const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";
  const generateKey = (secretKey) => CryptoJS.SHA256(secretKey);
  const generateIV = () => CryptoJS.lib.WordArray.random(16);
  const encryptAES = (plainText) => {
    const key = generateKey(SECRET_KEY);
    const iv = generateIV();
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
  };

  // OTP Verification
  const handleCustomSubmit = async (data) => {
    const otpString = (data.otp || []).join("");
    const encrypted = encryptAES(otpString);
    setErrorMsz("");
    setCountdownEndTime(0);
    try {
      if (!accessTokenotp) return;
      setLoading(true);
      await useJwt.verifyOTP(accessTokenotp, { otp: encrypted });
      setVerify(true);
      setShowModal(false);
    } catch (error) {
      if (error.response) setErrorMsz(error?.response?.data?.content);
    } finally {
      setLoading(false);
    }
  };

  // Countdown complete handler
  const handleCountdownComplete = () => {
    setIsCounting(false);
    if (otpStage === 0) setOtpStage(1); // show Resend
    else if (otpStage === 1) setOtpStage(2); // show Call Us
    else setOtpStage(3); // nothing
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      const payload = { type: 3, roomId: searchId };
      const response = await useJwt.GenerateOtp(payload);
      if (response?.status === 200) {
        setAccessTokenOtp(response?.data?.content);
        setCountdownEndTime(Date.now() + 30000); // restart countdown
        setOtpStage(0); // hide button during countdown
        setIsCounting(true);
      }
    } catch (error) {
      if (error.response) setErrorMsz(error?.response?.data?.content);
    }
  };

  // Call Us OTP
  const handleCallUsOTP = async () => {
    try {
      // Call Us API
      setCountdownEndTime(Date.now() + 30000); // restart countdown
      setOtpStage(0); // hide button during countdown
      setIsCounting(true);
    } catch (error) {
      if (error.response) setErrorMsz(error?.response?.data?.content);
    }
  };

  // Discount calculation
  useEffect(() => {
    const selectedType = watch("discountType");
    const discountValue = watch("discountValue");
    let DiscountValue;

    if (selectedType === "Flat") DiscountValue = discountValue;
    else if (selectedType === "Percentage")
      DiscountValue = alldata?.totalAmount * (discountValue / 100);

    setDiscountAmt({
      discountValue: DiscountValue,
      enterValue: discountValue,
      type: selectedType,
    });
  }, [watch("discountType"), watch("discountValue")]);

  return (
    <Fragment>
      {verify && (
        <Alert color="success">
          <div className="alert-body mb-2" style={{ marginTop: "10px" }}>
            <span className="ms-1">OTP Verified Successfully!</span>
          </div>
        </Alert>
      )}

      {verify && (
        <>
          <Col md="12" className="mb-2">
            <Label for="discountType">Discount Type</Label>
            <Controller
              name="discountType"
              control={formControl}
              render={({ field }) => (
                <Select
                  id="discountType"
                  options={discountTypeOptions}
                  value={discountTypeOptions.find((opt) => opt.value === field.value)}
                  onChange={(selected) => field.onChange(selected.value)}
                />
              )}
            />
          </Col>

          <Col md="12" className="mb-2">
            <Label for="discountValue">Discount Value</Label>
            <InputGroup className="mb-2">
              <InputGroupText>{mode === "Percentage" ? "%" : "$"}</InputGroupText>
              <Controller
                name="discountValue"
                control={formControl}
                rules={{
                  required: "Discount value is required",
                  pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid discount value" },
                  validate: (value) => {
                    const numericValue = parseFloat(value);
                    const type = watch("discountType");
                    if (type === "Flat") return numericValue > 0 || "Discount must be > 0";
                    if (type === "Percentage") return numericValue <= 100 || "Percentage ≤ 100";
                    return true;
                  },
                }}
                render={({ field }) => {
                  const isPercentage = watch("discountType") === "Percentage";
                  return (
                    <Input
                      type="number"
                      min="0"
                      max={isPercentage ? 100 : undefined}
                      step="0.01"
                      placeholder={isPercentage ? "Max 100%" : "Flat value"}
                      value={field.value}
                      onChange={(e) => {
                        let newValue = e.target.value;
                        if (isPercentage && parseFloat(newValue) > 100) newValue = "100";
                        field.onChange(newValue);
                      }}
                      onWheel={(e) => e.target.blur()}
                    />
                  );
                }}
              />
            </InputGroup>
          </Col>
        </>
      )}

      <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)} className="modal-dialog-centered">
        <div className="auth-inner">
          <Card className="mb-0">
            <CardBody>
              <CardTitle tag="h2" className="fw-bolder mb-1">
                Verify OTP 💬
              </CardTitle>
              <CardText className="mb-75">
                We sent OTP to your Registered Mobile Number. Enter the code from the Email below.
              </CardText>

              {errorMessage && (
                <UncontrolledAlert color="danger">
                  <div className="alert-body">
                    <strong>Error! </strong> {errorMessage}
                  </div>
                </UncontrolledAlert>
              )}

              <div className="mb-2">
                <h6>Type your 6-digit security code</h6>
                <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                  {[...Array(6)].map((_, index) => (
                    <Controller
                      key={index}
                      name={`otp[${index}]`}
                      control={formControl}
                      rules={{
                        required: "All OTP digits are required",
                        pattern: { value: /^[0-9]$/, message: "Each OTP digit must be a number" },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          maxLength="1"
                          className={`auth-input height-50 text-center numeral-mask mx-25 mb-1 ${formErrors.otp?.[index] ? "is-invalid" : ""}`}
                          autoFocus={index === 0}
                          id={`otp-input-${index}`}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            field.onChange(value);
                            if (value && index < 5) {
                              const nextInput = document.getElementById(`otp-input-${index + 1}`);
                              if (nextInput) nextInput.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !field.value && index > 0) {
                              const prevInput = document.getElementById(`otp-input-${index - 1}`);
                              if (prevInput) prevInput.focus();
                            }
                          }}
                        />
                      )}
                    />
                  ))}
                </div>

                <div className="d-flex flex-column align-items-center position-relative mt-2">
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img src={WatchNew} alt="Phone Call" style={{ width: "120px", height: "100px" }} />
                    <Countdown
                      key={countdownEndTime}
                      date={countdownEndTime}
                      onComplete={handleCountdownComplete}
                      renderer={({ minutes, seconds }) => (
                        <span className="position-absolute top-50 start-50 translate-middle" style={{ fontSize: "14px", fontWeight: "bold", color: "white" }}>
                          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                        </span>
                      )}
                    />
                  </div>

                  {!isCounting && otpStage === 1 && (
                    <Button color="link" onClick={handleResendOTP}>Resend OTP</Button>
                  )}

                  {!isCounting && otpStage === 2 && (
                    <Button color="link" onClick={handleCallUsOTP}>Call Us</Button>
                  )}
                </div>

                {formErrors.otp && <small className="text-danger">{formErrors.otp.message}</small>}
              </div>

              <Button block type="submit" disabled={loading} onClick={handleSubmit(handleCustomSubmit)} color="primary">
                {loading ? <>Loading.. <Spinner size="sm" /></> : "Verify"}
              </Button>
            </CardBody>
          </Card>
        </div>
      </Modal>
    </Fragment>
  );
};

export default OtpGenerate;
