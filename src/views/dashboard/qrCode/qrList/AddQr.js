// ** React Imports
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Reactstrap Imports
import {
  Alert,
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

// ** Auth
import useJwt from "@src/auth/jwt/useJwt";

const AddQRCodeModal = ({ isOpen, toggle, onSubmit, editData, isEditMode }) => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [slips, setSlips] = useState([]);
  const [events, setEvents] = useState([]);
  const [typeOfQr, setTypeOfQr] = useState("fixed");
  const [roomBookings, setRoomBooking] = useState([]);
  const [selectedOther, setSelectedOther] = useState("");

  const [formData, setFormData] = useState({
    eventName: "",
    qrCodeType: "other",
    amount: "",
    amountType: "Fixed",
    slipId: null,
    eventId: null,
    maxPeopleCapacity: "",
    eventPassType: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ** Populate form for edit mode - FIXED
  useEffect(() => {
    if (isEditMode && editData) {
      console.log("Edit Data:", editData); // Debug log

      setFormData({
        eventName: editData.eventName || "",
        qrCodeType: editData.qrCodeType || "other",
        amount: editData.amount || "",
        amountType: editData.amountType || "Fixed",
        slipId: editData.slip?.id || null,
        eventId: editData.event?.id || null,
        maxPeopleCapacity: editData.maxPeopleCapacity || "",
        eventPassType: editData.eventPassType || "",
      });
      setTypeOfQr((editData.amountType || "Fixed").toLowerCase());

      // Set selectedOther for edit mode
      if (editData.qrCodeType === "other" && editData.eventPassType) {
        setSelectedOther(editData.eventPassType);
      } else {
        setSelectedOther("");
      }
    } else {
      resetForm();
    }
    setErrors({});
  }, [isEditMode, editData, isOpen]);

  // ** Handle Input Change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "amountType" && type === "checkbox") {
      if (
        formData.qrCodeType === "slip" ||
        formData.qrCodeType === "event" ||
        (formData.qrCodeType === "other" && selectedOther === "EntryPass")
      ) {
        return;
      }

      const newValue = checked ? "Fixed" : "Flexible";
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
        amount: newValue === "Flexible" ? "" : prev.amount,
      }));
      setTypeOfQr(newValue.toLowerCase());
    } else if (name === "qrCodeType") {
      const newFormData = {
        ...formData,
        qrCodeType: value,
        eventName: "",
        slipId: null,
        eventId: null,
      };

      if (value === "slip" || value === "event" || value === "roomBooking") {
        newFormData.amountType = "Fixed";
        newFormData.amount = "";
        setTypeOfQr("fixed");
      }

      if (value === "other") {
        setSelectedOther("");
        newFormData.maxPeopleCapacity = "";
        newFormData.eventPassType = "";
      }

      setFormData(newFormData);
    } else if (name === "slipSelect") {
      const selectedSlip = slips.find((s) => s.id === parseInt(value));

      if (selectedSlip) {
        const rentalPrice = selectedSlip.rentalPrice || 0;
        const extraAmount = selectedSlip.switchSlipExtraAmount || 0;
        const calculatedAmount = rentalPrice + extraAmount;

        setFormData((prev) => ({
          ...prev,
          slipId: selectedSlip.id,
          eventName: selectedSlip.slipName || "",
          amount: calculatedAmount.toString(),
          amountType: "Fixed",
        }));
        setTypeOfQr("fixed");
      } else {
        setFormData((prev) => ({
          ...prev,
          slipId: null,
          eventName: "",
          amount: "",
          amountType: "Fixed",
        }));
      }
    } else if (name === "eventSelect") {
      const selectedEvent = events.find(
        (event) => event.id === parseInt(value)
      );

      if (selectedEvent) {
        const remainingAmount = selectedEvent.remainingAmount || 0;

        setFormData((prev) => ({
          ...prev,
          eventId: selectedEvent.id,
          eventName: selectedEvent.eventName || "",
          amount: remainingAmount.toString(),
          amountType: "Fixed",
        }));
        setTypeOfQr("fixed");
      } else {
        setFormData((prev) => ({
          ...prev,
          eventId: null,
          eventName: "",
          amount: "",
          amountType: "Fixed",
        }));
      }
    } else if (name === "roomSelect") {
      const selectedRoomBooking = roomBookings.find(
        (roomBooking) => roomBooking.id === parseInt(value)
      );

      if (selectedRoomBooking) {
        const remainingAmount = selectedRoomBooking.remainingAmount || 0;

        setFormData((prev) => ({
          ...prev,
          eventId: selectedRoomBooking.id,
          eventName: selectedRoomBooking.eventName || "Room Booking",
          amount: remainingAmount.toString(),
          amountType: "Fixed",
        }));
        setTypeOfQr("fixed");
      } else {
        setFormData((prev) => ({
          ...prev,
          eventId: null,
          eventName: "",
          amount: "",
          amountType: "Fixed",
        }));
      }
    } else {
      if (
        name === "amount" &&
        (formData.qrCodeType === "slip" || formData.qrCodeType === "event")
      ) {
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ** Validate Form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.eventName.trim())
      newErrors.eventName = "Event name is required";

    if (formData.qrCodeType === "other" && selectedOther === "EntryPass") {
      if (
        !formData.maxPeopleCapacity ||
        parseInt(formData.maxPeopleCapacity) <= 0
      ) {
        newErrors.maxPeopleCapacity = "Maximum pass must be greater than 0";
      }
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      }
    } else if (
      formData.amountType === "Fixed" &&
      (!formData.amount || parseFloat(formData.amount) <= 0)
    ) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (formData.qrCodeType === "slip" && !formData.slipId)
      newErrors.slipId = "Please select a slip";
    if (formData.qrCodeType === "event" && !formData.eventId)
      newErrors.eventId = "Please select an event";
    if (formData.qrCodeType === "roomBooking" && !formData.eventId)
      newErrors.roomBookingId = "Please select a room booking";
    if (formData.qrCodeType === "other" && !selectedOther)
      newErrors.otherEventList = "Please select an event type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ** Handle Form Submit - FIXED
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const apiData = {
        eventName: formData.eventName,
        qrCodeType: formData.qrCodeType,
        amountType: formData.amountType,
        amount:
          formData.amountType === "Fixed" ? parseFloat(formData.amount) : null,
        slip: formData.slipId ? { id: formData.slipId } : null,
        event: formData.eventId ? { id: formData.eventId } : null,
      };

      // Always add these fields for 'other' type
      if (formData.qrCodeType === "other") {
        apiData.eventPassType = formData.eventPassType || null;
        apiData.maxPeopleCapacity = formData.maxPeopleCapacity
          ? parseInt(formData.maxPeopleCapacity)
          : null;
      }

      console.log("Submitting API Data:", apiData); // Debug log

      await onSubmit(apiData);
      if (!isEditMode) resetForm();
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ** Reset Form
  const resetForm = () => {
    setFormData({
      eventName: "",
      qrCodeType: "other",
      amount: "",
      amountType: "Fixed",
      slipId: null,
      eventId: null,
      maxPeopleCapacity: "",
      eventPassType: "",
    });
    setTypeOfQr("fixed");
    setSelectedOther("");
    setErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    toggle();
  };

  // ** Fetch slips
  useEffect(() => {
    const fetchSlips = async () => {
      try {
        const response = await useJwt.getslip();
        setSlips(response.data.content.result || []);
      } catch (error) {
        console.error("Error fetching slips:", error);
        setSlips([]);
      }
    };
    fetchSlips();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await useJwt.getAllEvents();
        const events = response.data.content.result;
        const filteredEvent = events.filter((e) => e.remainingAmount > 0);
        setEvents(filteredEvent);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRoomBooking = async () => {
      try {
        const response = await useJwt.bookingList();
        const roomBookings = response.data.content.result || [];

        const filteredRoomBooking = roomBookings.filter(
          (roomBooking) =>
            roomBooking.remainingAmount !== null &&
            roomBooking.event == null &&
            roomBooking.remainingAmount > 0
        );

        setRoomBooking(filteredRoomBooking);
      } catch (error) {
        console.error("Error fetching Room Booking:", error);
        setRoomBooking([]);
      }
    };
    fetchRoomBooking();
  }, []);

  const otherEventList = {
    "Entry Pass": "EntryPass",
    "Event Name": "NoEntryPass",
  };

  const handleOtherChange = (e) => {
    const value = e.target.value;
    setSelectedOther(value);

    setFormData((prev) => ({
      ...prev,
      eventPassType: value,
    }));

    if (value === "EntryPass") {
      setFormData((prev) => ({
        ...prev,
        amountType: "Fixed",
        amount: prev.amount || "",
        maxPeopleCapacity: prev.maxPeopleCapacity || "",
        eventPassType: value,
      }));
      setTypeOfQr("fixed");
    } else if (value === "NoEntryPass") {
      setFormData((prev) => ({
        ...prev,
        maxPeopleCapacity: "",
        eventPassType: value,
      }));
    }
  };

  return (
    <>
      <Toast ref={toast} />

      <Modal
        isOpen={isOpen}
        toggle={handleClose}
        className="modal-dialog-centered modal-lg"
        backdrop="static"
      >
        <ModalHeader toggle={handleClose}>
          {isEditMode ? "Edit QR Code" : "Add New QR Code"}
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              {/* QR Code Type */}
              <Col md="12">
                <FormGroup>
                  <Label className="form-label" for="qrCodeType">
                    QR Code Type
                  </Label>
                  <Input
                    type="select"
                    id="qrCodeType"
                    name="qrCodeType"
                    value={formData.qrCodeType}
                    onChange={handleInputChange}
                    disabled={isEditMode}
                  >
                    <option value="slip">Slip</option>
                    <option value="event">Event</option>
                    <option value="roomBooking">Room Booking</option>
                    <option value="other">Other</option>
                  </Input>
                </FormGroup>
              </Col>

              {/* Slip Select */}
              {formData.qrCodeType === "slip" && (
                <Col md="12">
                  <FormGroup>
                    <Label className="form-label" for="slipSelect">
                      Select Slip
                    </Label>
                    <Input
                      type="select"
                      id="slipSelect"
                      name="slipSelect"
                      value={formData.slipId || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Select Slip --</option>
                      {slips?.length > 0 ? (
                        slips.map((slip) => (
                          <option key={slip.id} value={slip.id}>
                            {slip.slipName}
                          </option>
                        ))
                      ) : (
                        <option disabled>No slips available</option>
                      )}
                    </Input>
                    {errors.slipId && (
                      <div className="invalid-feedback d-block">
                        {errors.slipId}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              )}

              {/* Event Select */}
              {formData.qrCodeType === "event" && (
                <Col md="12">
                  <FormGroup>
                    <Label className="form-label" for="eventSelect">
                      Select Event
                    </Label>
                    <Input
                      type="select"
                      id="eventSelect"
                      name="eventSelect"
                      value={formData.eventId || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Select Event --</option>
                      {events?.length > 0 ? (
                        events.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.eventName}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Events available</option>
                      )}
                    </Input>
                    {errors.eventId && (
                      <div className="invalid-feedback d-block">
                        {errors.eventId}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              )}

              {/* Room Booking Select */}
              {formData.qrCodeType === "roomBooking" && (
                <Col md="12">
                  <FormGroup>
                    <Label className="form-label" for="roomSelect">
                      Select Room Booking
                    </Label>
                    <Input
                      type="select"
                      id="roomSelect"
                      name="roomSelect"
                      value={formData.eventId || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Select Room Booking --</option>
                      {roomBookings?.length > 0 ? (
                        roomBookings.map((roomBooking) => (
                          <option key={roomBooking.id} value={roomBooking.id}>
                            {roomBooking.member.firstName}{" "}
                            {roomBooking.member.lastName} {" - "}
                            [CHECK IN: {roomBooking.checkInDate}]
                          </option>
                        ))
                      ) : (
                        <option disabled>No Room Booking available</option>
                      )}
                    </Input>
                    {errors.roomBookingId && (
                      <div className="invalid-feedback d-block">
                        {errors.roomBookingId}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              )}

              {/* Other Event Type Select */}
              {formData.qrCodeType === "other" && (
                <Col md="12">
                  <FormGroup>
                    <Label className="form-label" for="otherSelect">
                      Select Event Type
                    </Label>
                    <Input
                      type="select"
                      id="otherSelect"
                      name="otherSelect"
                      value={selectedOther || ""}
                      onChange={handleOtherChange}
                    >
                      <option value="">-- Select Event Type --</option>
                      {Object.entries(otherEventList).map(([label, value]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Input>
                    {errors.otherEventList && (
                      <div className="invalid-feedback d-block">
                        {errors.otherEventList}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              )}

              {/* Event Name */}
              <Col md="12">
                <FormGroup>
                  <Label className="form-label" for="eventName">
                    Event Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="eventName"
                    name="eventName"
                    placeholder="Enter event name"
                    value={formData.eventName}
                    onChange={(e) => {
                      const regex = /^[a-zA-Z0-9 ]*$/; // allows only alphabets, numbers, and spaces
                      if (regex.test(e.target.value) || e.target.value === "") {
                        handleInputChange(e);
                      }
                    }}
                    onPaste={(e) => {
                      // prevent pasting invalid characters
                      const paste = e.clipboardData.getData("text");
                      if (!/^[a-zA-Z0-9 ]*$/.test(paste)) {
                        e.preventDefault();
                      }
                    }}
                    invalid={!!errors.eventName}
                    readOnly={
                      (formData.qrCodeType === "slip" && !!formData.slipId) ||
                      (formData.qrCodeType === "event" && !!formData.eventId) ||
                      (formData.qrCodeType === "roomBooking" &&
                        !!formData.eventId)
                    }
                  />
                  {errors.eventName && (
                    <div className="invalid-feedback d-block">
                      {errors.eventName}
                    </div>
                  )}
                </FormGroup>
              </Col>

              {/* Max People Capacity - Only for Entry Pass */}
              {selectedOther === "EntryPass" && (
                <Col md="12">
                  <FormGroup className="mb-2">
                    <Label className="form-label mb-1" for="maxPeopleCapacity">
                      Number of Passes <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      id="maxPeopleCapacity"
                      name="maxPeopleCapacity"
                      placeholder="Enter maximum pass"
                      value={formData.maxPeopleCapacity}
                      onChange={handleInputChange}
                      invalid={!!errors.maxPeopleCapacity}
                      min="1"
                    />
                    {errors.maxPeopleCapacity && (
                      <div className="invalid-feedback d-block">
                        {errors.maxPeopleCapacity}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              )}

              {/* Amount Type */}
              <Col md={formData.amountType === "Fixed" ? "6" : "12"}>
                <FormGroup className="mb-2">
                  <Label className="form-label mb-1">Amount Type</Label>
                  <div className="d-flex align-items-center gap-2">
                    <Label check htmlFor="amountType" className="mb-0">
                      Flexible
                    </Label>
                    <FormGroup switch className="mb-0">
                      <Input
                        type="switch"
                        id="amountType"
                        name="amountType"
                        checked={formData.amountType === "Fixed"}
                        onChange={handleInputChange}
                        disabled={
                          formData.qrCodeType === "slip" ||
                          formData.qrCodeType === "event" ||
                          formData.qrCodeType === "roomBooking" ||
                          (formData.qrCodeType === "other" &&
                            selectedOther === "EntryPass")
                        }
                      />
                    </FormGroup>
                    <Label check htmlFor="amountType" className="mb-0">
                      Fixed
                    </Label>
                  </div>
                  {(formData.qrCodeType === "slip" ||
                    formData.qrCodeType === "event" ||
                    formData.qrCodeType === "roomBooking") && (
                    <small className="text-muted">
                      Amount type is fixed for {formData.qrCodeType} QR codes
                    </small>
                  )}
                  {formData.qrCodeType === "other" &&
                    selectedOther === "EntryPass" && (
                      <small className="text-muted">
                        Amount type is fixed for Entry Pass
                      </small>
                    )}
                </FormGroup>
              </Col>

              {formData.amountType === "Fixed" && (
                <Col md="6">
                  <FormGroup className="mb-2">
                    <Label className="form-label mb-1" for="amount">
                      {" "}
                      {selectedOther === "EntryPass"
                        ? "Amount per pass"
                        : "Amount"}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="amount"
                      name="amount"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      invalid={!!errors.amount}
                      min="0"
                      step="0.01"
                      readOnly={
                        formData.qrCodeType === "slip" ||
                        formData.qrCodeType === "event" ||
                        formData.qrCodeType === "roomBooking"
                      }
                    />
                    {errors.amount && (
                      <div className="invalid-feedback d-block">
                        {errors.amount}
                      </div>
                    )}
                    {formData.qrCodeType === "slip" && (
                      <small className="text-muted">
                        Amount is auto-calculated from selected slip
                      </small>
                    )}
                    {formData.qrCodeType === "event" && (
                      <small className="text-muted">
                        Amount is auto-filled from selected event's remaining
                        amount
                      </small>
                    )}
                    {formData.qrCodeType === "roomBooking" && (
                      <small className="text-muted">
                        Amount is auto-filled from selected room booking
                      </small>
                    )}
                  </FormGroup>
                </Col>
              )}
            </Row>

            {Object.keys(errors).length > 0 && (
              <Alert color="danger">
                Please fix the above errors before submitting.
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              color="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? `${isEditMode ? "Updating..." : "Creating..."}`
                : `${isEditMode ? "Update QR Code" : "Create QR Code"}`}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default AddQRCodeModal;
