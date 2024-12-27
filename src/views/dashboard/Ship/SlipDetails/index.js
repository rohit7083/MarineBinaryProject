import React, { useState, useEffect } from "react";
import Select from "react-select";

// ** Utils
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
import "./index.css";
import useJwt from "@src/auth/jwt/useJwt";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useParams } from "react-router-dom";
import { parse } from "@babel/core/lib/parse";
import { useLocation } from "react-router-dom";

const MySwal = withReactContent(Swal);
function ShipDetails() {
  // let navigate = useNavigate();
  let { uid } = useParams(); // Fetch `uid` from the route params
  const location = useLocation(); // Use location hook to get the passed state

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

  // console.log("dimensions", dimensions);
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
  // Handle dropdown selection change
  const handleSelectChange = (option) => {
    setSelectedCategory(option);
    setDimensions(option?.dimensions || []); // Update dimensions for the selected category
  };

  let navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [slipNames, setSlipNames] = useState(["Slip123", "Dock456"]); // Example of existing slip names

  // Handle input changes
  const handleChange = ({ target }) => {
    const { name, value, checked, type } = target;

    // If it's a switch input (Electric or Water), update boolean state
    if (type === "checkbox") {
      setUserData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }

    if (userData.electric === false) {
      setUserData((prev) => ({ ...prev, amps: "" }));
    }
  };

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    console.log("dataform", data);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Submit form logic here...
      console.log("Form submitted successfully:", { selections, userData });
      try {
        // Construct payload and call the API
        const payload = {
          slipName: userData.slipName,
          electric: userData.electric,
          water: userData.water,
          addOn: userData.addOn,
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

        if (uid) {
          // Update existing entry
          await useJwt.updateslip(uid, payload);
          return MySwal.fire({
            title: "Successfully Updated",
            text: " Your Details Updated Successfully",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          }).then(() => {
            navigate("/dashboard/SlipDetailList");
          });
        } else {
          await useJwt.postslip(payload);
          // console.log("API Response:", response);
          try {
            MySwal.fire({
              title: "Successfully Created",
              text: " Your Slip Details Created Successfully",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary",
              },
              buttonsStyling: false,
            }).then(() => {
              navigate("/dashboard/SlipDetailList");
            });
          } catch (error) {
            console.log(error);
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
    } else {
      console.log("Validation failed. Please fix the errors.");
    }
  };

  const validate = () => {
    const newErrors = {};
    const alphanumericRegex = /^[A-Za-z0-9]+$/; // Alphanumeric for slipName
    const alphabeticRegex = /^[A-Za-z.-]+$/; // Alphabetic with periods and hyphens for add-on

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
    dimensions.forEach((dim) => {
      if (!userData[dim]) {
        newErrors[dim] = `${dim.toUpperCase()} is required`;
      }
    });

    // Validate Add-On
    if (userData.addOn && !alphabeticRegex.test(userData.addOn)) {
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

  // Fetch category data from API when component mounts
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const payload = {}; // Add any necessary payload if required
  //       const response = await useJwt.getslipCatogory(payload);
  //       // Extract shipTypeName and set as dropdown option
  //       const options = response.data.content.result.map((item) => ({
  //         value: item.uid,
  //         label: item.shipTypeName,
  //         dimensions: item.dimensions, // Store dimensions for each category
  //       }));
  //       console.log(options);

  //       setShipTypeNames(options);
  //     } catch (error) {
  //       console.error("Error fetching category:", error);
  //       const { response } = error;
  //       const { data, status } = response;
  //       if (status == 400) {
  //         alert(data.content);
  //       }
  //     }
  //   };
  //   if (uid) {
  //     const fetchDetailsForUpdate = async () => {
  //       try {
  //         const { data } = await useJwt.getslipDetail(uid);
  //         const { result } = data.content;

  //         if (result.length) {
  //           const details = result.find((d) => d.uid === uid);
  //           setUserData({
  //             slipName: details.slipName,
  //             electric: details.electric,
  //             water: details.water,
  //             addOn: details.addOn,
  //             marketAnnualPrice: details.marketAnnualPrice,
  //             marketMonthlyPrice: details.marketMonthlyPrice,
  //             amps: details.amps,
  //             overDueAmountFor7Days: details.overDueAmountFor7Days,

  //             overDueAmountFor15Days: details.overDueAmountFor15Days,

  //             overDueAmountFor30Days: details.overDueAmountFor30Days,

  //             overDueAmountForNotice: details.overDueAmountForNotice,

  //             overDueAmountForAuction: details.overDueAmountForAuction,
  //           });

  //           setSelectedCategory({
  //             // value: item.uid,
  //             // label: item.shipTypeName,
  //             // dimensions: item.dimensions,
  //           });
  //           console.log("selectedCategory",selectedCategory);

  //           setSelections({
  //             overDueChargesFor7Days:details.overDueChargesFor7Days,
  //             overDueChargesFor15Days:details.overDueChargesFor15Days,
  //             overDueChargesFor30Days:details.overDueChargesFor30Days,
  //             overDueChargesForNotice:details.overDueChargesForNotice,
  //             overDueChagesForAuction:details.overDueChagesForAuction,
  //           });
  //         }
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //         alert.error("Failed to fetch data");
  //       }
  //     };
  //     fetchDetailsForUpdate();

  //   }

  //   fetchData();

  // }, [uid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {}; // Add any necessary payload if required
        const response = await useJwt.getslipCatogory(payload);
        // Extract shipTypeName and set as dropdown option
        const options = response.data.content.result.map((item) => ({
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
          alert(data.content);
        }
      }

      console.log("Category", selectedCategory);
    };
    if (uid) {
      const fetchDetailsForUpdate = async () => {
        try {
          const { data } = await useJwt.getslip(uid);
          const { result } = data.content;

          if (result.length) {
            const details = result.find((d) => d.uid === uid);
            setUserData({
              slipName: details.slipName,
              electric: details.electric,
              water: details.water,
              addOn: details.addOn,
              marketAnnualPrice: details.marketAnnualPrice,
              marketMonthlyPrice: details.marketMonthlyPrice,
              amps: details.amps,
              overDueAmountFor7Days: details.overDueAmountFor7Days,

              overDueAmountFor15Days: details.overDueAmountFor15Days,

              overDueAmountFor30Days: details.overDueAmountFor30Days,

              overDueAmountForNotice: details.overDueAmountForNotice,

              overDueAmountForAuction: details.overDueAmountForAuction,
            });

            setDimensions(Object.keys(details.dimensions) || []);
            setUserData((pre) => ({ ...pre, ...details.dimensions }));

            setSelectedCategory({
              value: details.category.uid,
              label: details.category.shipTypeName,
              dimensions: details.dimensions,
            });
            console.log("details", details);

            console.log("selectedCategory", {
              dimensions: details.dimensions,
            });

            setSelections({
              overDueChargesFor7Days: details.overDueChargesFor7Days,
              overDueChargesFor15Days: details.overDueChargesFor15Days,
              overDueChargesFor30Days: details.overDueChargesFor30Days,
              overDueChargesForNotice: details.overDueChargesForNotice,
              overDueChagesForAuction: details.overDueChagesForAuction,
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          alert.error("Failed to fetch data");
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">
            {uid ? "Edit Slip Details" : "Add Slip Details"}
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-1">
              <Label sm="3" for="name">
                Slip Name
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={userData.slipName}
                  onChange={handleChange}
                  name="slipName"
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
                    onChange={handleChange}
                    name={dim}
                    id={dim}
                    placeholder={`Enter ${dim.toLowerCase()}`}
                    invalid={!!errors[dim]}
                  />
                  {errors[dim] && <FormFeedback>{errors[dim]}</FormFeedback>}
                </Col>
              </Row>
            ))}

            {/* Electric Switch Field */}
            <Row className="mb-1">
              <Label sm="3" for="electric">
                Electric (Yes/No)
              </Label>
              <Col sm="9">
                <div className="form-check form-switch d-flex align-items-center">
                  {/* "No" label to the left */}
                  <Label
                    className="me-0"
                    htmlFor="electric"
                    style={{ textAlign: "left" }}
                  >
                    No
                  </Label>

                  {/* Toggle switch */}
                  <Input
                    type="switch"
                    name="electric"
                    id="electric"
                    checked={userData.electric}
                    onChange={handleChange}
                    style={{ margin: 0 }}
                  />

                  {/* "Yes" label to the right */}
                  <Label
                    className="ms-0"
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
                <div className="form-check form-switch d-flex align-items-center">
                  {/* "No" label to the left */}
                  <Label
                    className="me-0"
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
                    checked={userData.water}
                    onChange={handleChange}
                    style={{ margin: 0 }}
                  />

                  {/* "Yes" label to the right */}
                  <Label
                    className="ms-0"
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
                    id="amps"
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
                  type="number"
                  value={userData.marketAnnualPrice}
                  onChange={handleChange}
                  name="marketAnnualPrice"
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
                  type="number"
                  value={userData.marketMonthlyPrice}
                  onChange={handleChange}
                  name="marketMonthlyPrice"
                  id="marketMonthlyPrice"
                  placeholder="Enter Monthly Price"
                  invalid={!!errors.marketMonthlyPrice}
                />
                <FormFeedback>{errors.marketMonthlyPrice}</FormFeedback>
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="marketMonthlyPrice">
                7 Days Charges
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
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
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Percentage
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="overDueChargesFor7Days"
                    value="Flat"
                    id="Flat"
                    checked={selections.overDueChargesFor7Days === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesFor7Days", "Flat")
                    }
                    invalid={!!errors.overDueChargesFor7Days}
                  />{" "}
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Flat
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="number"
                    name="overDueAmountFor7Days"
                    value={userData.overDueAmountFor7Days || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        overDueAmountFor7Days: e.target.value,
                      })
                    }
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
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Percentage
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    checked={selections.overDueChargesFor15Days === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesFor15Days", "Flat")
                    }
                    name="overDueChargesFor15Days "
                    id="basic-cb-unchecked"
                  />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Flat
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="number"
                    name="overDueAmountFor15Days"
                    value={userData.overDueAmountFor15Days || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        overDueAmountFor15Days: e.target.value,
                      })
                    }
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
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Percentage
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    checked={selections.overDueChargesFor30Days === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesFor30Days", "Flat")
                    }
                    name="overDueChargesFor30Days"
                    id="basic-cb-unchecked"
                  />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Flat
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="number"
                    name="overDueAmountFor30Days"
                    placeholder="Enter 30 Days Charges"
                    value={userData.overDueAmountFor30Days || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        overDueAmountFor30Days: e.target.value,
                      })
                    }
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
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Percentage
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    checked={selections.overDueChargesForNotice === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChargesForNotice", "Flat")
                    }
                    name="overDueChargesForNotice"
                    id="basic-cb-unchecked"
                  />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Flat
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="number"
                    name="overDueAmountForNotice"
                    value={userData.overDueAmountForNotice || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        overDueAmountForNotice: e.target.value,
                      })
                    }
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
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Percentage
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    checked={selections.overDueChagesForAuction === "Flat"}
                    onChange={() =>
                      handleSelectTypeChange("overDueChagesForAuction", "Flat")
                    }
                    name="overDueChagesForAuction"
                    id="basic-cb-unchecked"
                  />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Flat
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="number"
                    name="overDueAmountForAuction"
                    placeholder="Enter Auction Charges"
                    value={userData.overDueAmountForAuction || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        overDueAmountForAuction: e.target.value,
                      })
                    }
                    invalid={!!errors.overDueAmountForAuction}
                  />
                  <FormFeedback>{errors.overDueAmountForAuction}</FormFeedback>
                </div>

                <FormFeedback>{errors.overDueAmountForAuction}</FormFeedback>
              </Col>
            </Row>

            <Row>
              <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                <Button className="me-1" color="primary" type="submit">
                  {uid ? "Update" : "Submit"}
                </Button>
                <Button
                  outline
                  onClick={resetForm}
                  color="secondary"
                  type="reset"
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}

export default ShipDetails;
