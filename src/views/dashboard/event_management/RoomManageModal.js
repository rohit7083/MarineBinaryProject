import React, { useEffect } from "react";
import { Card, CardBody, CardTitle, Col, Modal } from "reactstrap";
import Index from "../room_management/manage_roomBooking/addNewBooking/index";
function RoomManageModal({ showModal,setEventRooms, isRoomRequired, setShowModal }) {
  useEffect(() => {
    if (isRoomRequired) {
      setShowModal(true);
    }
  }, [isRoomRequired]);
  return (
    <div>
      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        style={{ maxWidth: "80%", padding: "1rem" }}
      >
        <div style={{ padding:"2em"}}>
        {/* <CardTitle className="mb-1 fw-bold fs-4">
          Room Booking For Event management{" "}
        </CardTitle>
         */}
        <Index showModal={showModal} setShowModal={setShowModal} setEventRooms={setEventRooms} isRoomRequired={isRoomRequired} />
        
        </div>
      </Modal>
    </div>
  );
}

export default RoomManageModal;
