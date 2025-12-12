// import { useState } from "react";
// import {
//   Accordion,
//   AccordionBody,
//   AccordionHeader,
//   AccordionItem,
//   Spinner,
// } from "reactstrap";

// function UserData({ active, toggleTab, userDataById, UserDataLoader }) {
//   if (!Array.isArray(userDataById)) return null;
//   const eventItems = userDataById.filter(
//     (item) => item?.paymentFrom === "event"
//   );
//   const roomItems = userDataById.filter((item) => item?.paymentFrom === "room");
//   const posItem = userDataById.filter((item) => item?.paymentFrom === "pos");
//   const slipItem = userDataById.filter(
//     (item) => item?.paymentFrom === "switchSlip"
//   );
//   const parkingPassItem = userDataById.filter(
//     (item) => item?.paymentFrom === "parkingPass"
//   );

//   const sections = [];

//   // ---------- EVENT SECTION ----------
//   if (eventItems.length > 0) {
//     sections.push({
//       id: "event",
//       label: "Event",
//       content: <EventSection items={eventItems} />,
//     });
//   }

//   // ---------- ROOM SECTION ----------
//   if (roomItems.length > 0) {
//     sections.push({
//       id: "room",
//       label: "Room",
//       content: <RoomSection items={roomItems} />,
//     });
//   }
//   // ---------- POS SECTION ----------

//   if (posItem.length > 0) {
//     sections.push({
//       id: "pos",
//       label: "Pos",
//       content: <PosSection items={roomItems} />,
//     });
//   }
//   // ---------- slip SECTION ----------

//   if (slipItem.length > 0) {
//     sections.push({
//       id: "switchSlip",
//       label: "Switch Slip",
//       content: <SlipSection items={roomItems} />,
//     });
//   }
//   // ---------- Parking passs SECTION ----------

//   if (parkingPassItem.length > 0) {
//     sections.push({
//       id: "parkingPass",
//       label: "Parking Pass",
//       content: <ParkingPassSection items={roomItems} />,
//     });
//   }

//   // ---------- RENDER ----------
//   return (
//     <div className="card">
//       {UserDataLoader ? (
//         <div className="card-body text-center">
//           <p>Loading...</p>
//           <Spinner color="primary" size="sm" />
//         </div>
//       ) : (
//         <>
//           <div className="card-header">
//             <ul className="nav nav-tabs card-header-tabs">
//               {sections.map((section) => (
//                 <li className="nav-item" key={section.id}>
//                   <button
//                     className={`nav-link ${
//                       active === section.id ? "active" : ""
//                     }`}
//                     onClick={() => toggleTab(section.id)}
//                   >
//                     {section.label}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="card-body">
//             {sections.find((s) => s.id === active)?.content || (
//               <p className="text-center text-muted">
//                 No information to display.
//               </p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
//   const [open, setOpen] = useState("0");

// // ---------- EVENT SECTION (Accordion) ----------
// function EventSection({ items }) {

//   const toggle = (id) => {
//     setOpen(open === id ? "" : id);
//   };

//   return (
//     <div>
//       <h4 className="fw-bolder border-bottom pb-50 mb-2">Event Details</h4>
//       <Accordion open={open} toggle={toggle}>
//         {items.map((item, index) => (
//           <AccordionItem key={index}>
//             <AccordionHeader targetId={String(index)}>
//               {item.eventName || `Event ${index + 1}`}
//             </AccordionHeader>
//             <AccordionBody accordionId={String(index)}>
//               <p>
//                 <strong>Type:</strong> {item.eventType || "N/A"}
//               </p>
//               <p>
//                 <strong>Payment Date:</strong>{" "}
//                 {item.paymentDate
//                   ? (() => {
//                       const [date, time] = item.paymentDate.split("T");
//                       const formattedTime = time?.split(".")[0];
//                       return `${date} ${formattedTime}`;
//                     })()
//                   : "N/A"}
//               </p>
//               <p>
//                 <strong>Payment Month:</strong> {item.paymentMonth || "N/A"}
//               </p>
//               <p>
//                 <strong>Payment Mode:</strong> {item.paymentMode || "N/A"}
//               </p>
//               <p>
//                 <strong>Payment Status:</strong>{" "}
//                 <span
//                   className={`badge ${
//                     item.paymentStatus?.toLowerCase() === "success "
//                       ? "bg-success"
//                       : item.paymentStatus?.toLowerCase() === "PaymentLink"
//                       ? "bg-warning"
//                       : item.paymentStatus?.toLowerCase() === "failed"
//                       ? "bg-danger"
//                       : "bg-secondary"
//                   }`}
//                 >
//                   {item.paymentStatus || "Unknown"}
//                 </span>
//               </p>
//             </AccordionBody>
//           </AccordionItem>
//         ))}
//       </Accordion>
//     </div>
//   );
// }

// // ---------- ROOM SECTION ----------
// function RoomSection({ items }) {
//   return (
//     <div>
//       <h4 className="fw-bolder border-bottom pb-50 mb-2">Room Details</h4>
//       {items.map((item, index) => (
//         <div key={index} className="mb-2 border-bottom pb-1">
//           {/* <p>
//             <strong>Room Name:</strong> {item.roomname}
//           </p> */}
//           <p>
//             <strong>Payment Date:</strong> {item.paymentDate}
//           </p>
//           <p>
//             <strong>Payment Mode:</strong> {item.paymentMode}
//           </p>
//           <p>
//             <strong>Payment Status:</strong>{" "}
//             <span
//               className={`badge ${
//                 item.paymentStatus?.toLowerCase() === "success"
//                   ? "bg-success"
//                   : item.paymentStatus?.toLowerCase() === "PaymentLink"
//                   ? "bg-warning"
//                   : item.paymentStatus?.toLowerCase() === "failed"
//                   ? "bg-danger"
//                   : "bg-secondary"
//               }`}
//             >
//               {item.paymentStatus || "Unknown"}
//             </span>
//           </p>
//           <p>
//             <strong>Payment Month:</strong> {item.paymentMonth}
//           </p>
//           <p>
//             <strong>Rent:</strong> {item.rent}
//           </p>

//           <p>
//             <strong>Receipt No:</strong> {item.receiptNo}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ---------- Slip SECTION ----------
// function SlipSection({ items }) {
//   return (
//     <div>
//       <h4 className="fw-bolder border-bottom pb-50 mb-2">Slip Details</h4>
//       {items.map((item, index) => (
//         <div key={index} className="mb-2 border-bottom pb-1">
//           <p>
//             <strong>slipName:</strong> {item.roomname}
//           </p>
//           <p>
//             <strong>Payment Date:</strong> {item.paymentDate}
//           </p>
//           <p>
//             <strong>Payment Mode:</strong> {item.paymentMode}
//           </p>
//           <p>
//             <strong>Billing Cycle:</strong> {item.paidIn}
//           </p>

//           <p>
//             <strong>Payment Status:</strong>{" "}
//             <span
//               className={`badge ${
//                 item.paymentStatus?.toLowerCase() === "success"
//                   ? "bg-success"
//                   : item.paymentStatus?.toLowerCase() === "PaymentLink"
//                   ? "bg-warning"
//                   : item.paymentStatus?.toLowerCase() === "failed"
//                   ? "bg-danger"
//                   : "bg-secondary"
//               }`}
//             >
//               {item.paymentStatus || "Unknown"}
//             </span> 
//           </p>
//           <p>
//             <strong>Payment Month:</strong> {item.paymentMonth}
//           </p>
//           <p>
//             <strong>Next Payment Date:</strong> {item.nextPaymentDate}
//           </p>

//           <p>
//             <strong>Slip Rent:</strong> {item.rent}
//           </p>

//           <p>
//             <strong>Receipt No:</strong> {item.receiptNo}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ---------- POS SECTION ----------
// function PosSection({ items }) {
//   return (
//     <div>
//       <h4 className="fw-bolder border-bottom pb-50 mb-2">POS Details</h4>
//       {items.map((item, index) => (
//         <div key={index} className="mb-2 border-bottom pb-1">
//           <p>
//             <strong>Pos Name:</strong> {item.pos}
//           </p>
//           <p>
//             <strong>Payment Date:</strong> {item.paymentDate}
//           </p>
//           <p>
//             <strong>Payment Mode:</strong> {item.paymentMode}
//           </p>
//           <p>
//             <strong>Payment Status:</strong>{" "}
//             <span
//               className={`badge ${
//                 item.paymentStatus?.toLowerCase() === "success"
//                   ? "bg-success"
//                   : item.paymentStatus?.toLowerCase() === "PaymentLink"
//                   ? "bg-warning"
//                   : item.paymentStatus?.toLowerCase() === "failed"
//                   ? "bg-danger"
//                   : "bg-secondary"
//               }`}
//             >
//               {item.paymentStatus || "Unknown"}
//             </span>
//           </p>
//           <p>
//             <strong>Payment Month:</strong> {item.paymentMonth}
//           </p>
//           <p>
//             <strong>Rent:</strong> {item.rent}
//           </p>

//           <p>
//             <strong>Receipt No:</strong> {item.receiptNo}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ---------- Parking pass SECTION ----------
// function ParkingPassSection({ items }) {
//   return (
//     <div>
//       <h4 className="fw-bolder border-bottom pb-50 mb-2">Parking Pass Details</h4>
//       {items.map((item, index) => (
//         <div key={index} className="mb-2 border-bottom pb-1">
//           <p>
//             <strong>Parking Pass Name:</strong> {item.parkingPass}
//           </p>
//           <p>
//             <strong>Payment Date:</strong> {item.paymentDate}
//           </p>
//           <p>
//             <strong>Payment Mode:</strong> {item.paymentMode}
//           </p>
//           <p>
//             <strong>Payment Status:</strong>{" "}
//             <span
//               className={`badge ${
//                 item.paymentStatus?.toLowerCase() === "success"
//                   ? "bg-success"
//                   : item.paymentStatus?.toLowerCase() === "PaymentLink"
//                   ? "bg-warning"
//                   : item.paymentStatus?.toLowerCase() === "failed"
//                   ? "bg-danger"
//                   : "bg-secondary"
//               }`}
//             >
//               {item.paymentStatus || "Unknown"}
//             </span>
//           </p>
//           <p>
//             <strong>Payment Month:</strong> {item.paymentMonth}
//           </p>
//           <p>
//             <strong>Rent:</strong> {item.rent}
//           </p>

//           <p>
//             <strong>Receipt No:</strong> {item.receiptNo}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default UserData;



import { useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Spinner,
} from "reactstrap";

function UserData({ active, toggleTab, userDataById, UserDataLoader }) {
  if (!Array.isArray(userDataById)) return null;

  const eventItems = userDataById.filter((item) => item?.paymentFrom === "event");
  const roomItems = userDataById.filter((item) => item?.paymentFrom === "room");
  const posItems = userDataById.filter((item) => item?.paymentFrom === "pos");
  const slipItems = userDataById.filter((item) => item?.paymentFrom === "switchSlip");
  const parkingPassItems = userDataById.filter(
    (item) => item?.paymentFrom === "parkingPass"
  );

  const sections = [];

  if (eventItems.length)
    sections.push({ id: "event", label: "Event", content: <EventSection items={eventItems} /> });

  if (roomItems.length)
    sections.push({ id: "room", label: "Room", content: <RoomSection items={roomItems} /> });

  if (posItems.length)
    sections.push({ id: "pos", label: "POS", content: <PosSection items={posItems} /> });

  if (slipItems.length)
    sections.push({ id: "switchSlip", label: "Switch Slip", content: <SlipSection items={slipItems} /> });

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
              <p className="text-center text-muted">No information to display.</p>
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

function SlipSection({ items }) {
  const [open, setOpen] = useState("");
  const toggle = (id) => setOpen(open === id ? "" : id);

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
                <DetailPair label="Slip Name" value={item.roomname} />
                <DetailPair label="Payment Date" value={item.paymentDate} />
                <DetailPair label="Payment Mode" value={item.paymentMode} />
                <DetailPair label="Billing Cycle" value={item.paidIn} />
                <StatusBadge status={item.paymentStatus} />
                <DetailPair label="Payment Month" value={item.paymentMonth} />
                <DetailPair label="Next Payment Date" value={item.nextPaymentDate} />
                <DetailPair label="Slip Rent" value={item.rent} />
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
      <h4 className="fw-bolder border-bottom pb-50 mb-2">Parking Pass Details</h4>

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
