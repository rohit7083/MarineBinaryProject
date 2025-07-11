import React, { useState, useRef, useEffect } from "react";
import Event_Info from "./Event_info";
import Client_info from "./Client_info";
import VenueLocation from "./VenueLocation";
import Payment from "./Payment";
import Document from "./Document";
import Preview from "./Preview";
// Custom Components
import Wizard from "@components/wizard";

// Icons
import { User, MapPin, Settings, Users, Clipboard } from "react-feather";
import { useLocation } from "react-router-dom";
import PaymentHistory from "./PaymentHistory";

const CreateEvent = () => {
  const ref = useRef(null);
  const [stepper, setStepper] = useState(null);
  const [allEventData, setAllEventData] = useState([]);

  const [formData, setFormData] = useState({
    EventInfo: {},
    clientInfo: {},
    venueLocation: {},
    vendors: {},
  });

  const location=useLocation();
const listData=location.state || "";

  useEffect(() => {
    // Optional: Fetch existing data to prefill
  }, []);

  const steps = [
    {
      id: "Event-info",
      title: "Event",
      subtitle: "Event details",
      icon: <User size={18} />,
      content: (
        <Event_Info
          stepper={stepper}
          formData={{ ...formData.EventInfo }}
          setFormData={setFormData}
          setAllEventData={setAllEventData}
          listData={listData}
        />
      ),
    },
     {
      id: "review",
      title: "Preview",
      subtitle: "Preview details",
      icon: <Clipboard size={18} />,
      content: (
        <Preview
          stepper={stepper}
          formData={formData}
          // fetchLoader={fetchLoader}
          allEventData={allEventData}
        />
      ),
    },

     {
      id: "PaymentHistory",
      title: "Payment History",
      subtitle: "Your Last Payment History",
      icon: <Clipboard size={18} />,
      content: (
        <PaymentHistory
          stepper={stepper}
          formData={formData}
          // fetchLoader={fetchLoader}
          allEventData={allEventData}
        />
      ),
    },
   
    {
      id: "Payment",
      title: "Payment",
      subtitle: "Payment details",
      icon: <Settings size={18} />,
      content: (
        <Payment
          stepper={stepper}
          formData={{ ...formData.logistics }}
          setFormData={setFormData}
          // fetchLoader={fetchLoader}
                    allEventData={allEventData}

        />
      ),
    },
    {
      id: "Documents",
      title: "Documents",
      subtitle: "Upload documents",
      icon: <Users size={18} />,
      content: (
        <Document
          stepper={stepper}
          formData={{ ...formData.vendors }}
          setFormData={setFormData}
          // fetchLoader={fetchLoader}
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
        options={{ linear: false }}
        instance={(el) => setStepper(el)}
      />
    </div>
  );
};

export default CreateEvent;
