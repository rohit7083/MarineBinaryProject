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

  const EventForm = ({stepper,setAllEventData}) => {
    const [EventType, setEventsType] = useState([]);
    const [venueType, setVenueType] = useState([]);
    const [vendor, setVendorType] = useState([]);
    const toast = useRef(null);
    const [open, setOpen] = useState(false);

    const {
      control,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm({
      defaultValues: {
        eventName: "",
        eventType: "",
        eventTheme: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        isRecurring: false,
        recurrencePattern: "",
        eventDescription: "",
      },
    });

    const isRecurring = watch("isRecurring");
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
      { label: "Yearly", value: "Yearly" },
    ];

    const onSubmit =  (data) => {
      stepper.next();
      // try {
        // const res=await useJwt.createEvent(data);
        // console.log("res", res);
        console.log(data);
        toast.current.show({
          severity: "success",
          summary: "Event Created Successfully",
          detail: "Event Details Created Successfully.",
          life: 2000,
        });

        setAllEventData(data);
        // navigate("/preview", { state: data });
      // } catch (error) {
        // console.log(error);
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error",
        //   detail: "Failed to create event.",
        //   life: 2000,
        // });
      // }
    };

    const seletctType = watch("eventType");
    const isExtraStaffRequired = watch("isExtraStaffRequired");
    const isVenue = watch("venue");
    const [picker, setPicker] = useState(new Date());

    const selectedVendors = useWatch({
      control,
      name: "vendorN",
    });

    const handleRemoveVendor = (index) => {
      const updated = [...selectedVendors];
      updated.splice(index, 1);
      setValue("vendorN", updated); // react-hook-form
    };

    const extraNoOfStaffAmount = watch("extraNoOfStaffAmount") || 0;
    const basePrice = isVenue?.totalPrice || 0;

    useEffect(() => {
      const FinalPrice = Number(basePrice) + Number(extraNoOfStaffAmount);
      setValue("totalPrice", FinalPrice);
    }, [extraNoOfStaffAmount, basePrice, setValue]);

    return (
      <>
        <h4 className="mb-2">Event Information</h4>
        <Toast ref={toast} />

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Event Name */}
          <Col className="mb-1">
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
          <Col className="mb-1">
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
            <Col md={6} check className="mb-2">
              <Label className="form-label" for="date-time-picker">
                Start Date & Time
              </Label>
              <Flatpickr
                value={picker}
                data-enable-time
                id="date-time-picker"
                className="form-control"
                onChange={(date) => setPicker(date)}
              />
            </Col>
            <Col md={6} check className="mb-2">
              <Label className="form-label" for="date-time-picker">
                End Date & Time
              </Label>
              <Flatpickr
                value={picker}
                data-enable-time
                id="date-time-picker"
                className="form-control"
                onChange={(date) => setPicker(date)}
              />
            </Col>
          </Row>
          {/* Recurring Checkbox */}
          <Col check className="mb-2">
            <Label check>
              <Controller
                name="isRecurring"
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
                name="isExtraStaffRequired"
                control={control}
                render={({ field }) => <Input {...field} type="checkbox" />}
              />{" "}
              Is Extra Staff Required
            </Label>
          </Col>
          {isExtraStaffRequired && (
            <>
              <Col sm="12" className="mb-1">
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

              <Col sm="12" className="mb-1">
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
              <CreateVenue />
            </>
          )}

          <Col className="mb-1">
            <Label className="form-label">Vendor Name</Label>
            <Controller
              name="vendorN"
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
                  onChange={(val) => field.onChange(val)} // important for multi-select
                  // value={field.value} // bind current value
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
                {selectedVendors.map((vendor, idx) => (
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
                        <strong>Name:</strong> {vendor.vName}
                      </span>
                      <span>
                        <strong>Email:</strong> {vendor.vEmail}
                      </span>
                      <span>
                        <strong>Phone:</strong> {vendor.vPhone}
                      </span>
                      <span>
                        <strong>Type:</strong> {vendor.vtype}
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

          <ClientDetaiils setOpen={setOpen} />

          <Col sm="12" className="mb-1">
            <Label for="totalPrice">Total Cost</Label>
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
          <div className="d-flex justify-content-end">
            <Button color="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </>
    );
  };

  export default EventForm;
