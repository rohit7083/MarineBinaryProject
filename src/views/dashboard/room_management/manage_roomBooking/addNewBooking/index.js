import { Fragment, useEffect, useRef, useState } from "react";
// React Hook Form for form state management and validation.
import { Controller, useForm } from "react-hook-form";
// React Router hooks for navigation and location state.
import { useLocation, useNavigate } from "react-router-dom";
// PrimeReact Toast for notifications.
import { Toast } from "primereact/toast";
// PrimeReact and Flatpickr styles for UI consistency.
import "flatpickr/dist/themes/airbnb.css";
import "flatpickr/dist/themes/material_blue.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
// Flatpickr date picker component.
import Flatpickr from "react-flatpickr";
// Reactstrap components for layout and form controls.
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
} from "reactstrap";
// Custom JWT hook for API calls.
import useJwt from "@src/auth/jwt/useJwt";
// SearchRoom component to display available rooms.
import SearchRoom from "../addNewBooking/SearchRooms";
// Feather icon for back navigation.
import { ArrowLeft } from "react-feather";

function AddVTypes({ isRoomRequired, showModal, setShowModal, setEventRooms }) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const extraRoomMode = location?.state?.mode;
  const uidOfEvent = location?.state?.uidOfEvent;

  const rowData = location.state?.row;
  const uid = rowData?.uid;
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [searchedValue, setSearcedValue] = useState(null);
  const [allRooms, setAllrooms] = useState([]);
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");

  useEffect(() => {
    if (uid && rowData) {
      reset({
        checkInDate: rowData.checkInDate || "",
        checkOutDate: rowData.checkOutDate || "",
        numberOfGuests: rowData.numberOfGuests || "",
      });
    }
  }, [uid, rowData, reset]);

  useEffect(() => {
    if (!checkInDate) return;
    const [year, month, day] = checkInDate.split("-").map(Number);
    const inDate = new Date(year, month - 1, day);
    const outDateMin = new Date(inDate);
    outDateMin.setDate(inDate.getDate() + 1);
    const formattedOutMin = `${outDateMin.getFullYear()}-${String(
      outDateMin.getMonth() + 1
    ).padStart(2, "0")}-${String(outDateMin.getDate()).padStart(2, "0")}`;
    if (!checkOutDate || checkOutDate <= checkInDate) {
      setValue("checkOutDate", formattedOutMin);
    }
  }, [checkInDate, checkOutDate, setValue]);

  const onSubmit = async (data) => {
    console.log("data", data);

    try {
      setLoading(true);

      const res = await useJwt.SearchRoom(data);
      const AllroomUnits = res?.data?.flatMap(
        (x) =>
          x?.roomUnits?.map(({ roomNumber, uid, available }) => ({
            roomNumber,
            value: uid,
            available: available,
            additionalPersonAllMeal: x?.additionalPersonAllMeal,
            additionalPersonBreakfast: x?.additionalPersonBreakfast,
            additionalPersonRoomOnlyWeekdays:
              x?.additionalPersonRoomOnlyWeekdays,
            additionalPersonRoomOnlyWeekend: x?.additionalPersonRoomOnlyWeekend,
            onlyRoomWeekdaysPrice: x?.onlyRoomWeekdaysPrice,
            onlyRoomWeekendPrice: x?.onlyRoomWeekendPrice,
            twoPeopleAllMealPrice: x?.twoPeopleAllMealPrice,
            twoPeopleBreakfastPrice: x?.twoPeopleBreakfastPrice,
            grandTotalPrice: x?.grandTotalPrice,
            totalNoOfDays: x?.totalNoOfDays,
            roomAndBreakFast: x?.roomAndBreakFast,
            roomAndAllMeal: x?.roomAndAllMeal,
            peopleCapacity: x?.roomType?.peopleCapacity,
            roomTypeName: x?.roomType?.roomTypeName,
            taxValue: x?.roomType?.taxValue,
            grandTotalTaxAmount: x?.grandTotalTaxAmount,
            roomAndBreakFastTaxAmount: x?.roomAndBreakFastTaxAmount,
            roomAndAllMealTaxAmount: x?.roomAndAllMealTaxAmount,
            weekdayCount: x?.weekdayCount,
            weekendCount: x?.weekendCount,
            specialDays: x?.specialDays?.price,
            ...data,
          })) || []
      );
      setAllrooms(AllroomUnits);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`
      : "";

  const getCheckOutMinDate = () => {
    if (!checkInDate) return "today";
    const [year, month, day] = checkInDate.split("-").map(Number);
    const inDate = new Date(year, month - 1, day);
    inDate.setDate(inDate.getDate() + 1);
    return formatDate(inDate);
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
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
                onClick={() => {
                  if (isRoomRequired) {
                    setShowModal(false); // Close the modal if room is required
                  } else {
                    navigate(-1); // Otherwise, navigate back
                  }
                }}
              />{" "}
              Check Available Rooms
            </CardText>
          </CardTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{}}>
              <FormGroup row>
                <Col sm="4" className="mb-1">
                  <Label htmlFor="checkInDate">Check In Date</Label>
                  <Controller
                    name="checkInDate"
                    control={control}
                    rules={{ required: "Check-in date is required" }}
                    render={({ field }) => (
                      <>
                        <Flatpickr
                          id="checkInDate"
                          className={`form-control ${
                            errors.checkInDate ? "is-invalid" : ""
                          }`}
                          options={{
                            altInput: true,
                            altFormat: "Y-m-d",
                            dateFormat: "Y-m-d",
                            minDate: "today",
                          }}
                          value={field.value}
                          onChange={(date) => {
                            const formatted = date?.[0]
                              ? `${date[0].getFullYear()}-${String(
                                  date[0].getMonth() + 1
                                ).padStart(2, "0")}-${String(
                                  date[0].getDate()
                                ).padStart(2, "0")}`
                              : "";
                            field.onChange(formatted);
                          }}
                        />
                        {errors.checkInDate && (
                          <FormFeedback>
                            {errors.checkInDate.message}
                          </FormFeedback>
                        )}
                      </>
                    )}
                  />
                </Col>
                <Col sm="4" className="mb-1">
                  <Label htmlFor="checkOutDate">Check Out Date</Label>
                  <Controller
                    name="checkOutDate"
                    control={control}
                    rules={{ required: "Check-out date is required" }}
                    render={({ field }) => (
                      <>
                        <Flatpickr
                          id="checkOutDate"
                          className={`form-control ${
                            errors.checkOutDate ? "is-invalid" : ""
                          }`}
                          options={{
                            altInput: true,
                            altFormat: "Y-m-d",
                            dateFormat: "Y-m-d",
                            minDate: getCheckOutMinDate(),
                          }}
                          value={field.value}
                          onChange={(date) => {
                            const formatted = date?.[0]
                              ? `${date[0].getFullYear()}-${String(
                                  date[0].getMonth() + 1
                                ).padStart(2, "0")}-${String(
                                  date[0].getDate()
                                ).padStart(2, "0")}`
                              : "";
                            field.onChange(formatted);
                          }}
                        />
                        {errors.checkOutDate && (
                          <FormFeedback>
                            {errors.checkOutDate.message}
                          </FormFeedback>
                        )}
                      </>
                    )}
                  />
                </Col>
                <Col sm="4">
                  <Label htmlFor="numberOfGuests">Number of Guests</Label>
                  <Controller
                    name="numberOfGuests"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Number of guests is required" }}
                    render={({ field }) => (
                      <Input
                        id="numberOfGuests"
                        type="number"
                        placeholder="Enter Number of guests"
                        invalid={!!errors.numberOfGuests}
                        {...field}
                        min={1}
                      />
                    )}
                  />
                  {errors.numberOfGuests && (
                    <FormFeedback>{errors.numberOfGuests.message}</FormFeedback>
                  )}
                </Col>
              </FormGroup>
              <div className="d-flex justify-content-end">
                <Button type="submit" disabled={loading} color="primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 26 26"
                    width="1em"
                    height="1em"
                    className="me-1"
                  >
                    <path
                      fill="currentColor"
                      d="M10 .188A9.81 9.81 0 0 0 .187 10A9.81 9.81 0 0 0 10 19.813c2.29 0 4.393-.811 6.063-2.125l.875.875a1.845 1.845 0 0 0 .343 2.156l4.594 4.625c.713.714 1.88.714 2.594 0l.875-.875a1.84 1.84 0 0 0 0-2.594l-4.625-4.594a1.82 1.82 0 0 0-2.157-.312l-.875-.875A9.812 9.812 0 0 0 10 .188M10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16M4.937 7.469a5.45 5.45 0 0 0-.812 2.875a5.46 5.46 0 0 0 5.469 5.469a5.5 5.5 0 0 0 3.156-1a7 7 0 0 1-.75.03a7.045 7.045 0 0 1-7.063-7.062c0-.104-.005-.208 0-.312"
                    ></path>
                  </svg>
                  {loading ? (
                    <>
                      <span>Searching.. </span>
                      <Spinner size="sm" />{" "}
                    </>
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
      {/* <hr style={{color:'#6E6B7B'}}></hr> */}
      {/* <hr></hr> */}

      <SearchRoom
        uidOfEvent={uidOfEvent}
        extraRoomMode={extraRoomMode}
        showModal={showModal}
        setShowModal={setShowModal}
        setEventRooms={setEventRooms}
        isRoomRequired={isRoomRequired}
        allRooms={allRooms}
        searchField={searchedValue}
      />
    </Fragment>
  );
}

export default AddVTypes;
