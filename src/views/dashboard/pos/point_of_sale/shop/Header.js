import useJwt from "@src/auth/jwt/useJwt";
import { selectThemeColors } from "@utils";
import React, { Fragment, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import ProductHeader from "./ProductsHeader";

function Header({ selectedCustomer, setSelectedCustomer }) {
  const colourOptions = [
    { value: "ocean", label: "Ocean" },
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
  ];

  const [filteredPhoneOptions, setFilteredPhoneOptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);
  const [phoneOptions, setPhoneOptions] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm({});

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [headerError, setHeaderError] = useState(null);
  const [walkiLoading, setWalkinLoading] = useState(false);
  const {
    reset: modalReset,
    control: modalControl,
    handleSubmit: modalHandleSubmit,
    setError: modalSetError,
    watch: modalWatch,
    formState: { errors: modalErrors },
  } = useForm({
    defaultValues: {
      // firstName: "Faizan",
      // lastName: "Shaikh",
      // phoneNumber: "8446334145",
      // emailId: "kndvi@gmail.com",
      // address: "nashik",
      // city: "Nashik",
      // state: "Maharashtra",
      // country: "India",
      // pinCode: "422003",
    },
  });

  const prepareCustomerOptions = (customersData) => {
    if (!customersData || customersData.length === 0) return;

    const nameOptions = customersData?.map((customer) => ({
      value: customer?.uid || "",
      label: `${customer.firstName} ${customer.lastName}`.trim(),
      customerData: customer,
    }));

    const phoneOptions = customersData?.map((customer) => ({
      value: customer?.uid || "",
      label: customer.phoneNumber,
      customerData: customer,
    }));

    setCustomerOptions(nameOptions);
    setPhoneOptions(phoneOptions);
  };

  const fetchCustomers = async () => {
    try {
      const res = await useJwt.getAllCustomers();
      console.log("fetching data from the user table ", res);

      if (res?.data && res?.data?.content && res?.data?.content?.result) {
        const customersData = res?.data?.content?.result || [];
        setCustomers(customersData);
        prepareCustomerOptions(customersData);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const onModalSubmit = async (data) => {
    setHeaderError("");

    let formattedPhoneNumber = data.phoneNumber;
    if (formattedPhoneNumber && !formattedPhoneNumber.startsWith("+91")) {
      formattedPhoneNumber = `+91-${formattedPhoneNumber}`;
    }

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: formattedPhoneNumber,
      emailId: data.emailId || "",
      address: data.address || "",
      city: data.city,
      state: data.state,
      country: data.country || "India",
      pinCode: data.pinCode,
    };

    console.log("📤 Final Payload:", payload);
    console.log("🔗 API Call Starting...");

    try {
      setLoading(true);
      const res = await useJwt.CreateNewCustomer(payload);
      console.log("✅ Customer added successfully:", res);

      setShowModal(false);
      modalReset({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        emailId: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        pinCode: "",
      });

      fetchCustomers();
    } catch (error) {
      console.error("❌ API Error:", error);

      if (error.response) {
        const errorKeys = error?.response?.data?.content;
        console.error("❌ Error Content:", errorKeys);
        setHeaderError(errorKeys);

        if (
          errorKeys &&
          typeof errorKeys === "object" &&
          !Array.isArray(errorKeys)
        ) {
          Object.entries(errorKeys).forEach(([fieldName, message]) => {
            modalSetError(fieldName, { type: "manual", message });
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    modalReset();
    setHeaderError(null);
  };

  const handleCustomerSelect = (selectedOption, fieldType) => {
    if (selectedOption && selectedOption.customerData) {
      const customer = selectedOption.customerData;
      console.log(`Selected customer by ${fieldType}:`, customer);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleNumberChange = (selectedOption) => {
    if (selectedOption) {
      const number = selectedOption.label;
      setSelectedNumber(number);
      console.log("Selected Mobile Number:", number);
    } else {
      setSelectedNumber("");
    }
  };

  const handleNameChange = (selectedOption) => {
    if (selectedOption) {
      const fullName = selectedOption.label;
      setSelectedName(fullName);

      const filteredPhones = customers
        .filter(
          (customer) =>
            `${customer?.firstName} ${customer?.lastName}`.trim() === fullName
        )
        .map((customer) => ({
          value: customer?.uid || "",
          label: customer?.phoneNumber,
          customerData: customer,
        }));

      setFilteredPhoneOptions(filteredPhones);
      console.log("Filtered phone options:", filteredPhones);
    } else {
      setSelectedName("");
      setFilteredPhoneOptions([]);
    }
  };

  useEffect(() => {
    let filtered = customers;

    if (selectedNumber) {
      filtered = customers.filter((c) => c.phoneNumber === selectedNumber);

      if (filtered.length === 1) {
        const nameOption = {
          value: filtered[0]?.uid || "",
          label: `${filtered[0]?.firstName} ${filtered[0]?.lastName}`.trim(),
          customerData: filtered[0],
        };
        setCustomerOptions([nameOption]);
      } else if (filtered.length > 1) {
        const nameOptions = filtered?.map((c) => ({
          value: c?.uid || "",
          label: `${c?.firstName} ${c?.lastName}`.trim(),
          customerData: c,
        }));
        setCustomerOptions(nameOptions);
      }
    }

    if (selectedName) {
      filtered = customers.filter(
        (c) => `${c?.firstName} ${c?.lastName}`.trim() === selectedName
      );

      const phoneOpts = filtered.map((c) => ({
        value: c?.uid || "",
        label: c.phoneNumber,
        customerData: c,
      }));

      setPhoneOptions(phoneOpts);
    }

    if (!selectedName && !selectedNumber) {
      const names = customers?.map((c) => ({
        value: c?.uid || "",
        label: `${c.firstName} ${c.lastName}`.trim(),
        customerData: c,
      }));

      const phones = customers?.map((c) => ({
        value: c?.uid || "",
        label: c.phoneNumber,
        customerData: c,
      }));

      setCustomerOptions(names);
      setPhoneOptions(phones);
    }

    setFilteredCustomers(filtered);

    if (filtered.length === 1) {
      setSelectedCustomer(filtered[0]);
    } else {
      setSelectedCustomer(null);
    }
  }, [selectedName, selectedNumber, customers]);

  const handleWalkin = async () => {
    try {
      setWalkinLoading(true);
      const res = await useJwt.getWalkinCustomer();
      console.log(res);

      const walkinData = res?.data || null;
      if (walkinData) {
        setSelectedCustomer(walkinData);
      }
      setCustomers([]);
    } catch (error) {
      console.log(error);
    } finally {
      setWalkinLoading(false);
    }
  };

  return (
    <Fragment>
      <Row>
        <Col md="12">
          <Card className="round">
            <CardBody>
              <CardTitle tag="h4">
                {" "}
                <ArrowLeft
                  style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    transition: "color 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#9289F3")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#6E6B7B")
                  }
                  onClick={() => window.history.back()}
                />
                Point Of Sale
              </CardTitle>
              <hr />

              <Row className="align-items-start">
                {/* Left side: Title + Search Fields */}
                <Col md="8">
                  <CardTitle tag="h4" className="mb-2">
                    Search Existing Customer
                  </CardTitle>
                  {/* hdey */}
                  <Row>
                    {/* <Col className="mb-1" md="4" sm="12">
                      <Label className="form-label">By Slip No</Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        defaultValue={colourOptions[0]}
                        options={colourOptions}
                        isClearable={false}
                      />
                    </Col> */}

                    <Col className="mb-1" md="6" sm="12">
                      <Label className="form-label">By Contact No</Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        options={phoneOptions}
                        noOptionsMessage={() => "No customers found"}
                        isClearable={true}
                        placeholder="Select phone number..."
                        onChange={handleNumberChange}
                        value={
                          phoneOptions.find(
                            (opt) => opt.label === selectedNumber
                          ) || null
                        }
                      />
                    </Col>

                    <Col className="mb-1" md="6" sm="12">
                      <Label className="form-label">By Customer Names</Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        noOptionsMessage={() => "No customers found"}
                        options={customerOptions}
                        isClearable={true}
                        placeholder="Select customer name..."
                        onChange={handleNameChange}
                        value={
                          customerOptions.find(
                            (opt) => opt.label === selectedName
                          ) || null
                        }
                      />
                    </Col>
                  </Row>
                </Col>

                <Col
                  md="4"
                  className="text-center"
                  style={{ borderLeft: "1px solid gray" }}
                >
                  <CardTitle tag="h4" className="">
                    Add New Customer
                  </CardTitle>
                  <div className="d-flex flex-column align-items-center">
                    <Button
                      color="primary"
                      size="sm"
                      style={{ width: "150px" }}
                      className=""
                      onClick={toggleModal}
                    >
                      Add Customer
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      style={{ width: "150px" }}
                      className="mt-1"
                      onClick={(e) => handleWalkin()}
                      disabled={walkiLoading}
                    >
                      {walkiLoading ? (
                        <>
                          Loading... <Spinner size="sm" />
                        </>
                      ) : (
                        " Walk-In Customer"
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col md="12">
          <ProductHeader selectedCustomer={selectedCustomer} />
        </Col>
      </Row>

      <Modal
        isOpen={showModal}
        toggle={toggleModal}
        className="modal-dialog-centered"
        onClosed={() => modalReset()}
      >
        <ModalHeader
          className="bg-transparent"
          toggle={toggleModal}
        ></ModalHeader>

        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h1 className="text-center mb-1">Add New Customer</h1>

          {headerError && (
            <React.Fragment>
              <UncontrolledAlert color="danger">
                <div className="alert-body">
                  <span className="text-danger fw-bold">
                    <strong>Error : </strong>
                    {headerError}
                  </span>
                </div>
              </UncontrolledAlert>
            </React.Fragment>
          )}

          <form onSubmit={modalHandleSubmit(onModalSubmit)}>
            <Row className="gy-1 gx-2 mt-75">
              {/* First Name */}
              <Col md={6}>
                <Label className="form-label" htmlFor="firstName">
                  First Name *
                </Label>
                <Controller
                  name="firstName"
                  control={modalControl}
                  rules={{
                    required: "First name is required",
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Only alphabetic characters are allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="Enter first name"
                      invalid={!!modalErrors.firstName}
                      onChange={(e) => {
                        const avoidSpecialChars = e.target.value.replace(
                          /[^a-zA-Z ]/g,
                          ""
                        );
                        field.onChange(avoidSpecialChars);
                      }}
                    />
                  )}
                />
                {modalErrors.firstName && (
                  <span className="text-danger">
                    {modalErrors.firstName.message}
                  </span>
                )}
              </Col>

              {/* Last Name */}
              <Col md={6}>
                <Label className="form-label" htmlFor="lastName">
                  Last Name *
                </Label>
                <Controller
                  name="lastName"
                  control={modalControl}
                  rules={{
                    required: "Last name is required",
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Only alphabetic characters are allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="lastName"
                      placeholder="Enter last name"
                      invalid={!!modalErrors.lastName}
                      onChange={(e) => {
                        const avoidSpecialChars = e.target.value.replace(
                          /[^a-zA-Z ]/g,
                          ""
                        );
                        field.onChange(avoidSpecialChars);
                      }}
                    />
                  )}
                />
                {modalErrors.lastName && (
                  <span className="text-danger">
                    {modalErrors.lastName.message}
                  </span>
                )}
              </Col>

              {/* Phone Number */}
              <Col md={12}>
                <Label className="form-label" htmlFor="phoneNumber">
                  Phone Number *
                </Label>
                <Controller
                  name="phoneNumber"
                  control={modalControl}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phoneNumber"
                      placeholder="Enter phone number (10 digits)"
                      invalid={!!modalErrors.phoneNumber}
                      maxLength={10}
                      onChange={(e) => {
                        const avoidSpecialChars = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        field.onChange(avoidSpecialChars);
                      }}
                    />
                  )}
                />
                {modalErrors.phoneNumber && (
                  <span className="text-danger">
                    {modalErrors.phoneNumber.message}
                  </span>
                )}
              </Col>

              {/* Email */}
              <Col md={12}>
                <Label className="form-label" htmlFor="emailId">
                  Email (Optional)
                </Label>
                <Controller
                  name="emailId"
                  control={modalControl}
                  rules={{
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="emailId"
                      type="email"
                      placeholder="Enter email address"
                      invalid={!!modalErrors.emailId}
                    />
                  )}
                />
                {modalErrors.emailId && (
                  <span className="text-danger">
                    {modalErrors.emailId.message}
                  </span>
                )}
              </Col>

              {/* Address */}
              <Col md={12}>
                <Label className="form-label" htmlFor="address">
                  Address (Optional)
                </Label>
                <Controller
                  name="address"
                  control={modalControl}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="address"
                      type="textarea"
                      rows="3"
                      placeholder="Enter address"
                      invalid={!!modalErrors.address}
                    />
                  )}
                />
                {modalErrors.address && (
                  <span className="text-danger">
                    {modalErrors.address.message}
                  </span>
                )}
              </Col>

              {/* City */}
              <Col md={6}>
                <Label className="form-label" htmlFor="city">
                  City *
                </Label>
                <Controller
                  name="city"
                  control={modalControl}
                  rules={{
                    required: "City is required",
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Only alphabetic characters are allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="city"
                      placeholder="Enter city"
                      invalid={!!modalErrors.city}
                      onChange={(e) => {
                        const avoidSpecialChars = e.target.value.replace(
                          /[^a-zA-Z ]/g,
                          ""
                        );
                        field.onChange(avoidSpecialChars);
                      }}
                    />
                  )}
                />
                {modalErrors.city && (
                  <span className="text-danger">
                    {modalErrors.city.message}
                  </span>
                )}
              </Col>

              {/* State */}
              <Col md={6}>
                <Label className="form-label" htmlFor="state">
                  State *
                </Label>
                <Controller
                  name="state"
                  control={modalControl}
                  rules={{
                    required: "State is required",
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Only alphabetic characters are allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="state"
                      placeholder="Enter state"
                      invalid={!!modalErrors.state}
                      onChange={(e) => {
                        const avoidSpecialChars = e.target.value.replace(
                          /[^a-zA-Z ]/g,
                          ""
                        );
                        field.onChange(avoidSpecialChars);
                      }}
                    />
                  )}
                />
                {modalErrors.state && (
                  <span className="text-danger">
                    {modalErrors.state.message}
                  </span>
                )}
              </Col>

              {/* Country */}
              <Col md={6}>
                <Label className="form-label" htmlFor="country">
                  Country *
                </Label>
                <Controller
                  name="country"
                  control={modalControl}
                  rules={{
                    required: "Country is required",
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="country"
                      placeholder="Enter country"
                      invalid={!!modalErrors.country}
                    />
                  )}
                />
                {modalErrors.country && (
                  <span className="text-danger">
                    {modalErrors.country.message}
                  </span>
                )}
              </Col>

              {/* PIN Code */}
              <Col md={6}>
                <Label className="form-label" htmlFor="pinCode">
                  PIN Code *
                </Label>
                <Controller
                  name="pinCode"
                  control={modalControl}
                  rules={{
                    required: "PIN code is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "PIN code must be 6 digits",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="pinCode"
                      placeholder="Enter PIN code"
                      invalid={!!modalErrors.pinCode}
                      maxLength={6}
                      onChange={(e) => {
                        const avoidSpecialChars = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        field.onChange(avoidSpecialChars);
                      }}
                    />
                  )}
                />
                {modalErrors.pinCode && (
                  <span className="text-danger">
                    {modalErrors.pinCode.message}
                  </span>
                )}
              </Col>

              <Col className="text-center mt-1" xs={12}>
                <Button
                  type="button"
                  color="secondary"
                  outline
                  onClick={toggleModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="mx-1"
                  color="primary"
                >
                  {loading ? (
                    <>
                      <span>Loading.. </span>
                      <Spinner size="sm" />{" "}
                    </>
                  ) : (
                    "Add Customer"
                  )}
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

export default Header;
