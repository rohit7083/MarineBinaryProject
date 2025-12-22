import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Trash2 } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";

import Select from "react-select";
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
  Spinner,
  Table,
  UncontrolledAlert,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import addProductIcon from "../../../../assets/icons/shopping-bag-add.svg";

import useJwt from "@src/auth/jwt/useJwt";
import { useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import NavItems from "../NavItems";

const MultipleColumnForm = () => {
  // ** State
  const [parentCategory, setParentCategory] = useState([]);

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const [err, setErr] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState({
    ANP: false,
    importProduct: false,
    addProductCate: false,
    addProducttaxes: false,
    addStock: false,
    stockManage: false,
  });
  const toggleTooltip = (tooltip) => {
    setTooltipOpen((prevState) => ({
      ...prevState,
      [tooltip]: !prevState[tooltip],
    }));
  };

  const addField = (e) => {
    e.preventDefault(); // Prevents page refresh
    // setData([...data, { id: Date.now() }]); // Unique id for key
  };

  const removeField = (id) => {
    // setData(data.filter((item) => item.id !== id));
  };

  const MySwal = withReactContent(Swal);
  const [loadinng, setLoading] = useState(false);
  const location = useLocation();
  const fetchData = location.state || "";
  const toast = useRef(null);

  useEffect(() => {
    if (fetchData?.uid) {
      reset({
        ...fetchData?.row,
        parentUid: {
          label: fetchData?.row?.parentUid?.name,
          value: fetchData?.row?.parentUid?.uid,
        },
      });
    }
  }, [reset, fetchData]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributeKeys",
  });

  const onSubmit = async (data) => {
    setErr("");
    const formData = new FormData();
    {{debugger}}
      const selectedUserStr = localStorage.getItem("selectedBranch");
    const selectedBranch = JSON.parse(selectedUserStr);
    let branchUid = selectedBranch.uid;

        formData.append("branch.uid",branchUid);

    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data?.parentUid?.value) {
      formData.append("parentUid.uid", data.parentUid.value);
    }
    const variations = watch("attributeKeys");

    variations.forEach((variations, index) => {
      if (variations.attributeName && variations.attributeName.trim() !== "") {
        formData.append(
          `attributeKeys[${index}].attributeName`,
          variations.attributeName
        );
        formData.append(
          `attributeKeys[${index}].isRequired`,
          variations.isRequired
        );
      }
    });
    if (!fetchData.uid) {
      try {
        setLoading(true);

        const res = await useJwt.addProductCategory(formData);
        console.log(res);

        if (res?.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Successfully",
            detail: "Category Created Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/dashboard/pos/product_management/addproductCategory");
          }, 1999);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Failed",
            detail: "Category Created Failed.",
            life: 2000,
          });
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          const errMsz =
            error?.response?.data?.content ||
            "Please check all fields and try again ";
          setErr(errMsz);
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);

        const res = await useJwt.editProductCategory(fetchData?.uid, formData);
        console.log(res);
        if (res?.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Successfully",
            detail: "Category updated Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            Navigate("/dashboard/pos/product_management/addproductCategory");
          }, 1999);
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          const errMsz =
            error?.response?.data?.content ||
            "Please check all fields and try again ";
          setErr(errMsz);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // ** Category child count handler
  function handleCategory(list) {
    const hash = new Map(
      list.map(({ uid, parentUid }) => [uid, parentUid?.uid || null])
    );

    const sortOut = (hash, list) =>
      list
        .filter(({ parentUid }) => {
          const p = parentUid?.uid;
          return !(p && hash.has(p) && hash.has(hash.get(p)));
        })
        .map(({ name, uid }) => ({ label: name, value: uid }));

    return sortOut(hash, list);
  }

  useEffect(() => {
    // if (fetchData && fetchData?.parentCategoryData) {
    const list = handleCategory(fetchData.parentCategoryData);
    setParentCategory(list);
    // }
  }, []);

  return (
    <Card>
      <Toast ref={toast} />

      <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
        <CardTitle tag="h4">
          {" "}
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
          Add New Category
        </CardTitle>

        <div className="d-flex   justify-content-start gap-2">
          <NavItems />
        </div>
      </CardHeader>
      <CardBody className="mt-2">
        {err && (
          <React.Fragment>
            <UncontrolledAlert color="danger">
              <div className="alert-body">
                <span className="text-danger fw-bold">
                  <strong>Error :</strong>
                  {err}
                </span>
              </div>
            </UncontrolledAlert>
          </React.Fragment>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                Parent Category
              </Label>

              <Controller
                name="parentUid"
                control={control}
                render={({ field }) => (
                  <Select {...field} options={parentCategory} />
                )}
              />
              {errors.parentUid && (
                <FormFeedback>{errors.parentUid.message}</FormFeedback>
              )}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="productName">
                Category Name <span style={{ color: "red" }}>*</span>
              </Label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Category name is required",
                  pattern: {
                    value: /^[A-Za-z0-9 ]+$/,
                    message:
                      "Only letters, numbers, commas, and spaces are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Product Name"
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
              {errors.name && (
                <div className="invalid-feedback d-block">
                  {errors.name.message}
                </div>
              )}
            </Col>
          </Row>

          <Row>
            <Col md="12" sm="12" className="mb-1">
              <Label className="form-label" for="description">
                Description (optional)
              </Label>
              <Controller
                name="description"
                control={control}
                rules={{
                  pattern: {
                    value: /^[A-Za-z0-9 .,-]*$/, // matches only letters, numbers, spaces, dot, dash, comma
                    message:
                      "Only letters, numbers, spaces, commas, dots, and dashes are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="textarea"
                    id="description"
                    rows="3"
                    placeholder="Description"
                    {...field}
                    onChange={(e) => {
                      // Remove invalid characters
                      let onlyValid = e.target.value.replace(
                        /[^A-Za-z0-9 .,-]/g,
                        ""
                      );
                      // Trim leading spaces
                      onlyValid = onlyValid.trimStart();
                      field.onChange(onlyValid);
                    }}
                  />
                )}
              />
              {errors.description && (
                <span className="text-danger">
                  {errors.description.message}
                </span>
              )}
            </Col>
          </Row>

          <CardTitle className="mt-3 mb-2" tag="h4">
            Variations
          </CardTitle>

          <Card className="card-company-table">
            <Table responsive>
              <thead>
                <tr>
                  <th>Variation Name</th>
                  <th>Required</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <Controller
                        name={`attributeKeys.${index}.attributeName`}
                        control={control}
                        rules={{
                          required: "Variations Name is required",

                          pattern: {
                            value: /^[A-Za-z0-9 .,-]*$/, // matches only letters, numbers, spaces, dot, dash, comma
                            message:
                              "Only letters, numbers, spaces, commas, dots, and dashes are allowed",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="e.g. color, size "
                            {...field}
                            onChange={(e) => {
                              // Remove invalid characters
                              let onlyValid = e.target.value.replace(
                                /[^A-Za-z0-9 .,-]/g,
                                ""
                              );
                              // Trim leading spaces
                              onlyValid = onlyValid.trimStart();
                              field.onChange(onlyValid);
                            }}
                          />
                        )}
                      />
                      {errors.attributeKeys?.[index]?.attributeName && (
                        <span className="text-danger">
                          {errors.attributeKeys[index].attributeName.message}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="form-check form-check-inline">
                        <Controller
                          name={`attributeKeys.${index}.isRequired`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          )}
                        />
                      </div>
                    </td>
                    <td>
                      <Trash2
                        style={{ cursor: "pointer" }}
                        onClick={() => remove(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-start ms-2 mt-2 mb-1">
              <Button
                color="primary"
                type="button"
                onClick={() => append({ attributeName: "", isRequired: false })}
              >
                Add New
              </Button>
            </div>
          </Card>

          <div className="d-flex justify-content-end">
            <Button
              outline
              color="secondary"
              type="button"
              className="me-2"
              onClick={() => reset()}
            >
              Reset
            </Button>

            <Button color="primary" disabled={loadinng} type="submit">
              {loadinng ? (
                <>
                  <span>Loading.. </span>
                  <Spinner size="sm" />{" "}
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default MultipleColumnForm;
