// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Modal,
  Label,
  Input,
  Button,
  CardBody,
  CardText,
  CardTitle,
  ModalBody,
  InputGroup,
  ModalHeader,
  FormFeedback,
  InputGroupText,
  
} from 'reactstrap'
import Select from 'react-select'
// ** Third Party Components
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import { Check, X, CreditCard } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'

// ** Images
import jcbCC from '@src/assets/images/icons/payments/jcb-cc.png'
import amexCC from '@src/assets/images/icons/payments/amex-cc.png'
import uatpCC from '@src/assets/images/icons/payments/uatp-cc.png'
import visaCC from '@src/assets/images/icons/payments/visa-cc.png'
import dinersCC from '@src/assets/images/icons/payments/diners-cc.png'
import maestroCC from '@src/assets/images/icons/payments/maestro-cc.png'
import discoverCC from '@src/assets/images/icons/payments/discover-cc.png'
import mastercardCC from '@src/assets/images/icons/payments/mastercard-cc.png'

const cardsObj = {
  jcb: jcbCC,
  uatp: uatpCC,
  visa: visaCC,
  amex: amexCC,
  diners: dinersCC,
  maestro: maestroCC,
  discover: discoverCC,
  mastercard: mastercardCC
}

const defaultValues = {
  cardNumber: ''
}

const AddCardExample = ({show,setShow}) => {
  // ** States
  const [cardType, setCardType] = useState('')

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
    if (data.cardNumber.length) {
      clearErrors()
    } else {
      setError('cardNumber', { type: 'manual' })
    }
  }

  return (
    <Fragment>
     
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered'
        onClosed={() => setCardType('')}
      >
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Add Product Category</h1>


          <Row tag='form' className='gy-1 gx-2 mt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12}>
              <Label className='form-label'>
              Parent Category              </Label>
            <Select
              // theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              // defaultValue={colourOptions[0]}
              // options={colourOptions}
              isClearable={false}
            />
            </Col>
            <Col md={12}>
              <Label className='form-label' for='card-name'>
              Category Name
                            </Label>
              <Input id='card-name' placeholder='John Doe' />
            </Col>
          
          


            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary'>
                Submit
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  setShow(!show)
                  reset()
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default AddCardExample
