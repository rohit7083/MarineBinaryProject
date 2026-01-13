import { Fragment, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
// ** Reactstrap Imports
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Input,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
} from "reactstrap";

// ** Third Party Components
import "cleave.js/dist/addons/cleave-phone.us";
import { ChevronRight, Key, Settings } from "react-feather";

// ** Images
// import qrCode from '@src/assets/images/icons/qrcode.png'
import useJwt from "@src/auth/jwt/useJwt";
import React from "react";

const AppAuthComponent = ({
  setShow,
  setShowDetailModal,
  qrCode, // Pass the state as a prop
  msz,
  setMessage,
  setIsAuthenticated,
  setauthMsz,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toggle = () => {
    setShow(false);
    setShowDetailModal(false);
  };
  const handleVerifyqr = async (data) => {
    try {
      const resverify = await useJwt.verifyQr({
        otp: data.otp, // Use the form data
      });
      if (resverify.status == 200) {
        const message = resverify.data.message;
        setauthMsz(message);
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        toggle();
      }
       (resverify.status);

       (resverify);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data.error;
        // setMessage(errorMessage);

        switch (status) {
          case 400:
            setMessage(errorMessage);
            break;
          case 401:
            // setMessage(<span style={{ color: "red" }}>Time Out</span>);
            return MySwal.fire({
              title: "Time Out ",
              text: " Please Login Again",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-primary",
              },
              buttonsStyling: false,
            });

            break;
          case 403:
            setMessage(errorMessage);
            break;
          case 500:
            setMessage(
              <span style={{ color: "red" }}>
                Something went wrong on our end. Please try again later
              </span>
            );
            break;
          default:
            setMessage(errorMessage);
        }
      }
       ({ error });
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mb-2 pb-50">Add Authenticator App</h1>
      {msz && (
        <Alert color="danger">
          <div className="alert-body">
            <AlertCircle size={15} />{" "}
            <span className="ms-1">
              Error : <strong>{msz}</strong>
            </span>
          </div>
        </Alert>
      )}

      <h4>Authenticator Apps</h4>
      <p>
        Using an authenticator app like Google Authenticator, Microsoft
        Authenticator, Authy, or 1Password, scan the QR code. It will generate a
        6 digit code for you to enter below.
      </p>
      <div className="d-flex justify-content-center my-2 py-50">
        {qrCode ? (
          <img src={qrCode} alt="QR Code" className="img-fluid" width="122" />
        ) : (
          <p>Loading QR Code...</p>
        )}{" "}
      </div>
      <Alert color="warning">
        {/* <h4 className="alert-heading">ASDLKNASDA9AHS678dGhASD78AB</h4> */}
        <div className="alert-body fw-normal">
          If you having trouble using the QR code, select manual entry on your
          app
        </div>
      </Alert>
      <form onSubmit={handleSubmit(handleVerifyqr)}>
        <Row className="gy-1">
          <Col xs={12}>
            <Controller
              name="otp"
              control={control}
              defaultValue=""
              rules={{
                required: "OTP is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "OTP must be a 6-digit number",
                },
              }}
              render={({ field }) => (
                <Input
                  placeholder="Enter authentication code"
                  {...field}
                  invalid={!!errors.otp}
                />
              )}
            />
            {errors.otp && (
              <div className="text-danger mt-1">{errors.otp.message}</div>
            )}
          </Col>
          <Col className="d-flex justify-content-end mt-3" xs={12}>
            <Button outline color="secondary" className="me-1" onClick={toggle}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              <span className="me-50">Continue</span>
              <ChevronRight className="rotate-rtl" size={14} />
            </Button>
          </Col>
        </Row>
      </form>
    </Fragment>
  );
};

const AuthenticationExample = () => {
  const [show, setShow] = useState(false);
  const [authType, setAuthType] = useState("authApp");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [msz, setMessage] = useState("");
  const [autMsz, setauthMsz] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleContinue = async () => {
    try {
      const res = await useJwt.generate();
       (res);

      if (res && res.data) {
        setQrCode(res.data);
      }
      setShow(false);
      setShowDetailModal(true);
    } catch (error) {
       (error.response);

      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code.");
    }
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await useJwt.status();
        if (isMounted) {
          setIsAuthenticated(res.data.is_2fa_activated);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false; // Avoid state updates after unmount
    };
  }, []);

  return (
    <Fragment>
      <Card>
        <CardBody className="text-center">
          <Key className="font-large-2 mb-1" />
          <CardTitle tag="h5">Two Factor Auth</CardTitle>
          {isAuthenticated ? (
            <>
              <CardText>
                <React.Fragment>
                  <Alert color="success">
                    <div className="alert-body">
                      Two Steps Authentication Is Successfully Completed
                    </div>
                  </Alert>
                </React.Fragment>
              </CardText>
            </>
          ) : (
            <>
              {!loading ? (
                <>
                  <CardText>
                    Click On below to enhance your application security by
                    enabling two factor authentication.
                  </CardText>
                  <Button
                    color="primary"
                    type="submit"
                    onClick={() => setShow(true)}
                  >
                    Enable Authentication
                  </Button>
                </>
              ) : (
                <>
                  <CardText>Please Wait...</CardText>
                  <BeatLoader />
                </>
              )}
            </>
          )}
        </CardBody>
      </Card>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="pb-5 px-sm-5 mx-50">
          <h1 className="text-center mb-1">
            Continue with App Authentication Method
          </h1>

          <div className="custom-options-checkable">
            <input
              type="radio"
              id="authApp"
              name="authType"
              checked={authType === "authApp"}
              className="custom-option-item-check"
              onChange={() => setAuthType("authApp")}
            />
            <label
              htmlFor="authApp"
              className="custom-option-item d-flex align-items-center flex-column flex-sm-row px-3 py-2 mb-2"
            >
              <span>
                <Settings className="font-large-2 me-sm-2 mb-2 mb-sm-0" />
              </span>
              <span>
                <span className="custom-option-item-title d-block h3">
                  Authenticator Apps
                </span>
                <span className="mt-75">
                  Get codes from an app like Google Authenticator, Microsoft
                  Authenticator, Authy or 1Password.
                </span>
              </span>
            </label>
            <input
              type="radio"
              id="authSMS"
              name="authType"
              checked={authType === "authSMS"}
              className="custom-option-item-check"
              onChange={() => setAuthType("authSMS")}
            />
          </div>
          <Button
            color="primary"
            type="submit"
            className="float-end mt-2"
            onClick={handleContinue}
          >
            <span className="me-50">Continue</span>
            <ChevronRight className="rotate-rtl" size={14} />
          </Button>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={showDetailModal}
        toggle={() => setShowDetailModal(!showDetailModal)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShowDetailModal(!showDetailModal)}
        ></ModalHeader>
        <ModalBody className="pb-5 px-sm-5 mx-50">
          {authType === "authApp" ? (
            <AppAuthComponent
              setShow={setShow}
              setShowDetailModal={setShowDetailModal}
              qrCode={qrCode}
              msz={msz}
              setMessage={setMessage}
              setIsAuthenticated={setIsAuthenticated}
              toggle={() => setShow(!show)}
              setauthMsz={setauthMsz}
            />
          ) : (
            <AppSMSComponent
              setShow={setShow}
              setShowDetailModal={setShowDetailModal}
            />
          )}
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default AuthenticationExample;
