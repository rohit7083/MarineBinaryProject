import useJwt from "@src/auth/jwt/useJwt";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

const ProductAdd = ({ stepper, type, UpdateData, setProductData }) => {
  const [fetchData, setFetchData] = useState({
    categories: [],
    taxes: [],
    vendorsList: [],
  });
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // name: "Sample Product",
      // productType: "ReadyToSell",
      // description: "This is a dummy product  used for testing",
    },
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const toast = useRef(null);

  const navigate = useNavigate();

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

  useEffect(() => {
    if (UpdateData) {
      reset({
        ...UpdateData,
        category: UpdateData.categoryUid?.uid || "",
        vendor: UpdateData.vendorUid?.uid || "",
        taxes: UpdateData.taxUid?.uid || "",
        variations:
          UpdateData.variations?.map((v) => ({
            ...v,
            calcAmount: v.calAmount ?? "",
            qty: v.quantity ?? "",
          })) || [],

        specifications: UpdateData.specifications?.map((s) => ({
          name: s.specKey,
          value: s.specValue,
        })),
      });
    }
  }, [UpdateData, reset]);

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

      // taxes
      const taxOptions =
        taxesRes?.data?.content?.result?.map((tax) => ({
          label: `${tax.taxName} - ${tax.taxValue} ${
            tax.taxType === "Flat" ? "$" : "%"
          }`,
          value: tax.uid,
          taxValue: tax?.taxValue,
          taxType: tax?.taxType,
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
      if (error.response) {
        const errMsz =
          error?.response?.data?.content || "Server Problem to load Data ";
        setErr(errMsz);
      }
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  const watchCategory = watch("category");
  const watchTaxes = watch("taxes");
  let findCategoryData;
  let selectedTaxData;
  const onSubmit = async (data) => {
    if (Object.keys(data).length !== 0) {
      setErr("");

      findCategoryData = fetchData.categories?.find(
        (cat) => cat?.value === watchCategory
      );

      selectedTaxData = fetchData.taxes?.find(
        (tax) => tax?.value === watchTaxes
      );

      if (UpdateData) {
        const payload = {
          name: data?.name,
          description: data?.description,
          productType: data?.productType,
          categoryUid: {
            uid: findCategoryData?.value,
          },
          vendorUid: {
            uid: data?.vendor,
          },
          taxUid: {
            uid: data?.taxes,
          },
        };
        try {
          setLoading(true);
          const res = await useJwt.updateProduct(UpdateData?.uid, payload);
          if (res.status === 200) {
            setProductData({
              ...data,
              findCategoryData,
              selectedTaxData,
              taxChargesType: "Exclusive",
            });
            toast.current.show({
              severity: "success",
              summary: "Successfully",
              detail: "Product Updated Successfully.",
              life: 2000,
            });
            setTimeout(() => {
              stepper.next(1);
            }, 1999);
          } else {
            toast.current.show({
              severity: "error",
              summary: "Failed",
              detail: "Product Updated Failed.",
              life: 2000,
            });
          }
        } catch (error) {
          console.log(error);
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
        setProductData({
          ...data,
          findCategoryData,
          selectedTaxData,
          taxChargesType: "Exclusive",
        });

        stepper.next(1);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={toast} />

      <CardTitle tag="h4">
        {UpdateData ? "Update Product" : "Add New Products details"}
      </CardTitle>
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

          {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
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
                <option value="">Select Product type</option>
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
                {...field}
                invalid={!!errors.category}
              >
                <option value="">Select Category</option>

                {fetchData?.categories?.map((cat, index) => (
                  <option key={index} value={cat?.value}>
                    {cat?.label}
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
                <option value="Exclusive">Exclusive</option>
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
          {errors.taxes && <FormFeedback>{errors.taxes.message}</FormFeedback>}
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

      <div className="mt-2">
        <Button color="primary" disabled={loading} type="submit">
          {loading ? (
            <>
              {" "}
              Loading.. <Spinner size="sm" />{" "}
            </>
          ) : (
            <>Next</>
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

export default ProductAdd;
