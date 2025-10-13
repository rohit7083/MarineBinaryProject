import useJwt from "@src/auth/jwt/useJwt";
import CryptoJS from "crypto-js";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

const DiscountModal = ({ isOpen, toggle, setDiscountData }) => {
  const {
    control,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      discountType: "",
      discountValue: "",
      calculatedDiscount: "",
      totalAfterDiscount: "",
      pin: ["", "", "", ""],
    },
  });

  const { items, billing, selectedCustomerDetails } = useSelector(
    (store) => store.cartSlice
  );
  const toast = useRef(null);

  const subtotal = billing?.total || 0;
  const [discountLoad, setDiscountLoad] = useState(false);
  const watchOtp = watch("pin");
  const watchDiscountType = watch("discountType");
  const watchDiscountValue = watch("discountValue");

  // Auto-calculate discount and total after discount
  useEffect(() => {
    const discountVal = parseFloat(watchDiscountValue) || 0;
    let calculatedDiscount = 0;

    if (watchDiscountType === "Flat") {
      calculatedDiscount = discountVal;
    } else if (watchDiscountType === "Percentage") {
      calculatedDiscount = (subtotal * discountVal) / 100;
    }
    // Ensure discount doesn't exceed subtotal
    if (calculatedDiscount > subtotal) {
      calculatedDiscount = subtotal;
      toast.current.show({
        severity: "error",
        summary: "Invalid Discount",
        detail: "Discount cannot exceed total amount",
        life: 2000,
      });
    }

    const totalAfterDiscount = subtotal - calculatedDiscount;

    setValue("calculatedDiscount", calculatedDiscount.toFixed(2));
    setValue("totalAfterDiscount", totalAfterDiscount.toFixed(2));
  }, [watchDiscountType, watchDiscountValue, subtotal, setValue]);

  // Handle PIN input
  const handleOtpChange = (value, index) => {
    const otp = [...watchOtp];
    otp[index] = value;
    setValue("pin", otp);
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-dis-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !watchOtp[index] && index > 0) {
      const prevInput = document.getElementById(`pin-dis-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";
  const encryptAES = (plainText) => {
    const key = CryptoJS.SHA256(SECRET_KEY);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
  };

  const onSubmit = async (data) => {
    const totalAfterDiscount = parseFloat(data.totalAfterDiscount);

    if (totalAfterDiscount <= 0) {
      toast.current.show({
        severity: "error",
        summary: "Invalid Total",
        detail: "Total after discount cannot be zero or negative",
        life: 2000,
      });
      return;
    }
    const encryptedPin = encryptAES(data.pin.join(""));
    const payload = {
      uids: items?.map((x) => x?.posId),
      isDiscountApply: true,
      discountType: data.discountType,
      discount: data.discountValue,
      calculatedDiscount: data.calculatedDiscount,
      totalAmount: data.totalAfterDiscount,
      pin: encryptedPin,
      subtotal: data.totalAfterDiscount,
      ...(selectedCustomerDetails.type == "slipMember"
        ? { slipUid: selectedCustomerDetails?.value }
        : selectedCustomerDetails.type == "member"
        ? {
            memberUid: selectedCustomerDetails?.value,
          }
        : {
            customerUid:
              selectedCustomerDetails?.value || selectedCustomerDetails?.uid,
          }),
    };

    try {
      setDiscountLoad(true);
      const discountRes = await useJwt.posProductdis(payload);

      if (discountRes?.status === 200) {
        const responseUid = discountRes.data?.uid;
        setDiscountData({
          ...payload,
          status: true,
          disCountUid: responseUid,
        });
        toast.current.show({
          severity: "success",
          summary: " Successfully",
          detail: "Discount Applied Successfully",
          life: 2000,
        });
        setTimeout(() => {
          toggle();
        }, 2000);
      } else {
        setDiscountData({
          ...payload,
          status: false, // optional: false for other statuses
        });
      }
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Failed ",
        detail: `${error.response.data.content}`,
        life: 2000,
      });
    } finally {
      setDiscountLoad(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader toggle={toggle}>Apply Discount</ModalHeader>
      <Toast ref={toast} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <Card className="border-primary shadow-sm">
            <CardBody>
              <Row className="mb-3">
                <Col md="6">
                  <Label>Total Amount</Label>
                  <Input
                    type="number"
                    value={subtotal}
                    disabled
                    className="bg-light fw-bold"
                  />
                </Col>
                <Col md="6">
                  <Label>Discount Type</Label>
                  <Controller
                    name="discountType"
                    control={control}
                    rules={{ required: "Select discount type" }}
                    render={({ field }) => (
                      <Input type="select" {...field}>
                        <option value="">-- Select Type --</option>
                        <option value="Flat">Flat</option>
                        <option value="Percentage">Percentage</option>
                      </Input>
                    )}
                  />
                  {errors.discountType && (
                    <small className="text-danger">
                      {errors.discountType.message}
                    </small>
                  )}
                </Col>
              </Row>

              <Row className="mb-3">
                {/* <Col md="6">
                  <Label>Discount Value</Label>
                  <Controller
                    name="discountValue"
                    control={control}
                    rules={{
                      required: "Enter discount value",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numbers allowed",
                      },
                      validate: (value) => {
                        if (
                          getValues("discountType") === "Percentage" &&
                          Number(value) >= 100
                        )
                          return "Percentage must be less than 100";
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Enter value"
                        {...field}
                        min="0"
                        className="bg-light"
                      />
                    )}
                  />
                  {errors.discountValue && (
                    <small className="text-danger">
                      {errors.discountValue.message}
                    </small>
                  )}
                </Col> */}

                <Col md="6">
                  <Label>Discount Value</Label>
                  <Controller
                    name="discountValue"
                    control={control}
                    rules={{
                      required: "Enter discount value",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numbers allowed",
                      },
                      validate: (value) => {
                        if (
                          getValues("discountType") === "Percentage" &&
                          Number(value) >= 100
                        )
                          return "Percentage must be less than 100";
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text" // use text so we can fully control input
                        placeholder="Enter value"
                        {...field}
                        className="bg-light"
                        onChange={(e) => {
                          // allow only digits
                          const filteredValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          field.onChange(filteredValue);
                        }}
                      />
                    )}
                  />
                  {errors.discountValue && (
                    <small className="text-danger">
                      {errors.discountValue.message}
                    </small>
                  )}
                </Col>

                <Col md="6">
                  <Label>Calculated Discount</Label>
                  <Controller
                    name="calculatedDiscount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        disabled
                        className="bg-light fw-bold"
                      />
                    )}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md="6">
                  <Label>Payable Amoun</Label>
                  <Controller
                    name="totalAfterDiscount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        disabled
                        className="bg-success text-white fw-bold"
                      />
                    )}
                  />
                </Col>
              </Row>

              <Col md="12">
                <Label>Enter 4-digit PIN</Label>
                <Controller
                  name="pin"
                  control={control}
                  rules={{
                    validate: (value) => {
                      // Ensure all 4 digits are entered
                      if (!value.every((digit) => digit !== "")) {
                        return "PIN must be 4 digits";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <div className="d-flex gap-2 mt-1">
                      {field.value.map((digit, index) => (
                        <Input
                          key={index}
                          id={`pin-dis-${index}`}
                          maxLength="1"
                          type="text"
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            const otp = [...field.value];
                            otp[index] = val;
                            field.onChange(otp);
                            handleOtpChange(val, index); // optional for focus navigation
                          }}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          className="text-center fs-5 fw-bold border rounded"
                          style={{ width: "50px", height: "50px" }}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  )}
                />
                {errors.pin && (
                  <small className="text-danger">{errors.pin.message}</small>
                )}
              </Col>
            </CardBody>
          </Card>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="success" disabled={discountLoad} type="submit">
            {discountLoad ? (
              <>
                Loading.. <Spinner size="sm" />
              </>
            ) : (
              "Apply Discount"
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default DiscountModal;
