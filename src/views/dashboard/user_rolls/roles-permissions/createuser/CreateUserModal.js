import { Fragment, useEffect, useState ,useRef} from "react";
import Swal from "sweetalert2";
import InputPasswordToggle from "@components/input-password-toggle";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import React from "react";
import { Spinner, UncontrolledAlert } from "reactstrap";
import { countries } from "../../../slip-management/CountryCode";
import ReactCountryFlag from "react-country-flag";
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
} from "reactstrap";
import CryptoJS from "crypto-js";

import { User, Mail, Smartphone, Lock } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import withReactContent from "sweetalert2-react-content";
import { use } from "react";
const CreateuserModal = ({ show: propShow, row, uid, ...props }) => {
  


  const [passwordCreated,setPasswordCreated]=useState(false);
    const [DefaultPasswardUsed,setDefaultPasswardUsed]=useState(false);

  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState("Add New");
  const navigate = useNavigate();
  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const toast = useRef(null);

  const [allRoleName, setallRoleName] = useState(null);
  const [Errmessage, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: true,
    sensitive: true,
  });
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const emailId = watch("emailId");
  const mobileNum = watch("mobileNumber");
    const [encryptedPasss, setEncrypt] = useState(null);
  
    const watchPassword = watch("password");
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
    if (watchPassword) {
      const encrypted = encryptAES(watchPassword);
      
      
      setEncrypt(encrypted);
    }
  }, [watchPassword]);


useEffect(()=>{
setPasswordCreated(row?.isPasswordCreated)
setDefaultPasswardUsed(row?.isDefaultPasswardUsed)
},[row])

  const validatePassword = (pwd) => {
    if (!pwd) return;
    const isValid = {
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      specialChar: !/[^A-Za-z\d]/.test(pwd),
      sensitive:
        firstName && lastName
          ? !(
              (
                pwd.toLowerCase().includes(firstName.toLowerCase()) ||
                pwd.toLowerCase().includes(lastName.toLowerCase()) ||
                pwd.toLowerCase().includes(emailId.toLowerCase()) ||
                "" ||
                pwd.toLowerCase().includes(mobileNum || "")
              ) // Check if password contains mobile number
            )
          : true,
    };
     
    setRequirements(isValid);
    setIsPasswordValid(Object.values(isValid).every(Boolean)); // Set true only if all conditions pass
  };

  const handleChange = (e) => {
    const newPwd = e.target.value;

    setPassword(newPwd);
    validatePassword(newPwd);
  };
  const onSubmit = async (data) => {
    const transformedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      mobileNumber: data.mobileNumber,
      password: encryptedPasss,
      countryCode: data.countryCode.value,
      userRoles: {
        uid: data.userRoles, // `data.userRoles` contains the selected role UID
      },
    };
    console.log("Transformed Data:", transformedData);

    try {
      if (uid) {
        setLoading(true);
        const res = await useJwt.updateSubuser(uid, transformedData);
        console.log("Add role res:", res);
        // MySwal.fire({
        //   title: "Successfully Updated",
        //   text: "User Updated Successfully",
        //   icon: "success",
        //   customClass: {
        //     confirmButton: "btn btn-primary",
        //   },
        //   buttonsStyling: false,
        // }).then(() => {
          // navigate("/dashboard/user_rolls/roles-permissions/createuser");
          // setShow(false);
          // reset();
        // });
        toast.current.show({
          severity: "success",
          summary: "Updated Successfully",
          detail: "User updated Successfully.",
          life: 2000,
        });
        setTimeout(() => {
          navigate("/dashboard/user_rolls/roles-permissions/createuser");
          setShow(false);
          reset();        }, 2000);

      } else {
        setLoading(true);
        const res2 = await useJwt.createUser(transformedData);
        console.log("updated res:", res2);
        console.log("data is created", data);

        MySwal.fire({
          title: "Successfully Added",
          text: "Your Role Name Added Successfully",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          navigate("/dashboard/user_rolls/roles-permissions/createuser");
          setShow(false);
          reset();
        });
      }
    } catch (error) {
      console.error("Error occurred:", error);
         if (error.response) {
        const { status, content } = error.response.data;
        const errorMessage = content;
        setMessage(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
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
        console.log(error);
      } finally {
      }
    })();
  }, []);

  const handleModalClosed = () => {
    setModalType("Add New");
    reset();
  };
  useEffect(() => {
    if (uid && row) {
      const {
        firstName,
        lastName,
        emailId,
        mobileNumber,
        userRoles,
        countryCode,
        password,
      } = row;
      const matchedCountryOption = countryOptions.find(
        (option) =>
          option.value === countryCode?.value || option.value === countryCode
      );

      reset({
        firstName,
        lastName,
        emailId,
        countryCode: matchedCountryOption || null,
        mobileNumber,
        userRoles: userRoles?.uid || null,
        password,
      });

      setModalType("Edit");
    } else {
      // Reset the form for new user creation
      reset({
        firstName: "",
        lastName: "",
        emailId: "",
        mobileNumber: "",
        countryCode: "",
        userRoles: null,
        password: "",
      });
      setModalType("Add New");
    }
  }, [uid, row, reset]);

  useEffect(() => {
    setShow(propShow);
    console.log(row);
  }, [propShow]);

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
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
         
              <Toast ref={toast} />
        
        <ModalHeader className="bg-transparent" toggle={() => setShow(!show)} />
        <ModalBody className="px-5 pb-5">
          <div className="text-center mb-2">
            <h1>{modalType} Users</h1>
            {/* <p>{uid ? "Update User" : "Add new user"}</p> */}
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {Errmessage && (
                      <React.Fragment>
                        <UncontrolledAlert color="danger">
                          <div className="alert-body">
                            <span className="text-danger fw-bold">
                              <strong>❌ Error : </strong>
                              {Errmessage}</span>
                          </div>
                        </UncontrolledAlert>
                      </React.Fragment>
                    )}
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
                      options={allRoleName || []} // Ensure it's an array
                      isClearable
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
              <Label sm="3" for="phone">
                Phone Number
              </Label>

              <Col sm="4">
                {/* <FormGroup> */}
                <Controller
                  name="countryCode"
                  control={control}
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
                {/* </FormGroup> */}
              </Col>

              <Col sm="5">
                {/* <FormGroup> */}
                <Controller
                  name="mobileNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter phone number"
                    />
                  )}
                />
                {errors.mobileNumber && (
                  <small className="text-danger">
                    {errors.mobileNumber.message}
                  </small>
                )}
                {/* </FormGroup> */}
              </Col>
            </Row>
{(!passwordCreated && ! DefaultPasswardUsed || !passwordCreated && DefaultPasswardUsed) &&

(<>

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
</>)}

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
                  disabled={loading}
                  color="primary"
                  type="submit"
                >
                  {loading ? (
                    <>
                      Loading..
                      <Spinner size="sm" />
                    </>
                  ) : (
                    <>{uid ? "Update" : "Submit"}</>
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

export default CreateuserModal;
