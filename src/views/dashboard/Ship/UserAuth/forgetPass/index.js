// ** React Imports
import { Link } from "react-router-dom";

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** React Hook Form
import { Controller, useForm } from "react-hook-form";

// ** Reactstrap Imports
import {
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Form,
    Input,
    Label,
} from "reactstrap";

// ** Custom Components
import InputPassword from "@components/input-password-toggle";

// ** Styles
import "@styles/react/pages/page-authentication.scss";

const ResetPasswordBasic = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
     ("Form Data:", data);
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
                      name={`code[${index}]`}
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
                            errors.code?.[index] ? "is-invalid" : ""
                          }`}
                          autoFocus={index === 0}
                        />
                      )}
                    />
                  ))}
                </div>
                {errors.code && (
                  <small className="text-danger">{errors.code.message}</small>
                )}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="new-password">
                  New Password
                </Label>
                <Controller
                  name="newPassword"
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
                      id="new-password"
                      className="input-group-merge"
                      autoFocus
                    />
                  )}
                />
                {errors.newPassword && (
                  <small className="text-danger">
                    {errors.newPassword.message}
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
                      value === newPassword || "Passwords do not match",
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
                Set New Password
              </Button>
            </Form>

            <p className="text-center mt-2">
              <span>Didn’t get the code?</span>{" "}
              <a
                href="/dashboard/UserAuth/emailOTP"
                onClick={(e) => e.preventDefault()}
              >
                Resend
              </a>{" "}
              <span>or</span>{" "}
              <a href="/" onClick={(e) => e.preventDefault()}>
                Call us
              </a>
            </p>
            <p className="text-center mt-2">
              <Link to="/dashboard/UserAuth/Login">
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
