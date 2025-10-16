import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/file-uploader/file-uploader.scss";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DownloadCloud, Eye, FileText, Upload, X } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Spinner,
} from "reactstrap";

const DocumentUploader = ({
  label,
  name,
  handleChangeDocument,
  uploadedFiles,
  slipId,
  fetchLoader,
  uidForDocuments = [], // array of { documentName, uid }
}) => {
  const [uploadLoader, setUploadLoader] = useState(false);

  // Find the UID for the current document type
  const getDocumentUid = (documentName) => {
    const doc = uidForDocuments.find((d) => d.documentName === documentName);
    return doc ? doc.uid : null;
  };
  const toast = useRef(null);

  // Only allow single file
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = Object.assign(acceptedFiles[0]);
      handleChangeDocument(name, [file]); // Replace existing file
    },
  });

  const renderFilePreview = (file) => {
    debugger

    if(file.uid && file.success){
            return (
        <img
          className="rounded"
          alt={file.file.name}
          src={file.preview}
          height="28"
          width="28"
        />
      );
    }
    if(file.uid && !file.success){
      return null
    }
    if (file.preview)
      return (
        <img
          className="rounded"
          alt={file.name}
          src={file.preview}
          height="28"
          width="28"
        />
      );
    if (file.type && file.type.startsWith("image"))
      return (
        <img
          className="rounded"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="28"
          width="28"
        />
      );
    return <FileText size="28" />;
  };

  const handleRemoveFile = () => {
    handleChangeDocument(name, []);
  };

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000)
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [uploadedFiles]);

  // Upload or update single file
  const handleUploadFile = async (file) => {
    if (!file) return;

    const documentUid = getDocumentUid(name);
    const formData = new FormData();
    formData.append("slipId", slipId);
    formData.append("documentName", name);
    formData.append("documentFile", file);
    for (let [key, value] of formData.entries()) {
      console.table(key, value);
    }
    try {
      if (documentUid) {
        // Update existing document
        setUploadLoader(true);
        const response = await useJwt.updateDocuments(documentUid, formData);
        console.log(`Document [${name}] updated successfully:`, response);
        if (response?.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Document updated successfully",
            life: 2000,
          });
        }
      } else {
        setUploadLoader(true);
        // Create new document
        const response = await useJwt.slipDocument(formData);
        console.log(`New document [${name}] created successfully:`, response);
        if (response?.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Document Created successfully",
            life: 2000,
          });
        }
        // Optionally, update uid in parent state
        if (response.data?.uid) {
          file.uid = response.data.uid;
        }
      }
    } catch (error) {
      console.error(`Error uploading document [${name}]:`, error);
      if (error?.response) {
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail: `${error?.response?.data?.content}`,
          life: 2000,
        });
      }
    } finally {
      setUploadLoader(false);
    }
  };

  // View document in new tab
  const handleViewFile = (file) => {
    let url = file.preview || null;

    // If it’s an existing file, construct URL from API
    if (!url && file.uid) {
      url = `${process.env.REACT_APP_API_URL}/documents/${file.uid}`; // Adjust endpoint as per your API
    }

    if (url) window.open(url, "_blank");
    else console.warn("No preview available for this file.");
  };

  return (
    <Card>
      <Toast ref={toast} />

      <CardTitle tag="h5" className="mt-1 mx-2">
        {label}
      </CardTitle>
      <CardBody className="d-flex">
        <Col md={4}>
          <div
            {...getRootProps({ className: "dropzone" })}
            style={{ minHeight: "150px" }}
          >
            <input {...getInputProps()} />
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center p-2 border border-dashed rounded"
              style={{ cursor: "pointer" }}
            >
              <DownloadCloud size={40} className="mb-1 text-primary" />
              <h5 className="mb-2">Drop file here or click to upload</h5>
              <small className="text-secondary">
                Or{" "}
                <a
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="text-decoration-underline"
                >
                  browse
                </a>{" "}
                through your device
              </small>
            </div>
          </div>
        </Col>
        <Col md={8}>
          {fetchLoader ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }} // adjust height as needed
            >
              <>
                Loading Documents... <Spinner size="sm" />
              </>
            </div>
          ) : (
            <>
              {uploadedFiles.length > 0 && (
                <ListGroup className="mx-2 my-0">
                  {uploadedFiles.map((file, index) => (
                    <ListGroupItem
                      key={`${file.name}-${index}`}
                      className="border-0 shadow-sm mb-2 rounded"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <div className="d-flex flex-column flex-md-row align-items-start align-md-center justify-content-between p-2">
                        {/* File Info Section */}
                        <div className="file-details d-flex align-items-start align-md-center flex-grow-1 mb-2 mb-md-0">
                          <div
                            className="file-preview me-3 d-flex align-items-center justify-content-center rounded"
                            style={{
                              width: "48px",
                              height: "48px",
                              backgroundColor: "#e9ecef",
                              minWidth: "48px",
                            }}
                          >
                            {renderFilePreview(file)}
                          </div>
                          <div className="flex-grow-1">
                            <p
                              className="file-name mb-1 fw-semibold text-dark"
                              style={{ fontSize: "0.95rem" }}
                            >
                              {file.name}
                            </p>
                            <p
                              className="file-size mb-0 text-muted"
                              style={{ fontSize: "0.85rem" }}
                            >
                              {renderFileSize(file.size)}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons Section */}
                        <div className="d-flex flex-wrap gap-2 ms-0 ms-md-3">
                          <Button
                            color="success"
                            size="sm"
                            className="d-flex align-items-center px-3"
                            onClick={() => handleUploadFile(file)}
                            style={{ fontWeight: "500" }}
                            disabled={uploadLoader}
                          >
                            {uploadLoader ? (
                              <>
                                Loading...
                                <Spinner size="sm" />
                              </>
                            ) : (
                              <>
                                {" "}
                                <Upload size={14} className="me-1" />
                                Upload
                              </>
                            )}
                          </Button>
                          <Button
                            color="primary"
                            size="sm"
                            outline
                            className="d-flex align-items-center px-3"
                            onClick={() => handleViewFile(file)}
                          >
                            <Eye size={14} className="me-1" />
                            View
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            outline
                            className="d-flex align-items-center justify-content-center"
                            onClick={() => handleRemoveFile(file)}
                            style={{ width: "36px", padding: "0.25rem" }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </>
          )}
        </Col>
      </CardBody>
    </Card>
  );
};

export default DocumentUploader;
