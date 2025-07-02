import React, { useEffect } from "react";
import { ArrowLeft } from "react-feather";

// ** Reactstrap Imports
import { Card, CardBody, CardText, CardTitle, Col, Row } from "reactstrap";

// ** Main Component
const CheckoutInfo = ({ propsData }) => {
  // ** Props
  console.log("CheckoutInfo Props:", propsData);

  const { preBookingData, alldata, searchId, searchUid } = propsData;

  //seperate Month and Year from date
  const date = new Date(alldata.checkInDate);
  const day = String(date.getDate()).padStart(2, "0"); // "17"
  const monthYear = date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const outDate = new Date(alldata.checkOutDate);
  const outDay = String(outDate.getDate()).padStart(2, "0"); // "20"
  const outMonthYear = outDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  return (
    <>
      <Row>
        {" "}
        <Col xl="8" xs="12">
          <Card>
            <CardBody>
              <CardTitle className="mb-1" tag="h4">
                <ArrowLeft
                  style={{
                    cursor: "pointer",
                    transition: "color 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#9289F3")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#6E6B7B")
                  }
                  onClick={() => window.history.back()}
                />{" "}
                Review your Booking
              </CardTitle>

              <Row>
                <Col>
                  <CardText className="">Check In</CardText>
                  <CardTitle className="m-auto">
                    <span
                      style={{
                        fontFamily: "sans-serif",
                        fontWeight: "bold",
                        fontSize: "2em",
                      }}
                    >
                      {day}
                    </span>{" "}
                    <span style={{ fontSize: "0.8em" }}>{monthYear}</span>
                  </CardTitle>
                </Col>
                <Col>
                  {" "}
                  <CardText className="">Check Out</CardText>
                  <CardTitle className="m-auto">
                    <span
                      style={{
                        fontFamily: "sans-serif",
                        fontWeight: "bold",
                        fontSize: "2em",
                      }}
                    >
                      {outDay}
                    </span>{" "}
                    <span style={{ fontSize: "0.8em" }}>{outMonthYear}</span>{" "}
                  </CardTitle>
                </Col>

                <Col>
                  {" "}
                  <CardText className="">Total Days</CardText>
                  <CardTitle className="m-auto">
                    <span
                      style={{
                        fontFamily: "sans-serif",
                        fontWeight: "bold",
                        fontSize: "2em",
                      }}
                    >
                      {alldata?.numberOfDays}
                    </span>
                    <span style={{ fontSize: "0.8em" }}>Nights</span>
                  </CardTitle>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col xl="4" xs="12">
          <Card>
            <CardBody>
              <CardTitle>Booking Information</CardTitle>
              {preBookingData?.map((x, index) => (
                <CardText key={index}>
                  Room No {x?.label} : $ {x?.fields?.amount} x{" "}
                  {x?.totalNoOfDays} Night
                </CardText>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const ClientInfo = ({selectedMember , clientInfo ,setClientInfo}) => { 
  // ** State

  useEffect(() => {
    if (selectedMember) {
      const data = JSON.parse(selectedMember.data);
      setClientInfo(data);
    } else {
      setClientInfo(null);
    }
  }, [selectedMember]);
  

  return (
    <>
      
      <CardTitle>Selected Member details</CardTitle>
      {clientInfo ? (
        <>
          <Row>
            {/* Left Section */}
            <Col md="6">
              {[
                {
                  label: "First Name",
                  value: clientInfo?.firstName,
                },
                {
                  label: "Last Name",
                  value: clientInfo?.lastName,
                },
                { label: "Email", value: clientInfo?.emailId }, // FIXED KEY
                { label: "Address", value: clientInfo?.address },
              ].map((item, index) => (
                <Row key={index} className="mb-1 align-items-center">
                  <Col sm="5" className="fw-bolder">
                    {item.label}:
                  </Col>
                  <Col sm="7">
                    {item.value !== undefined &&
                    item.value !== null &&
                    item.value !== ""
                      ? item.value
                      : "null"}
                  </Col>
                </Row>
              ))}
            </Col>

            {/* Right Section */}
            <Col md="6">
              {[
                {
                  label: "Mobile Number",
                  value:
                    `${clientInfo?.countryCode ?? ""} ${
                      clientInfo?.phoneNumber ?? ""
                    }`.trim() || "null",
                },
                { label: "State", value: clientInfo?.state },
                { label: "Country", value: clientInfo?.country },
                {
                  label: "Postal Code",
                  value: clientInfo?.postalCode,
                },
              ].map((item, index) => (
                <Row key={index} className="mb-1 align-items-center">
                  <Col sm="5" className="fw-bolder">
                    {item.label}:
                  </Col>
                  <Col sm="7">
                    {item.value !== undefined &&
                    item.value !== null &&
                    item.value !== ""
                      ? item.value
                      : "null"}
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        </>
      ) : (
        <p>No client selected.</p>
      )}
      
    </>
  );
};

export { CheckoutInfo, ClientInfo };
