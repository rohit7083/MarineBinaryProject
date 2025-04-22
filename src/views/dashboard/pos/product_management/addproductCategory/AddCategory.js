import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Input,
  Form,
  Button,
  Label,
  Row,
  CardText,
  Table,
  Spinner,UncontrolledAlert,
} from "reactstrap";
import { Plus, Trash2 } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Tooltip } from "reactstrap";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
// import addProductIcon from "../../../../assets/icons/shopping-bag-add.svg";
import addProductIcon from "../../../../../assets/icons/shopping-bag-add.svg";
import importIcon from "../../../../../assets/icons/file-import.svg";
import AddCategoryIcon from "../../../../../assets/icons/category-alt.svg";
import addStocks from "../../../../../assets/icons/supplier-alt.svg";
import ManageStocks from "../../../../../assets/icons/workflow-setting.svg";
import addTax from "../../../../../assets/icons/calendar-event-tax.svg";
import ProductAdd_Table from "../ProductAdd_Table";

import { useFieldArray } from "react-hook-form";
import useJwt from "@src/auth/jwt/useJwt";
import { useNavigate } from "react-router-dom";

const MultipleColumnForm = () => {
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
  // const [data, setData] = useState([{ id: 1 }]);
const [err,setErr]=useState("");
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

  // Function to add a new field
  const addField = (e) => {
    e.preventDefault(); // Prevents page refresh
    // setData([...data, { id: Date.now() }]); // Unique id for key
  };

  // Function to remove a row
  const removeField = (id) => {
    // setData(data.filter((item) => item.id !== id));
  };
  const MySwal = withReactContent(Swal);
  const [loadinng, setLoading] = useState(false);

  const location = useLocation();
  const fetchData = location.state || "";
  const [parentData, setParentData] = useState([]);

  // console.log("fetchData", fetchData);
  // console.log("parentdata", parentData);

  // const options = parentData?.map((item) => ({
  //   label: item.parentCateName,
  //   value: item.parentUid,
  // }));

  //using above syntax i got error like .map is not function so i have used below way

  const options = Array.isArray(parentData)
    ? parentData.map((item) => ({
        label: item.parentCateName,
        value: item.parentUid,
      }))
    : [];

  useEffect(() => {
    setParentData(fetchData?.parentCategoryData);
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
    setErr('');
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("parentUid.uid", data.parentUid.value || null);
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
        return MySwal.fire({
          title: "Successfully Created",
          text: " Your Product Category Created Successfully",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          navigate("/dashboard/pos/product_management/addproductCategory");
        });
        
      } catch (error) {
        console.log(error);
        if (error.response) {
          const errMsz=error?.response?.data?.content || "Please check all fields and try again ";
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
        return MySwal.fire({
          title: "Successfully updated",
          text: " Your Product Category Update Successfully",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          Navigate("/dashboard/pos/product_management/addproductCategory");
        });
      } catch (error) {
        console.log(error);
        if (error.response) {
          const errMsz=error?.response?.data?.content || "Please check all fields and try again ";
          setErr(errMsz);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
        <CardTitle tag="h4">Add New Category</CardTitle>

        <div className="d-flex mt-md-0 mt-1">
          <div className="d-flex justify-content-end gap-2">
            <div>
              <Link to="/dashboard/pos/product_management/addProduct">
                <img
                  src={addProductIcon}
                  id="ANP"
                  alt="Shopping Bag"
                  width="25"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.ANP}
                  target="ANP"
                  toggle={() => toggleTooltip("ANP")}
                >
                  Add New Producct
                </Tooltip>
              </Link>
            </div>
            <div>
              <img
                id="importProduct"
                width="25"
                height="25"
                src={importIcon}
                alt="importProduct"
                onClick={() => setShow(true)}
                style={{ cursor: "pointer" }}
              />

              <Tooltip
                placement="top"
                isOpen={tooltipOpen.importProduct}
                target="importProduct"
                toggle={() => toggleTooltip("importProduct")}
              >
                Import Product
              </Tooltip>
            </div>

            <div>
              <Link to="/dashboard/pos/product_management/addproductCategory">
                <img
                  width="25"
                  height="25"
                  id="addProductCate"
                  src={AddCategoryIcon}
                  alt="sorting-answers"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.addProductCate}
                  target="addProductCate"
                  toggle={() => toggleTooltip("addProductCate")}
                >
                  Add Product Category
                </Tooltip>
              </Link>
            </div>
            <div>
              <Link to="/dashboard/pos/product_management/addTaxes">
                <img
                  width="25"
                  height="25"
                  id="addProducttaxes"
                  src={addTax}
                  alt="addProducttaxes"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.addProducttaxes}
                  target="addProducttaxes"
                  toggle={() => toggleTooltip("addProducttaxes")}
                >
                  Add Product Taxes
                </Tooltip>
              </Link>
            </div>
            <div>
              <Link to="/dashboard/pos/product_management/AddStocks">
                <img
                  width="25"
                  height="25"
                  id="addStock"
                  src={addStocks}
                  alt="list-is-empty"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.addStock}
                  target="addStock"
                  toggle={() => toggleTooltip("addStock")}
                >
                  Add Stock
                </Tooltip>
              </Link>
            </div>

            <div>
              <Link>
                <img
                  width="25"
                  height="25"
                  id="stockManage"
                  src={ManageStocks}
                  alt="list-is-empty"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.stockManage}
                  target="stockManage"
                  toggle={() => toggleTooltip("stockManage")}
                >
                  Stock Manage
                </Tooltip>
              </Link>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="mt-2">
      {err && (
        <React.Fragment>
          <UncontrolledAlert color="danger">
            <div className="alert-body">

              <span className="text-danger fw-bold">
                <strong>Error :</strong>{err}</span>
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
                render={({ field }) => <Select {...field} options={options} />}
              />
              {errors.parentUid && (
                <span className="text-danger">{errors.parentUid.message}</span>
              )}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="productName">
                Category Name
              </Label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Category name is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabetic characters (A–Z) are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Product Name"
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <span className="text-danger">{errors.name.message}</span>
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
                  required: "description is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabetic characters (A–Z) are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="textarea"
                    id="description"
                    rows="3"
                    placeholder="Description"
                    {...field}
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
                            value: /^[A-Za-z ]+$/,
                            message:
                              "Only alphabetic characters (A–Z) are allowed",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Variation Name"
                            {...field}
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
