// // ** React Imports
// import { Fragment, useState } from 'react'

// // ** Reactstrap Imports
// import {
//   Row,
//   Col,
//   Card,
//   Modal,
//   Label,
//   Input,
//   Button,
//   CardBody,
//   CardText,
//   CardTitle,
//   ModalBody,
//   InputGroup,
//   ModalHeader,
//   FormFeedback,
//   InputGroupText,
//   Form,
  
// } from 'reactstrap'
// import Select from 'react-select'
// // ** Third Party Components
// import classnames from 'classnames'
// import Cleave from 'cleave.js/react'
// import { Check, X, CreditCard } from 'react-feather'
// import { useForm, Controller } from 'react-hook-form'





// const AddCardExample = ({show,setShow}) => {
//   // ** States
//   const [cardType, setCardType] = useState('')

//   // ** Hooks
//   const {
//     reset,
//     control,
//     setError,
//     clearErrors,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({  })

//   const onSubmit = data => {
//   }

//   return (
//     <Fragment>
     
//       <Modal
//         isOpen={show}
//         toggle={() => setShow(!show)}
//         className='modal-dialog-centered'
//         onClosed={() => setCardType('')}
//       >
//         <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
//         <ModalBody className='px-sm-5 mx-50 pb-5'>
//           <h1 className='text-center mb-1'>Add Product Category</h1>


//           {/* <Row tag='form' className='gy-1 gx-2 mt-75' onSubmit={handleSubmit(onSubmit)}> */}
            
//           <Form>
//           <Row>
//             <Col md='6' sm='12' className='mb-1'>
//               <Label className='form-label' for='nameMulti'>
//                 First Name
//               </Label>
//               <Input type='text' name='name' id='nameMulti' placeholder='First Name' />
//             </Col>
//             <Col md='6' sm='12' className='mb-1'>
//               <Label className='form-label' for='lastNameMulti'>
//                 Last Name
//               </Label>
//               <Input type='text' name='lastname' id='lastNameMulti' placeholder='Last Name' />
//             </Col>
//             <Col md='6' sm='12' className='mb-1'>
//               <Label className='form-label' for='cityMulti'>
//                 City
//               </Label>
//               <Input type='text' name='city' id='cityMulti' placeholder='City' />
//             </Col>
//             <Col md='6' sm='12' className='mb-1'>
//               <Label className='form-label' for='CountryMulti'>
//                 Country
//               </Label>
//               <Input type='text' name='country' id='CountryMulti' placeholder='Country' />
//             </Col>
//             <Col md='6' sm='12' className='mb-1'>
//               <Label className='form-label' for='CompanyMulti'>
//                 Company
//               </Label>
//               <Input type='text' name='company' id='CompanyMulti' placeholder='Company' />
//             </Col>
//             <Col md='6' sm='12' className='mb-1'>
//               <Label className='form-label' for='EmailMulti'>
//                 Email
//               </Label>
//               <Input type='email' name='Email' id='EmailMulti' placeholder='Email' />
//             </Col>
//             <Col sm='12'>
//               <div className='d-flex'>
//                 <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
//                   Submit
//                 </Button>
//                 <Button outline color='secondary'   onClick={() => {
//                   setShow(!show)
//                   reset()
//                 }} type='reset'>
//                   Reset
//                 </Button>
//               </div>
//             </Col>
//           </Row>
//         </Form>

          


           
//           {/* </Row> */}
//         </ModalBody>
//       </Modal>
//     </Fragment>
//   )
// }

// export default AddCardExample





// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Label,
  Input,
  Modal,
  Button,
  CardBody,
  CardText,
  CardTitle,
  ModalBody,
  ModalHeader,
  FormFeedback
} from 'reactstrap'

// ** Third Party Components
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { Home, Check, X, Briefcase } from 'react-feather'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const defaultValues = {
  lastName: '',
  firstName: ''
}

const countryOptions = [
  { value: 'uk', label: 'UK' },
  { value: 'usa', label: 'USA' },
  { value: 'france', label: 'France' },
  { value: 'russia', label: 'Russia' },
  { value: 'canada', label: 'Canada' }
]

const AddNewAddress = ({show,setShow}) => {
  // ** States
//   const [show, setShow] = useState(false)

  // ** Hooks
  const {
    reset,
    control,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      setShow(false)
      reset()
    } else {
      setError('firstName', {
        type: 'manual'
      })
      setError('lastName', {
        type: 'manual'
      })
    }
  }

  const onDiscard = () => {
    clearErrors()
    setShow(false)
    reset()
  }

  return (
    <Fragment>
   
      <Modal
        isOpen={show}
        onClosed={onDiscard}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='pb-5 px-sm-4 mx-50'>
          <h1 className='address-title text-center mb-1'>Add New Customer</h1>
          <p className='address-subtitle text-center mb-2 pb-75'>Add address for billing address</p>
          <Row tag='form' className='gy-1 gx-2' onSubmit={handleSubmit(onSubmit)}>
         
            <Col xs={12} md={6}>
              <Label className='form-label' for='firstName'>
                First Name
              </Label>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <Input id='firstName' placeholder='John' invalid={errors.firstName && true} {...field} />
                )}
              />
              {errors.firstName && <FormFeedback>Please enter a valid First Name</FormFeedback>}
            </Col>
            <Col xs={12} md={6}>
              <Label className='form-label' for='lastName'>
                Last Name
              </Label>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <Input id='lastName' placeholder='Doe' invalid={errors.lastName && true} {...field} />
                )}
              />
              {errors.lastName && <FormFeedback>Please enter a valid Last Name</FormFeedback>}
            </Col>
         
         
            <Col xs={12} md={6}>
              <Label className='form-label' for='firstName'>
              Phone Number
              </Label>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <Input id='firstName' placeholder='John' invalid={errors.firstName && true} {...field} />
                )}
              />
              {errors.firstName && <FormFeedback>Please enter a valid First Name</FormFeedback>}
            </Col>
            <Col xs={12} md={6}>
              <Label className='form-label' for='lastName'>
              Email              </Label>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <Input id='lastName' placeholder='Doe' invalid={errors.lastName && true} {...field} />
                )}
              />
              {errors.lastName && <FormFeedback>Please enter a valid Last Name</FormFeedback>}
            </Col>
         
            <Col xs={12}>
              <Label className='form-label' for='addressLine1'>
                Address 
              </Label>
              <Input id='addressLine1' placeholder='12, Business Park' />
            </Col>
           

            <Col xs={12} md={6}>
              <Label className='form-label' for='firstName'>
              City Name
              </Label>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <Input id='firstName' placeholder='John' invalid={errors.firstName && true} {...field} />
                )}
              />
              {errors.firstName && <FormFeedback>Please enter a valid First Name</FormFeedback>}
            </Col>
            <Col xs={12} md={6}>
              <Label className='form-label' for='lastName'>
              State Name
              </Label>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <Input id='lastName' placeholder='Doe' invalid={errors.lastName && true} {...field} />
                )}
              />
              {errors.lastName && <FormFeedback>Please enter a valid Last Name</FormFeedback>}
            </Col>

          

            <Col xs={12} md={6}>
              <Label className='form-label' for='state-province'>
              Country Name
              </Label>
              <Input id='state-province' placeholder='California' />
            </Col>
            <Col xs={12} md={6}>
              <Label className='form-label' for='zip-code'>
                Pin Code
              </Label>
              <Input id='zip-code' placeholder='99950' />
            </Col>


           
            <Col className='text-center' xs={12}>
              <Button type='submit' className='me-1 mt-2' color='primary'>
                Submit
              </Button>
              <Button type='reset' className='mt-2' color='secondary' outline onClick={onDiscard}>
                Discard
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default AddNewAddress
