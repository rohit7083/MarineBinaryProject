import React, { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
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

const AccountDetails = ({ stepper, formData, slipId, setSlipIID }) => {
  const MySwal = withReactContent(Swal);

  // const { uid } = useParams();

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
      console.log("result from the vessel ", result);

      const falseOptions = result.map((item) => ({
        isAssigned: item.isAssigned,
      }));
      // {{debugger}}
      // if (!falseOptions) {
      setSlipNames(() =>
        result.map(({ slipName: label, id: value, dimensions }) => ({
          label,
          value,
          dimensions,
        }))
      );
      // }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    
    if (Object.keys(formData)?.length) {
      const data = { ...formData };
      reset(data);
    }
  }, [reset, formData]);

  useEffect(() => {
    fetchForm();
  }, []);

  const onSubmit = async (data) => {
    // {{debugger}}
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

    console.log("Final data before submitting:", finaleData); // 🔍 Debugging

    try {
      setLoading(true);
      // {{debugger}}
      if (slipId) {
        setLoading(true);
        await useJwt.updateVessel(finaleData.uid, finaleData);
        return MySwal.fire({
          title: "Successfully updated",
          text: " Your Vessel Details Update Successfully",
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
      } else {
        setLoading(true);
        await useJwt.postsVessel(finaleData);
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
      }
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
  };

  const renderField = (fields) => {
    if (!fields) return null;

    return Object.keys(fields).map((dimKey) => (
      // <Col key={dimKey} md="6" className="mb-1">
      //   <Label className="form-label" htmlFor={dimKey}>
      //     {"Vessel " + dimKey.charAt(0).toUpperCase() + dimKey.slice(1)}{" "}
      //     <span style={{ color: "red" }}>*</span>
      //   </Label>
      //   <Controller
      //     name={`dimensionVal.${dimKey}`}
      //     control={control}
      //     rules={
      //       dimKey === "width" || dimKey === "height"
      //         ? {
      //             valueAsNumber: true,
      //             validate: {
      //               maxValue: (value) =>
      //                 parseInt(value) <= watch("slipName").dimensions[dimKey] ||
      //                 `Value must be less than ${
      //                   watch("slipName").dimensions[dimKey]
      //                 }`,
      //               nonNegative: (value) =>
      //                 parseInt(value) >= 0 || "Value must not be negative",
      //             },
      //           }
      //         : {} 
      //     }
      //     render={({ field, fieldState }) => (
      //       <div>
      //         <Input
      //           type="number"
      //           placeholder={`Enter Vessel ${dimKey}`}
      //           invalid={!!fieldState?.error}
      //           {...field}
      //         />
      //         {fieldState?.error && (
      //           <p className="text-danger">{fieldState?.error?.message}</p>
      //         )}
      //       </div>
      //     )}
      //   />
      // </Col>


<Col key={dimKey} md="6" className="mb-1">
  <Label className="form-label" htmlFor={dimKey}>
    {"Vessel " + dimKey.charAt(0).toUpperCase() + dimKey.slice(1)}{" "}
    <span style={{ color: "red" }}>*</span>
  </Label>
  <Controller
    name={`dimensionVal.${dimKey}`}
    control={control}
    rules={{
      ...(dimKey === "width" || dimKey === "height"
        ? {
            validate: {
              required: (value) =>
                value !== "" || `${dimKey} field is required`,
              isNumber: (value) =>
                !isNaN(parseFloat(value)) || "Value must be a number",
              maxValue: (value) => {
                const numberValue = parseFloat(value);
                return (
                  numberValue <= watch("slipName").dimensions[dimKey] ||
                  `Value must be less than ${watch("slipName").dimensions[dimKey]}`
                );
              },
              nonNegative: (value) => {
                const numberValue = parseFloat(value);
                return (
                  numberValue >= 0 || "Value must not be negative"
                );
              },
            },
          }
        : {}),
      ...(dimKey === "length" || dimKey === "width" || dimKey === "height"
        ? {
            required: {
              value: true,
              message: `${dimKey} field is required`,
            },
          }
        : {}),
    }}
    render={({ field, fieldState }) => (
      <div>
        <Input
          type="number"
          placeholder={`Enter Vessel ${dimKey}`}
          invalid={!!fieldState?.error}
          {...field}
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

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">
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
      {/* {loadinng ? (
         <Spinner  color="primary"
         style={{
           height: '3rem',
           width: '3rem'
         }} />
      ):(
        <> */}

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
              }}
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
              rules={{
                required: "Vessel Registration Number is required",
              }}
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
          {renderField(watch("slipName")?.dimensions)}
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
      {/* </>
    )} */}
    </Fragment>
  );
};

export default AccountDetails;
