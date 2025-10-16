// ** React Imports
import { useEffect, useState } from 'react';

// ** Reactstrap Imports
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';

// ** Third Party Components
import { Controller } from 'react-hook-form';
import Select from 'react-select';

//jwt import 

// ** Utils
import { selectThemeColors } from '@utils';

const PaymentModeSection = ({ control, errors, setValue, getValues, watch }) => {
  const [paymentMode, setPaymentMode] = useState(null);
  const [cardType, setCardType] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
    const [file, setFile] = useState(null);
    const [isAssign, setIsassign] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
const companyName = watch("companyName");
  const colourOptions3 = [
    { value: "1", label: "Credit Card" },
    { value: "2", label: "Card Swipe" },
    { value: "3", label: "Cash" },
    { value: "4", label: "Cheque21" },
    { value: "5", label: "ChequeACH" },
    { value: "6", label: "Money Order" },
    { value: "7", label: "Payment Link" },
    { value: "8", label: "QR Code" },
  ];
  const AccountType = [
    { value: "8", label: "Personal Checking Account" },
    { value: "9", label: "Personal Saving Account" },
    { value: "10", label: "Business Checking Account" },
    { value: "11", label: "Business Savings Account" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear + i,
    label: currentYear + i,
  }));

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

   const CompanyOptions = [
    { value: "WesternUnion", label: "WesternUnion" },
    { value: "MoneyGrams", label: "MoneyGrams" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    setAvailableMonths(months);
  }, []);

  const handlepaymentMode = (selectedOption) => {
    const selectedType = selectedOption?.label;
    setPaymentMode(selectedType || null);
  };

  const handleOnchangeCardNum = (e, field) => {
    const value = e.target.value.replace(/\D/g, '');
    field.onChange(value);
    
    // Detect card type based on number
    if (value.startsWith('4')) {
      setCardType('Visa');
      setValue('cardType', 'Visa');
    } else if (value.startsWith('5')) {
      setCardType('Mastercard');
      setValue('cardType', 'Mastercard');
    } else if (value.startsWith('34') || value.startsWith('37')) {
      setCardType('Amex');
      setValue('cardType', 'Amex');
    } else if (value.startsWith('6')) {
      setCardType('Discover');
      setValue('cardType', 'Discover');
    } else {
      setCardType('');
      setValue('cardType', '');
    }
  };

  const handleYearChange = (selectedOption) => {
    const selectedYear = selectedOption?.value;
    if (selectedYear === currentYear) {
      const filteredMonths = months.filter(
        (month) => parseInt(month.value) >= currentMonth
      );
      setAvailableMonths(filteredMonths);
    } else {
      setAvailableMonths(months);
    }
  };

  const getCvvLength = (cardType) => {
    return cardType === "Amex" ? 4 : 3;
  };

  const getReadOnlyStyle = () => ({
    color: "#000",
    backgroundColor: "#fff",
    opacity: 1,
  });

  const validateCardSwipeTransactionId = (value) => {
    if (!value) {
      return "Card Swipe Transaction ID is required";
    }
    if (value.length < 6) {
      return "Transaction ID must be at least 6 characters";
    }
    if (!/^\d+$/.test(value)) {
      return "Transaction ID must contain only numbers";
    }
    return true;
  };

    const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };


  const handleRemoveFile = () => {
    setFile(null);
  };



  const renderFileSize = (size) => {
    if (size) {
      if (Math.round(size / 100) / 10 > 1000) {
        return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
      } else {
        return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
      }
    }
    return null;
  };

const renderFilePreview = (file) => {
    if (file && file.type.startsWith("image")) {
      return (
        <img
          className="rounded mt-2"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="100"
        />
      );
    }
    return null;
  };
  return (
    <>
      <Row>
        <Col xs="12" className="mb-2">
          <h4 className="mb-1">Payment Details</h4>
        </Col>
      </Row>

      <Row>
        <Col md="12" className="mb-1">
          <Label className="form-label" for="paymentMode">
            Payment Mode <span style={{ color: "red" }}>*</span>
          </Label>
          <Controller
            name="paymentMode"
            control={control}
            rules={{ required: "Payment Mode is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={colourOptions3}
                className={`react-select ${errors.paymentMode ? "is-invalid" : ""}`}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption);
                  handlepaymentMode(selectedOption);
                }}
                menuPlacement="top"
              />
            )}
          />
          {errors.paymentMode && (
            <FormFeedback className="d-block">
              {errors.paymentMode.message}
            </FormFeedback>
          )}
        </Col>
      </Row>

      {/* Cash Payment Mode */}
      {paymentMode === "Cash" && (
        <Row className="mb-2 justify-content-center">
          <Col xs="12" sm="12" md="12" lg="12">
            <Label className="form-label">
              Enter Pin <span style={{ color: "red" }}>*</span>
            </Label>
            <div className="auth-input-wrapper d-flex flex-wrap justify-content-center align-items-center gap-2">
              {[...Array(4)].map((_, index) => (
                <Controller
                  key={index}
                  name={`pin[${index}]`}
                  control={control}
                  rules={{
                    required: "All pin digits are required",
                    pattern: {
                      value: /^[0-9]$/,
                      message: "Each pin digit must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      id={`pin-input-${index}`}
                      className={`text-center numeral-mask ${
                        errors.pin?.[index] ? "is-invalid" : ""
                      }`}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^[0-9]$/.test(value) && value !== "") return;
                        field.onChange(value);
                        if (value && index < 3) {
                          document.getElementById(`pin-input-${index + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !field.value && index > 0) {
                          document.getElementById(`pin-input-${index - 1}`)?.focus();
                        }
                      }}
                      style={{
                        width: "60px",
                        height: "60px",
                        fontSize: "1.5rem",
                        borderRadius: "10px",
                        textAlign: "center",
                        flexShrink: 0,
                        boxShadow: "0 0 3px rgba(0,0,0,0.1)"
                      }}
                    />
                  )}
                />
              ))}
            </div>
            {errors.pin && (
              <small className="text-danger d-block mt-1">
                Please enter all 4 digits
              </small>
            )}
          </Col>
        </Row>
      )}

      {/* Credit Card Payment Mode */}
      {paymentMode === "Credit Card" && (
        <>
          <Row>
            <div className="content-header">
              <h5 className="mb-0 my-2">Credit Card Details</h5>
              <small>Fill Credit Card Details</small>
            </div>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label">
                Card Number <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="cardNumber"
                rules={{
                  required: "Card Number is required",
                  maxLength: cardType === "Amex" ? 15 : 16,
                }}
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter Card Number"
                    invalid={!!errors.cardNumber}
                    {...field}
                    onChange={(e) => handleOnchangeCardNum(e, field)}
                  />
                )}
              />
              {errors.cardNumber && (
                <FormFeedback>{errors.cardNumber.message}</FormFeedback>
              )}
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label">
                Card Type <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="cardType"
                rules={{ required: "Card Type is required" }}
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    value={cardType}
                    readOnly
                    invalid={!!errors.cardType}
                    {...field}
                    style={getReadOnlyStyle()}
                  />
                )}
              />
              {errors.cardType && (
                <FormFeedback>{errors.cardType.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label">
                Card Expiry Year <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="cardExpiryYear"
                control={control}
                rules={{ required: "Expiry Year is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={years}
                    placeholder="Select Year"
                    className={`react-select ${errors.cardExpiryYear ? "is-invalid" : ""}`}
                    classNamePrefix="select"
                    isClearable
                    value={years.find((option) => option.value === field.value)}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value || "");
                      handleYearChange(selectedOption);
                    }}
                  />
                )}
              />
              {errors.cardExpiryYear && (
                <FormFeedback className="d-block">{errors.cardExpiryYear.message}</FormFeedback>
              )}
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label">
                Card Expiry Month <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="cardExpiryMonth"
                control={control}
                rules={{ required: "Expiry Month is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={availableMonths}
                    placeholder="Select Month"
                    className={`react-select ${errors.cardExpiryMonth ? "is-invalid" : ""}`}
                    classNamePrefix="select"
                    isClearable
                    value={availableMonths.find((option) => option.value === field.value)}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption?.value || "")
                    }
                  />
                )}
              />
              {errors.cardExpiryMonth && (
                <FormFeedback className="d-block">{errors.cardExpiryMonth.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label">
                Card CVV <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="cardCvv"
                control={control}
                rules={{
                  required: "CVV is required",
                  maxLength: getCvvLength(cardType),
                }}
                render={({ field }) => (
                  <Input
                    type="password"
                    maxLength={getCvvLength(cardType)}
                    placeholder="Enter CVV Number"
                    invalid={!!errors.cardCvv}
                    {...field}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      if (numericValue.length <= getCvvLength(cardType)) {
                        field.onChange(numericValue);
                      }
                    }}
                  />
                )}
              />
              {errors.cardCvv && (
                <FormFeedback>{errors.cardCvv.message}</FormFeedback>
              )}
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label">
                Card Holder's Name <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="nameOnCard"
                control={control}
                rules={{
                  required: "Card Holder's Name is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabetic characters and spaces allowed",
                  },
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 50, message: "Name must be at most 50 characters" },
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter Card Holder's Name"
                    invalid={!!errors.nameOnCard}
                    {...field}
                    onChange={(e) => {
                      const onlyAlphabetsAndSpaces = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      field.onChange(onlyAlphabetsAndSpaces);
                    }}
                  />
                )}
              />
              {errors.nameOnCard && (
                <FormFeedback>{errors.nameOnCard.message}</FormFeedback>
              )}
            </Col>
          </Row>

          {/* Address Fields */}
          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label">
                Address <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="address"
                control={control}
                rules={{
                  required: "Address is required",
                  minLength: { value: 5, message: "Address must be at least 5 characters" },
                  maxLength: { value: 200, message: "Address cannot exceed 200 characters" },
                  pattern: {
                    value: /^[a-zA-Z0-9 ,\-.]*$/,
                    message: "Only letters, numbers, spaces, commas, dashes, and periods are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter Address"
                    invalid={!!errors.address}
                    {...field}
                    onChange={(e) => {
                      const allowedChars = e.target.value.replace(/[^a-zA-Z0-9\s,.\-]/g, "");
                      field.onChange(allowedChars);
                    }}
                  />
                )}
              />
              {errors.address && (
                <FormFeedback>{errors.address.message}</FormFeedback>
              )}
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label">
                City <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="city"
                rules={{ required: "City is required" }}
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter City"
                    invalid={!!errors.city}
                    {...field}
                    onChange={(e) => {
                      const onlyAlphabets = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      field.onChange(onlyAlphabets);
                    }}
                  />
                )}
              />
              {errors.city && (
                <FormFeedback>{errors.city.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label">
                State <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="state"
                rules={{ required: "State is required" }}
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter State"
                    invalid={!!errors.state}
                    {...field}
                    onChange={(e) => {
                      const onlyAlphabets = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      field.onChange(onlyAlphabets);
                    }}
                  />
                )}
              />
              {errors.state && (
                <FormFeedback>{errors.state.message}</FormFeedback>
              )}
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label">
                Country <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="country"
                rules={{ required: "Country is required" }}
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter Country"
                    invalid={!!errors.country}
                    {...field}
                    onChange={(e) => {
                      const onlyAlphabets = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      field.onChange(onlyAlphabets);
                    }}
                  />
                )}
              />
              {errors.country && (
                <FormFeedback>{errors.country.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label">
                Zip Code <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="pinCode"
                control={control}
                rules={{
                  required: "Zip Code is required",
                  pattern: {
                    value: /^\d{5}$/,
                    message: "Zip Code must be exactly 5 digits",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter Zip Code"
                    invalid={!!errors.pinCode}
                    {...field}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");
                      field.onChange(onlyNumbers);
                    }}
                    maxLength={5}
                  />
                )}
              />
              {errors.pinCode && (
                <FormFeedback>{errors.pinCode.message}</FormFeedback>
              )}
            </Col>
          </Row>
        </>
      )}

         {/* ===================== card Swipe ==========================*/}
      
                {paymentMode === "Card Swipe" && (
                  <>
                    <Row>
                      <Col md="12" className="mb-1">
                        <Label className="form-label" for="cardSwipeTransactionId">
                          Card Swipe Transaction ID
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          id="cardSwipeTransactionId"
                          name="cardSwipeTransactionId"
                          rules={{
                            required: "Card Swipe Transaction ID is required",
                            validate: validateCardSwipeTransactionId,
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Transaction ID"
                              invalid={!!errors.cardSwipeTransactionId}
                              {...field}
                              // disabled={statusThree}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                field.onChange(numericValue);
                              }}
                            />
                          )}
                        />
                        {errors.cardSwipeTransactionId && (
                          <FormFeedback>
                            {errors.cardSwipeTransactionId.message}
                          </FormFeedback>
                        )}
                      </Col>
                    </Row>
                  </>
                )}
       {/* //* ============================ Cheque21 Details =========================  */}
      
                {paymentMode === "Cheque21" && (
                  <>
                    <div className="content-header">
                      <h5 className="mb-0 my-2">Bank Details</h5>
                      <small>Fill Bank Details</small>
                    </div>
                    <Row>
                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="bankName">
                          Bank Name <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          control={control}
                          rules={{
                            required: "Bank Name is required",
                            minLength: {
                              value: 3,
                              message: "Bank Name must be at least 3 characters",
                            },
                          }}
                          name="bankName"
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Bank Name"
                              invalid={!!errors.bankName}
                              {...field}
                              disabled={isAssign}
                            onChange={(e) => {
        const onlyAlphabetsAndSpaces = e.target.value.replace(/[^a-zA-Z ]/g, "");
        field.onChange(onlyAlphabetsAndSpaces);
      }}
      
                            />
                          )}
                        />
                        {errors.bankName && (
                          <FormFeedback>{errors.bankName.message}</FormFeedback>
                        )}
                      </Col>
      
                      <Col md="6" className="mb-1">
                        <Label className="form-label" for="nameOnAccount">
                          Account Name <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="nameOnAccount"
                          control={control}
                          rules={{
                            required: "Account Name is required",
                            minLength: {
                              value: 3,
                              message: "Account Name must be at least 3 characters",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Account Name"
                              invalid={!!errors.nameOnAccount}
                              {...field}
                              // isDisabled={statusThree}
                              onChange={(e) => {
                                const onlyAlphabets = e.target.value.replace(
                                 /[^a-zA-Z ]/g, ""
                                );
                                field.onChange(onlyAlphabets);
                              }}
                            />
                          )}
                        />
                        {errors.nameOnAccount && (
                          <FormFeedback>{errors.nameOnAccount.message}</FormFeedback>
                        )}
                      </Col>
                    </Row>
      
                    <Row>
                      <Col md="4" className="mb-1">
                        <Label className="form-label" for="routingNumber">
                          Routing Number <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="routingNumber"
                          rules={{
                            required: "Routing Number is required",
                            pattern: {
                              value: /^[0-9]{9}$/,
                              message: "Routing Number must be exactly 9 digits",
                            },
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Enter Routing Number"
                              invalid={!!errors.routingNumber}
                              // isDisabled={statusThree}
      
                              {...field}
                            />
                          )}
                        />
                        {errors.routingNumber && (
                          <FormFeedback>{errors.routingNumber.message}</FormFeedback>
                        )}
                      </Col>
      
                      <Col md="4" className="mb-1">
                        <Label className="form-label" for="accountNumber">
                          Account Number <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="accountNumber"
                          rules={{
                            required: "Account Number is required",
                            minLength: {
                              value: 10,
                              message: "Account Number must be at least 10 digits",
                            },
                            maxLength: {
                              value: 17,
                              message: "Account Number can't exceed 17 digits",
                            },
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Account Number must be numeric",
                            },
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Enter Account Number"
                              invalid={!!errors.accountNumber}
                              {...field}
                              // isDisabled={statusThree}
                            />
                          )}
                        />
                        {errors.accountNumber && (
                          <FormFeedback>{errors.accountNumber.message}</FormFeedback>
                        )}
                      </Col>
      
                      <Col md="4" className="mb-1">
                        <Label className="form-label" for="chequeNumber">
                          Cheque Number <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Controller
                          name="chequeNumber"
                          control={control}
                          rules={{
                            required: "Cheque Number is required",
                            minLength: {
                              value: 6,
                              message: "Cheque Number must be at least 6 digits",
                            },
                            maxLength: {
                              value: 10,
                              message: "Cheque Number cannot exceed 10 digits",
                            },
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Cheque Number must be numeric",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Enter Cheque Number"
                              invalid={!!errors.chequeNumber}
                              {...field}
                              // isDisabled={statusThree}
                            />
                          )}
                        />
                        {errors.chequeNumber && (
                          <FormFeedback>{errors.chequeNumber.message}</FormFeedback>
                        )}
                      </Col>
                    </Row>
      
                    {/* <Row> */}
                    <Card>
                      <CardHeader>
                        <CardTitle tag="h4">
                          Upload Cheque Image
                          <span style={{ color: "red" }}>*</span>
                        </CardTitle>
                      </CardHeader>
                      <CardBody>
                        <FormGroup>
                          <Label for="fileUpload">Upload File:</Label>
                          <Input
                            type="file"
                            id="fileUpload"
                            onChange={handleFileChange}
                            accept="image/*"
                            // isDisabled={statusThree}
                          />
                        </FormGroup>
      
                        {file && (
                          <div className="mt-3">
                            <h6>File Details:</h6>
                            <p>Name: {file.name}</p>
                            <p>Size: {renderFileSize(file.size)}</p>
                            {renderFilePreview(file)}
                            <div className="d-flex justify-content-end mt-2">
                              <Button
                                color="danger"
                                outline
                                onClick={handleRemoveFile}
                              >
                                Remove File
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                    {/* </Row> */}
                  </>
                )}

       {/* //* ============================ ChequeACH =========================  */}
          {paymentMode === "ChequeACH" && (
            <>
              <div className="content-header">
                <h5 className="mb-0 my-2">Bank Details</h5>
                <small>Fill Bank Details</small>
              </div>

              <Row>
                <Col md="12" className="mb-1">
                  <Label className="form-label" for="acctype">
                    Account Type <span style={{ color: "red" }}>*</span>
                  </Label>

                  <Controller
                    name="accountType"
                    control={control}
                    rules={{
                      required: "Account Typed is required",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={AccountType}
                        className={`react-select ${
                          errors.accountType ? "is-invalid" : ""
                        }`}
                        // isDisabled={statusThree}

                        // onChange={(selectedOption) => {
                        //   const value = selectedOption ? selectedOption.value : "";
                        //   field.onChange(selectedOption); // Update React Hook Form with the value
                        //   handlepaymentMode(selectedOption); // Run your custom function with the full option
                        // }}
                      />
                    )}
                  />
                  {errors.accountType && (
                    <FormFeedback>{errors.accountType.message}</FormFeedback>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md="6" className="mb-1">
                  <Label className="form-label" for="bankName">
                    Bank Name <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Controller
                    control={control}
                    rules={{
                      required: "Bank Name is required",
                      minLength: {
                        value: 3,
                        message: "Bank Name must be at least 3 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Bank Name can't exceed 50 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z ]+$/,
                        message:
                          "Bank Name Can Only contain letters and Spaces",
                      },
                    }}
                    name="bankName"
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Bank Name"
                        invalid={!!errors.bankName}
                        {...field}
                        // isDisabled={statusThree}

                        onChange={(e) => {
                          const onlyAlphabets = e.target.value.replace(
                          /[^a-zA-Z ]/g, ""
                          );
                          field.onChange(onlyAlphabets);
                        }}
                      />
                    )}
                  />
                  {errors.bankName && (
                    <FormFeedback>{errors.bankName.message}</FormFeedback>
                  )}
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="nameOnAccount">
                    Account Name <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Controller
                    name="nameOnAccount"
                    control={control}
                    rules={{
                      required: "Account Name is required",
                      minLength: {
                        value: 3,
                        message: "Account Name must be at least 3 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Account Name can't exceed 50 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z. ]+$/,
                        message:
                          "Account Name can only contain letters, dots, and spaces",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Account Name"
                        invalid={!!errors.nameOnAccount}
                        {...field}
                        // isDisabled={statusThree}

                        onChange={(e) => {
                          const onlyAlphabets = e.target.value.replace(
                           /[^a-zA-Z ]/g, ""
                          );
                          field.onChange(onlyAlphabets);
                        }}
                      />
                    )}
                  />
                  {errors.nameOnAccount && (
                    <FormFeedback>{errors.nameOnAccount.message}</FormFeedback>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md="6" className="mb-1">
                  <Label className="form-label" for="routingNumber">
                    Routing Number <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Controller
                    name="routingNumber"
                    rules={{
                      required: "Routing Number is required",
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Enter Routing Number"
                        invalid={!!errors.routingNumber}
                        {...field}
                        // isDisabled={statusThree}
                      />
                    )}
                  />
                  {errors.routingNumber && (
                    <FormFeedback>{errors.routingNumber.message}</FormFeedback>
                  )}
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="accountNumber">
                    Account Number <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Controller
                    name="accountNumber"
                    rules={{
                      required: "Account Number is required",
                      minLength: {
                        value: 10,
                        message: "Account Number must be at least 10 digits",
                      },
                    }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Enter Account Number"
                        invalid={!!errors.accountNumber}
                        {...field}
                        // isDisabled={statusThree}
                      />
                    )}
                  />
                  {errors.accountNumber && (
                    <FormFeedback>{errors.accountNumber.message}</FormFeedback>
                  )}
                </Col>

                {/* <Col md="4" className="mb-1">
                    <Label className="form-label" for="chequeNumber">
                      Cheque Number <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="chequeNumber"
                      control={control}
                      rules={{
                        required: "Cheque Number is required",
                      }}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Enter Cheque Number"
                          invalid={!!errors.chequeNumber}
                          {...field}
                          readOnly={statusThree()}
                        />
                      )}
                    />
                    {errors.chequeNumber && (
                      <FormFeedback>{errors.chequeNumber.message}</FormFeedback>
                    )}
                  </Col> */}
              </Row>
            </>
          )}         
            
 {/* ===================== Money order ==========================*/}

          {paymentMode === "Money Order" && (
            <>
              <Row>
                <Col md="12" className="mb-1">
                  <Label className="form-label" for="">
                    Company Name <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Controller
                    control={control}
                    rules={{
                      required: "Company name is required",
                    }}
                    name="companyName"
                    render={({ field }) => (
                      <Select
                        {...field}
                        theme={selectThemeColors}
                        className="react-select"
                        // isDisabled={statusThree()}
                        classNamePrefix="select"
                        isClearable
                        options={CompanyOptions}
                        isInvalid={!!errors.companyName}
                      />
                    )}
                  />
                  {errors.companyName && (
                    <FormFeedback>{errors.companyName.message}</FormFeedback>
                  )}
                </Col>

                {companyName?.label !== "Other" && (
                  <Col md="12" className="mb-1">
                    <Label className="form-label" for="mtcn">
                      MTCN Number
                      <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      id="mtcn"
                      name="mtcn"
                      rules={{
                        required: "MTCN Number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "MTCN Number must be exactly 10 digits",
                        },
                      }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter mtcn Number "
                          // invalid={!!errors.cardSwipeTransactionId}
                          {...field}
                          // readOnly={statusThree()}

                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            // if (numericValue.length <= getCvvLength(cardType)) {
                            field.onChange(numericValue);
                            // }
                          }}
                        />
                      )}
                    />
                    {errors.mtcn && (
                      <FormFeedback>{errors.mtcn.message}</FormFeedback>
                    )}
                  </Col>
                )}
              </Row>

              {companyName?.label === "Other" && (
                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="otherTransactionId">
                      Other Transaction ID{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Label>

                    <Controller
                      name="otherTransactionId"
                      control={control}
                      rules={{
                        required: "Transaction ID is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Transaction ID must be exactly 10 digits",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter Transaction ID"
                          invalid={!!errors.otherTransactionId}
                          {...field}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            field.onChange(numericValue);
                          }}
                        />
                      )}
                    />
                    {errors.otherTransactionId && (
                      <FormFeedback>
                        {errors.otherTransactionId.message}
                      </FormFeedback>
                    )}
                  </Col>

                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="otherCompanyName">
                      Other Company Name <span style={{ color: "red" }}>*</span>
                    </Label>

                    <Controller
                      name="otherCompanyName"
                      control={control}
                      rules={{
                        required: "Company Name is required",
                        pattern: {
                          value: /^[A-Za-z0-9 ]+$/, // only letters, numbers, spaces
                          message: "Special characters are not allowed",
                        },
                      }}
                      render={({ field }) => (
                        <div>
                          <Input
                            id="otherCompanyName"
                            placeholder="Enter Other Company Name"
                            invalid={!!errors.otherCompanyName}
                            {...field}
                          />
                          {errors.otherCompanyName && (
                            <span className="text-danger small">
                              {errors.otherCompanyName.message}
                            </span>
                          )}
                        </div>
                      )}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}




    </>
  );
};

export default PaymentModeSection;