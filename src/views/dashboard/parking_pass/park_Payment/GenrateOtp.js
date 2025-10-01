import useJwt from "@src/auth/jwt/useJwt";
import React, { Fragment, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { Send } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { BeatLoader } from 'react-spinners';
import {
    Button, Col, FormFeedback, Input, InputGroup, Label, Modal, ModalBody,
    ModalHeader, Row, Spinner, UncontrolledAlert
} from "reactstrap";
import WatchNew from '../../../../assets/images/updatedWatchnew.jpg';

import { ThumbsUp } from "react-feather";
import { Alert } from "reactstrap";
const GenrateOtp = ({
  setotpVerify,
  memberId,
  slipIID,
  fetchDiscountFields,
}) => {
  // ** States
    const [countdownEndTime, setCountdownEndTime] = useState(Date.now() + 40000);
  
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(100);
  const [errMsz, seterrMsz] = useState("");
  const [loader, setLoader] = useState(false);
  const [accessTokenotp, setAccessTokenOtp] = useState(""); // Store the token here
  const [verify, setVerify] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);

  const {
    control,
    handleSubmit,
    setError,watch,setValue,
    formState: { errors },
  } = useForm();
   
  const handleOTP = async () => {
    try {
      const payload = {
        slipId: slipIID,
        memberId: memberId,
      };
      setOtpLoader(true);
      const response = await useJwt.GenerateOtp(payload); // Adjust this method to send the payload
      const token = response.data.content;
      if (response?.status == 200) {
        setCountdownEndTime(Date.now() + 40000);

      }
      setAccessTokenOtp(token);
      setShow(true);
      setTime(100);
    } catch (error) {
      console.error("Error generating OTP:", error);
      console.log("Failed to generate OTP. Please try again.");
    } finally {
      setOtpLoader(false);
    }
  };

  // {{ }}
  const handleVerifyOTP = async (data) => {
    seterrMsz("");

    try {
      if (!accessTokenotp) {
        console.log("Access token is missing. Please regenerate OTP.");
        return;
      }

       
      const payload = { otp: parseInt(data.Userotp) };
      setLoader(true);
      const response = await useJwt.verifyOTP(accessTokenotp, payload);
      setVerify(true);
      console.log(response);
      setShow(false);
      setotpVerify(true);
      console.log("OTP Verified Successfully!");
      // setButtonEnabled(true);
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

  useEffect(() => {
    let timer;
    if (show) {
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
    return () => clearInterval(timer);
  }, [show]);

const watchUserotp = watch("Userotp");

useEffect(()=>{

  const inputRestricted = watchUserotp?.replace(/[^0-9]/g, "");

  if (watchUserotp !== inputRestricted) {
    setValue("Userotp", inputRestricted, { shouldValidate: true }); // Update the value in the form
    
  }



},[watchUserotp,setValue])

  return (
    <Fragment>
      {verify || fetchDiscountFields ? (
        <React.Fragment>
          <Alert color="success">
            <div className="alert-body " style={{ marginTop: "-10px" }}>
              <span className="ms-1">OTP Verified Successfully ! </span>
              <ThumbsUp size={15} />
            </div>
          </Alert>
        </React.Fragment>
      ) : (
        <Button color="primary" size="sm" onClick={handleOTP}>
          {otpLoader ? (
           <BeatLoader size={10} color="#ffffff" />

          ) : (
            <>
              {" "}
              <Send className="me-1" size={20} />
              Generate otp
            </>
          )}
        </Button>
      )}

      {/* OTP Modal */}
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h1 className="text-center mb-1">Verify OTP</h1>

          {errMsz && (
            <React.Fragment>
              <UncontrolledAlert color="danger">
                <div className="alert-body">
                  <span className="text-danger fw-bold">{errMsz}</span>
                </div>
              </UncontrolledAlert>
            </React.Fragment>
          )}

          <Row
            tag="form"
            className="gy-1 gx-2 mt-75"
            onSubmit={handleSubmit(handleVerifyOTP)}
          >
            <Col xs={12}>
              <Label className="form-label" for="Userotp">
                Enter OTP
              </Label>
              <InputGroup>
                <Controller
                  name="Userotp"
                  id="Userotp"
                  control={control}
                  rules={{
                    required: "OTP is required",
                    maxLength: {
                      value: 6,
                      message: "OTP must be 6 digits",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="Enter OTP"
                      invalid={errors.Userotp && true}
                      {...field}
                    />
                  )}
                />
                <FormFeedback>{errors.Userotp?.message}</FormFeedback>
              </InputGroup>
            </Col>

            <Col xs={12} className="text-center mt-2">
              {/* <p>
                Time Remaining: {`${Math.floor(time / 60)}`.padStart(2, "0")}:
                {`${time % 60}`.padStart(2, "0")}
              </p>
              <p>
                Didn’t get the OTP?{" "}
                <a href="/" onClick={(e) => e.preventDefault()}>
                  Resend
                </a>{" "}
                or{" "}
                <a href="/" onClick={(e) => e.preventDefault()}>
                  Call us
                </a>
              </p> */}


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
            </Col>

            <Col xs={12}>
              <Button type="submit" color="success" block>
                {loader ? <Spinner color="white" size={12} /> : "Verify OTP"}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default GenrateOtp;
