import useJwt from "@src/auth/jwt/useJwt";
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Button,
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

const defaultValues = {
  // firstName: "Rohit ",
  // lastName: "son  ",
  // phoneNumber: "1236547890",
  // emailId: "E@gmail.com",
  // address: "nashik",
  // city: "nashik",
  // state: "ashik",
  // country: "nashik",
  // pinCode: "25625",
};

const AddNewAddress = ({ showModal, row, setShow, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(""); // store API error
  const toast = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (row) {
      reset(row);
    }
  }, [row, reset]);

  const onSubmit = async (data) => {
     ("data", data);

    try {
      setLoading(true);
      setErr(""); // clear previous error

      if (row?.uid) {
        const response = await useJwt.updateCustomer(row?.uid, data);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Customer Updated successfully",
          life: 2000,
        });

        reset();
        setShow(false);
        if (onSuccess) onSuccess();
      } else {
        const response = await useJwt.addCustomer(data);
         ("✅ Customer Added:", response.data);

        // show success toast
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Customer added successfully",
          life: 2000,
        });

        reset();
        setShow(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("❌ Error adding customer:", error);

      // set error for modal alert
      setErr(error?.response?.data?.message || "Something went wrong!");

      // show error toast
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Customer add failed.",
        life: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setShow(false);
    reset();
    setErr("");
  };

  return (
    <Fragment>
      {/* Toast container */}
      <Toast ref={toast} />

      <Modal
        isOpen={showModal}
        toggle={toggleModal}
        className="modal-dialog-centered"
      >
        <ModalHeader className="bg-transparent" toggle={toggleModal}>
          {row ? "Update" : " Add"} New Customer
        </ModalHeader>

        <ModalBody className="px-sm-5 mx-50 pb-5">
          {/* Error Alert */}
          {err && (
            <UncontrolledAlert color="danger">
              <div className="alert-body">
                <span className="text-danger fw-bold">
                  <strong>Error :</strong> {err}
                </span>
              </div>
            </UncontrolledAlert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="gy-1 gx-2 mt-75">
              {/* First Name */}
              <Col md={6}>
                <Label className="form-label" htmlFor="firstName">
                  First Name *
                </Label>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{
                    required: "First name is required",
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Only alphabetic characters allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="Enter first name"
                      invalid={!!errors.firstName}
                      onChange={(e) => {
                        // Allow only letters and spaces
                        const onlyLettersAndSpaces = e.target.value.replace(
                          /[^A-Za-z ]/g,
                          ""
                        );
                        field.onChange(onlyLettersAndSpaces);
                      }}
                    />
                  )}
                />
                {errors.firstName && (
                  <span className="text-danger">
                    {errors.firstName.message}
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
                  control={control}
                  rules={{
                    required: "Last name is required",
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Only alphabetic characters allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="lastName"
                      placeholder="Enter last name"
                      invalid={!!errors.lastName}
                      onChange={(e) => {
                        // Allow only letters and spaces
                        const onlyLettersAndSpaces = e.target.value.replace(
                          /[^A-Za-z ]/g,
                          ""
                        );
                        field.onChange(onlyLettersAndSpaces);
                      }}
                    />
                  )}
                />
                {errors.lastName && (
                  <span className="text-danger">{errors.lastName.message}</span>
                )}
              </Col>

              {/* Phone Number */}
              <Col md={12}>
                <Label className="form-label" htmlFor="phoneNumber">
                  Phone Number *
                </Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Must be 10 digits",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phoneNumber"
                      placeholder="Enter phone number"
                      invalid={!!errors.phoneNumber}
                      maxLength={10}
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <span className="text-danger">
                    {errors.phoneNumber.message}
                  </span>
                )}
              </Col>

              {/* Email */}
              <Col md={12}>
                <Label className="form-label" htmlFor="emailId">
                  Email
                </Label>
                <Controller
                  name="emailId"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="emailId"
                      type="email"
                      placeholder="Enter email"
                      invalid={!!errors.emailId}
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
                  <span className="text-danger">{errors.emailId.message}</span>
                )}
              </Col>

              {/* Address */}
              <Col md={12}>
                <Label className="form-label" htmlFor="address">
                  Address
                </Label>
                <Controller
                  name="address"
                  rules={{
                    required: "Phone number is required",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="address"
                      type="textarea"
                      rows="3"
                      placeholder="Enter address"
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
              </Col>

              {/* City */}
              <Col md={6}>
                <Label className="form-label" htmlFor="city">
                  City *
                </Label>
                <Controller
                  name="city"
                  control={control}
                  rules={{
                    required: "City is required",
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Only alphabetic characters allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="city"
                      placeholder="Enter city"
                      invalid={!!errors.city}
                      onChange={(e) => {
                        // Allow only letters and spaces
                        const onlyLettersAndSpaces = e.target.value.replace(
                          /[^A-Za-z ]/g,
                          ""
                        );
                        field.onChange(onlyLettersAndSpaces);
                      }}
                    />
                  )}
                />
                {errors.city && (
                  <span className="text-danger">{errors.city.message}</span>
                )}
              </Col>

              {/* State */}
              <Col md={6}>
                <Label className="form-label" htmlFor="state">
                  State *
                </Label>
                <Controller
                  name="state"
                  control={control}
                  rules={{
                    required: "State is required",
                    pattern: {
                      value: /^[A-Za-z ]+$/,
                      message: "Only alphabetic characters allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="state"
                      placeholder="Enter state"
                      invalid={!!errors.state}
                      onChange={(e) => {
                        // Allow only letters and spaces
                        const onlyLettersAndSpaces = e.target.value.replace(
                          /[^A-Za-z ]/g,
                          ""
                        );
                        field.onChange(onlyLettersAndSpaces);
                      }}
                    />
                  )}
                />
                {errors.state && (
                  <span className="text-danger">{errors.state.message}</span>
                )}
              </Col>

              {/* Country */}
              <Col md={6}>
                <Label className="form-label" htmlFor="country">
                  Country *
                </Label>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="country"
                      placeholder="Enter country"
                      invalid={!!errors.country}
                      onChange={(e) => {
                        // Allow only letters and spaces
                        const onlyLettersAndSpaces = e.target.value.replace(
                          /[^A-Za-z ]/g,
                          ""
                        );
                        field.onChange(onlyLettersAndSpaces);
                      }}
                    />
                  )}
                />
                {errors.country && (
                  <span className="text-danger">{errors.country.message}</span>
                )}
              </Col>

              {/* PIN Code */}
              <Col md={6}>
                <Label className="form-label" htmlFor="pinCode">
                  ZIp Code *
                </Label>
                <Controller
                  name="pinCode"
                  control={control}
                  rules={{
                    required: "PIN code is required",
                    pattern: {
                      value: /^[0-9]{5}$/,
                      message: "Must be 5 digits",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="pinCode"
                      placeholder="Enter Zip code"
                      invalid={!!errors.pinCode}
                      maxLength={5}
                    />
                  )}
                />
                {errors.pinCode && (
                  <span className="text-danger">{errors.pinCode.message}</span>
                )}
              </Col>

              {/* Buttons */}
              <Col className="text-center mt-1" xs={12}>
                <Button
                  type="button"
                  color="secondary"
                  outline
                  size="sm"
                  onClick={toggleModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="mx-1"
                  color="primary"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span>Loading...</span> <Spinner size="sm" />
                    </>
                  ) : (
                    <> {row ? "Update Customer" : "Add Customer"}</>
                  )}
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default AddNewAddress;
