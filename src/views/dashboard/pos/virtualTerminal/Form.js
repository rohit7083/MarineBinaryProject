import { selectThemeColors } from "@utils";
import Cleave from "cleave.js/react";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormFeedback,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";

// ** Auth
import useJwt from "@src/auth/jwt/useJwt";

import ExistingCustomer from "./ExistingCustomer";
import WalkinCustomer from "./WalkinCustomer";

// ** Card Images (you'll need to import these or define the path)
const cardsObj = {
  visa: "/path/to/visa.png",
  mastercard: "/path/to/mastercard.png",
  amex: "/path/to/amex.png",
  discover: "/path/to/discover.png",
  jcb: "/path/to/jcb.png",
  diners: "/path/to/diners.png",
  maestro: "/path/to/maestro.png",
};

// ** Card Type Options
const cardTypeOptions = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
  { value: "jcb", label: "JCB" },
];

// Add this function at the top of your component
const luhnCheck = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s+/g, "");
  if (!/^\d+$/.test(cleanNumber)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

const MultipleColumnForm = () => {
  // Define default values with proper initialization
  const defaultValues = {
    firstName: "",
    lastName: "",
    emailId: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    product: "",
    amount: "",
    cardType: null,
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  };

  // Fixed useForm configuration
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange", // Add this to prevent focusing errors
    shouldFocusError: false, // Disable auto-focus on error to prevent elm.focus error
  });

  // Updated state to handle three customer types
  const [customerType, setCustomerType] = useState("new"); // 'new', 'existing', 'walkin'
  const [cardType, setCardType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);

  // Function to get header title based on customer type
  const getHeaderTitle = () => {
    switch (customerType) {
      case "existing":
        return "Existing Customer";
      case "walkin":
        return "Walkin Customer";
      default:
        return "New Customer";
    }
  };
  //commment addedAS

  // Enhanced reset function
  const resetForm = () => {
    reset(defaultValues);
    setCardType("");

    // Clear any additional state if needed
    setTimeout(() => {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, defaultValues[key], {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false,
        });
      });
    }, 100);
  };

  // Function to transform form data to API format
  const transformDataForAPI = (formData) => {
    // Split expiry date (MM/YY) into month and year
    const expiryParts = formData.expiryDate
      ? formData.expiryDate.split("/")
      : ["", ""];
    const expiryMonth = expiryParts[0] || "";
    const expiryYear = expiryParts[1] ? `20${expiryParts[1]}` : ""; // Convert YY to YYYY

    // Get card type label from the selected option
    const selectedCardType = formData.cardType ? formData.cardType.label : "";

    // Remove spaces from card number
    const cleanCardNumber = formData.cardNumber
      ? formData.cardNumber.replace(/\s+/g, "")
      : "";

    return {
      virtualTerminalDto: {
        product: formData.product || "",
        amount: parseFloat(formData.amount) || 0.0,
        customer: {
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          emailId: formData.emailId || "",
          phoneNumber: formData.phoneNumber || "",
          address: formData.address || "",
          city: formData.city || "",
          state: formData.state || "",
          country: formData.country || "",
          pinCode: formData.pinCode || "",
        },
      },
      paymentDto: {
        paymentMode: 1, // Default value as required
        finalPayment: parseFloat(formData.amount) || 0.0,
        cardNumber: cleanCardNumber, // Now sending clean card number without spaces
        cardType: selectedCardType,
        cardExpiryYear: expiryYear,
        cardExpiryMonth: expiryMonth,
        cardCvv: formData.cvv || "",
        nameOnCard: formData.cardHolderName || "",
      },
    };
  };

  // Function to send data to API
  // Function to send data to API
  // Function to send data to API
  const sendToAPI = async (apiData) => {
    try {
      setIsLoading(true);

      const response = await useJwt.NewCustomerInTerminal(apiData);

      if (response.data.status === "success") {
        toast.current.show({
          severity: "success",
          summary: "Payment Successful",
          detail: "Your payment has been processed successfully.",
          life: 2000,
        });
        // Enhanced reset after successful submission
        resetForm();

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Handle non-200 status codes
        let errorMessage = "Payment failed. Please try again.";

        // Try to extract error message from response
        try {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          errorMessage = errorData.content || errorData.message || errorMessage;

          // Ensure errorMessage is always a string
          if (typeof errorMessage === "object") {
            errorMessage = JSON.stringify(errorMessage);
          }
        } catch (jsonError) {
          console.error("Error parsing response:", jsonError);
        }

        // Ensure final errorMessage is a string
        errorMessage = String(errorMessage);

        toast.current.show({
          severity: "error",
          summary: "Payment Failed",
          detail: errorMessage,
          life: 2000,
        });
      }
    } catch (error) {
      console.error("Network Error:", error);

      // Extract error message properly
      let errorMessage = "Payment failed. Please try again.";

      if (error.response && error.response.data) {
        // Priority: content > message > error
        const data = error.response.data;
        errorMessage =
          data.content || data.message || data.error || errorMessage;

        // Ensure errorMessage is always a string
        if (typeof errorMessage === "object") {
          errorMessage = JSON.stringify(errorMessage);
        }
      } else if (error.message) {
        // Use the error message from the exception
        errorMessage = error.message;
      }
      //hey
      // Ensure final errorMessage is a string
      errorMessage = String(errorMessage);

      toast.current.show({
        severity: "error",
        summary: "Payment Failed",
        detail: errorMessage,
        life: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {

    // Transform data to API format
    const apiData = transformDataForAPI(data);
     ("API Data:", apiData);

    // Send to API
    sendToAPI(apiData);
  };

  return (
    <Card>
      <Toast ref={toast} />
      <CardHeader>
        <h4>{getHeaderTitle()}</h4>

        <div className="d-flex justify-content-end">
          {/* Show buttons based on current customer type */}
          {customerType === "new" && (
            <>
              <Button
                color="primary"
                size="sm"
                onClick={() => setCustomerType("walkin")}
              >
                Walkin Customer
              </Button>
              <Button
                size="sm"
                className="ms-2"
                color="primary"
                onClick={() => setCustomerType("existing")}
              >
                Existing Customer
              </Button>
            </>
          )}

          {customerType === "existing" && (
            <>
              <Button
                color="primary"
                size="sm"
                onClick={() => setCustomerType("walkin")}
              >
                Walkin Customer
              </Button>
              <Button
                size={"sm"}
                className="ms-2"
                color="primary"
                onClick={() => setCustomerType("new")}
              >
                New Customer
              </Button>
            </>
          )}

          {customerType === "walkin" && (
            <>
              <Button
                color="primary"
                size="sm"
                onClick={() => setCustomerType("new")}
              >
                New Customer
              </Button>
              <Button
                size="sm"
                className="ms-2"
                color="primary"
                onClick={() => setCustomerType("existing")}
              >
                Existing Customer
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardBody>
        {/* Render components based on customer type */}
        {customerType === "existing" && <ExistingCustomer />}

        {customerType === "walkin" && <WalkinCustomer />}

        {customerType === "new" && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {/* First Name */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="firstName">
                  First Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{
                    required: "First name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message:
                        "First name should only contain letters and spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="firstName"
                      placeholder="First Name"
                      {...field}
                      value={field.value || ""} // Ensure controlled component
                      invalid={!!errors.firstName}
                      onKeyPress={(e) => {
                        // Prevent typing numbers and special characters
                        if (!/[A-Za-z\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                />
                {errors.firstName && (
                  <FormFeedback>{errors.firstName.message}</FormFeedback>
                )}
              </Col>

              {/* Last Name */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="lastName">
                  Last Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{
                    required: "Last name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message:
                        "Last name should only contain letters and spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="lastName"
                      placeholder="Last Name"
                      {...field}
                      value={field.value || ""} // Ensure controlled component
                      invalid={!!errors.lastName}
                      onKeyPress={(e) => {
                        // Prevent typing numbers and special characters
                        if (!/[A-Za-z\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                />
                {errors.lastName && (
                  <FormFeedback>{errors.lastName.message}</FormFeedback>
                )}
              </Col>

              {/* Email ID */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="emailId">
                  Email <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="emailId"
                  control={control}
                  rules={{
                    required: "Email is required",
                    maxLength: {
                      value: 254,
                      message: "Email cannot exceed 254 characters",
                    },
                    pattern: {
                      // RFC 5322 compliant but practical regex
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                    validate: {
                      noSpaces: (v) =>
                        !/\s/.test(v) ? true : "Email cannot contain spaces",
                      trimmed: (v) =>
                        v === v.trim() ? true : "Remove extra spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      id="emailId"
                      placeholder="Email"
                      {...field}
                      value={field.value || ""} // Ensure controlled component
                      onChange={(e) => {
                        // Remove any character except letters, digits, @, dot, hyphen, underscore, plus
                        const cleaned = e.target.value.replace(
                          /[^a-zA-Z0-9@._+-]/g,
                          ""
                        );
                        field.onChange(cleaned.trim());
                      }}
                      onKeyPress={(e) => {
                        // Prevent typing characters other than letters, digits, @, dot, hyphen, underscore, plus
                        const regex = /[a-zA-Z0-9@._+-]/;
                        if (!regex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      invalid={!!errors.emailId}
                    />
                  )}
                />
                {errors.emailId && (
                  <FormFeedback>{errors.emailId.message}</FormFeedback>
                )}
              </Col>

              {/* Phone Number */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="phoneNumber">
                  Phone Number <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Enter a valid phone number (10–15 digits)",
                    },
                    validate: {
                      noSpaces: (v) =>
                        !/\s/.test(v)
                          ? true
                          : "Phone number cannot contain spaces",
                      trimmed: (v) =>
                        v === v.trim() ? true : "Remove extra spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="tel"
                      id="phoneNumber"
                      placeholder="e.g. 9876543210"
                      {...field}
                      value={field.value ? field.value.replace(/\D/g, "") : ""} // only digits
                      onChange={
                        (e) => field.onChange(e.target.value.replace(/\D/g, "")) // strip non-digits
                      }
                      onKeyPress={(e) => {
                        // block anything that's not a digit
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      invalid={!!errors.phoneNumber}
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <FormFeedback>{errors.phoneNumber.message}</FormFeedback>
                )}
              </Col>

              {/* Address */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="address">
                  Address
                </Label>
                <Controller
                  name="address"
                  control={control}
                  rules={{
                    minLength: {
                      value: 5,
                      message: "Address must be at least 5 characters",
                    },
                    maxLength: {
                      value: 255,
                      message: "Address cannot exceed 255 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\s,]*$/,
                      message: "Address contains invalid characters",
                    },
                    validate: {
                      trimmed: (v) =>
                        v === v.trim() ? true : "Remove extra spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="address"
                      placeholder="Address"
                      {...field}
                      value={field.value || ""} // Ensure controlled component
                      onChange={(e) => {
                        // Remove all characters except letters, numbers, spaces, and commas
                        const cleaned = e.target.value.replace(
                          /[^a-zA-Z0-9\s,]/g,
                          ""
                        );
                        field.onChange(cleaned);
                      }}
                      onKeyPress={(e) => {
                        // Prevent typing invalid characters
                        if (!/[a-zA-Z0-9\s,]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      invalid={!!errors.address}
                    />
                  )}
                />
                {errors.address && (
                  <FormFeedback>{errors.address.message}</FormFeedback>
                )}
              </Col>

              {/* City */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="city">
                  City
                </Label>
                <Controller
                  name="city"
                  control={control}
                  rules={{
                    minLength: {
                      value: 2,
                      message: "City must be at least 2 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "City cannot exceed 100 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message:
                        "City can only contain letters, numbers, and spaces",
                    },
                    validate: {
                      trimmed: (v) =>
                        v === v.trim() ? true : "Remove extra spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="city"
                      placeholder="City"
                      {...field}
                      value={field.value || ""} // Ensure controlled component
                      onChange={(e) => {
                        // Remove any character that's not a letter, number, or space
                        const cleaned = e.target.value.replace(
                          /[^a-zA-Z0-9\s]/g,
                          ""
                        );
                        field.onChange(cleaned);
                      }}
                      onKeyPress={(e) => {
                        // Block typing invalid characters
                        if (!/[a-zA-Z0-9\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      invalid={!!errors.city}
                    />
                  )}
                />
                {errors.city && (
                  <FormFeedback>{errors.city.message}</FormFeedback>
                )}
              </Col>

              {/* State */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="state">
                  State
                </Label>
                <Controller
                  name="state"
                  control={control}
                  rules={{
                    minLength: {
                      value: 2,
                      message: "State must be at least 2 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "State cannot exceed 100 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message:
                        "State can only contain letters, numbers, and spaces",
                    },
                    validate: {
                      trimmed: (v) =>
                        v === v.trim() ? true : "Remove extra spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="state"
                      placeholder="State"
                      {...field}
                      value={field.value || ""} // Ensure controlled component
                      onChange={(e) => {
                        // Remove any character that's not a letter, number, or space
                        const cleaned = e.target.value.replace(
                          /[^a-zA-Z0-9\s]/g,
                          ""
                        );
                        field.onChange(cleaned);
                      }}
                      onKeyPress={(e) => {
                        // Block typing invalid characters
                        if (!/[a-zA-Z0-9\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      invalid={!!errors.state}
                    />
                  )}
                />
                {errors.state && (
                  <FormFeedback>{errors.state.message}</FormFeedback>
                )}
              </Col>

              {/* Country */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="country">
                  Country
                </Label>
                <Controller
                  name="country"
                  control={control}
                  rules={{
                    minLength: {
                      value: 2,
                      message: "Country must be at least 2 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Country cannot exceed 100 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message:
                        "Country can only contain letters, numbers, and spaces",
                    },
                    validate: {
                      trimmed: (v) =>
                        v === v.trim() ? true : "Remove extra spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="country"
                      placeholder="Country"
                      {...field}
                      value={field.value || ""} // Ensure controlled component
                      onChange={(e) => {
                        // Remove any character that's not a letter, number, or space
                        const cleaned = e.target.value.replace(
                          /[^a-zA-Z0-9\s]/g,
                          ""
                        );
                        field.onChange(cleaned);
                      }}
                      onKeyPress={(e) => {
                        // Block typing invalid characters
                        if (!/[a-zA-Z0-9\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      invalid={!!errors.country}
                    />
                  )}
                />
                {errors.country && (
                  <FormFeedback>{errors.country.message}</FormFeedback>
                )}
              </Col>

              {/* Pin Code */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="pinCode">
                  Zip Code
                </Label>
                <Controller
                  name="pinCode"
                  control={control}
                  rules={{
                    required: "Zip Code is required",
                    pattern: {
                      value: /^[0-9]{5}$/, // exactly 5 digits
                      message: "Enter a valid 5-digit Zip Code",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="pinCode"
                      placeholder="Zip Code"
                      {...field}
                      value={
                        field.value
                          ? field.value.replace(/\D/g, "").slice(0, 5)
                          : ""
                      } // keep only digits, max 5
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(/\D/g, "").slice(0, 5)
                        )
                      }
                      invalid={!!errors.pinCode}
                    />
                  )}
                />
                {errors.pinCode && (
                  <FormFeedback>{errors.pinCode.message}</FormFeedback>
                )}
              </Col>

              {/* Product */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="product">
                  Product <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="product"
                  control={control}
                  rules={{
                    required: "Product is required",
                    minLength: {
                      value: 2,
                      message: "Product name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 150,
                      message: "Product name cannot exceed 150 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message:
                        "Product name can only contain letters, numbers, and spaces",
                    },
                    validate: {
                      trimmed: (v) =>
                        v === v.trim() ? true : "Remove extra spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="product"
                      placeholder="Enter Product"
                      {...field}
                      value={field.value || ""} // Ensure controlled component
                      onChange={(e) => {
                        // Remove any character that's not a letter, number, or space
                        const cleaned = e.target.value.replace(
                          /[^a-zA-Z0-9\s]/g,
                          ""
                        );
                        field.onChange(cleaned);
                      }}
                      onKeyPress={(e) => {
                        // Block typing invalid characters
                        if (!/[a-zA-Z0-9\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      invalid={!!errors.product}
                    />
                  )}
                />
                {errors.product && (
                  <FormFeedback>{errors.product.message}</FormFeedback>
                )}
              </Col>

              {/* Amount */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="amount">
                  Amount <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: "Amount is required",
                    pattern: {
                      value: /^(?!0\d)\d+(\.\d{1,2})?$/,
                      message: "Please enter a valid amount (up to 2 decimals)",
                    },
                    min: {
                      value: 1,
                      message: "Amount must be greater than 0",
                    },
                    max: {
                      value: 1000000,
                      message: "Amount cannot exceed 1,000,000",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="number"
                      step="0.01"
                      min="1"
                      max="1000000"
                      id="amount"
                      placeholder="Enter Amount"
                      {...field}
                      value={field.value || ""} // Ensure controlled component
                      invalid={!!errors.amount}
                    />
                  )}
                />
                {errors.amount && (
                  <FormFeedback>{errors.amount.message}</FormFeedback>
                )}
              </Col>

              {/* Card Details Header */}
              <Col sm="12" className="mb-1">
                <h6 className="text-secondary">Card Details</h6>
              </Col>

              {/* Card Type Dropdown */}

              {/* <Col md="6" sm="12" className="mb-1">
                <Label className="form-label">
                  Card Type <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="cardType"
                  control={control}
                  rules={{ required: "Card type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      theme={selectThemeColors}
                      className={`react-select ${
                        errors.cardType ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={cardTypeOptions}
                      isClearable={true}
                      placeholder="Select Card Type"
                      value={field.value || null} // Ensure controlled component
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                        if (selectedOption) {
                          setCardType(selectedOption.value);
                        } else {
                          setCardType("");
                        }
                      }}
                    />
                  )}
                />
                {errors.cardType && (
                  <div className="invalid-feedback d-block">
                    Card type is required
                  </div>
                )}
              </Col> */}
              <Controller
                name="cardType"
                control={control}
                rules={{ required: "Card type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    theme={selectThemeColors}
                    className={`react-select ${
                      errors.cardType ? "is-invalid" : ""
                    }`}
                    classNamePrefix="select"
                    options={cardTypeOptions}
                    isClearable={true}
                    placeholder="Select Card Type"
                    value={field.value || null}
                    menuPortalTarget={document.body} // 👈 Add this
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }), // 👈 High z-index
                    }}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                      if (selectedOption) {
                        setCardType(selectedOption.value);
                      } else {
                        setCardType("");
                      }
                    }}
                  />
                )}
              />

              {/* Card Number */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="credit-card">
                  Card Number <span className="text-danger">*</span>
                </Label>
                <InputGroup className="input-group-merge">
                  <Controller
                    name="cardNumber"
                    control={control}
                    rules={{
                      required: "Card number is required",
                      validate: (value) =>
                        luhnCheck(value.replace(/\s+/g, "")) ||
                        "Invalid card number",
                    }}
                    render={({ field }) => (
                      <Cleave
                        {...field}
                        id="credit-card"
                        placeholder="1356 3215 6548 7898"
                        className={`form-control ${
                          errors.cardNumber ? "is-invalid" : ""
                        }`}
                        value={field.value || ""} // Ensure controlled component
                        options={{
                          creditCard: true,
                          onCreditCardTypeChanged: (type) => {
                            setCardType(type);
                            // Auto-select the card type in dropdown based on card number
                            const foundCardType = cardTypeOptions.find(
                              (option) => option.value === type
                            );
                            if (foundCardType) {
                              setValue("cardType", foundCardType);
                            }
                          },
                        }}
                      />
                    )}
                  />
                </InputGroup>
                {errors.cardNumber && (
                  <FormFeedback className="d-block">
                    {errors.cardNumber.message}
                  </FormFeedback>
                )}
              </Col>

              {/* Name on Card */}
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="card-name">
                  Name On Card <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="cardHolderName"
                  control={control}
                  rules={{
                    required: "Name on card is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Name cannot exceed 50 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Name can only contain letters and spaces",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="card-name"
                      placeholder="John Doe"
                      value={field.value || ""} // Ensure controlled component
                      onChange={(e) => {
                        // Remove any character that's not a letter or space
                        const cleaned = e.target.value.replace(
                          /[^a-zA-Z\s]/g,
                          ""
                        );
                        field.onChange(cleaned);
                      }}
                      onKeyPress={(e) => {
                        // Block typing invalid characters
                        if (!/[a-zA-Z\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      invalid={!!errors.cardHolderName}
                    />
                  )}
                />
                {errors.cardHolderName && (
                  <FormFeedback>{errors.cardHolderName.message}</FormFeedback>
                )}
              </Col>

              {/* Expiry Date */}
              <Col md="3" sm="12" className="mb-1">
                <Label className="form-label" for="exp-date">
                  Exp. Date <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="expiryDate"
                  control={control}
                  rules={{
                    required: "Expiry date is required",
                    validate: (value) => {
                      if (!/^\d{2}\/\d{2}$/.test(value))
                        return "Invalid format (MM/YY)";
                      const [month, year] = value.split("/").map(Number);
                      if (month < 1 || month > 12) return "Invalid month";
                      const now = new Date();
                      const expiry = new Date(2000 + year, month);
                      return expiry > now ? true : "Card has expired";
                    },
                  }}
                  render={({ field }) => (
                    <Cleave
                      {...field}
                      id="exp-date"
                      placeholder="MM/YY"
                      className={`form-control ${
                        errors.expiryDate ? "is-invalid" : ""
                      }`}
                      value={field.value || ""} // Ensure controlled component
                      options={{
                        numericOnly: true, // only allow numbers
                        delimiter: "/",
                        blocks: [2, 2],
                      }}
                    />
                  )}
                />
                {errors.expiryDate && (
                  <div className="invalid-feedback d-block">
                    {errors.expiryDate.message}
                  </div>
                )}
              </Col>

              {/* CVV */}
              <Col md="3" sm="12" className="mb-1">
                <Label className="form-label" for="cvv">
                  CVV <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="cvv"
                  control={control}
                  rules={{
                    required: "CVV is required",
                    pattern: {
                      value: /^\d{3,4}$/,
                      message: "CVV must be 3-4 digits",
                    },
                  }}
                  render={({ field }) => (
                    <Cleave
                      {...field}
                      type="password"
                      id="cvv"
                      placeholder="654"
                      className={`form-control ${
                        errors.cvv ? "is-invalid" : ""
                      }`}
                      value={field.value || ""} // Ensure controlled component
                      options={{ blocks: [4], numericOnly: true }} // allow up to 4 digits (AmEx support)
                    />
                  )}
                />
                {errors.cvv && (
                  <div className="invalid-feedback d-block">
                    {errors.cvv.message}
                  </div>
                )}
              </Col>

              {/* Submit and Reset Buttons */}
              <Col sm="12">
                <div className="d-flex">
                  <Button
                    size="sm"
                    className="me-1"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Submit"}
                  </Button>
                  <Button
                    size="sm"
                    outline
                    color="secondary"
                    type="button"
                    disabled={isLoading}
                    onClick={resetForm}
                  >
                    Reset
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default MultipleColumnForm;
