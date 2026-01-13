// ** React Imports
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
// ** Reactstrap Imports
import useJwt from "@src/auth/jwt/useJwt";
import React from "react";
import { Button, Card, CardBody, CardText, CardTitle, Input } from "reactstrap";
// ** React Hook Form Imports
import { ChevronLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { UncontrolledAlert } from "reactstrap";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import MARinLogo from "../../../../assets/images/logo/product-logo.png";

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
    //  ("Submitted Data: ", data);
    setLoading(true); // Set loading to true before API call

    try {
      const res = await useJwt.sendEmail(data);
       (res);

      //  (res.status);
      setResToken(res.data.token);

      if (res.status === 200) {
        toast.success("Email sent successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

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
      //  (error.response);

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
              to="/"
              onClick={(e) => e.preventDefault()}
              className="mb-3 d-flex flex-row  align-items-center justify-content-center text-decoration-none"
            >
              <img
                src={MARinLogo}
                alt=" MarinaOne"
                style={{
                  height: "5rem",
                  width: "auto",
                  marginBottom: "0px",
                  marginTop: "0px",
                }}
              />
              <h2 className="text-primary mt-1" style={{ fontWeight: "bold" }}>
                MarinaOne
              </h2>
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
                disabled={btn || loading}
                block
                color="primary"
                className="mt-2"
              >
                {loading ? (
                  <>
                    Loading.. <Spinner size="sm" />{" "}
                  </>
                ) : (
                  "Send"
                )}
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
