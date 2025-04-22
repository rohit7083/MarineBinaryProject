import { Fragment, useEffect, useState } from "react";
import React from "react";
import { Spinner, UncontrolledAlert } from "reactstrap";
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
  CardTitle,
  ListGroupItem,FormFeedback ,FormGroup ,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { User, Mail, Smartphone, Lock, Watch } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import CryptoJS from "crypto-js";
import InputPasswordToggle from "@components/input-password-toggle";
import ReactCountryFlag from "react-country-flag";

import { parsePhoneNumberFromString } from "libphonenumber-js";
const RoleCards = () => {
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState("Add New");
  const MySwal = withReactContent(Swal);
  
  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "Rohit",
      lastName: "son",
      emailId: "sidd31Son1223@gmail.com",
      mobileNumber: "256123456789012",
      password: "India10203040",
    },
  });
  const [password, setPassword] = useState("");

  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [allRoleName, setallRoleName] = useState(null);
  const [Errmessage, setMessage] = useState("");
  const [loading, setloading] = useState(false);
  const [encryptedPasss, setEncrypt] = useState(null);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: true,
    sensitive:true,
  });
  // const extractCountryCodeAndNumber = (value) => {
  //   const code = value.slice(0, value.length - 10);
  //   const number = value.slice(-10);
  //   return { code, number };
  // };
  
const countries = [
  { name: "India", code: "+91", iso: "IN" },
  { name: "USA", code: "+1", iso: "US" },
  { name: "UK", code: "+44", iso: "GB" },
  { name: "Canada", code: "+1", iso: "CA" },
  { name: "Australia", code: "+61", iso: "AU" },
];
const [selected, setSelected] = useState(countries[0]);
  const [phone, setPhone] = useState("");
  const extractCountryCodeAndNumber = (value) => {
    {{debugger}}
    console.log("Input received:", value); // Debugging log
  
    if (!/^\d{11,14}$/.test(value)) {
      return { error: "Invalid phone number format" };
    }
  
    const number = value.slice(-10);
    const code = value.slice(0, value.length - 10);
  
    return { code, number };
  };
  const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";

  function generateKey(secretKey) {
    return CryptoJS.SHA256(secretKey);
  }

  function generateIV() {
    return CryptoJS.lib.WordArray.random(16); 
  }

  function encryptAES(plainText) {
    const key = generateKey(SECRET_KEY);
    const iv = generateIV();

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const combined = iv.concat(encrypted.ciphertext);

    return CryptoJS.enc.Base64.stringify(combined); // Send as Base64
  }


  useEffect(() => {
    if (password) {
      const encrypted = encryptAES(password);
      setEncrypt(encrypted);
    }
  }, [password]);
  




  const onSubmit = async (data) => {
    const { code, number } = extractCountryCodeAndNumber(data.mobileNumber);

    const transformedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      mobileNumber: number,
      password: encryptedPasss,
      countryCode: `+${code}`,
      userRoles: {
        uid: data.userRoles,
      },
    };

    console.log("Transformed Data:", transformedData);

    try {
      setloading(true);
      const res = await useJwt.createUser(transformedData);
      console.log("data is created ", data);

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
          // toggle();
          reset();

          // navigate("/dashboard/user_rolls/roles-permissions/createuser");
          // window.location.reload();
          // Example with React Router v6
          setMessage("");
          setPassword("");
          navigate("/dashboard/user_rolls/roles-permissions/createuser", {
            state: { forceRefresh: true },
          });
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
        const errorMessage = content;
        setMessage(errorMessage);
      }
    } finally {
      setloading(false);
    }
  };

  const fetchRole = async () => {
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
  };

  useEffect(() => {
    fetchRole();
  }, []);
  // console.log("allRoleName", allRoleName);

  const handleModalClosed = () => {
    setModalType("Add New");
    reset(); // Reset form values
  };

  const firstName=watch("firstName");
  const lastName=watch("lastName");
  const emailId=watch("emailId");
  const mobileNum =watch("mobileNumber");

  const validatePassword = (pwd) => {
    const isValid ={
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      specialChar: !( /[^A-Za-z\d]/.test(pwd) ),  
      sensitive: 
      firstName && lastName 
      ? !(pwd.toLowerCase().includes(firstName.toLowerCase()) 
      || pwd.toLowerCase().includes(lastName.toLowerCase())
      || pwd.toLowerCase().includes(emailId.toLowerCase())
      || pwd.toLowerCase().includes(mobileNum.toLowerCase())) 
       : true
    };
    // {{debugger}}
    setRequirements(isValid);
    setIsPasswordValid(Object.values(isValid).every(Boolean)); // Set true only if all conditions pass

  };

  const handleChange = (e) => {
    const newPwd = e.target.value;
console.log(newPwd);

    setPassword(newPwd);
    validatePassword(newPwd);
  };
  // useEffect(() => {
  //   if (password) {  
  //     const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  //     setEncrypt(hashedPassword);
  //   }
  // }, [password]); 
  


  

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
            <h1>{modalType} Sub Users</h1>
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
                  rules={{
                    required:"Role Name Is Required"
                  }}
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

            {/* <Row className="mb-2">
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
            </Row> */}





<Row>
      <Col md="3">
        <FormGroup>
          <Label>Country Code</Label>
          <Input
            type="select"
            value={selected.code}
            onChange={(e) =>
              setSelected(
                countries.find((c) => c.code === e.target.value)
              )
            }
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                <ReactCountryFlag
                  countryCode={country.iso}
                  svg
                  style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
                />{" "}
                {country.name} ({country.code})
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>

      <Col md="5">
        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormGroup>
      </Col>
    </Row>
            <Row className="mb-2">
              <Label sm="3" for="password">
                Password
              </Label>
              <Col sm="9">
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  rules={{
                    validate:validatePassword,
                    required:"password is Required",
                    minLength:{
                      value:12,
                      message:"password must be at least 12 character long"
                    },
                    pattern:{
                      value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{12,}$/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and no special characters",
                  },
                    
                  }}
                  render={({ field }) => (
                    <div>
                      <InputPasswordToggle
                        className="input-group-merge"
                        invalid={errors.password}
                        {...field}
                        onChange={(e)=>{
                          field.onChange(e);
                          handleChange(e);
                        }}
                        value={password}
                      />
                      {errors.password && (
                        <FormFeedback
                          style={{ color: "red", display: "block" }}
                        >
                          {errors.password.message}
                        </FormFeedback>
                      )}
                    </div>
                  )}
                />
                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              {" "}
              <Label sm="3" for="password"></Label>
              <Col sm="9">
                <CardTitle tag="h5" className="mb-1">
                  Password Requirement
                </CardTitle>

                <ListGroupItem
                  className={
                    requirements.length ? "text-success" : "text-danger"
                  }
                >
                  {requirements.length ? "✅" : "❌"} At least 12 characters
                </ListGroupItem>

                <ListGroupItem
                  className={
                    requirements.uppercase ? "text-success" : "text-danger"
                  }
                >
                  {requirements.uppercase ? "✅" : "❌"} At least one uppercase 
                </ListGroupItem>
                <ListGroupItem
                  className={
                    requirements.lowercase ? "text-success" : "text-danger"
                  }
                >
                  {requirements.lowercase ? "✅" : "❌"} At least one lowercase
                  
                </ListGroupItem>
                <ListGroupItem
                  className={
                    requirements.number ? "text-success" : "text-danger"
                  }
                >
                  {requirements.number ? "✅" : "❌"} At least one number
                </ListGroupItem>
                <ListGroupItem
                  className={
                    requirements.sensitive ? "text-success" : "text-danger"
                  }
                >
                  {requirements.sensitive ? "✅" : "❌"}
                  No firstName / lastName / Email And Mobile Number allowed
                </ListGroupItem>
                <ListGroupItem
                  className={
                    requirements.specialChar ? "text-success" : "text-danger"
                  }
                >
                  {requirements.specialChar ? "✅" : "❌"} No special
                  characters allowed
                </ListGroupItem>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                <Button
                  outline
                  color="secondary"
                  type="reset"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
                <Button className="mx-1" color="primary" disabled={!isPasswordValid} type="submit">
                  {loading ? (
                    <>
                      Loading.. <Spinner size="sm" />
                    </>
                  ) : (
                    "Submit"
                  )}
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
