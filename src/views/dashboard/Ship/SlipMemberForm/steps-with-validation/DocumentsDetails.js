import { Fragment, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DownloadCloud } from "react-feather";
import toast from "react-hot-toast";
import { set, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight } from "react-feather";

import {
  Button,
  Row,
  Col,
  Label,
  Card,
  CardBody,
  CardTitle,
  Form,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";

// ** Validation Schema
const schema = yup.object().shape({
  contractFile: yup
    .mixed()
    .required("Contract file is required")
    .test(
      "fileFormat",
      "File must be .xlsx, .xls, .csv, .pdf, or .doc",
      (value) => {
        return (
          value &&
          [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
            "application/pdf",
            "application/msword",
          ].includes(value.type)
        );
      }
    ),
  identityDocumentFile: yup
    .mixed()
    .required("Identity document file is required")
    .test(
      "fileFormat",
      "File must be .xlsx, .xls, .csv, .pdf, or .doc",
      (value) => {
        return (
          value &&
          [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
            "application/pdf",
            "application/msword",
          ].includes(value.type)
        );
      }
    ),
  registrationFile: yup
    .mixed()
    .required("Registration file is required")
    .test(
      "fileFormat",
      "File must be .xlsx, .xls, .csv, .pdf, or .doc",
      (value) => {
        return (
          value &&
          [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
            "application/pdf",
            "application/msword",
          ].includes(value.type)
        );
      }
    ),
  insuranceFile: yup
    .mixed()
    .required("Insurance file is required")
    .test(
      "fileFormat",
      "File must be .xlsx, .xls, .csv, .pdf, or .doc",
      (value) => {
        return (
          value &&
          [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
            "application/pdf",
            "application/msword",
          ].includes(value.type)
        );
      }
    ),
});

const FileUploadForm = ({ stepper }) => {
  const [uploadedFiles, setUploadedFiles] = useState({
    contractFile: null,
    identityDocumentFile: null,
    registrationFile: null,
    insuranceFile: null,
  });
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors, // This will help clear errors when a file is uploaded
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Submit form data to the API
  const onSubmit = async (data) => {
    
    const formData = new FormData();
    formData.append("contractFile", data.contractFile);
    formData.append("identityDocumentFile", data.identityDocumentFile);
    formData.append("registrationFile", data.registrationFile);
    formData.append("insuranceFile", data.insuranceFile);

    // try {
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });
// setLoading(true);
    // const response = await useJwt.slipDocument(formData);
    // if (response.status === 200) {

    toast.success("Files uploaded successfully!");

    console.log(data);

    // console.log('API Response:', response.data);
    // } else {
    // toast.error('Failed to upload files.');
    // console.error('API Error:', response.statusText);
    //   }
    // } catch (error) {
    //   toast.error('An error occurred while uploading files.');
    //   console.error('Error:', error); // Handle unexpected errors
    // }
    // finally
    setLoading(false);
  // }
  };

  const handleDrop = (acceptedFiles, fieldName) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      const fileType = file.type;

      if (
        [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/csv",
          "application/pdf",
          "application/msword",
        ].includes(fileType)
      ) {
        setUploadedFiles((prevState) => ({
          ...prevState,
          [fieldName]: file.name,
        }));
        setValue(fieldName, file, { shouldValidate: true });
        clearErrors(fieldName); // Clear any previous validation errors
        toast.success(`${file.name} uploaded successfully.`);
      } else {
        toast.error(
          "Invalid file type. Only .xlsx, .xls, .csv, .pdf, and .doc are allowed."
        );
      }
    }
  };

  const renderDropzone = (fieldName, label) => {
    const { getRootProps, getInputProps } = useDropzone({
      multiple: false,
      onDrop: (acceptedFiles) => handleDrop(acceptedFiles, fieldName),
    });

    return (
      <Col sm="6" className="mb-3">
        <Label className="mb-2">
          {label} <span style={{ color: "red" }}>*</span>
        </Label>
        <div
          {...getRootProps({
            className: "dropzone",
            style: {
              border: "2px dashed #d3d3d3",
              borderRadius: "8px",
              padding: "20px",
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
              textAlign: "center",
              height: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          })}
        >
          <input {...getInputProps()} />
          <div className="d-flex align-items-center justify-content-center flex-column">
            {uploadedFiles[fieldName] ? (
              <span
                className="text-success p-2 text-truncate"
                style={{
                  maxWidth: "100%", // Prevents text from breaking layout
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {uploadedFiles[fieldName]}
              </span>
            ) : (
              <>
                <DownloadCloud size={64} />
                <h5>Drop Files here or click to upload</h5>
                <p className="text-secondary">
                  Drop files here or click{" "}
                  <a href="/" onClick={(e) => e.preventDefault()}>
                    browse
                  </a>{" "}
                  through your machine
                </p>
              </>
            )}
          </div>
        </div>
        {errors[fieldName] && (
          <span className="text-danger">{errors[fieldName].message}</span>
        )}
      </Col>
    );
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardBody>
            <CardTitle tag="h5">Upload Documents</CardTitle>
            <Row>
              {renderDropzone("contractFile", "Contract File")}
              {renderDropzone("identityDocumentFile", "Identity Document File")}
              {renderDropzone("registrationFile", "Registration File")}
              {renderDropzone("insuranceFile", "Insurance File")}
            </Row>
          </CardBody>
        </Card>
        <div className="d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button>

          {/* Submit and Reset Button Group */}

          <Button
            disabled={loading}
            type="submit"
            color="success"
            className="btn-next"
          >
            <span className="align-middle d-sm-inline-block d-none">
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" /> Submitting...
                </>
              ) : (
                "Submit"
              )}{" "}
            </span>
            <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default FileUploadForm;
