import React, { useEffect, useState, useRef } from "react";
import { selectThemeColors } from "@utils";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  FormFeedback,
  Spinner,
  CardTitle,
  Table,
} from "reactstrap";
import Sidebar from "@components/sidebar";
import ViewClient from "./client_Information/ViewClient";
import { useForm, Controller, set } from "react-hook-form";
import Select from "react-select";
import { X, Plus, Hash } from "react-feather";

import useJwt from "@src/auth/jwt/useJwt";
import CreateVenue from "./createVenue/CreateVenue";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css"; // or 'material_blue.css', 'dark.css', etc.
import ClientDetaiils from "./client_Information";
import { useWatch } from "react-hook-form";
import moment from "moment"; // or use native Date methods if preferred
import { UncontrolledAlert } from "reactstrap";
import RoomManageModal from "./RoomManageModal";

const EventForm = ({ stepper, setAllEventData, listData }) => {
  const [EventType, setEventsType] = useState([]);
  const [venueType, setVenueType] = useState([]);
  const [vendor, setVendorType] = useState([]);
  const [additionOFroom, setAdditionOFroom] = useState();
  const toast = useRef(null);
  const [open, setOpen] = useState(false);
  const [errMsz, seterrMsz] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [selectMem, setSelectedMember] = useState({});
  const [eventRooms, setEventRooms] = useState([]);
  const [memberAppendData, setMemberAppendData] = useState({});
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventName: "",
      amount: "",
      eventDescription: "",
      eventEndDate: "",
      eventEndTime: "",
      eventName: "",
      eventStartDate: "",
      eventStartTime: "",
      
      eventTypeName: "",
    },
    shouldFocusError: false,
  });

  const isRecurring = watch("isRecurringEvent");
  const StaffAmount = watch("extraNoOfStaffAmount");
  // const FinalPrice = Number(venueType?.totalPrice)+Number(StaffAmount);
  console.log("eventrooms data", eventRooms);
  const baseAmountRef = useRef(0);

  useEffect(() => {
    if (listData?.uid && listData?.Rowdata) {
      const {
        eventEndDate,
        eventEndTime,
        eventStartTime,
        eventStartDate,
        ...rest
      } = listData.Rowdata;

      let endDateTime = null;
      let startDateTime = null;
      if (eventEndDate && eventEndTime) {
        endDateTime = new Date(`${eventEndDate}T${eventEndTime}`);
      }
      if (eventStartDate && eventStartTime) {
        startDateTime = new Date(`${eventStartDate}T${eventStartTime}`);
      }

      reset({
        ...rest,
        endDateTime,
        startDateTime,
      });
    }
  }, [listData]);

  const FetchEventsType = async () => {
    try {
      const res = await useJwt.getAllEventType();

      const eventTypeNames = res?.data?.content?.result?.map((x) => ({
        label: x.eventTypeName,
        value: x.uid,
      }));

      setEventsType(eventTypeNames);
    } catch (error) {
      console.error(error);
    }
  };

  const FetchVenueType = async () => {
    try {
      const { data } = await useJwt.getAllVenue();
      const { content } = data;

      const venueTypeNames = content?.result?.map((x) => ({
        label: x.venueName,
        value: x.uid,
        totalPrice: x.totalPrice,
      }));

      // const uniqueVenueType = Array.from(
      //   new Map(venueTypeNames.map(x=>[x.label,x])).values()
      // );

      setVenueType(venueTypeNames);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVendor = async () => {
    try {
      const { data } = await useJwt.getAllVendor();
      const { content } = data;
      const vendorTypeNames = content?.result?.map((x) => ({
        label: `${x.vendorName} ( ${x.vendorType?.typeName} )`,
        value: x.uid,
        vName: x.vendorName,
        vEmail: x.emailId,
        vtype: x.vendorType?.typeName,
        vPhone: `${x.countryCode} ${x.phoneNumber}`,
      }));

      setVendorType(vendorTypeNames);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    FetchEventsType();
    FetchVenueType();
    fetchVendor();
  }, []);

  const recurrenceOptions = [
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" },
  ];

  useEffect(() => {
    if (eventRooms?.roomSearchUid) {
      baseAmountRef.current = eventRooms?.bookedRoom?.reduce((total, x) => {
        return total + (Number(x?.fields?.baseAmount) || 0);
      }, 0);
    }
  }, [eventRooms?.roomSearchUid]);

  const onSubmit = async (data) => {
    seterrMsz("");

    let venuePayload;

    if (data.venue?.value !== "other") {
      venuePayload = { uid: data.venue.value };
    } else {
      venuePayload = {
        uid: null,
        venueName: data.venueName,
        capacity: data.capacity,
        price: data.price,
        venueType: data.venueType,
        noOfStaff: data.noOfStaff,
        staffPrice: data.staffPrice,
        totalPrice: data.totalPrice,
      };
    }

    let memberPayload;
    if (selectMem?.uid) {
      memberPayload = { uid: selectMem?.uid };
    } else {
      memberPayload = { ...memberAppendData };
    }

    const eventType =
      data.eventType?.value !== "other"
        ? {
            uid: data.eventType?.value,
          }
        : {
            uid: null,
            eventTypeName: data.eventTypeName,
          };

    const payload = {
      ...data,
      eventType,

      eventStartDate: data.startDateTime
        ? moment(data.startDateTime).format("YYYY-MM-DD")
        : null,
      eventEndDate: data.endDateTime
        ? moment(data.endDateTime).format("YYYY-MM-DD")
        : null,
      eventStartTime: data.startDateTime
        ? moment(data.startDateTime).format("HH:mm")
        : null,
      eventEndTime: data.endDateTime
        ? moment(data.endDateTime).format("HH:mm")
        : null,

      vendors: data.vendors?.map((v) => ({ uid: v.value })),
      venue: venuePayload,
      member: memberPayload,
      isRecurringEvent: data?.isRecurringEvent ? true : false,
      isExtraStaff: data?.isExtraStaff ? true : false,

      amount: basePrice,
      isRoomRequired: isRoomRequired,
      ...(isRoomRequired === true && {
        numberOfGuests: eventRooms?.bookedRoom["0"]?.numberOfGuests,
        roomBookings: [
          {
            roomSearch: {
              uid: eventRooms?.roomSearchUid,
            },
            checkInDate: eventRooms?.bookedRoom[0]?.checkInDate,
            checkOutDate: eventRooms?.bookedRoom[0]?.checkOutDate,
            numberOfGuests: eventRooms?.bookedRoom[0]?.numberOfGuests,
            finalAmount: baseAmountRef.current,
            subtotal: baseAmountRef.current,
            numberOfDays: eventRooms?.bookedRoom[0]?.totalNoOfDays,
          },
        ],
      }),
    };

    const allData = {
      ...data,
      ...payload,
      ...memberPayload,
      ...memberAppendData,
      ...selectMem,
      vendorN: {
        selectedVendors,
      },
      ...isVenue,
      eventTypes: seletctType?.label,
    };

    try {
      setLoading(true);

      const res = await useJwt.createEvent(payload);
      setAllEventData({
        ...allData,
        eventId: res?.data?.id,
        memberId: selectMem?.id,
        eventUid: res?.data?.uid,
      });

      toast.current.show({
        severity: "success",
        summary: "Event Created Successfully",
        detail: "Event Details Created Successfully.",
        life: 2000,
      });

      setTimeout(() => {
        stepper.next();
      }, 1500);

      // navigate("/preview", { state: data });
    } catch (error) {
      console.error(error);
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

  const seletctType = watch("eventType");
  const isExtraStaffRequired = watch("isExtraStaff");
  const isVenue = watch("venue");

  const [picker, setPicker] = useState(new Date());

  const selectedVendors = useWatch({
    control,
    name: "vendors",
  });

  const handleRemoveVendor = (index) => {
    const updated = [...selectedVendors];
    updated.splice(index, 1);
    setValue("vendors", updated); // react-hook-form
  };
  const roomPrice = Number(baseAmountRef.current) || 0;

  const extraNoOfStaffAmount = watch("extraNoOfStaffAmount") || 0;
  const staffPrice = Number(watch("staffPrice")) || 0;
  const price = Number(watch("price")) || 0;
  const basePrice = isVenue?.totalPrice || staffPrice + price;

  const venue = watch("venue");

  useEffect(() => {
    if (!isExtraStaffRequired && venue?.label !== "Other") {
      setValue("totalAmount", basePrice + roomPrice);
    }
  }, [isExtraStaffRequired, venue]);

  useEffect(() => {
    if (!isExtraStaffRequired && venue?.label === "Other") {
      const total = staffPrice + price + roomPrice;
      setValue("totalAmount", total);
    }
  }, [isExtraStaffRequired, venue, staffPrice, price]);

  useEffect(() => {
    if (isExtraStaffRequired && venue?.label !== "Other") {
      const FinalPrice =
        Number(basePrice) + Number(extraNoOfStaffAmount) + roomPrice;
      setValue("totalAmount", FinalPrice);
    }
  }, [isExtraStaffRequired, venue, basePrice, extraNoOfStaffAmount]);

  useEffect(() => {
    if (isExtraStaffRequired && venue?.label === "Other") {
      const Total =
        staffPrice + price + roomPrice + Number(extraNoOfStaffAmount);
      setValue("totalAmount", Total);
    }
  }, [isExtraStaffRequired, venue, staffPrice, extraNoOfStaffAmount, price]);

  //if staff price and venue price exist
  useEffect(() => {
    if (staffPrice && price) {
      setValue("totalPrice", Number(staffPrice) + Number(price));
    }
  }, [staffPrice, price, setValue]);

  useEffect(() => {
    if (eventRooms?.roomSearchUid) {
      const currentFinal = watch("totalAmount");
      console.log("currentFinal", currentFinal);

      setValue("totalAmount", currentFinal + baseAmountRef.current);
      console.log(currentFinal + baseAmountRef.current);
    }
  }, [setValue, eventRooms?.roomSearchUid]);

  const isRoomRequired = watch("isRoomRequired");
  return (
    <>
      <h4 className="mb-2">Event Information</h4>
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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6} className="mb-1">
            <Label for="eventName">Event Name</Label>
            <Controller
              name="eventName"
              control={control}
              rules={{ required: "Event Name is required" ,
                pattern:{
                          // "eventName": "Event name only contain alphabetic characters and space."

                    value: /^[a-zA-Z\s]+$/,
                    message: "Event name only contain alphabetic characters and space.",
                }
              }}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter event name"
                    invalid={!!errors.eventName}
                  />
                  {errors.eventName && (
                    <FormFeedback>{errors.eventName.message}</FormFeedback>
                  )}
                </>
              )}
            />
          </Col>

          {/* Event Type */}
          <Col md={6} className="mb-1">
            <Label for="eventType">Event Type</Label>
            <Controller
              name="eventType"
              control={control}
              rules={{ required: "Event Type Is Required" }}
              render={({ field }) => (
                <div>
                  <Select
                    {...field}
                    options={[...EventType, { label: "Other", value: "other" }]}
                    isClearable
                    className={`react-select ${
                      errors.eventType ? "is-invalid" : ""
                    }`}
                    classNamePrefix="select"
                    inputRef={field.ref}
                    onChange={(selected) => field.onChange(selected)}
                  />
                  {errors.eventType && (
                    <div className="invalid-feedback d-block">
                      {errors.eventType.message}
                    </div>
                  )}
                </div>
              )}
            />
          </Col>
        </Row>
        {seletctType?.label === "Other" && (
          <Col className="mb-1">
            <Label for="eventName">Other Event Type Name</Label>
            <Controller
              name="eventTypeName"
              control={control}
              rules={{ required: "Event Type Name is required" }}
              render={({ field }) => (
                <Input {...field} type="text" placeholder="Enter event name" />
              )}
            />
            {errors.eventTypeName && (
              <p className="invalid-feedback">{errors.eventTypeName.message}</p>
            )}
          </Col>
        )}

        {/* Event Theme */}
        {/* <Col className="mb-1">
          <Label for="eventTheme">Event Theme (Optional)</Label>
          <Controller
            name="eventTheme"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="e.g., Vintage, Beachside"
              />
            )}
          />
        </Col> */}

        <Row form>
          <Col md={6} className="mb-2">
            <Label className="form-label" for="start-date-time-picker">
              Start Date & Time
            </Label>
            <Controller
              name="startDateTime"
              control={control}
              rules={{ required: "Start Date & Time is required" }}
              render={({ field }) => (
                <Flatpickr
                  {...field}
                  id="start-date-time-picker"
                  data-enable-time
                  className={`form-control ${
                    errors.startDateTime ? "is-invalid" : ""
                  }`}
                  onChange={(date) => field.onChange(date[0])}
                />
              )}
            />
            {errors.startDateTime && (
              <div className="invalid-feedback">
                {errors.startDateTime.message}
              </div>
            )}
          </Col>

          <Col md={6} className="mb-2">
            <Label className="form-label" for="end-date-time-picker">
              End Date & Time
            </Label>
            <Controller
              name="endDateTime"
              control={control}
              rules={{ required: "End Date & Time is required" }}
              render={({ field }) => (
                <Flatpickr
                  {...field}
                  id="end-date-time-picker"
                  data-enable-time
                  className={`form-control ${
                    errors.endDateTime ? "is-invalid" : ""
                  }`}
                  onChange={(date) => field.onChange(date[0])}
                />
              )}
            />
            {errors.endDateTime && (
              <div className="invalid-feedback">
                {errors.endDateTime.message}
              </div>
            )}
          </Col>
        </Row>

        {/* Recurring Checkbox */}
        <Col check className="mb-2">
          <Label check>
            <Controller
              name="isRecurringEvent"
              control={control}
              render={({ field }) => <Input {...field} type="checkbox" />}
            />{" "}
            Recurring Event
          </Label>
        </Col>
        {/* Recurrence Pattern */}
        {isRecurring && (
          <Col className="mb-2">
            <Label for="recurrencePattern">Recurrence Pattern</Label>
            <Controller
              name="recurrencePattern"
              control={control}
              rules={{
                required:
                  "Recurrence pattern is required when event is recurring",
              }}
              render={({ field }) => (
                <div>
                  <Select
                    {...field}
                    options={recurrenceOptions}
                    className={`react-select ${
                      errors.recurrencePattern ? "is-invalid" : ""
                    }`}
                    classNamePrefix="select"
                    placeholder="Select Pattern"
                    value={recurrenceOptions.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                  {errors.recurrenceOptions && (
                    <FormFeedback>
                      {errors.recurrenceOptions.message}
                    </FormFeedback>
                  )}
                </div>
              )}
            />
          </Col>
        )}

        <Col check className="mb-2">
          <Label check>
            <Controller
              name="isExtraStaff"
              control={control}
              render={({ field }) => <Input {...field} type="checkbox" />}
            />{" "}
            Is Extra Staff Required
          </Label>
        </Col>
        {isExtraStaffRequired && (
          <>
            <Row>
              <Col sm="6" className="mb-1">
                <Label for="extraNoOfStaff">Extra No of Staff</Label>
                <Controller
                  name="extraNoOfStaff"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Extra No of Staff is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: " Extra No of Staffe must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="extraNoOfStaff"
                      type="number"
                      placeholder="Enter Extra No of Staff"
                      invalid={!!errors.extraNoOfStaff}
                      {...field}
                    />
                  )}
                />
                {errors.extraNoOfStaff && (
                  <FormFeedback>{errors.extraNoOfStaff.message}</FormFeedback>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label for="extraNoOfStaffAmount">Extra Staff Amount</Label>
                <Controller
                  name="extraNoOfStaffAmount"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Extra staff Amount is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: " Extra staff Amount  must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="extraNoOfStaffAmount"
                      type="number"
                      placeholder="Enter Extra staff Amount "
                      invalid={!!errors.extraNoOfStaffAmount}
                      {...field}
                    />
                  )}
                />
                {errors.extraNoOfStaffAmount && (
                  <FormFeedback>
                    {errors.extraNoOfStaffAmount.message}
                  </FormFeedback>
                )}
              </Col>
            </Row>
          </>
        )}

        <Col check className="mb-2">
          <Label check>
            <Controller
              name="isRoomRequired"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    type="checkbox"
                    disabled={eventRooms?.bookedRoom?.length > 0}
                  />
                );
              }}
            />{" "}
            Is Room Required
          </Label>
        </Col>

        {watch("isRoomRequired") && eventRooms?.roomSearchUid && (
          <Col check className="mb-2">
            <Card>
              <CardTitle tag="h5" className="p-2 border-bottom mb-0">
                Your Booked Room
              </CardTitle>
              <CardBody className="p-1">
                <Table bordered responsive hover>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Room No</th>
                      <th>Room Type</th>
                      <th>Service Package</th>
                      <th>Final Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventRooms?.bookedRoom?.map((x, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{x.roomNumber}</td>
                        <td>{x?.roomTypeName}</td>
                        <td>{x?.fields?.serviceType}</td>
                        <td>${x?.fields?.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        )}

        {/* Event Description */}
        <Col className="mb-2">
          <Label for="eventDescription">Event Description / Notes</Label>
          <Controller
            name="eventDescription"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="textarea"
                placeholder="Add any notes or description"
              />
            )}
          />
        </Col>

        <Col className="mb-1">
          <Label for="venue">Venue Name</Label>
          <Controller
            name="venue"
            control={control}
            rules={{ required: "Venue Name is required" }} // <-- add this if required
            render={({ field }) => (
              <div>
                <Select
                  {...field}
                  options={[...venueType, { label: "Other", value: "other" }]}
                  isClearable
                  className={`react-select ${errors.venue ? "is-invalid" : ""}`}
                  classNamePrefix="select"
                  onChange={(selected) => field.onChange(selected)}
                />
                {errors.venue && (
                  <div className="invalid-feedback d-block">
                    {errors.venue.message}
                  </div>
                )}
              </div>
            )}
          />
        </Col>

        {isVenue?.label === "Other" && (
          <>
            {/* <CreateVenue /> */}
            <Row>
              <Col sm="6" className="mb-1">
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
                  <FormFeedback>{errors.venueName.message}</FormFeedback>
                )}
              </Col>

              {/* Capacity */}
              <Col sm="6" className="mb-1">
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
                  <FormFeedback>{errors.capacity.message}</FormFeedback>
                )}
              </Col>
            </Row>
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
                    />
                  )}
                />
                {errors.address && (
                  <FormFeedback>{errors.address.message}</FormFeedback>
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
                    />
                  )}
                />
                {errors.city && (
                  <FormFeedback>{errors.city.message}</FormFeedback>
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
                    />
                  )}
                />

                {errors.state && (
                  <FormFeedback>{errors.state.message}</FormFeedback>
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
                    />
                  )}
                />
                {errors.country && (
                  <FormFeedback>{errors.country.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              {" "}
              <Col sm="6" className="mb-1">
                <Label for="postCode">Postal Code</Label>
                <Controller
                  name="postCode"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "postCode is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "postCode must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="postCode"
                      type="number"
                      placeholder="Enter venue postCode"
                      invalid={!!errors.postCode}
                      {...field}
                    />
                  )}
                />
                {errors.postCode && (
                  <FormFeedback>{errors.postCode.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
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
                      <option value="Both">Both</option>
                    </Input>
                  )}
                />
                {errors.venueType && (
                  <FormFeedback>{errors.venueType.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              {/* Venue Type */}

              <Col sm="6" className="mb-1">
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
                  <FormFeedback>{errors.price.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
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
                  <FormFeedback>{errors.noOfStaff.message}</FormFeedback>
                )}
              </Col>
            </Row>

            <Row>
              <Col sm="6" className="mb-1">
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
                {errors.staffPrice && (
                  <FormFeedback>{errors.staffPrice.message}</FormFeedback>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label for="totalPrice">Total Venue Price</Label>
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
                  <FormFeedback>{errors.totalPrice.message}</FormFeedback>
                )}
              </Col>
            </Row>
          </>
        )}

        <Col className="mb-1">
          <Label className="form-label">Vendor Name</Label>
          <Controller
            name="vendors"
            control={control}
            rules={{ required: "Vendors  Is Required" }}
            render={({ field }) => (
              <div>
                <Select
                  {...field}
                  isClearable={false}
                  theme={selectThemeColors}
                  isMulti
                  options={vendor}
                  className={`react-select ${
                    errors.vendors ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  onChange={(val) => field.onChange(val)}
                  // onChange={(val) => field.onChange(val.map(v => ({ uid: v.uid, vName: v.vName, vEmail: v.vEmail, vPhone: v.vPhone, vtype: v.vtype })))} // important for multi-select
                />

                {errors.vendors && (
                  <div className="invalid-feedback d-block">
                    {errors.vendors.message}
                  </div>
                )}
              </div>
            )}
          />
        </Col>

        {selectedVendors && selectedVendors.length > 0 && (
          <Card className="mt-3">
            <CardBody className="py-2">
              <h6 className="mb-2">Selected Vendors</h6>
              {selectedVendors?.map((xvendor, idx) => (
                <div
                  key={idx}
                  className="d-flex align-items-center justify-content-between px-2 py-1 mb-1 rounded border bg-light small"
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: "1.2",
                    cursor: "pointer",
                  }}
                >
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span>
                      <strong>#{idx + 1}</strong>
                    </span>
                    <span>
                      <strong>Name:</strong> {xvendor?.vName}
                    </span>
                    <span>
                      <strong>Email:</strong> {xvendor?.vEmail}
                    </span>
                    <span>
                      <strong>Phone:</strong> {xvendor?.vPhone}
                    </span>
                    <span>
                      <strong>Type:</strong> {xvendor?.vtype}
                    </span>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemoveVendor(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </CardBody>
          </Card>
        )}

        <ClientDetaiils
          
          setOpen={setOpen}
          setSelectedMember={setSelectedMember}
          setMemberAppendData={setMemberAppendData}
          memberAppendData={memberAppendData}
        />

        <Col sm="12" className="mb-1">
          <Label for="totalPrice">Total Cost</Label>
          <Controller
            name="totalAmount"
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
                id="totalAmount"
                type="number"
                placeholder="Enter Total price"
                invalid={!!errors.totalAmount}
                {...field}
              />
            )}
          />
          {errors.totalAmount && (
            <FormFeedback>{errors.totalAmount.message}</FormFeedback>
          )}
        </Col>
        <div className="d-flex justify-content-end">
          <Button disabled={loading} color="primary" type="submit">
            {loading ? (
              <>
                <span>Loading.. </span>
                <Spinner size="sm" />{" "}
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Form>

      {watch("isRoomRequired") && (
        <RoomManageModal
          isRoomRequired={isRoomRequired}
          setShowModal={setShowModal}
          showModal={showModal}
          setEventRooms={setEventRooms}
        />
      )}
    </>
  );
};

export default EventForm;
