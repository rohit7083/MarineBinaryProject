import React, { useEffect, useState, Fragment } from "react";
import useJwt from "@src/auth/jwt/useJwt";
import { Send } from "react-feather";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import Select from "react-select";

import {
  Spinner,
  UncontrolledAlert,
  InputGroupText,
  FormGroup,
} from "reactstrap";
import WatchNew from "../../../../src/assets/images/updatedWatchnew.jpg";

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
}) => {
  const [loading, setLoading] = useState(false);

  const [time, setTime] = useState(100);
  const [accessTokenotp, setAccessTokenOtp] = useState(""); // Store the token here
  const [countdownEndTime, setCountdownEndTime] = useState(Date.now() + 40000);
  const [errorMessage, setErrorMsz] = useState("");
const [errMsz,setErrMsz] = useState("");
  const discountTypeOptions = [
    { label: "Flat ($)", value: "Flat" },
    { label: "Percentage (%)", value: "Percentage" },
  ];
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm();

  const handleOTP = async () => {
    try {
      const payload = {
        type: 2,
        eventId: allEventData?.eventId,
        memberId: allEventData?.memberId,
        // eventId: 1,
        // memberId: 1,
      };
      console.log("payload", payload);

      const response = await useJwt.GenerateOtp(payload); // Adjust this method to send the payload
      if (response?.status == 200) {
        setCountdownEndTime(Date.now() + 40000);
      }

      const token = response?.data?.content;

      setAccessTokenOtp(token);
      setShowModal(true);
    } catch (error) {
      console.error("Error generating OTP:", error);

      if (error.response) {
        console.error("Error verifying OTP:", error);
        const errorMessage = error?.response?.data?.content;
        setErrMsz(errorMessage);
      }
    }
  }

    const onSubmit = async (data) => {
      setErrorMsz("");
      // setAttempt(0);
      setCountdownEndTime(0);
      // console.log(data);

      try {
        if (!accessTokenotp) {
          console.log("Access token is missing. Please regenerate OTP.");
          return;
        }

        const payload = {
          otp: Number(data.otp.join("")),
        };
        setLoading(true);
        // const response = await useJwt.verifyOtp(accessTokenotp, payload);
        // console.log(response);
      
        setVerify(true);
        setShowModal(false);
      } catch (error) {
        if (error.response) {
          console.error("Error verifying OTP:", error);

          const errorMessage = error?.response?.data?.content;
          setErrorMsz(errorMessage);
          // const otpAttempt = data.otpAttempts;

          //     setAttempt(otpAttempt);
          //     if (code === 423) {
          //       return MySwal.fire({
          //         title: "Blocked",
          //         text: "Your account has been blocked due to multiple invalid OTP attempts. Please contact the admin",
          //         icon: "warning",
          //         customClass: {
          //           confirmButton: "btn btn-primary",
          //         },
          //         buttonsStyling: false,
          //       }).then(() => {
          //         navigate("/Login");
          //       });
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

  const [attempt, setAttempt] = useState(0);

  const [resendcallCount, setResendcallCount] = useState(false);

  //   const handleResendOTP = async (e) => {
  //     // {{debugger}}
  //     e.preventDefault();
  //     try {
  //       const res = await useJwt.resend_Otp(accessTokenotp);
  //       if (res?.status == 200) {
  //         setCountdownEndTime(Date.now() + 40000);

  //         // setResendcount(true);
  //       }
  //       console.log("resentOTP", res.status);
  //     } catch (error) {
  //       console.log(error.response);
  //     } finally {
  //       //   setTimeout(() => {
  //       //     setResendcount(false);
  //       //   }, countdownEndTime);
  //     }
  //   };

  //   const handleResendCall = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const res = await useJwt.resend_OtpCall(accessTokenotp);
  //       if (res?.status == 200) {
  //         setCountdownEndTime(Date.now() + 40000);

  //         setResendcallCount(true);
  //       }
  //       console.log("resentCall", res);
  //     } catch (error) {
  //       console.log(error.response);
  //     } finally {
  //       // setTimeout(() => {
  //       //   setResendcallLoading(false);
  //       // }, 30000);
  //     }
  //   };
  const discountType = watch("discountType")?.value || "Flat";
  return (
    <Fragment>
      {/* {verify || cashOtpVerify ? ( */}
      {verify && (
        <React.Fragment>
          <Alert color="success">
            <div className="alert-body mb-2" style={{ marginTop: "10px" }}>
              <span className="ms-1">OTP Verified Successfully ! </span>
              <ThumbsUp size={15} />
            </div>
          </Alert>
        </React.Fragment>
      )}
      {/* ) : (  */}
      <>
        {!verify && (
          <Col md="12" className="mb-1">
            <Label className="form-label" for="hf-picker">
              Otp verification compulsory For the Discount{" "}
              <span style={{ color: "red" }}>*</span>
            </Label>
            <br />

            <Button color="primary" size="sm" outline onClick={handleOTP}>
              <Send className="me-1" size={20} />
              Generate otp
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
      </>
     

      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        className="modal-dialog-centered"
        style={{ width: "400px" }}
      >
        <div className="auth-inner ">
          <Card className="mb-0">
            <CardBody>
              <Form
                className="auth-reset-password-form mt-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* <Link
                className="brand-logo"
                to="/"
                onClick={(e) => e.preventDefault()}
              ></Link> */}

                <CardTitle tag="h2" className="fw-bolder mb-1">
                  Verify OTP 💬
                </CardTitle>
                <CardText className="mb-75">
                  We sent OTP to your Registered Mobile Number.Enter the code
                  from the Email in the field below.
                </CardText>
                <CardText className="fw-bolder mb-2"></CardText>
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
                  {/* {attempt < 3 && ( */}

                  <>
                    <div className="d-flex flex-column align-items-center position-relative">
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
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
                      <small className="text-danger">
                        {errors.otp.message}
                      </small>
                    )}
                  </>
                  {/* )} */}
                </div>
                <Button block type="submit" disabled={loading} color="primary">
                  {loading ? (
                    <>
                      Loading.. <Spinner size="sm" />
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </Form>

              {/* {attempt === 1 && ( */}
              {/* <div className="d-flex"> */}
              <p className="text-center mt-2">
                {/* {!resendCount && ( */}
                <>
                  {/* <span>Didn’t get the code?</span>{" "}
                      <a
                        href="#"
                        onClick={handleResendOTP}
                        className="text-blue-600  hover:underline"
                      >
                        Resend
                      </a> */}
                </>
                {/* )} */}
              </p>
              {/* )}  */}

              {/* {attempt === 2 && ( */}
              {/* <p className="text-center mt-2"> */}
              {/* {!resendcallCount && ( */}
              <>
                {/* <span className="mx-1">Or</span> */}
                {/* <span>Didn’t get the code?</span>{" "} */}
                {/* <a href="#" onClick={handleResendCall}> */}
                {/* Call us */}
                {/* </a> */}
              </>
              {/* )}   */}
              {/* </p> */}
              {/* </div> */}
              {/* )}  */}
            </CardBody>
          </Card>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Cash_otp;
