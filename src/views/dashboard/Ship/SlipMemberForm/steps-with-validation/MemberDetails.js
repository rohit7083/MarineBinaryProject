import { Fragment, useEffect, useState,useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "react-phone-input-2/lib/bootstrap.css";
import { countries } from "../../../slip-management/CountryCode";
import ReactCountryFlag from "react-country-flag";

import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, UserPlus, Users, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useJwt from "@src/auth/jwt/useJwt";
import React from "react";
import { Spinner, UncontrolledAlert, InputGroup } from "reactstrap";
// ** Utils
import { selectThemeColors } from "@utils";
// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

// ** Sweet Alert
const MySwal = withReactContent(Swal);

const PersonalInfo = ({
  stepper,
  slipIID,
  formData,
  slipId,
  setMemberID,
  memberID,
  fetchLoader,
  sId,
}) => {
  console.log({ formData });
  const toast = useRef(null);

  const [fullname, setFullname] = useState([]);
  const [selectedFullName, setSelectedFullName] = useState(null);
  const [SelectedDetails, setSelectedDetails] = useState(null);
  const [visible, setVisible] = useState(false);
  const [ErrMsz, setErrMsz] = useState("");
  const [newMember, setNewMember] = useState(false);
  const [exMember, setExMember] = useState(false);
  const [loading, setLoading] = useState(false);
  const SignupSchema = yup.object().shape({
    firstName: yup
      .string()
      .required("First Name is required")
      .matches(
        /^[a-zA-Z]+$/,
        "First Name must contain only alphabetic characters"
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
    // phoneNumber: yup
    //   .string()
    //   .matches(/^[0-9]{10}$/, "Phone Number must be exactly 10 digits")
    //   .required("Phone Number is required"),
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

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
    defaultValues: {
      // firstName: "hello",
      // lastName: "surname",
      // emailId: "rohit@gmail.com",
      // phoneNumber: "1234567890",
      // countryCode: { value: "+91", label: "+91" },
      // address: "satpur",
      // city: "nashik",
      // state: "maharstra",
      // country: "india",
      // postalCode: "12365",
      secondaryPhoneNumber: null,
    },
  });
  const handleSweetAlert = (title, text, next) => {
    return MySwal.fire({
      title,
      text,
      icon: "success",
      customClass: {
        confirmButton: "btn btn-primary",
      },
      buttonsStyling: false,
    }).then(() => {
      // if (Object.keys(errors).length === 0) {
      stepper.next();
      // /}
    });
  };
  useEffect(() => {
    if (Object.keys(formData)?.length) {
      const countryCode = countries.find(
        (country) => country.dial_code === formData?.countryCode
      );
      console.log("countryCode", countryCode);
      const data = {
        ...formData,
        countryCode: countryCode
          ? {
              value: countryCode.dial_code,
              code: countryCode.code,
              label: (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ReactCountryFlag
                    countryCode={countryCode.code}
                    svg
                    style={{
                      width: "1.5em",
                      height: "1.5em",
                      marginRight: "8px",
                    }}
                  />
                  {countryCode.name} ({countryCode.dial_code})
                </div>
              ),
            }
          : null,
      };

      reset(data);
      console.log("formData", data);
    }
  }, [reset, formData]);
  // console.clear();
  // console.log('watch', watch('countryCode'));

  // useEffect(() => {
  //   if (Object.keys(formData)?.length) {
  //     const data = { ...formData};

  //     reset(data);
  //   }
  // }, [reset, formData]);

  const handleMemberChange = (option) => {
    setSelectedFullName(option);
   
    if (option?.details) {
      console.log("Selected Member Details:", option.details);
    }
    setSelectedDetails(option.details);

    setValue("firstName", option.details.firstName || "");
    setValue("lastName", option.details.lastName || "");
    setValue("emailId", option.details.emailId || "");

    const selectedCountryCodeOption = countryOptions.find(
      (opt) => opt.value === option.details.countryCode
    );
    setValue("countryCode", selectedCountryCodeOption || null);
    
    // setValue("countryCode", option.details.countryCode || "");

    setValue("phoneNumber", option.details.phoneNumber || "");
    setValue("address", option.details.address || "");
    setValue("city", option.details.city || "");
    setValue("state", option.details.state || "");
    setValue("postalCode", option.details.postalCode || "");
    setValue("secondaryGuestName", option.details.secondaryGuestName || null);
    setValue("secondaryEmail", option.details.secondaryEmail || null);
    setValue("country", option.details.country || "");

    setVisible(true);
  };

  const onSubmit = async (data) => {
    console.log("data", data);

    setErrMsz("");

    setLoading(true);
    const payload = {
      ...data,
      slipId: slipIID || sId,
      countryCode: data?.countryCode?.value || data?.countryCode,
    };
    let memberId;
    try {
      if (payload.createdBy) {
        const res = await useJwt.UpdateMember(formData.uid, payload);
        // ** set here
        memberId = res?.data?.id;
        console.log(memberId);

        if (res.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Member Details updated Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            stepper.next();
          }, 2000);
        }

      } else {
        const res = await useJwt.postsMember(payload);

        memberId = res?.data?.id;
        console.log("memberid ", memberId);

        if (res.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Cretaed Successfully",
            detail: "Member Details Created Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            stepper.next();
          }, 2000);
        }
      }
      setMemberID(memberId);
    } catch (error) {
      console.error("Error submitting vessel details:", error);
      if (error.response && error.response.data) {
        const { status } = error.response;
        const { content } = error.response.data;

        setErrMsz((prev) => {
          const newMsz = content || "Un unexpected error occurred";
          return prev !== newMsz ? newMsz : prev + " ";
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setErrMsz("");
    try {
      const response = await useJwt.getslip();

      const options = response.data.content.result
        .filter(
          (item) =>
            item.member && (item.member.firstName || item.member.lastName)
        )
        .map((item) => ({
          value: item.member?.uid,
          label: `${item.member?.firstName || ""} ${
            item.member?.lastName || ""
          }`.trim(),
          details: item.member,
        }));

      console.log("Filtered response:", response);

      setFullname(options);
    } catch (error) {
      console.error("Error fetching slip details:", error);
      if (error.response && error.response.data) {
        const { status } = error.response;
        const { content } = error.response.data;

        setErrMsz((prev) => {
          const newMsz = content || "Un expected Error occurred";
          return prev !== newMsz ? newMsz : prev + " ";
        });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getReadOnlyStyle = () => {
    return visible
      ? {
          color: "#000",
          backgroundColor: "#fff",
          opacity: 1,
        }
      : {};
  };

  if (fetchLoader)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4rem",
        }}
      >
        <Spinner
          color="primary"
          style={{
            height: "5rem",
            width: "5rem",
          }}
        />
      </div>
    );
  console.log("error", errors);

  const avoidSpecialChar = (e, field) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    field.onChange(value);
  };
  const addNum_Alphabetics = (e, field) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    field.onChange(value);
  };

  const countryOptions = countries.map((country) => ({
    value: country.dial_code,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ReactCountryFlag
          countryCode={country.code}
          svg
          style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
        />
        {country.name} ({country.dial_code})
      </div>
    ),
    code: country.code,
  }));
  return (
    <Fragment>
            <Toast ref={toast} />
      <div className="content-header">
        <h5 className="mb-0">Member Info</h5>
        <small>Enter Your Personal Info.</small>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {ErrMsz && (
          <React.Fragment>
            <UncontrolledAlert color="danger">
              <div className="alert-body">
                <span className="text-danger fw-bold">
                  <strong>Error : </strong>{ErrMsz}</span>
              </div>
            </UncontrolledAlert>
          </React.Fragment>
        )}

        <div className="d-flex gap-2 mb-2">
          <Button
            onClick={() => {
              setNewMember(true);
              setExMember(false);
            }}
            color="primary"
            className="btn-next"
            size="sm"
          >
            <UserPlus className="me-1" size={20} />
            Add New Member
          </Button>
          <Button
          size="sm" 
            onClick={() => {
              setExMember(true);
              setNewMember(false);
            }}
            color="primary"
            className="btn-next"
          >
            <Users className="me-1" size={20} />
            Existing Member
          </Button>
        </div>

        <>
          {exMember && (
            <Row>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="slipName">
                  Member Name
                  {/* <span style={{ color: "red" }}>*</span> */}
                </Label>
                <Controller
                  name="uid"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={selectedFullName}
                      onChange={(option) => {
                        field.onChange(option?.value);
                        handleMemberChange(option); // Handle slip change
                      }}
                      options={fullname}
                      isClearable
                      placeholder="Select Slip Name"
                    />
                  )}
                />
                {errors.uid && (
                  <FormFeedback>{errors.uid.message}</FormFeedback>
                )}
              </Col>
            </Row>
          )}
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
                    // readOnly={visible}
                    style={getReadOnlyStyle()}
                    onChange={(e) => avoidSpecialChar(e, field)}
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
                    // readOnly={visible}
                    style={getReadOnlyStyle()}
                    onChange={(e) => avoidSpecialChar(e, field)}
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
                    placeholder="Enter Email"
                    invalid={errors.emailId && true}
                    {...field}
                    // readOnly={visible}
                    style={getReadOnlyStyle()}
                  />
                )}
              />
              {errors.emailId && (
                <FormFeedback>{errors.emailId.message}</FormFeedback>
              )}
            </Col>

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
                    // readOnly={visible}
                    style={getReadOnlyStyle()}
                    onChange={(e) => addNum_Alphabetics(e, field)}
                  />
                )}
              />
              {errors.address && (
                <FormFeedback>{errors.address.message}</FormFeedback>
              )}
            </Col>
          </Row>
          <Row>
            <Col md="6" className="mb-1">
              <Label sm="3" for="phone">
                Country Code
              </Label>

              <Controller
                name="countryCode"
                control={control}
                // defaultValue={countryOptions[0]}
                rules={{
                  required: "Country code is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={countryOptions}
                    onChange={(option) => field.onChange(option)}
                    value={countryOptions.find(
                      (option) => option.value === field.value?.value
                    )}
                  />
                )}
              />
              {errors.countryCode && (
                <small className="text-danger">
                  {errors.countryCode.message}
                </small>
              )}
            </Col>

            <Col md="6" className="mb-1">
              <Label sm="3" for="phone">
                Phone Number
              </Label>

              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: "Enter a valid international phone number",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Enter phone number"
                  />
                )}
              />
              {errors.phoneNumber && (
                <small className="text-danger">
                  {errors.phoneNumber.message}
                </small>
              )}
              {/* </FormGroup> */}
            </Col>
          </Row>

          <Row>
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
                    // readOnly={visible}
                    style={getReadOnlyStyle()}
                    onChange={(e) => avoidSpecialChar(e, field)}
                  />
                )}
              />
              {errors.city && (
                <FormFeedback>{errors.city.message}</FormFeedback>
              )}
            </Col>
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
                    // readOnly={visible}
                    style={getReadOnlyStyle()}
                    onChange={(e) => avoidSpecialChar(e, field)}
                  />
                )}
              />
              {errors.state && (
                <FormFeedback>{errors.state.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <Row>
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
                    // readOnly={visible}
                    style={getReadOnlyStyle()}
                    onChange={(e) => avoidSpecialChar(e, field)}
                  />
                )}
              />
              {errors.country && (
                <FormFeedback>{errors.country.message}</FormFeedback>
              )}
            </Col>

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
                    // readOnly={visible}
                    style={getReadOnlyStyle()}
                    onChange={(e) => {
                      let OnlyNumAllow = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(OnlyNumAllow);
                    }}
                  />
                )}
              />
              {errors.postalCode && (
                <FormFeedback>{errors.postalCode.message}</FormFeedback>
              )}
            </Col>
          </Row>
          <Row>
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
                    // readOnly={visible}
                    style={getReadOnlyStyle()}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters and spaces
                      field.onChange(value === "" ? null : value); // Convert empty string to null
                    }}
                  />
                )}
              />
              {errors.secondaryGuestName && (
                <FormFeedback>{errors.secondaryGuestName.message}</FormFeedback>
              )}
            </Col>
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
                    // readOnly={visible}
                    style={getReadOnlyStyle()}
                  />
                )}
              />
              {errors.secondaryEmail && (
                <FormFeedback>{errors.secondaryEmail.message}</FormFeedback>
              )}
            </Col>
          </Row>
          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label" for="secondaryPhoneNumber">
                Secondary Phone Number (optional)
              </Label>
              <Controller
                name="secondaryPhoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Secondary Phone Number"
                    invalid={errors.secondaryPhoneNumber && true}
                    {...field}
                    style={getReadOnlyStyle()}
                    onChange={(e) => {
                      let OnlyNumAllow = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(OnlyNumAllow == "" ? null : OnlyNumAllow);
                      console.log(OnlyNumAllow);
                    }}
                  />
                )}
              />
              {errors.secondaryPhoneNumber && (
                <FormFeedback>
                  {errors.secondaryPhoneNumber.message}
                </FormFeedback>
              )}
            </Col>
          </Row>

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
              <Button
                type="reset"
                onClick={() => reset()}
                className="btn-reset me-2"
              >
                <span className="align-middle d-sm-inline-block d-none">
                  Reset
                </span>
              </Button>

              <Button
                type="submit"
                color="primary"
                disabled={loading}
                className="btn-next"
              >
                <span className="align-middle d-sm-inline-block d-none">
                  {loading ? (
                    <>
                      <span>Loading.. </span>
                      <Spinner size="sm" />{" "}
                    </>
                  ) : (
                    "Next"
                  )}
                </span>
                {loading ? null : (
                  <ArrowRight
                    size={14}
                    className="align-middle ms-sm-25 ms-0"
                  />
                )}
              </Button>
            </div>
          </div>
        </>
      </Form>
    </Fragment>
  );
};
export default PersonalInfo;
