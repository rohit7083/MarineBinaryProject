import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardBody, Row, Col, Button } from "reactstrap";

const defaultDummyData = {
  eventName: "Corporate Gala",
  eventType: { label: "Corporate", value: "corp123" },
  eventTheme: "Black Tie",
  startDate: new Date(),
  endDate: new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
  isRecurring: true,
  recurrencePattern: "Monthly",
  eventDescription: "A high-end corporate networking event.",
  venue: { label: "Grand Ballroom", value: "venue001", totalPrice: 25000 },
  totalPrice: 30000,
  isExtraStaffRequired: true,
  extraNoOfStaff: 5,
  extraNoOfStaffAmount: 5000,
  
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+91-9876543210",
  address: "123 MG Road, Indiranagar",
  city: "Bangalore",
  state: "Karnataka",
  country: "India",
postalCode: "560038",

  vendorN: [
    {
      vName: "Catering Kings",
      vEmail: "contact@cateringkings.com",
      vPhone: "+91 98765 43210",
      vtype: "Catering",
    },
    {
      vName: "EventDecor",
      vEmail: "info@eventdecor.com",
      vPhone: "+91 91234 56789",
      vtype: "Decoration",
    },
  ],
};

const EventPreview = ({allEventData,stepper}) => {
    console.log("eventData",allEventData);

  const location = useLocation();
  const navigate = useNavigate();
  const eventData = location.state || defaultDummyData;

  const { handleSubmit } = useForm({
    defaultValues: eventData,
  });

  const onSubmit = (data) => {
    console.log("Final Submission:", data);
    // Proceed with submission/payment
  };

 
  return (
    <div className="container mt-4">
      <h3>Event Confirmation</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mt-3">
          <CardBody>
            <Row className="mb-2">
              <Col md="6"><strong>Event Name:</strong> {eventData.eventName}</Col>
              <Col md="6"><strong>Event Type:</strong> {eventData.eventType?.label || eventData.eventType}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Theme:</strong> {eventData.eventTheme || "N/A"}</Col>
              <Col md="6"><strong>Date:</strong> {new Date(eventData.startDate).toLocaleString()} - {new Date(eventData.endDate).toLocaleString()}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Recurring:</strong> {eventData.isRecurring ? "Yes" : "No"}</Col>
              <Col md="6"><strong>Pattern:</strong> {eventData.recurrencePattern || "N/A"}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Venue:</strong> {eventData.venue?.label || "Other"}</Col>
              <Col md="6"><strong>Total Price:</strong> $ {eventData.totalPrice}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Extra Staff:</strong> {eventData.isExtraStaffRequired ? "Yes" : "No"}</Col>
              {eventData.isExtraStaffRequired && (
                <Col md="6">
                  <strong>Staff Count:</strong> {eventData.extraNoOfStaff} |
                  <strong> Amount:</strong> $ {eventData.extraNoOfStaffAmount}
                </Col>
              )}
            </Row>
            <Row className="mb-2">
              <Col><strong>Description:</strong> {eventData.eventDescription}</Col>
            </Row>
          </CardBody>
        </Card>

      <h3>Member Details</h3>

         <Card className="mt-3">
          <CardBody>
            <Row className="mb-2">
              <Col md="6"><strong>First Name:</strong> {eventData.firstName}</Col>
              <Col md="6"><strong>Last  Name:</strong> {eventData.lastName}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Email ID:</strong> {eventData.email || "N/A"}</Col>
              <Col md="6"><strong>phone Number:</strong> {eventData.phoneNumber}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Address:</strong> {eventData.address || ""}</Col>
              <Col md="6"><strong>City:</strong> {eventData.city || "N/A"}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>State:</strong> {eventData.state  || "Other"}</Col>
              <Col md="6"><strong>Country:</strong> ₹{eventData.country}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Postal Code</strong> {eventData.postalCode || "N/A"}</Col>
             
             
            </Row>
            
          </CardBody>
        </Card>

        <hr />
      <h3>Vendor</h3>
        {eventData.vendorN && eventData.vendorN.length > 0 ? (
          eventData.vendorN.map((vendor, i) => (
            <div key={i} className="border rounded p-2 mb-2 bg-light">
              <strong>{vendor.vName}</strong> ({vendor.vtype}) <br />
              Email: {vendor.vEmail} <br />
              Phone: {vendor.vPhone}
            </div>
          ))
        ) : (
          <p>No vendors selected</p>
        )}

        <div className="d-flex justify-content-between mt-4">
          <Button color="secondary"  type="button"               onClick={() => stepper.previous()}
>
            Edit Details
          </Button>
          <Button color="success" type="submit" onClick={() => stepper.next()}>
            Confirm & Proceed to Payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventPreview;
