import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";

import { Col, Row } from "reactstrap";
import DocumentUploader from "./DocumentUploader";
const ViewDocuments = ({ slipData }) => {
  const [documentList, setDocumentList] = useState({
    IdentityDocument: [],
    Contract: [],
    Registration: [],
    Insurance: [],
  });

  const [uidForDocuments, setUidForDocument] = useState([]);
  console.log("slipdata", slipData);
  const [fetchLoader, setFethchLoader] = useState(false);
  const toast = useRef(null);

  const handleChangeDocument = (key, list) => {
    setDocumentList((prev) => ({ ...prev, [key]: list }));
  };
  const fetchDocument = async (uids) => {
    try {
      setFethchLoader(true);
      const results = await Promise.all(
        uids.map(async ({ uid, documentName }) => {
          const response = await useJwt.existingImages(uid);
          const blob = response.data;
          const fileType = blob.type || "application/octet-stream";
          const file = new File([blob], documentName || "document", {
            type: fileType,
          });

          file.preview = URL.createObjectURL(blob);
          file.uid = uid; // attach uid for updating

          return { file, documentName };
        })
      );

      const groupedDocs = {
        IdentityDocument: [],
        Contract: [],
        Registration: [],
        Insurance: [],
      };

      results.forEach(({ file, documentName }) => {
        if (groupedDocs[documentName]) {
          groupedDocs[documentName].push(file);
        }
      });

      setDocumentList(groupedDocs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      if (error?.response) {
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail: error?.response?.data?.content || "Error fetching documents",
          life: 2000,
        });
      }
    } finally {
      setFethchLoader(false);
    }
  };

  useEffect(() => {
    if (slipData?.documents?.length) {
      const uids = slipData.documents.map(({ uid, documentName }) => ({
        uid,
        documentName,
      }));
      fetchDocument(uids);
      setUidForDocument(uids);
    }
  }, [slipData]);

  return (
    <Fragment>
      <Toast ref={toast} />
      <Row>
        {Object.keys(documentList).map((key) => (
          <Col sm="12" key={key}>
            <DocumentUploader
              slipId={slipData.id}
              uploadedFiles={documentList[key]}
              handleChangeDocument={handleChangeDocument}
              label={key}
              name={key}
              uidForDocuments={uidForDocuments}
              fetchLoader={fetchLoader}
            />
          </Col>
        ))}
      </Row>
    </Fragment>
  );
};

export default ViewDocuments;
