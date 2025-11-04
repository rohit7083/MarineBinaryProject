import { Check } from "lucide-react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export const CompactModal = ({
  isOffline,
  isOpen,
  uid,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={onCancel}
      centered
      fade
      backdrop="static"
      size="sm" // 👈 makes modal narrower
    >
      <ModalHeader className="border-bottom-0 pb-0">
        <div className="d-flex align-items-center justify-content-between w-100">
          <h6 className="mb-0 fw-semibold text-dark">
            Confirm {isOffline === true ? "Online" : "Offline"}{" "}
          </h6>
        </div>
      </ModalHeader>

      <ModalBody className="pt-0 pb-3">
        <p className="text-secondary small mb-0">
          This will change the slip status to {isOffline ? "Offline" : "Online"}
          . Do you want to continue?
        </p>
      </ModalBody>

      <ModalFooter className="border-0 pt-0 d-flex justify-content-between">
        <Button
          color="light"
          className="text-dark btn-sm px-3"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          color="danger"
          className="btn-sm px-3"
          onClick={() => onConfirm(uid)}
        >
          <Check size={14} className="me-1" /> Confirm{" "}
          {isOffline ? "Online" : "Offline"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export const SuccessModal = ({
  isOpen,
  message = "Action completed successfully!",
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      centered
      fade
      backdrop="static"
      size="sm"
    >
      <ModalHeader className="border-0 pb-0">
        <h6 className="mb-0 fw-semibold text-success">Success</h6>
      </ModalHeader>

      <ModalBody className="text-center py-1">
        <Check size={40} className="text-success mb-1   " />
        <p className="text-secondary small mb-0">{message}</p>
      </ModalBody>

      <ModalFooter className="border-0 pt-0 d-flex justify-content-center">
        <Button color="success" className="btn-sm px-3" onClick={onClose}>
          OK
        </Button>
      </ModalFooter>
    </Modal>
  );
};
