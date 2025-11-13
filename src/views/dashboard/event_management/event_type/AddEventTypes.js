import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import React, { Fragment, useEffect, useRef, useState } from "react";
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
  UncontrolledAlert,
} from "reactstrap";
function AddEventTypes() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errMsz, seterrMsz] = useState("");

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
    seterrMsz("");
    setLoading(true);

    try {
      if (uid) {
        // 🔹 Update event type
        try {
          const res = await useJwt.UpdateEventType(uid, data);
          console.log("Updated:", res);

          if (res.status === 200) {
            toast.current.show({
              severity: "success",
              summary: "Updated Successfully",
              detail: "Event Type updated successfully.",
              life: 2000,
            });
            setTimeout(() => {
              navigate("/addEvent_type");
            }, 2000);
          }
        } catch (error) {
          console.error("Update Error:", error);
          seterrMsz(
            error.response?.data?.content || "Failed to update Event Type!"
          );
        }
      } else {
        // 🔹 Create event type
        try {
          const createRes = await useJwt.EventType(data);
          console.log("Created:", createRes);

          if (createRes?.status === 201) {
            toast.current.show({
              severity: "success",
              summary: "Created Successfully",
              detail: "Event Type created successfully.",
              life: 2000,
            });
            setTimeout(() => {
              navigate("/addEvent_type");
            }, 2000);
          }
        } catch (error) {
          console.error("Create Error:", error);
          seterrMsz(
            error.response?.data?.content || "Failed to create Event Type!"
          );
        }
      }
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
          {errMsz && (
            <React.Fragment>
              <UncontrolledAlert color="danger">
                <div className="alert-body">
                  <span className="text-danger fw-bold">
                    <strong>Error : </strong>
                    {errMsz}
                  </span>
                </div>
              </UncontrolledAlert>
            </React.Fragment>
          )}
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
                      onChange={(e) => {
                        // Allow only letters and spaces
                        const onlyLettersAndSpaces = e.target.value.replace(
                          /[^A-Za-z0-9\s]/g,
                          ""
                        );
                        field.onChange(onlyLettersAndSpaces);
                      }}
                    />
                  )}
                />

                {errors.eventTypeName && (
                  <p style={{ color: "red" }}>{errors.eventTypeName.message}</p>
                )}
              </Col>
              <Col sm="12">
                <Label for="eventTypeDescription">
                  Event Type Description (max 500 characters)
                </Label>

                <Controller
                  name="eventTypeDescription"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Event Type Description is required",
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="eventTypeDescription"
                        type="textarea"
                        rows="4"
                        placeholder="Enter event type description"
                        invalid={!!errors.eventTypeDescription}
                        {...field}
                        onChange={(e) => {
                          const cleanValue = e.target.value
                            // allow letters, numbers, dot, comma, dash, space
                            .replace(/[^a-zA-Z0-9.,\- ]/g, "")
                            // collapse multiple spaces into one
                            .replace(/\s+/g, " ")
                            // limit length to 500
                            .slice(0, 500);

                          field.onChange(cleanValue);
                        }}
                      />
                      {/* Character counter */}
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.85rem",
                          marginTop: "4px",
                        }}
                      >
                        {field.value?.length || 0}/500
                      </p>
                    </div>
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
