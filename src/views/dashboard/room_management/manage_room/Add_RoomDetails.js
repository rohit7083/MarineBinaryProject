import React, { Fragment, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";
import Select from "react-select";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "react-feather";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
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
  Table,
  Row,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";

function AddVTypes() {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const rowData = location.state?.row;
  const uid = rowData?.uid;
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [roomCount, setRoomCount] = useState(0);
  useEffect(() => {
    if (uid) {
      reset({
        typeName: rowData.typeName || "",
        description: rowData.description || "",
      });
    }
  }, []);

  const onSubmit = async (data) => {
    console.log(data);

    try {
      setLoading(true);
      if (uid) {
        const res = await useJwt.updateVendor(uid, data);
        console.log("Updated:", res);

        if (res.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Vendor Type  updated Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/pos/vendor_typeList");
          }, 2000);
        }
      } else {
        const res = await useJwt.VendorType(data);
        if (res.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Created Successfully",
            detail: "Vendor Type  created Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/pos/vendor_typeList");
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributeKeys",
  });

  const noOfRooms = parseInt(watch("noOfRooms")) || 0;
  useEffect(() => {
    if (noOfRooms) {
      setRoomCount(noOfRooms);
    }

    if (noOfRooms === 0 || noOfRooms === "") {
      setRoomCount(0);
        
    }
  }, [noOfRooms, roomCount]);
  return (
    <Fragment>
      <Toast ref={toast} />

      <Card>
        <CardBody>
          <CardTitle>
            <CardText>
              {uid ? "Update" : "Create "}
              Room Details
            </CardText>
          </CardTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="12" className="mb-1">
                <Label for="typeName">Room Type</Label>

                <Controller
                  name="typeName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event Type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={{ label: "Other", value: "other" }}
                      isClearable
                      className="react-select"
                      classNamePrefix="select"
                    />
                  )}
                />

                {errors.typeName && (
                  <p style={{ color: "red" }}>{errors.typeName.message}</p>
                )}
              </Col>
              <Col sm="12" className="mb-1">
                <Label for="typeName">Number of Rooms</Label>

                <Controller
                  name="noOfRooms"
                  control={control}
                  defaultValue="0"
                  rules={{ required: "Tax Name is required" }}
                  render={({ field }) => (
                    <Input
                      id="noOfRooms"
                      type="text"
                      placeholder="Enter Tax Name "
                      invalid={!!errors.noOfRooms}
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (+val > 20) return;
                        field.onChange(e);
                      }}
                    />
                  )}
                />

                {errors.noOfRooms && (
                  <p style={{ color: "red" }}>{errors.noOfRooms.message}</p>
                )}
              </Col>
              <Row>
                {[...Array(roomCount)].map((_, index) => (
                  <Col sm="6" key={index} className="mb-2">
                    <div className="p-1 border rounded">
                      <h6>Room {index + 1}</h6>
                      <Label>Room Name</Label>
                      <Controller
                        control={control}
                        name={`rooms[${index}].name`}
                        rules={{ required: "Room name is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <Input
                              {...field}
                              placeholder={`Room ${index + 1} Name`}
                              invalid={!!error}
                            />
                            {error && (
                              <span className="text-danger">
                                {error.message}
                              </span>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
              <Col sm="6" className="mb-1">
                <Label for="typeName">Room Tax</Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Tax Value is required" }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />

                {errors.taxValue && (
                  <p style={{ color: "red" }}>{errors.taxValue.message}</p>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">Only Room Weekdays Price</Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Tax Value is required" }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />

                {errors.taxValue && (
                  <p style={{ color: "red" }}>{errors.taxValue.message}</p>
                )}
              </Col>{" "}
              <Col sm="6" className="mb-1">
                <Label for="typeName">Only Room Weekend Price</Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Tax Value is required" }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />

                {errors.taxValue && (
                  <p style={{ color: "red" }}>{errors.taxValue.message}</p>
                )}
              </Col>{" "}
              <Col sm="6" className="mb-1">
                <Label for="typeName">2 People Breakfast Price</Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Tax Value is required" }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />

                {errors.taxValue && (
                  <p style={{ color: "red" }}>{errors.taxValue.message}</p>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">2 People All Meal Price</Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Tax Value is required" }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />

                {errors.taxValue && (
                  <p style={{ color: "red" }}>{errors.taxValue.message}</p>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">
                  Additional Person Room Only Week Days
                </Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Tax Value is required" }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />

                {errors.taxValue && (
                  <p style={{ color: "red" }}>{errors.taxValue.message}</p>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">
                  Additional Person Room Only Weekend
                </Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Tax Value is required" }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />

                {errors.taxValue && (
                  <p style={{ color: "red" }}>{errors.taxValue.message}</p>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">Additional Person Breakfast </Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Tax Value is required" }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />

                {errors.taxValue && (
                  <p style={{ color: "red" }}>{errors.taxValue.message}</p>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">Additional Person All Meal </Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Tax Value is required" }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />

                {errors.taxValue && (
                  <p style={{ color: "red" }}>{errors.taxValue.message}</p>
                )}
              </Col>
            </FormGroup>

            <CardTitle className="mt-3 mb-2" tag="h4">
              Special Days
            </CardTitle>

            <Card className="card-company-table">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((item, index) => (
                    <tr key={item.id}>
                      <td>
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
                      </td>

                      <td>
                        <Controller
                          name={`attributeKeys.${index}.attributeName`}
                          control={control}
                          rules={{
                            required: "Variations Name is required",
                            pattern: {
                              value: /^[A-Za-z ]+$/,
                              message:
                                "Only alphabetic characters (A–Z) are allowed",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Variation Name"
                              {...field}
                            />
                          )}
                        />
                        {errors.attributeKeys?.[index]?.attributeName && (
                          <span className="text-danger">
                            {errors.attributeKeys[index].attributeName.message}
                          </span>
                        )}
                      </td>

                      <td>
                        <Controller
                          name={`attributeKeys.${index}.attributeName`}
                          control={control}
                          rules={{
                            required: "Variations Name is required",
                            pattern: {
                              value: /^[A-Za-z ]+$/,
                              message:
                                "Only alphabetic characters (A–Z) are allowed",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Variation Name"
                              {...field}
                            />
                          )}
                        />
                        {errors.attributeKeys?.[index]?.attributeName && (
                          <span className="text-danger">
                            {errors.attributeKeys[index].attributeName.message}
                          </span>
                        )}
                      </td>
                      <td>
                        <Trash2
                          style={{ cursor: "pointer" }}
                          onClick={() => remove(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-start ms-2 mt-2 mb-1">
                <Button
                  color="primary"
                  type="button"
                  onClick={() =>
                    append({ attributeName: "", isRequired: false })
                  }
                >
                  Add New
                </Button>
              </div>
            </Card>

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
