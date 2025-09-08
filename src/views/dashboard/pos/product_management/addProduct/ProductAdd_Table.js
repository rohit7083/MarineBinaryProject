import useJwt from "@src/auth/jwt/useJwt";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, X } from "react-feather";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Toast } from "primereact/toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";

const ProductAdd_Table = ({
  stepper,
  fetchData,
  productData,
  setProductData,
  watchCategory,
  UpdateData,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });
  const [loading, setLoading] = useState(false);

  const uidForUpdateData = UpdateData?.uid;
  const toast = useRef(null);

  useEffect(() => {
    if (UpdateData) {
      reset({
        ...UpdateData,

        variations:
          UpdateData.variations?.map((v) => ({
            ...v,
            calcAmount: v.calAmount ?? "",
            qty: v.quantity ?? "",
          })) || [],
      });
    }
  }, [UpdateData, reset]);
  console.log("productData in variations ", productData);
  let payload;
  const onSubmit = async (data) => {
    console.log("data from variation", data);

    payload = data.variations.map((vData) => {
      vData.attributes = productData?.findCategoryData?.attributeKeys.map(
        (key) => {
          return { attributeName: key, value: vData[key] };
        }
      );

      return {
        uid: vData.uid,
        mrp: Number(vData.mrp), // convert to number
        stockQty: Number(vData.stockQty),
        quantity: Number(vData.quantity ?? vData.qty ?? 0), // fallback if needed
        unit: vData.unit,
        calAmount: Number(vData.calAmount),
        finalAmount: Number(vData.finalAmount),
        attributes: vData?.attributes,
      };
    });

    console.log(payload);
    if (UpdateData) {
      try {
        setLoading(true);
        const res = await useJwt.updateProductVariation(
          uidForUpdateData,
          payload
        );

        if (res.status === 200) {
          setProductData({
            ...data,
            findCategoryData,
            taxChargesType: "Exclusive",
          });
          toast.current.show({
            severity: "success",
            summary: "Successfully",
            detail: "Product Variations Add Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            stepper.next(1);
          }, 1999);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Failed",
            detail: "Product Variations Add Failed.",
            life: 2000,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      setProductData({
        ...productData,
        ...data,
        payload,
      });
      stepper.next(1);
    }
  };
  return (
    <>
      <Toast ref={toast} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start">
          <CardTitle tag="h4">Product Variations</CardTitle>
        </CardHeader>
        <hr />
        <Card className=" bg-light  border-0 shadow-sm rounded-4">
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
                    <Controller
                      name={`variations[${index}].images`}
                      control={control}
                      render={({ field: { value = [], onChange } }) => (
                        <>
                          {/* Upload box */}
                          <div className="border border-2 border-dashed rounded-3 p-4 text-center bg-light">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              hidden
                              id={`fileUpload-${index}`}
                              onChange={(e) => {
                                const files = Array.from(e.target.files);
                                const newFiles = files.map((file) =>
                                  Object.assign(file, {
                                    preview: URL.createObjectURL(file),
                                  })
                                );
                                onChange([...(value || []), ...newFiles]);
                              }}
                            />
                            <label
                              htmlFor={`fileUpload-${index}`}
                              className="d-inline-flex flex-column align-items-center justify-content-center cursor-pointer"
                              style={{ cursor: "pointer" }}
                            >
                              <FaCloudUploadAlt
                                size={32}
                                className="text-primary mb-2"
                              />
                              <span className="text-muted">
                                Click or drag files to upload
                              </span>
                            </label>
                          </div>

                          {/* Preview thumbnails BELOW the field */}
                          {value?.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mt-3">
                              {value.map((file, i) => (
                                <div
                                  key={i}
                                  className="position-relative"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <img
                                    src={
                                      file.preview || URL.createObjectURL(file)
                                    }
                                    alt="preview"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-1 rounded-circle"
                                    onClick={() => {
                                      const updated = [...value];
                                      updated.splice(i, 1);
                                      onChange(updated);
                                    }}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    />
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

                  {productData?.findCategoryData?.attributeKeys?.map(
                    (attr, idx) => (
                      <Col key={idx} md="4" sm="6" xs="12">
                        <Label className="form-label">{attr}</Label>
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
                    )
                  )}

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
          <div className="text-center mb-2 mt-2">
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
          </div>{" "}
        </Card>
        <div className="mt-2">
          <Button color="primary" disabled={loading} type="submit">
            {loading ? (
              <>
                {" "}
                Loading.. <Spinner size="sm" />{" "}
              </>
            ) : (
              <>Next</>
            )}
          </Button>
          <Button
            outline
            color="secondary"
            type="button"
            className="ms-2"
            onClick={() => reset()}
          >
            Reset
          </Button>
        </div>{" "}
      </Form>
    </>
  );
};

export default ProductAdd_Table;
