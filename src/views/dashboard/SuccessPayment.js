import useJwt from "@src/auth/jwt/useJwt";
import Lottie from "lottie-react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import doneAnimation from "./Done.json";

export default function InvoiceModal({
  modal,
  setModal,
  transactionId,
  slipPayment,
  posPayment,
  eventPayment,
  memberID,
  roomPayment,
  customerId,
}) {
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const navigate = useNavigate();

  // const handleClosed = () => {
  //   setModal(!modal);
  //   if (roomPayment) {
  //     navigate("/bookingListing");
  //   } else if (eventPayment) {
  //     navigate("/event_index");
  //   } else if (posPayment) {
  //     navigate("/dashboard/pos/point_of_sale/shop/PayementDetails");
  //   } else if (slipPayment) {
  //     navigate("/dashboard/slipmember_list");
  //   }
  // };

  const toggle = () => {
    setModal(!modal);
    // Reset state when closing
     if (roomPayment) {
      navigate("/bookingListing");
    } else if (eventPayment) {
      navigate("/event_index");
    } else if (posPayment) {
      navigate("/dashboard/pos/point_of_sale/shop/PayementDetails");
    } else if (slipPayment) {
      navigate("/dashboard/slipmember_list");
    }
  };

  const payload = {
    transactionId: transactionId,
    ...(customerId && { customerId: customerId }),
    ...(memberID && { memberId: memberID }),
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      const res = await useJwt.sendInvoiceToMail(payload);

      console.log(res);
      if (res?.status == 200) {
        toast.success("Invoice successfully sent to your email.");
        setModal(false);

        if (roomPayment) {
          navigate("/bookingListing");
        } else if (eventPayment) {
          navigate("/event_index");
        } else if (posPayment) {
          navigate("/dashboard/pos/point_of_sale/shop/PayementDetails");
        } else if (slipPayment) {
          navigate("/dashboard/slipmember_list");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.content ||
          "Something went wrong, please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <Modal isOpen={modal} toggle={toggle} size="sm" centered>
        <ModalHeader toggle={toggle}>Payment Confirmation</ModalHeader>

        <ModalBody>
          <div className="text-center mb-1">
            {/* <CheckCircle size={64} className="text-success mb-1" />
             */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Lottie
                style={{ width: 120, height: 120 }}
                animationData={doneAnimation}
                loop={true}
              />
            </div>

            <h4 className="text-success mb-1">
              Payment Successfully Completed!
            </h4>
            <p className="text-muted">
              Your payment has been processed successfully.
            </p>
          </div>

          <div className="border-top pt-3">
            <div className="mb-3">
              <strong>Invoice Details:</strong>
              <div className="mt-2">
                <p className="mb-1">
                  Amount: $
                  {slipPayment || posPayment || eventPayment || roomPayment}
                </p>
                <p className="mb-1">
                  Date:{" "}
                  {today.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })}
                </p>{" "}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <>
            <Button
              disabled={loading}
              color="primary"
              size="sm"
              onClick={handleSendEmail}
            >
              <Mail size={16} className="me-2" />
              {loading ? (
                <>
                  Sending... <Spinner size="sm" />
                </>
              ) : (
                "Send Invoice to Email"
              )}
            </Button>
            <Button color="secondary" size="sm" onClick={toggle}>
              Close
            </Button>
          </>
        </ModalFooter>
      </Modal>
    </div>
  );
}
