import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

const SubscriptionConfirmModal = ({
  modal,
  setModal,
  subscriptionData,
  walletBal,
  existingCreditCard,
  planData,
}) => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const toggle = () => setModal(!modal);
  const handleConfirm = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userUid = userData?.uid || "";

    const payload = {
      uid: userUid,
      crmId: localStorage.getItem("crmId"),
      paymentMethod: "wallet",
      paymentAmt: 0,
      subscriptionID: planData.id,
    };

    if (content?.isDowngrade === 1) {
      try {
        setLoading(true);
        const res = await useJwt.subscriptionPayment(payload);
        
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Success",
          life: 2000,
        });
        setTimeout(() => {
          navigate("/dashbord");
        }, 2000);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Failed",
          detail: "Error",
          life: 2000,
        });
      } finally {
        setLoading(false);
      }
    } else {
      setModal(false);
      navigate("/upgrade/subscription/payment", {
        state: { planData, subscriptionData, walletBal, existingCreditCard },
      });
    }
  };

  if (!subscriptionData?.status || !subscriptionData?.content) return null;

  const { content } = subscriptionData;

  const isPlanUpgrade = content.type === "PLAN_UPGRADE";
  const isAddon = content.type === "ADDON_PRORATED";

  const savings = isPlanUpgrade
    ? (
        parseFloat(content.old_plan_price) - parseFloat(content.new_plan_price)
      ).toFixed(2)
    : null;

  const dailySavings = isPlanUpgrade
    ? (content.old_per_day - content.new_per_day).toFixed(2)
    : null;

  return (
    <div className="p-4">
      <Modal isOpen={modal} toggle={toggle} centered size="md">
        {/* ================= HEADER ================= */}
        <Toast ref={toast} />

        <ModalHeader toggle={toggle} className="border-0 pb-0">
          <div className="d-flex align-items-center">
            <span className="me-2">
              {isPlanUpgrade
                ? "Confirm Plan Upgrade"
                : "Confirm Add-on Purchase"}
            </span>
          </div>
        </ModalHeader>

        {/* ================= BODY ================= */}
        <ModalBody className="px-4 py-3">
          {/* ---------- PLAN UPGRADE ---------- */}
          {isPlanUpgrade && (
            <div className="mb-4">
              <h5 className="text-muted mb-3">Plan Comparison</h5>

              <Row className="g-3">
                <Col md={6}>
                  <div className="border rounded p-3 bg-dark bg-opacity-10 border-dark">
                    <div className="text-muted small mb-1">Current Plan</div>
                    <div className="h4 mb-1">${content.old_plan_price}/mo</div>
                    <div className="text-muted small">
                      ${content.old_per_day.toFixed(2)}/day
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border rounded p-3 bg-success bg-opacity-10 border-success">
                    <div className="text-success small mb-1 fw-semibold">
                      New Plan
                    </div>
                    <div className="h4 mb-1 text-success">
                      ${content.new_plan_price}/mo
                    </div>
                    <div className="text-success small">
                      ${content.new_per_day.toFixed(2)}/day
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          {/* ---------- ADD-ON ---------- */}
          {isAddon && (
            <div className="mb-4">
              <h5 className="text-muted mb-2">Add-on Details</h5>

              <div className="border rounded p-3 bg-info bg-opacity-10 border-info">
                <div className="d-flex justify-content-between">
                  <span>Add-on Price</span>
                  <strong>${content.addon_price}</strong>
                </div>

                <div className="d-flex justify-content-between mt-1">
                  <span>Per Day Cost</span>
                  <strong>${content.per_day_amount.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* ---------- COMMON DETAILS ---------- */}
          <div className="bg-dark bg-opacity-10 rounded p-2 mb-3">
            <Row className="g-3">
              {/* {isPlanUpgrade && (
                <>
                  <Col xs={12}>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Monthly Savings</span>
                      <span className="fw-bold text-success">-${savings}</span>
                    </div>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Daily Savings</span>
                      <span className="fw-bold text-success">
                        -${dailySavings}
                      </span>
                    </div>
                  </Col>
                </>
              )} */}

              <Col xs={12}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Days Remaining</span>
                  <span className="fw-bold">{content.days_remaining} days</span>
                </div>
              </Col>
            </Row>
          </div>

          {/* ---------- PAYMENT ---------- */}
          <div className="border-top pt-2 mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Amount Due Today</span>
              <span className="h5 mb-0 text-success">
                ${Number(content.payable_now).toFixed(2)}
              </span>
            </div>

            {content.payable_now === 0 && (
              <small className="text-muted d-block mt-1">
                No charge today. Changes apply immediately.
              </small>
            )}
          </div>

          <div className="alert alert-warning mb-0 p-2">
            <small>
              <strong>Next Billing:</strong> You’ll be charged{" "}
              <strong>${content.next_month_price}</strong> on your next billing
              date.
            </small>
          </div>
        </ModalBody>

        {/* ================= FOOTER ================= */}
        <ModalFooter className="border-0 pt-0">
          <Button color="secondary" outline onClick={toggle}>
            Cancel
          </Button>

          {content.payable_now > 0 && (
            <Button
              color="success"
              onClick={handleConfirm}
              disabled={loading}
              className="px-4"
            >
              {content?.isDowngrade == 1 ? (
                <>
                  {" "}
                  {loading ? (
                    <>
                      Loading...
                      <Spinner size={"sm"} />{" "}
                    </>
                  ) : (
                    "Submit"
                  )}{" "}
                </>
              ) : (
                <> Pay ${content.payable_now}</>
              )}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default SubscriptionConfirmModal;
