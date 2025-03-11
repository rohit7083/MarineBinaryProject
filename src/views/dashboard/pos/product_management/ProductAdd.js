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
import AddCategory from './addproductCategory/AddCategory'
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
  const [files, setFiles] = useState({});
  const [show, setShow] = useState(false)

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

  const selectedValue = watch("WithStocks");
  const selectedTax = watch("selectedTax");

  console.log("selectedValue", selectedValue);
  console.log("selectedTax", selectedTax);

  return (
    <Card>
      <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
        <CardTitle tag="h4">Add New Products</CardTitle>

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
            <Col md="6" sm="12" className="mb-1 ">
              <Label className="form-label" for="productName">
                Product Name
              </Label>
              <Input type="text" id="productName" placeholder="Product Name" />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="productImage">
                Product Image
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

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="category">
                Category
              </Label>
              <Input type="select" id="category">
                <option>Select Category</option>
              </Input>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="taxes">
                Taxes
              </Label>
              <Input type="select" id="taxes">
                <option>Select Taxes</option>
              </Input>
            </Col>
          </Row>

          <Row>
            <Col md="12" sm="12" className="mb-1">
              <Label className="form-label" for="description">
                Description (optional)
              </Label>
              <Input
                type="textarea"
                id="description"
                rows="3"
                placeholder="Description"
              />
            </Col>
          </Row>

          <CardTitle className="mt-3 mb-2" tag="h4">
            Variations
          </CardTitle>

          <Row>
            <Col md="12" sm="12">
              <div className="d-flex align-items-center">
                <Label for="invoiceID" className="me-3">
                  MRP Price including Inclusive/Exclusive
                </Label>
                <Controller
                  control={control}
                  name="selectedTax"
                  rules={{ required: "Invoice ID is required" }}
                  render={({ field }) => (
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <Input
                          type="radio"
                          id="inclusive"
                          value="Inclusive"
                          checked={field.value === "Inclusive"}
                          onChange={() => field.onChange("Inclusive")}
                        />
                        <Label className="form-check-label" for="inclusive">
                          Inclusive Tax
                        </Label>
                      </div>
                      <div className="form-check">
                        <Input
                          type="radio"
                          id="exclusive"
                          value="exclusive"
                          checked={field.value === "Exclusive"}
                          onChange={() => field.onChange("Exclusive")}
                        />
                        <Label className="form-check-label" for="exclusive">
                          Exclusive Tax
                        </Label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </Col>
          </Row>

          {selectedTax && <ProductAdd_Table />}

          <Row className="mb-1 mt-2">
            <Col md="12" sm="12" className="mb-2">
              <div className="d-flex align-items-center">
                <Label for="invoiceID" className="me-3">
                  Do You Want Add Product
                </Label>
                <Controller
                  control={control}
                  name="WithStocks"
                  rules={{ required: "Invoice ID is required" }}
                  render={({ field }) => (
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <Input
                          type="radio"
                          id=" WithStocks"
                          value="WithStocks"
                          checked={field.value === "WithStocks"}
                          onChange={() => field.onChange("WithStocks")}
                        />
                        <Label className="form-check-label" for="inclusive">
                          With Stocks
                        </Label>
                      </div>

                      <div className="form-check">
                        <Input
                          type="radio"
                          id="withoutStocks"
                          value="withoutStocks"
                          checked={field.value === "withoutStocks"}
                          onChange={() => field.onChange("withoutStocks")}
                        />
                        <Label className="form-check-label" for="withoutStocks">
                          without Stocks
                        </Label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </Col>

            {selectedValue && (
              <>
                <Row className="mb-1">
                  <Col md="6" sm="12">
                    <Label for="VendorName">Vendor Name</Label>
                    <Controller
                      control={control}
                      name="VendorName"
                      rules={{
                        required: "Vendor Name is required",
                        pattern: {
                          value: /^[A-Z0-9]+$/,
                          message: "Invalid Vendor Name format",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="VendorName"
                          placeholder="Vendor Name"
                          {...field}
                        />
                      )}
                    />
                    {errors.VendorName && (
                      <p className="text-danger">{errors.VendorName.message}</p>
                    )}
                  </Col>
                  <Col md="6" sm="12" className="mb-1">
                    <Label className="form-label" for="productImage">
                      Scan Invoice{" "}
                    </Label>
                    <Input
                      type="file"
                      id="ScanInvoice"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "productImage")}
                    />
                    {files.productImage && <p>{files.productImage.name}</p>}
                  </Col>
                </Row>

                <Row className="mb-1">
                  <Col md="6" sm="12">
                    <Label for="InvoiceNo">Invoice No</Label>
                    <Controller
                      name="InvoiceNo"
                      control={control}
                      rules={{
                        required: "Invoice No is required",
                        min: {
                          value: 0,
                          message: "Invoice No cannot be negative",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="number"
                          id="InvoiceNo"
                          placeholder="Invoice No"
                          {...field}
                        />
                      )}
                    />
                    {errors.InvoiceNo && (
                      <p className="text-danger">{errors.InvoiceNo.message}</p>
                    )}
                  </Col>

                  <Col md="6" sm="12">
                    <Label for="InvoiceAmount">Invoice Amount</Label>
                    <Controller
                      control={control}
                      name="InvoiceAmount"
                      rules={{
                        required: "Invoice Amount is required",
                        minLength: {
                          value: 1,
                          message:
                            "Invoice Amount must be at least 1 character",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="InvoiceAmount"
                          placeholder="Invoice Amount"
                          {...field}
                        />
                      )}
                    />
                    {errors.InvoiceAmount && (
                      <p className="text-danger">
                        {errors.InvoiceAmount.message}
                      </p>
                    )}
                  </Col>
                </Row>
              </>
            )}
          </Row>

          <Button color="primary" type="submit">
            Submit
          </Button>
          <Button outline color="secondary" type="reset" className="ms-2">
            Reset
          </Button>
        </Form>
    
      </CardBody>
      <AddCategory show={show} setShow={setShow} />

    </Card>
    
  );
};

export default MultipleColumnForm;
