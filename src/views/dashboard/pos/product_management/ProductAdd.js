import { useEffect, useState } from "react";
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
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      productType: "",
      category: "",
      vendor: "",
      taxChargesType: "",
      taxes: "",
      description: "",
      variations: [],
    },
  });
  const [fetchData, setFetchData] = useState({
    categories: [],
    taxes: [],
    vendorsList: [],
  });

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
    try {
      const res = await useJwt.addProduct(data);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
    console.log("Form Submitted:", data);
  };

  const fetchCategories = async () => {
    try {
      //get product categories
      const { data } = await useJwt.getProductCategory();
      const { content } = data;

      const options = content.result.map((category) => ({
        label: category.name,
        value: category.uid,
      }));

      //get taxes
      const taxResponse = await useJwt.getAlltax();
      const taxOptions = taxResponse?.data?.content?.result.map((tax) => ({
        label: `${tax.taxName} - ${tax.taxValue} ${
          tax.taxType === "Flat" ? "$" : "%"
        }`,
        value: tax.uid,
        taxValue: tax?.taxValue,
      }));

      const getVendors = await useJwt.getVendor();
      console.log(getVendors);
      const vendorList = getVendors?.data?.content?.result || [];
      const vendorDetails = vendorList.map((x) => ({
        label: x.vendorName,
        value: x.uid,
      }));

      setFetchData((prev) => ({
        ...prev,
        categories: options,
        taxes: taxOptions,
        vendorsList: vendorDetails,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
          <Row className="mt-2">
            <Col md="6" sm="12" className="mb-1">
              <Label for="name">Product Name</Label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Product Name is required",
                }}
                render={({ field }) => (
                  <>
                    {" "}
                    <Input {...field} id="name" placeholder="Product Name" />
                    <FormFeedback>{errors.name?.message}</FormFeedback>
                  </>
                )}
              />
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="productType">Product Type</Label>
              <Controller
                name="productType"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="productType"
                    placeholder="Product Type"
                  />
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label for="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Input type="select" {...field} id="category">
                    <option value="">Select Category</option>
                    {fetchData?.categories?.map((cat, index) => (
                      <option key={index} value={cat?.value}>
                        {cat?.label}
                      </option>
                    ))}
                  </Input>
                )}
              />
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="vendor">Vendor</Label>
              <Controller
                name="vendor"
                control={control}
                render={({ field }) => (
                  <Input type="select" {...field} id="vendor">
                    <option value="">Select Vendor</option>
                    {fetchData?.vendorsList?.map((v, index) => (
                      <option key={index} value={v?.value}>
                        {v?.label}
                      </option>
                    ))}
                  </Input>
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label for="taxChargesType">Tax Charges</Label>
              <Controller
                name="taxChargesType"
                control={control}
                render={({ field }) => (
                  <Input type="select" {...field} id="taxChargesType">
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
                render={({ field }) => (
                  <Input type="select" {...field} id="taxes">
                    <option value="">Select Taxes</option>
                    {fetchData?.taxes?.map((tax, index) => (
                      <option key={index} value={tax?.value}>
                        {tax?.label}
                      </option>
                    ))}
                  </Input>
                )}
              />
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
                  />
                )}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <ProductAdd_Table control={control} />
      </Card>

      <Card>
        <Add_Specification control={control} />
      </Card>

      <div className="mt-2">
        <Button color="primary" type="submit">
          Submit
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
