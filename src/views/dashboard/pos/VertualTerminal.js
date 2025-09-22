import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Input,
  Form,
  Button,
  Label,
  Row,
  CardText,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { Check, X, CreditCard } from "react-feather";
import Cleave from "cleave.js/react";
import classnames from "classnames";
import { Tooltip, Container } from "reactstrap";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
import jcbCC from "@src/assets/images/icons/payments/jcb-cc.png";
import amexCC from "@src/assets/images/icons/payments/amex-cc.png";
import uatpCC from "@src/assets/images/icons/payments/uatp-cc.png";
import visaCC from "@src/assets/images/icons/payments/visa-cc.png";
import dinersCC from "@src/assets/images/icons/payments/diners-cc.png";
import maestroCC from "@src/assets/images/icons/payments/maestro-cc.png";
import discoverCC from "@src/assets/images/icons/payments/discover-cc.png";
import mastercardCC from "@src/assets/images/icons/payments/mastercard-cc.png";
const MultipleColumnForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm({});

  const cardsObj = {
    jcb: jcbCC,
    uatp: uatpCC,
    visa: visaCC,
    amex: amexCC,
    diners: dinersCC,
    maestro: maestroCC,
    discover: discoverCC,
    mastercard: mastercardCC,
  };

  const defaultValues = {
    cardNumber: "",
  };

  const [cardType, setCardType] = useState("");
  

  return (
    <Card className="round">
      <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
        <CardTitle tag="h4">Virtual Terminal</CardTitle>
      </CardHeader>
      <CardBody className="mt-2">
        <Form>
          <Container>
            <Row className="justify-content-center">
              <Col md="12" sm="12" xs="12">
                {" "}
                <Card className="card-statistics bg-light shadow-sm">
                  <CardHeader>
                    <CardTitle tag="h4">Search</CardTitle>

                    <Button className="card-text " color="relief-primary">
                      {" "}
                      Walking Customer
                    </Button>
                  </CardHeader>

                  <CardBody className="statistics-body">
                    <Row>
                      <Col md="6" sm="12" className="">
                        <Label className="form-label" for="category">
                          Search Contact No{" "}
                        </Label>
                        <Input type="text" id="category"></Input>
                      </Col>
                      <Col md="6" sm="12" className="">
                        <Label className="form-label" for="taxes">
                          Search Customer Name{" "}
                        </Label>
                        <Input type="email" id="taxes"></Input>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>

          <Row>
            <Col md="6" sm="12" className="mb-1 ">
              <Label className="form-label" for="productName">
                Customer First Name
              </Label>
              <Input type="text" id="productName" placeholder="Product Name" />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="productImage">
                Customer Last Name{" "}
              </Label>
              <Input type="text" id="productName" placeholder="Product Name" />
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                Customer Contact Number
              </Label>
              <Input type="text" id="category"></Input>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="taxes">
                Customer Email
              </Label>
              <Input type="email" id="taxes"></Input>
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                Address
              </Label>
              <Input type="text" id="category"></Input>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                City
              </Label>
              <Input type="text" id="category"></Input>
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                State/Province
              </Label>
              <Input type="text" id="category"></Input>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                Country
              </Label>
              <Input type="text" id="category"></Input>
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                Zip/Postal Code
              </Label>
              <Input type="text" id="category"></Input>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                Product
              </Label>
              <Input type="text" id="category"></Input>
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                Amount
              </Label>
              <Input type="text" id="category"></Input>
            </Col>
            {/* <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
              Product              
                            </Label>
              <Input type="text" id="category">
              </Input>
            </Col> */}
          </Row>

          <CardTitle className="mt-3 mb-2" tag="h4">
            Credit Card Information
          </CardTitle>

          <Row tag="form" className="gy-1 gx-2 mt-75 mb-3">
            <Col xs={6}>
              <Label className="form-label" for="credit-card">
                Card Number
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
            </Col>{" "}
            <Col md={6}>
              <Label className="form-label" for="card-name">
                Card type{" "}
              </Label>
              <Input id="card-name" placeholder="John Doe" />
            </Col>
            <Col md={6}>
              <Label className="form-label" for="card-name">
                Name On Card
              </Label>
              <Input id="card-name" placeholder="John Doe" />
            </Col>
            <Col xs={6} md={3}>
              <Label className="form-label" for="exp-date">
                Exp. Date
              </Label>
              <Cleave
                id="exp-date"
                placeholder="MM/YY"
                className="form-control"
                options={{ delimiter: "/", blocks: [2, 2] }}
              />
            </Col>
            <Col xs={6} md={3}>
              <Label className="form-label" for="cvv">
                CVV
              </Label>
              <Cleave
                id="cvv"
                placeholder="654"
                className="form-control"
                options={{ blocks: [3] }}
              />
            </Col>
          </Row>

          <Button color="primary" type="submit">
            Submit
          </Button>
          <Button outline color="secondary" type="reset" className="ms-2">
            Reset
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default MultipleColumnForm;
