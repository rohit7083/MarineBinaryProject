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
  Spinner,
} from "reactstrap";
import Sidebar from "@components/sidebar";
import ViewClient from "./client_Information/ViewClient";
import { useForm, Controller } from "react-hook-form";
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

const EventForm = ({ stepper, setAllEventData }) => {
  const [EventType, setEventsType] = useState([]);
  const [venueType, setVenueType] = useState([]);
  const [vendor, setVendorType] = useState([]);
  const toast = useRef(null);
  const [open, setOpen] = useState(false);
  const [errMsz, seterrMsz] = useState("");
  const [loading, setLoading] = useState(false);

  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [selectMem, setSelectedMember] = useState({});
  const [memberAppendData, setMemberAppendData] = useState({});
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventName: "gina bday",
    },
  });

  const isRecurring = watch("isRecurringEvent");
  const StaffAmount = watch("extraNoOfStaffAmount");
  // const FinalPrice = Number(venueType?.totalPrice)+Number(StaffAmount);
  // console.log("FinalPrice", venueType);

  const FetchEventsType = async () => {
    try {
      const res = await useJwt.getAllEventType();
      console.log(res?.data?.content?.result);

      const eventTypeNames = res?.data?.content?.result?.map((x) => ({
        label: x.eventTypeName,
        value: x.uid,
      }));

      setEventsType(eventTypeNames);
    } catch (error) {
      console.log(error);
    }
  };

  const FetchVenueType = async () => {
    try {
      const { data } = await useJwt.getAllVenue();
      const { content } = data;
      console.log("content2", content);

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
      console.log(error);
    }
  };

  const fetchVendor = async () => {
    try {
      const { data } = await useJwt.getAllVendor();
      const { content } = data;
      console.log("getAllVendor", content);
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
      console.log(error);
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

  console.log("memberAppendData from event", memberAppendData);

  const onSubmit = async (data) => {
    // {
    //   {
    //     debugger;
    //   }
    // }
    seterrMsz("");

    let venuePayload;

    if (data.venue?.value !== "other") {
      // If not "other", send only the venue UID
      venuePayload = { uid: data.venue.value };
    } else {
      // If "other", send detailed venue info (replace with your actual data)
      venuePayload = {
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

    const payload = {
      ...data,
      // eventType: data.eventType?.value,
      eventType: data.eventType ? { uid: data.eventType.value } : null,

      eventStartDate: startDateTime
        ? moment(startDateTime).format("YYYY-MM-DD")
        : null,
      eventEndDate: endDateTime
        ? moment(endDateTime).format("YYYY-MM-DD")
        : null,
      eventStartTime: startDateTime
        ? moment(startDateTime).format("HH:mm")
        : null,
      eventEndTime: endDateTime ? moment(endDateTime).format("HH:mm") : null,
      vendors: data.vendors?.map((v) => ({ uid: v.value })),
      venue: venuePayload,
      member: memberPayload,
      isRecurringEvent: data?.isRecurringEvent ? true : false,
      isExtraStaff: data?.isExtraStaff ? true : false,
      amount: basePrice,
    };

    const allData = {
      ...data,
      ...payload,
      ...memberPayload,
      ...memberAppendData,
    };

    try {
      setLoading(true);

      const res = await useJwt.createEvent(payload);
      console.log("res", res);
      // console.log("payload",payload);

      toast.current.show({
        severity: "success",
        summary: "Event Created Successfully",
        detail: "Event Details Created Successfully.",
        life: 2000,
      });

      setTimeout(() => {
        stepper.next();
      }, 1500);

      setAllEventData(allData);
      // navigate("/preview", { state: data });
    } catch (error) {
      console.log(error);
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

  const extraNoOfStaffAmount = watch("extraNoOfStaffAmount") || 0;
  const basePrice = isVenue?.totalPrice || 0;

  const staffPrice = Number(watch("staffPrice")) || 0;
  const price = Number(watch("price")) || 0;

  const venue = watch("venue");

  useEffect(() => {
    if (!isExtraStaffRequired && venue?.label !== "Other") {
      setValue("totalAmount", basePrice);
    }
  }, [isExtraStaffRequired, venue]);

  useEffect(() => {
    if (!isExtraStaffRequired && venue?.label === "Other") {
      const total = staffPrice + price;
      setValue("totalAmount", total);
    }
  }, [isExtraStaffRequired, venue, staffPrice, price]);

  useEffect(() => {
    if (isExtraStaffRequired && venue?.label !== "Other") {
      const FinalPrice = Number(basePrice) + Number(extraNoOfStaffAmount);
      setValue("totalAmount", FinalPrice);
    }
  }, [isExtraStaffRequired, venue, basePrice, extraNoOfStaffAmount]);

  useEffect(() => {
    if (isExtraStaffRequired && venue?.label === "Other") {
      const Total = staffPrice + price + Number(extraNoOfStaffAmount);
      setValue("totalAmount", Total);
    }
  }, [isExtraStaffRequired, venue, staffPrice, extraNoOfStaffAmount, price]);

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
        {/* Event Name */}
        <Row>
          <Col md={6} className="mb-1">
            <Label for="eventName">Event Name</Label>
            <Controller
              name="eventName"
              control={control}
              rules={{ required: "Event Name is required" }}
              render={({ field }) => (
                <Input {...field} type="text" placeholder="Enter event name" />
              )}
            />
            {errors.eventName && (
              <p className="text-danger">{errors.eventName.message}</p>
            )}
          </Col>

          {/* Event Type */}
          <Col md={6} className="mb-1">
            <Label for="eventType">Event Type</Label>
            <Controller
              name="eventType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[...EventType, { label: "Other", value: "other" }]}
                  isClearable
                  className="react-select"
                  classNamePrefix="select"
                />
              )}
            />
            {errors.eventType && (
              <p className="text-danger">{errors.eventType.message}</p>
            )}
          </Col>
        </Row>
        {seletctType?.label === "Other" && (
          <Col className="mb-1">
            <Label for="eventName">Other Event Type Name</Label>
            <Controller
              name="eventTypeName"
              control={control}
              rules={{ required: "Event Name is required" }}
              render={({ field }) => (
                <Input {...field} type="text" placeholder="Enter event name" />
              )}
            />
            {errors.eventTypeName && (
              <p className="text-danger">{errors.eventTypeName.message}</p>
            )}
          </Col>
        )}

        {/* Event Theme */}
        <Col className="mb-1">
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
        </Col>

        <Row form>
          <Col md={6} className="mb-2">
            <Label className="form-label" for="start-date-time-picker">
              Start Date & Time
            </Label>
            <Flatpickr
              value={startDateTime}
              data-enable-time
              id="start-date-time-picker"
              className="form-control"
              onChange={(date) => setStartDateTime(date[0])}
            />
          </Col>
          <Col md={6} className="mb-2">
            <Label className="form-label" for="end-date-time-picker">
              End Date & Time
            </Label>
            <Flatpickr
              value={endDateTime}
              data-enable-time
              id="end-date-time-picker"
              className="form-control"
              onChange={(date) => setEndDateTime(date[0])}
            />
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
                <Select
                  {...field}
                  options={recurrenceOptions}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Pattern"
                  value={recurrenceOptions.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(selected) => field.onChange(selected?.value)}
                />
              )}
            />
            {errors.recurrencePattern && (
              <p className="text-danger">{errors.recurrencePattern.message}</p>
            )}
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
                  <p className="text-danger">{errors.extraNoOfStaff.message}</p>
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
                      invalid={!!errors.price}
                      {...field}
                    />
                  )}
                />
                {errors.extraNoOfStaffAmount && (
                  <p className="text-danger">
                    {errors.extraNoOfStaffAmount.message}
                  </p>
                )}
              </Col>
            </Row>
          </>
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
            render={({ field }) => (
              <Select
                {...field}
                options={[...venueType, { label: "Other", value: "other" }]}
                isClearable
                className="react-select"
                classNamePrefix="select"
              />
            )}
          />
          {errors.venue && (
            <p className="text-danger">{errors.venue.message}</p>
          )}
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
                  <p className="text-danger">{errors.venueName.message}</p>
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
                  <p className="text-danger">{errors.capacity.message}</p>
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
                  <p className="text-danger">{errors.postCode.message}</p>
                )}
              </Col>
            </Row>
            <Row>
              {/* Venue Type */}
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
                      <option value="Hybrid">Hybrid</option>
                    </Input>
                  )}
                />
                {errors.venueType && (
                  <p className="text-danger">{errors.venueType.message}</p>
                )}
              </Col>

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
                  <p className="text-danger">{errors.price.message}</p>
                )}
              </Col>
            </Row>

            <Row>
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
                  <p className="text-danger">{errors.noOfStaff.message}</p>
                )}
              </Col>
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
                {errors.price && (
                  <p className="text-danger">{errors.price.message}</p>
                )}
              </Col>
            </Row>

            {/* <Col sm="12" className="mb-1">
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
            </Col> */}
          </>
        )}

        <Col className="mb-1">
          <Label className="form-label">Vendor Name</Label>
          <Controller
            name="vendors"
            control={control}
            // defaultValue={[colorOptions[2], colorOptions[3]]}
            render={({ field }) => (
              <Select
                {...field}
                isClearable={false}
                theme={selectThemeColors}
                isMulti
                options={vendor}
                className="react-select"
                classNamePrefix="select"
                onChange={(val) => field.onChange(val)}
                // onChange={(val) => field.onChange(val.map(v => ({ uid: v.uid, vName: v.vName, vEmail: v.vEmail, vPhone: v.vPhone, vtype: v.vtype })))} // important for multi-select
              />
            )}
          />
          {errors.venue && (
            <p className="text-danger">{errors.venue.message}</p>
          )}
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
                  {console.log("xvendor", xvendor)};
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
                invalid={!!errors.price}
                {...field}
              />
            )}
          />
          {errors.totalAmount && (
            <p className="text-danger">{errors.totalAmount.message}</p>
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
    </>
  );
};

export default EventForm;
