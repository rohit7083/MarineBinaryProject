import useJwt from "@src/auth/jwt/useJwt";
import { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, DownloadCloud, Eye, FileText, X } from "react-feather";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Row, UncontrolledAlert } from "reactstrap";
import Swal from "sweetalert2";

const Document = ({ stepper, slipIID, sId, allEventData, listData }) => {
  const [loading, setLoading] = useState(false);
  const [ermsz, setErrmsz] = useState("");
  const navigate = useNavigate();

  const { handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      IdentityDocument: {
        uid: "",
        existingFile: "",
        currentFile: null,
      },
      Contract: {
        uid: "",
        existingFile: "",
        currentFile: null,
      },
    },
  });

  // ✅ Load existing documents when editing
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const eventDocs = listData?.Rowdata?.eventDocuments;
        if (!eventDocs?.length) return;

        const responses = await Promise.all(
          eventDocs.map(async (doc) => {
            const res = await useJwt.getEventDocument(doc.uid);
            const blob = res.data;

            return {
              documentName: doc.documentName,
              uid: doc.uid,
              url: URL.createObjectURL(blob),
            };
          })
        );

        const mapped = {
          IdentityDocument: { uid: "", existingFile: "", currentFile: null },
          Contract: { uid: "", existingFile: "", currentFile: null },
        };

        responses.forEach((file) => {
          if (["IdentityDocument", "Contract"].includes(file.documentName)) {
            mapped[file.documentName] = {
              uid: file.uid,
              existingFile: file.url,
              currentFile: null,
            };
          }
        });

        reset(mapped); // ✅ update form with file preview URLs
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    if (listData?.Rowdata?.eventDocuments?.length) {
      fetchDocuments();
    }
  }, [listData, reset]);

  // ✅ Submit handler
  const onSubmit = async (data) => {
    setErrmsz("");
    setLoading(true);

    const eventId = allEventData?.eventId || listData?.Rowdata?.id;

    // Build list only for changed/new documents
    const uploadList = Object.keys(data)
      .filter((key) => ["IdentityDocument", "Contract"].includes(key))
      .reduce((arr, key) => {
        const { uid, currentFile, existingFile } = data[key];

        // Case 1: New document (no uid yet, new file selected)
        if (!uid && currentFile) {
          const formData = new FormData();
          formData.append("eventId", eventId);
          formData.append("documentName", key);
          formData.append("documentFile", currentFile);
          arr.push({ action: "create", formData });
        }

        // Case 2: Existing document replaced with a new file
        if (uid && currentFile) {
          const formData = new FormData();
          formData.append("eventId", eventId);
          formData.append("documentName", key);
          formData.append("documentFile", currentFile);
          arr.push({ action: "update", uid, formData });
        }

        // Case 3: Existing document left unchanged → skip
        if (uid && !currentFile && existingFile) {
          // No change → ignore
        }

        return arr;
      }, []);

    if (!uploadList.length) {
      Swal.fire({
        icon: "warning",
        title: "No Changes!",
        text: "You didn’t update or upload any new files.",
      });
      setLoading(false);
      return;
    }

    try {
    const results = [];
for (const item of uploadList) {
  try {
    if (item.action === "update") {
      await useJwt.eventDocUpdate(item.uid, item.formData);
      results.push("updated");
    } else if (item.action === "create") {
      await useJwt.eventDocument(item.formData);
      results.push("created");
    }
  } catch (err) {
    console.error(`Error uploading ${item.name}:`, err);
    throw err; // stop further uploads on failure
  }
}


      const updatedCount = results.filter((r) => r === "updated").length;
      const createdCount = results.filter((r) => r === "created").length;

      let message = "";
      if (updatedCount && createdCount)
        message = `Updated ${updatedCount} and created ${createdCount} documents.`;
      else if (updatedCount) message = `Updated ${updatedCount} document(s).`;
      else message = `Uploaded ${createdCount} document(s).`;

      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        showConfirmButton: false,
        timer: 1800,
      }).then(() => navigate("/event_index"));
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.content || "Something went wrong!";
      setErrmsz(msg);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Dropzone for single file only
  const renderDropzone = (fieldName, label) => {
    const { getRootProps, getInputProps } = useDropzone({
      multiple: false,
      accept: { "image/*": [], "application/pdf": [] },
      onDrop: (acceptedFiles) => {
        if (!acceptedFiles.length) return;
        setValue(`${fieldName}.currentFile`, acceptedFiles[0]);
        setValue(`${fieldName}.existingFile`, ""); // clear old file
      },
    });
    const currentFile = watch(`${fieldName}.currentFile`);
    const existingFile = watch(`${fieldName}.existingFile`);
    console.log(existingFile);

    const handleRemoveFile = () => {
      setValue(`${fieldName}.currentFile`, null);
    };

    const handleRemoveExisting = () => {
      setValue(`${fieldName}.existingFile`, "");
    };

    const hasFile = currentFile || existingFile;
    console.log("hasFile", hasFile);

    return (
      <Col sm="6" className="mb-4">
        <h6 className="fw-bold mb-2 text-capitalize">
          {label.replace(/([A-Z])/g, " $1").trim()}
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
          {!hasFile ? (
            <div>
              <DownloadCloud size={36} className="mb-1 text-secondary" />
              <p
                className="text-secondary mb-0"
                style={{ fontSize: "0.85rem" }}
              >
                Drop a file here or{" "}
                <a href="/" onClick={(e) => e.preventDefault()}>
                  browse
                </a>
              </p>
            </div>
          ) : (
            <p className="text-success mb-0 fw-semibold">1 file selected!</p>
          )}
        </div>

        {/* Existing file preview */}
        {existingFile && (
          <div className="mt-3 text-center">
            <div
              style={{
                width: "120px",
                height: "120px",
                margin: "0 auto 8px",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {existingFile.toLowerCase().includes("pdf") ? (
                <embed
                  src={existingFile}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                />
              ) : (
                <img
                  src={existingFile}
                  alt="existing"
                  onError={(e) => {
                    // fallback to icon if blob URL isn’t an image
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML =
                      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#6c757d" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.104.896 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 9V3.5L18.5 9H13z"/></svg>';
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>

            <div className="d-flex justify-content-center gap-1">
              <Button
                color="light"
                size="sm"
                className="border"
                onClick={() => window.open(existingFile, "_blank")}
              >
                <Eye size={12} />
              </Button>
              <Button
                color="danger"
                outline
                size="sm"
                onClick={handleRemoveExisting}
              >
                <X size={12} />
              </Button>
            </div>
          </div>
        )}

        {/* New file preview */}
        {currentFile && (
          <div className="mt-3 text-center">
            <div
              style={{
                width: "120px",
                height: "120px",
                margin: "0 auto 8px",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {currentFile.type.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(currentFile)}
                  alt={currentFile.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <FileText size={32} className="text-secondary" />
              )}
            </div>

            <div className="d-flex justify-content-center gap-1">
              <Button
                color="light"
                size="sm"
                className="border"
                onClick={() =>
                  window.open(URL.createObjectURL(currentFile), "_blank")
                }
              >
                <Eye size={12} />
              </Button>
              <Button
                color="danger"
                outline
                size="sm"
                onClick={handleRemoveFile}
              >
                <X size={12} />
              </Button>
            </div>
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
            <strong>Error: </strong>
            {ermsz}
          </div>
        </UncontrolledAlert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {["IdentityDocument", "Contract"].map((f) => renderDropzone(f, f))}
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
