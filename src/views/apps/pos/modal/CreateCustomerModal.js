import useJwt from "@src/auth/jwt/useJwt";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "reactstrap";

const CreateCustomerModal = ({ showModal, toggleModal }) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // ✅ define mutation at top-level
  const mutation = useMutation({
    mutationFn: async (newCustomer) => {
      return await useJwt.CreateNewCustomer(newCustomer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      reset();
      toggleModal();
    },
  });

  // ✅ submit handler
  const onModalSubmit = (data) => {
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
      country: data.country || "US",
      pinCode: data.pinCode,
    };

    console.log("📤 Final Payload:", payload);

    // ✅ call mutation
    mutation.mutate(payload);
  };

  return (
    <Modal
      isOpen={showModal}
      toggle={toggleModal}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={toggleModal}>Add Customer</ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <form onSubmit={handleSubmit(onModalSubmit)}>
          <Row className="gy-1 gx-2 mt-75">
            {/* First Name */}
            <Col md={6}>
              <Label htmlFor="firstName">First Name *</Label>
              <Controller
                name="firstName"
                control={control}
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
                    invalid={!!errors.firstName}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/[^a-zA-Z ]/g, ""))
                    }
                  />
                )}
              />
              {errors.firstName && (
                <span className="text-danger">{errors.firstName.message}</span>
              )}
            </Col>

            {/* Last Name */}
            <Col md={6}>
              <Label htmlFor="lastName">Last Name *</Label>
              <Controller
                name="lastName"
                control={control}
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
                    invalid={!!errors.lastName}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/[^a-zA-Z ]/g, ""))
                    }
                  />
                )}
              />
              {errors.lastName && (
                <span className="text-danger">{errors.lastName.message}</span>
              )}
            </Col>

            {/* Phone Number */}
            <Col md={6}>
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
                    message: "Phone number must be 10 digits",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phoneNumber"
                    placeholder="Enter phone number (10 digits)"
                    invalid={!!errors.phoneNumber}
                    maxLength={10}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/[^0-9]/g, ""))
                    }
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
            <Col md={6}>
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
                    message: "Please enter a valid email address",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="emailId"
                    type="email"
                    placeholder="Enter email address"
                    invalid={!!errors.emailId}
                  />
                )}
              />
              {errors.emailId && (
                <span className="text-danger">{errors.emailId.message}</span>
              )}
            </Col>

            {/* Address */}
            <Col md={6}>
              <Label className="form-label" htmlFor="address">
                Address
              </Label>
              <Controller
                name="address"
                control={control}
                rules={{
                  required: "Address is required",
                  pattern: {

                    value: /^[A-Za-z0-9\s.,-]*$/,
                    message:
                      "Only letters, numbers, spaces, dot, comma, and dash are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="address"
                    type="textarea"
                    rows="3"
                    placeholder="Enter address"
                    invalid={!!errors.address}
                    onChange={(e) => {
                      // live restriction while typing
                      const cleaned = e.target.value.replace(
                        /[^A-Za-z0-9\s.,-]/g,
                        ""
                      );
                      field.onChange(cleaned);
                    }}
                  />
                )}
              />
              {errors.address && (
                <span className="text-danger">{errors.address.message}</span>
              )}
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
                    message: "Only alphabetic characters are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="city"
                    placeholder="Enter city"
                    invalid={!!errors.city}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/[^a-zA-Z ]/g, ""))
                    }
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
                    message: "Only alphabetic characters are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="state"
                    placeholder="Enter state"
                    invalid={!!errors.state}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/[^a-zA-Z ]/g, ""))
                    }
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
                Zip Code *
              </Label>
              <Controller
                name="pinCode"
                control={control}
                rules={{
                  required: "PIN code is required",
                  pattern: {
                    value: /^[0-9]{5}$/,
                    message: "Zip code must be 5 digits",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="pinCode"
                    placeholder="Enter ZIP code"
                    invalid={!!errors.pinCode}
                    maxLength={5}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                )}
              />
              {errors.pinCode && (
                <span className="text-danger">{errors.pinCode.message}</span>
              )}
            </Col>

            {/* Buttons */}
            <Col xs={12} className="text-center mt-1">
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
                disabled={mutation.isLoading}
                className="mx-1"
                color="primary"
              >
                {mutation.isLoading ? (
                  <>
                    Submitting... <Spinner size="sm" />
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
  );
};

export default CreateCustomerModal;
