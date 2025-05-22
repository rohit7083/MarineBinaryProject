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

const EventPreview = ({stepper}) => {
    // console.log("eventData",allEventData);

  const location = useLocation();
  const navigate = useNavigate();
  const allEventData =  defaultDummyData;

  const { handleSubmit } = useForm({
    // defaultValues: eventData,
  });

  const onSubmit = (data) => {
    console.log("Final Submission:", data);
    // Proceed with submission/payment
  };

//  return <div>helo</div>
 
  return (
    <div className="mt-4">
      <h3>Event Confirmation</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mt-3">
          <CardBody>
            <Row className="mb-2">
              <Col md="6"><strong>Event Name:</strong> {allEventData?.eventName}</Col>
              <Col md="6"><strong>Event Type:</strong> {allEventData?.eventType?.label}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Theme:</strong> {allEventData?.eventTheme || "N/A"}</Col>
              <Col md="6"><strong>Date:</strong> {new Date(allEventData?.eventStartDate).toLocaleString()} - {new Date(allEventData?.eventEndDate).toLocaleString()}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Recurring:</strong> {allEventData?.isRecurringEvent ? "Yes" : "No"}</Col>
              <Col md="6"><strong>Pattern:</strong> {allEventData?.recurrencePattern || "N/A"}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Venue:</strong> {allEventData?.venue?.label || "Other"}</Col>
              <Col md="6"><strong>Total Price:</strong> $ {allEventData?.totalPrice}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Extra Staff:</strong> {allEventData?.isExtraStaff ? "Yes" : "No"}</Col>
              {allEventData?.isExtraStaffRequired && (
                <Col md="6">
                  <strong>Staff Count:</strong> {allEventData?.extraNoOfStaff} |
                  <strong> Amount:</strong> $ {allEventData?.extraNoOfStaffAmount}
                </Col>
              )}
            </Row>
            <Row className="mb-2">
              <Col><strong>Description:</strong> {allEventData?.eventDescription}</Col>
            </Row>
          </CardBody>
        </Card>

      <h3>Member Details</h3>

         <Card className="mt-3">
          <CardBody>
            <Row className="mb-2">
              <Col md="6"><strong>First Name:</strong> {allEventData?.member?.firstName}</Col>
              <Col md="6"><strong>Last  Name:</strong> {allEventData?.lastName}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Email ID:</strong> {allEventData?.email || "N/A"}</Col>
              <Col md="6"><strong>phone Number:</strong> {allEventData?.phoneNumber}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Address:</strong> {allEventData?.address || ""}</Col>
              <Col md="6"><strong>City:</strong> {allEventData?.city || "N/A"}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>State:</strong> {allEventData?.state  || "Other"}</Col>
              <Col md="6"><strong>Country:</strong> ₹{allEventData?.country}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="6"><strong>Postal Code</strong> {allEventData?.postalCode || "N/A"}</Col>
             
             
            </Row>
            
          </CardBody>
        </Card>

        <hr />
      <h3>Vendor</h3>
        {allEventData?.vendorN && allEventData?.vendorN.length > 0 ? (
          allEventData?.vendorN?.map((vendor, i) => (
            <div key={i} className="border rounded p-2 mb-2 bg-light">
              <strong>{vendor?.vName}</strong> ({vendor?.vtype}) <br />
              Email: {vendor?.vEmail} <br />
              Phone: {vendor?.vPhone}
            </div>
          ))
        ) : (
          <p>No vendors selected</p>
        )}

        <div className="d-flex justify-content-between mt-4">
          {/* <Button color="secondary"  type="button"               onClick={() => stepper.previous()}
>
            Edit Details
          </Button> */}
          <Button color="success" type="submit" onClick={() => stepper.next()}>
            Confirm & Proceed to Payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventPreview;
