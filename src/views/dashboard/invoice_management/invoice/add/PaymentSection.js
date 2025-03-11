import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  Label,
} from "reactstrap";
import Cleave from "cleave.js/react";
import classnames from "classnames";

import { Check, Plus, Watch, X } from "react-feather";
import Select from "react-select";

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

const MultipleColumnForm = () => {
  const {
    reset,
    control,
    setError,
    clearErrors,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const paymentOptions = [
    { value: "Select Payment Mode", label: "--- Select Payment Mode ---" },

    { value: "Virtual Terminal", label: "Virtual Terminal" },
    { value: "Card Swipe", label: "Card Swipe" },
    { value: "Cash", label: "Cash" },
    { value: "LT Wallet", label: "LT Wallet" },
    { value: "Cheque", label: "Cheque" },
    { value: "Money Order", label: "Money Order" },
    { value: "Cashier Check", label: "Cashier Check" },
  ];
  const [show, setShow] = useState(false);
  const [AddCard, setAddcard] = useState(false);

  const [cardType, setCardType] = useState("");
  const onSubmit = (data) => {
    if (data.cardNumber.length) {
      clearErrors();
    } else {
      setError("cardNumber", { type: "manual" });
    }
  };

  const handleaddCard = () => {
    setAddcard(true);
  };
  const partialPayment = watch("partialPayment", true);
  const autoReminder = watch("autoReminder", false);
  const recurringInvoice = watch("recurringInvoice", false);
  const selectedPaymentMode = watch("paymentMode");

  // console.log(addCard);

  return (
    <Card>
      <CardBody>
        <Form>
          <Row>
            <div className="d-flex justify-content-between mb-2">
              <div className="d-flex flex-row mb-2 ">
                <Label className="cursor-pointer mb-0" htmlFor="partialPayment">
                  Partial Payment
                </Label>
                <div className="form-switch form-check-dark ms-1">
                  <Controller
                    name="partialPayment"
                    control={control}
                    defaultValue={true}
                    render={({ field }) => (
                      <Input type="switch" {...field} checked={field.value} />
                    )}
                  />
                </div>
              </div>

              <div className="form-switch  form-check-dark ms-1">
                <Button color="gradient-dark" onClick={() => setShow(true)}>
                  <Plus className="me-1" size={18} />
                  Add Bank Account
                </Button>
              </div>
            </div>

            <Modal
              isOpen={show}
              toggle={() => setShow(!show)}
              className="modal-dialog-centered"
              onClosed={() => setCardType("")}
            >
              <ModalHeader
                className="bg-transparent"
                toggle={() => setShow(!show)}
              ></ModalHeader>
              <ModalBody className="px-sm-5 mx-50 pb-5">
                <h1 className="text-center mb-1">Add Bank Details</h1>
                <p className="text-center">Add card for future billing</p>
                <Row
                  tag="form"
                  className="gy-1 gx-2 mt-75"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Col xs={12}>
                    <Label className="form-label" for="credit-card">
                      ACCOUNT NUMBER
                    </Label>

                    <InputGroup>
                      <Controller
                        name="cardNumber"
                        control={control}
                        render={({ field }) => {
                          return (
                            <Cleave
                              {...field}
                              id="cardNumber"
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="1356 3215 6548 7898"
                              className={classnames("form-control", {
                                "is-invalid": errors.cardNumber,
                              })}
                              options={{
                                creditCard: true,
                                onCreditCardTypeChanged: (type) => {
                                  setCardType(type);
                                },
                              }}
                            />
                          );
                        }}
                      />

                      {cardType !== "" && cardType !== "unknown" ? (
                        <InputGroupText className="p-25">
                          <span className="add-card-type">
                            <img
                              height="24"
                              alt="card-type"
                              src={cardsObj[cardType]}
                            />
                          </span>
                        </InputGroupText>
                      ) : null}
                    </InputGroup>
                    {errors.cardNumber && (
                      <FormFeedback className="d-block">
                        Please enter valid card number
                      </FormFeedback>
                    )}
                  </Col>

                  <Col xs={12}>
                    <Label className="form-label" for="credit-card">
                      IBAN CODE *{" "}
                    </Label>

                    <InputGroup>
                      <Controller
                        name="cardNumber"
                        control={control}
                        render={({ field }) => {
                          return (
                            <Cleave
                              {...field}
                              id="cardNumber"
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="1356 3215 6548 7898"
                              className={classnames("form-control", {
                                "is-invalid": errors.cardNumber,
                              })}
                              options={{
                                creditCard: true,
                                onCreditCardTypeChanged: (type) => {
                                  setCardType(type);
                                },
                              }}
                            />
                          );
                        }}
                      />

                      {cardType !== "" && cardType !== "unknown" ? (
                        <InputGroupText className="p-25">
                          <span className="add-card-type">
                            <img
                              height="24"
                              alt="card-type"
                              src={cardsObj[cardType]}
                            />
                          </span>
                        </InputGroupText>
                      ) : null}
                    </InputGroup>
                    {errors.cardNumber && (
                      <FormFeedback className="d-block">
                        Please enter valid card number
                      </FormFeedback>
                    )}
                  </Col>

                  <Col xs={12}>
                    <Label className="form-label" for="credit-card">
                      BANK & BRANCH NAME{" "}
                    </Label>

                    <InputGroup>
                      <Controller
                        name="cardNumber"
                        control={control}
                        render={({ field }) => {
                          return (
                            <Cleave
                              {...field}
                              id="cardNumber"
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="1356 3215 6548 7898"
                              className={classnames("form-control", {
                                "is-invalid": errors.cardNumber,
                              })}
                              options={{
                                creditCard: true,
                                onCreditCardTypeChanged: (type) => {
                                  setCardType(type);
                                },
                              }}
                            />
                          );
                        }}
                      />

                      {cardType !== "" && cardType !== "unknown" ? (
                        <InputGroupText className="p-25">
                          <span className="add-card-type">
                            <img
                              height="24"
                              alt="card-type"
                              src={cardsObj[cardType]}
                            />
                          </span>
                        </InputGroupText>
                      ) : null}
                    </InputGroup>
                    {errors.cardNumber && (
                      <FormFeedback className="d-block">
                        Please enter valid card number
                      </FormFeedback>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label className="form-label" for="card-name">
                      Name On Card
                    </Label>
                    <Input id="card-name" placeholder="John Doe" />
                  </Col>
                  {/* <Col xs={6} md={3}>
              <Label className='form-label' for='exp-date'>
                Exp. Date
              </Label>
              <Cleave
                id='exp-date'
                placeholder='MM/YY'
                className='form-control'
                options={{ delimiter: '/', blocks: [2, 2] }}
              />
            </Col>
            <Col xs={6} md={3}>
              <Label className='form-label' for='cvv'>
                CVV
              </Label>
              <Cleave id='cvv' placeholder='654' className='form-control' options={{ blocks: [3] }} />
            </Col>
            <Col xs={12}>
              <div className='d-flex align-items-center'>
                <div className='form-switch w-100'>
                  <Input defaultChecked type='switch' name='save-card' id='save-card' />
                  <Label className='form-check-label' for='save-card'>
                    <span className='switch-icon-left'>
                      <Check size={14} />
                    </span>
                    <span className='switch-icon-right'>
                      <X size={14} />
                    </span>
                  </Label>
                  <Label className='form-check-label fw-bolder ms-1' for='save-card'>
                    Save Card for future billing?
                  </Label>
                </div>
              </div>
            </Col> */}

                  <Col className="text-center mt-1" xs={12}>
                    <Button type="submit" className="me-1" color="primary">
                      Submit
                    </Button>
                    <Button
                      color="secondary"
                      outline
                      onClick={() => {
                        setShow(!show);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
            {partialPayment ? (
              <>
                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="advancedPayment">
                    Advanced Payment Amount
                  </Label>
                  <Controller
                    name="advancedPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter amount"
                      />
                    )}
                  />
                </Col>

                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Minimum Payment
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
                <div className="d-flex flex-row mt-2 mb-2">
                  <Label className="cursor-pointer mb-0" htmlFor="autoReminder">
                    Partial Payment Auto Reminder
                  </Label>
                  <div className="form-switch form-check-dark ms-1">
                    <Controller
                      name="autoReminder"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Input type="switch" {...field} checked={field.value} />
                      )}
                    />
                  </div>
                </div>

                {autoReminder ? (
                  <>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label" htmlFor="cashReceived">
                        Reminder Types
                      </Label>
                      <Controller
                        name="additionalPayment1"
                        control={control}
                        defaultValue="Debit Card"
                        render={({ field }) => (
                          <Input type="select" {...field}>
                            <option>Debit Card</option>
                            <option>Credit Card</option>
                            <option>Paypal</option>
                            <option>Internet Banking</option>
                            <option>UPI Transfer</option>
                          </Input>
                        )}
                      />
                    </Col>

                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label" htmlFor="cashReceived">
                        Select
                      </Label>
                      <Controller
                        name="additionalPayment2"
                        control={control}
                        defaultValue="Debit Card"
                        render={({ field }) => (
                          <Input type="select" {...field}>
                            <option>Debit Card</option>
                            <option>Credit Card</option>
                            <option>Paypal</option>
                            <option>Internet Banking</option>
                            <option>UPI Transfer</option>
                          </Input>
                        )}
                      />
                    </Col>
                  </>
                ) : (
                  <></>
                )}

                <Col md="12" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="paymentMode">
                    Payment Mode
                  </Label>
                  <Controller
                    name="paymentMode"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={paymentOptions}
                        id="payment-select"
                        placeholder="Select Payment Method"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption)
                        }
                      />
                    )}
                  />
                </Col>
              </>
            ) : (
              <>
                <Col md="12" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="cashReceived">
                    Cash Received
                  </Label>
                  <Controller
                    name="cashReceived"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter amount"
                      />
                    )}
                  />
                </Col>
                <div className="d-flex flex-row mb-2">
                  <Col md="3" sm="12" className="mb-1 d-flex mt-2">
                    <Label
                      className="cursor-pointer mb-0"
                      htmlFor="partialPayment"
                    >
                      Recurring Invoice
                    </Label>
                    <div className="form-switch form-check-dark ms-1">
                      <Controller
                        name="recurringInvoice"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <Input
                            type="switch"
                            {...field}
                            checked={field.value}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  {recurringInvoice && (
                    <Col md="4" sm="12" className="mb-1 ms-2 me-4">
                      <Label className="form-label" htmlFor="cashReceived">
                        Select
                      </Label>
                      <Controller
                        name="additionalPayment2"
                        control={control}
                        defaultValue="Debit Card"
                        render={({ field }) => (
                          <Input type="select" {...field}>
                            <option>Debit Card</option>
                            <option>Credit Card</option>
                            <option>Paypal</option>
                            <option>Internet Banking</option>
                            <option>UPI Transfer</option>
                          </Input>
                        )}
                      />
                    </Col>
                  )}
                  {recurringInvoice && (
                    <Col md="4" sm="12" className="mb-1">
                      <Label className="form-label" htmlFor="cashReceived">
                        Cash Received
                      </Label>
                      <Controller
                        name="cashReceived"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            type="text"
                            {...field}
                            placeholder="Enter amount"
                          />
                        )}
                      />
                    </Col>
                  )}
                </div>
              </>
            )}

            {selectedPaymentMode?.value === "Virtual Terminal" && (
              <>
                <h6 className="mt-2 mb-1">Credit Card Information</h6>

                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="advancedPayment">
                    Card Number:
                  </Label>
                  <Controller
                    name="additionalPayment2"
                    control={control}
                    defaultValue="Debit Card"
                    render={({ field }) => (
                      <Input type="select" {...field}>
                        <option>Debit Card</option>
                        <option>Credit Card</option>
                        <option>Paypal</option>
                        <option>Internet Banking</option>
                        <option>UPI Transfer</option>
                      </Input>
                    )}
                  />
                </Col>

                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="advancedPayment">
                    CVV Number:
                  </Label>
                  <Controller
                    name="advancedPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter amount"
                      />
                    )}
                  />
                </Col>

                <Col md="12" sm="12" className="mb-1 mt-1">
                  <Button.Ripple
                    className="round"
                    onClick={handleaddCard}
                    color="dark"
                    outline
                  >
                    <Plus className="me-1" size={18} />
                    Add Card
                  </Button.Ripple>
                </Col>

                {AddCard && (
                  <>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label" htmlFor="">
                        Card Expiry Year
                      </Label>
                      <Controller
                        name=""
                        control={control}
                        defaultValue="Debit Card"
                        render={({ field }) => (
                          <Select
                            options={paymentOptions}
                            id="payment-select"
                            placeholder="Select Payment Method"
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        )}
                      />
                    </Col>

                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label" htmlFor="">
                        Card Expiry Month
                      </Label>
                      <Controller
                        name=""
                        control={control}
                        defaultValue="Debit Card"
                        render={({ field }) => (
                          <Select
                            options={paymentOptions}
                            id="payment-select"
                            placeholder="Select Payment Method"
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        )}
                      />
                    </Col>

                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label" htmlFor="minimumPayment">
                        Card Type:{" "}
                      </Label>
                      <Controller
                        name="minimumPayment"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            type="text"
                            {...field}
                            placeholder="Enter minimum payment"
                          />
                        )}
                      />
                    </Col>

                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label" htmlFor="minimumPayment">
                        Name On Card:
                      </Label>
                      <Controller
                        name="minimumPayment"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            type="text"
                            {...field}
                            placeholder="Enter minimum payment"
                          />
                        )}
                      />
                    </Col>
                  </>
                )}

                <h6 className="mt-2 mb-1">
                  Address Information Address Information Required For Virtual
                  Terminal Payment.Please verify
                </h6>
                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Address{" "}
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="advancedPayment">
                    City{" "}
                  </Label>
                  <Controller
                    name="advancedPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter amount"
                      />
                    )}
                  />
                </Col>

                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    State{" "}
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="advancedPayment">
                    Country{" "}
                  </Label>
                  <Controller
                    name="advancedPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter amount"
                      />
                    )}
                  />
                </Col>

                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Pin Code:
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
              </>
            )}

            {selectedPaymentMode?.value === "Card Swipe" && (
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" htmlFor="minimumPayment">
                  LT Transacton ID:{" "}
                </Label>
                <Controller
                  name="minimumPayment"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      placeholder="Enter minimum payment"
                    />
                  )}
                />
              </Col>
            )}

            {selectedPaymentMode?.value === "LT Wallet" && (
              <>
                <h6 className="mt-1"> LT Wallet Payment</h6>
                <div className="demo-inline-spacing">
                  <div className="form-check">
                    <Input
                      type="radio"
                      id="ex1-active"
                      name="ex1"
                      defaultChecked
                    />
                    <Label className="form-check-label" for="ex1-active">
                      Scan QR Code
                    </Label>
                  </div>
                  <div className="form-check">
                    <Input type="radio" name="ex1" id="ex1-inactive" />
                    <Label className="form-check-label" for="ex1-inactive">
                      Via OTP
                    </Label>
                  </div>
                </div>
              </>
            )}

            {selectedPaymentMode?.value === "Cheque" && (
              <>
                <h6 className="mt-1 mb-1">Cheque Payment Information</h6>

                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Bank Name :{" "}
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Name On Account:{" "}
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Routing Number:{" "}
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Account Number:{" "}
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Cheque Number:{" "}
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
              </>
            )}

            {selectedPaymentMode?.value === "Money Order" && (
              <>
                <h6>Money Order Payment Information</h6>
                <div className="demo-inline-spacing">
                  <div className="form-check">
                    <Input
                      type="radio"
                      id="ex1-active"
                      name="ex1"
                      defaultChecked
                    />
                    <Label className="form-check-label" for="ex1-active">
                      Checked
                    </Label>
                  </div>
                  <div className="form-check">
                    <Input type="radio" name="ex1" id="ex1-inactive" />
                    <Label className="form-check-label" for="ex1-inactive">
                      Unchecked
                    </Label>
                  </div>
                </div>
              </>
            )}

            {selectedPaymentMode?.value === "Cashier Check" && (
              <>
                <h6 className="mt-1 mb-1">Cashier Check Payment Information</h6>

                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Account Number:
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Cheque Number:{" "}
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
                <Col md="6" sm="12" className="mb-1">
                  <Label className="form-label" htmlFor="minimumPayment">
                    Date Of Issue:{" "}
                  </Label>
                  <Controller
                    name="minimumPayment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter minimum payment"
                      />
                    )}
                  />
                </Col>
              </>
            )}
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default MultipleColumnForm;
