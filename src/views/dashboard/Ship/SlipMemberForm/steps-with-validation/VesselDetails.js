import React, { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const AccountDetails = ({ stepper, setSlipId }) => {
  const MySwal = withReactContent(Swal);

  const [VesselData, setVesselData] = useState();
  const [selectedSlipname, setSelectedSlipname] = useState(null);
  const [slipNames, setSlipNames] = useState([]);
  const [dimensions, setDimensions] = useState({});

  // const defaultValues={
  //   vesselName: "abc",
  //   vesselRegistrationNumber: "abc123",
  //   vesselHeight: "2",
  //   slipName: "",
  //   vesselWidth: "3",
  //   // vesselLength: "",
  // }
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setVesselData({
  //     ...VesselData,
  //     [name]: value,
  //   });
  // };
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
          .max(dimensions[key], `${key} cannot exceed ${dimensions[key]}`)
          .min(1, `${key} must be at least 1`); // Ensure minimum value is 1
        return acc;
      }, {}),
    });

  useEffect(() => {
    // for slipname
    const fetchData = async () => {
      try {
        const response = await useJwt.getslip({});
        const options = response.data.content.result.map((item) => ({
          value: item.id,
          label: item.slipName,
          dimensions: item.dimensions, // Store dimensions in the option
        }));

        setSlipNames(options);
        console.log(" response from useeffect ",options);
        // console.log(" response from useeffect ",selectedSlipname.value);
      } catch (error) {
        console.error("Error fetching slip details:", error);
        alert("An unexpected error occurred");
      }
    };

    fetchData();
  }, [selectedSlipname]);

  const {
    control,
    handleSubmit,
    formState: { errors }, reset
  } = useForm({
    resolver: yupResolver(getValidationSchema(dimensions)),
    // defaultValues
  });

  const onSubmit = async (data) => {
    const renamedData = Object.keys(data).reduce((acc, key) => {
      if (key === "width") {
        acc["vesselWidth"] = data[key];
      } else if (key === "height") {
        acc["vesselHeight"] = data[key];
      } else if (key === "length") {
        acc["vesselLength"] = data[key];
      } else if (key === "slipName") {
        acc["slipId"] = data[key]; // Set slipId to the value of slipName
      } else {
        acc[key] = data[key]; // Keep other keys as they are
      }
      return acc;
    }, {});

    const payload = {
      ...renamedData,
      // slipId: selectedSlipname.value,
    };
    setSlipId(payload.slipId);
    
    try {
      await useJwt.postsVessel(payload);
      // console.log("API Response:", response);
      return MySwal.fire({
        title: "Successfully Created",
        text: " Your Vessel Details Created Successfully",
        icon: "success",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      }).then(() => {
        if (Object.keys(errors).length === 0) {
          stepper.next();
        }
      });
    } catch (error) {
      console.error("Error submitting vessel details:", error);
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

    // console.log("vessel dimensions ", payload);
  };

  const resetForm = () => {
    reset();
    
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
                  // onChange={handleChange}
                  // value={VesselData.vesselName}
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
                  // onChange={handleChange}
                  // value={VesselData.vesselRegistrationNumber}
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
                {"Vessel " + dimKey.charAt(0).toUpperCase() + dimKey.slice(1)}{" "}
                <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name={dimKey}
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={`Enter Vessel ${dimKey}`}
                    invalid={errors[dimKey] && true}
                    // onChange={handleChange}

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
        <div className="d-flex justify-content-end gap-3">
          <Button type="reset" color="primary" className="btn-next">
            <span
              className="align-middle d-sm-inline-block d-none"
              onClick={resetForm}
            >
              Reset
            </span>
          </Button>

          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">
              Submit
            </span>
            <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default AccountDetails;
