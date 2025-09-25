import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UncontrolledAlert } from "reactstrap";

import { useLocation } from "react-router-dom";

import useJwt from "@src/auth/jwt/useJwt";
import { ArrowLeft } from "react-feather";
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
  Row,
  Spinner,
} from "reactstrap";

function CreateVenue() {
  const location = useLocation();
  const rowData = location.state?.row;
  const uid = rowData?.uid;
  const [errMsz, seterrMsz] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // venueName: "Grand Ballroom",
      // capacity: "300",
      // price: "5000",
      // venueType: "Indoor", // Options: "Indoor", "Outdoor", "Hybrid"
      // noOfStaff: "15",
      // staffPrice: "1500",
      // totalPrice: 6500, // Should be price + staffPrice
      // city: "New York",
      // address: "123 Event Plaza, Manhattan",
      // state: "NY",
      // country: "USA",
      // postCode: "10001",
    },
  });
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

  // const onSubmit = async (data) => {
  //       seterrMsz("");

  //   console.log("Form data:", data);
  //   try {
  //     setLoading(true);

  //     if (!uid) {
  //       const res = await useJwt.Venue(data); // <-- update to your actual API call
  //       console.log("API Response:", res);
  //       if (res.status === 200) {
  //         toast.current.show({
  //           severity: "success",
  //           summary: "Updated Successfully",
  //           detail: "Event Type  updated Successfully.",
  //           life: 2000,
  //         });
  //         setTimeout(() => {
  //           navigate("/VenueList");
  //         }, 2000);
  //       }
  //     } else {
  //       const res = await useJwt.updateVenue(uid, data);
  //       if (res.status === 201) {
  //         toast.current.show({
  //           severity: "success",
  //           summary: "Created Successfully",
  //           detail: "Event Type  created Successfully.",
  //           life: 2000,
  //         });
  //         setTimeout(() => {
  //           navigate("/VenueList");
  //         }, 2000);
  //       }
  //       console.log("Created:", res);
  //     }
  //   } catch (error) {
  //     console.error("API Error:", error);
  //       if (error.response && error.response.data) {
  //       const { status, content } = error.response.data;

  //       seterrMsz((prev) => {
  //         const newMsz = content || "Something went wrong!";
  //         return prev !== newMsz ? newMsz : prev + " ";
  //       });
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit = async (data) => {
    seterrMsz("");
    console.log("Form data:", data);

    try {
      setLoading(true);

      let res;

      if (!uid) {
        // Create new venue
        res = await useJwt.Venue(data);
        if (res.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Created Successfully",
            detail: "Venue created successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/VenueList");
          }, 2000);
        }
      } else {
        // Update existing venue
        res = await useJwt.updateVenue(uid, data);
        if (res.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Venue updated successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/VenueList");
          }, 2000);
        }
      }

      console.log("API Response:", res);
    } catch (error) {
      console.error("API Error:", error);
      if (error.response && error.response.data) {
        const { content } = error.response.data;
        seterrMsz((prev) => {
          const newMsz = content || "Something went wrong!";
          return prev !== newMsz ? newMsz : prev + " ";
        });
      }
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
        city: rowData.city || "",
        address: rowData.address || "",
        state: rowData.state || "",
        country: rowData.country || "",
        postCode: rowData.postCode || "",
      });
    }
  }, []);

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
              />{" "}
              {!uid ? " Create " : " Update "}
              Venue
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
                      type="text"
                      placeholder="Enter venue capacity"
                      invalid={!!errors.capacity}
                      {...field}
                       onChange={(e) => {
          // allow only digits and prevent negative
          const value = e.target.value.replace(/[^0-9]/g, "");
          field.onChange(value);
        }}
                    />
                  )}
                />
                {errors.capacity && (
                  <p className="text-danger">{errors.capacity.message}</p>
                )}
              </Col>

              <Row>
                <Col sm="6" className="mb-1">
                  <Label for="address">Address</Label>
                  <Controller
                    name="address"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "address is required",
                      // pattern: {
                      //   value: /^[0-9]+$/,
                      //   message: "address must be a number",
                      // },
                    }}
                    render={({ field }) => (
                      <Input
                        id="address"
                        type="text"
                        placeholder="Enter venue address"
                        invalid={!!errors.address}
                        {...field}
                        onChange={(e) => {
                          // Allow letters, numbers, dot, space, dash, and comma
                          const onlyValid = e.target.value.replace(
                            /[^A-Za-z0-9 .,-]/g,
                            ""
                          );
                          field.onChange(onlyValid);
                        }}
                      />
                    )}
                  />
                  {errors.address && (
                    <p className="text-danger">{errors.address.message}</p>
                  )}
                </Col>
                <Col sm="6" className="mb-1">
                  <Label for="capacity">City</Label>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "city is required",
                      // pattern: {
                      //   value: /^[0-9]+$/,
                      //   message: "city must be a number",
                      // },
                    }}
                    render={({ field }) => (
                      <Input
                        id="city"
                        type="text"
                        placeholder="Enter venue city"
                        invalid={!!errors.city}
                        {...field}
                        onChange={(e) => {
                          // Allow only letters and spaces
                          const onlyLettersAndSpaces = e.target.value.replace(
                            /[^A-Za-z\s]/g,
                            ""
                          );
                          field.onChange(onlyLettersAndSpaces);
                        }}
                      />
                    )}
                  />
                  {errors.city && (
                    <p className="text-danger">{errors.city.message}</p>
                  )}
                </Col>
              </Row>
              <Row>
                {" "}
                <Col sm="6" className="mb-1">
                  <Label for="state">state</Label>
                  <Controller
                    name="state"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "state is required",
                      // pattern: {
                      //   value: /^[0-9]+$/,
                      //   message: "state must be a number",
                      // },
                    }}
                    render={({ field }) => (
                      <Input
                        id="state"
                        type="text"
                        placeholder="Enter venue state"
                        invalid={!!errors.state}
                        {...field}
                        onChange={(e) => {
                          // Allow only letters and spaces
                          const onlyLettersAndSpaces = e.target.value.replace(
                            /[^A-Za-z\s]/g,
                            ""
                          );
                          field.onChange(onlyLettersAndSpaces);
                        }}
                      />
                    )}
                  />
                  {errors.state && (
                    <p className="text-danger">{errors.state.message}</p>
                  )}
                </Col>
                <Col sm="6" className="mb-1">
                  <Label for="country">country</Label>
                  <Controller
                    name="country"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "country is required",
                      // pattern: {
                      //   value: /^[0-9]+$/,
                      //   message: "country must be a number",
                      // },
                    }}
                    render={({ field }) => (
                      <Input
                        id="country"
                        type="text"
                        placeholder="Enter venue country"
                        invalid={!!errors.country}
                        {...field}
                        onChange={(e) => {
                          // Allow only letters and spaces
                          const onlyLettersAndSpaces = e.target.value.replace(
                            /[^A-Za-z\s]/g,
                            ""
                          );
                          field.onChange(onlyLettersAndSpaces);
                        }}
                      />
                    )}
                  />
                  {errors.country && (
                    <p className="text-danger">{errors.country.message}</p>
                  )}
                </Col>
              </Row>
              <Row>
                {" "}
                <Col sm="12" className="mb-1">
                  <Label for="postCode">Zip Code</Label>
                  <Controller
                    name="postCode"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Zip code is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Zip code must be a number",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        id="postCode"
                        type="number"
                        placeholder="Enter venue Zip"
                        invalid={!!errors.postCode}
                        {...field}
                        onChange={(e) => {
                          // Keep only digits
                          let value = e.target.value.replace(/[^0-9]/g, "");

                          // Limit to maximum 5 digits
                          value = value.slice(0, 5);

                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                  {errors.postCode && (
                    <p className="text-danger">{errors.postCode.message}</p>
                  )}
                </Col>
              </Row>

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
                      <option value="Hybrid">Both</option>
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
                      type="text"
                      placeholder="Enter venue price"
                      invalid={!!errors.price}
                      {...field}
                         onChange={(e) => {
          // allow only digits and prevent negative
          const value = e.target.value.replace(/[^0-9]/g, "");
          field.onChange(value);
        }}
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
                      type="text"
                      placeholder="Enter No of Staff"
                      invalid={!!errors.noOfStaff}
                      {...field}
                          onChange={(e) => {
          // allow only digits and prevent negative
          const value = e.target.value.replace(/[^0-9]/g, "");
          field.onChange(value);
        }}
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
                      type="text"
                      placeholder="Enter venue staff Price"
                      invalid={!!errors.price}
                      {...field}    onChange={(e) => {
          // allow only digits and prevent negative
          const value = e.target.value.replace(/[^0-9]/g, "");
          field.onChange(value);
        }}
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
            {/* <div className="d-flex justify-content-end"> */}

            <Button type="submit" disabled={loading} color="primary">
              {loading ? (
                <>
                  <span>Loading.. </span>
                  <Spinner size="sm" />{" "}
                </>
              ) : (
                <>{uid ? "Update" : "Submit"}</>
              )}
            </Button>
            {/* </div> */}
          </form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default CreateVenue;
