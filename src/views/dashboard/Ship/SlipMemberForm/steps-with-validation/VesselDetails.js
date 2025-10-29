import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

import { ArrowLeft, ArrowRight } from "react-feather";
import {
  Button,
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AccountDetails = ({
  stepper,
  formData,
  slipId,
  setSlipIID,
  fetchLoader,
  slipNameFromDashboard,
}) => {
  const MySwal = withReactContent(Swal);
  const toast = useRef(null);

  const [slipNames, setSlipNames] = useState([]);
  const [dimensions, setDimensions] = useState({});
  const [errMsz, seterrMsz] = useState("");
  const [loadinng, setLoading] = useState(false);
  const [validateDimension, setValidateDimension] = useState(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ defaultValues: formData });

  async function fetchForm() {
    try {
      const response = await useJwt.getslip();

      const { result } = response.data.content;

      const NotAssigned = result
        .filter((item) => !item.isAssigned)
        .map((item) => ({
          isAssigned: item.isAssigned,
          label: item.slipName,
          value: item.id,
          dimensions: item.dimensions,
        }));

      setSlipNames(NotAssigned);
    } catch (error) {
      console.error(error);
    }
  }
  // useEffect(() => {
  //   if (slipNameFromDashboard) {
  //     {
  //       {
  //           ;
  //       }
  //     }
  //     reset({
  //       ...slipNameFromDashboard?.vessel,
  //       slipName: {
  //         label: slipNameFromDashboard?.slipName,
  //         value: slipNameFromDashboard?.id,
  //         dimensions: slipNameFromDashboard?.dimensions, // include dimensions in slipName if needed
  //       },
  //       dimensionVal: slipNameFromDashboard?.dimensions || {},
  //     });
  //   }
  // }, [slipNameFromDashboard, reset]);


  useEffect(() => {
  if (Object.keys(formData || {})?.length) {
    // If formData has keys → use it
    reset({ ...formData });
  } else if (slipNameFromDashboard) {
    // If slipNameFromDashboard exists → use it
    reset({
      slipName: {
        label: slipNameFromDashboard.slipName,
        value: slipNameFromDashboard.id,
        dimensions: slipNameFromDashboard.dimensions, // optional
      },
      dimensionVal: slipNameFromDashboard.dimensions || {},
    });
  }
}, [reset, formData, slipNameFromDashboard]);


  useEffect(() => {
    fetchForm();
  }, []);

  const onSubmit = async (data) => {
    seterrMsz("");

    const finaleData = {};
    const { dimensions } = data.slipName;

    Object.keys(dimensions).map(
      (key) => (finaleData[key] = data.dimensionVal[key])
    );
    delete data.dimensionVal;
    finaleData.slipId = data.slipName.value;
    setSlipIID(finaleData.slipId);
    // finaleData.slipName = data.slipName.label;
    finaleData.vesselRegistrationNumber = data.vesselRegistrationNumber;
    finaleData.vesselName = data.vesselName;
    finaleData.uid = data.uid ? data.uid : "";

    try {
      // {{ }}
      if (slipId) {
        setLoading(true);
        const updateRes = await useJwt.updateVessel(finaleData.uid, finaleData);

        if (updateRes.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Vessel Details updated Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            stepper.next();
          }, 2000);
        }
      } else {
        setLoading(true);
        const createRes = await useJwt.postsVessel(finaleData);

        if (createRes.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Cretaed Successfully",
            detail: "Vessel Details Created Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            stepper.next();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error submitting vessel details:", error);

      if (error.response && error.response.data) {
        const { status, content } = error.response.data;

        seterrMsz((prev) => {
          const newMsz = content || "Something went wrong!";
          return prev !== newMsz ? newMsz : prev + " ";
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderField = (fields) => {
    if (!fields) return null;

    return Object.keys(fields).map((dimKey) => (
      <Col key={dimKey} md="6" className="mb-1">
        <Label className="form-label" htmlFor={dimKey}>
          {"Vessel " + dimKey.charAt(0).toUpperCase() + dimKey.slice(1)}{" "}
          <span style={{ color: "red" }}>*</span>
        </Label>
        <Controller
          name={`dimensionVal.${dimKey}`}
          control={control}
          rules={{
            required: {
              value: true,
              message: `${dimKey} field is required`,
            },
            pattern: {
              value: /^\d*\.?\d+$/, // ✅ Only allows numbers and floats (e.g., 123, 45.67)
              message: "Only numbers and decimals are allowed",
            },

            validate: {
              maxValue: (value) => {
                const numberValue = parseFloat(value);

                if (dimKey === "width" || dimKey === "height") {
                  const maxLimit = watch("slipName")?.dimensions?.[dimKey];
                  return (
                    numberValue <= maxLimit ||
                    `Value must be less than or equal to ${maxLimit}`
                  );
                }

                return true; // Skip validation for other keys like length, etc.
              },

              nonNegative: (value) => {
                const numberValue = parseFloat(value);
                return numberValue > 0 || "Value must not be negative";
              },
            },
          }}
          render={({ field: { onChange, value, ...rest }, fieldState }) => (
            <div>
              <Input
                type="text"
                placeholder={`Enter Vessel ${dimKey}`}
                invalid={!!fieldState?.error}
                {...rest}
                value={value}
                onChange={(e) => {
                  let newValue = e.target.value.replace(/[^0-9.]/g, ""); // ✅ Remove non-numeric characters
                  newValue = newValue.replace(/(\..*)\./g, "$1"); // ✅ Prevent multiple dots
                  onChange(newValue);
                }}
              />
              {fieldState?.error && (
                <p className="text-danger">{fieldState?.error?.message}</p>
              )}
            </div>
          )}
        />
      </Col>
    ));
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
    <Fragment>
      <Toast ref={toast} />

      <div className="content-header">
        <h5 className="mb-0">
          <ArrowLeft
            style={{
              cursor: "pointer",
              marginRight: "10px",
              transition: "color 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
            onClick={() => window.history.back()}
          />{" "}
          {slipId ? "Update Vessel Details" : "Vessel Details"}{" "}
        </h5>
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
              rules={{
                required: "Slip Name is required",
              }}
              render={({ field }) => (
                <Select
                  {...field}
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
              rules={{
                required: "Vessel Name is required",
                pattern: {
                  value: /^[a-zA-Z0-9\s]+$/, // Allows only letters, numbers, and spaces
                  message: "Special characters are not allowed",
                },
              }}
              render={({ field: { onChange, value, ...rest } }) => (
                <Input
                  type="text"
                  placeholder="Enter Vessel Name"
                  invalid={!!errors.vesselName}
                  value={value}
                  {...rest}
                  onChange={(e) => {
                    const sanitizedValue = e.target.value.replace(
                      /[^a-zA-Z0-9\s]/g,
                      ""
                    );
                    onChange(sanitizedValue);
                  }}
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
              rules={{
                required: "Vessel Registration Number Is Required",
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: "Special Character Are Not Allowed",
                },
              }}
              name="vesselRegistrationNumber"
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  type="text"
                  placeholder="Enter Registration Number"
                  invalid={errors.vesselRegistrationNumber && true}
                  value={value}
                  {...field}
                  onChange={(e) => {
                    const sanitizedNumber = e.target.value.replace(
                      /[^a-zA-Z0-9]/g,
                      ""
                    );
                    onChange(sanitizedNumber);
                  }}
                />
              )}
            />
            {errors.vesselRegistrationNumber && (
              <FormFeedback>
                {errors.vesselRegistrationNumber.message}
              </FormFeedback>
            )}
          </Col>
          {renderField(watch("slipName")?.dimensions)}
        </Row>
        <div className="d-flex justify-content-end">
          <div className="d-flex">
            <Button
              type="reset"
              onClick={() => reset()}
              className="btn-reset me-2"
            >
              <span className="align-middle d-sm-inline-block d-none">
                Reset
              </span>
            </Button>

            <Button
              type="submit"
              color="primary"
              disabled={loadinng}
              className="btn-next"
            >
              <span className="align-middle d-sm-inline-block d-none">
                {loadinng ? (
                  <>
                    <span>Loading.. </span>
                    <Spinner size="sm" />{" "}
                  </>
                ) : (
                  "Next"
                )}
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
