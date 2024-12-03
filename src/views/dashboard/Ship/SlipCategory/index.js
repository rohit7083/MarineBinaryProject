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
