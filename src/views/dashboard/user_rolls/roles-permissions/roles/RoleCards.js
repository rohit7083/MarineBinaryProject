// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useJwt from "@src/auth/jwt/useJwt";
// ** Reactstrap Imports
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
import { useForm, Controller } from "react-hook-form";

// ** Custom Components
import AvatarGroup from "@components/avatar-group";

// ** FAQ Illustrations
import illustration from "@src/assets/images/illustration/faq-illustrations.svg";

// ** Avatars
import avatar1 from "@src/assets/images/avatars/1.png";
import avatar2 from "@src/assets/images/avatars/2.png";
import avatar3 from "@src/assets/images/avatars/3.png";
import avatar4 from "@src/assets/images/avatars/4.png";
import avatar5 from "@src/assets/images/avatars/5.png";
import avatar6 from "@src/assets/images/avatars/6.png";
import avatar7 from "@src/assets/images/avatars/7.png";
import avatar8 from "@src/assets/images/avatars/8.png";
import avatar9 from "@src/assets/images/avatars/9.png";
import avatar10 from "@src/assets/images/avatars/10.png";
import avatar11 from "@src/assets/images/avatars/11.png";
import avatar12 from "@src/assets/images/avatars/12.png";

// // ** Vars
// const data = [
//   {
//     totalUsers: 4,
//     title: 'Administrator',
//     users: [
//       {
//         size: 'sm',
//         title: 'Vinnie Mostowy',
//         img: avatar2
//       },
//       {
//         size: 'sm',
//         title: 'Allen Rieske',
//         img: avatar12
//       },
//       {
//         size: 'sm',
//         title: 'Julee Rossignol',
//         img: avatar6
//       },
//       {
//         size: 'sm',
//         title: 'Kaith Dsouza',
//         img: avatar11
//       }
//     ]
//   },
//   {
//     totalUsers: 7,
//     title: 'Manager',
//     users: [
//       {
//         size: 'sm',
//         title: 'Jimmy Ressula',
//         img: avatar4
//       },
//       {
//         size: 'sm',
//         title: 'John Doe',
//         img: avatar1
//       },
//       {
//         size: 'sm',
//         title: 'Kristi Lawker',
//         img: avatar2
//       },
//       {
//         size: 'sm',
//         title: 'Kaith D',
//         img: avatar5
//       },
//       {
//         size: 'sm',
//         title: 'Danny Paul',
//         img: avatar7
//       }
//     ]
//   },
//   {
//     totalUsers: 5,
//     title: 'Users',
//     users: [
//       {
//         size: 'sm',
//         title: 'Andrew Tye',
//         img: avatar6
//       },
//       {
//         size: 'sm',
//         title: 'Rishi Swaat',
//         img: avatar9
//       },
//       {
//         size: 'sm',
//         title: 'Rossie Kim',
//         img: avatar2
//       },
//       {
//         size: 'sm',
//         title: 'Kim Merchent',
//         img: avatar10
//       },
//       {
//         size: 'sm',
//         title: 'Sam Dsouza',
//         img: avatar8
//       }
//     ]
//   },
//   {
//     totalUsers: 3,
//     title: 'Support',
//     users: [
//       {
//         size: 'sm',
//         title: 'Kim Karlos',
//         img: avatar3
//       },
//       {
//         size: 'sm',
//         title: 'Katy Turner',
//         img: avatar9
//       },
//       {
//         size: 'sm',
//         title: 'Peter Adward',
//         img: avatar12
//       },
//       {
//         size: 'sm',
//         title: 'Kaith Dsouza',
//         img: avatar10
//       },
//       {
//         size: 'sm',
//         title: 'John Parker',
//         img: avatar11
//       }
//     ]
//   },
//   {
//     totalUsers: 2,
//     title: 'Restricted User',
//     users: [
//       {
//         size: 'sm',
//         title: 'Kim Merchent',
//         img: avatar10
//       },
//       {
//         size: 'sm',
//         title: 'Sam Dsouza',
//         img: avatar6
//       },
//       {
//         size: 'sm',
//         title: 'Nurvi Karlos',
//         img: avatar3
//       },
//       {
//         size: 'sm',
//         title: 'Andrew Tye',
//         img: avatar8
//       },
//       {
//         size: 'sm',
//         title: 'Rossie Kim',
//         img: avatar9
//       }
//     ]
//   }
// ]

const rolesArr = ["User Management", "rohit"];

const actions = ["View", "Create", "Update", "Delete"];

const RoleCards = () => {
  // ** States
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState("Add New");
  const [roles, setRoles] = useState([]);
  const [setAction, setsetAction] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});

  // ** Hooks
  const {
    reset,
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { roleName: "" } });

  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     try {
  //       const res = await useJwt.permission();
  //       console.log('API Response:', res); // Inspect the response

  //       if (res.status === 200) {
  //         const fetchedRoles = Array.from( new Set(res.data.content.result.map((role) => role.moduleName)) );          console.log(fetchedRoles);
  //         const fetchedActions = res.data.content.result.map(role => role.action);

  //         setRoles(fetchedRoles || []);
  //         setsetAction(fetchedActions);
  //         console.log(fetchedActions);

  //       } else {
  //         console.error('Failed to fetch roles:', res.message || res);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching roles:', error);
  //     }
  //   };
  //   fetchRoles()

  // }, [])
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await useJwt.permission();
        console.log("API Response:", res);

        if (res.status === 200) {
          const fetchedRoles = Array.from(
            new Set(res.data.content.result.map((role) => role.moduleName))
          );

          // Map moduleName to actions and their corresponding UIDs
          const fetchedActions = {};
          res.data.content.result.forEach((item) => {
            if (!fetchedActions[item.moduleName]) {
              fetchedActions[item.moduleName] = {};
            }
            fetchedActions[item.moduleName][item.action] = item.uid; // Map action to its UID
          });

          setRoles(fetchedRoles || []);
          setsetAction(fetchedActions); // Store actions with their UIDs
          console.log(fetchedActions);
        } else {
          console.error("Failed to fetch roles:", res.message || res);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  // const onSubmit = async(data) => {
  //   if (data.roleName.length) {
  //     // try {
  //     //   const res=await useJwt.userpermission();
  //     //   console.log("res",res);

  //     // } catch (error) {
  //     //   console.log(error);

  //     // }

  //       // Perform the necessary API call or logic with the selected UIDs

  //     setShow(false)

  //   } else {
  //     setError('roleName', {
  //       type: 'manual'
  //     })
  //   }
  // }

  const onSubmit = () => {
    const selectedUIDs = [];

    // Iterate over selectedPermissions to collect UIDs of selected actions
    for (const role in selectedPermissions) {
      for (const action in selectedPermissions[role]) {
        if (selectedPermissions[role][action]) {
          const uid = setAction[role]?.[action]; // Assuming `setAction` holds the UIDs
          if (uid) {
            selectedUIDs.push(uid);
          }
        }
      }
    }

    console.log("Selected UIDs:", selectedUIDs);
  };

  const onReset = () => {
    setShow(false);
    reset({ roleName: "" });
  };

  const handleModalClosed = () => {
    setModalType("Add New");
    setValue("roleName");
  };
  const handleCheckboxChange = (role, action) => {
    setSelectedPermissions((prev) => {
      const updatedPermissions = { ...prev };

      // If the permission is already selected, unselect it, else select it
      if (updatedPermissions[role]) {
        updatedPermissions[role][action] = !updatedPermissions[role][action];
      } else {
        updatedPermissions[role] = { [action]: true }; // If the role wasn't in state, add it
      }

      return updatedPermissions;
    });
  };

  return (
    <Fragment>
      <Row className="px-2 mt-1">
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
          </div>
          <Row tag="form" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12}>
              <Label className="form-label" for="roleName">
                Role Name
              </Label>
              <Controller
                name="roleName"
                control={control}
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
                        <Input type="checkbox" id="select-all" />
                        <Label className="form-check-label" for="select-all">
                          Select All
                        </Label>
                      </div>
                    </td>
                  </tr>
                  {roles.map((role, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-nowrap fw-bolder">{role}</td>
                        <td>
                          {/* <div className='d-flex'>
                            <div className='form-check me-3 me-lg-5'>
                              <Input type='checkbox' id={`read-${role}`} />
                              <Label className='form-check-label' for={`read-${role}`}>
                              View
                              </Label>
                            </div>
                            <div className='form-check me-3 me-lg-5'>
                              <Input type='checkbox' id={`write-${role}`} />
                              <Label className='form-check-label' for={`write-${role}`}>
                                Create
                              </Label>
                            </div>
                           
                            <div className='form-check me-3 me-lg-5'>
                              <Input type='checkbox' id={`write-${role}`} />
                              <Label className='form-check-label' for={`write-${role}`}>
                              Delete
                              </Label>
                            </div>
                            <div className='form-check'>
                              <Input type='checkbox' id={`create-${role}`} />
                              <Label className='form-check-label' for={`create-${role}`}>
                                Update
                              </Label>
                            </div>
                          </div> */}

                          <div className="d-flex">
                            {actions.map((action, idx) => (
                              <div
                                className="form-check me-3 me-lg-5"
                                key={idx}
                              >
                                <Input
                                  type="checkbox"
                                  id={`${action}-${role}`}
                                  checked={
                                    selectedPermissions[role]?.[action] || false
                                  } // Bind checked state
                                  onChange={() =>
                                    handleCheckboxChange(role, action)
                                  } // Handle checkbox change
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
                    );
                  })}
                </tbody>
              </Table>
            </Col>
            <Col className="text-center mt-2" xs={12}>
              <Button type="submit" color="primary" className="me-1">
                Submit
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
