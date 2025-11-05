import useJwt from "@src/auth/jwt/useJwt";
import "flatpickr/dist/themes/material_blue.css";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
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
  Spinner,
} from "reactstrap";
import { countries } from "../../slip-management/CountryCode";
const VesselForm = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const WaitingData = location.state?.row || "";
  const WaitUId = WaitingData?.uid;
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
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
  useEffect(() => {
    if (WaitUId && WaitingData) {
      const backendCode = WaitingData?.dialCodeCountry;

      // Find matching country object for react-select
      const selectedCountry =
        countryOptions.find((c) => c.code === backendCode) || null;

      // Safely reset form with mapped country + phone
      reset({
        ...WaitingData,
        countryCode: selectedCountry || null,
        phoneNumber: WaitingData?.phoneNumber || "",
      });
    }
  }, [WaitingData, WaitUId, countryOptions, reset]);

  const onSubmit = async (data) => {
    if (!data.length && !data.width && !data.height && !data.power) {
      toast.current.show({
        severity: "warn",
        summary: "Missing Vessel Data",
        detail: "Please enter at least one of Length, Width, Height, or Power.",
        life: 2500,
      });
      return; // stop form submission
    }
    const payload = {
      ...data,
      countryCode: data.countryCode?.dial_code || "",
      dialCodeCountry: data.countryCode?.code || "",
      phoneNumber: data.phoneNumber,
    };
    setLoading(true);
    try {
      if (WaitUId) {
        await useJwt.updateWaitingSlip(WaitUId, payload);
        toast.current.show({
          severity: "success",
          summary: "Updated Successfully",
          detail: "Vessel record has been updated.",
          life: 2000,
        });
      } else {
        await useJwt.createWaitingSlip(payload);
        toast.current.show({
          severity: "success",
          summary: "Successfully Added",
          detail: "Successfully Added",
          life: 2000,
        });
      }
      reset();
      setTimeout(() => {
        navigate("/slip-management/waiting_slip");
      }, 1500);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Submission Failed",
        detail: error.message || "Unable to submit. Please try again later.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Unified text input component with live sanitization
  const textInput = (name, label, placeholder, rules, type = "text") => (
    <Col md={6} className="mb-1">
      <Label className="fw-semibold mb-1">{label}</Label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              invalid={!!errors[name]}
              onChange={(e) => {
                let value = e.target.value;

                // Live sanitization: remove invalid characters immediately
                switch (name) {
                  // Only letters & spaces
                  case "firstName":
                  case "lastName":
                  case "city":
                  case "state":
                  case "country":
                    value = value.replace(/[^A-Za-z ]/g, "");
                    break;

                  // Only numbers + optional decimal
                  case "length":
                  case "width":
                  case "height":
                    value = value.replace(/[^0-9.]/g, "");
                    break;

                  // Only whole numbers
                  case "power":
                  case "phoneNumber":
                    value = value.replace(/[^0-9]/g, ""); // numbers only
                    if (value.length > 13) value = value.slice(0, 13); // ✅ limit to 13 digits
                    break;

                  // Letters, numbers, spaces, hyphens
                  case "vesselName":
                    value = value.replace(/[^A-Za-z0-9 ]/g, ""); // allow letters, numbers, spaces
                    break;

                  case "vesselRegistrationNumber":
                    value = value.replace(/[^A-Za-z0-9]/g, ""); // allow only letters and numbers (no hyphen, no space)
                    break;

                  case "postalCode":
                    value = value.replace(/[^0-9]/g, ""); // ✅ letters only
                    if (value.length > 5) value = value.slice(0, 5); // ✅ limit to 5 letters
                    break;

                  // + and numbers
                  case "countryCode":
                    value = value.replace(/[^0-9+]/g, "");
                    break;

                  // Only letters
                  case "dialCodeCountry":
                    value = value.replace(/[^A-Za-z]/g, "");
                    break;

                  // Letters, numbers, commas, periods, hyphens, spaces
                  case "address":
                    value = value.replace(/[^A-Za-z0-9\s,.-]/g, "");
                    break;

                  default:
                    break;
                }

                field.onChange(value);
              }}
            />
            <FormFeedback>{errors[name]?.message}</FormFeedback>
          </>
        )}
      />
    </Col>
  );

  return (
    <>
      <Toast ref={toast} />
      <Card className="shadow border-0" style={{ borderRadius: "14px" }}>
        <CardHeader className="border-bottom-0">
          <CardTitle tag="h4" className="mb-0 fw-semibold">
            <ArrowLeft
              style={{
                cursor: "pointer",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
              onClick={() => navigate(-1)}
            />{" "}
            {WaitUId
              ? "Update Waiting Slip Details"
              : "Create Waiting Slip Details"}
          </CardTitle>
        </CardHeader>

        <CardBody className="pt-0">
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Vessel Info */}
            <div className="mb-1 border-bottom pb-3">
              <h6 className="fw-semibold text-secondary mb-1">
                Vessel Information
              </h6>
              <Row>
                {textInput("vesselName", "Vessel Name", "Enter vessel name", {
                  required: "Vessel name is required",
                })}
                {textInput(
                  "vesselRegistrationNumber",
                  "Registration Number",
                  "Enter registration number",
                  { required: "Registration number is required" }
                )}
                {textInput("length", "Length (m)", "Enter length")}
                {textInput("width", "Width (m)", "Enter width")}
                {textInput("height", "Height (m)", "Enter height")}

                {textInput("power", "Power (HP)", "Enter power")}
              </Row>
            </div>

            {/* Owner Info */}
            <div className="mb-1 border-bottom pb-3">
              <h6 className="fw-semibold text-secondary mb-1">
                Owner Information
              </h6>
              <Row>
                {textInput("firstName", "First Name", "Enter first name", {
                  required: "First name is required",
                })}
                {textInput("lastName", "Last Name", "Enter last name", {
                  required: "Last name is required",
                })}
                <Col md={6}>
                  <Controller
                    name="emailId"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/,
                        message:
                          "Enter a valid email (letters, numbers, '@' and '.' only)",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Label className="fw-semibold mb-1">Email</Label>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter email"
                          invalid={!!errors.emailId}
                          onChange={(e) => {
                            let value = e.target.value.replace(
                              /[^A-Za-z0-9@.]/g,
                              ""
                            );
                            field.onChange(value); // update form state properly
                          }}
                        />
                        <FormFeedback>{errors.emailId?.message}</FormFeedback>
                      </>
                    )}
                  />
                </Col>

                {/* Phone + Country Code in one row */}
                <Col md={6} className="mb-1">
                  <Label className="fw-semibold mb-1">Phone Number</Label>
                  <div className="d-flex align-items-center">
                    {/* Country Code Select */}
                    <div style={{ flex: "0 0 45%", marginRight: "6px" }}>
                      <Controller
                        name="countryCode"
                        control={control}
                        rules={{ required: "Country code is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={countryOptions}
                            value={
                              countryOptions.find(
                                (opt) =>
                                  opt.value === field.value?.value ||
                                  opt.value === field.value
                              ) || null
                            }
                            onChange={(option) => field.onChange(option)}
                            isClearable
                          />
                        )}
                      />
                    </div>

                    {/* Phone Number Input */}
                    <div style={{ flex: "1 1 55%" }}>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{
                          required: "Phone number is required",
                          maxLength: {
                            value: 13,
                            message: "Maximum 13 digits allowed",
                          },
                        }}
                        render={({ field }) => (
                          <>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter phone number"
                              invalid={!!errors.phoneNumber}
                              onChange={(e) => {
                                let value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                if (value.length > 13)
                                  value = value.slice(0, 13); // max 13 digits
                                field.onChange(value);
                              }}
                            />
                            <FormFeedback>
                              {errors.phoneNumber?.message}
                            </FormFeedback>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  {/* Combined error for both fields */}
                  {(errors.countryCode || errors.phoneNumber) && (
                    <div className="text-danger small mt-1">
                      {errors.countryCode?.message ||
                        errors.phoneNumber?.message}
                    </div>
                  )}
                </Col>
              </Row>
            </div>

            {/* Address Info */}
            <div className="mb-1">
              <h6 className="fw-semibold text-secondary mb-1">
                Address Information
              </h6>
              <Row>
                <Col md={12} className="mb-1">
                  <Label className="fw-semibold mb-1">Address</Label>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          placeholder="Enter address"
                          invalid={!!errors.address}
                          onChange={(e) => {
                            const value = e.target.value.replace(
                              /[^A-Za-z0-9\s,.-]/g,
                              ""
                            );
                            field.onChange(value);
                          }}
                        />
                        <FormFeedback>{errors.address?.message}</FormFeedback>
                      </>
                    )}
                  />
                </Col>
                {textInput("city", "City", "Enter city", {
                  required: "City is required",
                })}
                {textInput("state", "State", "Enter state", {
                  required: "State is required",
                })}
                {textInput("country", "Country", "Enter country", {
                  required: "Country is required",
                })}
                {textInput("postalCode", "Postal Code", "Enter postal code", {
                  required: "Postal code is required",
                  pattern: {
                    value: /^[0-9]{5}$/, // ✅ exactly 5 letters only
                    message: "Postal code must be exactly 5 letters (A–Z).",
                  },
                })}
              </Row>
            </div>

            {/* Submit Button */}
            <div className="text-end mt-4">
              <Button
                color="primary"
                type="submit"
                className="px-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    {WaitUId ? "Updating..." : "Submitting..."}{" "}
                    <Spinner size="sm" />
                  </>
                ) : WaitUId ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </>
  );
};

export default VesselForm;
