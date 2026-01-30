import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
  Tooltip,
} from "reactstrap";

import useJwt from "@src/auth/jwt/useJwt";
import { AbilityContext } from "@src/utility/context/Can";
import { ArrowLeft } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function SlipDetailsForm({ assigned, dataFromDashboard, fromData }) {
  let navigate = useNavigate();
  const [loadinng, setLoading] = useState(false);
  const toast = useRef(null);
  const location = useLocation();
  const uid = location.state?.uid || "";

  const [tooltipOpen, setTooltipOpen] = useState({
    edit: false,
    switchSlip: false,
    takePayment: false,
    purchaseOrder: false,
    listEmpty: false,
  });

  const toggleTooltip = (tooltip) => {
    setTooltipOpen((prevState) => ({
      ...prevState,
      [tooltip]: !prevState[tooltip],
    }));
  };
  const ability = useContext(AbilityContext);

  const [userData, setUserData] = useState({
    slipName: "",
    electric: false,
    water: false,
    addOn: "",
    marketRent: "",
    marketAnnualPrice: "",
    marketMonthlyPrice: "",
    amps: "",
    overDueChargesFor7Days: "",
    overDueAmountFor7Days: "",
    overDueAmountFor15Days: "",
    overDueChargesFor15Days: "",
    overDueAmountFor30Days: "",
    overDueChargesFor30Days: "",
    overDueAmountForNotice: "",
    overDueChargesForNotice: "",
    overDueAmountForAuction: "",
    overDueChargesForAuction: "",
  });

  const [shipTypeNames, setShipTypeNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const [selections, setSelections] = useState({
    overDueChargesFor7Days: "",
    overDueChargesFor15Days: "",
    overDueChargesFor30Days: "",
    overDueChargesForNotice: "",
    overDueChargesForAuction: "",
  });
  const [errors, setErrors] = useState({});
  const [slipNames, setSlipNames] = useState(["Slip123", "Dock456"]);
  const [View, SetView] = useState(true);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [SwitchSlip, setSwitchSlip] = useState(null);
  const [switchSlipModal, setSwitchSlipModal] = useState(false);
  const [currentSlipName, setCurrentSlipName] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Handler for Switch Slip button - Navigate to payment page
  const handleSwitchSlip = () => {
    if (selectedSlip) {
      navigate("/marin/slip-management/switch-slip-payment", {
        state: { slip: selectedSlip },
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Slip data not available",
        life: 2000,
      });
    }
  };

  // Toggle Switch Slip Modal (kept for compatibility)
  const toggleSwitchSlipModal = () => {
    setSwitchSlipModal(!switchSlipModal);
    if (switchSlipModal) {
      setIsEditMode(false);
      setSwitchSlip(null);
    }
  };

  const handleCloseModal = () => {
    setSwitchSlipModal(false);
    setIsEditMode(false);
    setSwitchSlip(null);
  };

  const handleSelectTypeChange = (name, value) => {
    setSelections((prev) => ({
      ...prev,
      [name]: value,
    }));

    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSelectChange = (option) => {
    setSelectedCategory(option);
    setDimensions(option?.dimensions || []);
    // PREFILL userData amounts
    setUserData((prev) => ({
      ...prev,
      overDueAmountFor7Days: option?.overDueAmountFor7Days ?? "",
      overDueAmountFor15Days: option?.overDueAmountFor15Days ?? "",
      overDueAmountFor30Days: option?.overDueAmountFor30Days ?? "",
      overDueAmountForNotice: option?.overDueAmountForNotice ?? "",
      overDueAmountForAuction: option?.overDueAmountForAuction ?? "",
    }));

    // PREFILL selections for radios
    setSelections((prev) => ({
      ...prev,
      overDueChargesFor7Days: option?.overDueChargesFor7Days ?? "",
      overDueChargesFor15Days: option?.overDueChargesFor15Days ?? "",
      overDueChargesFor30Days: option?.overDueChargesFor30Days ?? "",
      overDueChargesForNotice: option?.overDueChargesForNotice ?? "",
      overDueChargesForAuction: option?.overDueChargesForAuction ?? "",
    }));
  };

  const handleChange = ({ target }) => {
    const { name, value, checked, type } = target;
    const alphanumericRegex = /^(?!\s*$)[A-Za-z0-9 ]+$/;

    if (type === "checkbox") {
      setUserData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));

      if (name === "addOn") {
        if (value === "") {
          setErrors((prev) => ({ ...prev, addOn: "Add-on cannot be empty" }));
        } else if (!alphanumericRegex.test(value)) {
          setErrors((prev) => ({
            ...prev,
            addOn: "Add-on can only contain letters, periods, and hyphens",
          }));
        } else {
          setErrors((prev) => ({ ...prev, addOn: "" }));
        }
      }
    }

    if (userData.electric === false) {
      setUserData((prev) => ({ ...prev, amps: "" }));
    }
  };

  useEffect(() => {
    if (fromData == "dashboard" && dataFromDashboard) {
      setUserData({
        slipName: dataFromDashboard?.slipName || "",
        electric: dataFromDashboard?.electric || false,
        water: dataFromDashboard?.water || false,
        addOn: dataFromDashboard?.addOn || "",
        marketRent: dataFromDashboard?.marketRent || "",
        marketAnnualPrice: dataFromDashboard?.marketAnnualPrice || "",
        marketMonthlyPrice: dataFromDashboard?.marketMonthlyPrice || "",
        amps: dataFromDashboard?.amps || "",
        overDueAmountFor7Days: dataFromDashboard?.overDueAmountFor7Days || "",
        overDueChargesFor7Days: dataFromDashboard?.overDueChargesFor7Days || "",
        overDueAmountFor15Days: dataFromDashboard?.overDueAmountFor15Days || "",
        overDueChargesFor15Days:
          dataFromDashboard?.overDueChargesFor15Days || "",
        overDueAmountFor30Days: dataFromDashboard?.overDueAmountFor30Days || "",
        overDueChargesFor30Days:
          dataFromDashboard?.overDueChargesFor30Days || "",
        overDueAmountForNotice: dataFromDashboard?.overDueAmountForNotice || "",
        overDueChargesForNotice:
          dataFromDashboard?.overDueChargesForNotice || "",
        overDueAmountForAuction:
          dataFromDashboard?.overDueAmountForAuction || "",
        overDueChargesForAuction:
          dataFromDashboard?.overDueChargesForAuction || "",
      });

      setDimensions(Object.keys(dataFromDashboard.dimensions) || []);
      setUserData((pre) => ({ ...pre, ...dataFromDashboard.dimensions }));
      setSelectedCategory({
        value: dataFromDashboard.category.uid,
        label: dataFromDashboard.category.shipTypeName,
        dimensions: dataFromDashboard.dimensions,
        overDueChargesFor7Days:
          dataFromDashboard?.category?.overDueChargesFor7Days ?? "",
        overDueAmountFor7Days:
          dataFromDashboard?.category?.overDueAmountFor7Days ?? "",

        overDueChargesFor15Days:
          dataFromDashboard?.category?.overDueChargesFor15Days ?? "",
        overDueAmountFor15Days:
          dataFromDashboard?.category?.overDueAmountFor15Days ?? "",

        overDueChargesFor30Days:
          dataFromDashboard?.category?.overDueChargesFor30Days ?? "",
        overDueAmountFor30Days:
          dataFromDashboard?.category?.overDueAmountFor30Days ?? "",

        overDueChargesForNotice:
          dataFromDashboard?.category?.overDueChargesForNotice ?? "",
        overDueAmountForNotice:
          dataFromDashboard?.category?.overDueAmountForNotice ?? "",

        overDueChargesForAuction:
          dataFromDashboard?.category?.overDueChargesForAuction ?? "",
        overDueAmountForAuction:
          dataFromDashboard?.category?.overDueAmountForAuction ?? "",
      });

      setSelections({
        overDueChargesFor7Days:
          dataFromDashboard?.category?.overDueChargesFor7Days,
        overDueChargesFor15Days:
          dataFromDashboard?.category?.overDueChargesFor15Days,
        overDueChargesFor30Days:
          dataFromDashboard?.category?.overDueChargesFor30Days,
        overDueChargesForNotice:
          dataFromDashboard?.category?.overDueChargesForNotice,
        overDueChargesForAuction:
          dataFromDashboard?.category?.overDueChargesForAuction,
      });
    }
  }, [dataFromDashboard]);

  const handleSubmit = async (e, data) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      "Form submitted successfully:", { selections, userData };
      try {
        const payload = {
          slipName: userData.slipName,
          electric: userData.electric,
          water: userData.water,
          addOn: userData.addOn?.trim() === "" ? null : userData.addOn,
          amps: parseFloat(userData.amps),
          marketRent: parseFloat(userData.marketRent) || 0,

          marketAnnualPrice: parseFloat(userData.marketAnnualPrice) || 0,
          marketMonthlyPrice: parseFloat(userData.marketMonthlyPrice) || 0,
          slipCategoryUid: selectedCategory?.value,
          dimensions: (() => {
            const unorderedDimensions = dimensions.reduce((acc, dim) => {
              acc[dim] = parseFloat(userData[dim]) || 0;
              return acc;
            }, {});

            const orderedDimensions = {};
            if ("length" in unorderedDimensions)
              orderedDimensions.length = unorderedDimensions.length;
            if ("height" in unorderedDimensions)
              orderedDimensions.height = unorderedDimensions.height;
            if ("width" in unorderedDimensions)
              orderedDimensions.width = unorderedDimensions.width;

            for (const [key, value] of Object.entries(unorderedDimensions)) {
              if (!(key in orderedDimensions)) {
                orderedDimensions[key] = value;
              }
            }

            return orderedDimensions;
          })(),

          overDueAmountFor7Days:
            parseFloat(userData.overDueAmountFor7Days) || 0,
          overDueChargesFor7Days: selections.overDueChargesFor7Days,
          overDueAmountFor15Days:
            parseFloat(userData.overDueAmountFor15Days) || 0,
          overDueChargesFor15Days: selections.overDueChargesFor15Days,
          overDueAmountFor30Days:
            parseFloat(userData.overDueAmountFor30Days) || 0,
          overDueChargesFor30Days: selections.overDueChargesFor30Days,
          overDueAmountForNotice:
            parseFloat(userData.overDueAmountForNotice) || 0,
          overDueChargesForNotice: selections.overDueChargesForNotice,
          overDueAmountForAuction:
            parseFloat(userData.overDueAmountForAuction) || 0,
          overDueChargesForAuction: selections.overDueChargesForAuction,
        };

        "payload", payload;
        setLoading(true);

        if (uid || (fromData === "dashboard" && dataFromDashboard?.uid)) {
          const putUid=uid ? uid :dataFromDashboard?.uid;
          const updateRes = await useJwt.updateslip(putUid, payload);

          if (updateRes.status === 200) {
            toast.current.show({
              severity: "success",
              summary: "Updated Successfully",
              detail: "Slip Details Updated Successfully.",
              life: 2000,
            });
            setTimeout(() => {
              navigate("/dashboard/slipdetail_list");
            }, 2000);
          }
        } else {
          try {
            const CreateRes = await useJwt.postslip(payload);

            if (CreateRes.status === 201) {
              toast.current.show({
                severity: "success",
                summary: "Created Successfully",
                detail: "Slip Details Created Successfully.",
                life: 2000,
              });
              setTimeout(() => {
                navigate("/marin/slip-management");
              }, 2000);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        return MySwal.fire({
          title: "Error!",
          text: "An error occurred while submitting the form.",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        });
      } finally {
        setLoading(false);
      }
    } else {
      ("Validation failed. Please fix the errors.");
    }
  };

  const validate = () => {
    const newErrors = {};
    const alphanumericRegex = /^(?!\s*$)[A-Za-z0-9 ]+$/;
    const alphabeticRegex = /^[A-Za-z.-]+$/;
    const NonSpecialChar = /[^a-zA-Z0-9 ]/g;

    if (!userData.slipName) {
      newErrors.slipName = "Slip Name is required";
    } else if (!alphanumericRegex.test(userData.slipName)) {
      newErrors.slipName = "Slip Name should contain only letters and numbers";
    } else {
      const isDuplicate = slipNames.some(
        (name) => name === userData.slipName && name !== currentSlipName,
      );

      if (!uid && isDuplicate) {
        newErrors.slipName = "Slip Name must be unique";
      }
    }

    if (!selectedCategory) {
      newErrors.category = "Category is required";
    }

    dimensions.forEach((dim) => {
      if (!userData[dim]) {
        newErrors[dim] = `${dim.toUpperCase()} is required`;
      } else if (Number(userData[dim]) <= 0) {
        if (dim === "length") {
          newErrors[dim] = "Length should be greater than 0";
        } else {
          newErrors[dim] = "Dimensions should be greater than 0";
        }
      }
    });

    if (userData.addOn && !alphanumericRegex.test(userData.addOn)) {
      newErrors.addOn = "Add-on can only contain letters, periods, and hyphens";
    }

    if (!userData.marketAnnualPrice) {
      newErrors.marketAnnualPrice = "Annual Price is required";
    } else if (isNaN(userData.marketAnnualPrice)) {
      newErrors.marketAnnualPrice = "Annual Price must be a number";
    }

    if (!userData.marketRent) {
      newErrors.marketRent = "Market Rent is required";
    } else if (isNaN(userData.marketRent)) {
      newErrors.marketRent = "Market Rent must be a number";
    }
    if (!userData.marketMonthlyPrice) {
      newErrors.marketMonthlyPrice = "Monthly Price is required";
    } else if (isNaN(userData.marketMonthlyPrice)) {
      newErrors.marketMonthlyPrice = "Monthly Price must be a number";
    }

    if (userData.electric) {
      if (!userData.amps) {
        newErrors.amps = "AMPS is required when Electric is enabled";
      } else if (isNaN(userData.amps)) {
        newErrors.amps = "AMPS must be a number";
      }
    }
    if (
      !userData.overDueAmountFor7Days ||
      isNaN(userData.overDueAmountFor7Days)
    ) {
      newErrors.overDueAmountFor7Days = "Please enter a valid number.";
    } else if (userData.overDueAmountFor7Days <= 0) {
      newErrors.overDueAmountFor7Days = "Amount must be greater than zero.";
    } else if (
      selections.overDueChargesFor7Days === "Percentage" &&
      userData.overDueAmountFor7Days > 100
    ) {
      newErrors.overDueAmountFor7Days =
        "Percentage amount must be less than or equal to 100.";
    } else if (!selections.overDueChargesFor7Days) {
      newErrors.overDueAmountFor7Days = "Please select a type.";
    }

    if (
      !userData.overDueAmountFor15Days ||
      isNaN(userData.overDueAmountFor15Days)
    ) {
      newErrors.overDueAmountFor15Days = "Please enter a valid number.";
    } else if (userData.overDueAmountFor15Days <= 0) {
      newErrors.overDueAmountFor15Days = "Amount must be greater than zero.";
    } else if (
      selections.overDueChargesFor15Days === "Percentage" &&
      userData.overDueAmountFor15Days > 100
    ) {
      newErrors.overDueAmountFor15Days =
        "Percentage amount must be less than or equal to 100.";
    } else if (!selections.overDueChargesFor15Days) {
      newErrors.overDueAmountFor15Days = "Please select a type.";
    }
    if (
      !userData.overDueAmountFor30Days ||
      isNaN(userData.overDueAmountFor30Days)
    ) {
      newErrors.overDueAmountFor30Days = "Please enter a valid number.";
    } else if (userData.overDueAmountFor30Days <= 0) {
      newErrors.overDueAmountFor30Days = "Amount must be greater than zero.";
    } else if (
      selections.overDueChargesFor30Days === "Percentage" &&
      userData.overDueAmountFor30Days > 100
    ) {
      newErrors.overDueAmountFor30Days =
        "Percentage amount must be less than or equal to 100.";
    } else if (!selections.overDueChargesFor30Days) {
      newErrors.overDueAmountFor30Days = "Please select a type.";
    }

    if (
      !userData.overDueAmountForNotice ||
      isNaN(userData.overDueAmountForNotice)
    ) {
      newErrors.overDueAmountForNotice = "Please enter a valid number.";
    } else if (userData.overDueAmountForNotice <= 0) {
      newErrors.overDueAmountForNotice = "Amount must be greater than zero.";
    } else if (
      selections.overDueChargesForNotice === "Percentage" &&
      userData.overDueAmountForNotice > 100
    ) {
      newErrors.overDueAmountForNotice =
        "Percentage amount must be less than or equal to 100.";
    } else if (!selections.overDueChargesForNotice) {
      newErrors.overDueAmountForNotice = "Please select a type.";
    }

    if (
      !userData.overDueAmountForAuction ||
      isNaN(userData.overDueAmountForAuction)
    ) {
      newErrors.overDueAmountForAuction = "Please enter a valid number.";
    } else if (userData.overDueAmountForAuction <= 0) {
      newErrors.overDueAmountForAuction = "Amount must be greater than zero.";
    } else if (
      selections.overDueChargesForAuction === "Percentage" &&
      userData.overDueAmountForAuction > 100
    ) {
      newErrors.overDueAmountForAuction =
        "Percentage amount must be less than or equal to 100.";
    } else if (!selections.overDueChargesForAuction) {
      newErrors.overDueAmountForAuction = "Please select a type.";
    }

    return newErrors;
  };

  const fetchData = async () => {
    try {
      const payload = {};
      const response = await useJwt.getslipCatogory(payload);
      response;

      const options = response?.data?.content?.result.map((item) => ({
        value: item.uid,
        label: item.shipTypeName,
        dimensions: item.dimensions,
        overDueChargesFor7Days: item.overDueChargesFor7Days,
        overDueAmountFor7Days: item.overDueAmountFor7Days,

        overDueChargesFor15Days: item.overDueChargesFor15Days,
        overDueAmountFor15Days: item.overDueAmountFor15Days,

        overDueChargesFor30Days: item.overDueChargesFor30Days,
        overDueAmountFor30Days: item.overDueAmountFor30Days,

        overDueChargesForNotice: item.overDueChargesForNotice,
        overDueAmountForNotice: item.overDueAmountForNotice,

        overDueChargesForAuction: item.overDueChargesForAuction, // YOUR API TYPO
        overDueAmountForAuction: item.overDueAmountForAuction,
      }));

      setShipTypeNames(options);
    } catch (error) {
      console.error("Error fetching category:", error);
      const { response } = error;
      const { data, status } = response;
      if (status == 400) {
        data.content;
      }
    }

    "Category", selectedCategory;
  };

  useEffect(() => {
    fetchData();

    if (uid) {
      setFetchLoader(true);
      const fetchDetailsForUpdate = async () => {
        try {
          const resp = await useJwt.getslip(uid);

          const raw = resp.data.content?.result;
          const result = Array.isArray(raw) ? raw[0] : raw;

          setSelectedSlip(result);
          result;
          if (result) {
            if (result && result.uid === uid) {
              setUserData({
                slipName: result.slipName,
                electric: result.electric,
                water: result.water,
                addOn: result.addOn,
                marketRent: result.marketRent || 0,

                marketAnnualPrice: result.marketAnnualPrice,
                marketMonthlyPrice: result.marketMonthlyPrice,
                amps: result.amps,
                overDueAmountFor7Days: result?.overDueAmountFor7Days,
                overDueAmountFor15Days: result?.overDueAmountFor15Days,
                overDueAmountFor30Days: result?.overDueAmountFor30Days,
                overDueAmountForNotice: result?.overDueAmountForNotice,
                overDueAmountForAuction: result?.overDueAmountForAuction,
              });
              setCurrentSlipName(result.slipName);
            }
            setDimensions(Object.keys(result.dimensions) || []);
            setUserData((pre) => ({ ...pre, ...result.dimensions }));
            setSelectedCategory({
              value: result.category.uid,
              label: result.category.shipTypeName,
              dimensions: result.dimensions,
              overDueChargesFor7Days:
                result?.category?.overDueChargesFor7Days ?? "",
              overDueAmountFor7Days:
                result?.category?.overDueAmountFor7Days ?? "",

              overDueChargesFor15Days:
                result?.category?.overDueChargesFor15Days ?? "",
              overDueAmountFor15Days:
                result?.category?.overDueAmountFor15Days ?? "",

              overDueChargesFor30Days:
                result?.category?.overDueChargesFor30Days ?? "",
              overDueAmountFor30Days:
                result?.category?.overDueAmountFor30Days ?? "",

              overDueChargesForNotice:
                result?.category?.overDueChargesForNotice ?? "",
              overDueAmountForNotice:
                result?.category?.overDueAmountForNotice ?? "",

              overDueChargesForAuction:
                result?.category?.overDueChargesForAuction ?? "",
              overDueAmountForAuction:
                result?.category?.overDueAmountForAuction ?? "",
            });

            setSelections({
              overDueChargesFor7Days: result?.category?.overDueChargesFor7Days,
              overDueChargesFor15Days:
                result?.category?.overDueChargesFor15Days,
              overDueChargesFor30Days:
                result?.category?.overDueChargesFor30Days,
              overDueChargesForNotice:
                result?.category?.overDueChargesForNotice,
              overDueChargesForAuction:
                result?.category?.overDueChargesForAuction,
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setFetchLoader(false);
        }
      };
      fetchDetailsForUpdate();
    }

    fetchData();
  }, [uid]);

  const resetForm = () => {
    setUserData({
      dimensions: new Set(),
      slipName: "",
      electric: false,
      water: false,
      addOn: "",
      marketRent: "",

      marketAnnualPrice: "",
      marketMonthlyPrice: "",
      amps: "",
      overDueAmountFor7Days: "",
      overDueAmountFor15Days: "",
      overDueAmountFor30Days: "",
      overDueAmountForNotice: "",
      overDueAmountForAuction: "",
    });
    setErrors({});
  };

  const optionsForDays = [
    { value: "Flat", label: "Flat" },
    { value: "Percentage", label: "Percentage" },
  ];

  const getReadOnlyStyle = () => {
    return View
      ? {
          color: "#000",
          backgroundColor: "#fff",
          opacity: 1,
        }
      : {};
  };

  const handleEditBtn = () => {
    SetView(false);
  };

  if (fetchLoader)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4rem",
        }}
      >
        <Spinner
          color="primary"
          style={{
            height: "5rem",
            width: "5rem",
          }}
        />
      </div>
    );

  return (
    <>
      <Card>
        <Toast ref={toast} />

        <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
          {/* Left Section */}
          <div className="d-flex align-items-center">
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

            <CardTitle tag="h5" className="mb-0 d-flex align-items-center">
              {View ? "Slip Details" : "Edit Details"}
              <Button
                color="primary"
                onClick={handleSwitchSlip}
                className="ms-3"
                size={"sm"}
              >
                Switch Slip
              </Button>
            </CardTitle>
          </div>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-2">
            {ability.can("update", "slip management") ? (
              <div>
                <img
                  width="20"
                  height="20"
                  id="editTooltip"
                  src="https://img.icons8.com/ios/50/edit--v1.png"
                  alt="edit"
                  onClick={handleEditBtn}
                  style={{ cursor: "pointer" }}
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.edit}
                  target="editTooltip"
                  toggle={() => toggleTooltip("edit")}
                >
                  Edit
                </Tooltip>
              </div>
            ) : null}
          </div>
        </CardHeader>

        <CardBody className="py-2 my-25">
          <p>
            <strong>Note: </strong> If the slip is assigned, you can only update{" "}
            <strong>Electric</strong>, <strong>Water</strong>,{" "}
            <strong>Add-On</strong> And <strong>AMPS</strong>
          </p>

          <Form onSubmit={handleSubmit}>
            {/* Rest of the form fields remain the same... */}
            {/* I'm keeping all the form fields as they are in your original code */}
            <Row className="mb-1">
              <Label sm="3" for="name">
                Slip Name
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  style={getReadOnlyStyle()}
                  value={userData.slipName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
                    handleChange({ target: { name: "slipName", value } });
                  }}
                  onKeyPress={(e) => {
                    if (
                      !/[a-zA-Z0-9\s]/.test(e.key) &&
                      ![
                        "Backspace",
                        "Delete",
                        "Tab",
                        "Escape",
                        "Enter",
                        "ArrowLeft",
                        "ArrowRight",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const paste = (
                      e.clipboardData || window.clipboardData
                    ).getData("text");
                    const cleanValue = paste.replace(/[^a-zA-Z0-9\s]/g, "");
                    if (cleanValue) {
                      handleChange({
                        target: { name: "slipName", value: cleanValue },
                      });
                    }
                  }}
                  name="slipName"
                  disabled={assigned ? true : View}
                  id="slipName"
                  placeholder="Enter Slip Name"
                  invalid={!!errors.slipName}
                />
                {errors.slipName && (
                  <FormFeedback>{errors.slipName}</FormFeedback>
                )}
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="category">
                Category<span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Select
                  value={selectedCategory}
                  onChange={handleSelectChange}
                  name="category"
                  options={shipTypeNames}
                  isDisabled={assigned ? true : View}
                  isClearable
                  placeholder="Select Category"
                  className={errors.category ? "is-invalid" : ""}
                />
                {errors.category && (
                  <div className="invalid-feedback d-block">
                    {errors.category}
                  </div>
                )}
              </Col>
            </Row>

            {dimensions.map((dim) => (
              <Row className="mb-1" key={dim}>
                <Label sm="3" for={dim}>
                  {dim.toLowerCase()}
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm="9">
                  <Input
                    type="text"
                    value={userData[dim] || ""}
                    onChange={(e) => {
                      let validatedDimension = e.target.value.replace(
                        /[^0-9.]/g,
                        "",
                      );
                      setUserData((prev) => ({
                        ...prev,
                        [dim]: validatedDimension,
                      }));
                    }}
                    style={getReadOnlyStyle()}
                    name={dim}
                    id={dim}
                    disabled={assigned ? true : View}
                    placeholder={`Enter ${dim.toLowerCase()}`}
                    invalid={!!errors[dim]}
                  />
                  {errors[dim] && <FormFeedback>{errors[dim]}</FormFeedback>}
                </Col>
              </Row>
            ))}

            <Row className="mb-1">
              <Label sm="3" for="electric">
                Electric (Yes/No)
              </Label>
              <Col sm="9">
                <div
                  className="form-check form-switch d-flex align-items-center"
                  style={{ margin: "0px -55px" }}
                >
                  <Label
                    className="px-1"
                    htmlFor="electric"
                    style={{ textAlign: "right" }}
                  >
                    No
                  </Label>
                  <Input
                    type="switch"
                    name="electric"
                    id="electric"
                    checked={userData?.electric}
                    onChange={handleChange}
                    style={{ margin: 0, opacity: 1 }}
                    disabled={View}
                  />
                  <Label
                    className="px-1"
                    htmlFor="electric"
                    style={{ textAlign: "left" }}
                  >
                    Yes
                  </Label>
                </div>
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="water">
                Water (Yes/No)
              </Label>
              <Col sm="9">
                <div
                  className="form-check form-switch d-flex align-items-center"
                  style={{ margin: "0px -55px" }}
                >
                  <Label
                    className="px-1"
                    htmlFor="water"
                    style={{ textAlign: "left" }}
                  >
                    No
                  </Label>
                  <Input
                    type="switch"
                    name="water"
                    id="water"
                    disabled={View}
                    checked={userData?.water}
                    onChange={handleChange}
                    style={{ margin: 0, opacity: 1 }}
                  />
                  <Label
                    className="px-1"
                    htmlFor="water"
                    style={{ textAlign: "left" }}
                  >
                    Yes
                  </Label>
                </div>
              </Col>
            </Row>

            {userData.electric && (
              <Row className="mb-1">
                <Label sm="3" for="amps">
                  AMPS
                </Label>
                <Col sm="9">
                  <Input
                    type="text"
                    value={userData.amps}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    name="amps"
                    style={getReadOnlyStyle()}
                    id="amps"
                    readOnly={View}
                    placeholder="Enter AMPS"
                    invalid={!!errors.amps}
                  />
                  <FormFeedback>{errors.amps}</FormFeedback>
                </Col>
              </Row>
            )}

            <Row className="mb-1">
              <Label sm="3" for="addOn">
                Add-on
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={userData.addOn}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z0-9 ]*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  name="addOn"
                  id="addOn"
                  style={getReadOnlyStyle()}
                  readOnly={View}
                  placeholder="Enter Add-on"
                  invalid={!!errors.addOn}
                />
                <FormFeedback>{errors.addOn}</FormFeedback>
              </Col>
            </Row>
            <Row className="mb-1">
              <Label sm="3" for="marketRent">
                Market Rent
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={userData.marketRent}
                  onChange={(e) => {
                    let marketRent = e.target.value; // Use "let" instead of "const"
                    marketRent = marketRent.replace(/[^0-9.]/g, ""); // Apply replace correctly

                    setUserData((prev) => ({
                      ...prev,
                      marketRent: marketRent,
                    })); // Fix state update
                  }}
                  name="marketRent"
                  id="marketRent"
                  placeholder="Enter Market Rent"
                  disabled={assigned ? true : View}
                  invalid={!!errors.marketRent}
                />
                <FormFeedback>{errors.marketRent}</FormFeedback>
              </Col>
            </Row>
            <Row className="mb-1">
              <Label sm="3" for="marketAnnualPrice">
                Annual Price
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={userData.marketAnnualPrice}
                  onChange={(e) => {
                    let marketAnnual = e.target.value;
                    marketAnnual = marketAnnual.replace(/[^0-9.]/g, "");
                    setUserData((prev) => ({
                      ...prev,
                      marketAnnualPrice: marketAnnual,
                    }));
                  }}
                  name="marketAnnualPrice"
                  style={getReadOnlyStyle()}
                  disabled={assigned ? true : View}
                  id="marketAnnualPrice"
                  placeholder="Enter Annual Price"
                  invalid={!!errors.marketAnnualPrice}
                />
                <FormFeedback>{errors.marketAnnualPrice}</FormFeedback>
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="marketMonthlyPrice">
                Monthly Price
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={userData.marketMonthlyPrice}
                  onChange={(e) => {
                    let marketMonth = e.target.value;
                    marketMonth = marketMonth.replace(/[^0-9.]/g, "");
                    setUserData((prev) => ({
                      ...prev,
                      marketMonthlyPrice: marketMonth,
                    }));
                  }}
                  name="marketMonthlyPrice"
                  style={getReadOnlyStyle()}
                  disabled={assigned ? true : View}
                  id="marketMonthlyPrice"
                  placeholder="Enter Monthly Price"
                  invalid={!!errors.marketMonthlyPrice}
                />
                <FormFeedback>{errors.marketMonthlyPrice}</FormFeedback>
              </Col>
            </Row>
            {/* <fieldset disabled={true}> */}
            <Row className="mb-1">
              <Label sm="3" style={{ opacity: 1 }} for="marketMonthlyPrice">
                7 Days Charges
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    disabled={assigned ? true : View}
                    style={{ opacity: 1 }}
                    name="overDueChargesFor7Days"
                    value="Percentage"
                    id="Percentage"
                    checked={selections.overDueChargesFor7Days === "Percentage"}
                    onChange={() =>
                      handleSelectTypeChange(
                        "overDueChargesFor7Days",
                        "Percentage",
                      )
                    }
                    invalid={!!errors.overDueChargesFor7Days}
                  />
                  <Label
                    for="basic-cb-unchecked"
                    style={{ opacity: 1 }}
                    className="form-check-label"
                  >
                    Percentage
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    style={{ opacity: 1 }}
                    name="overDueChargesFor7Days"
                    value="Flat"
                    disabled={assigned ? true : View}
                    id="Flat"
                    checked={selections.overDueChargesFor7Days === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesFor7Days", "Flat")
                    }
                    invalid={!!errors.overDueChargesFor7Days}
                  />
                  <Label
                    for="basic-cb-unchecked"
                    style={{ opacity: 1 }}
                    className="form-check-label"
                  >
                    Flat
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="text"
                    disabled={assigned ? true : View}
                    style={getReadOnlyStyle()}
                    name="overDueAmountFor7Days"
                    value={userData.overDueAmountFor7Days || ""}
                    onChange={(e) => {
                      let sevenDays = e.target.value;
                      sevenDays = sevenDays.replace(/[^0-9.]/g, "");
                      setUserData((prev) => ({
                        ...prev,
                        overDueAmountFor7Days: sevenDays,
                      }));
                    }}
                    invalid={!!errors.overDueAmountFor7Days}
                  />
                  <FormFeedback>{errors.overDueAmountFor7Days}</FormFeedback>
                </div>
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="">
                15 Days Charges
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    disabled={assigned ? true : View}
                    style={{ opacity: 1 }}
                    checked={
                      selections.overDueChargesFor15Days === "Percentage"
                    }
                    onChange={() =>
                      handleSelectTypeChange(
                        "overDueChargesFor15Days",
                        "Percentage",
                      )
                    }
                    name="overDueChargesFor15Days"
                    id="basic-cb-unchecked"
                  />
                  <Label
                    for="basic-cb-unchecked"
                    style={{ opacity: 1 }}
                    className="form-check-label"
                  >
                    Percentage
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    style={{ opacity: 1 }}
                    disabled={assigned ? true : View}
                    checked={selections.overDueChargesFor15Days === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesFor15Days", "Flat")
                    }
                    name="overDueChargesFor15Days"
                    id="basic-cb-unchecked"
                  />
                  <Label
                    for="basic-cb-unchecked"
                    style={{ opacity: 1 }}
                    className="form-check-label"
                  >
                    Flat
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    disabled={assigned ? true : View}
                    type="text"
                    name="overDueAmountFor15Days"
                    style={getReadOnlyStyle()}
                    value={userData.overDueAmountFor15Days || ""}
                    onChange={(e) => {
                      let fiftinDays = e.target.value;
                      fiftinDays = fiftinDays.replace(/[^0-9.]/g, "");
                      setUserData((prev) => ({
                        ...prev,
                        overDueAmountFor15Days: fiftinDays,
                      }));
                    }}
                    invalid={!!errors.overDueAmountFor15Days}
                  />
                  <FormFeedback>{errors.overDueAmountFor15Days}</FormFeedback>
                </div>
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="">
                30 Days Charges
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    style={{ opacity: 1 }}
                    disabled={assigned ? true : View}
                    checked={
                      selections.overDueChargesFor30Days === "Percentage"
                    }
                    onChange={() =>
                      handleSelectTypeChange(
                        "overDueChargesFor30Days",
                        "Percentage",
                      )
                    }
                    name="overDueChargesFor30Days"
                    id="basic-cb-unchecked"
                  />
                  <Label
                    for="basic-cb-unchecked"
                    style={{ opacity: 1 }}
                    className="form-check-label"
                  >
                    Percentage
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    style={{ opacity: 1 }}
                    disabled={assigned ? true : View}
                    checked={selections.overDueChargesFor30Days === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesFor30Days", "Flat")
                    }
                    name="overDueChargesFor30Days"
                    id="basic-cb-unchecked"
                  />
                  <Label
                    for="basic-cb-unchecked"
                    style={{ opacity: 1 }}
                    className="form-check-label"
                  >
                    Flat
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="text"
                    disabled={assigned ? true : View}
                    style={getReadOnlyStyle()}
                    name="overDueAmountFor30Days"
                    value={userData.overDueAmountFor30Days || ""}
                    onChange={(e) => {
                      let thirty = e.target.value;
                      thirty = thirty.replace(/[^0-9.]/g, "");
                      setUserData((prev) => ({
                        ...prev,
                        overDueAmountFor30Days: thirty,
                      }));
                    }}
                    invalid={!!errors.overDueAmountFor30Days}
                  />
                  <FormFeedback>{errors.overDueAmountFor30Days}</FormFeedback>
                </div>
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="marketMonthlyPrice">
                Notice Charges
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <div className="form-check form-check-inline">
                  <Input
                    style={{ opacity: 1 }}
                    disabled={assigned ? true : View}
                    type="radio"
                    checked={
                      selections.overDueChargesForNotice === "Percentage"
                    }
                    onChange={() =>
                      handleSelectTypeChange(
                        "overDueChargesForNotice",
                        "Percentage",
                      )
                    }
                    name="overDueChargesForNotice"
                    id="basic-cb-unchecked"
                  />
                  <Label
                    for="basic-cb-unchecked"
                    style={{ opacity: 1 }}
                    className="form-check-label"
                  >
                    Percentage
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    disabled={assigned ? true : View}
                    style={{ opacity: 1 }}
                    type="radio"
                    checked={selections.overDueChargesForNotice === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesForNotice", "Flat")
                    }
                    name="overDueChargesForNotice"
                    id="basic-cb-unchecked"
                  />
                  <Label
                    for="basic-cb-unchecked"
                    style={{ opacity: 1 }}
                    className="form-check-label"
                  >
                    Flat
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    disabled={assigned ? true : View}
                    style={getReadOnlyStyle()}
                    type="text"
                    name="overDueAmountForNotice"
                    value={userData.overDueAmountForNotice || ""}
                    onChange={(e) => {
                      let noticeCharge = e.target.value;
                      noticeCharge = noticeCharge.replace(/[^0-9.]/g, "");
                      setUserData((prev) => ({
                        ...prev,
                        overDueAmountForNotice: noticeCharge,
                      }));
                    }}
                    invalid={!!errors.overDueAmountForNotice}
                  />
                  <FormFeedback>{errors.overDueAmountForNotice}</FormFeedback>
                </div>
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="marketMonthlyPrice">
                Auction Charges
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <div className="form-check form-check-inline">
                  <Input
                    disabled={assigned ? true : View}
                    style={{ opacity: 1 }}
                    type="radio"
                    checked={
                      selections.overDueChargesForAuction === "Percentage"
                    }
                    onChange={() =>
                      handleSelectTypeChange(
                        "overDueChargesForAuction",
                        "Percentage",
                      )
                    }
                    name="overDueChargesForAuction"
                    id="basic-cb-unchecked"
                  />
                  <Label
                    for="basic-cb-unchecked"
                    style={{ opacity: 1 }}
                    className="form-check-label"
                  >
                    Percentage
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    disabled={assigned ? true : View}
                    type="radio"
                    style={{ opacity: 1 }}
                    checked={selections.overDueChargesForAuction === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesForAuction", "Flat")
                    }
                    name="overDueChargesForAuction"
                    id="basic-cb-unchecked"
                  />
                  <Label
                    for="basic-cb-unchecked"
                    style={{ opacity: 1 }}
                    className="form-check-label"
                  >
                    Flat
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="text"
                    style={getReadOnlyStyle()}
                    disabled={assigned ? true : View}
                    name="overDueAmountForAuction"
                    value={userData.overDueAmountForAuction || ""}
                    onChange={(e) => {
                      let AuctionCharge = e.target.value;
                      AuctionCharge = AuctionCharge.replace(/[^0-9.]/g, "");
                      setUserData((prev) => ({
                        ...prev,
                        overDueAmountForAuction: AuctionCharge,
                      }));
                    }}
                    invalid={!!errors.overDueAmountForAuction}
                  />
                  <FormFeedback>{errors.overDueAmountForAuction}</FormFeedback>
                </div>
              </Col>
            </Row>
            {/* </fieldset> */}
            <Row>
              <Col className="d-flex mt-2 justify-content-end gap-2">
                <Button
                  outline
                  disabled={View}
                  onClick={resetForm}
                  color="secondary"
                  type="reset"
                >
                  Reset
                </Button>
                <Button
                  color="primary"
                  disabled={View || loadinng}
                  type="submit"
                >
                  {!loadinng ? (
                    uid ? (
                      "Update"
                    ) : (
                      "Submit"
                    )
                  ) : (
                    <>
                      <span className="me-1">Loading..</span>
                      <Spinner size="sm" />
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}

export default SlipDetailsForm;
