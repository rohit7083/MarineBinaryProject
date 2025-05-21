import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Button,
  Label,
  Row,
  InputGroup,Input ,
} from "reactstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { countries } from "../../slip-management/CountryCode";
import ReactCountryFlag from "react-country-flag";

import { Tooltip } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
import addProductIcon from "../../../../assets/icons/shopping-bag-add.svg";
import importIcon from "../../../../assets/icons/file-import.svg";
import AddCategoryIcon from "../../../../assets/icons/category-alt.svg";
import addStocks from "../../../../assets/icons/supplier-alt.svg";
import ManageStocks from "../../../../assets/icons/workflow-setting.svg";
import addTax from "../../../../assets/icons/calendar-event-tax.svg";
import { data } from "jquery";
import useJwt from "@src/auth/jwt/useJwt";

const MultipleColumnForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // vendorName: "aa",
      // companyName: "bb",
      // address: "cc",
      // phoneNumber: "912345678901",
      // emailId: "aa@gmail.com",
    },
  });

  const location = useLocation();
  const vendorData = location.state;
  console.log("vendor ddata ", vendorData);

 
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
    const payload = {
      ...data,
     
    };
    if (!vendorData) {
      try {
        const res = await useJwt.addVender(payload);
        console.log("Response from API", res);
      } catch (error) {
        console.log("Error submitting form", error);
      }
    } else {
      try {
        const updatedRes = await useJwt.editvender(vendorData?.uid, payload);
        console.log(updatedRes);
      } catch (error) {
        console.log("Error submitting form", error);
      }
    }
  };

  useEffect(() => {
    reset(vendorData?.venderData);
  }, [reset, vendorData]);

  
     const countryOptions = countries.map((country) => ({
        value: country.dial_code,
        label: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <ReactCountryFlag
              countryCode={country.code}
              svg
              style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
            />
            {country.name} ({country.dial_code})
          </div>
        ),
        code: country.code,
      }));

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
        <CardTitle tag="h4">Add Vender</CardTitle>
         <div className="d-flex gap-2">
          <Link to="/dashboard/pos/product_management/addProduct">
            <img src={addProductIcon} id="ANP" alt="Add Product" width="25" />
            <Tooltip
              isOpen={tooltipOpen.ANP}
              target="ANP"
              toggle={() => toggleTooltip("ANP")}
            >
              Add New Product
            </Tooltip>
          </Link>

          <img
            id="importProduct"
            width="25"
            height="25"
            src={importIcon}
            alt="Import Product"
            style={{ cursor: "pointer" }}
          />
          <Tooltip
            isOpen={tooltipOpen.importProduct}
            target="importProduct"
            toggle={() => toggleTooltip("importProduct")}
          >
            Import Product
          </Tooltip>

          <Link to="/dashboard/pos/product_management/addproductCategory">
            <img
              id="addProductCate"
              width="25"
              src={AddCategoryIcon}
              alt="Add Category"
            />
            <Tooltip
              isOpen={tooltipOpen.addProductCate}
              target="addProductCate"
              toggle={() => toggleTooltip("addProductCate")}
            >
              Add Product Category
            </Tooltip>
          </Link>

          <Link to="/dashboard/pos/product_management/addTaxes">
            <img id="addProducttaxes" width="25" src={addTax} alt="Add Tax" />
            <Tooltip
              isOpen={tooltipOpen.addProducttaxes}
              target="addProducttaxes"
              toggle={() => toggleTooltip("addProducttaxes")}
            >
              Add Product Taxes
            </Tooltip>
          </Link>

          <Link to="/dashboard/pos/product_management/AddStocks">
            <img id="addStock" width="25" src={addStocks} alt="Add Stock" />
            <Tooltip
              isOpen={tooltipOpen.addStock}
              target="addStock"
              toggle={() => toggleTooltip("addStock")}
            >
              Add Stock
            </Tooltip>
          </Link>

          <Link>
            <img
              id="stockManage"
              width="25"
              src={ManageStocks}
              alt="Manage Stock"
            />
            <Tooltip
              isOpen={tooltipOpen.stockManage}
              target="stockManage"
              toggle={() => toggleTooltip("stockManage")}
            >
              Stock Manage
            </Tooltip>
          </Link>
        </div> 
      </CardHeader>

      <CardBody className="mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="6" className="mb-1">
              <Label for="vendorName">Vendor Name</Label>
              <Controller
                name="vendorName"
                control={control}
                rules={{
                  required: "Vendor is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabetic characters (A–Z) are allowed",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="form-control"
                    placeholder="Vendor Name"
                  />
                )}
              />
              {errors.vendorName && (
                <small className="text-danger">
                  {errors.vendorName.message}
                </small>
              )}
            </Col>

            <Col md="6" className="mb-1">
              <Label for="vendorName">Company Name</Label>
              <Controller
                name="companyName"
                control={control}
                rules={{
                  required: "company Name is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabetic characters (A–Z) are allowed",
                  },
                }}                render={({ field }) => (
                  <input
                    {...field}
                    className="form-control"
                    placeholder="Vendor Name"
                  />
                )}
              />
              {errors.companyName && (
                <small className="text-danger">
                  {errors.companyName.message}
                </small>
              )}
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label for="vendorName">Address</Label>
              <Controller
                name="address"
                control={control}
                rules={{
                  required: "Address is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabetic characters (A–Z) are allowed",
                  },
                }}                 render={({ field }) => (
                  <input
                    {...field}
                    className="form-control"
                    placeholder="address "
                  />
                )}
              />
              {errors.address && (
                <small className="text-danger">{errors.address.message}</small>
              )}
            </Col>
            <Col md="6" className="mb-1">
              <Label for="email">Email Address</Label>
              <Controller
                name="emailId"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="form-control"
                    placeholder="Enter Email"
                    type="email"
                  />
                )}
              />
              {errors.emailId && (
                <small className="text-danger">{errors.emailId.message}</small>
              )}
            </Col>
          </Row>

          <Row>
          <Col md="6" className="mb-1">
  <Label sm="3" for="phone">
                Country Code
              </Label>
              <Controller
                name="countryCode"
                control={control}
                defaultValue={countryOptions[0]}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={countryOptions}
                    onChange={(option) => field.onChange(option)}
                    value={countryOptions.find(
                      (option) => option.value === field.value?.value
                    )}
                  />
                )}
              />
              {errors.countryCode && (
                <small className="text-danger">
                  {errors.countryCode.message}
                </small>
              )}
            </Col>
            <Col md="6" className="mb-1">
              <Label sm="3" for="phone">
                Phone Number
              </Label>

              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                rules={{ required: "Phone number is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Enter phone number"
                  />
                )}
              />
              {errors.phoneNumber && (
                <small className="text-danger">
                  {errors.phoneNumber.message}
                </small>
              )}
              {/* </FormGroup> */}
            </Col>
          </Row>

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
                            rules={{ required: "Event Type Description is required" }}
                            render={({ field }) => (
                              <Input
                                id="description"
                                type="textarea"
                                rows="4"
                                placeholder="Enter Vendor type description"
                                invalid={!!errors.description}
                                {...field}
                              />
                            )}
                          />
          
                          {errors.description && (
                            <p style={{ color: "red" }}>
                              {errors.description.message}
                            </p>
                          )}
                        </Col>

          {/* <CardTitle tag="h4" className="mt-3 mb-2">
            Variations
          </CardTitle> */}

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
        </form>
      </CardBody>
    </Card>
  );
};

export default MultipleColumnForm;
