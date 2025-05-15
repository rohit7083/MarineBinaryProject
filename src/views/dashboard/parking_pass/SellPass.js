import { Fragment, useState, useEffect } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";
import Repeater from "@components/repeater";
import { countries } from "../../dashboard/slip-management/CountryCode";
import useJwt from "@src/auth/jwt/useJwt";

// ** Third Party Components
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { SlideDown } from "react-slidedown";
import { X, Plus, Hash } from "react-feather";
import Select, { components } from "react-select";
import { Check } from "react-feather";
import { useForm, Controller, set } from "react-hook-form";

// ** Reactstrap Imports
import { selectThemeColors } from "@utils";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Label,
  Button,
  CardBody,
  CardText,
  InputGroup,
  InputGroupText,
  CardTitle,
  FormFeedback,
} from "reactstrap";
// ** Styles
import "react-slidedown/lib/slidedown.css";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";

import ReactCountryFlag from "react-country-flag";
import Payment_section from "./park_Payment/Payment_section";
import ViewPass from "./ViewPass";
const CustomLabel = ({ htmlFor }) => {
  return (
    <Label className="form-check-label" htmlFor={htmlFor}>
      <span className="switch-icon-left">
        <Check size={14} />
      </span>
      <span className="switch-icon-right">
        <X size={14} />
      </span>
    </Label>
  );
};
const SellPass = () => {
  const [count, setCount] = useState(1);
  const [value, setValue] = useState({});
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState(null);
  const [selected, setSelected] = useState(null);
  const [picker, setPicker] = useState(new Date());
  const [invoiceNumber, setInvoiceNumber] = useState(false);
  const [dueDatepicker, setDueDatePicker] = useState(new Date());
  const [chargesShow, setChargesShow] = useState(false);
  const [DiscountShow, setDiscountShow] = useState(false);
  const [selectedId, setSelectedId] = useState(1);

  const [memberNames, setMemberNames] = useState([]);
  const [parkName, setparkingName] = useState("");
  const [selectedPark, setSelectedPark] = useState([]); // selected option
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({});

  const deleteForm = (e) => {
    e.preventDefault();
    e.target.closest(".repeater-wrapper").remove();
  };

  const fetchParkingNames = async () => {
    try {
      const res = await useJwt.getAll();
      const resData = res?.data?.content?.result;
      console.log(resData);
      const parkingName = resData?.map((x) => ({
        label: x.parkingName,
        value: x.uid,
        ParkingAmount: x.parkingAmount,
      }));
      console.log(parkingName?.ParkingAmount);
      setparkingName(parkingName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchParkingNames();
  }, []);

  const toggleSidebar = () => setOpen(!open);

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
  const avoidSpecialChar = (e, field) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    field.onChange(value);
  };
  const addNum_Alphabetics = (e, field) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    field.onChange(value);
  };

  // ** Invoice To OnChange
  const handleInvoiceToChange = (data) => {
    setValue(data);
    setSelected(clients.filter((i) => i.name === data.value)[0]);
  };

  const selectedValue = watch("memberType");

  const fetchExistingMem = async () => {
    try {
      const { data } = await useJwt.GetMember();
      console.log(data);
      const memberName = data?.content?.result?.map((x) => ({
        label: `${x.firstName} ${x.lastName}`,

        value: x.uid,
        ...x,
      }));

      setMemberNames(memberName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedValue == "existing") {
      fetchExistingMem();
    }
  }, [selectedValue]);

  const onSubmit = () => {
    // try {
      
    // } catch (error) {
    //   console.log(error);
      
    // }
  };

  return (
    <Fragment>
      <Card>
        <CardBody className="invoice-padding pt-0">
          <div className="demo-inline-spacing">
            <h6 className="mb-0 invoice-to-title">Select Member Type </h6>
            <Controller
              name="memberType"
              control={control}
              render={({ field }) => (
                <>
                  <div className="form-check">
                    <Input
                      type="radio"
                      id="ex1-active"
                      value="existing"
                      checked={field.value === "existing"}
                      onChange={field.onChange}
                    />
                    <Label className="form-check-label" for="ex1-active">
                      Existing Member
                    </Label>
                  </div>
                  <div className="form-check">
                    <Input
                      type="radio"
                      id="ex1-inactive"
                      value="guest"
                      checked={field.value === "guest"}
                      onChange={field.onChange}
                    />
                    <Label className="form-check-label" for="ex1-inactive">
                      Guest
                    </Label>
                  </div>
                </>
              )}
            />
          </div>
          {selectedValue == "existing" && (
            <>
              <Row className="row-bill-to invoice-spacing">
                <Col className="col-bill-to ps-0" xl="12">
                  <h6 className="invoice-to-title">Select Member</h6>

                  <div className="invoice-customer">
                    <Fragment>
                      <Controller
                        control={control}
                        name="selectedMember"
                        render={({ field }) => {
                          return (
                            <Fragment>
                              <Select
                                {...field}
                                className="react-select"
                                classNamePrefix="select"
                                id="label"
                                options={memberNames}
                                theme={selectThemeColors}
                                // menuPlacement="top"
                              />
                            </Fragment>
                          );
                        }}
                      />
                    </Fragment>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </CardBody>
      </Card>

      <ViewPass watch={watch} selectedId={selectedId} />

      <Card className="invoice-preview-card">
        <div>
          <CardTitle className="mt-2 mx-2">Add Parking details</CardTitle>
          <hr className="invoice-spacing mt-0" />
        </div>
        {/* Address and Contact */}

        {/* <CardBody className="invoice-padding invoice-product-details"> */}
        <h6 className="invoice-to-title mx-3">Add Parking Pass</h6>
        <div className=" invoice-product-details">
          <Repeater count={count}>
            {(i) => {
              const Tag = i === 0 ? "div" : SlideDown;
              return (
                <Tag key={i} className="repeater-wrapper">
                  <Row>
                    <Col
                      className="d-flex product-details-border position-relative pe-0"
                      sm="12"
                    >
                      <Row className="w-100 pe-lg-0 pe-1 py-2">
                        <Col
                          className="mb-lg-0 mb-2 mt-lg-0 mt-2"
                          lg="6"
                          md="6"
                          sm="12"
                        >
                          <CardText className="col-title mb-md-50 mb-0">
                            Parking Name
                          </CardText>
                          <Select
                            theme={selectThemeColors}
                            className="react-select"
                            classNamePrefix="select"
                            // defaultValue={colourOptions[0]}
                            options={parkName}
                            isClearable={false}
                            onChange={(option) => {
                              const updated = [...selectedPark];
                              updated[i] = option;
                              setSelectedPark(updated);
                            }}
                          />
                        </Col>
                        <Col className="my-lg-0 mt-2" lg="2" sm="12">
                          <CardText className="col-title mb-md-50 mb-0">
                            No Of Days
                          </CardText>
                          <CardText className="mb-0">
                            <Controller
                              id="NoOfDays"
                              name={`NoOfDays_${i}`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="Enter Days"
                                  invalid={errors.NoOfDays && true}
                                  {...field}
                                  onChange={(e) => {
                                    let OnlyNumAllow = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    field.onChange(OnlyNumAllow);
                                  }}
                                />
                              )}
                            />
                          </CardText>
                        </Col>
                        <Col className="my-lg-0 mt-2" lg="2" sm="12">
                          <CardText className="col-title mb-md-50 mb-0">
                            Price
                          </CardText>
                          <CardText className="mb-0">
                            {selectedPark[i]?.ParkingAmount || 0} X{" "}
                            {watch(`NoOfDays_${i}`) || 0}
                          </CardText>
                        </Col>

                        <Col className="my-lg-0 mt-2" lg="2" sm="12">
                          <CardText className="col-title mb-md-50 mb-0">
                            Total Price
                          </CardText>
                          <CardText className="mb-0">
                            <strong>
                              $
                              {(
                                Number(selectedPark[i]?.ParkingAmount || 0) *
                                Number(watch(`NoOfDays_${i}`) || 0)
                              ).toFixed(2)}
                            </strong>
                          </CardText>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-center border-start invoice-product-actions py-50 px-25">
                        <X
                          size={18}
                          className="cursor-pointer"
                          onClick={deleteForm}
                        />
                      </div>
                    </Col>
                  </Row>
                </Tag>
              );
            }}
          </Repeater>
          <Row className="mt-1">
            <Col sm="12" className="px-0">
              <Button
                color="primary"
                size="sm"
                className="btn-add-new"
                onClick={() => setCount(count + 1)}
              >
                <Plus size={14} className="me-25"></Plus>{" "}
                <span className="align-middle">Add item</span>
              </Button>
            </Col>
          </Row>
          {/* </CardBody> */}
        </div>
        <Row>
          <Col className="d-flex justify-content-end mt-3">
            {/* <Button
                          color="secondary"
                          className="me-2"
                          onClick={() => reset()}
                        >
                          Reset
                        </Button> */}
            <Button color="primary" type="submit" className="me-5">
              Next
            </Button>
          </Col>
        </Row>
        <Payment_section />
      </Card>

      {/* <Sidebar
        size="lg"
        open={open}
        title="Create New Member
"
        headerClassName="mb-1"
        contentClassName="p-0"
        toggleSidebar={toggleSidebar}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="6" className="mb-1">
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
            <Col md="6" className="mb-1">
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
            <Col md="6" className="mb-1">
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
            <Col md="6" className="mb-1">
              <Label sm="3" for="phone">
                Country Code
              </Label>

              <Controller
                name="countryCode"
                control={control}
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
            <Col md="6" className="mb-1">
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

            <Col md="6" className="mb-1">
              <Label className="form-label" for="postalCode">
                Postal Code
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                id="postalCode"
                name="postalCode"
                rules={{
                  required: "Postal code is required",
                  pattern: {
                    value: /^[0-9]{4,10}$/,
                    message: "Enter a valid postal code",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Postal Code"
                    invalid={errors.postalCode && true}
                    {...field}
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

          <div className="d-flex flex-wrap my-2">
            <Button color="secondary" onClick={() => setOpen(false)} outline>
              Cancel
            </Button>
            <Button
              className="mx-1"
              color="primary"
              // onClick={() => setOpen(false)}
            >
              Add
            </Button>
          </div>
        </Form>
      </Sidebar> */}
    </Fragment>
  );
};

export default SellPass;
