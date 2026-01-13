import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";

import { selectThemeColors } from "@utils";
import Cleave from "cleave.js/react";
import { useEffect, useRef, useState } from "react";
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

// ** Card Images (you'll need to import these or define the path)
const cardsObj = {
  visa: "/path/to/visa.png",
  mastercard: "/path/to/mastercard.png",
  amex: "/path/to/amex.png",
  // Add other card types as needed
};

// ** Card Type Options
const cardTypeOptions = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "discover", label: "Discover" },
  { value: "jcb", label: "JCB" },
  { value: "Amex", label: "Amex" },
];

const ExistingCustomer = () => {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState({
    phoneOptions: [],
    nameOptions: [],
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cardOptions, setCardOptions] = useState([]);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [cardType, setCardType] = useState("");
  const toast = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const defaultValues = {
    phoneNumber: null,
    customerName: null,
    product: "",
    amount: "",
    cardNumber: null,
    cvv: "",
    cardType: null,
    newCardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    newCvv: "",
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    shouldFocusError: false, // Disable default focus error to prevent the elm.focus error
  });

  // Watch form values to get current customer data
  const watchedPhoneNumber = watch("phoneNumber");
  const watchedCustomerName = watch("customerName");

  // Custom focus error handler
  useEffect(() => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);

      if (element) {
        // Try different focus methods
        if (element.focus) {
          element.focus();
        } else if (element.querySelector && element.querySelector("input")) {
          // For react-select components
          const input = element.querySelector("input");
          if (input && input.focus) {
            input.focus();
          }
        }
      }
    }
  }, [errors]);

  // Enhanced reset function
  const resetForm = () => {
    reset(defaultValues);
    setCardType("");
    setSelectedCustomer(null);
    setCardOptions([]);
    setShowCardDetail(false);
    setTimeout(() => {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, defaultValues[key], { shouldValidate: false });
      });
    }, 100);
  };

  // Get current customer data from form values
  const getCurrentCustomer = () => {
    if (watchedPhoneNumber && watchedPhoneNumber.customerData) {
      return watchedPhoneNumber.customerData;
    }
    if (watchedCustomerName && watchedCustomerName.customerData) {
      return watchedCustomerName.customerData;
    }
    return selectedCustomer;
  };

  const onSubmit = async (data) => {
     ("Form data:", data);

    // Get current customer data
    const currentCustomer = getCurrentCustomer();

    // Validate that customer is selected
    if (!currentCustomer || !currentCustomer.uid) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please select a customer first.",
        life: 3000,
      });
      return;
    }

    // Additional validation for card details
    if (!showCardDetail) {
      // Using existing card - validate card selection and CVV
      if (
        !data.cardNumber ||
        !data.cardNumber.cardData ||
        !data.cardNumber.cardData.uid
      ) {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: "Please select a card.",
          life: 3000,
        });
        return;
      }

      if (!data.cvv || data.cvv.trim() === "") {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: "Please enter CVV for the selected card.",
          life: 3000,
        });
        return;
      }
    } else {
      // Using new card - validate all new card fields
      if (!data.cardType) {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: "Please select card type.",
          life: 3000,
        });
        return;
      }

      if (!data.newCardNumber || data.newCardNumber.trim() === "") {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: "Please enter card number.",
          life: 3000,
        });
        return;
      }

      if (!data.cardHolderName || data.cardHolderName.trim() === "") {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: "Please enter cardholder name.",
          life: 3000,
        });
        return;
      }

      if (!data.expiryDate || data.expiryDate.trim() === "") {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: "Please enter expiry date.",
          life: 3000,
        });
        return;
      }

      if (!data.newCvv || data.newCvv.trim() === "") {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: "Please enter CVV.",
          life: 3000,
        });
        return;
      }
    }

    try {
      let payload;

      // Check if user is using existing card or adding new card
      if (!showCardDetail && data.cardNumber) {
        // Scenario 1: Existing customer + Existing card
        const selectedCardData = data.cardNumber.cardData;

        payload = {
          virtualTerminalDto: {
            product: data.product,
            amount: parseFloat(data.amount),
            customer: {
              uid: currentCustomer.uid,
            },
          },
          paymentDto: {
            finalPayment: parseFloat(data.amount),
            paymentMode: 1,
            existingCardUid: selectedCardData.uid,
            cardCvv: data.cvv,
          },
        };
      } else if (showCardDetail) {
        // Scenario 2: Existing customer + New card
        // Extract expiry year and month from MM/YY format
        const expiryParts = data.expiryDate
          ? data.expiryDate.split("/")
          : ["", ""];
        const expiryMonth = expiryParts[0] || "";
        const expiryYear = expiryParts[1] ? `20${expiryParts[1]}` : ""; // Convert YY to YYYY

        payload = {
          virtualTerminalDto: {
            product: data.product,
            amount: parseFloat(data.amount),
            customer: {
              uid: currentCustomer.uid,
            },
          },
          paymentDto: {
            paymentMode: 1,
            finalPayment: parseFloat(data.amount),
            cardNumber: data.newCardNumber.replace(/\s/g, ""), // Remove spaces
            cardType: data.cardType ? data.cardType.label : "",
            cardExpiryYear: expiryYear,
            cardExpiryMonth: expiryMonth,
            cardCvv: data.newCvv,
            nameOnCard: data.cardHolderName,
          },
        };
      } else {
        return;
      }

       ("API Payload:", payload);
      setIsProcessing(true);
      const response = await useJwt.NewCustomerInTerminal(payload);

      if (response?.data?.status === "success") {
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
        toast.current.show({
          severity: "error", // <-- use 'error' instead of 'failed'
          summary: "Payment Failed",
          detail: "Payment failed. Please try again.",
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

      // Ensure final errorMessage is a string
      errorMessage = String(errorMessage);

      toast.current.show({
        severity: "error",
        summary: "Payment Failed",
        detail: errorMessage,
        life: 2000,
      });
    } finally {
      setIsProcessing(false);
      // Don't reset selectedCustomer here to maintain form state
    }
  };

  // useEffect(() => {
  //   const fetchCustomer = async () => {
  //     try {
  //       setLoading(true)
  //       const response = await useJwt.getAllCustomers()
  //       const customersData = response.data.content.result
  //       const filteredCustomers = customersData.filter(customer => customer.isWalkIn === false)

  //       setCustomers(filteredCustomers)

  //       const phoneOptions = customersData.map(customer => ({
  //         value: customer.phoneNumber,
  //         label: customer.phoneNumber,
  //         customerData: customer
  //       }))

  //       const nameOptions = customersData.map(customer => ({
  //         value: `${customer.firstName} ${customer.lastName}`,
  //         label: `${customer.firstName} ${customer.lastName}`,
  //         customerData: customer
  //       }))

  //       setCustomerList({ phoneOptions, nameOptions })
  //     } catch (error) {
  //       console.error('Error fetching data:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchCustomer()
  // }, [])
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await useJwt.getAllCustomers();
        const customersData = response.data.content.result;

        // ✅ filter only customers where isWalkIn = false
        const filteredCustomers = customersData.filter(
          (customer) => customer.isWalkIn === false
        );

        setCustomers(filteredCustomers);

        const phoneOptions = filteredCustomers.map((customer) => ({
          value: customer.phoneNumber,
          label: customer.phoneNumber,
          customerData: customer,
        }));

        const nameOptions = filteredCustomers.map((customer) => ({
          value: `${customer.firstName} ${customer.lastName}`,
          label: `${customer.firstName} ${customer.lastName}`,
          customerData: customer,
        }));

        setCustomerList({ phoneOptions, nameOptions });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const updateCardOptions = (customer) => {
    if (customer && customer.cardPayment && customer.cardPayment.length > 0) {
      const cardOpts = customer.cardPayment.map((card) => ({
        value: card.cardNumber,
        label: `${card.cardNumber}`,
        cardData: card, // This contains the card uid and other details
      }));
      setCardOptions(cardOpts);
    } else {
      setCardOptions([]);
    }
    setValue("cardNumber", null);
  };

  const handlePhoneChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedCustomer(selectedOption.customerData);
      updateCardOptions(selectedOption.customerData);
      const customerName = `${selectedOption.customerData.firstName} ${selectedOption.customerData.lastName}`;
      setValue("customerName", {
        value: customerName,
        label: customerName,
        customerData: selectedOption.customerData,
      });
    } else {
      setSelectedCustomer(null);
      setCardOptions([]);
      setValue("customerName", null);
      setValue("cardNumber", null);
    }
  };

  const handleNameChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedCustomer(selectedOption.customerData);
      updateCardOptions(selectedOption.customerData);
      setValue("phoneNumber", {
        value: selectedOption.customerData.phoneNumber,
        label: selectedOption.customerData.phoneNumber,
        customerData: selectedOption.customerData,
      });
    } else {
      setSelectedCustomer(null);
      setCardOptions([]);
      setValue("phoneNumber", null);
      setValue("cardNumber", null);
    }
  };

  // Get current customer for display (either from selectedCustomer or form values)
  const displayCustomer = getCurrentCustomer();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={toast} />
      <Row>
        {/* Phone Number Dropdown */}
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label">Search Contact Number</Label>
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: "Please select a customer by phone number or name",
            }}
            render={({ field }) => (
              <Select
                {...field}
                theme={selectThemeColors}
                className={`react-select ${
                  errors.phoneNumber ? "is-invalid" : ""
                }`}
                classNamePrefix="select"
                options={customerList.phoneOptions}
                isLoading={loading}
                isClearable={true}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption);
                  handlePhoneChange(selectedOption);
                }}
              />
            )}
          />
          {errors.phoneNumber && (
            <FormFeedback className="d-block">
              {errors.phoneNumber.message}
            </FormFeedback>
          )}
        </Col>

        {/* Customer Name Dropdown */}
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label">Search Customer Name</Label>
          <Controller
            name="customerName"
            control={control}
            rules={{
              required: "Please select a customer by phone number or name",
            }}
            render={({ field }) => (
              <Select
                {...field}
                theme={selectThemeColors}
                className={`react-select ${
                  errors.customerName ? "is-invalid" : ""
                }`}
                classNamePrefix="select"
                options={customerList.nameOptions}
                isLoading={loading}
                isClearable={true}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption);
                  handleNameChange(selectedOption);
                }}
              />
            )}
          />
          {errors.customerName && (
            <FormFeedback className="d-block">
              {errors.customerName.message}
            </FormFeedback>
          )}
        </Col>

        {/* Customer Details Card */}
        {displayCustomer && (
          <Col sm="12" className="mb-2">
            <Card className="bg-secondary text-white">
              <CardHeader>
                Fullname: {displayCustomer.firstName} {displayCustomer.lastName}
              </CardHeader>
              <CardBody>
                <p>Phone Number: {displayCustomer.phoneNumber}</p>
                <p>Email Id: {displayCustomer.emailId}</p>
                <p>Address: {displayCustomer.address}</p>
                <p>City: {displayCustomer.city}</p>
                <p>Country: {displayCustomer.country}</p>
                <p>Zip Code: {displayCustomer.pinCode}</p>
              </CardBody>
            </Card>
          </Col>
        )}

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
                trimmed: (v) => (v === v.trim() ? true : "Remove extra spaces"),
              },
            }}
            render={({ field }) => (
              <Input
                type="text"
                id="product"
                placeholder="Enter Product"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  // Allow only letters, numbers, and spaces
                  const cleaned = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
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
                value: /^(?!0\d)\d+(\.\d{0,2})?$/,
                message: "Please enter a valid amount (up to 2 decimals)",
              },
              min: { value: 1, message: "Amount must be greater than 0" },
              max: {
                value: 1000000,
                message: "Amount cannot exceed 1,000,000",
              },
            }}
            render={({ field }) => (
              <Input
                type="text"
                id="amount"
                placeholder="Enter Amount"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  // Allow only numbers and one decimal
                  let value = e.target.value.replace(/[^0-9.]/g, "");
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts[1]; // keep only first decimal
                  }
                  field.onChange(value);
                }}
                onKeyPress={(e) => {
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault(); // block non-numeric
                  }
                  if (e.key === "." && field.value?.includes(".")) {
                    e.preventDefault(); // block multiple decimals
                  }
                }}
                invalid={!!errors.amount}
              />
            )}
          />
          {errors.amount && (
            <FormFeedback>{errors.amount.message}</FormFeedback>
          )}
        </Col>

        {/* Card Details */}
        <Col sm="12">
          <h6 className="text-secondary">Card Details</h6>
        </Col>

        {/* Select Card */}
        {!showCardDetail && (
          <Col md="6" sm="12" className="mb-1">
            <Label className="form-label">Select Card</Label>
            <Controller
              name="cardNumber"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  options={cardOptions}
                  isClearable={true}
                  isDisabled={!displayCustomer || cardOptions.length === 0}
                  placeholder={
                    !displayCustomer
                      ? "Please select a customer first"
                      : cardOptions.length === 0
                      ? "No cards available for this customer"
                      : "Select a card"
                  }
                />
              )}
            />
          </Col>
        )}

        {/* CVV */}
        {cardOptions.length > 0 && !showCardDetail && (
          <Col md="6" sm="12" className="mb-1">
            <Label className="form-label" for="cvv">
              CVV Number
            </Label>
            <Controller
              name="cvv"
              control={control}
              defaultValue=""
              rules={{
                required: "CVV is required",
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: "CVV must be 4 digits",
                },
                maxLength: {
                  value: 4,
                  message: "CVV cannot exceed 4 digits",
                },
              }}
              render={({ field }) => (
                <Input
                  type="password"
                  id="cvv"
                  placeholder="Enter CVV"
                  maxLength={4} // restrict input length
                  {...field}
                  onChange={(e) => {
                    // allow only digits and max 4 characters
                    const filtered = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 4);
                    field.onChange(filtered);
                  }}
                />
              )}
            />
            {errors.cvv && (
              <small className="text-danger">{errors.cvv.message}</small>
            )}
          </Col>
        )}

        {/* Add New Card Link */}
        {!showCardDetail && (
          <Col sm="12" className="mb-2">
            <h6>
              Add New Card{" "}
              <a
                className="ml-1 font-bold"
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  setShowCardDetail(true);
                }}
              >
                Click here
              </a>
            </h6>
          </Col>
        )}

        {/* Render CardDetail when showCardDetail is true */}
        {showCardDetail && (
          <Col sm="12" className="mb-2">
            <div>
              <Row className="gy-1 gx-2">
                {/* Card Type Dropdown */}
                <Col md={12} xs={12} className="mb-2">
                  <Label className="form-label">Card Type</Label>
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
                  {errors.cardType && (
                    <FormFeedback className="d-block">
                      {errors.cardType.message}
                    </FormFeedback>
                  )}
                </Col>

                <Col md={6} xs={12}>
                  <Label className="form-label" for="credit-card">
                    Card Number
                  </Label>
                  <InputGroup className="input-group-merge">
                    <Controller
                      name="newCardNumber"
                      control={control}
                      rules={{ required: "Card number is required" }}
                      render={({ field }) => (
                        <Cleave
                          {...field}
                          id="credit-card"
                          placeholder="1356 3215 6548 7898"
                          className={`form-control ${
                            errors.newCardNumber ? "is-invalid" : ""
                          }`}
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
                    {/* {cardType !== '' && cardType !== 'unknown' && (
                      <InputGroupText className='cursor-pointer p-25'>
                        <img height='24' alt='card-type' src={cardsObj[cardType]} />
                      </InputGroupText>
                    )} */}
                  </InputGroup>
                  {errors.newCardNumber && (
                    <FormFeedback className="d-block">
                      {errors.newCardNumber.message}
                    </FormFeedback>
                  )}
                </Col>

                <Col md={6}>
                  <Label className="form-label" for="card-name">
                    Name On Card
                  </Label>
                  <Controller
                    name="cardHolderName"
                    control={control}
                    rules={{
                      required: "Cardholder name is required",
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
                        className={errors.cardHolderName ? "is-invalid" : ""}
                        value={field.value || ""}
                        onChange={(e) => {
                          // Allow only letters and spaces
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
                      />
                    )}
                  />
                  {errors.cardHolderName && (
                    <FormFeedback className="d-block">
                      {errors.cardHolderName.message}
                    </FormFeedback>
                  )}
                </Col>

                <Col xs={6} md={3}>
                  <Label className="form-label" for="exp-date">
                    Exp. Date
                  </Label>
                  <Controller
                    name="expiryDate"
                    control={control}
                    rules={{ required: "Expiry date is required" }}
                    render={({ field }) => (
                      <Cleave
                        {...field}
                        id="exp-date"
                        placeholder="MM/YY"
                        className={`form-control ${
                          errors.expiryDate ? "is-invalid" : ""
                        }`}
                        options={{
                          numericOnly: true, // only allow numbers
                          delimiter: "/",
                          blocks: [2, 2], // MM / YY
                        }}
                      />
                    )}
                  />
                  {errors.expiryDate && (
                    <FormFeedback className="d-block">
                      {errors.expiryDate.message}
                    </FormFeedback>
                  )}
                </Col>

                <Col xs={6} md={3}>
                  <Label className="form-label" for="new-cvv">
                    CVV
                  </Label>
                  <Controller
                    name="newCvv"
                    control={control}
                    rules={{
                      required: "CVV is required",
                      minLength: {
                        value: 3,
                        message: "CVV must be at least 3 digits",
                      },
                      maxLength: {
                        value: 4,
                        message: "CVV must be at most 4 digits",
                      },
                      pattern: {
                        value: /^\d{3,4}$/,
                        message: "CVV must contain only digits",
                      },
                    }}
                    render={({ field }) => (
                      <Cleave
                        {...field}
                        type="password"
                        id="new-cvv"
                        placeholder="654"
                        className={`form-control ${
                          errors.newCvv ? "is-invalid" : ""
                        }`}
                        options={{ blocks: [4], numericOnly: true }}
                      />
                    )}
                  />
                  {errors.newCvv && (
                    <FormFeedback className="d-block">
                      {errors.newCvv.message}
                    </FormFeedback>
                  )}
                </Col>
              </Row>

              {/* Hide existing card link when adding new card */}
              <Row className="mt-2">
                <Col sm="12">
                  <h6>
                    Use Existing Card{" "}
                    <a
                      className="ml-1 font-bold"
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowCardDetail(false);
                        // Clear new card form fields
                        setValue("cardType", null);
                        setValue("newCardNumber", "");
                        setValue("cardHolderName", "");
                        setValue("expiryDate", "");
                        setValue("newCvv", "");
                        setCardType("");
                      }}
                    >
                      Click here
                    </a>
                  </h6>
                </Col>
              </Row>
            </div>
          </Col>
        )}

        {/* Submit & Reset Buttons */}
        <Col sm="12">
          <div className="d-flex">
            <Button
              size="sm"
              className="me-1"
              color="primary"
              type="submit"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Submit"}
            </Button>
            <Button
              size="sm"
              outline
              color="secondary"
              type="button"
              onClick={() => {
                resetForm();
              }}
            >
              Reset
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default ExistingCustomer;
