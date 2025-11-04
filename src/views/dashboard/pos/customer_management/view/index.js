import { useState } from "react";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
// import PaymentDetails from "./Pa ymentDetails";
function ExampleAccordion() {
  // start with Payment Details open by default
  const [open, setOpen] = useState(["3"]);
  const navigate = useNavigate();
  const toggle = (id) => {
    // don't allow toggling the permanent panel
    if (id === "3") return;

    setOpen((prev) => {
      const isOpen = prev.includes(id);
      let next;
      if (isOpen) {
        // remove the id (but ensure "3" stays)
        next = prev.filter((x) => x !== id && x !== undefined);
      } else {
        // add the id alongside "3"
        next = [...prev, id];
      }
      // guarantee "3" is present
      if (!next.includes("3")) next = ["3", ...next];
      return next;
    });
  };

  return (
    <>
      <Card>
        <CardBody>
          <CardTitle>
            <ArrowLeft
              style={{
                cursor: "pointer",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
              onClick={() => navigate(-1)}
            />{" "}
            Customer Details
          </CardTitle>

          <Accordion open={open} toggle={toggle}>
            <AccordionItem className="border rounded mb-1">
              <AccordionHeader targetId="1">
                Customer Information
              </AccordionHeader>
              <AccordionBody accordionId="1">
                <p>Name: Rohit Sonawane</p>
                <p>Email: rohit@example.com</p>
              </AccordionBody>
            </AccordionItem>

            <AccordionItem className="border rounded mb-1">
              <AccordionHeader targetId="2">Card Details</AccordionHeader>
              <AccordionBody accordionId="2">
                {/* <CardDetails /> */}
              </AccordionBody>
            </AccordionItem>

            <AccordionItem className="border rounded mb-1">
              <AccordionHeader targetId="3">Payment Details</AccordionHeader>
              <AccordionBody accordionId="3">
                {/* <PaymentDetails /> */}
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
    </>
  );
}

export default ExampleAccordion;
