import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  InputGroup,
  Label,
  Row,
} from "reactstrap";

import useJwt from "@src/auth/jwt/useJwt";
import { useState } from "react";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import NavItems from "./NavItems";

const MultipleColumnForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vendorName: "aa",
      companyName: "bb",
      address: "cc",
      phoneNumber: "912345678901",
      emailId: "aa@gmail.com",
    },
  });
  const [phoneNumber, setMobileNumber] = useState("");
  const extractCountryCodeAndNumber = (value) => {
    if (!value) return { code: "", number: "" }; // Handle undefined case
    const code = value.slice(0, value.length - 10);
    const number = value.slice(-10);
    return { code, number };
  };
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

  const onSubmit = async (data) => {
    const { code, number } = extractCountryCodeAndNumber(data.phoneNumber);

    try {
      const payload = {
        ...data,
        countryCode: `+${code}`,
        phoneNumber: number,
      };

      const res = await useJwt.addVender(payload);
    } catch (error) {
      console.log("Error submitting form", error);
    }
  };

  const productOptions = [
    { value: "prod1", label: "Product 1" },
    { value: "prod2", label: "Product 2" },
  ];

  return (
    <Card>
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
          Add Product Stocks
        </CardTitle>
        <div className="d-flex mt-md-0 mt-1">
          <div className="d-flex  mt-2 justify-content-start gap-2">
            <NavItems />
          </div>
        </div>
      </CardHeader>

      <CardBody className="mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="6" className="mb-1">
              <Label for="vendorName">Vendor Name</Label>
              <Controller
                name="vendorName"
                control={control}
                rules={{ required: "Vendor name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="form-control"
                    placeholder="Vendor Name"
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
                rules={{ required: "Vendor name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="form-control"
                    placeholder="Vendor Name"
                  />
                )}
              />
              {errors.vendorName && (
                <small className="text-danger">
                  {errors.vendorName.message}
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
                rules={{ required: "address is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="form-control"
                    placeholder="address "
                  />
                )}
              />
              {errors.address && (
                <small className="text-danger">{errors.address.message}</small>
              )}
            </Col>
            <Col md="6" className="mb-1">
              <Label for="mobile">Mobile Number</Label>

              <InputGroup className="input-group-merge">
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue={phoneNumber}
                  rules={{
                    required: "Mobile number is required",
                    validate: (value) =>
                      value && value.length >= 10
                        ? true
                        : "Invalid mobile number",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      // country={"us"}
                      value={value || phoneNumber}
                      onChange={(phone) => {
                        onChange(phone);
                        setMobileNumber(phone);
                      }}
                      inputProps={{
                        name: "phoneNumber",
                        required: true,
                        className: "form-control",
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      inputStyle={{
                        height: "38px",
                        border: "1px solid #ced4da",
                        borderRadius: "0 .375rem .375rem 0",
                        paddingLeft: "63px",
                        width: "100%",
                      }}
                    />
                  )}
                />
              </InputGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label for="email">Email Address</Label>
              <Controller
                name="emailId"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="form-control"
                    placeholder="Enter Email"
                    type="email"
                  />
                )}
              />
              {errors.email && (
                <small className="text-danger">{errors.email.message}</small>
              )}
            </Col>
          </Row>

          {/* <CardTitle tag="h4" className="mt-3 mb-2">
            Variations
          </CardTitle> */}

          <Button color="primary" type="submit">
            Submit
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
      </CardBody>
    </Card>
  );
};

export default MultipleColumnForm;
