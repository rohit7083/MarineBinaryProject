import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Button,
  Label,
  Row,
  InputGroup,
} from "reactstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

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

  const [phoneNumber, setMobileNumber] = useState("");
  const extractCountryCodeAndNumber = (value) => {
    if (!value) return { code: "", number: "" }; // Handle undefined case
    const code = value.slice(0, value.length - 10);
    const number = value.slice(-10);
    return { code, number };
  };

  const onSubmit = async (data) => {
    const { code, number } = extractCountryCodeAndNumber(data.phoneNumber);
    const payload = {
      ...data,
      countryCode: `+${code}`,
      phoneNumber: number,
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
    reset(vendorData.venderData);
  }, [reset, vendorData]);

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
        <CardTitle tag="h4">Add Vender</CardTitle>
        {/* <div className="d-flex gap-2">
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
        </div> */}
      </CardHeader>

      <CardBody className="mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="6" className="mb-1">
              <Label for="vendorName">Vendor Name</Label>
              <Controller
                name="vendorName"
                control={control}
                rules={{ required: "Vendor name is required" }}
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
                rules={{ required: "Vendor name is required" }}
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
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label for="vendorName">Address</Label>
              <Controller
                name="address"
                control={control}
                rules={{ required: "address is required" }}
                render={({ field }) => (
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
              <Label for="mobile">Mobile Number</Label>

              <InputGroup className="input-group-merge">
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue={phoneNumber}
                  rules={{
                    required: "Mobile number is required",
                    validate: (value) =>
                      value && value.length >= 10
                        ? true
                        : "Invalid mobile number",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      // country={"us"}
                      value={value || phoneNumber}
                      onChange={(phone) => {
                        onChange(phone);
                        setMobileNumber(phone);
                      }}
                      inputProps={{
                        name: "phoneNumber",
                        required: true,
                        className: "form-control",
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      inputStyle={{
                        height: "38px",
                        border: "1px solid #ced4da",
                        borderRadius: "0 .375rem .375rem 0",
                        paddingLeft: "63px",
                        width: "100%",
                      }}
                    />
                  )}
                />
              </InputGroup>
            </Col>
          </Row>

          <Row>
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
              {errors.email && (
                <small className="text-danger">{errors.email.message}</small>
              )}
            </Col>
          </Row>

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
