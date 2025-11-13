import React, { Fragment, useEffect, useRef, useState } from "react";

// ** Reactstrap Imports
import CryptoJS from "crypto-js";
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";

// ** Third Party Imports
import Countdown from "react-countdown";
import { BeatLoader } from "react-spinners";
import styled from "styled-components";

// ** React Hook Form Imports
import { Controller, useForm } from "react-hook-form";

// ** Custom Image Imports
import watchSrc from "@src/assets/images/updatedWatchnew.jpg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";

// ** JWT Service
import useJwt from "@src/auth/jwt/useJwt";
import { Send, ThumbsUp } from "react-feather";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledImage = styled.img`
  width: 120px;
  height: 100px;
  display: block;
`;

const TimerText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: -4px;
  font-size: 14px;
  font-weight: bold;
  color: white;
`;

const GenrateOtp = (props) => {
  // **Destructure props for better readability
  const { otpVerify, setotpVerify, slipIID, memberId, fetchDiscountFields } =
    props;

  // ** States
  const [timerKey, setTimerKey] = useState(0);
  const [targetTime, setTargetTime] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [tokenForCall, setTokenForCall] = useState(null);
  const [errMsz, seterrMsz] = useState("");
  const [accessTokenotp, setAccessTokenOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const [verify, setVerify] = useState(false);
  const [show, setShow] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);

  // ** Refs
  const alreadyUpdatedRef = useRef(false);

  // ** React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otpInput: Array(6).fill(""),
    },
  });
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

  // ** Render Timer
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <TimerText>00:00</TimerText>;
    } else {
      alreadyUpdatedRef.current = false;
      return (
        <TimerText>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </TimerText>
      );
    }
  };
  // ** Render label
  const renderLabel = (attempt) => {
    switch (attempt) {
      case 1:
        return (
          <span>
            Didn’t get the code ?{" "}
            <span className="text-primary"> resend otp</span>
          </span>
        );
      case 2:
        return (
          <span>
            Didn’t get the code ?{" "}
            <span className="text-primary"> Call Us </span>
          </span>
        );
      default:
        return null;
    }
  };

  const renderOtpInput = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <Controller
        key={index}
        name={`otpInput.${index}`}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            maxLength="1"
            inputMode="numeric"
            pattern="[0-9]*"
            className="auth-input height-50 text-center numeral-mask mx-25 mb-1"
            autoFocus={index === 0}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow digits
              if (/^\d$/.test(value)) {
                field.onChange(value);
                const nextInput = document.querySelector(
                  `input[name="otpInput.${index + 1}"]`
                );
                if (nextInput) nextInput.focus();
              } else {
                // Clear invalid input
                field.onChange("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !field.value) {
                const prevInput = document.querySelector(
                  `input[name="otpInput.${index - 1}"]`
                );
                if (prevInput) {
                  prevInput.focus();
                  // Clear previous input manually
                  setTimeout(() => {
                    const event = new Event("input", { bubbles: true });
                    prevInput.value = "";
                    prevInput.dispatchEvent(event);
                  }, 0);
                }
              }
            }}
          />
        )}
      />
    ));
  };

  // ** Handle Complete
  const handleComplete = () => {
    if (!alreadyUpdatedRef.current) {
      alreadyUpdatedRef.current = true;
      setAttempt(attempt + 1);
    }
  };

  // ** Reset Timer
  const resetTimer = () => {
    alreadyUpdatedRef.current = false;
    const newTime = Date.now() + 40000;
    setTargetTime(newTime);
    setTimerKey((prev) => prev + 1);
  };
  // ** Call and Text Handlers
  // const onCall = async (token) => {
  //   await useJwt.resend_OtpCall(token);
  // };

  const onCall = async () => {
    const payloadForcall = {
      type: 1,
      slipId: slipIID,
      memberId: memberId,
    };
    await useJwt.resend_OtpCall(payloadForcall);
  };

  const onText = async () => {
    const payload = {
      type: 1,
      slipId: slipIID,
      memberId: memberId,
    };
    const { data } = await useJwt.GenerateOtp(payload);
    return data.content;
  };

  // ** handle Resend OTP
  const handleResendCall = async () => {
    {
      {
      }
    }
    try {
      if (attempt === 1) {
        const token = await onText();
        setTokenForCall(token);
        resetTimer();
      } else if (attempt === 2) {
        await onCall(tokenForCall);
        resetTimer();
      } else {
        alert("You have reached the maximum number of attempts.");
      }
    } catch (error) {
      console.log("Error in Resend OTP:", error);
    }
  };

  // ** Effect to reset timer
  useEffect(() => {
    setTargetTime(Date.now() + 40000);
  }, [timerKey]);

  // ** Action to handle OTP verification
  const handleVerifyOtp = async (data) => {
    seterrMsz("");

    try {
      if (!accessTokenotp) {
        console.log("Access token is missing. Please regenerate OTP.");
        return;
      }
      const rowotp = data.otpInput.join("");

      const encrypted = encryptAES(rowotp);

      setLoader(true);
      const response = await useJwt.verifyOTP(accessTokenotp, {
        otp: encrypted,
      });
      setVerify(true);
      console.log(response);
      setShow(false);
      setotpVerify(true);
      console.log("OTP Verified Successfully!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      console.log("Failed to verify OTP. Please try again.");

      if (error.response && error.response.data) {
        const { content } = error.response.data;

        seterrMsz((prev) => {
          const newMsz =
            content || "Un expected Error Occurred . Try Again Later ";
          return prev !== newMsz ? newMsz : prev + " ";
        });
      }
    } finally {
      setLoader(false);
    }
  };

  const handleOTP = async () => {
    try {
      const payload = {
        type: 1,
        slipId: slipIID,
        memberId: memberId,
      };
      setOtpLoader(true);
      const response = await useJwt.GenerateOtp(payload);
      const token = response.data.content;

      setAccessTokenOtp(token);
      setShow(true);
    } catch (error) {
      console.error("Error generating OTP:handleResendOTP ", error);
      console.log("Failed to generate OTP. Please try again.");
    } finally {
      setOtpLoader(false);
    }
  };

  return (
    <Fragment>
      <div>
        {verify || fetchDiscountFields ? (
          <React.Fragment>
            <Alert color="success">
              <div className="alert-body " style={{ marginTop: "-10px" }}>
                <span className="ms-1"> OTP Verified Successfully ! </span>
                <ThumbsUp size={15} />
              </div>
            </Alert>
          </React.Fragment>
        ) : (
          <Button
            color="primary"
            className=""
            size="sm"
            disabled={otpLoader}
            onClick={handleOTP}
          >
            {otpLoader ? (
              <BeatLoader size={10} color="#ffffff" />
            ) : (
              <>
                {" "}
                <Send className="me-1" size={15} />
                Generate otp
              </>
            )}
          </Button>
        )}
      </div>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered"
        size="sm"
      >
        <ModalBody className={"p-2"}>
          <Form onSubmit={handleSubmit(handleVerifyOtp)}>
            <Row>
              <Label style={{ fontSize: "2em" }} className=" text-center mb-1">
                Verify Otp
              </Label>
              <p
                className="text-center text-muted"
                style={{ fontSize: "1.1em" }}
              >
                You will receive an OTP via SMS on your registered mobile
                number.
              </p>
              {errMsz && (
                <React.Fragment>
                  <UncontrolledAlert color="danger">
                    <div className="alert-body">
                      <strong>Error : </strong>{" "}
                      <span className="text-danger fw-bold">{errMsz}</span>
                    </div>
                  </UncontrolledAlert>
                </React.Fragment>
              )}
              <Col sm="12 mb-2">
                <Label>Enter Otp</Label>
                <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                  {renderOtpInput(6)}
                </div>
              </Col>
            </Row>

            <Container>
              <ImageWrapper>
                <StyledImage src={watchSrc} alt="Phone Call" />
                {targetTime && (
                  <Countdown
                    key={timerKey}
                    date={targetTime}
                    onComplete={handleComplete}
                    renderer={renderer}
                  />
                )}
              </ImageWrapper>
            </Container>
            <Col sm="12 mt-2">
              <Button type="submit" disabled={loader} color="primary" block>
                {loader ? (
                  <>
                    {" "}
                    Loading... <Spinner color="white" size="sm" />{" "}
                  </>
                ) : (
                  "Verify OTP"
                )}{" "}
              </Button>
            </Col>
          </Form>
          <p className="text-center mt-2">
            <a
              onClick={(e) => {
                e.preventDefault();
                handleResendCall();
              }}
            >
              {renderLabel(attempt)}
            </a>{" "}
          </p>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default GenrateOtp;
