import { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, DownloadCloud, Eye, FileText, X } from "react-feather";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import useJwt from "@src/auth/jwt/useJwt";
import {
  Badge,
  Button,
  Col,
  Form,
  Label,
  Row,
  UncontrolledAlert,
} from "reactstrap";

const Document = ({ stepper, slipIID, sId }) => {
  const [loading, setLoading] = useState(false);
  const [ermsz, setErrmsz] = useState("");
  const myId = useParams();
  const navigate = useNavigate();

  const { handleSubmit, setValue, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      IdentityDocument: { lastUploaded: "", currentFile: null },
      ProofOfAddress: { lastUploaded: "", currentFile: null },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await useJwt.getSingleDocuments(slipIID || sId?.id);

        const doc = response.data.content.result
          .filter((item) =>
            ["IdentityDocument", "ProofOfAddress"].includes(item.documentName)
          )
          .reduce((object, item) => {
            const { uid, documentName, documentFilePath } = item;
            object[documentName] = { uid, lastUploaded: documentFilePath, currentFile: null };
            return object;
          }, {});

        if (Object.keys(doc).length) {
          reset(doc);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    if (slipIID || sId?.id) fetchData();
  }, [slipIID, sId?.id, reset]);

  const onSubmit = async (data) => {
    setErrmsz("");
    const updatedDataList = Object.keys(data)
      .filter((key) => ["IdentityDocument", "ProofOfAddress"].includes(key))
      .reduce((obj, key) => {
        if (!data[key].currentFile) return obj;

        const formData = new FormData();
        formData.append("documentName", key);
        formData.append("documentFile", data[key].currentFile);
        formData.append("slipId", slipIID || sId?.id);

        obj[key] = obj[key] || {};
        obj[key]["formData"] = formData;
        if (data[key].uid) obj[key]["uid"] = data[key].uid;
        return obj;
      }, {});

    try {
      const results = await Promise.all(
        Object.values(updatedDataList).map(async (details) => {
          if (details?.uid) {
            await useJwt.updateDoc(details.uid, details.formData);
            return { type: "update" };
          } else {
            await useJwt.slipDocument(details.formData);
            return { type: "create" };
          }
        })
      );

      const updatedCount = results.filter((res) => res.type === "update").length;
      const createdCount = results.filter((res) => res.type === "create").length;

      let message = "";
      if (updatedCount > 0 && createdCount > 0) {
        message = `Successfully updated ${updatedCount} and created ${createdCount} records!`;
      } else if (updatedCount > 0) {
        message = `Successfully updated ${updatedCount} records!`;
      } else if (createdCount > 0) {
        message = `Successfully created ${createdCount} records!`;
      }

      if (message) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: message,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate("/event_index");
        });
      }
    } catch (error) {
      console.error(error);
      const errMsz = error.response?.data?.content || "Something went wrong!";
      setErrmsz(errMsz);
      Swal.fire({
        icon: "error",
        title: "Document Error!",
        text: errMsz,
      });
    }
  };

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
  };

  const renderFilePreview = (file) => {
    if (file?.type?.startsWith("image")) {
      return <img className="rounded" alt={file.name} src={URL.createObjectURL(file)} height="28" width="28" />;
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
          <Label className="mb-2">{label} <span style={{ color: "red" }}>*</span></Label>
          {lastUploaded && (
            <Badge color="success" style={{ cursor: "pointer" }} onClick={() => window.open(lastUploaded, "_blank")}>
              <Eye size={12} /> Last File Uploaded
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
                  <div className="file-preview me-2">{renderFilePreview(file)}</div>
                  <div>
                    <p className="mb-0 fw-semibold">{file.name}</p>
                    <p className="mb-0 text-muted">{renderFileSize(file.size)}</p>
                  </div>
                </div>
                <Button color="danger" outline size="sm" onClick={() => setValue(`${fieldName}.currentFile`, null)}>
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <>
                <DownloadCloud size={38} />
                <p className="text-secondary mt-2">
                  Drop files here or click{" "}
                  <a href="/" onClick={(e) => e.preventDefault()}>browse</a>{" "}
                  through your machine
                </p>
              </>
            )}
          </div>
        </div>
        {errors[fieldName] && <span className="text-danger">{errors[fieldName].message}</span>}
      </Col>
    );
  };

  return (
    <Fragment>
      {ermsz && (
        <UncontrolledAlert color="danger">
          <div className="alert-body">
            <strong>Error: </strong>{ermsz}
          </div>
        </UncontrolledAlert>
      )}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {["IdentityDocument", "Contract"].map((field) => renderDropzone(field, field))}
        </Row>

        <div className="d-flex justify-content-between mt-3">
          <Button type="button" color="primary" onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className="align-middle me-1" /> Previous
          </Button>
          <Button type="submit" color="success" disabled={loading}>
            Submit
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default Document;
