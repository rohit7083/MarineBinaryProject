import React, { useState, useEffect } from "react";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";
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

function ShipDetails() {
  const [userData, setUserData] = useState({
    name: "",
    // type: "",
    w: "",
    h: "",
    l: "",
    electricSwitch: false, // Initially set to false
    waterSwitch: false, // Initially set to false
    addon: "",
    anualPrice: "",
    monthlyPrice: "",
    electricDetails: "", // Initialize electricDetails as an empty string
  });

  const [selectedOption, setSelectedOption] = useState(null); // Default to null, no selection
  const [shipTypeNames, setShipTypeNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Store selected option for the single dropdown

  // Handle dropdown selection change
  const handleSelectChange = ( selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const [errors, setErrors] = useState({});
  const [slipNames, setSlipNames] = useState(["Slip123", "Dock456"]); // Example of existing slip names

  // Handle input changes
  const handleChange = ({ target }) => {
    const { name, value, checked, type } = target;

    // If it's a switch input (Electric or Water), update boolean state
    if (type === "checkbox") {
      setUserData((prev) => ({ ...prev, [name]: checked }));
    } else {
      // Handle Ship Name Validation
      if (name === "name") {
        const namePattern = /^[A-Za-z0-9\s]*$/; // Only letters, numbers, and spaces
        if (!namePattern.test(value)) {
          setErrors((prev) => ({
            ...prev,
            name: "Ship name can only contain letters, numbers, and spaces.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            name: "",
          }));
        }
      }
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form Submitted Successfully: ", userData);
    } else {
      console.log("Validation failed. Please fix the errors.");
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    const regex = /^[A-Za-z0-9]+$/; // Regex for alphanumeric only for name
    const addonRegex = /^[A-Za-z.-]+$/; // Regex for add-on (letters, periods, and hyphens)

    // Validate Name
    if (!userData.name) {
      newErrors.name = "Slip Name is required";
    } else if (!regex.test(userData.name)) {
      newErrors.name = "Slip Name should contain only letters and numbers";
    } else if (slipNames.includes(userData.name)) {
      newErrors.name = "Slip Name must be unique";
    }

    // Validate Width
    if (!userData.w) {
      newErrors.w = "Width is required";
    }

    // Validate Height
    if (!userData.h) {
      newErrors.h = "Height is required";
    }

    // Validate Length
    if (userData.type === "Covered" && !userData.l) {
      newErrors.l = "Length is required";
    }

    // Validate Add-on
    if (userData.addon && !addonRegex.test(userData.addon)) {
      newErrors.addon = "Add-on can only contain letters, periods, and hyphens";
    }

    // Validate Annual Price
    if (!userData.anualPrice) {
      newErrors.anualPrice = "Annual Price is required";
    }

    // Validate Monthly Price
    if (!userData.monthlyPrice) {
      newErrors.monthlyPrice = "Monthly Price is required";
    }

    // Validate Electric Details if Electric is enabled
    if (userData.electricSwitch && !userData.electricDetails) {
      newErrors.electricDetails =
        "Electric Details are required when Electric is enabled";
    }

    return newErrors;
  };

  // Fetch category data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {}; // Add any necessary payload if required
        const response = await useJwt.getslipCatogory(payload);
        // Extract shipTypeName and set as dropdown option
        const options = response.data.content.result.map((item) => ({
          value: item.shipTypeName,
          label: item.shipTypeName,
        }));

        setShipTypeNames(options);
      } catch (error) {
        console.error("Error fetching category:", error);
        console.log(error);
        const { response } = error;
        const { data, status } = response;
        if (status == 400) {
          alert(data.content);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Slip Details</CardTitle>
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
                  value={userData.name}
                  onChange={handleChange}
                  name="name"
                  id="name"
                  placeholder="Slip Name"
                  invalid={!!errors.name}
                />
                {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="electricSwitch">
                Category
                <span style={{ color: "red" }}>*</span>
              </Label>

              <Col className="mb-1" md="6" sm="12">
                <Select
                  // theme={selectThemeColors} // Optional, use for custom styles
                  className="react-select"
                  classNamePrefix="select"
                  value={selectedCategory} // The selected option is directly used as the value
                  name="selectType"
                  options={shipTypeNames}// Pass all shipTypeNames as options in a single dropdown
                  isClearable
                  onChange={handleSelectChange} // Handle change for single dropdown
                />
                <FormFeedback>{errors.type}</FormFeedback>
              </Col>
            </Row>
            <Row className="mb-1">
              <Label sm="3" for="w">
                Width
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={userData.w}
                  onChange={handleChange}
                  name="w"
                  id="w"
                  placeholder="Width"
                  invalid={!!errors.w}
                />
                <FormFeedback>{errors.w}</FormFeedback>
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="h">
                Height
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={userData.h}
                  onChange={handleChange}
                  name="h"
                  id="h"
                  placeholder="Height"
                  invalid={!!errors.h}
                />
                <FormFeedback>{errors.h}</FormFeedback>
              </Col>
            </Row>

            {/* Conditionally render the Length field only if type is Covered */}
            {/* {userData.type.theme === "Covered" && ( */}
            {selectedOption && selectedOption.value === "Covered" && (
              <Row className="mb-1">
                <Label sm="3" for="l">
                  Length
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm="9">
                  <Input
                    type="text"
                    value={userData.l}
                    onChange={handleChange}
                    name="l"
                    id="l"
                    placeholder="Length"
                    invalid={!!errors.l}
                  />
                  <FormFeedback>{errors.l}</FormFeedback>
                </Col>
              </Row>
            )}
            {/* Electric Switch Field */}
            <Row className="mb-1">
              <Label sm="3" for="electricSwitch">
                Electric (Yes/No)
              </Label>
              <Col sm="9">
                <div className="form-check form-switch d-flex align-items-center">
                  {/* "No" label to the left */}
                  <Label
                    className="me-0"
                    htmlFor="electricSwitch"
                    style={{ textAlign: "left" }}
                  >
                    No
                  </Label>

                  {/* Toggle switch */}
                  <Input
                    type="switch"
                    name="electricSwitch"
                    id="electricSwitch"
                    checked={userData.electricSwitch}
                    onChange={handleChange}
                    style={{ margin: 0 }}
                  />

                  {/* "Yes" label to the right */}
                  <Label
                    className="ms-0"
                    htmlFor="electricSwitch"
                    style={{ textAlign: "left" }}
                  >
                    Yes
                  </Label>
                </div>
              </Col>
            </Row>

            {/* Water Switch Field */}
            <Row className="mb-1">
              <Label sm="3" for="waterSwitch">
                Water (Yes/No)
              </Label>
              <Col sm="9">
                <div className="form-check form-switch d-flex align-items-center">
                  {/* "No" label to the left */}
                  <Label
                    className="me-0"
                    htmlFor="waterSwitch"
                    style={{ textAlign: "left" }}
                  >
                    No
                  </Label>

                  {/* Toggle switch */}
                  <Input
                    type="switch"
                    name="waterSwitch"
                    id="waterSwitch"
                    checked={userData.waterSwitch}
                    onChange={handleChange}
                    style={{ margin: 0 }}
                  />

                  {/* "Yes" label to the right */}
                  <Label
                    className="ms-0"
                    htmlFor="waterSwitch"
                    style={{ textAlign: "left" }}
                  >
                    Yes
                  </Label>
                </div>
              </Col>
            </Row>

            {/* Electric Details field appears only when electricSwitch is true */}
            {userData.electricSwitch && (
              <Row className="mb-1">
                <Label sm="3" for="electricDetails">
                  AMPS
                </Label>
                <Col sm="9">
                  <Input
                    type="text"
                    value={userData.electricDetails}
                    onChange={handleChange}
                    name="electricDetails"
                    id="electricDetails"
                    placeholder="AMPS"
                    invalid={!!errors.electricDetails}
                  />
                  <FormFeedback>{errors.electricDetails}</FormFeedback>
                </Col>
              </Row>
            )}

            <Row className="mb-1">
              <Label sm="3" for="addon">
                Add-on
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={userData.addon}
                  onChange={handleChange}
                  name="addon"
                  id="addon"
                  placeholder="Add-on"
                  invalid={!!errors.addon}
                />
                <FormFeedback>{errors.addon}</FormFeedback>
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="anualPrice">
                Annual Price
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="number"
                  value={userData.anualPrice}
                  onChange={handleChange}
                  name="anualPrice"
                  id="anualPrice"
                  placeholder="Annual Price"
                  invalid={!!errors.anualPrice}
                />
                <FormFeedback>{errors.anualPrice}</FormFeedback>
              </Col>
            </Row>

            <Row className="mb-1">
              <Label sm="3" for="monthlyPrice">
                Monthly Price
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Col sm="9">
                <Input
                  type="number"
                  value={userData.monthlyPrice}
                  onChange={handleChange}
                  name="monthlyPrice"
                  id="monthlyPrice"
                  placeholder="Monthly Price"
                  invalid={!!errors.monthlyPrice}
                />
                <FormFeedback>{errors.monthlyPrice}</FormFeedback>
              </Col>
            </Row>

            <Row>
              <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                <Button className="me-1" color="primary" type="submit">
                  Submit
                </Button>
                <Button outline color="secondary" type="reset">
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
