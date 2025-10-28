import useJwt from "@src/auth/jwt/useJwt";
import { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, DownloadCloud, Eye, FileText, X } from "react-feather";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Col,
  Form,
  Label,
  Row,
  UncontrolledAlert,
} from "reactstrap";
import Swal from "sweetalert2";

const Document = ({ stepper, slipIID, sId, allEventData, listData }) => {
  const [loading, setLoading] = useState(false);
  const [ermsz, setErrmsz] = useState("");
  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      IdentityDocument: { uid: "", lastUploaded: "", currentFile: null },
      Contract: { uid: "", lastUploaded: "", currentFile: null },
    },
  });

  // Fetch previously uploaded documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventId = allEventData?.eventId || listData?.uid;
        if (!eventId) return;

        const response = await useJwt.getEventDocument(eventId);
        const docList = response?.data?.content?.result || [];

        const doc = docList
          .filter((item) =>
            ["IdentityDocument", "Contract"].includes(item.documentName)
          )
          .reduce((acc, item) => {
            const { uid, documentName, documentFilePath } = item;
            acc[documentName] = {
              uid,
              lastUploaded: documentFilePath,
              currentFile: null,
            };
            return acc;
          }, {});

        if (Object.keys(doc).length > 0) reset(doc);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchData();
  }, [allEventData, reset]);

  // Submit handler (create or update)
  const onSubmit = async (data) => {
    setErrmsz("");
    setLoading(true);

    const uploadList = Object.keys(data)
      .filter((key) => ["IdentityDocument", "Contract"].includes(key))
      .reduce((arr, key) => {
        const fileData = data[key];
        const file = fileData?.currentFile;
        if (!file && !fileData?.uid) return arr; // Skip empty entries

        const formData = new FormData();
        formData.append(
          "eventId",
          allEventData?.eventId || listData?.Rowdata?.id
        );
        formData.append("documentName", key);
        if (file) formData.append("documentFile", file);

        arr.push({ formData, uid: fileData?.uid, name: key });
        return arr;
      }, []);

    if (!uploadList.length) {
      Swal.fire({
        icon: "warning",
        title: "No Files!",
        text: "Please upload or update at least one document before submitting.",
      });
      setLoading(false);
      return;
    }

    try {
      const results = await Promise.all(
        uploadList.map(async ({ formData, uid }) => {
          if (uid || listData?.uid) {
            // update existing document
            await useJwt.eventDocUpdate(uid || listData?.uid, formData);
            return "updated";
          } else {
            // create new document
            await useJwt.eventDocument(formData);
            return "created";
          }
        })
      );

      const updatedCount = results.filter((r) => r === "updated").length;
      const createdCount = results.filter((r) => r === "created").length;

      let message = "";
      if (updatedCount && createdCount)
        message = `Successfully updated ${updatedCount} and created ${createdCount} records!`;
      else if (updatedCount)
        message = `Successfully updated ${updatedCount} document(s)!`;
      else message = `Successfully uploaded ${createdCount} document(s)!`;

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: message,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => navigate("/event_index"));
    } catch (error) {
      console.error(error);
      const errMsz = error.response?.data?.content || "Something went wrong!";
      setErrmsz(errMsz);
      Swal.fire({
        icon: "error",
        title: "Upload Failed!",
        text: errMsz,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000)
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
  };

  const renderFilePreview = (file) => {
    if (file?.type?.startsWith("image")) {
      return (
        <img
          className="rounded"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="28"
          width="28"
        />
      );
    }
    return <FileText size="28" />;
  };

  const renderDropzone = (fieldName, label) => {
    const { getRootProps, getInputProps } = useDropzone({
      multiple: false,
      onDrop: (acceptedFiles) => {
        setValue(`${fieldName}.currentFile`, acceptedFiles[0]);
      },
    });

    const file = watch(fieldName)?.currentFile;
    const lastUploaded = watch(fieldName)?.lastUploaded;

    return (
      <Col sm="6" xs="12" className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <Label className="mb-2">
            {label} <span style={{ color: "red" }}>*</span>
          </Label>
          {lastUploaded && (
            <Badge
              color="success"
              style={{ cursor: "pointer" }}
              onClick={() => window.open(lastUploaded, "_blank")}
            >
              <Eye size={12} /> View Document
            </Badge>
          )}
        </div>

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
            {file ? (
              <div className="d-flex align-items-center justify-content-between w-100 px-2">
                <div className="d-flex align-items-center">
                  <div className="file-preview me-2">
                    {renderFilePreview(file)}
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold">{file.name}</p>
                    <p className="mb-0 text-muted">
                      {renderFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  color="danger"
                  outline
                  size="sm"
                  onClick={() => setValue(`${fieldName}.currentFile`, null)}
                >
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <>
                <DownloadCloud size={38} />
                <p className="text-secondary mt-2">
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
      {ermsz && (
        <UncontrolledAlert color="danger">
          <div className="alert-body">
            <strong>Error: </strong>
            {ermsz}
          </div>
        </UncontrolledAlert>
      )}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {["IdentityDocument", "Contract"].map((field) =>
            renderDropzone(field, field)
          )}
        </Row>

        <div className="d-flex justify-content-between mt-3">
          <Button
            type="button"
            color="primary"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft size={14} className="align-middle me-1" /> Previous
          </Button>
          <Button type="submit" color="success" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default Document;
