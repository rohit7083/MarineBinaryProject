import useJwt from "@src/auth/jwt/useJwt";
import "flatpickr/dist/themes/material_blue.css";
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
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

const VesselForm = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const WaitingData = location.state?.row || "";
  const WaitUId = WaitingData?.uid;
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // vesselName: "Sea Explorer",
      // vesselRegistrationNumber: "INDMAR2025001",
      // length: "45.5",
      // width: "12.3",
      // height: "8.2",
      // power: "1200",
      // firstName: "John",
      // lastName: "Doe",
      // emailId: "john.doe@example.com",
      // phoneNumber: "9876543210",
      // countryCode: "+91",
      // dialCodeCountry: "IN",
      // address: "123 Marine Drive",
      // city: "Mumbai",
      // state: "Maharashtra",
      // country: "India",
      // postalCode: "40001",
    },
  });

  useEffect(() => {
    const fetchForUpdate = () => {
      if (WaitUId) {
        reset(WaitingData);
      }
    };
    fetchForUpdate();
  }, [WaitingData, WaitUId]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (WaitUId) {
        const Updateres = await useJwt.updateWaitingSlip(WaitUId, data);

        toast.current.show({
          severity: "success",
          summary: "Updated Successfully",
          detail: "Vessel record has been updated.",
          life: 2000,
        });
        reset();
        setTimeout(() => {
          navigate("/slip-management/waiting_slip");
        }, 1500);
        console.log(Updateres);
      } else {
        // Replace with your actual API endpoint
        const response = await useJwt.createWaitingSlip(data);
        console.log(response);

        toast.current.show({
          severity: "success",
          summary: "Successfully Added",
          detail: "Successfully Proceed To Payment",
          life: 2000,
        });

        reset();
        setTimeout(() => {
          navigate("/slip-management/waiting_slip");
        }, 1500);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Submission Failed",
        detail: error.message || "Unable to submit. Please try again later.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const textInput = (name, label, placeholder, rules, type = "text") => (
    <Col md={6} className="mb-1">
      <Label className="fw-semibold mb-1">{label}</Label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              invalid={!!errors[name]}
            />
            <FormFeedback>{errors[name]?.message}</FormFeedback>
          </>
        )}
      />
    </Col>
  );

  return (
    <>
      <Toast ref={toast} />
      <Card className="shadow border-0" style={{ borderRadius: "14px" }}>
        <CardHeader className="border-bottom-0">
          <CardTitle tag="h4" className="mb-0 fw-semibold">
            <ArrowLeft
              style={{
                cursor: "pointer",
                // marginRight:"10px",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
              onClick={() => navigate(-1)}
            />{" "}
            {WaitUId
              ? "Update Waiting Slip Details"
              : "Create Waiting Slip Details"}
          </CardTitle>
        </CardHeader>

        <CardBody className="pt-0">
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Vessel Info */}
            <div className="mb-1 border-bottom pb-3">
              <h6 className="fw-semibold text-secondary mb-1">
                Vessel Information
              </h6>
              <Row>
                {textInput("vesselName", "Vessel Name", "Enter vessel name", {
                  required: "Vessel name is required",
                })}
                {textInput(
                  "vesselRegistrationNumber",
                  "Registration Number",
                  "Enter registration number",
                  { required: "Registration number is required" }
                )}
                {textInput("length", "Length (m)", "Enter length", {
                  required: "Length is required",
                  pattern: {
                    value: /^[0-9]*\.?[0-9]+$/,
                    message: "Only numbers allowed",
                  },
                })}
                {textInput("width", "Width (m)", "Enter width", {
                  required: "Width is required",
                  pattern: {
                    value: /^[0-9]*\.?[0-9]+$/,
                    message: "Only numbers allowed",
                  },
                })}
                {textInput("height", "Height (m)", "Enter height", {
                  required: "Height is required",
                  pattern: {
                    value: /^[0-9]*\.?[0-9]+$/,
                    message: "Only numbers allowed",
                  },
                })}
                {textInput("power", "Power (HP)", "Enter power", {
                  required: "Power is required",
                  pattern: {
                    value: /^[0-9]*\.?[0-9]+$/,
                    message: "Only numbers allowed",
                  },
                })}
              </Row>
            </div>

            {/* Owner Info */}
            <div className="mb-1 border-bottom pb-3">
              <h6 className="fw-semibold text-secondary mb-1">
                Owner Information
              </h6>
              <Row>
                {textInput("firstName", "First Name", "Enter first name", {
                  required: "First name is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only letters allowed",
                  },
                })}
                {textInput("lastName", "Last Name", "Enter last name", {
                  required: "Last name is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only letters allowed",
                  },
                })}
                {textInput("emailId", "Email", "Enter email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                {textInput(
                  "phoneNumber",
                  "Phone Number",
                  "Enter phone number",
                  {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{8,15}$/,
                      message: "Enter a valid number (8–15 digits)",
                    },
                  }
                )}
                {textInput(
                  "countryCode",
                  "Country Code",
                  "Enter country code",
                  { required: "Country code required" }
                )}
                {textInput(
                  "dialCodeCountry",
                  "Dial Code Country",
                  "Enter country ISO (e.g. IN)",
                  { required: "Country ISO required" }
                )}
              </Row>
            </div>

            {/* Address Info */}
            <div className="mb-1">
              <h6 className="fw-semibold text-secondary mb-1">
                Address Information
              </h6>
              <Row>
                <Col md={12} className="mb-1">
                  <Label className="fw-semibold mb-1">Address</Label>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          placeholder="Enter address"
                          invalid={!!errors.address}
                        />
                        <FormFeedback>{errors.address?.message}</FormFeedback>
                      </>
                    )}
                  />
                </Col>
                {textInput("city", "City", "Enter city", {
                  required: "City is required",
                })}
                {textInput("state", "State", "Enter state", {
                  required: "State is required",
                })}
                {textInput("country", "Country", "Enter country", {
                  required: "Country is required",
                })}
                {textInput("postalCode", "Postal Code", "Enter postal code", {
                  required: "Postal code is required",
                })}
              </Row>
            </div>

            {/* Submit Button */}
            <div className="text-end mt-4">
              <Button
                color="primary"
                type="submit"
                className="px-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    {WaitUId ? "Updating..." : "Submitting..."}{" "}
                    <Spinner size="sm" />
                  </>
                ) : WaitUId ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </>
  );
};

export default VesselForm;
