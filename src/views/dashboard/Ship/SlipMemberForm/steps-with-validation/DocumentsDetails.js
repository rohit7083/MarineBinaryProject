import React, { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DownloadCloud, Eye, FileText, X } from "react-feather";
import toast from "react-hot-toast";
import { set, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight } from "react-feather";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Row,
  Col,
  Label,
  Card,
  CardBody,
  CardTitle,
  Form,
  Badge,
  UncontrolledAlert,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";

const filesName = ["IdentityDocument", "Contract", "Registration", "Insurance"];
const FileUploadForm = ({ Parentdocuments,stepper, slipIID ,sId}) => {
  const [documents, setDocuments] = useState([]);
  const myId = useParams();
  const [loading, setLoading] = useState(false);
  const [isDataFetch, setIsDataFetch] = useState(false);
  const navigate = useNavigate();
const [checkDocuments,setCheckDocuments]=useState(false);
const [ermsz,setErrmsz]=useState("");
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      Contract: {
        lastUploaded: "",
        currentFile: null,
      },
      IdentityDocument: {
        lastUploaded: "",
        currentFile: null,
      },
      Registration: {
        lastUploaded: "",
        currentFile: null,
      },
      Insurance: {
        lastUploaded: "",
        currentFile: null,
      },
    },
  });

// useEffect(() => {
//     if (Parentdocuments === null) {
//       setCheckDocuments(true);
//     }
//   }, [Parentdocuments,checkDocuments]);
  

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await useJwt.getSingleDocuments(slipIID || sId?.id);

        const doc = response.data.content.result.reduce((object, item) => {
          const { uid, documentName, documentFilePath } = item;
          object[documentName] = {
            uid,
            lastUploaded: documentFilePath,
            currentFile: null,
          };
          return object;
        }, {});

        if (Object.keys(doc).length) {
          reset(doc);
          setIsDataFetch(true);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    if (slipIID || sId?.id) fetchData();
  }, [slipIID ,sId?.id, reset]);

  const onSubmit = async (data) => {
    
    setErrmsz("");
    const updatedDataList = Object.keys(data).reduce((obj, key) => {
      if (data[key].currentFile == null) {
        delete data[key];
        return obj;
      }

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
      //  
      if (myId) {
        navigate("/dashboard/slipmember_list"); // Redirect after alert
      }
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

      // Check results and show messages accordingly
      const updatedCount = results.filter(
        (res) => res.type === "update"
      ).length;
      const createdCount = results.filter(
        (res) => res.type === "create"
      ).length;

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
          navigate("/dashboard/slipmember_list");
        });
      }
    } catch (error) {
       console.error(error);
      const errMsz=error.response.data?.content;
      console.log(errMsz);
      
      if (errMsz) {
        setErrmsz(errMsz);
      }
      Swal.fire({
        icon: "error",
        title: "Document Error!",
        text:errMsz,
      });
    }
  };

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  //** Render View */
  const renderFilePreview = (file) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          className="rounded"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="28"
          width="28"
        />
      );
    } else {
      return <FileText size="28" />;
    }
  };

  // ** Render Drop Zone
  const renderDropzone = (fieldName, label) => {
    const { getRootProps, getInputProps } = useDropzone({
      multiple: false,
      onDrop: (acceptedFiles) => {
        setValue(`${fieldName}.currentFile`, acceptedFiles[0]);
      },
    });

    return (
      <Col sm="6" className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <Label className="mb-2">
            {label} <span style={{ color: "red" }}>*</span>
          </Label>
          {watch(fieldName)?.lastUploaded ? (
            <Badge
              color={"success"}
              style={{ cursor: "pointer" }}
              onClick={() =>
                window.open(watch(fieldName)?.lastUploaded, "_blank")
              }
            >
              <Eye size={12} /> Last File Uploaded
            </Badge>
          ) : null}
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
            {watch(fieldName)?.currentFile ? (
              ((file = watch(fieldName)?.currentFile) => (
                <Fragment>
                  <div className="file-details d-flex align-items-center">
                    <div className="file-preview me-1">
                      {renderFilePreview(file)}
                    </div>
                    <div>
                      <p className="file-name mb-0">{file.nameX}</p>
                      <p className="file-size mb-0">
                        {renderFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    color="danger"
                    outline
                    size="sm"
                    className="btn-icon"
                    onClick={() => setValue(`${fieldName}.currentFile`, null)}
                  >
                    <X size={14} />
                  </Button>
                </Fragment>
              ))()
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
      {ermsz && (
              <React.Fragment>
                <UncontrolledAlert color="danger">
                  <div className="alert-body">
                    <span className="text-danger fw-bold">
                      <strong>Error : </strong>
                      {ermsz}      
                      </span>
                  </div>
                </UncontrolledAlert>
              </React.Fragment>
            )}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardBody>
            <Row>
              {[
                "IdentityDocument",
                "Contract",
                "Registration",
                "Insurance",
              ].map((fieldName) => renderDropzone(fieldName, fieldName))}
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
          <Button
            disabled={loading || checkDocuments
            }
            type="submit"
            color="success"
            className="btn-next"
          >

            <span className="align-middle d-sm-inline-block d-none">
              Submit
            </span>
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default FileUploadForm;

/*


    const formData = new FormData();
  
    if (data.contractFile) {
      formData.append("documentFile", data.contractFile);
      formData.append("documentNames", "Contract Document");
    }
  
    if (data.identityDocumentFile) {
      formData.append("documentFile", data.identityDocumentFile);
      formData.append("documentNames", "Identity Document");
    }
  
    if (data.registrationFile) {
      formData.append("documentFile", data.registrationFile);
      formData.append("documentNames", "Registration Document");
    }
  
    if (data.insuranceFile) {
      formData.append("documentFile", data.insuranceFile);
      formData.append("documentNames", "Insurance Document");
    }
  
    formData.append("slipId", slipIID); // Always append slipIID
  
   try {
      setLoading(true);
      
      const response = await useJwt.slipDocument(formData); // Send FormData directly
  
      toast.success("Files uploaded successfully!");
      console.log("API Response:", response.data);
    } catch (error) {
      toast.error("An error occurred while uploading files.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
*/
