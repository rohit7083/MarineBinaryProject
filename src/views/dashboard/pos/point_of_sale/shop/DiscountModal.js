import useJwt from "@src/auth/jwt/useJwt";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

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

const DiscountModal = ({
  showModal,
  toggleModal,
  modalReset,
  headerError,
  onSubmit,
  watchDiscountApply,
  discountOptions,
  discountAmount,
  uids,
  finalAmount,
  customerUid,
  onValuesChange,
  setVerifyDiscount,
  setPosUid,
}) => {
  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      discountType: null,
      discount: "",
      caldis: 0,
      subtotal: 0,
      finalAmt: 0,
      otp: ["", "", "", ""],
    },
  });

  const watchDiscount = watch("discount");
  const watchDiscountType = watch("discountType");
  const watchOtp = watch("otp");

  const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";

  function generateKey(secretKey) {
    return CryptoJS.SHA256(secretKey);
  }

  function generateIV() {
    return CryptoJS.lib.WordArray.random(16);
  }

  function encryptAES(plainText) {
    const key = generateKey(SECRET_KEY);
    const iv = generateIV();

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
  }
  const [loading, setLoading] = useState(false);

  // Update subtotal when finalAmount changes
  useEffect(() => {
    setValue("subtotal", finalAmount || 0);
  }, [finalAmount, setValue]);

  useEffect(() => {
    if (!finalAmount || !watchDiscountType) return;

    let calAmt = 0;
    if (watchDiscountType.label === "Percentage") {
      calAmt = finalAmount * (Number(watchDiscount) / 100);
    } else {
      calAmt = Number(watchDiscount) || 0;
    }
    setValue("caldis", calAmt);
    const finalAmt = finalAmount - calAmt;

    setValue("finalAmt", finalAmt);
    onValuesChange?.({ caldis: calAmt, finalAmt });
  }, [watchDiscount, watchDiscountType, finalAmount, setValue, onValuesChange]);

  const onFormSubmit = async (data) => {
    const pin = data.otp.join("");
    const encrypted = encryptAES(pin);
    const formData = {
      uids: uids?.map((x) => x),
      isDiscountApply: true,
      pin: encrypted, // should be "pin", not "encrypted"
      discountType: "Flat", // or dynamic if needed
      discount: parseFloat(data.discount) || 0,
      calculatedDiscount: data.caldis,
      subtotal: data.subtotal,
      totalAmount: data.finalAmt,
      customerUid: customerUid,
      // slipUid: "ceb2f8d9-3c01-4eac-968d-a011c6748278",
    };

    console.log("Form Submit Data:", formData);
    // onSubmit(formData);

    try {
      setLoading(true);
      const res = await useJwt.posProductdis(formData);
      console.log(res);
      if (res?.data?.code === 200) {
        setPosUid(res?.data?.uid);
        toggleModal();
        setVerifyDiscount(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...watchOtp];
    newOtp[index] = value;
    setValue(`otp.${index}`, value);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !watchOtp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <Modal
      isOpen={showModal}
      toggle={toggleModal}
      className="modal-dialog-centered"
      onClosed={modalReset}
    >
      <ModalHeader
        className="bg-transparent"
        toggle={toggleModal}
      ></ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <h1 className="text-center mb-1">Apply Discount</h1>

        {headerError && (
          <UncontrolledAlert color="danger">
            <div className="alert-body">
              <span className="text-danger fw-bold">
                <strong>Error : </strong>
                {headerError}
              </span>
            </div>
          </UncontrolledAlert>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Row className="gy-1 gx-2 mt-75">
            {watchDiscountApply && (
              <>
                {/* Discount Type */}
                <Col md="6" className="mb-2">
                  <Label>Discount Type</Label>
                  <Controller
                    name="discountType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        options={discountOptions}
                      />
                    )}
                  />
                </Col>

                {/* Discount Value */}
                <Col md="6" className="mb-2">
                  <Label>Discount</Label>
                  <Controller
                    name="discount"
                    control={control}
                    render={({ field }) => (
                      <Input type="number" min={0} {...field} />
                    )}
                  />
                </Col>

                {/* Subtotal */}
                <Col md="12">
                  <Label>Subtotal</Label>
                  <Controller
                    name="subtotal"
                    control={control}
                    render={({ field }) => (
                      <Input type="number" {...field} disabled />
                    )}
                  />
                </Col>

                {/* Calculated Discount */}
                <Col md="12">
                  <Label>Calculated Discount</Label>
                  <Controller
                    name="caldis"
                    control={control}
                    render={({ field }) => (
                      <Input type="number" {...field} disabled />
                    )}
                  />
                </Col>

                {/* Final Amount */}
                <Col md="12">
                  <Label>Total to Pay Amount</Label>
                  <Controller
                    name="finalAmt"
                    control={control}
                    render={({ field }) => (
                      <Input type="number" {...field} disabled />
                    )}
                  />
                </Col>

                {/* OTP */}
                <Row className="mt-1">
                  <Label className="form-label">
                    Enter 4 digit Pin <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Col md="8" className="mb-1">
                    <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                      {watchOtp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-input-${index}`}
                          maxLength="1"
                          className="auth-input height-50 text-center numeral-mask mx-25 mb-1"
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(e.target.value, index)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </Col>
                </Row>
              </>
            )}

            <Col className="text-center mt-1" xs={12}>
              <Button
                type="button"
                color="secondary"
                outline
                size="sm"
                onClick={toggleModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="mx-1"
                color="primary"
                size="sm"
              >
                {loading ? (
                  <>
                    <span>Loading.. </span>
                    <Spinner size="sm" />
                  </>
                ) : (
                  "Apply Discount"
                )}
              </Button>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default DiscountModal;
