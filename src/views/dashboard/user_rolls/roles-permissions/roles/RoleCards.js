//============ Create Roles ===================
// ** React Imports
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Spinner,
  Table,
  UncontrolledTooltip,
} from "reactstrap";

// ** Third Party Components
import { Info, Plus, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
// import { BeatLoader } from "react-spinners";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Custom Components

// ** FAQ Illustrations

// ** Jwt Class
import useJwt from "@src/auth/jwt/useJwt";

// ** Utils
import {
  extractUIDFromPermissionList,
  handleUpdatePermissionList,
  structurePermissionList,
} from "../utils";

const indexes = {
  0: "CREATE",
  1: "VIEW",
  2: "UPDATE",
  3: "DELETE",
};

const AddRoles = ({ props, refreshTable }) => {
  // ** Props
  // const { show, toggle, uid, modalType, row } = props;

  const [show, setShow] = useState(false);
  const toast = useRef(null);

  const toggle = () => setShow(!show);
  const [permissionList, setPermissionList] = useState(null);
  const [processingData, setProcessing] = useState(false);
  const [fetchLoader, setfetchLoader] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  // ** Hooks
  const {
    reset,
    control,
    setError,
    clearErrors,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { roleName: "" } });

  // ** Handling Server Sides Errors
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      Object.keys(permissionList).forEach((category, index) => {
        if (!permissionList[category]) return;
        // {{ }}
        permissionList[category].forEach((item, idx) => {
          setValue(`${category}.${[idx]}.isSelected`, true);
        });
      });
    } else {
      Object.keys(permissionList).forEach((category, index) => {
        permissionList[category].forEach((item, idx) => {
          setValue(`${category}.${[idx]}.isSelected`, false);
        });
      });
    }
  };

  const onSubmit = async (data) => {
    const updatedData = extractUIDFromPermissionList(data);

    try {
      setProcessing(true);

      const res = await useJwt.userpermissionPost(updatedData);
      setFetchTrigger(true);
      if (res.status === 201) {
        // {{ }}
        // MySwal.fire({
        //   title: "Successfully Cretaed",
        //   text: " Role Created Successfully",
        //   icon: "success",
        //   customClass: {
        //     confirmButton: "btn btn-primary",
        //   },
        //   buttonsStyling: false,
        // }).then(() => {
        //   toggle();
        // navigate("/dashboard/user_rolls/roles-permissions/roles", {
        //   state: { forceRefresh: true },
        // });
        //   reset();

        //   setMessage("");
        // });
        toast.current.show({
          severity: "success",
          summary: "Created Successfully",
          detail: " Role Created Successfully.",
          life: 2000,
        });

        setTimeout(() => {
          toggle(); // Close modal
          reset(); // Reset form
          navigate("/dashboard/user_rolls/roles-permissions/roles", {
            state: { forceRefresh: true },
          });
        }, 1000);
      }
    } catch (error) {
      if (error?.response) {
        const { response } = error;
        const { content, message } = response?.data;
        handleError(response?.status, content || message);
      } else {
        console.error("API Error: ", error); // More clear error logging
      }
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setfetchLoader(true);
        const res = await useJwt.permission();
        const { result } = res?.data.content;

        let data = structurePermissionList(result);

        if (data && Object.keys(data).length) {
          const { permissionIds, roleName, uid } = data;

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
        setfetchLoader(false);
      }
    })();
  }, [props, fetchTrigger]);

  const onReset = () => {
    toggle();
    reset({ roleName: "" });
  };

  const watchRoleName = watch("roleName");
  useEffect(() => {
    const inputRestriction = watchRoleName?.replace(/[^a-zA-Z ]/g, "");

    if (watchRoleName !== inputRestriction) {
      setValue("roleName", inputRestriction);
    }
  }, [watchRoleName, setValue]);

  return (
    <Fragment>
      <Row className="px-2">
        <Button
          color="primary"
          className="text-nowrap mb-1"
          onClick={() => {
            toggle();
          }}
        >
          <Plus size={14} /> Add New Role
        </Button>
      </Row>

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
            <h1>Add New Roles</h1>
            <p>Set role permissions</p>
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
          {!fetchLoader ? (
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
                        <span className="me-50"> Administrator Access</span>
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
                      Object.keys(permissionList).map((category, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-nowrap fw-bolder">
                              {category}
                            </td>
                            <td>
                              <div className="d-flex">
                                {permissionList[category].map((data, index) => {
                                  if (data === null)
                                    return (
                                      <div
                                        className="form-check me-3 me-lg-5"
                                        style={{ visibility: "hidden" }}
                                        key={index}
                                      >
                                        <Label>
                                          <Input type="checkbox" />
                                          {indexes[index]}
                                        </Label>
                                      </div>
                                    );

                                  const { action, uid } = data;

                                  return (
                                    <div
                                      key={uid}
                                      className="form-check me-3 me-lg-5"
                                    >
                                      <Controller
                                        name={`${category}.${[
                                          index,
                                        ]}.isSelected`}
                                        control={control}
                                        render={({ field }) => (
                                          <Label>
                                            <Input
                                              type="checkbox"
                                              checked={field.value}
                                              onChange={(e) =>
                                                field.onChange(e.target.checked)
                                              }
                                            />
                                            {action}
                                          </Label>
                                        )}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner
                color="primary"
                style={{
                  height: "5rem",
                  width: "5rem",
                }}
              />
              {/* <PacmanLoader /> */}
            </div>
          )}
        </ModalBody>
      </Modal>
    </Fragment>
  );
};
// AddRoles.prototype = {
//   show: PropTypes.bool,
//   toggle: PropTypes.func,
//   uid: PropTypes.string,
//   modalType: PropTypes.string,
// };

export default AddRoles;
