import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function PaymentConfirmModal({
  isOpen,
  finalValuesPayment,
  toggle,
  onConfirm,
  setValue,
}) {
  const handleYes = () => {
    setValue("payment.finalPayment", finalValuesPayment);
    onConfirm();
    toggle();
  };

  const handleNo = () => {
    setValue("payment.finalPayment", 0);
    onConfirm();
    toggle();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      fade
      backdrop="static" // prevents accidental close
      className="payment-confirm-modal"
    >
      <ModalHeader toggle={toggle}>Confirm Payment</ModalHeader>

      <ModalBody className="text-center">
        <p style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
          Are you sure you want to complete this payment?
        </p>

        <strong style={{ fontSize: "1.1rem" }}>
          Final Amount: ${finalValuesPayment}
        </strong>
      </ModalBody>

      <ModalFooter className="d-flex justify-content-center gap-2">
        <Button color="primary" onClick={handleYes}>
          Yes, Confirm
        </Button>
        <Button color="secondary" onClick={handleNo}>
          No, Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default PaymentConfirmModal;
