import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import DocumentsDetails from "./steps-with-validation/DocumentsDetails";
import MemberDetails from "./steps-with-validation/MemberDetails";
import PaymentDetails from "./steps-with-validation/PaymentDetails";
import VesselDetails from "./steps-with-validation/VesselDetails";
// ** Custom Components
import Wizard from "@components/wizard";

// ** Jwt Clss
import useJwt from "@src/auth/jwt/useJwt";

// ** Icons Imports
import { CreditCard, File, FileText, User } from "react-feather";

const WizardModern = () => {
  // ** RefselectedSlipname
  const ref = useRef(null);
  const [stepper, setStepper] = useState(null);
  const [slipIID, setSlipIID] = useState("");
  const [memberID, setMemberID] = useState(null);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [sId, setId] = useState(null);
  const [formData, setFormData] = useState({
    vessel: {},
    member: {},
    payment: {},
    documents: {},
  });
  // ** Hooks
  // const { uid } = useParams();
  const location = useLocation();
  const waitingSlipData = location?.state?.row;
  const slipNameFromDashboard = location?.state?.formDataFromDashboard;
  const uid = location.state?.uid || slipNameFromDashboard?.uid;
  const isAssigned = location.state?.isAssigned;
  const isRevenu = location.state?.isRevenu;
  const [isAssignedStatus, setIsAssignedStatus] = useState(isAssigned);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoader(true);
       
        const response = await useJwt.retriveSlip(uid);
        const raw = response.data?.content;

        // const result = Array.isArray(raw) ? raw[0] : null;
        const { vessel, member, payment } = raw || slipNameFromDashboard;

        setId(raw);
        // vessel details
        vessel.slipName = {
          label: vessel.slipName,
          value: raw.id,
          dimensions: raw.dimensions,
        };
        vessel.dimensionVal = {};

        Object.keys(raw.dimensions).map(
          (key) => (vessel.dimensionVal[key] = vessel[key])
        );

        setFormData({
          vessel: { ...vessel },
          member,
          payment: payment ? { ...payment } : {},
          documents: document ? { ...document } : {},
        });
      } catch (error) {
         ("Error fetching slip details:", error);
      } finally {
        setFetchLoader(false);
      }
    };

    if (uid) fetchData();
  }, [uid, isAssignedStatus]);

  useEffect(() => {
     (formData);
     ("memeber id from index", memberID);
  }, [formData]);

   ("sui", sId);

  const steps = [
    {
      id: "Vessel-details",
      title: "Vessel Details",
      subtitle: "Enter Your Vessel Details.",
      icon: <File size={18} />,
      content: (
        <VesselDetails
          slipNameFromDashboard={slipNameFromDashboard}
          waitingSlipData={waitingSlipData}
          stepper={stepper}
          type="wizard-modern"
          formData={{ ...formData.vessel }}
          slipId={uid}
          setSlipIID={setSlipIID}
          fetchLoader={fetchLoader}
        />
      ),
    },
    {
      id: "Member-info",
      title: "Member Details",
      subtitle: "Add Member Info",
      icon: <User size={18} />,
      content: (
        <MemberDetails
          formData={{ ...formData.member }}
          slipId={uid}
          isAssigned={isAssigned}
          isRevenu={isRevenu}
          stepper={stepper}
          type="wizard-modern"
          slipIID={slipIID}
          setMemberID={setMemberID}
          memberID={memberID}
          waitingSlipData={waitingSlipData}
          fetchLoader={fetchLoader}
          sId={sId?.id}
          setIsAssignedStatus={setIsAssignedStatus}
        />
      ),
    },
    {
      id: "Payment",
      title: "Payment Details",
      subtitle: "Add Payment",
      icon: <CreditCard size={18} />,
      content: (
        <PaymentDetails
          formData={{ ...formData.payment }}
          slipId={uid}
          stepper={stepper}
          slipIID={slipIID}
          memberID={memberID}
          type="wizard-modern"
          fetchLoader={fetchLoader}
          isAssigned={sId}
          sId={sId?.id}
          mId={sId?.member?.id}
          member={sId?.member}
          isAssignedStatus={isAssignedStatus}
        />
      ),
    },
    {
      id: "DocumentsDetails",
      title: "Document Details",
      subtitle: "Add Documents",
      icon: <FileText size={18} />,
      content: (
        <DocumentsDetails
          formDataParent={{ ...formData.documents }}
          stepper={stepper}
          type="wizard-modern"
          slipIID={slipIID}
          sId={sId}
          Parentdocuments={sId?.documents}
        />
      ),
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
