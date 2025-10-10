import useJwt from "@src/auth/jwt/useJwt";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
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

const CreateCustomerModal = ({
  showModal,
  toggleModal,
  setSelectedCustomer,
  selectedCustomer,
}) => {
  const queryClient = useQueryClient();
  const toast = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ local loader state

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "9876543210",
      emailId: "john.doe@example.com",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "US",
      pinCode: "10001",
    },
  });

  // Mutation for creating a new customer
  const mutation = useMutation({
    mutationFn: async (newCustomer) => {
      return await useJwt.CreateNewCustomer(newCustomer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      reset();
      setTimeout(() => toggleModal(), 300); // Small delay to show loader
    },
  });

  // Submit handler
  const onModalSubmit = async (data) => {
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

    try {
      {
        {
          debugger;
        }
      }
      setIsSubmitting(true);
      const response = await mutation.mutateAsync(payload);
      setSelectedCustomer(response?.data);
      toast.current.show({
        severity: "success",
        summary: "Customer Added",
        detail: "New customer has been successfully added",
        life: 2000,
      });

      reset();
      toggleModal();
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.current.show({
        severity: "error",
        summary: "Submission Failed",
        detail: error?.response?.data?.content || "Something went wrong",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false); // ✅ stop loader
    }
  };

  // Helper to restrict input to only letters
  const onlyLetters = (value) => value.replace(/[^a-zA-Z ]/g, "");

  // Helper to restrict input to only numbers
  const onlyNumbers = (value) => value.replace(/[^0-9]/g, "");

  return (
    <Modal
      isOpen={showModal}
      toggle={toggleModal}
      className="modal-dialog-centered"
    >
      <Toast ref={toast} />
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
                    message: "Only letters allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="firstName"
                    placeholder="Enter first name"
                    invalid={!!errors.firstName}
                    onChange={(e) =>
                      field.onChange(onlyLetters(e.target.value))
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
                    message: "Only letters allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="lastName"
                    placeholder="Enter last name"
                    invalid={!!errors.lastName}
                    onChange={(e) =>
                      field.onChange(onlyLetters(e.target.value))
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
              <Label htmlFor="phoneNumber">Phone Number *</Label>
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
                    onChange={(e) =>
                      field.onChange(onlyNumbers(e.target.value))
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
              <Label htmlFor="emailId">Email</Label>
              <Controller
                name="emailId"
                control={control}
                rules={{
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="emailId"
                    type="email"
                    placeholder="Enter email"
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
              <Label htmlFor="address">Address</Label>
              <Controller
                name="address"
                control={control}
                rules={{
                  pattern: {
                    value: /^[A-Za-z0-9\s.,-]*$/,
                    message:
                      "Only letters, numbers, spaces, dot, comma, and dash allowed",
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
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.replace(/[^A-Za-z0-9\s.,-]/g, "")
                      )
                    }
                  />
                )}
              />
              {errors.address && (
                <span className="text-danger">{errors.address.message}</span>
              )}
            </Col>

            {/* City */}
            <Col md={6}>
              <Label htmlFor="city">City *</Label>
              <Controller
                name="city"
                control={control}
                rules={{
                  required: "City is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only letters allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="city"
                    placeholder="Enter city"
                    invalid={!!errors.city}
                    onChange={(e) =>
                      field.onChange(onlyLetters(e.target.value))
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
              <Label htmlFor="state">State *</Label>
              <Controller
                name="state"
                control={control}
                rules={{
                  required: "State is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only letters allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="state"
                    placeholder="Enter state"
                    invalid={!!errors.state}
                    onChange={(e) =>
                      field.onChange(onlyLetters(e.target.value))
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
              <Label htmlFor="country">Country *</Label>
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
              <Label htmlFor="pinCode">Zip Code *</Label>
              <Controller
                name="pinCode"
                control={control}
                rules={{
                  required: "ZIP code is required",
                  pattern: { value: /^[0-9]{5}$/, message: "Must be 5 digits" },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="pinCode"
                    placeholder="Enter ZIP code"
                    invalid={!!errors.pinCode}
                    maxLength={5}
                    onChange={(e) =>
                      field.onChange(onlyNumbers(e.target.value))
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
                color="primary"
                className="mx-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="d-flex align-items-center">
                    Submitting...
                    <Spinner size="sm" />
                  </span>
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
