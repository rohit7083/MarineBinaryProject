import useJwt from "@src/auth/jwt/useJwt";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
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
  UncontrolledAlert,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import { permissionList } from "./fakedb";

const actions = ["View", "Create", "Update", "Delete"];

function RoleModal({ show: propShow, row, uid, ...props }) {
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState("Add New");
  const [roles, setRoles] = useState([]);
  const [setAction, setsetAction] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [permissionData, setPermissionData] = useState({});
  const MySwal = withReactContent(Swal);
  const [Errmessage, setMessage] = useState("");

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { roleName: "", permission: "" },
  });

  const handleCheckboxChange = (role, action) => {
    setSelectedPermissions((prev) => {
      const updatedPermissions = { ...prev };
      const matchedItem = setAction.find(
        (item) =>
          item.moduleName.toLowerCase() === role.toLowerCase() &&
          item.action.toLowerCase() === action.toLowerCase()
      );
      const uid = matchedItem ? matchedItem.uid : null;

      updatedPermissions[role] = updatedPermissions[role] || {};
      updatedPermissions[role][action] = !updatedPermissions[role][action]
        ? uid
        : null;

      return updatedPermissions;
    });
  };

  const onSubmit = async (data) => {
    data.permissionIds = [];
    Object.keys(permissionData).forEach((key) => {
      if (data[key]) {
        permissionData[key].forEach((action) => {
          if (data[key][action.action]?.isSelected) {
            data.permissionIds.push(action.uid);
          }
        });
      }
    });
    console.log("Submitted Data:", data);

    try {
      if (uid) {
        const res = await useJwt.updateRole(uid, data);
        console.log(" updated role res:", res);

        if (res.status === 200) {
          setTableData((prevData) =>
            prevData.map((item) =>
              item.uid === uid ? { ...item, ...updatedData } : item
            )
          );
          MySwal.fire({
            title: "Successfully Updated",
            text: " Role Updated Successfully",
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          }).then(() => {
            setShow(false);
            reset();
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
            // navigate("/dashboard/sliplist");
          });
          console.error("Failed to add role:", res.message || res);
        }
      }
    } catch (error) {
      console.error(
        "Login Error Details:",
        error.response || error.message || error
      );

      if (error.response) {
        const { status, detail } = error.response.data;
        const errorMessage = detail;
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
  };

  const fetchRoles = async () => {
    try {
      const res = await useJwt.permission();
      if (res.status === 200) {
        const fetchedRoles = [
          ...new Set(res.data.content.result.map((role) => role.moduleName)),
        ];
        setRoles(fetchedRoles || []);
        setsetAction(res.data.content.result);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleSelectAllChange = (checked) => {
    setSelectAll(checked);
    const updatedPermissions = {};
    roles.forEach((role) => {
      updatedPermissions[role] = {};
      actions.forEach((action) => {
        const matchedItem = setAction.find(
          (item) =>
            item.moduleName.toLowerCase() === role.toLowerCase() &&
            item.action.toLowerCase() === action.toLowerCase()
        );
        updatedPermissions[role][action] = checked ? matchedItem?.uid : null;
      });
    });
    setSelectedPermissions(updatedPermissions);
  };

  const handleDataStructurForm = async (data = {}) => {
    try {
      const hash = new Map();

      const permissionList = await useJwt.permission();
      permissionList.data.content.result.forEach((item) => {
        if (!hash.has(item.moduleName)) {
          hash.set(item.moduleName, [item]);
        } else {
          hash.get(item.moduleName).push(item);
        }

        if (data?.permissionIds && data.permissionIds.includes(item.id)) {
          data[item.moduleName] = {};
          data[item.moduleName][item.action] = { isSelected: true };
        }
      });
      reset(data);
      setPermissionData(Object.fromEntries(hash));
    } catch (error) {
      console.error("Error fetching permission:", error);
    }
  };

  const onReset = () => {
    setShow(false);
    reset({ roleName: "" });
  };

  const handleModalClosed = () => {
    setModalType("Add New");
    setValue("roleName");
  };

  useEffect(() => {
    setShow(propShow);
    if (propShow) {
      handleDataStructurForm(row);
    } else {
      handleDataStructurForm();
    }
  }, [propShow]);

  return (
    <Modal
      isOpen={show}
      onClosed={handleModalClosed}
      toggle={() => setShow(!show)}
      className="modal-dialog-centered modal-lg"
    >
      <ModalHeader
        toggle={() => setShow(!show)}
        className="bg-transparent"
      ></ModalHeader>
      <ModalBody className="px-5 pb-5">
        <div className="text-center mb-4">
          <h1>{modalType} Role</h1>
          <p>{uid ? "Update Roles" : "Create Roles"}</p>
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
              rules={{ required: "Role Name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="roleName"
                  placeholder="Enter role name"
                  invalid={!!errors.roleName}
                />
              )}
            />
            {errors.roleName && (
              <FormFeedback>{errors.roleName.message}</FormFeedback>
            )}
          </Col>
          <Col xs={12}>
            <h4 className="mt-2 pt-50">Role Permissions </h4>
            <Table className="table-flush-spacing" responsive>
              <tbody>
                {/* <tr>
                  <td className="text-nowrap fw-bolder">
                    Administrator Access 
                    <Info size={14} id="info-tooltip" />
                    <UncontrolledTooltip placement="top" target="info-tooltip">
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
                      />
                      <Label className="form-check-label" for="select-all">
                        Select All
                      </Label>
                    </div>
                  </td>
                </tr> */}
                {Object.keys(permissionData).map((category, index) => (
                  <tr key={index}>
                    <td>{category}</td>
                    {permissionData[category].map(({ uid, action }) => (
                      <td key={uid}>
                        <Controller
                          control={control}
                          name={`${category}.${action}.isSelected`}
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
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col className="text-center mt-2" xs={12}>
            <Button type="submit" color="primary" className="me-1">
              {uid ? "Update" : "Submit"}
            </Button>
            <Button type="reset" outline onClick={onReset}>
              Discard
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
}

export default RoleModal;

/*
{
    "roleName": "sdlkcmlksdc",
    "permission": "",
    "Sales": {
        "VIEW": {
            "isSelected": true
        },
        "DELETE": {},
        "CREATE": {},
        "UPDATE": {}
    },
    "POS": {
        "CREATE": {
            "isSelected": true
        },
        "UPDATE": {
            "isSelected": true
        },
        "VIEW": {
            "isSelected": true
        },
        "DELETE": {}
    },
    "INVOICE": {
        "CREATE": {},
        "UPDATE": {}
    },
    "permissionIds": [
        "4354acd0-660d-40fa-b7e6-4c1689387915",
        "869f882f-97a3-441a-815f-83da7401563f",
        "9f537365-5493-4436-a2a2-2a7ed732e15f",
        "0cbca81d-0b90-4f80-b253-516c66dd0aac"
    ]
}
*/
