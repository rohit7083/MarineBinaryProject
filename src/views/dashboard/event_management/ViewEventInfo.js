import useJwt from "@src/auth/jwt/useJwt";
import { useEffect, useState } from "react";
import { Eye } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
function ViewEventInfo({ paymentHistoryData }) {
  const [documents, setDocuments] = useState([]);

  const eventData = {
    eventName: paymentHistoryData?.eventName || "-",
    eventType: paymentHistoryData?.eventType?.eventTypeName || "-",
    startDateTime:
      paymentHistoryData?.eventStartDate && paymentHistoryData?.eventStartTime
        ? `${paymentHistoryData.eventStartDate} ${paymentHistoryData.eventStartTime}`
        : paymentHistoryData?.eventStartDate ||
          paymentHistoryData?.eventStartTime ||
          "-",
    endDateTime:
      paymentHistoryData?.eventEndDate && paymentHistoryData?.eventEndTime
        ? `${paymentHistoryData.eventEndDate} ${paymentHistoryData.eventEndTime}`
        : paymentHistoryData?.eventEndDate ||
          paymentHistoryData?.eventEndTime ||
          "-",
    vendorDetails:
      paymentHistoryData?.vendors
        ?.map((vendor) => {
          const name = vendor?.vendorName || "";
          const companyName = vendor?.companyName || "";
          const phone = vendor?.phoneNumber || "";
          const code = vendor?.countryCode || "";
          const type = vendor?.vendorType || "";
          return `${name} ${companyName} ${type} (${code}${phone})`;
        })
        .filter(Boolean)
        .join(", ") || "-",
    venueName: paymentHistoryData?.venue?.venueName || "-",
  };

  const handleViewDocument = (url) => {
    if (!url) {
      alert("Document not available.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const eventDocs = paymentHistoryData?.eventDocuments;
        if (!eventDocs?.length) return;

        const responses = await Promise.all(
          eventDocs.map(async (doc) => {
            const res = await useJwt.getEventDocument(doc.uid);
            const blob = res.data;
            return {
              name: doc.documentName,
              uid: doc.uid,
              url: URL.createObjectURL(blob),
            };
          })
        );

        setDocuments(responses);

        // Cleanup to avoid memory leaks
        return () => {
          responses.forEach((file) => URL.revokeObjectURL(file.url));
        };
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    if (paymentHistoryData?.eventDocuments?.length) {
      fetchDocuments();
    }
  }, [paymentHistoryData]);

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <CardTitle tag="h5" className="mb-0">
          Event Information
        </CardTitle>
      </CardHeader>

      <CardBody>
        <Row className="gy-2">
          <Col md={6}>
            <strong>Event Name:</strong> {eventData.eventName}
          </Col>
          <Col md={6}>
            <strong>Event Type:</strong> {eventData.eventType}
          </Col>
          <Col md={6}>
            <strong>Start Date & Time:</strong> {eventData.startDateTime}
          </Col>
          <Col md={6}>
            <strong>End Date & Time:</strong> {eventData.endDateTime}
          </Col>
          <Col md={6}>
            <strong>Vendor Name:</strong> {eventData.vendorDetails}
          </Col>
          <Col md={6}>
            <strong>Venue Name:</strong> {eventData.venueName}
          </Col>

          <Col md={12} className="mt-2  ">
            <strong>Documents:</strong>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <>
                    {" "}
                    <Button
                      key={doc.uid}
                      color="primary"
                      size="sm"
                      onClick={() => handleViewDocument(doc.url)}
                    >
                      <Eye size={13} /> {doc.name}
                    </Button>
                  </>
                ))
              ) : (
                <span className="text-muted">No documents available</span>
              )}
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

export default ViewEventInfo;
