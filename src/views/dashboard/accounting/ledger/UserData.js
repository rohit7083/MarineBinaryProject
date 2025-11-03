import { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Spinner } from "reactstrap";

function UserData({ active, toggleTab, userDataById, UserDataLoader }) {
  if (!Array.isArray(userDataById)) return null;

  const eventItems = userDataById.filter((item) => "eventName" in item);
  const roomItems = userDataById.filter((item) => "roomname" in item);

  const sections = [];

  // ---------- EVENT SECTION ----------
  if (eventItems.length > 0) {
    sections.push({
      id: "event",
      label: "Event",
      content: <EventSection items={eventItems} />,
    });
  }

  // ---------- ROOM SECTION ----------
  if (roomItems.length > 0) {
    sections.push({
      id: "room",
      label: "Room",
      content: <RoomSection items={roomItems} />,
    });
  }

  // ---------- RENDER ----------
  return (
    <div className="card">
      {UserDataLoader ? (
        <div className="card-body text-center">
          <p>Loading...</p>
          <Spinner color="primary" size="sm" />
        </div>
      ) : (
        <>
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs">
              {sections.map((section) => (
                <li className="nav-item" key={section.id}>
                  <button
                    className={`nav-link ${active === section.id ? "active" : ""}`}
                    onClick={() => toggleTab(section.id)}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-body">
            {sections.find((s) => s.id === active)?.content || (
              <p className="text-center text-muted">
                No information to display.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- EVENT SECTION (Accordion) ----------
function EventSection({ items }) {
  const [open, setOpen] = useState("0");

  const toggle = (id) => {
    setOpen(open === id ? "" : id);
  };

  return (
    <div>
      <h4 className="fw-bolder border-bottom pb-50 mb-2">Event Details</h4>
      <Accordion open={open} toggle={toggle}>
        {items.map((item, index) => (
          <AccordionItem key={index}>
            <AccordionHeader targetId={String(index)}>
              {item.eventName || `Event ${index + 1}`}
            </AccordionHeader>
            <AccordionBody accordionId={String(index)}>
              <p>
                <strong>Type:</strong> {item.eventType || "N/A"}
              </p>
              <p>
                <strong>Payment Date:</strong>{" "}
                {item.paymentDate
                  ? (() => {
                      const [date, time] = item.paymentDate.split("T");
                      const formattedTime = time?.split(".")[0];
                      return `${date} ${formattedTime}`;
                    })()
                  : "N/A"}
              </p>
              <p>
                <strong>Payment Month:</strong> {item.paymentMonth || "N/A"}
              </p>
              <p>
                <strong>Payment Mode:</strong> {item.paymentMode || "N/A"}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  className={`badge ${
                    item.paymentStatus?.toLowerCase() === "success "
                      ? "bg-success"
                      : item.paymentStatus?.toLowerCase() === "PaymentLink"
                      ? "bg-warning"
                      : item.paymentStatus?.toLowerCase() === "failed"
                      ? "bg-danger"
                      : "bg-secondary"
                  }`}
                >
                  {item.paymentStatus || "Unknown"}
                </span>
              </p>
            </AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// ---------- ROOM SECTION ----------
function RoomSection({ items }) {
  return (
    <div>
      <h4 className="fw-bolder border-bottom pb-50 mb-2">Room Details</h4>
      {items.map((item, index) => (
        <div key={index} className="mb-2 border-bottom pb-1">
          <p>
            <strong>Room Name:</strong> {item.roomname}
          </p>
          {item.capacity && (
            <p>
              <strong>Capacity:</strong> {item.capacity}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserData;
