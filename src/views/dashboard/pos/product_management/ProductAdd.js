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
      {{debugger}}
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
      console.log(error);
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
      console.log(error);
    }
    console.log("Form Submitted:", data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
          <CardTitle tag="h4">Add New Products</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <div className="d-flex justify-content-end gap-2">
              <Link to="/dashboard/pos/product_management/addProduct">
                <img
                  src={addProductIcon}
                  id="ANP"
                  alt="Add Product"
                  width="25"
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen.ANP}
                  target="ANP"
                  toggle={() => toggleTooltip("ANP")}
                >
                  Add New Product
                </Tooltip>
              </Link>

              <div>
                <img
                  id="importProduct"
                  width="25"
                  height="25"
                  src={importIcon}
                  alt="Import"
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

              <Link to="/dashboard/pos/product_management/addproductCategory">
                <img
                  id="addProductCate"
                  src={AddCategoryIcon}
                  width="25"
                  height="25"
                  alt="Category"
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

              <Link to="/dashboard/pos/product_management/addTaxes">
                <img
                  id="addProducttaxes"
                  src={addTax}
                  width="25"
                  height="25"
                  alt="Tax"
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

              <Link to="/dashboard/pos/product_management/AddStocks">
                <img
                  id="addStock"
                  src={addStocks}
                  width="25"
                  height="25"
                  alt="Stock"
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

              <Link to="#">
                <img
                  id="stockManage"
                  src={ManageStocks}
                  width="25"
                  height="25"
                  alt="Manage"
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
