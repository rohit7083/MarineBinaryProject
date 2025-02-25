// // ** React Imports
// import { useEffect, useRef, useState } from 'react'

// // ** Custom Components
// import Wizard from '@components/wizard'

// import useJwt from "@src/auth/jwt/useJwt";

// // ** Steps
// import PaymentDetails from "./steps-with-validation/PaymentDetails";
// import DocumentsDetails from "./steps-with-validation/DocumentsDetails";
// import MemberDetails from "./steps-with-validation/MemberDetails";
// import VesselDetails from "./steps-with-validation/VesselDetails";
// import { useLocation, useParams } from 'react-router-dom';

// const WizardHorizontal = () => {
//   // ** Ref
//   const ref = useRef(null);
//   const location = useLocation();
//   const { uid } = useParams();

//   // ** State
//   const [stepper, setStepper] = useState(null);
//   const [slipIID, setSlipIID] = useState("");
//   const [memberID, setMemberID] = useState(null);
//   const [formStatus, setFormstatus] = useState(null);
//   const [formData, setFormData] = useState({
//     vessel: {},
//     member: {},
//     payment: {},
//   });

  
//   useEffect(() => {
  
//     const stepStatuss = location?.state?.stepStatus;
//     setFormstatus(stepStatuss);

//     const fetchData = async () => {
//       try {
//         const response = await useJwt.getslip(uid);
//         const { content } = response.data;
//         const { vessel, member, payment } = content;
     
//         //vessel details
//         vessel.slipName = {
//           label: vessel.slipName,
//           value: content.id,
//           dimensions: content.dimensions,
//         };
//         vessel.dimensionVal = {};

//         Object.keys(content.dimensions).map(
//           (key) => (vessel.dimensionVal[key] = vessel[key])
//         );

//         console.log({ vessel });

//         //member details

//         setFormData({
//           vessel: { ...vessel },
//           member,
//           payment: payment ? { ...payment } : {},
//         });
//       } catch (error) {
//         console.log("Error fetching slip details:", error);
//       }
//     };

//     if (uid) fetchData();
//   }, []);

//   const steps = [
//     {
//       id: 'account-details',
//       title: 'Account Details',
//       subtitle: 'Enter Your Account Details.',
//       content:<VesselDetails
//       stepper={stepper}
//       type="wizard-modern"
//       formData={{ ...formData.vessel }}
//       slipId={uid}
//       setSlipIID={setSlipIID}
//     />
//     },
//     {
//       id: 'personal-info',
//       title: "Member Details",
//       subtitle: 'Add Personal Info',
//       content:   <MemberDetails
//       formData={{ ...formData.member }}
//       slipId={uid}
//       stepper={stepper}
//       type="wizard-modern"
//       slipIID={slipIID}
//       setMemberID={setMemberID}
//     />
//     },
//     {
//       id: 'step-address',
//       title: "Payment Details",
//       subtitle: 'Add Address',
//       content: <PaymentDetails
//       formData={{ ...formData.payment }}
//       slipId={uid}
//       stepper={stepper}
//       slipIID={slipIID}
//       memberID={memberID}
//       formStatus={formStatus}
//       type="wizard-modern"
//     />
//     },
//     {
//       id: 'Add Documents',
//       title: 'Add Documents',
//       subtitle: 'Add Social Links',
//       content:<DocumentsDetails
//       stepper={stepper}
//       type="wizard-modern"
//       slipIID={slipIID}
//     />
//     }
//   ]

//   return (
//     <div className='modern-horizontal-wizard'>
//       <Wizard type="modern-horizontal"  options={{
//           linear: false,
//         }} instance={el => setStepper(el)} ref={ref} steps={steps} />
//     </div>

  
    
//   )
// }

// export default WizardHorizontal



import React, { useState, useRef, useEffect, useMemo } from "react";
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
const [slipIID,setSlipIID]=useState("");
const[memberID,setMemberID]=useState(null);
const [fetchLoader,setFetchLoader]=useState(false);

  const [formData, setFormData] = useState({
    vessel: {},
    member: {},
    payment: {},
  });
  // ** Hooks
  const { uid } = useParams();
  useEffect(() => {

    const fetchData = async () => {
      try {
        setFetchLoader(true);
        const response = await useJwt.getslip(uid);
        const { content } = response.data;
        const { vessel, member, payment } = content;
        console.log("content",content);
        
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
        });
      } catch (error) {
        console.log("Error fetching slip details:", error);
      }finally{
        setFetchLoader(false);
      }
    };

    if (uid) fetchData();
  }, [uid]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // {{debugger}}
  const steps = [
    {
      id: "Vessel-details",
      title: "Vessel Details",
      subtitle: "Enter Your Vessel Details.",
      icon: <FileText size={18} />,
      content: (
        <VesselDetails
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

        />
      ),
    },
    {
      id: "Payment",
      title: "Payment Details",
      subtitle: "Add Payment",
      icon: <MapPin size={18} />,
      content: (
        <PaymentDetails
          formData={{ ...formData.payment }}
          slipId={uid}
          stepper={stepper}
          slipIID={slipIID}
          memberID={memberID}
          type="wizard-modern"
          fetchLoader={fetchLoader}
        />
      ),
    },
    {
      id: "DocumentsDetails",
      title: "Document Details",
      subtitle: "Add Documents",
      icon: <Link size={18} />,
      content: <DocumentsDetails stepper={stepper} type="wizard-modern" slipIID={slipIID} />,
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