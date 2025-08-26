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
import { Link, useLocation } from "react-router-dom";
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
  UncontrolledAlert
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
      vendorName: "aa",
      companyName: "bb",
      address: "cc",
      phoneNumber: "912345678901",
      emailId: "aa@gmail.com",
    },
  });

  const location = useLocation();
  const toast = useRef(null);
  const [errMsz, seterrMsz] = useState("");

  const vendorData = location.state;
  console.log("vendor ddata ", vendorData);
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


    const SelectedVendor=data?.vendorType?.map((x)=>{
      return {
        uid: x.value,
      };
    })

    
    const payload = {
      ...data,
      countryCode: data.countryCode?.value || "",
        vendorType: SelectedVendor

    };
    console.log("data", data);

    if (!vendorData) {
      try {
        setLoading(true);

        const res = await useJwt.addVender(payload);
        console.log("Response from API", res);
        toast.current.show({
          severity: "success",
          summary: " Successfully",
          detail: "Vendor Created Successfully.",
          life: 2000,
        });
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
        const updatedRes = await useJwt.editvender(vendorData?.uid, payload);
        console.log(updatedRes);
        toast.current.show({
          severity: "success",
          summary: " Successfully",
          detail: "Vendor Updated Successfully.",
          life: 2000,
        });
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

  useEffect(() => {
    reset(vendorData?.venderData);
  }, [reset, vendorData]);

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

  const fetchVendorType = async () => {
    try {
      const res = await useJwt.getAllVendorType();
      console.log("Vendor Type Data", res);

      const vendorTypeOptions = res?.data?.content?.result?.map((type) => ({
        value: type.uid,
        label: type.typeName,
      }));

      setVType(vendorTypeOptions);
    } catch (error) {
      console.error(error);
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
            <div>
              <Link to="/pos/VendorManage">
                <div className="d-flex">
                  <Button color="primary" outline size="sm">
                    Import Product
                  </Button>
                </div>
              </Link>
            </div>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="6" className="mb-1">
              <Label for="vendorName">Vendor Name</Label>
              <Controller
                name="vendorName"
                control={control}
                rules={{
                  required: "Vendor is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabetic characters (A–Z) are allowed",
                  },
                }}
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
                rules={{
                  required: "company Name is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabetic characters (A–Z) are allowed",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="form-control"
                    placeholder="Vendor Name"
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
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabetic characters (A–Z) are allowed",
                  },
                }}
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
              {errors.emailId && (
                <small className="text-danger">{errors.emailId.message}</small>
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
                defaultValue={countryOptions[0]}
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
                rules={{ required: "Phone number is required" }}
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

          <Col sm="12" className="mb-1">
            <Label for="typeName">Vendor Type</Label>

            <Controller
              name="vendorType"
              control={control}
              defaultValue=""
              rules={{ required: "Event Type is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={vType}
                 theme={selectThemeColors}
                  
                  isClearable
                  isMulti
                  className={`react-select ${
                    errors.vendors ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                />
              )}
            />

            {errors.vendorType && (
              <p style={{ color: "red" }}>{errors.vendorType.message}</p>
            )}
          </Col>
          <Col sm="12" className="mb-2">
            <Label for="description">Vendor Type Description</Label>

            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Event Type Description is required" }}
              render={({ field }) => (
                <Input
                  id="description"
                  type="textarea"
                  rows="4"
                  placeholder="Enter Vendor type description"
                  invalid={!!errors.description}
                  {...field}
                />
              )}
            />

            {errors.description && (
              <p style={{ color: "red" }}>{errors.description.message}</p>
            )}
          </Col>

          {/* <CardTitle tag="h4" className="mt-3 mb-2">
            Variations
          </CardTitle> */}

          <Button color="primary" disabled={loading} className="" type="submit">
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
      </CardBody>
    </Card>
  );
};

export default MultipleColumnForm;
