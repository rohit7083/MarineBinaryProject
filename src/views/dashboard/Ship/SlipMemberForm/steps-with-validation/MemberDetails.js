// // ** React Imports
// import { Fragment, useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// // ** Third Party Components
// import Select from "react-select";
// import { useForm, Controller } from "react-hook-form";
// import { ArrowLeft, ArrowRight } from "react-feather";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// // ** Utils
// import { selectThemeColors } from "@utils";
// // ** Reactstrap Imports
// import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
// // import { useLocation } from "react-router-dom";

// // ** Styles
// import "@styles/react/libs/react-select/_react-select.scss";

// // const defaultValues = {
// //   lastName: "",
// //   firstName: "",
// //   emailId:"",
// //   phoneNumber:"",
// //   address:"",
// //   city:"",
// //   state:"",
// //   country:"",
// //   postalCode:"",

// // };

// const SignupSchema = yup.object().shape({
//   firstName: yup
//     .string()
//     .required("First Name is required")
//     .matches(
//       /^[a-zA-Z\s-]+$/,
//       "First Name must contain only alphabetic characters, hyphens, and spaces"
//     ),
//   lastName: yup
//     .string()
//     .required("Last Name is required")
//     .matches(
//       /^[a-zA-Z\s-]+$/,
//       "Last Name must contain only alphabetic characters, hyphens, and spaces"
//     ),
//   emailId: yup
//     .string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   phoneNumber: yup
//     .string()
//     .matches(/^[0-9]{10}$/, "Phone Number must be exactly 10 digits")
//     .required("Phone Number is required"),
//   address: yup
//     .string()
//     .required("Address is required")
//     .matches(
//       /^[a-zA-Z0-9\s.,]+$/,
//       "Address can contain only alphanumeric characters, spaces, dots, and commas"
//     ),
//   city: yup
//     .string()
//     .required("City is required")
//     .matches(
//       /^[a-zA-Z\s]+$/,
//       "City must contain only alphabetic characters and spaces"
//     ),
//   state: yup
//     .string()
//     .required("State is required")
//     .matches(
//       /^[a-zA-Z\s]+$/,
//       "State must contain only alphabetic characters and spaces"
//     ),
//   country: yup
//     .string()
//     .required("Country is required")
//     .matches(
//       /^[a-zA-Z\s]+$/,
//       "Country must contain only alphabetic characters and spaces"
//     ),
//   postalCode: yup
//     .string()
//     .required("Postal Code is required")
//     .matches(/^[0-9]{5,6}$/, "Postal Code must be exactly 5 Or 6 digits"),
// });

// const PersonalInfo = ({ stepper  }) => {
//  const defaultValues= {
//     lastName: "sonawane",
//     firstName: "rohan",
//     emailId: "rohan@gmail.com",
//     phoneNumber: "0123654789",
//     address: "earth",
//     city: "nashik",
//     state: "maharastra",
//     country: "india",
//     postalCode: "412563",
//   }

//   const [MemberData, setMemberData] = useState({
//     lastName: "",
//     firstName: "",
//     emailId: "",
//     phoneNumber: "",
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     postalCode: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMemberData({
//       ...MemberData,
//       [name]: value,
//     });

//   };

//   // ** Hooks
//   const {
//     control,
//     setError,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(SignupSchema),defaultValues
//   });

//   // const onSubmit = (data) => {
//   //   console.log("Submitted Data:", data);
//   //   console.log("Errors Object:", errors);
//   //   if (!vesselData) {
//   //     console.error("VesselData is not available");
//   //     return;  // Don't submit if vesselData is missing
//   //   }
//   //   const formData = {
//   //     ...data,
//   //     vesselData: vesselData || {},  // Default to an empty object if vesselData is undefined
//   //   };

//   //   console.log("Form Data with Vessel Info:", formData);
//   //   setMemberData((prev) => ({
//   //     ...prev,
//   //     ...VesselData,
//   //     lastName: data.lastName,
//   //     firstName: data.firstName,
//   //     emailId: data.emailId,
//   //     phoneNumber: data.phoneNumber,
//   //     address: data.address,
//   //     city: data.city,
//   //     state: data.state,
//   //     country: data.country,
//   //     postalCode: data.postalCode,
//   //   }));

//   //   if (Object.keys(errors).length === 0) {

//   //     stepper.next();
//   //   } else {
//   //     console.error("Validation failed. Errors:", errors);
//   //   }
//   // };

//   const onSubmit = (data) => {
//       console.log("Vessel Data passed to next step:", data);

//     setMemberData((prev) => ({
//       ...prev,
//       // ...formData,
//     }));

//     if (Object.keys(errors).length === 0) {
//       stepper.next();
//     } else {
//       console.error("Validation failed. Errors:", errors);
//     }
//   };

//   return (
//     <Fragment>
//       <div className="content-header">
//         <h5 className="mb-0">Member Info</h5>
//         <small>Enter Your Personal Info.</small>
//       </div>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Row>
//           {/* <Col md="6" className="mb-1">
//             <Label className="form-label" for="firstName">
//               Member Name
//             </Label>
//             <Controller
//               name="slipName"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   // value={selectedSlipname}
//                   // onChange={(option) => {
//                     // field.onChange(option?.value);
//                     // handleSlipChange(option); // Handle slip change
//                   // }}
//                   // options={slipNames}
//                   isClearable
//                   placeholder="Select Member  Name"
//                 />
//               )}
//             />
//             {errors.firstName && (
//               <FormFeedback>{errors.firstName.message}</FormFeedback>
//             )}
//           </Col> */}
//         </Row>

//         <Row>
//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="firstName">
//               First Name
//               <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Controller
//               id="firstName"
//               name="firstName"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.firstName}
//                   onChange={handleChange}
//                   placeholder="Enter First Name"
//                   invalid={errors.firstName && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.firstName && (
//               <FormFeedback>{errors.firstName.message}</FormFeedback>
//             )}
//           </Col>

//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="lastName">
//               Last Name
//               <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Controller
//               id="lastName"
//               name="lastName"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.lastName}
//                   onChange={handleChange}
//                   placeholder="Enter Last Name"
//                   invalid={errors.lastName && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.lastName && (
//               <FormFeedback>{errors.lastName.message}</FormFeedback>
//             )}
//           </Col>
//         </Row>
//         <Row>
//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="emailId">
//               Email
//               <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Controller
//               id="emailId"
//               name="emailId"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.emailId}
//                   onChange={handleChange}
//                   placeholder="Enter Email "
//                   invalid={errors.emailId && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.emailId && (
//               <FormFeedback>{errors.emailId.message}</FormFeedback>
//             )}
//           </Col>

//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="phoneNumber">
//               Mobile Number
//               <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Controller
//               id="phoneNumber"
//               name="phoneNumber"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.phoneNumber}
//                   onChange={handleChange}
//                   placeholder="Enter Mobile Number"
//                   invalid={errors.phoneNumber && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.phoneNumber && (
//               <FormFeedback>{errors.phoneNumber.message}</FormFeedback>
//             )}
//           </Col>
//         </Row>
//         <Row>
//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="address">
//               Address
//               <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Controller
//               id="address"
//               name="address"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.address}
//                   onChange={handleChange}
//                   placeholder="Enter Address "
//                   invalid={errors.address && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.address && (
//               <FormFeedback>{errors.address.message}</FormFeedback>
//             )}
//           </Col>

//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="city">
//               City
//               <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Controller
//               id="city"
//               name="city"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.city}
//                   onChange={handleChange}
//                   placeholder="Enter City Name"
//                   invalid={errors.city && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.city && <FormFeedback>{errors.city.message}</FormFeedback>}
//           </Col>
//         </Row>

//         <Row>
//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="state">
//               State
//               <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Controller
//               id="state"
//               name="state"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.state}
//                   onChange={handleChange}
//                   placeholder="Enter State Name"
//                   invalid={errors.state && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.state && (
//               <FormFeedback>{errors.state.message}</FormFeedback>
//             )}
//           </Col>

//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="country">
//               Country
//               <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Controller
//               id="country"
//               name="country"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.country}
//                   onChange={handleChange}
//                   placeholder="Enter Country"
//                   invalid={errors.country && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.country && (
//               <FormFeedback>{errors.country.message}</FormFeedback>
//             )}
//           </Col>
//         </Row>
//         <Row>
//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="postalCode">
//               Postal Code
//               <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Controller
//               id="postalCode"
//               name="postalCode"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.postalCode}
//                   onChange={handleChange}
//                   placeholder="Enter Postal Code"
//                   invalid={errors.postalCode && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.postalCode && (
//               <FormFeedback>{errors.postalCode.message}</FormFeedback>
//             )}
//           </Col>

//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="secondaryGuestName">
//               Secondary Guest Name (optional)
//             </Label>
//             <Controller
//               id="secondaryGuestName"
//               name="secondaryGuestName"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.secondaryGuestName}
//                   onChange={handleChange}
//                   placeholder="Enter Secondary Guest Name"
//                   invalid={errors.secondaryGuestName && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.secondaryGuestName && (
//               <FormFeedback>{errors.secondaryGuestName.message}</FormFeedback>
//             )}
//           </Col>
//         </Row>
//         <Row>
//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="secondaryEmail">
//               Secondary Email (optional)
//             </Label>
//             <Controller
//               id="secondaryEmail"
//               name="secondaryEmail"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.secondaryEmail}
//                   onChange={handleChange}
//                   placeholder="Enter Secondary Email"
//                   invalid={errors.secondaryEmail && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.secondaryEmail && (
//               <FormFeedback>{errors.secondaryEmail.message}</FormFeedback>
//             )}
//           </Col>

//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="secondaryPhoneNumber">
//               Secondary Phone Number (optional)
//             </Label>
//             <Controller
//               id="secondaryPhoneNumber"
//               name="secondaryPhoneNumber"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   value={MemberData.secondaryPhoneNumber}
//                   onChange={handleChange}
//                   placeholder="Enter Secondary Phone Number"
//                   invalid={errors.secondaryPhoneNumber && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.secondaryPhoneNumber && (
//               <FormFeedback>{errors.secondaryPhoneNumber.message}</FormFeedback>
//             )}
//           </Col>
//         </Row>

//         <div className="d-flex justify-content-between">
//           <Button
//             type="button"
//             color="primary"
//             className="btn-prev"
//             onClick={() => stepper.previous()}
//           >
//             <ArrowLeft
//               size={14}
//               className="align-middle me-sm-25 me-0"
//             ></ArrowLeft>
//             <span className="align-middle d-sm-inline-block d-none">
//               Previous
//             </span>
//           </Button>
//           <Button type="submit" color="primary" className="btn-next">
//             <span className="align-middle d-sm-inline-block d-none">Next</span>
//             <ArrowRight
//               size={14}
//               className="align-middle ms-sm-25 ms-0"
//             ></ArrowRight>
//           </Button>
//         </div>
//       </Form>
//     </Fragment>
//   );
// };

// export default PersonalInfo;

// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ** Third Party Components
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// ** Utils
import { selectThemeColors } from "@utils";
// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
// import { useLocation } from "react-router-dom";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
const PersonalInfo = ({ stepper, combinedData, setCombinedData }) => {
  const SignupSchema = yup.object().shape({
    firstName: yup
      .string()
      .required("First Name is required")
      .matches(
        /^[a-zA-Z\s-]+$/,
        "First Name must contain only alphabetic characters, hyphens, and spaces"
      ),
    lastName: yup
      .string()
      .required("Last Name is required")
      .matches(
        /^[a-zA-Z\s-]+$/,
        "Last Name must contain only alphabetic characters, hyphens, and spaces"
      ),
    emailId: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone Number must be exactly 10 digits")
      .required("Phone Number is required"),
    address: yup
      .string()
      .required("Address is required")
      .matches(
        /^[a-zA-Z0-9\s.,]+$/,
        "Address can contain only alphanumeric characters, spaces, dots, and commas"
      ),
    city: yup
      .string()
      .required("City is required")
      .matches(
        /^[a-zA-Z\s]+$/,
        "City must contain only alphabetic characters and spaces"
      ),
    state: yup
      .string()
      .required("State is required")
      .matches(
        /^[a-zA-Z\s]+$/,
        "State must contain only alphabetic characters and spaces"
      ),
    country: yup
      .string()
      .required("Country is required")
      .matches(
        /^[a-zA-Z\s]+$/,
        "Country must contain only alphabetic characters and spaces"
      ),
    postalCode: yup
      .string()
      .required("Postal Code is required")
      .matches(/^[0-9]{5}$/, "Postal Code must be exactly 5 digits"),
  });
  // const defaultValues = {
  //   lastName: "sonawane",
  //   firstName: "rohan",
  //   emailId: "rohan@gmail.com",
  //   phoneNumber: "0123654789",
  //   address: "earth",
  //   city: "nashik",
  //   state: "maharastra",
  //   country: "india",
  //   postalCode: "412563",
  // };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
    // defaultValues,
    defaultValues: combinedData.member, // Initialize with existing data
  });

  const onSubmit = (data) => {
    setCombinedData((prev) => ({
      ...prev,
      member: data,
    }));
    stepper.next();
  };

  // useEffect(() => {
  //   // console.log("Combined Data:", JSON.stringify(combinedData, null, 2));
  //   // console.log(combinedData);
  //   // console.log(errors);
  // }, []);

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Member Info</h5>
        <small>Enter Your Personal Info.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="firstName">
              First Name<span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter First Name"
                  invalid={errors.firstName && true}
                />
              )}
            />
            {errors.firstName && (
              <FormFeedback>{errors.firstName.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="lastName">
              Last Name<span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Last Name"
                  invalid={errors.lastName && true}
                />
              )}
            />
            {errors.lastName && (
              <FormFeedback>{errors.lastName.message}</FormFeedback>
            )}
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="emailId">
              Email
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="emailId"
              name="emailId"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Email "
                  invalid={errors.emailId && true}
                  {...field}
                />
              )}
            />
            {errors.emailId && (
              <FormFeedback>{errors.emailId.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="phoneNumber">
              Mobile Number
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="phoneNumber"
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Mobile Number"
                  invalid={errors.phoneNumber && true}
                  {...field}
                />
              )}
            />
            {errors.phoneNumber && (
              <FormFeedback>{errors.phoneNumber.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="address">
              Address
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="address"
              name="address"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Address "
                  invalid={errors.address && true}
                  {...field}
                />
              )}
            />
            {errors.address && (
              <FormFeedback>{errors.address.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="city">
              City
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="city"
              name="city"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter City Name"
                  invalid={errors.city && true}
                  {...field}
                />
              )}
            />
            {errors.city && <FormFeedback>{errors.city.message}</FormFeedback>}
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="state">
              State
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="state"
              name="state"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter State Name"
                  invalid={errors.state && true}
                  {...field}
                />
              )}
            />
            {errors.state && (
              <FormFeedback>{errors.state.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="country">
              Country
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="country"
              name="country"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Country"
                  invalid={errors.country && true}
                  {...field}
                />
              )}
            />
            {errors.country && (
              <FormFeedback>{errors.country.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="postalCode">
              Postal Code
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="postalCode"
              name="postalCode"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Postal Code"
                  invalid={errors.postalCode && true}
                  {...field}
                />
              )}
            />
            {errors.postalCode && (
              <FormFeedback>{errors.postalCode.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="secondaryGuestName">
              Secondary Guest Name (optional)
            </Label>
            <Controller
              id="secondaryGuestName"
              name="secondaryGuestName"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Secondary Guest Name"
                  invalid={errors.secondaryGuestName && true}
                  {...field}
                />
              )}
            />
            {errors.secondaryGuestName && (
              <FormFeedback>{errors.secondaryGuestName.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="secondaryEmail">
              Secondary Email (optional)
            </Label>
            <Controller
              id="secondaryEmail"
              name="secondaryEmail"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Secondary Email"
                  invalid={errors.secondaryEmail && true}
                  {...field}
                />
              )}
            />
            {errors.secondaryEmail && (
              <FormFeedback>{errors.secondaryEmail.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="secondaryPhoneNumber">
              Secondary Phone Number (optional)
            </Label>
            <Controller
              id="secondaryPhoneNumber"
              name="secondaryPhoneNumber"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Secondary Phone Number"
                  invalid={errors.secondaryPhoneNumber && true}
                  {...field}
                />
              )}
            />
            {errors.secondaryPhoneNumber && (
              <FormFeedback>{errors.secondaryPhoneNumber.message}</FormFeedback>
            )}
          </Col>
        </Row>
        {/* Add other fields similarly */}
        {/* <div className="d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button>
          <Button type="reset" color="primary" className="btn-next">
                <span className="align-middle d-sm-inline-block d-none">Reset</span>
              </Button>
          <Button type="submit" color="primary" className="btn-next">
             
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div> */}




<div className="d-flex justify-content-center gap-3">
<Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button>

  <Button type="reset" color="primary" className="btn-next">
    <span className="align-middle d-sm-inline-block d-none">Reset</span>
  </Button>

  <Button type="submit" color="primary" className="btn-next">
    <span className="align-middle d-sm-inline-block d-none">Next</span>
    <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
  </Button>
</div>



      </Form>
    </Fragment>
  );
};
export default PersonalInfo;
