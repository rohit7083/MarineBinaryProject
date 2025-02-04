import React, { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import {
  Form,
  Label,
  Input,
  Row,
  Col,
  Button,
  FormFeedback,
  Spinner,
} from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { UncontrolledAlert } from "reactstrap";
import { useParams } from "react-router-dom";

const AccountDetails = ({ stepper, setSlipId }) => {
  const MySwal = withReactContent(Swal);

  const params = useParams();

  const [selectedSlipname, setSelectedSlipname] = useState(null);
  const [slipNames, setSlipNames] = useState([]);
  const [dimensions, setDimensions] = useState({});
  const [errMsz, seterrMsz] = useState("");
  const [loadinng, setLoading] = useState(false);
  const [vesselData, setVesselData] = useState([]);

  const handleSlipChange = (option) => {
    setSelectedSlipname(option);
    setDimensions(option?.dimensions || {});
    console.log("count");
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
    console.clear();
    console.log(vesselData);
  }, [vesselData]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(getValidationSchema(dimensions)),
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
    };
    setSlipId(payload.slipId);

    try {
      setLoading(true);

      await useJwt.postsVessel(payload);
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

      if (error.response && error.response.data) {
        const { status, content } = error.response.data;
        console.log(content);

        switch (status) {
          case 400:
            seterrMsz(content);

            break;
          case 401:
            seterrMsz(content);
            // navigate("/login");
            break;
          case 403:
            seterrMsz(content);
            break;
          case 500:
            seterrMsz(content);

            break;
          default:
            seterrMsz(content);
        }
      }
    } finally {
      setLoading(false);
    }
    // if (uid) {

    //     try {
    //     const res= await useJwt.updateVessel(uid,payload);
    //       console.log("updated Response:", response);
    //       return MySwal.fire({
    //         title: "Successfully Updated",
    //         text: " Your Vessel Details Updated Successfully",
    //         icon: "success",
    //         customClass: {
    //           confirmButton: "btn btn-primary",
    //         },
    //         buttonsStyling: false,
    //       }).then(() => {
    //         if (Object.keys(errors).length === 0) {
    //           stepper.next();
    //         }
    //       });
    //     } catch (error) {
    //       console.error("Error submitting vessel details:", error);
    //       const { status, content } = error.response.data;
    //       console.log(content);

    //       switch (status) {
    //         case 400:
    //           seterrMsz(content);

    //           break;
    //         case 401:
    //           seterrMsz(content);
    //           // navigate("/login");
    //           break;
    //         case 403:
    //           seterrMsz(content);
    //           break;
    //         case 500:
    //           seterrMsz(content);

    //           break;
    //         default:
    //           seterrMsz(content);
    //       }
    //     }
    //   }
  };

  useEffect(() => {
    if (watch("slipName")) {
      setValue("height", "");
      setValue("length", "");
      setValue("width", "");
    }
  }, [watch("slipName")]);

  return (

    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Vessel Details</h5>
        <small className="text-muted">Enter Your Vessel Details.</small>
      </div>

      {errMsz && (
        <React.Fragment>
          <UncontrolledAlert color="danger">
            <div className="alert-body">
              <span className="text-danger fw-bold">{errMsz}</span>
            </div>
          </UncontrolledAlert>
        </React.Fragment>
      )}

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
                    handleSlipChange(option);
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
        <div className="d-flex justify-content-end">
          <div className="d-flex">
            <Button
              type="reset"
              color="primary"
              onClick={() => reset()}
              className="btn-reset me-2"
            >
              <span className="align-middle d-sm-inline-block d-none">
                Reset
              </span>
            </Button>

            <Button type="submit" color="primary" className="btn-next">
              <span className="align-middle d-sm-inline-block d-none">
                {loadinng ? <Spinner size="sm" /> : "Next"}
              </span>
              {loadinng ? null : (
                <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default AccountDetails;

/*
  const options = response.data.content.result.map((item) => ({
          value: item.id,
          label: item.slipName,
          dimensions: item.dimensions,
          isAssigned: item.isAssigned,
        }));
        console.log(response);

        const UnassigneOption = response.data.content.result
          .filter((item) => !item.isAssigned)
          .map((item) => ({
            value: item.id,
            label: item.slipName,
            dimensions: item.dimensions,
          }));
        console.log("unassigneOptions", UnassigneOption);

        setSlipNames(UnassigneOption);
        console.log(" response from useeffect ", options);

        const filteredData = response.data.content.result.filter(
          (item) => item.uid === uid // Match uid
        ).map((item) => ({
          vessel: item.vessel, 
        }));
*/
