import { Fragment, useEffect, useState, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
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
  ListGroupItem,
  FormFeedback,
  FormGroup,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { User, Mail, Smartphone, Lock, Watch, Plus } from "react-feather";
import { Controller, set, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import CryptoJS from "crypto-js";
import InputPasswordToggle from "@components/input-password-toggle";
import ReactCountryFlag from "react-country-flag";
import { countries } from "../../../slip-management/CountryCode";
import { parsePhoneNumberFromString } from "libphonenumber-js";
const RoleCards = () => {
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState("Add New");
  const[EncryptPin,setEncryptPin]=useState([]);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // firstName: "Rohit",
      // lastName: "son",
      // emailId: "sidd31Son1223@gmail.com",
      // mobileNumber: "256123456789012",
      // password: "India10203040",
    },
  });
  const [password, setPassword] = useState("");

  const [countryCode, setCountryCode] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const toast = useRef(null);

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
    sensitive: true,
  });



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
      return CryptoJS.enc.Base64.stringify(combined);
    }
 

  useEffect(() => {
    if (password) {
      const encrypted = encryptAES(password);

      setEncrypt(encrypted);
    }

    
  }, [password]);





  const onSubmit = async (data) => {
     const pinArray = data.pin || [];
  const isValid = pinArray.length === 4 && pinArray.every(d => d !== "" && d !== undefined);
 if (!isValid) {
    console.error("Invalid pin input");
    return;
  }

  const encrypted = encryptAES(pinArray.join(""));
    setMessage("");
    const transformedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      mobileNumber: data.mobileNumber,
      password: encryptedPasss,
      pin: encrypted,
      countryCode: data.countryCode.value,
      userRoles: {
        uid: data.userRoles,
      },
    };

    // const payload = encryptAES(JSON.stringify(transformedData));
    // console.log("Transformed Data:", payload);

    try {
      setloading(true);
      const res = await useJwt.createUser(transformedData);
      console.log("data is created ", data);
      console.log(res);

      console.log(res);
      if (res.status === 201) {
        // MySwal.fire({
        //   title: "Successfully Created",
        //   text: " User Created Successfully",
        //   icon: "success",
        //   customClass: {
        //     confirmButton: "btn btn-primary",
        //   },
        //   buttonsStyling: false,
        // }).then(() => {
        // navigate("/dashboard/user_rolls/roles-permissions/createuser", {
        //   state: { forceRefresh: true },
        // });
        // setShow(false);
        // reset();

        //   setMessage("");
        // });
        toast.current.show({
          severity: "success",
          summary: " Created Successfully",
          detail: " User created Successfully.",
          life: 2000,
        });
        setTimeout(() => {
          navigate("/dashboard/user_rolls/roles-permissions/createuser", {
            state: { forceRefresh: true },
          });
          setShow(false);
          reset();
        }, 2000);
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
      const { data } = await useJwt.userpermission();
      const { content } = data;

      const roles = content.result.map((role) => ({
        value: role.uid,
        label: role.roleName,
      }));
      //  console.log("roles",roles);

      setallRoleName(roles);
    } catch (error) {
       console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const handleModalClosed = () => {
    setModalType("Add New");
    reset(); // Reset form values
  };

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const emailId = watch("emailId");
  const mobileNum = watch("mobileNumber");

  const validatePassword = (pwd) => {
    const isValid = {
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      specialChar: !/[^A-Za-z\d]/.test(pwd),
      sensitive:
        firstName && lastName
          ? !(
              pwd.toLowerCase().includes(firstName.toLowerCase()) ||
              pwd.toLowerCase().includes(lastName.toLowerCase()) ||
              pwd.toLowerCase().includes(emailId.toLowerCase()) ||
              pwd.toLowerCase().includes(mobileNum.toLowerCase())
            )
          : true,
    };

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

  const countryOptions = countries.map((country) => ({
    value: country.dial_code,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ReactCountryFlag
          countryCode={country.code}
          svg
          style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
        />
        {country.name} ({country.dial_code})
      </div>
    ),
    code: country.code,
  }));

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
          <Plus size={14} /> Create User
        </Button>
      </Row>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
                // style={{ width: "400px" }}

      >
        <Toast ref={toast} />

        <ModalHeader className="bg-transparent" toggle={() => setShow(!show)} />
        <ModalBody className="px-5 pb-5">
          <div className="text-center mb-4">
            <h1>{modalType} Sub Users</h1>
            {/* <p>Add new user</p> */}
            {Errmessage && (
              <React.Fragment>
                <UncontrolledAlert color="danger">
                  <div className="alert-body">
                    <span className="text-danger fw-bold">
                      <strong>Error : </strong>
                      {Errmessage}</span>
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
                    required: "Role Name Is Required",
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
                      <Input
                        type="text"
                        placeholder="First Name"
                        {...field}
                        onChange={(e) => {
                          const onlyAlphabets = e.target.value.replace(
                            /[^a-zA-Z]/g,
                            ""
                          );
                          field.onChange(onlyAlphabets);
                        }}
                      />
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
                      <Input
                        type="text"
                        placeholder="Last Name"
                        {...field}
                        onChange={(e) => {
                          const onlyAlphabets = e.target.value.replace(
                            /[^a-zA-Z]/g,
                            ""
                          );
                          field.onChange(onlyAlphabets);
                        }}
                      />
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
              <Label sm="3" for="phone">
                Phone Number
              </Label>

              <Col sm="4">
                <Controller
                  name="countryCode"
                  control={control}
                  rules={{ required: "Country code is required" }}
                  defaultValue={countryOptions[0]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={countryOptions}
                      onChange={(option) => field.onChange(option)}
                      value={countryOptions.find(
                        (option) => option.value === field.value?.value
                      )}
                    />
                  )}
                />
                {errors.countryCode && (
                  <small className="text-danger">
                    {errors.countryCode.message}
                  </small>
                )}
              </Col>

              <Col sm="5">
                <Controller
                  name="mobileNumber"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Phone number is required",

                    maxLength: {
                      value: 13,
                      message: "Country code must be 13 digits",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      invalid={errors.mobileNumber}
                      placeholder="Enter phone number"
                    />
                  )}
                />
                {errors.mobileNumber && (
                  <small className="text-danger">
                    {errors.mobileNumber.message}
                  </small>
                )}
              </Col>
            </Row>

         <Row className="mb-2">
  <Label sm="3" for="pin">
    Generate Pin
  </Label>
  <Col sm="6">
    <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
      {[...Array(4)].map((_, index) => (
        <Controller
          key={index}
          name={`pin[${index}]`}
          control={control}
          rules={{
            required: "All pin digits are required",
            pattern: {
              value: /^[0-9]$/,
              message: "Each pin digit must be a number",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              maxLength={1}
              id={`pin-input-${index}`}
              className={`auth-input height-50 text-center numeral-mask mx-25 mb-1 ${
                errors.pin?.[index] ? "is-invalid" : ""
              }`}
              autoFocus={index === 0}
              onChange={(e) => {
                const value = e.target.value;
                if (!/^[0-9]$/.test(value) && value !== "") return;

                field.onChange(e);

                if (value && index < 5) {
                  const nextInput = document.getElementById(`pin-input-${index + 1}`);
                  nextInput?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !field.value && index > 0) {
                  const prevInput = document.getElementById(`pin-input-${index - 1}`);
                  prevInput?.focus();
                }
              }}
            />
          )}
        />
      ))}
    </div>
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
                    validate: validatePassword,
                    required: "password is Required",
                    minLength: {
                      value: 12,
                      message: "password must be at least 12 character long",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{12,}$/,
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
                        onChange={(e) => {
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
                  {requirements.specialChar ? "✅" : "❌"} No special characters
                  allowed
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
                <Button
                  className="mx-1"
                  color="primary"
                  disabled={!isPasswordValid}
                  type="submit"
                >
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
