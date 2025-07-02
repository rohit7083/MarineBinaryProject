// // ** React Imports
// import { useEffect, useState, Fragment } from "react";
// // ** Table Columns
// import { columns } from "./columns";
// // ** Reactstrap Imports
// import {
//   Alert,
//   Row,
//   Col,
//   Label,
//   Form,
//   Input,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   FormFeedback,
// } from "reactstrap";
// import "@styles/react/libs/tables/react-dataTable-component.scss";
// // ** Store & Actions
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getData,
//   addPermission,
//   deletePermission,
//   selectPermission,
//   updatePermission,
// } from "../store";

// import classnames from "classnames";
// import ReactPaginate from "react-paginate";
// import DataTable from "react-data-table-component";
// import { useForm, Controller } from "react-hook-form";
// import { ChevronDown, Edit, Trash } from "react-feather";

// // ** Styles
// import "@styles/react/libs/tables/react-dataTable-component.scss";
// // import RoleCards from "./RoleCards";
// import AddRoles from "./AddRoles";
// const defaultRowDetails = {
//   show: false,
//   row: {},
//   modalType: "Add",
// };


// const Table = () => {
//   // ** Store Vars & Hooks
//   const dispatch = useDispatch();
//   const store = useSelector((state) => state.permissions);
//   const {
//     reset,
//     control,
//     setError,
//     setValue,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ defaultValues: { permissionName: "" } });

//   // ** States
//   const [show, setShow] = useState(false);
//   const [assignedTo, setAssignedTo] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [rowDetails, setRowDetails] = useState({ ...defaultRowDetails });
//   const handleEditClick = (row = {}) => {
//     const { show } = rowDetails;
//     const hasRowData = Object.keys(row).length > 0;

//     setRowDetails({
//       show: !show,
//       modalType: hasRowData ? "Edit" : "Add",
//       row: hasRowData ? { ...row } : {},
//     });
//   };
//   useEffect(() => {
//     const fetchdata = async () => {
//       try {
//         // const response = await useJwt.userpermission();

//         // Assuming the structure of `response` matches the original template
//       } catch (error) {
//         // Handle errors gracefully
//          console.error(error);
//       }
//     };
//     fetchdata();
//   });

//   // ** Function in get data on page change
//   const handlePagination = (page) => {
//     dispatch(
//       getData({
//         assignedTo,
//         q: searchTerm,
//         perPage: rowsPerPage,
//         page: page.selected + 1,
//       })
//     );
//     setCurrentPage(page.selected + 1);
//   };

//   // ** Function in get data on rows per page
//   const handlePerPage = (e) => {
//     const value = parseInt(e.currentTarget.value);
//     dispatch(
//       getData({
//         assignedTo,
//         q: searchTerm,
//         perPage: value,
//         page: currentPage,
//       })
//     );
//     setRowsPerPage(value);
//   };

//   // ** Function in get data on search query change
//   const handleFilter = (val) => {
//     setSearchTerm(val);
//     dispatch(
//       getData({
//         q: val,
//         assignedTo,
//         page: currentPage,
//         perPage: rowsPerPage,
//       })
//     );
//   };

//   // ** Function to filter Roles
//   const handleAssignedToChange = (val) => {
//     setAssignedTo(val);
//     dispatch(
//       getData({
//         q: searchTerm,
//         assignedTo: val,
//         page: currentPage,
//         perPage: rowsPerPage,
//       })
//     );
//   };

//   // ** Custom Pagination
//   const CustomPagination = () => {
//     const count = Number(Math.ceil(store.total / rowsPerPage));

//     return (
//       <ReactPaginate
//         previousLabel={""}
//         nextLabel={""}
//         pageCount={count || 1}
//         activeClassName="active"
//         forcePage={currentPage !== 0 ? currentPage - 1 : 0}
//         onPageChange={(page) => handlePagination(page)}
//         pageClassName={"page-item"}
//         nextLinkClassName={"page-link"}
//         nextClassName={"page-item next"}
//         previousClassName={"page-item prev"}
//         previousLinkClassName={"page-link"}
//         pageLinkClassName={"page-link"}
//         containerClassName={
//           "pagination react-paginate justify-content-end my-2 pe-1"
//         }
//       />
//     );
//   };

//   // ** Table data to render
//   const dataToRender = () => {
//     // const filters = {
//     //   q: searchTerm,
//     // };

//     // const isFiltered = Object.keys(filters).some(function (k) {
//     //   return filters[k].length > 0;
//     // });

//     // if (store.data.length > 0) {
//     //   return store.data;
//     // } else if (store.data.length === 0 && isFiltered) {
//     //   return [];
//     // } else {
//     //   return store.allData.slice(0, rowsPerPage);
//     // }
//   };

//   /*
//   !
//   const handleEditClick = (data) => {
//     dispatch(selectPermission(data));
//     setValue("permissionName", data.name);
//     setShow(true);
//   };
// */
//   const handleModalClosed = () => {
//     dispatch(selectPermission(null));
//     setValue("permissionName", "");
//   };

//   const onSubmit = (data) => {
//     if (data.permissionName.length) {
//       if (store.selected !== null) {
//         dispatch(
//           updatePermission({ name: data.permissionName, id: store.selected.id })
//         );
//       } else {
//         dispatch(addPermission({ name: data.permissionName }));
//       }
//       setShow(false);
//     } else {
//       setError("permissionName", {
//         type: "manual",
//       });
//     }
//   };

//   const updatedColumns = [
//     ...columns,
//     {
//       name: "Actions",
//       cell: (row) => {
//         return (
//           <div className="d-flex align-items-center permissions-actions">
//             <Button
//               size="sm"
//               color="transparent"
//               className="btn btn-icon"
//               onClick={() => handleEditClick(row)}
//             >
//               <Edit className="font-medium-2" />
//             </Button>
//             <Button
//               size="sm"
//               color="transparent"
//               className="btn btn-icon"
//               onClick={() => dispatch(deletePermission(row.id))}
//             >
//               <Trash className="font-medium-2" />
//             </Button>
//           </div>
//         );
//       },
//     },
//   ];

//   const handleDiscard = () => {
//     reset();
//     setShow(false);
//   };

//   const renderModalSubtitle = () => {
//     if (store.selected !== null) {
//       return "Edit permission as per your requirements.";
//     } else {
//       return "Permissions you may use and assign to your users.";
//     }
//   };

//   const renderForm = () => {
//     if (store.selected === null) {
//       return (
//         <Row tag={Form} onSubmit={handleSubmit(onSubmit)}>
//           <Col xs={12}>
//             <Label className="form-label" for="permission-name">
//               Permission Name
//             </Label>
//             <Controller
//               control={control}
//               id="permissionName"
//               name="permissionName"
//               render={({ field }) => (
//                 <Input
//                   placeholder="Permission Name"
//                   invalid={errors.permissionName && true}
//                   {...field}
//                 />
//               )}
//             />
//             {errors && errors.permissionName && (
//               <FormFeedback>Please enter a valid Permission Name</FormFeedback>
//             )}
//           </Col>
//           <Col xs={12} className="mt-75">
//             <div className="form-check">
//               <Input type="checkbox" id="core-perm-checkbox" />
//               <Label className="form-check-label" for="core-perm-checkbox">
//                 Set as core permission
//               </Label>
//             </div>
//           </Col>
//           <Col xs={12} className="text-center mt-2">
//             <Button className="me-1" color="primary">
//               Create Permission
//             </Button>
//             <Button outline type="reset" onClick={handleDiscard}>
//               Discard
//             </Button>
//           </Col>
//         </Row>
//       );
//     } else {
//       return (
//         <Fragment>

//           <Alert color="warning">
//             <h6 className="alert-heading">Warning!</h6>
//             <div className="alert-body">
//               By editing the permission name, you might break the system
//               permissions functionality. Please ensure you're absolutely certain
//               before proceeding.
//             </div>
//           </Alert>
//           <Row tag={Form} onSubmit={handleSubmit(onSubmit)}>
//             <Col xs={12} sm={9}>
//               <Label className="form-label" for="permission-name">
//                 Permission Name
//               </Label>
//               <Controller
//                 control={control}
//                 id="permissionName"
//                 name="permissionName"
//                 render={({ field }) => (
//                   <Input
//                     placeholder="Permission Name"
//                     invalid={errors.permissionName && true}
//                     {...field}
//                   />
//                 )}
//               />
//               {errors && errors.permissionName && (
//                 <FormFeedback>
//                   Please enter a valid Permission Name
//                 </FormFeedback>
//               )}
//             </Col>
//             <Col xs={12} sm={3} className="p-sm-0">
//               <Button className="mt-2" color="primary">
//                 Update
//               </Button>
//             </Col>
//             <Col xs={12} className="mt-75">
//               <div className="form-check">
//                 <Input type="checkbox" id="core-perm-checkbox" />

//                 <Label className="form-check-label" for="core-perm-checkbox">
//                   Set as core permission
//                 </Label>
//               </div>
//             </Col>
//           </Row>
//         </Fragment>
//       );
//     }
//   };

//   return (
//     <Fragment>
//       a;lsd;asdgsdkgmflksdgmlkmsdglkdlkgmk
//       <div className="react-dataTable">
//         <DataTable
//           noHeader
//           pagination
//           subHeader
//           responsive //
//           paginationServer
//           columns={updatedColumns}
//           // sortIcon={<ChevronDown />}
//           sortIcon={<ChevronDown size={10} />}
          
//           className="react-dataTable"
//           paginationComponent={CustomPagination}
//           data={dataToRender()}
//           // subHeaderComponent={
//           //   <CustomHeader
//           //     setShow={setShow}
//           //     assignedTo={assignedTo}
//           //     searchTerm={searchTerm}
//           //     rowsPerPage={rowsPerPage}
//           //     handleFilter={handleFilter}
//           //     handlePerPage={handlePerPage}
//           //     handleAssignedToChange={handleAssignedToChange}
//           //   />
//           // }
//         />
//       </div>
      

//       <AddRoles
//         {...rowDetails}
//         // show={show}
//         toggle={() => handleEditClick()}
//         // uid={""}
//         // modalType={"Add"}
//       />
 

//       {/* <Modal
//         isOpen={show}
//         onClosed={handleModalClosed}
//         toggle={() => setShow(!show)}
//         className="modal-dialog-centered"
//       >
//         <ModalHeader
//           className="bg-transparent"
//           toggle={() => setShow(!show)}
//         ></ModalHeader>
//         <ModalBody
//           className={classnames({
//             "p-3 pt-0": store.selected !== null,
//             "px-sm-5 pb-5": store.selected === null,
//           })}
//         >
//           <div className="text-center mb-2">
//             <h1 className="mb-1">
//               {store.selected !== null ? "Edit" : "Add New"} Permission
//             </h1>
//             <p>{renderModalSubtitle()}</p>
//           </div>

//           {renderForm()}
//         </ModalBody>
//       </Modal> */}


//     </Fragment>
//   );
// };

// export default Table;
