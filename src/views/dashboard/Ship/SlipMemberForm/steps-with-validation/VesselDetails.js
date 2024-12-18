
import React, { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
const AccountDetails = ({ stepper, combinedData, setCombinedData }) => {
  const [VesselData, setVesselData] = useState(combinedData.vesselInfo);
  const [selectedSlipname, setSelectedSlipname] = useState(null);
  const [slipNames, setSlipNames] = useState([]);
  const [dimensions, setDimensions] = useState({});

  const defaultValues={
    vesselName: "YourVessel",
      vesselRegistrationNumber: "125F636F",
      height: "2",
      slipName: "A11",
      width: "2",
      length: "8",
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVesselData({
      ...VesselData,
      [name]: value,
    });
  };
  const handleSlipChange = (option) => {
        setSelectedSlipname(option);
        setDimensions(option?.dimensions || {}); // Update dimensions based on selected slip
      };
      
      const getValidationSchema = (dimensions) =>
        yup.object().shape({
          slipName: yup.string().required("Slip Name is required"),
          vesselName: yup
            .string()
            .required("Vessel Name is required")
            .matches(
              /^[a-zA-Z\s-]+$/,
              "Vessel Name must contain only alphabetic characters, hyphens, and spaces"
            ),
          vesselRegistrationNumber: yup
            .string()
            .required("Registration Number is required"),
    
          ...Object.keys(dimensions).reduce((acc, key) => {
            acc[key] = yup
              .number()
              .required(`${key} is required`)
              .max(dimensions[key], `${key} cannot exceed ${dimensions[key]}`);
            return acc;
          }, {}),
        });


      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await useJwt.getslipDetail({});
            const options = response.data.content.result.map((item) => ({
              value: item.id,
              label: item.slipName,
              
              dimensions: item.dimensions, // Store dimensions in the option
            }));
            setSlipNames(options);
            // console.log("vessel response",options);
            
          } catch (error) {
            console.error("Error fetching slip details:", error);
            alert("An unexpected error occurred");
          }
        };
        fetchData();

      }, [selectedSlipname]);
    
    
  const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(getValidationSchema(dimensions)),
        defaultValues
  });

  const onSubmit = (data) => {
    // Update shared state
    setCombinedData((prev) => ({
      ...prev,
      vesselInfo: { ...VesselData, ...data },
      selectedSlipId: selectedSlipname?.value, // Store selected slip ID

    }));

    if (Object.keys(errors).length === 0) {
      stepper.next();
    }
  };

  return (

<Fragment>
       <div className="content-header">
         <h5 className="mb-0">Vessel Details</h5>
         <small className="text-muted">Enter Your Vessel Details.</small>
       </div>
       <form onSubmit={handleSubmit(onSubmit)}>
         <Row>
           <Col md="6" className="mb-1">
             <Label className="form-label" for="slipName">
               Slip Name <span style={{ color: "red" }}>*</span>
             </Label>
            <Controller
              name="slipName"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={selectedSlipname}
                  onChange={(option) => {
                    field.onChange(option?.value);
                    handleSlipChange(option); // Handle slip change
                  }}
                  options={slipNames}
                  isClearable
                  placeholder="Select Slip Name"
                />
              )}
            />
            {errors.slipName && (
              <FormFeedback>{errors.slipName.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="vesselName">
              Vessel Name <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              control={control}
              name="vesselName"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Enter Vessel Name"
                  onChange={handleChange}
                  value={VesselData.vesselName}
                  invalid={errors.vesselName && true}
                  {...field}
                />
              )}
            />
            {errors.vesselName && (
              <FormFeedback>{errors.vesselName.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="vesselRegistrationNumber">
              Vessel Registration Number <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              control={control}
              name="vesselRegistrationNumber"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Enter Registration Number"
                  onChange={handleChange}
                  value={VesselData.vesselRegistrationNumber}
                  invalid={errors.vesselRegistrationNumber && true}
                  {...field}
                />
              )}
            />
            {errors.vesselRegistrationNumber && (
              <FormFeedback>
                {errors.vesselRegistrationNumber.message}
              </FormFeedback>
            )}
          </Col>
          {/* Dynamically Render Dimension Fields */}
          {Object.keys(dimensions).map((dimKey) => (
            <Col key={dimKey} md="6" className="mb-1">
              <Label className="form-label" for={dimKey}>
                {dimKey.charAt(0).toUpperCase() + dimKey.slice(1)}{" "}
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name={dimKey}
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={`Enter ${dimKey}`}
                    invalid={errors[dimKey] && true}
                    {...field}
                  />
                )}
              />
              {errors[dimKey] && (
                <FormFeedback>{errors[dimKey]?.message}</FormFeedback>
              )}
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-between">
          <Button color="secondary" className="btn-prev" outline disabled>
            <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button>
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default AccountDetails;