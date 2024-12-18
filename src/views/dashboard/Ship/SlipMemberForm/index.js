// // ** React Imports
// import { useRef, useState } from 'react'

// // ** Custom Components
// import Wizard from '@components/wizard'

// // ** Steps
// import Address from './steps-with-validation/Address'
// import SocialLinks from './steps-with-validation/SocialLinks'
// import PersonalInfo from './steps-with-validation/PersonalInfo'
// import AccountDetails from './steps-with-validation/AccountDetails'

// const index = () => {

 
  
//   // ** Ref
//   const ref = useRef(null)

//   // ** State
//   const [stepper, setStepper] = useState(null)
//   const steps = [
//     {
//       id: 'Vessel-details',
//       title: 'Vessel details',
//       subtitle: 'Enter Your Vessels Details.',
//       content: <AccountDetails  stepper={stepper} />    

//     },
//     {
//       id: 'Member-info',
//       title: 'Member Details',
//       subtitle: 'Add Member Info',
//       content: <PersonalInfo 
//       stepper={stepper} />
//     },
//     {
//       id: 'Payment',
//       title: 'Payment Details',
//       subtitle: 'Add Payment',
//       content: <Address stepper={stepper} />
//     },
//     {
//       id: 'social-links',
//       title: 'Document Details',
//       subtitle: 'Add Social Links',
//       content: <SocialLinks stepper={stepper} />
//     }

//   ]

//   return (
//     <div className='horizontal-wizard'>
//       <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />
//     </div>
//   )
// }

// export default index
// ** React Imports

// // ** Custom Components
import Wizard from '@components/wizard'

// ** Steps
import React, { useState, useRef } from "react";
import PaymentDetails from "./steps-with-validation/PaymentDetails";
import DocumentsDetails from "./steps-with-validation/DocumentsDetails";
import MemberDetails from "./steps-with-validation/MemberDetails";
import VesselDetails from "./steps-with-validation/VesselDetails";

const Index = () => {
  const ref = useRef(null);
  const [stepper, setStepper] = useState(null);

  // Shared state for all steps
  const [combinedData, setCombinedData] = useState({
    personalInfo: {
      lastName: "",
      firstName: "",
      emailId: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    vesselInfo: {
      vesselName: "",
      vesselRegistrationNumber: "",
      height: "",
      slipName: "",
      width: "",
      length: "",
    },
    paymentInfo: {
      contractDate: "",
      paidIn: "",
      MonYear: "",
      distype: false,
      discountType: "",
      discountAmount: "",
      calDisAmount: "",
      finalPayment: "",
      renewalDate: "",
      nextPaymentDate: "",
      paymentType: "",

      cardType: "",
      cardNumber: "",
      nameOnCard: "",
      cardCvv: "",
      cardExpiryYear: "",
      cardExpiryMonth: "",
      address: "",
      city: "",
      state:"",
      country: "",
      pinCode: "",

      bankName: "",
      nameOnAccount: "",
      routingNumber: "",
      accountNumber: "",
      chequeNumber: "",

      cardSwipeTransactionId: "",
    },
  });



  // Wizard steps configuration
  const steps = [
    {
      id: "Vessel-details",
      title: "Vessel Details",
      subtitle: "Enter Your Vessel Details.",
      content: (
        <VesselDetails
          stepper={stepper}
          combinedData={combinedData}
          setCombinedData={setCombinedData}
        />
      ),
    },
    // {
    //   id: "Member-info",
    //   title: "Member Details",
    //   subtitle: "Add Member Info",
    //   content: (
    //     <MemberDetails
    //       stepper={stepper}
    //       combinedData={combinedData}
    //       setCombinedData={setCombinedData}
    //     />
    //   ),
    // },
    {
      id: "Payment",
      title: "Payment Details",
      subtitle: "Add Payment",
      content: (
        <PaymentDetails
          stepper={stepper}
          combinedData={combinedData}
          setCombinedData={setCombinedData}
        />
      ),
    },
    {
      id: "DocumentsDetails",
      title: "Document Details",
      subtitle: "Add Documents",
      content: (
        <DocumentsDetails
          stepper={stepper}
         
        />
      ),
    },
  ];

  return (
    <div className="horizontal-wizard">
      <Wizard ref={ref} instance={(el) => setStepper(el)} steps={steps} />
    </div>
  );
};

export default Index;
