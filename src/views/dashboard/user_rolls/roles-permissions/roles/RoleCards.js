//============ Create Roles ===================
// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PacmanLoader } from "react-spinners";
import { Spinner } from "reactstrap";
import {
  Row,
  Col,
  Card,
  Label,
  Input,
  Table,
  Modal,
  Button,
  CardBody,
  ModalBody,
  ModalHeader,
  FormFeedback,
  UncontrolledTooltip,
  Alert,
} from "reactstrap";

// ** Third Party Components
import { Copy, Info, X } from "react-feather";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";
// import { BeatLoader } from "react-spinners";

// ** Custom Components
import AvatarGroup from "@components/avatar-group";

// ** FAQ Illustrations
import illustration from "@src/assets/images/illustration/faq-illustrations.svg";

// ** Jwt Class
import useJwt from "@src/auth/jwt/useJwt";

// ** Utils
import {
  structurePermissionList,
  extractUIDFromPermissionList,
  handleUpdatePermissionList,
} from "../utils";

const AddRoles = ({ props, refreshTable }) => {
  // ** Props
  // const { show, toggle, uid, modalType, row } = props;

  const [show, setShow] = useState(false);

  const toggle = () => setShow(!show);
  const [permissionList, setPermissionList] = useState(null);
  const [processingData, setProcessing] = useState(false);
  const [fetchLoader, setfetchLoader] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);

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

  const onSubmit = async (data) => {
    const updatedData = extractUIDFromPermissionList(data);
   
    try {
      setProcessing(true);

      const res = await useJwt.userpermissionPost(updatedData);
      setFetchTrigger(true);

      toggle();
    } catch (error) {
      if (error?.response) {
        const { response } = error;
        const { content, message } = response?.data;
        handleError(response?.status, content || message);
      } else {
        console.error('API Error: ', error);  // More clear error logging
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
        console.log("permission", result);

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
  }, [props,fetchTrigger]);

  const onReset = () => {
    toggle();
    reset({ roleName: "" });
  };

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
          Add New Role +
        </Button>
      </Row>

      <Modal
        isOpen={show}
        //   onClosed={handleModalClosed}
        toggle={() => toggle()}
        className="modal-dialog-centered modal-lg"
      >
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
                          <Input type="checkbox" id="select-all" />
                          <Label className="form-check-label" for="select-all">
                            Select All
                          </Label>
                        </div>
                      </td>
                    </tr>
                    {/* {console.log(permissionList)} */}
                    {permissionList &&
                      Object.keys(permissionList).map((category, index) => {
                        // console.log({ category });
                        return (
                          <tr key={index}>
                            <td className="text-nowrap fw-bolder">
                              {category}
                            </td>
                            <td>
                              <div className="d-flex">
                                {permissionList[category].map(
                                  ({ action, uid }, index) => (
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
                                  )
                                )}
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
              {/* <Spinner
              color="primary"
              style={{
                height: "5rem",
                width: "5rem",
              }}
            /> */}
              <PacmanLoader />
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
