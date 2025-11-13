import useJwt from "@src/auth/jwt/useJwt";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, DownloadCloud, Eye, FileText, X } from "react-feather";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Row, UncontrolledAlert } from "reactstrap";

const filesName = ["IdentityDocument", "Contract", "Registration", "Insurance"];

const FileUploadForm = ({ SlipData, stepper, slipIID, sId }) => {
  const [loading, setLoading] = useState(false);
  const [checkDocuments, setCheckDocuments] = useState(false);
  const [ermsz, setErrmsz] = useState("");
  const navigate = useNavigate();

  // ✅ your memoized UIDs
  const documentUids = useMemo(
    () => SlipData?.documents?.map((doc) => doc?.uid) || [],
    [SlipData?.documents]
  );

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      Contract: { currentFiles: [] },
      IdentityDocument: { currentFiles: [] },
      Registration: { currentFiles: [] },
      Insurance: { currentFiles: [] },
    },
  });

  const [fetchedImages, setFetchedImages] = useState([]);

  // ✅ Fetch all existing images once
  const fetchExistingImages = async () => {
    try {
      const fetched = await Promise.all(
        documentUids.map(async (uid) => {
          const res = await useJwt.existingImages(uid, {
            responseType: "blob",
          });
          const blob =
            res.data instanceof Blob ? res.data : new Blob([res.data]);
          return {
            name: `Document-${uid}`,
            url: URL.createObjectURL(blob),
            uid,
            type: "image",
            size: "-",
          };
        })
      );
      setFetchedImages(fetched);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    if (documentUids.length) fetchExistingImages();
  }, [documentUids]);

  const onSubmit = async (data) => {
    setErrmsz("");
    setLoading(true);

    try {
      for (const docName of filesName) {
        const currentFiles = data[docName]?.currentFiles || [];

        // Skip if no files selected
        if (currentFiles.length === 0) continue;

        const file = currentFiles[0]; // Only one image per document
        const formData = new FormData();
        formData.append("slipId", SlipData.id);
        formData.append("documentName", docName);
        formData.append("DocumentFile", file);
        console.log(file);

        // Check if a document with this name already exists
        const existingDoc = SlipData?.documents?.find(
          (doc) => doc?.documentName === docName
        );

        try {
          if (existingDoc && existingDoc?.uid) {
            // ✅ Update existing document
            await useJwt.updateDocuments(existingDoc.uid, formData);
            console.log(`✅ Updated document: ${docName}`);
          } else {
            // 🆕 Create new document
            await useJwt.slipDocument(formData);
            console.log(`🆕 Created new document: ${docName}`);
          }
        } catch (err) {
          console.error(`❌ Error processing ${docName}:`, err);
          setErrmsz(`Failed to process ${docName}`);
        }
      }

      setCheckDocuments(true);

      // Refresh documents after processing
      await fetchExistingImages();
    } catch (error) {
      console.error("Error in onSubmit:", error);
      setErrmsz("Something went wrong while processing documents.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Dropzone Renderer
  const renderDropzone = (fieldName) => {
    const { getRootProps, getInputProps } = useDropzone({
      multiple: true,
      accept: { "image/*": [] },
      onDrop: (acceptedFiles) => {
        const existingFiles = watch(fieldName)?.currentFiles || [];
        const newFiles = [...existingFiles, ...acceptedFiles];
        setValue(`${fieldName}.currentFiles`, newFiles);
      },
    });

    const currentFiles = watch(fieldName)?.currentFiles || [];

    const handleRemoveFile = (index) => {
      const updatedFiles = currentFiles.filter((_, i) => i !== index);
      setValue(`${fieldName}.currentFiles`, updatedFiles);
    };

    return (
      <Col sm="6" className="mb-4">
        <h6 className="fw-bold mb-2 text-capitalize">
          {fieldName.replace(/([A-Z])/g, " $1").trim()}
        </h6>

        <div
          {...getRootProps({
            className: "dropzone text-center",
            style: {
              border: "2px dashed #c8c8c8",
              borderRadius: "12px",
              padding: "25px",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              minHeight: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          })}
        >
          <input {...getInputProps()} />
          {currentFiles.length === 0 ? (
            <div>
              <DownloadCloud size={36} className="mb-1 text-secondary" />
              <p
                className="text-secondary mb-0"
                style={{ fontSize: "0.85rem" }}
              >
                Drop files here or{" "}
                <a href="/" onClick={(e) => e.preventDefault()}>
                  browse
                </a>{" "}
                to upload
              </p>
            </div>
          ) : (
            <p className="text-success mb-0 fw-semibold">
              {currentFiles.length} file(s) selected!
            </p>
          )}
        </div>

        {/* Preview */}
        {currentFiles.length > 0 && (
          <div
            className="file-preview-grid mt-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
              gap: "10px",
            }}
          >
            {currentFiles.map((file, index) => (
              <div
                key={index}
                className="file-card border rounded shadow-sm p-1"
                style={{
                  backgroundColor: "#fff",
                  textAlign: "center",
                  borderRadius: "8px",
                }}
              >
                <div
                  className="file-thumbnail mb-1"
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "6px",
                    overflow: "hidden",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {file.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <FileText size={28} className="text-secondary" />
                  )}
                </div>

                <div className="d-flex justify-content-center gap-1 mb-1">
                  <Button
                    color="light"
                    size="sm"
                    className="border"
                    style={{ padding: "2px 6px", fontSize: "0.7rem" }}
                    onClick={() =>
                      window.open(URL.createObjectURL(file), "_blank")
                    }
                  >
                    <Eye size={12} />
                  </Button>
                  <Button
                    color="danger"
                    outline
                    size="sm"
                    style={{ padding: "2px 6px" }}
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Col>
    );
  };

  return (
    <Fragment>
      {ermsz && (
        <UncontrolledAlert color="danger">
          <div className="alert-body">
            <span className="text-danger fw-bold">
              <strong>Error : </strong>
              {ermsz}
            </span>
          </div>
        </UncontrolledAlert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* ✅ Existing Images Preview Section */}
        {fetchedImages.length > 0 && (
          <div className="mb-4">
            <h5 className="fw-bold mb-3">Existing Uploaded Documents</h5>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "12px",
              }}
            >
              {fetchedImages?.map((img, index) => (
                <div
                  key={index}
                  className="border rounded shadow-sm p-1 text-center bg-white"
                >
                  <img
                    src={img?.url}
                    alt={img?.name}
                    style={{
                      width: "100%",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                  <div className="d-flex justify-content-center mt-1">
                    <Button
                      color="light"
                      size="sm"
                      className="border me-1"
                      onClick={() => window.open(img.url, "_blank")}
                    >
                      <Eye size={12} />
                    </Button>
                    <Button
                      color="danger"
                      outline
                      size="sm"
                      onClick={() =>
                        setFetchedImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Upload New Files */}
        <Row>{filesName.map((fieldName) => renderDropzone(fieldName))}</Row>

        <div className="d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft size={14} className="me-1" />
            Previous
          </Button>

          <Button
            // disabled={loading || checkDocuments}
            type="submit"
            color="success"
          >
            Submit
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default FileUploadForm;
