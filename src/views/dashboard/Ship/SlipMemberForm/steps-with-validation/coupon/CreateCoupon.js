import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";

function AddDiscountCoupon() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errMsz, seterrMsz] = useState("");

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const discountType = watch("discountType");
  const couponType = watch("couponType");
  const location = useLocation();
  const rowData = location.state?.row;
  const uid = rowData?.uid;
  useEffect(() => {
    if (uid) {
      reset({
        couponCode: rowData.couponCode || "",
        discountType: rowData.discountType || "FreeDuration",
        couponType: rowData.couponType || "",
        durationUnit: rowData.durationUnit || "Month",
        durationValue: rowData.durationValue || "",
        endDate: rowData.endDate || "",
        maxUsageLimit: rowData.maxUsageLimit || "",
      });
    }
  }, [uid]);

  const onSubmit = async (data) => {
    // debugger
    setLoading(true);

    seterrMsz("");
    let payload = {
      couponCode: data?.couponCode,
      discountType: data?.discountType,
    };

    if (discountType === "FreeDuration") {
      payload.durationUnit = data?.durationUnit;
      payload.durationValue = data?.durationValue;
    } else {
      payload.amount = data?.amount;
      payload.couponType = data?.couponType;

      if (couponType == "timebased") {
        payload.endDate = data?.endDate;
      } else {
        payload.maxUsageLimit = data?.maxUsageLimit;
      }
    }

    try {
      if (uid) {
        const res = await useJwt.updateCoupan(uid, payload);

        if (res.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Coupon updated successfully.",
            life: 2000,
          });

          setTimeout(() => {
            navigate("/coupon");
          }, 2000);
        }
      } else {
        const res = await useJwt.createCoupon(payload);

        if (res.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Created Successfully",
            detail: "Coupon created successfully.",
            life: 2000,
          });

          setTimeout(() => {
            navigate("/coupon");
          }, 2000);
        }
      }
    } catch (error) {
      seterrMsz(error.response?.data?.content || "Failed to process request!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Card>
        <CardBody>
          <CardTitle>
            <CardText>
              <ArrowLeft
                style={{ cursor: "pointer", marginRight: "10px" }}
                onClick={() => window.history.back()}
              />
              {!uid ? "Create" : "Update"} Discount Coupon
            </CardText>
          </CardTitle>

          <Toast ref={toast} />

          {errMsz && (
            <UncontrolledAlert color="danger">
              <span className="fw-bold">Error : {errMsz}</span>
            </UncontrolledAlert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              {/* Coupon Code */}
              <Col sm="6" className="mb-1">
                <Label>Coupon Code</Label>

                <Controller
                  name="couponCode"
                  control={control}
                  rules={{ required: "Coupon Code is required" }}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter coupon code"
                      invalid={!!errors.couponCode}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/[^A-Za-z0-9]/g, "")
                          .toUpperCase()
                          .slice(0, 10);

                        field.onChange(value);
                      }}
                    />
                  )}
                />

                {errors.couponCode && (
                  <p style={{ color: "red" }}>{errors.couponCode.message}</p>
                )}
              </Col>

              {/* Discount Type */}
              <Col sm="6" className="mb-1">
                <Label>Discount Type</Label>

                <Controller
                  name="discountType"
                  control={control}
                  rules={{ required: "Discount Type is required" }}
                  render={({ field }) => (
                    <Input
                      type="select"
                      {...field}
                      invalid={!!errors.discountType}
                    >
                      <option value="">Select Discount Type</option>
                      <option value="FreeDuration">Free Duration</option>
                      <option value="Flat">Flat</option>
                      <option value="Percentage">Percentage</option>
                    </Input>
                  )}
                />

                {errors.discountType && (
                  <p style={{ color: "red" }}>{errors.discountType.message}</p>
                )}
              </Col>

              {discountType === "FreeDuration" && (
                <>
                  {/* Duration Unit */}
                  <Col sm="6" className="mb-1">
                    <Label>Duration Unit</Label>

                    <Controller
                      name="durationUnit"
                      control={control}
                      rules={{ required: "Duration Unit is required" }}
                      render={({ field }) => (
                        <Input
                          type="select"
                          {...field}
                          invalid={!!errors.durationUnit}
                        >
                          <option value="">Select Duration Unit</option>
                          <option value="Month">Month</option>
                          <option value="Year">Year</option>
                        </Input>
                      )}
                    />

                    {errors.durationUnit && (
                      <p style={{ color: "red" }}>
                        {errors.durationUnit.message}
                      </p>
                    )}
                  </Col>
                  {/* Duration Value */}
                  <Col sm="6" className="mb-1">
                    <Label>Duration Value</Label>

                    <Controller
                      name="durationValue"
                      control={control}
                      rules={{
                        required: "Duration value is required",
                        min: { value: 1, message: "Minimum value is 1" },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter duration value"
                          invalid={!!errors.durationValue}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 3);
                            field.onChange(value);
                          }}
                        />
                      )}
                    />

                    {errors.durationValue && (
                      <p style={{ color: "red" }}>
                        {errors.durationValue.message}
                      </p>
                    )}
                  </Col>
                </>
              )}
              {(discountType === "Flat" || discountType === "Percentage") && (
                <>
                  <Col sm="6" className="mb-1">
                    <Label>
                      {discountType === "Percentage"
                        ? "Percentage (%)"
                        : "Amount"}
                    </Label>

                    <Controller
                      name="amount"
                      control={control}
                      rules={{
                        required: "Amount is required",
                        validate: (value) => {
                          if (discountType === "Percentage" && value > 100) {
                            return "Percentage cannot exceed 100";
                          }
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter value"
                          invalid={!!errors.amount}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 5);
                            field.onChange(value);
                          }}
                        />
                      )}
                    />

                    {errors.amount && (
                      <p style={{ color: "red" }}>{errors.amount.message}</p>
                    )}
                  </Col>

                  <Col sm="6" className="mb-1">
                    <Label>Coupon Type</Label>

                    <Controller
                      name="couponType"
                      control={control}
                      rules={{ required: "Coupon Type is required" }}
                      render={({ field }) => (
                        <Input
                          type="select"
                          {...field}
                          invalid={!!errors.couponType}
                        >
                          <option value="">Select Coupon Type</option>
                          <option value="timebased">Time Based</option>
                          <option value="countbased">Usage Count Based</option>
                        </Input>
                      )}
                    />

                    {errors.couponType && (
                      <p style={{ color: "red" }}>
                        {errors.couponType.message}
                      </p>
                    )}
                  </Col>
                  {couponType === "timebased" && (
                    <Col sm="6" className="mb-1">
                      <Label>End Date</Label>

                      <Controller
                        name="endDate"
                        control={control}
                        rules={{ required: "End date is required" }}
                        render={({ field }) => (
                          <Input
                            type="date"
                            invalid={!!errors.endDate}
                            {...field}
                          />
                        )}
                      />

                      {errors.endDate && (
                        <p style={{ color: "red" }}>{errors.endDate.message}</p>
                      )}
                    </Col>
                  )}
                  {couponType === "countbased" && (
                    <Col sm="6" className="mb-1">
                      <Label>Maximum Usage Limit</Label>

                      <Controller
                        name="maxUsageLimit"
                        control={control}
                        rules={{
                          required: "Usage limit is required",
                          min: { value: 1, message: "Minimum usage must be 1" },
                        }}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Enter max usage"
                            invalid={!!errors.maxUsageLimit}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 5);
                              field.onChange(value);
                            }}
                          />
                        )}
                      />

                      {errors.maxUsageLimit && (
                        <p style={{ color: "red" }}>
                          {errors.maxUsageLimit.message}
                        </p>
                      )}
                    </Col>
                  )}
                </>
              )}
            </FormGroup>

            <Button type="submit" disabled={loading} color="primary">
              {loading ? (
                <>
                  Loading <Spinner size="sm" />
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default AddDiscountCoupon;
