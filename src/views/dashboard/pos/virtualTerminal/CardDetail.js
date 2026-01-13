// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import {
    Col,
    FormFeedback,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Row
} from "reactstrap";

// ** Third Party Components
import Cleave from "cleave.js/react";
import { Controller, useForm } from "react-hook-form";

// ** Card Images
import amexCC from "@src/assets/images/icons/payments/amex-cc.png";
import dinersCC from "@src/assets/images/icons/payments/diners-cc.png";
import discoverCC from "@src/assets/images/icons/payments/discover-cc.png";
import jcbCC from "@src/assets/images/icons/payments/jcb-cc.png";
import maestroCC from "@src/assets/images/icons/payments/maestro-cc.png";
import mastercardCC from "@src/assets/images/icons/payments/mastercard-cc.png";
import uatpCC from "@src/assets/images/icons/payments/uatp-cc.png";
import visaCC from "@src/assets/images/icons/payments/visa-cc.png";

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

const AddCardForm = () => {
  // ** State
  const [cardType, setCardType] = useState("");

  // ** React Hook Form
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    cardNumber: "",
  });

  const onSubmit = (data) => {
    if (data.cardNumber && data.cardNumber.length > 0) {
       ("Card Data:", data);
      reset();
      setCardType("");
    } else {
      setError("cardNumber", { type: "manual" });
    }
  };

  return (
    <Fragment>
      <div>
        <Row tag="form" className="gy-1 gx-2" onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12}>
            <Label className="form-label" for="credit-card">
              Card Number
            </Label>
            <InputGroup className="input-group-merge">
              <Controller
                name="cardNumber"
                control={control}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    id="credit-card"
                    placeholder="1356 3215 6548 7898"
                    className={`form-control ${
                      errors.cardNumber ? "is-invalid" : ""
                    }`}
                    options={{
                      creditCard: true,
                      onCreditCardTypeChanged: (type) => setCardType(type),
                    }}
                  />
                )}
              />
              {cardType !== "" && cardType !== "unknown" && (
                <InputGroupText className="cursor-pointer p-25">
                  <img height="24" alt="card-type" src={cardsObj[cardType]} />
                </InputGroupText>
              )}
            </InputGroup>
            {errors.cardNumber && (
              <FormFeedback className="d-block">
                Please enter a valid card number
              </FormFeedback>
            )}
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
      </div>
    </Fragment>
  );
};

export default AddCardForm;
