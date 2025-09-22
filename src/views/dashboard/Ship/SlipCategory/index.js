import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useJwt from "@src/auth/jwt/useJwt";
import { ArrowLeft } from "react-feather";
import { useLocation } from "react-router-dom";
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
  UncontrolledAlert,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

function Index() {
  let navigate = useNavigate();

  const toast = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [coverdFlag, setCoverdflag] = useState(false);
  const [selected, setSelected] = useState({
    shipTypeName: "",
    dimensions: new Set(),
  });

  const location = useLocation();
  const uid = location.state?.uid || "";
  console.log("uid", uid);

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

    if (sanitizedValue.toLowerCase() === "covered") {
      setCoverdflag(true);
    }
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
          const updateRes = await useJwt.updateslipCatogory(uid, payload);

          // toast.success(" Slip Category Updated Successful!", {
          //   onClose: () => {
          //     navigate("/slip_Management/sliplist");
          //   },
          // });

          if (updateRes.status === 200) {
            toast.current.show({
              severity: "success",
              summary: "Updated Successfully",
              detail: "Slip Category updated Successfully.",
              life: 2000,
            });
            setTimeout(() => {
              navigate("/slip_Management/sliplist");
            }, 2000);
          }
        } else {
          // {{ }}
          const res = await useJwt.postslipCatogory(payload);
          if (res.status === 201) {
            // toast.success(" Slip Category Created Successful!", {
            //   onClose: () => {
            //     navigate("/slip_Management/sliplist");
            //   },
            // });

            toast.current.show({
              severity: "success",
              summary: "Created Successfully",
              detail: " Slip Category created Successfully.",
              life: 2000,
            });
            setTimeout(() => {
              navigate("/slip_Management/sliplist");
            }, 2000);
          }
        }
      } catch (error) {
        console.error("API Error:", error);
        setLoading(false);
        setErrorMessage(error?.response?.data?.content);
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
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
                        <strong>Error : </strong> {errorMessage}
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
                {["height", "width", "length", "power"].map((dim) => (
                  <div className="form-check form-check-inline" key={dim}>
                    <Input
                      type="checkbox"
                      id={`cb-${dim}`}
                      name={dim}
                      onChange={handleCheckBox}
                      checked={selected.dimensions.has(dim)}
                      disabled={coverdFlag && dim === "height"}
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
                  disabled={loading}
                  color="primary"
                  type="submit"
                >
                  {loading ? (
                    <>
                      Loading... <Spinner size="sm" />
                    </>
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
