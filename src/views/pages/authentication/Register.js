// // ** React Imports
// import { useContext } from 'react'
// import { Link, useNavigate } from 'react-router-dom'

// // ** Custom Hooks
// import { useSkin } from '@hooks/useSkin'
// import useJwt from '@src/auth/jwt/useJwt'

// // ** Store & Actions
// import { useDispatch } from 'react-redux'
// import { handleLogin } from '@store/authentication'

// // ** Third Party Components
// import { useForm, Controller } from 'react-hook-form'
// import { Facebook, Twitter, Mail, GitHub } from 'react-feather'

// // ** Context
// import { AbilityContext } from '@src/utility/context/Can'

// // ** Custom Components
// import InputPasswordToggle from '@components/input-password-toggle'

// // ** Reactstrap Imports
// import { Row, Col, CardTitle, CardText, Label, Button, Form, Input, FormFeedback } from 'reactstrap'

// // ** Illustrations Imports
// import illustrationsLight from '@src/assets/images/pages/register-v2.svg'
// import illustrationsDark from '@src/assets/images/pages/register-v2-dark.svg'

// // ** Styles
// import '@styles/react/pages/page-authentication.scss'

// const defaultValues = {
//   email: '',
//   terms: false,
//   username: '',
//   password: ''
// }

// const Register = () => {
//   // ** Hooks
//   const ability = useContext(AbilityContext)
//   const { skin } = useSkin()
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const {
//     control,
//     setError,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({ defaultValues })

//   const source = skin === 'dark' ? illustrationsDark : illustrationsLight

//   const onSubmit = data => {
//     const tempData = { ...data }
//     delete tempData.terms
//     if (Object.values(tempData).every(field => field.length > 0) && data.terms === true) {
//       const { username, email, password } = data
//       useJwt
//         .register({ username, email, password })
//         .then(res => {
//           if (res.data.error) {
//             for (const property in res.data.error) {
//               if (res.data.error[property] !== null) {
//                 setError(property, {
//                   type: 'manual',
//                   message: res.data.error[property]
//                 })
//               }
//             }
//           } else {
//             const data = { ...res.data.user, accessToken: res.data.accessToken }
//             ability.update(res.data.user.ability)
//             dispatch(handleLogin(data))
//             navigate('/')
//           }
//         })
//         .catch(err => console.log(err))
//     } else {
//       for (const key in data) {
//         if (data[key].length === 0) {
//           setError(key, {
//             type: 'manual',
//             message: `Please enter a valid ${key}`
//           })
//         }
//         if (key === 'terms' && data.terms === false) {
//           setError('terms', {
//             type: 'manual'
//           })
//         }
//       }
//     }
//   }

//   return (
//     <div className='auth-wrapper auth-cover'>
//       <Row className='auth-inner m-0'>
//         <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
//           <svg viewBox='0 0 139 95' version='1.1' height='28'>
//             <defs>
//               <linearGradient x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%' id='linearGradient-1'>
//                 <stop stopColor='#000000' offset='0%'></stop>
//                 <stop stopColor='#FFFFFF' offset='100%'></stop>
//               </linearGradient>
//               <linearGradient x1='64.0437835%' y1='46.3276743%' x2='37.373316%' y2='100%' id='linearGradient-2'>
//                 <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
//                 <stop stopColor='#FFFFFF' offset='100%'></stop>
//               </linearGradient>
//             </defs>
//             <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
//               <g id='Artboard' transform='translate(-400.000000, -178.000000)'>
//                 <g id='Group' transform='translate(400.000000, 178.000000)'>
//                   <path
//                     d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
//                     id='Path'
//                     className='text-primary'
//                     style={{ fill: 'currentColor' }}
//                   ></path>
//                   <path
//                     d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
//                     id='Path'
//                     fill='url(#linearGradient-1)'
//                     opacity='0.2'
//                   ></path>
//                   <polygon
//                     id='Path-2'
//                     fill='#000000'
//                     opacity='0.049999997'
//                     points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
//                   ></polygon>
//                   <polygon
//                     id='Path-2'
//                     fill='#000000'
//                     opacity='0.099999994'
//                     points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
//                   ></polygon>
//                   <polygon
//                     id='Path-3'
//                     fill='url(#linearGradient-2)'
//                     opacity='0.099999994'
//                     points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
//                   ></polygon>
//                 </g>
//               </g>
//             </g>
//           </svg>
//           <h2 className='brand-text text-primary ms-1'>Vuexy</h2>
//         </Link>
//         <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
//           <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
//             <img className='img-fluid' src={source} alt='Login Cover' />
//           </div>
//         </Col>
//         <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
//           <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
//             <CardTitle tag='h2' className='fw-bold mb-1'>
//               Adventure starts here 🚀
//             </CardTitle>
//             <CardText className='mb-2'>Make your app management easy and fun!</CardText>

//             <Form action='/' className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
//               <div className='mb-1'>
//                 <Label className='form-label' for='register-username'>
//                   Username
//                 </Label>
//                 <Controller
//                   id='username'
//                   name='username'
//                   control={control}
//                   render={({ field }) => (
//                     <Input autoFocus placeholder='johndoe' invalid={errors.username && true} {...field} />
//                   )}
//                 />
//                 {errors.username ? <FormFeedback>{errors.username.message}</FormFeedback> : null}
//               </div>
//               <div className='mb-1'>
//                 <Label className='form-label' for='register-email'>
//                   Email
//                 </Label>
//                 <Controller
//                   id='email'
//                   name='email'
//                   control={control}
//                   render={({ field }) => (
//                     <Input type='email' placeholder='john@example.com' invalid={errors.email && true} {...field} />
//                   )}
//                 />
//                 {errors.email ? <FormFeedback>{errors.email.message}</FormFeedback> : null}
//               </div>
//               <div className='mb-1'>
//                 <Label className='form-label' for='register-password'>
//                   Password
//                 </Label>
//                 <Controller
//                   id='password'
//                   name='password'
//                   control={control}
//                   render={({ field }) => (
//                     <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
//                   )}
//                 />
//               </div>
//               <div className='form-check mb-1'>
//                 <Controller
//                   name='terms'
//                   control={control}
//                   render={({ field }) => (
//                     <Input {...field} id='terms' type='checkbox' checked={field.value} invalid={errors.terms && true} />
//                   )}
//                 />
//                 <Label className='form-check-label' for='terms'>
//                   I agree to
//                   <a className='ms-25' href='/' onClick={e => e.preventDefault()}>
//                     privacy policy & terms
//                   </a>
//                 </Label>
//               </div>
//               <Button type='submit' block color='primary'>
//                 Sign up
//               </Button>
//             </Form>
//             <p className='text-center mt-2'>
//               <span className='me-25'>Already have an account?</span>
//               <Link to='/login'>
//                 <span>Sign in instead</span>
//               </Link>
//             </p>
//             <div className='divider my-2'>
//               <div className='divider-text'>or</div>
//             </div>
//             <div className='auth-footer-btn d-flex justify-content-center'>
//               <Button color='facebook'>
//                 <Facebook size={14} />
//               </Button>
//               <Button color='twitter'>
//                 <Twitter size={14} />
//               </Button>
//               <Button color='google'>
//                 <Mail size={14} />
//               </Button>
//               <Button className='me-0' color='github'>
//                 <GitHub size={14} />
//               </Button>
//             </div>
//           </Col>
//         </Col>
//       </Row>
//     </div>
//   )
// }

// export default Register

// ==========  above code is original and following are the modified code  =====================
// import { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// // ** Custom Hooks
// import { useSkin } from "@hooks/useSkin";
// import useJwt from "@src/auth/jwt/useJwt";

// // ** Store & Actions
// import { useDispatch } from "react-redux";
// import { handleLogin } from "@store/authentication";

// // ** Reactstrap Imports
// import {
//   Row,
//   Col,
//   CardTitle,
//   CardText,
//   Label,
//   Button,
//   Form,
//   Input,
//   FormFeedback,
//   InputGroup,
// } from "reactstrap";

// // ** Third Party Components
// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";

// // ** Context
// import { AbilityContext } from "@src/utility/context/Can";

// // ** Custom Components
// import InputPasswordToggle from "@components/input-password-toggle";

// // ** Styles
// import "@styles/react/pages/page-authentication.scss";

// const defaultValues = {
//   firstName: "",
//   lastName: "",
//   emailId: "",
//   password: "",
//   mobileNumber: "",
//   countryCode: "+91", // Default country code
//   terms: false,
// };

// const Register = () => {
//   const ability = useContext(AbilityContext);
//   const { skin } = useSkin();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const {
//     control,
//     setError,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm({ defaultValues });

//   const onSubmit = (data) => {
//     const { firstName, lastName, emailId, mobileNumber, password, countryCode, terms } = data;

//     // Check if all required fields are valid
//     if (
//       firstName && lastName && emailId && mobileNumber && password && countryCode && terms
//     ) {
//       // Log the form data to the console after successful submission
//       console.log("Form Data: ", data);

//       useJwt
//         .register({ username: firstName, email: emailId, password, phone: mobileNumber, countryCode })
//         .then((res) => {
//           if (res.data.error) {
//             for (const property in res.data.error) {
//               if (res.data.error[property] !== null) {
//                 setError(property, {
//                   type: "manual",
//                   message: res.data.error[property],
//                 });
//               }
//             }
//           } else {
//             const data = {
//               ...res.data.user,
//               accessToken: res.data.accessToken,
//             };
//             ability.update(res.data.user.ability);
//             dispatch(handleLogin(data));
//             navigate("/");
//           }
//         })
//         .catch((err) => console.log(err));
//     } else {
//       for (const key in data) {
//         if (!data[key] && key !== "terms") {
//           setError(key, {
//             type: "manual",
//             message: `Please enter a valid ${key}`,
//           });
//         }
//         if (key === "terms" && !data.terms) {
//           setError("terms", {
//             type: "manual",
//             message: "You must accept the terms and conditions",
//           });
//         }
//       }
//     }
//   };

//   // Country Codes
//   const countryCodes = [
//     { label: "India (+91)", value: "+91" },
//     { label: "US (+1)", value: "+1" },
//     { label: "UK (+44)", value: "+44" },
//     // Add more countries as necessary...
//   ];

//   const [countryCode, setCountryCode] = useState("+91");

//   const handleCountryCodeChange = (selectedOption) => {
//     setCountryCode(selectedOption.value);
//   };

//   return (
//     <div className="auth-wrapper auth-cover">
//       <Row className="auth-inner m-0">
//         <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
//           <h2 className="brand-text text-primary ms-1">Vuexy</h2>
//         </Link>
//         <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
//           <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
//             <img
//               className="img-fluid"
//               src={skin === "dark" ? "@src/assets/images/pages/register-v2-dark.svg" : "@src/assets/images/pages/register-v2.svg"}
//               alt="Login Cover"
//             />
//           </div>
//         </Col>
//         <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
//           <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
//             <CardTitle tag="h2" className="fw-bold mb-1">
//               Please Register For Entry
//             </CardTitle>
//             <CardText className="mb-2">
//               Make your app management easy and fun!
//             </CardText>

//             <Form className="auth-register-form mt-2" onSubmit={handleSubmit(onSubmit)}>
//               {/* First Name */}
//               <div className="mb-1">
//                 <Label className="form-label" for="register-firstname">
//                   First Name
//                 </Label>
//                 <Controller
//                   id="firstName"
//                   name="firstName"
//                   control={control}
//                   rules={{ required: "First Name is required" }}
//                   render={({ field }) => (
//                     <Input
//                       placeholder="John"
//                       invalid={errors.firstName && true}
//                       {...field}
//                     />
//                   )}
//                 />
//                 {errors.firstName && <FormFeedback>{errors.firstName.message}</FormFeedback>}
//               </div>

//               {/* Last Name */}
//               <div className="mb-1">
//                 <Label className="form-label" for="register-lastname">
//                   Last Name
//                 </Label>
//                 <Controller
//                   id="lastName"
//                   name="lastName"
//                   control={control}
//                   rules={{ required: "Last Name is required" }}
//                   render={({ field }) => (
//                     <Input
//                       placeholder="Doe"
//                       invalid={errors.lastName && true}
//                       {...field}
//                     />
//                   )}
//                 />
//                 {errors.lastName && <FormFeedback>{errors.lastName.message}</FormFeedback>}
//               </div>

//               {/* Phone Number */}
//               <div className="mb-1">
//                 <Label for="phone-number">Phone Number</Label>
//                 <InputGroup className="input-group-merge">
//                   <Select
//                     value={countryCodes.find((code) => code.value === countryCode)}
//                     options={countryCodes}
//                     onChange={handleCountryCodeChange}
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                   />
//                 </InputGroup>
//                 <Controller
//                   id="mobileNumber"
//                   name="mobileNumber"
//                   control={control}
//                   rules={{
//                     required: "Phone number is required",
//                     pattern: {
//                       value: /^[+]?(\d{1,4}[\s-])?(\(?\d{1,3}\)?[\s-])?[\d\s-]{7,15}$/,
//                       message: "Please enter a valid phone number",
//                     },
//                   }}
//                   render={({ field }) => (
//                     <Input
//                       {...field}
//                       className="mt-1"
//                       placeholder="Enter Mobile Number"
//                       invalid={errors.mobileNumber && true}
//                     />
//                   )}
//                 />
//                 {errors.mobileNumber && <FormFeedback>{errors.mobileNumber.message}</FormFeedback>}
//               </div>

//               {/* Email */}
//               <div className="mb-1">
//                 <Label className="form-label" for="register-email">
//                   Email
//                 </Label>
//                 <Controller
//                   id="emailId"
//                   name="emailId"
//                   control={control}
//                   rules={{
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                       message: "Please enter a valid email",
//                     },
//                   }}
//                   render={({ field }) => (
//                     <Input
//                       type="email"
//                       placeholder="john@example.com"
//                       invalid={errors.emailId && true}
//                       {...field}
//                     />
//                   )}
//                 />
//                 {errors.emailId && <FormFeedback>{errors.emailId.message}</FormFeedback>}
//               </div>

//               {/* Password */}
//               <div className="mb-1">
//                 <Label className="form-label" for="register-password">
//                   Password
//                 </Label>
//                 <Controller
//                   id="password"
//                   name="password"
//                   control={control}
//                   rules={{
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Password must be at least 6 characters",
//                     },
//                   }}
//                   render={({ field }) => (
//                     <InputPasswordToggle
//                       invalid={errors.password && true}
//                       placeholder="********"
//                       {...field}
//                     />
//                   )}
//                 />
//                 {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
//               </div>

//               {/* Terms & Conditions */}
//               <div className="mb-1 form-check">
//                 <Input
//                   type="checkbox"
//                   id="register-terms"
//                   name="terms"
//                   onChange={(e) => setValue("terms", e.target.checked)}
//                   invalid={errors.terms && true}
//                 />
//                 <Label className="form-check-label" for="register-terms">
//                   I agree to the{" "}
//                   <span className="text-primary">terms and conditions</span>
//                 </Label>
//                 {errors.terms && (
//                   <FormFeedback>
//                     Accepting terms and conditions is required
//                   </FormFeedback>
//                 )}
//               </div>

//               <Button type="submit" color="primary" block>
//                 Register
//               </Button>
//             </Form>
//           </Col>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Register;

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";

// ** Store & Actions
import { useDispatch } from "react-redux";
import { handleLogin } from "@store/authentication";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Label,
  Button,
  Form,
  Input,
  FormFeedback,
  InputGroup,
} from "reactstrap";

// ** Third Party Components
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Styles
import "@styles/react/pages/page-authentication.scss";

const defaultValues = {
  firstName: "",
  lastName: "",
  emailId: "",
  password: "",
  mobileNumber: "",
  countryCode: "+91", // Default country code
  terms: false,
};

const Register = () => {
  const ability = useContext(AbilityContext);
  const { skin } = useSkin();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data); // Check the form data

    const {
      firstName,
      lastName,
      emailId,
      mobileNumber,
      password,
      countryCode,
      terms,
    } = data;

    // Validate the form data
    if (
      firstName &&
      lastName &&
      emailId &&
      mobileNumber &&
      password &&
      countryCode &&
      terms
    ) {
      const payload = {
        firstName,
        lastName,
        emailId,
        mobileNumber,
        password,
        countryCode,
      };

      console.log("Payload sent to API:", payload); // Log the payload being sent to the backend

      axios
        .post("http://192.168.29.190:8001/auth/user/create", payload)
        .then((response) => {
          console.log("API response:", response); // Check the API response
          if (response.data.success) {
            const { user, accessToken } = response.data;
            const loginData = { ...user, accessToken };
            ability.update(user.ability);
            dispatch(handleLogin(loginData));
            navigate("/"); // Redirect on successful registration
          } else {
            alert(
              response.data.message || "Something went wrong, please try again."
            );
          }
        })
        .catch((error) => {
          console.error("There was an error creating the user:", error); // Log any error
          alert("Error creating user. Please try again later.");
        });
    } else {
      // If form validation fails, highlight the missing fields
      for (const key in data) {
        if (!data[key] && key !== "terms") {
          setError(key, {
            type: "manual",
            message: `Please enter a valid ${key}`,
          });
        }
        if (key === "terms" && !data.terms) {
          setError("terms", {
            type: "manual",
            message: "You must accept the terms and conditions",
          });
        }
      }
    }
  };

  // Country Codes
  const countryCodes = [
    { label: "India (+91)", value: "+91" },
    { label: "US (+1)", value: "+1" },
    { label: "UK (+44)", value: "+44" },
    // Add more countries as necessary...
  ];

  const [countryCode, setCountryCode] = useState("+91");

  const handleCountryCodeChange = (selectedOption) => {
    setCountryCode(selectedOption.value);
  };

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <h2 className="brand-text text-primary ms-1">Vuexy</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img
              className="img-fluid"
              src={
                skin === "dark"
                  ? "@src/assets/images/pages/register-v2-dark.svg"
                  : "@src/assets/images/pages/register-v2.svg"
              }
              alt="Login Cover"
            />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Please Register For Entry
            </CardTitle>
            <CardText className="mb-2">
              Make your app management easy and fun!
            </CardText>

            <Form
              className="auth-register-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* First Name */}
              <div className="mb-1">
                <Label className="form-label" for="register-firstname">
                  First Name
                </Label>
                <Controller
                  id="firstName"
                  name="firstName"
                  control={control}
                  rules={{ required: "First Name is required" }}
                  render={({ field }) => (
                    <Input
                      placeholder="John"
                      invalid={errors.firstName && true}
                      {...field}
                    />
                  )}
                />
                {errors.firstName && (
                  <FormFeedback>{errors.firstName.message}</FormFeedback>
                )}
              </div>

              {/* Last Name */}
              <div className="mb-1">
                <Label className="form-label" for="register-lastname">
                  Last Name
                </Label>
                <Controller
                  id="lastName"
                  name="lastName"
                  control={control}
                  rules={{ required: "Last Name is required" }}
                  render={({ field }) => (
                    <Input
                      placeholder="Doe"
                      invalid={errors.lastName && true}
                      {...field}
                    />
                  )}
                />
                {errors.lastName && (
                  <FormFeedback>{errors.lastName.message}</FormFeedback>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-1">
                <Label for="phone-number">Phone Number</Label>
                <InputGroup className="input-group-merge">
                  <Select
                    value={countryCodes.find(
                      (code) => code.value === countryCode
                    )}
                    options={countryCodes}
                    onChange={handleCountryCodeChange}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </InputGroup>
                <Controller
                  id="mobileNumber"
                  name="mobileNumber"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value:
                        /^[+]?(\d{1,4}[\s-])?(\(?\d{1,3}\)?[\s-])?[\d\s-]{7,15}$/,
                      message: "Please enter a valid phone number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter Mobile Number"
                      invalid={errors.mobileNumber && true}
                    />
                  )}
                />
                {errors.mobileNumber && (
                  <FormFeedback>{errors.mobileNumber.message}</FormFeedback>
                )}
              </div>

              {/* Email */}
              <div className="mb-1">
                <Label className="form-label" for="register-email">
                  Email
                </Label>
                <Controller
                  id="emailId"
                  name="emailId"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      invalid={errors.emailId && true}
                      {...field}
                    />
                  )}
                />
                {errors.emailId && (
                  <FormFeedback>{errors.emailId.message}</FormFeedback>
                )}
              </div>

              {/* Password */}
              <div className="mb-1">
                <Label className="form-label" for="register-password">
                  Password
                </Label>
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field }) => (
                    <InputPasswordToggle
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="mb-1">
                <Label for="terms">
                  <Controller
                    id="terms"
                    name="terms"
                    control={control}
                    rules={{
                      required: "You must accept the terms and conditions",
                    }}
                    render={({ field }) => (
                      <div>
                        <input type="checkbox" {...field} />I agree to the terms
                        and conditions
                      </div>
                    )}
                  />
                </Label>
                {errors.terms && (
                  <FormFeedback>{errors.terms.message}</FormFeedback>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" color="primary" block>
                Sign up
              </Button>
            </Form>

            <p className="text-center mt-2">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
