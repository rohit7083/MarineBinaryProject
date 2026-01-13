import useJwt from "@src/auth/jwt/useJwt";
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";
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
} from "reactstrap";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
const HorizontalForm = () => {
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
      invoiceIdType: "",
      currency: "",
      invoicePrefix: "",

      invoiceSignature: null,
      invoiceLogo: null,
    },
  });
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [resData, setResData] = useState(null);
  const [getLoading, setgetLoading] = useState(false);

  const [imgSignature, setImgSignature] = useState("");
  const [imgLogo, setImgLogo] = useState("");
  const [previews, setPreviews] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceSettings = async () => {
      try {
        setgetLoading(true);
        const res = await useJwt.getInvoice();

         (res);

        if (res.status === 200 && res.data) {
          const resData = res.data?.content?.result[0];
          setResData(resData);
          setValue("invoiceIdType", resData.invoiceIdType);
          setValue("currency", resData.currency);
          setValue("invoicePrefix", resData.invoicePrefix);
          setValue("invoiceNote", resData.invoiceNote);
          setValue(
            "invoiceTermsAndConditions",
            resData.invoiceTermsAndConditions
          );
        }
      } catch (error) {
        console.error("Error fetching invoice settings:", error);
      } finally {
        setgetLoading(false);
      }
    };

    fetchInvoiceSettings();
  }, []);

  // useEffect(() => {
  //   const loadFiles = async () => {
  //     try {
  //       const resLogo = await useJwt.getLogo(resData.uid);
  //        (resLogo);

  //       const resSignature = await useJwt.getSignature(resData.uid);
  //        (resSignature);
  //       setImgSignature(URL.createObjectURL(resSignature?.data));
  //       // setFiles(resSignature?.data);
  //     } catch (error) {
  //        (error);
  //     }
  //   };
  //   if (resData?.uid) {
  //     loadFiles();
  //   }
  // }, [resData?.uid]);
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const sigRes = await useJwt.getSignature(resData.uid);
        const logoRes = await useJwt.getLogo(resData.uid);

        if (sigRes?.data) {
          const sigFile = new File([sigRes.data], "invoice-signature.png", {
            type: sigRes.data.type || "image/png",
          });

          setFiles((f) => ({ ...f, invoiceSignature: sigFile }));
          setValue("invoiceSignature", sigFile);

          setPreviews((p) => ({
            ...p,
            invoiceSignature: URL.createObjectURL(sigFile),
          }));
        }

        if (logoRes?.data) {
          const logoFile = new File([logoRes.data], "invoice-logo.png", {
            type: logoRes.data.type || "image/png",
          });

          setFiles((f) => ({ ...f, invoiceLogo: logoFile }));
          setValue("invoiceLogo", logoFile);

          setPreviews((p) => ({
            ...p,
            invoiceLogo: URL.createObjectURL(logoFile),
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (resData?.uid) loadFiles();
  }, [resData?.uid]);

   ("signature", imgSignature);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("invoiceNote", data.invoiceNote);
    formData.append("invoiceIdType", data.invoiceIdType);
    formData.append("currency", data.currency);
    formData.append("invoicePrefix", data.invoicePrefix);
    formData.append(
      "invoiceTermsAndConditions",
      data.invoiceTermsAndConditions
    );
    formData.append("invoiceSignature", files.invoiceSignature);
    formData.append("invoiceLogo", files.invoiceLogo);

    try {
      setLoading(true);

      if (resData && resData.id) {
        const updateRes = await useJwt.updateInvoice(resData?.uid, formData);
        if (updateRes.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Invoice Settings Updated successfully",
            life: 2000,
          });
          return;
        }
      } else {
        const res = await useJwt.invoiceSettings(formData);
        if (res.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Invoice Settings Created successfully",
            life: 2000,
          });
        }
      }
    } catch (error) {
       (error);
      if (error.response && error.response.data) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail:
            error.response.data.content || "Failed to create Invoice Settings",
          life: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  };


  const [files, setFiles] = useState({});

  const handleFileChange = (e, fieldName, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFiles((prev) => ({ ...prev, [fieldName]: file }));
    setPreviews((prev) => ({ ...prev, [fieldName]: previewUrl }));

    field.onChange(file);
  };

  // Remove file for a specific field
  const handleRemoveFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    setPreviews((prev) => ({ ...prev, [fieldName]: null }));
    setValue(fieldName, null, { shouldValidate: true });
  };

  const renderFilePreview = (previewUrl) => {
    if (!previewUrl) return null;

    return (
      <img
        src={previewUrl}
        alt="preview"
        height="100"
        className="rounded mt-2"
      />
    );
  };

  const renderFileSize = (size) => {
    if (size) {
      if (Math.round(size / 100) / 10 > 1000) {
        return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
      } else {
        return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
      }
    }
    return null;
  };

  if (getLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <Spinner color={"primary"} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">
          {" "}
          <ArrowLeft
            style={{
              cursor: "pointer",
              transition: "color 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
            onClick={() => navigate(-1)}
          />{" "}
          Invoice Settings{" "}
        </CardTitle>
      </CardHeader>
      <Toast ref={toast} />

      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-1">
            <Label sm="3" for="invoiceIdType">
              Invoice ID <span style={{ color: "red" }}>*</span>
            </Label>
            <Col sm="9">
              <Controller
                control={control}
                name="invoiceIdType"
                rules={{ required: "Invoice ID is required" }}
                render={({ field }) => (
                  <div className="demo-inline-spacing">
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="sequent"
                        value="Sequence"
                        checked={field.value === "Sequence"}
                        onChange={() => field.onChange("Sequence")}
                      />
                      <Label className="form-check-label" for="sequent">
                        Sequence
                      </Label>
                    </div>
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="random"
                        value="Random"
                        checked={field.value === "Random"}
                        onChange={() => field.onChange("Random")}
                      />
                      <Label className="form-check-label" for="random">
                        Random
                      </Label>
                    </div>
                  </div>
                )}
              />
              {errors.invoiceIdType && (
                <p className="text-danger mb-0">
                  <small className="text-danger">
                    {errors.invoiceIdType.message}
                  </small>
                </p>
              )}
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="currency">
              Currency <span style={{ color: "red" }}>*</span>
            </Label>
            <Col sm="9">
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <div className="demo-inline-spacing">
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="USD-active"
                        value="USD"
                        checked={field.value === "USD"}
                        onChange={() => field.onChange("USD")}
                      />
                      <Label className="form-check-label" for="USD-active">
                        USD
                      </Label>
                    </div>
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="CAD-inactive"
                        value="CAD"
                        checked={field.value === "CAD"}
                        onChange={() => field.onChange("CAD")}
                      />
                      <Label className="form-check-label" for="CAD-inactive">
                        CAD
                      </Label>
                    </div>
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="EUR-inactive"
                        value="EUR"
                        checked={field.value === "EUR"}
                        onChange={() => field.onChange("EUR")}
                      />
                      <Label className="form-check-label" for="EUR-inactive">
                        EUR
                      </Label>
                    </div>
                  </div>
                )}
              />

              {errors.currency && (
                <p className="text-danger mb-0">
                  <small className="text-danger">
                    {errors.currency.message}
                  </small>
                </p>
              )}
            </Col>
          </Row>

          {/* Invoice Prefix */}
          <Row className="mb-1">
            <Label sm="3">
              Invoice Prefix <span style={{ color: "red" }}>*</span>
            </Label>
            <Col sm="9">
              <Controller
                name="invoicePrefix"
                control={control}
                rules={{
                  required: "Invoice Prefix is required",
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "Only letters allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    onKeyPress={(e) => {
                      if (!/[A-Za-z]/.test(e.key)) e.preventDefault();
                    }}
                  />
                )}
              />
              <small className="text-danger">
                {errors.invoicePrefix?.message}
              </small>
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3">
              Invoice Note <span style={{ color: "red" }}>*</span>
            </Label>
            <Col sm="9">
              <Controller
                name="invoiceNote"
                control={control}
                rules={{
                  required: "Terms are required",
                  pattern: {
                    value: /^[A-Za-z0-9\s.,'-]+$/,
                    message: "Invalid characters used",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="textarea"
                    rows="3"
                    onKeyPress={(e) => {
                      if (!/[A-Za-z0-9]/.test(e.key)) e.preventDefault();
                    }}
                  />
                )}
              />
              <small className="text-danger">
                {errors.invoiceNote?.message}
              </small>
            </Col>
          </Row>

          {/* Terms */}
          <Row className="mb-1">
            <Label sm="3">
              Terms & Conditions <span style={{ color: "red" }}>*</span>
            </Label>
            <Col sm="9">
              <Controller
                name="invoiceTermsAndConditions"
                control={control}
                rules={{
                  required: "Terms are required",
                  pattern: {
                    value: /^[A-Za-z0-9\s.,'-]+$/,
                    message: "Invalid characters used",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="textarea"
                    rows="3"
                    onKeyPress={(e) => {
                      if (!/[A-Za-z0-9]/.test(e.key)) e.preventDefault();
                    }}
                  />
                )}
              />
              <small className="text-danger">
                {errors.invoiceTermsAndConditions?.message}
              </small>
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="invoiceSignature">
              Invoice Signature <span style={{ color: "red" }}>*</span>
            </Label>
            <Col sm="9">
              <Controller
                control={control}
                name="invoiceSignature"
                rules={{
                  required: !resData?.uid && "Invoice Signature is required",
                }}
                render={({ field }) => (
                  <Input
                    type="file"
                    id="invoiceSignature"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(e, "invoiceSignature", field)
                    }
                  />
                )}
              />
              {errors.invoiceSignature && (
                <p className="text-danger mb-0">
                  <small className="text-danger">
                    {errors.invoiceSignature.message}
                  </small>
                </p>
              )}

              {previews.invoiceSignature && (
                <div className="mt-2 border rounded p-2">
                  <h6>Preview:</h6>
                  {renderFilePreview(previews.invoiceSignature)}
                  <div className="d-flex justify-content-end mt-2">
                    <Button
                      color="danger"
                      outline
                      onClick={() => handleRemoveFile("invoiceSignature")}
                    >
                      Remove File
                    </Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="invoiceLogo">
              Invoice Logo <span style={{ color: "red" }}>*</span>
            </Label>
            <Col sm="9">
              <Controller
                control={control}
                name="invoiceLogo"
                rules={{
                  required: !resData?.uid && "Invoice Logo is required",
                }}
                render={({ field }) => (
                  <Input
                    type="file"
                    id="invoiceLogo"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "invoiceLogo", field)}
                  />
                )}
              />
              {errors.invoiceLogo && (
                <p className="text-danger mb-0">
                  <small className="text-danger">
                    {errors.invoiceLogo.message}
                  </small>
                </p>
              )}
              {previews.invoiceLogo && (
                <div className="mt-2 border rounded p-2">
                  <h6>Preview:</h6>
                  {renderFilePreview(previews.invoiceLogo)}
                  <div className="d-flex justify-content-end mt-2">
                    <Button
                      color="danger"
                      outline
                      onClick={() => handleRemoveFile("invoiceLogo")}
                    >
                      Remove File
                    </Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>

          <Row>
            <Col className="d-flex" md={{ size: 9, offset: 3 }}>
              <Button
                className="me-1"
                disabled={loading}
                color="primary"
                type="submit"
              >
                {loading ? (
                  <>
                    loading.. <Spinner color="white" size="sm" />
                  </>
                ) : (
                  <>{resData?.uid ? "Update" : "Submit"}</>
                )}
              </Button>

              <Button
                outline
                color="secondary"
                type="button"
                // onClick={() => reset()}

                onClick={() => {
                  reset({
                    invoiceNote: "",
                    invoiceTermsAndConditions: "",
                    invoiceIdType: "",
                    currency: "",
                    invoicePrefix: "",
                    invoiceSignature: null,
                    invoiceLogo: null,
                  });
                  setFiles({});
                }}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};
export default HorizontalForm;
