import useJwt from "@src/auth/jwt/useJwt";
import React, { Fragment, useEffect, useState } from "react";
import {
    Button,
    Col,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Spinner,
    UncontrolledAlert,
} from "reactstrap";

import { Controller, useForm } from "react-hook-form";

const AddCardExample = ({ show, mode, setShow, resetTableData, uid, row }) => {
  const {
    reset,
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parkingName: "",
      // perDayDueChargesType: "",
      parkingAmount: "",
      // perDayDueChargesAmount: "",
    },
  });

  const [HeaderError, setHeaderError] = useState(null);
  const [loadinng, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setHeaderError("");

    const payload = {
      ...data,
      parkingAmount: Number(data.parkingAmount),
      // perDayDueChargesAmount: Number(data.perDayDueChargesAmount),
    };

    if (!row) {
      try {
        setLoading(true);
        const res = await useJwt.addPass(payload);
        resetTableData?.();
        setShow(false);
        reset();
      } catch (error) {
         ("Error submitting form", error);
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

        const updatedRes = await useJwt.editpass(uid, payload);
         (updatedRes);

        resetTableData?.();

        setShow(false);
        reset();
      } catch (error) {
         ("Error submitting form", error);
        if (error.response) {
          const errorKeys = error?.response?.data?.content;
          setHeaderError(errorKeys);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const toggle = () => {
    setShow(!show);
    reset();
  };

  useEffect(() => {
    if (row) reset(row);
    else {
      reset({
        parkingName: "",
        parkingAmount: "",
      });
    }
  }, [reset, row]);

  return (
    <Fragment>
      <Modal
        isOpen={show}
        toggle={toggle}
        className="modal-dialog-centered"
        onClosed={() => reset()}
      >
        <ModalHeader className="bg-transparent" toggle={toggle}></ModalHeader>

        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h1 className="text-center mb-1">
            {row?.uid ? "Update " : "Create "}
            Parking Pass
          </h1>

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
              <Label className="form-label" for="parkingName">
                Pass Name
              </Label>
              <Controller
                name="parkingName"
                control={control}
                rules={{
                  required: "Tax name is required",
                  pattern: {
                    value: /^[A-Za-z0-9 ]+$/,

                    message: "Only alphabetic characters (A–Z) are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="parkingName"
                    placeholder="Enter Pass  name"
                    invalid={!!errors.parkingName}
                    onChange={(e) => {
                      const avoidSpecialChars = e.target.value.replace(
                        /[^a-zA-Z0-9 ]/g,
                        ""
                      );
                      field.onChange(avoidSpecialChars);
                    }}
                  />
                )}
              />
              {errors.parkingName && (
                <span className="text-danger">
                  {errors.parkingName.message}
                </span>
              )}
            </Col>

            <Col md={12}>
              <Label className="form-label" for="amount">
                Amount
              </Label>
              <Controller
                name="parkingAmount"
                control={control}
                rules={{
                  required: "Amount is required",
                  pattern: {
                    value: /^[0-9]+$/,

                    message: "Only numbers are allowed",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="parkingAmount"
                    placeholder="Enter Pass Amount"
                    invalid={!!errors.parkingAmount}
                    onChange={(e) => {
                      const avoidSpecialChars = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      field.onChange(avoidSpecialChars);
                    }}
                  />
                )}
              />
              {errors.parkingAmount && (
                <span className="text-danger">
                  {errors.parkingAmount.message}
                </span>
              )}
            </Col>

            {/* <Col md={12}>
              <Label className="form-label">Charges Type</Label>
              <Controller
                name="perDayDueChargesType"
                control={control}
                rules={{
                  required: "Charges Type is Required.",
                }}
                render={({ field }) => (
                  <div className="demo-inline-spacing">
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="flat"
                        value="Flat"
                        checked={field.value === "Flat"}
                        onChange={field.onChange}
                      />
                      <Label className="form-check-label" for="flat">
                        Flat
                      </Label>
                    </div>
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="percentage"
                        value="Percentage"
                        checked={field.value === "Percentage"}
                        onChange={field.onChange}
                      />
                      <Label className="form-check-label" for="percentage">
                        Percentage
                      </Label>
                    </div>
                  </div>
                )}
              />
              {errors.perDayDueChargesType && (
                <span className="text-danger">
                  {errors.perDayDueChargesType.message}
                </span>
              )}
            </Col>
            <Col md={12}>
              <Label className="form-label" for="amount">
                Charges Amount
              </Label>
              <Controller
                name="perDayDueChargesAmount"
                control={control}
                rules={{
                  required: "Charges Amount is required",
                  pattern: {
                    value: /^[0-9]+$/,

                    message: "Only numbers are allowed",
                  },

                  validate: (value) => {
                    if (
                      watch("perDayDueChargesType") === "Percentage" &&
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
                    id="perDayDueChargesAmount"
                    placeholder="Enter Pass Amount"
                    invalid={!!errors.perDayDueChargesAmount}
                     onChange={(e)=>{
                      const avoidSpecialChars=e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(avoidSpecialChars);
                    }}
                  />
                )}
              />
              {errors.perDayDueChargesAmount && (
                <span className="text-danger mt-1">
                  {errors.perDayDueChargesAmount.message}
                </span>
              )}
            </Col> */}

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
