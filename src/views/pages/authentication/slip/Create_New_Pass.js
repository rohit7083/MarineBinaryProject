// ** React Imports
import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
// ** Icons Imports
import useJwt from "@src/auth/jwt/useJwt";
import { ChevronLeft } from "react-feather";
import { Spinner } from "reactstrap";
// ** React Hook Form
import Countdown from "react-countdown";
import { ListGroupItem, UncontrolledAlert } from "reactstrap";

import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Reactstrap Imports
import MARinLogo from "../../../../assets/images/logo/product-logo.png";

import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Input,
  Label,
} from "reactstrap";

// ** Custom Components
import InputPassword from "@components/input-password-toggle";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import WatchNew from "../../../../../src/assets/images/updatedWatchnew.jpg";
const CreateNewPass = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [msz, setMsz] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const location = useLocation();
  const [encryptedPasss, setEncrypt] = useState(null);
  const [password, setPassword] = useState("");
  const [errorMsz, setErrorMsz] = useState("");
  const [resendCount, setResendcount] = useState(false);
  const [resendcallCount, setResendcallCount] = useState(false);

  const [countdownEndTime, setCountdownEndTime] = useState(Date.now() + 40000);
  const [attempt, setAttempt] = useState(0);

  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await useJwt.resend_Otp(token);
      if (res?.status == 200) {
        setCountdownEndTime(Date.now() + 40000);

        setResendcount(true);
      }
      "resentOTP", res.status;
    } catch (error) {
      error.response;
    } finally {
      //   setTimeout(() => {
      //     setResendcount(false);
      //   }, countdownEndTime);
    }
  };

  const handleResendCall = async (e) => {
    e.preventDefault();
    try {
      const res = await useJwt.resend_OtpCall(token);
      if (res?.status == 200) {
        setCountdownEndTime(Date.now() + 40000);

        setResendcallCount(true);
      }
      "resentCall", res;
    } catch (error) {
      error.response;
    } finally {
      // setTimeout(() => {
      //   setResendcallLoading(false);
      // }, 30000);
    }
  };

  const validatePassword = (pwd) => {
    setRequirements({
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      specialChar: /[^A-Za-z\d]/.test(pwd), // Detects special characters
    });
  };

  const token = location.state?.userData?.token;
  const userData = location.state?.userData;
  // const authStatus=location.state?.userData?.TwoNf;

  const onchnagePass = watch("password") || "";

  useEffect(() => {
    setPassword(onchnagePass);

    validatePassword(onchnagePass);
  }, [onchnagePass]);

  // const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

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

  const handleOtp = (watch("otp") || []).join("");
  const confirmPassword = watch("confirmPassword");
  const previousPassword = watch("previousPassword");

  const onSubmit = async (data) => {
   
    setCountdownEndTime(0);
    setAttempt(0);
    setErrorMsz("");

    const otpString = data.otp.join("");
    const otp = parseInt(otpString, 10);

    try {
      setLoading(true);

      const otp = data.otp.join("");
      const password = data.password;
      const confirmPassword = data.confirmPassword;
      const previousPassword = data.previousPassword;

      const payload = {
        otp: encryptAES(otp),
        password: encryptAES(password),
        confirmPassword: encryptAES(confirmPassword),
        previousPassword: encryptAES(previousPassword),
      };

      const res = await useJwt.chnagePassword(token, payload);

      if (res.status == 200 || res.status == 201) {
        toast.current.show({
          severity: "success",
          summary: "Successfully",
          detail: " Successfully Rest Password",
          life: 2000,
        });
        setTimeout(() => {
          navigate("/Login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data.content;
        const otpAttempt = data.otpAttempts;
        const code = data?.code;

        "errormsx", errorMessage;
        setErrorMsz(errorMessage);

        setAttempt(otpAttempt);
        if (code === 423) {
          return MySwal.fire({
            title: "Blocked",
            text: "Your account has been blocked due to multiple invalid OTP attempts. Please contact the admin",
            icon: "warning",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          }).then(() => {
            navigate("/Login");
          });
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
          <Toast ref={toast} />

          <CardBody>
            <Link
              to="/"
              onClick={(e) => e.preventDefault()}
              className="mb-4 d-flex flex-row  align-items-center justify-content-center text-decoration-none"
            >
              <img
                src={MARinLogo}
                alt="MarinaOne Logo"
                style={{
                  height: "5rem",
                  width: "auto",
                  marginBottom: "0px",
                  marginTop: "0px",
                }}
              />
              <h2
                className="text-primary mt-1  "
                style={{ fontWeight: "bold" }}
              >
                MarinaOne
              </h2>
            </Link>

            <CardTitle tag="h4" className="mb-1">
              Create New Password 🔒
            </CardTitle>
            <CardText className="mb-2">
              Your new password must be different from previously used passwords
            </CardText>

            {errorMsz && (
              <React.Fragment>
                <UncontrolledAlert color="danger">
                  <div className="alert-body">
                    <span className="text-danger fw-bold">
                      <strong>Error : </strong>
                      {errorMsz}
                    </span>
                  </div>
                </UncontrolledAlert>
              </React.Fragment>
            )}

            <form
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
                                `otp-input-${index + 1}`,
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
                                `otp-input-${index - 1}`,
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

              {attempt < 3 && (
                <>
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
                </>
              )}
              {attempt === 1 && (
                <p className="text-center mt-2">
                  {!resendCount && (
                    <>
                      <span>Didn’t get the code?</span>{" "}
                      <a
                        href="#"
                        onClick={handleResendOTP}
                        className="text-blue-600 hover:underline"
                      >
                        Resend
                      </a>
                    </>
                  )}
                </p>
              )}

              {attempt === 2 && (
                <p className="text-center mt-2">
                  {!resendcallCount && (
                    <>
                      <span>Didn’t get the code?</span>{" "}
                      <a href="#" onClick={handleResendCall}>
                        Call us
                      </a>
                    </>
                  )}
                </p>
              )}

              <div className="mb-1 mt-2">
                <Label className="form-label" for="new-password">
                  Previous Password
                </Label>
                <Controller
                  name="previousPassword"
                  control={control}
                  rules={{
                    required: "Previous passowrd is required",
                    minLength: {
                      value: 12,
                      message:
                        "Previous Password must be at least 12 characters",
                    },
                  }}
                  render={({ field }) => (
                    <InputPassword
                      {...field}
                      className="input-group-merge"
                      autoFocus
                    />
                  )}
                />
                {errors.previousPassword && (
                  <small className="text-danger">
                    {errors.previousPassword.message}
                  </small>
                )}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="new-password">
                  New Password
                </Label>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "New password is required",
                    minLength: {
                      value: 12,
                      message: "Password must be at least 12 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{12,}$/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and no special characters",
                    },
                  }}
                  render={({ field }) => (
                    <InputPassword
                      {...field}
                      className="input-group-merge"
                      autoFocus
                    />
                  )}
                />
                {errors.password && (
                  <small className="text-danger">
                    {errors.password.message}
                  </small>
                )}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="confirm-password">
                  Confirm Password
                </Label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <InputPassword
                      {...field}
                      id="confirm-password"
                      className="input-group-merge"
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <small className="text-danger">
                    {errors.confirmPassword.message}
                  </small>
                )}
              </div>

              <CardTitle tag="h5" className="mb-1 mt-2">
                New Password Requirement
              </CardTitle>

              <ListGroupItem
                className={requirements.length ? "text-success" : "text-danger"}
              >
                {requirements.length ? "✅" : "❌"} At least 12 characters
              </ListGroupItem>
              <ListGroupItem
                className={
                  requirements.uppercase ? "text-success" : "text-danger"
                }
              >
                {requirements.uppercase ? "✅" : "❌"} At least one uppercase
                letter
              </ListGroupItem>
              <ListGroupItem
                className={
                  requirements.lowercase ? "text-success" : "text-danger"
                }
              >
                {requirements.lowercase ? "✅" : "❌"} At least one lowercase
                letter
              </ListGroupItem>
              <ListGroupItem
                className={requirements.number ? "text-success" : "text-danger"}
              >
                {requirements.number ? "✅" : "❌"} At least one number
              </ListGroupItem>
              <ListGroupItem
                className={
                  !requirements.specialChar ? "text-success" : "text-danger"
                }
              >
                {!requirements.specialChar ? "✅" : "❌"} No special characters
                allowed
              </ListGroupItem>

              <Button
                color="primary"
                block
                type="submit"
                disabled={loading}
                className="mt-2"
              >
                {loading ? (
                  <>
                    Loading.. <Spinner size="sm" />{" "}
                  </>
                ) : (
                  "Set New Password"
                )}
              </Button>
            </form>

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

export default CreateNewPass;
