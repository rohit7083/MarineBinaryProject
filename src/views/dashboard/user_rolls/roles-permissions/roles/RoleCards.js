import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { Spinner, UncontrolledAlert } from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";
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
} from "reactstrap";

// ** Third Party Components
import { Copy, Info } from "react-feather";
import { useForm, Controller, set } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { permissionList } from "./fakedb";
// import Role_modal from "./Role_modal";

const actions = ["View", "Create", "Update", "Delete"];

const RoleCards = () => {
  const[Errmessage,setMessage]=useState("");
  
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState("Add New");
  const [roles, setRoles] = useState([]);
  const [setAction, setsetAction] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [checkroles, setCheckRoles] = useState([]);
  const [CheckActions, setCheckActions] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // State to track "Select All"
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(false);
  const {
    reset,
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { roleName: "", permission: "" } });

  const handleCheckboxChange = (role, action) => {
    console.log("Role:", role, "Action:", action);
    setCheckRoles(role);
    setCheckActions(action);

    // Set the selectedPermissions state with the corresponding UID
    setSelectedPermissions((prev) => {
      const updatedPermissions = { ...prev };

      // Find the UID for the selected role and action
      const matchedItem = setAction.find(
        (item) =>
          item.moduleName.toLowerCase() === role.toLowerCase() &&
          item.action.toLowerCase() === action.toLowerCase()
      );

      const uid = matchedItem ? matchedItem.uid : null; // Extract UID

      if (updatedPermissions[role]) {
        updatedPermissions[role][action] = !updatedPermissions[role][action]
          ? uid // Store the UID when checked
          : null; // Set null if unchecked
      } else {
        updatedPermissions[role] = { [action]: uid || null }; // Set UID for the first time
      }

      return updatedPermissions;
    });
  };

  const fetchRoles = async () => {
    // {{debugger}}
    try {
      const res = await useJwt.permission();
      console.log("permission Response:", res);

      if (res.status === 200) {
        // Extract UIDs for the selected role and action based on the criteria
        const selectedUIDs = res.data.content.result.map((item) => item.uid);
        // console.log("Selected UIDs:", selectedUIDs);

        const fetchedRoles = Array.from(
          new Set(res.data.content.result.map((role) => role.moduleName))
        );
        setRoles(fetchedRoles || []);
        setsetAction(res.data.content.result);
      } else {
        console.error("Failed to fetch roles:", res.message || res);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleSelectAllChange = (checked) => {
    setSelectAll(checked);

    // Update all permissions for each role and action
    const updatedPermissions = {};
    roles.forEach((role) => {
      updatedPermissions[role] = {};
      actions.forEach((action) => {
        // Here we can assign the UID for each action for the selected role
        const matchedItem = setAction.find(
          (item) =>
            item.moduleName.toLowerCase() === role.toLowerCase() &&
            item.action.toLowerCase() === action.toLowerCase()
        );
        const uid = matchedItem ? matchedItem.uid : null;

        // Set permission to true if "Select All" is checked, or false otherwise
        updatedPermissions[role][action] = checked ? uid : null;
      });
    });

    setSelectedPermissions(updatedPermissions);
  };

  const onSubmit = async (data) => {
    // {{debugger}}
    const selectedUIDs = [];

    for (const role in selectedPermissions) {
      for (const action in selectedPermissions[role]) {
        if (selectedPermissions[role][action]) {
          selectedUIDs.push(selectedPermissions[role][action]); // Push UID
        }
      }
    }

    console.log("Selected UIDs:", selectedUIDs);
    const payload = {
      roleName: data.roleName,
      permissionIds: selectedUIDs,
    };
    console.log("payload", payload);
    try {
      setLoading(true);
      const res = await useJwt.userpermissionPost(payload);
      console.log(" Add role res:", res);

      if (res.status === 201) {
        MySwal.fire({
          title: "Successfully Added",
          text: " Your Role Name Added Successfully",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          setShow(false);
          reset({ roleName: "", permissions: {} });

          navigate("/dashboard/user_rolls/roles-permissions/roles");
        });
      } else {
        MySwal.fire({
          title: "Failed",
          text: "Your Role Created Failed",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          // navigate("/dashboard/SlipList");
        });
        console.error("Failed to add role:", res.message || res);
      }
    } catch (error) {
      console.error(
        "Login Error Details:",
        error.response || error.message || error
      );

      if (error.response) {
        const { status, content } = error.response.data;
        const errorMessage =content;
        setMessage(errorMessage);
        // console.log("errorMessage",errorMessage);

      
        switch (status) {
          case 400:
            setMessage(errorMessage);
            break;
          case 401:
            setMessage(errorMessage);
            // navigate("/login");
            break;
          case 403:
            setMessage(errorMessage);
            break;
            case 500:
              setMessage(errorMessage);
              break;
          default:
            setMessage(errorMessage);
        }
      }
    
    }
    finally{
      setLoading(false);
    }
  };

  // ** useEffect to fetch roles on component mount
  useEffect(() => {

    // permissionList

      // Extract UIDs for the selected role and action based on the criteria
      const selectedUIDs = permissionList.content.result.map((item) => item.uid);
      // console.log("Selected UIDs:", selectedUIDs);

      // Set roles (module names) from the API response
      const fetchedRoles = Array.from(
        new Set(permissionList.content.result.map((role) => role.moduleName))
      );
      setRoles(fetchedRoles || []);
      setsetAction(permissionList.content.result);
    // fetchRoles();
  }, []);

  const onReset = () => {
    setShow(false);
    reset({ roleName: "" });
  };

  const handleModalClosed = () => {
    setModalType("Add New");
    setValue("roleName");
  };

 

  return (
    <Fragment>
      <Row className="px-2">
        <Button
          color="primary"
          className="text-nowrap mb-1"
          onClick={() => {
            setModalType("Add New");
            setShow(true);
          }}
        >
          Add New Role +
        </Button>
      </Row>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-5 pb-5">
          <div className="text-center mb-4">
            <h1>{modalType} Role</h1>
            <p>Set role permissions</p>
              {Errmessage && (
                            <React.Fragment>
                              <UncontrolledAlert color="danger">
                                <div className="alert-body">
                                  <span className="text-danger fw-bold">{Errmessage}</span>
                                </div>
                              </UncontrolledAlert>
                            </React.Fragment>
                          )}
          </div>

          <Row tag="form" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12}>
              <Label className="form-label" for="roleName">
                Role Name
              </Label>
              <Controller
                name="roleName"
                control={control}
                rules={{
                  required: "Role Name is required",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="roleName"
                    placeholder="Enter role name"
                    invalid={errors.roleName && true}
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
                          checked={selectAll}
                          onChange={(e) =>
                            handleSelectAllChange(e.target.checked)
                          }
                        />{" "}
                        <Label className="form-check-label" for="select-all">
                          Select All
                        </Label>
                      </div>
                    </td>
                  </tr>
                  {roles.map((role, index) => (
                    <tr key={index}>
                      <td className="text-nowrap fw-bolder">{role}</td>
                      <td>
                        <div className="d-flex">
                          {actions.map((action, idx) => (
                            <div className="form-check me-3 me-lg-5" key={idx}>
                              <Input
                                // rules={{ validate: validatePermissions }}
                                type="checkbox"
                                id={`${action}-${role}`}
                                checked={
                                  selectedPermissions[role]?.[action] || false
                                } // Bind checkbox state
                                onChange={() =>
                                  handleCheckboxChange(role, action)
                                } // Handle change
                              />

                              <Label
                                className="form-check-label"
                                for={`${action}-${role}`}
                              >
                                {action}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {errors.permissions && (
                    <small className="text-danger">
                      {errors.permissions.message}
                    </small>
                  )}
                </tbody>
              </Table>
            </Col>

            <Col className="text-center mt-2" xs={12}>
              <Button type="submit" color="primary" className="me-1">
               {loading ?  <Spinner size="sm" />:"Submit"} 
              </Button>
              <Button type="reset" outline onClick={onReset}>
                Discard
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

    </Fragment>
  );
};

export default RoleCards;
