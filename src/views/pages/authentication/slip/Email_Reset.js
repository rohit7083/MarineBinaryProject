// ** React Imports
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
// ** Reactstrap Imports
import { Card, Input, CardBody, CardTitle, CardText, Button } from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";
import React from "react";
// ** React Hook Form Imports
import { useForm, Controller } from "react-hook-form";
import { UncontrolledAlert } from "reactstrap";
import { ChevronLeft } from "react-feather";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useState } from "react";
import toast from "react-hot-toast";

const VerifyEmailBasic = () => {
  // Initialize the useForm hook
  const navigate = useNavigate();
  const [btn, setBtn] = useState(false);
  const [resToken, setResToken] = useState(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [msz, setMsz] = useState(null);
  const [loading, setLoading] = useState(false);

  // Submit handler
  const onSubmit = async (data) => {
    // console.log("Submitted Data: ", data);
    setLoading(true); // Set loading to true before API call

    try {
      const res = await useJwt.sendEmail(data);
      console.log(res);

      // console.log(res.status);
      setResToken(res.data.token);

      if (res.status === 200) {
        toast.success("Email sent successfully!", { position: "top-center", autoClose: 3000 });

        setBtn(true);

        setTimeout(() => {
          setBtn(false);
          navigate("/login", {
            state: { resettoken: res.data.token },
          });
          setBtn(false);
        }, 2000);
      }
    } catch (error) {
      // console.log(error.response);

      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data.content;

        switch (status) {
        
          case 500:
            setMsz(
              <span style={{ color: "red" }}>
                Something went wrong on our end. Please try again later
              </span>
            );
            break;
          default:
            setMsz(errorMessage);
        }
      }
    } finally {
      setLoading(false); // Set loading to false after API call is complete
    }
  };
  const handleDismiss = () => {
    setMsz(null); // Reset the message when the alert is dismissed
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
              <h2 className="brand-text text-primary ms-1">Longcove Marina</h2>
            </Link>
            <CardTitle tag="h2" className="fw-bolder mb-1">
              Verify your email ✉️
            </CardTitle>
            <CardText className="mb-2">
              We've sent a link to your email address. Please follow the link
              inside to continue.
            </CardText>

            {msz && (
              <React.Fragment>
                <UncontrolledAlert color="danger" onClick={handleDismiss}>
                  <div className="alert-body">
                    <strong>{msz}</strong>
                  </div>
                </UncontrolledAlert>
              </React.Fragment>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="emailId" // Removed trailing space
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Supports longer TLDs
                    message: "Enter a valid email",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={`mt-2 ${errors.emailId ? "is-invalid" : ""}`}
                    type="email"
                    placeholder="Enter Email"
                  />
                )}
              />
              {errors.emailId && (
                <span className="text-danger">{errors.emailId.message}</span>
              )}

              <Button
                type="submit"
                disabled={btn}
                block
                color="primary"
                className="mt-2"
              >
                {loading ? <Spinner size="sm" /> : "Send"}
              </Button>

              <p className="text-center mt-2">
                            <Link to="/Login">
                              <ChevronLeft className="rotate-rtl me-25" size={14} />
                              <span className="align-middle">Back to login</span>
                            </Link>
                          </p>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailBasic;
// import React, { useState } from "react";
// import { Container, Form, FormGroup, Label, Input, ListGroup, ListGroupItem } from "reactstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

// const PasswordRequirement = () => {
//   const [password, setPassword] = useState("");
//   const [requirements, setRequirements] = useState({
//     length: false,
//     uppercase: false,
//     lowercase: false,
//     number: false,
//     specialChar: false,
//   });

//   const validatePassword = (pwd) => {
//     setRequirements({
//       length: pwd.length >= 8,
//       uppercase: /[A-Z]/.test(pwd),
//       lowercase: /[a-z]/.test(pwd),
//       number: /[0-9]/.test(pwd),
//       specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
//     });
//   };

//   const handleChange = (e) => {
//     const newPwd = e.target.value;
//     setPassword(newPwd);
//     validatePassword(newPwd);
//   };

//   return (
//     <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
//       <Container className="p-4 border rounded shadow bg-white" style={{ maxWidth: "400px" }}>
//         <h2 className="text-center mb-4">Create a Secure Password</h2>
//         <Form>
//           <FormGroup>
//             <Label for="password">Password</Label>
//             <Input
//               type="password"
//               id="password"
//               value={password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="mb-3"
//             />
//           </FormGroup>
//         </Form>
//         <ListGroup>
//           <ListGroupItem className={requirements.length ? "text-success" : "text-danger"}>✔ At least 8 characters</ListGroupItem>
//           <ListGroupItem className={requirements.uppercase ? "text-success" : "text-danger"}>✔ At least one uppercase letter</ListGroupItem>
//           <ListGroupItem className={requirements.lowercase ? "text-success" : "text-danger"}>✔ At least one lowercase letter</ListGroupItem>
//           <ListGroupItem className={requirements.number ? "text-success" : "text-danger"}>✔ At least one number</ListGroupItem>
//           <ListGroupItem className={requirements.specialChar ? "text-success" : "text-danger"}>✔ At least one special character (!@#$%^&*)</ListGroupItem>
//         </ListGroup>
//       </Container>
//     </div>
//   );
// };

// export default PasswordRequirement;