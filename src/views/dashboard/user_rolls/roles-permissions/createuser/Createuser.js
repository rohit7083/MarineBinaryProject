// // ** React Imports
// import { Fragment, useState } from 'react'
// import { Link } from 'react-router-dom'

// // ** Reactstrap Imports
// import {
//   Row,
//   Col,
//   Card,
//   Label,
//   Input,
//   Table,
//   Form,
//   InputGroup,
//   InputGroupText,

//   Modal,
//   Button,
//   CardBody,
//   ModalBody,
//   ModalHeader,
//   FormFeedback,
//   UncontrolledTooltip
// } from 'reactstrap'
// import { User, Mail, Smartphone, Lock } from "react-feather";
// import { Controller, useForm } from "react-hook-form";

// // ** Third Party Components
// import { Copy, Info } from 'react-feather'

// // ** Custom Components
// import AvatarGroup from '@components/avatar-group'

// // ** FAQ Illustrations
// import illustration from '@src/assets/images/illustration/faq-illustrations.svg'

// // ** Avatars
// import avatar1 from '@src/assets/images/avatars/1.png'
// import avatar2 from '@src/assets/images/avatars/2.png'
// import avatar3 from '@src/assets/images/avatars/3.png'
// import avatar4 from '@src/assets/images/avatars/4.png'
// import avatar5 from '@src/assets/images/avatars/5.png'
// import avatar6 from '@src/assets/images/avatars/6.png'
// import avatar7 from '@src/assets/images/avatars/7.png'
// import avatar8 from '@src/assets/images/avatars/8.png'
// import avatar9 from '@src/assets/images/avatars/9.png'
// import avatar10 from '@src/assets/images/avatars/10.png'
// import avatar11 from '@src/assets/images/avatars/11.png'
// import avatar12 from '@src/assets/images/avatars/12.png'

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
   
//     ]
//   }
// ]
// const countryCodes = [
//     { code: '+1', country: 'USA/Canada' },
//     { code: '+91', country: 'India' },
//     { code: '+44', country: 'UK' },
//     { code: '+61', country: 'Australia' },
//     { code: '+81', country: 'Japan' },
//     { code: '+49', country: 'Germany' }
//   ]
  
// const rolesArr = [
//   'User Management',
//   'Content Management',
//   'Disputes Management',
//   'Database Management',
//   'Financial Management',
//   'Reporting',
//   'API Control',
//   'Repository Management',
//   'Payroll'
// ]

// const RoleCards = () => {
//   // ** States
//   const [show, setShow] = useState(false)
//   const [modalType, setModalType] = useState('Add New')

//   // ** Hooks
//   const {
//     reset,
//     control,
//     setError,
//     setValue,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({ defaultValues: { roleName: '' } })

//   const onSubmit = data => {
//     if (data.roleName.length) {
//       setShow(false)
//     } else {
//       setError('roleName', {
//         type: 'manual'
//       })
//     }
//   }

//   const onReset = () => {
//     setShow(false)
//     reset({ roleName: '' })
//   }

//   const handleModalClosed = () => {
//     setModalType('Add New')
//     setValue('roleName')
//   }

//   return (
//     <Fragment>
//       <Row className='px-2 mt-1'>
    
             
//                   <Button
//                     color='primary'
//                     className='text-nowrap mb-1'
//                     onClick={() => {
//                       setModalType('Add New')
//                       setShow(true)
//                     }}
//                   >
//                    Create User +
//                   </Button>
              
          
//       </Row>
//       <Modal
//         isOpen={show}
//         onClosed={handleModalClosed}
//         toggle={() => setShow(!show)}
//         className='modal-dialog-centered modal-lg'
//       >
//         <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
//         <ModalBody className='px-5 pb-5'>
//           <div className='text-center mb-4'>
//             <h1>{modalType} Add Users</h1>
//             <p>Add new user</p>
//           </div>
//           <Form onSubmit={handleSubmit(onsubmit)}>
//           <Row className="mb-1">
//             <Label sm="3" for="nameIcons">
//               First Name
//             </Label>
//             <Col sm="9">
//               <InputGroup className="input-group-merge">
//                 <InputGroupText>
//                   <User size={15} />
//                 </InputGroupText>

//                 <Controller
//                   name="firstName"
//                   control={control}
//                   defaultValue=""
//                   rules={{ required: "First Name is Required" }}
//                   render={({ field, fieldState: { error } }) => (
//                     <>
//                       <Input type="text" placeholder="First Name" {...field} />
//                       {error && <p className="text-danger">{error.message}</p>}
//                     </>
//                   )}
//                 />
//               </InputGroup>
//             </Col>
//           </Row>

//           <Row className="mb-1">
//             <Label sm="3" for="nameIcons">
//               Last Name
//             </Label>
//             <Col sm="9">
//               <InputGroup className="input-group-merge">
//                 <InputGroupText>
//                   <User size={15} />
//                 </InputGroupText>

//                 <Controller
//                   name="lastName"
//                   control={control}
//                   defaultValue=""
//                   rules={{ required: "Last Name is Required" }}
//                   render={({ field, fieldState: { error } }) => (
//                     <>
//                       <Input type="text" placeholder="Last Name" {...field} />
//                       {error && <p className="text-danger">{error.message}</p>}
//                     </>
//                   )}
//                 />
//               </InputGroup>
//             </Col>
//           </Row>
        

//           <Row className="mb-1">
//             <Label sm="3" for="EmailIcons">
//               Email
//             </Label>
//             <Col sm="9">
//               <InputGroup className="input-group-merge">
//                 <InputGroupText>
//                   <Mail size={15} />
//                 </InputGroupText>

//                 <Controller
//                   name="emailId"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Email is required",
//                     pattern: {
//                       value:
//                         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                       message: "Invalid email address",
//                     },
//                   }}
//                   render={({ field, fieldState: { error } }) => (
//                     <>
//                       <Input
//                         type="email"
//                         id="email"
//                         placeholder="Enter Email"
//                         {...field}
//                       />
//                       {error && <p className="text-danger">{error.message}</p>}
//                     </>
//                   )}
//                 />
//               </InputGroup>
//             </Col>
//           </Row>

//           <Row className="mb-1">
//             <Label sm="3" for="mobileIcons">
//               Mobile
//             </Label>
//             <Col sm="9">
//               <InputGroup className="input-group-merge">
//                 <InputGroupText>
//                   <Smartphone size={15} />
//                 </InputGroupText>
//                 <Controller
//                   name="mobileNumber"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Mobile number is required",
//                     pattern: {
//                       value: /^[0-9]{10}$/,
//                       message: "Invalid mobile number",
//                     },
//                   }}
//                   render={({ field, fieldState: { error } }) => (
//                     <>
//                       <Input
//                         type="tel"
//                         id="mobileNumber"
//                         placeholder="Enter Mobile"
//                         {...field}
//                       />
//                       {error && <p className="text-danger">{error.message}</p>}
//                     </>
//                   )}
//                 />{" "}
//               </InputGroup>
//             </Col>
//           </Row>

//           <Row className="mb-1">
//             <Label sm="3" for="passwordIcons">
//               Password
//             </Label>
//             <Col sm="9">
//               <InputGroup className="input-group-merge">
//                 <InputGroupText>
//                   <Lock size={15} />
//                 </InputGroupText>
//                 <Controller
//                   name="password"
//                   control={control}
//                   defaultValue=""
//                   rules={{
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Password must be at least 6 characters long",
//                     },
//                   }}
//                   render={({ field, fieldState: { error } }) => (
//                     <>
//                       <Input
//                         type="password"
//                         id="password"
//                         placeholder="Password"
//                         {...field}
//                       />
//                       {error && <p className="text-danger">{error.message}</p>}
//                     </>
//                   )}
//                 />{" "}
//               </InputGroup>
//             </Col>
//           </Row>

//           <Row className="mb-1">
//             <Col md={{ size: 9, offset: 3 }}>
//               <div className="form-check">
//                 <Controller
//                   name="rememberMe"
//                   control={control}
//                   defaultValue={false}
//                   render={({ field }) => (
//                     <Input
//                       type="checkbox"
//                       id="rememberMe"
//                       checked={field.value}
//                       onChange={(e) => field.onChange(e.target.checked)}
//                     />
//                   )}
//                 />
//                 <Label for="rememberMe">Remember Me</Label>
//               </div>
//             </Col>
//           </Row>
//           <Row>
//             <Col className="d-flex" md={{ size: 9, offset: 3 }}>
//               <Button
//                 className="me-1"
//                 color="primary"
//                 type="submit"
//                 onClick={(e) => e.preventDefault()}
//               >
//                 Submit
//               </Button>
//               <Button outline color="secondary" type="reset">
//                 Reset
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//         </ModalBody>
//       </Modal>
//     </Fragment>
//   )
// }

// export default RoleCards

import { Fragment, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from 'reactstrap';
import { User, Mail, Smartphone, Lock } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

const RoleCards = () => {
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState('Add New');

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async(data) => {
   
      console.log('Form Data:', data);
    
      try {
        const res=await useJwt.createUser(data); 
        console.log(res);
        
      } catch (error) {
        console.error(error);
      }
  };

  const handleModalClosed = () => {
    setModalType('Add New');
    reset(); // Reset form values
  };

  return (
    <Fragment>
      <Row className="px-2 mt-1">
        <Button
          color="primary"
          className="text-nowrap mb-1"
          onClick={() => {
            setModalType('Add New');
            setShow(true);
          }}
        >
          Create User +
        </Button>
      </Row>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={() => setShow(!show)} />
        <ModalBody className="px-5 pb-5">
          <div className="text-center mb-4">
            <h1>{modalType} Add Users</h1>
            <p>Add new user</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-2"> {/* Reduced margin */}
              <Label sm="3" for="firstName">
                First Name
              </Label>
              <Col sm="9">
                <InputGroup className="input-group-merge">
                  <InputGroupText>
                    <User size={15} />
                  </InputGroupText>
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'First Name is required' }}
                    render={({ field }) => (
                      <Input type="text" placeholder="First Name" {...field} />
                    )}
                  />
                </InputGroup>
                {errors.firstName && (
                  <small className="text-danger">{errors.firstName.message}</small>
                )}
              </Col>
            </Row>

            <Row className="mb-2"> {/* Reduced margin */}
              <Label sm="3" for="lastName">
                Last Name
              </Label>
              <Col sm="9">
                <InputGroup className="input-group-merge">
                  <InputGroupText>
                    <User size={15} />
                  </InputGroupText>
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Last Name is required' }}
                    render={({ field }) => (
                      <Input type="text" placeholder="Last Name" {...field} />
                    )}
                  />
                </InputGroup>
                {errors.lastName && (
                  <small className="text-danger">{errors.lastName.message}</small>
                )}
              </Col>
            </Row>

            <Row className="mb-2"> {/* Reduced margin */}
              <Label sm="3" for="emailId">
                Email
              </Label>
              <Col sm="9">
                <InputGroup className="input-group-merge">
                  <InputGroupText>
                    <Mail size={15} />
                  </InputGroupText>
                  <Controller
                    name="emailId"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: 'Invalid email address',
                      },
                    }}
                    render={({ field }) => (
                      <Input type="email" placeholder="Enter Email" {...field} />
                    )}
                  />
                </InputGroup>
                {errors.emailId && (
                  <small className="text-danger">{errors.emailId.message}</small>
                )}
              </Col>
            </Row>

            {/* <Row className="mb-2"> 
              <Label sm="3" for="mobileNumber">
                Mobile
              </Label>
              <Col sm="9">
                <InputGroup className="input-group-merge">
                  <InputGroupText>
                    <Smartphone size={15} />
                  </InputGroupText>
                  <Controller
                    name="mobileNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Invalid mobile number',
                      },
                    }}
                    render={({ field }) => (
                      <Input type="tel" placeholder="Enter Mobile" {...field} />
                    )}
                  />
                </InputGroup>
                {errors.mobileNumber && (
                  <small className="text-danger">{errors.mobileNumber.message}</small>
                )}
              </Col>
            </Row> */}




<Row className="mb-2">
  <Label sm="3" for="mobileNumber">
    Mobile
  </Label>
  <Col sm="9">
    <InputGroup className="input-group-merge">
      
      <Controller
        name="mobileNumber"
        control={control}
        defaultValue=""
        rules={{
          required: 'Mobile number is required',
          validate: (value) =>
            value && value.length >= 10 ? true : 'Invalid mobile number', // Custom validation for phone length
        }}
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            country={'us'} // Default country code
            value={value}
            onChange={(phone) => onChange(phone)}
            inputProps={{
              name: 'mobileNumber',
              required: true,
              className: 'form-control',
            }}
            containerStyle={{
              width: '100%', // Ensures it spans the full width
            }}
            inputStyle={{
              height: '38px', // Matches standard input height
              border: '1px solid #ced4da', // Matches default input border
              borderRadius: '0 .375rem .375rem 0', // Matches default border-radius
              paddingLeft: '63px', // Padding for proper spacing
              width: '100%', // Ensures consistent width
            }}
          />
        )}
      />
    </InputGroup>
    {errors.mobileNumber && (
      <small className="text-danger">{errors.mobileNumber.message}</small>
    )}
  </Col>
</Row>




            <Row className="mb-2"> {/* Reduced margin */}
              <Label sm="3" for="password">
                Password
              </Label>
              <Col sm="9">
                <InputGroup className="input-group-merge">
                  <InputGroupText>
                    <Lock size={15} />
                  </InputGroupText>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="password"
                        placeholder="Enter Password"
                        {...field}
                      />
                    )}
                  />
                </InputGroup>
                {errors.password && (
                  <small className="text-danger">{errors.password.message}</small>
                )}
              </Col>
            </Row>

            <Row>
              <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                <Button className="me-1" color="primary" type="submit">
                  Submit
                </Button>
                <Button
                  outline
                  color="secondary"
                  type="reset"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default RoleCards;
