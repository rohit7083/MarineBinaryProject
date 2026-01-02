import { ArrowLeft } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
const PricingCards = () => {
  const location = useLocation();
  console.log(location);
  
  const existingCreditCard = location.state?.walletBal?.cardData ;

  const {walletBal} = location.state?.walletBal ;
  const { subscription, addOn } = location.state || {};
  const plans = subscription ?? addOn ?? null;
  const navigate = useNavigate();
  console.log(plans?.subscriptionAddedModuleJson);
  // const plans = subscription?.map((item) => ({
  //   finalAmt: item.finalAmt,
  //   subscriptionAddedModule: item.subscriptionAddedModule,
  //   subscriptionAmt: item.subscriptionAmt,
  //   subscriptionDescription: item.subscriptionDescription,
  //   subscriptionModules: item.subscriptionModule,
  //   subscriptionName: item.subscriptionName,
  //   timeframe: item.timeframe,
  // }));

  //   const plans = [
  // {
  //   name: "Free",
  //   price: "0",
  //   period: "/mo.",
  //   subtitle: "For individuals",
  //   buttonText: "Use Tidio for free",
  //   buttonColor: "outline-primary",
  //   features: [
  //     "Up to 50 conversations",
  //     "Unlimited chat",
  //     "Unlimited email",
  //     "Chatbots & live chat",
  //     "Visitors info",
  //     "Ticketing",
  //     "iOS/Android app",
  //   ],
  // },
  // {
  //   name: "Chatbots",
  //   price: "39",
  //   period: "/mo.",
  //   subtitle: "For entrepreneurs",
  //   buttonText: "Start Free Trial",
  //   buttonColor: "primary",
  //   badge: "MOST POPULAR",
  //   features: [
  //     "All the Free Features",
  //     "Unlimited emails",
  //     "Unlimited chats/visitors",
  //     "Lyro Conversational AI",
  //     "Chatbot templates",
  //     "Visual chatbot builder",
  //     "Power integrations",
  //   ],
  // },
  // {
  //   name: "Communicator",
  //   price: "15",
  //   period: "/mo.",
  //   subtitle: "Per operator",
  //   buttonText: "Start Free Trial",
  //   buttonColor: "primary",
  //   features: [
  //     "All the Free Features",
  //     "Live Typing",
  //     "Viewed Pages",
  //     "Live Visitors List",
  //     "Permissions",
  //     "Departments",
  //     "Lyro premium",
  //     "with removable",
  //   ],
  // },

  //   ];
  const badge = "POPULAR";
console.log("walletBal",walletBal);

  const handleChoosePlan = (plan) => {
    
    navigate("/upgrade/subscription/payment", { state: { plan, walletBal ,existingCreditCard } });
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "50px",
        paddingBottom: "50px",
      }}
    >
      <>
        <Row className="mb-4 justify-content-center">
          <Col
            xs="12"
            className="d-flex align-items-center justify-content-center gap-1"
          >
            <ArrowLeft
              style={{
                cursor: "pointer",
                transition: "color 0.1s",
                color: "#6E6B7B",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
              onClick={() => navigate(-1)}
            />

            <h2 className="fw-bold mb-0">Choose Your Plan</h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {plans?.map((plan, index) => {
            const features = plan?.subscriptionAddedModuleJson?.length
              ? plan.subscriptionAddedModuleJson
              : plan?.addonModuleJson?.length
              ? plan.addonModuleJson
              : [];

            return (
              <Col key={index} lg={4} md={6} className="mb-2">
                <Card
                  className="h-100 shadow-sm"
                  style={{
                    borderRadius: "12px",
                    border: badge ? "2px solid #0d6efd" : "1px solid #dee2e6",
                    position: "relative",
                  }}
                >
                  {badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-12px",
                        right: "20px",
                        backgroundColor: "#0d6efd",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      {badge}
                    </div>
                  )}

                  <CardBody className="p-3 pb-0">
                    <h5
                      className="text-center mb-3"
                      style={{ fontWeight: "600" }}
                    >
                      {plan.subscriptionName}
                    </h5>

                    <div className="text-center mb-2">
                      <h1
                        className="mb-0"
                        style={{ fontSize: "48px", fontWeight: "700" }}
                      >
                        {plan.subscriptionAmt}
                        <span style={{ fontSize: "20px", fontWeight: "400" }}>
                          /{plan.timeframe?.slice(0, 2)}
                        </span>
                      </h1>

                      <div
                        className="text-muted small description-html"
                        dangerouslySetInnerHTML={{
                          __html: plan.subscriptionDescription,
                        }}
                      />
                    </div>

                    <Button
                      color="primary"
                      block
                      className="mb-4"
                      style={{
                        borderRadius: "6px",
                        fontWeight: "500",
                        padding: "10px",
                      }}
                      onClick={()=> handleChoosePlan(plan)}
                    >
                      Choose Plan
                    </Button>

                    <div
                      className="text-muted mb-1"
                      style={{ fontSize: "13px", fontWeight: "600" }}
                    >
                      KEY FEATURES
                    </div>

                    {features.length ? (
                      <ul className="list-unstyled">
                        {features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="mb-2 d-flex align-items-start"
                            style={{ fontSize: "14px" }}
                          >
                            <span
                              className="me-2"
                              style={{
                                color: "#28a745",
                                fontSize: "18px",
                                lineHeight: "1",
                              }}
                            >
                              ✓
                            </span>
                            <span>{feature?.module}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No features available</div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </>
    </div>
  );
};

export default PricingCards;
