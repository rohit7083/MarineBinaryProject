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
  const slipNameFromDashboard=location?.state?.formDataFromDashboard;
  const uid = location.state?.uid || slipNameFromDashboard?.uid;
  useEffect(() => {
    const fetchData = async () => {
      try {

        setFetchLoader(true);
        const response = await useJwt.getslip(uid);
        const { content } = response.data;
        const { vessel, member, payment } = content || slipNameFromDashboard;
        
        console.log("conntent Slip id ", content);
        setId(content);
        // vessel details
        vessel.slipName = {
          label: vessel.slipName,
          value: content.id,
          dimensions: content.dimensions,
        };
        vessel.dimensionVal = {};

        Object.keys(content.dimensions).map(
          (key) => (vessel.dimensionVal[key] = vessel[key])
        );

        setFormData({
          vessel: { ...vessel },
          member,
          payment: payment ? { ...payment } : {},
          documents: document ? { ...document } : {},
        });
      } catch (error) {
        console.log("Error fetching slip details:", error);
      } finally {
        setFetchLoader(false);
      }
    };

    if (uid) fetchData();
  }, [uid]);

  useEffect(() => {
    console.log(formData);
    console.log("memeber id from index", memberID);
  }, [formData]);

  console.log("sui", sId);

  const steps = [
    {
      id: "Vessel-details",
      title: "Vessel Details",
      subtitle: "Enter Your Vessel Details.",
      icon: <File size={18} />,
      content: (
        <VesselDetails
        slipNameFromDashboard={slipNameFromDashboard}
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
          stepper={stepper}
          type="wizard-modern"
          slipIID={slipIID}
          setMemberID={setMemberID}
          memberID={memberID}
          fetchLoader={fetchLoader}
          sId={sId?.id}
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
