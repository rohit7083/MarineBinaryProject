import useJwt from "@src/auth/jwt/useJwt";
import CryptoJS from "crypto-js";
import { Fragment, useState } from "react";
import Countdown from "react-countdown";
import { Send, ThumbsUp } from "react-feather";
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
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import WatchNew from "../../../../src/assets/images/updatedWatchnew.jpg";

const Cash_otp = ({
  value,
  setMode,
  mode,
  setValuedis,
  showModal,
  setShowModal,
  setValueInParent,
  keyName,
  allEventData,
  verify,
  setVerify,
  setDiscountDisabled,
}) => {
  const [loading, setLoading] = useState(false);
  const [accessTokenotp, setAccessTokenOtp] = useState("");
  const [countdownEndTime, setCountdownEndTime] = useState(null);
  const [errorMessage, setErrorMsz] = useState("");
  const [attempt, setAttempt] = useState(0); // 0=initial, 1=after resend, 2=call
  const [resendVisible, setResendVisible] = useState(false);
  const [callVisible, setCallVisible] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false); // ⏳ control countdown manually
  const discountTypeOptions = [
    { label: "Flat ($)", value: "Flat" },
    { label: "Percentage (%)", value: "Percentage" },
  ];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

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

  // ================= Generate OTP =================
  const handleOTP = async () => {
    try {
      const payload = {
        type: 2,
        eventId: allEventData?.eventId,
        memberId: allEventData?.memberId,
      };
      const response = await useJwt.GenerateOtp(payload);
      if (response?.status === 200) {
        setAccessTokenOtp(response?.data?.content);
        setCountdownEndTime(Date.now() + 40000);
        setCountdownActive(true);
        setAttempt(0);
        setResendVisible(false);
        setCallVisible(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
    }
  };

  // ================= Verify OTP =================
  const onSubmit = async (data) => {
    setErrorMsz("");
    const rowotp = data.otp.join("");
    try {
      setLoading(true);
      const encrypted = encryptAES(rowotp);
      const res = await useJwt.verifyOtp(accessTokenotp, { otp: encrypted });

      if (res?.status === 200) {
        setVerify(true);
        setShowModal(false);
        setResendVisible(false);
        setCallVisible(false);
        return;
      } else {
        handleFailedAttempt();
      }
    } catch {
      setErrorMsz("Incorrect OTP");
      handleFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  // ================= Handle Failed Attempts =================
  const handleFailedAttempt = () => {
    setAttempt((prev) => {
      const next = prev + 1;
      setCountdownActive(false); // stop countdown after fail
      if (next === 1) {
        // show resend button only, no countdown
        setResendVisible(true);
      } else if (next === 2) {
        // hide resend, show call option, countdown restarts
        setResendVisible(false);
        setCallVisible(true);
        setCountdownEndTime(Date.now() + 40000);
        setCountdownActive(true);
      } else if (next >= 3) {
        // close and disable
        setShowModal(false);
        setVerify(false);
        if (setDiscountDisabled) setDiscountDisabled(true);
      }
      return next;
    });
  };

  // ================= Countdown End =================
  const handleCountdownComplete = () => {
    if (!verify) {
      handleFailedAttempt();
    }
  };

  // ================= Resend OTP =================
  const otpPayload = {
    type: 2,
    eventId: allEventData?.eventId,
    memberId: allEventData?.memberId,
  };
  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await useJwt.GenerateOtp(otpPayload);
      if (res?.status === 200) {
        setCountdownEndTime(Date.now() + 40000);
        setCountdownActive(true); // restart timer
        setResendVisible(false);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  // ================= Call Us =================
  const handleResendCall = async (e) => {
    e.preventDefault();
    try {
      const res = await useJwt.resend_OtpCall(otpPayload);
      if (res?.status === 200) {
        setCountdownEndTime(Date.now() + 40000);
        setCountdownActive(true);
        setCallVisible(false);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const discountType = watch("discountType")?.value || "Flat";

  return (
    <Fragment>
      {verify && (
        <Alert color="success">
          <div className="alert-body mb-2" style={{ marginTop: "10px" }}>
            <span className="ms-1">OTP Verified Successfully!</span>
            <ThumbsUp size={15} />
          </div>
        </Alert>
      )}

      {!verify && (
        <Col md="12" className="mb-1">
          <Label className="form-label" for="hf-picker">
            OTP verification compulsory for the Discount{" "}
            <span style={{ color: "red" }}>*</span>
          </Label>
          <br />
          <Button color="primary" size="sm" outline onClick={handleOTP}>
            <Send className="me-1" size={20} />
            Generate OTP
          </Button>
        </Col>
      )}

      {verify && (
        <>
          <Col md="12" className="mb-2 ">
            <Label for="discountType">Discount Type</Label>
            <Select
              id="discountType"
              options={discountTypeOptions}
              defaultValue={discountTypeOptions[0]}
              onChange={(selected) => setMode(selected.value)}
            />
          </Col>
          <Col md="12" className="mb-2 ">
            <Label for="discountValue">Discount Value</Label>
            <InputGroup className="mb-2">
              <InputGroupText>
                {mode === "Percentage" ? "%" : "$"}
              </InputGroupText>
              <Input
                type="number"
                placeholder={mode === "Percentage" ? "10%" : "100"}
                value={value}
                onChange={(e) => {
                  setValueInParent(keyName, e.target.value);
                  setValuedis(e.target.value);
                }}
              />
            </InputGroup>
          </Col>
        </>
      )}

      {/* ============ OTP MODAL ============ */}
      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        className="modal-dialog-centered"
        style={{ width: "400px" }}
      >
        <div className="auth-inner">
          <Card className="mb-0">
            <CardBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <CardTitle tag="h2" className="fw-bolder mb-1">
                  Verify OTP 💬
                </CardTitle>
                <CardText className="mb-75">
                  We sent an OTP to your registered mobile number.
                </CardText>

                {errorMessage && (
                  <UncontrolledAlert color="danger">
                    <div className="alert-body text-danger fw-bold">
                      <strong>Error! </strong>
                      {errorMessage}
                    </div>
                  </UncontrolledAlert>
                )}

                <h6>Type your 6-digit security code</h6>
                <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                  {[...Array(6)].map((_, index) => (
                    <Controller
                      key={index}
                      name={`otp[${index}]`}
                      control={control}
                      rules={{
                        required: "All OTP digits are required",
                        pattern: { value: /^[0-9]$/, message: "Only numbers" },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          maxLength="1"
                          id={`otp-input-${index}`}
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          className={`auth-input height-50 text-center numeral-mask mx-25 mb-1 ${
                            errors.otp?.[index] ? "is-invalid" : ""
                          }`}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, ""); // allow only digits
                            field.onChange(val);

                            // Focus next if digit entered
                            if (val && index < 5) {
                              const next = document.getElementById(
                                `otp-input-${index + 1}`
                              );
                              if (next) next.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            // Move back on backspace
                            if (
                              e.key === "Backspace" &&
                              !field.value &&
                              index > 0
                            ) {
                              const prev = document.getElementById(
                                `otp-input-${index - 1}`
                              );
                              if (prev) prev.focus();
                            }
                          }}
                        />
                      )}
                    />
                  ))}
                </div>

                <div className="d-flex flex-column align-items-center position-relative">
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <img
                      src={WatchNew}
                      alt="Phone Call"
                      style={{
                        width: "120px",
                        height: "100px",
                        display: "block",
                      }}
                    />
                    {countdownActive && countdownEndTime && (
                      <Countdown
                        key={countdownEndTime}
                        date={countdownEndTime}
                        onComplete={handleCountdownComplete}
                        renderer={({ minutes, seconds }) => (
                          <span
                            className="position-absolute top-50 start-50 translate-middle"
                            style={{
                              marginTop: "-4px",
                              fontSize: "14px",
                              fontWeight: "bold",
                              color: "white",
                            }}
                          >
                            {String(minutes).padStart(2, "0")}:
                            {String(seconds).padStart(2, "0")}
                          </span>
                        )}
                      />
                    )}
                  </div>
                </div>

                <Button block type="submit" disabled={loading} color="primary">
                  {loading ? (
                    <>
                      Loading... <Spinner size="sm" />
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>

                {resendVisible && (
                  <p className="text-center mt-2">
                    Didn’t get the code?{" "}
                    <a href="#" onClick={handleResendOTP}>
                      Resend OTP
                    </a>
                  </p>
                )}

                {callVisible && (
                  <p className="text-center mt-2">
                    Still having trouble?{" "}
                    <a href="#" onClick={handleResendCall}>
                      Call Us
                    </a>
                  </p>
                )}
              </Form>
            </CardBody>
          </Card>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Cash_otp;
