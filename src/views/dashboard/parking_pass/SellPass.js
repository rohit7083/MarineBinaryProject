import Repeater from "@components/repeater";
import useJwt from "@src/auth/jwt/useJwt";
import "@styles/base/pages/app-invoice.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import { selectThemeColors } from "@utils";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { ArrowLeft, ArrowRight, Check, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";
import {
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Form,
    FormFeedback,
    Input,
    Label,
    Row,
    Spinner,
} from "reactstrap";
import { countries } from "../../dashboard/slip-management/CountryCode";
import Payment_section from "./park_Payment/Payment_section";
import ViewPass from "./ViewPass";

const CustomLabel = ({ htmlFor }) => (
  <Label className="form-check-label" htmlFor={htmlFor}>
    <span className="switch-icon-left">
      <Check size={14} />
    </span>
    <span className="switch-icon-right">
      <X size={14} />
    </span>
  </Label>
);

const SellPass = () => {
  const [loading, setLoading] = useState(false);
  const [childData, setGuestChildData] = useState(null);
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  const [paymentHide, setPaymentShow] = useState(false);
  const [clients, setClients] = useState(null);
  const [parkName, setparkingName] = useState([]);
  const toast = useRef(null);
  const secondFormRef = useRef(null);

  const [FinalAmountRes, setFinalAmountRes] = useState(0);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({});

  const deleteForm = (e) => {
    e.preventDefault();
    e.target.closest(".repeater-wrapper").remove();
  };

  const fetchParkingNames = async () => {
    try {
      const res = await useJwt.getAll();
      const resData = res?.data?.content?.result;
      const parkingName = resData?.map((x) => ({
        label: x.parkingName,
        value: x.uid,
        ParkingAmount: x.parkingAmount,
      }));
      setparkingName(parkingName);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchParkingNames();
  }, []);

  const countryOptions = countries.map((country) => ({
    value: country.dial_code,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ReactCountryFlag
          countryCode={country.code}
          svg
          style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
        />
        {country.name} ({country.dial_code})
      </div>
    ),
    code: country.code,
  }));

  const selectedValue = watch("memberType");

  const fetchExistingMem = async () => {
    try {
      const { data } = await useJwt.GetMember();
      const memberName = data?.content?.result?.map((x) => ({
        label: `${x.firstName} ${x.lastName}`,
        value: x.uid,
        ...x,
      }));
      setClients(memberName);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedValue === "existing") {
      fetchExistingMem();
    }
  }, [selectedValue]);

  const onSubmit = async (formData) => {
    if (Object.keys(errors).length === 0) {
      const isGuest = formData.memberType === "guest";
      const sourceData = isGuest ? childData : formData.selectedMember;

      const allocatedDetails = (formData.fields || []).map((item) => {
        const parkingPass = parkName.find(
          (p) => p.value === item.parking_name?.value
        );
        return {
          parkingPass: { uid: item.parking_name?.value },
          quantity: Number(item.quantity),
          calculatedAmount: (
            Number(parkingPass?.ParkingAmount || 0) * Number(item.quantity)
          ).toFixed(2),
        };
      });

      const totalAmount = allocatedDetails
        .reduce((acc, item) => acc + parseFloat(item.calculatedAmount), 0)
        .toFixed(2);

      const payload = {
        member: {
          uid: sourceData?.uid,
          firstName: sourceData?.firstName,
          lastName: sourceData?.lastName,
          emailId: sourceData?.emailId,
          phoneNumber: sourceData?.phoneNumber,
          countryCode: sourceData?.countryCode,
          address: sourceData?.address,
          city: sourceData?.city,
          state: sourceData?.state,
          country: sourceData?.country,
          postalCode: sourceData?.postalCode,
        },
        allocatedDetails,
        totalAmount,
      };

       ("Final Payload:", payload);

      try {
        setLoading(true);
        const res = await useJwt.memberpark(payload);

        if (res?.status === 200) {
          setPaymentShow(true);
          setFinalAmountRes(res?.data);
          toast.current.show({
            severity: "success",
            summary: "Successfully Add",
            detail: "Successfully Proceed To Payment",
            life: 2000,
          });
        }
         ("API Response:", res);
      } catch (error) {
        console.error("API Error:", error);
        if (error.response) {
          setPaymentShow(false);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (paymentHide && secondFormRef.current) {
      secondFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [paymentHide]);

  return (
    <Fragment>
      <Toast ref={toast} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardBody className="invoice-padding pt-0">
            <div className="demo-inline-spacing">
              <ArrowLeft
                style={{
                  cursor: "pointer",
                  // marginRight:"10px",
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
                onClick={() => window.history.back()}
              />{" "}
              <h6 className="mb-0 invoice-to-title">Select Member Type </h6>
              {/* <Controller
                name="memberType"
                control={control}
                rules={{
                  required: "Member Type Is required",
                }}
                render={({ field }) => (
                  <>
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="ex1-active"
                        value="existing"
                        checked={field.value === "existing"}
                        onChange={field.onChange}
                        invalid={!!errors?.memberType}
                      />
                      <Label className="form-check-label" for="ex1-active">
                        Existing Member
                      </Label>
                    </div>
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="ex1-inactive"
                        value="guest"
                        checked={field.value === "guest"}
                        onChange={field.onChange}
                        invalid={!!errors?.memberType}
                      />
                      <Label className="form-check-label" for="ex1-inactive">
                        Guest
                      </Label>
                    </div>
                  </>
                )}
              />
              {errors?.memberType && (
                <FormFeedback>{errors?.memberType?.message}</FormFeedback>
              )} 

              */}
              <br />
              <Controller
                name="memberType"
                control={control}
                rules={{
                  required: "Member Type is required",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="ex1-active"
                        value="existing"
                        checked={field.value === "existing"}
                        onChange={field.onChange}
                        invalid={!!fieldState.error}
                      />
                      <Label className="form-check-label" for="ex1-active">
                        Existing Member
                      </Label>
                    </div>
                    <div className="form-check">
                      <Input
                        type="radio"
                        id="ex1-inactive"
                        value="guest"
                        checked={field.value === "guest"}
                        onChange={field.onChange}
                        invalid={!!fieldState.error}
                      />
                      <Label className="form-check-label" for="ex1-inactive">
                        Guest
                      </Label>
                    </div>
                    {fieldState.error && (
                      <FormFeedback className="d-block">
                        {fieldState.error.message}
                      </FormFeedback>
                    )}
                  </>
                )}
              />
            </div>
            {selectedValue == "existing" && (
              <>
                <Row className="row-bill-to invoice-spacing">
                  <Col className="col-bill-to ps-0" xl="12">
                    <h6 className="invoice-to-title">Select Member</h6>

                    <div className="invoice-customer">
                      <Fragment>
                        <Controller
                          control={control}
                          rules={{
                            required: "Select Member Is required",
                          }}
                          name="selectedMember"
                          render={({ field }) => {
                            return (
                              <Fragment>
                                <Select
                                  {...field}
                                  className="react-select"
                                  classNamePrefix="select"
                                  id="label"
                                  options={clients}
                                  theme={selectThemeColors}
                                  // menuPlacement="top"
                                />
                              </Fragment>
                            );
                          }}
                        />

                        {errors?.selectedMember && (
                          <FormFeedback>
                            {errors.selectedMember.message}
                          </FormFeedback>
                        )}
                      </Fragment>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </CardBody>

          <ViewPass setGuestChildData={setGuestChildData} watch={watch} />
        </Card>

        <Card className="invoice-preview-card">
          <div>
            <CardTitle className="mt-2 mx-2">Add Parking details</CardTitle>
            <hr className="invoice-spacing mt-0" />
          </div>

          <h6 className="invoice-to-title mx-3">Add Parking Pass</h6>
          <div className=" invoice-product-details">
            <Repeater count={count}>
              {(i) => {
                const Tag = i === 0 ? "div" : SlideDown;

                const pname = watch(`fields[${i}].parking_name`);
                const quantity = watch(`fields[${i}].quantity`);
                const parkingPrice =
                  parkName.find((p) => p.value === pname?.value)
                    ?.ParkingAmount || 0;

                return (
                  <Tag key={i} className="repeater-wrapper">
                    <Row>
                      <Col
                        className="d-flex product-details-border position-relative pe-0"
                        sm="12"
                      >
                        <Row className="w-100 pe-lg-0 pe-1 py-2">
                          <Col
                            className="mb-lg-0 mb-2 mt-lg-0 mt-2"
                            lg="4"
                            md="6"
                            sm="12"
                          >
                            <CardText className="col-title mb-md-50 mb-0">
                              Parking Name
                            </CardText>
                            <Controller
                              control={control}
                              // name="parking_name"
                              rules={{
                                required: "Parking Name Is required",
                              }}
                              name={`fields[${i}].parking_name`}
                              render={({ field, fieldState }) => (
                                <div>
                                  <Select
                                    theme={selectThemeColors}
                                    className={`react-select ${
                                      fieldState.error ? "is-invalid" : ""
                                    }`}
                                    classNamePrefix="select"
                                    // defaultValue={colourOptions[0]}
                                    options={parkName}
                                    isClearable={false}
                                    {...field}
                                  />
                                  {errors?.fields?.[i]?.parking_name && (
                                    <FormFeedback>
                                      {errors.fields[i].parking_name.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              )}
                            />
                          </Col>

                          <Col className="my-lg-0 mt-2" lg="2" sm="12">
                            <CardText className="col-title mb-md-50 mb-0">
                              Qty
                            </CardText>
                            <CardText className="mb-0">
                              <Controller
                                id="quantity"
                                // name={`quantity`}
                                rules={{
                                  required: "quantity Is required",
                                }}
                                name={`fields[${i}].quantity`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    placeholder="Enter qty"
                                    invalid={!!errors?.fields?.[i]?.quantity}
                                    {...field}
                                    onChange={(e) => {
                                      let OnlyNumAllow = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      field.onChange(OnlyNumAllow);
                                    }}
                                  />
                                )}
                              />
                              {errors?.fields?.[i]?.quantity && (
                                <FormFeedback>
                                  {errors.fields[i].quantity.message}
                                </FormFeedback>
                              )}
                            </CardText>
                          </Col>
                          <Col className="my-lg-0 mt-2" lg="2" sm="12">
                            <CardText className="col-title mb-md-50 mb-0">
                              Price
                            </CardText>
                            <CardText className="mb-0">
                              <CardText>
                                {parkingPrice} x {quantity || 0}
                              </CardText>
                            </CardText>
                          </Col>

                          <Col className="my-lg-0 mt-2" lg="2" sm="12">
                            <CardText className="col-title mb-md-50 mb-0">
                              Total Price
                            </CardText>
                            <CardText className="mb-0">
                              <strong>
                                $
                                {(
                                  Number(parkingPrice) * Number(quantity || 0)
                                ).toFixed(2)}
                              </strong>
                            </CardText>
                          </Col>
                        </Row>
                        {/* <div className="d-flex justify-content-center border-start invoice-product-actions py-50 px-25">
                          <X
                            size={18}
                            className="cursor-pointer"
                            onClick={deleteForm}
                          />
                        </div> */}
                      </Col>
                    </Row>
                  </Tag>
                );
              }}
            </Repeater>

            {/*  <Row className="mt-1">
              <Col sm="12" className="px-0">
                <Button
                  color="primary"
                  size="sm"
                  className="btn-add-new"
                  onClick={() => setCount(count + 1)}
                >
                  <Plus size={14} className="me-25"></Plus>{" "}
                  <span className="align-middle">Add item</span>
                </Button>
              </Col>
            </Row> */}
          </div>
          <Row className="mt-2">
            <Col className="text-end me-4">
              <h5>
                <strong>
                  Total Amount: $
                  {(watch("fields") || [])
                    .reduce((acc, item) => {
                      const parkingPass = parkName.find(
                        (p) => p.value === item?.parking_name?.value
                      );
                      const price = parkingPass?.ParkingAmount || 0;
                      return acc + Number(price) * Number(item?.quantity || 0);
                    }, 0)
                    .toFixed(2)}
                </strong>
              </h5>
            </Col>
          </Row>

          <Row>
            <Col className="d-flex justify-content-end mt-1">
              <Button
                color="primary"
                disabled={loading || paymentHide}
                type="submit"
                size="sm"
                className="me-3 mb-4"
              >
                {loading ? (
                  <>
                    <span>Loading.. </span>
                    <Spinner size="sm" />{" "}
                  </>
                ) : (
                  "Proceed To Payment"
                )}
                {loading ? null : (
                  <ArrowRight
                    size={14}
                    className="align-middle ms-sm-25 ms-0"
                  />
                )}
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
      {paymentHide && (
        <div ref={secondFormRef}>
          <Payment_section FinalAmountRes={FinalAmountRes} />
        </div>
      )}
    </Fragment>
  );
};

export default SellPass;
