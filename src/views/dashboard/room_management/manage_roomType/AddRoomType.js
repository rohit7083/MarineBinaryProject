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
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";

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
    if (uid && rowData) {
      reset(rowData);
    }
  }, [uid, rowData]);

  const onSubmit = async (data) => {
    seterrMsz("");

    const payload = {
      taxType: "Percentage",
      ...data,
    };

    try {
      setLoading(true);
      if (uid) {
        const res = await useJwt.UpdateRoomType(uid, data);
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
              {uid ? "Update " : "Create "}
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
                   
                  }}
                  render={({ field }) => (
                    <Input
                      id="roomTypeName"
                      type="text"
                      placeholder="Enter Room type"
                      invalid={!!errors.roomTypeName}
                      {...field}
                      onChange={(e) => {
                        const onlyValid = e.target.value.replace(
                          /[^A-Za-z0-9\s.,-]/g,
                          ""
                        );
                        field.onChange(onlyValid);
                      }}
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
                  }}
                  render={({ field }) => (
                    <Input
                      id="taxName"
                      type="text"
                      placeholder="Enter Tax Name "
                      invalid={!!errors.taxName}
                      {...field}
                      onChange={(e) => {
                        const onlyValid = e.target.value.replace(
                          /[^A-Za-z0-9\s.,-]/g,
                          ""
                        );
                        field.onChange(onlyValid);
                      }}
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
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        ); // remove non-numeric
                        field.onChange(onlyNumbers);
                      }}
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
                      onChange={(e) => {
                        let value = e.target.value;

                        // Remove everything except digits and dot
                        value = value.replace(/[^0-9.]/g, "");

                        // Allow only one dot
                        const parts = value.split(".");
                        if (parts.length > 2) {
                          value = parts[0] + "." + parts.slice(1).join("");
                        }

                        field.onChange(value);
                      }}
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
                      onChange={(e) => {
                        // allow only letters, numbers, space, dash, and dot
                        const onlyValid = e.target.value.replace(
                          /[^A-Za-z0-9 .,-]/g,
                          ""
                        );
                        field.onChange(onlyValid);
                      }}
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
                  <Spinner size="sm" />
                </>
              ) : uid ? (
                "Update"
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
