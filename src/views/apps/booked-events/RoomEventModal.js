import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const RoomDetailsModal = ({ isOpen, toggle, eventData, onAction }) => {
  if (!eventData) return null; // Avoid rendering junk

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Room Details</ModalHeader>
      <ModalBody>
        <p><strong>ID:</strong> {eventData.id}</p>
        <p><strong>Title:</strong> {eventData.title}</p>
        <p><strong>Start:</strong> {eventData.start?.toString()}</p>
        <p><strong>End:</strong> {eventData.end?.toString()}</p>
        <p><strong>Category:</strong> {eventData.calendar}</p>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={() => onAction && onAction(eventData.id)}>
          Book →
        </Button>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RoomDetailsModal;
