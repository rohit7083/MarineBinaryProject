import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";
import React, { Fragment } from "react";

const CardPayment = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Payment Data:", data);
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

  // Expiry Year Options (current year + next 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: (currentYear + i).toString().slice(-2), // Get last two digits (e.g., "25" for 2025)
    label: currentYear + i,
  }));

  return (
    <Fragment>
         <Card>
        <CardHeader>
          <CardTitle tag='h4'>Member Details</CardTitle>
          {/* <Button color='primary' size='sm' onClick={() => setShow(true)}>
            Edit Address
          </Button> */}
        </CardHeader>
        <CardBody>
          <Row>
            <Col xl='7' xs='12'>
              <Row tag='dl' className='mb-0'>
                <Col tag='dt' sm='4' className='fw-bolder mb-1'>
                  Company Name:
                </Col>
                <Col tag='dd' sm='8' className='mb-1'>
                  PIXINVENT
                </Col>

                <Col tag='dt' sm='4' className='fw-bolder mb-1'>
                  Billing Email:
                </Col>
                <Col tag='dd' sm='8' className='mb-1'>
                  themeselection@ex.com
                </Col>

                <Col tag='dt' sm='4' className='fw-bolder mb-1'>
                  Tax ID:
                </Col>
                <Col tag='dd' sm='8' className='mb-1'>
                  TAX-357378
                </Col>

                <Col tag='dt' sm='4' className='fw-bolder mb-1'>
                  VAT Number:
                </Col>
                <Col tag='dd' sm='8' className='mb-1'>
                  SDF754K77
                </Col>

                <Col tag='dt' sm='4' className='fw-bolder mb-1'>
                  Billing Address:
                </Col>
                <Col tag='dd' sm='8' className='mb-1'>
                  100 Water Plant Avenue, Building 1303 Wake Island
                </Col>
              </Row>
            </Col>
            <Col xl='5' xs='12'>
              <Row tag='dl' className='mb-0'>
                <Col tag='dt' sm='4' className='fw-bolder mb-1'>
                  Contact:
                </Col>
                <Col tag='dd' sm='8' className='mb-1'>
                  +1 (605) 977-32-65
                </Col>

                <Col tag='dt' sm='4' className='fw-bolder mb-1'>
                  Country:
                </Col>
                <Col tag='dd' sm='8' className='mb-1'>
                  Wake Island
                </Col>

                <Col tag='dt' sm='4' className='fw-bolder mb-1'>
                  State:
                </Col>
                <Col tag='dd' sm='8' className='mb-1'>
                  Capholim
                </Col>

                <Col tag='dt' sm='4' className='fw-bolder mb-1'>
                  Zipcode:
                </Col>
                <Col tag='dd' sm='8' className='mb-1'>
                  403114
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>

    <Card className="card-payment">
      <CardHeader>
        <CardTitle tag="h4">Pay Amount</CardTitle>
        <CardTitle className="text-primary" tag="h4">
          $455.60
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Form className="form" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col sm="6" className="mb-2">
              <Label for="bankName">Bank Name</Label>
              <Input
                {...register("bankName", { required: "Bank Name is required" })}
                placeholder="Enter Bank Name"
              />
              {errors.bankName && (
                <p className="text-danger">{errors.bankName.message}</p>
              )}
            </Col>

            <Col sm="6" className="mb-2">
              <Label for="accountName">Account Name</Label>
              <Input
                {...register("accountName", {
                  required: "Account Name is required",
                })}
                placeholder="Enter Account Name"
              />
              {errors.accountName && (
                <p className="text-danger">{errors.accountName.message}</p>
              )}
            </Col>

            <Col sm="6" className="mb-2">
              <Label for="accountNumber">Account Number</Label>
              <Input
                type="text"
                {...register("accountNumber", {
                  required: "Account Number is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Only numbers allowed",
                  },
                })}
                placeholder="Enter Account Number"
              />
              {errors.accountNumber && (
                <p className="text-danger">{errors.accountNumber.message}</p>
              )}
            </Col>

            <Col sm="6" className="mb-2">
              <Label for="routingNumber">Routing Number</Label>
              <Input
                type="text"
                {...register("routingNumber", {
                  required: "Routing Number is required",
                })}
                placeholder="Enter Routing Number"
              />
              {errors.routingNumber && (
                <p className="text-danger">{errors.routingNumber.message}</p>
              )}
            </Col>

            {/* Expiry Month Dropdown */}
            <Col sm="6" className="mb-2">
              <Label for="expiryMonth">Expiry Month</Label>
              <Controller
                name="expiryMonth"
                control={control}
                rules={{ required: "Expiry month is required" }}
                render={({ field }) => (
                  <Input type="select" {...field}>
                    <option value="">Select Month</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.expiryMonth && (
                <p className="text-danger">{errors.expiryMonth.message}</p>
              )}
            </Col>

            {/* Expiry Year Dropdown */}
            <Col sm="6" className="mb-2">
              <Label for="expiryYear">Expiry Year</Label>
              <Controller
                name="expiryYear"
                control={control}
                rules={{ required: "Expiry year is required" }}
                render={({ field }) => (
                  <Input type="select" {...field}>
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
                <p className="text-danger">{errors.expiryYear.message}</p>
              )}
            </Col>

            <Col sm="6" className="mb-2">
              <Label for="cardNumber">Card Number</Label>
              <Input
                type="text"
                {...register("cardNumber", {
                  required: "Card Number is required",
                  pattern: {
                    value: /^[0-9]{16}$/,
                    message: "Card Number must be 16 digits",
                  },
                })}
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber && (
                <p className="text-danger">{errors.cardNumber.message}</p>
              )}
            </Col>

            <Col sm="6" className="mb-2">
              <Label for="cvv">CVV / CVC</Label>
              <Input
                type="password"
                {...register("cvv", {
                  required: "CVV is required",
                  pattern: {
                    value: /^[0-9]{3,4}$/,
                    message: "Must be 3 or 4 digits",
                  },
                })}
                placeholder="123"
              />
              {errors.cvv && <p className="text-danger">{errors.cvv.message}</p>}
            </Col>

            <Col sm="6" className="mb-2">
              <Label for="NameOnCard"> Name On Card</Label>
              <Input
                {...register("NameOnCard", { required: "Card Name is required" })}
                placeholder="Enter card Name"
              />
              {errors.NameOnCard && (
                <p className="text-danger">{errors.NameOnCard.message}</p>
              )}
            </Col>

            <Col sm="6" className="mb-2">
              <Label for="CardType">Card Type</Label>
              <Input
                {...register("CardType", { required: "Card Type is required" })}
                placeholder="Enter Card Type"
              />
              {errors.CardType && (
                <p className="text-danger">{errors.CardType.message}</p>
              )}
            </Col>

            <Col className="d-flex justify-content-end mt-3">
              <Button color="primary" type="submit">
                Make Payment
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
    </Fragment>

  );
};

export default CardPayment;


