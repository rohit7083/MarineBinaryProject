// import { FaCloudUploadAlt } from "react-icons/fa";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   Col,
//   Input,
//   Label,
//   Row,
// } from "reactstrap";

// import { useState } from "react";
// import { useDropzone } from "react-dropzone";

// import { Plus, Trash2 } from "react-feather";
// import { Controller, useFieldArray } from "react-hook-form";

// const ProductAdd_Table = ({ control, fetchData, watchCategory }) => {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "variations",
//   });
//   const [imagePreviews, setImagePreviews] = useState([]);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "image/*": [".jpg", ".jpeg", ".png"] },
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

//   const maxVisible = 6;
//   const visibleImages = imagePreviews.slice(0, maxVisible);
//   const extraCount = imagePreviews.length - maxVisible;

//   const styles = {
//     dropzone: {
//       border: "2px dashed #007bff",
//       borderRadius: "8px",
//       padding: "20px",
//       textAlign: "center",
//       cursor: "pointer",
//       marginBottom: "20px",
//     },
//     previewGrid: {
//       display: "flex",
//       gap: "10px",
//       flexWrap: "wrap",
//       alignItems: "center", // vertical centering (if height is set)
//       justifyContent: "center", // horizontal centering
//     },

//     imagePreview: {
//       width: "60px",
//       height: "60px",
//       objectFit: "cover",
//       borderRadius: "8px",
//       border: "1px solid #ccc",
//     },
//     moreOverlay: {
//       width: "60px",
//       height: "60px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#e9ecef",
//       borderRadius: "8px",
//       fontWeight: "bold",
//       fontSize: "14px",
//       border: "1px solid #ccc",
//     },
//   };

//   return (
//     <>
//       <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start">
//         <CardTitle className="" tag="h4">
//           Variants
//         </CardTitle>
//       </CardHeader>
//       <hr />
//       <Card className="card-company-table ">
//         {fields.map((field, index) => (
//           <div key={field.id}>
//             <Row className="p-2 ">
//               <Col md="12" sm="12 mb-2">
//                 <Label className="form-label">Upload Images </Label>

//                 <div {...getRootProps()} style={styles.dropzone}>
//                   <input {...getInputProps()} />
//                   <FaCloudUploadAlt
//                     size={40}
//                     color="#888"
//                     style={{ marginBottom: 10 }}
//                   />

//                   <p>Drag and drop images here, or click to select</p>
//                 </div>

//                 {imagePreviews.length > 0 && (
//                   <div style={styles.previewGrid}>
//                     {visibleImages.map((src, index) => (
//                       <img
//                         key={index}
//                         src={src}
//                         alt={`Preview ${index}`}
//                         style={styles.imagePreview}
//                       />
//                     ))}

//                     {extraCount > 0 && (
//                       <div style={styles.moreOverlay}>+{extraCount} more</div>
//                     )}
//                   </div>
//                 )}
//               </Col>

//               <Col md="3" sm="12" className="mb-1">
//                 <Label className="form-label">MRP</Label>
//                 <Controller
//                   name={`variations[${index}].mrp`}
//                   control={control}
//                   render={({ field }) => (
//                     <Input type="text" placeholder="Enter MRP" {...field} />
//                   )}
//                 />
//               </Col>
//               <Col md="3" sm="12" className="mb-1">
//                 <Label className="form-label">Stock QTY</Label>
//                 <Controller
//                   name={`variations[${index}].stockQty`}
//                   control={control}
//                   render={({ field }) => (
//                     <Input type="text" placeholder="Enter MRP" {...field} />
//                   )}
//                 />
//               </Col>
//               <Col md="3" sm="12" className="mb-1">
//                 <Label className="form-label">QTY</Label>
//                 <Controller
//                   name={`variations[${index}].qty`}
//                   control={control}
//                   render={({ field }) => (
//                     <Input type="text" placeholder="Enter MRP" {...field} />
//                   )}
//                 />
//               </Col>

//               <Col md="3" sm="12" className="mb-1">
//                 <Label className="form-label">Unit</Label>
//                 <Controller
//                   name={`variations[${index}].unit`}
//                   control={control}
//                   render={({ field }) => (
//                     <Input type="text" placeholder="Enter MRP" {...field} />
//                   )}
//                 />
//               </Col>
//               <Col md="3" sm="12" className="mb-1">
//                 <Label className="form-label">Calculate Amount</Label>
//                 <Controller
//                   name={`variations[${index}].calcAmount`}
//                   control={control}
//                   render={({ field }) => (
//                     <Input type="text" placeholder="" {...field} />
//                   )}
//                 />
//               </Col>
//               <Col md="3" sm="12" className="mb-1">
//                 <Label className="form-label">Final Amount</Label>
//                 <Controller
//                   name={`variations[${index}].finalAmount`}
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       type="text"
//                       placeholder="Enter finalAmount"
//                       {...field}
//                     />
//                   )}
//                 />
//               </Col>
//               {watchCategory?.attributeKeys?.map((attr, idx) => (
//                 <Col key={idx} md="3" sm="12" className="mb-1">
//                   <Label className="form-label">{attr}</Label>
//                   <Controller
//                     name={`variations[${index}].finalAmount`}
//                     control={control}
//                     render={({ field }) => (
//                       <Input type="text" placeholder="Enter " {...field} />
//                     )}
//                   />
//                 </Col>
//               ))}
//               <Col md="6" sm="12" className="mt-4 d-flex justify-content-end">
//                 <Trash2
//                   onClick={() => remove(index)}
//                   className="d-flex"
//                   style={{ cursor: "pointer" }}
//                 />
//               </Col>
//             </Row>

//             <hr />
//           </div>
//         ))}
//         <CardTitle
//           className="mx-1"
//           style={{ cursor: "pointer", color: "#607dd2" }}
//           tag="h4"
//           onClick={() =>
//             append({
//               mrp: "",
//               stockQty: "",
//               qty: "",
//               image: [],
//               unit: "",
//               calcAmount: "",
//               finalAmount: "",
//             })
//           }
//         >
//           <Plus /> Add variations
//         </CardTitle>
//       </Card>
//     </>
//   );
// };

// export default ProductAdd_Table;

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Plus, Trash2, X } from "react-feather";
import { Controller, useFieldArray } from "react-hook-form";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";

const ProductAdd_Table = ({ control, fetchData, watchCategory, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.slice(0, 10);
      const fileReaders = files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve({ id: Date.now() + file.name, src: reader.result });
            reader.readAsDataURL(file);
          })
      );

      Promise.all(fileReaders).then((images) => {
        setImagePreviews((prev) => [...prev, ...images]);
      });
    },
  });

  const removeImage = (id) => {
    setImagePreviews((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <>
      <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start">
        <CardTitle tag="h3" className="fw-bold text-primary">
          ✨ Product Variations
        </CardTitle>
      </CardHeader>
      <hr />
      <Card className="p-2 bg-light border-0 shadow-sm rounded-4">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mb-4 bg-white rounded-4 p-4 shadow-sm position-relative"
            >
              <Row className="gy-3">
                <Col md="12">
                  <Label className="form-label fw-semibold">
                    Upload Images
                  </Label>
                  <div
                    {...getRootProps()}
                    className={`rounded-3 p-4 text-center border-dashed ${
                      isDragActive
                        ? "border-success bg-success-subtle"
                        : "border-primary bg-light"
                    }`}
                    style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                  >
                    <input {...getInputProps()} />
                    <FaCloudUploadAlt
                      size={50}
                      color={isDragActive ? "#28a745" : "#0d6efd"}
                      className="mb-2"
                    />
                    <p className="mb-0 text-muted">
                      {isDragActive
                        ? "Drop images here..."
                        : "Drag & drop or click to upload"}
                    </p>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="d-flex flex-wrap gap-3 mt-3">
                      {imagePreviews.map((img) => (
                        <motion.div
                          key={img.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="position-relative"
                          style={{ width: "90px", height: "90px" }}
                        >
                          <img
                            src={img.src}
                            alt="preview"
                            className="w-100 h-100 rounded-3 border object-fit-cover shadow-sm"
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-light border position-absolute top-0 end-0 m-1 rounded-circle shadow"
                            onClick={() => removeImage(img.id)}
                          >
                            <X size={14} className="text-danger" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </Col>

                <Col md="4" sm="6" xs="12">
                  <Label className="form-label">MRP</Label>
                  <Controller
                    name={`variations[${index}].mrp`}
                    control={control}
                    rules={{
                      required: "MRP is required",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/, // numbers with optional decimals
                        message: "Enter a valid price (e.g., 100 or 100.50)",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter MRP"
                        {...field}
                        invalid={!!errors?.variations?.[index]?.mrp}
                      />
                    )}
                  />
                  {errors?.variations?.[index]?.mrp && (
                    <FormFeedback>
                      {errors.variations[index].mrp.message}
                    </FormFeedback>
                  )}
                </Col>

                <Col md="4" sm="6" xs="12">
                  <Label className="form-label">Stock QTY</Label>
                  <Controller
                    name={`variations[${index}].stockQty`}
                    control={control}
                    rules={{
                      required: "Stock QTY is required",
                      pattern: {
                        value: /^[0-9]+$/, // only integers
                        message: "Stock quantity must be a whole number",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Stock QTY"
                        {...field}
                        invalid={!!errors?.variations?.[index]?.stockQty}
                      />
                    )}
                  />
                  {errors?.variations?.[index]?.stockQty && (
                    <FormFeedback>
                      {errors.variations[index].stockQty.message}
                    </FormFeedback>
                  )}
                </Col>

                <Col md="4" sm="6" xs="12">
                  <Label className="form-label">QTY</Label>
                  <Controller
                    name={`variations[${index}].qty`}
                    control={control}
                    rules={{
                      required: "QTY is required",
                      pattern: {
                        value: /^[0-9]+$/, // only integers
                        message: "QTY must be a whole number",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter QTY"
                        {...field}
                        invalid={!!errors?.variations?.[index]?.qty}
                      />
                    )}
                  />
                  {errors?.variations?.[index]?.qty && (
                    <FormFeedback>
                      {errors.variations[index].qty.message}
                    </FormFeedback>
                  )}
                </Col>

                <Col md="4" sm="6" xs="12">
                  <Label className="form-label">Unit</Label>
                  <Controller
                    name={`variations[${index}].unit`}
                    control={control}
                    rules={{
                      required: "Unit is required",
                      pattern: {
                        value: /^[a-zA-Z]+$/, // only letters
                        message: "Unit must contain only letters",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Unit"
                        {...field}
                        invalid={!!errors?.variations?.[index]?.unit}
                      />
                    )}
                  />
                  {errors?.variations?.[index]?.unit && (
                    <FormFeedback>
                      {errors.variations[index].unit.message}
                    </FormFeedback>
                  )}
                </Col>

                <Col md="4" sm="6" xs="12">
                  <Label className="form-label">Calculate Amount</Label>
                  <Controller
                    name={`variations[${index}].calcAmount`}
                    control={control}
                    rules={{
                      required: "Calculate Amount is required",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/, // numbers with optional decimals
                        message: "Enter a valid amount",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Calculate Amount"
                        {...field}
                        invalid={!!errors?.variations?.[index]?.calcAmount}
                      />
                    )}
                  />
                  {errors?.variations?.[index]?.calcAmount && (
                    <FormFeedback>
                      {errors.variations[index].calcAmount.message}
                    </FormFeedback>
                  )}
                </Col>

                <Col md="4" sm="6" xs="12">
                  <Label className="form-label">Final Amount</Label>
                  <Controller
                    name={`variations[${index}].finalAmount`}
                    control={control}
                    rules={{
                      required: "Final Amount is required",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/, // numbers with optional decimals
                        message: "Enter a valid final amount",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Final Amount"
                        {...field}
                        invalid={!!errors?.variations?.[index]?.finalAmount}
                      />
                    )}
                  />
                  {errors?.variations?.[index]?.finalAmount && (
                    <FormFeedback>
                      {errors.variations[index].finalAmount.message}
                    </FormFeedback>
                  )}
                </Col>

                {watchCategory?.attributeKeys?.map((attr, idx) => (
                  <Col key={idx} md="4" sm="6" xs="12">
                    <Label className="form-label ">{attr}</Label>
                    <Controller
                      name={`variations[${index}].${attr}`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder={`Enter ${attr}`}
                          className="rounded-3 shadow-sm"
                          {...field}
                        />
                      )}
                    />
                  </Col>
                ))}

                <Col md="12" className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="btn btn-outline-danger rounded-3 d-flex align-items-center gap-1"
                  >
                    <Trash2 size={16} /> Remove Variation
                  </button>
                </Col>
              </Row>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="text-center mt-4">
          <Button
            type="button"
            size="sm"
            color="primary"
            className="btn btn-primary rounded-pill d-inline-flex align-items-center gap-2 shadow-sm"
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
            <Plus /> Add Variation
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ProductAdd_Table;
