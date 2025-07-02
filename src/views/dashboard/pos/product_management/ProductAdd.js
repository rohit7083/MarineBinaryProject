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
  Tooltip,
  FormFeedback,
} from "reactstrap";
import { useForm, Controller, get } from "react-hook-form";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import addProductIcon from "../../../../assets/icons/shopping-bag-add.svg";
import importIcon from "../../../../assets/icons/file-import.svg";
import AddCategoryIcon from "../../../../assets/icons/category-alt.svg";
import addStocks from "../../../../assets/icons/supplier-alt.svg";
import ManageStocks from "../../../../assets/icons/workflow-setting.svg";
import addTax from "../../../../assets/icons/calendar-event-tax.svg";
import ProductAdd_Table from "./ProductAdd_Table";
import Add_Specification from "./Add_Specification";
import useJwt from "@src/auth/jwt/useJwt";
import NavItems from "./NavItems";
import { ArrowLeft } from "react-feather";
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
  const [getvendorss, setVendors] = useState([]);
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

  const fetchVendors = async () => {
    try {
      const getVendors = await useJwt.getVendor();
      console.log(getVendors);
      const vendorList = getVendors?.data?.content?.result || [];
      const vendorDetails = vendorList.map((x) => ({
        label: x.vendorName,
        value: x.uid,
      }));

      setVendors(vendorDetails);

      console.log(vendorDetails);

      const allNameOfVendor = vendorDetails.forEach((item) => {
        console.log(item.vendorName);
      });

      console.log(allNameOfVendor);
    } catch (error) {
       console.error(error);
    }
  };
  useEffect(() => {
    fetchVendors();
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await useJwt.addProduct(data);
      console.log(res);
    } catch (error) {
       console.error(error);
    }
    console.log("Form Submitted:", data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
          <CardTitle tag="h4"> <ArrowLeft
                                                     style={{
                                                       cursor: "pointer",
                                                     // marginRight:"10px",
                                                       transition: "color 0.1s",
                                                     }}
                                                     onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
                                                     onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
                                                     onClick={() => window.history.back()}
                                                   />   Add New Products</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <div className="d-flex  mt-2 justify-content-start gap-2">
            <NavItems/>
              <div>
                <Link to="/pos/VendorManage">
                  <div className="d-flex">
                    <Button color="primary" outline size="sm">
                  Import Product
                    </Button>
                  </div>
                </Link>
              </div>

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
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
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
                    <option value="vendor1">Vendor 1</option>
                    <option value="vendor2">Vendor 2</option>
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
                    <option value="">Select Tax Charges</option>
                    <option value="5">5%</option>
                    <option value="18">18%</option>
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
                    <option value="gst">GST</option>
                    <option value="vat">VAT</option>
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
