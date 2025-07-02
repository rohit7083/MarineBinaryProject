import { Fragment, useState, useEffect, useRef } from "react";
import ViewClient from "./ViewClient";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Sidebar from "@components/sidebar";
import Repeater from "@components/repeater";
import { countries } from "../../../dashboard/slip-management/CountryCode";
import useJwt from "@src/auth/jwt/useJwt";

import axios from "axios";
import Flatpickr from "react-flatpickr";
import { SlideDown } from "react-slidedown";
import { X, Plus, Hash } from "react-feather";
import Select, { components } from "react-select";
import { Check } from "react-feather";
import { useForm, Controller, set } from "react-hook-form";

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
// import ViewPass from "./ViewPass";
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
const ClientDetaiils = ({
  memberAppendData,
  setSelectedMember,
  setMemberAppendData,
}) => {
  const [childData, setGuestChildData] = useState(null);

  const [options, setOptions] = useState([
    {
      value: "add-new",
      label: "Add New Customer",
      type: "button",
      color: "flat-success",
    },
  ]);
  console.log(childData);

  const OptionComponent = ({ data, ...props }) => {
    if (data.type === "button") {
      return (
        <Button
          className="text-start rounded-0 px-50"
          color={data.color}
          block
          onClick={() => setOpen(true)}
        >
          <Plus className="font-medium-1 me-50" />
          <span className="align-middle">{data.label}</span>
        </Button>
      );
    } else {
      return <components.Option {...props}> {data.label} </components.Option>;
    }
  };

  const [count, setCount] = useState(1);
  const [value, setValue] = useState({});
  const toast = useRef(null);

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
  const [parkName, setparkingName] = useState([]);
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
  };

  const selectedValue = watch("memberType");

  const fetchExistingMem = async () => {
    try {
      const { data } = await useJwt.GetMember();
      
      const memberName = data?.content?.result?.map((x) => ({
        label: `${x.firstName} ${x.lastName}`,

        value: x.uid,
        ...x,
      }));

      setMemberNames(memberName);
    } catch (error) {
       console.error(error);
    }
  };
  // {{ }}
  useEffect(() => {
    fetchExistingMem();
  }, [selectedValue]);

  const existingMemberData = watch("selectedMember");

  const qty = watch("quantity");
// {{ }}

  const onSubmit = (data) => {
    const isGuest = watch("memberType") === "guest";
    const sourceData = isGuest ? childData : existingMemberData;

    // const payload = {
    //   member: {
    //     // uid: sourceData?.uid,
    //     firstName: sourceData?.firstName,
    //     lastName: sourceData?.lastName,
    //     emailId: sourceData?.emailId,
    //     phoneNumber: sourceData?.phoneNumber,
    //     countryCode: sourceData?.countryCode,
    //     address: sourceData?.address,
    //     city: sourceData?.city,
    //     state: sourceData?.state,
    //     country: sourceData?.country,
    //     postalCode: sourceData?.postalCode,
    //   },

    //   quantity: p?.quantity || qty,
    //   calculatedAmount: p.calculatedAmount,

    //   totalAmount: totalPrice,
    // };
    const payload = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      emailId: data?.emailId,
      phoneNumber: data?.phoneNumber,
      countryCode: data?.countryCode?.value,
      address: data?.address,
      city: data?.city,
      state: data?.state,
      country: data?.country,
      postalCode: data?.postalCode,
    };
    console.log("data", payload);
    setMemberAppendData(payload);

    toast.current.show({
      severity: "success",
      summary: "Successfully",
      detail: "Member Added Successfully.",
      life: 2000,
    });

    setTimeout(() => {
      setOpen(false);
    }, 2000);
    reset();
  };

  const selectedMember = watch("selectedMember");

  useEffect(() => {
    if (selectedMember) {
      setSelectedMember(selectedMember);
    }
  }, [selectedMember]);

  const hasSelectedMember =
    selectedMember && Object.keys(selectedMember).length > 0;
  const hasMemberAppendData =
    memberAppendData && Object.keys(memberAppendData).length > 0;

  return (
    <Fragment>
      <Toast ref={toast} />

      <Row className="row-bill-to invoice-spacing mb-2">
        <Col className="col-bill-to ps-0 mx-1" xl="12">
          <Label for="totalPrice">Select Member</Label>

          <div className="invoice-customer">
            <Fragment>
              <Controller
                control={control}
                name="selectedMember"
                // rules={{
                //   required:"Member Is required"
                // }}
                render={({ field }) => {
                  return (
                    <Fragment>
                      <div>
                        <Select
                          {...field}
                          className={`react-select ${
                            errors.selectedMember ? "is-invalid" : ""
                          }`}
                          classNamePrefix="select"
                          id="label"
                          options={[...options, ...memberNames]}
                          theme={selectThemeColors}
                          components={{ Option: OptionComponent }}
                          onChange={(val) => {
                            field.onChange(val); // update react-hook-form
                            handleInvoiceToChange(val); // your custom function
                          }}
                        />
                        {errors.selectedMember && (
                          <div className="invalid-feedback d-block">
                            {errors.selectedMember.message}
                          </div>
                        )}
                      </div>
                    </Fragment>
                  );
                }}
              />
            </Fragment>
          </div>
        </Col>
      </Row>

      {(hasSelectedMember || hasMemberAppendData) && (
        <ViewClient
          selectedMember={hasSelectedMember ? selectedMember : memberAppendData}
        />
      )}
      <Sidebar
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
