import Sidebar from "@components/sidebar";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toast } from "primereact/toast";
import React, { Fragment, useRef, useState } from "react";
import { Check, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { countries } from "../../../dashboard/slip-management/CountryCode";

import { Button, Col, Form, FormFeedback, Input, Label, Row } from "reactstrap";

import "@styles/base/pages/app-invoice.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import ReactCountryFlag from "react-country-flag";
import "react-slidedown/lib/slidedown.css";

const CustomLabel = ({ htmlFor }) => (
  <Label className="form-check-label" htmlFor={htmlFor}>
    <span className="switch-icon-left">
      <Check size={14} />
    </span>
    <span className="switch-icon-right">
      <X size={14} />
    </span>
  </Label>
);

const ClientDetaiils = ({
  memberAppendData,
  setSelectedMember,
  setMemberAppendData,
  setOpen,
  open,
  setValueParent,
}) => {
  const [memberNames, setMemberNames] = useState([]);
  const toast = useRef(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const onSubmit = (data) => {
   
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      phoneNumber: data.phoneNumber,
      countryCode: data.countryCode?.dial_code || "",
      dialCodeCountry: data.countryCode?.code || "",
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
    };

    setMemberAppendData(payload);

    setValueParent("selectedMember", {
      label: `${data.firstName} ${data.lastName}`,
      value: JSON.stringify(payload),
      ...payload,
    });

    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Member Added Successfully.",
      life: 2000,
    });

    setTimeout(() => {
      setOpen(false);
    }, 2000);

    reset();
  };

  const avoidSpecialChar = (e, field) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    field.onChange(value);
  };

  const addNum_Alphabetics = (e, field) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
    field.onChange(value);
  };

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
  return (
    <Fragment>
      <Toast ref={toast} />
      <Sidebar
        size="lg"
        open={open}
        title="Create New Member"
        headerClassName="mb-1"
        contentClassName="p-0"
        toggleSidebar={() => setOpen(!open)}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="6" className="mb-1">
              <Label for="firstName">
                First Name<span className="text-danger">*</span>
              </Label>
              <Controller
                name="firstName"
                rules={{
                  required: "First name is required",
                  pattern: {
                    value: /^[A-Za-z\s'-]+$/,
                    message: "Only alphabetic characters allowed",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter First Name"
                    invalid={!!errors.firstName}
                    onChange={(e) => avoidSpecialChar(e, field)}
                  />
                )}
              />
              <FormFeedback>{errors.firstName?.message}</FormFeedback>
            </Col>

            <Col md="6" className="mb-1">
              <Label for="lastName">
                Last Name<span className="text-danger">*</span>
              </Label>
              <Controller
                name="lastName"
                rules={{
                  required: "Last name is required",
                  pattern: {
                    value: /^[A-Za-z\s'-]+$/,
                    message: "Only alphabetic characters allowed",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Last Name"
                    invalid={!!errors.lastName}
                    onChange={(e) => avoidSpecialChar(e, field)}
                  />
                )}
              />
              <FormFeedback>{errors.lastName?.message}</FormFeedback>
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label for="emailId">
                Email<span className="text-danger">*</span>
              </Label>
              <Controller
                name="emailId"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Email"
                    invalid={!!errors.emailId}
                    onChange={(e) => {
                      // Allow letters, numbers, dot, and @
                      const onlyValid = e.target.value.replace(
                        /[^A-Za-z0-9.@]/g,
                        ""
                      );
                      field.onChange(onlyValid);
                    }}
                  />
                )}
              />
              <FormFeedback>{errors.emailId?.message}</FormFeedback>
            </Col>

            <Col md="6" className="mb-1">
              <Label for="address">
                Address<span className="text-danger">*</span>
              </Label>
              <Controller
                name="address"
                rules={{
                  required: "Address is required",
                  pattern: {
                    value: /^[A-Za-z0-9\s,'-]*$/,
                    message: "Only letters and numbers allowed",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Address"
                    invalid={!!errors.address}
                    // onChange={(e) => addNum_Alphabetics(e, field)}
                    onChange={(e) => {
                      // Allow letters, numbers, dot, space, dash, and comma
                      const onlyValid = e.target.value.replace(
                        /[^A-Za-z0-9 .,-]/g,
                        ""
                      );
                      field.onChange(onlyValid);
                    }}
                  />
                )}
              />
              <FormFeedback>{errors.address?.message}</FormFeedback>
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label>Country Code</Label>
              <Controller
                name="countryCode"
                control={control}
                rules={{ required: "Country code is required" }}
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
              <Label>Phone Number</Label>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?[1-9]\d{1,13}$/,
                    message: "Enter a valid international phone number",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Enter phone number"
                    onChange={(e) => {
                      // Allow only numeric characters
                      let onlyNumbers = e.target.value.replace(/[^0-9]/g, "");

                      // Allow only up to 13 digits
                      if (onlyNumbers.length > 13) {
                        onlyNumbers = onlyNumbers.slice(0, 13);
                      }

                      field.onChange(onlyNumbers);
                    }}
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
              <Label>
                City<span className="text-danger">*</span>
              </Label>
              <Controller
                name="city"
                rules={{
                  required: "City is required",
                  pattern: {
                    value: /^[A-Za-z\s'-]+$/,
                    message: "Only alphabetic characters allowed",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter City"
                    invalid={!!errors.city}
                    // onChange={(e) => avoidSpecialChar(e, field)}
                    onChange={(e) => {
                      // Allow only letters and spaces
                      const onlyLettersAndSpaces = e.target.value.replace(
                        /[^A-Za-z\s]/g,
                        ""
                      );
                      field.onChange(onlyLettersAndSpaces);
                    }}
                  />
                )}
              />
              <FormFeedback>{errors.city?.message}</FormFeedback>
            </Col>

            <Col md="6" className="mb-1">
              <Label>
                State<span className="text-danger">*</span>
              </Label>
              <Controller
                name="state"
                rules={{
                  required: "State is required",
                  pattern: {
                    value: /^[A-Za-z\s'-]+$/,
                    message: "Only alphabetic characters allowed",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter State"
                    invalid={!!errors.state}
                    // onChange={(e) => avoidSpecialChar(e, field)}
                    onChange={(e) => {
                      // Allow only letters and spaces
                      const onlyLettersAndSpaces = e.target.value.replace(
                        /[^A-Za-z\s]/g,
                        ""
                      );
                      field.onChange(onlyLettersAndSpaces);
                    }}
                  />
                )}
              />
              <FormFeedback>{errors.state?.message}</FormFeedback>
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label>
                Country<span className="text-danger">*</span>
              </Label>
              <Controller
                name="country"
                rules={{
                  required: "Country is required",
                  pattern: {
                    value: /^[A-Za-z\s'-]+$/,
                    message: "Only alphabetic characters allowed",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Country"
                    invalid={!!errors.country}
                    // onChange={(e) => avoidSpecialChar(e, field)}

                    onChange={(e) => {
                      // Allow only letters and spaces
                      const onlyLettersAndSpaces = e.target.value.replace(
                        /[^A-Za-z\s]/g,
                        ""
                      );
                      field.onChange(onlyLettersAndSpaces);
                    }}
                  />
                )}
              />
              <FormFeedback>{errors.country?.message}</FormFeedback>
            </Col>

            <Col md="6" className="mb-1">
              <Label>
                Zip Code<span className="text-danger">*</span>
              </Label>
              <Controller
                name="postalCode"
                rules={{
                  required: "Zip code is required",
                  pattern: {
                    value: /^[0-9]{5}$/,
                    message: "Enter a valid postal code",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Zip Code"
                    invalid={!!errors.postalCode}
                    onChange={(e) => {
                      // Allow only letters and spaces
                      let onlyLettersAndSpaces = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );

                      // Limit to 5 characters
                      if (onlyLettersAndSpaces.length > 5) {
                        onlyLettersAndSpaces = onlyLettersAndSpaces.slice(0, 5);
                      }

                      field.onChange(onlyLettersAndSpaces);
                    }}
                  />
                )}
              />
              <FormFeedback>{errors.postalCode?.message}</FormFeedback>
            </Col>
          </Row>

          <div className="d-flex flex-wrap my-2">
            <Button color="secondary" onClick={() => setOpen(false)} outline>
              Cancel
            </Button>
            <Button className="mx-1" color="primary" type="submit">
              Add
            </Button>
          </div>
        </Form>
      </Sidebar>
    </Fragment>
  );
};

export default ClientDetaiils;
