import useJwt from "@src/auth/jwt/useJwt";
import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Lock } from "react-feather";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, CardBody, Col, Row, Spinner } from "reactstrap";
export default function PosUpgradePage() {
  const [addOn, setAddOn] = useState([]);
  const [subscription, setSubscription] = useState([]);
  const [loading, setLoading] = useState(false);
  const [walletBal, setWalletBal] = useState(null);
  const [dynamicMessage, setDyanamicMsz] = useState([]);
  // const [isSubUser, setIsSubUser] = useState(null);
  // debugger;
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/dashbord");
  };
  const location = useLocation();

  const handleMerchantAcc = () => {
    window.open(
      "https://apply.locktrust.com/",
      "_blank",
      "noopener,noreferrer",
    );
  };

  useEffect(() => {
    const handlePurchase = async () => {
      try {
        setLoading(true);
        localStorage.getItem("crmId");

        const crmId = localStorage.getItem("crmId");
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userUid = userData?.uid || "";
        // setIsSubUser(isSubUser);
        const res = await useJwt.upgradePlans({ crmid: crmId });

        const paymentPageData = await useJwt.apiForpaymentPage({
          uid: userUid,
        });

        if (paymentPageData?.status === 200) {
          let walletBal = paymentPageData?.data?.content;
          setWalletBal(walletBal);
        }

        const addOndata = res.data?.content?.filter(
          (item) => item?.is_addon === "1",
        );

        const subscriptionIds = JSON.parse(
          localStorage.getItem("subscriptionId") || "[]",
        );
        const addOnfilterData = addOndata.filter(
          (item) =>
            subscriptionIds.includes(item.subscriptionId) ||
            item.subscriptionId === 0,
        );

        setAddOn(addOnfilterData);

        const SubscriptionData = res.data?.content?.filter(
          (item) => item?.is_addon == 0,
        );

        setSubscription(SubscriptionData);
      } catch (error) {
        console.error("Error during upgrade process:", error);
      } finally {
        setLoading(false);
      }
    };
    handlePurchase();
  }, []);

  useEffect(() => {
    const handleInfo = async () => {
      try {
        const parentMenuId = localStorage.getItem("parentMenuId");

        const res = await useJwt.getDyanimicInfoOFSubscription(parentMenuId);
        setDyanamicMsz(res?.data?.["0"]?.messages);

        res;
      } catch (error) {
        error;
      }
    };
    handleInfo();
  }, []);

  const handleUpgrade = () => {
    navigate("/upgrade/subscription", { state: { subscription, walletBal } });
  };

  const handlePurchaseAddon = () => {
    navigate("/upgrade/subscription", { state: { addOn, walletBal } });
  };

  const [isSubUser, setIsSubUser] = useState(false);

  useEffect(() => {
    let userData = null;

    try {
      userData = JSON.parse(localStorage.getItem("userData"));
    } catch {
      userData = null;
    }

    setIsSubUser(userData?.isSubUser ?? false);
    // setIsSubUser(true);
  }, []);

  const messages =
    dynamicMessage && dynamicMessage.length > 0
      ? dynamicMessage
      : [
          "Core business operations",
          "Real-time data updates",
          "Centralized system management",
          "Secure transactions & records",
          "Integrated client experience",
        ];

  return (
    // <Container className="">
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size={14} color="primary" />
        </div>
      ) : (
        <>
          <Row>
            <Col lg="10">
              <Button
                color="primary"
                outline
                className=" d-flex align-items-center"
                onClick={handleGoBack}
                size="sm"
              >
                <ArrowLeft size={16} className="me-2" />
                Back to Previous Page
              </Button>
            </Col>
            <Row className="g-2">
              <Col lg="4">
                <Card
                  className="h-100 shadow-sm border-warning"
                  style={{ borderWidth: "3px" }}
                >
                  <CardBody className="text-center p-3">
                    <div
                      className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "#fff3cd",
                      }}
                    >
                      <Lock size={40} className="text-warning" />
                    </div>
                    <h3 className="fw-bold mb-2">Upgrade System</h3>
                    <Badge color="danger" className="mb-2">
                      {isSubUser === false
                        ? " Requires Upgrade"
                        : "Access Denied"}
                    </Badge>
                    <p className="text-muted small">
                      {isSubUser === false
                        ? "Unlock advanced tools for your business"
                        : "  You don’t have access to this feature. Please contact your administrator to request access "}
                    </p>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="8">
                <Card className="shadow-sm h-100">
                  <CardBody className="p-3">
                    <h4 className="fw-bold mb-2 ">Access Requirements</h4>

                    {isSubUser === false ? (
                      <div className="alert alert-danger mb-2 p-2">
                        <strong>🔒 Feature Locked</strong>
                        <p className="mb-0 small mt-2">
                          This feature isn’t included in your current plan.
                          Upgrade to unlock it.{" "}
                        </p>
                      </div>
                    ) : (
                      <div className="alert alert-danger mb-2 p-2">
                        <strong>🚫 Access Denied</strong>
                        <p className="mb-0 small mt-2">
                          You don’t have access to this feature. Please contact
                          your administrator to request access
                        </p>
                      </div>
                    )}
                    {isSubUser === false && (
                      <>
                        <p className="mb-2">
                          Before you can continue, make sure you have:
                        </p>
                        <ul className="mb-2">
                          <li>Lock Trust Merchant Account</li>
                          <li>MarinaOne Premium Subscription</li>
                        </ul>

                        <h6 className="fw-semibold mb-2">What You'll Get:</h6>
                        <Row className="g-2 mb-2">
                          {messages.map((feature, idx) => (
                            <Col md="6" key={idx}>
                              <div className="d-flex align-items-start">
                                <CheckCircle
                                  size={16}
                                  className="text-success me-2 mt-0 flex-shrink-0"
                                />
                                <span className="small">{feature}</span>
                              </div>
                            </Col>
                          ))}
                        </Row>

                        <Row className="g-2">
                          <Col sm="12">
                            <Button
                              color="primary"
                              onClick={handleMerchantAcc}
                              className="w-100 fw-semibold"
                            >
                              Apply for Merchant Account
                            </Button>
                          </Col>
                          <Col
                            sm={
                              localStorage.getItem("parentMenuId") !== "branch"
                                ? "6"
                                : "12"
                            }
                          >
                            <Button
                              color="secondary"
                              onClick={handlePurchaseAddon}
                              outline
                              className="w-100"
                            >
                              Purchase Add-On
                            </Button>
                          </Col>

                          {localStorage.getItem("parentMenuId") !==
                            "branch" && (
                            <Col sm="6">
                              <Button
                                color="success"
                                onClick={handleUpgrade}
                                className="w-100"
                              >
                                Upgrade Subscription
                              </Button>
                            </Col>
                          )}
                        </Row>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Row>
        </>
      )}
    </>
  );
}
