// import React, { useState, useEffect, useRef } from "react";
// import Select from "react-select";
// import { Spinner, UncontrolledAlert } from "reactstrap";
// import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
// // ** Utils
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardBody,
//   Col,
//   Input,
//   Form,
//   Button,
//   Label,
//   Table,
//   Row,
//   FormFeedback,
// } from "reactstrap";
// import useJwt from "@src/auth/jwt/useJwt";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { useNavigate, useParams } from "react-router-dom";
// import { parse } from "@babel/core/lib/parse";
// import { useLocation } from "react-router-dom";
// import { Toast } from "primereact/toast";
// import { ArrowLeft } from "react-feather";

// const MySwal = withReactContent(Swal);
// function ShipDetails() {
//   let navigate = useNavigate();
//   const toast = useRef(null);

//   const location = useLocation(); // Use location hook to get the passed state
//   const [loadinng, setLoading] = useState(false);
//   const [fetchLoader, setFetchLoader] = useState(false);
//   const [view, setView] = useState(false);
//   const [userData, setUserData] = useState({
//     slipName: "",
//     electric: false,
//     water: false,
//     addOn: "",
//     marketAnnualPrice: "",
//     marketMonthlyPrice: "",
//     amps: "",

//     overDueChargesFor7Days: "",
//     overDueAmountFor7Days: "",

//     overDueAmountFor15Days: "",
//     overDueChargesFor15Days: "",

//     overDueAmountFor30Days: "",
//     overDueChargesFor30Days: "",

//     overDueAmountForNotice: "",
//     overDueChargesForNotice: "",

//     overDueAmountForAuction: "",
//     overDueChagesForAuction: "",
//   });

//   const [shipTypeNames, setShipTypeNames] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null); // Store selected option for the single dropdown
//   const [dimensions, setDimensions] = useState([]); // Dimensions for the selected category
//   const [Message, setMessage] = useState("");
//   const [selections, setSelections] = useState({
//     overDueChargesFor7Days: "",
//     overDueChargesFor15Days: "",
//     overDueChargesFor30Days: "",
//     overDueChargesForNotice: "",
//     overDueChagesForAuction: "",
//   });

//   const uid = location.state?.uid || "";

//   const handleSelectTypeChange = (name, value) => {
//     setSelections((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Also update the userData state
//     setUserData((prevUserData) => ({
//       ...prevUserData,
//       [name]: value,
//     }));
//   };
//   // Handle dropdown selection change
//   const handleSelectChange = (option) => {
//     setSelectedCategory(option);
//     setDimensions(option?.dimensions || []); // Update dimensions for the selected category
//   };

//   const [errors, setErrors] = useState({});
//   const [slipNames, setSlipNames] = useState(["Slip123", "Dock456"]); // Example of existing slip names

//   // Handle input changes
//   const handleChange = ({ target }) => {
//     const { name, value, checked, type } = target;

//     // If it's a switch input (Electric or Water), update boolean state

//     if (type === "checkbox") {
//       console.log(`${name} ${checked}`);
//       setUserData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setUserData((prev) => ({ ...prev, [name]: value }));
//     }

//     if (userData.electric === false) {
//       setUserData((prev) => ({ ...prev, amps: "" }));
//     }
//   };

//   const handleSubmit = async (e, data) => {
//     setMessage("");
//     e.preventDefault();
//     console.log("dataform", data);

//     const validationErrors = validate();
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       try {
//         const payload = {
//           slipName: userData.slipName,
//           electric: userData.electric,
//           water: userData.water,
//           // addOn: userData.addOn ,
//           addOn: userData.addOn?.trim() === "" ? null : userData.addOn,
//           ...(userData.electric === true && {
//             amps: parseFloat(userData.amps),
//           }),
//           marketAnnualPrice: parseFloat(userData.marketAnnualPrice) || 0,
//           marketMonthlyPrice: parseFloat(userData.marketMonthlyPrice) || 0,
//           slipCategoryUid: selectedCategory?.value,

//           // Adjusting dimensions to ensure height comes before width
//           dimensions: (() => {
//             const unorderedDimensions = dimensions.reduce((acc, dim) => {
//               acc[dim] = parseFloat(userData[dim]) || 0;
//               return acc;
//             }, {});

//             // Explicitly reorder dimensions to prioritize 'height' over 'width'
//             const orderedDimensions = {};

//             if ("height" in unorderedDimensions)
//               orderedDimensions.height = unorderedDimensions.height;
//             if ("width" in unorderedDimensions)
//               orderedDimensions.width = unorderedDimensions.width;
//             if ("length" in unorderedDimensions)
//               orderedDimensions.length = unorderedDimensions.length;

//             // Add any remaining dimensions
//             for (const [key, value] of Object.entries(unorderedDimensions)) {
//               if (!(key in orderedDimensions)) {
//                 orderedDimensions[key] = value;
//               }
//             }

//             return orderedDimensions;
//           })(),
//           overDueAmountFor7Days:
//             parseFloat(userData.overDueAmountFor7Days) || 0,
//           overDueChargesFor7Days: selections.overDueChargesFor7Days,

//           overDueAmountFor15Days:
//             parseFloat(userData.overDueAmountFor15Days) || 0,

//           overDueChargesFor15Days: selections.overDueChargesFor15Days,
//           overDueAmountFor30Days:
//             parseFloat(userData.overDueAmountFor30Days) || 0,

//           overDueChargesFor30Days: selections.overDueChargesFor30Days,
//           overDueAmountForNotice:
//             parseFloat(userData.overDueAmountForNotice) || 0,

//           overDueChargesForNotice: selections.overDueChargesForNotice,
//           overDueAmountForAuction:
//             parseFloat(userData.overDueAmountForAuction) || 0,

//           overDueChagesForAuction: selections.overDueChagesForAuction,
//         };

//         setLoading(true);

//         if (uid) {
//           const updateRes = await useJwt.updateslip(uid, payload);

//           if (updateRes.status === 200) {
//             toast.current.show({
//               severity: "success",
//               summary: "Updated Successfully",
//               detail: "Slip Details updated Successfully.",
//               life: 2000,
//             });
//             setTimeout(() => {
//               navigate("/dashboard/slipdetail_list");
//             }, 2000);
//           }
//         } else {
//           const createRes = await useJwt.postslip(payload);

//           if (createRes.status === 201) {
//             toast.current.show({
//               severity: "success",
//               summary: "Created Successfully",
//               detail: " Slip Details created Successfully.",
//               life: 2000,
//             });
//             setTimeout(() => {
//               navigate("/dashboard/slipdetail_list");
//             }, 2000);
//           }
//         }
//       } catch (error) {
//         console.error("Error submitting form:", error);

//         const { content } = error.response.data || {};
//         const { status } = error.response;

//         setMessage((prev) => {
//           const newMessage = content || "An unexpected error occurred";
//           return prev !== newMessage ? newMessage : prev + " "; // Force update
//         });
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       console.log("Validation failed. Please fix the errors.");
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     const alphanumericRegex = /^(?!\s*$)[A-Za-z0-9 ]+$/; //
//     const alphabeticRegex = /^[A-Za-z.-]+$/; // accept a-z . -
//     const NonSpecialChar = /[^a-zA-Z0-9 ]/g;

//     // Validate Slip Name
//     if (!userData.slipName) {
//       newErrors.slipName = "Slip Name is required";
//     } else if (!alphanumericRegex.test(userData.slipName)) {
//       newErrors.slipName = "Slip Name should contain only letters and numbers";
//     } else if (NonSpecialChar) {
//     } else {
//       // If `uid` exists (update mode), exclude current slipName from uniqueness check
//       const isDuplicate = slipNames.some(
//         (name) => name === userData.slipName && name !== currentSlipName // Ignore current slipName if updating
//       );

//       if (!uid && isDuplicate) {
//         newErrors.slipName = "Slip Name must be unique";
//       }
//     }

//     // Validate Category
//     if (!selectedCategory) {
//       newErrors.category = "Category is required";
//     }

//     // Validate Dimensions
//     // dimensions.forEach((dim) => {
//     //   if (!userData[dim]) {
//     //     newErrors[dim] = `${dim.toUpperCase()} is required`;
//     //   }else if(userData[dim]>1){
//     //     newErrors[dim]="Dimentions Should be greater than 0"
//     //   }
//     // });

//     dimensions.forEach((dim) => {
//       if (!userData[dim]) {
//         newErrors[dim] = `${dim.toUpperCase()} is required`;
//       } else if (Number(userData[dim]) <= 0) {
//         // Show custom error for "length"
//         if (dim === "length") {
//           newErrors[dim] = "Length should be greater than 0";
//         } else {
//           newErrors[dim] = "Dimensions should be greater than 0";
//         }
//       }
//     });

//     // Validate Add-On
//     if (userData.addOn && !alphanumericRegex.test(userData.addOn)) {
//       newErrors.addOn = "Add-on can only contain letters, periods, and hyphens";
//     }

//     // Validate Annual Price
//     if (!userData.marketAnnualPrice) {
//       newErrors.marketAnnualPrice = "Annual Price is required";
//     } else if (isNaN(userData.marketAnnualPrice)) {
//       newErrors.marketAnnualPrice = "Annual Price must be a number";
//     }

//     // Validate Monthly Price
//     if (!userData.marketMonthlyPrice) {
//       newErrors.marketMonthlyPrice = "Monthly Price is required";
//     } else if (isNaN(userData.marketMonthlyPrice)) {
//       newErrors.marketMonthlyPrice = "Monthly Price must be a number";
//     }

//     // Validate AMPS if Electric is enabled
//     if (userData.electric) {
//       if (!userData.amps) {
//         newErrors.amps = "AMPS is required when Electric is enabled";
//       } else if (isNaN(userData.amps)) {
//         newErrors.amps = "AMPS must be a number";
//       }
//     }

//     if (
//       !userData.overDueAmountFor7Days ||
//       isNaN(userData.overDueAmountFor7Days)
//     ) {
//       newErrors.overDueAmountFor7Days = "Please enter a valid number.";
//     } else if (userData.overDueAmountFor7Days <= 0) {
//       newErrors.overDueAmountFor7Days = "Amount must be greater than zero.";
//     } else if (
//       selections.overDueChargesFor7Days === "Percentage" &&
//       userData.overDueAmountFor7Days > 100
//     ) {
//       newErrors.overDueAmountFor7Days =
//         "Percentage amount must be less than or equal to 100.";
//     } else if (!selections.overDueChargesFor7Days) {
//       newErrors.overDueAmountFor7Days = "Please select a Charge type.";
//     }

//     if (
//       !userData.overDueAmountFor15Days ||
//       isNaN(userData.overDueAmountFor15Days)
//     ) {
//       newErrors.overDueAmountFor15Days = "Please enter a valid number.";
//     } else if (userData.overDueAmountFor15Days <= 0) {
//       newErrors.overDueAmountFor15Days = "Amount must be greater than zero.";
//     } else if (
//       selections.overDueChargesFor15Days === "Percentage" &&
//       userData.overDueAmountFor15Days > 100
//     ) {
//       newErrors.overDueAmountFor15Days =
//         "Percentage amount must be less than or equal to 100.";
//     } else if (!selections.overDueChargesFor15Days) {
//       newErrors.overDueAmountFor15Days = "Please select a Charge type.";
//     }

//     if (
//       !userData.overDueAmountFor30Days ||
//       isNaN(userData.overDueAmountFor30Days)
//     ) {
//       newErrors.overDueAmountFor30Days = "Please enter a valid number.";
//     } else if (userData.overDueAmountFor30Days <= 0) {
//       newErrors.overDueAmountFor30Days = "Amount must be greater than zero.";
//     } else if (
//       selections.overDueChargesFor30Days === "Percentage" &&
//       userData.overDueAmountFor30Days > 100
//     ) {
//       newErrors.overDueAmountFor30Days =
//         "Percentage amount must be less than or equal to 100.";
//     } else if (!selections.overDueChargesFor30Days) {
//       newErrors.overDueAmountFor30Days = "Please select Charge type.";
//     }

//     if (
//       !userData.overDueAmountForNotice ||
//       isNaN(userData.overDueAmountForNotice)
//     ) {
//       newErrors.overDueAmountForNotice = "Please enter a valid number.";
//     } else if (userData.overDueAmountForNotice <= 0) {
//       newErrors.overDueAmountForNotice = "Amount must be greater than zero.";
//     } else if (
//       selections.overDueChargesForNotice === "Percentage" &&
//       userData.overDueAmountForNotice > 100
//     ) {
//       newErrors.overDueAmountForNotice =
//         "Percentage amount must be less than or equal to 100.";
//     } else if (!selections.overDueChargesForNotice) {
//       newErrors.overDueAmountForNotice = "Please select a Charge type.";
//     }

//     if (
//       !userData.overDueAmountForAuction ||
//       isNaN(userData.overDueAmountForAuction)
//     ) {
//       newErrors.overDueAmountForAuction = "Please enter a valid number.";
//     } else if (userData.overDueAmountForAuction <= 0) {
//       newErrors.overDueAmountForAuction = "Amount must be greater than zero.";
//     } else if (
//       selections.overDueChagesForAuction === "Percentage" &&
//       userData.overDueAmountForAuction > 100
//     ) {
//       newErrors.overDueAmountForAuction =
//         "Percentage amount must be less than or equal to 100.";
//     } else if (!selections.overDueChagesForAuction) {
//       newErrors.overDueAmountForAuction = "Please select a Charge type.";
//     }

//     return newErrors;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const payload = {};
//         const response = await useJwt.getslipCatogory(payload);
//         const options = response.data.content.result.map((item) => ({
//           value: item.uid,
//           label: item.shipTypeName,
//           dimensions: item.dimensions,
//         }));

//         setShipTypeNames(options);
//         console.log(options);
//       } catch (error) {
//         console.error("Error fetching category:", error);
//         const { response } = error;
//         const { data, status } = response;
//       }

//       console.log("Category", selectedCategory);
//     };
//     if (uid) {
//       const fetchDetailsForUpdate = async () => {
//         try {
//           setFetchLoader(true);

//           const resp = await useJwt.getslip(uid);
//           const details = resp.data.content;

//           console.log("details", details.isAssigned);

//           if (details?.isAssigned === true) {
//             setView(true);
//           } else {
//             setView(false);
//           }

//           if (details && details.uid === uid) {
//             setUserData({
//               slipName: details.slipName,
//               electric: details.electric,
//               water: details.water,
//               addOn: details.addOn,
//               marketAnnualPrice: details.marketAnnualPrice,
//               marketMonthlyPrice: details.marketMonthlyPrice,
//               amps: details.amps,
//               overDueAmountFor7Days: details.overDueAmountFor7Days,

//               overDueAmountFor15Days: details.overDueAmountFor15Days,

//               overDueAmountFor30Days: details.overDueAmountFor30Days,

//               overDueAmountForNotice: details.overDueAmountForNotice,

//               overDueAmountForAuction: details.overDueAmountForAuction,
//             });

//             setDimensions(Object.keys(details.dimensions) || []);
//             setUserData((pre) => ({ ...pre, ...details.dimensions }));

//             setSelectedCategory({
//               value: details.category.uid,
//               label: details.category.shipTypeName,
//               dimensions: details.dimensions,
//             });
//             console.log("details", details);

//             console.log("selectedCategory", {
//               dimensions: details.dimensions,
//             });

//             setSelections({
//               overDueChargesFor7Days: details.overDueChargesFor7Days,
//               overDueChargesFor15Days: details.overDueChargesFor15Days,
//               overDueChargesFor30Days: details.overDueChargesFor30Days,
//               overDueChargesForNotice: details.overDueChargesForNotice,
//               overDueChagesForAuction: details.overDueChagesForAuction,
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         } finally {
//           setFetchLoader(false);
//         }
//       };
//       fetchDetailsForUpdate();
//     }

//     fetchData();
//   }, [uid]);

//   const resetForm = () => {
//     setUserData({
//       dimensions: new Set(),
//       slipName: "",
//       electric: false,
//       water: false,
//       addOn: "",
//       marketAnnualPrice: "",
//       marketMonthlyPrice: "",
//       amps: "",
//       overDueAmountFor7Days: "",
//       overDueAmountFor15Days: "",
//       overDueAmountFor30Days: "",
//       overDueAmountForNotice: "",
//       overDueAmountForAuction: "",
//       daysradio: "",
//     });
//     setErrors({
//       slipName: "",
//       electric: false,
//       water: false,
//       addOn: "",
//       marketAnnualPrice: "",
//       marketMonthlyPrice: "",
//       amps: "",
//       dimensions: false,
//       overDueAmountFor7Days: "",
//       overDueAmountFor15Days: "",
//       overDueAmountFor30Days: "",
//       overDueAmountForNotice: "",
//       overDueAmountForAuction: "",
//     });
//   };

//   const optionsForDays = [
//     { value: "Flat", label: "Flat" },
//     { value: "Percentage", label: "Percentage" },
//   ];

//   return (
//     <>
//       <Card>
//         <Toast ref={toast} />

//         <CardHeader>
//           <CardTitle tag="h4">
//             <ArrowLeft
//               style={{
//                 cursor: "pointer",
//                 marginRight: "10px",
//                 transition: "color 0.1s",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
//               onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
//               onClick={() => window.history.back()}
//             />{" "}
//             {uid ? "Edit Slip Details" : "Add Slip Details"}
//           </CardTitle>
//         </CardHeader>

//         <CardBody>
//           <p>
//             <strong>Note : </strong> If the slip is <strong>Assigned</strong> ,
//             you can only update <strong>Electric </strong> ,
//             <strong>Water</strong>, <strong>Add-On</strong> And{" "}
//             <strong>AMPS</strong>{" "}
//           </p>

//           {fetchLoader ? (
//             <>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginTop: "4rem",
//                 }}
//               >
//                 <Spinner
//                   color="primary"
//                   style={{
//                     height: "5rem",
//                     width: "5rem",
//                   }}
//                 />
//               </div>
//             </>
//           ) : (
//             <Form autoComplete="off" onSubmit={handleSubmit}>
//               <Row className="mb-1">
//                 <Label sm="3" for=""></Label>{" "}
//                 <Col sm="12">
//                   {Message && (
//                     <React.Fragment>
//                       <UncontrolledAlert color="danger">
//                         <div className="alert-body">
//                           <span className="text-danger fw-bold">
//                             Error - {Message}
//                           </span>
//                         </div>
//                       </UncontrolledAlert>
//                     </React.Fragment>
//                   )}
//                 </Col>
//               </Row>
//               <Row className="mb-1">
//                 <Label sm="3" for="name">
//                   Slip Name
//                   <span style={{ color: "red" }}>*</span>
//                 </Label>
//                 <Col sm="9">
//                   <Input
//                     type="text"
//                     value={userData.slipName}
//                     onChange={handleChange}
//                     name="slipName"
//                     id="slipName"
//                     placeholder="Enter Slip Name"
//                     invalid={!!errors.slipName}
//                     disabled={view}
//                   />
//                   {errors.slipName && (
//                     <FormFeedback>{errors.slipName}</FormFeedback>
//                   )}
//                 </Col>
//               </Row>

//               <Row className="mb-1">
//                 <Label sm="3" for="category">
//                   Category<span style={{ color: "red" }}>*</span>
//                 </Label>
//                 <Col sm="9">
//                   <Select
//                     value={selectedCategory}
//                     onChange={handleSelectChange}
//                     name="category"
//                     options={shipTypeNames}
//                     isClearable
//                     placeholder="Select Category"
//                     className={errors.category ? "is-invalid" : ""}
//                     isDisabled={view}
//                   />

//                   {errors.category && (
//                     <div className="invalid-feedback d-block">
//                       {errors.category}
//                     </div>
//                   )}
//                 </Col>
//               </Row>

//               {dimensions.map((dim) => (
//                 <Row className="mb-1" key={dim}>
//                   <Label sm="3" for={dim}>
//                     {dim.toLowerCase()}
//                     <span style={{ color: "red" }}>*</span>
//                   </Label>
//                   <Col sm="9">
//                     <Input
//                       type="text"
//                       value={userData[dim] || ""}
//                       onChange={(e) => {
//                         let validatedDimension = e.target.value.replace(
//                           /[^0-9.]/g,
//                           ""
//                         ); // Ensure only numbers and dots are allowed
//                         setUserData((prev) => ({
//                           ...prev,
//                           [dim]: validatedDimension,
//                         })); // Correct state update
//                       }}
//                       name={dim}
//                       id={dim}
//                       placeholder={`Enter ${dim.toLowerCase()}`}
//                       invalid={!!errors[dim]}
//                       disabled={view}
//                     />
//                     {errors[dim] && <FormFeedback>{errors[dim]}</FormFeedback>}
//                   </Col>
//                 </Row>
//               ))}

//               {/* Electric Switch Field */}
//               <Row className="mb-1">
//                 <Label sm="3" for="electric">
//                   Electric (Yes/No)
//                 </Label>
//                 <Col sm="9">
//                   <div className="form-check form-switch d-flex align-items-center">
//                     {/* "No" label to the left */}
//                     <Label
//                       className="me-1"
//                       htmlFor="electric"
//                       style={{ textAlign: "left" }}
//                     >
//                       No
//                     </Label>

//                     <Input
//                       type="switch"
//                       name="electric"
//                       id="electric"
//                       checked={userData?.electric}
//                       onChange={handleChange}
//                       style={{ margin: 0 }}
//                     />

//                     {/* "Yes" label to the right */}
//                     <Label
//                       className="ms-1"
//                       htmlFor="electric"
//                       style={{ textAlign: "left" }}
//                     >
//                       Yes
//                     </Label>
//                   </div>
//                 </Col>
//               </Row>

//               {/* Water Switch Field */}
//               <Row className="mb-1">
//                 <Label sm="3" for="water">
//                   Water (Yes/No)
//                 </Label>
//                 <Col sm="9">
//                   <div className="form-check form-switch d-flex align-items-center">
//                     {/* "No" label to the left */}
//                     <Label
//                       className="me-1"
//                       htmlFor="water"
//                       style={{ textAlign: "left" }}
//                     >
//                       No
//                     </Label>

//                     {/* Toggle switch */}
//                     <Input
//                       type="switch"
//                       name="water"
//                       id="water"
//                       checked={userData?.water}
//                       onChange={handleChange}
//                       style={{ margin: 0 }}
//                     />

//                     {/* "Yes" label to the right */}
//                     <Label
//                       className="ms-1"
//                       htmlFor="water"
//                       style={{ textAlign: "left" }}
//                     >
//                       Yes
//                     </Label>
//                   </div>
//                 </Col>
//               </Row>

//               {userData.electric && (
//                 <Row className="mb-1">
//                   <Label sm="3" for="amps">
//                     AMPS
//                   </Label>
//                   <Col sm="9">
//                     <Input
//                       type="text"
//                       value={userData.amps}
//                       onChange={handleChange}
//                       name="amps"
//                       id="amps"
//                       placeholder="Enter AMPS"
//                       invalid={!!errors.amps}
//                     />
//                     <FormFeedback>{errors.amps}</FormFeedback>
//                   </Col>
//                 </Row>
//               )}

//               <Row className="mb-1">
//                 <Label sm="3" for="addOn">
//                   Add-on
//                 </Label>
//                 <Col sm="9">
//                   <Input
//                     type="text"
//                     value={userData.addOn}
//                     onChange={handleChange}
//                     name="addOn"
//                     id="addOn"
//                     placeholder="Enter Add-on"
//                     invalid={!!errors.addOn}
//                   />
//                   <FormFeedback>{errors.addOn}</FormFeedback>
//                 </Col>
//               </Row>

//               <Row className="mb-1">
//                 <Label sm="3" for="marketAnnualPrice">
//                   Market Annual Price
//                   <span style={{ color: "red" }}>*</span>
//                 </Label>
//                 <Col sm="9">
//                   <Input
//                     type="text"
//                     value={userData.marketAnnualPrice}
//                     onChange={(e) => {
//                       let marketAnnual = e.target.value; // Use "let" instead of "const"
//                       marketAnnual = marketAnnual.replace(/[^0-9.]/g, ""); // Apply replace correctly

//                       setUserData((prev) => ({
//                         ...prev,
//                         marketAnnualPrice: marketAnnual,
//                       })); // Fix state update
//                     }}
//                     name="marketAnnualPrice"
//                     id="marketAnnualPrice"
//                     placeholder="Enter Annual Price"
//                     disabled={view}
//                     invalid={!!errors.marketAnnualPrice}
//                   />
//                   <FormFeedback>{errors.marketAnnualPrice}</FormFeedback>
//                 </Col>
//               </Row>

//               <Row className="mb-1">
//                 <Label sm="3" for="marketMonthlyPrice">
//                   Market Monthly Price
//                   <span style={{ color: "red" }}>*</span>
//                 </Label>
//                 <Col sm="9">
//                   <Input
//                     type="text"
//                     value={userData.marketMonthlyPrice}
//                     onChange={(e) => {
//                       let marketMonth = e.target.value; // Use "let" instead of "const"
//                       marketMonth = marketMonth.replace(/[^0-9.]/g, ""); // Apply replace correctly

//                       setUserData((prev) => ({
//                         ...prev,
//                         marketMonthlyPrice: marketMonth,
//                       })); // Fix state update
//                     }}
//                     name="marketMonthlyPrice"
//                     id="marketMonthlyPrice"
//                     placeholder="Enter Monthly Price"
//                     disabled={view}
//                     invalid={!!errors.marketMonthlyPrice}
//                   />
//                   <FormFeedback>{errors.marketMonthlyPrice}</FormFeedback>
//                 </Col>
//               </Row>
//               {/*
//               <Row className="mb-1">
//                 <Label sm="3" for="marketMonthlyPrice">
//                   7 Days Charges
//                   <span style={{ color: "red" }}>*</span>
//                 </Label>
//                 <Col sm="9">
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="radio"
//                       name="overDueChargesFor7Days"
//                       value="Percentage"
//                       id="Percentage"
//                       disabled={view}
//                       checked={
//                         selections.overDueChargesFor7Days === "Percentage"
//                       }
//                       onChange={() =>
//                         handleSelectTypeChange(
//                           "overDueChargesFor7Days",
//                           "Percentage"
//                         )
//                       }
//                       invalid={!!errors.overDueChargesFor7Days}
//                     />
//                     <Label
//                       for="basic-cb-unchecked"
//                       className="form-check-label"
//                     >
//                       Percentage
//                     </Label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="radio"
//                       name="overDueChargesFor7Days"
//                       value="Flat"
//                       id="Flat"
//                       disabled={view}
//                       checked={selections.overDueChargesFor7Days === "Flat"}
//                       onChange={() =>
//                         handleSelectTypeChange("overDueChargesFor7Days", "Flat")
//                       }
//                       invalid={!!errors.overDueChargesFor7Days}
//                     />{" "}
//                     <Label
//                       for="basic-cb-unchecked"
//                       className="form-check-label"
//                     >
//                       Flat
//                     </Label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="text"
//                       name="overDueAmountFor7Days"
//                       disabled={view}
//                       value={userData.overDueAmountFor7Days || ""}
//                       onChange={(e) => {
//                         let sevenDays = e.target.value; // Use "let" instead of "const"
//                         sevenDays = sevenDays.replace(/[^0-9.]/g, ""); // Apply replace correctly

//                         setUserData((prev) => ({ ...prev, overDueAmountFor7Days: sevenDays })); // Fix state update
//                       }}
//                       placeholder="Enter 7 Days Charges"
//                       invalid={!!errors.overDueAmountFor7Days}
//                     />
//                     <FormFeedback>{errors.overDueAmountFor7Days}</FormFeedback>
//                   </div>
//                 </Col>
//               </Row>

//               <Row className="mb-1">
//                 <Label sm="3" for="">
//                   15 Days Charges
//                   <span style={{ color: "red" }}>*</span>
//                 </Label>
//                 <Col sm="9">
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="radio"
//                       disabled={view}
//                       checked={
//                         selections.overDueChargesFor15Days === "Percentage"
//                       }
//                       onChange={() =>
//                         handleSelectTypeChange(
//                           "overDueChargesFor15Days",
//                           "Percentage"
//                         )
//                       }
//                       name="overDueChargesFor15Days"
//                       id="basic-cb-unchecked"
//                     />
//                     <Label
//                       for="basic-cb-unchecked"
//                       className="form-check-label"
//                     >
//                       Percentage
//                     </Label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="radio"
//                       checked={selections.overDueChargesFor15Days === "Flat"}
//                       disabled={view}
//                       onChange={() =>
//                         handleSelectTypeChange(
//                           "overDueChargesFor15Days",
//                           "Flat"
//                         )
//                       }
//                       name="overDueChargesFor15Days "
//                       id="basic-cb-unchecked"
//                     />
//                     <Label
//                       for="basic-cb-unchecked"
//                       className="form-check-label"
//                     >
//                       Flat
//                     </Label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="text"
//                       disabled={view}
//                       name="overDueAmountFor15Days"
//                       value={userData.overDueAmountFor15Days || ""}
//                       onChange={(e) => {
//                         let fiftinDays = e.target.value;
//                         fiftinDays = fiftinDays.replace(/[^0-9.]/g, "");

//                         setUserData((prev) => ({ ...prev, overDueAmountFor15Days: fiftinDays })); // Fix state update
//                       }}
//                       placeholder="Enter 15 Days Charges"
//                       invalid={!!errors.overDueAmountFor15Days}
//                     />
//                     <FormFeedback>{errors.overDueAmountFor15Days}</FormFeedback>
//                   </div>

//                   <FormFeedback>{errors.overDueAmountFor15Days}</FormFeedback>
//                 </Col>
//               </Row>

//               <Row className="mb-1">
//                 <Label sm="3" for="">
//                   30 Days Charges
//                   <span style={{ color: "red" }}>*</span>
//                 </Label>
//                 <Col sm="9">
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="radio"
//                       disabled={view}
//                       checked={
//                         selections.overDueChargesFor30Days === "Percentage"
//                       }
//                       onChange={() =>
//                         handleSelectTypeChange(
//                           "overDueChargesFor30Days",
//                           "Percentage"
//                         )
//                       }
//                       name="overDueChargesFor30Days"
//                       id="basic-cb-unchecked"
//                     />
//                     <Label
//                       for="basic-cb-unchecked"
//                       className="form-check-label"
//                     >
//                       Percentage
//                     </Label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="radio"
//                       disabled={view}
//                       checked={selections.overDueChargesFor30Days === "Flat"}
//                       onChange={() =>
//                         handleSelectTypeChange(
//                           "overDueChargesFor30Days",
//                           "Flat"
//                         )
//                       }
//                       name="overDueChargesFor30Days"
//                       id="basic-cb-unchecked"
//                     />
//                     <Label
//                       for="basic-cb-unchecked"
//                       className="form-check-label"
//                     >
//                       Flat
//                     </Label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="text"
//                       disabled={view}
//                       name="overDueAmountFor30Days"
//                       placeholder="Enter 30 Days Charges"
//                       value={userData.overDueAmountFor30Days || ""}
//                       onChange={(e) =>{
//                         let thirty = e.target.value;
//                         thirty = thirty.replace(/[^0-9.]/g, "");

//                         setUserData((prev) => ({ ...prev, overDueAmountFor30Days: thirty })); // Fix state update
//                       }}
//                       invalid={!!errors.overDueAmountFor30Days}
//                     />
//                     <FormFeedback>{errors.overDueAmountFor30Days}</FormFeedback>
//                   </div>

//                   <FormFeedback>{errors.overDueAmountFor30Days}</FormFeedback>
//                 </Col>
//               </Row>

//               <Row className="mb-1">
//                 <Label sm="3" for="marketMonthlyPrice">
//                   Notice Charges
//                   <span style={{ color: "red" }}>*</span>
//                 </Label>
//                 <Col sm="9">
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="radio"
//                       disabled={view}
//                       checked={
//                         selections.overDueChargesForNotice === "Percentage"
//                       }
//                       onChange={() =>
//                         handleSelectTypeChange(
//                           "overDueChargesForNotice",
//                           "Percentage"
//                         )
//                       }
//                       name="overDueChargesForNotice"
//                       id="basic-cb-unchecked"
//                     />
//                     <Label
//                       for="basic-cb-unchecked"
//                       className="form-check-label"
//                     >
//                       Percentage
//                     </Label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="radio"
//                       disabled={view}
//                       checked={selections.overDueChargesForNotice === "Flat"}
//                       onChange={() =>
//                         handleSelectTypeChange(
//                           "overDueChargesForNotice",
//                           "Flat"
//                         )
//                       }
//                       name="overDueChargesForNotice"
//                       id="basic-cb-unchecked"
//                     />
//                     <Label
//                       for="basic-cb-unchecked"
//                       className="form-check-label"
//                     >
//                       Flat
//                     </Label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="text"
//                       disabled={view}
//                       name="overDueAmountForNotice"
//                       value={userData.overDueAmountForNotice || ""}
//                       onChange={(e) =>{
//                         let noticeCharge = e.target.value;
//                         noticeCharge = noticeCharge.replace(/[^0-9.]/g, "");

//                         setUserData((prev) => ({ ...prev, overDueAmountForNotice: noticeCharge })); // Fix state update
//                       }}
//                       placeholder="Enter Notice Charges"
//                       invalid={!!errors.overDueAmountForNotice}
//                     />
//                     <FormFeedback>{errors.overDueAmountForNotice}</FormFeedback>
//                   </div>

//                   <FormFeedback>{errors.overDueAmountForNotice}</FormFeedback>
//                 </Col>
//               </Row>

//               <Row className="mb-1">
//                 <Label sm="3" for="marketMonthlyPrice">
//                   Auction Charges
//                   <span style={{ color: "red" }}>*</span>
//                 </Label>
//                 <Col sm="9">
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="radio"
//                       disabled={view}
//                       checked={
//                         selections.overDueChagesForAuction === "Percentage"
//                       }
//                       onChange={() =>
//                         handleSelectTypeChange(
//                           "overDueChagesForAuction",
//                           "Percentage"
//                         )
//                       }
//                       name="overDueChagesForAuction"
//                       id="basic-cb-unchecked"
//                     />
//                     <Label
//                       for="basic-cb-unchecked"
//                       className="form-check-label"
//                     >
//                       Percentage
//                     </Label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="radio"
//                       disabled={view}
//                       checked={selections.overDueChagesForAuction === "Flat"}
//                       onChange={() =>
//                         handleSelectTypeChange(
//                           "overDueChagesForAuction",
//                           "Flat"
//                         )
//                       }
//                       name="overDueChagesForAuction"
//                       id="basic-cb-unchecked"
//                     />
//                     <Label
//                       for="basic-cb-unchecked"
//                       className="form-check-label"
//                     >
//                       Flat
//                     </Label>
//                   </div>
//                   <div className="form-check form-check-inline">
//                     <Input
//                       type="text"
//                       disabled={view}
//                       name="overDueAmountForAuction"
//                       placeholder="Enter Auction Charges"
//                       value={userData.overDueAmountForAuction || ""}
//                       onChange={(e) =>{
//                         let AuctionCharge = e.target.value;
//                         AuctionCharge = AuctionCharge.replace(/[^0-9.]/g, "");

//                         setUserData((prev) => ({ ...prev, overDueAmountForAuction: AuctionCharge })); // Fix state update
//                       }}
//                       invalid={!!errors.overDueAmountForAuction}
//                     />
//                     <FormFeedback>
//                       {errors.overDueAmountForAuction}
//                     </FormFeedback>
//                   </div>

//                   <FormFeedback>{errors.overDueAmountForAuction}</FormFeedback>
//                 </Col>
//               </Row> */}

//               <Table responsive className="mt-2">
//                 <thead>
//                   <tr>
//                     <th>Charges</th>
//                     <th>Charges Type</th>

//                     <th>Charges Value</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>
//                       <span className="align-middle fw-bold">
//                         7 Days Charges
//                         <span style={{ color: "red" }}>*</span>
//                       </span>
//                     </td>
//                     <td>
//                       <div>
//                         <span className="me-1">Percentage</span>
//                         <Input
//                           type="radio"
//                           name="overDueChargesFor7Days"
//                           value="Percentage"
//                           id="Percentage"
//                           disabled={view}
//                           checked={
//                             selections.overDueChargesFor7Days === "Percentage"
//                           }
//                           onChange={() =>
//                             handleSelectTypeChange(
//                               "overDueChargesFor7Days",
//                               "Percentage"
//                             )
//                           }
//                           invalid={!!errors.overDueChargesFor7Days}
//                           className="me-2"
//                         />
//                         <span className="me-1">Flat</span>
//                         <Input
//                           type="radio"
//                           className="me-2"
//                           name="overDueChargesFor7Days"
//                           value="Flat"
//                           id="Flat"
//                           disabled={view}
//                           checked={selections.overDueChargesFor7Days === "Flat"}
//                           onChange={() =>
//                             handleSelectTypeChange(
//                               "overDueChargesFor7Days",
//                               "Flat"
//                             )
//                           }
//                           invalid={!!errors.overDueChargesFor7Days}
//                         />
//                       </div>
//                     </td>

//                     <td>
//                       <Input
//                         type="text"
//                         name="overDueAmountFor7Days"
//                         disabled={view}
//                         value={userData.overDueAmountFor7Days || ""}
//                         onChange={(e) => {
//                           let sevenDays = e.target.value; // Use "let" instead of "const"
//                           sevenDays = sevenDays.replace(/[^0-9.]/g, ""); // Apply replace correctly

//                           setUserData((prev) => ({
//                             ...prev,
//                             overDueAmountFor7Days: sevenDays,
//                           })); // Fix state update
//                         }}
//                         placeholder="Enter 7 Days Charges"
//                         invalid={!!errors.overDueAmountFor7Days}
//                       />
//                       <FormFeedback>
//                         {errors.overDueAmountFor7Days}
//                       </FormFeedback>{" "}
//                     </td>
//                   </tr>

//                   <tr>
//                     <td>
//                       <span className="align-middle fw-bold">
//                         15 Days Charges <span style={{ color: "red" }}>*</span>
//                       </span>
//                     </td>
//                     <td>
//                       <div>
//                         <span className="me-1">Percentage</span>
//                         <Input
//                           type="radio"
//                           disabled={view}
//                           checked={
//                             selections.overDueChargesFor15Days === "Percentage"
//                           }
//                           onChange={() =>
//                             handleSelectTypeChange(
//                               "overDueChargesFor15Days",
//                               "Percentage"
//                             )
//                           }
//                           name="overDueChargesFor15Days"
//                           id="basic-cb-unchecked"
//                           className="me-2"
//                         />
//                         <span className="me-1">Flat</span>
//                         <Input
//                           type="radio"
//                           checked={
//                             selections.overDueChargesFor15Days === "Flat"
//                           }
//                           disabled={view}
//                           onChange={() =>
//                             handleSelectTypeChange(
//                               "overDueChargesFor15Days",
//                               "Flat"
//                             )
//                           }
//                           name="overDueChargesFor15Days "
//                           id="basic-cb-unchecked"
//                           className="me-2"
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       <Input
//                         type="text"
//                         disabled={view}
//                         name="overDueAmountFor15Days"
//                         value={userData.overDueAmountFor15Days || ""}
//                         onChange={(e) => {
//                           let fiftinDays = e.target.value;
//                           fiftinDays = fiftinDays.replace(/[^0-9.]/g, "");

//                           setUserData((prev) => ({
//                             ...prev,
//                             overDueAmountFor15Days: fiftinDays,
//                           })); // Fix state update
//                         }}
//                         placeholder="Enter 15 Days Charges"
//                         invalid={!!errors.overDueAmountFor15Days}
//                       />
//                       <FormFeedback>
//                         {errors.overDueAmountFor15Days}
//                       </FormFeedback>
//                     </td>
//                   </tr>

//                   <tr>
//                     <td>
//                       <span className="align-middle fw-bold">
//                         30 Days Charges <span style={{ color: "red" }}>*</span>
//                       </span>
//                     </td>
//                     <td>
//                       <div>
//                         <span className="me-1">Percentage</span>
//                         <Input
//                           type="radio"
//                           disabled={view}
//                           checked={
//                             selections.overDueChargesFor30Days === "Percentage"
//                           }
//                           onChange={() =>
//                             handleSelectTypeChange(
//                               "overDueChargesFor30Days",
//                               "Percentage"
//                             )
//                           }
//                           name="overDueChargesFor30Days"
//                           id="basic-cb-unchecked"
//                           className="me-2"
//                         />
//                         <span className="me-1">Flat</span>
//                         <Input
//                           type="radio"
//                           disabled={view}
//                           checked={
//                             selections.overDueChargesFor30Days === "Flat"
//                           }
//                           onChange={() =>
//                             handleSelectTypeChange(
//                               "overDueChargesFor30Days",
//                               "Flat"
//                             )
//                           }
//                           name="overDueChargesFor30Days"
//                           id="basic-cb-unchecked"
//                           className="me-2"
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       <Input
//                         type="text"
//                         disabled={view}
//                         name="overDueAmountFor30Days"
//                         placeholder="Enter 30 Days Charges"
//                         value={userData.overDueAmountFor30Days || ""}
//                         onChange={(e) => {
//                           let thirty = e.target.value;
//                           thirty = thirty.replace(/[^0-9.]/g, "");

//                           setUserData((prev) => ({
//                             ...prev,
//                             overDueAmountFor30Days: thirty,
//                           })); // Fix state update
//                         }}
//                         invalid={!!errors.overDueAmountFor30Days}
//                       />
//                       <FormFeedback>
//                         {errors.overDueAmountFor30Days}
//                       </FormFeedback>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <span className="align-middle fw-bold">
//                         Notice Charges <span style={{ color: "red" }}>*</span>
//                       </span>
//                     </td>
//                     <td>
//                       <div>
//                         <span className="me-1">Percentage</span>
//                         <Input
//                           type="radio"
//                           disabled={view}
//                           checked={
//                             selections.overDueChargesForNotice === "Percentage"
//                           }
//                           onChange={() =>
//                             handleSelectTypeChange(
//                               "overDueChargesForNotice",
//                               "Percentage"
//                             )
//                           }
//                           name="overDueChargesForNotice"
//                           id="basic-cb-unchecked"
//                           className="me-2"
//                         />
//                         <span className="me-1">Flat</span>
//                         <Input
//                           type="radio"
//                           disabled={view}
//                           checked={
//                             selections.overDueChargesForNotice === "Flat"
//                           }
//                           onChange={() =>
//                             handleSelectTypeChange(
//                               "overDueChargesForNotice",
//                               "Flat"
//                             )
//                           }
//                           name="overDueChargesForNotice"
//                           id="basic-cb-unchecked"
//                           className="me-2"
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       <Input
//                         type="text"
//                         disabled={view}
//                         name="overDueAmountForNotice"
//                         value={userData.overDueAmountForNotice || ""}
//                         onChange={(e) => {
//                           let noticeCharge = e.target.value;
//                           noticeCharge = noticeCharge.replace(/[^0-9.]/g, "");

//                           setUserData((prev) => ({
//                             ...prev,
//                             overDueAmountForNotice: noticeCharge,
//                           })); // Fix state update
//                         }}
//                         placeholder="Enter Notice Charges"
//                         invalid={!!errors.overDueAmountForNotice}
//                       />
//                       <FormFeedback>
//                         {errors.overDueAmountForNotice}
//                       </FormFeedback>
//                     </td>
//                   </tr>

//                   <tr>
//                     <td>
//                       <span className="align-middle fw-bold">
//                         Auction Charges <span style={{ color: "red" }}>*</span>
//                       </span>
//                     </td>
//                     <td>
//                       <div>
//                         <span className="me-1">Percentage</span>
//                         <Input
//                           type="radio"
//                           disabled={view}
//                           checked={
//                             selections.overDueChagesForAuction === "Percentage"
//                           }
//                           onChange={() =>
//                             handleSelectTypeChange(
//                               "overDueChagesForAuction",
//                               "Percentage"
//                             )
//                           }
//                           name="overDueChagesForAuction"
//                           id="basic-cb-unchecked"
//                           className="me-2"
//                         />
//                         <span className="me-1">Flat</span>
//                         <Input
//                           type="radio"
//                           disabled={view}
//                           checked={
//                             selections.overDueChagesForAuction === "Flat"
//                           }
//                           onChange={() =>
//                             handleSelectTypeChange(
//                               "overDueChagesForAuction",
//                               "Flat"
//                             )
//                           }
//                           name="overDueChagesForAuction"
//                           id="basic-cb-unchecked"
//                           className="me-2"
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       <Input
//                         type="text"
//                         disabled={view}
//                         name="overDueAmountForAuction"
//                         placeholder="Enter Auction Charges"
//                         value={userData.overDueAmountForAuction || ""}
//                         onChange={(e) => {
//                           let AuctionCharge = e.target.value;
//                           AuctionCharge = AuctionCharge.replace(/[^0-9.]/g, "");

//                           setUserData((prev) => ({
//                             ...prev,
//                             overDueAmountForAuction: AuctionCharge,
//                           })); // Fix state update
//                         }}
//                         invalid={!!errors.overDueAmountForAuction}
//                       />
//                       <FormFeedback>
//                         {errors.overDueAmountForAuction}
//                       </FormFeedback>
//                     </td>
//                   </tr>
//                 </tbody>
//               </Table>

//               <Row className="mt-3">
//                 <Col
//                   className="d-flex justify-content-end"
//                   md={{ size: 9, offset: 3 }}
//                 >
//                   <Button
//                     className="me-1"
//                     outline
//                     onClick={resetForm}
//                     color="secondary"
//                     type="reset"
//                   >
//                     Reset
//                   </Button>
//                   <Button color="primary" disabled={loadinng} type="submit">
//                     {!loadinng ? (
//                       uid ? (
//                         "Update"
//                       ) : (
//                         "Submit"
//                       )
//                     ) : (
//                       <>
//                         <span className="me-1">Loading..</span>
//                         <Spinner size="sm" />
//                       </>
//                     )}
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           )}
//         </CardBody>
//       </Card>
//     </>
//   );
// }

// export default ShipDetails;

import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Spinner, UncontrolledAlert } from "reactstrap";
// ** Utils
import useJwt from "@src/auth/jwt/useJwt";
import { Toast } from "primereact/toast";
import { ArrowLeft } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
function ShipDetails() {
  let navigate = useNavigate();
  const toast = useRef(null);

  const location = useLocation(); // Use location hook to get the passed state
  const [loadinng, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [view, setView] = useState(false);
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
  const [Message, setMessage] = useState("");
  const [selections, setSelections] = useState({
    overDueChargesFor7Days: "",
    overDueChargesFor15Days: "",
    overDueChargesFor30Days: "",
    overDueChargesForNotice: "",
    overDueChagesForAuction: "",
  });

  const uid = location.state?.uid || "";

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

  const [errors, setErrors] = useState({});
  const [slipNames, setSlipNames] = useState(["Slip123", "Dock456"]); // Example of existing slip names

  // Handle input changes
  const handleChange = ({ target }) => {
    const { name, value, checked, type } = target;

    // If it's a switch input (Electric or Water), update boolean state

    if (type === "checkbox") {
      console.log(`${name} ${checked}`);
      setUserData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }

    if (userData.electric === false) {
      setUserData((prev) => ({ ...prev, amps: "" }));
    }
  };

  const handleSubmit = async (e, data) => {
    setMessage("");
    e.preventDefault();
    console.log("dataform", data);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const payload = {
          slipName: userData.slipName,
          electric: userData.electric,
          water: userData.water,
          // addOn: userData.addOn ,
          addOn: userData.addOn?.trim() === "" ? null : userData.addOn,
          ...(userData.electric === true && {
            amps: parseFloat(userData.amps),
          }),
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

            if ("height" in unorderedDimensions)
              orderedDimensions.height = unorderedDimensions.height;
            if ("width" in unorderedDimensions)
              orderedDimensions.width = unorderedDimensions.width;
            if ("length" in unorderedDimensions)
              orderedDimensions.length = unorderedDimensions.length;

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

        setLoading(true);

        if (uid) {
          const updateRes = await useJwt.updateslip(uid, payload);

          if (updateRes.status === 200) {
            toast.current.show({
              severity: "success",
              summary: "Updated Successfully",
              detail: "Slip Details updated Successfully.",
              life: 2000,
            });
            setTimeout(() => {
              navigate("/dashboard/slipdetail_list");
            }, 2000);
          }
        } else {
          const createRes = await useJwt.postslip(payload);

          if (createRes.status === 201) {
            toast.current.show({
              severity: "success",
              summary: "Created Successfully",
              detail: " Slip Details created Successfully.",
              life: 2000,
            });
            setTimeout(() => {
              navigate("/dashboard/slipdetail_list");
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);

        const { content } = error.response.data || {};
        const { status } = error.response;

        setMessage((prev) => {
          const newMessage = content || "An unexpected error occurred";
          return prev !== newMessage ? newMessage : prev + " "; // Force update
        });
      } finally {
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
    } else if (NonSpecialChar) {
    } else {
      // If `uid` exists (update mode), exclude current slipName from uniqueness check
      const isDuplicate = slipNames.some(
        (name) => name === userData.slipName && name !== currentSlipName // Ignore current slipName if updating
      );

      if (!uid && isDuplicate) {
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
    //   }else if(userData[dim]>1){
    //     newErrors[dim]="Dimentions Should be greater than 0"
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
      newErrors.addOn =
        "Add-on can only contain letters, periods, and hyphenss";
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
      newErrors.overDueAmountFor7Days = "Please select a Charge type.";
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
      newErrors.overDueAmountFor15Days = "Please select a Charge type.";
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
      newErrors.overDueAmountFor30Days = "Please select Charge type.";
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
      newErrors.overDueAmountForNotice = "Please select a Charge type.";
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
      newErrors.overDueAmountForAuction = "Please select a Charge type.";
    }

    return newErrors;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {};
        const response = await useJwt.getslipCatogory(payload);
        const options = response.data.content.result.map((item) => ({
          value: item.uid,
          label: item.shipTypeName,
          dimensions: item.dimensions,
        }));

        setShipTypeNames(options);
        console.log(options);
      } catch (error) {
        console.error("Error fetching category:", error);
        const { response } = error;
        const { data, status } = response;
      }

      console.log("Category", selectedCategory);
    };
    if (uid) {
      const fetchDetailsForUpdate = async () => {
        try {
          setFetchLoader(true);

          const resp = await useJwt.getslip(uid);
          const details = resp.data.content;

          console.log("details", details.isAssigned);

          if (details?.isAssigned === true) {
            setView(true);
          } else {
            setView(false);
          }

          if (details && details.uid === uid) {
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
      daysradio: "",
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
  };

  const optionsForDays = [
    { value: "Flat", label: "Flat" },
    { value: "Percentage", label: "Percentage" },
  ];

  return (
    <>
      <Card>
        <Toast ref={toast} />

        <CardHeader>
          <CardTitle tag="h4">
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
            {uid ? "Edit Slip Details" : "Add Slip Details"}
          </CardTitle>
        </CardHeader>

        <CardBody>
          <p>
            <strong>Note : </strong> If the slip is <strong>Assigned</strong> ,
            you can only update <strong>Electric </strong> ,
            <strong>Water</strong>, <strong>Add-On</strong> And{" "}
            <strong>AMPS</strong>{" "}
          </p>

          {fetchLoader ? (
            <>
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
            </>
          ) : (
            <Form autoComplete="off" onSubmit={handleSubmit}>
              <Row className="mb-1">
                <Label sm="3" for=""></Label>{" "}
                <Col sm="12">
                  {Message && (
                    <React.Fragment>
                      <UncontrolledAlert color="danger">
                        <div className="alert-body">
                          <span className="text-danger fw-bold">
                            Error - {Message}
                          </span>
                        </div>
                      </UncontrolledAlert>
                    </React.Fragment>
                  )}
                </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="slipName">
                  Slip Name
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm="9">
                  <Input
                    type="text"
                    value={userData.slipName}
                    onChange={(e) => {
                      let slipName = e.target.value;
                      slipName = slipName.replace(/[^A-Za-z0-9 ]/g, ""); // ✅ sirf letters, numbers aur space allowed
                      setUserData((prev) => ({
                        ...prev,
                        slipName: slipName,
                      }));
                    }}
                    name="slipName"
                    id="slipName"
                    placeholder="Enter Slip Name"
                    invalid={!!errors.slipName}
                    disabled={view}
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
                    isDisabled={view}
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
                      name={dim}
                      id={dim}
                      placeholder={`Enter ${dim.toLowerCase()}`}
                      invalid={!!errors[dim]}
                      disabled={view}
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
                      className="me-1"
                      htmlFor="electric"
                      style={{ textAlign: "left" }}
                    >
                      No
                    </Label>

                    <Input
                      type="switch"
                      name="electric"
                      id="electric"
                      checked={userData?.electric}
                      onChange={handleChange}
                      style={{ margin: 0 }}
                    />

                    {/* "Yes" label to the right */}
                    <Label
                      className="ms-1"
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
                      className="me-1"
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
                      checked={userData?.water}
                      onChange={handleChange}
                      style={{ margin: 0 }}
                    />

                    {/* "Yes" label to the right */}
                    <Label
                      className="ms-1"
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
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault(); // Prevent typing anything other than digits
                        }
                      }}
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
                    onKeyPress={(e) => {
                      if (!/[a-zA-Z0-9 ]/.test(e.key)) {
                        e.preventDefault(); // Prevent typing anything other than letters and numbers
                      }
                    }}
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
                    id="marketAnnualPrice"
                    placeholder="Enter Annual Price"
                    disabled={view}
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
                    id="marketMonthlyPrice"
                    placeholder="Enter Monthly Price"
                    disabled={view}
                    invalid={!!errors.marketMonthlyPrice}
                  />
                  <FormFeedback>{errors.marketMonthlyPrice}</FormFeedback>
                </Col>
              </Row>
              {/* 
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
                      disabled={view}
                      checked={
                        selections.overDueChargesFor7Days === "Percentage"
                      }
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
                      className="form-check-label"
                    >
                      Percentage
                    </Label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      type="radio"
                      name="overDueChargesFor7Days"
                      value="Flat"
                      id="Flat"
                      disabled={view}
                      checked={selections.overDueChargesFor7Days === "Flat"}
                      onChange={() =>
                        handleSelectTypeChange("overDueChargesFor7Days", "Flat")
                      }
                      invalid={!!errors.overDueChargesFor7Days}
                    />{" "}
                    <Label
                      for="basic-cb-unchecked"
                      className="form-check-label"
                    >
                      Flat
                    </Label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      type="text"
                      name="overDueAmountFor7Days"
                      disabled={view}
                      value={userData.overDueAmountFor7Days || ""}
                      onChange={(e) => {
                        let sevenDays = e.target.value; // Use "let" instead of "const"
                        sevenDays = sevenDays.replace(/[^0-9.]/g, ""); // Apply replace correctly
                    
                        setUserData((prev) => ({ ...prev, overDueAmountFor7Days: sevenDays })); // Fix state update
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
                      disabled={view}
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
                      className="form-check-label"
                    >
                      Percentage
                    </Label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      type="radio"
                      checked={selections.overDueChargesFor15Days === "Flat"}
                      disabled={view}
                      onChange={() =>
                        handleSelectTypeChange(
                          "overDueChargesFor15Days",
                          "Flat"
                        )
                      }
                      name="overDueChargesFor15Days "
                      id="basic-cb-unchecked"
                    />
                    <Label
                      for="basic-cb-unchecked"
                      className="form-check-label"
                    >
                      Flat
                    </Label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      type="text"
                      disabled={view}
                      name="overDueAmountFor15Days"
                      value={userData.overDueAmountFor15Days || ""}
                      onChange={(e) => {
                        let fiftinDays = e.target.value; 
                        fiftinDays = fiftinDays.replace(/[^0-9.]/g, ""); 
                    
                        setUserData((prev) => ({ ...prev, overDueAmountFor15Days: fiftinDays })); // Fix state update
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
                      disabled={view}
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
                      className="form-check-label"
                    >
                      Percentage
                    </Label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      type="radio"
                      disabled={view}
                      checked={selections.overDueChargesFor30Days === "Flat"}
                      onChange={() =>
                        handleSelectTypeChange(
                          "overDueChargesFor30Days",
                          "Flat"
                        )
                      }
                      name="overDueChargesFor30Days"
                      id="basic-cb-unchecked"
                    />
                    <Label
                      for="basic-cb-unchecked"
                      className="form-check-label"
                    >
                      Flat
                    </Label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      type="text"
                      disabled={view}
                      name="overDueAmountFor30Days"
                      placeholder="Enter 30 Days Charges"
                      value={userData.overDueAmountFor30Days || ""}
                      onChange={(e) =>{
                        let thirty = e.target.value; 
                        thirty = thirty.replace(/[^0-9.]/g, ""); 
                    
                        setUserData((prev) => ({ ...prev, overDueAmountFor30Days: thirty })); // Fix state update
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
                      type="radio"
                      disabled={view}
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
                      className="form-check-label"
                    >
                      Percentage
                    </Label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      type="radio"
                      disabled={view}
                      checked={selections.overDueChargesForNotice === "Flat"}
                      onChange={() =>
                        handleSelectTypeChange(
                          "overDueChargesForNotice",
                          "Flat"
                        )
                      }
                      name="overDueChargesForNotice"
                      id="basic-cb-unchecked"
                    />
                    <Label
                      for="basic-cb-unchecked"
                      className="form-check-label"
                    >
                      Flat
                    </Label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      type="text"
                      disabled={view}
                      name="overDueAmountForNotice"
                      value={userData.overDueAmountForNotice || ""}
                      onChange={(e) =>{
                        let noticeCharge = e.target.value; 
                        noticeCharge = noticeCharge.replace(/[^0-9.]/g, ""); 
                    
                        setUserData((prev) => ({ ...prev, overDueAmountForNotice: noticeCharge })); // Fix state update
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
                      type="radio"
                      disabled={view}
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
                      className="form-check-label"
                    >
                      Percentage
                    </Label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      type="radio"
                      disabled={view}
                      checked={selections.overDueChagesForAuction === "Flat"}
                      onChange={() =>
                        handleSelectTypeChange(
                          "overDueChagesForAuction",
                          "Flat"
                        )
                      }
                      name="overDueChagesForAuction"
                      id="basic-cb-unchecked"
                    />
                    <Label
                      for="basic-cb-unchecked"
                      className="form-check-label"
                    >
                      Flat
                    </Label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Input
                      type="text"
                      disabled={view}
                      name="overDueAmountForAuction"
                      placeholder="Enter Auction Charges"
                      value={userData.overDueAmountForAuction || ""}
                      onChange={(e) =>{
                        let AuctionCharge = e.target.value; 
                        AuctionCharge = AuctionCharge.replace(/[^0-9.]/g, ""); 
                    
                        setUserData((prev) => ({ ...prev, overDueAmountForAuction: AuctionCharge })); // Fix state update
                      }}
                      invalid={!!errors.overDueAmountForAuction}
                    />
                    <FormFeedback>
                      {errors.overDueAmountForAuction}
                    </FormFeedback>
                  </div>

                  <FormFeedback>{errors.overDueAmountForAuction}</FormFeedback>
                </Col>
              </Row> */}

              <Table responsive className="mt-2">
                <thead>
                  <tr>
                    <th>Charges</th>
                    <th>Charges Type</th>

                    <th>Charges Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="align-middle fw-bold">
                        7 Days Charges
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="me-1">Percentage</span>
                        <Input
                          type="radio"
                          name="overDueChargesFor7Days"
                          value="Percentage"
                          id="Percentage"
                          disabled={view}
                          checked={
                            selections.overDueChargesFor7Days === "Percentage"
                          }
                          onChange={() =>
                            handleSelectTypeChange(
                              "overDueChargesFor7Days",
                              "Percentage"
                            )
                          }
                          invalid={!!errors.overDueChargesFor7Days}
                          className="me-2"
                        />
                        <span className="me-1">Flat</span>
                        <Input
                          type="radio"
                          className="me-2"
                          name="overDueChargesFor7Days"
                          value="Flat"
                          id="Flat"
                          disabled={view}
                          checked={selections.overDueChargesFor7Days === "Flat"}
                          onChange={() =>
                            handleSelectTypeChange(
                              "overDueChargesFor7Days",
                              "Flat"
                            )
                          }
                          invalid={!!errors.overDueChargesFor7Days}
                        />
                      </div>
                    </td>

                    <td>
                      <Input
                        type="text"
                        name="overDueAmountFor7Days"
                        disabled={view}
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
                      <FormFeedback>
                        {errors.overDueAmountFor7Days}
                      </FormFeedback>{" "}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="align-middle fw-bold">
                        15 Days Charges <span style={{ color: "red" }}>*</span>
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="me-1">Percentage</span>
                        <Input
                          type="radio"
                          disabled={view}
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
                          className="me-2"
                        />
                        <span className="me-1">Flat</span>
                        <Input
                          type="radio"
                          checked={
                            selections.overDueChargesFor15Days === "Flat"
                          }
                          disabled={view}
                          onChange={() =>
                            handleSelectTypeChange(
                              "overDueChargesFor15Days",
                              "Flat"
                            )
                          }
                          name="overDueChargesFor15Days "
                          id="basic-cb-unchecked"
                          className="me-2"
                        />
                      </div>
                    </td>
                    <td>
                      <Input
                        type="text"
                        disabled={view}
                        name="overDueAmountFor15Days"
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
                      <FormFeedback>
                        {errors.overDueAmountFor15Days}
                      </FormFeedback>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="align-middle fw-bold">
                        30 Days Charges <span style={{ color: "red" }}>*</span>
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="me-1">Percentage</span>
                        <Input
                          type="radio"
                          disabled={view}
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
                          className="me-2"
                        />
                        <span className="me-1">Flat</span>
                        <Input
                          type="radio"
                          disabled={view}
                          checked={
                            selections.overDueChargesFor30Days === "Flat"
                          }
                          onChange={() =>
                            handleSelectTypeChange(
                              "overDueChargesFor30Days",
                              "Flat"
                            )
                          }
                          name="overDueChargesFor30Days"
                          id="basic-cb-unchecked"
                          className="me-2"
                        />
                      </div>
                    </td>
                    <td>
                      <Input
                        type="text"
                        disabled={view}
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
                      <FormFeedback>
                        {errors.overDueAmountFor30Days}
                      </FormFeedback>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="align-middle fw-bold">
                        Notice Charges <span style={{ color: "red" }}>*</span>
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="me-1">Percentage</span>
                        <Input
                          type="radio"
                          disabled={view}
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
                          className="me-2"
                        />
                        <span className="me-1">Flat</span>
                        <Input
                          type="radio"
                          disabled={view}
                          checked={
                            selections.overDueChargesForNotice === "Flat"
                          }
                          onChange={() =>
                            handleSelectTypeChange(
                              "overDueChargesForNotice",
                              "Flat"
                            )
                          }
                          name="overDueChargesForNotice"
                          id="basic-cb-unchecked"
                          className="me-2"
                        />
                      </div>
                    </td>
                    <td>
                      <Input
                        type="text"
                        disabled={view}
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
                      <FormFeedback>
                        {errors.overDueAmountForNotice}
                      </FormFeedback>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="align-middle fw-bold">
                        Auction Charges <span style={{ color: "red" }}>*</span>
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="me-1">Percentage</span>
                        <Input
                          type="radio"
                          disabled={view}
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
                          className="me-2"
                        />
                        <span className="me-1">Flat</span>
                        <Input
                          type="radio"
                          disabled={view}
                          checked={
                            selections.overDueChagesForAuction === "Flat"
                          }
                          onChange={() =>
                            handleSelectTypeChange(
                              "overDueChagesForAuction",
                              "Flat"
                            )
                          }
                          name="overDueChagesForAuction"
                          id="basic-cb-unchecked"
                          className="me-2"
                        />
                      </div>
                    </td>
                    <td>
                      <Input
                        type="text"
                        disabled={view}
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
                      <FormFeedback>
                        {errors.overDueAmountForAuction}
                      </FormFeedback>
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Row className="mt-3">
                <Col
                  className="d-flex justify-content-end"
                  md={{ size: 9, offset: 3 }}
                >
                  <Button
                    className="me-1"
                    outline
                    onClick={resetForm}
                    color="secondary"
                    type="reset"
                  >
                    Reset
                  </Button>
                  <Button color="primary" disabled={loadinng} type="submit">
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
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default ShipDetails;
