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
function ProductHeader() {
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
    <>
    <Card className="round">
    <CardBody>
      <h4 className="mb-1">Customer Details</h4>
  
      <Row>
        <Col md="12">
          <CardText>Customer Name:<strong> Rohit Sonawane</strong></CardText>
        </Col>
  
        <Col md="12" className="d-flex gap-2 mt-2">
          <Button color="primary">Add Customer</Button>
          <Button color="primary">Walk-In Customer</Button>
        </Col>
      </Row>
    </CardBody>
  </Card>

  </>
  );
}

export default ProductHeader;
