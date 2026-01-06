import useJwt from "@src/auth/jwt/useJwt";
import { saveUnlockedPages } from "@store/authentication";
import { Wallet } from "lucide-react";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CreditCard, Lock } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

const PaymentPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    control,
    unregister,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {},
  });
  const dispatch = useDispatch();
  const toast = useRef(null);

  const location = useLocation();
  const walletBal = location.state?.walletBal;
  const existingCreditCard = location.state?.existingCreditCard;
  const navigate = useNavigate();
  const { plan } = location.state || {};
  const selectedPlan = plan;
  const [activeTab, setActiveTab] = useState("card");
  const [selectedCard, setSelectedCard] = useState("");
  const [existingCards, setExistingCards] = useState([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  console.log("activeTab", activeTab);

  useEffect(() => {
    if (existingCreditCard?.length > 0) {
      setExistingCards(existingCreditCard);
      setSelectedCard(existingCreditCard[0].cardID);
    }
  }, [existingCreditCard]);

  useEffect(() => {
    if (activeTab === "wallet") {
      unregister("cvv");
    }
  }, [activeTab, unregister]);

  console.clear();
  console.log(errors);

  const onSubmit = async (data) => {
    if (activeTab === "card") {
      if (!selectedCard) {
        setError("selectedCard", {
          type: "manual",
          message: "Please select a card",
        });
        return;
      }
    }

    const walletAmount = Number(walletBal);
    const payableAmount = Number(
      selectedPlan.finalAmt || selectedPlan.subscriptionAmt
    );

    if (walletAmount < payableAmount) {
      setError("wallet", {
        type: "manual",
        message: "Insufficient wallet balance",
      });
      return;
    }

    // if (activeTab === "wallet") {
    //   const payableAmount =
    //     selectedPlan.finalAmt || selectedPlan.subscriptionAmt;
    //   if (walletBal < payableAmount) {
    //     setError("wallet", {
    //       type: "manual",
    //       message: "Insufficient wallet balance",
    //     });
    //     return;
    //   }
    // }
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userUid = userData?.uid || "";
    const payload = {
      uid: userUid,
      crmId: localStorage.getItem("crmId"),
      paymentMethod: activeTab,
      paymentAmt: selectedPlan.finalAmt || selectedPlan.subscriptionAmt,
      subscriptionID: selectedPlan.id,
    };

    if (activeTab === "card") {
      payload.cardID = selectedCard;
      payload.cardcvv = data.cvv;
    }
    console.log("payload", payload);
    setIsProcessing(true);

    try {
      const res = await useJwt.subscriptionPayment(payload);
      if (res?.status === 200) {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userUid = userData?.uid || "";
        const resPermision = await useJwt.getBranch(userUid);
        console.log(resPermision);
        const upadtedPersmision = {
          ...userData,
          permissions: resPermision?.data?.userRoles?.permissions || [],
        };
        console.log("upadtedPersmision", upadtedPersmision);

        localStorage.setItem("userData", JSON.stringify(upadtedPersmision));

        const pagesUnlockedNames = {};
        resPermision?.data?.userRoles?.permissions.forEach((item) => {
          if (item?.module) {
            pagesUnlockedNames[item.module] = true;
          }
        });

        localStorage.setItem(
          "pagesUnlockedNames",
          JSON.stringify(pagesUnlockedNames)
        );

        dispatch(saveUnlockedPages(pagesUnlockedNames));

          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Your subscription has been updated successfully.",
            life: 2000,
          });
          setTimeout(() => {
            
            navigate("/dashbord");
          }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Payment failed. Please try again.",
        life: 2000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="text-center p-5">
        <p>No plan selected. Please go back and choose a plan.</p>
        <Button color="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const getCardBrandFromNumber = (cardNo = "") => {
    const clean = cardNo.replace(/\D/g, "");

    if (clean.length < 6) return "Unknown";

    const bin6 = parseInt(clean.substring(0, 6), 10);
    const bin4 = parseInt(clean.substring(0, 4), 10);
    const bin2 = parseInt(clean.substring(0, 2), 10);

    // Visa
    if (clean.startsWith("4")) return "Visa";

    // Mastercard (OLD + NEW ranges)
    if ((bin2 >= 50 && bin2 <= 55) || (bin4 >= 2221 && bin4 <= 2720)) {
      return "Mastercard";
    }

    // American Express
    if (bin2 === 34 || bin2 === 37) return "Amex";

    // Discover
    if (clean.startsWith("6011") || clean.startsWith("65")) {
      return "Discover";
    }

    return "Unknown";
  };

  const getCardBrandBackground = (brand) => {
    const backgrounds = {
      Visa: "linear-gradient(135deg, #1A1F71 0%, #2E3192 100%)",
      Mastercard: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
      Amex: "linear-gradient(135deg, #006FCF 0%, #0080E6 100%)",
      Discover: "linear-gradient(135deg, #FF6000 0%, #FF8533 100%)",
    };
    return (
      backgrounds[brand] || "linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)"
    );
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa" }}>
      <Toast ref={toast} />

      <Row className="mb-4 justify-content-start">
        <Col xs="12" md="10" lg="8">
          <div className="d-flex align-items-start gap-2 mb-2">
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
            <h2 className="fw-bold mb-0">Complete Your Payment</h2>
          </div>
        </Col>

        <Row>
          {/* Payment Form */}
          <Col lg={8} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: "12px" }}>
              <CardBody className="p-4">
                {/* Payment Method Tabs */}
                <h5 className="mb-1">Payment Methods</h5>

                <Nav tabs className="mb-4">
                  <NavItem>
                    <NavLink
                      className={activeTab === "card" ? "active" : ""}
                      onClick={() => setActiveTab("card")}
                      style={{ cursor: "pointer" }}
                    >
                      <CreditCard size={18} className="me-2" />
                      Credit/Debit Card
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === "wallet" ? "active" : ""}
                      onClick={() => setActiveTab("wallet")}
                      style={{ cursor: "pointer" }}
                    >
                      <Wallet size={18} className="me-2" />
                      Wallet
                    </NavLink>
                  </NavItem>
                </Nav>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <TabContent activeTab={activeTab}>
                    {/* Credit Card Tab */}
                    <TabPane tabId="card">
                      <h5 className="mb-2">Choose Your Credit/Debit Cards</h5>

                      {existingCards.length > 0 && (
                        <div className="mb-4">
                          {isLoadingCards ? (
                            <div className="text-center py-3">
                              Loading cards...
                            </div>
                          ) : (
                            <Row>
                              {existingCards.map((card) => {
                                const brand = getCardBrandFromNumber(
                                  card?.cardno
                                );

                                return (
                                  <Col
                                    md={6}
                                    lg={4}
                                    key={card.cardID}
                                    className="mb-3"
                                  >
                                    <Card
                                      className={`h-100 ${
                                        selectedCard === card.cardID
                                          ? "border-primary shadow-sm"
                                          : "border"
                                      }`}
                                      style={{
                                        cursor: "pointer",
                                        borderWidth:
                                          selectedCard === card.cardID
                                            ? "2px"
                                            : "1px",
                                        transition: "all 0.2s",
                                      }}
                                      onClick={() =>
                                        setSelectedCard(card.cardID)
                                      }
                                    >
                                      <CardBody className="p-0">
                                        {/* Card Brand Header */}
                                        <div
                                          className="d-flex align-items-center justify-content-center"
                                          style={{
                                            background:
                                              getCardBrandBackground(brand),
                                            height: "90px",
                                            borderTopLeftRadius: "4px",
                                            borderTopRightRadius: "4px",
                                          }}
                                        >
                                          <h3
                                            className="text-white fw-bold mb-0"
                                            style={{
                                              fontSize: "18px",
                                              letterSpacing: "2px",
                                            }}
                                          >
                                            {brand}
                                          </h3>
                                        </div>

                                        {/* Card Details */}
                                        <div className="p-2">
                                          <div className="mb-2">
                                            <div
                                              className="fw-bold mb-1"
                                              style={{ fontSize: "15px" }}
                                            >
                                              **** **** ****{" "}
                                              {card?.cardno.slice(-4)}
                                            </div>
                                            {/* <div className="text-muted small">
                                            Expires {card.expiryMonth}/{card.expiryYear}
                                          </div> */}
                                          </div>

                                          {/* Default Badge and Edit Button */}
                                          <div className="d-flex justify-content-between align-items-center mt-2">
                                            {selectedCard === card.cardID ? (
                                              <span
                                                className="badge"
                                                style={{
                                                  backgroundColor: "#d4edda",
                                                  color: "#155724",
                                                  fontSize: "11px",
                                                }}
                                              >
                                                ✓ selected
                                              </span>
                                            ) : (
                                              <Button
                                                color="link"
                                                size="sm"
                                                className="p-0 text-primary"
                                                style={{
                                                  fontSize: "13px",
                                                  textDecoration: "none",
                                                }}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedCard(card.cardID);
                                                }}
                                              >
                                                Select Card
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                );
                              })}
                              {activeTab === "card" && (
                                <>
                                  <Label>
                                    CVV <span className="text-danger">*</span>{" "}
                                  </Label>
                                  <Controller
                                    name="cvv"
                                    control={control}
                                    rules={{
                                      required: "CVV is required",
                                      pattern: {
                                        value: /^[0-9]{3,4}$/,
                                        message: "CVV must be 3 or 4 digits",
                                      },
                                    }}
                                    render={({ field }) => (
                                      <div>
                                        <Input
                                          {...field}
                                          type="password"
                                          inputMode="numeric"
                                          maxLength={4}
                                          placeholder="CVV"
                                          onChange={(e) =>
                                            field.onChange(
                                              e.target.value.replace(/\D/g, "")
                                            )
                                          }
                                        />
                                        {errors.cvv && (
                                          <small style={{ color: "red" }}>
                                            {errors.cvv.message}
                                          </small>
                                        )}
                                      </div>
                                    )}
                                  />
                                </>
                              )}
                            </Row>
                          )}
                        </div>
                      )}
                    </TabPane>

                    {/* Wallet Tab */}
                    <TabPane tabId="wallet">
                      <div className="mb-4">
                        <Card className="bg-light border-0">
                          <CardBody>
                            Available Balance:{" "}
                            <strong className="text-success">
                              ${walletBal}
                            </strong>
                            {errors.wallet && (
                              <div className="text-danger mt-2">
                                {errors.wallet.message}
                              </div>
                            )}
                            <hr />
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="text-muted">
                                Amount to be deducted
                              </span>
                              <h4 className="mb-0">
                                {selectedPlan.finalAmt ||
                                  selectedPlan.subscriptionAmt}
                              </h4>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </TabPane>
                  </TabContent>

                  <div className="d-flex align-items-center gap-2  mb-3 text-muted">
                    <Lock size={16} />
                    <small>
                      Your payment information is secure and encrypted
                    </small>
                  </div>

                  <Button
                    color="primary"
                    block
                    size="lg"
                    type="submit"
                    disabled={isProcessing || isSubmitting}
                    style={{
                      borderRadius: "6px",
                      fontWeight: "500",
                    }}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Pay ${selectedPlan.subscriptionAmt}`}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="shadow-sm" style={{ borderRadius: "12px" }}>
              <CardBody className="p-4">
                <h4 className="mb-4">Order Summary</h4>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">
                      {selectedPlan.subscriptionName}
                    </span>
                  </div>
                  <div
                    className="text-muted small"
                    dangerouslySetInnerHTML={{
                      __html: selectedPlan.subscriptionDescription,
                    }}
                  />
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>{selectedPlan.subscriptionAmt}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold" style={{ fontSize: "20px" }}>
                    {selectedPlan.finalAmt || selectedPlan.subscriptionAmt}
                  </span>
                </div>

                <div
                  className="p-1"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                  }}
                ></div>

                {(selectedPlan.subscriptionAddedModuleJson?.length > 0 ||
                  selectedPlan.addonModuleJson?.length > 0) && (
                  <>
                    <hr />
                    <h6 className="mb-3">Included Features:</h6>
                    <ul className="list-unstyled small">
                      {(selectedPlan.subscriptionAddedModuleJson?.length > 0
                        ? selectedPlan.subscriptionAddedModuleJson
                        : selectedPlan.addonModuleJson
                      ).map((feature, idx) => (
                        <li key={idx} className="mb-2 d-flex align-items-start">
                          <span className="me-2" style={{ color: "#28a745" }}>
                            ✓
                          </span>
                          <span>{feature.module}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default PaymentPage;
