import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { handleStoreLogo } from "../../../redux/authentication";
export default function CompanySettings() {
  // const []=useState(false);
  const toast = useRef(null);
  const companyLogo = useSelector((store) => store.auth.companyLogo);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      // companyName: "",
      // companyShortName: "",
      // companyEmail: "",
      // companyPhone: "",
      // companyLogo: "",
      // address: "",
      // city: "",
      // state: "",
      // country: "",
      // postalCode: "",
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);
  const [retriveAllData, setRetriveData] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [isLogoChanged, setIsLogoChanged] = useState(false);

  useEffect(() => {
    const handleGetSettings = async () => {
      try {
        setResetLoading(true);
        const res = await useJwt.getGeneralSettings();
        setRetriveData(res?.data?.content?.result[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setResetLoading(false);
      }
    };
    handleGetSettings();
  }, []);

  useEffect(() => {
    if (retriveAllData) {
      reset(retriveAllData);
    }
  }, [retriveAllData]);
  //   const onSubmit = async (data) => {
  //     setSaveMessage(null);
  //     console.log(data);
  // debugger;
  //     const formDataToSend = new FormData();
  //     formDataToSend.append("companyName", data.companyName);
  //     formDataToSend.append("companyShortName", data.companyShortName);
  //     formDataToSend.append("companyPhone", data.companyPhone);
  //     // formDataToSend.append("companyLogo", data.companyLogo );
  //     if (isLogoChanged && data.companyLogo instanceof File) {
  //   formDataToSend.append("companyLogo", data.companyLogo);
  // }

  //     formDataToSend.append("address", data.address);
  //     formDataToSend.append("companyEmail", data.companyEmail);
  //     formDataToSend.append("city", data.city);
  //     formDataToSend.append("state", data.state);
  //     formDataToSend.append("country", data.country);
  //     formDataToSend.append("postalCode", data.postalCode);

  //     try {
  //       let successFlag = 0;
  //       if (retriveAllData) {
  //         const updateRes = await useJwt.updateGeneralsetting(
  //           retriveAllData?.uid,
  //           formDataToSend,
  //         );
  //         console.log(updateRes);
  //         if (updateRes?.status === 200) {
  //           successFlag = 200;
  //           toast.current.show({
  //             severity: "success",
  //             summary: "Success",
  //             detail: "General settings Updated successfully.",
  //             life: 2000,
  //           });
  //           setTimeout(() => {
  //             navigate("/dashbord");
  //           }, 2000);
  //         }
  //       } else {
  //         const res = await useJwt.createSetting(formDataToSend);
  //         console.log(res);
  //         if (res?.status === 201) {
  //           successFlag = 201;
  //           toast.current.show({
  //             severity: "success",
  //             summary: "Success",
  //             detail: "General settings created successfully.",
  //             life: 2000,
  //           });
  //           setTimeout(() => {
  //             navigate("/dashbord");
  //           }, 2000);
  //         }
  //       }

  //       if (successFlag == 200 || successFlag == 201) {
  //         const companyDetails = JSON.parse(
  //           localStorage.getItem("companyDetails"),
  //         );
  //         const uid = companyDetails?.uid;

  //         function blobToBase64(blob) {
  //           return new Promise((resolve) => {
  //             const reader = new FileReader();
  //             reader.onloadend = () => resolve(reader.result);
  //             reader.readAsDataURL(blob);
  //           });
  //         }
  //         if (!uid) return;

  //         let objectUrl;
  //         let cancelled = false;

  //         try {
  //           const logoRes = await useJwt.getLogo(uid);
  //           if (cancelled) return;
  //           const blob = logoRes.data;
  //           objectUrl = URL.createObjectURL(blob);
  //           const base64 = await blobToBase64(blob);
  //           dispatch(handleStoreLogo(base64));
  //         } catch (err) {
  //           if (!cancelled) console.error(err);
  //         }
  //       }

  //       return () => {
  //         cancelled = true;
  //         if (objectUrl) URL.revokeObjectURL(objectUrl);
  //       };
  //     } catch (error) {
  //       console.log(error);
  //       if (error?.response) {
  //         const content = error?.response?.data?.content;

  //         toast.current.show({
  //           severity: "error",
  //           summary: "Failed",
  //           detail: content || "Failed to create general settings.",
  //           life: 3000,
  //         });
  //       }
  //     }
  //   };

  const onSubmit = async (data) => {
    setSaveMessage(null);

    const formDataToSend = new FormData();
    formDataToSend.append("companyName", data.companyName);
    formDataToSend.append("companyShortName", data.companyShortName);
    formDataToSend.append("companyPhone", data.companyPhone);
    formDataToSend.append("address", data.address);
    formDataToSend.append("companyEmail", data.companyEmail);
    formDataToSend.append("city", data.city);
    formDataToSend.append("state", data.state);
    formDataToSend.append("country", data.country);
    formDataToSend.append("postalCode", data.postalCode);

    try {
      let successFlag = 0;

      const companyDetails = JSON.parse(localStorage.getItem("companyDetails"));
      const uid = companyDetails?.uid;

      // =========================
      // LOGO HANDLING (CRITICAL)
      // =========================

      if (retriveAllData) {
        // UPDATE CASE

        if (isLogoChanged && data.companyLogo instanceof File) {
          // User selected NEW logo
          formDataToSend.append("companyLogo", data.companyLogo);
        } else {
          // User did NOT change logo → resend existing logo (backend workaround)
          const logoRes = await useJwt.getLogo(uid);
          const blob = logoRes.data;

          const file = new File([blob], "company-logo.png", {
            type: blob.type,
          });

          formDataToSend.append("companyLogo", file);
        }

        const updateRes = await useJwt.updateGeneralsetting(
          retriveAllData.uid,
          formDataToSend,
        );

        if (updateRes?.status === 200) {
          successFlag = 200;
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "General settings updated successfully.",
            life: 2000,
          });

          setTimeout(() => navigate("/dashbord"), 2000);
        }
      } else {
        // CREATE CASE (logo is mandatory)
        if (data.companyLogo instanceof File) {
          formDataToSend.append("companyLogo", data.companyLogo);
        }

        const res = await useJwt.createSetting(formDataToSend);

        if (res?.status === 201) {
          successFlag = 201;
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "General settings created successfully.",
            life: 2000,
          });

          setTimeout(() => navigate("/dashbord"), 2000);
        }
      }

      // =========================
      // STORE LOGO IN REDUX
      // =========================

      if (successFlag === 200 || successFlag === 201) {
        if (!uid) return;

        const logoRes = await useJwt.getLogo(uid);
        const blob = logoRes.data;

        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        dispatch(handleStoreLogo(base64));
      }
    } catch (error) {
      console.error(error);

      const content = error?.response?.data?.content;

      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: content || "Failed to save general settings.",
        life: 3000,
      });
    }
  };

  const onlyLetters = (value) => value.replace(/[^a-zA-Z\s]/g, "");
const addressSanitizer = (value = "") =>
  value.replace(/[^a-zA-Z0-9\s,.\-/#']/g, "");

  const onlyLettersNoSpace = (value) => value.replace(/[^a-zA-Z]/g, "");

  const onlyNumbers = (value) => value.replace(/[^0-9]/g, "");

  if (resetLoading) {
    return (
      <Col className="d-flex justify-content-center">
        <Spinner color={"primary"} />
      </Col>
    );
  }

  const imageSrc = logoPreview ?? companyLogo;

  return (
    <Row>
      <Col lg="12" className="">
        <Card>
          <Toast ref={toast} />
          <CardHeader className="bg-primary text-white">
            <h4 className="mb-0 text-white">Settings</h4>
          </CardHeader>

          <CardBody>
            {saveMessage && (
              <Alert color={saveMessage.type}>{saveMessage.text}</Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmit)}>
              <h5 className="mt-1 text-primary">Company Information</h5>

              <Row>
                {/* <Col>
  <img
    src={retriveAllData?.companyLogoUrl}
    alt="Logo"
    style={{ maxWidth: "100%", height: "auto" }}
  />
</Col> */}

                <Col md="12" className="mt-2">
                  <Label>Company Name *</Label>
                  <Controller
                    name="companyName"
                    control={control}
                    rules={{
                      required: "Company name is required",
                      minLength: {
                        value: 2,
                        message: "Company name must be at least 2 characters",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(onlyLetters(e.target.value))
                        }
                      />
                    )}
                  />
                  {errors.companyName && (
                    <small className="text-danger">
                      {errors.companyName.message}
                    </small>
                  )}
                </Col>

                <Col md="12" className="mt-2">
                  <Label>Company Short Name *</Label>
                  <Controller
                    name="companyShortName"
                    control={control}
                    rules={{
                      required: "Company short name is required",
                      minLength: {
                        value: 2,
                        message: "Short name must be at least 2 characters",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(onlyLetters(e.target.value))
                        }
                      />
                    )}
                  />
                  {errors.companyShortName && (
                    <small className="text-danger">
                      {errors.companyShortName.message}
                    </small>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md="6" className="mt-2">
                  <Label>Company Email *</Label>
                  <Controller
                    name="companyEmail"
                    control={control}
                    rules={{
                      required: "Company email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    }}
                    render={({ field }) => <Input type="email" {...field} />}
                  />
                  {errors.companyEmail && (
                    <small className="text-danger">
                      {errors.companyEmail.message}
                    </small>
                  )}
                </Col>

                <Col md="6" className="mt-2">
                  <Label>Company Phone *</Label>
                  <Controller
                    name="companyPhone"
                    control={control}
                    rules={{
                      required: "Company phone is required",
                      minLength: {
                        value: 10,
                        message: "Phone number must be 10 digits",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="tel"
                        {...field}
                        maxLength={10}
                        onChange={(e) =>
                          field.onChange(onlyNumbers(e.target.value))
                        }
                      />
                    )}
                  />
                  {errors.companyPhone && (
                    <small className="text-danger">
                      {errors.companyPhone.message}
                    </small>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md="12" className="mt-2">
                  <Label>Company Logo</Label>
                  <Controller
                    name="companyLogo"
                    control={control}
                    rules={{
                      required: !retriveAllData && "Company logo is required",
                    }}
                    render={({ field }) => (
                      <Input
                        type="file"
                        accept="image/*"
                        // onChange={(e) => {
                        //   const file = e.target.files[0];
                        //   field.onChange(file);

                        //   if (file) {
                        //     const reader = new FileReader();
                        //     reader.onloadend = () =>
                        //       setLogoPreview(reader.result);
                        //     reader.readAsDataURL(file);
                        //   }
                        // }}

                        onChange={(e) => {
                          const file = e.target.files[0];
                          field.onChange(file);

                          if (file) {
                            setIsLogoChanged(true); // 🔥 key line
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setLogoPreview(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    )}
                  />
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt="Logo Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "100px",
                        marginTop: 10,
                      }}
                    />
                  )}
                  {errors.companyLogo && (
                    <small className="text-danger">
                      {errors.companyLogo.message}
                    </small>
                  )}
                </Col>
              </Row>

              <hr className="my-2" />
              <h5 className="mb-2 text-primary">Address Information</h5>

              <Row>
                <Col md="12" className="mt-2">
                  <Label>Address *</Label>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(addressSanitizer(e.target.value))
                        }
                      />
                    )}
                  />
                  {errors.address && (
                    <small className="text-danger">
                      {errors.address.message}
                    </small>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md="6" className="mt-2">
                  <Label>City *</Label>
                  <Controller
                    name="city"
                    control={control}
                    rules={{
                      required: "City is required",
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(onlyLetters(e.target.value))
                        }
                      />
                    )}
                  />
                  {errors.city && (
                    <small className="text-danger">{errors.city.message}</small>
                  )}
                </Col>

                <Col md="6" className="mt-2">
                  <Label>State *</Label>
                  <Controller
                    name="state"
                    control={control}
                    rules={{
                      required: "State is required",
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(onlyLetters(e.target.value))
                        }
                      />
                    )}
                  />
                  {errors.state && (
                    <small className="text-danger">
                      {errors.state.message}
                    </small>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md="6" className="mt-2">
                  <Label>Country *</Label>
                  <Controller
                    name="country"
                    control={control}
                    rules={{
                      required: "Country is required",
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(onlyLetters(e.target.value))
                        }
                      />
                    )}
                  />
                  {errors.country && (
                    <small className="text-danger">
                      {errors.country.message}
                    </small>
                  )}
                </Col>

                <Col md="6" className="mt-2">
                  <Label>Postal Code *</Label>
                  <Controller
                    name="postalCode"
                    control={control}
                    rules={{
                      required: "Postal code is required",
                      minLength: {
                        value: 5,
                        message: "Postal code must be 5 digits",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        maxLength={5}
                        onChange={(e) =>
                          field.onChange(onlyNumbers(e.target.value))
                        }
                      />
                    )}
                  />
                  {errors.postalCode && (
                    <small className="text-danger">
                      {errors.postalCode.message}
                    </small>
                  )}
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button color="secondary" type="button" outline>
                  Cancel
                </Button>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : retriveAllData
                    ? "Update Settings"
                    : "Save Settings"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
