// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useJwt from "@src/auth/jwt/useJwt";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/register-v2.svg";
import illustrationsDark from "@src/assets/images/pages/register-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useForm, Controller } from "react-hook-form";
const RegisterCover = () => {
    const MySwal = withReactContent(Swal);
  
  const { skin } = useSkin();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit =async (data) => {
    if (Object.keys(errors).length === 0) {
      console.log("Submitted data", data);

      try {
        // await useJwt.postsVessel(payload);
        return MySwal.fire({
          title: "Successfully Register",
          text: " Account Successfully Created",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        })
      } catch (error) {
        console.log(error);
        return MySwal.fire({
          title: "Error!",
          text: "An error occurred while submitting the form.",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        });
        
      }
    } else {
      console.log("Form has errors");
    }
  };
  

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
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
                <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%"></stop>
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
              <g id="Artboard" transform="translate(-400.000000, -178.000000)">
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
          <Col className="px-xl-2 mx-auto" xs="12" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Register 🚀
            </CardTitle>
            <CardText className="mb-2">
              Make your app management easy and fun!
            </CardText>
            <form
              className="auth-register-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1">
                <Label className="form-label" for="register-username">
                  First Name
                </Label>
                <Controller
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please Enter The First Name",
                  }}
                  name="firstName"
                  autoFocus
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      invalid={!!errors.firstName}
                      placeholder="Enter your first name"
                    />
                  )}
                />
                {errors.firstName && (
                  <FormFeedback>{errors.firstName.message}</FormFeedback>
                )}{" "}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="register-username">
                  Last Name
                </Label>
                <Controller
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please Enter The Last Name",
                  }}
                  name="lastName"
                  placeholder="Enter First Name"
                  autoFocus
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      invalid={!!errors.lastName}
                      placeholder="Enter your last name"
                    />
                  )}
                />
                {errors.lastName && (
                  <FormFeedback>{errors.lastName.message}</FormFeedback>
                )}{" "}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="register-mobile">
                  Mobile Number
                </Label>
                <div className="d-flex gap-2">
                  <Controller
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Please Enter The Last Name",
                    }}
                    name="countryCode"
                    autoFocus
                    render={({ field }) => (
                      <Input
                        type="select"
                        id="register-country-code"
                        style={{ maxWidth: "100px" }}
                        {...field}
                        // invalid={!!errors.countryCode}
                        placeholder="Enter your Country Code"
                      >
                        <option value="+1">+1 (US)</option>
                        <option value="+91">+91 (India)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+61">+61 (Australia)</option>
                        <option value="+81">+81 (Japan)</option>
                        <option value="+86">+86 (China)</option>
                        <option value="+49">+49 (Germany)</option>
                        <option value="+33">+33 (France)</option>
                      </Input>
                    )}
                  />

                  <div className="d-flex gap-2">
                    <Controller
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Please Enter The mobile Number",
                         pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Please Enter Valid Mobile Number",
                        }
                      }}
                      name="mobileNumber"
                      autoFocus
                      render={({ field }) => (
                        <Input
                          type="Number"
                          {...field}
                          invalid={!!errors.mobileNumber}
                          placeholder="Enter your mobile number"
                        />
                        
                      )}
                      
                    />
                    
                  </div>
                  {errors.mobileNumber && (
                  <FormFeedback>{errors.mobileNumber.message}</FormFeedback>
                )}{" "}
                </div>
                
              </div>

              <div className="mb-1">
                <Label className="form-label" for="register-email">
                  Email
                </Label>
                <Controller
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please Enter Email",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Please Enter Valid Email",
                    },
                  }}
                  name="emailId"
                  autoFocus
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      invalid={!!errors.emailId}
                      placeholder="Enter your Email ID"
                    />
                  )}
                />
                {errors.emailId && (
                  <FormFeedback>{errors.emailId.message}</FormFeedback>
                )}{" "}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="register-password">
                  Password
                </Label>
                <Controller
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Please Enter Password",
                    pattern: {
                      value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                      message:
                        "Password must be at least 6 characters long, should contain at least one number, one lowercase and one uppercase letter",
                    },
                  }}
                  name="password"
                  autoFocus
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      invalid={!!errors.password}
                      placeholder="Enter Password"
                    />
                  )}
                />
                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}{" "}
              </div>

              <div className="form-check mb-1">
                <Input type="checkbox" id="terms" />
                <Label className="form-check-label" for="terms">
                  I agree to
                  <a
                    className="ms-25"
                    href="/"
                    onClick={(e) => e.preventDefault()}
                  >
                    privacy policy & terms
                  </a>
                </Label>
              </div>
              <Button color="primary" type="submit" block>
                Sign up
              </Button>
            </form>
            <p className="text-center mt-2">
              <span className="me-25">Already have an account?</span>
              <Link to="/dashboard/UserAuth/SlipLogin">
                <span>Sign in instead</span>
              </Link>
            </p>
            {/* <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button color="facebook">
                <Facebook size={14} />
              </Button>
              <Button color="twitter">
                <Twitter size={14} />
              </Button>
              <Button color="google">
                <Mail size={14} />
              </Button>
              <Button className="me-0" color="github">
                <GitHub size={14} />
              </Button>
            </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterCover;
