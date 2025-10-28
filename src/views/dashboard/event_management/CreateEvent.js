import { useEffect, useRef, useState } from "react";
import Document from "./Document";
import Event_Info from "./Event_info";
import Payment from "./Payment";
// Custom Components
import Wizard from "@components/wizard";
import { Settings, User, Users } from "react-feather";
import { useLocation } from "react-router-dom";

const CreateEvent = () => {
  const ref = useRef(null);
  const [stepper, setStepper] = useState(null);
  const [allEventData, setAllEventData] = useState([]);
  const [updateData, setUpdateData] = useState({});

  const [formData, setFormData] = useState({
    EventInfo: {},
    clientInfo: {},
    venueLocation: {},
    vendors: {},
  });

  const location = useLocation();
  const listData = location.state || "";
  const paymenStepsCheck = location?.state?.step;
  const paymentData = location?.state;
  // let paymentExist = !!updateData?.listData?.Rowdata?.payments.length;
  useEffect(() => {
    if (paymenStepsCheck === 2 && stepper) {
      stepper.to(2);
    }
  }, [paymenStepsCheck, stepper]);

  const steps = [
    {
      id: "Event-info",
      title: "Event",
      subtitle: "Event details",
      icon: <User size={18} />,
      content: (
        <Event_Info
          setUpdateData={setUpdateData}
          stepper={stepper}
          updateData={updateData}
          formData={{ ...formData.EventInfo }}
          setFormData={setFormData}
          setAllEventData={setAllEventData}
          listData={listData}
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
          updateData={updateData}
          stepper={stepper}
          paymentData={paymentData}
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
          allEventData={allEventData}
          listData={listData}
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
