import { Fragment, useState } from "react";
import useJwt from "@src/auth/jwt/useJwt";

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


const AddCardExample = ({ show, setShow }) => {
  // Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ 
    // defaultValues 
  });

  const onSubmit = async(data) => {

  // if (!vendorData) {
      try {
        const res = await useJwt.productTax(data);
        console.log("Response from API", res);
      } catch (error) {
        console.log("Error submitting form", error);
      }
    
    // else {
      // try {
      //   const updatedRes = await useJwt.updateTax(vendorData?.uid, payload);
      //   console.log(updatedRes);
      // } catch (error) {
      //   console.log("Error submitting form", error);
      // }
    // }


    console.log("Submitted Data:", data);
    setShow(false);
    reset();
  };

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
                rules={{ required: "Tax name is required" }}
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

            {/* Tax Type */}
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
                rules={{ required: "Tax value is required" }}
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
