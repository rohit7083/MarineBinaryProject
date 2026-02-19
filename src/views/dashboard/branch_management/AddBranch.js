import useJwt from "@src/auth/jwt/useJwt";
import { ArrowLeft } from "lucide-react";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
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
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { countries } from "../../dashboard/slip-management/CountryCode";

const defaultValues = {
  branchName: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  phoneNumber: "",
  email: "",
};

// Removes all special characters except spaces
const cleanText = (value) => value.replace(/[^a-zA-Z0-9\s]/g, "");
// ===== Sanitizers =====
const sanitizeAlphaNumericSpace = (value = "") =>
  value.replace(/[^a-zA-Z0-9\s]/g, "");

const sanitizeAlphaSpace = (value = "") => value.replace(/[^a-zA-Z\s]/g, "");
const sanitizeDescription = (value = "") =>
  value.replace(/[^a-zA-Z0-9\s.,\-()']/g, "");

const sanitizeNumeric = (value = "") => value.replace(/[^0-9]/g, "");

const sanitizeEmail = (value = "") => value.replace(/[^a-zA-Z0-9@._-]/g, "");
const sanitizeAddress = (value = "") =>
  value.replace(/[^a-zA-Z0-9\s,.\-/#]/g, "");
export default function BranchForm({ isFirst }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });
  const toast = useRef(null);
  const [loadingReset, setLoadingReset] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const branchData = location?.state?.row;
  const [hideCompnayName, setHideCompanyName] = useState(false);

  useEffect(() => {

    if (branchData?.uid) {
      const backendCode = branchData?.dialCountry;

      const selectedCountry =
        countryOptions.find((c) => c.code === backendCode) || null;

      reset({
        ...branchData,
        countryCode: selectedCountry,
      });
    }else{
          const stored = localStorage.getItem("selectedBranch");
 if (!stored) return;

    try {
      const { companyName = "" } = JSON.parse(stored);

      reset({ companyName });
      setHideCompanyName(Boolean(companyName));
    } catch (error) {
      console.error("Invalid selectedBranch in localStorage", error);
    }
    }
    // setLoadingReset(false);
  }, [reset ,branchData ,setHideCompanyName]);

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
    [countries],
  );

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      countryCode: data.countryCode?.dial_code || "",
      dialCountry: data.countryCode?.code || "",
    };

    try {
      setLoadingReset(true);

      const branchUId = branchData?.uid;
      let res;

      if (branchUId) {
        res = await useJwt.updateBranch(branchUId, payload);

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Branch Updated Successfully.",
          life: 2000,
        });
      } else {
        res = await useJwt.createBranch(payload);

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Branch Created Successfully.",
          life: 2000,
        });
      }

      // redirect only once
      if (isFirst) {
        setTimeout(() => navigate("/getbranch"), 2000);
      } else {
        setTimeout(() => navigate("/branch"), 2000);
      }
    } catch (error) {
      const content = error?.response?.data?.content;

      const message =
        typeof content === "string"
          ? content
          : typeof content === "object"
          ? Object.values(content)[0]
          : "Something went wrong";

      toast.current?.show({
        severity: "error",
        summary: "Failed",
        detail: message,
        life: 2000,
      });
    } finally {
      setLoadingReset(false);
    }
  };

  // useEffect(() => {
  //   const stored = localStorage.getItem("selectedBranch");
  //   if (!stored) return;

  //   try {
  //     const { companyName = "" } = JSON.parse(stored);

  //     reset({ companyName });
  //     setHideCompanyName(Boolean(companyName));
  //   } catch (error) {
  //     console.error("Invalid selectedBranch in localStorage", error);
  //   }
  // }, [reset, setHideCompanyName]);

  return (
    <Card style={{ border: "1px solid #ddd" }}>
      <Toast ref={toast} />

      <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
        <CardTitle tag="h4">
          {" "}
          <ArrowLeft
            style={{
              cursor: "pointer",
              marginRight: "10px",
              transition: "color 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
            onClick={() => window.history.back()}
          />
          {branchData?.uid ? "Update Branch" : "Add Branch"}
        </CardTitle>
      </CardHeader>
      <CardBody style={{ padding: "0" }}>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          style={{ margin: 0, padding: 0 }}
        >
          <div style={{ padding: "16px" }}>
            {/* Branch Name */}
            <Row>
              <Col md="6" className="mb-1">
                {" "}
                <Label>Company Name</Label>
                <Controller
                  name="companyName"
                  control={control}
                  rules={{
                    required: "Company name is required",
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message: "Special characters are not allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      disabled={hideCompnayName}
                      placeholder="Enter Company Name"
                      onChange={(e) =>
                        field.onChange(
                          sanitizeAlphaNumericSpace(e.target.value),
                        )
                      }
                    />
                  )}
                />
                {errors.companyName && (
                  <small className="text-danger">
                    {errors.companyName.message}
                  </small>
                )}
              </Col>
              <Col md="6" className="mb-1">
                {" "}
                <Label>Branch Name</Label>
                <Controller
                  name="branchName"
                  control={control}
                  rules={{
                    required: "Branch name is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters required",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message: "Special characters are not allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter Branch Name"
                      onChange={(e) =>
                        field.onChange(
                          sanitizeAlphaNumericSpace(e.target.value),
                        )
                      }
                    />
                  )}
                />
                {errors.branchName && (
                  <small className="text-danger">
                    {errors.branchName.message}
                  </small>
                )}
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
                      value={field.value || null} // exact object from countryOptions
                      onChange={(option) => field.onChange(option)}
                      isClearable
                    />
                  )}
                />

                {errors.countryCode && (
                  <small className="text-danger">
                    {errors.countryCode.message}
                  </small>
                )}
              </Col>

              <Col md={6}>
                <Col className="mb-1">
                  <Label>Phone Number</Label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                      required: "Phone number is required",
                      minLength: {
                        value: 7,
                        message: "Phone number is too short",
                      },
                      maxLength: {
                        value: 13,
                        message: "Phone number is too long",
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numbers are allowed",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Phone Number"
                        maxLength={13} // UI-level restriction
                        onChange={(e) =>
                          field.onChange(
                            sanitizeNumeric(e.target.value).slice(0, 13),
                          )
                        }
                      />
                    )}
                  />
                  {errors.phoneNumber && (
                    <small className="text-danger">
                      {errors.phoneNumber.message}
                    </small>
                  )}
                </Col>
              </Col>
            </Row>

            <Col className="mb-2">
              <Label>Email</Label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter Email"
                    // allow email characters only
                    onChange={(e) =>
                      field.onChange(sanitizeEmail(e.target.value))
                    }
                  />
                )}
              />
              {errors.email && (
                <small className="text-danger">{errors.email.message}</small>
              )}
            </Col>

            {/* Description */}
            <Col className="mb-1">
              <Label>Description</Label>
              <Controller
                name="description"
                rules={{
                  maxLength: {
                    value: 500,
                    message: "Description cannot exceed 500 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9\s.,\-()']*$/,
                    message:
                      "Only letters, numbers, spaces and basic punctuation are allowed",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="textarea"
                    placeholder="Enter Description"
                    rows="2"
                    onChange={(e) =>
                      field.onChange(sanitizeDescription(e.target.value))
                    }
                  />
                )}
              />
              {errors.description && (
                <small className="text-danger">
                  {errors.description.message}
                </small>
              )}
            </Col>

            {/* Address */}
            <Col className="mb-2">
              <Label>Address</Label>
              <Controller
                name="address"
                control={control}
                rules={{
                  required: "Address is required",
                  minLength: {
                    value: 5,
                    message: "Address is too short",
                  },
                  maxLength: {
                    value: 200,
                    message: "Address is too long",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9\s,.\-/#]+$/,
                    message:
                      "Only letters, numbers, spaces, and , . - / # are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Address"
                    onChange={(e) =>
                      field.onChange(sanitizeAddress(e.target.value))
                    }
                  />
                )}
              />
              {errors.address && (
                <small className="text-danger">{errors.address.message}</small>
              )}
            </Col>

            <Row>
              <Col md={3}>
                <Col className="mb-2">
                  <Label>City</Label>
                  <Controller
                    name="city"
                    control={control}
                    rules={{
                      required: "City is required",
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "Only letters are allowed",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter City"
                        onChange={(e) =>
                          field.onChange(sanitizeAlphaSpace(e.target.value))
                        }
                      />
                    )}
                  />
                  {errors.city && (
                    <small className="text-danger">{errors.city.message}</small>
                  )}
                </Col>
              </Col>

              <Col md={3}>
                <Col className="mb-2">
                  <Label>State</Label>
                  <Controller
                    name="state"
                    control={control}
                    rules={{
                      required: "State is required",
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "Only letters are allowed",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter State"
                        onChange={(e) =>
                          field.onChange(sanitizeAlphaSpace(e.target.value))
                        }
                      />
                    )}
                  />
                  {errors.state && (
                    <small className="text-danger">
                      {errors.state.message}
                    </small>
                  )}
                </Col>
              </Col>

              <Col className="mb-2">
                <Label>Country</Label>
                <Controller
                  name="country"
                  control={control}
                  rules={{
                    required: "Country is required",
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Only letters are allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter Country"
                      onChange={(e) =>
                        field.onChange(sanitizeAlphaSpace(e.target.value))
                      }
                    />
                  )}
                />
                {errors.country && (
                  <small className="text-danger">
                    {errors.country.message}
                  </small>
                )}
              </Col>

              {/* <Row> */}
              <Col md={3}>
                <Col className="mb-2">
                  <Label>Postal Code</Label>
                  <Controller
                    name="postalCode"
                    rules={{
                      required: "Postal code is required",
                      minLength: {
                        value: 5,
                        message: "Postal code must be 5 digits",
                      },
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Postal Code"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ""); // allow digits only
                          field.onChange(value.slice(0, 5)); // hard cap at 5 max
                        }}
                      />
                    )}
                  />
                  {errors.postalCode && (
                    <small className="text-danger">
                      {errors.postalCode.message}
                    </small>
                  )}
                </Col>
              </Col>
            </Row>

            <Button
              color="primary"
              disabled={loadingReset}
              size="sm"
              type="submit"
            >
              {loadingReset ? (
                <>
                  <span>Loading.. </span>
                  <Spinner size="sm" />
                </>
              ) : branchData?.uid ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}
