import React, { useState } from "react";
// ** Reactstrap Imports
import { Button, Col, FormFeedback, Input, Label, Row } from "reactstrap";

// ** React Hook Form
import { Controller, useForm } from "react-hook-form";

// ** Third Party Components
import ReactCountryFlag from "react-country-flag";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Country Json
import { countries } from "../../../slip-management/CountryCode";

const avoidSpecialChar = (e, field) => {
  const value = e.target.value.replace(/[^A-Za-z\s']/g, "");
  field.onChange(value);
};

const addNum_Alphabetics = (e, field) => {
  const value = e.target.value.replace(/[^A-Za-z0-9\s,'-]/g, "");
  field.onChange(value);
};

const CreateUserForm = (props) => {
  // ** Props
  const { onClose } = props;

   ("CreateUserForm Props:", props);

  // ** State
  const [open, setOpen] = useState(true);

  // ** React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      emailId: "",
      address: "",
      countryCode: null,
      phoneNumber: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });
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

  // ** Form Submit Handler
  const onSubmit = async (data) => {
    try {
      // {{ }}
      const payload = {
        data: JSON.stringify({
          ...data,
          countryCode: data.countryCode.dial_code,
          dialCodeCountry: data.countryCode?.code,
        }),
        label: `${data.firstName} ${data.lastName}`,
        value: Object.values(data).join(","),
        isNew: true,
      };
      onClose(payload);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit, (errors) =>
           ("Errors", errors)
        )}
      >
        <Row>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="firstName">
              First Name<span style={{ color: "red" }}>*</span>
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
                  invalid={errors.firstName && true}
                  onChange={(e) => avoidSpecialChar(e, field)}
                />
              )}
            />
            {errors.firstName && (
              <FormFeedback>{errors.firstName.message}</FormFeedback>
            )}
          </Col>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="lastName">
              Last Name<span style={{ color: "red" }}>*</span>
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
                  invalid={errors.lastName && true}
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
          <Col md="12" className="mb-1">
            <Label className="form-label" for="emailId">
              Email
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="emailId"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              }}
              name="emailId"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Email"
                  invalid={errors.emailId && true}
                  {...field}
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
            {errors.emailId && (
              <FormFeedback>{errors.emailId.message}</FormFeedback>
            )}
          </Col>

          <Col md="12" className="mb-1">
            <Label className="form-label" for="address">
              Address
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="address"
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
                  placeholder="Enter Address "
                  invalid={errors.address && true}
                  {...field}
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
          <Col md="12" className="mb-1">
            <Label for="phone">Country Code</Label>

            <Controller
              name="countryCode"
              control={control}
              rules={{
                required: "Country code is required",
              }}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  options={countryOptions}
                  className={`react-select ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  theme={selectThemeColors}
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

          <Col md="12" className="mb-1">
            <Label for="phone">Phone Number</Label>

            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{4,13}$/, // only digits, 4 to 13 in length
                  message: "Enter a valid phone number (4-13 digits)",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="tel"
                  placeholder="Enter phone number"
                  onChange={(e) => {
                    // Allow only numeric characters and limit length to 13
                    let onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
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
          <Col md="12" className="mb-1">
            <Label className="form-label" for="city">
              City
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="city"
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
                  placeholder="Enter City Name"
                  invalid={errors.city && true}
                  {...field}
                  onChange={(e) => avoidSpecialChar(e, field)}
                />
              )}
            />
            {errors.city && <FormFeedback>{errors.city.message}</FormFeedback>}
          </Col>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="state">
              State
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="state"
              rules={{
                required: "State is required",
                pattern: {
                  value: /^[A-Za-z\s'-]+$/,
                  message: "Only alphabetic characters allowed",
                },
              }}
              name="state"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter State Name"
                  invalid={errors.state && true}
                  {...field}
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
          <Col md="12" className="mb-1">
            <Label className="form-label" for="country">
              Country
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="country"
              rules={{
                required: "country is required",
                pattern: {
                  value: /^[A-Za-z\s'-]+$/,
                  message: "Only alphabetic characters allowed",
                },
              }}
              name="country"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Country"
                  invalid={errors.country && true}
                  {...field}
                  onChange={(e) => avoidSpecialChar(e, field)}
                />
              )}
            />
            {errors.country && (
              <FormFeedback>{errors.country.message}</FormFeedback>
            )}
          </Col>

          <Col md="12" className="mb-1">
            <Label className="form-label" for="postalCode">
              Zip Code
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              id="postalCode"
              name="postalCode"
              rules={{
                required: "Postal code is required",
                pattern: {
                  value: /^[0-9]{5}$/,
                  message: "Enter a valid 5-digit postal code",
                },
              }}
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Enter Zip Code"
                  invalid={errors.postalCode && true}
                  {...field}
                  maxLength={5} // limit input length
                  onChange={(e) => {
                    // allow only digits and max 5 characters
                    const value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 5);
                    field.onChange(value);
                  }}
                />
              )}
            />
            {errors.postalCode && (
              <FormFeedback>{errors.postalCode.message}</FormFeedback>
            )}
          </Col>
        </Row>

        <div className="d-flex flex-wrap my-2">
          <Button color="secondary" onClick={() => setOpen(false)} outline>
            Cancel
          </Button>
          <Button
            className="mx-1"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
