import useJwt from "@src/auth/jwt/useJwt";
import React, { useState } from "react";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import "react-phone-input-2/lib/bootstrap.css";
import { useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
  Table,
  UncontrolledAlert,
} from "reactstrap";
import NavItems from "./NavItems";

const MultipleColumnForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const location = useLocation();
  const { state } = location;
  console.log(state);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [err, setErr] = useState("");
  const [successMessages, setSuccessMessages] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleSidebar = () => setOpen(!open);
  const handleAddStock = async (index) => {
    if (isProcessing) return;
    const variationData = getValues(`variations.${index}`);
    const stockQty = variationData?.stockQty;

    if (!stockQty) {
      console.error(`Variation ${index + 1} stock is required`);
      setErr(`Variation ${index + 1} stock Quantity  is required`);
      return;
    }
    setIsProcessing(true);
    setLoadingIndex(index);
    const variationId = state.row.variations[index].uid;
    try {
      const payload = {
        stockQty,
      };
      const res = await useJwt.addStocks(variationId, payload);
      // setErr("");
      setSuccessMessages((prev) => ({
        ...prev,
        [index]: `Stock for Variation ${index + 1} added successfully!`,
      }));

      setTimeout(() => {
        setSuccessMessages((prev) => {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        });
      }, 5000);
      console.log("Stock added successfully:", res);
      setValue(`variations.${index}.stockQty`, "");
    } catch (err) {
      console.error("Error adding stock:", err);
      setErr(
        err?.response?.data?.message ||
          err?.response?.content?.message ||
          "Write Appropriate Number"
      );
    } finally {
      setLoadingIndex(null);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
          <CardTitle tag="h4">
            {" "}
            <ArrowLeft
              style={{
                cursor: "pointer",
                marginRight: "10px",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
              onClick={() => window.history.back()}
            />
            Add Product Stocks
          </CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <div className="d-flex  mt-2 justify-content-start gap-2">
              <NavItems />
            </div>
          </div>
        </CardHeader>

        <CardBody className="mt-2">
          <Table borderless size="sm">
            <tbody>
              <tr>
                <td className="text-muted">
                  <strong>Product :</strong>
                </td>
                <td className="fw-bold">{state?.row?.name || "N/A"}</td>
              </tr>
              <tr>
                <td className="text-muted">
                  <strong>Category :</strong>
                </td>
                <td className="fw-bold">
                  {state?.row?.categoryUid?.name || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="text-muted">
                  <strong>Variations :</strong>
                </td>
                <td className="fw-bold">
                  {state?.row?.variations?.length || 0}
                </td>
              </tr>
            </tbody>
          </Table>

          <hr />
          {err && (
            <React.Fragment>
              <UncontrolledAlert color="danger">
                <div className="alert-body">
                  <span className="text-danger fw-bold">
                    <strong>Error :</strong>
                    {err}
                  </span>
                </div>
              </UncontrolledAlert>
            </React.Fragment>
          )}
          {state?.row?.variations?.map((x, index) => (
            <Row key={index} className="mb-3">
              <Col md="8">
                <Label>
                  <strong>
                    {x?.attributes?.[index]?.attributeName
                      ? `(variations - ${[index + 1]})  ${
                          x?.attributes?.[index]?.attributeName
                        }`
                      : `Variation ${index + 1}`}{" "}
                  </strong>{" "}
                  Stock Quantity{" "}
                  <span
                    onClick={() => setActiveIndex(index)}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    (View)
                  </span>
                </Label>

                <Modal
                  isOpen={activeIndex !== null}
                  toggle={() => setActiveIndex(null)}
                >
                  <ModalHeader toggle={() => setActiveIndex(null)} tag="div">
                    <h5 className="modal-title">
                      <span className="align-middle">
                        Variation -{" "}
                        {activeIndex !== null ? activeIndex + 1 : ""}
                      </span>
                    </h5>
                  </ModalHeader>
                  <ModalBody>
                    {activeIndex !== null && (
                      <div>
                        {state?.row?.variations?.[activeIndex]?.attributes?.map(
                          (att, i) => (
                            <div key={i} className="mb-1">
                              {/* <CardTitle>Sku - {att?.sku}</CardTitle> */}
                              <strong>{att?.attributeName}:</strong>{" "}
                              {att?.value}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </ModalBody>
                </Modal>
                <Controller
                  name={`variations.${index}.stockQty`} // unique name per variation
                  control={control}
                  rules={{
                    min: {
                      value: 0,
                      message: "Stock cannot be negative!",
                    },
                  }}
                  render={({ field }) => (
                    <Input type="number" min="0" {...field} />
                  )}
                />

                {errors?.variations?.[index]?.stockQty && (
                  <small className="text-danger">
                    {errors.variations[index].stockQty.message}
                  </small>
                )}
                {successMessages[index] && (
                  <small className="text-success">
                    {successMessages[index]}
                  </small>
                )}
              </Col>
              <Col className="mt-2">
                <Button
                  size=""
                  color="primary"
                  onClick={() => handleAddStock(index)}
                  type="button"
                  disabled={loadingIndex === index || isProcessing}
                >
                  {loadingIndex === index ? (
                    <>
                      Loading... <Spinner size="sm" />
                    </>
                  ) : (
                    "Add Stock"
                  )}{" "}
                </Button>
              </Col>
            </Row>
          ))}
        </CardBody>
      </Card>
    </>
  );
};

export default MultipleColumnForm;
