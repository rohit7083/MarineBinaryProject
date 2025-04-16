import React, { Fragment, useEffect, useState } from "react";
import useJwt from "@src/auth/jwt/useJwt";
import { UncontrolledAlert } from "reactstrap";

// Reactstrap
import {
  Row,
  Col,
  Modal,
  Label,
  Input,
  Button,
  ModalBody,
  ModalHeader,
} from "reactstrap";

// React Hook Form
import { useForm, Controller } from "react-hook-form";

const AddCardExample = ({ show, setShow, uid, row ,setIsDataUpdated}) => {
  const {
    reset,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues:{
      taxName:"dsadsa255",
      taxType:"Flat",
      taxValue:"20"
    }
  });

const[HeaderError,setHeaderError]=useState(null);
 
  const onSubmit = async (data) => {

    setHeaderError("");

    const payload={
      ...data,
      taxValue:Number(data.taxValue)
    }

    if (!row) {
      try {
        const res = await useJwt.productTax(payload);
        setIsDataUpdated((prev)=>!prev);
        setShow(false);
        reset();
      } catch (error) {
        console.log("Error submitting form", error);
        if (error.response) {
          const errorKeys =error?.response?.data?.content;

          setHeaderError(errorKeys);

          if (errorKeys && typeof errorKeys === "object") {
            Object.entries(errorKeys).forEach(([fieldName, message]) => {
              setError(fieldName, {
                type: "manual",
                message: message
              });
            });
          }

        }
      }
    } else {
      try {
        const updatedRes = await useJwt.updateTax(uid, payload);
        console.log(updatedRes);
        setShow(false);
        reset();
      } catch (error) {
        console.log("Error submitting form", error);
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
                <strong>Error :   </strong>{HeaderError}</span>
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
                  pattern:{
                    value:/^[A-Za-z ]+$/,
                    message:"Only alphabetic characters (A–Z) are allowed"
                  }
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
                <span className="text-danger">{errors.taxName.message}</span>
              )}
            </Col>

            <Col md={12}>
              <Label className="form-label">Tax Type</Label>
              <Controller
                name="taxType"
                control={control}
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
            </Col>

            {/* Tax Value */}
            <Col md={12}>
              <Label className="form-label" for="taxValue">
                Tax Value
              </Label>
              <Controller
                name="taxValue"
                control={control}
                rules={{ required: "Tax value is required",
                  pattern:{
                    value:/^[0-9]+$/,

                    message:"Only numbers are allowed"
                  }
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
                <span className="text-danger">{errors.taxValue.message}</span>
              )}
            </Col>

            {/* Buttons */}
            <Col className="text-center mt-1" xs={12}>
              <Button type="submit" className="me-1" color="primary">
                Submit
              </Button>
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
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default AddCardExample;
