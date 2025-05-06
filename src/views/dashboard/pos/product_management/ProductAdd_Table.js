import {
  Card,
  Input,
  Row,
  Col,
  Label,
  CardHeader,
  CardTitle,
} from "reactstrap";
import { FaCloudUploadAlt } from "react-icons/fa";

import { useDropzone } from "react-dropzone";
import React, { useState } from "react";

import { Trash2, Plus } from "react-feather";
import { Controller, useFieldArray } from "react-hook-form";

const ProductAdd_Table = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.slice(0, 10); // optional: limit number of files accepted
      const fileReaders = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders).then((images) => {
        setImagePreviews((prev) => [...prev, ...images]);
      });
    },
  });

  const maxVisible = 6;
  const visibleImages = imagePreviews.slice(0, maxVisible);
  const extraCount = imagePreviews.length - maxVisible;

  const styles = {
    dropzone: {
      border: "2px dashed #007bff",
      borderRadius: "8px",
      padding: "20px",
      textAlign: "center",
      cursor: "pointer",
      marginBottom: "20px",
    },
    previewGrid: { 
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      alignItems: "center",     // vertical centering (if height is set)
      justifyContent: "center", // horizontal centering
    },
    
    imagePreview: {
      width: "60px",
      height: "60px",
      objectFit: "cover",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    moreOverlay: {
      width: "60px",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#e9ecef",
      borderRadius: "8px",
      fontWeight: "bold",
      fontSize: "14px",
      border: "1px solid #ccc",
    },
  };

  return (
    <>
      <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start">
        <CardTitle className="" tag="h4">
          Variants
        </CardTitle>
        {/* <CardTitle
          className=""
          style={{ cursor: "pointer", color: "#607dd2" }}
          tag="h4"
          onClick={() =>
            append({
              mrp: "",
              stockQty: "",
              qty: "",
              image: null,
              unit: "",
              calcAmount: "",
              finalAmount: "",
            })
          }
        >
          <Plus /> Add variations
        </CardTitle> */}
      </CardHeader>
      <hr />
      <Card className="card-company-table ">
        {fields.map((field, index) => (
          <div key={field.id}>

            
            <Row className="p-2 mb-2 ">
            <Col md="12" sm="12 mb-2">
              <Label className="form-label">imgeas </Label>

              <div {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        <FaCloudUploadAlt size={40} color="#888" style={{ marginBottom: 10 }} />

        <p>Drag and drop images here, or click to select</p>
      </div>

      {imagePreviews.length > 0 && (
        <div style={styles.previewGrid}>
          {visibleImages.map((src, index) => (
            <img key={index} src={src} alt={`Preview ${index}`} style={styles.imagePreview} />
          ))}

          {extraCount > 0 && (
            <div style={styles.moreOverlay}>+{extraCount} more</div>
          )}
        </div>
      )}
      </Col>


              {/* <Col md="6" sm="12" className="mb-1"> */}
                {/* <Row> */}
                  <Col md="3" sm="12" className="mb-1">
                    <Label className="form-label">MRP</Label>
                    <Controller
                      name={`variations[${index}].mrp`}
                      control={control}
                      render={({ field }) => (
                        <Input type="text" placeholder="Enter MRP" {...field} />
                      )}
                    />
                  </Col>
                  <Col md="3" sm="12" className="mb-1">
                    <Label className="form-label">Stock QTY</Label>
                    <Controller
                      name={`variations[${index}].stockQty`}
                      control={control}
                      render={({ field }) => <Input type="text" placeholder="Enter MRP"{...field} />}
                    />
                  </Col>
                  <Col md="3" sm="12" className="mb-1">
                    <Label className="form-label">QTY</Label>
                    <Controller
                      name={`variations[${index}].qty`}
                      control={control}
                      render={({ field }) => <Input type="text" placeholder="Enter MRP" {...field} />}
                    />
                  </Col>
                {/* </Row> */}

                {/* <Row> */}
                  <Col md="3" sm="12" className="mb-1">
                    <Label className="form-label">Unit</Label>
                    <Controller
                      name={`variations[${index}].unit`}
                      control={control}
                      render={({ field }) => <Input type="text" placeholder="Enter MRP" {...field} />}
                    />
                  </Col>
                  <Col md="3" sm="12" className="mb-1">
                    <Label className="form-label">Calculate Amount</Label>
                    <Controller
                      name={`variations[${index}].calcAmount`}
                      control={control}
                      render={({ field }) => <Input type="text" placeholder="" {...field} />}
                    />
                  </Col>
                  <Col md="3" sm="12" className="mb-1">
                    <Label className="form-label">Final Amount</Label>
                    <Controller
                      name={`variations[${index}].finalAmount`}
                      control={control}
                      render={({ field }) => <Input type="text" placeholder="Enter finalAmount"{...field} />}
                    />
                  </Col>
                
                {/* </Row> */}
              {/* </Col> */}








{/* 
              <Col md="6" sm="12">
             
              </Col> */}
            </Row>

            <hr />
          </div>
        ))}
        <CardTitle
          className="mx-1"
          style={{ cursor: "pointer", color: "#607dd2" }}
          tag="h4"
          onClick={() =>
            append({
              mrp: "",
              stockQty: "",
              qty: "",
              image: [],
              unit: "",
              calcAmount: "",
              finalAmount: "",
            })
          }
        >
          <Plus /> Add variations
        </CardTitle>
      </Card>
    </>
  );
};

export default ProductAdd_Table;

// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import {Col} from 'reactstrap';
// const DropZoneWithImagePreview = () => {
//   const [imagePreviews, setImagePreviews] = useState([]);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
//     multiple: true,
//     onDrop: (acceptedFiles) => {
//       const files = acceptedFiles.slice(0, 10); // optional: limit number of files accepted
//       const fileReaders = files.map((file) => {
//         return new Promise((resolve) => {
//           const reader = new FileReader();
//           reader.onloadend = () => resolve(reader.result);
//           reader.readAsDataURL(file);
//         });
//       });

//       Promise.all(fileReaders).then((images) => {
//         setImagePreviews((prev) => [...prev, ...images]);
//       });
//     },
//   });

//   const maxVisible = 5;
//   const visibleImages = imagePreviews.slice(0, maxVisible);
//   const extraCount = imagePreviews.length - maxVisible;

//   return (
// <Col md="3" sm="12">
      // <div {...getRootProps()} style={styles.dropzone}>
      //   <input {...getInputProps()} />
      //   <p>Drag and drop images here, or click to select</p>
      // </div>

      // {imagePreviews.length > 0 && (
      //   <div style={styles.previewGrid}>
      //     {visibleImages.map((src, index) => (
      //       <img key={index} src={src} alt={`Preview ${index}`} style={styles.imagePreview} />
      //     ))}

      //     {extraCount > 0 && (
      //       <div style={styles.moreOverlay}>+{extraCount} more</div>
      //     )}
      //   </div>
      // )}
// </Col>
//   );
// };

// const styles = {
//   dropzone: {
//     border: '2px dashed #007bff',
//     borderRadius: '8px',
//     padding: '20px',
//     textAlign: 'center',
//     cursor: 'pointer',
//     marginBottom: '20px',
//   },
//   previewGrid: {
//     display: 'flex',
//     gap: '10px',
//     flexWrap: 'wrap',
//     alignItems: 'center',
//   },
//   imagePreview: {
//     width: '60px',
//     height: '60px',
//     objectFit: 'cover',
//     borderRadius: '8px',
//     border: '1px solid #ccc',
//   },
//   moreOverlay: {
//     width: '60px',
//     height: '60px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#e9ecef',
//     borderRadius: '8px',
//     fontWeight: 'bold',
//     fontSize: '14px',
//     border: '1px solid #ccc',
//   },
// };

// export default DropZoneWithImagePreview;

{
  /* <Col md="6" sm="12" className="mb-1">
<Label className="form-label">imgeas QTY</Label>


</Col> */
}

{
  /* <Col md="6" sm="12" className="mb-1">
                <Label className="form-label">Product Image</Label>
                <Controller
                  name={`variations[${index}].image`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />
                  )}
                />
              </Col> */
}



// <Col
// md="6"
// sm="12"
// className="mt-4 d-flex justify-content-end"
// >
// <Trash2
//   onClick={() => remove(index)}
//   className="d-flex"
//   style={{ cursor: "pointer" }}
// />
// </Col>