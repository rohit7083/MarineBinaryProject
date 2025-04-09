// ** React Imports
import { Fragment, useEffect, useState } from 'react'

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
  InputGroupText
} from 'reactstrap'

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

const AddCardExample = ({
    setShowQrModal,
    showQrModal,
    qr,
}) => {
  // ** States
  const [cardType, setCardType] = useState('')
// {{debugger}}
  // ** Hooks
  const {
    reset,
    control,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  useEffect(()=>{

  },[])
  

  return (
    <Fragment>
      
      
      <Modal
        isOpen={showQrModal}
       
        className='modal-dialog-centered'
       
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setShowQrModal(!showQrModal)}></ModalHeader> */}
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Scan QR Code</h1>
          {/* <p className='text-center'>Add card for future billing</p> */}
          <Row tag='form' className='gy-1 gx-2 mt-75'>
            {/* <Col xs={12}> */}
             

                  {qr && <img src={`data:image/png;base64,${qr}`} alt="QR Code" />}

            {/* </Col> */}
          
            <Col className='text-center mt-1' xs={12}>
              <Button type='submit' id="qr-ssubmit" className='me-1' color='primary'>
                Submit
              </Button>
             
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default AddCardExample
