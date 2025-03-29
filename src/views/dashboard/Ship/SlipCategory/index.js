// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardBody,
//   Form,
//   Row,
//   Col,
//   Label,
//   Input,
//   Button,
//   Badge,
//   Spinner,
// } from "reactstrap";
// import { UncontrolledAlert } from "reactstrap";

// import useJwt from "@src/auth/jwt/useJwt";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { useLocation } from "react-router-dom";

// const MySwal = withReactContent(Swal);
// function Index() {
//   let navigate = useNavigate();
//   let { uid } = useParams();
//   const location = useLocation();
//   const [loading, setLoading] = useState(false);
//   const [fetchLoader, setFetchLoader] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validatefield = (name, value) => {
//     let errorMsz = "";

//     switch (name) {
//       case "shipTypeName":
//         if (!value.trim()) {
//           errorMsz = "Category is required";
//         } else if (!/^[A-Za-z\s]+$/.test(value)) {
//           errorMsz = "Category should contain only alphabets";
//         }
//         break;

//         case "dimensions":
//           if (value.length === 0) {
//             errorMsz = "Please select at least one dimension";
//           }
//           break;
//       default:
//     }
//   };

//   const [selected, setSelected] = useState({
//     shipTypeName: "",
//     dimensions: new Set(),
//   });

//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     if (uid) {
//       const fetchSlipCategory = async () => {
//         try {
//           setFetchLoader(true);
//           const { data } = await useJwt.getslipCatogory(uid);
//           const { result } = data.content;
//           console.log(result, "result");

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

//   const handleChange = ({ target }) => {
//     const { name, value } = target;
//     setSelected((prev) => ({ ...prev, [name]: value }));

//         // Allow only valid characters while typing

//     let sanitizedValue = value;
//     if (shipTypeName === "shipTypeName") {
//       sanitizedValue = value.replace(/[^A-Za-z\s]/g, ""); {

//     }

//   };}

//   const handleCheckBox = ({ target }) => {
//     const { checked, name } = target;
//     setSelected((prevData) => {
//       const newDimensions = new Set(prevData.dimensions);
//       if (checked) {
//         newDimensions.add(name);
//       } else {
//         newDimensions.delete(name);
//       }
//       return {
//         ...prevData,
//         dimensions: newDimensions,
//       };
//     });

//     // Allow only valid characters while typing

//   };

//   const preventSpecialChars = (e, allowedPattern) => {
//     const specialKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

//     if (!allowedPattern.test(e.key) && !specialKeys.includes(e.key)) {
//       e.preventDefault();
//     }
//   };

//   const validateForm = () => {
//     let newErrors = {};

//     if (formData.options.length === 0) {
//       newErrors.options = "Please select at least one option.";
//     }

//     if (!formData.agree) {
//       newErrors.agree = "You must agree to continue.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // If no errors, return true
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     if (validate()) {
//       const payload = {
//         shipTypeName: selected.shipTypeName,
//         dimensions: Array.from(selected.dimensions),
//       };

//       try {
//         setLoading(true);

//         if (uid) {
//           await useJwt.updateslipCatogory(uid, payload);
//           MySwal.fire({
//             title: "Successfully Updated",
//             text: "Your Category Updated Successfully",
//             icon: "success",
//             customClass: { confirmButton: "btn btn-primary" },
//             buttonsStyling: false,
//           }).then(() => navigate("/slip_Management/sliplist"));
//         } else {
//           await useJwt.postslipCatogory(payload);
//           MySwal.fire({
//             title: "Created Successfully",
//             text: "Your Category Created Successfully",
//             icon: "success",
//             customClass: { confirmButton: "btn btn-primary" },
//             buttonsStyling: false,
//           }).then(() => navigate("/slip_Management/sliplist"));
//         }
//       } catch (error) {
//         console.error("API Error:", error);
//         setLoading(false);

//         setErrorMessage((prev) => {
//           const { response } = error;
//           const newError =
//             response?.data?.content || "Failed to submit the form";
//           return prev !== newError ? newError : prev + " "; // Force state change
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const resetForm = () => {
//     setSelected({
//       shipTypeName: "",
//       dimensions: new Set(),
//     });
//     setError({
//       shipTypeName: false,
//       dimensions: false,
//     });
//     setErrorMessage("");
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle tag="h4">
//           {uid ? "Edit Slip Category" : "Add Slip Category"}
//         </CardTitle>
//       </CardHeader>
//       {fetchLoader ? (
//         <>
//           <div
//             className="mb-2"
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               marginTop: "4rem",
//             }}
//           >
//             <Spinner
//               color="primary"
//               style={{
//                 height: "5rem",
//                 width: "5rem",
//               }}
//             />
//           </div>
//         </>
//       ) : (
//         <>
//           <CardBody>
            // <Row className="mb-1">
            //   <Label sm="3" for="shipTypeName"></Label>
            //   <Col sm="12">
            //     {errorMessage && (
            //       <React.Fragment>
            //         <UncontrolledAlert color="danger">
            //           <div className="alert-body">
            //             <span className="text-danger fw-bold">
            //               {errorMessage}
            //             </span>
            //           </div>
            //         </UncontrolledAlert>
            //       </React.Fragment>
            //     )}
            //   </Col>
            // </Row>

//             <Form onSubmit={handleSubmit}>
//               <Row className="mb-1">
//                 <Label sm="3" for="shipTypeName">
//                   Category
//                 </Label>
//                 <Col sm="9">
//                   <Input
//                     type="text"
//                     value={selected.shipTypeName}
//                     onChange={handleChange}
//                     name="shipTypeName"
//                     id="shipTypeName"
//                     placeholder="Enter Category"
//                     onKeyDown={(e) => preventSpecialChars(e, /^[A-Za-z0-9\s]$/)}
//                     />
//                   {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
//                 </Col>
//               </Row>
//               <Row className="mb-1">
//                 <Label sm="3" className="form-check-label">
//                   Dimensions
//                 </Label>
//                 <Col sm="9">
//                   {["height", "width", "length"].map((dim) => (
//                     <div className="form-check form-check-inline" key={dim}>
//                       <Input
//                         type="checkbox"
//                         id={`cb-${dim.toLowerCase()}`}
//                         name={dim}
//                         onChange={handleCheckBox}
//                         checked={selected.dimensions.has(dim)}
//                       />
//                       <Label for={`cb-${dim.toLowerCase()}`}>{dim}</Label>
//                     </div>
//                   ))}
//             {errors.dimensions && <p style={{ color: "red" }}>{errors.dimensions}</p>}

//                 </Col>
//               </Row>

//               <Row>
//                 <Col className="d-flex" md={{ size: 9, offset: 3 }}>
//                   <Button
//                     outline
//                     color="secondary"
//                     type="reset"
//                     onClick={resetForm}
//                   >
//                     Reset
//                   </Button>

//                   <Button
//                     className="mx-1"
//                     disabled={loading}
//                     color="primary"
//                     type="submit"
//                   >
//                     {!loading ? (
//                       uid ? (
//                         "Update"
//                       ) : (
//                         "Submit"
//                       )
//                     ) : (
//                       <Spinner size="sm" />
//                     )}
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           </CardBody>
//         </>
//       )}
//     </Card>
//   );
// }

// export default Index;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Form,
  Row,
  Col,
  Label,
  Input,
  Button,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Index() {
  let navigate = useNavigate();
  let { uid } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [selected, setSelected] = useState({
    shipTypeName: "",
    dimensions: new Set(),
  });

  useEffect(() => {
    if (uid) {
      const fetchSlipCategory = async () => {
        try {
          setFetchLoader(true);
          const { data } = await useJwt.getslipCatogory(uid);
          const { result } = data.content;

          if (result.length) {
            const details = result.find((d) => d.uid === uid);
            setSelected({
              shipTypeName: details.shipTypeName || "",
              dimensions: new Set(details.dimensions || []),
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setFetchLoader(false);
        }
      };

      fetchSlipCategory();
    }
  }, [uid]);

  // Function to validate input fields
  const validateField = (name, value) => {
    let errorMsz = "";

    switch (name) {
      case "shipTypeName":
        if (!value.trim()) {
          errorMsz = "Category is required";
        } else if (!/^[A-Za-z0-9\s]+$/.test(value)) {
          errorMsz = "Category should contain only letters and numbers";
        }
        break;

      case "dimensions":
        if (selected.dimensions.size === 0) {
          errorMsz = "Please select at least one dimension";
        }
        break;

      default:
    }

    return errorMsz;
  };

  // Handle input changes
  const handleChange = ({ target }) => {
    const { name, value } = target;
    let sanitizedValue = value.replace(/[^A-Za-z0-9\s]/g, "");

    setSelected((prev) => ({ ...prev, [name]: sanitizedValue }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, sanitizedValue),
    }));
  };

  // Handle checkbox selection
  const handleCheckBox = ({ target }) => {
    const { checked, name } = target;

    setSelected((prevData) => {
      const newDimensions = new Set(prevData.dimensions);
      if (checked) {
        newDimensions.add(name);
      } else {
        newDimensions.delete(name);
      }

      // Ensure validation is updated properly
      setErrors((prev) => ({
        ...prev,
        dimensions:
          newDimensions.size === 0
            ? "Please select at least one dimension"
            : "",
      }));

      return { ...prevData, dimensions: newDimensions };
    });
  };

  // Validate entire form
  const validateForm = () => {
    let newErrors = {};

    newErrors.shipTypeName = validateField(
      "shipTypeName",
      selected.shipTypeName
    );
    newErrors.dimensions =
      selected.dimensions.size === 0
        ? "Please select at least one dimension"
        : "";

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (validateForm()) {
      const payload = {
        shipTypeName: selected.shipTypeName,
        dimensions: Array.from(selected.dimensions),
      };

      try {
        setLoading(true);

        if (uid) {
          await useJwt.updateslipCatogory(uid, payload);
          MySwal.fire({
            title: "Successfully Updated",
            text: "Your Category was updated successfully",
            icon: "success",
          }).then(() => navigate("/slip_Management/sliplist"));
        } else {
          await useJwt.postslipCatogory(payload);
          MySwal.fire({
            title: "Created Successfully",
            text: "Your Category was created successfully",
            icon: "success",
          }).then(() => navigate("/slip_Management/sliplist"));
        }
      } catch (error) {
        console.error("API Error:", error);
        setLoading(false);
        setErrorMessage(
          error?.response?.data?.content || "Failed to submit the form"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset the form
  const resetForm = () => {
    setSelected({
      shipTypeName: "",
      dimensions: new Set(),
    });
    setErrors({});
    setErrorMessage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">
          {uid ? "Edit Slip Category" : "Add Slip Category"}
        </CardTitle>
      </CardHeader>
      {fetchLoader ? (
        <div className="text-center my-5">
          <Spinner color="primary" style={{ width: "5rem", height: "5rem" }} />
        </div>
      ) : (
        <CardBody>
            <Row className="mb-1">
              <Label sm="3" for=""></Label>
              <Col sm="12">
                {errorMessage && (
                  <React.Fragment>
                    <UncontrolledAlert color="danger">
                      <div className="alert-body">
                        <span className="text-danger fw-bold">
                          {errorMessage}
                        </span>
                      </div>
                    </UncontrolledAlert>
                  </React.Fragment>
                )}
              </Col>
            </Row>
         

          <Form onSubmit={handleSubmit}>
            {/* Category Input */}
            <Row className="mb-1">
              <Label sm="3" for="shipTypeName">
                Category
              </Label>
              <Col sm="9">
                <Input
                  type="text"
                  value={selected.shipTypeName}
                  onChange={handleChange}
                  name="shipTypeName"
                  id="shipTypeName"
                  placeholder="Enter Category"
                />
                {errors.shipTypeName && (
                  <p style={{ color: "red" }}>{errors.shipTypeName}</p>
                )}
              </Col>
            </Row>

            {/* Checkbox Options */}
            <Row className="mb-1">
              <Label sm="3">Dimensions</Label>
              <Col sm="9">
                {["height", "width", "length"].map((dim) => (
                  <div className="form-check form-check-inline" key={dim}>
                    <Input
                      type="checkbox"
                      id={`cb-${dim}`}
                      name={dim}
                      onChange={handleCheckBox}
                      checked={selected.dimensions.has(dim)}
                    />
                    <Label for={`cb-${dim}`}>{dim}</Label>
                  </div>
                ))}
                {errors.dimensions && (
                  <p style={{ color: "red" }}>{errors.dimensions}</p>
                )}
              </Col>
            </Row>

            {/* Buttons */}
            <Row>
              <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                <Button
                  outline
                  color="secondary"
                  type="button"
                  onClick={resetForm}
                >
                  Reset
                </Button>
                <Button
                  className="mx-1"
                  // disabled={loading}
                  color="primary"
                  type="submit"
                >
                  {loading ? <>Loading... <Spinner size="sm" /></> : uid ? "Update" : "Submit"}
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
