// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Col,
//   Input,
//   Label,
//   Row,
//   Form,
//   Card,
//   CardHeader,
//   CardTitle,
//   CardBody,
// } from "reactstrap";
// import { Badge } from 'reactstrap'

// import toast from 'react-hot-toast'

// import useJwt from '@src/auth/jwt/useJwt'
// import { useNavigate } from "react-router-dom";

// function Index() {

//   let navigate = useNavigate();

//   const [error, setError] = useState({
//     shipTypeName: false,
//     dimensions: false,
//   });

//   const [selected, setSelected] = useState({
//     shipTypeName: "", // Tracks selected category
//     dimensions: {}, // Tracks selected dimensions (h, w, l)
//   });

//   const [errorMessage, setErrorMessage] = useState(""); // For displaying API error messages

//   // Handles changes to input fields (like category)
//   const handleChange = ({ target }) => {
//     const { name, value } = target;
//     setSelected((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCheckBox = ({ target }) => {
//     const { checked, name } = target;
//     setSelected((prevData) => {
//       const newDimensions = { ...prevData.dimensions };
//       if (checked) {
//         newDimensions[name] = name;
//       } else {
//         delete newDimensions[name];
//       }
//       return {
//         ...prevData,
//         dimensions: newDimensions,
//       };
//     });
//   };

//   // Form validation function
//   const validate = () => {
//     let isValid = true;
//     const errorState = { ...error };

//     // Validate if category is provided
//     if (!selected.shipTypeName) {
//       errorState.shipTypeName = true;
//       isValid = false;
//     } else {
//       errorState.shipTypeName = false;
//     }

//     // Validate if at least one dimension is selected
//     if (Object.keys(selected.dimensions).length === 0) {
//       errorState.dimensions = true;
//       isValid = false;
//     } else {
//       errorState.dimensions = false;
//     }

//     setError(errorState);
//     return isValid;
//   };

//   // Submit form data
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validate()) {
//       const payload = {
//         shipTypeName: selected.shipTypeName,
//         dimensions: Object.values(selected.dimensions).filter(Boolean),
//       };

//       try {
//         await useJwt.postslipCatogory(payload);
//         alert("Form Submited");
//         navigate("/dashboard/SlipList");
//       } catch (error) {
//         console.log(error);
//         const { response } = error;
//         const { data, status } = response;
//         if (status === 400) {
//           setErrorMessage(data.content); // Set API error message
//         }
//       }
//     }
//   };

//   const resetForm = () => {
//     setSelected({
//       shipTypeName: "",
//       dimensions: {},
//     });
//     setError({
//       shipTypeName: false,
//       dimensions: false,
//     });
//     setErrorMessage(""); // Clear error message on reset
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle tag="h4">Slip Category</CardTitle>
//       </CardHeader>

//       <CardBody>
//         {/* Display API error message above the form */}
//         {errorMessage && (
//           <Row className="mb-1">
//             <Col sm="12">
//               <Badge color='light-danger'>{errorMessage}</Badge>
//             </Col>
//           </Row>
//         )}

//         <Form onSubmit={handleSubmit}>
//           {/* Category Input */}
//           <Row className="mb-1">
//             <Label sm="3" for="cat"></Label>
//             <Col sm="9">
//               {error.shipTypeName && (
//                 <Badge color='light-danger'>Category is required</Badge>
//               )}
//             </Col>
//           </Row>

//           <Row className="mb-1">
//             <Label sm="3" for="cat">
//               Category
//             </Label>
//             <Col sm="9">
//               <Input
//                 type="text"
//                 value={selected.shipTypeName}
//                 onChange={handleChange}
//                 name="shipTypeName"
//                 id="shipTypeName"
//                 placeholder="Enter Category"
//               />
//               {error.shipTypeName && (
//                 <div className="text-danger">Category is required</div>
//               )}
//             </Col>
//           </Row>

//           {/* Dimension Input (Height, Width, Length) */}
//           <Row className="mb-1">
//             <Label sm="3" for="exampleCustomSwitch" className="form-check-label">
//               Height/Width/Length
//             </Label>
//             <Col sm="9">
//               <div className="form-check form-check-inline">
//                 <Input
//                   type="checkbox"
//                   id="cb-height"
//                   name="Height"
//                   onChange={handleCheckBox}
//                   checked={selected.dimensions["Height"] !== undefined}
//                 />
//                 <Label for="cb-height" className="form-check-label">
//                   Height
//                 </Label>
//               </div>
//               <div className="form-check form-check-inline">
//                 <Input
//                   type="checkbox"
//                   id="cb-width"
//                   name="Width"
//                   onChange={handleCheckBox}
//                   checked={selected.dimensions["Width"] !== undefined}
//                 />
//                 <Label for="cb-width" className="form-check-label">
//                   Width
//                 </Label>
//               </div>
//               <div className="form-check form-check-inline">
//                 <Input
//                   type="checkbox"
//                   id="cb-length"
//                   name="Length"
//                   onChange={handleCheckBox}
//                   checked={selected.dimensions["Length"] !== undefined}
//                 />
//                 <Label for="cb-length" className="form-check-label">
//                   Length
//                 </Label>
//               </div>
//               {error.dimensions && (
//                 <div className="text-danger">
//                   Please select at least one dimension
//                 </div>
//               )}
//             </Col>
//           </Row>

//           {/* Submit Button */}
//           <Row>
//             <Col className="d-flex" md={{ size: 9, offset: 3 }}>
//               <Button className="me-1" color="primary" type="submit">
//                 Submit
//               </Button>
//               <Button
//                 outline
//                 color="secondary"
//                 type="reset"
//                 onClick={resetForm}
//               >
//                 Reset
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </CardBody>
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
  Badge,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";
// Assuming you are using toast for notifications
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
function Index() {
  let navigate = useNavigate();
  let { uid } = useParams(); // Fetch `uid` from the route params

  const [error, setError] = useState({
    shipTypeName: false,
    dimensions: false,
  });

  const [selected, setSelected] = useState({
    shipTypeName: "",
    dimensions: new Set(),
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Fetch existing data when editing
  useEffect(() => {
    if (uid) {
      const fetchSlipCategory = async () => {
        try {
          const { data } = await useJwt.getslipCatogory(uid);
          setSelected({
            shipTypeName: data.shipTypeName || "",
            dimensions: new Set(data.dimensions || []), // Assuming dimensions is an array
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          alert.error("Failed to fetch data");
        }
      };

      fetchSlipCategory();
    }
  }, [uid]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setSelected((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckBox = ({ target }) => {
    const { checked, name } = target;
    setSelected((prevData) => {
      const newDimensions = new Set(prevData.dimensions);
      if (checked) {
        newDimensions.add(name);
      } else {
        newDimensions.delete(name);
      }
      return {
        ...prevData,
        dimensions: newDimensions,
      };
    });
  };

  const validate = () => {
    let isValid = true;
    const errorState = { ...error };

    if (!selected.shipTypeName) {
      errorState.shipTypeName = true;
      isValid = false;
    } else {
      errorState.shipTypeName = false;
    }

    if (selected.dimensions.size === 0) {
      errorState.dimensions = true;
      isValid = false;
    } else {
      errorState.dimensions = false;
    }

    setError(errorState);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        shipTypeName: selected.shipTypeName,
        dimensions: Array.from(selected.dimensions), // Convert Set back to array
      };

      try {
        if (uid) {
          // Update existing entry
          await useJwt.updateslipCatogory(uid, payload);
          return MySwal.fire({
            title: "Successfully Updated",
            text: " Your Category Updated Successfully",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          });
        } else {
          await useJwt.postslipCatogory(payload);
          try {
            MySwal.fire({
              title: "Created Successfully",
              text: "Your Category Created Successfully",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary",
              },
              buttonsStyling: false,
            }).then(() => {
              // Navigate after Swal closes
              navigate("/dashboard/SlipList");
            });
          } catch (error) {
            console.error("Error creating category:", error);
            // Handle the error if needed, e.g., show an error Swal
          }
        }
      } catch (error) {
        console.error(error);
        const { response } = error;
        const { data, status } = response || {};
        if (status === 400) {
          setErrorMessage(data?.content || "Failed to submit the form");
        }
      }
    }
  };

  const resetForm = () => {
    setSelected({
      shipTypeName: "",
      dimensions: new Set(),
    });
    setError({
      shipTypeName: false,
      dimensions: false,
    });
    setErrorMessage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">
          {uid ? "Edit Slip Category" : "Add Slip Category"}
        </CardTitle>
      </CardHeader>
      <CardBody>
        {errorMessage && (
          <Row className="mb-1">
            <Col sm="12">
              <Badge color="light-danger">{errorMessage}</Badge>
            </Col>
          </Row>
        )}

        <Form onSubmit={handleSubmit}>
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
              {error.shipTypeName && (
                <div className="text-danger">Category is required</div>
              )}
            </Col>
          </Row>
          <Row className="mb-1">
            <Label sm="3" className="form-check-label">
              Height/Width/Length
            </Label>
            <Col sm="9">
              {["Height", "Width", "Length"].map((dim) => (
                <div className="form-check form-check-inline" key={dim}>
                  <Input
                    type="checkbox"
                    id={`cb-${dim.toLowerCase()}`}
                    name={dim}
                    onChange={handleCheckBox}
                    checked={selected.dimensions.has(dim)}
                  />
                  <Label for={`cb-${dim.toLowerCase()}`}>{dim}</Label>
                </div>
              ))}
              {error.dimensions && (
                <div className="text-danger">
                  Please select at least one dimension
                </div>
              )}
            </Col>
          </Row>

          <Row>
            <Col className="d-flex" md={{ size: 9, offset: 3 }}>
              <Button className="me-1" color="primary" type="submit">
                {uid ? "Update" : "Submit"}
              </Button>
              <Button
                outline
                color="secondary"
                type="reset"
                onClick={resetForm}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
}

export default Index;
