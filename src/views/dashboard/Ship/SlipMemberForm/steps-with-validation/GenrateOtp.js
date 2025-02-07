import React, { useEffect, useState, Fragment } from "react";
import useJwt from "@src/auth/jwt/useJwt";
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
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";

const GenrateOtp = ({ combinedData, buttonEnabled, setButtonEnabled }) => {
  // ** States
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(100);
  const [accessTokenotp, setAccessTokenOtp] = useState(""); // Store the token here
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const handleOTP = async () => {
    try {
      // const payload = {
      //   slipDetailId: combinedData.slipDetailId, // Ensure this is a number
      // };
      const response = await useJwt.GenerateOtp(payload); // Adjust this method to send the payload
      const token = response.data.content;
      setAccessTokenOtp(token);
      setShow(true);
      setTime(100);
    } catch (error) {
      console.error("Error generating OTP:", error);
      console.log("Failed to generate OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async (data) => {
    try {
      if (!accessTokenotp) {
        console.log("Access token is missing. Please regenerate OTP.");
        return;
      }

      const payload = { otp: data.Userotp };
      const response = await useJwt.verifyOTP(accessTokenotp, payload);

      // If verification is successful, enable the button
      console.log("OTP Verified Successfully!");
      setButtonEnabled(true);
      setShow(false); // Close the modal
    } catch (error) {
      console.error("Error verifying OTP:", error);
      console.log("Failed to verify OTP. Please try again.");
    }
  };

  // Timer Countdown
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
    return () => clearInterval(timer); // Cleanup on unmount
  }, [show]);

  return (
    <Fragment>
      {/* OTP Button */}
      <Button
        color="primary"
        onClick={handleOTP}
        disabled={buttonEnabled} // Disable after successful verification
      >
        {buttonEnabled ? "Verified" : "Generate OTP"}
      </Button>

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
          <Row
            tag="form"
            className="gy-1 gx-2 mt-75"
            onSubmit={handleSubmit(handleVerifyOTP)}
          >
            {/* OTP Input */}
            <Col xs={12}>
              <Label className="form-label" for="Userotp">
                Enter OTP
              </Label>
              <InputGroup>
                <Controller
                  name="Userotp"
                  id="Userotp"
                  control={control}
                  rules={{ required: "OTP is required" }}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter OTP"
                      invalid={errors.Userotp && true}
                      {...field}
                    />
                  )}
                />
                <FormFeedback>{errors.Userotp?.message}</FormFeedback>
              </InputGroup>
            </Col>

            {/* Timer & Resend Section */}
            <Col xs={12} className="text-center mt-2">
              <p>
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
              </p>
            </Col>

            {/* Submit Button */}
            <Col xs={12}>
              <Button type="submit" color="success" block>
                Verify OTP
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default GenrateOtp;
