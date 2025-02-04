import React, { useState, useRef, useEffect } from "react";
import PaymentDetails from "./steps-with-validation/PaymentDetails";
import DocumentsDetails from "./steps-with-validation/DocumentsDetails";
import MemberDetails from "./steps-with-validation/MemberDetails";
import VesselDetails from "./steps-with-validation/VesselDetails";

// ** Custom Components
import Wizard from "@components/wizard";

// ** Jwt Clss
import useJwt from "@src/auth/jwt/useJwt";

// ** Icons Imports
import { FileText, User, MapPin, Link } from "react-feather";
import { useParams } from "react-router-dom";

const WizardModern = () => {
  // ** RefselectedSlipname
  const ref = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);
  const [slipId, setSlipId] = useState(null);
  const [formDetails, setFormDetails] = useState({
    vsDetails: {
      slipId: 0,
      vesselName: "",
      vesselRegistrationNumber: "",
      vesselWidth: 0,
      vesselHeight: 0,
    },
    mmDetails: {},
    pyDetails: {},
    dcDetails: {},
  });

  // ** Hooks
  const params = useParams();

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
    {
      id: "Payment",
      title: "Payment Details",
      subtitle: "Add Payment",
      icon: <MapPin size={18} />,
      content: <PaymentDetails stepper={stepper} type="wizard-modern" />,
    },
    {
      id: "DocumentsDetails",
      title: "Document Details",
      subtitle: "Add Documents",
      icon: <Link size={18} />,
      content: <DocumentsDetails stepper={stepper} type="wizard-modern" />,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response = await useJwt.getslip(params.uid);
        const { content } = response.data;
        const { vess } = content;

        const tempKey = { ...formDetails };

        const { vsDetails, mmDetails, pyDetails, dcDetails } = tempKey;

        const updatedDetails = [vsDetails, mmDetails, pyDetails, dcDetails].map(
          (obj) => {
            let newObj = { ...obj };
            Object.keys(newObj).forEach((key) => {
              newObj[key] = content[key] ? content[key] : "";
            });
            return newObj;
          }
        );

        [
          tempKey.vsDetails,
          tempKey.mmDetails,
          tempKey.pyDetails,
          tempKey.dcDetails,
        ] = updatedDetails;

        setFormDetails(tempKey);

        console.log("Updated vsDetails:", tempKey.vsDetails);
      } catch (error) {
        console.error("Error fetching slip details:", error);
        alert("An unexpected error occurred");
      }
    };

    if (params.uid) fetchData();
  }, []);

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
