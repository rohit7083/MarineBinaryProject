// ** React Imports
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// ** Icons Imports
import { ChevronLeft } from "react-feather";
import useJwt from "@src/auth/jwt/useJwt";
import { Spinner } from "reactstrap";
// ** React Hook Form

import { useForm, Controller } from "react-hook-form";
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

const ResetPasswordBasic = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [msz, setMsz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [urlToken, seturlToken] = useState(null);
  const MySwal = withReactContent(Swal);
const navigate=useNavigate();
  // const { uid: token } = useParams();

  // console.log({ token });

  const handleResendOTP = async () => {
    try {
      const res = await useJwt.resend_Otp(token);
      console.log("resentOTP", res);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleResendCall = async () => {
    try {
      const res = await useJwt.resend_OtpCall(token);
      console.log("resentCall", res);
    } catch (error) {
      console.log(error.response);
    }
  };

  const sendOtp = async () => {

    const path = window.location.pathname;
    // Split the path into parts
    const parts = path.split("/");
    // Extract the last part as the token
    const token = parts[parts.length - 1];
    // console.log("Token:", token);
    seturlToken(parts[parts.length - 1]);

    try {
      const otpRes = await useJwt.sendOtp(token);
      console.log(otpRes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    sendOtp();
  }, []);


  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    const otpString = data.otp.join(""); // Join the OTP digits
    const otp = parseInt(otpString, 10); // Convert OTP string to a number
    const { password, confirmPassword } = data; // Extract password and confirmPassword from form data

    try {
      setLoading(true); // Set loading to true before API call
      console.log(urlToken);

      const res = await useJwt.createPass(urlToken, {
        otp,
        password,
        confirmPassword,
      });

      console.log(res);
// {{debugger}}
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
        const errorMessage = data.content;

        switch (status) {
          case 400:
            setMsz(errorMessage);
            break;
          case 401:
            setMsz(errorMessage);
            // navigate("/login");
            break;
          case 403:
            setMsz(errorMessage);
            break;
          // case 500:
          //   setMsz(errorMessage);
          //   break;
          default:
            setMsz(errorMessage);
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
              className="brand-logo"
              to="/"
              onClick={(e) => e.preventDefault()}
            >
              {/* Logo */}
              <svg viewBox="0 0 139 95" version="1.1" height="28">
                {/* Add SVG content here */}
              </svg>
              <h2 className="brand-text text-primary ms-1">Vuexy</h2>
            </Link>

            <CardTitle tag="h4" className="mb-1">
              Reset Password 🔒
            </CardTitle>
            <CardText className="mb-2">
              Your new password must be different from previously used passwords
            </CardText>

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
                <p className="text-danger">
                  <strong>{msz}</strong>
                </p>
                {errors.otp && (
                  <small className="text-danger">{errors.otp.message}</small>
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
                      value: 6,
                      message: "Password must be at least 6 characters",
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

              <Button color="primary" block type="submit">
                {loading ? <Spinner size="sm" /> : "Set New Password"}
              </Button>
            </form>

            <p className="text-center mt-2">
              <span>Didn’t get the code?</span>{" "}
              <a href="#" onClick={handleResendOTP}>
                Resend
              </a>{" "}
              <span>or</span>{" "}
              <a href="#" onClick={handleResendCall}>
                Call us
              </a>
            </p>
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
