
import React, { Fragment ,useRef} from "react";
import { useForm, Controller } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect,useState  } from "react";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Label,
  Input,
  Button,
  FormGroup,
  Spinner,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";
import { ArrowLeft } from "react-feather";

function AddVTypes() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const navigate = useNavigate();
    const location = useLocation();
    const rowData = location.state?.row;
    const uid = rowData?.uid;
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (uid) {
      reset({
        typeName: rowData.typeName || "",
        description: rowData.description || "",
      });
    }
  }, []);


   const onSubmit = async (data) => {
      
  
      try {
        setLoading(true);
        if (uid) {
      const res = await useJwt.updateVendor(uid,data);
          console.log("Updated:", res);
          {{ }}
          if (res.status === 200) {
            toast.current.show({
              severity: "success",
              summary: "Updated Successfully",
              detail: "Vendor Type  updated Successfully.",
              life: 2000,
            });
            setTimeout(() => {
              navigate("/pos/vendor_typeList");
            }, 2000);
          }
        } else {
      const res = await useJwt.VendorType(data);
          if (res.status === 201) {
            toast.current.show({
              severity: "success",
              summary: "Created Successfully",
              detail: "Vendor Type  created Successfully.",
              life: 2000,
            });
            setTimeout(() => {
              navigate("/pos/vendor_typeList");
            }, 2000);
          }
          console.log("Created:", res);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };



  return (
    <Fragment>
                <Toast ref={toast} />
      
      <Card>
        <CardBody>
          <CardTitle>
            <CardText>
                <ArrowLeft
                                         style={{
                                           cursor: "pointer",
                                         marginRight:"10px",
                                           transition: "color 0.1s",
                                         }}
                                         onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
                                         onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
                                         onClick={() => window.history.back()}
                                       />
              {uid ? "Update": "Create "}
               Vendor Types</CardText>
          </CardTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="12" className="mb-1">
                <Label for="typeName">Vendor Type</Label>

                <Controller
                  name="typeName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event Type is required" }}
                  render={({ field }) => (
                    <Input
                      id="typeName"
                      type="text"
                      placeholder="Enter Vendor type"
                      invalid={!!errors.typeName}
                      {...field}
                    />
                  )}
                />

                {errors.typeName && (
                  <p style={{ color: "red" }}>{errors.typeName.message}</p>
                )}
              </Col>
              <Col sm="12">
                <Label for="description">Vendor Type Description</Label>

                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event Type Description is required" }}
                  render={({ field }) => (
                    <Input
                      id="description"
                      type="textarea"
                      rows="4"
                      placeholder="Enter Vendor type description"
                      invalid={!!errors.description}
                      {...field}
                    />
                  )}
                />

                {errors.description && (
                  <p style={{ color: "red" }}>
                    {errors.description.message}
                  </p>
                )}
              </Col>
            </FormGroup>

           <Button type="submit" disabled={loading} color="primary">
                        {loading ? (
                          <>
                            <span>Loading.. </span>
                            <Spinner size="sm" />{" "}
                          </>
                        ) : (
                          "Submit"
                        )}
                      </Button>
          </form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default AddVTypes;


