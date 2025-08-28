import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
} from "reactstrap";

import useJwt from "@src/auth/jwt/useJwt";
import { ArrowLeft } from "react-feather";
import Add_Specification from "./Add_Specification";
import NavItems from "./NavItems";
import ProductAdd_Table from "./ProductAdd_Table";
const MultipleColumnForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",

    name: "TShirt",
    productType: "ReadyToSell",
    category: {
      label: "Clothing",
      value: "5eb64120-1b8e-4d38-98ad-c6229dfdbd89",
    },
    vendor: {
      label: "ABC Vendor",
      value: "bee5f444-84e6-403c-8cf4-92979d055579",
    },
    taxChargesType: "Exclusive",
    taxes: { label: "GST 10%", value: "9df15a9f-0d45-407e-98ff-b02978898828" },
    description: "Soft cotton men's T-shirt",
    specifications: [
      { specKey: "Fabric", specValue: "Cotton" },
      { specKey: "Fit", specValue: "Regular" },
      { specKey: "Occasion", specValue: "Casual" },
    ],
    variations: [
      {
        stockQty: "50",
        quantity: "1",
        unit: "pcs",
        calAmount: "100",
        finalAmount: "1100",
        mrp: "1000.0",
        attributes: [
          { attributeName: "Color", value: "Black" },
          { attributeName: "Size", value: "M" },
        ],
        variationImages: [], // could add uploaded images
      },
    ],
  });
  const [fetchData, setFetchData] = useState({
    categories: [],
    taxes: [],
    vendorsList: [],
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const toast = useRef(null);

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

  const onSubmit = async (data) => {
    setErr("");

    console.log(data);

    const formData = new FormData();

    // basic Product details
    formData.append("name", data?.name);
    formData.append("description", data?.description);
    formData.append("productType", data?.productType);
    formData.append("taxChargesType", "Exclusive");
    formData.append("vendorUid.uid", data?.vendor || "");
    formData.append("taxUid.uid", data?.taxes || "");
    formData.append("categoryUid.uid", data?.category?.value || "");

    // variations
    data?.variations?.forEach((variation, index) => {
      // formData.append(`variations[${index}].sku`, variation.sku || "" );
      formData.append(`variations[${index}].mrp`, variation.mrp || "");
      formData.append(
        `variations[${index}].stockQty`,
        variation.stockQty || ""
      );
      formData.append(`variations[${index}].quantity`, variation.qty || "");
      formData.append(`variations[${index}].unit`, variation.unit || "");
      formData.append(
        `variations[${index}].calAmount`,
        variation.calcAmount || ""
      );
      formData.append(
        `variations[${index}].finalAmount`,
        variation.finalAmount || ""
      );
    });

    // specifications

    data?.specifications?.forEach((specification, index) => {
      formData.append(
        `specifications[${index}].specKey`,
        specification.name || ""
      );
      formData.append(
        `specifications[${index}].specValue`,
        specification.value || ""
      );
    });

    // Append images if any
    if (data?.images && data?.images.length > 0) {
      Array.from(data.images).forEach((file, index) => {
        formData.append(`images`, file);
      });
    }

    try {
      setLoading(true);
      const res = await useJwt.addProduct(formData);
      if (res?.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Successfully",
          detail: "Product Add Successfully.",
          life: 2000,
        });
        setTimeout(() => {
          navigate("/dashboard/pos/product_management");
        }, 1999);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail: "Product Add Failed.",
          life: 2000,
        });
      }
      console.log(res);
    } catch (error) {
      console.error(error);
      setErr(
        error?.response?.data?.message ||
          "An error occurred while submitting the form."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [categoriesRes, taxesRes, vendorsRes] = await Promise.all([
        useJwt.getProductCategory(),
        useJwt.getAlltax(),
        useJwt.getVendor(),
      ]);

      // categories
      const categoryOptions =
        categoriesRes?.data?.content?.result?.map((category) => ({
          label: category.name,
          value: category.uid,
          attributeKeys:
            category?.attributeKeys?.map((attr) => attr?.attributeName) || [],
          attributeKeysUid:
            category?.attributeKeys?.map((attr) => attr?.uid) || [],
        })) || [];
      console.log(categoryOptions);

      // taxes
      const taxOptions =
        taxesRes?.data?.content?.result?.map((tax) => ({
          label: `${tax.taxName} - ${tax.taxValue} ${
            tax.taxType === "Flat" ? "$" : "%"
          }`,
          value: tax.uid,
          taxValue: tax?.taxValue,
        })) || [];

      // vendors
      const vendorOptions =
        vendorsRes?.data?.content?.result?.map((vendor) => ({
          label: vendor.vendorName,
          value: vendor.uid,
        })) || [];

      // update state once
      setFetchData({
        categories: categoryOptions,
        taxes: taxOptions,
        vendorsList: vendorOptions,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const watchCategory = watch("category");
  console.log(watchCategory);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={toast} />

      <Card>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
          <CardTitle tag="h4">
            {" "}
            <ArrowLeft
              style={{
                cursor: "pointer",
                // marginRight:"10px",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
              onClick={() => window.history.back()}
            />{" "}
            Add New Products
          </CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <div className="d-flex  mt-2 justify-content-start gap-2">
              <NavItems />
            </div>
          </div>
        </CardHeader>

        <CardBody>
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
          <Row className="mt-2">
            <Col md="6" sm="12" className="mb-1">
              <Label for="name">Product Name</Label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Product name is required",
                  pattern: {
                    value: /^[A-Za-z0-9 ]{2,50}$/,
                    message:
                      "Product name must be 2–50 characters, only letters, numbers, and spaces allowed",
                  },
                }}
                render={({ field }) => (
                  <>
                    {" "}
                    <Input
                      {...field}
                      invalid={!!errors.name}
                      id="name"
                      placeholder="Product Name"
                    />
                  </>
                )}
              />

              {errors.name && (
                <FormFeedback>{errors.name.message}</FormFeedback>
              )}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="productType">Product Type</Label>
              <Controller
                name="productType"
                control={control}
                rules={{
                  required: "Product type is required",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="select"
                    id="productType"
                    placeholder="Product Type"
                    invalid={!!errors.productType}
                  >
                    <option value="">Select Category</option>
                    <option value="ServiceBased">ServiceBased</option>

                    <option value="ReadyToSell">ReadyToSell</option>

                    <option value="Subscription">Subscription</option>

                    <option value="RawMaterials">RawMaterials</option>
                  </Input>
                )}
              />
              {errors.productType && (
                <FormFeedback>{errors.productType.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label for="category">Category</Label>
              <Controller
                name="category"
                control={control}
                rules={{
                  required: "category  is required",
                }}
                render={({ field }) => (
                  <Input
                    type="select"
                    id="category"
                    invalid={!!errors.category}
                    value={field.value?.value || ""} // ensure proper selected state
                    onChange={(e) => {
                      const selected = fetchData?.categories?.find(
                        (cat) => cat.value === e.target.value
                      );
                      field.onChange(selected || null);
                    }}
                  >
                    <option value="">Select Category</option>
                    {fetchData?.categories?.map((cat, index) => (
                      <option key={index} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.category && (
                <FormFeedback>{errors.category.message}</FormFeedback>
              )}
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label for="vendor">Vendor</Label>
              <Controller
                name="vendor"
                control={control}
                rules={{
                  required: "vendor  is required",
                }}
                render={({ field }) => (
                  <Input
                    type="select"
                    {...field}
                    id="vendor"
                    invalid={!!errors.vendor}
                  >
                    <option value="">Select Vendor</option>
                    {fetchData?.vendorsList?.map((v, index) => (
                      <option key={index} value={v?.value}>
                        {v?.label}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.vendor && (
                <FormFeedback>{errors.vendor.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label for="taxChargesType">Tax Charges</Label>
              <Controller
                name="taxChargesType"
                control={control}
                render={({ field }) => (
                  <Input type="select" {...field} id="taxChargesType" disabled>
                    {/* <option value="">Select Tax Charges</option> */}
                    <option value="5">Exclusive</option>
                    {/* <option value="18">18%</option> */}
                  </Input>
                )}
              />
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="taxes">Taxes</Label>
              <Controller
                name="taxes"
                control={control}
                rules={{
                  required: "Taxes is required",
                }}
                render={({ field }) => (
                  <Input
                    type="select"
                    {...field}
                    id="taxes"
                    invalid={!!errors.taxes}
                  >
                    <option value="">Select Taxes</option>
                    {fetchData?.taxes?.map((tax, index) => (
                      <option key={index} value={tax?.value}>
                        {tax?.label}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.taxes && (
                <FormFeedback>{errors.taxes.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <Row>
            <Col md="12" sm="12" className="mb-1">
              <Label for="description">Description (optional)</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    type="textarea"
                    rows="3"
                    {...field}
                    id="description"
                    placeholder="Description"
                    onChange={(e) => field.onChange(e.target.value.trimStart())}
                  />
                )}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <ProductAdd_Table
          watchCategory={watchCategory}
          fetchData={fetchData}
          control={control}
          errors={errors}
        />
      </Card>

      <Card>
        <Add_Specification control={control} />
      </Card>

      <div className="mt-2">
        <Button color="primary" disabled={loading} type="submit">
          {loading ? (
            <>
              Loading.. <Spinner size={12} />{" "}
            </>
          ) : (
            <>Submit</>
          )}
        </Button>
        <Button
          outline
          color="secondary"
          type="button"
          className="ms-2"
          onClick={() => reset()}
        >
          Reset
        </Button>
      </div>
    </Form>
  );
};

export default MultipleColumnForm;
