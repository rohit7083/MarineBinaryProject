import React from "react";
import LocationImage from "@src/views/pages/authentication/Images/locationguide.png";
import { Row, Col, Modal, ModalHeader, ModalBody, Button } from "reactstrap";
function LocationModal({ show, setShow }) {
  return (
    <Modal
      isOpen={show}
      toggle={() => setShow(!show)}
      className="modal-dialog-centered"
    >
      <ModalHeader
        className="bg-transparent"
        toggle={() => setShow(!show)}
      ></ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <h1 className="text-center mb-1">Turn On Your Location</h1>
        <Row
          tag="form"
          className="gy-1 gx-2 mt-75"
          onSubmit={() => setShow(!show)}
        >
          <img src={LocationImage} />

          <Button
            color="primary"
            onClick={() => {
              // localStorage.setItem("locationEnabled", "true"); // Set location as enabled
              setShow(false); // Close the modal
            }}
          >
            OK
          </Button>
        </Row>
      </ModalBody>
    </Modal>
  );
}

export default LocationModal;
