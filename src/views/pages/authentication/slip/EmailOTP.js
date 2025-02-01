// ** React Imports
import { Navigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import React from "react";
import { Alert } from "reactstrap";
import { UncontrolledAlert } from "reactstrap";
// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Form,
  Row,
  Label,
  Col,
  Input,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";

// ** Actions
import { handleLogin } from "@store/authentication";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";
import { useDispatch, useSelector } from "react-redux";

// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";
import { useContext, useState } from "react";
import Index from "../../../dashboard/dash";
/*
 [
          {
            action: 'manage',
            subject: 'all'
          }
        ]
*/

const TwoStepsBasic = () => {
  const MySwal = withReactContent(Swal);
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch(); // Define dispatch

  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // ** React Hook Form Setup
  const [loading, setLoading] = useState(false);
  // const [authStatus,setAuthStatus]=useState(null);
  const userData = location.state?.userData;
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { uid: token } = useParams();

  // console.log({ token });

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await useJwt.resend_Otp(token);
      console.log("resentOTP", res);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleResendCall = async (e) => {
    e.preventDefault();

    try {
      const res = await useJwt.resend_OtpCall(token);
      console.log("resentCall", res);
    } catch (error) {
      console.log(error.response);
    }
  };
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      // {{debugger}}
      const token = userData?.token;
      const otpString = formData.otp.join("");
      const otp = parseInt(otpString, 10);
      console.log(token);
      const res = await useJwt.verifyAccount(token, { otp });
      console.log(res);
      // setAuthStatus(res.data.profile.TwoNf);

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
        const errorMessage = error.response.data.message;
        // setMessage(errorMessage);

        switch (status) {
          case 400:
            setMessage(errorMessage);
            break;
          case 401:
            setMessage(errorMessage);
            // navigate("/login");
            break;
          case 403:
            setMessage(errorMessage);
            break;
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

  // const onSubmit = async (data) => {
  //   // Convert OTP array to a string and then to an integer
  //   const otpString = data.otp.join("");
  //   const otp = parseInt(otpString, 10); // Convert to number (e.g., 12345)
  //   // console.log("OTP Number: ", otp);

  //   // Token from user data
  //   const token = userData?.token;
  //   // console.log("Token: ", token);
  //   // localStorage.setItem("authToken", token);

  //   try {
  //     if (Object.values(data).every((field) => field.length > 0)) {
  //       // Make the API call to verify OTP
  //       const resOtp = await useJwt.verifyAccount(token, { otp });
  //       // const accessToken = resOtp.data.access;
  //       // const refreshToken = resOtp.data.refresh;
  //       // const userData = resOtp.data.profile;
  //       // console.log("userData", userData);

  //       // console.log("ResOTPAPi", resOtp);
  //       // localStorage.setItem("accessToken", accessToken);
  //       // localStorage.setItem("refreshToken", refreshToken);
  //       // localStorage.setItem("userData", JSON.stringify(userData))
  //       // localStorage.setItem("userData",userData);

  //       // // To retrieve and parse it later
  //       // const retrievedData = JSON.parse(localStorage.getItem("userData"));

  //       // console.log(retrievedData);

  //       // Success case
  //       return MySwal.fire({
  //         title: "Successfully Login",
  //         text: "Successfully Login",
  //         icon: "success",
  //         customClass: {
  //           confirmButton: "btn btn-primary",
  //         },
  //         buttonsStyling: false,
  //       }).then(() => {
  //         navigate("/dashboard/ecommerce");
  //       });
  //     }
  //   } catch (error) {
  //     // Check if error.response exists
  //     if (error.response) {
  //       const { status, data } = error.response;

  //       // Handling specific error codes
  //       if (status === 400) {
  //         return MySwal.fire({
  //           title: "Error!",
  //           text: "OTP verification failed",
  //           icon: "error",
  //           customClass: {
  //             confirmButton: "btn btn-primary",
  //           },
  //           buttonsStyling: false,
  //         });
  //       }

  //       // Handle 401 error for unauthorized access
  //       else if (status === 401) {
  //         const errorMessage =
  //           data?.error || "Unauthorized access. Please log in again.";

  //         return MySwal.fire({
  //           title: "Time Out!",
  //           text: errorMessage, // Display the error message from the response
  //           icon: "error  ",
  //           customClass: {
  //             confirmButton: "btn btn-primary",
  //           },
  //           buttonsStyling: false,
  //         }).then(() => {
  //           // Optional: Redirect to login page
  //           // navigate("/login");
  //         });
  //       }
  //     } else {
  //       // Handle errors when there is no response object (e.g., network issues)
  //       return MySwal.fire({
  //         title: "Error!",
  //         text: "An unexpected error occurred. Please try again later.",
  //         icon: "error",
  //         customClass: {
  //           confirmButton: "btn btn-primary",
  //         },
  //         buttonsStyling: false,
  //       });
  //     }
  //   }
  // };

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
              <svg viewBox="0 0 139 95" version="1.1" height="28">
                <defs>
                  <linearGradient
                    x1="100%"
                    y1="10.5120544%"
                    x2="50%"
                    y2="89.4879456%"
                    id="linearGradient-1"
                  >
                    <stop stopColor="#000000" offset="0%"></stop>
                    <stop stopColor="#FFFFFF" offset="100%"></stop>
                  </linearGradient>
                  <linearGradient
                    x1="64.0437835%"
                    y1="46.3276743%"
                    x2="37.373316%"
                    y2="100%"
                    id="linearGradient-2"
                  >
                    <stop
                      stopColor="#EEEEEE"
                      stopOpacity="0"
                      offset="0%"
                    ></stop>
                    <stop stopColor="#FFFFFF" offset="100%"></stop>
                  </linearGradient>
                </defs>
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Artboard"
                    transform="translate(-400.000000, -178.000000)"
                  >
                    <g id="Group" transform="translate(400.000000, 178.000000)">
                      <path
                        d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                        id="Path"
                        className="text-primary"
                        style={{ fill: "currentColor" }}
                      ></path>
                      <path
                        d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                        id="Path"
                        fill="url(#linearGradient-1)"
                        opacity="0.2"
                      ></path>
                      <polygon
                        id="Path-2"
                        fill="#000000"
                        opacity="0.049999997"
                        points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                      ></polygon>
                      <polygon
                        id="Path-2"
                        fill="#000000"
                        opacity="0.099999994"
                        points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                      ></polygon>
                      <polygon
                        id="Path-3"
                        fill="url(#linearGradient-2)"
                        opacity="0.099999994"
                        points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                      ></polygon>
                    </g>
                  </g>
                </g>
              </svg>
              <h2 className="brand-text text-primary ms-1">Vuexy</h2>
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
              We sent OTP to your Registered Email ID. Enter the code from the
              Email in the field below.
            </CardText>
            <CardText className="fw-bolder mb-2">
              {userData?.email?.slice(0, -2)}
            </CardText>
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
              <Button block type="submit" color="primary">
                {loading ? <Spinner size="sm" /> : "Login"}
              </Button>
            </Form>
            <p className="text-center mt-2">
              <span>Didn’t get the code?</span>{" "}
              <a href="" onClick={handleResendOTP}>
                Resend
              </a>{" "}
              <span>or</span>{" "}
              <a href="/" onClick={handleResendCall}>
                Call us
              </a>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TwoStepsBasic;
