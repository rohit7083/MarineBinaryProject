// ** React Imports
import React, { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// ** Icons Imports
import useJwt from "@src/auth/jwt/useJwt";
import { ChevronLeft } from "react-feather";
import { Label, Spinner } from "reactstrap";
// ** React Hook Form
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";
import { ListGroupItem, UncontrolledAlert } from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Reactstrap Imports
import MARinLogo from "../../../../assets/images/logo/LT.png";

import { Button, Card, CardBody, CardText, CardTitle, Input } from "reactstrap";

// ** Custom Components

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";

const Create_Pin = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [msz, setMsz] = useState(null);
  //   const [loading, setLoading] = useState(false);
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
  const [key, setKey] = useState(1);

  const alreadyUpdatedRef = useRef(false);

  const [requirements, setRequirements] = useState({
    ascendingNum: false,
    decendingNum: false,
    repeatNum: false,
  });
  const toast = useRef(null);

  const validatePassword = (pwd) => {
    setRequirements({
      noAscending: !/(0123|1234|2345|3456|4567|5678|6789)/.test(pwd),
      noDescending: !/(9876|8765|7654|6543|5432|4321|3210)/.test(pwd),
      noRepeatingNumbers: !/^(.)\1{3}$/.test(pwd)
       
     
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

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await useJwt.resend_Otp(token);
      setKey((k) => k + 1);
      alreadyUpdatedRef.current = false;
      if (res?.status == 200) {
        // setCountdownEndTime(Date.now() + 40000);

        setResendcount(true);
      }
      console.log("resentOTP", res.status);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleResendCall = async (e) => {
    e.preventDefault();
    try {
      setKey((k) => k + 1);
      alreadyUpdatedRef.current = false;
      const res = await useJwt.resend_OtpCall(token);
      if (res?.status == 200) {
        // setCountdownEndTime(Date.now() + 40000);

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
      const otpRes = await useJwt.sendOtp(token);
    } catch (error) {
      console.error(error);
      console.log("failed to get otp");
    }
  };

  const checkTokenExpirey = async () => {
    try {
      const res = await useJwt.checktoken(token);
      const tokenStatus = res?.data?.content?.token;
      if (tokenStatus == "true") {
        navigate("/token-expire");
      } else {
        sendOtp();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setExpireTokenLoader(false);
    }
  };

  useEffect(() => {
    checkTokenExpirey();
  }, []);

  const onSubmit = async (data) => {
    setMsz("");

    setAttempt(0);
    setCountdownEndTime(0);
    console.log("Form Data:", data);
    // const otpString = data.otp.join("");
    // const otp = parseInt(otpString, 10);

    try {
      //   setLoading(true);

      const res = await useJwt.createPass(token, {
        otp: encryptedPasss?.otp,
        password: encryptedPasss?.password,
        confirmPassword: encryptedPasss?.confirmPassword,
      });

      if (res.status == 200 || res.status == 201) {
        toast.current.show({
          severity: "success",
          summary: " Successfully",
          detail: "Successfully Rest Password",
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
        const otpAttempt = data.otpAttempts;
        const blockMsz = data?.content;
        const code = data?.code;

        setMsz(blockMsz);
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
      //   setLoading(false);
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

  useEffect(() => {
    console.log("render");
    console.log({ attempt });
  }, [attempt]);

//   if (expireTokenLoader) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           marginTop: "4rem",
//         }}
//       >
//         <Spinner
//           color="primary"
//           style={{
//             height: "5rem",
//             width: "5rem",
//           }}
//         />
//       </div>
//     );
//   }

  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          <CardBody>
            <Toast ref={toast} />

            <Link
              to="/"
              onClick={(e) => e.preventDefault()}
              className="mb-2 d-flex flex-row  align-items-center justify-content-center text-decoration-none"
            >
              <img
                src={MARinLogo}
                alt="MarinaOne Logo"
                width={55}
                height={55}
                className="mx-2"
              />
              <h2
                className="text-primary mt-1  "
                style={{ fontWeight: "bold" }}
              >
                MarinaOne
              </h2>
            </Link>

            <CardTitle tag="h4" className="mb-1 text-center">
              Create Pin 🔒
            </CardTitle>
            <CardText className="mb-2 text-center">
              Your new Pin must be different from previously used Pin
            </CardText>
            {msz && (
              <React.Fragment>
                <UncontrolledAlert color="danger">
                  <div className="alert-body">
                    <span className="text-danger fw-bold">
                      <strong>Error : </strong>
                      {msz}
                    </span>
                  </div>
                </UncontrolledAlert>
              </React.Fragment>
            )}
            <form
              className="auth-reset-password-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* <div className="d-flex flex-column align-items-center justify-content-center"> */}
              <div className="text-center">
                <Label className="">Enter Previous Pin</Label>

                <div className="auth-input-wrapper d-flex align-items-center justify-content-center">
                  {[...Array(4)].map((_, index) => (
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
                            field.onChange(e);
                            if (value && index < 3) {
                              const nextInput = document.getElementById(
                                `otp-input-${index + 1}`
                              );
                              nextInput?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !field.value &&
                              index > 0
                            ) {
                              const prevInput = document.getElementById(
                                `otp-input-${index - 1}`
                              );
                              prevInput?.focus();
                            }
                          }}
                          id={`otp-input-${index}`}
                        />
                      )}
                    />
                  ))}
                </div>

                {errors.otp && (
                  <small className="text-danger">{errors.otp.message}</small>
                )}
              </div>
              {/* </div> */}

              {/* <div className="d-flex flex-column align-items-center justify-content-center"> */}

              <div className="text-center">
                <Label>Enter New Pin</Label>
                <div className="auth-input-wrapper d-flex align-items-center justify-content-center">
                  {[...Array(4)].map((_, index) => (
                    <Controller
                      key={index}
                      name={`newPin[${index}]`}
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
              {/* </div> */}

              <div className="text-center">
                <Label>Enter Confirm Pin </Label>
                <div className="auth-input-wrapper d-flex align-items-center justify-content-center">
                  {[...Array(4)].map((_, index) => (
                    <Controller
                      key={index}
                      name={`confimPin[${index}]`}
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

              {/* {attempt < 3 && (
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
                        key={key}
                        date={Date.now() + 40000}
                        renderer={({ minutes, seconds, completed }) => {
                          if (completed) {
                            if (!alreadyUpdatedRef.current) {
                              alreadyUpdatedRef.current = true;
                              setAttempt((x) => x + 1);
                            }
                            return (
                              <span
                                className="position-absolute top-50 start-50 translate-middle"
                                style={{
                                  marginTop: "-4px",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  color: "White",
                                }}
                              >
                                00:00
                              </span>
                            );
                          } else {
                            // Reset flag when it's not completed
                            alreadyUpdatedRef.current = false;
                            return (
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
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                </>
              )} */}
              {/* {attempt === 1 && (
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
              )} */}

              {/* <div className="mb-1">
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
              </div> */}

              <CardTitle tag="h5" className="mb-1 mt-2 text-center">
                Pin Requirement
              </CardTitle>

              <ListGroupItem
                className={
                  !requirements.ascendingNum ? "text-success" : "text-danger"
                }
              >
                {!requirements.ascendingNum ? "✅" : "❌"} No ascending number
                sequences (e.g., 1234)
              </ListGroupItem>
              <ListGroupItem
                className={
                  !requirements.decendingNum ? "text-success" : "text-danger"
                }
              >
                {!requirements.decendingNum ? "✅" : "❌"} No descending number
                sequences (e.g., 4321)
              </ListGroupItem>
              <ListGroupItem
                className={
                  !requirements.repeatNum ? "text-success" : "text-danger"
                }
              >
                {!requirements.repeatNum ? "✅" : "❌"} No repeating numbers
                (e.g., 1111, 2222)
              </ListGroupItem>

              <Button
                color="primary"
                className="mt-2"
                // disabled={loading}
                block
                type="submit"
              >
                {true ? (
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

export default Create_Pin;
