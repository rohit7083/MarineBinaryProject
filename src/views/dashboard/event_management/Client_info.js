// import React from 'react';
// import {
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Card,
//   CardBody
// } from 'reactstrap';
// import { useForm, Controller } from 'react-hook-form';

// const ClientInfoForm = () => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     defaultValues: {
//       clientName: '',
//       contactNumber: '',
//       email: '',
//       address: '',
//       preferredLanguage: ''
//     }
//   });

//   const onSubmit = (data) => {
//     console.log('Client Info Submitted:', data);
//   };

//   return (
   
//     <>
//         <h4 className="mb-4">Client Information</h4>
//         <Form onSubmit={handleSubmit(onSubmit)}>
//           {/* Client Name */}
//           <FormGroup>
//             <Label for="clientName">Client Name</Label>
//             <Controller
//               name="clientName"
//               control={control}
//               rules={{ required: 'Client Name is required' }}
//               render={({ field }) => (
//                 <Input {...field} type="text" placeholder="Enter client name" />
//               )}
//             />
//             {errors.clientName && <p className="text-danger">{errors.clientName.message}</p>}
//           </FormGroup>

//           {/* Contact Number */}
//           <FormGroup>
//             <Label for="contactNumber">Contact Number</Label>
//             <Controller
//               name="contactNumber"
//               control={control}
//               rules={{ required: 'Contact number is required' }}
//               render={({ field }) => (
//                 <Input {...field} type="tel" placeholder="Enter contact number" />
//               )}
//             />
//             {errors.contactNumber && <p className="text-danger">{errors.contactNumber.message}</p>}
//           </FormGroup>

//           {/* Email */}
//           <FormGroup>
//             <Label for="email">Email</Label>
//             <Controller
//               name="email"
//               control={control}
//               rules={{
//                 required: 'Email is required',
//                 pattern: {
//                   value: /^\S+@\S+$/i,
//                   message: 'Invalid email address'
//                 }
//               }}
//               render={({ field }) => (
//                 <Input {...field} type="email" placeholder="Enter email address" />
//               )}
//             />
//             {errors.email && <p className="text-danger">{errors.email.message}</p>}
//           </FormGroup>

//           {/* Address */}
//           <FormGroup>
//             <Label for="address">Address</Label>
//             <Controller
//               name="address"
//               control={control}
//               render={({ field }) => (
//                 <Input {...field} type="textarea" placeholder="Enter client address" />
//               )}
//             />
//           </FormGroup>

//           {/* Preferred Language or Communication Style */}
//           <FormGroup>
//             <Label for="preferredLanguage">Preferred Language/Communication Style</Label>
//             <Controller
//               name="preferredLanguage"
//               control={control}
//               render={({ field }) => (
//                 <Input {...field} type="text" placeholder="e.g., English, Hindi, Email, Phone" />
//               )}
//             />
//           </FormGroup>

//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//         </>
    
//   );
// };

// export default ClientInfoForm;



// ============================ Venue & Location

// import React from 'react';
// import {
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Card,
//   CardBody,
//   Row,
//   Col
// } from 'reactstrap';
// import { useForm, Controller } from 'react-hook-form';

// const VenueForm = () => {
//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors }
//   } = useForm({
//     defaultValues: {
//       venueName: '',
//       capacity: '',
//       seating: '',
//       indoorOutdoor: '',
//       backupPlan: ''
//     }
//   });

//   const indoorOutdoor = watch('indoorOutdoor');

//   const onSubmit = (data) => {
//     console.log('Venue Data:', data);
//   };

//   return (
//     <Card className="p-4">
//       <CardBody>
//         <h4 className="mb-4">Venue & Location</h4>
//         <Form onSubmit={handleSubmit(onSubmit)}>
//           {/* Venue Name / Area */}
//           <FormGroup>
//             <Label for="venueName">Venue Name / Area</Label>
//             <Controller
//               name="venueName"
//               control={control}
//               rules={{ required: 'Venue name or area is required' }}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="text"
//                   placeholder="e.g., Banquet Hall, Garden, Poolside"
//                 />
//               )}
//             />
//             {errors.venueName && <p className="text-danger">{errors.venueName.message}</p>}
//           </FormGroup>

//           {/* Venue Capacity */}
//           <FormGroup>
//             <Label for="capacity">Venue Capacity</Label>
//             <Controller
//               name="capacity"
//               control={control}
//               rules={{
//                 required: 'Capacity is required',
//                 min: { value: 1, message: 'Must be at least 1' }
//               }}
//               render={({ field }) => (
//                 <Input {...field} type="number" placeholder="Enter maximum capacity" />
//               )}
//             />
//             {errors.capacity && <p className="text-danger">{errors.capacity.message}</p>}
//           </FormGroup>

//           {/* Seating Arrangement */}
//           <FormGroup>
//             <Label for="seating">Seating Arrangement</Label>
//             <Controller
//               name="seating"
//               control={control}
//               rules={{ required: 'Seating arrangement is required' }}
//               render={({ field }) => (
//                 <Input {...field} type="select">
//                   <option value="">-- Select Arrangement --</option>
//                   <option>Banquet</option>
//                   <option>Theater</option>
//                   <option>Round Tables</option>
//                   <option>U-Shape</option>
//                   <option>Classroom</option>
//                 </Input>
//               )}
//             />
//             {errors.seating && <p className="text-danger">{errors.seating.message}</p>}
//           </FormGroup>

//           {/* Indoor/Outdoor */}
//           <FormGroup>
//             <Label for="indoorOutdoor">Indoor / Outdoor</Label>
//             <Controller
//               name="indoorOutdoor"
//               control={control}
//               rules={{ required: 'Please select Indoor or Outdoor' }}
//               render={({ field }) => (
//                 <Input {...field} type="select">
//                   <option value="">-- Select Option --</option>
//                   <option>Indoor</option>
//                   <option>Outdoor</option>
//                 </Input>
//               )}
//             />
//             {errors.indoorOutdoor && <p className="text-danger">{errors.indoorOutdoor.message}</p>}
//           </FormGroup>

//           {/* Conditional Weather Backup Plan */}
//           {indoorOutdoor === 'Outdoor' && (
//             <FormGroup>
//               <Label for="backupPlan">Backup Plan for Weather</Label>
//               <Controller
//                 name="backupPlan"
//                 control={control}
//                 rules={{
//                   required: 'Backup plan is required for outdoor venues'
//                 }}
//                 render={({ field }) => (
//                   <Input {...field} type="text" placeholder="e.g., Indoor backup" />
//                 )}
//               />
//               {errors.backupPlan && <p className="text-danger">{errors.backupPlan.message}</p>}
//             </FormGroup>
//           )}

//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// export default VenueForm;


// ============ logistic ====================

// import React from 'react';
// import {
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Card,
//   CardBody
// } from 'reactstrap';
// import { useForm, Controller } from 'react-hook-form';

// const LogisticsForm = () => {
//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors }
//   } = useForm({
//     defaultValues: {
//       catering: '',
//       decoration: '',
//       soundLighting: '',
//       stageSetup: '',
//       powerBackup: '',
//       transportParking: '',
//       accommodation: ''
//     }
//   });

//   const onSubmit = (data) => {
//     console.log('Logistics & Services Submitted:', data);
//   };

//   return (
//     <Card className="p-4">
//       <CardBody>
//         <h4 className="mb-4">Logistics & Services</h4>
//         <Form onSubmit={handleSubmit(onSubmit)}>
//           {/* Catering Requirements */}
//           <FormGroup>
//             <Label for="catering">Catering Requirements</Label>
//             <Controller
//               name="catering"
//               control={control}
//               rules={{ required: 'Please specify catering needs' }}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="Cuisine types, Veg/Non-Veg, Buffet/Plated"
//                 />
//               )}
//             />
//             {errors.catering && <p className="text-danger">{errors.catering.message}</p>}
//           </FormGroup>

//           {/* Decoration Theme */}
//           <FormGroup>
//             <Label for="decoration">Decoration Theme / Details</Label>
//             <Controller
//               name="decoration"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="Describe decoration theme or specific elements"
//                 />
//               )}
//             />
//           </FormGroup>

//           {/* Sound & Lighting */}
//           <FormGroup>
//             <Label for="soundLighting">Sound & Lighting Needs</Label>
//             <Controller
//               name="soundLighting"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="Microphones, DJ, lighting types, etc."
//                 />
//               )}
//             />
//           </FormGroup>

//           {/* Stage/Setup Requirements */}
//           <FormGroup>
//             <Label for="stageSetup">Stage / Setup Requirements</Label>
//             <Controller
//               name="stageSetup"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="Platform, backdrop, podium, etc."
//                 />
//               )}
//             />
//           </FormGroup>

//           {/* Power Backup Required */}
//           <FormGroup>
//             <Label for="powerBackup">Power Backup Required</Label>
//             <Controller
//               name="powerBackup"
//               control={control}
//               rules={{ required: 'Select Yes or No' }}
//               render={({ field }) => (
//                 <Input {...field} type="select">
//                   <option value="">-- Select --</option>
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </Input>
//               )}
//             />
//             {errors.powerBackup && <p className="text-danger">{errors.powerBackup.message}</p>}
//           </FormGroup>

//           {/* Transportation/Parking Needs */}
//           <FormGroup>
//             <Label for="transportParking">Transportation / Parking Needs</Label>
//             <Controller
//               name="transportParking"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="Valet, shuttle service, guest parking, etc."
//                 />
//               )}
//             />
//           </FormGroup>

//           {/* Accommodation Requirements */}
//           <FormGroup>
//             <Label for="accommodation">Accommodation Requirements</Label>
//             <Controller
//               name="accommodation"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="For multi-day weddings or corporate stays"
//                 />
//               )}
//             />
//           </FormGroup>

//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// export default LogisticsForm;


// ================= Vendors & Coordination

// import React, { Fragment, useRef, useState, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import {
//   Row,
//   Col,
//   Label,
//   Input,
//   Button,
//   Spinner,
//   FormFeedback,
// } from "reactstrap";
// import { Toast } from "primereact/toast";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { ArrowRight } from "react-feather";

// const VendorsCoordination = ({ stepper }) => {
//   const toast = useRef(null);
//   const MySwal = withReactContent(Swal);
//   const [loadinng, setLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       vendorList: "",
//       vendorContacts: "",
//       arrivalTime: "",
//       duration: "",
//       paymentStatus: "",
//     },
//   });

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       console.log("Vendors & Coordination Data Submitted:", data);

//       toast.current.show({
//         severity: "success",
//         summary: "Success",
//         detail: "Vendor details saved successfully!",
//         life: 2000,
//       });

//       setTimeout(() => {
//         stepper.next();
//       }, 2000);
//     } catch (error) {
//       console.error("Submission Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Fragment>
//       <Toast ref={toast} />

//       <div className="content-header">
//         <h5 className="mb-0">Vendors & Coordination</h5>
//         <small className="text-muted">
//           Enter details of all associated vendors.
//         </small>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Row>
//           <Col md="6" className="mb-1">
//             <Label className="form-label">Vendor List *</Label>
//             <Controller
//               name="vendorList"
//               control={control}
//               rules={{ required: "Vendor List is required" }}
//               render={({ field }) => (
//                 <Input
//                   type="textarea"
//                   placeholder="e.g., Catering, Photography, DJ, Decorators"
//                   invalid={!!errors.vendorList}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.vendorList && (
//               <FormFeedback>{errors.vendorList.message}</FormFeedback>
//             )}
//           </Col>

//           <Col md="6" className="mb-1">
//             <Label className="form-label">Vendor Contact Details *</Label>
//             <Controller
//               name="vendorContacts"
//               control={control}
//               rules={{ required: "Contact details are required" }}
//               render={({ field }) => (
//                 <Input
//                   type="textarea"
//                   placeholder="Names, numbers, emails of vendors"
//                   invalid={!!errors.vendorContacts}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.vendorContacts && (
//               <FormFeedback>{errors.vendorContacts.message}</FormFeedback>
//             )}
//           </Col>
//         </Row>

//         <Row>
//           <Col md="6" className="mb-1">
//             <Label className="form-label">Vendor Arrival Time *</Label>
//             <Controller
//               name="arrivalTime"
//               control={control}
//               rules={{ required: "Arrival time is required" }}
//               render={({ field }) => (
//                 <Input type="time" invalid={!!errors.arrivalTime} {...field} />
//               )}
//             />
//             {errors.arrivalTime && (
//               <FormFeedback>{errors.arrivalTime.message}</FormFeedback>
//             )}
//           </Col>

//           <Col md="6" className="mb-1">
//             <Label className="form-label">Vendor Duration *</Label>
//             <Controller
//               name="duration"
//               control={control}
//               rules={{ required: "Duration is required" }}
//               render={({ field }) => (
//                 <Input
//                   type="text"
//                   placeholder="e.g., 4 hours, Full day"
//                   invalid={!!errors.duration}
//                   {...field}
//                 />
//               )}
//             />
//             {errors.duration && (
//               <FormFeedback>{errors.duration.message}</FormFeedback>
//             )}
//           </Col>
//         </Row>

//         <Row>
//           <Col md="12" className="mb-1">
//             <Label className="form-label">Vendor Payments/Contracts Status</Label>
//             <Controller
//               name="paymentStatus"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   type="textarea"
//                   placeholder="e.g., Caterer paid 50%, Photographer contract signed"
//                   {...field}
//                 />
//               )}
//             />
//           </Col>
//         </Row>

//         <div className="d-flex justify-content-end">
//           <Button type="submit" color="primary" disabled={loadinng}>
//             {loadinng ? (
//               <>
//                 <span>Loading... </span>
//                 <Spinner size="sm" />
//               </>
//             ) : (
//               <>
//                 <span className="align-middle d-sm-inline-block d-none">
//                   Next
//                 </span>
//                 <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
//               </>
//             )}
//           </Button>
//         </div>
//       </form>
//     </Fragment>
//   );
// };

// export default VendorsCoordination;



// import React from 'react';
// import {
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Card,
//   CardBody
// } from 'reactstrap';
// import { useForm, Controller } from 'react-hook-form';

// const LogisticsForm = () => {
//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors }
//   } = useForm({
//     defaultValues: {
//       catering: '',
//       decoration: '',
//       soundLighting: '',
//       stageSetup: '',
//       powerBackup: '',
//       transportParking: '',
//       accommodation: ''
//     }
//   });

//   const onSubmit = (data) => {
//     console.log('Logistics & Services Submitted:', data);
//   };

//   return (
//     <Card className="p-4">
//       <CardBody>
//         <h4 className="mb-4">Logistics & Services</h4>
//         <Form onSubmit={handleSubmit(onSubmit)}>
//           {/* Catering Requirements */}
//           <FormGroup>
//             <Label for="catering">Catering Requirements</Label>
//             <Controller
//               name="catering"
//               control={control}
//               rules={{ required: 'Please specify catering needs' }}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="Cuisine types, Veg/Non-Veg, Buffet/Plated"
//                 />
//               )}
//             />
//             {errors.catering && <p className="text-danger">{errors.catering.message}</p>}
//           </FormGroup>

//           {/* Decoration Theme */}
//           <FormGroup>
//             <Label for="decoration">Decoration Theme / Details</Label>
//             <Controller
//               name="decoration"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="Describe decoration theme or specific elements"
//                 />
//               )}
//             />
//           </FormGroup>

//           {/* Sound & Lighting */}
//           <FormGroup>
//             <Label for="soundLighting">Sound & Lighting Needs</Label>
//             <Controller
//               name="soundLighting"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="Microphones, DJ, lighting types, etc."
//                 />
//               )}
//             />
//           </FormGroup>

//           {/* Stage/Setup Requirements */}
//           <FormGroup>
//             <Label for="stageSetup">Stage / Setup Requirements</Label>
//             <Controller
//               name="stageSetup"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="Platform, backdrop, podium, etc."
//                 />
//               )}
//             />
//           </FormGroup>

//           {/* Power Backup Required */}
//           <FormGroup>
//             <Label for="powerBackup">Power Backup Required</Label>
//             <Controller
//               name="powerBackup"
//               control={control}
//               rules={{ required: 'Select Yes or No' }}
//               render={({ field }) => (
//                 <Input {...field} type="select">
//                   <option value="">-- Select --</option>
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </Input>
//               )}
//             />
//             {errors.powerBackup && <p className="text-danger">{errors.powerBackup.message}</p>}
//           </FormGroup>

//           {/* Transportation/Parking Needs */}
//           <FormGroup>
//             <Label for="transportParking">Transportation / Parking Needs</Label>
//             <Controller
//               name="transportParking"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="Valet, shuttle service, guest parking, etc."
//                 />
//               )}
//             />
//           </FormGroup>

//           {/* Accommodation Requirements */}
//           <FormGroup>
//             <Label for="accommodation">Accommodation Requirements</Label>
//             <Controller
//               name="accommodation"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   {...field}
//                   type="textarea"
//                   placeholder="For multi-day weddings or corporate stays"
//                 />
//               )}
//             />
//           </FormGroup>

//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// export default LogisticsForm;


import React, { Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Label,
  Input,
  Button,
  FormGroup,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";

function AddEventTypes() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    

    try {
      const res = await useJwt.VendorType(data);
      console.log(res);
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <Fragment>
      <Card>
        <CardBody>
          <CardTitle>
            <CardText>Create Vendor Types</CardText>
          </CardTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="12" className="mb-1">
                <Label for="typeName">Vendor Type</Label>

                <Controller
                  name="typeName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event Type is required" }}
                  render={({ field }) => (
                    <Input
                      id="typeName"
                      type="text"
                      placeholder="Enter Vendor type"
                      invalid={!!errors.typeName}
                      {...field}
                    />
                  )}
                />

                {errors.typeName && (
                  <p style={{ color: "red" }}>{errors.typeName.message}</p>
                )}
              </Col>
              <Col sm="12">
                <Label for="description">Vendor Type Description</Label>

                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event Type Description is required" }}
                  render={({ field }) => (
                    <Input
                      id="description"
                      type="textarea"
                      rows="4"
                      placeholder="Enter Vendor type description"
                      invalid={!!errors.description}
                      {...field}
                    />
                  )}
                />

                {errors.description && (
                  <p style={{ color: "red" }}>
                    {errors.description.message}
                  </p>
                )}
              </Col>
            </FormGroup>

            <Button type="submit" color="primary">
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default AddEventTypes;




// import React from 'react';
// import {
//   Form, FormGroup, Label, Input, Button, FormFeedback,
// } from 'reactstrap';
// import { useForm } from 'react-hook-form';

// const EventForm = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = data => {
//     console.log('Form submitted:', data);
//   };

//   return (
//     <Form onSubmit={handleSubmit(onSubmit)}>

//       <h4 className="mt-4">📊 Financial Details</h4>

//       <FormGroup>
//         <Label for="estimatedBudget">Estimated Budget</Label>
//         <Input
//           id="estimatedBudget"
//           type="number"
//           invalid={!!errors.estimatedBudget}
//           {...register('estimatedBudget', { required: 'Estimated Budget is required' })}
//         />
//         <FormFeedback>{errors.estimatedBudget?.message}</FormFeedback>
//       </FormGroup>

//       <FormGroup>
//         <Label for="clientQuotation">Client Quotation</Label>
//         <Input
//           id="clientQuotation"
//           type="number"
//           invalid={!!errors.clientQuotation}
//           {...register('clientQuotation', { required: 'Client Quotation is required' })}
//         />
//         <FormFeedback>{errors.clientQuotation?.message}</FormFeedback>
//       </FormGroup>

//       <FormGroup>
//         <Label for="advanceReceived">Advance Received</Label>
//         <Input
//           id="advanceReceived"
//           type="number"
//           invalid={!!errors.advanceReceived}
//           {...register('advanceReceived', { required: 'Advance Received is required' })}
//         />
//         <FormFeedback>{errors.advanceReceived?.message}</FormFeedback>
//       </FormGroup>

//       <FormGroup>
//         <Label for="paymentSchedule">Payment Schedule</Label>
//         <Input
//           id="paymentSchedule"
//           type="textarea"
//           invalid={!!errors.paymentSchedule}
//           {...register('paymentSchedule', { required: 'Payment Schedule is required' })}
//         />
//         <FormFeedback>{errors.paymentSchedule?.message}</FormFeedback>
//       </FormGroup>

//       <FormGroup>
//         <Label for="discountsApplied">Discounts or Promotions Applied</Label>
//         <Input
//           id="discountsApplied"
//           type="textarea"
//           {...register('discountsApplied')}
//         />
//       </FormGroup>

//       <FormGroup>
//         <Label for="finalInvoiceAmount">Final Invoice Amount</Label>
//         <Input
//           id="finalInvoiceAmount"
//           type="number"
//           invalid={!!errors.finalInvoiceAmount}
//           {...register('finalInvoiceAmount', { required: 'Final Invoice Amount is required' })}
//         />
//         <FormFeedback>{errors.finalInvoiceAmount?.message}</FormFeedback>
//       </FormGroup>

//       <h4 className="mt-5">📄 Legal & Documentation</h4>

//       <FormGroup>
//         <Label for="eventContract">Event Contract</Label>
//         <Input
//           id="eventContract"
//           type="textarea"
//           {...register('eventContract')}
//         />
//       </FormGroup>

//       <FormGroup>
//         <Label for="permitsRequired">Permits Required (e.g., fireworks, live music)</Label>
//         <Input
//           id="permitsRequired"
//           type="textarea"
//           {...register('permitsRequired')}
//         />
//       </FormGroup>

//       <FormGroup>
//         <Label for="insurance">Insurance (if applicable)</Label>
//         <Input
//           id="insurance"
//           type="textarea"
//           {...register('insurance')}
//         />
//       </FormGroup>

//       <FormGroup>
//         <Label for="idProofs">ID Proofs or Documents Submitted</Label>
//         <Input
//           id="idProofs"
//           type="textarea"
//           {...register('idProofs')}
//         />
//       </FormGroup>

//       <Button type="submit" color="primary">Submit</Button>
//     </Form>
//   );
// };

// export default EventForm;
