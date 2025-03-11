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
} from "reactstrap";
import { Tooltip } from "reactstrap";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
import addProductIcon from "../../../../assets/icons/shopping-bag-add.svg";
import importIcon from "../../../../assets/icons/file-import.svg";
import AddCategoryIcon from "../../../../assets/icons/category-alt.svg";
import addStocks from "../../../../assets/icons/supplier-alt.svg";
import ManageStocks from "../../../../assets/icons/workflow-setting.svg";
import addTax from "../../../../assets/icons/calendar-event-tax.svg";
// ** Add New Modal Component
import ProductAdd_Table from "./ProductAdd_Table";
const MultipleColumnForm = () => {
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
    defaultValues: {
      invoiceID: "Sequent",
      currency: "USD",
      InvoiceNotes: "",
      IBANCode: "",
      InvoicePrefix: "",
      WalletID: "",
      InvoiceTerms: "",
      invoiceSignature: null,
      profilePicture: null,
    },
  });
  const [show, setShow] = useState(false);

  const [files, setFiles] = useState({});
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

  const handleFileChange = (e, fieldName) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [fieldName]: selectedFile,
      }));
    }
  };

  return (
    <Card>
      <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
        <CardTitle tag="h4">Add Product Stocks</CardTitle>
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
        <Form>
          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="productName">
                Vendor Name
              </Label>
              <Input type="text" id="productName" placeholder="Product Name" />
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                Product Name
              </Label>
              <Input type="select" id="category">
                <option>Select Product Name</option>
              </Input>
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="taxes">
                Invoice No
              </Label>
              <Input type="text" id="productName" placeholder="Product Name" />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="taxes">
                Invoice Amount
              </Label>
              <Input type="text" id="productName" placeholder="Product Name" />
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="productImage">
                Scan Invoice(optional){" "}
              </Label>
              <Input
                type="file"
                id="productImage"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "productImage")}
              />
              {files.productImage && <p>{files.productImage.name}</p>}
            </Col>
          </Row>

          <CardTitle className="mt-3 mb-2" tag="h4">
            Variations
          </CardTitle>

          {/* {selectedTax && <ProductAdd_Table />} */}

          <Button color="primary" type="submit">
            Submit
          </Button>
          <Button outline color="secondary" type="reset" className="ms-2">
            Reset
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default MultipleColumnForm;
