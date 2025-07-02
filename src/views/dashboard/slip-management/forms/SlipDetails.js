import React, { useState, useEffect,useRef } from "react";
import Select from "react-select";
import { Spinner, UncontrolledAlert } from "reactstrap";
import { Tooltip } from "reactstrap"; // ** Utils
// import Invoice from '../../invoice_management/Invoice'
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Input,
  Form,
  Button,
  Label,
  Row,
  FormFeedback,
} from "reactstrap";

import useJwt from "@src/auth/jwt/useJwt";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate, useParams } from "react-router-dom";
import { parse } from "@babel/core/lib/parse";
import { useLocation } from "react-router-dom";
import { colors } from "@mui/material";
import { Edit, Repeat, Send } from "lucide-react";
// import Index from './SlipDetailsForm';
const MySwal = withReactContent(Swal);

function SlipDetailsForm({ assigned }) {
  let navigate = useNavigate();
  const [loadinng, setLoading] = useState(false);
  const toast = useRef(null);

  // let { uid } = useParams();
  const location = useLocation();

  const uid=location.state?.uid || "";
  
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

  const [userData, setUserData] = useState({
    slipName: "",
    electric: false,
    water: false,
    addOn: "",
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
    overDueChagesForAuction: "",
  });
  const [shipTypeNames, setShipTypeNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Store selected option for the single dropdown
  const [dimensions, setDimensions] = useState([]); // Dimensions for the selected category
  const [selections, setSelections] = useState({
    overDueChargesFor7Days: "",
    overDueChargesFor15Days: "",
    overDueChargesFor30Days: "",
    overDueChargesForNotice: "",
    overDueChagesForAuction: "",
  });
  const [errors, setErrors] = useState({});
  const [slipNames, setSlipNames] = useState(["Slip123", "Dock456"]); // Example of existing slip names
  const [View, SetView] = useState(true);
  const [fetchLoader, setFetchLoader] = useState(false);

  const handleSelectTypeChange = (name, value) => {
    setSelections((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Also update the userData state
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSelectChange = (option) => {
    setSelectedCategory(option);
    setDimensions(option?.dimensions || []); // Update dimensions for the selected category
  };

  // const handleChange = ({ target }) => {
  //   const { name, value, checked, type } = target;
  //   if (type === "checkbox") {
  //     setUserData((prev) => ({ ...prev, [name]: checked }));
  //   } else {
  //     setUserData((prev) => ({ ...prev, [name]: value }));
  //   }

  //   if (userData.electric === false) {
  //     setUserData((prev) => ({ ...prev, amps: "" }));
  //   }

  
  // };


  const handleChange = ({ target }) => {
    const { name, value, checked, type } = target;
  
    // Handle checkbox change
    if (type === "checkbox") {
      setUserData((prev) => ({ ...prev, [name]: checked }));
    } else {
      // Update the value for the text field
      setUserData((prev) => ({ ...prev, [name]: value }));
  
      // Validate the 'addOn' value and prevent empty string or invalid characters
      if (name === "addOn") {
        if (value === "") {
          errors.addOn = "Add-on cannot be empty";
        } else if (!alphanumericRegex.test(value)) {
          errors.addOn = "Add-on can only contain letters, periods, and hyphens";
        } else {
          errors.addOn = ""; // Clear any previous errors if valid
        }
      }
    }
  
    if (userData.electric === false) {
      setUserData((prev) => ({ ...prev, amps: "" }));
    }
  };
  

  const handleSubmit = async (e, data) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted successfully:", { selections, userData });
      try {
        const payload = {
          slipName: userData.slipName,
          electric: userData.electric,
          water: userData.water,
          // addOn: userData.addOn,
          addOn: userData.addOn?.trim() === "" ? null : userData.addOn,

          amps: parseFloat(userData.amps),
          marketAnnualPrice: parseFloat(userData.marketAnnualPrice) || 0,
          marketMonthlyPrice: parseFloat(userData.marketMonthlyPrice) || 0,
          slipCategoryUid: selectedCategory?.value,

          // Adjusting dimensions to ensure height comes before width
          dimensions: (() => {
            const unorderedDimensions = dimensions.reduce((acc, dim) => {
              acc[dim] = parseFloat(userData[dim]) || 0;
              return acc;
            }, {});

            // Explicitly reorder dimensions to prioritize 'height' over 'width'
            const orderedDimensions = {};
            if ("length" in unorderedDimensions)
              orderedDimensions.length = unorderedDimensions.length;
            if ("height" in unorderedDimensions)
              orderedDimensions.height = unorderedDimensions.height;
            if ("width" in unorderedDimensions)
              orderedDimensions.width = unorderedDimensions.width;

            // Add any remaining dimensions
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

          overDueChagesForAuction: selections.overDueChagesForAuction,
        };
        console.log("payload", payload);
        setLoading(true);

        if (uid) {
          // Update existing entry

         const updateRes= await useJwt.updateslip(uid, payload);
          // return MySwal.fire({
          //   title: "Successfully Updated",
          //   text: " Your Details Updated Successfully",
          //   icon: "success",
          //   customClass: {
          //     confirmButton: "btn btn-primary",
          //   },
          //   buttonsStyling: false,
          // }).then(() => {
          //   navigate("/dashboard/slipdetail_list");
          // });

          if (updateRes.status === 200) {
            toast.current.show({
              severity: "success",
              summary: "Updated Successfully",
              detail: "Slip Details Updated Successfully .",
              life: 2000,
            });
            setTimeout(() => {
              navigate("/dashboard/slipdetail_list");
            }, 2000);
          }

        } else {
          try {
            const CreateRes= await useJwt.postslip(payload);
            // MySwal.fire({
            //   title: "Successfully Created",
            //   text: " Your Slip Details Created Successfully",
            //   icon: "success",
            //   customClass: {
            //     confirmButton: "btn btn-primary",
            //   },
            //   buttonsStyling: false,
            // }).then(() => {
            //   // navigate("/marin/slip-management  ");
            // });
            if (updateRes.status === 201) {
              toast.current.show({
                severity: "success",
                summary: "Created Successfully",
                detail: "Slip Details Created Successfully .",
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
      }
      finally{
        setLoading(false);

      }
    } else {
      console.log("Validation failed. Please fix the errors.");
    }
  };

  const validate = () => {
    const newErrors = {};
    const alphanumericRegex = /^(?!\s*$)[A-Za-z0-9 ]+$/; //
    const alphabeticRegex = /^[A-Za-z.-]+$/; // accept a-z . -
    const NonSpecialChar = /[^a-zA-Z0-9 ]/g;

    // Validate Slip Name
    if (!userData.slipName) {
      newErrors.slipName = "Slip Name is required";
    } else if (!alphanumericRegex.test(userData.slipName)) {
      newErrors.slipName = "Slip Name should contain only letters and numbers";
    } else {
      // If `uid` exists (update mode), exclude current slipName from uniqueness check
      const isDuplicate = slipNames.some(
        (name) => name === userData.slipName && name !== currentSlipName // Ignore current slipName if updating
      );

      if (!uid && isDuplicate) {
        // Check uniqueness only if it's not an update (no uid)
        newErrors.slipName = "Slip Name must be unique";
      }
    }
    // Validate Category
    if (!selectedCategory) {
      newErrors.category = "Category is required";
    }

    // Validate Dimensions
    // dimensions.forEach((dim) => {
    //   if (!userData[dim]) {
    //     newErrors[dim] = `${dim.toUpperCase()} is required`;
    //   }
    // });


    dimensions.forEach((dim) => {
      if (!userData[dim]) {
        newErrors[dim] = `${dim.toUpperCase()} is required`;
      } else if (Number(userData[dim]) <= 0) {
        // Show custom error for "length"
        if (dim === "length") {
          newErrors[dim] = "Length should be greater than 0";
        } else {
          newErrors[dim] = "Dimensions should be greater than 0";
        }
      }
    });

    
    // Validate Add-On
    if (userData.addOn && !alphanumericRegex.test(userData.addOn)) {
      newErrors.addOn = "Add-on can only contain letters, periods, and hyphens";
    }

    // Validate Annual Price
    if (!userData.marketAnnualPrice) {
      newErrors.marketAnnualPrice = "Annual Price is required";
    } else if (isNaN(userData.marketAnnualPrice)) {
      newErrors.marketAnnualPrice = "Annual Price must be a number";
    }

    // Validate Monthly Price
    if (!userData.marketMonthlyPrice) {
      newErrors.marketMonthlyPrice = "Monthly Price is required";
    } else if (isNaN(userData.marketMonthlyPrice)) {
      newErrors.marketMonthlyPrice = "Monthly Price must be a number";
    }

    // Validate AMPS if Electric is enabled
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
      selections.overDueChagesForAuction === "Percentage" &&
      userData.overDueAmountForAuction > 100
    ) {
      newErrors.overDueAmountForAuction =
        "Percentage amount must be less than or equal to 100.";
    } else if (!selections.overDueChagesForAuction) {
      newErrors.overDueAmountForAuction = "Please select a type.";
    }

    return newErrors;
  };

  const fetchData = async () => {
    try {
      const payload = {}; 
      const response = await useJwt.getslipCatogory(payload);
      console.log(response);

      const options = response?.data?.content?.result.map((item) => ({
        value: item.uid,
        label: item.shipTypeName,
        dimensions: item.dimensions, // Store dimensions for each category
      }));

      setShipTypeNames(options);
    } catch (error) {
      console.error("Error fetching category:", error);
      const { response } = error;
      const { data, status } = response;
      if (status == 400) {
        console.log(data.content);
      }
    }

    console.log("Category", selectedCategory);
  };

  useEffect(() => {
    fetchData();

    if (uid) {
      setFetchLoader(true);

      const fetchDetailsForUpdate = async () => {
        try {
          const resp = await useJwt.getslip(uid);

          const result = resp.data.content;
          console.log(result);

          if (result) {
            if (result && result.uid === uid) {
              setUserData({
                slipName: result.slipName,
                electric: result.electric,
                water: result.water,
                addOn: result.addOn,
                marketAnnualPrice: result.marketAnnualPrice,
                marketMonthlyPrice: result.marketMonthlyPrice,
                amps: result.amps,
                overDueAmountFor7Days: result.overDueAmountFor7Days,
                overDueAmountFor15Days: result.overDueAmountFor15Days,
                overDueAmountFor30Days: result.overDueAmountFor30Days,
                overDueAmountForNotice: result.overDueAmountForNotice,
                overDueAmountForAuction: result.overDueAmountForAuction,
              });
            }
            setDimensions(Object.keys(result.dimensions) || []);
            setUserData((pre) => ({ ...pre, ...result.dimensions }));

            setSelectedCategory({
              value: result.category.uid,
              label: result.category.shipTypeName,
              dimensions: result.dimensions,
            });
            console.log("result", result);

            console.log("selectedCategory", {
              dimensions: result.dimensions,
            });

            setSelections({
              overDueChargesFor7Days: result.overDueChargesFor7Days,
              overDueChargesFor15Days: result.overDueChargesFor15Days,
              overDueChargesFor30Days: result.overDueChargesFor30Days,
              overDueChargesForNotice: result.overDueChargesForNotice,
              overDueChagesForAuction: result.overDueChagesForAuction,
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
      marketAnnualPrice: "",
      marketMonthlyPrice: "",
      amps: "",
      overDueAmountFor7Days: "",
      overDueAmountFor15Days: "",
      overDueAmountFor30Days: "",
      overDueAmountForNotice: "",
      overDueAmountForAuction: "",
    });
    setErrors({
      slipName: "",
      electric: false,
      water: false,
      addOn: "",
      marketAnnualPrice: "",
      marketMonthlyPrice: "",
      amps: "",
      dimensions: false,
      overDueAmountFor7Days: "",
      overDueAmountFor15Days: "",
      overDueAmountFor30Days: "",
      overDueAmountForNotice: "",
      overDueAmountForAuction: "",
    });
    setErrorMessage("");
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
        
        <CardHeader className="border-bottom">
          <CardTitle tag="h5">
            {" "}
            {View ? "Slip Details" : "Edit Details"}
          </CardTitle>

          <div className="d-flex justify-content-end gap-2">
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
            {/* <div>
              <Link>
                <img
                  width="25"
                  height="25"
                  id="switchSlipTooltip"
                  src="https://img.icons8.com/ios-glyphs/30/repeat.png"
                  alt="repeat"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.switchSlip}
                  target="switchSlipTooltip"
                  toggle={() => toggleTooltip("switchSlip")}
                >
                  Switch Slip
                </Tooltip>
              </Link>
            </div>

            <div>
              <Link to="/dashboard/invoice_management/Invoice">
                <img
                  width="25"
                  height="25"
                  id="takePaymentTooltip"
                  src="https://img.icons8.com/ios/50/online-payment-.png"
                  alt="online-payment"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.takePayment}
                  target="takePaymentTooltip"
                  toggle={() => toggleTooltip("takePayment")}
                >
                  Take Slip Payment
                </Tooltip>
              </Link>
            </div>
            <div>
              <Link>
                <img
                  width="25"
                  height="25"
                  id="purchaseOrderTooltip"
                  src="https://img.icons8.com/ios/50/purchase-order.png"
                  alt="purchase-order"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.purchaseOrder}
                  target="purchaseOrderTooltip"
                  toggle={() => toggleTooltip("purchaseOrder")}
                >
                  Send Rental Invoice
                </Tooltip>
              </Link>
            </div> */}
            {/* <div>
              <Link>
                <img
                  width="25"
                  height="25"
                  id="listEmptyTooltip"
                  src="https://img.icons8.com/fluency-systems-regular/50/list-is-empty.png"
                  alt="list-is-empty"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.listEmpty}
                  target="listEmptyTooltip"
                  toggle={() => toggleTooltip("listEmpty")}
                >
                  Make Empty Slip
                </Tooltip>
              </Link>
            </div> */}
          </div>
        </CardHeader>

        {/* <Row className="mb-1">
          <Label sm="3" for="shipTypeName"></Label>
          <Col sm="9">
            {errorMessage && (
              <React.Fragment>
                <UncontrolledAlert color="danger">
                  <div className="alert-body">
                    <span className="text-danger fw-bold">{errorMessage}</span>
                  </div>
                </UncontrolledAlert>
              </React.Fragment>
            )}
          </Col>
        </Row> */}

        <CardBody className="py-2 my-25">
          <p>
            <strong>Note : </strong> If the slip is assigned, you can only
            update <strong>Electric </strong> ,<strong>Water</strong>,{" "}
            <strong>Add-On</strong> And <strong>AMPS</strong>{" "}
          </p>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-1 ">
              <Label sm="3" for="name">
                Slip Name
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  style={getReadOnlyStyle()}
                  value={userData.slipName}
                  onChange={handleChange}
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
                  // isDisabled={!!uid}
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
                        ""
                      ); // Ensure only numbers and dots are allowed
                      setUserData((prev) => ({
                        ...prev,
                        [dim]: validatedDimension,
                      })); // Correct state update
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

            {/* Electric Switch Field */}
            <Row className="mb-1 ">
              <Label sm="3" for="electric">
                Electric (Yes/No)
              </Label>
              <Col sm="9">
                <div
                  className="form-check form-switch d-flex align-items-center"
                  style={{ margin: " 0px -55px" }}
                >
                  <Label
                    className=" px-1"
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

            {/* Water Switch Field */}
            <Row className="mb-1">
              <Label sm="3" for="water">
                Water (Yes/No)
              </Label>
              <Col sm="9">
                <div
                  className="form-check form-switch d-flex align-items-center"
                  style={{ margin: " 0px -55px" }}
                >
                  {/* "No" label to the left */}
                  <Label
                    className="px-1"
                    htmlFor="water"
                    style={{ textAlign: "left" }}
                  >
                    No
                  </Label>

                  {/* Toggle switch */}
                  <Input
                    type="switch"
                    name="water"
                    id="water"
                    disabled={View}
                    checked={userData?.water}
                    onChange={handleChange}
                    style={{ margin: 0, opacity: 1 }}
                  />

                  {/* "Yes" label to the right */}
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
                    onChange={handleChange}
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
      onChange={handleChange}
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
              <Label sm="3" for="marketAnnualPrice">
                Market Annual Price
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={userData.marketAnnualPrice}
                  onChange={(e) => {
                    let marketAnnual = e.target.value; // Use "let" instead of "const"
                    marketAnnual = marketAnnual.replace(/[^0-9.]/g, ""); // Apply replace correctly

                    setUserData((prev) => ({
                      ...prev,
                      marketAnnualPrice: marketAnnual,
                    })); // Fix state update
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
                Market Monthly Price
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={userData.marketMonthlyPrice}
                  onChange={(e) => {
                    let marketMonth = e.target.value; // Use "let" instead of "const"
                    marketMonth = marketMonth.replace(/[^0-9.]/g, ""); // Apply replace correctly

                    setUserData((prev) => ({
                      ...prev,
                      marketMonthlyPrice: marketMonth,
                    })); // Fix state update
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
                        "Percentage"
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
                    disabled={View}
                    id="Flat"
                    checked={selections.overDueChargesFor7Days === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesFor7Days", "Flat")
                    }
                    invalid={!!errors.overDueChargesFor7Days}
                  />{" "}
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
                      let sevenDays = e.target.value; // Use "let" instead of "const"
                      sevenDays = sevenDays.replace(/[^0-9.]/g, ""); // Apply replace correctly

                      setUserData((prev) => ({
                        ...prev,
                        overDueAmountFor7Days: sevenDays,
                      })); // Fix state update
                    }}
                    placeholder="Enter 7 Days Charges"
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
                        "Percentage"
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
                    disabled={View}
                    checked={selections.overDueChargesFor15Days === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesFor15Days", "Flat")
                    }
                    name="overDueChargesFor15Days "
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
                      })); // Fix state update
                    }}
                    placeholder="Enter 15 Days Charges"
                    invalid={!!errors.overDueAmountFor15Days}
                  />
                  <FormFeedback>{errors.overDueAmountFor15Days}</FormFeedback>
                </div>

                <FormFeedback>{errors.overDueAmountFor15Days}</FormFeedback>
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
                        "Percentage"
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
                    placeholder="Enter 30 Days Charges"
                    value={userData.overDueAmountFor30Days || ""}
                    onChange={(e) => {
                      let thirty = e.target.value;
                      thirty = thirty.replace(/[^0-9.]/g, "");

                      setUserData((prev) => ({
                        ...prev,
                        overDueAmountFor30Days: thirty,
                      })); // Fix state update
                    }}
                    invalid={!!errors.overDueAmountFor30Days}
                  />
                  <FormFeedback>{errors.overDueAmountFor30Days}</FormFeedback>
                </div>

                <FormFeedback>{errors.overDueAmountFor30Days}</FormFeedback>
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
                        "Percentage"
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
                      })); // Fix state update
                    }}
                    placeholder="Enter Notice Charges"
                    invalid={!!errors.overDueAmountForNotice}
                  />
                  <FormFeedback>{errors.overDueAmountForNotice}</FormFeedback>
                </div>

                <FormFeedback>{errors.overDueAmountForNotice}</FormFeedback>
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
                      selections.overDueChagesForAuction === "Percentage"
                    }
                    onChange={() =>
                      handleSelectTypeChange(
                        "overDueChagesForAuction",
                        "Percentage"
                      )
                    }
                    name="overDueChagesForAuction"
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
                    checked={selections.overDueChagesForAuction === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChagesForAuction", "Flat")
                    }
                    name="overDueChagesForAuction"
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
                    placeholder="Enter Auction Charges"
                    value={userData.overDueAmountForAuction || ""}
                    onChange={(e) => {
                      let AuctionCharge = e.target.value;
                      AuctionCharge = AuctionCharge.replace(/[^0-9.]/g, "");

                      setUserData((prev) => ({
                        ...prev,
                        overDueAmountForAuction: AuctionCharge,
                      })); // Fix state update
                    }}
                    invalid={!!errors.overDueAmountForAuction}
                  />
                  <FormFeedback>{errors.overDueAmountForAuction}</FormFeedback>
                </div>

                <FormFeedback>{errors.overDueAmountForAuction}</FormFeedback>
              </Col>
            </Row>

            <Row>
              <Col
                // md={{ size: 6, offset: 3 }}
                className="d-flex mt-2 justify-content-end gap-2"
              >
                <Button
                  outline
                  disabled={View}
                  onClick={resetForm}
                  color="secondary"
                  type="reset"
                >
                  Reset
                </Button>
                <Button color="primary" disabled={View || loadinng} type="submit">
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
                  )}{" "}
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
