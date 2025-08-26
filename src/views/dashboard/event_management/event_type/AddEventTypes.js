import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";
function AddEventTypes() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const rowData = location.state?.row;
  const uid = rowData?.uid;

  useEffect(() => {
    if (uid) {
      reset({
        eventTypeName: rowData.eventTypeName || "",
        eventTypeDescription: rowData.eventTypeDescription || "",
      });
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let res;
      if (uid) {
        res = await useJwt.UpdateEventType(uid, data);
        console.log("Updated:", res);
        if (res.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Event Type  updated Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/addEvent_type");
          }, 2000);
        }
      } else {
        res = await useJwt.EventType(data);
        if (res.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Created Successfully",
            detail: "Event Type  created Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/addEvent_type");
          }, 2000);
        }
        console.log("Created:", res);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Card>
        <CardBody>
          <CardTitle>
            <CardText>
              <ArrowLeft
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
                onClick={() => window.history.back()}
              />
              {!uid ? "Create " : "update "}
              Event Types
            </CardText>
          </CardTitle>
          <Toast ref={toast} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="12" className="mb-1">
                <Label for="eventTypeName">Event Type</Label>

                <Controller
                  name="eventTypeName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event Type is required" }}
                  render={({ field }) => (
                    <Input
                      id="eventTypeName"
                      type="text"
                      placeholder="Enter event type"
                      invalid={!!errors.eventTypeName}
                      {...field}
                    />
                  )}
                />

                {errors.eventTypeName && (
                  <p style={{ color: "red" }}>{errors.eventTypeName.message}</p>
                )}
              </Col>
              <Col sm="12">
                <Label for="eventTypeDescription">Event Type Description</Label>

                <Controller
                  name="eventTypeDescription"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event Type Description is required" }}
                  render={({ field }) => (
                    <Input
                      id="eventTypeDescription"
                      type="textarea"
                      rows="4"
                      placeholder="Enter event type description"
                      invalid={!!errors.eventTypeDescription}
                      {...field}
                      onChange={(e) => {
                        const cleanValue = e.target.value
                          .replace(/[^a-zA-Z0-9 ]/g, "")
                          .replace(/\s+/g, " "); 
                         
                        field.onChange(cleanValue);
                      }}
                    />
                  )}
                />

                {errors.eventTypeDescription && (
                  <p style={{ color: "red" }}>
                    {errors.eventTypeDescription.message}
                  </p>
                )}
              </Col>
            </FormGroup>

            <Button type="submit" disabled={loading} color="primary">
              {loading ? (
                <>
                  <span>Loading.. </span>
                  <Spinner size="sm" />{" "}
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default AddEventTypes;
