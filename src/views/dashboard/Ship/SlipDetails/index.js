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

const MySwal = withReactContent(Swal);
function ShipDetails() {
  const [userData, setUserData] = useState({
    slipName: "",
    electric: false,
    water: false,
    addOn: "",
    marketAnnualPrice: "",
    marketMonthlyPrice: "",
    amps: "",
  });
  
  const [selectedOption, setSelectedOption] = useState(null); // Default to null, no selection
  const [shipTypeNames, setShipTypeNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Store selected option for the single dropdown
  const [dimensions, setDimensions] = useState([]); // Dimensions for the selected category

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      // Submit form logic here...
      console.log("Form Submitted Successfully: ", userData);
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
          dimensions: dimensions.reduce((acc, dim) => {
            acc[dim] = parseFloat(userData[dim]) || 0;
            return acc;
          }, {}),
        };
  
        const response = await useJwt.postslipDetail(payload);
        console.log("API Response:", response);
        try {
         MySwal.fire({
            title: "Successfully Created",
            text: " Your Slip Details Created Successfully",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
  
          }).then(()=>{
            navigate("/dashboard/SlipDetailList");

          })
        } catch (error) {
          console.log(error);
          
        }
        

      } catch (error) {
        console.error("Error submitting form:", error);
        return MySwal.fire({
          title: 'Error!',
          text: 'An error occurred while submitting the form.',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        })
      

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
    } else if (slipNames.includes(userData.slipName)) {
      newErrors.slipName = "Slip Name must be unique";
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
          value: item.uid,
          label: item.shipTypeName,
          dimensions: item.dimensions, // Store dimensions for each category

        }));
        console.log(options);

        setShipTypeNames(options);
      } catch (error) {
        console.error("Error fetching category:", error);
        const { response } = error;
        const { data, status } = response;
        if (status == 400) {
          alert(data.content);
        }
      }
    };

    fetchData();
  }, []);



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
    });
    setErrorMessage("");
  };


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
                  value={userData.slipName}
                  onChange={handleChange}
                  name="slipName"
                  id="slipName"
                  placeholder="Slip Name"
                  invalid={!!errors.slipName}
                />
                {errors.slipName && <FormFeedback>{errors.slipName}</FormFeedback>}
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
                options={shipTypeNames}
                isClearable
                placeholder="Select Category"
                className={errors.category ? "is-invalid" : ""}
              />
              {errors.category && (
                <div className="invalid-feedback d-block">{errors.category}</div>
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
                    placeholder="AMPS"
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
                  placeholder="Add-on"
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
                  placeholder="Annual Price"
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
                  placeholder="Monthly Price"
                  invalid={!!errors.marketMonthlyPrice}
                />
                <FormFeedback>{errors.marketMonthlyPrice}</FormFeedback>
              </Col>
            </Row>

            <Row>
              <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                <Button className="me-1" color="primary" type="submit">
                  Submit
                </Button>
                <Button outline 
                onClick={resetForm}
                
                color="secondary" type="reset">
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
