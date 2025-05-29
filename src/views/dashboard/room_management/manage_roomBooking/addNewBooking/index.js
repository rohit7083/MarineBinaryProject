import React, { Fragment, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Flatpickr from "react-flatpickr";
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
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";

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
  const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  //     if (uid) {
  //       reset({
  //         typeName: rowData.typeName || "",
  //         description: rowData.description || "",
  //       });
  //     }
  //   }, []);

  const onSubmit = async (data) => {
    console.log(data);

    // try {
    //   setLoading(true);
    //   if (uid) {
    //     const res = await useJwt.updateVendor(uid, data);
    //     console.log("Updated:", res);
    //     {
    //       {
    //         debugger;
    //       }
    //     }
    //     if (res.status === 200) {
    //       toast.current.show({
    //         severity: "success",
    //         summary: "Updated Successfully",
    //         detail: "Vendor Type  updated Successfully.",
    //         life: 2000,
    //       });
    //       setTimeout(() => {
    //         navigate("/pos/vendor_typeList");
    //       }, 2000);
    //     }
    //   } else {
    //     const res = await useJwt.VendorType(data);
    //     if (res.status === 201) {
    //       toast.current.show({
    //         severity: "success",
    //         summary: "Created Successfully",
    //         detail: "Vendor Type  created Successfully.",
    //         life: 2000,
    //       });
    //       setTimeout(() => {
    //         navigate("/pos/vendor_typeList");
    //       }, 2000);
    //     }
    //     console.log("Created:", res);
    //   }
    // } catch (error) {
    //   console.error("API Error:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Fragment>
      <Toast ref={toast} />

      <Card>
        <CardBody>
          <CardTitle>
            <CardText>Booking Room Details</CardText>
          </CardTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="6" className="mb-1">
                <Label for="typeName">Check In Date</Label>

                <Controller
                                          name="nextPaymentDate"
                                          control={control}
                                          rules={{
                                            required: "Next Payment date is required",
                                          }}
                                          render={({ field }) => (
                                            <Flatpickr
                                              id="hf-picker"
                                              className={`form-control ${
                                                errors.nextPaymentDate ? "is-invalid" : ""
                                              }`}
                                              options={{
                                                altInput: true,
                                                altFormat: "Y-m-d",
                                                dateFormat: "Y-m-d",
                                                minDate: "today", // Disable past dates
                                              }}
                                              value={field.value}
                                              onChange={(date) => {
                                                const formattedDate = format(
                                                  date[0],
                                                  "yyyy-MM-dd"
                                                ); // Format date
                                                field.onChange(formattedDate); // Update value in the form
                                              }}
                                            />
                                          )}
                                        />
                                        {errors.nextPaymentDate && (
                                          <FormFeedback>
                                            {errors.nextPaymentDate.message}
                                          </FormFeedback>
                                        )}
                
              </Col>

                <Col sm="6" className="mb-1">
                <Label for="typeName">Check Out Date</Label>

                <Controller
                                          name="nextPaymentDate"
                                          control={control}
                                          rules={{
                                            required: "Next Payment date is required",
                                          }}
                                          render={({ field }) => (
                                            <Flatpickr
                                              id="hf-picker"
                                              className={`form-control ${
                                                errors.nextPaymentDate ? "is-invalid" : ""
                                              }`}
                                              options={{
                                                altInput: true,
                                                altFormat: "Y-m-d",
                                                dateFormat: "Y-m-d",
                                                minDate: "today", // Disable past dates
                                              }}
                                              value={field.value}
                                              onChange={(date) => {
                                                const formattedDate = format(
                                                  date[0],
                                                  "yyyy-MM-dd"
                                                ); // Format date
                                                field.onChange(formattedDate); // Update value in the form
                                              }}
                                            />
                                          )}
                                        />
                                        {errors.nextPaymentDate && (
                                          <FormFeedback>
                                            {errors.nextPaymentDate.message}
                                          </FormFeedback>
                                        )}
                
              </Col>
              <Col sm="12">
                <Label for="description">Number of guest</Label>

                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event Type Description is required" }}
                  render={({ field }) => (
                    <Input
                      id="description"
                      type="number"
                      rows="4"
                      placeholder="Enter Number of guest"
                      invalid={!!errors.description}
                      {...field}
                    />
                  )}
                />

                {errors.description && (
                  <p style={{ color: "red" }}>{errors.description.message}</p>
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
                "Search"
              )}
            </Button>
          </form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default AddVTypes;
