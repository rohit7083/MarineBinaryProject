import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label,
  InputGroup,
  Container,
} from "reactstrap";

import { CreditCard, CheckSquare } from "react-feather";

const Add_Member = () => {
  const {
    control,
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [phoneNumber, setMobileNumber] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });

  const handleInputFocus = (e) => {
    setCardDetails((prev) => ({
      ...prev,
      focus: e.target.name,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValue(name, value); // Update React Hook Form

    if (name === "expiryMonth" || name === "expiryYear") {
      const updatedMonth =
        name === "expiryMonth" ? value : watch("expiryMonth");
      const updatedYear = name === "expiryYear" ? value : watch("expiryYear");

      const formattedExpiry =
        updatedMonth && updatedYear
          ? `${updatedMonth}/${updatedYear.slice(-2)}`
          : "";

      setCardDetails((prev) => ({
        ...prev,
        expiry: formattedExpiry,
      }));
    } else {
      // ✅ Handle other fields like name, number, cvc
      setCardDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Expiry Month Options
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: (currentYear + i).toString().slice(-2), // Get last two digits (e.g., "25" for 2025)
    label: currentYear + i,
  }));

  const selectedOption = watch("paymentMethod");
  const onSubmit = (data) => {};
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Add Member </CardTitle>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                First Name
              </Label>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First Name is required" }}
                render={({ field }) => (
                  <Input {...field} id="nameMulti" placeholder="First Name" />
                )}
              />
              {errors.firstName && (
                <p className="text-danger">{errors.firstName.message}</p>
              )}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="lastNameMulti">
                Last Name
              </Label>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Last Name is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="lastNameMulti"
                    placeholder="Last Name"
                  />
                )}
              />
              {errors.lastName && (
                <p className="text-danger">{errors.lastName.message}</p>
              )}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="EmailMulti">
                Email
              </Label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="EmailMulti"
                    type="email"
                    placeholder="Email"
                  />
                )}
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="phoneNumber">
                Mobile Number
                <span style={{ color: "red" }}>*</span>
              </Label>
              <InputGroup className="input-group-merge">
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue={phoneNumber}
                  rules={{
                    required: "Mobile number is required",
                    validate: (value) =>
                      value && value.length >= 10
                        ? true
                        : "Invalid mobile number",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      // country={"us"}
                      value={value || phoneNumber}
                      onChange={(phone) => {
                        onChange(phone);
                        setMobileNumber(phone);
                      }}
                      inputProps={{
                        name: "phoneNumber",
                        required: true,
                        className: "form-control",
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      inputStyle={{
                        height: "38px",
                        border: "1px solid #ced4da",
                        borderRadius: "0 .375rem .375rem 0",
                        paddingLeft: "63px",
                        width: "100%",
                      }}
                    />
                  )}
                />
              </InputGroup>
            </Col>

            <Col md="12" sm="12" className="mb-1">
              <Label className="form-label" for="address">
                Address
              </Label>
              <Controller
                name="address"
                control={control}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <Input
                    type="textarea"
                    id="address"
                    placeholder="Enter address"
                    {...field}
                  />
                )}
              />
              {errors.address && (
                <p className="text-danger">{errors.address.message}</p>
              )}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="cityMulti">
                City
              </Label>
              <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field }) => (
                  <Input {...field} id="cityMulti" placeholder="City" />
                )}
              />
              {errors.city && (
                <p className="text-danger">{errors.city.message}</p>
              )}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="state">
                State/Province
              </Label>
              <Controller
                name="state"
                control={control}
                rules={{ required: "state is required" }}
                render={({ field }) => (
                  <Input {...field} id="state" placeholder="state" />
                )}
              />
              {errors.state && (
                <p className="text-danger">{errors.state.message}</p>
              )}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="CountryMulti">
                Country
              </Label>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Input {...field} id="CountryMulti" placeholder="Country" />
                )}
              />
              {errors.country && (
                <p className="text-danger">{errors.country.message}</p>
              )}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="state">
                Zip/Post Code
              </Label>
              <Controller
                name="zipCode"
                control={control}
                rules={{ required: "zipCode is required" }}
                render={({ field }) => (
                  <Input {...field} id="state" placeholder="zipCode" />
                )}
              />
              {errors.zipCode && (
                <p className="text-danger">{errors.zipCode.message}</p>
              )}
            </Col>

            <Col md="12" sm="12" className="mb-1">
              <Label className="form-label" for="state">
                Total Membership fees
              </Label>
              <Controller
                name="fees"
                control={control}
                rules={{ required: "fees is required" }}
                render={({ field }) => (
                  <Input {...field} id="fees" placeholder="fees" />
                )}
              />
              {errors.fees && (
                <p className="text-danger">{errors.fees.message}</p>
              )}
            </Col>

            <Col xl="12" xs="12">
              <Card className="card-payment">
                <CardTitle className="mt-2" tag="h4">
                  Payment Terms
                </CardTitle>

                {/* <CardBody> */}
                <Col xs={12}>
                  <Row className="custom-options-checkable">
                    <Col md={4} className="mb-md-0 mb-2">
                      <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="radio"
                            id="card"
                            {...field}
                            value="card"
                            checked={field.value === "card"}
                            className="custom-option-item-check"
                          />
                        )}
                      />
                      <label
                        className="custom-option-item px-2 py-1"
                        htmlFor="card"
                      >
                        <CreditCard className="font-medium-10 me-50 mb-1" />
                        <span className="d-flex align-items-center mb-50">
                          <span className="custom-option-item-title h4 fw-bolder mb-0">
                            Credit/Debit Card
                          </span>
                        </span>
                      </label>
                    </Col>

                    {/* Cheque ACH Option */}
                    <Col md={4} className="mb-md-0 mb-2">
                      <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="radio"
                            id="ach"
                            {...field}
                            value="ach"
                            checked={field.value === "ach"}
                            className="custom-option-item-check"
                          />
                        )}
                      />
                      <label
                        className="custom-option-item px-2 py-1"
                        htmlFor="ach"
                      >
                        <CheckSquare className="font-medium-10 me-50 mb-1" />
                        <span className="d-flex align-items-center mb-50">
                          <span className="custom-option-item-title h4 fw-bolder mb-0">
                            Partial Upfront / Partial Monthly{" "}
                          </span>
                        </span>
                      </label>
                    </Col>

                    <Col md={4} className="mb-md-0 mb-2">
                      <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="radio"
                            id="fe"
                            {...field}
                            value="fe"
                            checked={field.value === "fe"}
                            className="custom-option-item-check"
                          />
                        )}
                      />
                      <label
                        className="custom-option-item px-2 py-1"
                        htmlFor="fe"
                      >
                        <CheckSquare className="font-medium-10 me-50 mb-1" />
                        <span className="d-flex align-items-center mb-50">
                          <span className="custom-option-item-title h4 fw-bolder mb-0">
                            Full EMI{" "}
                          </span>
                        </span>
                      </label>
                    </Col>
                  </Row>
                </Col>
                {/* </CardBody> */}

                <CardTitle className="mt-2" tag="h4">
                  Payment Information
                </CardTitle>
                <CardBody>
                  <Row>
                    {selectedOption === "ach" && (
                      <>
                        <Col sm="6" className="mb-2">
                          <Label for="bankName">Bank Name</Label>
                          <Controller
                            name="bankName"
                            control={control}
                            rules={{ required: "Bank Name is required" }}
                            render={({ field }) => (
                              <Input {...field} placeholder="Enter Bank Name" />
                            )}
                          />
                          {errors.bankName && (
                            <p className="text-danger">
                              {errors.bankName.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="accountName">Account Name</Label>
                          <Controller
                            name="accountName"
                            control={control}
                            rules={{ required: "Account Name is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Account Name"
                              />
                            )}
                          />
                          {errors.accountName && (
                            <p className="text-danger">
                              {errors.accountName.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="accountNumber">Account Number</Label>
                          <Controller
                            name="accountNumber"
                            control={control}
                            rules={{
                              required: "Account Number is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Only numbers allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Account Number"
                              />
                            )}
                          />
                          {errors.accountNumber && (
                            <p className="text-danger">
                              {errors.accountNumber.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="routingNumber">Routing Number</Label>
                          <Controller
                            name="routingNumber"
                            control={control}
                            rules={{
                              required: "Routing Number is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Only numbers allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Routing Number"
                              />
                            )}
                          />
                          {errors.routingNumber && (
                            <p className="text-danger">
                              {errors.routingNumber.message}
                            </p>
                          )}
                        </Col>
                      </>
                    )}
                    {selectedOption === "fe" && (
                      <>
                        <Col sm="6" className="mb-2">
                          <Label for="bankName">Bank Name</Label>
                          <Controller
                            name="bankName"
                            control={control}
                            rules={{ required: "Bank Name is required" }}
                            render={({ field }) => (
                              <Input {...field} placeholder="Enter Bank Name" />
                            )}
                          />
                          {errors.bankName && (
                            <p className="text-danger">
                              {errors.bankName.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="accountName">Account Name</Label>
                          <Controller
                            name="accountName"
                            control={control}
                            rules={{ required: "Account Name is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Account Name"
                              />
                            )}
                          />
                          {errors.accountName && (
                            <p className="text-danger">
                              {errors.accountName.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="accountNumber">Account Number</Label>
                          <Controller
                            name="accountNumber"
                            control={control}
                            rules={{
                              required: "Account Number is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Only numbers allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Account Number"
                              />
                            )}
                          />
                          {errors.accountNumber && (
                            <p className="text-danger">
                              {errors.accountNumber.message}
                            </p>
                          )}
                        </Col>

                        <Col sm="6" className="mb-2">
                          <Label for="routingNumber">Routing Number</Label>
                          <Controller
                            name="routingNumber"
                            control={control}
                            rules={{
                              required: "Routing Number is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Only numbers allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter Routing Number"
                              />
                            )}
                          />
                          {errors.routingNumber && (
                            <p className="text-danger">
                              {errors.routingNumber.message}
                            </p>
                          )}
                        </Col>
                      </>
                    )}

                    <Row className="justify-content-center align-items-center">
                      <Col md={6} className="text-center">
                        <Cards
                          cvc={cardDetails.cvc}
                          expiry={cardDetails.expiry}
                          focused={cardDetails.focus}
                          name={cardDetails.name}
                          number={cardDetails.number}
                        />
                      </Col>

                      <Col className="" md={6}>
                        <Row>
                          <Col sm="6" className="mb-2">
                            <Label for="number">Card Number</Label>
                            <Controller
                              name="number"
                              control={control}
                              rules={{
                                required: true,
                                pattern: {
                                  value: /^[0-9]+$/,
                                  message: "Only number allowed",
                                },
                                maxLength: {
                                  value: 16,
                                  message: "Maximum 16 digits allowed",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  type="tel"
                                  maxLength="19"
                                  name="number"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setCardDetails((prev) => ({
                                      ...prev,
                                      number: e.target.value,
                                    }));
                                  }}
                                  onFocus={handleInputFocus}
                                  placeholder="Card Number"
                                />
                              )}
                            />
                            {errors.number && (
                              <p className="text-danger">
                                {errors.number.message}
                              </p>
                            )}
                          </Col>

                          <Col sm="6" className="mb-2">
                            <Label for="name">Name On Card</Label>

                            <Controller
                              name="name"
                              control={control}
                              rules={{
                                required: "Cardholder name is required",
                                pattern: {
                                  value: /^[0-9]+$/,
                                  message: "numbers are not allowed",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  type="text"
                                  placeholder="Cardholder Name"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e); // for RHF
                                    handleInputChange(e); // for card image
                                  }}
                                  onFocus={handleInputFocus}
                                />
                              )}
                            />

                            {errors.name && (
                              <p className="text-danger">
                                {errors.name.message}
                              </p>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="6" className="mb-2">
                            <Label for="name">Card Type</Label>
                            <Input
                              type="text"
                              {...register("cardType", {
                                required: "Card Name is required",
                              })}
                              placeholder="Enter Card Name"
                              // value={cardDetails.name}
                              onChange={handleInputChange}
                              onFocus={handleInputFocus}
                            />
                            {errors.name && (
                              <p className="text-danger">
                                {errors.name.message}
                              </p>
                            )}
                          </Col>
                          <Col sm="6" className="mb-2">
                            <Label for="cvc">CVV</Label>
                            <Controller
                              name="cvc"
                              control={control}
                              rules={{
                                required: "CVV is required",
                                pattern: {
                                  value: /^[0-9]+$/,
                                  message: "Only Numbers allowed",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  type="text"
                                  name="cvc"
                                  placeholder="Enter CVV"
                                  maxLength="3"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e); // React Hook Form state
                                    handleInputChange(e); // Update card preview only
                                  }}
                                  onFocus={handleInputFocus}
                                />
                              )}
                            />

                            {errors.cvc && (
                              <p className="text-danger">
                                {errors.cvc.message}
                              </p>
                            )}
                          </Col>
                        </Row>

                        <Row>
                          <Col sm="6" className="mb-2">
                            <Label for="expiryMonth">Expiry Month</Label>
                            <Controller
                              name="expiryMonth"
                              control={control}
                              rules={{
                                required: "Expiry month is required",
                              }}
                              render={({ field }) => (
                                <Input
                                  type="select"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleInputChange(e);
                                  }}
                                  onFocus={handleInputFocus}
                                >
                                  <option value="">Select Month</option>
                                  {months.map((month) => (
                                    <option
                                      key={month.value}
                                      value={month.value}
                                    >
                                      {month.label}
                                    </option>
                                  ))}
                                </Input>
                              )}
                            />

                            {errors.expiryMonth && (
                              <p className="text-danger">
                                {errors.expiryMonth.message}
                              </p>
                            )}
                          </Col>

                          <Col sm="6" className="mb-2">
                            <Label for="expiryYear">Expiry Year</Label>
                            <Controller
                              name="expiryYear"
                              control={control}
                              rules={{
                                required: "Expiry year is required",
                              }}
                              render={({ field }) => (
                                <Input
                                  type="select"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleInputChange(e);
                                  }}
                                  onFocus={handleInputFocus}
                                >
                                  <option value="">Select Year</option>
                                  {years.map((year) => (
                                    <option key={year.value} value={year.value}>
                                      {year.label}
                                    </option>
                                  ))}
                                </Input>
                              )}
                            />

                            {errors.expiryYear && (
                              <p className="text-danger">
                                {errors.expiryYear.message}
                              </p>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col sm="12">
              <div className="d-flex">
                <Button className="me-1" color="primary" type="submit">
                  Submit
                </Button>
                <Button
                  outline
                  color="secondary"
                  type="button"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};
export default Add_Member;
