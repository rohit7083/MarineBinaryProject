import React, { Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
function PayementDetails() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm({});
  return (
    <Fragment>
      <Card className="round" style={{ padding: "20px" }}>
        <CardBody>
          <h4 className="mb-1">Payement Details</h4>
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="name">Discount Type</Label>

                  <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                      <div className="demo-inline-spacing">
                        <Col className="form-check ">
                          <Input
                            type="radio"
                            id="EUR-inactive"
                            value="EUR"
                            checked={field.value === "EUR"}
                            onChange={() => field.onChange("EUR")}
                          />
                          <Label
                            className="form-check-label"
                            for="EUR-inactive"
                          >
                            Coupon code
                          </Label>
                        </Col>
                        <Col className="form-check ">
                          <Input
                            type="radio"
                            id="USD-active"
                            value="USD"
                            checked={field.value === "USD"}
                            onChange={() => field.onChange("USD")}
                          />
                          <Label className="form-check-label" for="USD-active">
                            Flat
                          </Label>
                        </Col>
                        <Col className="form-check">
                          <Input
                            type="radio"
                            id="CAD-inactive"
                            value="CAD"
                            checked={field.value === "CAD"}
                            onChange={() => field.onChange("CAD")}
                          />
                          <Label
                            className="form-check-label"
                            for="CAD-inactive"
                          >
                            Percentage
                          </Label>
                        </Col>
                      </div>
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Col>
                      <Label for="email">Subtotal</Label>
                      <Input
                        type="text"
                        id=""
                        placeholder="Enter your Subtotal"
                      />
                    
                  </Col>
                  <Col className="mt-1">
                  
                  <Label for="name">Discount</Label>

                  <Input type="text" id="name" placeholder="Enter your name" />
                  </Col>
                  <hr className="mt-2" />
                  <Col className="mt-2 d-flex ">
                  <CardTitle>Subtotal  : </CardTitle>
                  <Col>
                  <CardTitle className=" d-flex justify-content-end" style={{color:"green", fontWeight:"bold"}}>$ 985.25 </CardTitle>
                  </Col>

                  </Col>
                </FormGroup>
              </Col>
              <Button color="primary">Payement</Button>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default PayementDetails;
