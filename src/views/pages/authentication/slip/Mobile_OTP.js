// ** React Imports
import CryptoJS from "crypto-js";
import { useLocation } from "react-router-dom";

import React from "react";
import { ChevronLeft } from "react-feather";
import {
  Button, Card,
  CardBody, CardText, CardTitle, Col, Form, Input, Label, Row, Spinner, UncontrolledAlert
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import useJwt from "@src/auth/jwt/useJwt";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

// ** Actions
import { handleLogin } from "@store/authentication";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";
import { useDispatch } from "react-redux";

// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import MARinLogo from "./../../../../../src/assets/images/marinaLOGO.png";

const TwoStepsBasic = () => {
  const MySwal = withReactContent(Swal);
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch(); // Define dispatch
  const [resendLoading, setResendLoading] = useState(false);
  const [resendLoading2, setResendLoading2] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // ** React Hook Form Setup
  const [loading, setLoading] = useState(false);
   
  const userData = location.state?.userData;
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // const { uid: token } = useParams();
  const token = userData?.token;
  const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";

  function generateKey(secretKey) {
    return CryptoJS.SHA256(secretKey); // Ensures full 32-byte key
  }

  function generateIV() {
    return CryptoJS.lib.WordArray.random(16); // 16-byte IV
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

    return CryptoJS.enc.Base64.stringify(combined); // Send as Base64
  }

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      setResendLoading(true);

      const res = await useJwt.resend_Otp(token);
      console.log("resentOTP", res);
      toast.success("OTP sent successfully", {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (error) {
      console.log(error.response);
    } finally {
      setResendLoading(false);
    }
  };

  const handleResendCall = async (e) => {
    e.preventDefault();
    try {
      setResendLoading2(true);

      const callRes = await useJwt.resend_OtpCall(token);
      console.log("resentCall", callRes);
      toast.success("Call Verification Send Sucessfully", {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (error) {
      console.log(error.response);
    } finally {
      setResendLoading2(false);
    }
  };

  const onSubmit = async (otpData) => {
    setMessage("");
    try {
      setLoading(true);

      const token = userData?.token;
      // const otpString = formData.otp.join("");
      // const otp = parseInt(otpString, 10);
      const otp = encryptAES(otpData?.otp.join(""));

      const res = await useJwt.mobileOtp(token, { otp });
      console.log(res);

      const data = {
        ...{
          ...res.data.profile,
          ability: [
            {
              action: "manage",
              subject: "all",
            },
          ],
        },
        accessToken: res.data.access,
        refreshToken: res.data.refresh,
      };
      dispatch(handleLogin(data));
      ability.update([
        {
          action: "manage",
          subject: "all",
        },
      ]);
      navigate(getHomeRouteForLoggedInUser("admin"));
    } catch (error) {
      console.log({ error });
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data.message;

        setMessage(errorMessage);

        switch (status) {
          case 500:
            setMessage(
              <span style={{ color: "red" }}>
                Something went wrong on our end. Please try again later
              </span>
            );
            break;
          default:
            setMessage(errorMessage);
        }
      }
    } finally {
      setLoading(false); // Set loading to false after API call is complete
    }
  };

  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          <CardBody>
           
          <Link
                        to="/"
                        onClick={(e) => e.preventDefault()}
                        className=" d-flex flex-row  align-items-center justify-content-center text-decoration-none"
                      >
                        <img
                          src={MARinLogo}
                          alt="Longcove Marina Logo"
                          width={55}
                          height={55}
                          className="mx-2"
                        />
                        <h2 className="text-primary mt-1  "style={{ fontWeight: 'bold' }}>MarinaOne</h2>
                      </Link>

            <Row className="mb-1">
              <Label sm="3" for=""></Label>
              <Col sm="12">
                {message && (
                  <React.Fragment>
                    <UncontrolledAlert color="danger">
                      <div className="alert-body">
                        <span className="text-danger fw-bold">{message}</span>
                      </div>
                    </UncontrolledAlert>
                  </React.Fragment>
                )}
              </Col>
            </Row>

            <CardTitle tag="h2" className="fw-bolder mb-1">
              Verify OTP For Login 💬
            </CardTitle>
            <CardText className="mb-75">
            We have sent an OTP to your <strong>Google Authenticator app</strong> . Please enter the code from your mobile device in the field below
            </CardText>
            <CardText className="fw-bolder mb-2"></CardText>
            <Form
              className="auth-reset-password-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
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

                {errors.otp && (
                  <small className="text-danger">{errors.otp.message}</small>
                )}
              </div>
              <Button block type="submit" disabled={loading} color="primary">
                <div className="d-flex justify-content-center align-items-center">
                  {loading ? (
                    <div className="d-flex align-items-center">
                      Loading.. <Spinner size="sm" className="mx-1" />
                    </div>
                  ) : (
                    "Login"
                  )}
                </div>
              </Button>
            </Form>

            {/* <p className="text-center mt-2">
              <span>Didn’t get the code?</span>{" "}
              <a href="" onClick={handleResendOTP}>
                {resendLoading ? (
                  <>
                    {" "}
                    <PulseLoader size={5} />
                  </>
                ) : (
                  "Resend"
                )}
              </a>{" "}
              <span>or</span>{" "}
              <a href="/" onClick={handleResendCall}>
                {resendLoading2 ? (
                  <>
                    <PulseLoader size={5} />
                    </>
                ) : (
                  "Call Us"
                )}
              </a>
            </p> */}
             <p className="text-center mt-2">
                            <Link to="/Login">
                              <ChevronLeft className="rotate-rtl me-25" size={14} />
                              <span className="align-middle">Back to login</span>
                            </Link>
                          </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TwoStepsBasic;
