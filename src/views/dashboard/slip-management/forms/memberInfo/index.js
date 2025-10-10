import { Fragment, useEffect, useRef, useState } from "react";
import withReactContent from "sweetalert2-react-content";
// ** Third Party Components
import { yupResolver } from "@hookform/resolvers/yup";
import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Spinner, UncontrolledAlert } from "reactstrap";
import Swal from "sweetalert2";
import * as yup from "yup";
// ** Reactstrap Imports
import "@styles/react/libs/react-select/_react-select.scss";
import ReactCountryFlag from "react-country-flag";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Tooltip,
} from "reactstrap";
import { countries } from "../../../slip-management/CountryCode";

import { useNavigate } from "react-router-dom";
import RenewalContract from "../memberInfo/RenewalContract";

const PersonalInfo = ({ fetchLoader, slipData }) => {
  console.log("sllipdata", slipData);

  const MySwal = withReactContent(Swal);
  const [checkvesel, setCheckvessel] = useState(null);
  const [checkMember, setCheckMember] = useState(null);
  const toast = useRef(null);

  const [isAssign, setIsAssigned] = useState(null);
  const [selectedFullName, setSelectedFullName] = useState(null);
  const [SelectedDetails, setSelectedDetails] = useState(null);
  const [visible, setVisible] = useState(false);
  const [View, SetView] = useState(true);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [ErrMsz, setErrMsz] = useState("");

  const [loading, setLoading] = useState(false);
  const SignupSchema = yup.object().shape({
    firstName: yup
      .string()
      .required("First Name is required")
      .matches(
        /^[a-zA-Z\s]+$/,
        "First Name must contain only alphabetic characters and spaces"
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
      .required("Zip Code is required")
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
  });

  const { member } = slipData;

  useEffect(() => {
    // {{ }}
    setIsAssigned(slipData?.isAssigned);
    setCheckvessel(slipData?.vessel);
    setCheckMember(slipData?.member);
 
    // console.log("assigne",slipData?.vessel);
  }, [slipData]);
  const onSubmit = async (data) => {
    setLoading(true);
    const {
      firstName,
      lastName,
      emailId,
      address,
      countryCode,
      phoneNumber,
      city,
      state,
      country,
      postalCode,
      secondaryGuestName,
      secondaryEmail,
      secondaryPhoneNumber,
    } = data;
    {
    }

    const payload = {
      firstName,
      lastName,
      emailId,
      address,
      countryCode: countryCode.dial_code,
      dialCodeCountry: countryCode?.code || "",

      phoneNumber,
      city,
      state,
      country,
      postalCode,
      secondaryGuestName,
      secondaryEmail,
      secondaryPhoneNumber,
      slipId: slipData.id,
    };
    let memberId;
    try {
      const res = await useJwt.UpdateMember(member.uid, payload);
      memberId = res.data.id;
      if (res?.data?.code === 200) {
        toast.current.show({
          severity: "success",
          summary: "Successfully updated",
          detail: "Your Member Details Update Successfully",
          life: 2000,
        });

        setTimeout(() => {
          navigate("/dashboard/slipmember_list");
        }, 2000); // same as toast life
      }
    } catch (error) {
      console.error("Error submitting vessel details:", error);

      if (error.response && error.response.data) {
        const { status } = error.response;
        const { content } = error.response.data;
        console.log(content);

        switch (status) {
          case 400:
          case 401:
          case 403:
          case 404:
          case 500:
            setErrMsz(content);
            break;
          default:
            setErrMsz(content);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const { vessel } = slipData;
  const { payment } = slipData;

  useEffect(() => {
    if (member) {
      // {{ }}
      const matchedCountryOption = countryOptions.find(
        (option) =>
          option.code === member?.dialCodeCountry?.value ||
          option.code === member?.dialCodeCountry
      );
      Object.keys(member).forEach((key) => {
        setValue(key, member[key] || null);
        setValue("countryCode", matchedCountryOption || null);
      });
    }

    if (vessel) {
      Object.keys(vessel).forEach((key) => {
        setValue(key, vessel[key] || "0");
      });
    }

    if (payment && Array.isArray(payment) && payment.length > 0) {
      payment.forEach((paymentItem, index) => {
        setValue("finalPayment", paymentItem?.finalPayment || "NA");
        setValue("nextPaymentDate", paymentItem.nextPaymentDate);
        setValue("paidIn", paymentItem.paidIn);
        setValue("renewalDate", paymentItem.renewalDate);
        setValue("contractDate", paymentItem.contractDate);
      });
    }
  }, [member, slipData, vessel, payment]);

  const countryOptions = React.useMemo(
    () =>
      countries.map((country) => ({
        value: `${country.code}-${country.dial_code}`,
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
        dial_code: country.dial_code,
      })),
    [countries]
  );

  const handleEditBtn = () => {
    SetView(false);
    console.log("now i can view anything");
  };

  const handleRenwalContract = () => {
    setShow(true);
  };

  const getReadOnlyStyle = () => {
    return View
      ? {
          color: "#000",
          backgroundColor: "#fff",
          opacity: 1,
        }
      : {};
  };

  const [tooltipOpen, setTooltipOpen] = useState({
    edit: false,
    RenewContract: false,
    takePayment: false,
    purchaseOrder: false,
    listEmpty: false,
  });

  const toggleTooltip = (tooltip) => {
    setTooltipOpen((prevState) => ({
      ...prevState,
      [tooltip]: !prevState[tooltip],
    }));
  };

  const watchFields = watch([
    "address",
    "lastName",
    "firstName",
    "city",
    "state",
    "phoneNumber",
    "country",
    "postalCode",
    "emailId",
  ]);

  useEffect(() => {
    const sanitizeValue = (value, type) => {
      if (!value) return value;

      switch (type) {
        case "state":
        case "address":
        case "city":
          return value.replace(/[^a-zA-Z ]/g, "");
        case "firstName":
        case "lastName":
        case "secondaryGuestName":
        case "country":
        case "state":
          return value.replace(/[^a-zA-Z ]/g, "");
        case "emailId":
          return value.replace(/[^a-zA-Z0-9@.]/g, "");
        case "phoneNumber":
          return value.replace(/[^0-9]/g, "");

        default:
          return value.replace(/[^a-zA-Z0-9\s]/g, "");
      }
    };

    const fieldNames = [
      "address",
      "lastName",
      "firstName",
      "city",
      "state",
      "phoneNumber",
      "country",
      "postalCode",
      "emailId",
    ];

    fieldNames.forEach((fieldName, index) => {
      const watchedValue = watchFields[index];
      const sanitized = sanitizeValue(watchedValue, fieldName);

      if (watchedValue !== sanitized) {
        setValue(fieldName, sanitized);
      }
    });
  }, [watchFields.join("|")]);

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

  return (
    <Fragment>
      <Card>
        <Toast ref={toast} />

        <CardHeader className="border-bottom">
          <CardTitle tag="h5">
            {!View ? "Edit Member Details" : "Member Details"}
          </CardTitle>

          <div className="d-flex justify-content-end gap-2">
            {checkMember && (
              <>
                <div>
                  <img
                    width="20"
                    height="20"
                    id="editTooltip"
                    src="https://img.icons8.com/ios/50/edit--v1.png"
                    alt="edit"
                    onClick={handleEditBtn}
                    style={{ cursor: "pointer" }}
                  />
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen.edit}
                    target="editTooltip"
                    toggle={() => toggleTooltip("edit")}
                  >
                    Edit
                  </Tooltip>
                </div>
              </>
            )}

            {/* <div>
              <img
                id="RenewContract"
                width="25"
                height="25"
                src="https://img.icons8.com/ios/50/renew-subscription.png"
                alt="renew-subscription"
                onClick={handleRenwalContract}
                style={{ cursor: "pointer" }}
              />

              <Tooltip
                placement="top"
                isOpen={tooltipOpen.switchSlip}
                target="RenewContract"
                toggle={() => toggleTooltip("switchSlip")}
              >
                Update/Renew Contract
              </Tooltip>
            </div>

            <div>
              <Link>
                <img
                  width="25"
                  height="25"
                  id="takePaymentTooltip"
                  src="https://img.icons8.com/ios/50/online-payment-.png"
                  alt="online-payment"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.takePayment}
                  target="takePaymentTooltip"
                  toggle={() => toggleTooltip("takePayment")}
                >
                  Take Slip Payment
                </Tooltip>
              </Link>
            </div>
            <div>
              <Link>
                <img
                  width="25"
                  height="25"
                  id="purchaseOrderTooltip"
                  src="https://img.icons8.com/ios/50/purchase-order.png"
                  alt="purchase-order"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.purchaseOrder}
                  target="purchaseOrderTooltip"
                  toggle={() => toggleTooltip("purchaseOrder")}
                >
                  Send Rental Invoice
                </Tooltip>
              </Link>
            </div>
            <div>
              <Link>
                <img
                  width="25"
                  height="25"
                  id="listEmptyTooltip"
                  src="https://img.icons8.com/fluency-systems-regular/50/list-is-empty.png"
                  alt="list-is-empty"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.listEmpty}
                  target="listEmptyTooltip"
                  toggle={() => toggleTooltip("listEmpty")}
                >
                  Make Empty Slip
                </Tooltip>
              </Link>
            </div> */}
          </div>
        </CardHeader>

        <CardBody className="py-2 my-25">
          <Form onSubmit={handleSubmit(onSubmit)}>
            {ErrMsz && (
              <React.Fragment>
                <UncontrolledAlert color="danger">
                  <div className="alert-body">
                    <span className="text-danger fw-bold">{ErrMsz}</span>
                  </div>
                </UncontrolledAlert>
              </React.Fragment>
            )}

            {checkMember && (
              <>
                <Row>
                  <RenewalContract setShow={setShow} show={show} />

                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="firstName">
                      First Name
                    </Label>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Sirf letters aur spaces allow
                            const sanitizedValue = value.replace(
                              /[^a-zA-Z ]/g,
                              ""
                            );
                            field.onChange(sanitizedValue);
                          }}
                          invalid={!!errors.firstName}
                          readOnly={View}
                          style={getReadOnlyStyle()}
                        />
                      )}
                    />
                    {errors.firstName && (
                      <FormFeedback>{errors.firstName.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="lastName">
                      Last Name
                    </Label>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          invalid={errors.lastName && true}
                          readOnly={View}
                          style={getReadOnlyStyle()}
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
                    </Label>
                    <Controller
                      id="emailId"
                      name="emailId"
                      control={control}
                      render={({ field }) => (
                        <Input
                          invalid={errors.emailId && true}
                          {...field}
                          readOnly={View}
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
                    </Label>
                    <Controller
                      id="address"
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <Input
                          invalid={errors.address && true}
                          {...field}
                          readOnly={View}
                          style={getReadOnlyStyle()}
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
                      render={({ field }) => (
                        <Select
                          {...field}
                          readOnly={View}
                          style={getReadOnlyStyle()}
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
                    </Label>{" "}
                    <Controller
                      name="phoneNumber"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Phone number is required" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="tel"
                          placeholder="Enter phone number"
                          invalid={errors.phoneNumber && true}
                          readOnly={View}
                          style={getReadOnlyStyle()}
                        />
                      )}
                    />
                    {errors.phoneNumber && (
                      <small className="text-danger">
                        {errors.phoneNumber.message}
                      </small>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="city">
                      City
                    </Label>
                    <Controller
                      id="city"
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Input
                          invalid={errors.city && true}
                          {...field}
                          readOnly={View}
                          style={getReadOnlyStyle()}
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
                    </Label>
                    <Controller
                      id="state"
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Input
                          invalid={errors.state && true}
                          {...field}
                          readOnly={View}
                          style={getReadOnlyStyle()}
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
                    </Label>
                    <Controller
                      id="country"
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Input
                          invalid={errors.country && true}
                          {...field}
                          readOnly={View}
                          style={getReadOnlyStyle()}
                        />
                      )}
                    />
                    {errors.country && (
                      <FormFeedback>{errors.country.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="postalCode">
                      Zip Code
                    </Label>
                    <Controller
                      name="postalCode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            let input = e.target.value;
                            // Keep only digits
                            input = input.replace(/\D/g, "");
                            // Limit to 5 characters
                            if (input.length > 5) input = input.slice(0, 5);
                            field.onChange(input);
                          }}
                          maxLength={5} // prevents typing more than 5 chars
                          invalid={!!errors.postalCode}
                          readOnly={View}
                          style={getReadOnlyStyle()}
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
                      name="secondaryGuestName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            let input = e.target.value;
                            // Keep only letters (A–Z, a–z) and spaces
                            input = input.replace(/[^A-Za-z ]/g, "");
                            field.onChange(input);
                          }}
                          invalid={!!errors.secondaryGuestName}
                          readOnly={View}
                          style={getReadOnlyStyle()}
                        />
                      )}
                    />
                    {errors.secondaryGuestName && (
                      <FormFeedback>
                        {errors.secondaryGuestName.message}
                      </FormFeedback>
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
                          invalid={errors.secondaryEmail && true}
                          {...field}
                          readOnly={View}
                          style={getReadOnlyStyle()}
                          onChange={(e) => {
                            // Allow letters, numbers, @, ., -, _
                            const value = e.target.value.replace(
                              /[^a-zA-Z0-9@.]/g,
                              ""
                            );
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                    {errors.secondaryEmail && (
                      <FormFeedback>
                        {errors.secondaryEmail.message}
                      </FormFeedback>
                    )}
                  </Col>
<Controller
  id="secondaryPhoneNumber"
  name="secondaryPhoneNumber"
  control={control}
  render={({ field }) => (
    <Input
      invalid={errors.secondaryPhoneNumber && true}
      {...field}
      readOnly={View}
      style={getReadOnlyStyle()}
      onChange={(e) => {
        // Trim spaces
        let value = e.target.value.trim();

        // Allow only numbers
        value = value.replace(/[^0-9]/g, "");

        // Restrict length to max 13
        if (value.length > 13) {
          value = value.slice(0, 13);
        }

        // If empty → set as null, else set the value
        field.onChange(value === "" ? null : value);
      }}
    />
  )}
/>

                </Row>
              </>
            )}

            {checkvesel ? (
              <>
                <CardTitle tag="h5" className="mt-2">
                  {" "}
                  Vessel Details
                </CardTitle>

                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="vesselName">
                      Vessel Name
                    </Label>
                    <Controller
                      control={control}
                      name="vesselName"
                      rules={{
                        required: "Vessel Name is required",
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          style={getReadOnlyStyle()}
                          invalid={errors.vesselName && true}
                          {...field}
                          disabled={true}
                        />
                      )}
                    />
                    {errors.vesselName && (
                      <FormFeedback>{errors.vesselName.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="6" className="mb-1">
                    <Label
                      className="form-label"
                      for="vesselRegistrationNumber"
                    >
                      Vessel Registration Number{" "}
                    </Label>
                    <Controller
                      control={control}
                      rules={{
                        required: "Vessel Registration Number is required",
                      }}
                      name="vesselRegistrationNumber"
                      render={({ field }) => (
                        <Input
                          type="text"
                          style={getReadOnlyStyle()}
                          invalid={errors.vesselRegistrationNumber && true}
                          {...field}
                          disabled={true}
                        />
                      )}
                    />
                    {errors.vesselRegistrationNumber && (
                      <FormFeedback>
                        {errors.vesselRegistrationNumber.message}
                      </FormFeedback>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="vesselName">
                      length
                    </Label>
                    <Controller
                      control={control}
                      name="length"
                      rules={{
                        required: "Vessel length is required",
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          style={getReadOnlyStyle()}
                          invalid={errors.length && true}
                          {...field}
                          disabled={true}
                        />
                      )}
                    />
                    {errors.length && (
                      <FormFeedback>{errors.length.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="6" className="mb-1">
                    <Label
                      className="form-label"
                      for="vesselRegistrationNumber"
                    >
                      width
                    </Label>
                    <Controller
                      control={control}
                      rules={{
                        required: " width  is required",
                      }}
                      name="width"
                      render={({ field }) => (
                        <Input
                          type="text"
                          style={getReadOnlyStyle()}
                          invalid={errors.width && true}
                          {...field}
                          disabled={true}
                        />
                      )}
                    />
                    {errors.width && (
                      <FormFeedback>{errors.width.message}</FormFeedback>
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="height">
                      height
                    </Label>
                    <Controller
                      control={control}
                      name="height"
                      rules={{
                        required: "height length is required",
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          style={getReadOnlyStyle()}
                          invalid={errors.height && true}
                          {...field}
                          disabled={true}
                        />
                      )}
                    />
                    {errors.height && (
                      <FormFeedback>{errors.height.message}</FormFeedback>
                    )}
                  </Col>
                </Row>
              </>
            ) : (
              <CardTitle
                tag="h5"
                className="d-flex justify-content-center text-align-center "
              >
                {" "}
                Data Not Found
              </CardTitle>
            )}

            {isAssign && (
              <>
                <CardTitle tag="h5" className="mt-2">
                  {" "}
                  Payment Details
                </CardTitle>

                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="landmark">
                      Total Amount
                    </Label>

                    <Controller
                      name="finalPayment"
                      control={control}
                      rules={{
                        required: "Final Payment is required",
                      }}
                      render={({ field }) => (
                        <Input
                          style={getReadOnlyStyle()}
                          invalid={errors.finalPayment && true}
                          {...field}
                          // readOnly={true}
                          disabled={true}
                        />
                      )}
                    />
                    {errors.finalPayment && (
                      <FormFeedback>{errors.finalPayment.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="landmark">
                      Contract Date
                    </Label>

                    <Controller
                      name="contractDate"
                      control={control}
                      rules={{
                        required: "contractDate is required",
                      }}
                      render={({ field }) => (
                        <Input
                          style={getReadOnlyStyle()}
                          invalid={errors.contractDate && true}
                          {...field}
                          disabled={true}
                        />
                      )}
                    />
                    {errors.contractDate && (
                      <FormFeedback>{errors.contractDate.message}</FormFeedback>
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="landmark">
                      Renewal Date
                    </Label>

                    <Controller
                      name="renewalDate"
                      control={control}
                      rules={{
                        required: "renewalDate is required",
                      }}
                      render={({ field }) => (
                        <Input
                          style={getReadOnlyStyle()}
                          invalid={errors.renewalDate && true}
                          {...field}
                          disabled={true}
                        />
                      )}
                    />
                    {errors.renewalDate && (
                      <FormFeedback>{errors.renewalDate.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="landmark">
                      Next Payment Date
                    </Label>

                    <Controller
                      name="nextPaymentDate"
                      control={control}
                      rules={{
                        required: "next Payment Date is required",
                      }}
                      render={({ field }) => (
                        <Input
                          style={getReadOnlyStyle()}
                          invalid={errors.nextPaymentDate && true}
                          {...field}
                          disabled={true}
                        />
                      )}
                    />
                    {errors.nextPaymentDate && (
                      <FormFeedback>
                        {errors.nextPaymentDate.message}
                      </FormFeedback>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="landmark">
                      Paid In
                    </Label>

                    <Controller
                      name="paidIn"
                      control={control}
                      rules={{
                        required: "paidIn is required",
                      }}
                      render={({ field }) => (
                        <Input
                          style={getReadOnlyStyle()}
                          invalid={errors.paidIn && true}
                          {...field}
                          disabled={true}
                        />
                      )}
                    />
                    {errors.paidIn && (
                      <FormFeedback>{errors.paidIn.message}</FormFeedback>
                    )}
                  </Col>
                </Row>
              </>
            )}
            {checkvesel && (
              <>
                <div className="d-flex mt-2 justify-content-end gap-2">
                  <div className="d-flex">
                    <Button
                      type="reset"
                      onClick={() => reset()}
                      className="btn-reset me-2"
                      disabled={View}
                    >
                      <span className="align-middle d-sm-inline-block d-none">
                        Reset
                      </span>
                    </Button>

                    <Button
                      disabled={View || loading}
                      type="submit"
                      color="primary"
                      className="btn-next"
                    >
                      <span className="align-middle d-sm-inline-block d-none">
                        {loading ? (
                          <>
                            {" "}
                            loading.. <Spinner size="sm" />{" "}
                          </>
                        ) : (
                          "Update"
                        )}
                      </span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};
export default PersonalInfo;
