import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";

import useJwt from "@src/auth/jwt/useJwt";
import { ArrowLeft } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";

function AddVTypes() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const [plist, setPlist] = useState([]);
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

  useEffect(() => {
    const fetchParentvendorTypes = async () => {
      try {
        const fetchList = await useJwt.Parentvendor();
        const list = fetchList?.data?.content?.result?.map((x) => ({
          label: x.typeName,
          value: x.uid,
        }));

        console.log(list);

        setPlist(list);
      } catch (error) {
        console.log(error);
      }
    };

    fetchParentvendorTypes();
  }, []);

  const onSubmit = async (data) => {
    // {{debugger}}

    const { ptypeName, ...reset } = data;
    const payload = {
      parent: {
        uid: data?.ptypeName?.value,
      },
      ...reset,
    };
    try {
      setLoading(true);
      if (uid) {
        const res = await useJwt.updateVendor(uid, payload);
        console.log("Updated:", res);

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
        const res = await useJwt.VendorType(payload);
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
                  marginRight: "10px",
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
                onClick={() => window.history.back()}
              />
              {uid ? "Update" : "Create "}
              Vendor Types
            </CardText>
          </CardTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="12" className="mb-1">
                <Label for="ptypeName">Parent Vendor Type</Label>
                <Controller
                  name="ptypeName"
                  control={control}
                  defaultValue=""
                  // rules={{ required/: "Event Type is required" }}
                  render={({ field }) => (
                    <div>
                      <Select
                        {...field}
                        options={plist}
                        isClearable
                        className={`react-select ${
                          errors.eventType ? "is-invalid" : ""
                        }`}
                        classNamePrefix="select"
                        inputRef={field.ref}
                        onChange={(selected) => field.onChange(selected)}
                      />

                      {errors.ptypeName && (
                        <p style={{ color: "red" }}>
                          {errors.ptypeName.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </Col>

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
                      onChange={(e) => {
                        // Allow only letters and spaces
                        const onlyLettersAndSpaces = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        field.onChange(onlyLettersAndSpaces);
                      }}
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
                  // rules={{ required: "Event Type Description is required" }}
                  render={({ field }) => (
                    <Input
                      id="description"
                      type="textarea"
                      rows="4"
                      placeholder="Enter Vendor type description"
                      invalid={!!errors.description}
                      {...field}
                      onChange={(e) => {
                        // Allow letters, numbers, dot, space, dash, and comma
                        const onlyValid = e.target.value.replace(
                          /[^A-Za-z0-9 .,-]/g,
                          ""
                        );
                        field.onChange(onlyValid);
                      }}
                    />
                  )}
                />

                {errors.description && (
                  <p style={{ color: "red" }}>{errors.description.message}</p>
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
