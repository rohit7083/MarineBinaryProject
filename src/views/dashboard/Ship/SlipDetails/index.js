import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Trash2 } from "react-feather";
import Flatpickr from "react-flatpickr";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
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
  Table,
  UncontrolledAlert,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
function ShipDetails() {
  let navigate = useNavigate();
  const toast = useRef(null);
  const location = useLocation();
  const [loadinng, setLoading] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [view, setView] = useState(false);
  const [shipTypeNames, setShipTypeNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const [Message, setMessage] = useState("");
  const uid = location.state?.uid || "";
  const allData = location.state?.allData || "";

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      slipName: "",
      electric: false,
      water: false,
      addOn: "",
      marketRent: "",
      marketAnnualPrice: "",
      marketMonthlyPrice: "",
      amps: "",
      overDueChargesFor7Days: "",
      overDueAmountFor7Days: "",
      overDueChargesFor15Days: "",
      overDueAmountFor15Days: "",
      overDueChargesFor30Days: "",
      overDueAmountFor30Days: "",
      overDueChargesForNotice: "",
      overDueAmountForNotice: "",
      overDueChargesForAuction: "",
      overDueAmountForAuction: "",
      weekDaysPrice: "",
      weekEndPrice: "",
       specialDays: [
      {
        date: "",
        price: "",
        description: ""
      }
    ]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specialDays",
  });

  const watchElectric = watch("electric");
  const watchOverDueChargesFor7Days = watch("overDueChargesFor7Days");
  const watchOverDueChargesFor15Days = watch("overDueChargesFor15Days");
  const watchOverDueChargesFor30Days = watch("overDueChargesFor30Days");
  const watchOverDueChargesForNotice = watch("overDueChargesForNotice");
  const watchOverDueChargesForAuction = watch("overDueChargesForAuction");
  const handleSelectChange = (option) => {
    setSelectedCategory(option);
    setDimensions(option?.dimensions || []);
    [
      "marketRent",
      "overDueAmountFor7Days",
      "overDueAmountFor15Days",
      "overDueAmountFor30Days",
      "overDueAmountForNotice",
      "overDueAmountForAuction",
      "overDueChargesFor7Days",
      "overDueChargesFor15Days",
      "overDueChargesFor30Days",
      "overDueChargesForNotice",
      "overDueChargesForAuction",
    ].forEach((f) => setValue(f, option?.[f] ?? ""));
  };

  const onSubmit = async (data) => {
    setMessage("");
    if (!selectedCategory) return setMessage("Category is required");

    try {
      setLoading(true);
      const dims = dimensions.reduce(
        (a, d) => ({ ...a, [d]: parseFloat(data[d]) || 0 }),
        {},
      );
      const ordered = {};
      ["height", "width", "length"].forEach(
        (k) => dims[k] && (ordered[k] = dims[k]),
      );
      Object.entries(dims).forEach(([k, v]) => !ordered[k] && (ordered[k] = v));

      const payload = {
        ...data,
        addOn: data.addOn?.trim() || null,
        ...(data.electric && { amps: parseFloat(data.amps) }),
        marketRent: parseFloat(data.marketRent) || 0,
        marketAnnualPrice: parseFloat(data.marketAnnualPrice) || 0,
        marketMonthlyPrice: parseFloat(data.marketMonthlyPrice) || 0,
        weekDaysPrice: parseFloat(data.weekDaysPrice) || 0,
        weekEndPrice: parseFloat(data.weekEndPrice) || 0,
        slipCategoryUid: selectedCategory?.value,
        dimensions: ordered,
        overDueAmountFor7Days: parseFloat(data.overDueAmountFor7Days) || 0,
        overDueAmountFor15Days: parseFloat(data.overDueAmountFor15Days) || 0,
        overDueAmountFor30Days: parseFloat(data.overDueAmountFor30Days) || 0,
        overDueAmountForNotice: parseFloat(data.overDueAmountForNotice) || 0,
        overDueAmountForAuction: parseFloat(data.overDueAmountForAuction) || 0,
      };

      const res = uid
        ? await useJwt.updateslip(uid, payload)
        : await useJwt.postslip(payload);
      if (res.status === 200 || res.status === 201) {
        toast.current.show({
          severity: "success",
          summary: `${uid ? "Updated" : "Created"} Successfully`,
          detail: `Slip Details ${uid ? "updated" : "created"} Successfully.`,
          life: 2000,
        });
        setTimeout(() => navigate("/dashboard/slipdetail_list"), 2000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.content || "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await useJwt.getslipCatogory({});
        setShipTypeNames(
          res.data.content.result.map((i) => ({
            value: i.uid,
            label: i.shipTypeName,
            dimensions: i.dimensions,
            marketRent: i.marketRent,
            overDueChargesFor7Days: i.overDueChargesFor7Days,
            overDueAmountFor7Days: i.overDueAmountFor7Days,
            overDueChargesFor15Days: i.overDueChargesFor15Days,
            overDueAmountFor15Days: i.overDueAmountFor15Days,
            overDueChargesFor30Days: i.overDueChargesFor30Days,
            overDueAmountFor30Days: i.overDueAmountFor30Days,
            overDueChargesForNotice: i.overDueChargesForNotice,
            overDueAmountForNotice: i.overDueAmountForNotice,
            overDueChargesForAuction: i.overDueChargesForAuction,
            overDueAmountForAuction: i.overDueAmountForAuction,
          })),
        );
      } catch (e) {
        console.error("Error fetching category:", e);
      }
    })();

    if (uid && allData) {
      (async () => {
        try {
          setFetchLoader(true);
          setView(allData?.isAssigned === true);
          if (allData.uid === uid) {
            reset({
              slipName: allData.slipName,
              electric: allData.electric,
              water: allData.water,
              marketRent: allData?.category?.marketRent,
              weekDaysPrice: allData.weekDaysPrice,
              weekEndPrice: allData.weekEndPrice,
              water: allData.water,
              addOn: allData.addOn,
              specialDays:
                allData?.specialDays?.map((day) => ({
                  date: day.date,
                  price: day.price,
                  description: day.description
                })) || [],
              marketAnnualPrice: allData.marketAnnualPrice,
              marketMonthlyPrice: allData.marketMonthlyPrice,
              amps: allData.amps,
              overDueAmountFor7Days: allData?.overDueAmountFor7Days,
              overDueAmountFor15Days: allData?.overDueAmountFor15Days,
              overDueAmountFor30Days: allData?.overDueAmountFor30Days,
              overDueAmountForNotice: allData?.overDueAmountForNotice,
              overDueAmountForAuction: allData?.overDueAmountForAuction,
              overDueChargesFor7Days: allData.category?.overDueChargesFor7Days,
              overDueChargesFor15Days:
                allData.category?.overDueChargesFor15Days,
              overDueChargesFor30Days:
                allData.category?.overDueChargesFor30Days,
              overDueChargesForNotice:
                allData.category?.overDueChargesForNotice,
              overDueChargesForAuction:
                allData.category?.overDueChargesForAuction,
              ...allData.dimensions,
            });
            setDimensions(Object.keys(allData.dimensions) || []);
            setSelectedCategory({
              value: allData.category.uid,
              label: allData.category.shipTypeName,
              dimensions: allData.dimensions || [],
              marketRent: allData.marketRent,
              overDueChargesFor7Days:
                allData?.category?.overDueChargesFor7Days ?? "",
              overDueAmountFor7Days:
                allData?.category?.overDueAmountFor7Days ?? "",
              overDueChargesFor15Days:
                allData?.category?.overDueChargesFor15Days ?? "",
              overDueAmountFor15Days:
                allData?.category?.overDueAmountFor15Days ?? "",
              overDueChargesFor30Days:
                allData?.category?.overDueChargesFor30Days ?? "",
              overDueAmountFor30Days:
                allData?.category?.overDueAmountFor30Days ?? "",
              overDueChargesForNotice:
                allData?.category?.overDueChargesForNotice ?? "",
              overDueAmountForNotice:
                allData?.category?.overDueAmountForNotice ?? "",
              overDueChargesForAuction:
                allData?.category?.overDueChargesForAuction ?? "",
              overDueAmountForAuction:
                allData?.category?.overDueAmountForAuction ?? "",
            });
          }
        } catch (e) {
          console.error("Error fetching data:", e);
        } finally {
          setFetchLoader(false);
        }
      })();
    }
  }, [uid]);

  const resetForm = () => {
    reset();
    setSelectedCategory(null);
    setDimensions([]);
  };

  return (
    <>
      <Card>
        <Toast ref={toast} />

        <CardHeader>
          <CardTitle tag="h4">
            <ArrowLeft
              style={{
                cursor: "pointer",
                marginRight: "10px",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
              onClick={() => window.history.back()}
            />{" "}
            {uid ? "Edit Slip Details" : "Add Slip Details"}
          </CardTitle>
        </CardHeader>

        <CardBody>
          {/* <Button onClick={() => sendIntoBulk()}>Upload Slip Details</Button> */}
          <p>
            <strong>Note : </strong> If the slip is <strong>Assigned</strong> ,
            you can only update <strong>Electric </strong> ,
            <strong>Water</strong>, <strong>Add-On</strong> And{" "}
            <strong>AMPS</strong>{" "}
          </p>

          {fetchLoader ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "4rem",
                }}
              >
                <Spinner
                  color="primary"
                  style={{
                    height: "5rem",
                    width: "5rem",
                  }}
                />
              </div>
            </>
          ) : (
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-1">
                <Label sm="3" for=""></Label>{" "}
                <Col sm="12">
                  {Message && (
                    <React.Fragment>
                      <UncontrolledAlert color="danger">
                        <div className="alert-body">
                          <span className="text-danger fw-bold">
                            Error - {Message}
                          </span>
                        </div>
                      </UncontrolledAlert>
                    </React.Fragment>
                  )}
                </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="slipName">
                  Slip Name
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm="9">
                  <Controller
                    name="slipName"
                    control={control}
                    rules={{ required: "Slip Name is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        onChange={(e) => {
                          let slipName = e.target.value.replace(
                            /[^A-Za-z0-9 ]/g,
                            "",
                          );
                          field.onChange(slipName);
                        }}
                        id="slipName"
                        placeholder="Enter Slip Name"
                        invalid={!!errors.slipName}
                        disabled={view}
                      />
                    )}
                  />
                  {errors.slipName && (
                    <FormFeedback>{errors.slipName.message}</FormFeedback>
                  )}
                </Col>
              </Row>

              <Row className="mb-1">
                <Label sm="3" for="category">
                  Category<span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm="9">
                  <Select
                    value={selectedCategory}
                    onChange={handleSelectChange}
                    name="category"
                    options={shipTypeNames}
                    isClearable
                    placeholder="Select Category"
                    className={!selectedCategory && Message ? "is-invalid" : ""}
                    isDisabled={view}
                  />
                  {!selectedCategory && Message && (
                    <div className="invalid-feedback d-block">
                      Category is required
                    </div>
                  )}
                </Col>
              </Row>

              {dimensions.map((dim) => (
                <Row className="mb-1" key={dim}>
                  <Label sm="3" for={dim}>
                    {dim.toLowerCase()}
                    <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Col sm="9">
                    <Controller
                      name={dim}
                      control={control}
                      rules={{
                        required: `${dim.toUpperCase()} is required`,
                        validate: (value) => {
                          if (Number(value) <= 0) {
                            return dim === "length"
                              ? "Length should be greater than 0"
                              : "Dimensions should be greater than 0";
                          }
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          onChange={(e) => {
                            let validatedDimension = e.target.value.replace(
                              /[^0-9.]/g,
                              "",
                            );
                            field.onChange(validatedDimension);
                          }}
                          id={dim}
                          placeholder={`Enter ${dim.toLowerCase()}`}
                          invalid={!!errors[dim]}
                          disabled={view}
                        />
                      )}
                    />
                    {errors[dim] && (
                      <FormFeedback>{errors[dim].message}</FormFeedback>
                    )}
                  </Col>
                </Row>
              ))}

              <Row className="mb-1">
                <Label sm="3" for="electric">
                  Electric (Yes/No)
                </Label>
                <Col sm="9">
                  <div className="form-check form-switch d-flex align-items-center">
                    <Label
                      className="me-1"
                      htmlFor="electric"
                      style={{ textAlign: "left" }}
                    >
                      No
                    </Label>
                    <Controller
                      name="electric"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="switch"
                          id="electric"
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            if (!e.target.checked) {
                              setValue("amps", "");
                            }
                          }}
                          style={{ margin: 0 }}
                        />
                      )}
                    />
                    <Label
                      className="ms-1"
                      htmlFor="electric"
                      style={{ textAlign: "left" }}
                    >
                      Yes
                    </Label>
                  </div>
                </Col>
              </Row>

              <Row className="mb-1">
                <Label sm="3" for="water">
                  Water (Yes/No)
                </Label>
                <Col sm="9">
                  <div className="form-check form-switch d-flex align-items-center">
                    <Label
                      className="me-1"
                      htmlFor="water"
                      style={{ textAlign: "left" }}
                    >
                      No
                    </Label>
                    <Controller
                      name="water"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="switch"
                          id="water"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          style={{ margin: 0 }}
                        />
                      )}
                    />
                    <Label
                      className="ms-1"
                      htmlFor="water"
                      style={{ textAlign: "left" }}
                    >
                      Yes
                    </Label>
                  </div>
                </Col>
              </Row>

              {watchElectric && (
                <Row className="mb-1">
                  <Label sm="3" for="amps">
                    AMPS
                  </Label>
                  <Col sm="9">
                    <Controller
                      name="amps"
                      control={control}
                      rules={{
                        required: watchElectric
                          ? "AMPS is required when Electric is enabled"
                          : false,
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            field.onChange(value);
                          }}
                          id="amps"
                          placeholder="Enter AMPS"
                          invalid={!!errors.amps}
                        />
                      )}
                    />
                    <FormFeedback>{errors.amps?.message}</FormFeedback>
                  </Col>
                </Row>
              )}

              <Row className="mb-1">
                <Label sm="3" for="addOn">
                  Add-on
                </Label>
                <Col sm="9">
                  <Controller
                    name="addOn"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        onChange={(e) => {
                          const value = e.target.value.replace(
                            /[^a-zA-Z0-9 ]/g,
                            "",
                          );
                          field.onChange(value);
                        }}
                        id="addOn"
                        placeholder="Enter Add-on"
                        invalid={!!errors.addOn}
                      />
                    )}
                  />
                  <FormFeedback>{errors.addOn?.message}</FormFeedback>
                </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="marketRent">
                  Market Rent
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm="9">
                  <Controller
                    name="marketRent"
                    control={control}
                    rules={{ required: "Market Rent is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        onChange={(e) => {
                          let marketRent = e.target.value.replace(
                            /[^0-9.]/g,
                            "",
                          );
                          field.onChange(marketRent);
                        }}
                        id="marketRent"
                        placeholder="Enter Market Rent"
                        disabled={allData?.isAssigned == true ? true : false}
                        invalid={!!errors.marketRent}
                      />
                    )}
                  />
                  <FormFeedback>{errors.marketRent?.message}</FormFeedback>
                </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="marketAnnualPrice">
                  Annual Price
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm="9">
                  <Controller
                    name="marketAnnualPrice"
                    control={control}
                    rules={{ required: "Annual Price is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        onChange={(e) => {
                          let marketAnnual = e.target.value.replace(
                            /[^0-9.]/g,
                            "",
                          );
                          field.onChange(marketAnnual);
                        }}
                        id="marketAnnualPrice"
                        placeholder="Enter Annual Price"
                        disabled={view}
                        invalid={!!errors.marketAnnualPrice}
                      />
                    )}
                  />
                  <FormFeedback>
                    {errors.marketAnnualPrice?.message}
                  </FormFeedback>
                </Col>
              </Row>

              <Row className="mb-1">
                <Label sm="3" for="marketMonthlyPrice">
                  Monthly Price
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm="9">
                  <Controller
                    name="marketMonthlyPrice"
                    control={control}
                    rules={{ required: "Monthly Price is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        onChange={(e) => {
                          let marketMonth = e.target.value.replace(
                            /[^0-9.]/g,
                            "",
                          );
                          field.onChange(marketMonth);
                        }}
                        id="marketMonthlyPrice"
                        placeholder="Enter Monthly Price"
                        disabled={view}
                        invalid={!!errors.marketMonthlyPrice}
                      />
                    )}
                  />
                  <FormFeedback>
                    {errors.marketMonthlyPrice?.message}
                  </FormFeedback>
                </Col>
              </Row>

              <Row className="mb-1">
                <Label sm="3" for="weekDaysPrice">
                  Week Day Price <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm="9">
                  <Controller
                    name="weekDaysPrice"
                    control={control}
                    rules={{ required: "WeekDay price is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="weekDaysPrice"
                        placeholder="Enter WeekDay Price"
                        disabled={allData?.isAssigned == true ? true : false}

                        onChange={(e) => {
                         let value = e.target.value.replace(/[^0-9.]/g, "");
                          field.onChange(value);
                        }}
                        invalid={!!errors.weekDaysPrice}
                      />
                    )}
                  />
                  {errors.weekDaysPrice && (
                    <FormFeedback>{errors.weekDaysPrice.message}</FormFeedback>
                  )}
                </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="weekEndPrice">
                  Weekend Price <span style={{ color: "red" }}>*</span>
                </Label>
                <Col sm="9">
                  <Controller
                    name="weekEndPrice"
                    control={control}
                    rules={{ required: "Weekend price is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="weekEndPrice"
                        placeholder="Enter Weekend Price"
                            disabled={allData?.isAssigned == true ? true : false}

                        onChange={(e) => {
                          let value = e.target.value.replace(/[^0-9.]/g, "");
                          field.onChange(value);
                        }}
                        invalid={!!errors.weekEndPrice}
                      />
                    )}
                  />
                  {errors.weekEndPrice && (
                    <FormFeedback>{errors.weekEndPrice.message}</FormFeedback>
                  )}
                </Col>
              </Row>

              <Row>
                <CardTitle className="mt-3 mb-2" tag="h4">
                  Special Days
                </CardTitle>
                <Card className="card-company-table">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <Controller
                              name={`specialDays.${index}.date`}
                              control={control}
                              rules={{ required: "Start Date is required" }}
                              render={({
                                field: { onChange, value, ref, ...field },
                              }) => (
                                <Flatpickr
                                  {...field}
                                  value={value}
                            disabled={allData?.isAssigned == true ? true : false}

                                  className={`form-control ${
                                    errors?.specialDays?.[index]?.date
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  options={{ dateFormat: "Y-m-d" }}
                                  onChange={(date) => {
                                    if (date[0]) {
                                      const selected = date[0]
                                        .toISOString()
                                        .split("T")[0];
                                      onChange(selected);
                                    }
                                  }}
                                />
                              )}
                            />
                            {errors?.specialDays?.[index]?.date && (
                              <div className="invalid-feedback">
                                {errors.specialDays[index].date.message}
                              </div>
                            )}
                          </td>
                          <td>
                            <Controller
                              name={`specialDays.${index}.price`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Enter Price"
                                                              disabled={allData?.isAssigned == true ? true : false}

                                  onChange={(e) => {
                                    let val = e.target.value.replace(
                                      /[^0-9]/g,
                                      "",
                                    );
                                    field.onChange(val);
                                  }}
                                  invalid={
                                    !!errors?.specialDays?.[index]?.price
                                  }
                                />
                              )}
                            />
                            {errors?.specialDays?.[index]?.price && (
                              <FormFeedback>
                                {errors.specialDays[index].price.message}
                              </FormFeedback>
                            )}
                          </td>
                          <td>
                            <Controller
                              name={`specialDays.${index}.description`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Description"

                                                              disabled={allData?.isAssigned == true ? true : false}

                                  onChange={(e) => {
                                    const onlyValid = e.target.value.replace(
                                      /[^A-Za-z0-9 .,-]/g,
                                      "",
                                    );
                                    field.onChange(onlyValid);
                                  }}
                                  invalid={
                                    !!errors?.specialDays?.[index]?.description
                                  }
                                />
                              )}
                            />
                            {errors?.specialDays?.[index]?.description && (
                              <FormFeedback>
                                {errors.specialDays[index].description.message}
                              </FormFeedback>
                            )}
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
                      size={"sm"}
                      type="button"
                      onClick={() =>
                        append({ date: "", price: "", description: "" })
                      }
                    >
                      Add New
                    </Button>
                  </div>
                </Card>
              </Row>

              {/* <fieldset disabled={true}> */}
              <Table responsive className="mt-2">
                <thead>
                  <tr>
                    <th>Charges</th>
                    <th>Charges Type</th>

                    <th>Charges Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="align-middle fw-bold">
                        7 Days Charges
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="me-1">Percentage</span>
                        <Controller
                          name="overDueChargesFor7Days"
                          control={control}
                          rules={{ required: "Please select a type" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="radio"
                              value="Percentage"
                              id="Percentage7"
                              disabled={view}
                              checked={field.value === "Percentage"}
                              onChange={() => field.onChange("Percentage")}
                              className="me-2"
                            />
                          )}
                        />
                        <span className="me-1">Flat</span>
                        <Controller
                          name="overDueChargesFor7Days"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="radio"
                              className="me-2"
                              value="Flat"
                              id="Flat7"
                              disabled={view}
                              checked={field.value === "Flat"}
                              onChange={() => field.onChange("Flat")}
                            />
                          )}
                        />
                      </div>
                    </td>
                    <td>
                      <Controller
                        name="overDueAmountFor7Days"
                        control={control}
                        rules={{
                          required: "Please enter a valid number.",
                          validate: (value) => {
                            if (!value || isNaN(value))
                              return "Please enter a valid number.";
                            if (value <= 0)
                              return "Amount must be greater than zero.";
                            if (
                              watchOverDueChargesFor7Days === "Percentage" &&
                              value > 100
                            ) {
                              return "Percentage amount must be less than or equal to 100.";
                            }
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            disabled={view}
                            onChange={(e) => {
                              let sevenDays = e.target.value.replace(
                                /[^0-9.]/g,
                                "",
                              );
                              field.onChange(sevenDays);
                            }}
                            invalid={!!errors.overDueAmountFor7Days}
                          />
                        )}
                      />
                      <FormFeedback>
                        {errors.overDueAmountFor7Days?.message}
                      </FormFeedback>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="align-middle fw-bold">
                        15 Days Charges <span style={{ color: "red" }}>*</span>
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="me-1">Percentage</span>
                        <Controller
                          name="overDueChargesFor15Days"
                          control={control}
                          rules={{ required: "Please select a type" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="radio"
                              disabled={view}
                              checked={field.value === "Percentage"}
                              onChange={() => field.onChange("Percentage")}
                              id="basic-cb-unchecked"
                              className="me-2"
                            />
                          )}
                        />
                        <span className="me-1">Flat</span>
                        <Controller
                          name="overDueChargesFor15Days"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="radio"
                              checked={field.value === "Flat"}
                              disabled={view}
                              onChange={() => field.onChange("Flat")}
                              id="basic-cb-unchecked"
                              className="me-2"
                            />
                          )}
                        />
                      </div>
                    </td>
                    <td>
                      <Controller
                        name="overDueAmountFor15Days"
                        control={control}
                        rules={{
                          required: "Please enter a valid number.",
                          validate: (value) => {
                            if (!value || isNaN(value))
                              return "Please enter a valid number.";
                            if (value <= 0)
                              return "Amount must be greater than zero.";
                            if (
                              watchOverDueChargesFor15Days === "Percentage" &&
                              value > 100
                            ) {
                              return "Percentage amount must be less than or equal to 100.";
                            }
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            disabled={view}
                            onChange={(e) => {
                              let fiftinDays = e.target.value.replace(
                                /[^0-9.]/g,
                                "",
                              );
                              field.onChange(fiftinDays);
                            }}
                            invalid={!!errors.overDueAmountFor15Days}
                          />
                        )}
                      />
                      <FormFeedback>
                        {errors.overDueAmountFor15Days?.message}
                      </FormFeedback>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="align-middle fw-bold">
                        30 Days Charges <span style={{ color: "red" }}>*</span>
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="me-1">Percentage</span>
                        <Controller
                          name="overDueChargesFor30Days"
                          control={control}
                          rules={{ required: "Please select a type" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="radio"
                              disabled={view}
                              checked={field.value === "Percentage"}
                              onChange={() => field.onChange("Percentage")}
                              id="basic-cb-unchecked"
                              className="me-2"
                            />
                          )}
                        />
                        <span className="me-1">Flat</span>
                        <Controller
                          name="overDueChargesFor30Days"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="radio"
                              disabled={view}
                              checked={field.value === "Flat"}
                              onChange={() => field.onChange("Flat")}
                              id="basic-cb-unchecked"
                              className="me-2"
                            />
                          )}
                        />
                      </div>
                    </td>
                    <td>
                      <Controller
                        name="overDueAmountFor30Days"
                        control={control}
                        rules={{
                          required: "Please enter a valid number.",
                          validate: (value) => {
                            if (!value || isNaN(value))
                              return "Please enter a valid number.";
                            if (value <= 0)
                              return "Amount must be greater than zero.";
                            if (
                              watchOverDueChargesFor30Days === "Percentage" &&
                              value > 100
                            ) {
                              return "Percentage amount must be less than or equal to 100.";
                            }
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            disabled={view}
                            onChange={(e) => {
                              let thirty = e.target.value.replace(
                                /[^0-9.]/g,
                                "",
                              );
                              field.onChange(thirty);
                            }}
                            invalid={!!errors.overDueAmountFor30Days}
                          />
                        )}
                      />
                      <FormFeedback>
                        {errors.overDueAmountFor30Days?.message}
                      </FormFeedback>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="align-middle fw-bold">
                        Notice Charges <span style={{ color: "red" }}>*</span>
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="me-1">Percentage</span>
                        <Controller
                          name="overDueChargesForNotice"
                          control={control}
                          rules={{ required: "Please select a type" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="radio"
                              disabled={view}
                              checked={field.value === "Percentage"}
                              onChange={() => field.onChange("Percentage")}
                              id="basic-cb-unchecked"
                              className="me-2"
                            />
                          )}
                        />
                        <span className="me-1">Flat</span>
                        <Controller
                          name="overDueChargesForNotice"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="radio"
                              disabled={view}
                              checked={field.value === "Flat"}
                              onChange={() => field.onChange("Flat")}
                              id="basic-cb-unchecked"
                              className="me-2"
                            />
                          )}
                        />
                      </div>
                    </td>
                    <td>
                      <Controller
                        name="overDueAmountForNotice"
                        control={control}
                        rules={{
                          required: "Please enter a valid number.",
                          validate: (value) => {
                            if (!value || isNaN(value))
                              return "Please enter a valid number.";
                            if (value <= 0)
                              return "Amount must be greater than zero.";
                            if (
                              watchOverDueChargesForNotice === "Percentage" &&
                              value > 100
                            ) {
                              return "Percentage amount must be less than or equal to 100.";
                            }
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            disabled={view}
                            onChange={(e) => {
                              let noticeCharge = e.target.value.replace(
                                /[^0-9.]/g,
                                "",
                              );
                              field.onChange(noticeCharge);
                            }}
                            invalid={!!errors.overDueAmountForNotice}
                          />
                        )}
                      />
                      <FormFeedback>
                        {errors.overDueAmountForNotice?.message}
                      </FormFeedback>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="align-middle fw-bold">
                        Auction Charges <span style={{ color: "red" }}>*</span>
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="me-1">Percentage</span>
                        <Controller
                          name="overDueChargesForAuction"
                          control={control}
                          rules={{ required: "Please select a type" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="radio"
                              disabled={view}
                              checked={field.value === "Percentage"}
                              onChange={() => field.onChange("Percentage")}
                              id="basic-cb-unchecked"
                              className="me-2"
                            />
                          )}
                        />
                        <span className="me-1">Flat</span>
                        <Controller
                          name="overDueChargesForAuction"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="radio"
                              disabled={view}
                              checked={field.value === "Flat"}
                              onChange={() => field.onChange("Flat")}
                              id="basic-cb-unchecked"
                              className="me-2"
                            />
                          )}
                        />
                      </div>
                    </td>
                    <td>
                      <Controller
                        name="overDueAmountForAuction"
                        control={control}
                        rules={{
                          required: "Please enter a valid number.",
                          validate: (value) => {
                            if (!value || isNaN(value))
                              return "Please enter a valid number.";
                            if (value <= 0)
                              return "Amount must be greater than zero.";
                            if (
                              watchOverDueChargesForAuction === "Percentage" &&
                              value > 100
                            ) {
                              return "Percentage amount must be less than or equal to 100.";
                            }
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            disabled={view}
                            onChange={(e) => {
                              let AuctionCharge = e.target.value.replace(
                                /[^0-9.]/g,
                                "",
                              );
                              field.onChange(AuctionCharge);
                            }}
                            invalid={!!errors.overDueAmountForAuction}
                          />
                        )}
                      />
                      <FormFeedback>
                        {errors.overDueAmountForAuction?.message}
                      </FormFeedback>
                    </td>
                  </tr>
                </tbody>
              </Table>
              {/* </fieldset> */}

              <Row className="mt-3">
                <Col
                  className="d-flex justify-content-end"
                  md={{ size: 9, offset: 3 }}
                >
                  <Button
                    className="me-1"
                    outline
                    onClick={resetForm}
                    color="secondary"
                    type="reset"
                  >
                    Reset
                  </Button>
                  <Button color="primary" disabled={loadinng} type="submit">
                    {!loadinng ? (
                      uid ? (
                        "Update"
                      ) : (
                        "Submit"
                      )
                    ) : (
                      <>
                        <span className="me-1">Loading..</span>
                        <Spinner size="sm" />
                      </>
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default ShipDetails;
