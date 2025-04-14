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
  Modal ,ModalHeader ,ModalBody,
} from "reactstrap";
function ProductHeader() {
  const [show, setShow] = React.useState(false);
  const [showAddCustomer, setShowAddCustomer] = React.useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
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
      setError("firstName", {
        type: "manual",
      });
      setError("lastName", {
        type: "manual",
      });
    }
  };
  return (
    <>
      <Card className="round">
        <CardBody>
          <h4 className="mb-1">Customer Details</h4>

          <Row>
            <Col md="12">
              <CardText>
                Customer Name:<strong> Rohit Sonawane</strong>
              </CardText>
            </Col>

            <Col md="12" className="d-flex gap-2 mt-2">
              <Button color="primary" onClick={() => setShow(true)}>
                Add Customer
              </Button>
              <Button color="primary">Walk-In Customer</Button>
            </Col>
          </Row>

          <Modal
            isOpen={show}
            onClosed={onDiscard}
            toggle={() => setShow(!show)}
            className="modal-dialog-centered modal-lg "
          >
            <ModalHeader
              className="bg-transparent"
              toggle={() => setShow(!show)}
            ></ModalHeader>
            <ModalBody className="pb-5 px-sm-4 mx-50">
              <h1 className="address-title text-center mb-1">
                Add New Customer
              </h1>
              <p className="address-subtitle text-center mb-2 pb-75">
                {/* Add address for billing address */}
              </p>
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
                    render={({ field }) => (
                      <Input
                        id="firstName"
                        placeholder="John"
                        invalid={errors.firstName && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <FormFeedback>Please enter a valid First Name</FormFeedback>
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
                  <Label className="form-label" for="firstName">
                    Phone Number
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="firstName"
                        placeholder="John"
                        invalid={errors.firstName && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <FormFeedback>Please enter a valid First Name</FormFeedback>
                  )}
                </Col>
                <Col xs={12} md={6}>
                  <Label className="form-label" for="lastName">
                    Email{" "}
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

                <Col xs={12}>
                  <Label className="form-label" for="addressLine1">
                    Address
                  </Label>
                  <Input type="textarea" id="addressLine1" placeholder="12, Business Park" />
                </Col>
{/* 
                <Col xs={12} md={6}>
                  <Label className="form-label" for="firstName">
                    City Name
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="firstName"
                        placeholder="John"
                        invalid={errors.firstName && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <FormFeedback>Please enter a valid First Name</FormFeedback>
                  )}
                </Col> */}
                {/* <Col xs={12} md={6}>
                  <Label className="form-label" for="lastName">
                    State Name
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
                  <Label className="form-label" for="state-province">
                    Country Name
                  </Label>
                  <Input id="state-province" placeholder="California" />
                </Col>
                <Col xs={12} md={6}>
                  <Label className="form-label" for="zip-code">
                    Pin Code
                  </Label>
                  <Input id="zip-code" placeholder="99950" />
                </Col> */}

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
