import { Toast } from "primereact/toast";
import { Controller, useForm } from 'react-hook-form';

import { selectThemeColors } from '@utils';
import Cleave from 'cleave.js/react';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormFeedback,
  Input,
  InputGroup,
  Label,
  Row
} from 'reactstrap';

// ** Auth
import useJwt from '@src/auth/jwt/useJwt';

// ** Card Images (you'll need to import these or define the path)
const cardsObj = {
  visa: '/path/to/visa.png',
  mastercard: '/path/to/mastercard.png',
  amex: '/path/to/amex.png',
  // Add other card types as needed
}

// ** Card Type Options
const cardTypeOptions = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'discover', label: 'Discover' },
  { value: 'jcb', label: 'JCB' },
  { value: 'diners', label: 'Diners Club' },
  { value: 'maestro', label: 'Maestro' }
]

const defaultValues = {
  product: '',
  amount: '',
  cardType: null,
  newCardNumber: '',
  cardHolderName: '',
  expiryDate: '',
  newCvv: ''
}

const ExistingCustomer = () => {
  const [loading, setLoading] = useState(true)
  const [customerList, setCustomerList] = useState({ phoneOptions: [], nameOptions: [] })
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customers, setCustomers] = useState([])
  const [cardType, setCardType] = useState('')
  const toast = useRef(null);
const [isProcessing, setIsProcessing] = useState(false)

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues
  })

  // Enhanced reset function
  const resetForm = () => {
    reset(defaultValues) // Use the reset function from react-hook-form
    setCardType('')
    setSelectedCustomer(null)
    setTimeout(() => {
      Object.keys(defaultValues).forEach(key => {
        setValue(key, defaultValues[key], { shouldValidate: false })
      })
    }, 100)
  }

  const onSubmit = async (data) => {
    console.log('Form data:', data)

    if (!data.product || !data.amount) {
      alert('Please fill product and amount fields');
      return;
    }

    try {
      // Existing customer + New card
      // Extract expiry year and month from MM/YY format
      const expiryParts = data.expiryDate ? data.expiryDate.split('/') : ['', ''];
      const expiryMonth = expiryParts[0] || '';
      const expiryYear = expiryParts[1] ? `20${expiryParts[1]}` : ''; // Convert YY to YYYY

      const payload = {
        "virtualTerminalDto": {
          "product": data.product,
          "amount": parseFloat(data.amount),
          "customer": {
            "uid": selectedCustomer.uid
          }
        },
        "paymentDto": {
          "paymentMode": 1,
          "finalPayment": parseFloat(data.amount),
          "cardNumber": data.newCardNumber.replace(/\s/g, ''), 
          "cardType": data.cardType ? data.cardType.label : '',
          "cardExpiryYear": expiryYear,
          "cardExpiryMonth": expiryMonth,
          "cardCvv": data.newCvv,
          "nameOnCard": data.cardHolderName
        }
      };

      console.log('API Payload:', payload);
setIsProcessing(true) 
      const response = await useJwt.NewCustomerInTerminal(payload);

      if (response.status == 200) {
        toast.current.show({
          severity: "success",
          summary: "Payment Successful",
          detail: "Your payment has been processed successfully.",
          life: 2000,
        })
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reset the form and other states
        resetForm();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Payment Failed",
          detail: "Payment failed. Please try again.",
          life: 2000
        })
      }
    } catch (error) {
      console.error('Network Error:', error)
      toast.current.show({
        severity: "error",
        summary: "Network Error",
        detail: "Network error. Please check your connection and try again.",
        life: 2000
      })
    }finally{
      setIsProcessing(false) 
    }
  }

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true)
        const response = await useJwt.getWalkinCustomers()
        const customersData = response.data
        setSelectedCustomer(customersData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={toast} />
      <Row>
        {selectedCustomer && (
          <Col sm='12' className='mb-2'>
            <Card className='bg-secondary text-white'>
              <CardHeader>
                Fullname: {selectedCustomer.firstName} {selectedCustomer.lastName}
              </CardHeader>
              <CardBody>
                <p>Phone Number: {selectedCustomer.phoneNumber}</p>
                <p>Email Id: {selectedCustomer.emailId}</p>
                <p>Address: {selectedCustomer.address}</p>
                <p>City: {selectedCustomer.city}</p>
                <p>Country: {selectedCustomer.country}</p>
                <p>Pincode: {selectedCustomer.pinCode}</p>
              </CardBody>
            </Card>
          </Col>
        )}

        {/* Product */}
        <Col md='6' sm='12' className='mb-1'>
          <Label className='form-label' for='product'>Product</Label>
          <Controller
            name="product"
            control={control}
            defaultValue=""
            render={({ field }) => <Input type="text" id="product" placeholder="Enter Product" {...field} />}
          />
        </Col>

        {/* Amount */}
        <Col md='6' sm='12' className='mb-1'>
          <Label className='form-label' for='amount'>Amount</Label>
          <Controller
            name="amount"
            control={control}
            defaultValue=""
            render={({ field }) => <Input type="text" id="amount" placeholder="Enter Amount" {...field} />}
          />
        </Col>

        {/* Card Details */}
        <Col sm='12'>
          <h6 className='text-secondary'>Card Details</h6>
        </Col>

        {/* New Card Details */}
        <Col sm="12" className="mb-2">
          <div>
            <Row className='gy-1 gx-2'>
              {/* Card Type Dropdown */}
              <Col md={6} xs={12}>
                <Label className='form-label'>Card Type</Label>
                <Controller
                  name='cardType'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      theme={selectThemeColors}
                      className='react-select'
                      classNamePrefix='select'
                      options={cardTypeOptions}
                      isClearable={true}
                      placeholder="Select Card Type"
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption)
                        if (selectedOption) {
                          setCardType(selectedOption.value)
                        } else {
                          setCardType('')
                        }
                      }}
                    />
                  )}
                />
              </Col>

              <Col md={6} xs={12}>
                <Label className='form-label' for='credit-card'>Card Number</Label>
                <InputGroup className='input-group-merge'>
                  <Controller
                    name='newCardNumber'
                    control={control}
                    render={({ field }) => (
                      <Cleave
                        {...field}    
                        id='credit-card'
                        placeholder='1356 3215 6548 7898'
                        className={`form-control ${errors.newCardNumber ? 'is-invalid' : ''}`}
                        options={{
                          creditCard: true,
                          onCreditCardTypeChanged: type => {
                            setCardType(type)
                            // Auto-select the card type in dropdown based on card number
                            const foundCardType = cardTypeOptions.find(option => option.value === type)
                            if (foundCardType) {
                              setValue('cardType', foundCardType)
                            }
                          }
                        }}
                      />
                    )}
                  />
                  {/* {cardType !== '' && cardType !== 'unknown' && (
                    <InputGroupText className='cursor-pointer p-25'>
                      <img height='24' alt='card-type' src={cardsObj[cardType]} />
                    </InputGroupText>
                  )} */}
                </InputGroup>
                {errors.newCardNumber && (
                  <FormFeedback className='d-block'>Please enter a valid card number</FormFeedback>
                )}
              </Col>

              <Col md={6}>
                <Label className='form-label' for='card-name'>Name On Card</Label>
                <Controller
                  name='cardHolderName'
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id='card-name' placeholder='John Doe' />
                  )}
                />
              </Col>

              <Col xs={6} md={3}>
                <Label className='form-label' for='exp-date'>Exp. Date</Label>
                <Controller
                  name='expiryDate'
                  control={control}
                  render={({ field }) => (
                    <Cleave
                      {...field}
                      id='exp-date'
                      placeholder='MM/YY'
                      className='form-control'
                      options={{ delimiter: '/', blocks: [2, 2] }}
                    />
                  )}
                />
              </Col>

              <Col xs={6} md={3}>
                <Label className='form-label' for='new-cvv'>CVV</Label>
                <Controller
                  name='newCvv'
                  control={control}
                  render={({ field }) => (
                    <Cleave
                      {...field}
                      id='new-cvv'
                      placeholder='654'
                      className='form-control'
                      options={{ blocks: [3] }}
                    />
                  )}
                />
              </Col>
            </Row>
          </div>
        </Col>

        {/* Submit & Reset Buttons */}
        <Col sm='12'>
          <div className='d-flex'>
            <Button className='me-1' color='primary' type='submit'>{isProcessing ? 'Processing...' : 'Submit'}</Button>
            <Button
              outline
              color='secondary'
              type='button'
              onClick={resetForm}
            >
              Reset
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  )
}

export default ExistingCustomer