import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

function ProductHeader({ selectedCustomer }) {
  const [show, setShow] = React.useState(false);
  // {{debugger}}
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
    setError,
  } = useForm({});

  const onDiscard = () => {
    setShow(false);
    reset();
  };


  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      setShow(false);
      reset();
    } else {
      setError("firstName", { type: "manual" });
      setError("lastName", { type: "manual" });
    }
  };

  return (
    <>
      <Card className="round">
        <CardBody>
          <CardTitle>Customer Details</CardTitle>

          <Row>
            <Col md="12">
              <CardText>
                Customer Name:{" "}
                <strong>
                  {selectedCustomer
                    ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                    : "N/A"}
                </strong>
              </CardText>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <CardText>
                Email:{" "}
                <strong>
                  {selectedCustomer ? selectedCustomer?.emailId : "N/A"}
                </strong>
              </CardText>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <CardText>
                Phone Number:{" "}
                <strong>
                  {selectedCustomer ? selectedCustomer?.phoneNumber : "N/A"}
                </strong>
              </CardText>
            </Col>
          </Row>

          <Modal
            isOpen={show}
            onClosed={onDiscard}
            toggle={() => setShow(!show)}
            className="modal-dialog-centered modal-lg"
          >
            <ModalHeader
              className="bg-transparent"
              toggle={() => setShow(!show)}
            ></ModalHeader>

            <ModalBody className="pb-5 px-sm-4 mx-50">
              <h1 className="address-title text-center mb-1">
                Add New Customer
              </h1>
              <p className="address-subtitle text-center mb-2 pb-75"></p>

              <Row
                tag="form"
                className="gy-1 gx-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Col xs={12} md={6}>
                  <Label className="form-label" for="firstName">
                    First Name
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <Input
                        id="firstName"
                        placeholder="John"
                        invalid={!!errors.firstName}
                        {...field}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <FormFeedback>{errors.firstName.message}</FormFeedback>
                  )}
                </Col>

                <Col xs={12} md={6}>
                  <Label className="form-label" for="lastName">
                    Last Name
                  </Label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        invalid={errors.lastName && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.lastName && (
                    <FormFeedback>Please enter a valid Last Name</FormFeedback>
                  )}
                </Col>

                <Col xs={12} md={6}>
                  <Label className="form-label" for="phoneNumber">
                    Phone Number
                  </Label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="phoneNumber"
                        placeholder="8446334145"
                        invalid={errors.phoneNumber && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.phoneNumber && (
                    <FormFeedback>
                      Please enter a valid Phone Number
                    </FormFeedback>
                  )}
                </Col>

                <Col xs={12} md={6}>
                  <Label className="form-label" for="email">
                    Email
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="email"
                        placeholder="example@gmail.com"
                        invalid={errors.email && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.email && (
                    <FormFeedback>Please enter a valid Email</FormFeedback>
                  )}
                </Col>

                <Col xs={12}>
                  <Label className="form-label" for="addressLine1">
                    Address
                  </Label>
                  <Controller
                    name="addressLine1"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="textarea"
                        id="addressLine1"
                        placeholder="12, Business Park"
                      />
                    )}
                  />
                </Col>

                <Col className="text-center" xs={12}>
                  <Button type="submit" className="me-1 mt-2" color="primary">
                    Submit
                  </Button>
                  <Button
                    type="reset"
                    className="mt-2"
                    color="secondary"
                    outline
                    onClick={onDiscard}
                  >
                    Discard
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </CardBody>
      </Card>
    </>
  );
}

export default ProductHeader;
