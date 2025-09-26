import { selectThemeColors } from "@utils";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import successAnimation from "../../../assets/images/celebrate.json";
import successAnimations from "../../../assets/images/Congratulations.json";

import Lottie from "lottie-react";
import React, { useEffect, useRef, useState } from "react";
import { Plus } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import ViewClient from "./client_Information/ViewClient";

import useJwt from "@src/auth/jwt/useJwt";
import "flatpickr/dist/themes/airbnb.css"; // or 'material_blue.css', 'dark.css', etc.
import moment from "moment"; // or use native Date methods if preferred
import Flatpickr from "react-flatpickr";
import { useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UncontrolledAlert } from "reactstrap";
import ClientDetaiils from "./client_Information";
import RoomManageModal from "./RoomManageModal";

const EventForm = ({
  stepper,
  setAllEventData,
  listData,
  setUpdateData,
  updateData,
}) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const [EventType, setEventsType] = useState([]);
  const [venueType, setVenueType] = useState([]);
  const [vendor, setVendorType] = useState([]);
  const [additionOFroom, setAdditionOFroom] = useState();
  const toast = useRef(null);
  // const [open, setOpen] = useState(false);
  const [errMsz, seterrMsz] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const navigate = useNavigate();

  const isRecurring = watch("isRecurringEvent");
  const StaffAmount = watch("extraNoOfStaffAmount");

  const baseAmountRef = useRef(0);

  const [memberNames, setMemberNames] = useState([]);
  const selectedMember = watch("selectedMember");
  const [open, setOpen] = useState(false);
  const [memberDataLoading, setMemberDataLoading] = useState(false);
  const hasSelectedMember =
    selectedMember && Object.keys(selectedMember).length > 0;
  const hasMemberAppendData =
    memberAppendData && Object.keys(memberAppendData).length > 0;

  const OptionComponent = ({ data, ...props }) =>
    data.type === "button" ? (
      <Button
        className="text-start rounded-0 px-50"
        color={data.color}
        block
        onClick={() => setOpen(true)}
      >
        <Plus className="font-medium-1 me-50" />
        <span className="align-middle">{data.label}</span>
      </Button>
    ) : (
      <components.Option {...props}>{data.label}</components.Option>
    );

  const [options, setOptions] = useState([
    {
      value: "add-new",
      label: "Add New Customer",
      type: "button",
      color: "flat-success",
    },
  ]);
  const fetchExistingMem = async () => {
    setMemberDataLoading(true);
    try {
      const { data } = await useJwt.GetMember();
      const members = data?.content?.result?.map((x) => ({
        label: `${x.firstName} ${x.lastName}`,
        value: x.uid,
        ...x,
      }));
      setMemberNames(members);
    } catch (error) {
      console.error(error);
    } finally {
      setMemberDataLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingMem();
  }, []);

  useEffect(() => {
    if (selectedMember) setSelectedMember(selectedMember);
  }, [selectedMember]);

  useEffect(() => {
    console.log("listData", listData);
    // {{debugger}}
    if (listData?.Rowdata) {
      const {
        eventEndDate,
        eventEndTime,
        eventStartTime,
        eventStartDate,
        isExtraStaff,
        eventType,
        venue,
        vendors,
        member,
        totalAmount,
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

      let updatedAmount;
      if (listData?.uid) {
        updatedAmount = totalAmount;
      }
      setUpdateData((prev) => ({
        ...prev,
        listData,
      }));

      reset({
        ...rest,
        endDateTime,
        startDateTime,
        isExtraStaff: isExtraStaff,

        eventType: { label: eventType?.eventTypeName, value: eventType?.uid },
        venue: {
          label: venue?.venueName,
          value: venue?.uid,
          totalPrice: venue?.totalPrice,
        },

        vendors: vendors?.map((v) => ({
          label: `${v.vendorName} ( ${v.vendorType?.typeName} )`,
        })),
        selectedMember: {
          label: `${member?.firstName} ${member?.lastName}`,
          value: member?.uid,
        },

        totalAmount: updatedAmount,
      });
    }
  }, [listData?.Rowdata]);

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
      // {{debugger}}
      const venueTypeNames = content?.result?.map((x) => ({
        label: x.venueName,
        value: x.uid,
        totalPrice: x.totalPrice,
      }));

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
        label: `${x.vendorName} ( ${x.vendorType
          ?.map((t) => t.typeName)
          .join(", ")} )`,
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
    console.log("update Data", data);

    seterrMsz("");

    const isOtherVenue = data.venue?.value === "other";
    const isOtherEventType = data.eventType?.value === "other";

    const venuePayload = isOtherVenue
      ? {
          uid: null,
          venueName: data.venueName,
          capacity: data.capacity,
          price: data.price,
          venueType: data.venueType,
          noOfStaff: data.noOfStaff,
          staffPrice: data.staffPrice,
          totalPrice: data.totalPrice,
          country: data.country,
          state: data.state,
          city: data.city,
          postCode: data.postCode,
          address: data.address,
        }
      : { uid: data.venue.value };

    const memberPayload = selectMem?.uid
      ? { uid: selectMem.uid }
      : { ...memberAppendData };

    const eventType = isOtherEventType
      ? { uid: null, eventTypeName: data.eventTypeName }
      : { uid: data.eventType.value };

    const formatDate = (date, fmt) => (date ? moment(date).format(fmt) : null);

    const payload = {
      ...data,
      eventType,
      eventStartDate: formatDate(data.startDateTime, "YYYY-MM-DD"),
      eventEndDate: formatDate(data.endDateTime, "YYYY-MM-DD"),
      eventStartTime: formatDate(data.startDateTime, "HH:mm"),
      eventEndTime: formatDate(data.endDateTime, "HH:mm"),
      vendors: data.vendors?.map((v) => ({ uid: v.value })),
      venue: venuePayload,
      member: memberPayload,
      isRecurringEvent: !!data.isRecurringEvent,
      isExtraStaff: !!data.isExtraStaff,
      isRoomRequired: !!data.isRoomRequired,
      amount: basePrice,
      ...(isRoomRequired && {
        numberOfGuests: eventRooms?.bookedRoom?.[0]?.numberOfGuests,
        roomBookings: [
          {
            roomSearch: { uid: eventRooms?.roomSearchUid },
            checkInDate: eventRooms?.bookedRoom?.[0]?.checkInDate,
            checkOutDate: eventRooms?.bookedRoom?.[0]?.checkOutDate,
            numberOfGuests: eventRooms?.bookedRoom?.[0]?.numberOfGuests,
            finalAmount: baseAmountRef.current,
            subtotal: baseAmountRef.current,
            numberOfDays: eventRooms?.bookedRoom?.[0]?.totalNoOfDays,
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
      vendorN: { selectedVendors },
      ...isVenue,
      eventTypes: seletctType?.label,
    };

    const AmtDiffernce =
      data?.totalAmount - updateData?.listData?.Rowdata?.totalAmount;
    console.log("event doffer", AmtDiffernce);
    console.log(data);

    const eventUpdatePayload = {
      "event.uid": listData?.uid,
      "event.eventName": data?.eventName,
      "event.eventDescription": data?.eventDescription,
      "event.eventStartDate": formatDate(data.startDateTime, "YYYY-MM-DD"),
      "event.eventEndDate": formatDate(data.endDateTime, "YYYY-MM-DD"),
      "event.eventStartTime": formatDate(data.startDateTime, "HH:mm"),
      "event.eventEndTime": formatDate(data.endDateTime, "HH:mm"),
      "event.amount": data?.amount,
      "event.isExtraStaff": data?.isExtraStaff,
      "event.extraNoOfStaff": data?.extraNoOfStaff,
      "event.extraNoOfStaffAmount": data?.extraNoOfStaffAmount,
      "event.totalAmount": data?.totalAmount,
      "event.isRecurringEvent": data?.isRecurringEvent,
      "event.venue.uid": data?.venue?.value,
      "event.eventType.uid": data?.eventType?.value,
      "event.member.uid": data?.selectedMember?.value,
      "payment.finalPayment": AmtDiffernce,
    };

    const formData = new FormData();
    if (displayVendors) {
      displayVendors.forEach((v, index) => {
        formData.append(`event.vendors[${index}].uid`, v.uid || v.value);
      });
    }

    //     (Array.isArray(displayVendors) ? displayVendors : []).map((v, index) => {
    //   formData.append(`event.vendors[${index}].uid`, v.uid || v.value);
    // });

    Object.entries(eventUpdatePayload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (AmtDiffernce === 0 || AmtDiffernce < 0) {
      setLoading(true);
      try {
        const res = await useJwt.UpdateEventAndPayment(formData);
        console.log(res);
        if (res?.data?.refundAmount > 0) {
          setModal(true);
          setTimeout(() => {
            setModal(false);
            navigate("/event_index");
          }, 5000);
        } else {
          toast.current.show({
            severity: "success",
            summary: "Event Updated Successfully",
            detail: "Event Details Updated Successfully.",
            life: 2000,
          });

          setTimeout(() => navigate("/event_index"), 1500);
        }
      } catch (error) {
        console.log(error);
        seterrMsz(error.response?.data?.content || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    }

    if (listData?.uid && AmtDiffernce > 0) {
      stepper.next();
      setUpdateData((prev) => ({
        ...prev,
        data,
      }));
    } else {
      if (!listData?.uid) {
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

          setTimeout(() => stepper.next(), 1500);
        } catch (error) {
          console.error(error);
          const msg = error.response?.data?.content || "Something went wrong!";
          seterrMsz((prev) => (prev !== msg ? msg : prev + " "));
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const seletctType = watch("eventType");
  const isExtraStaffRequired = watch("isExtraStaff");
  const isVenue = watch("venue");

  useEffect(() => {
    if (isExtraStaffRequired === false) {
      setValue("extraNoOfStaffAmount", null);
      setValue("extraNoOfStaff", null);
    }

    if (isRecurring === false) {
      setValue("recurrencePattern", null);
    }
  }, [isExtraStaffRequired, isRecurring]);

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

  let roomPrice;
  if (listData?.uid) {
    const roomPriceData = listData?.Rowdata?.roomBookings?.map(
      (x) => x?.finalAmount
    );
    roomPrice = Number(roomPriceData);
  } else {
    roomPrice = Number(baseAmountRef.current) || 0;
  }

  const extraNoOfStaffAmount = watch("extraNoOfStaffAmount") || 0;
  const staffPrice = Number(watch("staffPrice")) || 0;
  const price = Number(watch("price")) || 0;
  const venue = watch("venue");

  let basePrice;
  if (listData?.uid) {
    basePrice = venue?.totalPrice;
  } else {
    basePrice = isVenue?.totalPrice || staffPrice + price;
  }

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

  const displayVendors =
    selectedVendors?.length > 0 ? selectedVendors : listData?.Rowdata?.vendors;

  const roomData = listData?.Rowdata?.roomBookings?.flatMap(
    (x) =>
      x?.roomSearch?.roomSearchUnit?.map((room) => ({
        roomNumber: room?.roomUnit?.roomNumber,
        roomTypeName: room?.roomUnit?.roomType?.roomTypeName,
        fields: {
          serviceType: room?.serviceType,
          amount: room?.amount,
        },
      })) || []
  );
{}
  const displayRooms =
    watch("isRoomRequired") && eventRooms?.roomSearchUid
      ? eventRooms?.bookedRoom
      : roomData;

      // console.log("displayRooms",displayRooms);
      
  const handleOk = () => {
    // toggle();
    navigate("/event_index");
  };

  const wstartDateTime = watch("startDateTime");
  const endDate = watch("endDateTime");
  console.log(wstartDateTime);

useEffect(() => {
  if (!eventRooms?.bookedRoom || eventRooms?.bookedRoom?.length === 0 ) {
    setValue('isRoomRequired', false);
  }
}, [eventRooms?.bookedRoom, setValue ,] );4


// const toggleRoomModal=()=>{
//   const currentState=showModal;
//   if(currentState){
//     setValue('isRoomRequired',false);
//   }
//   setShowModal(!showModal)
// }

// useEffect(()=>{

//   if(watch('isRoomRequired')){
//     setShowModal(true)
//   }
  
// },[watch('isRoomRequired')])



  return (
    <>
      <Modal isOpen={modal} toggle={toggle} centered size="sm">
        <ModalHeader
          toggle={toggle}
          style={{
            borderBottom: "none",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "1.25rem",
          }}
        >
          🎉 Refund Initiated
        </ModalHeader>

        <ModalBody style={{ textAlign: "center", paddingTop: 0 }}>
          <div
            style={{
              position: "relative",
              width: 200,
              height: 200,
              margin: "0 auto",
            }}
          >
            <Lottie
              animationData={successAnimation}
              loop={true}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 200,
                height: 200,
              }}
            />
            <Lottie
              animationData={successAnimations}
              loop={true}
              style={{
                position: "absolute",
                top: "-25px",
                left: "-25px",
                width: 250,
                height: 250,
              }}
            />
          </div>

          <CardTitle tag="h5" style={{ marginTop: "10px", fontWeight: "800" }}>
            Your refund has been successfully initiated.
          </CardTitle>
          <CardText
            style={{ color: "#555", fontSize: "0.81rem", marginTop: "5px" }}
          >
            It will be credited to your account within{" "}
            <strong>1-2 working days</strong>.
          </CardText>
        </ModalBody>

        <ModalFooter style={{ borderTop: "none", justifyContent: "center" }}>
          <Button
            color="success"
            // onClick={toggle}
            onClick={handleOk}
            style={{ borderRadius: "8px", padding: "8px 20px" }}
          >
            OK
          </Button>
        </ModalFooter>
      </Modal>

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
              rules={{
                required: "Event Name is required",
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message:
                    "Event name only contain alphabetic characters and space.",
                },
              }}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter event name"
                    invalid={!!errors.eventName}
                    onChange={(e) => {
                      // Allow only letters and spaces
                      const onlyLettersAndSpaces = e.target.value.replace(
                        /[^A-Za-z0-9\s]/g,
                        ""
                      );
                      field.onChange(onlyLettersAndSpaces);
                    }}
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
                    options={[
                      ...EventType,
                      ...(listData?.uid
                        ? []
                        : [{ label: "Other", value: "other" }]),
                    ]}
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
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter event name"
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
            {errors.eventTypeName && (
              <p className="invalid-feedback">{errors.eventTypeName.message}</p>
            )}
          </Col>
        )}

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
                  options={{
                    maxDate: endDate,
                  }}
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
                  options={{
                    minDate: wstartDateTime,
                  }}
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
              render={({ field }) => (
                <Input
                  {...field}
                  checked={field.value || false}
                  type="checkbox"
                />
              )}
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
              render={({ field }) => (
                <Input
                  {...field}
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
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
                      type="text"
                      placeholder="Enter Extra No of Staff"
                      invalid={!!errors.extraNoOfStaff}
                      {...field}
                      onChange={(e) => {
                        // Allow only numeric characters
                        const onlyNumbers = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        field.onChange(onlyNumbers);
                      }}
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
                      type="text"
                      placeholder="Enter Extra staff Amount "
                      invalid={!!errors.extraNoOfStaffAmount}
                      {...field}
                      onChange={(e) => {
                        // Allow only numeric characters
                        const onlyNumbers = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        field.onChange(onlyNumbers);
                      }}
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
                    checked={field.value || false}
                    disabled={
                      eventRooms?.bookedRoom?.length > 0 || !!listData?.uid
                    }
                    onchange={(e) => field.onChange(e.target.checked)}
                  />
                );
              }}
            />{" "}
            Is Room Required
          </Label>
        </Col>

        {displayRooms?.length > 0 && (
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
                    {displayRooms?.map((x, index) => (
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
    rules={{
      required: "Event description is required", // ✅ required validation
      maxLength: {
        value: 500,
        message: "Maximum 500 characters allowed",
      },
    }}
    render={({ field, fieldState: { error } }) => (
      <>
        <Input
          {...field}
          type="textarea"
          placeholder="Add any notes or description"
          onChange={(e) => {
            // Allow letters, numbers, dot, space, dash, and comma
            let onlyValid = e.target.value.replace(
              /[^A-Za-z0-9 .,-]/g,
              ""
            );

            // Limit to 500 characters
            if (onlyValid.length > 500) {
              onlyValid = onlyValid.slice(0, 500);
            }

            field.onChange(onlyValid);
          }}
        />
        {error && <small className="text-danger">{error.message}</small>}
      </>
    )}
  />
  <small className="text-muted">(max 500 characters)</small>
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
                  options={[
                    ...venueType,
                    ...(listData?.uid
                      ? []
                      : [{ label: "Other", value: "other" }]),
                  ]}
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
                      onChange={(e) => {
                        // Allow only numeric characters
                        const onlyNumbers = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        field.onChange(onlyNumbers);
                      }}
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
                  <FormFeedback>{errors.country.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              {" "}
              <Col sm="6" className="mb-1">
                <Label for="postCode">Zip Code</Label>
                <Controller
                  name="postCode"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Zip Code is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "postCode must be a number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="postCode"
                      type="number"
                      placeholder="Enter venue Zip Code"
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
                      type="text"
                      placeholder="Enter venue price"
                      invalid={!!errors.price}
                      {...field}
                      onChange={(e) => {
                        // Allow only numeric characters
                        const onlyNumbers = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        field.onChange(onlyNumbers);
                      }}
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
                      type="text"
                      placeholder="Enter No of Staff"
                      invalid={!!errors.noOfStaff}
                      {...field}
                      onChange={(e) => {
                        // Allow only numeric characters
                        const onlyNumbers = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        field.onChange(onlyNumbers);
                      }}
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
                      type="text"
                      placeholder="Enter venue staff Price"
                      invalid={!!errors.price}
                      {...field}
                      onChange={(e) => {
                        // Allow only numeric characters
                        const onlyNumbers = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        field.onChange(onlyNumbers);
                      }}
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
                      type="text"
                      disabled={true}
                      placeholder="Enter Total price"
                      invalid={!!errors.price}
                      {...field}
                      onChange={(e) => {
                        // Allow only numeric characters
                        const onlyNumbers = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        field.onChange(onlyNumbers);
                      }}
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
            // rules={{ required: "Vendors  Is Required" }}
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

        {displayVendors?.length > 0 && (
          <Card className="mt-3">
            <CardBody className="py-2">
              <h6 className="mb-2">Selected Vendors</h6>
              {displayVendors?.map((xvendor, idx) => (
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
                      <strong>Name: </strong>
                      {xvendor?.vName} {xvendor?.vendorName}
                    </span>
                    <span>
                      <strong>Email:</strong> {xvendor?.vEmail}{" "}
                      {xvendor?.emailId}
                    </span>
                    <span>
                      <strong>Phone:</strong> {xvendor?.vPhone}{" "}
                      {xvendor?.countryCode}
                      {xvendor?.phoneNumber}
                    </span>
                    {/* <span>
                      <strong>Type:</strong> {xvendor?.vtype}{" "}
                      {xvendor?.vendorType }
                    </span> */}
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
        {/* 
        <ClientDetaiils
          
          setOpen={setOpen}
          setSelectedMember={setSelectedMember}
          setMemberAppendData={setMemberAppendData}
          memberAppendData={memberAppendData}
        /> */}

        <Row className="invoice-spacing mb-2">
          <Col xl="12">
            <Label for="totalPrice">Select Member</Label>
            <Controller
              control={control}
              name="selectedMember"
              rules={{ required: "Member is required" }}
              render={({ field }) => (
                <div>
                  <Select
                    {...field}
                    className={`react-select ${
                      errors.selectedMember ? "is-invalid" : ""
                    }`}
                    classNamePrefix="select"
                    id="label"
                    options={[...options, ...memberNames]}
                    theme={selectThemeColors}
                    components={{ Option: OptionComponent }}
                    onChange={(val) => field.onChange(val)}
                    menuPlacement="top"
                    isDisabled={!!listData?.uid}
                  />
                  {errors.selectedMember && (
                    <div className="invalid-feedback d-block">
                      {errors.selectedMember.message}
                    </div>
                  )}
                </div>
              )}
            />
          </Col>
        </Row>

        {(hasSelectedMember || hasMemberAppendData) && (
          <ViewClient
            memberData={listData?.Rowdata?.member}
            updateUid={listData?.uid}
            selectedMember={watch("selectedMember")}
          />
        )}
        <Row>
          {" "}
          <Col sm="6" className="mb-1">
            <Label for="totalPrice">Currently Payable Amount</Label>
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
                  disabled={!!listData?.uid}
                />
              )}
            />
            {errors.totalAmount && (
              <FormFeedback>{errors.totalAmount.message}</FormFeedback>
            )}
          </Col>
          {/* <Col sm="6" className="mb-1">
          <Label for="totalPrice">Total Cost</Label>
          <Controller
            name="totalcost"
            control={control}
            defaultValue=""
            // rules={{
            //   required: "total Price is required",
            //   pattern: {
            //     value: /^[0-9]+$/,
            //     message: " Total price must be a number",
            //   },
            // }}
            render={({ field }) => (
              <Input
                id="totalcost"
                type="number"
                placeholder="Enter Total price"
                invalid={!!errors.totalcost}
                disabled={true}
                {...field}
              />
            )}
          />
          {errors.totalcost && (
            <FormFeedback>{errors.totalcost.message}</FormFeedback>
          )}
        </Col> */}
        </Row>

        <div className="d-flex justify-content-end">
          <Button disabled={loading} color="primary" type="submit">
            {loading ? (
              <>
                <span>Loading.. </span>
                <Spinner size="sm" />{" "}
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </Form>

      {!listData?.uid && (
        <>
          {watch("isRoomRequired") && (
            <RoomManageModal
              isRoomRequired={isRoomRequired}
              // setShowModal={toggleRoomModal}
                            setShowModal={setShowModal}

              showModal={showModal}
              setEventRooms={setEventRooms}
            />
          )}
        </>
      )}
      <ClientDetaiils
        setOpen={setOpen}
        open={open}
        setSelectedMember={setSelectedMember}
        setMemberAppendData={setMemberAppendData}
        memberAppendData={memberAppendData}
        setValueParent={setValue}
      />
    </>
  );
};

export default EventForm;
