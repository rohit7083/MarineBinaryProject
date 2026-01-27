import useJwt from "@src/auth/jwt/useJwt";
import { useState } from "react";
import { Download } from "react-feather";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Spinner,
} from "reactstrap";

function UserData({ active, toggleTab, userDataById, UserDataLoader }) {
  const [isDownloading, setIsDownloading] = useState(false);
  if (!Array.isArray(userDataById)) return null;
  // debugger;
  const eventItems = userDataById.filter(
    (item) => item?.paymentFrom === "event",
  );
  const roomItems = userDataById.filter((item) => item?.paymentFrom === "room");
  const posItems = userDataById.filter((item) => item?.paymentFrom === "pos");
  const slipItems = userDataById.filter((item) => item?.paymentFrom === "slip");
  const parkingPassItems = userDataById.filter(
    (item) => item?.paymentFrom === "parkingPass",
  );

  const sections = [];

  if (slipItems.length)
    sections.push({
      id: "slip",
      label: "Slip",
      content: (
        <SlipSection
          items={slipItems}
          isDownloading={isDownloading}
          setIsDownloading={setIsDownloading}
        />
      ),
    });
  if (eventItems.length)
    sections.push({
      id: "event",
      label: "Event",
      content: <EventSection items={eventItems} />,
    });

  if (roomItems.length)
    sections.push({
      id: "room",
      label: "Room",
      content: <RoomSection items={roomItems} />,
    });

  if (posItems.length)
    sections.push({
      id: "pos",
      label: "POS",
      content: <PosSection items={posItems} />,
    });

  if (parkingPassItems.length)
    sections.push({
      id: "parkingPass",
      label: "Parking Pass",
      content: <ParkingPassSection items={parkingPassItems} />,
    });

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
                    className={`nav-link ${
                      active === section?.id ? "active" : ""
                    }`}
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

/* ────────────────────────────────────────────────
   HELPER COMPONENTS
──────────────────────────────────────────────── */

function DetailPair({ label, value }) {
  return (
    <p>
      <strong>{label}:</strong> {value ?? "N/A"}
    </p>
  );
}

function StatusBadge({ status }) {
  if (!status) status = "Unknown";

  const s = status.toLowerCase().trim();

  const color =
    s === "success"
      ? "bg-success"
      : s === "paymentlink"
      ? "bg-warning"
      : s === "failed"
      ? "bg-danger"
      : "bg-secondary";

  return (
    <p>
      <strong>Status:</strong>{" "}
      <span className={`badge ${color}`}>{status}</span>
    </p>
  );
}

/* ────────────────────────────────────────────────
   EVENT SECTION
──────────────────────────────────────────────── */

function EventSection({ items }) {
  const [open, setOpen] = useState("");

  const toggle = (id) => setOpen(open === id ? "" : id);

  return (
    <div>
      <h4 className="fw-bolder border-bottom pb-50 mb-2">Event Details</h4>

      <Accordion open={open} toggle={toggle}>
        {items.map((item, index) => {
          const id = String(index);
          return (
            <AccordionItem key={id}>
              <AccordionHeader targetId={id}>
                {item.eventName || `Event ${index + 1}`}
              </AccordionHeader>

              <AccordionBody accordionId={id}>
                <DetailPair label="Type" value={item.eventType} />
                <DetailPair label="Payment Date" value={item.paymentDate} />
                <DetailPair label="Payment Month" value={item.paymentMonth} />
                <DetailPair label="Payment Mode" value={item.paymentMode} />
                <StatusBadge status={item.paymentStatus} />
              </AccordionBody>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

/* ────────────────────────────────────────────────
   ROOM SECTION
──────────────────────────────────────────────── */

function RoomSection({ items }) {
  const [open, setOpen] = useState("");
  const toggle = (id) => setOpen(open === id ? "" : id);

  return (
    <div>
      <h4 className="fw-bolder border-bottom pb-50 mb-2">Room Details</h4>

      <Accordion open={open} toggle={toggle}>
        {items.map((item, index) => {
          const id = String(index);

          return (
            <AccordionItem key={id}>
              <AccordionHeader targetId={id}>
                {item.roomname || `Room ${index + 1}`}
              </AccordionHeader>

              <AccordionBody accordionId={id}>
                <DetailPair label="Payment Date" value={item.paymentDate} />
                <DetailPair label="Payment Mode" value={item.paymentMode} />
                <StatusBadge status={item.paymentStatus} />
                <DetailPair label="Payment Month" value={item.paymentMonth} />
                <DetailPair label="Rent" value={item.rent} />
                <DetailPair label="Receipt No" value={item.receiptNo} />
              </AccordionBody>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

/* ────────────────────────────────────────────────
   SLIP SECTION
──────────────────────────────────────────────── */

function SlipSection({ items, setIsDownloading, isDownloading }) {
  const [open, setOpen] = useState("");

  const toggle = (id) => setOpen(open === id ? "" : id);
  const handleDownload = async (item) => {
  try {
    setIsDownloading(true);

    const res = await useJwt.downloadReceipt(item?.receiptNo);

    if (res?.status === 200) {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `receipt_${item?.receiptNo}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileURL);

      toast.success("Receipt downloaded successfully");
    }
  } catch (error) {
    console.error(error);
  } finally {
    setIsDownloading(false);
  }
};


  return (
    <div>
      <h4 className="fw-bolder border-bottom pb-50 mb-2">Slip Details</h4>

      <Accordion open={open} toggle={toggle}>
        {items.map((item, index) => {
          const id = String(index);

          return (
            <AccordionItem key={id}>
              <AccordionHeader targetId={id}>
                {item.slipName || `Slip ${index + 1}`}
              </AccordionHeader>

              <AccordionBody accordionId={id}>
                <DetailPair label="Slip Name" value={item.slipName} />
                <DetailPair label="Payment Date" value={item.paymentDate} />
                <DetailPair label="Payment Mode" value={item.paymentMode} />
                <DetailPair label="Billing Cycle" value={item.paidIn} />
                <StatusBadge status={item.paymentStatus} />
                <DetailPair label="Payment Month" value={item.paymentMonth} />
                <DetailPair
                  label="Next Payment Date"
                  value={item.nextPaymentDate}
                />
                <DetailPair label="Slip Rent" value={item.rent} />
                <DetailPair label="Receipt No" value={item.receiptNo} />
                <DetailPair label="Lease Type" value={item.slipCategory} />
                <DetailPair label="Contract Dates" value={item.contractDate} />
                <Button
                  color="primary"
                  size="sm"
                  disabled={isDownloading}
                  onClick={() => handleDownload(item, index)}
                >
                  {isDownloading ? (
                    <>
                      <Spinner size="sm" /> Downloading...{" "}
                    </>
                  ) : (
                    <><Download className="me-50" size={14} /> Download Receipt</>
                  )}
                </Button>
              </AccordionBody>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

/* ────────────────────────────────────────────────
   POS SECTION
──────────────────────────────────────────────── */

function PosSection({ items }) {
  const [open, setOpen] = useState("");
  const toggle = (id) => setOpen(open === id ? "" : id);

  return (
    <div>
      <h4 className="fw-bolder border-bottom pb-50 mb-2">POS Details</h4>

      <Accordion open={open} toggle={toggle}>
        {items.map((item, index) => {
          const id = String(index);

          return (
            <AccordionItem key={id}>
              <AccordionHeader targetId={id}>
                {item.pos || `POS ${index + 1}`}
              </AccordionHeader>

              <AccordionBody accordionId={id}>
                <DetailPair label="POS Name" value={item.pos} />
                <DetailPair label="Payment Date" value={item.paymentDate} />
                <DetailPair label="Payment Mode" value={item.paymentMode} />
                <StatusBadge status={item.paymentStatus} />
                <DetailPair label="Payment Month" value={item.paymentMonth} />
                <DetailPair label="Rent" value={item.rent} />
                <DetailPair label="Receipt No" value={item.receiptNo} />
              </AccordionBody>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

/* ────────────────────────────────────────────────
   PARKING PASS SECTION
──────────────────────────────────────────────── */

function ParkingPassSection({ items }) {
  const [open, setOpen] = useState("");
  const toggle = (id) => setOpen(open === id ? "" : id);

  return (
    <div>
      <h4 className="fw-bolder border-bottom pb-50 mb-2">
        Parking Pass Details
      </h4>

      <Accordion open={open} toggle={toggle}>
        {items.map((item, index) => {
          const id = String(index);

          return (
            <AccordionItem key={id}>
              <AccordionHeader targetId={id}>
                {item.parkingPass || `Parking Pass ${index + 1}`}
              </AccordionHeader>

              <AccordionBody accordionId={id}>
                <DetailPair label="Parking Pass" value={item.parkingPass} />
                <DetailPair label="Payment Date" value={item.paymentDate} />
                <DetailPair label="Payment Mode" value={item.paymentMode} />
                <StatusBadge status={item.paymentStatus} />
                <DetailPair label="Payment Month" value={item.paymentMonth} />
                <DetailPair label="Rent" value={item.rent} />
                <DetailPair label="Receipt No" value={item.receiptNo} />
              </AccordionBody>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default UserData;
