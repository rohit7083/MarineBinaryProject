import React, { Fragment, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";
import Select from "react-select";
import { useFieldArray } from "react-hook-form";
import { ArrowLeft, Plus, Trash2 } from "react-feather";
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
  UncontrolledAlert,
  FormFeedback,
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
  const [errorMessage, setErrorMsz] = useState("");

  const [roomtyp, setRoomTypeName] = useState([]);
  useEffect(() => {
    if (uid) {
      reset({
        typeName: rowData.typeName || "",
        description: rowData.description || "",
      });
    }
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specialDays",
  });

  const noOfRooms = parseInt(watch("roomUnits")) || 0;
  useEffect(() => {
    if (noOfRooms) {
      setRoomCount(noOfRooms);
    }

    if (noOfRooms === 0 || noOfRooms === "") {
      setRoomCount(0);
    }
  }, [noOfRooms, roomCount]);

  const roomTypeOptions = async () => {
    try {
      const res = await useJwt.getAllRoomTypes();
      console.log(res);

      const { result } = res?.data?.content;
      const roomtypes = result?.map((x) => ({
        label: x.roomTypeName,
        value: x.uid,
      }));
      setRoomTypeName(roomtypes);
    } catch (error) {
       console.error(error);
    }
  };

  useEffect(() => {
    roomTypeOptions();
  }, []);

  const WatchroomUnits = watch("roomUnits");
  console.log("WatchroomUnits", WatchroomUnits);
  
  const onSubmit = async (data) => {
    // {{   }}
    setErrorMsz("");
    reset();

    const payload = {
      ...data,
numberOfRooms:WatchroomUnits.length,
      roomUnits: data.roomUnits.map((room) => ({
        roomNumber: room.roomNumber,
        active: true,
      })),
      roomType: { uid: data?.roomType?.value },

    };
    console.log("payload0", payload);

    try {
      setLoading(true);
      if (uid) {
        const res = await useJwt.updateVendor(uid, payload);
        console.log("Updated:", res);

        if (res.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Room   updated Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/room_details");
          }, 2000);
        }
      } else {
        const res = await useJwt.CreateRoom(payload);
        if (res.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Created Successfully",
            detail: "Room created Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/room_details");
          }, 2000);
        }
        console.log("Created:", res);
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        const errorMessage = error?.response?.data?.content;
        setErrorMsz(errorMessage);
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
              Room Details
            </CardText>
          </CardTitle>
          <Col sm="12">
            {errorMessage && (
              <React.Fragment>
                <UncontrolledAlert color="danger">
                  <div className="alert-body">
                    <span className="text-danger fw-bold">
                      <strong>Error ! </strong>
                      {errorMessage}
                    </span>
                  </div>
                </UncontrolledAlert>
              </React.Fragment>
            )}
          </Col>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="12" className="mb-1">
                <Label for="typeName">Room Type</Label>

                <Controller
                  name="roomType"
                  control={control}
                  rules={{ required: "Room Type is required" }}
                  render={({ field }) => (
                    <div>
                      <Select
                        {...field}
                        options={roomtyp}
                        isClearable
                        className={
                          errors.roomType
                            ? "react-select is-invalid"
                            : "react-select"
                        }
                        classNamePrefix="select"
                      />
                      <FormFeedback>{errors.roomType?.message}</FormFeedback>
                    </div>
                  )}
                />
              </Col>
              <Col sm="12" className="mb-1">
                <Label for="typeName">Number of Rooms</Label>

                <Controller
                  name="roomUnits"
                  control={control}
                  // defaultValue="0"
                  rules={{
                    required: "Number of Rooms is required",
                    pattern: {
                      value: /^\d+$/,
                      message: "Only numeric values are allowed.",
                    },
                    min: {
                      value: 1,
                      message: "Minimum value is 1",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="roomUnits"
                      type="text"
                      placeholder="Enter Number of Rooms "
                      invalid={!!errors.roomUnits}
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (+val > 20) return;
                        field.onChange(e);
                      }}
                    />
                  )}
                />
                <FormFeedback>{errors.roomUnits?.message}</FormFeedback>
              </Col>
              {WatchroomUnits > 0 && (
                <Row>
                  {[...Array(roomCount)].map((_, index) => (
                    <Col sm="6" key={index} className="mb-2">
                      <div className="p-1 border rounded">
                        <div className="d-flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 14 14"
                            width="1em"
                            height="1em"
                            className="me-1"
                          >
                            <g
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M.5 9L7 2.5L13.5 9"></path>
                              <path d="M2.5 7v6.5h9V7M7 13.5v-4"></path>
                            </g>
                          </svg>
                          <h6>Room {index + 1}</h6>
                        </div>
                        <Label>Room Name </Label>
                        <Controller
                          control={control}
                          name={`roomUnits[${index}].roomNumber`}
                          rules={{ required: "Room name is required" }}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <Input
                                {...field}
                                placeholder={`Room ${index + 1} Name`}
                                invalid={!!error}
                              />
                              <FormFeedback>{error?.message}</FormFeedback>

                              {/* <FormFeedback>
                              {errors.roomNumber?.message}
                            </FormFeedback> */}
                            </>
                          )}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
              {/* <Col sm="6" className="mb-1">
                <Label for="typeName">Room Tax</Label>

                <Controller
                  name="taxValue"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Room Tax is required",
                    pattern: {
                      value: /^\d+$/,
                      message: "Only numeric values are allowed.",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="taxValue"
                      type="text"
                      disabled={true}
                      placeholder="Enter Tax Value "
                      invalid={!!errors.taxValue}
                      {...field}
                    />
                  )}
                />
                <FormFeedback>{errors.taxValue?.message}</FormFeedback>
              </Col> */}
              <Col sm="6" className="mb-1">
                <Label for="typeName">Only Room Weekdays Price</Label>

                <Controller
                  name="onlyRoomWeekdaysPrice"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Room Weekdays Price is required",
                    pattern: {
                      value: /^\d+$/,
                      message: "Only numeric values are allowed.",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="onlyRoomWeekdaysPrice"
                      type="text"
                      placeholder="Enter Room Weekdays Price "
                      invalid={!!errors.onlyRoomWeekdaysPrice}
                      {...field}
                    />
                  )}
                />

                <FormFeedback>
                  {errors.onlyRoomWeekdaysPrice?.message}
                </FormFeedback>
              </Col>{" "}
              <Col sm="6" className="mb-1">
                <Label for="typeName">Only Room Weekend Price</Label>

                <Controller
                  name="onlyRoomWeekendPrice"
                  control={control}
                  // defaultValue=""
                  rules={{ required: "Room Weekend Price is required" }}
                  render={({ field }) => (
                    <Input
                      id="onlyRoomWeekendPrice"
                      type="text"
                      placeholder="Enter Room Weekend Price Value "
                      invalid={!!errors.onlyRoomWeekendPrice}
                      {...field}
                    />
                  )}
                />

                <FormFeedback>
                  {errors.onlyRoomWeekendPrice?.message}
                </FormFeedback>
              </Col>{" "}
              <Col sm="6" className="mb-1">
                <Label for="typeName">2 People Breakfast Price</Label>

                <Controller
                  name="twoPeopleBreakfastPrice"
                  control={control}
                  defaultValue=""
                  rules={{ required: "2 People Breakfast Price is required" }}
                  render={({ field }) => (
                    <Input
                      id="twoPeopleBreakfastPrice"
                      type="text"
                      placeholder="Enter 2 People Breakfast Price "
                      invalid={!!errors.twoPeopleBreakfastPrice}
                      {...field}
                    />
                  )}
                />

                <FormFeedback>
                  {errors.twoPeopleBreakfastPrice?.message}
                </FormFeedback>
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">2 People All Meal Price</Label>

                <Controller
                  name="twoPeopleAllMealPrice"
                  control={control}
                  defaultValue=""
                  rules={{ required: "2 People All Meal Price is required" }}
                  render={({ field }) => (
                    <Input
                      id="twoPeopleAllMealPrice"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.twoPeopleAllMealPrice}
                      {...field}
                    />
                  )}
                />
                <FormFeedback>
                  {errors.twoPeopleAllMealPrice?.message}
                </FormFeedback>
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">
                  Additional Person Room Only Week Days
                </Label>

                <Controller
                  name="additionalPersonRoomOnlyWeekdays"
                  control={control}
                  defaultValue=""
                  rules={{
                    required:
                      "Additional Person Room Only Week Days  is required",
                  }}
                  render={({ field }) => (
                    <Input
                      id="additionalPersonRoomOnlyWeekdays"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.additionalPersonRoomOnlyWeekdays}
                      {...field}
                    />
                  )}
                />
                <FormFeedback>
                  {errors.additionalPersonRoomOnlyWeekdays?.message}
                </FormFeedback>
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">
                  Additional Person Room Only Weekend
                </Label>

                <Controller
                  name="additionalPersonRoomOnlyWeekend"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Additional Person Room Only Weekend is required",
                  }}
                  render={({ field }) => (
                    <Input
                      id="additionalPersonRoomOnlyWeekend"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.additionalPersonRoomOnlyWeekend}
                      {...field}
                    />
                  )}
                />

                <FormFeedback>
                  {errors.additionalPersonRoomOnlyWeekend?.message}
                </FormFeedback>
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">Additional Person Breakfast </Label>

                <Controller
                  name="additionalPersonBreakfast"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Additional Person Breakfast is required",
                  }}
                  render={({ field }) => (
                    <Input
                      id="additionalPersonBreakfast"
                      type="text"
                      placeholder="Enter Tax Value "
                      invalid={!!errors.additionalPersonBreakfast}
                      {...field}
                    />
                  )}
                />

                <FormFeedback>
                  {errors.additionalPersonBreakfast?.message}
                </FormFeedback>
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="typeName">Additional Person All Meal </Label>

                <Controller
                  name="additionalPersonAllMeal"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Additional Person All Meal is required" }}
                  render={({ field }) => (
                    <Input
                      id="additionalPersonAllMeal"
                      type="text"
                      placeholder="Enter Additional Person All Meal "
                      invalid={!!errors.additionalPersonAllMeal}
                      {...field}
                    />
                  )}
                />

                <FormFeedback>
                  {errors.additionalPersonAllMeal?.message}
                </FormFeedback>
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
                          name={`specialDays.${index}.date`}
                          control={control}
                          rules={{ required: "Start Date & Time is required" }}
                          render={({ field }) => {
                            const { ref, ...rest } = field;
                            return (
                              <Flatpickr
                                {...rest}
                                id="start-date-time-picker"
                                className={`form-control ${
                                  errors?.specialDays?.[index]?.date
                                    ? "is-invalid"
                                    : ""
                                }`}
                                onChange={(date) => {
                                  const formatted = date?.[0]
                                    ?.toISOString()
                                    .split("T")[0];
                                  field.onChange(formatted);
                                }}
                                options={{ dateFormat: "Y-m-d" }}
                              />
                            );
                          }}
                        />
                        {errors?.specialDays?.[index]?.date && (
                          <FormFeedback>
                            {errors.specialDays[index].date.message}
                          </FormFeedback>
                        )}{" "}
                      </td>

                      <td>
                        <Controller
                          name={`specialDays.${index}.price`}
                          control={control}
                          rules={{
                            required: "Price is required",
                            pattern: {
                              value: /^\d+$/,
                              message: "Only numeric values are allowed",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Enter Price "
                              {...field}
                            />
                          )}
                        />
                        {errors.specialDays?.[index]?.price && (
                          <span className="text-danger">
                            {errors.specialDays[index].price.message}
                          </span>
                        )}
                      </td>

                      <td>
                        <Controller
                          name={`specialDays.${index}.description`}
                          control={control}
                          rules={{
                            required: "Description is required",
                            pattern: {
                              value: /^[A-Za-z]+$/,
                              message:
                                "Only alphabetic characters (A–Z) are allowed",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Description"
                              {...field}
                            />
                          )}
                        />
                        {errors.specialDays?.[index]?.description && (
                          <span className="text-danger">
                            {errors.specialDays[index].description.message}
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
                    append({ date: "", price: "", description: "" })
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
