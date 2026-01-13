// import "primeicons/primeicons.css";
// import "primereact/resources/primereact.min.css";
// import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
// import { Toast } from "primereact/toast";
// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Bounce, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import useJwt from "@src/auth/jwt/useJwt";
// import { ArrowLeft } from "react-feather";
// import { useLocation } from "react-router-dom";
// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   CardTitle,
//   Col,
//   Form,
//   FormFeedback,
//   Input,
//   Label,
//   Row,
//   Spinner,
//   Table,
//   UncontrolledAlert,
// } from "reactstrap";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// const MySwal = withReactContent(Swal);

// function Index() {
//   let navigate = useNavigate();

//   const toast = useRef(null);

//   const [loading, setLoading] = useState(false);
//   const [fetchLoader, setFetchLoader] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");
//   const [coverdFlag, setCoverdflag] = useState(false);
//   const [selected, setSelected] = useState({
//     shipTypeName: "",
//     dimensions: new Set(),
//   });
//   const [selections, setSelections] = useState({
//     overDueChargesFor7Days: "",
//     overDueAmountFor7Days: "",

//     overDueChargesFor15Days: "",
//     overDueAmountFor15Days: "",

//     overDueChargesFor30Days: "",
//     overDueAmountFor30Days: "",

//     overDueChargesForNotice: "",
//     overDueAmountForNotice: "",

//     overDueChagesForAuction: "",
//     overDueAmountForAuction: "",
//   });

//   const location = useLocation();
//   const uid = location.state?.uid || "";
//    ("uid", uid);

//   useEffect(() => {
//     if (uid) {
//       const fetchSlipCategory = async () => {
//         try {
//           setFetchLoader(true);
//           const { data } = await useJwt.getslipCatogory(uid);
//           const { result } = data.content;

//           if (result.length) {
//             const details = result.find((d) => d.uid === uid);
//             setSelected({
//               shipTypeName: details.shipTypeName || "",
//               dimensions: new Set(details.dimensions || []),
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         } finally {
//           setFetchLoader(false);
//         }
//       };

//       fetchSlipCategory();
//     }
//   }, [uid]);

//   const validateField = (name, value) => {
//     let errorMsz = "";

//     switch (name) {
//       case "shipTypeName":
//         if (!value.trim()) {
//           errorMsz = "Category is required";
//         } else if (!/^[A-Za-z0-9\s]+$/.test(value)) {
//           errorMsz = "Category should contain only letters and numbers";
//         }
//         break;

//       case "dimensions":
//         if (selected.dimensions.size === 0) {
//           errorMsz = "Please select at least one dimension";
//         }
//         break;

//       default:
//     }

//     return errorMsz;
//   };

//   // Handle input changes
//   const handleChange = ({ target }) => {
//     const { name, value } = target;
//     let sanitizedValue = value.replace(/[^A-Za-z0-9\s]/g, "");

//     setSelected((prev) => ({ ...prev, [name]: sanitizedValue }));
//     setErrors((prev) => ({
//       ...prev,
//       [name]: validateField(name, sanitizedValue),
//     }));

//     if (sanitizedValue.toLowerCase() === "covered") {
//       setCoverdflag(true);
//     }
//   };

//   // Handle checkbox selection
//   const handleCheckBox = ({ target }) => {
//     const { checked, name } = target;

//     setSelected((prevData) => {
//       const newDimensions = new Set(prevData.dimensions);
//       if (checked) {
//         newDimensions.add(name);
//       } else {
//         newDimensions.delete(name);
//       }

//       // Ensure validation is updated properly
//       setErrors((prev) => ({
//         ...prev,
//         dimensions:
//           newDimensions.size === 0
//             ? "Please select at least one dimension"
//             : "",
//       }));

//       return { ...prevData, dimensions: newDimensions };
//     });
//   };

//   // Validate entire form
//   const validateForm = () => {
//     let newErrors = {};

//     newErrors.shipTypeName = validateField(
//       "shipTypeName",
//       selected.shipTypeName
//     );
//     newErrors.dimensions =
//       selected.dimensions.size === 0
//         ? "Please select at least one dimension"
//         : "";

//     setErrors(newErrors);
//     return !Object.values(newErrors).some((error) => error);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     if (validateForm()) {
//       const payload = {
//         shipTypeName: selected.shipTypeName,
//         dimensions: Array.from(selected.dimensions),
//       };

//       try {
//         setLoading(true);

//         if (uid) {
//           const updateRes = await useJwt.updateslipCatogory(uid, payload);

//           // toast.success(" Slip Category Updated Successful!", {
//           //   onClose: () => {
//           //     navigate("/slip_Management/sliplist");
//           //   },
//           // });

//           if (updateRes.status === 200) {
//             toast.current.show({
//               severity: "success",
//               summary: "Updated Successfully",
//               detail: "Slip Category updated Successfully.",
//               life: 2000,
//             });
//             setTimeout(() => {
//               navigate("/slip_Management/sliplist");
//             }, 2000);
//           }
//         } else {
//           // {{ }}
//           const res = await useJwt.postslipCatogory(payload);
//           if (res.status === 201) {
//             // toast.success(" Slip Category Created Successful!", {
//             //   onClose: () => {
//             //     navigate("/slip_Management/sliplist");
//             //   },
//             // });

//             toast.current.show({
//               severity: "success",
//               summary: "Created Successfully",
//               detail: " Slip Category created Successfully.",
//               life: 2000,
//             });
//             setTimeout(() => {
//               navigate("/slip_Management/sliplist");
//             }, 2000);
//           }
//         }
//       } catch (error) {
//         console.error("API Error:", error);
//         setLoading(false);
//         setErrorMessage(error?.response?.data?.content);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // Reset the form
//   const resetForm = () => {
//     setSelected({
//       shipTypeName: "",
//       dimensions: new Set(),
//     });
//     setErrors({});
//     setErrorMessage("");
//   };

//   const handleSelectTypeChange = (name, value) => {
//     setSelections((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   return (
//     <Card>
//       <ToastContainer
//         position="top-center"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick={false}
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//         transition={Bounce}
//       />
//       <Toast ref={toast} />

//       <CardHeader>
//         <CardTitle tag="h4">
//           <ArrowLeft
//             style={{
//               cursor: "pointer",
//               marginRight: "10px",
//               transition: "color 0.1s",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
//             onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
//             onClick={() => window.history.back()}
//           />{" "}
//           {uid ? "Edit Slip Category" : "Add Slip Category"}
//         </CardTitle>
//       </CardHeader>
//       {fetchLoader ? (
//         <div className="text-center my-5">
//           <Spinner color="primary" style={{ width: "5rem", height: "5rem" }} />
//         </div>
//       ) : (
//         <CardBody>
//           <Row className="mb-1">
//             <Label sm="3" for=""></Label>
//             <Col sm="12">
//               {errorMessage && (
//                 <React.Fragment>
//                   <UncontrolledAlert color="danger">
//                     <div className="alert-body">
//                       <span className="text-danger fw-bold">
//                         <strong>Error : </strong> {errorMessage}
//                       </span>
//                     </div>
//                   </UncontrolledAlert>
//                 </React.Fragment>
//               )}
//             </Col>
//           </Row>

//           <Form onSubmit={handleSubmit}>
//             {/* Category Input */}
//             <Row className="mb-1">
//               <Label sm="3" for="shipTypeName">
//                 Category
//               </Label>
//               <Col sm="9">
//                 <Input
//                   type="text"
//                   value={selected.shipTypeName}
//                   onChange={handleChange}
//                   name="shipTypeName"
//                   id="shipTypeName"
//                   placeholder="Enter Category"
//                 />
//                 {errors.shipTypeName && (
//                   <p style={{ color: "red" }}>{errors.shipTypeName}</p>
//                 )}
//               </Col>
//             </Row>

//             {/* Checkbox Options */}
//             <Row className="mb-1">
//               <Label sm="3">Dimensions</Label>
//               <Col sm="9">
//                 {["height", "width", "length", "power"].map((dim) => (
//                   <div className="form-check form-check-inline" key={dim}>
//                     <Input
//                       type="checkbox"
//                       id={`cb-${dim}`}
//                       name={dim}
//                       onChange={handleCheckBox}
//                       checked={selected.dimensions.has(dim)}
//                       disabled={coverdFlag && dim === "height"}
//                     />
//                     <Label for={`cb-${dim}`}>{dim}</Label>
//                   </div>
//                 ))}
//                 {errors.dimensions && (
//                   <p style={{ color: "red" }}>{errors.dimensions}</p>
//                 )}
//               </Col>
//             </Row>

//             <Table responsive className="mt-0 mb-2">
//               <thead>
//                 <tr>
//                   <th>Charges</th>
//                   <th>Charges Type</th>
//                   <th>Charges Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>
//                     <span className="align-middle fw-bold">
//                       7 Days Charges
//                       <span style={{ color: "red" }}>*</span>
//                     </span>
//                   </td>
//                   <td>
//                     <div>
//                       <span className="me-1">Percentage</span>
//                       <Input
//                         type="radio"
//                         name="overDueChargesFor7Days"
//                         value="Percentage"
//                         id="Percentage"
//                         // disabled={view}
//                         checked={
//                           selections.overDueChargesFor7Days === "Percentage"
//                         }
//                         onChange={() =>
//                           handleSelectTypeChange(
//                             "overDueChargesFor7Days",
//                             "Percentage"
//                           )
//                         }
//                         invalid={!!errors.overDueChargesFor7Days}
//                         className="me-2"
//                       />
//                       <span className="me-1">Flat</span>
//                       <Input
//                         type="radio"
//                         className="me-2"
//                         name="overDueChargesFor7Days"
//                         value="Flat"
//                         id="Flat"
//                         // disabled={view}
//                         checked={selections.overDueChargesFor7Days === "Flat"}
//                         onChange={() =>
//                           handleSelectTypeChange(
//                             "overDueChargesFor7Days",
//                             "Flat"
//                           )
//                         }
//                         invalid={!!errors.overDueChargesFor7Days}
//                       />
//                     </div>
//                   </td>

//                   <td>
//                     <Input
//                       type="text"
//                       name="overDueAmountFor7Days"
//                       value={selections.overDueAmountFor7Days}
//                       onChange={(e) => {
//                         const val = e.target.value.replace(/[^0-9.]/g, "");
//                         setSelections((prev) => ({
//                           ...prev,
//                           overDueAmountFor7Days: val,
//                         }));
//                       }}
//                     />
//                     <FormFeedback>{errors.overDueAmountFor7Days}</FormFeedback>{" "}
//                   </td>
//                 </tr>

//                 <tr>
//                   <td>
//                     <span className="align-middle fw-bold">
//                       15 Days Charges <span style={{ color: "red" }}>*</span>
//                     </span>
//                   </td>
//                   <td>
//                     <div>
//                       <span className="me-1">Percentage</span>
//                       <Input
//                         type="radio"
//                         // disabled={view}
//                         checked={
//                           selections.overDueChargesFor15Days === "Percentage"
//                         }
//                         onChange={() =>
//                           handleSelectTypeChange(
//                             "overDueChargesFor15Days",
//                             "Percentage"
//                           )
//                         }
//                         name="overDueChargesFor15Days"
//                         id="basic-cb-unchecked"
//                         className="me-2"
//                       />
//                       <span className="me-1">Flat</span>
//                       <Input
//                         type="radio"
//                         checked={selections.overDueChargesFor15Days === "Flat"}
//                         // disabled={view}
//                         onChange={() =>
//                           handleSelectTypeChange(
//                             "overDueChargesFor15Days",
//                             "Flat"
//                           )
//                         }
//                         name="overDueChargesFor15Days "
//                         id="basic-cb-unchecked"
//                         className="me-2"
//                       />
//                     </div>
//                   </td>
//                   <td>
//                     <Input
//                       type="text"
//                       // disabled={view}
//                       name="overDueAmountFor15Days"
//                       // value={userData.overDueAmountFor15Days || ""}
//                       onChange={(e) => {
//                         let fiftinDays = e.target.value;
//                         fiftinDays = fiftinDays.replace(/[^0-9.]/g, "");

//                         // setUserData((prev) => ({
//                         //   ...prev,
//                         //   overDueAmountFor15Days: fiftinDays,
//                         // })); // Fix state update
//                       }}
//                       placeholder="Enter 15 Days Charges"
//                       invalid={!!errors.overDueAmountFor15Days}
//                     />
//                     <FormFeedback>{errors.overDueAmountFor15Days}</FormFeedback>
//                   </td>
//                 </tr>

//                 <tr>
//                   <td>
//                     <span className="align-middle fw-bold">
//                       30 Days Charges <span style={{ color: "red" }}>*</span>
//                     </span>
//                   </td>
//                   <td>
//                     <div>
//                       <span className="me-1">Percentage</span>
//                       <Input
//                         type="radio"
//                         // disabled={view}
//                         checked={
//                           selections.overDueChargesFor30Days === "Percentage"
//                         }
//                         onChange={() =>
//                           handleSelectTypeChange(
//                             "overDueChargesFor30Days",
//                             "Percentage"
//                           )
//                         }
//                         name="overDueChargesFor30Days"
//                         id="basic-cb-unchecked"
//                         className="me-2"
//                       />
//                       <span className="me-1">Flat</span>
//                       <Input
//                         type="radio"
//                         // disabled={view}
//                         checked={selections.overDueChargesFor30Days === "Flat"}
//                         onChange={() =>
//                           handleSelectTypeChange(
//                             "overDueChargesFor30Days",
//                             "Flat"
//                           )
//                         }
//                         name="overDueChargesFor30Days"
//                         id="basic-cb-unchecked"
//                         className="me-2"
//                       />
//                     </div>
//                   </td>
//                   <td>
//                     <Input
//                       type="text"
//                       // disabled={view}
//                       name="overDueAmountFor30Days"
//                       placeholder="Enter 30 Days Charges"
//                       // value={userData.overDueAmountFor30Days || ""}
//                       onChange={(e) => {
//                         let thirty = e.target.value;
//                         thirty = thirty.replace(/[^0-9.]/g, "");

//                         // setUserData((prev) => ({
//                         //   ...prev,
//                         //   overDueAmountFor30Days: thirty,
//                         // })); // Fix state update
//                       }}
//                       invalid={!!errors.overDueAmountFor30Days}
//                     />
//                     <FormFeedback>{errors.overDueAmountFor30Days}</FormFeedback>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <span className="align-middle fw-bold">
//                       Notice Charges <span style={{ color: "red" }}>*</span>
//                     </span>
//                   </td>
//                   <td>
//                     <div>
//                       <span className="me-1">Percentage</span>
//                       <Input
//                         type="radio"
//                         // disabled={view}
//                         checked={
//                           selections.overDueChargesForNotice === "Percentage"
//                         }
//                         onChange={() =>
//                           handleSelectTypeChange(
//                             "overDueChargesForNotice",
//                             "Percentage"
//                           )
//                         }
//                         name="overDueChargesForNotice"
//                         id="basic-cb-unchecked"
//                         className="me-2"
//                       />
//                       <span className="me-1">Flat</span>
//                       <Input
//                         type="radio"
//                         // disabled={view}
//                         checked={selections.overDueChargesForNotice === "Flat"}
//                         onChange={() =>
//                           handleSelectTypeChange(
//                             "overDueChargesForNotice",
//                             "Flat"
//                           )
//                         }
//                         name="overDueChargesForNotice"
//                         id="basic-cb-unchecked"
//                         className="me-2"
//                       />
//                     </div>
//                   </td>
//                   <td>
//                     <Input
//                       type="text"
//                       // disabled={view}
//                       name="overDueAmountForNotice"
//                       // value={userData.overDueAmountForNotice || ""}
//                       onChange={(e) => {
//                         let noticeCharge = e.target.value;
//                         noticeCharge = noticeCharge.replace(/[^0-9.]/g, "");

//                         // setUserData((prev) => ({
//                         //   ...prev,
//                         //   overDueAmountForNotice: noticeCharge,
//                         // })); // Fix state update
//                       }}
//                       placeholder="Enter Notice Charges"
//                       invalid={!!errors.overDueAmountForNotice}
//                     />
//                     <FormFeedback>{errors.overDueAmountForNotice}</FormFeedback>
//                   </td>
//                 </tr>

//                 <tr>
//                   <td>
//                     <span className="align-middle fw-bold">
//                       Auction Charges <span style={{ color: "red" }}>*</span>
//                     </span>
//                   </td>
//                   <td>
//                     <div>
//                       <span className="me-1">Percentage</span>
//                       <Input
//                         type="radio"
//                         // disabled={view}
//                         checked={
//                           selections.overDueChagesForAuction === "Percentage"
//                         }
//                         onChange={() =>
//                           handleSelectTypeChange(
//                             "overDueChagesForAuction",
//                             "Percentage"
//                           )
//                         }
//                         name="overDueChagesForAuction"
//                         id="basic-cb-unchecked"
//                         className="me-2"
//                       />
//                       <span className="me-1">Flat</span>
//                       <Input
//                         type="radio"
//                         // disabled={view}
//                         checked={selections.overDueChagesForAuction === "Flat"}
//                         onChange={() =>
//                           handleSelectTypeChange(
//                             "overDueChagesForAuction",
//                             "Flat"
//                           )
//                         }
//                         name="overDueChagesForAuction"
//                         id="basic-cb-unchecked"
//                         className="me-2"
//                       />
//                     </div>
//                   </td>
//                   <td>
//                     <Input
//                       type="text"
//                       // disabled={view}
//                       name="overDueAmountForAuction"
//                       placeholder="Enter Auction Charges"
//                       // value={userData.overDueAmountForAuction || ""}
//                       onChange={(e) => {
//                         let AuctionCharge = e.target.value;
//                         AuctionCharge = AuctionCharge.replace(/[^0-9.]/g, "");

//                         // setUserData((prev) => ({
//                         //   ...prev,
//                         //   overDueAmountForAuction: AuctionCharge,
//                         // })); // Fix state update
//                       }}
//                       invalid={!!errors.overDueAmountForAuction}
//                     />
//                     <FormFeedback>
//                       {errors.overDueAmountForAuction}
//                     </FormFeedback>
//                   </td>
//                 </tr>
//               </tbody>
//             </Table>

//             <Row>
//               <Col
//                 className="d-flex justify-content-end"
//                 md={{ size: 9, offset: 3 }}
//               >
//                 {" "}
//                 <Button
//                   outline
//                   color="secondary"
//                   type="button"
//                   onClick={resetForm}
//                 >
//                   Reset
//                 </Button>
//                 <Button
//                   className="mx-1"
//                   disabled={loading}
//                   color="primary"
//                   type="submit"
//                 >
//                   {loading ? (
//                     <>
//                       Loading... <Spinner size="sm" />
//                     </>
//                   ) : uid ? (
//                     "Update"
//                   ) : (
//                     "Submit"
//                   )}
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </CardBody>
//       )}
//     </Card>
//   );
// }

// export default Index;

import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    Input,
    Label,
    Row,
    Spinner,
    Table,
    UncontrolledAlert,
} from "reactstrap";

import { Controller, useForm } from "react-hook-form";

function Index() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const location = useLocation();
  const uid = location.state?.uid || "";

  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      shipTypeName: "",
      dimensions: [],
      overDueChargesFor7Days: "",
      overDueAmountFor7Days: "",
      overDueChargesFor15Days: "",
      overDueAmountFor15Days: "",
      overDueChargesFor30Days: "",
      overDueAmountFor30Days: "",
      overDueChargesForNotice: "",
      overDueAmountForNotice: "",
      overDueChargesForAuction: "",
      overDueAmountForAuction: "",
    },
  });

  const watchShipType = watch("shipTypeName");

  // ─────────────────────────────────────────────
  // LOAD DATA INTO HOOK FORM
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return;

    const loadData = async () => {
      try {
        setFetching(true);
        const { data } = await useJwt.getslipCatogory(uid);
        const details = data.content.result.find((d) => d.uid === uid);

        if (!details) return;

        reset({
          shipTypeName: details.shipTypeName || "",
          dimensions: details.dimensions || [],

          overDueChargesFor7Days: details.overDueChargesFor7Days || "",
          overDueAmountFor7Days:
            details.overDueAmountFor7Days?.toString() || "",

          overDueChargesFor15Days: details.overDueChargesFor15Days || "",
          overDueAmountFor15Days:
            details.overDueAmountFor15Days?.toString() || "",

          overDueChargesFor30Days: details.overDueChargesFor30Days || "",
          overDueAmountFor30Days:
            details.overDueAmountFor30Days?.toString() || "",

          overDueChargesForNotice: details.overDueChargesForNotice || "",
          overDueAmountForNotice:
            details.overDueAmountForNotice?.toString() || "",

          overDueChargesForAuction: details.overDueChargesForAuction || "",
          overDueAmountForAuction:
            details.overDueAmountForAuction?.toString() || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, [uid]);

  // ─────────────────────────────────────────────
  // SUBMIT HANDLER
  // ─────────────────────────────────────────────
  const onSubmit = async (form) => {
    setErrorMessage("");
    const payload = {
      ...form,
      dimensions: form.dimensions,
      overDueAmountFor7Days: Number(form.overDueAmountFor7Days),
      overDueAmountFor15Days: Number(form.overDueAmountFor15Days),
      overDueAmountFor30Days: Number(form.overDueAmountFor30Days),
      overDueAmountForNotice: Number(form.overDueAmountForNotice),
      overDueAmountForAuction: Number(form.overDueAmountForAuction),
    };

    try {
      let res;
      if (uid) {
        res = await useJwt.updateslipCatogory(uid, payload);
      } else {
        res = await useJwt.postslipCatogory(payload);
      }

      toast.current.show({
        severity: "success",
        summary: uid ? "Updated Successfully" : "Created Successfully",
        detail: "Slip Category saved.",
        life: 2000,
      });

      setTimeout(() => navigate("/slip_Management/sliplist"), 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.response?.data?.content || "Unexpected Error");
    }
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  const dims = ["height", "width", "length", "power"];

  return (
    <Card>
      <ToastContainer transition={Bounce} theme="colored" />
      <Toast ref={toast} />

      <CardHeader>
        <CardTitle tag="h4">
          <ArrowLeft
            style={{ cursor: "pointer", marginRight: 10 }}
            onClick={() => window.history.back()}
          />
          {uid ? "Edit Slip Category" : "Add Slip Category"}
        </CardTitle>
      </CardHeader>

      {fetching ? (
        <div className="text-center my-5">
          <Spinner color="primary" style={{ width: "5rem", height: "5rem" }} />
        </div>
      ) : (
        <CardBody>
          {errorMessage && (
            <UncontrolledAlert color="danger">
              <div className="alert-body">
                <span className="text-danger fw-bold">
                  Error - {errorMessage}
                </span>
              </div>
            </UncontrolledAlert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* CATEGORY INPUT */}
            <Row className="mb-1">
              <Label sm="3">Category</Label>
              <Col sm="9">
                <Controller
                  name="shipTypeName"
                  control={control}
                  rules={{
                    required: "Category is required",
                    pattern: {
                      value: /^[A-Za-z0-9\s]+$/,
                      message: "Only letters and numbers allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter Category" />
                  )}
                />
                {errors.shipTypeName && (
                  <p className="text-danger">{errors.shipTypeName.message}</p>
                )}
              </Col>
            </Row>

            {/* DIMENSIONS CHECKBOXES */}
            <Row className="mb-1">
              <Label sm="3">Dimensions</Label>
              <Col sm="9">
                <Controller
                  name="dimensions"
                  control={control}
                  rules={{ required: "Select at least one dimension" }}
                  render={({ field }) => (
                    <>
                      {dims.map((dim) => (
                        <div className="form-check form-check-inline" key={dim}>
                          <Input
                            type="checkbox"
                            checked={field.value.includes(dim)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, dim]
                                : field.value.filter((v) => v !== dim);

                              field.onChange(newValue);
                            }}
                          />
                          <Label className="ms-1">{dim}</Label>
                        </div>
                      ))}
                    </>
                  )}
                />

                {errors.dimensions && (
                  <p className="text-danger">{errors.dimensions.message}</p>
                )}
              </Col>
            </Row>

            {/* CHARGES TABLE */}
            <Table responsive>
              <thead>
                <tr>
                  <th>Charges</th>
                  <th>Type</th>
                  <th>Value</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["7Days", "7 Days Charges"],
                  ["15Days", "15 Days Charges"],
                  ["30Days", "30 Days Charges"],
                  ["Notice", "Notice Charges"],
                  ["Auction", "Auction Charges"],
                ].map(([key, label]) => (
                  <tr key={key}>
                    <td className="fw-bold">
                      {label} <span className="text-danger">*</span>
                    </td>

                    {/* TYPE RADIO */}
                    <td>
                      <Controller
                        name={`overDueChargesFor${key}`}
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <>
                            <Input
                              type="radio"
                              checked={field.value === "Percentage"}
                              onChange={() => field.onChange("Percentage")}
                            />
                            <span className="ms-1 me-2">Percentage</span>

                            <Input
                              type="radio"
                              checked={field.value === "Flat"}
                              onChange={() => field.onChange("Flat")}
                            />
                            <span className="ms-1">Flat</span>
                          </>
                        )}
                      />
                      {errors[`overDueChargesFor${key}`] && (
                        <p className="text-danger">
                          {errors[`overDueChargesFor${key}`].message}
                        </p>
                      )}
                    </td>

                    {/* VALUE INPUT */}
                    <td>
                      <Controller
                        name={`overDueAmountFor${key}`}
                        control={control}
                        rules={{
                          required: "Amount required",
                          validate: (v) =>
                            !isNaN(Number(v)) || "Must be a number",
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.replace(/[^0-9.]/g, "")
                              )
                            }
                            placeholder={`Enter ${label}`}
                          />
                        )}
                      />
                      {errors[`overDueAmountFor${key}`] && (
                        <p className="text-danger">
                          {errors[`overDueAmountFor${key}`].message}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* BUTTONS */}
            <Row>
              <Col
                className="d-flex justify-content-end"
                md={{ size: 9, offset: 3 }}
              >
                <Button
                  outline
                  type="button"
                  color="secondary"
                  onClick={() => reset()}
                >
                  Reset
                </Button>

                <Button
                  color="primary"
                  type="submit"
                  className="ms-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner size="sm" />
                  ) : uid ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      )}
    </Card>
  );
}

export default Index;
