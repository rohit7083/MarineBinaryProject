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
// import { Badge } from "reactstrap";

// import toast from "react-hot-toast";

// import useJwt from "@src/auth/jwt/useJwt";

// function Index() {
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
//       } catch (error) {
//         console.log(error);
//         const { response } = error;
//         const { data, status } = response;
//         if (status == 400) {
//           alert(data.content);
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
//         <Form onSubmit={handleSubmit}>
//           <Row className="mb-1">
//             <Label sm="3" for="cat"></Label>
//             <Col sm="9">
//               <Badge color="light-danger">error</Badge>

//               {/* {error.shipTypeName && <Badge color="light-danger">error</Badge>} */}
//             </Col>
//           </Row>

//           {/* Category Input */}
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
//             <Label
//               sm="3"
//               for="exampleCustomSwitch"
//               className="form-check-label"
//             >
//               Height/Width/Length
//             </Label>
//             <Col sm="9">
//               <div className="form-check form-check-inline">
//                 <Input
//                   type="checkbox"
//                   id="cb-height"
//                   name="h"
//                   onChange={handleCheckBox}
//                   checked={selected.dimensions["h"] !== undefined}
//                 />
//                 <Label for="cb-height" className="form-check-label">
//                   Height
//                 </Label>
//               </div>
//               <div className="form-check form-check-inline">
//                 <Input
//                   type="checkbox"
//                   id="cb-width"
//                   name="w"
//                   onChange={handleCheckBox}
//                   checked={selected.dimensions["w"] !== undefined}
//                 />
//                 <Label for="cb-width" className="form-check-label">
//                   Width
//                 </Label>
//               </div>
//               <div className="form-check form-check-inline">
//                 <Input
//                   type="checkbox"
//                   id="cb-length"
//                   name="l"
//                   onChange={handleCheckBox}
//                   checked={selected.dimensions["l"] !== undefined}
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

//           {/* Error message */}
//           {errorMessage && <div className="text-danger">{errorMessage}</div>}

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
import {
  Button,
  Col,
  Input,
  Label,
  Row,
  Form,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "reactstrap";
import { Badge } from 'reactstrap'

import toast from 'react-hot-toast'

import useJwt from '@src/auth/jwt/useJwt'

function Index() {
  const [error, setError] = useState({
    shipTypeName: false,
    dimensions: false,
  });

  const [selected, setSelected] = useState({
    shipTypeName: "", // Tracks selected category
    dimensions: {}, // Tracks selected dimensions (h, w, l)
  });

  const [errorMessage, setErrorMessage] = useState(""); // For displaying API error messages

  // Handles changes to input fields (like category)
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setSelected((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckBox = ({ target }) => {
    const { checked, name } = target;
    setSelected((prevData) => {
      const newDimensions = { ...prevData.dimensions };
      if (checked) {
        newDimensions[name] = name;
      } else {
        delete newDimensions[name];
      }
      return {
        ...prevData,
        dimensions: newDimensions,
      };
    });
  };

  // Form validation function
  const validate = () => {
    let isValid = true;
    const errorState = { ...error };

    // Validate if category is provided
    if (!selected.shipTypeName) {
      errorState.shipTypeName = true;
      isValid = false;
    } else {
      errorState.shipTypeName = false;
    }

    // Validate if at least one dimension is selected
    if (Object.keys(selected.dimensions).length === 0) {
      errorState.dimensions = true;
      isValid = false;
    } else {
      errorState.dimensions = false;
    }

    setError(errorState);
    return isValid;
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        shipTypeName: selected.shipTypeName,
        dimensions: Object.values(selected.dimensions).filter(Boolean),
      };

      try {
        await useJwt.postslipCatogory(payload);
        alert("Form Submited");
      } catch (error) {
        console.log(error);
        const { response } = error;
        const { data, status } = response;
        if (status === 400) {
          setErrorMessage(data.content); // Set API error message
        }
      }
    }
  };

  const resetForm = () => {
    setSelected({
      shipTypeName: "",
      dimensions: {},
    });
    setError({
      shipTypeName: false,
      dimensions: false,
    });
    setErrorMessage(""); // Clear error message on reset
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Slip Category</CardTitle>
      </CardHeader>

      <CardBody>
        {/* Display API error message above the form */}
        {errorMessage && (
          <Row className="mb-1">
            <Col sm="12">
              <Badge color='light-danger'>{errorMessage}</Badge>
            </Col>
          </Row>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Category Input */}
          <Row className="mb-1">
            <Label sm="3" for="cat"></Label>
            <Col sm="9">
              {error.shipTypeName && (
                <Badge color='light-danger'>Category is required</Badge>
              )}
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="cat">
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

          {/* Dimension Input (Height, Width, Length) */}
          <Row className="mb-1">
            <Label sm="3" for="exampleCustomSwitch" className="form-check-label">
              Height/Width/Length
            </Label>
            <Col sm="9">
              <div className="form-check form-check-inline">
                <Input
                  type="checkbox"
                  id="cb-height"
                  name="h"
                  onChange={handleCheckBox}
                  checked={selected.dimensions["h"] !== undefined}
                />
                <Label for="cb-height" className="form-check-label">
                  Height
                </Label>
              </div>
              <div className="form-check form-check-inline">
                <Input
                  type="checkbox"
                  id="cb-width"
                  name="w"
                  onChange={handleCheckBox}
                  checked={selected.dimensions["w"] !== undefined}
                />
                <Label for="cb-width" className="form-check-label">
                  Width
                </Label>
              </div>
              <div className="form-check form-check-inline">
                <Input
                  type="checkbox"
                  id="cb-length"
                  name="l"
                  onChange={handleCheckBox}
                  checked={selected.dimensions["l"] !== undefined}
                />
                <Label for="cb-length" className="form-check-label">
                  Length
                </Label>
              </div>
              {error.dimensions && (
                <div className="text-danger">
                  Please select at least one dimension
                </div>
              )}
            </Col>
          </Row>

          {/* Submit Button */}
          <Row>
            <Col className="d-flex" md={{ size: 9, offset: 3 }}>
              <Button className="me-1" color="primary" type="submit">
                Submit
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
