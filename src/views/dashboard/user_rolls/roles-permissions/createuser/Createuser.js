import { Fragment, useEffect, useState } from "react";
import React from "react";
import { UncontrolledAlert } from "reactstrap";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";
import { User, Mail, Smartphone, Lock } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import { selectThemeColors } from "@utils";

import { parsePhoneNumberFromString } from "libphonenumber-js";
const RoleCards = () => {
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState("Add New");

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [allRoleName, setallRoleName] = useState(null);
const[Errmessage,setMessage]=useState("");
  // Helper function to extract country code and mobile number
  const extractCountryCodeAndNumber = (value) => {
    const code = value.slice(0, value.length - 10);
    const number = value.slice(-10);
    return { code, number };
  };

  const onSubmit = async (data) => {
    // {{debugger}}
    // const { code, number } = extractCountryCodeAndNumber(data.mobileNumber);

    // // Add country code and mobile number to the data object
    // const updatedData = {
    //   ...data,
    //   countryCode: `+${code}`,
    //   mobileNumber: number,
    // };

    // setCountryCode(code);
    // setMobileNumber(number);

    // console.log("Updated Data:", updatedData);

    const { code, number } = extractCountryCodeAndNumber(data.mobileNumber);

    // Transform the data into the required format
    const transformedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      mobileNumber: number,
      password: data.password,
      countryCode: `+${code}`,
      userRoles: {
        uid: data.userRoles, // `data.userRoles` contains the selected role UID
      },
    };

    console.log("Transformed Data:", transformedData);

    try {
      const res = await useJwt.createUser(transformedData);
      console.log(res);
      if (res.status === 201) {
        MySwal.fire({
          title: "Successfully Created",
          text: " User Created Successfully",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          setShow(false);
          reset();
          navigate("/dashboard/user_rolls/roles-permissions/createuser");
        });
      } else {
        MySwal.fire({
          title: "Failed",
          text: " User Created Failed",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          // navigate("/dashboard/SlipList");
        });
        console.error("Failed to add role:", res.message || res);
      }
    } catch (error) {
      console.error(
        "Login Error Details:",
        error.response || error.message || error
      );

      if (error.response) {
        const { status, content } = error.response.data;
        const errorMessage =content;
        setMessage(errorMessage);
        // console.log("errorMessage",errorMessage);

      
        switch (status) {
          case 400:
            setMessage(errorMessage);
            break;
          case 401:
            setMessage(errorMessage);
            // navigate("/login");
            break;
          case 403:
            setMessage(errorMessage);
            break;
            case 500:
              setMessage(errorMessage);
              break;
          default:
            setMessage(errorMessage);
        }
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // {{debugger}}
        const { data } = await useJwt.userpermission();
        const { content } = data;

        const roles = content.result.map((role) => ({
          value: role.uid,
          label: role.roleName,
        }));
        //  console.log("roles",roles);

        setallRoleName(roles);
      } catch (error) {
        console.log(error);
      } finally {
      }
    })();
  }, []);
  // console.log("allRoleName", allRoleName);

  const handleModalClosed = () => {
    setModalType("Add New");
    reset(); // Reset form values
  };

  return (
    <Fragment>
      <Row className="px-2 mt-1">
        <Button
          color="primary"
          className="text-nowrap mb-1"
          onClick={() => {
            setModalType("Add New");
            setShow(true);
          }}
        >
          Create User +
        </Button>
      </Row>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={() => setShow(!show)} />
        <ModalBody className="px-5 pb-5">
          <div className="text-center mb-4">
            <h1>{modalType} Add Users</h1>
            {/* <p>Add new user</p> */}
          {Errmessage && (
                <React.Fragment>
                  <UncontrolledAlert color="danger">
                    <div className="alert-body">
                      <span className="text-danger fw-bold">{Errmessage}</span>
                    </div>
                  </UncontrolledAlert>
                </React.Fragment>
              )}
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-2">
              <Label sm="3" for="roleName">
                Role Name
              </Label>
              <Col sm="9">
                <Controller
                  name="userRoles"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      options={allRoleName} // Pass as options
                      isClearable
                      // value={allRoleName.find(option => option.value === field.value) || null} // Match value
                      // onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)} // Map onChange

                      value={
                        (allRoleName || []).find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        field.onChange(
                          selectedOption ? selectedOption.value : null
                        )
                      }
                    />
                  )}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              {" "}
              {/* Reduced margin */}
              <Label sm="3" for="firstName">
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
                    rules={{ required: "First Name is required" }}
                    render={({ field }) => (
                      <Input type="text" placeholder="First Name" {...field} />
                    )}
                  />
                </InputGroup>
                {errors.firstName && (
                  <small className="text-danger">
                    {errors.firstName.message}
                  </small>
                )}
              </Col>
            </Row>

            <Row className="mb-2">
              {" "}
              {/* Reduced margin */}
              <Label sm="3" for="lastName">
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
                    rules={{ required: "Last Name is required" }}
                    render={({ field }) => (
                      <Input type="text" placeholder="Last Name" {...field} />
                    )}
                  />
                </InputGroup>
                {errors.lastName && (
                  <small className="text-danger">
                    {errors.lastName.message}
                  </small>
                )}
              </Col>
            </Row>

            <Row className="mb-2">
              {" "}
              {/* Reduced margin */}
              <Label sm="3" for="emailId">
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
                    render={({ field }) => (
                      <Input
                        type="email"
                        placeholder="Enter Email"
                        {...field}
                      />
                    )}
                  />
                </InputGroup>
                {errors.emailId && (
                  <small className="text-danger">
                    {errors.emailId.message}
                  </small>
                )}
              </Col>
            </Row>

            <Row className="mb-2">
              <Label sm="3" for="mobileNumber">
                Mobile
              </Label>
              <Col sm="9">
                <InputGroup className="input-group-merge">
                  <Controller
                    name="mobileNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Mobile number is required",
                      validate: (value) =>
                        value && value.length >= 10
                          ? true
                          : "Invalid mobile number", // Custom validation for phone length
                    }}
                    render={({ field: { onChange, value } }) => (
                      <PhoneInput
                        country={"us"} // Default country code
                        value={value}
                        onChange={(phone) => onChange(phone)}
                        inputProps={{
                          name: "mobileNumber",
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
                {errors.mobileNumber && (
                  <small className="text-danger">
                    {errors.mobileNumber.message}
                  </small>
                )}
              </Col>
            </Row>

            <Row className="mb-2">
              {" "}
              {/* Reduced margin */}
              <Label sm="3" for="password">
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
                    render={({ field }) => (
                      <Input
                        type="password"
                        placeholder="Enter Password"
                        {...field}
                      />
                    )}
                  />
                </InputGroup>
                {errors.password && (
                  <small className="text-danger">
                    {errors.password.message}
                  </small>
                )}
              </Col>
            </Row>

            <Row>
              <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                <Button className="me-1" color="primary" type="submit">
                  Submit
                </Button>
                <Button
                  outline
                  color="secondary"
                  type="reset"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default RoleCards;
