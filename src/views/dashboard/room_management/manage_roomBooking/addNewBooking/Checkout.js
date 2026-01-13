import { Fragment, useEffect, useRef, useState } from "react";
// ** Custom Components
import { CheckoutInfo, ClientInfo } from "./CheckoutInfo";
import CreateUserForm from "./CreateUserForm";

// ** Hooks
import { useLocation } from "react-router-dom";

// ** Reactstrap Imports
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Form,
    Input,
    Label,
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader,
    Row,
    Spinner,
} from "reactstrap";
// **React Form Hook
import { Controller, useForm } from "react-hook-form";

// ** Third Party Components
import { Plus } from "react-feather";
import Select, { components } from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Jwtclasss
import useJwt from "@src/auth/jwt/useJwt";
// import DiscountDetails from "./DiscountDetails";
import OtpGenerate from "./OtpGenerate";

// ** Select Custom Components
const OptionComponent = ({ data, ...props }) => {
  if (data.type === "button") {
    return (
      <Button
        className="text-start rounded-0 px-50"
        color={data.color}
        block
        onClick={() => data.toggle()}
      >
        <Plus className="font-medium-1 me-50" />
        <span className="align-middle">{data.label}</span>
      </Button>
    );
  } else {
    return <components.Option {...props}> {data.label} </components.Option>;
  }
};

const Checkout = () => {
  // ** State
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  const [verify, setVerify] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(""); // "flat" or "percentage"
  const [discountAmt, setDiscountAmt] = useState({});
  const [clientInfo, setClientInfo] = useState(null);
  const toast = useRef(null);
  const [accessTokenotp, setAccessTokenOtp] = useState("");
  const [load, setload] = useState(false);
  const [err, setErr] = useState("");
  const [selectMemberOptions, setSelectMemberOptions] = useState([
    {
      value: "add-new",
      label: "Add New Customer",
      type: "button",
      color: "flat-success",
    },
  ]);
  // ** Form State & Hook
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      selectedMember: null,
    },
  });

  const navigate = useNavigate();
  // ** Hook
  const location = useLocation();
  const state = location.state;
   ("location firstr ", location);
const memberForAutofill = location?.state?.autofillMemberALLDATA?.member;
  const deta = state?.alldata;
  // ** Function to toggle Offcanvas
  const toggleForm = () => setIsOpenForm(!isOpenForm);

  // ** Verify Member toggle
  const verifyMember = () => {
    setIsVerifyOtp(!isVerifyOtp);
  };

  // ** Function to verify OTP by Member
  const isVerifyOtpByMember = () => {
    setIsVerify(!isVerify);
    setIsVerifyOtp(!isVerifyOtp);
  };

  // ** Function to handle set new Client
  const handleClose = (data) => {
    setValue("selectedMember", data);
    const lastSelectedMemberList = [...selectMemberOptions];
    lastSelectedMemberList.splice(1, 0, data);
    setSelectMemberOptions(lastSelectedMemberList);

    toggleForm();
  };

  // ** Fetching Select Options
  useEffect(() => {
    (async () => {
      try {
        const { data } = await useJwt.GetMember();

        setSelectMemberOptions([
          {
            value: "add-new",
            label: "Add New Customer",
            type: "button",
            color: "flat-success",
            toggle: toggleForm,
          },
          ...data.content.result.map((item) => ({
            label: `${item.firstName} ${item.lastName}`,
            value: item.uid,
            data: JSON.stringify(item),
          })),
        ]);
      } catch (error) {
        console.error("Error fetching select options:", error);
      }
    })();
  }, []);

  //track  discount field

  const isDiscount = watch("discount");

  const onSubmit = async (data) => {
    setErr("");

    const finalPayment =
      state?.alldata?.totalAmount - discountAmt?.discountValue ||
      state?.alldata?.totalAmount;

    let memberdata;
    if (clientInfo?.uid) {
      memberdata = { uid: clientInfo?.uid };
    } else {
      memberdata = {
        firstName: clientInfo?.firstName || "",
        lastName: clientInfo?.lastName || "",
        emailId: clientInfo?.emailId || "",
        phoneNumber: clientInfo?.phoneNumber || "",
        countryCode: clientInfo?.countryCode || "",
        dialCodeCountry: clientInfo?.dialCodeCountry || "",
        address: clientInfo?.address || "",
        city: clientInfo?.city || "",
        state: clientInfo?.state || "",
        country: clientInfo?.country || "",
        postalCode: clientInfo?.postalCode || "",
      };
    }

    
    const payload = {
      roomSearch: {
        uid: state?.searchUid,
      },
      member: memberdata,
      checkInDate: state?.alldata?.checkInDate,
      checkOutDate: state?.alldata?.checkOutDate,
      numberOfGuests: state?.alldata?.numberOfGuests,
      subtotal: state?.alldata?.totalAmount,
      isDiscountApply: isDiscount || false,
      discountType: discountAmt?.type,
      discountAmount: discountAmt?.enterValue,

      ...(isDiscount && {
        discountedFinalAmount: discountAmt?.discountValue || 0,
      }),
      finalAmount: finalPayment,
      numberOfDays: deta?.numberOfDays,
    };

    try {
      // setLoadPayment(true);
      setload(true);

      const res = await useJwt.PreviewSubmit(payload);
       (res);
      toast.current.show({
        severity: "success",
        summary: "Successfully",
        detail: "You Successfully Proceed To Pyament.",
        life: 2000,
      });
      navigate("/search-rooms/previewBooking/roomPayment", {
        state: {
          resAlldata: state,
          roomUid: res?.data?.bookingId,
          finalAmount: finalPayment,
          extraRoomMode: state?.extraRoomMode,
          uidOfEvent: state?.uidOfEvent,
          memberInfo:clientInfo,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.response) {
         ("Error data", error.response.data);
         ("Error status", error.response.status);
         ("Error headers", error.response.headers);

        setErr(error.response.data.content);
         (err);
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail: error.response.data.content,
          life: 2000, // 2 seconds
        });
      }
    } finally {
      setload(false);
    }
  };
  // return <ChecloutCode />;

  useEffect(() => {
    const generateOtpIfNeeded = async () => {
      if (watch("discount") == true) {
        try {
          const payload = {
            type: 3,
            roomId: state?.searchId,
            memberId: clientInfo?.id,
          };
          const response = await useJwt.GenerateOtp(payload);
          if (response?.status === 200) {
            setAccessTokenOtp(response?.data?.content);
            setShowModal(true);
          }
        } catch (error) {
          console.error("Error generating OTP:", error);
        }
      }
    };

    generateOtpIfNeeded();
  }, [watch("discount")]);

  useEffect(() => {
    if (showModal === false && watch("discount") === true && verify === false) {
      setValue("discount", false);
    }
  }, [showModal, verify]);


  useEffect(()=>{
    if(memberForAutofill){
      const autofillData = {
        label: `${memberForAutofill.firstName} ${memberForAutofill.lastName}`,
        value: memberForAutofill.uid,
        data: JSON.stringify(memberForAutofill),
      };
      setValue("selectedMember", autofillData);
      setClientInfo(memberForAutofill);

      const lastSelectedMemberList = [...selectMemberOptions];
      lastSelectedMemberList.splice(1, 0, autofillData);
      setSelectMemberOptions(lastSelectedMemberList);
    }
  },[ memberForAutofill]);

  return (
    <>
      <Toast ref={toast} />

      <CheckoutInfo propsData={state} />
      {/* <ClientInfo  /> */}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl="8" xs="12">
            <Card>
              <CardBody>
                <CardTitle>Guest Details </CardTitle>
                <Row>
                  <Col sm="12" className="mb-2">
                    <Controller
                      control={control}
                      name="selectedMember"
                      rules={{
                        required: "Member Is required",
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <Fragment>
                            <Select
                              {...field}
                              className={`react-select ${
                                fieldState.error ? "is-invalid" : ""
                              }`}
                              classNamePrefix="select"
                              id="label"
                              options={selectMemberOptions}
                              theme={selectThemeColors}
                              components={{ Option: OptionComponent }}
                            />
                            {fieldState.error && (
                              <small className="text-danger d-block">
                                {fieldState.error.message}
                              </small>
                            )}
                          </Fragment>
                        );
                      }}
                    />
                  </Col>
                  <Col sm="12" className="mb-2">
                    <ClientInfo
                      clientInfo={clientInfo}
                      setClientInfo={setClientInfo}
                      selectedMember={watch("selectedMember")}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col xl="4" xs="12">
            <Card>
              <CardBody>
                <Col sm="12" className="mb-2">
                  <div
                    className="amount-payable checkout-options"
                    style={{ maxWidth: "400px", margin: "auto" }}
                  >
                    {!state?.extraRoomMode && (
                      <>
                        <CardTitle tag="h4">
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="1em"
                            height="1em"
                          >
                            <path
                              fill="currentColor"
                              d="M12.79 21L3 11.21v2c0 .53.21 1.04.59 1.41l7.79 7.79c.78.78 2.05.78 2.83 0l6.21-6.21c.78-.78.78-2.05 0-2.83z"
                            ></path>
                            <path
                              fill="currentColor"
                              d="M11.38 17.41c.39.39.9.59 1.41.59s1.02-.2 1.41-.59l6.21-6.21c.78-.78.78-2.05 0-2.83L12.62.58C12.25.21 11.74 0 11.21 0H5C3.9 0 3 .9 3 2v6.21c0 .53.21 1.04.59 1.41zM5 2h6.21L19 9.79L12.79 16L5 8.21z"
                            ></path>
                            <circle
                              cx="7.25"
                              cy="4.25"
                              r="1.25"
                              fill="currentColor"
                            ></circle>
                          </svg>{" "}
                          Discount
                        </CardTitle>
                        <Col className="mb-1">
                          <Label>
                            <Controller
                              name="discount"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="checkbox"
                                  disabled={verify || !clientInfo}
                                  checked={field.value}
                                />
                              )}
                            />{" "}
                            Apply discount?
                          </Label>
                        </Col>
                        {watch("discount") === true && (
                          <>
                            <OtpGenerate
                              clientInfo={clientInfo}
                              accessTokenotp={accessTokenotp}
                              setAccessTokenOtp={setAccessTokenOtp}
                              setShowModal={setShowModal}
                              showModal={showModal}
                              mode={mode}
                              setMode={setMode}
                              setValueInParent={setValue}
                              alldata={deta}
                              searchId={state?.searchId}
                              setVerify={setVerify}
                              verify={verify}
                              discountAmt={discountAmt}
                              setDiscountAmt={setDiscountAmt}
                            />
                          </>
                        )}

                        <hr />
                      </>
                    )}
                    <CardTitle tag="h4">Price Details</CardTitle>
                    <div
                      className="amount-payable checkout-options"
                      style={{ maxWidth: "400px", margin: "auto" }}
                    >
                      <ul
                        className="list-unstyled price-details"
                        style={{ padding: 0 }}
                      >
                        <li
                          className="price-detail"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <div className="details-title">Total Amount</div>
                          <div className="detail-amt">
                            <strong>${state?.alldata?.totalAmount}</strong>
                          </div>
                        </li>
                        <li
                          className="price-detail"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          {verify && (
                            <>
                              <div className="details-title">
                                Discount Amount
                              </div>
                              <div className="detail-amt discount-amt text-danger">
                                {discountAmt?.discountValue
                                  ? `- $ ${discountAmt?.discountValue}`
                                  : "$ 0"}
                              </div>
                            </>
                          )}
                        </li>
                      </ul>
                      <hr />
                      <ul
                        className="list-unstyled price-details"
                        style={{ padding: 0 }}
                      >
                        <li
                          className="price-detail"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: "bold",
                          }}
                        >
                          <div className="details-title">Amount Payable</div>
                          <div className="detail-amt">
                            $
                            {(
                              (state?.alldata?.totalAmount || 0) -
                              (discountAmt?.discountValue || 0)
                            ).toFixed(2)}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Button
          type="submit"
          color="primary"
          disabled={load}
          className="btn-next"
        >
          {load ? (
            <>
              {" "}
              Loading.. <Spinner size="sm" />
            </>
          ) : (
            <>Next</>
          )}
        </Button>
      </Form>
      <Offcanvas direction="end" toggle={toggleForm} isOpen={isOpenForm}>
        <OffcanvasHeader toggle={toggleForm} isOpen={isOpenForm}>
          Add New Customer
        </OffcanvasHeader>
        <OffcanvasBody>
          <CreateUserForm onClose={handleClose} />
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
};

export default Checkout;
