import React, { useEffect, useState, Fragment } from "react";
import useJwt from "@src/auth/jwt/useJwt";
import { Send } from "react-feather";
import Countdown from "react-countdown";
import Select from "react-select";
import {
  Spinner,
  UncontrolledAlert,
  InputGroupText,
  Col,
  Modal,
  Label,
  Input,
  Button,
  InputGroup,
  CardTitle,
  Card,
  CardBody,
  CardText,
  Alert,
} from "reactstrap";
import CryptoJS from "crypto-js";
import { useForm, Controller } from "react-hook-form";
import WatchNew from "../../../../../../src/assets/images/updatedWatchnew.jpg";

const OtpGenerate = ({
  setMode,
  mode,
  setDiscountAmt,
  discountAmt,
  setValuedis,
  showModal,
  setShowModal,
  alldata,
  verify,
  setVerify,
  searchId,
  setAccessTokenOtp,
  accessTokenotp,
}) => {
  const [loading, setLoading] = useState(false);
  const [countdownEndTime, setCountdownEndTime] = useState(Date.now() + 40000);
  const [errorMessage, setErrorMsz] = useState("");
  const discountTypeOptions = [
    { label: "Flat ($)", value: "Flat" },
    { label: "Percentage (%)", value: "Percentage" },
  ];
  const {
    control: formControl,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
  } = useForm();

  const handleOTP = async () => {
    try {
      const payload = { type: 3, roomId: searchId };
      const response = await useJwt.GenerateOtp(payload);
      if (response?.status === 200) setCountdownEndTime(Date.now() + 40000);
      setAccessTokenOtp(response?.data?.content);
      setShowModal(true);
    } catch (error) {
      if (error.response) setErrorMsz(error?.response?.data?.content);
    }
  };

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
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
  }

  const handleCustomSubmit = async (data) => {
    const otpArray = data.otp || [];
    const otpString = otpArray.join("");
    const encrypted = encryptAES(otpString);
    setErrorMsz("");
    setCountdownEndTime(0);
    try {
      if (!accessTokenotp) return;
      setLoading(true);
      await useJwt.verifyOTP(accessTokenotp, { otp: encrypted });
      setVerify(true);
      setShowModal(false);
    } catch (error) {
      if (error.response) setErrorMsz(error?.response?.data?.content);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showModal) return;
    const timer = setInterval(() => {}, 1000);
    return () => clearInterval(timer);
  }, [showModal]);

  useEffect(() => {
    const selectedType = watch("discountType");
    const discountValue = watch("discountValue");
    let DiscountValue;
    if (selectedType === "Flat") DiscountValue = discountValue;
    else if (selectedType === "Percentage")
      DiscountValue = alldata?.totalAmount * (discountValue / 100);
    setDiscountAmt({
      discountValue: DiscountValue,
      enterValue: discountValue,
      type: selectedType,
    });
  }, [watch("discountType"), watch("discountValue")]);

  return (
    <Fragment>
      {verify && (
        <Alert color="success">
          <div className="alert-body mb-2" style={{ marginTop: "10px" }}>
            <span className="ms-1">OTP Verified Successfully ! </span>
          </div>
        </Alert>
      )}
      
    
        {verify && (
          <>
            <Col md="12" className="mb-2">
              <Label for="discountType">Discount Type</Label>
              <Controller
                name="discountType"
                control={formControl}
                render={({ field }) => (
                  <Select
                    id="discountType"
                    options={discountTypeOptions}
                    value={discountTypeOptions.find(
                      (opt) => opt.value === field.value
                    )}
                    onChange={(selected) => field.onChange(selected.value)}
                  />
                )}
              />
            </Col>
            <Col md="12" className="mb-2">
              <Label for="discountValue">Discount Value</Label>
              <InputGroup className="mb-2">
                <InputGroupText>
                  {mode === "Percentage" ? "%" : "$"}
                </InputGroupText>
                <Controller
                  name="discountValue"
                  control={formControl}
                  rules={{
                    required: "Discount value is required",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Invalid discount value",
                    },
                    validate: (value) => {
                      const numericValue = parseFloat(value);
                      const type = watch("discountType");
                      if (type === "Flat")
                        return numericValue > 0 || "Discount value must be greater than 0";
                      if (type === "Percentage")
                        return numericValue <= 100 || "Percentage must be 100 or less";
                      return true;
                    },
                  }}
                  render={({ field }) => {
                    const isPercentage = watch("discountType") === "Percentage";
                    return (
                      <Input
                        type="number"
                        min="0"
                        max={isPercentage ? 100 : undefined}
                        step="0.01"
                        placeholder={isPercentage ? "Max 100%" : "Flat value"}
                        value={field.value}
                        onChange={(e) => {
                          let newValue = e.target.value;
                          if (isPercentage && parseFloat(newValue) > 100) newValue = "100";
                          field.onChange(newValue);
                        }}
                        onWheel={(e) => e.target.blur()}
                      />
                    );
                  }}
                />
              </InputGroup>
            </Col>
          </>
        )}
      

      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        className="modal-dialog-centered"
        style={{ width: "400px" }}
      >
        <div className="auth-inner ">
          <Card className="mb-0">
            <CardBody>
              <CardTitle tag="h2" className="fw-bolder mb-1">
                Verify OTP 💬
              </CardTitle>
              <CardText className="mb-75">
                We sent OTP to your Registered Mobile Number.Enter the code from
                the Email in the field below.
              </CardText>
              <Col sm="12">
                {errorMessage && (
                  <UncontrolledAlert color="danger">
                    <div className="alert-body">
                      <span className="text-danger fw-bold">
                        <strong>Error ! </strong>
                        {errorMessage}
                      </span>
                    </div>
                  </UncontrolledAlert>
                )}
              </Col>
              <div className="mb-2">
                <h6>Type your 6-digit security code</h6>
                <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                  {[...Array(6)].map((_, index) => (
                    <Controller
                      key={index}
                      name={`otp[${index}]`}
                      control={formControl}
                      rules={{
                        required: "All OTP digits are required",
                        pattern: {
                          value: /^[0-9]$/,
                          message: "Each OTP digit must be a number",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          maxLength="1"
                          className={`auth-input height-50 text-center numeral-mask mx-25 mb-1 ${
                            formErrors.otp?.[index] ? "is-invalid" : ""
                          }`}
                          autoFocus={index === 0}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(e);
                            if (value && index < 5) {
                              const nextInput = document.getElementById(
                                `otp-input-${index + 1}`
                              );
                              if (nextInput) nextInput.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !field.value &&
                              index > 0
                            ) {
                              const prevInput = document.getElementById(
                                `otp-input-${index - 1}`
                              );
                              if (prevInput) prevInput.focus();
                            }
                          }}
                          id={`otp-input-${index}`}
                        />
                      )}
                    />
                  ))}
                </div>
                <div className="d-flex flex-column align-items-center position-relative">
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={WatchNew}
                      alt="Phone Call"
                      style={{
                        width: "120px",
                        height: "100px",
                        display: "block",
                      }}
                    />
                    <Countdown
                      key={countdownEndTime}
                      date={countdownEndTime}
                      renderer={({ minutes, seconds }) => (
                        <span
                          className="position-absolute top-50 start-50 translate-middle"
                          style={{
                            marginTop: "-4px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "White",
                          }}
                        >
                          {String(minutes).padStart(2, "0")}:
                          {String(seconds).padStart(2, "0")}
                        </span>
                      )}
                    />
                  </div>
                </div>
                {formErrors.otp && (
                  <small className="text-danger">{formErrors.otp.message}</small>
                )}
              </div>
              <Button
                block
                type="submit"
                disabled={loading}
                onClick={handleSubmit(handleCustomSubmit)}
                color="primary"
              >
                {loading ? (
                  <>
                    Loading.. <Spinner size="sm" />
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </CardBody>
          </Card>
        </div>
      </Modal>
    </Fragment>
  );
};

export default OtpGenerate;




// import React, { useEffect, useState, Fragment } from "react";
// import useJwt from "@src/auth/jwt/useJwt";
// import { Send, ThumbsUp, Type } from "react-feather";
// import Countdown from "react-countdown";
// import Select from "react-select";
// import {
//   Spinner,
//   UncontrolledAlert,
//   InputGroupText,
//   FormGroup,
//   Row,
//   Col,
//   Modal,
//   Label,
//   Input,
//   Button,
//   InputGroup,
//   CardTitle,
//   Card,
//   CardBody,
//   CardText,
//   Form,
//   Alert,
// } from "reactstrap";
// import CryptoJS from "crypto-js";

// import { useForm, Controller } from "react-hook-form";
// import WatchNew from "../../../../../../src/assets/images/updatedWatchnew.jpg";

// const OtpGenerate = ({
//   value,
//   setMode,
//   mode,
//   setDiscountAmt,
//   discountAmt,
//   setValuedis,
//   showModal,
//   setShowModal,
//   setValueInParent,
//   alldata,
//   verify,
//   setVerify,
//   searchId,
//   control,
//   errors ,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [accessTokenotp, setAccessTokenOtp] = useState("");
//   const [countdownEndTime, setCountdownEndTime] = useState(Date.now() + 40000);
//   const [errorMessage, setErrorMsz] = useState("");
//   const discountTypeOptions = [
//     { label: "Flat ($)", value: "Flat" },
//     { label: "Percentage (%)", value: "Percentage" },
//   ];
//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const handleOTP = async () => {
//     try {
//       const payload = {
//         type: 3,
//         roomId: searchId,
//       };
//       const response = await useJwt.GenerateOtp(payload);
//       if (response?.status === 200) {
//         setCountdownEndTime(Date.now() + 40000);
//       }
//       const token = response?.data?.content;
//       setAccessTokenOtp(token);
//       setShowModal(true);
//     } catch (error) {
//       if (error.response) {
//         const errorMessage = error?.response?.data?.content;
//         setErrorMsz(errorMessage);
//       }
//     }
//   };

//   const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";

//   function generateKey(secretKey) {
//     return CryptoJS.SHA256(secretKey);
//   }

//   function generateIV() {
//     return CryptoJS.lib.WordArray.random(16);
//   }

//   function encryptAES(plainText) {
//     const key = generateKey(SECRET_KEY);
//     const iv = generateIV();

//     const encrypted = CryptoJS.AES.encrypt(plainText, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });

//     const combined = iv.concat(encrypted.ciphertext);
//     return CryptoJS.enc.Base64.stringify(combined);
//   }

//   const handleCustomSubmit = async (data) => {
//     const otpArray = data.otp || [];
//     const otpString = otpArray.join("");
//     const encrypted = encryptAES(otpString);

//     setErrorMsz("");
//     setCountdownEndTime(0);
//     try {
//       console.log(data);

//       if (!accessTokenotp) return;
//       setLoading(true);
//       const payload = { otp: encrypted };

//       const response = await useJwt.verifyOTP(accessTokenotp, payload);

//       setVerify(true);
//       setShowModal(false);
//     } catch (error) {
//       if (error.response) {
//         const errorMessage = error?.response?.data?.content;
//         setErrorMsz(errorMessage);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     let timer;
//     if (showModal) {
//       timer = setInterval(() => {}, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [showModal]);

//   useEffect(() => {
//     const selectedType = watch("discountType");
//     const discountValue = watch("discountValue");
//     let DiscountValue;

//     if (watch("discountType") === "Flat") {
//       DiscountValue = discountValue;
//     } else if (watch("discountType") === "Percentage") {
//       DiscountValue = alldata?.totalAmount * (discountValue / 100);
//     }

//     setDiscountAmt({
//       discountValue: DiscountValue,
//       enterValue: discountValue,
//       type: selectedType,
//     });
//   }, [watch("discountType"), watch("discountValue")]);

//   return (
//     <Fragment>
//       {verify && (
//         <Alert color="success">
//           <div className="alert-body mb-2" style={{ marginTop: "10px" }}>
//             <span className="ms-1">OTP Verified Successfully ! </span>
//             {/* <ThumbsUp size={15} /> */}
//           </div>
//         </Alert>
//       )}
//       <>
//         {!verify && (
//           <Col md="12" className="mb-1">
//             <Label className="form-label" for="hf-picker">
//               Otp verification compulsory For the Discount{" "}
//               <span style={{ color: "red" }}>*</span>
//             </Label>
//             <br />
//             <Button color="primary" size="sm" outline onClick={handleOTP}>
//               <Send className="me-1" size={20} />
//               Generate otp
//             </Button>
//           </Col>
//         )}

//         {verify && (
//           <>
//             <Col md="12" className="mb-2">
//               <Label for="discountType">Discount Type</Label>
//               <Controller
//                 name="discountType"
//                 control={control}
//                 render={({ field }) => (
//                   <Select
//                     id="discountType"
//                     options={discountTypeOptions}
//                     value={discountTypeOptions.find(
//                       (opt) => opt.value === field.value
//                     )}
//                     onChange={(selected) => field.onChange(selected.value)}
//                   />
//                 )}
//               />
//             </Col>

//             <Col md="12" className="mb-2">
//               <Label for="discountValue">Discount Value</Label>
//               <InputGroup className="mb-2">
//                 <InputGroupText>
//                   {mode === "Percentage" ? "%" : "$"}
//                 </InputGroupText>
//                 <Controller
//                   name="discountValue"
//                   control={control}
//                   rules={{
//                     required: "Discount value is required",
//                     pattern: {
//                       value: /^\d+(\.\d{1,2})?$/,
//                       message: "Invalid discount value",
//                     },
//                     validate: (value) => {
//                       const numericValue = parseFloat(value);
//                       const type = watch("discountType");

//                       if (type === "Flat") {
//                         return (
//                           numericValue > 0 ||
//                           "Discount value must be greater than 0"
//                         );
//                       }
//                       if (type === "Percentage") {
//                         return (
//                           numericValue <= 100 ||
//                           "Percentage must be 100 or less"
//                         );
//                       }
//                       return true;
//                     },
//                   }}
//                   render={({ field }) => {
//                     const isPercentage = watch("discountType") === "Percentage";

//                     return (
//                       <Input
//                         type="number"
//                         min="0"
//                         max={isPercentage ? 100 : undefined}
//                         step="0.01"
//                         placeholder={isPercentage ? "Max 100%" : "Flat value"}
//                         value={field.value}
//                         onChange={(e) => {
//                           let newValue = e.target.value;
//                           if (isPercentage && parseFloat(newValue) > 100) {
//                             newValue = "100";
//                           }
//                           field.onChange(newValue);
//                         }}
//                         onWheel={(e) => e.target.blur()}
//                       />
//                     );
//                   }}
//                 />
//               </InputGroup>
//             </Col>
//           </>
//         )}
//       </>

//       <Modal
//         isOpen={showModal}
//         toggle={() => setShowModal(!showModal)}
//         className="modal-dialog-centered"
//         style={{ width: "400px" }}
//       >
//         <div className="auth-inner ">
//           <Card className="mb-0">
//             <CardBody>
//               <CardTitle tag="h2" className="fw-bolder mb-1">
//                 Verify OTP 💬
//               </CardTitle>
//               <CardText className="mb-75">
//                 We sent OTP to your Registered Mobile Number.Enter the code from
//                 the Email in the field below.
//               </CardText>
//               <Col sm="12">
//                 {errorMessage && (
//                   <UncontrolledAlert color="danger">
//                     <div className="alert-body">
//                       <span className="text-danger fw-bold">
//                         <strong>Error ! </strong>
//                         {errorMessage}
//                       </span>
//                     </div>
//                   </UncontrolledAlert>
//                 )}
//               </Col>
//               <div className="mb-2">
//                 <h6>Type your 6-digit security code</h6>
//                 <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
//                   {[...Array(6)].map((_, index) => (
//                     <Controller
//                       key={index}
//                       name={`otp[${index}]`}
//                       control={control}
//                       rules={{
//                         required: "All OTP digits are required",
//                         pattern: {
//                           value: /^[0-9]$/,
//                           message: "Each OTP digit must be a number",
//                         },
//                       }}
//                       render={({ field }) => (
//                         <Input
//                           {...field}
//                           maxLength="1"
//                           className={`auth-input height-50 text-center numeral-mask mx-25 mb-1 ${
//                             errors.otp?.[index] ? "is-invalid" : ""
//                           }`}
//                           autoFocus={index === 0}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             field.onChange(e);
//                             if (value && index < 5) {
//                               const nextInput = document.getElementById(
//                                 `otp-input-${index + 1}`
//                               );
//                               if (nextInput) nextInput.focus();
//                             }
//                           }}
//                           onKeyDown={(e) => {
//                             if (
//                               e.key === "Backspace" &&
//                               !field.value &&
//                               index > 0
//                             ) {
//                               const prevInput = document.getElementById(
//                                 `otp-input-${index - 1}`
//                               );
//                               if (prevInput) prevInput.focus();
//                             }
//                           }}
//                           id={`otp-input-${index}`}
//                         />
//                       )}
//                     />
//                   ))}
//                 </div>
//                 <>
//                   <div className="d-flex flex-column align-items-center position-relative">
//                     <div
//                       style={{
//                         position: "relative",
//                         display: "inline-block",
//                       }}
//                     >
//                       <img
//                         src={WatchNew}
//                         alt="Phone Call"
//                         style={{
//                           width: "120px",
//                           height: "100px",
//                           display: "block",
//                         }}
//                       />
//                       <Countdown
//                         key={countdownEndTime}
//                         date={countdownEndTime}
//                         renderer={({ minutes, seconds }) => (
//                           <span
//                             className="position-absolute top-50 start-50 translate-middle"
//                             style={{
//                               marginTop: "-4px",
//                               fontSize: "14px",
//                               fontWeight: "bold",
//                               color: "White",
//                             }}
//                           >
//                             {String(minutes).padStart(2, "0")}:
//                             {String(seconds).padStart(2, "0")}
//                           </span>
//                         )}
//                       />
//                     </div>
//                   </div>
//                   {errors.otp && (
//                     <small className="text-danger">{errors.otp.message}</small>
//                   )}
//                 </>
//               </div>
//               <Button
//                 block
//                 type="submit"
//                 disabled={loading}
//                 onClick={handleSubmit(handleCustomSubmit)}
//                 color="primary"
//               >
//                 {loading ? (
//                   <>
//                     Loading.. <Spinner size="sm" />
//                   </>
//                 ) : (
//                   "Verify"
//                 )}
//               </Button>
//             </CardBody>
//           </Card>
//         </div>
//       </Modal>
//     </Fragment>
//   );
// };

// export default OtpGenerate;
