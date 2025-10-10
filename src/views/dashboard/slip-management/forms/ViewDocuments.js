import { Fragment, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import DocumentUploader from "./DocumentUploader";


// const lableOfDoc={
//   'insurance':'Insurance'
// }

const ViewDocuments = (props) => {
  console.clear()
  console.log(props)

  // ** State
  const [documentList, setDocumentList] = useState({
    insurance: [],
    "Contract": [],
    "IdentityDocument": [],
    pancard: [],
  });

// ** Handle Document Upload
  const handleChangeDocument = (key, list) => {
    setDocumentList((prevData)=>({...prevData,[key]:list}))
  };


  const fetchDocument=async(uids)=>{
    try{
       
      /*
      await useJwt.existingImages(uid, {
            responseType: "blob",
          })
      */
     const results=await Promise.all( uids.map(({uid})=>useJwt.existingImages(uid, {responseType: "blob"})))
     console.log(results)
    }catch(error){}finally{}
  }


  useEffect(()=>{
    if(props.slipData && props.slipData?.documents){
       
      const {slipData}=props;
      const {documents}=slipData;
      const uids= documents.map(({uid,documentName})=>({uid,documentName})) 
      fetchDocument(uids)
    }
  },[props])
  return (
    <Fragment>
      <Row>
        {Object.keys(documentList).map((key) => (
          <Col sm="12" key={key}>
            <DocumentUploader
              uploadedFiles={documentList[key]}
              handleChangeDocument={handleChangeDocument}
              label={key}
              name={key}
            />
          </Col>
        ))}
      </Row>
    </Fragment>
  );
};

export default ViewDocuments;
