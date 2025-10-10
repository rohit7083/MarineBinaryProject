// import useJwt from "@src/auth/jwt/useJwt";
// import { Fragment, useEffect, useMemo, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { Upload, XCircle } from "react-feather";
// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   CardTitle,
//   Col,
//   Input,
//   Row,
//   Spinner,
//   Table,
// } from "reactstrap";
// import { read, utils } from "xlsx";

// // Reusable File Preview Component
// const FilePreview = ({ file, onRemove }) => {
//   if (!file.url) return null;

//   const isImage = file.type?.includes("image");
//   const isPDF = file.type === "application/pdf";

//   return (
//     <Col sm="4" md="3">
//       <div className="border rounded p-2 text-center position-relative">
//         <Button
//           color="danger"
//           size="sm"
//           className="position-absolute top-0 end-0 m-1 p-0"
//           onClick={() => onRemove(file.name)}
//           style={{ borderRadius: "50%", width: "24px", height: "24px" }}
//         >
//           <XCircle size={16} />
//         </Button>

//         {isImage && (
//           <img
//             src={file.url}
//             alt={file.name}
//             style={{
//               width: "100%",
//               height: "150px",
//               objectFit: "cover",
//               borderRadius: "6px",
//             }}
//           />
//         )}

//         {isPDF && (
//           <iframe
//             src={file.url}
//             title={file.name}
//             style={{
//               width: "100%",
//               height: "150px",
//               border: "1px solid #ccc",
//               borderRadius: "6px",
//             }}
//           />
//         )}

//         {!isImage && !isPDF && (
//           <a href={file.url} target="_blank" rel="noopener noreferrer">
//             {file.name}
//           </a>
//         )}

//         <p className="small mt-1">{file.size || "-"}</p>
//       </div>
//     </Col>
//   );
// };

// const UpdateDocuments = ({ SlipData }) => {
//   const [tableData, setTableData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [previewFiles, setPreviewFiles] = useState([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [uploadedFileName, setUploadedFileName] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadMessage, setUploadMessage] = useState("");

//   // Memoize document UIDs
// const documentUids = useMemo(
//   () => SlipData?.documents?.map((doc) => doc?.uid) || [],
//   [SlipData?.documents]
// );

//   // Fetch existing images
//   const fetchExistingImages = async () => {
//     try {
//       const fetchedImages = await Promise.all(
//         documentUids.map(async (uid) => {
//           const res = await useJwt.existingImages(uid, {
//             responseType: "blob",
//           });

//           // Ensure Blob
//           const blob =
//             res.data instanceof Blob ? res.data : new Blob([res.data]);

//           return {
//             name: `Document-${uid}`,
//             url: URL.createObjectURL(blob),
//             type: "image",
//             size: "-",
//           };
//         })
//       );
//       setPreviewFiles(fetchedImages);
//     } catch (error) {
//       console.error("Error fetching images:", error);
//     }
//   };

//   useEffect(() => {
//     if (documentUids.length) fetchExistingImages();
//   }, [documentUids]);

//   // Handle file uploads
//   const { getRootProps, getInputProps } = useDropzone({
//     multiple: true,
//     onDrop: (files) => {
//       let isExcelFile = false;
//       const newPreviews = [];

//       files.forEach((file) => {
//         setUploadedFileName(file.name);

//         if (file.name.match(/\.(xlsx|xls|csv)$/)) {
//           isExcelFile = true;
//           const reader = new FileReader();
//           reader.onload = () => {
//             const wb = read(reader.result, { type: "binary" });
//             const sheetData = wb.SheetNames.flatMap((sheet) =>
//               utils.sheet_to_row_object_array(wb.Sheets[sheet])
//             );
//             setTableData(sheetData);
//           };
//           reader.readAsBinaryString(file);
//         } else {
//           newPreviews.push({
//             name: file.name,
//             size: `${(file.size / 1024).toFixed(2)} KB`,
//             type: file.type,
//             file,
//             url: URL.createObjectURL(file),
//           });
//         }
//       });

//       if (isExcelFile) {
//         setPreviewFiles([]); // clear previews if Excel uploaded
//       } else {
//         setTableData([]);
//         setPreviewFiles((prev) => [...prev, ...newPreviews]);
//       }
//     },
//   });

//   // Upload (Update Documents)
//   const handleUpdateDocuments = async () => {
//     if (!previewFiles.length) {
//       setUploadMessage("⚠️ Please upload at least one file before updating.");
//       return;
//     }

//     try {
//       setIsUploading(true);
//       setUploadMessage("");

//       for (let i = 0; i < previewFiles.length; i++) {
//         const file = previewFiles[i];
//         if (!file.file) continue; // skip already fetched preview
//         // {{ }}
//         const formData = new FormData();
//         formData.append("slipId", SlipData?.id);
//         formData.append("documentName", SlipData?.documents?.documentName);

//         formData.append("file", file.file);

//         // Assign existing UID or default
//         const uid = documentUids[i] || documentUids[0];

//         // Replace with your real API method (adjust as needed)
//         await useJwt.updateDocuments(uid, formData);
//       }

//       setUploadMessage("✅ Documents updated successfully.");
//       await fetchExistingImages(); // refresh preview
//     } catch (error) {
//       console.error("Error updating documents:", error);
//       setUploadMessage(
//         "❌ Failed to update documents. Check console for details."
//       );
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Handle Excel search/filter
//   const handleFilter = (e) => {
//     const value = e.target.value;
//     setSearchValue(value);

//     if (value && tableData.length) {
//       setFilteredData(
//         tableData.filter((row) =>
//           Object.values(row).some((v) =>
//             v?.toString().toLowerCase().includes(value.toLowerCase())
//           )
//         )
//       );
//     } else {
//       setFilteredData([]);
//     }
//   };

//   const removeFile = (name) => {
//     setPreviewFiles((prev) => prev.filter((file) => file.name !== name));
//   };

//   const tableHeaders = tableData.length ? Object.keys(tableData[0]) : [];
//   const tableRows = searchValue.length ? filteredData : tableData;

//   return (
//     <Fragment>
//       <Card className="overflow-hidden">
//         <CardHeader className="d-flex justify-content-between align-items-center">
//           <CardTitle tag="h4">Update Documents</CardTitle>
//         </CardHeader>

//         {/* File Upload */}
//         <Row className="my-2">
//           <Col sm="12">
//             <Card>
//               <CardBody>
//                 <div
//                   {...getRootProps({
//                     className:
//                       "dropzone p-4 border border-dashed rounded text-center",
//                     style: { cursor: "pointer" },
//                   })}
//                 >
//                   <input {...getInputProps()} />
//                   <Upload size={64} className="mb-2 text-primary" />
//                   <h5>Drop files here or click to upload</h5>
//                   <p className="text-secondary mb-0">
//                     Update or replace existing documents (any file type)
//                   </p>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>

//         {/* Excel Table */}
//         {tableData.length > 0 && (
//           <Card className="m-2">
//             <CardBody>
//               <h5 className="mb-2">Uploaded File: {uploadedFileName}</h5>
//               <Input
//                 type="text"
//                 placeholder="Search in table..."
//                 value={searchValue}
//                 onChange={handleFilter}
//                 className="mb-2"
//               />
//               <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                 <Table bordered hover responsive size="sm">
//                   <thead>
//                     <tr>
//                       {tableHeaders.map((head, idx) => (
//                         <th key={idx}>{head}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {tableRows.map((row, i) => (
//                       <tr key={i}>
//                         {tableHeaders.map((key, j) => (
//                           <td key={j}>{row[key]}</td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </CardBody>
//           </Card>
//         )}

//         {/* File Previews */}
//         {previewFiles.length > 0 && (
//           <Card className="m-2">
//             <CardBody>
//               <h5 className="mb-2">Files to be Updated</h5>
//               <Row className="g-2">
//                 {previewFiles.map((file) => (
//                   <FilePreview
//                     key={file.name}
//                     file={file}
//                     onRemove={removeFile}
//                   />
//                 ))}
//               </Row>
//             </CardBody>
//           </Card>
//         )}

//         {/* Actions */}
//         <div className="d-flex justify-content-end mb-2 mx-2">
//           <Button
//             color="secondary"
//             className="me-2"
//             onClick={() => {
//               setUploadedFileName("");
//               setSearchValue("");
//               setTableData([]);
//               setFilteredData([]);
//               setPreviewFiles([]);
//               setUploadMessage("");
//             }}
//             disabled={isUploading}
//           >
//             Reset
//           </Button>
//           <Button
//             color="primary"
//             onClick={handleUpdateDocuments}
//             disabled={isUploading}
//           >
//             {isUploading ? (
//               <>
//                 <Spinner size="sm" /> Updating...
//               </>
//             ) : (
//               "Update Documents"
//             )}
//           </Button>
//         </div>

//         {uploadMessage && (
//           <p className="text-center fw-bold mb-3">{uploadMessage}</p>
//         )}
//       </Card>
//     </Fragment>
//   );
// };
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
{{ }}
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
