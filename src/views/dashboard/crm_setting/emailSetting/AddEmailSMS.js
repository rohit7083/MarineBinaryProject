import useJwt from "@src/auth/jwt/useJwt";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
const SiteSettingsForm = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  const location = useLocation();
  const settingData = location?.state?.row;
  const settingUid = settingData?.uid;
  useEffect(() => {
    if (settingData?.uid) {
      reset(settingData);
    }
  }, [settingData]);
  const onSubmit = async (data) => {
    console.log("✅ Submitted Data:", data);
    setLoading(true);
    try {
      if (settingUid) {
        const updateres = await useJwt.updateSetting(settingUid, data);
      } else {
        const response = await useJwt.emailSmsSetting(data);
      }
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Settings saved successfully!",
        life: 2500,
      });
      setTimeout(() => {
        navigate("/crm/index");
      }, 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error?.response?.data?.content ||
          "Something went wrong while saving your request. Please retry.",
        life: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  // Real-time input filtering helper
  const handleRestrictedInput = (e, allowedPattern, field) => {
    const value = e.target.value;
    const filtered = value.replace(allowedPattern, ""); // remove disallowed chars
    if (filtered !== value) {
      e.target.value = filtered;
    }
    setValue(field, filtered, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <ArrowLeft
            style={{
              cursor: "pointer",
              transition: "color 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
            onClick={() => navigate(-1)}
          />{" "}
          {settingUid ? "Update " : "Create"} Email-SMS Settings
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Toast ref={toast} />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            {/* Site Name */}
            <Col md={6} className="mb-1">
              <Label for="siteName">Site Name</Label>
              <Controller
                name="siteName"
                control={control}
                rules={{
                  required: "Site name is required",
                  pattern: {
                    value: /^[A-Za-z0-9\s]+$/,
                    message: "Only letters and numbers allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="siteName"
                    placeholder="Enter site name"
                    invalid={!!errors.siteName}
                    onChange={(e) =>
                      handleRestrictedInput(e, /[^A-Za-z0-9\s]/g, "siteName")
                    }
                  />
                )}
              />
              {errors.siteName && (
                <span className="text-danger">{errors.siteName.message}</span>
              )}
            </Col>

            {/* Email */}
            <Col md={6} className="mb-1">
              <Label for="email">Email</Label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter support email"
                    invalid={!!errors.email}
                  />
                )}
              />
              {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}
            </Col>

            {/* Email Send Method */}
            <Col md={6} className="mb-1">
              <Label for="emailSendMethod">Email Send Method</Label>
              <Controller
                name="emailSendMethod"
                control={control}
                rules={{
                  required: "Please select an Email send method",
                  validate: (value) =>
                    value !== "Select Option" ||
                    "Please select a valid Email send method",
                }}
                render={({ field }) => (
                  <Input
                    type="select"
                    id="emailSendMethod"
                    {...field}
                    invalid={!!errors.emailSendMethod}
                  >
                    <option value="Select Option">Select Option</option>
                    <option value="sendGrid">SendGrid</option>
                  </Input>
                )}
              />
              {errors.emailSendMethod && (
                <span className="text-danger">
                  {errors.emailSendMethod.message}
                </span>
              )}
            </Col>

            {/* Email Key (only letters, numbers, dot, dash) */}
            <Col md={6} className="mb-1">
              <Label for="emailKey">Email Key</Label>
              <Controller
                name="emailKey"
                control={control}
                rules={{
                  required: "Email key is required",
                  pattern: {
                    value: /^[A-Za-z0-9.-]+$/,
                    message:
                      "Only letters, numbers, dots (.) and dashes (-) allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="emailKey"
                    type="text"
                    placeholder="Enter email API key"
                    invalid={!!errors.emailKey}
                    onChange={(e) =>
                      handleRestrictedInput(e, /[^A-Za-z0-9.-]/g, "emailKey")
                    }
                  />
                )}
              />
              {errors.emailKey && (
                <span className="text-danger">{errors.emailKey.message}</span>
              )}
            </Col>

            {/* Phone Number */}
            <Col md={6} className="mb-1">
              <Label for="phoneNumber">Phone Number</Label>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: "Invalid phone number format",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    invalid={!!errors.phoneNumber}
                    onChange={(e) =>
                      handleRestrictedInput(e, /[^0-9+]/g, "phoneNumber")
                    }
                  />
                )}
              />
              {errors.phoneNumber && (
                <span className="text-danger">
                  {errors.phoneNumber.message}
                </span>
              )}
            </Col>

            {/* SMS Send Method */}
            <Col md={6} className="mb-1">
              <Label for="smsSendMethod">SMS Send Method</Label>
              <Controller
                name="smsSendMethod"
                control={control}
                rules={{
                  required: "Please select an SMS send method",
                  validate: (value) =>
                    value !== "Select Option" ||
                    "Please select a valid SMS send method",
                }}
                render={({ field }) => (
                  <Input
                    type="select"
                    id="smsSendMethod"
                    {...field}
                    invalid={!!errors.smsSendMethod}
                  >
                    <option value="Select Option">Select Option</option>
                    <option value="twilio">Twilio</option>
                  </Input>
                )}
              />
              {errors.smsSendMethod && (
                <span className="text-danger">
                  {errors.smsSendMethod.message}
                </span>
              )}
            </Col>

            {/* SMS Account SID */}
            <Col md={6} className="mb-1">
              <Label for="smsAccountSID">SMS Account SID</Label>
              <Controller
                name="smsAccountSID"
                control={control}
                rules={{
                  required: "SMS Account SID is required",
                  pattern: {
                    value: /^[A-Za-z0-9\s]+$/,
                    message: "Only letters and numbers allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="smsAccountSID"
                    placeholder="Enter SMS Account SID"
                    invalid={!!errors.smsAccountSID}
                    onChange={(e) =>
                      handleRestrictedInput(
                        e,
                        /[^A-Za-z0-9\s]/g,
                        "smsAccountSID"
                      )
                    }
                  />
                )}
              />
              {errors.smsAccountSID && (
                <span className="text-danger">
                  {errors.smsAccountSID.message}
                </span>
              )}
            </Col>

            {/* SMS Auth Token */}
            <Col md={6} className="mb-1">
              <Label for="smsAuthToken">SMS Auth Token</Label>
              <Controller
                name="smsAuthToken"
                control={control}
                rules={{
                  required: "Auth token is required",
                  pattern: {
                    value: /^[A-Za-z0-9\s]+$/,
                    message: "Only letters and numbers allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="smsAuthToken"
                    type="password"
                    placeholder="Enter Twilio Auth Token"
                    invalid={!!errors.smsAuthToken}
                    onChange={(e) =>
                      handleRestrictedInput(
                        e,
                        /[^A-Za-z0-9\s]/g,
                        "smsAuthToken"
                      )
                    }
                  />
                )}
              />
              {errors.smsAuthToken && (
                <span className="text-danger">
                  {errors.smsAuthToken.message}
                </span>
              )}
            </Col>

            {/* Buttons */}
            <Col xs={12} className="d-flex justify-content-end gap-2 mt-3">
              <Button
                color="secondary"
                type="button"
                disabled={loading}
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button color="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    Saving... <Spinner size="sm" />
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default SiteSettingsForm;
