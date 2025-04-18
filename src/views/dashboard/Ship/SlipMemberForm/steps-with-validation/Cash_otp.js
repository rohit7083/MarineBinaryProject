import React, { useEffect, useState, Fragment } from "react";
import useJwt from "@src/auth/jwt/useJwt";
import { Send } from "react-feather";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import { Spinner, UncontrolledAlert } from "reactstrap";

import {
  Row,
  Col,
  Modal,
  Label,
  Input,
  Button,
  ModalBody,
  ModalHeader,
  InputGroup,
  FormFeedback,
  CardTitle,
  Card,
  CardBody,
  CardText,
  Form,
} from "reactstrap";
import { useForm, Controller, set } from "react-hook-form";

import { Alert } from "reactstrap";
import { ThumbsUp } from "react-feather";
const Cash_otp = ({
  setotpVerify,
  memberId,
  slipIID,
  showModal,
  setShowModal,
  totalPayment,
  cashOtpVerify,
}) => {
  // ** States
  const [loading, setLoading] = useState(false);

  const [time, setTime] = useState(100);
  const [accessTokenotp, setAccessTokenOtp] = useState(""); // Store the token here
  const [verify, setVerify] = useState(false);
  const [countdownEndTime, setCountdownEndTime] = useState(Date.now() + 40000);
  const [errorMessage, setErrorMsz] = useState("");
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  // {{debugger}}
  const handleOTP = async () => {
    // {{debugger}}
    try {
      const payload = {
        slipId: slipIID,
        memberId: memberId,
        finalPayment: totalPayment,
      };
      const response = await useJwt.otpForCash(payload); // Adjust this method to send the payload
      if (response?.status == 200) {
        setCountdownEndTime(Date.now() + 40000);
      }
      // {{debugger}}
      const token = response?.data?.content;
      console.log("response from cash otp", response);

      setAccessTokenOtp(token);
      setShowModal(true);
      setTime(100);
    } catch (error) {
      console.error("Error generating OTP:", error);
      console.log("Failed to generate OTP. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    setErrorMsz("");
    // {{debugger}}
    console.log(data);

    try {
      if (!accessTokenotp) {
        console.log("Access token is missing. Please regenerate OTP.");
        return;
      }

      //   {{debugger}}
      const payload = {
        cashOtp: Number(data.otp.join("")),
      };
      setLoading(true);
      const response = await useJwt.verifyCash(accessTokenotp, payload);
      setVerify(true);
      setShowModal(false);
      setotpVerify(true);
      console.log("OTP Verified Successfully!");
      //   return MySwal.fire({
      //     title: "Successfully Verified",
      //     text: " Your OTP is Verified Successfull",
      //     icon: "success",
      //     customClass: {
      //       confirmButton: "btn btn-primary",
      //     },
      //     buttonsStyling: false,
      //   }).then(() => {
      //     if (Object.keys(errors).length === 0) {
      //       stepper.next();
      //     }
      //   });
    } catch (error) {
      if (error.response) {
        console.error("Error verifying OTP:", error);

        const errorMessage = error?.response?.data?.content;
        setErrorMsz(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Timer Countdown
  useEffect(() => {
    let timer;
    if (showModal) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup on unmount
  }, [showModal]);

  return (
    <Fragment>
      {verify || cashOtpVerify ? (
        <React.Fragment>
          <Alert color="success">
            <div className="alert-body " style={{ marginTop: "10px" }}>
              <span className="ms-1">OTP Verified Successfully ! </span>
              <ThumbsUp size={15} />
            </div>
          </Alert>
        </React.Fragment>
      ) : (
        <>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="hf-picker">
              Otp verification compulsory For the Cash Payment{" "}
              <span style={{ color: "red" }}>*</span>
            </Label>
            <br />

            <Button color="primary" outline onClick={handleOTP}>
              <Send className="me-1" size={20} />
              Generate otp
            </Button>
          </Col>
        </>
      )}

      {/* OTP Modal */}
      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        className="modal-dialog-centered"
      >
        <div className="auth-inner my-2">
          <Card className="mb-0">
            <CardBody>
              {/* <Link
                className="brand-logo"
                to="/"
                onClick={(e) => e.preventDefault()}
              ></Link> */}

              <CardTitle tag="h2" className="fw-bolder mb-1">
                Verify OTP 💬
              </CardTitle>
              <CardText className="mb-75">
                We sent OTP to your Registered Mobile Number.Enter the code from
                the Email in the field below.
              </CardText>
              <CardText className="fw-bolder mb-2"></CardText>
              <Form
                className="auth-reset-password-form mt-2"
                onSubmit={handleSubmit(onSubmit)}
              >
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
                <div className="mb-2">
                  <h6>Type your 6-digit security code</h6>
                  <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                    {[...Array(6)].map((_, index) => (
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

                  <div className="d-flex flex-column align-items-center position-relative">
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <img
                        src="/src/assets/images/updatedWatchnew.jpg"
                        alt="Phone Call"
                        style={{
                          width: "120px",
                          height: "100px",
                          display: "block",
                        }}
                      />

                      <Countdown
                        key={countdownEndTime} // resets the countdown on update
                        date={countdownEndTime}
                        // onComplete={() => setResendLoading(false)} // re-enable the button
                        renderer={({ minutes, seconds }) => (
                          <span
                            className="position-absolute top-50 start-50 translate-middle"
                            style={{
                              marginTop: "-4px",
                              fontSize: "14px",
                              fontWeight: "bold",
                              color: "White",
                            }}
                          >
                            {String(minutes).padStart(2, "0")}:
                            {String(seconds).padStart(2, "0")}
                          </span>
                        )}
                      />
                    </div>
                  </div>

                  {errors.otp && (
                    <small className="text-danger">{errors.otp.message}</small>
                  )}
                </div>
                <Button block type="submit" color="primary">
                  {loading ? (
                    <>
                      Loading.. <Spinner size="sm" />
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </Form>

              <p className="text-center mt-2">
                <span>Didn’t get the code?</span>{" "}
                {/* <a href="" onClick={handleResendOTP}> */}
                <a href="">Resend</a> <span>or</span>{" "}
                {/* <a href="/" onClick={handleResendCall}> */}
                <a href="/">Call us</a>
              </p>
            </CardBody>
          </Card>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Cash_otp;
