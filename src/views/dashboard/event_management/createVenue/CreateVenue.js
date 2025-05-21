import React, { Fragment, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";

import { Navigate, useLocation } from "react-router-dom";

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
  Row,
  Spinner,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";

function CreateVenue() {
  const location = useLocation();
  const rowData = location.state?.row;
  const uid = rowData?.uid;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const toast = useRef(null);

  const [loading, setLoading] = useState(false);

  const staffPrice = Number(watch("staffPrice")) || 0;
  const price = Number(watch("price")) || 0;
  const navigate = useNavigate();

  // 🔁 Auto-update totalPrice when either staffPrice or price changes
  useEffect(() => {
    const total = staffPrice + price;
    setValue("totalPrice", total);
  }, [staffPrice, price, setValue]);

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    try {
      setLoading(true);
      {
        {
          debugger;
        }
      }
      if (!uid) {
        const res = await useJwt.Venue(data); // <-- update to your actual API call
        console.log("API Response:", res);
        if (res.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Event Type  updated Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/VenueList");
          }, 2000);
        }
      } else {
        const res = await useJwt.updateVenue(uid, data);
        if (res.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Created Successfully",
            detail: "Event Type  created Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/VenueList");
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

  useEffect(() => {
    if (uid) {
      reset({
        venueName: rowData.venueName || "",
        price: rowData.price || "",
        capacity: rowData.capacity || "",

        venueType: rowData.venueType || "",
        noOfStaff: rowData.noOfStaff || "",
        staffPrice: rowData.staffPrice || "",
        totalPrice: rowData.totalPrice || "",
      });
    }
  }, []);

  return (
    <Fragment>
      <Card>
        <CardBody>
          <CardTitle>
            <CardText>
              
              {!uid ?" Create ":" Update "
}
              Venue</CardText>
          </CardTitle>
          <Toast ref={toast} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              {/* Venue Name */}
              <Col sm="12" className="mb-1">
                <Label for="venueName">Venue Name</Label>
                <Controller
                  name="venueName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Venue name is required" }}
                  render={({ field }) => (
                    <Input
                      id="venueName"
                      type="text"
                      placeholder="Enter venue name"
                      invalid={!!errors.venueName}
                      {...field}
                    />
                  )}
                />
                {errors.venueName && (
                  <p className="text-danger">{errors.venueName.message}</p>
                )}
              </Col>

              {/* Capacity */}
              <Col sm="12" className="mb-1">
                <Label for="capacity">Capacity</Label>
                <Controller
                  name="capacity"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Capacity is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Capacity must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Enter venue capacity"
                      invalid={!!errors.capacity}
                      {...field}
                    />
                  )}
                />
                {errors.capacity && (
                  <p className="text-danger">{errors.capacity.message}</p>
                )}
              </Col>

              {/* Venue Type */}
              <Col sm="12" className="mb-1">
                <Label for="venueType">Venue Type</Label>
                <Controller
                  name="venueType"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Venue type is required" }}
                  render={({ field }) => (
                    <Input
                      id="venueType"
                      type="select"
                      invalid={!!errors.venueType}
                      {...field}
                    >
                      <option value="">Select venue type</option>
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Hybrid">Hybrid</option>
                    </Input>
                  )}
                />
                {errors.venueType && (
                  <p className="text-danger">{errors.venueType.message}</p>
                )}
              </Col>

              <Col sm="12" className="mb-1">
                <Label for="price">price</Label>
                <Controller
                  name="price"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "price is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "price must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter venue price"
                      invalid={!!errors.price}
                      {...field}
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-danger">{errors.price.message}</p>
                )}
              </Col>

              <Col sm="12" className="mb-1">
                <Label for="noOfStaff">No of Staff</Label>
                <Controller
                  name="noOfStaff"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "No of Staff is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "No of Staff must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="noOfStaff"
                      type="number"
                      placeholder="Enter No of Staff"
                      invalid={!!errors.noOfStaff}
                      {...field}
                    />
                  )}
                />
                {errors.noOfStaff && (
                  <p className="text-danger">{errors.noOfStaff.message}</p>
                )}
              </Col>
              <Col sm="12" className="mb-1">
                <Label for="staffPrice">Staff Price</Label>
                <Controller
                  name="staffPrice"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "staff Price is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "staff Price must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="staffPrice"
                      type="number"
                      placeholder="Enter venue staff Price"
                      invalid={!!errors.price}
                      {...field}
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-danger">{errors.price.message}</p>
                )}
              </Col>
              <Col sm="12" className="mb-1">
                <Label for="totalPrice">Total Price</Label>
                <Controller
                  name="totalPrice"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "total Price is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: " Total price must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="totalPrice"
                      type="number"
                      disabled={true}
                      placeholder="Enter Total price"
                      invalid={!!errors.price}
                      {...field}
                    />
                  )}
                />
                {errors.totalPrice && (
                  <p className="text-danger">{errors.totalPrice.message}</p>
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

export default CreateVenue;
