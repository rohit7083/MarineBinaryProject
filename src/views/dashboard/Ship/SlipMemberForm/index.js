import React, { useState, useRef } from "react";
import PaymentDetails from "./steps-with-validation/PaymentDetails";
import DocumentsDetails from "./steps-with-validation/DocumentsDetails";
import MemberDetails from "./steps-with-validation/MemberDetails";
import VesselDetails from "./steps-with-validation/VesselDetails";

// ** Custom Components
import Wizard from "@components/wizard";

// ** Icons Imports
import { FileText, User, MapPin, Link } from "react-feather";

const WizardModern = () => {
  // ** Ref
  const ref = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);
  const [slipId, setSlipId] = useState(null); // Store slipId state in parent

  const steps = [
    {
      id: "Vessel-details",
      title: "Vessel Details",
      subtitle: "Enter Your Vessel Details.",
      icon: <FileText size={18} />,
      content: (
        <VesselDetails
          stepper={stepper}
          setSlipId={setSlipId}
          type="wizard-modern"
        />
      ),
    },
    {
      id: "Member-info",
      title: "Member Details",
      subtitle: "Add Member Info",
      icon: <User size={18} />,
      content: (
        <MemberDetails stepper={stepper} slipId={slipId} type="wizard-modern" />
      ),
    },
    // {
    //   id: "Payment",
    //   title: "Payment Details",
    //   subtitle: "Add Payment",
    //   icon: <MapPin size={18} />,
    //   content: <PaymentDetails stepper={stepper} type="wizard-modern" />,
    // },
    {
      id: "DocumentsDetails",
      title: "Document Details",
      subtitle: "Add Documents",
      icon: <Link size={18} />,
      content: <DocumentsDetails stepper={stepper} type="wizard-modern" />,
    },
  ];

  return (
    <div className="modern-horizontal-wizard">
      <Wizard
        type="modern-horizontal"
        ref={ref}
        steps={steps}
        options={{
          linear: false,
        }}
        instance={(el) => setStepper(el)}
      />
    </div>
  );
};

export default WizardModern;
