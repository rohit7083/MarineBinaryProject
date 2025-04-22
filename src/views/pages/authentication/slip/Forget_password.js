// ** React Imports
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React from "react";
// ** Icons Imports
import { ChevronLeft } from "react-feather";
import useJwt from "@src/auth/jwt/useJwt";
import { Spinner } from "reactstrap";
// ** React Hook Form
import { UncontrolledAlert, ListGroupItem } from "reactstrap";

import { useForm, Controller, set } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Reactstrap Imports
import {
  Card,
  Input,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Label,
  Button,
} from "reactstrap";

// ** Custom Components
import InputPassword from "@components/input-password-toggle";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { PulseLoader } from "react-spinners";
import Countdown from "react-countdown";

const ResetPasswordBasic = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [msz, setMsz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expireTokenLoader, setExpireTokenLoader] = useState(true);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [resendCount, setResendcount] = useState(false);
  const [resendcallCount, setResendcallCount] = useState(false);
  const [encryptedPasss, setEncrypt] = useState(null);
  const [countdownEndTime, setCountdownEndTime] = useState(Date.now() + 40000);
  const [attempt, setAttempt] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (pwd) => {
    setRequirements({
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      specialChar: /[^A-Za-z\d]/.test(pwd), // Detects special characters
    });
  };

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

  const handlePass = watch("password") || "";
  const handleConfirm = watch("confirmPassword");
  const handleOtp = watch("otp");
  console.log("handleOtp", handleOtp);

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await useJwt.resend_Otp(token);
      if (res?.status == 200) {
        setCountdownEndTime(Date.now() + 40000);

        setResendcount(true);
      }
      console.log("resentOTP", res.status);
    } catch (error) {
      console.log(error.response);
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
      console.log("resentCall", res);
    } catch (error) {
      console.log(error.response);
    } finally {
      // setTimeout(() => {
      //   setResendcallLoading(false);
      // }, 30000);
    }
  };

  const sendOtp = async () => {
    try {
      // {{debugger}}
      const otpRes = await useJwt.sendOtp(token);
    } catch (error) {
      console.log(error);
      console.log("failed to get otp");
    }
  };

  const checkTokenExpirey = async () => {
    // {{debugger}}
    try {
      const res = await useJwt.checktoken(token);
      const tokenStatus = res?.data?.content?.token;
      if (tokenStatus == "true") {
        navigate("/token-expire");
      } else {
        sendOtp();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setExpireTokenLoader(false);
    }
  };

  useEffect(() => {
    checkTokenExpirey();
  }, []);

  const onSubmit = async (data) => {
    console.log(data);

    setMsz("");

    setAttempt(0);
    setCountdownEndTime(0);
    console.log("Form Data:", data);
    // const otpString = data.otp.join("");
    // const otp = parseInt(otpString, 10);

    try {
      setLoading(true);

      const res = await useJwt.createPass(token, {
        otp: encryptedPasss?.otp,
        password: encryptedPasss?.password,
        confirmPassword: encryptedPasss?.confirmPassword,
      });


      if (res.status == 200 || res.status == 201) {
        return MySwal.fire({
          title: "Successfully ",
          text: "Successfully Rest Password",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          navigate("/Login");
        });
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        const { status, data } = error.response;
        const otpAttempt = data.otpAttempts;
        const blockMsz = data?.content;
        const code = data?.code;

        setMsz(blockMsz);
        setAttempt(otpAttempt);
        if (code === 423) {
          return  MySwal.fire({
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
      setLoading(false);
    }
  };

  useEffect(() => {
    // setPassword(handlePass);
    validatePassword(handlePass);

    if (handlePass && handleConfirm && handleOtp) {
      const encryptedOTp = encryptAES(handleOtp.join(""));
      const encrypted = encryptAES(handlePass);
      const encryptedConfirm = encryptAES(handleConfirm);

      setEncrypt({
        otp: encryptedOTp,
        password: encrypted,
        confirmPassword: encryptedConfirm,
      });
    }
  }, [handlePass, handleOtp, handleConfirm]);

  // const returnBlockMsz = async () => {
  //   if (attempt > 3) {
  //     await MySwal.fire({
  //       title: "Blocked",
  //       text: "Your account has been blocked due to multiple invalid OTP attempts. Please contact the admin.",
  //       icon: "error",
  //       customClass: {
  //         confirmButton: "btn btn-primary",
  //       },
  //       buttonsStyling: false,
  //     }).then(() => {
  //       navigate("/Login");
  //     });
  //   }
  // };

  // useEffect(() => {
  //   returnBlockMsz();
  // }, [attempt]);

  if (expireTokenLoader) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4rem",
        }}
      >
        <Spinner
          color="primary"
          style={{
            height: "5rem",
            width: "5rem",
          }}
        />
      </div>
    );
  }

  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          <CardBody>
            <Link
                        to="/"
                        onClick={(e) => e.preventDefault()}
                        className="mb-4 d-flex flex-row  align-items-center justify-content-center text-decoration-none"
                      >
                        <img
                          src="src/assets/images/marinaLOGO.png"
                          alt="Longcove Marina Logo"
                          width={55}
                          height={55}
                          className="mx-2"
                        />
                        <h2 className="text-primary mt-1  "style={{ fontWeight: 'bold' }}>Longcove Marina</h2>
                      </Link>

            <CardTitle tag="h4" className="mb-1">
              Reset Password 🔒
            </CardTitle>
            <CardText className="mb-2">
              Your new password must be different from previously used passwords
            </CardText>
            {msz && (
                  <React.Fragment>
                    <UncontrolledAlert color="danger">
                      <div className="alert-body">
                        <span className="text-danger fw-bold">
                          <strong>Error : </strong>
                        {msz}</span>
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
                            console.log("Value", value);

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
              {attempt < 3 && (
                <>
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

              <Button color="primary" className="mt-2" disabled={loading} block type="submit">
                {loading ? (
                  <>
                    {" "}
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

export default ResetPasswordBasic;

// <p className="text-center mt-2">
// <span>Didn’t get the code?</span>{" "}
// <a href="#" onClick={handleResendOTP}>
//   {resendLoading ? (
//     <>
//       {/* <Countdown date={Date.now() + 100000} /> */}
//       <Countdown
//         style={{ pointerEvents: "none", userSelect: "none" }}
//         date={Date.now() + 30000} // 30 seconds countdown
//         renderer={({ minutes, seconds }) => (
//           <span
//             style={{
//               pointerEvents: "none",
//               userSelect: "none",
//               fontSize: "24px",
//               fontWeight: "bold",
//             }}
//           >{`${String(minutes).padStart(2, "0")}:${String(
//             seconds
//           ).padStart(2, "0")}`}</span>
//         )}
//       />
//     </>
//   ) : (
//     "Resend"
//   )}
// </a>{" "}
// <span>or</span>{" "}
// <a href="#" onClick={handleResendCall}>
// {  resendcallLoading? (
//     <>
//       {/* <Countdown date={Date.now() + 100000} /> */}
//       {/* <Countdown
//         style={{ pointerEvents: "none", userSelect: "none" }}
//         date={Date.now() + 30000} // 30 seconds countdown
//         renderer={({ minutes, seconds }) => (
//           <span
//             style={{
//               pointerEvents: "none",
//               userSelect: "none",
//               fontSize: "24px",
//               fontWeight: "bold",
//             }}
//           >{`${String(minutes).padStart(2, "0")}:${String(
//             seconds
//           ).padStart(2, "0")}`}</span>
//         )}
//       /> */}
//       <img
//      className="d-flex justify-content-center align-items-center"
//         src=" /src/assets/images/clock.jpg"
//         alt="Phone Call"
//         style={{ width: "100px", height: "80px",display:'block' }}/>
//         {/* <Countdown
// date={Date.now() + 30000} // 30 seconds countdown
// renderer={({ minutes, seconds }) => (
// <span
// style={{
// position: "absolute",
// top: "40%",
// left: "50%",
// transform: "translate(-50%, -50%)",
// fontSize: "14px",
// fontWeight: "bold",
// color: "white",
// padding: "10px 20px",
// borderRadius: "10px",
// }}
// >
// {`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
// </span>
// )}
// /> */}
//     </>
//   ) : (
//     "Call us"
//   )}
// </a>
// </p>
