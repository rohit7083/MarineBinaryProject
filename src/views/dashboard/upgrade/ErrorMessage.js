import { XCircle } from "lucide-react";
import {
    Badge,
    Button,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";

const ErrorDisplayDesigns = ({ modal2, countApiError, setModal2 }) => {
  const toggle = () => setModal2(!modal2);

  const errorData = {
    code: 400,
    content:
      countApiError ||
      "There was an error processing your request. Please try again later.",
    message: "Purchase failed.",
    // timestamp: "2026-01-23T13:12:49.3808296",
  };

  // Design 4: Modal Popup
  const Design4 = () => (
    <>
      <Modal isOpen={modal2} toggle={toggle} centered>
        <ModalHeader toggle={toggle} className="bg-danger text-white border-0">
          <XCircle className="me-2" size={24} />
          {errorData.message}
        </ModalHeader>
        <ModalBody className="py-2">
          <div className="mb-3">
            <Badge color="danger" className="mb-2">
              Error 
            </Badge>
            <p className="mb-0">{errorData.content}</p>
          </div>
          <hr />
          {/* <small className="text-muted d-flex align-items-center">
            <Clock size={14} className="me-1" />
            Occurred at: {new Date(errorData.timestamp).toLocaleString()}
          </small> */}
        </ModalBody>
        <ModalFooter className="border-0">
          <Button color="secondary" size={'sm'} outline onClick={toggle}>
            Close
          </Button>
          {/* <Button color="danger">Contact Support</Button> */}
        </ModalFooter>
      </Modal>
    </>
  );

  return (
    <Container className="py-5">
      <Design4 />
    </Container>
  );
};

export default ErrorDisplayDesigns;
