import { useEffect, useState } from "react";
import { AlertCircle } from "react-feather";
import { useNavigate } from "react-router-dom";
// import Index from "./dashboard_manage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Alert,
  Button,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
// ** Third Party Components
import "cleave.js/dist/addons/cleave-phone.us";
import { Settings } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Images
// import qrCode from '@src/assets/images/icons/qrcode.png'
import useJwt from "@src/auth/jwt/useJwt";
import React, { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
// import ParkBoat from "./ParkBoat";

const DefaultAlert = () => {
  const [show, setShow] = useState(false);
  const [authType, setAuthType] = useState("authApp");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [msz, setMessage] = useState("");
  const [autMsz, setauthMsz] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoad, setStatusLoad] = useState(false);
  const [authStatusauth, setauthStatus] = useState(null);
  const MySwal = withReactContent(Swal);
  const [visible, setVisible] = useState(true);

  const handleContinue = async () => {
    try {
      setLoading(true);

      const res = await useJwt.generate();

      if (res && res.data) {
        const base64 = `data:image/png;base64,${res.data.qr_code_base64}`; // Ensure the correct MIME type (image/png) is used
        //const base64 = res.data;

        setQrCode(base64);
      }

      setShow(false);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data.error;
        // setMessage(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const rawData = localStorage.getItem("userData");
    if (rawData) {
      try {
        const authStatus = JSON.parse(rawData);
        setauthStatus(authStatus?.TwoNf);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.log("No userdata found in localStorage");
    }
  }, []);

  return (
    <>
      <React.Fragment>
        {authStatusauth ? (
          ""
        ) : (
          <>
            {!statusLoad && (
              <Alert color="primary">
                <div className="p-1 d-flex justify-content-between align-item-center">
                  <div className="alert-body">
                    <span className="fw-bold">Two Steps Authentication</span>
                    <span></span>
                  </div>

                  <Button
                    color="relief-primary"
                    type="submit"
                    size="sm"
                    onClick={() => setShow(true)}
                  >
                    Enable Authentication
                  </Button>
                </div>
              </Alert>
            )}
          </>
        )}
      </React.Fragment>

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
            disabled={loading}
          >
            {loading ? (
              <>
                Loading.. <Spinner size="sm" />
              </>
            ) : (
              <span className="me-50">Continue</span>
            )}
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
              isAuthenticated={authStatusauth}
              setIsAuthenticated={setauthStatus}
              toggle={() => setShow(!show)}
              setauthMsz={setauthMsz}
              setLoading={setLoading}
              loading={loading}
              authStatusauth={authStatusauth}
            />
          ) : (
            <AppSMSComponent
              setShow={setShow}
              setShowDetailModal={setShowDetailModal}
              ShowqrCode={ShowqrCode}
              msz={msz}
              setMessage={setMessage}
            />
          )}
        </ModalBody>
      </Modal>
    </>
  );
};
export default DefaultAlert;

const AppAuthComponent = ({
  setShow,
  setShowDetailModal,
  qrCode,
  msz,
  setMessage,
  isAuthenticated,
  setIsAuthenticated,
  setauthMsz,
  loading,
  setLoading,
  authStatusauth,
  // toggle
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate(); // Initialize navigate
  const [showToast, setShowToast] = useState(false);

  const toggle = () => {
    setShow(false);
    setShowDetailModal(false);
  };

  const handleVerifyqr = async (data) => {
    try {
      setLoading(true);
      const resverify = await useJwt.verifyQr({
        otp: data?.otp, // Use the form data
      });
      if (resverify?.status == 200) {
        toast.success(
          "Success! Two Step Authentication succesfully Completed.",
          {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
          }
        );

        setTimeout(() => {
          navigate("/dashbord");
        }, 2000);

        const rawData = localStorage.getItem("userData");
        let userData = rawData ? JSON.parse(rawData) : {};

        userData.TwoNf = true;

        // Save the updated object back to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data.error;
        setMessage(errorMessage);
      }
      console.log({ error });
    } finally {
      setLoading(false); // Set loading to false after API call is complete
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
        6-digit code for you to enter below.
      </p>
      <div className="d-flex justify-content-center my-2 py-50">
        {qrCode ? (
          <img src={qrCode} alt="QR Code" className="img-fluid" width="150" />
        ) : (
          <p>Loading QR Code...</p>
        )}
      </div>
      <Alert color="warning">
        <div className="alert-body fw-normal">
          If you are having trouble using the QR code, select manual entry on
          your app.
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
            <Button color="primary" disabled={loading} type="submit">
              {loading ? (
                <>
                  Loading.. <Spinner size="sm" />
                </>
              ) : (
                <span className="me-50">Continue</span>
              )}
            </Button>
          </Col>
        </Row>
      </form>
    </Fragment>
  );
};
