import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft, Trash2 } from "react-feather";
import Flatpickr from "react-flatpickr";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
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
  Row,
  Spinner,
  Table,
  UncontrolledAlert,
} from "reactstrap";
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
  const [roomtyp, setRoomTypeName] = useState([]);
  const [errorMessage, setErrorMsz] = useState("");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specialDays",
  });

  // Set initial form values if editing

  // Fetch room types
  useEffect(() => {
    (async () => {
      try {
        const res = await useJwt.getAllRoomTypes();
        const result = res?.data?.content?.result || [];
        setRoomTypeName(
          result.map((x) => ({ label: x.roomTypeName, value: x.uid }))
        );
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  useEffect(() => {
    if (uid && rowData) {
      const selectedRoomType = roomtyp?.find(
        (option) => option.value === rowData?.roomType?.uid
      );

      // const seletedRoomNumber=

      reset;
      reset({
        ...rowData,
        numberOfRooms: rowData?.numberOfRooms || [],
        roomType: selectedRoomType || null,
      });
    }
  }, [uid, rowData, roomtyp, reset]);

  // Room count logic
  const noOfRooms = parseInt(watch("numberOfRooms")) || 0;

  // Watchers
  const watchroomUnits = watch("numberOfRooms");

  // Submit handler
  const onSubmit = async (data) => {
    setErrorMsz("");

    const payload = {
      ...data,
      numberOfRooms: watchroomUnits,
      roomUnits: Array.from({ length: watchroomUnits }, (_, i) => ({
        roomNumber: data.roomUnits?.[i]?.roomNumber || "",
        active: true,
      })),
      roomType: { uid: data?.roomType?.value },
    };
    try {
      setLoading(true);
      let res;
      if (uid) {
        res = await useJwt.UpdateRooms(uid, payload);
      } else {
        res = await useJwt.CreateRoom(payload);
      }
      if (res?.status === 200 || res?.status === 201) {
        toast.current.show({
          severity: "success",
          summary: uid ? "Updated Successfully" : "Created Successfully",
          detail: uid
            ? "Room updated Successfully."
            : "Room created Successfully.",
          life: 2000,
        });
        setTimeout(() => navigate("/room_details"), 2000);
        reset();
      }
    } catch (error) {
      setErrorMsz(error?.response?.data?.content || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log({ noOfRooms });
  }, [noOfRooms]);

  return (
    <Fragment>
      <Toast ref={toast} />
      <Card>
        <CardBody>
          <CardTitle>
            <CardText>
              <ArrowLeft
                style={{ cursor: "pointer", transition: "color 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
                onClick={() => window.history.back()}
              />{" "}
              {uid ? "Update " : "Create "}Room Details
            </CardText>
          </CardTitle>
          <Col sm="12">
            {errorMessage && (
              <UncontrolledAlert color="danger">
                <div className="alert-body">
                  <span className="text-danger fw-bold">
                    <strong>Error ! </strong>
                    {errorMessage}
                  </span>
                </div>
              </UncontrolledAlert>
            )}
          </Col>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="12" className="mb-1">
                <Label>Room Type</Label>
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
                <Label>Number of Rooms</Label>
                <Controller
                  name="numberOfRooms"
                  control={control}
                  rules={{
                    required: "Number of Rooms is required",
                    pattern: {
                      value: /^\d+$/,
                      message: "Only numeric values are allowed.",
                    },
                    min: { value: 1, message: "Minimum value is 1" },
                  }}
                  render={({ field }) => (
                    <Input
                      id="numberOfRooms"
                      type="text"
                      placeholder="Enter Number of Rooms"
                      invalid={!!errors.numberOfRooms}
                      {...field}
                      onChange={(e) => {
                        // Remove non-numeric characters
                        let val = e.target.value.replace(/[^0-9]/g, "");

                        // Limit maximum to 20
                        if (+val > 20) val = "20";

                        field.onChange(val);
                      }}
                    />
                  )}
                />
                <FormFeedback>{errors.numberOfRooms?.message}</FormFeedback>
              </Col>

              {/* {noOfRooms
                ? Array.from({ length: noOfRooms })
                    .fill(0)
                    .map((_, index) => (
                      <Col sm="6" key={index} className="mb-2">
                       
                        <Card className={"border"}>
                         
                          <CardHeader>Room {index + 1}</CardHeader>
                          <CardBody>
                            <Controller
                              control={control}
                              name={`roomUnits.${index}.roomNumber`}
                              render={({ field, fieldState }) => (
                                <>
                                  <Input {...field} />
                                </>
                              )}
                            />
                          </CardBody>
                       
                        </Card>
                       
                      </Col>
                    ))
                : null} */}
              <Row>
                {noOfRooms
                  ? Array.from({ length: noOfRooms }).map((_, index) => (
                      <Col sm="6" key={index} className="mb-2">
                        <Card className="border-0 bg-light p-2">
                          <div className="d-flex align-items-center mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              width="16"
                              height="16"
                              className="me-1 text-secondary"
                            >
                              <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M1 10L8 3l7 7M3 8v6h10V8M8 14v-3"
                              />
                            </svg>
                            <small className="text-muted">
                              Room {index + 1}
                            </small>
                          </div>

                          <Controller
                            control={control}
                            name={`roomUnits.${index}.roomNumber`}
                            render={({ field, fieldState }) => (
                              <Input
                                {...field}
                                size="sm"
                                placeholder="Room No."
                                className="form-control-sm"
                                invalid={fieldState.invalid}
                                onChange={(e) => {
                                  // Allow only numbers, dash, and space
                                  const validValue = e.target.value.replace(
                                    /[^0-9A-Za-z\- ]/g,
                                    ""
                                  );
                                  field.onChange(validValue);
                                }}
                              />
                            )}
                          />
                        </Card>
                      </Col>
                    ))
                  : null}
              </Row>

              {[
                {
                  name: "onlyRoomWeekdaysPrice",
                  label: "Only Room Weekdays Price",
                },
                {
                  name: "onlyRoomWeekendPrice",
                  label: "Only Room Weekend Price",
                },
                {
                  name: "twoPeopleBreakfastPrice",
                  label: "2 People Breakfast Price",
                },
                {
                  name: "twoPeopleAllMealPrice",
                  label: "2 People All Meal Price",
                },
                {
                  name: "additionalPersonRoomOnlyWeekdays",
                  label: "Additional Person Room Only Week Days",
                },
                {
                  name: "additionalPersonRoomOnlyWeekend",
                  label: "Additional Person Room Only Weekend",
                },
                {
                  name: "additionalPersonBreakfast",
                  label: "Additional Person Breakfast",
                },
                {
                  name: "additionalPersonAllMeal",
                  label: "Additional Person All Meal",
                },
              ].map(({ name, label }) => (
                <Col sm="6" className="mb-1" key={name}>
                  <Label>{label}</Label>
                  <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    rules={{
                      required: `${label} is required`,
                      pattern:
                        name === "onlyRoomWeekendPrice"
                          ? undefined
                          : {
                              value: /^\d+$/,
                              message: "Only numeric values are allowed.",
                            },
                    }}
                    render={({ field }) => (
                      <Input
                        id={name}
                        type="text"
                        placeholder={`Enter ${label}`}
                        invalid={!!errors[name]}
                        {...field}
                        onChange={(e) => {
                          // Remove non-numeric characters
                          let val = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(val);
                        }}
                      />
                    )}
                  />
                  <FormFeedback>{errors[name]?.message}</FormFeedback>
                </Col>
              ))}
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
                                className={`form-control ${
                                  errors?.specialDays?.[index]?.date
                                    ? "is-invalid"
                                    : ""
                                }`}
                                onChange={(date) =>
                                  field.onChange(
                                    date?.[0]?.toISOString().split("T")[0]
                                  )
                                }
                                options={{ dateFormat: "Y-m-d" }}
                              />
                            );
                          }}
                        />
                        {errors?.specialDays?.[index]?.date && (
                          <FormFeedback>
                            {errors.specialDays[index].date.message}
                          </FormFeedback>
                        )}
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
                              placeholder="Enter Price"
                              {...field}
                              onChange={(e) => {
                                // Remove non-numeric characters
                                let val = e.target.value.replace(/[^0-9]/g, "");

                                field.onChange(val);
                              }}
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
                            // pattern: {
                            //   value: /^[A-Za-z\s]+$/,
                            //   message:
                            //     "Only alphabetic characters (A–Z) are allowed",
                            // },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Description"
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
