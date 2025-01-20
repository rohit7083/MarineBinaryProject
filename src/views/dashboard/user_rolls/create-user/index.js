// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText,
} from "reactstrap";

// ** Icons Imports
import { User, Mail, Smartphone, Lock } from "react-feather";
import { Controller, useForm } from "react-hook-form";

const HorizontalFormIcons = () => {
  const { control, handleSubmit, reset } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">User Management</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onsubmit)}>
          <Row className="mb-1">
            <Label sm="3" for="nameIcons">
              First Name
            </Label>
            <Col sm="9">
              <InputGroup className="input-group-merge">
                <InputGroupText>
                  <User size={15} />
                </InputGroupText>

                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "First Name is Required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input type="text" placeholder="First Name" {...field} />
                      {error && <p className="text-danger">{error.message}</p>}
                    </>
                  )}
                />
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="nameIcons">
              Last Name
            </Label>
            <Col sm="9">
              <InputGroup className="input-group-merge">
                <InputGroupText>
                  <User size={15} />
                </InputGroupText>

                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Last Name is Required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input type="text" placeholder="Last Name" {...field} />
                      {error && <p className="text-danger">{error.message}</p>}
                    </>
                  )}
                />
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="EmailIcons">
              Email
            </Label>
            <Col sm="9">
              <InputGroup className="input-group-merge">
                <InputGroupText>
                  <Mail size={15} />
                </InputGroupText>

                <Controller
                  name="emailId"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        type="email"
                        id="email"
                        placeholder="Enter Email"
                        {...field}
                      />
                      {error && <p className="text-danger">{error.message}</p>}
                    </>
                  )}
                />
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="mobileIcons">
              Mobile
            </Label>
            <Col sm="9">
              <InputGroup className="input-group-merge">
                <InputGroupText>
                  <Smartphone size={15} />
                </InputGroupText>
                <Controller
                  name="mobileNumber"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid mobile number",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        type="tel"
                        id="mobileNumber"
                        placeholder="Enter Mobile"
                        {...field}
                      />
                      {error && <p className="text-danger">{error.message}</p>}
                    </>
                  )}
                />{" "}
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="passwordIcons">
              Password
            </Label>
            <Col sm="9">
              <InputGroup className="input-group-merge">
                <InputGroupText>
                  <Lock size={15} />
                </InputGroupText>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        type="password"
                        id="password"
                        placeholder="Password"
                        {...field}
                      />
                      {error && <p className="text-danger">{error.message}</p>}
                    </>
                  )}
                />{" "}
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-1">
            <Col md={{ size: 9, offset: 3 }}>
              <div className="form-check">
                <Controller
                  name="rememberMe"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Input
                      type="checkbox"
                      id="rememberMe"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
                <Label for="rememberMe">Remember Me</Label>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex" md={{ size: 9, offset: 3 }}>
              <Button
                className="me-1"
                color="primary"
                type="submit"
                onClick={(e) => e.preventDefault()}
              >
                Submit
              </Button>
              <Button outline color="secondary" type="reset">
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};
export default HorizontalFormIcons;
