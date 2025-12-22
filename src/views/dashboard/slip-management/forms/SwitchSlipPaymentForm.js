import { Card, CardBody, CardText, CardTitle } from "reactstrap";
import SwitchSlipForm from "./slip_rental/SwitchSlipForm";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

// ** PrimeReact
import { Toast } from "primereact/toast";

// ** Router
import useJwt from "@src/auth/jwt/useJwt";
import { ArrowLeft } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";

function SwitchSlipPaymentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const slip = location.state?.slip || null;
  const [slips, setSlips] = useState([]);
  const [selectedSlipId, setSelectedSlipId] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [homeSlip, setHomeSlip] = useState(slip || null);
  const [payload, setPayload] = useState(null);
  const [frompaidIn, setFrompaidIn] = useState(slip?.paidIn || null);
  const [Calculated, setCalculated] = useState(false);
  const [isAnnual, setIsAnnual] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlips, setIsLoadingSlips] = useState(false);

  const [payer, setPayer] = useState("");
  const [ammountTobePaid, setAmmountTobePaid] = useState(0);
  const toast = useRef(null);
  const [responseData, setResponseData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  // Fetch slips on mount
  useEffect(() => {
    const fetchSlipData = async () => {
      console.log("from PDN", frompaidIn);

      setIsAnnual(frompaidIn);

      try {
        setIsLoadingSlips(true);
        const response = await useJwt.getSwitchSlip();

        // Check if response exists and has valid data
        if (!response || !response.data) {
          throw new Error("No response received from server");
        }

        if (!response.data.content || !response.data.content.result) {
          throw new Error("Invalid data structure received");
        }

        const filteredSlips = response.data.content.result.filter(
          (s) => s.paidIn === frompaidIn && s.id !== homeSlip.id
        );

        setSlips(filteredSlips);
        console.log("Fetched Slips:", response.data.content);
      } catch (error) {
        console.error("Error fetching data:", error);

        // Handle different types of errors
        let errorMessage = "Failed to fetch slip data";

        if (error.response) {
          // Server responded with error status
          if (error.response.status === 401) {
            errorMessage = "Session expired. Please login again";
            setTimeout(() => navigate("/login"), 2000);
          } else if (error.response.status === 403) {
            errorMessage = "You do not have permission to access this data";
          } else if (error.response.status === 404) {
            errorMessage = "Slip data not found";
          } else if (error.response.status >= 500) {
            errorMessage = "Server error. Please try again later";
          } else {
            errorMessage =
              error.response.data?.message || "Failed to fetch slip data";
          }
        } else if (error.request) {
          // Request made but no response
          errorMessage = "Network error. Please check your connection";
        } else {
          // Error in request setup
          errorMessage = error.message || "Failed to fetch slip data";
        }

        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
          life: 4000,
        });
      } finally {
        setIsLoadingSlips(false);
      }
    };

    if (slip) {
      fetchSlipData();
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "No slip data provided",
        life: 3000,
      });
    }
    console.log("Initial Slip:", slip);
  }, [slip]);

  // Handle dropdown selection
  const handleInputChange = (e) => {
    try {
      const id = e.target.value;
      setSelectedSlipId(id);

      if (!id) {
        setSelectedSlip(null);
        return;
      }

      const slipObj = slips.find((s) => s.id === parseInt(id));

      if (!slipObj) {
        toast.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Selected slip not found",
          life: 2000,
        });
        setSelectedSlip(null);
        return;
      }

      setSelectedSlip(slipObj);
    } catch (error) {
      console.error("Error in handleInputChange:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to select slip",
        life: 2000,
      });
    }
  };

  // Log payload whenever selectedSlip changes
  useEffect(() => {
    if (selectedSlip) {
      try {
        // Validate required data
        if (!homeSlip?.id || !homeSlip?.member?.id) {
          throw new Error("Invalid home slip data");
        }

        if (!selectedSlip.id || !selectedSlip.member?.id) {
          throw new Error("Invalid selected slip data");
        }

        const payload = {
          fromSlip: {
            id: homeSlip?.id,
          },
          fromMember: {
            id: homeSlip?.member?.id,
          },
          toSlip: {
            id: selectedSlip.id,
          },
          toMember: {
            id: selectedSlip.member?.id,
          },
        };

        setPayload(payload);
      } catch (error) {
        console.error("Error creating payload:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.message || "Failed to prepare slip data",
          life: 2000,
        });
      }
    }
  }, [selectedSlip]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!selectedSlip) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please select a slip",
        life: 2000,
      });
      return;
    }

    if (!payload) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Invalid slip data. Please try again",
        life: 2000,
      });
      return;
    }

    setIsLoading(true);


    try {
 const selectedUserStr = localStorage.getItem("selectedBranch");
    const selectedBranch = JSON.parse(selectedUserStr);
    let branchUid = selectedBranch.uid;

      // Call switch slip API
      const response = await useJwt.postSwitchSlipById(branchUid , payload);

      // Validate response
      if (!response || !response.data) {
        throw new Error("No response received from server");
      }

      // Check if response status is 200 or 201 but payment method is Credit Card
      if (
        (response.status === 200 || response.status === 201) &&
        response.data?.paymentMethod === "Credit Card"
      ) {
        toast.current.show({
          severity: "error",
          summary: "Payment Failed",
          detail:
            "Credit card payment failed. Please try another payment method",
          life: 4000,
        });
        setIsLoading(false);
        return;
      }

      setResponseData(response.data);
      setPaymentMethod(response.data?.paymentMethod || "");

      // Set payer based on amounts
      if (response.data?.fromAmount > 0) {
        setPayer("From Slip Member");
        setAmmountTobePaid(response.data?.fromAmount);
      } else if (response.data?.toAmount > 0) {
        setPayer("To Slip Member");
        setAmmountTobePaid(response.data?.toAmount);
      } else {
        // If no amount to pay
        toast.current.show({
          severity: "info",
          summary: "No Payment Required",
          detail: "Slip switching completed with no payment required",
          life: 3000,
        });
      }

      // Handle monthly slip switching
      if (selectedSlip.paidIn === "Monthly") {
        try {
          console.log("Processing monthly switch slip...", response.data);

          // Validate monthly data
          if (!response.data?.fromSlip || !response.data?.toSlip) {
            throw new Error("Invalid response data for monthly switch");
          }

          const monthlyPayloadData = {
            fromSlip: {
              id: homeSlip?.id,
            },
            fromMember: {
              id: homeSlip?.member?.id,
            },
            toSlip: {
              id: selectedSlip.id,
            },
            toMember: {
              id: selectedSlip.member?.id,
            },
            fromAmount: response?.data?.fromSlip?.amount || 0,
            toAmount: response?.data?.toSlip?.amount || 0,
          };

          console.log("Payload to Send for monthly:", monthlyPayloadData);

          const monthlyResponse = await useJwt.postSwitchSlip(
            monthlyPayloadData
          );

          if (!monthlyResponse || !monthlyResponse.data) {
            throw new Error("Invalid response from monthly switch slip");
          }

          // Check for Credit Card payment failure in monthly response
          if (
            (monthlyResponse.status === 200 ||
              monthlyResponse.status === 201) &&
            monthlyResponse.data?.paymentMethod === "Credit Card"
          ) {
            toast.current.show({
              severity: "error",
              summary: "Payment Failed",
              detail:
                "Credit card payment failed for monthly slip. Please try another payment method",
              life: 4000,
            });
            setIsLoading(false);
            return;
          } else {
            setTimeout(() => {
              navigate("/dashboard/slipmember_list");
            }, 3000);
          }

          console.log("*****monthly Response", monthlyResponse);

          // toast.current.show({
          //   severity: "success",
          //   summary: "Success",
          //   detail: "Monthly slip switched successfully",
          //   life: 3000,
          // });

          setTimeout(() => {
            navigate("/dashboard/slipmember_list");
          }, 3000);

          return; // Exit function after monthly processing
        } catch (error) {
          console.error("Error in monthly switch slip:", error);

          let errorMessage = "Failed to process monthly switch slip";

          if (error.response) {
            if (error.response.status === 400) {
              errorMessage =
                error.response.data?.message || "Invalid monthly slip data";
            } else if (error.response.status === 409) {
              errorMessage =
                "Conflict in monthly slip switching. Please try again";
            } else if (error.response.status >= 500) {
              errorMessage = "Server error during monthly slip processing";
            } else {
              errorMessage = error.response.data?.message || errorMessage;
            }
          } else if (error.request) {
            errorMessage = "Network error during monthly slip processing";
          } else {
            errorMessage = error.message || errorMessage;
          }

          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: errorMessage,
            life: 4000,
          });
          setIsLoading(false);
          return; // Exit on monthly processing failure
        }
      }

      // Success message for annual slips
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Slip calculation completed successfully",
        life: 2000,
      });

      setCalculated(true);
    } catch (error) {
      console.error("Error switching slip:", error);

      let errorMessage = "Failed to switch slip";
      let errorSummary = "Error";

      if (error.response) {
        // Server error responses
        const status = error.response.status;

        if (status === 400) {
          errorSummary = "Invalid Request";
          errorMessage =
            error.response.data?.message || "Invalid slip data provided";
        } else if (status === 401) {
          errorSummary = "Unauthorized";
          errorMessage = "Session expired. Please login again";
          setTimeout(() => navigate("/login"), 2000);
        } else if (status === 403) {
          errorSummary = "Access Denied";
          errorMessage = "You do not have permission to switch slips";
        } else if (status === 404) {
          errorSummary = "Not Found";
          errorMessage = "Slip not found. It may have been deleted";
        } else if (status === 409) {
          errorSummary = "Conflict";
          errorMessage = "Slip is already in use or unavailable";
        } else if (status === 422) {
          errorSummary = "Validation Error";
          errorMessage =
            error.response.data?.message || "Invalid data provided";
        } else if (status >= 500) {
          errorSummary = "Server Error";
          errorMessage = "Server error occurred. Please try again later";
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // Network error
        errorSummary = "Network Error";
        errorMessage =
          "Unable to connect to server. Please check your internet connection";
      } else {
        // Other errors
        errorMessage = error.message || errorMessage;
      }

      toast.current.show({
        severity: "error",
        summary: errorSummary,
        detail: errorMessage,
        life: 4000,
      });
    } finally {
      setIsLoading(false);
    }

    console.log("Final Payload to Send:", payload);
  };

  const handleCancel = () => {
    try {
      navigate(-1);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
      navigate("/dashboard/slipmember_list");
    }
  };

  useEffect(() => {
    const SendingPayload = {
      ...payload,
    };

    console.log("Payload in useEffect:", SendingPayload);
  }, [payload]);

  // Show error if no slip data is available
  if (!slip) {
    return (
      <Card>
        <CardBody>
          <Toast ref={toast} />
          <CardTitle tag="h4"> Switch Slip Payment Form</CardTitle>
          <CardText>
            <div className="alert alert-warning">
              No slip data available. Please select a slip first.
            </div>
            <Button
              color="secondary"
              onClick={() => navigate("/dashboard/slipmember_list")}
            >
              Go Back
            </Button>
          </CardText>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <Toast ref={toast} />
        <div className="d-flex align-items-center mb-2">
          <ArrowLeft
            style={{
              cursor: "pointer",
              marginRight: "10px",
              transition: "color 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
            onClick={() => window.history.back()}
          />
          <CardTitle tag="h4" className="mb-0">
            Switch Slip Payment Form
          </CardTitle>
        </div>
        <CardText>
          <div>
            {/* Display current slip info */}
            <div className="mb-1 p-1 bg-light rounded">
              <h5>From Slip Information</h5>
              <p>
                <strong>Slip Name:</strong> {homeSlip?.slipName || "N/A"}
              </p>
              <p>
                <strong>Member:</strong>{" "}
                {homeSlip?.member
                  ? `${homeSlip.member.firstName || ""} ${
                      homeSlip.member.lastName || ""
                    }`
                  : "N/A"}
              </p>
              <p>
                <strong>Payment Type:</strong> {homeSlip?.paidIn || "N/A"}
              </p>
            </div>

            {Calculated ? (
              <div>
                <p>
                  To Slip Selected: <strong>{selectedSlip?.slipName}</strong>
                </p>
                <div className="mb-1 p-1 bg-light rounded">
                  <h5>To Slip Information</h5>
                  <p>
                    <strong>Slip Name:</strong> {selectedSlip?.slipName}
                  </p>
                  <p>
                    <strong>Member:</strong>{" "}
                    {selectedSlip?.member
                      ? `${selectedSlip.member.firstName} ${selectedSlip.member.lastName}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label className="form-label" for="slipSelect">
                        Select to Slip
                      </Label>
                      {isLoadingSlips ? (
                        <div className="d-flex align-items-center justify-content-center p-3">
                          <Spinner color="primary" />
                          <span className="ms-2">Loading slips...</span>
                        </div>
                      ) : (
                        <Input
                          type="select"
                          id="slipSelect"
                          name="slipSelect"
                          value={selectedSlipId}
                          onChange={handleInputChange}
                          disabled={isLoading || slips.length === 0}
                        >
                          <option value="">
                            {slips.length === 0
                              ? "-- No Slips Available --"
                              : "-- Select Slip --"}
                          </option>
                          {slips.map((slip) => (
                            <option key={slip.id} value={slip.id}>
                              {slip.slipName}
                            </option>
                          ))}
                        </Input>
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button
                    color="primary"
                    type="submit"
                    disabled={isLoading || isLoadingSlips || !selectedSlipId}
                  >
                    {isLoading ? "Processing..." : "Calculate"}
                  </Button>{" "}
                  <Button
                    color="secondary"
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading || isLoadingSlips}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </div>

          {Calculated && isAnnual === "Annual" && (
            <SwitchSlipForm
              payer={payer}
              ammountTobePaid={ammountTobePaid}
              payloadsent={payload}
              responseData={responseData}
            />
          )}
        </CardText>
      </CardBody>
    </Card>
  );
}

export default SwitchSlipPaymentForm;
