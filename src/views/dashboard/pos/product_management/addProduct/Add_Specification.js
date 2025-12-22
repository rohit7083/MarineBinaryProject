import useJwt from "@src/auth/jwt/useJwt";
import { AnimatePresence, motion } from "framer-motion";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "react-feather";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Form,
  FormFeedback,
  Input,
  Spinner,
  Table,
  UncontrolledAlert,
} from "reactstrap";

const Add_Specification = ({
  stepper,
  productData,
  setProductData,
  UpdateData,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { specifications: [{ name: "", value: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setProductData({
      ...data,
      ...productData,
    });

    const formData = new FormData();
     const selectedUserStr = localStorage.getItem("selectedBranch");
    const selectedBranch = JSON.parse(selectedUserStr);
    let branchUid = selectedBranch.uid;
        formData.append("branch.uid",branchUid);

    formData.append("name", productData?.name);
    if (productData?.description?.trim()) {
      formData.append("description", productData.description.trim());
    }

    formData.append("productType", productData?.productType);
    formData.append("taxChargesType", "Exclusive");
    formData.append("vendorUid.uid", productData?.vendor || "");
    formData.append("taxUid.uid", productData?.taxes || "");
    formData.append("categoryUid.uid", productData?.category || "");

    productData?.variations?.forEach((variation, index) => {
      formData.append(`variations[${index}].mrp`, variation.mrp || "");
      formData.append(
        `variations[${index}].stockQty`,
        variation.stockQty || ""
      );
      formData.append(`variations[${index}].quantity`, variation.qty || "");
      formData.append(`variations[${index}].unit`, variation.unit || "");
      formData.append(
        `variations[${index}].calAmount`,
        variation.calcAmount || ""
      );
      formData.append(
        `variations[${index}].finalAmount`,
        variation.finalAmount || ""
      );
      if (Array.isArray(variation?.attributes)) {
        variation.attributes.forEach((x, i) => {
          if (
            x?.attributeName?.trim() &&
            x?.value !== undefined &&
            x.value !== null &&
            x.value !== ""
          ) {
            formData.append(
              `variations[${index}].attributes[${i}].attributeName`,
              x?.attributeName.trim()
            );
            formData.append(
              `variations[${index}].attributes[${i}].value`,
              x?.value
            );
          }
        });
      }
      variation?.images?.forEach((img, i) => {
        formData.append(
          `variations[${index}].variationImages[${i}].image`,
          img || ""
        );
      });
    });

    if (data?.specifications) {
      data.specifications.forEach((specification, index) => {
        formData.append(
          `specifications[${index}].specKey`,
          specification.name || ""
        );
        formData.append(
          `specifications[${index}].specValue`,
          specification.value || ""
        );
      });
    }

    try {
      const specs = data?.specifications?.map((x) => ({
        specKey: x?.name,
        specValue: x?.value,
      }));

      setLoading(true);

      if (UpdateData) {
        const res = await useJwt.updateProductSpecification(data?.uid, specs);
        if (res?.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Successfully",
            detail: "Product Specifications Updated Successfully.",
            life: 2000,
          });
          setTimeout(() => navigate("/dashboard/pos/product_management"), 1999);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Failed",
            detail: "Product Specifications Update Failed.",
            life: 2000,
          });
        }
      } else {
        const res = await useJwt.addProduct(formData);
        if (res?.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Successfully",
            detail: "Product Specification Added Successfully.",
            life: 2000,
          });
          setTimeout(() => navigate("/dashboard/pos/product_management"), 1999);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Failed",
            detail: "Product Specification Add Failed.",
            life: 2000,
          });
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setErr(
          error?.response?.data?.content ||
            "Please check all fields and try again"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (UpdateData) {
      reset({
        ...UpdateData,
        specifications: UpdateData.specifications?.map((s) => ({
          name: s.specKey,
          value: s.specValue,
        })),
      });
    }
  }, [UpdateData, reset]);

  return (
    <>
      <Toast ref={toast} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <CardTitle tag="h4" className="mb-2">
            📋 Specifications
          </CardTitle>
        </CardHeader>

        <Card className="border-0 shadow-sm rounded-4">
          {err && (
            <UncontrolledAlert color="danger">
              <div className="alert-body">
                <span className="text-danger fw-bold">
                  <strong>Error :</strong> {err}
                </span>
              </div>
            </UncontrolledAlert>
          )}

          <Table responsive bordered hover className="align-middle mb-0">
            <thead className="bg-light text-secondary fw-semibold">
              <tr>
                <th style={{ width: "40%" }}>Specification Name</th>
                <th style={{ width: "40%" }}>Value</th>
                <th className="text-center" style={{ width: "10%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {fields.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="editable-row"
                  >
                    <td>
                      <Controller
                        control={control}
                        name={`specifications[${index}].name`}
                        rules={{
                          required: "Specification Name is required",
                          pattern: {
                            value: /^[A-Za-z ]+$/,
                            message: "Only letters allowed",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="e.g. Material"
                            invalid={!!errors?.specifications?.[index]?.name}
                            {...field}
                            onChange={(e) => {
                              // Allow only letters, numbers, and spaces
                              const alphanumericAndSpaces =
                                e.target.value.replace(/[^A-Za-z0-9\s]/g, "");
                              field.onChange(alphanumericAndSpaces);
                            }}
                          />
                        )}
                      />
                      {errors?.specifications?.[index]?.name && (
                        <FormFeedback>
                          {errors.specifications[index].name.message}
                        </FormFeedback>
                      )}
                    </td>

                    <td>
                      <Controller
                        control={control}
                        name={`specifications[${index}].value`}
                        rules={{
                          required: "Value is required",
                          pattern: {
                            value: /^[A-Za-z0-9 ]+$/,
                            message: "Letters & numbers only",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="e.g. Cotton"
                            invalid={!!errors?.specifications?.[index]?.value}
                            {...field}
                            className="rounded-2"
                            onChange={(e) => {
                              // Allow only letters, numbers, and spaces
                              const alphanumericAndSpaces =
                                e.target.value.replace(/[^A-Za-z0-9\s]/g, "");
                              field.onChange(alphanumericAndSpaces);
                            }}
                          />
                        )}
                      />
                      {errors?.specifications?.[index]?.value && (
                        <FormFeedback>
                          {errors.specifications[index].value.message}
                        </FormFeedback>
                      )}
                    </td>

                    <td className="text-center">
                      <Button
                        color="danger"
                        size="sm"
                        outline
                        className="p-1"
                        onClick={() => remove(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </Table>

          <div className="d-flex justify-content-center p-3">
            <Button
              color="primary"
              className="rounded-pill d-flex align-items-center gap-2 shadow-sm px-4"
              onClick={() => append({ name: "", value: "" })}
            >
              <Plus size={18} /> Add Specification
            </Button>
          </div>
        </Card>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button>

          <div>
            <Button color="primary" disabled={loading} type="submit">
              {loading ? (
                <>
                  Loading.. <Spinner size="sm" />
                </>
              ) : (
                <>Submit</>
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
          </div>
        </div>
      </Form>

      <style jsx>{`
        .editable-row:hover {
          background: #f9fbff !important;
          transition: background 0.2s ease;
        }
        thead th {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        td {
          vertical-align: middle;
        }
      `}</style>
    </>
  );
};

export default Add_Specification;
