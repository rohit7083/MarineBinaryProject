// ** React Imports
import { Fragment, useEffect, useRef, useState } from "react";

// ** Third Party Components
import useJwt from "@src/auth/jwt/useJwt";
import "cleave.js/dist/addons/cleave-phone.us";
import Cleave from "cleave.js/react";
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

// ** Utils

const AccountTabs = ({ data }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      avatar: null,
    },
  });

  // ** States
  const [avatar, setAvatar] = useState(data.avatar ? data.avatar : "");
  const toast = useRef(null);
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = function () {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const onSubmit = async (onSubmitData) => {
    console.log("Submitted Data:", onSubmitData);
    setLoading(true);
  
    const formData = new FormData();
    formData.append("firstName", onSubmitData?.firstName);
    formData.append("lastName", onSubmitData?.lastName);
    formData.append("emailId", onSubmitData?.email);
    formData.append("mobileNumber", onSubmitData?.phone);

    try {
      const res = await useJwt.updateProfile(data?.uid, formData);
      console.log(res);
      if (res?.status == 201) {
        const updatedData = {
          ...data,
          firstName: onSubmitData?.firstName,
          lastName: onSubmitData?.lastName,
        };

        localStorage.setItem("userData", JSON.stringify(updatedData));
        toast.current.show({
          severity: "success",
          summary: " Successful",
          detail: "Profile Details Updated Successfully",
          life: 2000,
        });
        setTimeout(() => {
          navigate("/dashbord");
          // window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: `${error?.response?.content}`,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const sanitizeName = (value) => value.replace(/[^a-zA-Z\s'-]/g, "");
  const sanitizeEmail = (value) =>
    value.replace(/[^a-zA-Z0-9@._-]/g, "").toLowerCase();
  const sanitizePhone = (value) => value.replace(/\D/g, "");
  const sanitizeGeneric = (value) => value.replace(/[<>]/g, ""); // basic XSS prevention

  useEffect(() => {
    if (data) {
      reset({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.emailId || "",
        phone: data.mobileNum || "",
      });
    }
  }, [data]);

  const handleAvatarPreview = (file) => {
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImgReset = () => {
    setAvatar(defaultAvatar);
  };

  return (
    <Fragment>
      <Card>
        <Toast ref={toast} />

        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Profile Details </CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          {/* //upload profile  */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <div className="d-flex">
                {/* <div className="me-25">
    <img
      className="rounded me-50"
      src={avatar}
      alt="Avatar"
      height="100"
      width="100"
    />
  </div> */}

                {/* <div className="d-flex align-items-end mt-75 ms-1">
    <div>
      <Controller
        name="avatar"
        control={control}
        render={({ field: { onChange } }) => (
          <Button
            tag={Label}
            className="mb-75 me-75"
            size="sm"
            color="primary"
          >
            Upload
            <Input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (!file) return

                onChange(file)       // RHF value
                handleAvatarPreview(file) // your preview logic
              }}
            />
          </Button>
        )}
      />

      <Button
        className="mb-75"
        color="secondary"
        size="sm"
        outline
        onClick={() => {
          setValue('avatar', null)
          handleImgReset()
        }}
      >
        Reset
      </Button>

      <p className="mb-0">
        Allowed JPG, GIF or PNG. Max size of 800kB
      </p>
    </div>
  </div> */}
              </div>

              {/* First Name */}
              <Col sm="6" className="mb-1">
                <Label for="firstName">First Name</Label>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ""}
                      invalid={!!errors.firstName}
                      onChange={(e) =>
                        field.onChange(sanitizeName(e.target.value))
                      }
                    />
                  )}
                />

                <FormFeedback>{errors.firstName?.message}</FormFeedback>
              </Col>

              {/* Last Name */}
              <Col sm="6" className="mb-1">
                <Label for="lastName">Last Name</Label>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ""}
                      invalid={!!errors.lastName}
                      onChange={(e) =>
                        field.onChange(sanitizeName(e.target.value))
                      }
                    />
                  )}
                />

                <FormFeedback>{errors.lastName?.message}</FormFeedback>
              </Col>

              {/* Email */}
              <Col sm="6" className="mb-1">
                <Label for="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      disabled={true}
                      value={field.value || ""}
                      invalid={!!errors.email}
                      onChange={(e) =>
                        field.onChange(sanitizeEmail(e.target.value))
                      }
                    />
                  )}
                />

                <FormFeedback>{errors.email?.message}</FormFeedback>
              </Col>

              {/* Phone Number (Cleave) */}
              <Col sm="6" className="mb-1">
                <Label for="phone">Phone Number</Label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <Cleave
                      {...field}
                      disabled={true}
                      value={field.value || ""}
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      options={{ phone: true, phoneRegionCode: "US" }}
                      onChange={(e) =>
                        field.onChange(sanitizePhone(e.target.value))
                      }
                    />
                  )}
                />

                <FormFeedback>{errors.phone?.message}</FormFeedback>
              </Col>

              {/* Buttons */}
              <Col sm="12" className="mt-2">
                <Button
                  type="submit"
                  color="primary"
                  disabled={loading}
                  className="me-1"
                >
                  {loading ? (
                    <>
                      <Spinner size={"sm"} /> Updating...{" "}
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
                <Button type="reset" outline color="secondary">
                  Discard
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      {/* <DeleteAccount /> */}
    </Fragment>
  );
};

export default AccountTabs;
