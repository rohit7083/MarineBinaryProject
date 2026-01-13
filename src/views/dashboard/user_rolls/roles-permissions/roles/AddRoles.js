// ** React Imports
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";

// ** Reactstrap Imports
import {
    Alert,
    Button,
    Col,
    FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Table,
    UncontrolledTooltip,
} from "reactstrap";

// ** Third Party Components
import PropTypes from "prop-types";
import { Info, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";

// ** Custom Components

// ** FAQ Illustrations
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Jwt Class
import useJwt from "@src/auth/jwt/useJwt";

// ** Utils
import {
    extractUIDFromPermissionList,
    handleUpdatePermissionList,
    structurePermissionList,
} from "../utils";

const AddRoles = (props) => {
  // ** Props
  const { show, toggle, uid, modalType, row } = props;
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const toast = useRef(null);

  const [fetchLoader, setFetchLoader] = useState(false);
  // ** States
  const [permissionList, setPermissionList] = useState(null);
  const [processingData, setProcessing] = useState(false);
  // ** Hooks
  const {
    reset,
    control,
    setError,
    clearErrors,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { roleName: "" } });
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    Object.keys(permissionList).forEach((category) => {
      permissionList[category].forEach((item, index) => {
        if (item) {
          setValue(`${category}.${index}.isSelected`, checked);
        }
      });
    });
  };

  const handleError = (statusCode, message) => {
    switch (statusCode) {
      case 403:
        setError("server", { type: "manual", message });
        break;
      case 400:
        setError("server", { type: "manual", message });
        break;
      default:
        setError("server", {
          type: "manual",
          message: "Server not responding, try some time later",
        });
    }
  };

  const onSubmit = async (data) => {
    const updatedData = extractUIDFromPermissionList(data);
    try {
      setProcessing(true);

      if (data.uid) {
        const updateRes = await useJwt.updateRole(data.uid, updatedData);
         (`Update Role Response`, {
          updateRes,
        });
        if (updateRes.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Role updated Successfully.",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/dashboard/user_rolls/roles-permissions/roles");
            reset();
          }, 2000);
        }
      }
    } catch (error) {
      if (error?.response) {
        const { response } = error;
        const { content, message } = response?.data;
        handleError(response?.status, content || message);
      } else {
         (`Error OTP Submit ❌`, {
          error,
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  const onReset = () => {
    toggle();
    reset({ roleName: "" });
  };

  useEffect(() => {
    (async () => {
      try {
        setFetchLoader(true);
        const res = await useJwt.permission();
        const { result } = res?.data.content;
        let data = structurePermissionList(result);

        if (row && Object.keys(row).length) {
          const { permissionIds, roleName, uid } = row;
          const updatedList = handleUpdatePermissionList(permissionIds, {
            ...data,
          });
          setPermissionList({ ...updatedList });
          reset({
            roleName,
            ...updatedList,
            uid,
          });
        } else {
          reset({ roleName: "", ...data });
          setPermissionList(data);
        }
      } catch (error) {
      } finally {
        setFetchLoader(false);
      }
    })();
  }, [props]);

  return (
    <Modal
      isOpen={show}
      //   onClosed={handleModalClosed}
      toggle={() => toggle()}
      className="modal-dialog-centered modal-lg"
    >
      <Toast ref={toast} />

      <ModalHeader
        className="bg-transparent"
        toggle={() => toggle()}
      ></ModalHeader>
      <ModalBody className="px-5 pb-5">
        <div className="text-center mb-4">
          <h1>{modalType} Role</h1>
          <p>Update  Permissions</p>
          {errors?.server && (
            <Fragment>
              <Alert color="danger">
                <div className="alert-body font-small-2">
                  <p>
                    <small className="me-50">{errors?.server?.message}</small>
                  </p>
                </div>
                <X
                  id="login-tip"
                  className="position-absolute"
                  size={18}
                  style={{ top: "10px", right: "10px" }}
                />
              </Alert>
            </Fragment>
          )}
        </div>
        {fetchLoader ? (
          <>
            {" "}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "4rem",
              }}
            >
              <Spinner
                color="primary"
                style={{
                  height: "5rem",
                  width: "5rem",
                }}
              />
            </div>
          </>
        ) : (
          <>
            <Row tag="form" onSubmit={handleSubmit(onSubmit)}>
              <Col xs={12}>
                <Label className="form-label" for="roleName">
                  Role Name
                </Label>
                <Controller
                  name="roleName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      id="roleName"
                      placeholder="Enter role name"
                      invalid={fieldState?.error && true}
                      onChange={(e) => {
                        // Allow only letters and spaces
                        const onlyLettersAndSpaces = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        field.onChange(onlyLettersAndSpaces);
                      }}
                    />
                  )}
                />
                {errors.roleName && (
                  <FormFeedback>Please enter a valid role name</FormFeedback>
                )}
              </Col>

              <Col xs={12}>
                <h4 className="mt-2 pt-50">Role Permissions</h4>
                <Table className="table-flush-spacing" responsive>
                  <tbody>
                    <tr>
                      <td className="text-nowrap fw-bolder">
                        <span className="me-50"> Administrator Access </span>
                        <Info size={14} id="info-tooltip" />
                        <UncontrolledTooltip
                          placement="top"
                          target="info-tooltip"
                        >
                          Allows a full access to the system
                        </UncontrolledTooltip>
                      </td>
                      <td>
                        <div className="form-check">
                          <Input
                            type="checkbox"
                            id="select-all"
                            onChange={handleSelectAll}
                          />
                          <Label className="form-check-label" for="select-all">
                            Select All
                          </Label>
                        </div>
                      </td>
                    </tr>
                  

                    {permissionList &&
                      Object.keys(permissionList).map((category, catIndex) => (
                        <tr key={catIndex}>
                          <td className="text-nowrap fw-bolder">{category}</td>
                          <td>
                            <div className="d-flex flex-wrap">
                              {permissionList[category].map((perm, permIndex) =>
                                perm ? (
                                  <div
                                    key={perm.uid}
                                    className="form-check me-3 me-lg-5"
                                  >
                                    <Controller
                                      name={`${category}.${permIndex}.isSelected`}
                                      control={control}
                                      render={({ field }) => (
                                        <div>
                                          <Input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={(e) =>
                                              field.onChange(e.target.checked)
                                            }
                                          />
                                          <Label>{perm.action}</Label>
                                        </div>
                                      )}
                                    />
                                  </div>
                                ) : null
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
              <Col className="text-center mt-2" xs={12}>
                <Button type="reset" outline onClick={onReset}>
                  Discard
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="mx-1"
                  onClick={() => clearErrors()}
                  disabled={processingData}
                >
                  {processingData ? (
                    <>
                      Loading.. <Spinner size="sm" />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

AddRoles.prototype = {
  show: PropTypes.bool,
  toggle: PropTypes.func,
  uid: PropTypes.string,
  modalType: PropTypes.string,
};

export default AddRoles;
