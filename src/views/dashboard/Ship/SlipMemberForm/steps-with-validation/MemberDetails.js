import { Fragment, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Third Party Components
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useJwt from "@src/auth/jwt/useJwt";

// ** Utils
import { selectThemeColors } from "@utils";
// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
// import { useLocation } from "react-router-dom";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
const PersonalInfo = ({ stepper, slipId }) => {
  const MySwal = withReactContent(Swal);

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
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  


  const onSubmit = async (data) => {
    const payload = {
      ...data,
      slipId: slipId,
    };
    console.log("Submitted Data:", payload);

    try {
      await useJwt.postsMember(payload);
      // console.log("API Response:", response);
      return MySwal.fire({
        title: "Successfully Created",
        text: " Your Vessel Details Created Successfully",
        icon: "success",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      }).then(() => {
        if (Object.keys(errors).length === 0) {
          stepper.next();
        }
      });
    } catch (error) {
      console.error("Error submitting vessel details:", error);
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

    // console.log("vessel dimensions ", payload);
  };

  useEffect(() => {
    // const allValues = watch();
    // const values = getValues()
    // console.log(values);

  }, );

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Member Info</h5>
        <small>Enter Your Personal Info.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="slipName">
              Member Name
              {/* <span style={{ color: "red" }}>*</span> */}
            </Label>
            <Controller
              name="slipName"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  // value={selectedSlipname}
                  // onChange={(option) => {
                  //   field.onChange(option?.value);
                  //   handleSlipChange(option); // Handle slip change
                  // }}
                  // options={slipNames}
                  isClearable
                  placeholder="Select Slip Name"
                />
              )}
            />
            {errors.slipName && (
              <FormFeedback>{errors.slipName.message}</FormFeedback>
            )}
          </Col>
        </Row>

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
        <div className="d-flex justify-content-between">
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

          {/* Submit and Reset Button Group */}
          <div className="d-flex">
            <Button type="reset" color="primary" onClick={()=>reset()} className="btn-reset me-2">
              <span className="align-middle d-sm-inline-block d-none">
                Reset
              </span>
            </Button>

            <Button type="submit" color="primary" className="btn-next">
              <span className="align-middle d-sm-inline-block d-none">
                Next
              </span>
              <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
            </Button>
          </div>
        </div>
      </Form>
    </Fragment>
  );
};
export default PersonalInfo;
