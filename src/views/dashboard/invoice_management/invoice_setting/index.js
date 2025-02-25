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
import { useForm, Controller } from "react-hook-form";

import { useState } from "react";
import { FormGroup } from "reactstrap";
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

  const onSubmit = (data) => {
    const payload = {
      data,
      ...files,
    };
    console.log("Form Data:", payload);
  };

  const [files, setFiles] = useState({});

  // Dynamic file change handler
  const handleFileChange = (e, fieldName) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [fieldName]: selectedFile,
      }));
    }
  };

  // Remove file for a specific field
  const handleRemoveFile = (fieldName) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [fieldName]: null,
    }));
  };

  // Render file preview
  const renderFilePreview = (file) => {
    if (file && file.type.startsWith("image")) {
      return (
        <img
          className="rounded mt-2"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="100"
        />
      );
    }
    return null;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Invoice Settings</CardTitle>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-1">
            <Label sm="3" for="invoiceID">
              Invoice ID
            </Label>
            <Col sm="9">
              <Controller
                control={control}
                name="invoiceID"
                rules={{ required: "Invoice ID is required" }}
                render={({ field }) => (
                  <div className="demo-inline-spacing">
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="sequent"
                        value="Sequent"
                        checked={field.value === "Sequent"}
                        onChange={() => field.onChange("Sequent")}
                      />
                      <Label className="form-check-label" for="sequent">
                        Sequent
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
              {errors.invoiceID && (
                <p className="text-danger">{errors.invoiceID.message}</p>
              )}
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="InvoiceNotes">
              Invoice Notes
            </Label>
            <Col sm="9">
              <Controller
                control={control}
                name="InvoiceNotes"
                rules={{ required: "Invoice Notes are required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="InvoiceNotes"
                    placeholder="Invoice Notes"
                    {...field}
                  />
                )}
              />
              {errors.InvoiceNotes && (
                <p className="text-danger">{errors.InvoiceNotes.message}</p>
              )}
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="IBANCode">
              IBAN Code
            </Label>
            <Col sm="9">
              <Controller
                control={control}
                name="IBANCode"
                rules={{
                  required: "IBAN Code is required",
                  pattern: {
                    value: /^[A-Z0-9]+$/,
                    message: "Invalid IBAN Code format",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="IBANCode"
                    placeholder="IBAN Code"
                    {...field}
                  />
                )}
              />
              {errors.IBANCode && (
                <p className="text-danger">{errors.IBANCode.message}</p>
              )}
            </Col>
          </Row>
          <Row className="mb-1">
            <Label sm="3" for="currency">
              Payment Settings
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
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="InvoicePrefix">
              Invoice Prefix
            </Label>
            <Col sm="9">
              <Controller
                name="InvoicePrefix"
                control={control}
                rules={{
                  required: "Invoice Prefix is required",
                  min: {
                    value: 0,
                    message: "Invoice Prefix cannot be negative",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="InvoicePrefix"
                    placeholder="Invoice Prefix"
                    {...field}
                  />
                )}
              />
              {errors.InvoicePrefix && (
                <p className="text-danger">{errors.InvoicePrefix.message}</p>
              )}
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="WalletID">
              Wallet ID
            </Label>
            <Col sm="9">
              <Controller
                control={control}
                name="WalletID"
                rules={{
                  required: "Wallet ID is required",
                  minLength: {
                    value: 6,
                    message: "Wallet ID must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    id="WalletID"
                    placeholder="Wallet ID"
                  />
                )}
              />
              {errors.WalletID && (
                <p className="text-danger">{errors.WalletID.message}</p>
              )}
            </Col>
          </Row>

          <Row className="mb-1">
            <Label sm="3" for="invoiceTerms">
              Invoice Terms & Conditions
            </Label>
            <Col sm="9">
              <Controller
                control={control}
                name="invoiceTerms"
                rules={{
                  required: "Terms & Conditions are required",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="textarea"
                    id="invoiceTerms"
                    rows="3"
                    placeholder="Terms & Conditions"
                  />
                )}
              />
              {errors.invoiceTerms && (
                <p className="text-danger">{errors.invoiceTerms.message}</p>
              )}
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
                // rules={{
                //   required: "Invoice Signature is required",
                // }}
                render={({ field }) => (
                  <Input
                    type="file"
                    id="invoiceSignature"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "invoiceSignature")}
                  />
                )}
              />
              {/* {errors.invoiceSignature && (
            <p className="text-danger">{errors.invoiceSignature.message}</p>
          )} */}

              {files.invoiceSignature && (
                <div className="mt-2 border rounded p-2">
                  <h6>File Details:</h6>
                  <p>Name: {files.invoiceSignature.name}</p>
                  <p>Size: {renderFileSize(files.invoiceSignature.size)}</p>
                  {renderFilePreview(files.invoiceSignature)}
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
            <Label sm="3" for="profilePicture">
              Profile Picture <span style={{ color: "red" }}>*</span>
            </Label>
            <Col sm="9">
              <Controller
                control={control}
                name="profilePicture"
                // rules={{
                //   required: "Profile Picture is required",
                // }}
                render={({ field }) => (
                  <Input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profilePicture")}
                  />
                )}
              />
              {/* {errors.profilePicture && (
            <p className="text-danger">{errors.profilePicture.message}</p>
          )} */}

              {files.profilePicture && (
                <div className="mt-2 border rounded p-2">
                  <h6>File Details:</h6>
                  <p>Name: {files.profilePicture.name}</p>
                  <p>Size: {renderFileSize(files.profilePicture.size)}</p>
                  {renderFilePreview(files.profilePicture)}
                  <div className="d-flex justify-content-end mt-2">
                    <Button
                      color="danger"
                      outline
                      onClick={() => handleRemoveFile("profilePicture")}
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
              <Button className="me-1" color="primary" type="submit">
                Submit
              </Button>

              <Button outline color="secondary" type="reset">
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
