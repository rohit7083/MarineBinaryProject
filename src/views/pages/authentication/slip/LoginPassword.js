// ============================ Original Code ======================================

import { useContext, Fragment, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ChevronLeft } from "react-feather";
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";
import { Spinner } from "reactstrap";
import { ListGroup, ListGroupItem } from "reactstrap";
// ** Third Party Components
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Facebook, Twitter, Mail, GitHub, X } from "react-feather";
import { handleLogin } from "@store/authentication";
import CryptoJS from "crypto-js";
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
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "@styles/react/pages/page-authentication.scss";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import MARinLogo from "./../../../../../src/assets/images/marinaLOGO.png";

const defaultValues = {
  // password: "Ro1234567899",
};

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
  const [show, setShow] = useState(false);
  const [isPassword, setIspassword] = useState(false);
  const location = useLocation();
  const [encryptedPasss, setEncrypt] = useState(null);

  const loginToken = location.state;
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
  });
  const toast = useRef(null);

  const [password, setPassword] = useState("");
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

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

  const handleChange = (e) => {
    const newPwd = e.target.value;

    setPassword(newPwd);
    validatePassword(newPwd);
  };

  useEffect(() => {
    if (password) {
      const encrypted = encryptAES(password);
      setEncrypt(encrypted);
    }
  }, [password]);

  // const handleChange = (e) => {
  //   const newPwd = e.target.value;

  //   setPassword(newPwd);
  //   validatePassword(newPwd);
  // };

  // const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  // console.log(hashedPassword);

  const onSubmit = async (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      try {
        const payload = {
          ...data,
          password: encryptedPasss,
        };

        setLoading(true);

        const res = await useJwt.loginPassword(loginToken, payload);
        const authStatus = res.data.content.TwoNf;
        const passCreated = res?.data?.content?.passwardCreated;

        // if (res.status == 200 || res.status == 201) {
        //   return  toast.current.show({
        //     severity: "success",
        //     summary: "Login Successfully",
        //     detail: " You Logged In Successfully.",
        //     life: 2000,

        //   }).then(() => {

        //     if (passCreated === false) {
        //       navigate("/create-new-password", {
        //         state: {
        //           userData: res.data?.content,
        //         },
        //       });

        //     } else {
        //       if (authStatus === "false" || authStatus === false) {
        //         navigate("/EmailOTP", {
        //           state: { userData: res.data?.content },
        //         });
        //       } else if (authStatus === "true" || authStatus === true) {
        //         navigate("/mobile_otp", {
        //           state: { userData: res.data?.content },
        //         });
        //       }
        //     }
        //   });
        // }

        if (res.status === 200 || res.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Login Successfully",
            detail: "You Logged In Successfully.",
            life: 2000, // 2 seconds
          });

          setTimeout(() => {
            if (passCreated === false) {
              navigate("/create-new-password", {
                state: {
                  userData: res.data?.content,
                },
              });
            } else {
              if (authStatus === "false" || authStatus === false) {
                navigate("/EmailOTP", {
                  state: { userData: res.data?.content },
                });
              } else if (authStatus === "true" || authStatus === true) {
                navigate("/mobile_otp", {
                  state: { userData: res.data?.content },
                });
              }
            }
          }, 2000);
        }
      } catch (error) {
        console.error(
          "Login Error Details:",
          error.response || error.message || error
        );
        if (error.response) {
          const { status, data } = error.response;
          const LoginAttempt = data?.content?.LoginAttempt;
          const errorMessage =
            data?.content?.message ||
            "Technical Error Occured , Please try again later.";
          setLoginAttempt(LoginAttempt);
          setMessage(errorMessage);

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
        }
      } finally {
        setLoading(false);
      }
    } else {
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

  const validatePassword = (pwd) => {
    setRequirements({
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      specialChar: /[^A-Za-z\d]/.test(pwd), // Detects special characters
    });
  };

  return (
    <div className="auth-wrapper auth-cover">
      <Toast ref={toast} />

      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <svg viewBox="0 0 139 95" version="1.1" height="28"></svg>

          <img
            src={MARinLogo}
            alt="Longcove Marina Logo"
            width={55}
            height={55}
            className="mx-2"
          />
          <h2 className="brand-text text-primary ms-1 mt-1">Longcove Marina</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-4 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-8 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Login - Password 👋
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account and start the adventure
              <br />
              {message && (
                <React.Fragment>
                  <UncontrolledAlert color="danger">
                    <div className="alert-body">
                      <span className="text-danger fw-bold">
                        <strong>Error : </strong>
                        {message}</span>
                    </div>
                  </UncontrolledAlert>
                </React.Fragment>
              )}
              {isPassword && (
                <>
                  {loginAttempt == 3 && (
                    <p className="text-danger">
                      Login Attempt : <strong>{loginAttempt}/3</strong>
                    </p>
                  )}
                </>
              )}
            </CardText>

            <form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
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
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 12,
                        message: "Password must be at least 12 characters long",
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{12,}$/,
                        message:
                          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and no special characters",
                      },
                    }}
                    render={({ field }) => (
                      <div>
                        <InputPasswordToggle
                          className="input-group-merge"
                          invalid={errors.password}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e); // React Hook Form
                            handleChange(e); // Custom validation
                          }}
                          value={password}
                        />
                        {errors.password && (
                          <FormFeedback
                            style={{ color: "red", display: "block" }}
                          >
                            {errors.password.message}
                          </FormFeedback>
                        )}
                      </div>
                    )}
                  />
                  {errors.password && (
                    <FormFeedback>{errors.password.message}</FormFeedback>
                  )}
                </div>
                <CardTitle tag="h5" className="mb-1">
                  Password Requirement
                </CardTitle>

                <ListGroupItem
                  className={
                    requirements.length ? "text-success" : "text-danger"
                  }
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
                  className={
                    requirements.number ? "text-success" : "text-danger"
                  }
                >
                  {requirements.number ? "✅" : "❌"} At least one number
                </ListGroupItem>
                <ListGroupItem
                  className={
                    !requirements.specialChar ? "text-success" : "text-danger"
                  }
                >
                  {!requirements.specialChar ? "✅" : "❌"} No special
                  characters allowed
                </ListGroupItem>

                <div className="mb-1 mt-2">
                  {loginAttempt >= 1 && (
                    <Controller
                      name="captcha"
                      control={control}
                      rules={{
                        required: "Captcha is required.", 
                      }}
                      render={({ field }) => (
                        <div>
                          <ReCAPTCHA
                            sitekey="6LfxZqoqAAAAAHn7n2rN_PJtVu18uUebEmzCs8vr" 
                            onChange={(value) => {
                              setValue("captcha", value, {
                                shouldValidate: true,
                              }); 
                              field.onChange(value); 
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
                {/* <div className="form-check mb-1">
                  <Input type="checkbox" id="remember-me" />
                  <Label className="form-check-label" for="remember-me">
                    Remember Me
                  </Label>
                </div> */}
              </div>
              <Button type="submit" color="primary" disabled={loading} block>
                {loading ? (
                  <>
                    Loading.. <Spinner size="sm" />
                  </>
                ) : (
                  "Login "
                )}
              </Button>
              <p className="text-center mt-2">
                <Link to="/Login">
                  <ChevronLeft className="rotate-rtl me-25" size={14} />
                  <span className="align-middle">Back to login</span>
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
