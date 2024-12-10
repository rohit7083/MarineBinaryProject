// import React, { useState, useEffect, Fragment } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import useJwt from "@src/auth/jwt/useJwt";
// import Select from "react-select";
// import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";
// import { ArrowLeft, ArrowRight } from "react-feather";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";

// const MySwal = withReactContent(Swal);
// const AccountDetails = ({ stepper }) => {
//   const [selectedSlipname, setSelectedSlipname] = useState(null);
//   const [slipNames, setSlipNames] = useState([]);
//   const [dimensions, setDimensions] = useState({}); // Store dimensions of selected slip
//   const [vesselData, setVesselData] = useState({
//     vesselName: "",
//     vesselRegistrationNumber: "",
//     // vesselWidth: "",
//     // vesselHeight: "",
//     // vesselLength:"",
//   });
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await useJwt.getslipDetail({});
//         const options = response.data.content.result.map((item) => ({
//           value: item.id,
//           label: item.slipName,
//           dimensions: item.dimensions, // Store dimensions in the option
//         }));
//         setSlipNames(options);
//       } catch (error) {
//         console.error("Error fetching slip details:", error);
//         alert("An unexpected error occurred");
//       }
//     };
//     fetchData();
//   }, []);

//   const SignupSchema = yup.object().shape({
//     slipName: yup.string().required("Slip Name is required"),
//     vesselName: yup
//       .string()
//       .required("Vessel Name is required")
//       .matches(
//         /^[a-zA-Z\s-]+$/,
//         "Vessel Name must contain only alphabetic characters, hyphens, and spaces"
//       ),
//     vesselRegistrationNumber: yup
//       .string()
//       .required("Registration Number is required"),
//   });

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     setValue, // You can use setValue to set values manually
//     getValues,
//   } = useForm({
//     resolver: yupResolver(SignupSchema),
//   });


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setVesselData((prev) => ({ ...prev, [name]: value }));
//   };
  

//   const onSubmit =  (data) => {
//     // e.preventDefault();
//     // try {
      
//     //   const payload = {
//     //     vesselName: vesselData.vesselName,
//     //     vesselRegistrationNumber: vesselData.vesselRegistrationNumber,
//     //     vesselHeight: vesselData.vesselHeight,
//     //     vesselWidth: vesselData.vesselWidth,
//     //     vesselLength:vesselData.vesselLength,
//     //   };
//     //   const response = await useJwt.postslipAssignment(payload);
//     //   console.log("API Response:", response);
//     //   stepper.next();


//     // } catch (error) {
//     //   console.log("error:", error);

//     // }
    

//     // Get input values and compare them with API dimensions
//     const userDimensions = {
//       vesselWidth: data.vesselWidth,
//       vesselHeight: data.vesselHeight,
//       vesselLength: data.vesselLength,
//     };

//     let errorFound = false;
//     const errorMessages = {};

//     // Compare each dimension with the API dimensions

//     Object.keys(userDimensions).forEach((key) => {
//       // console.log(key);

//       if (
//         key !== "length" &&
//         dimensions[key] &&
//         userDimensions[key] !== undefined
//       ) {
//         const userValue = parseFloat(userDimensions[key]);
//         const apiValue = parseFloat(dimensions[key]);

//         if (userValue > apiValue) {
//           errorMessages[key] = MySwal.fire({
//             title: "Not Avilable",
//             text: `${key} Does Not Available , Available Size : ${Math.abs(
//               apiValue
//             )} Or Less `,
//             icon: "error",
//             customClass: {
//               confirmButton: "btn btn-primary",
//             },
//             buttonsStyling: false,
//           });

//           errorFound = true;
//         }
//       }
//     });

//     if (errorFound) {
//       console.log("Dimension errors:", errorMessages);
//       return;
//     }

//     console.log("Form Data:", data); // Logs the form data
//     console.log("VesselData=",vesselData);

//     if (Object.keys(errors).length === 0) {
//       stepper.next();
//     }
//   };

//   const handleSlipChange = (option) => {
//     setSelectedSlipname(option);
//     setDimensions(option?.dimensions || {}); // Update dimensions based on selected slip
//   };

 

  

//   return (
//     <Fragment>
//       <div className="content-header">
//         <h5 className="mb-0">Vessel Details</h5>
//         <small className="text-muted">Enter Your Vessel Details.</small>
//       </div>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Row>
//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="slipName">
//               Slip Name <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Controller
//               name="slipName"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   value={selectedSlipname}
//                   onChange={(option) => {
//                     field.onChange(option?.value);
//                     handleSlipChange(option); // Handle slip change
//                   }}
//                   options={slipNames}
//                   isClearable
//                   placeholder="Select Slip Name"
//                 />
//               )}
//             />
//             {errors.slipName && (
//               <FormFeedback>{errors.slipName.message}</FormFeedback>
//             )}
//           </Col>
//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="vesselName">
//               Vessel Name
//             </Label>
//             <Controller
//               control={control}
//               name="vesselName"
//               render={({ field }) => (
//                 <Input
//                   type="text"
//                   value={vesselData.vesselName}
//                   onChange={handleChange}

//                   placeholder="Enter Vessel Name"
//                   invalid={errors.vesselName && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.vesselName && (
//               <FormFeedback>{errors.vesselName.message}</FormFeedback>
//             )}
//           </Col>
//         </Row>
//         <Row>
//           <Col md="6" className="mb-1">
//             <Label className="form-label" for="vesselRegistrationNumber">
//               Vessel Registration Number
//             </Label>
//             <Controller
//               control={control}
//               name="vesselRegistrationNumber"
//               render={({ field }) => (
//                 <Input
//                   type="number"
//                   value={vesselData.vesselRegistrationNumber}
//                   onChange={handleChange}
//                   placeholder="Enter Registration Number"
//                   invalid={errors.vesselRegistrationNumber && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.vesselRegistrationNumber && (
//               <FormFeedback>
//                 {errors.vesselRegistrationNumber.message}
//               </FormFeedback>
//             )}
//           </Col>

//           {/* Dynamically Render Dimension Fields */}
//           {Object.keys(dimensions).map((dimKey) => (
//             <Col key={dimKey} md="6" className="mb-1">
//               <Label className="form-label" for={dimKey}>
//                 {dimKey.charAt(0).toUpperCase() + dimKey.slice(1)}
//               </Label>
//               <Controller
//                 name={dimKey}
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     type="number"
//                     // value={vesselData[dim] || ""}
//                     // onChange={handleChange}
//                     placeholder={`Enter ${dimKey}`}
//                     invalid={errors[dimKey] && true}
//                     {...field}
//                   />
//                 )}
//               />
//               {errors[dimKey] && (
//                 <FormFeedback>{errors[dimKey]?.message}</FormFeedback>
//               )}
//             </Col>
//           ))}
//         </Row>

//         <div className="d-flex justify-content-between">
//           <Button color="secondary" className="btn-prev" outline disabled>
//             <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
//             <span className="align-middle d-sm-inline-block d-none">
//               Previous
//             </span>
//           </Button>
//           <Button type="submit" color="primary" className="btn-next">
//             <span className="align-middle d-sm-inline-block d-none">Next</span>
//             <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
//           </Button>
//         </div>
//       </Form>
//     </Fragment>
//   );
// };

// export default AccountDetails;


import React, { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

const AccountDetails = ({ stepper }) => {
  const [selectedSlipname, setSelectedSlipname] = useState(null);
  const [slipNames, setSlipNames] = useState([]);
  const [dimensions, setDimensions] = useState({});
  const [vesselData, setVesselData] = useState({
    slipName: "",
    vesselName: "",
    vesselRegistrationNumber: "",
  });

  useEffect(() => {
    debugger
    const fetchData = async () => {
      try {
        debugger
        const response = await useJwt.getslipDetail({});
        const options = response.data.content.result.map((item) => ({
          value: item.id,
          label: item.slipName,
          dimensions: item.dimensions,
        }));
        setSlipNames(options);

      } catch (error) {
        console.error("Error fetching slip details:", error);
        alert("An unexpected error occurred");
      }
    };
    console.log("vessel data updated:", vesselData);

    fetchData();
  }, [vesselData]);

  const SignupSchema = yup.object().shape({
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
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVesselData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlipChange = (option) => {
    setSelectedSlipname(option);
    setDimensions(option?.dimensions || {});
    setVesselData((prev) => ({
      ...prev,
      slipName: option?.label || "",
    }));
  };

  const onSubmit = (data) => {
    const updatedData = {
      ...vesselData,
      ...data,
      
    };
    console.log("Final Data:", updatedData); // Log all data in state
    
    stepper.next();
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Vessel Details</h5>
        <small className="text-muted">Enter Your Vessel Details.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
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

                  value={selectedSlipname}
                  onChange={(option) => {
                    field.onChange(option?.value);
                    handleSlipChange(option);
                  }}
                  options={slipNames}
                  isClearable
                  placeholder="Select Slip Name"
                  invalid={errors.slipNames && true}
                  {...field}

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
                  name="vesselName"
                  value={vesselData.vesselName}
                  onChange={handleChange}
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
                  type="number"
                  name="vesselRegistrationNumber"
                  value={vesselData.vesselRegistrationNumber}
                  onChange={handleChange}
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
                {dimKey.charAt(0).toUpperCase() + dimKey.slice(1)}
              </Label>
              <Controller
                name={dimKey}
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    name={dimKey}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setVesselData((prev) => ({
                        ...prev,
                        [name]: value,
                      }));
                    }}
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
      </Form>
    </Fragment>
  );
};

export default AccountDetails;
