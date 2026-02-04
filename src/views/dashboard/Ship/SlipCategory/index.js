import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Input,
  Label,
  Row,
  Spinner,
  Table,
  UncontrolledAlert,
} from "reactstrap";

import { Controller, useForm } from "react-hook-form";

function Index() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const location = useLocation();
  const uid = location.state?.uid || "";

  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      shipTypeName: "",
      dimensions: [],
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
    },
  });

  const watchShipType = watch("shipTypeName");

  // ─────────────────────────────────────────────
  // LOAD DATA INTO HOOK FORM
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return;

    const loadData = async () => {
      try {
        setFetching(true);
        const { data } = await useJwt.getslipCatogory(uid);
        const details = data.content.result.find((d) => d.uid === uid);

        if (!details) return;

        reset({
          shipTypeName: details.shipTypeName || "",
          marketRent: details?.marketRent,

          dimensions: details.dimensions || [],

          overDueChargesFor7Days: details.overDueChargesFor7Days || "",
          overDueAmountFor7Days:
            details.overDueAmountFor7Days?.toString() || "",

          overDueChargesFor15Days: details.overDueChargesFor15Days || "",
          overDueAmountFor15Days:
            details.overDueAmountFor15Days?.toString() || "",

          overDueChargesFor30Days: details.overDueChargesFor30Days || "",
          overDueAmountFor30Days:
            details.overDueAmountFor30Days?.toString() || "",

          overDueChargesForNotice: details.overDueChargesForNotice || "",
          overDueAmountForNotice:
            details.overDueAmountForNotice?.toString() || "",

          overDueChargesForAuction: details.overDueChargesForAuction || "",
          overDueAmountForAuction:
            details.overDueAmountForAuction?.toString() || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, [uid]);

  // ─────────────────────────────────────────────
  // SUBMIT HANDLER
  // ─────────────────────────────────────────────
  const onSubmit = async (form) => {
    setErrorMessage("");

    const payload = {
      ...form,
      dimensions: form.dimensions,
      marketRent: form?.marketRent,
      overDueAmountFor7Days: Number(form.overDueAmountFor7Days),
      overDueAmountFor15Days: Number(form.overDueAmountFor15Days),
      overDueAmountFor30Days: Number(form.overDueAmountFor30Days),
      overDueAmountForNotice: Number(form.overDueAmountForNotice),
      overDueAmountForAuction: Number(form.overDueAmountForAuction),
    };

    try {
      let res;
      if (uid) {
        res = await useJwt.updateslipCatogory(uid, payload);
      } else {
        res = await useJwt.postslipCatogory(payload);
      }

      toast.current.show({
        severity: "success",
        summary: uid ? "Updated Successfully" : "Created Successfully",
        detail: "Slip Category saved.",
        life: 2000,
      });

      setTimeout(() => navigate("/slip_Management/sliplist"), 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.response?.data?.content || "Unexpected Error");
    }
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  const dims = ["height", "width", "length", "power"];

  return (
    <Card>
      <ToastContainer transition={Bounce} theme="colored" />
      <Toast ref={toast} />

      <CardHeader>
        <CardTitle tag="h4">
          <ArrowLeft
            style={{ cursor: "pointer", marginRight: 10 }}
            onClick={() => window.history.back()}
          />
          {uid ? "Edit Slip Category" : "Add Slip Category"}
        </CardTitle>
      </CardHeader>

      {fetching ? (
        <div className="text-center my-5">
          <Spinner color="primary" style={{ width: "5rem", height: "5rem" }} />
        </div>
      ) : (
        <CardBody>
          {errorMessage && (
            <UncontrolledAlert color="danger">
              <div className="alert-body">
                <span className="text-danger fw-bold">
                  Error - {errorMessage}
                </span>
              </div>
            </UncontrolledAlert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* CATEGORY INPUT */}
            <Row className="mb-1">
              <Label sm="3">Category</Label>
              <Col sm="9">
                <Controller
                  name="shipTypeName"
                  control={control}
                  rules={{
                    required: "Category is required",
                    pattern: {
                      value: /^[A-Za-z0-9\s]+$/,
                      message: "Only letters and numbers allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter Category" />
                  )}
                />
                {errors.shipTypeName && (
                  <p className="text-danger">{errors.shipTypeName.message}</p>
                )}
              </Col>
            </Row>

            {/* DIMENSIONS CHECKBOXES */}
            <Row className="mb-1">
              <Label sm="3">Dimensions</Label>
              <Col sm="9">
                <Controller
                  name="dimensions"
                  control={control}
                  rules={{ required: "Select at least one dimension" }}
                  render={({ field }) => (
                    <>
                      {dims.map((dim) => (
                        <div className="form-check form-check-inline" key={dim}>
                          <Input
                            type="checkbox"
                            checked={field.value.includes(dim)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, dim]
                                : field.value.filter((v) => v !== dim);

                              field.onChange(newValue);
                            }}
                          />
                          <Label className="ms-1">{dim}</Label>
                        </div>
                      ))}
                    </>
                  )}
                />

                {errors.dimensions && (
                  <p className="text-danger">{errors.dimensions.message}</p>
                )}
              </Col>
            </Row>
            <Row className="mb-1">
              <Label sm="3" for="marketRent">
                Market Rent <span style={{ color: "red" }}>*</span>
              </Label>

              <Col sm="9">
                <Controller
                  name="marketRent"
                  control={control}
                  rules={{
                    required: "Market Rent is required",
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      id="marketRent"
                      placeholder="Enter Market Rent"
                      // disabled={}
                      invalid={!!errors.marketRent}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9.]/g, "");
                        field.onChange(value);
                      }}
                    />
                  )}
                />
                {errors.marketRent && (
                  <FormFeedback>{errors.marketRent.message}</FormFeedback>
                )}
              </Col>
            </Row>

            {/* CHARGES TABLE */}
            <Table responsive>
              <thead>
                <tr>
                  <th>Charges</th>
                  <th>Type</th>
                  <th>Value</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["7Days", "7 Days Charges"],
                  ["15Days", "15 Days Charges"],
                  ["30Days", "30 Days Charges"],
                  ["Notice", "Notice Charges"],
                  ["Auction", "Auction Charges"],
                ].map(([key, label]) => (
                  <tr key={key}>
                    <td className="fw-bold">
                      {label} <span className="text-danger">*</span>
                    </td>

                    {/* TYPE RADIO */}
                    <td>
                      <Controller
                        name={`overDueChargesFor${key}`}
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <>
                            <Input
                              type="radio"
                              checked={field.value === "Percentage"}
                              onChange={() => field.onChange("Percentage")}
                            />
                            <span className="ms-1 me-2">Percentage</span>

                            <Input
                              type="radio"
                              checked={field.value === "Flat"}
                              onChange={() => field.onChange("Flat")}
                            />
                            <span className="ms-1">Flat</span>
                          </>
                        )}
                      />
                      {errors[`overDueChargesFor${key}`] && (
                        <p className="text-danger">
                          {errors[`overDueChargesFor${key}`].message}
                        </p>
                      )}
                    </td>

                    {/* VALUE INPUT */}
                    <td>
                      <Controller
                        name={`overDueAmountFor${key}`}
                        control={control}
                        rules={{
                          required: "Amount required",
                          validate: (v) =>
                            !isNaN(Number(v)) || "Must be a number",
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.replace(/[^0-9.]/g, ""),
                              )
                            }
                            placeholder={`Enter ${label}`}
                          />
                        )}
                      />
                      {errors[`overDueAmountFor${key}`] && (
                        <p className="text-danger">
                          {errors[`overDueAmountFor${key}`].message}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* BUTTONS */}
            <Row>
              <Col
                className="d-flex justify-content-end"
                md={{ size: 9, offset: 3 }}
              >
                <Button
                  outline
                  type="button"
                  color="secondary"
                  onClick={() => reset()}
                >
                  Reset
                </Button>

                <Button
                  color="primary"
                  type="submit"
                  className="ms-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner size="sm" />
                  ) : uid ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      )}
    </Card>
  );
}

export default Index;
