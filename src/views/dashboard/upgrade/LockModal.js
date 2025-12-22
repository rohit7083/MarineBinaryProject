// import { Lock } from "react-feather";
// import { useLocation } from "react-router-dom";
// import {
//     Badge,
//     Button,
//     Card,
//     CardBody,
//     Col,
//     Container,
//     Row
// } from "reactstrap";

// export default function PosUpgradePage() {

//     const location=useLocation()
//     console.table(location)
//   return (
//     <Container className="py-5">
//       <Row className="justify-content-center">
//         <Col lg="9" xl="8">
//           <Card className="pos-upgrade-card shadow-lg border-0">
//             <CardBody className="p-5 text-center">
//               {/* Header */}
//               <div className="mb-4">
//                 <Lock size={42} className="text-warning mb-2" />
//                 <h1 className="fw-bold">
//                   POS Access Requires Upgrade
//                 </h1>
//                 <Badge color="danger" pill className="mt-2">
//                   Locked Feature
//                 </Badge>
//               </div>

//               {/* Subtitle */}
//               <p className="text-danger fst-italic fs-5 mb-4">
//                 This feature isn’t included in your current plan.
//               </p>

//               {/* Description */}
//               <p className="text-muted mb-4">
//                 Apply for a <strong>Lock Trust Merchant Account</strong> and
//                 upgrade your <strong>MarinaOne subscription</strong> to unlock
//                 POS and streamline your front-desk operations.
//               </p>

//               {/* Feature list */}
//               <Row className="justify-content-center mb-5">
//                 <Col md="10">
//                   <ul className="text-start feature-list">
//                     <li>Process in-person transactions with ease</li>
//                     <li>Track inventory in real time</li>
//                     <li>Sync product, tax, and vendor data automatically</li>
//                     <li>Generate receipts and manage payments in one hub</li>
//                     <li>Connect sales activity directly to your Client Hub</li>
//                   </ul>
//                 </Col>
//               </Row>

//               {/* CTA */}
//               <h5 className="fw-semibold mb-4">Choose your path</h5>

//               <Row className="g-3 justify-content-center">
//                 <Col sm="6" md="4">
//                   <Button
//                     color="warning"
//                     className="w-100 cta-btn"
//                   >
//                     Apply for Merchant Account
//                   </Button>
//                 </Col>

//                 <Col sm="6" md="4">
//                   <Button
//                     color="secondary"
//                     outline
//                     className="w-100 cta-btn"
//                   >
//                     Purchase Add-On
//                   </Button>
//                 </Col>

//                 <Col sm="6" md="4">
//                   <Button
//                     color="success"
//                     className="w-100 cta-btn"
//                   >
//                     Upgrade Now
//                   </Button>
//                 </Col>
//               </Row>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

import { useLocation } from "react-router-dom";

import { ArrowLeft, CheckCircle, Lock } from "react-feather";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, CardBody, Col, Container, Row } from "reactstrap";
export default function PosUpgradePage() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-2);
  };
  const location = useLocation();
  console.table(location);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg="10">
          <Button
            color="primary"
            outline
            className="mb-4 d-flex align-items-center"
            onClick={handleGoBack}
            size="sm"
          >
            <ArrowLeft size={16} className="me-2" />
            Back to Previous Page
          </Button>

          <Row className="g-4">
            <Col lg="4">
              <Card
                className="h-100 shadow-sm border-warning"
                style={{ borderWidth: "3px" }}
              >
                <CardBody className="text-center p-4">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
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
                  <Badge color="danger" className="mb-3">
                    Requires Upgrade
                  </Badge>
                  <p className="text-muted small">
                    Unlock advanced tools for your business
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="8">
              <Card className="shadow-sm h-100">
                <CardBody className="p-4">
                  <h4 className="fw-bold mb-3 ">Access Requirements</h4>

                  <div className="alert alert-danger mb-4 p-2">
                    <strong>🔒 Feature Locked</strong>
                    <p className="mb-0 small mt-2">
                      This feature isn’t included in your current plan. Upgrade
                      to unlock it.{" "}
                    </p>
                  </div>

                  <p className="mb-3">
                    Before you can continue, make sure you have:
                  </p>
                  <ul className="mb-4">
                    <li>Lock Trust Merchant Account</li>
                    <li>MarinaOne Premium Subscription</li>
                  </ul>

                  <h6 className="fw-semibold mb-3">What You'll Get:</h6>
                  <Row className="g-2 mb-4">
                    {[
                      "Core business operations",

                      "Real-time data updates",

                      "Centralized system management",

                      "Secure transactions & records",

                      "Integrated client experience",
                    ].map((feature, idx) => (
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
                      <Button color="warning" className="w-100 fw-semibold">
                        Apply for Merchant Account
                      </Button>
                    </Col>
                    <Col sm="6">
                      <Button color="secondary" outline className="w-100">
                        Purchase Add-On
                      </Button>
                    </Col>
                    <Col sm="6">
                      <Button color="success" className="w-100">
                        Upgrade Subscription
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
