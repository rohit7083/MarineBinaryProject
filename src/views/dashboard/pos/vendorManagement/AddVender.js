import useJwt from "@src/auth/jwt/useJwt";
import { selectThemeColors } from "@utils";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import "react-phone-input-2/lib/bootstrap.css";
import { useLocation, useNavigate } from "react-router-dom";

import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import { countries } from "../../slip-management/CountryCode";
import NavItems from "../product_management/NavItems";

const MultipleColumnForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // vendorName: "aa",
      // companyName: "bb",
      // address: "cc",
      // phoneNumber: "912345678901",
      // emailId: "aa@gmail.com",
    },
  });
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);
  const [errMsz, seterrMsz] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);

  const vendorData = location.state;
  const [vType, setVType] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tooltipOpen, setTooltipOpen] = useState({
    ANP: false,
    importProduct: false,
    addProductCate: false,
    addProducttaxes: false,
    addStock: false,
    stockManage: false,
  });
  const toggleTooltip = (tooltip) => {
    setTooltipOpen((prevState) => ({
      ...prevState,
      [tooltip]: !prevState[tooltip],
    }));
  };

  // {{ }}
  const onSubmit = async (data) => {
    seterrMsz("");

    const SelectedVendor = data?.vendorType?.map((x) => {
      return {
        uid: x.value,
      };
    });

    const payload = {
      ...data,
      countryCode: data.countryCode?.dial_code || "",
      dialCodeCountry: data.countryCode?.code || "",
      vendorType: SelectedVendor,
    };
    console.log("data", data);

    if (!vendorData) {
      try {
        setLoading(true);

        const res = await useJwt.addVender(payload);
        console.log("Response from API", res);
        if (res?.data?.code === 201) {
          toast.current.show({
            severity: "success",
            summary: "Successfully",
            detail: "Vendor Created Successfully.",
            life: 2000, // Toast will disappear after 2 seconds
          });

          // Delay navigation until toast is done
          setTimeout(() => {
            navigate("/pos/VendorManage");
          }, 2000); // same as toast life
        }
      } catch (error) {
        console.log("Error submitting form", error);
        if (error.response && error.response.data) {
          const { status, content } = error.response.data;

          seterrMsz((prev) => {
            const newMsz = content || "Something went wrong!";
            return prev !== newMsz ? newMsz : prev + " ";
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const updatedRes = await useJwt.editvender(vendorData?.uid, payload);
        console.log(updatedRes);
        toast.current.show({
          severity: "success",
          summary: " Successfully",
          detail: "Vendor Updated Successfully.",
          life: 2000,
        });
        setTimeout(() => {
          navigate("/pos/VendorManage");
        }, 2000);
      } catch (error) {
        console.log("Error submitting form", error);
        if (error.response && error.response.data) {
          const { status, content } = error.response.data;

          seterrMsz((prev) => {
            const newMsz = content || "Something went wrong!";
            return prev !== newMsz ? newMsz : prev + " ";
          });
        }
      } finally {
        setLoading(false);
      }
    }
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

  useEffect(() => {
    if (vendorData?.venderData && vType.length) {
      const backendCode = vendorData.venderData.dialCodeCountry;

      const selectedCountry =
        countryOptions.find((c) => c.code === backendCode) || null;

      // Map vendor types to exact objects from vType
      const selectedVendorTypes = vendorData.venderData.vendorType
        .map((type) => vType.find((v) => v.value === type.uid))
        .filter(Boolean);

      reset({
        ...vendorData.venderData,
        countryCode: selectedCountry,
        vendorType: selectedVendorTypes,
      });
    }
    setLoadingReset(false);
  }, [vendorData, reset, vType, countryOptions]);

  const fetchVendorType = async () => {
    try {
      setLoadingReset(true);

      const res = await useJwt.getAllVendorType();
      console.log("Vendor Type Data", res);

      const vendorTypeOptions = res?.data?.content?.result?.map((type) => ({
        value: type.uid,
        label: type.typeName,
      }));

      setVType(vendorTypeOptions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingReset(false);
    }
  };
  useEffect(() => {
    fetchVendorType();
  }, []);

  return (
    <Card>
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
          Add Vendor
        </CardTitle>
        <div className="d-flex mt-md-0 mt-1">
          <div className="d-flex  mt-2 justify-content-start gap-2">
            <NavItems />
          </div>
        </div>
      </CardHeader>
      <CardBody className="mt-2">
        {errMsz && (
          <React.Fragment>
            <UncontrolledAlert color="danger">
              <div className="alert-body">
                <span className="text-danger fw-bold">
                  <strong>Error : </strong>
                  {errMsz}
                </span>
              </div>
            </UncontrolledAlert>
          </React.Fragment>
        )}

        {loadingReset ? (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner
              color="primary"
              size="lg"
              style={{ width: "4rem", height: "4rem" }}
            />
            <span className="ms-2">Loading...</span>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md="6" className="mb-1">
                  <Label for="vendorName">Vendor Name</Label>
                  <Controller
                    name="vendorName"
                    control={control}
                    rules={{
                      required: "Vendor is required",
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="form-control"
                        placeholder="Vendor Name"
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
                  {errors.vendorName && (
                    <small className="text-danger">
                      {errors.vendorName.message}
                    </small>
                  )}
                </Col>

                <Col md="6" className="mb-1">
                  <Label for="vendorName">Company Name</Label>
                  <Controller
                    name="companyName"
                    control={control}
                    rules={{
                      required: "company Name is required",
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="form-control"
                        placeholder="Vendor Name"
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
                  {errors.companyName && (
                    <small className="text-danger">
                      {errors.companyName.message}
                    </small>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md="6" className="mb-1">
                  <Label for="vendorName">Address</Label>
                  <Controller
                    name="address"
                    control={control}
                    rules={{
                      required: "Address is required",
                      minLength: {
                        value: 5,
                        message: "Address must be at least 5 characters",
                      },
                      maxLength: {
                        value: 200,
                        message: "Address cannot exceed 200 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9 ,\-]*$/,
                        message:
                          "Only letters, numbers, spaces, commas, and dashes are allowed",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="form-control"
                        placeholder="address "
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
                  {errors.address && (
                    <small className="text-danger">
                      {errors.address.message}
                    </small>
                  )}
                </Col>
                <Col md="6" className="mb-1">
                  <Label for="email">Email Address</Label>
                  <Controller
                    name="emailId"
                    control={control}
                    rules={{
                      required: "Email is required",
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="form-control"
                        placeholder="Enter Email"
                        type="email"
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
                    <small className="text-danger">
                      {errors.emailId.message}
                    </small>
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

                      minLength: {
                        value: 10,
                        message: "Phone number must be at least 10 digits",
                      },
                      maxLength: {
                        value: 13,
                        message: "Phone number cannot exceed 13 digits",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="tel"
                        placeholder="Enter phone number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={(e) => {
                          // Allow only numeric characters
                          const onlyNumbers = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
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

              <Col sm="12" className="mb-3">
                <Label for="typeName">Vendor Type</Label>

                <Controller
                  name="vendorType"
                  control={control}
                  rules={{ required: "Vendor Type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={vType}
                      theme={selectThemeColors}
                      isClearable
                      isMulti
                      value={field.value} // ✅ now value will be array of {value,label}
                      onChange={(val) => field.onChange(val)}
                      className={`react-select ${
                        errors.vendorType ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                    />
                  )}
                />
                {errors.vendorType && (
                  <p style={{ color: "red" }}>{errors.vendorType.message}</p>
                )}
              </Col>

              <Button
                color="primary"
                disabled={loading}
                className=""
                type="submit"
              >
                {loading ? (
                  <>
                    <span>Loading.. </span>
                    <Spinner size="sm" />{" "}
                  </>
                ) : (
                  "Submit"
                )}{" "}
              </Button>
              <Button
                outline
                color="secondary"
                type="button"
                className="ms-2"
                onClick={() => reset()}
              >
                Reset
              </Button>
            </form>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default MultipleColumnForm;
