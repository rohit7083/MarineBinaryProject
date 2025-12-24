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

const defaultValues = 
{
  branchName: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  phoneNumber: "",
  email: ""
}


// Removes all special characters except spaces
const cleanText = (value) => value.replace(/[^a-zA-Z0-9\s]/g, "");

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
  console.log("setIsFirst", isFirst);

  useEffect(() => {
    if (branchData?.uid) {
      const backendCode = branchData?.dialCountry;

      const selectedCountry =
        countryOptions.find((c) => c.code === backendCode) || null;

      reset({
        ...branchData,
        countryCode: selectedCountry,
      });
    }
    setLoadingReset(false);
  }, [reset]);

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

  const onSubmit = async (data) => {
    console.log("FORM DATA:", data);
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
      console.log(error);

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
            <Col className="mb-1">
              <Label>Branch Name</Label>
              <Controller
                name="branchName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    onChange={(e) => field.onChange(cleanText(e.target.value))}
                  />
                )}
              />
            </Col>

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
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        maxLength={13} // UI-level restriction
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(cleaned.slice(0, 13)); // hard limit
                        }}
                      />
                    )}
                  />
                </Col>
              </Col>
            </Row>

            <Col className="mb-2">
              <Label>Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    // allow email characters only
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.replace(/[^a-zA-Z0-9@._-]/g, "")
                      )
                    }
                  />
                )}
              />
            </Col>

            {/* Description */}
            <Col className="mb-1">
              <Label>Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="textarea"
                    rows="2"
                    onChange={(e) => field.onChange(cleanText(e.target.value))}
                  />
                )}
              />
            </Col>

            {/* Address */}
            <Col className="mb-2">
              <Label>Address</Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    onChange={(e) => field.onChange(cleanText(e.target.value))}
                  />
                )}
              />
            </Col>

            <Row>
              <Col md={3}>
                <Col className="mb-2">
                  <Label>City</Label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        onChange={(e) =>
                          field.onChange(cleanText(e.target.value))
                        }
                      />
                    )}
                  />
                </Col>
              </Col>

              <Col md={3}>
                <Col className="mb-2">
                  <Label>State</Label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        onChange={(e) =>
                          field.onChange(cleanText(e.target.value))
                        }
                      />
                    )}
                  />
                </Col>
              </Col>

              <Col className="mb-2">
                <Label>Country</Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      onChange={(e) =>
                        field.onChange(cleanText(e.target.value))
                      }
                    />
                  )}
                />
              </Col>

              {/* <Row> */}
              <Col md={3}>
                <Col className="mb-2">
                  <Label>Postal Code</Label>
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ""); // allow digits only
                          field.onChange(value.slice(0, 5)); // hard cap at 5 max
                        }}
                      />
                    )}
                  />
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
