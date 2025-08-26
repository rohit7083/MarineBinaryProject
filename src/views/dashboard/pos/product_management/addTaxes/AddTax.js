import useJwt from "@src/auth/jwt/useJwt";
import React, { Fragment, useEffect, useState } from "react";
import { FormFeedback, Spinner, UncontrolledAlert } from "reactstrap";

// Reactstrap
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

// React Hook Form
import { Controller, useForm } from "react-hook-form";

const AddCardExample = ({ show, setShow, uid, row, resetTable }) => {
  const {
    reset,
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // taxName: "dsadsa255",
      // taxType: "Flat",
      // taxValue: "20",
    },
  });

  const [HeaderError, setHeaderError] = useState(null);
  const [loadinng, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setHeaderError("");

    const payload = {
      ...data,
      taxValue: Number(data.taxValue),
    };

    if (!row) {
      try {
        setLoading(true);
        const res = await useJwt.productTax(payload);
        await resetTable();
        setShow(false);
        reset();
      } catch (error) {
        console.log("Error submitting form", error);
        if (error.response) {
          const errorKeys = error?.response?.data?.content;

          setHeaderError(errorKeys);

          if (errorKeys && typeof errorKeys === "object") {
            Object.entries(errorKeys).forEach(([fieldName, message]) => {
              setError(fieldName, {
                type: "manual",
                message: message,
              });
            });
          }
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);

        const updatedRes = await useJwt.updateTax(uid, payload);
        console.log(updatedRes);
        setShow(false);
        reset();
      } catch (error) {
        console.log("Error submitting form", error);
        if (error.response) {
          const errorKeys = error?.response?.data?.content;
          setHeaderError(errorKeys);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (row && show) {
      reset({
        taxName: row.taxName || "",
        taxType: row.taxType || "",
        taxValue: row.taxValue || "",
      });
    }
  }, [row, show, reset]);

  return (
    <Fragment>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered"
        onClosed={() => reset()}
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>

        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h1 className="text-center mb-1">Add Product Tax</h1>

          {HeaderError && (
            <React.Fragment>
              <UncontrolledAlert color="danger">
                <div className="alert-body">
                  <span className="text-danger fw-bold">
                    <strong>Error : </strong>
                    {HeaderError}
                  </span>
                </div>
              </UncontrolledAlert>
            </React.Fragment>
          )}

          <Row
            tag="form"
            className="gy-1 gx-2 mt-75"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Tax Name */}
            <Col md={12}>
              <Label className="form-label" for="taxName">
                Tax Name
              </Label>
              <Controller
                name="taxName"
                control={control}
                rules={{
                  required: "Tax name is required",
                  pattern: {
                    value: /^[A-Za-z][A-Za-z\s\-&'()]{1,49}$/,
                    message: "Only alphabetic characters (A–Z) are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="taxName"
                    placeholder="Enter tax name"
                    invalid={!!errors.taxName}
                  />
                )}
              />
              {errors.taxName && (
                <FormFeedback>{errors.taxName.message}</FormFeedback>
              )}
            </Col>

            <Col md={12}>
              <Label className="form-label mb-1">Tax Type</Label>{" "}
              {/* removed bottom margin */}
              <Controller
                name="taxType"
                control={control}
                rules={{
                  required: "Tax Type is required",
                }}
                render={({ field }) => (
                  <div className="d-flex align-items-center gap-2">
                    {" "}
                    {/* inline radios */}
                    <div className="form-check m-0">
                      <Input
                        type="radio"
                        id="flat"
                        value="Flat"
                        checked={field.value === "Flat"}
                        onChange={(e) => field.onChange(e.target.value)}
                        invalid={!!errors.taxType}
                      />
                      <Label className="form-check-label" htmlFor="flat">
                        Flat
                      </Label>
                    </div>
                    <div className="form-check m-0">
                      <Input
                        type="radio"
                        id="percentage"
                        value="Percentage"
                        checked={field.value === "Percentage"}
                        onChange={(e) => field.onChange(e.target.value)}
                        invalid={!!errors.taxType}
                      />
                      <Label className="form-check-label" htmlFor="percentage">
                        Percentage
                      </Label>
                    </div>
                  </div>
                )}
              />
              {errors.taxType && (
                <div className="invalid-feedback d-block">
                  {errors.taxType.message}
                </div>
              )}
            </Col>

            {/* Tax Value */}
            <Col md={12}>
              <Label className="form-label" for="taxValue">
                Tax Value
              </Label>
              <Controller
                name="taxValue"
                control={control}
                rules={{
                  required: "Tax value is required",
                  pattern: {
value: /^\d+(\.\d+)?$/,

                    message: "Only numbers are allowed",
                  },

                  validate: (value) => {
                    if (
                      watch("taxType") === "Percentage" &&
                      Number(value) > 100
                    ) {
                      return "Percentage cannot be greater than 100";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="taxValue"
                    placeholder="Enter tax amount"
                    invalid={!!errors.taxValue}
                  />
                )}
              />
              {errors.taxValue && (
                <FormFeedback>{errors.taxValue.message}</FormFeedback>
              )}
            </Col>

            {/* Buttons */}
            <Col className="text-center mt-1" xs={12}>
              <Button
                color="secondary"
                outline
                onClick={() => {
                  setShow(!show);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loadinng}
                className="mx-1"
                color="primary"
              >
                {loadinng ? (
                  <>
                    <span>Loading.. </span>
                    <Spinner size="sm" />{" "}
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default AddCardExample;
