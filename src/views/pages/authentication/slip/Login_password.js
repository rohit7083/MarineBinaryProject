// // ============================ Original Code ======================================

import { useContext, Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";
import { Spinner } from "reactstrap";

// ** Third Party Components
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Facebook, Twitter, Mail, GitHub, X } from "react-feather";
import { handleLogin } from "@store/authentication";
import { ChevronLeft } from "react-feather";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";

import Avatar from "@components/avatar";
import InputPasswordToggle from "@components/input-password-toggle";
import React from "react";
// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
} from "reactstrap";
import { UncontrolledAlert } from "reactstrap";
// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Reactst
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

// Default Form Values
// const defaultValues = {
//   password: "101010",
//   emailId: "mandewalsneha@gmail.com",
// };

//  [
//           {
//             action: 'manage',
//             subject: 'all'
//           }
//         ]

const Login = () => {
  // ** Hooks
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ability = useContext(AbilityContext);
  const MySwal = withReactContent(Swal);
  const [loginAttempt, setLoginAttempt] = useState(null);
  const [message, setMessage] = useState(""); // ** React Hook Form Setup
  const [loading, setLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationLoader, setlocationLoader] = useState(true);
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState(null);
  const [ip,setIP]=useState(null);
  const {
    control,
    handleSubmit,
    setError, // Include setError here
    setValue,
    formState: { errors },
  } = useForm({
    // defaultValues,
  });

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
    return undefined; // Valid case
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return undefined; // Valid case
  };

  const checkLocationAccess = () => {

try {
  const response=axios.get("https://api.ipify.org/?format=json:")
  .then((response) => {
    setIP(response.data);
    console.log(response.data);
    
  })
  .catch((error) => {
    console.error('Error fetching IP address:', error);
  });

} catch (error) {
  console.log(error);
  
}


    if (!navigator.geolocation) {
      setMessage("location is not supported by your browser");
      setLocationEnabled(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationEnabled(true);
        // console.log(position);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const location = `${latitude},${longitude}`;
        console.log(location);
        setLocation(location);
        setMessage("");
      },

      (error) => {
        // setMessage("Please enable location services to login.");
        setMessage(
          <>
            Please enable location services to login
            <br />{" "}
          </>
        );
        setLocationEnabled(false);
      }
    );
  };

  const onSubmit = async (data) => {
    data.location = location;
data.ip=ip;
    if (Object.values(data).every((field) => field.length > 0)) {
      // console.log("Submitted Data:", data);
      setLoading(true); // Set loading to true before API call

      try {
        const res = await useJwt.login({
          ip:ip,
          location: location,
          emailId: data.emailId,
          password: data.password,
        });

        console.log("API Response Full:", res);
        console.log("API Response Content:", res.data?.content);
        const authStatus = res.data.content.TwoNf;
        console.log("data", data);

        if (authStatus === "false" || authStatus === false) {
          navigate("/EmailOTP", { state: { userData: res.data?.content } });
        } else if (authStatus === "true" || authStatus === true) {
          navigate("/Mobile_OTP", { state: { userData: res.data?.content } });
        }
      } catch (error) {
        console.error(
          "Login Error Details:",
          error.response || error.message || error
        );

        if (error.response) {
          const { status, data } = error.response;
          const LoginAttempt = data.content.LoginAttempt;
          const errorMessage = data.content.message;
          setLoginAttempt(LoginAttempt);
          setMessage(errorMessage);
          console.log("failed");

          if (LoginAttempt > 3) {
            return MySwal.fire({
              title: "Blocked",
              text: errorMessage,
              icon: "error",
              customClass: {
                confirmButton: "btn btn-primary",
              },
              buttonsStyling: false,
            }).then(() => {
              navigate("/Email_Reset");
            });
          }
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
            default:
              setMessage(errorMessage);
          }
        }
      } finally {
        setLoading(false); // Set loading to false after API call is complete
      }
    } else {
      // Validate fields and show errors if empty
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
            message: `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } is required`,
          });
        }
      }
    }
  };

  useEffect(() => {
    checkLocationAccess();

    if (locationEnabled == false) {
      setShow(true);
    } else {
      setShow(false);
    }
    setlocationLoader(false);
  }, [locationEnabled]);

  if (locationLoader) return "Loading....";

  return (
    <div className="auth-wrapper auth-cover">
      <Fragment>
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
            <h1 className="text-center mb-1">Turn On Your Location</h1>
            {/* <p className="text-center">Add card for future billing</p> */}
            <Row
              tag="form"
              className="gy-1 gx-2 mt-75"
              onSubmit={handleSubmit(onSubmit)}
            >
              <img src="src/views/pages/authentication/Images/locationguide.png" />

              <Button
                color="primary"
                onClick={() => {
                  setShow(!show);
                  reset();
                }}
              >
                OK
              </Button>
            </Row>
          </ModalBody>
        </Modal>
      </Fragment>
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <svg viewBox="0 0 139 95" version="1.1" height="28"></svg>

          <h2 className="brand-text text-primary ms-1">Vuexy</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Login 👋
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account and start the adventure
              <br />
              {message && (
                <React.Fragment>
                  <UncontrolledAlert color="danger">
                    <div className="alert-body">
                      <span className="text-danger fw-bold">{message}</span>
                    </div>
                  </UncontrolledAlert>
                </React.Fragment>
              )}
              {loginAttempt == 3 && (
                <p className="text-danger">
                  Login Attempt : <strong>{loginAttempt}/3</strong>
                </p>
              )}
            </CardText>

            <form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Controller
                  name="emailId"
                  control={control}
                  rules={{ validate: validateEmail }}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="email"
                    //   placeholder="Enter Email"
                      invalid={!!errors.emailId}
                      {...field}
                      readOnly
                    />
                  )}
                />
                {errors.emailId && (
                  <FormFeedback>{errors.emailId.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Link to="/Email_Reset">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  rules={{ validate: validatePassword }}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      invalid={errors.password}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                {loginAttempt >= 1 && (
                  <Controller
                    name="captcha"
                    control={control}
                    rules={{
                      required: "Captcha is required.", // Validation message
                    }}
                    render={({ field }) => (
                      <div>
                        <ReCAPTCHA
                          sitekey="6LfxZqoqAAAAAHn7n2rN_PJtVu18uUebEmzCs8vr" // Replace with your actual site key
                          onChange={(value) => {
                            setValue("captcha", value, {
                              shouldValidate: true,
                            }); // Update value and trigger validation
                            field.onChange(value); // React Hook Form integration
                          }}
                        />
                        {errors.captcha && (
                          <FormFeedback
                            style={{ color: "red", display: "block" }}
                          >
                            {errors.captcha.message}
                          </FormFeedback>
                        )}
                      </div>
                    )}
                  />
                )}
              </div>
              <div className="form-check mb-1">
                <Input type="checkbox" id="remember-me" />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div>

              <Button
                type="submit"
                color="primary"
                disabled={!locationEnabled}
                block
              >
                {loading ? <Spinner size="sm" /> : "Next"}
              </Button>
              <p className="text-center mt-2">
              <Link to="/Login">
                <ChevronLeft className="rotate-rtl me-25" size={14} />
                <span className="align-middle">Back to Email Page</span>
              </Link>
            </p>
            </form>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;

