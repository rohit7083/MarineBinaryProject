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
  Spinner,
} from "reactstrap";
import { UncontrolledAlert } from "reactstrap";

import useJwt from "@src/auth/jwt/useJwt";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useLocation } from "react-router-dom";

const MySwal = withReactContent(Swal);
function Index() {
  let navigate = useNavigate();
  let { uid } = useParams();
  const location = useLocation();
const [loading,setLoading]=useState(false);
  const [error, setError] = useState({
    shipTypeName: false,
    dimensions: false,
  });

  const [selected, setSelected] = useState({
    shipTypeName: "",
    dimensions: new Set(),
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (uid) {
      const fetchSlipCategory = async () => {
        try {
          const { data } = await useJwt.getslipCatogory(uid);
          const { result } = data.content;
          console.log(result, "result");

          if (result.length) {
            const details = result.find((d) => d.uid === uid);
            setSelected({
              shipTypeName: details.shipTypeName || "",
              dimensions: new Set(details.dimensions || []),
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
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

  // const handleSubmit = async (e) => {
  //   setErrorMessage(""); // Reset error message before submitting

  //   e.preventDefault();
  //   if (validate()) {
  //     const payload = {
  //       shipTypeName: selected.shipTypeName,
  //       dimensions: Array.from(selected.dimensions),
  //     };
  //     console.log(payload);

  //     try {
  //       if (uid) {
  //         setLoading(true);
  //         await useJwt.updateslipCatogory(uid, payload);
  //         return MySwal.fire({
  //           title: "Successfully Updated",
  //           text: " Your Category Updated Successfully",
  //           icon: "success",
  //           customClass: {
  //             confirmButton: "btn btn-primary",
  //           },
  //           buttonsStyling: false,
  //         }).then(() => {
  //           navigate("/dashboard/SlipList");
  //         });

  //       } else {
  //         try {
  //           setLoading(true);
  //           await useJwt.postslipCatogory(payload);
  //           setLoading(false);
  //           MySwal.fire({
  //             title: "Created Successfully",
  //             text: "Your Category Created Successfully",
  //             icon: "success",
  //             customClass: {
  //               confirmButton: "btn btn-primary",
  //             },
  //             buttonsStyling: false,
  //           }).then(() => {
  //             navigate("/dashboard/SlipList");
  //           });
  //         } catch (error) {
  //           console.error("Error creating category:", error);
  //           setErrorMessage((prev) => {
  //             const { response } = error;
  //             const newError = response?.data?.content || "Failed to submit the form";
  //             return prev !== newError ? newError : prev + " "; // Force state change
  //           });
  //         }
  //         finally{
  //           setLoading(false);
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       const { response } = error;
  //       const { data, status } = response || {};
  //       if (status === 400) {
  //         setErrorMessage(data?.content || "Failed to submit the form");
  //         setErrorMessage("");
  //       }
  //     }
  //   }
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before submitting
  
    if (validate()) {
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
            text: "Your Category Updated Successfully",
            icon: "success",
            customClass: { confirmButton: "btn btn-primary" },
            buttonsStyling: false,
          }).then(() => navigate("/dashboard/SlipList"));
        } else {
          await useJwt.postslipCatogory(payload);
          MySwal.fire({
            title: "Created Successfully",
            text: "Your Category Created Successfully",
            icon: "success",
            customClass: { confirmButton: "btn btn-primary" },
            buttonsStyling: false,
          }).then(() => navigate("/dashboard/SlipList"));
        }
      } catch (error) {
        console.error("API Error:", error);
        setLoading(false);
  
        // Ensure state updates by using function form
        setErrorMessage((prev) => {
          const { response } = error;
          const newError = response?.data?.content || "Failed to submit the form";
          return prev !== newError ? newError : prev + " "; // Force state change
        });
      } finally {
        setLoading(false);
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
        <Row className="mb-1">
          <Label sm="3" for="shipTypeName"></Label>
          <Col sm="12">
            {errorMessage && (
              <React.Fragment>
                <UncontrolledAlert color="danger">
                  <div className="alert-body">
                    <span className="text-danger fw-bold">{errorMessage}</span>
                  </div>
                </UncontrolledAlert>
              </React.Fragment>
            )}
          </Col>
        </Row>

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
              Dimensions
            </Label>
            <Col sm="9">
              {["height", "width", "length"].map((dim) => (
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
              <Button className="me-1" disabled={loading} color="primary" type="submit">
             {!loading ?  
             (uid ? "Update" : "Submit")
                :<Spinner size="sm" />}
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
