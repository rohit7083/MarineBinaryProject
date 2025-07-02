import React, { Fragment, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { UncontrolledAlert } from "reactstrap";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Label,
  Input,
  Button,
  FormGroup,
  Spinner,
  FormFeedback,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";
import { ArrowLeft } from "react-feather";

function AddVTypes() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const rowData = location.state?.row;
  const uid = rowData?.uid;
  const toast = useRef(null);
  const [errMsz, seterrMsz] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uid) {
      reset({
        typeName: rowData.typeName || "",
        description: rowData.description || "",
      });
    }
  }, []);

  const onSubmit = async (data) => {
    seterrMsz("");

    

    const payload = {
      taxType: "Percentage",
      ...data,
    };

    try {
      setLoading(true);
      if (uid) {
        const res = await useJwt.updateVendor(uid, data);
        console.log("Updated:", res);
        if (res.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Room Type  updated Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/manage_room_types");
          }, 2000);
        }
      } else {
        const res = await useJwt.CreateRoomType(payload);
        if (res.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Created Successfully",
            detail: "Room Type  created Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/manage_room_types");
          }, 2000);
        }
        console.log("Created:", res);
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response && error.response.data) {
        const { status, content } = error.response.data;

        seterrMsz((prev) => {
          const newMsz = content || "Something went wrong!";
          return prev !== newMsz ? newMsz : prev + " ";
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Toast ref={toast} />

      <Card>
        <CardBody>
          <CardTitle>
            <CardText>
              <ArrowLeft
                style={{
                  cursor: "pointer",
                  cursor: "pointer",
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
                onClick={() => window.history.back()}
              />{" "}
              {uid ? "Update" : "Create "}
              Room Types
            </CardText>
          </CardTitle>
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
                <Label for="roomTypeName">Room Type</Label>

                <Controller
                  name="roomTypeName"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Event Type is required",
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: "Only letters and numbers are allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="roomTypeName"
                      type="text"
                      placeholder="Enter Room type"
                      invalid={!!errors.roomTypeName}
                      {...field}
                    />
                  )}
                />
                <FormFeedback>{errors.roomTypeName?.message}</FormFeedback>
              </Col>
              <Col sm="12" className="mb-1">
                <Label for="">Tax Name</Label>

                <Controller
                  name="taxName"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Tax Name is required",
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: "Only letters and numbers are allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="taxName"
                      type="text"
                      placeholder="Enter Tax Name "
                      invalid={!!errors.taxName}
                      {...field}
                    />
                  )}
                />

                <FormFeedback>{errors.taxName?.message}</FormFeedback>
              </Col>

              <Col sm="12" className="mb-1">
                <Label for="">Room Capacity</Label>

                <Controller
                  name="peopleCapacity"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Tax Name is required",
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: "Only letters and numbers are allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="peopleCapacity"
                      type="text"
                      placeholder="Maximum occupancy (number of people): "
                      invalid={!!errors.peopleCapacity}
                      {...field}
                    />
                  )}
                />

                <FormFeedback>{errors.peopleCapacity?.message}</FormFeedback>
              </Col>

              <Col sm="12" className="mb-1">
                <Label for="typeName">Tax In Percentage ( % )</Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Tax Value is required",

                    pattern: {
                      value: /^(100(\.0{1,2})?|(\d{1,2})(\.\d{1,2})?)$/,
                      message: "Enter a valid percentage between 0 and 100",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      placeholder="Enter Tax Percentage (e.g. 10%)"
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />

                <FormFeedback>{errors.taxValue?.message}</FormFeedback>
              </Col>

              <Col sm="12">
                <Label for="description">Description</Label>

                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event  Description is required" }}
                  render={({ field }) => (
                    <Input
                      id="description"
                      type="textarea"
                      rows="4"
                      placeholder="Enter description"
                      invalid={!!errors.description}
                      {...field}
                    />
                  )}
                />

                <FormFeedback>{errors.description?.message}</FormFeedback>
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

export default AddVTypes;
