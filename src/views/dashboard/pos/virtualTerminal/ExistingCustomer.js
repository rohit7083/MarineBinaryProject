import { useForm, Controller } from 'react-hook-form'
import { Toast } from "primereact/toast";

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardBody, 
  Row, 
  Col, 
  Input, 
  Form, 
  Button, 
  Label,
  InputGroup,
  InputGroupText,
  FormFeedback
} from 'reactstrap'
import Select from 'react-select'
import Cleave from 'cleave.js/react'
import { selectThemeColors } from '@utils'
import { useEffect, useState  , useRef} from 'react'
import CardDetail from "./CardDetail"

// ** Auth
import useJwt from '@src/auth/jwt/useJwt'

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

const ExistingCustomer = () => {
  const [loading, setLoading] = useState(true)
  const [customerList, setCustomerList] = useState({ phoneOptions: [], nameOptions: [] })
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [cardOptions, setCardOptions] = useState([])
  const [showCardDetail, setShowCardDetail] = useState(false)
  const [customers, setCustomers] = useState([])
  const [cardType, setCardType] = useState('')
      const toast = useRef(null);
const [isProcessing, setIsProcessing] = useState(false)


  const defaultValues = {
  phoneNumber: null,
  customerName: null,
  product: '',
  amount: '',
  cardNumber: null,
  cvv: '',
  cardType: null,
  newCardNumber: '',
  cardHolderName: '',
  expiryDate: '',
  newCvv: ''
}

const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
  defaultValues
})



  // Enhanced reset function
  const resetForm = () => {
  reset(defaultValues)
  setCardType('')
  setTimeout(() => {
    Object.keys(defaultValues).forEach(key => {
      setValue(key, defaultValues[key], { shouldValidate: false })
    })
  }, 100)
}


  const onSubmit = async data => {
    console.log('Form data:', data)

    // Form validation
    if (!selectedCustomer) {
      alert('Please select a customer first');
      return;
    }

    if (!data.product || !data.amount) {
      alert('Please fill product and amount fields');
      return;
    }

    try {
      let payload;

      // Check if user is using existing card or adding new card
      if (!showCardDetail && data.cardNumber) {
        // Scenario 1: Existing customer + Existing card
        const selectedCardData = data.cardNumber.cardData;
        
        payload = {
          "virtualTerminalDto": {
            "product": data.product,
            "amount": parseFloat(data.amount),
            "customer": {
              "uid": selectedCustomer.uid
            }
          },
          "paymentDto": {
            "finalPayment" : parseFloat(data.amount),
            "paymentMode": 1,
            "existingCardUid": selectedCardData.uid,
            "cardCvv": data.cvv
          }
        };

      } else if (showCardDetail) {
        // Scenario 2: Existing customer + New card
        // Extract expiry year and month from MM/YY format
        const expiryParts = data.expiryDate ? data.expiryDate.split('/') : ['', ''];
        const expiryMonth = expiryParts[0] || '';
        const expiryYear = expiryParts[1] ? `20${expiryParts[1]}` : ''; // Convert YY to YYYY

        payload = {
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
            "cardNumber": data.newCardNumber.replace(/\s/g, ''), // Remove spaces
            "cardType": data.cardType ? data.cardType.label : '',
            "cardExpiryYear": expiryYear,
            "cardExpiryMonth": expiryMonth,
            "cardCvv": data.newCvv,
            "nameOnCard": data.cardHolderName
          }
        };
      } else {
        alert('Please select a card or add new card details');
        return;
      }

      console.log('API Payload:', payload);
setIsProcessing(true) 
      const response = await useJwt.NewCustomerInTerminal(payload);

      if (response.status == 200 ) {
       
    
         toast.current.show({
          severity: "success",
          summary: "Payment Successful",
          detail: "Your payment has been processed successfully.",
          life: 2000,
        })
        // Enhanced reset after successful submission
        resetForm()
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' })

      } else {
         toast.current.show({
      severity: "error", // <-- use 'error' instead of 'failed'
      summary: "Payment Failed",
      detail: "Payment failed. Please try again.",
      life: 2000
    })
        
        alert('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Network Error:', error)
     

    }finally{
       setIsProcessing(false) 
setSelectedCustomer(null)
      }
  }

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true)
        const response = await useJwt.getAllCustomers()
        const customersData = response.data.content.result
        setCustomers(customersData)

        const phoneOptions = customersData.map(customer => ({
          value: customer.phoneNumber,
          label: customer.phoneNumber,
          customerData: customer
        }))

        const nameOptions = customersData.map(customer => ({
          value: `${customer.firstName} ${customer.lastName}`,
          label: `${customer.firstName} ${customer.lastName}`,
          customerData: customer
        }))

        setCustomerList({ phoneOptions, nameOptions })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [])

  const updateCardOptions = (customer) => {
    if (customer && customer.cardPayment && customer.cardPayment.length > 0) {
      const cardOpts = customer.cardPayment.map(card => ({
        value: card.cardNumber,
        label: `${card.cardNumber} (${card.cardType || 'Unknown Type'})`,
        cardData: card // This contains the card uid and other details
      }))
      setCardOptions(cardOpts)
    } else {
      setCardOptions([])
    }
    setValue('cardNumber', null)
  }

  const handlePhoneChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedCustomer(selectedOption.customerData)
      updateCardOptions(selectedOption.customerData)
      const customerName = `${selectedOption.customerData.firstName} ${selectedOption.customerData.lastName}`
      setValue('customerName', { value: customerName, label: customerName, customerData: selectedOption.customerData })
    } else {
      setSelectedCustomer(null)
      setCardOptions([])
      setValue('customerName', null)
      setValue('cardNumber', null)
    }
  }

  const handleNameChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedCustomer(selectedOption.customerData)
      updateCardOptions(selectedOption.customerData)
      setValue('phoneNumber', { value: selectedOption.customerData.phoneNumber, label: selectedOption.customerData.phoneNumber, customerData: selectedOption.customerData })
    } else {
      setSelectedCustomer(null)
      setCardOptions([])
      setValue('phoneNumber', null)
      setValue('cardNumber', null)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={toast} />
      <Row>
        {/* Phone Number Dropdown */}
        <Col md='6' sm='12' className='mb-1'>
          <Label className='form-label'>Search Contact Number</Label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                options={customerList.phoneOptions}
                isLoading={loading}
                isClearable={true}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption)
                  handlePhoneChange(selectedOption)
                }}
              />
            )}
          />
        </Col>

        {/* Customer Name Dropdown */}
        <Col md='6' sm='12' className='mb-1'>
          <Label className='form-label'>Search Customer Name</Label>
          <Controller
            name="customerName"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                options={customerList.nameOptions}
                isLoading={loading}
                isClearable={true}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption)
                  handleNameChange(selectedOption)
                }}
              />
            )}
          />
        </Col>

        {/* Customer Details Card */}
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
  <Col md="6" sm="12" className="mb-1">
    <Label className="form-label" for="product">
      Product <span className="text-danger">*</span>
    </Label>
    <Controller
      name="product"
      control={control}
      rules={{
        required: 'Product is required',
        minLength: { value: 2, message: 'Product name must be at least 2 characters' },
        maxLength: { value: 150, message: 'Product name cannot exceed 150 characters' },
        pattern: { value: /^[a-zA-Z0-9\s\-.'/&()]+$/, message: 'Product name contains invalid characters' },
        validate: { trimmed: v => (v === v.trim() ? true : 'Remove extra spaces') }
      }}
      render={({ field }) => (
        <Input
          type="text"
          id="product"
          placeholder="Enter Product"
          {...field}
          value={field.value ? field.value.trimStart() : ''}
          onChange={e => field.onChange(e.target.value)}
          invalid={!!errors.product}
        />
      )}
    />
    {errors.product && <FormFeedback>{errors.product.message}</FormFeedback>}
  </Col>

  {/* Amount */}
  <Col md="6" sm="12" className="mb-1">
    <Label className="form-label" for="amount">
      Amount <span className="text-danger">*</span>
    </Label>
    <Controller
      name="amount"
      control={control}
      rules={{
        required: 'Amount is required',
        pattern: { value: /^(?!0\d)\d+(\.\d{1,2})?$/, message: 'Please enter a valid amount (up to 2 decimals)' },
        min: { value: 1, message: 'Amount must be greater than 0' },
        max: { value: 1000000, message: 'Amount cannot exceed 1,000,000' }
      }}
      render={({ field }) => (
        <Input
          type="number"
          step="0.01"
          min="1"
          max="1000000"
          id="amount"
          placeholder="Enter Amount"
          {...field}
          value={field.value || ''}
          invalid={!!errors.amount}
        />
      )}
    />
    {errors.amount && <FormFeedback>{errors.amount.message}</FormFeedback>}
  </Col>


        {/* Card Details */}
        <Col sm='12'>
          <h6 className='text-secondary'>Card Details</h6>
        </Col>

        {/* Select Card */}
        {!showCardDetail && (
          <Col md='6' sm='12' className='mb-1'>
            <Label className='form-label'>Select Card</Label>
            <Controller
              name="cardNumber"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  options={cardOptions}
                  isClearable={true}
                  isDisabled={!selectedCustomer || cardOptions.length === 0}
                  placeholder={
                    !selectedCustomer
                      ? "Please select a customer first"
                      : cardOptions.length === 0
                        ? "No cards available for this customer"
                        : "Select a card"
                  }
                />
              )}
            />
          </Col>
        )}

        {/* CVV */}
        {!showCardDetail && (
          <Col md='6' sm='12' className='mb-1'>
            <Label className='form-label' for='cvv'>CVV Number</Label>
            <Controller
              name="cvv"
              control={control}
              defaultValue=""
              render={({ field }) => <Input type="password" id="cvv" placeholder="Enter CVV" {...field} />}
            />
          </Col>
        )}

        {/* Add New Card Link */}
        {!showCardDetail && (
          <Col sm="12" className="mb-2">
            <h6>
              Add New Card{" "}
              <a
                className="ml-1 font-bold"
                href="#!"
                onClick={(e) => {
                  e.preventDefault()
                  setShowCardDetail(true)
                }}
              >
                Click here
              </a>
            </h6>
          </Col>
        )}

        {/* Render CardDetail when showCardDetail is true */}
        {showCardDetail && (
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
                    {cardType !== '' && cardType !== 'unknown' && (
                      <InputGroupText className='cursor-pointer p-25'>
                        <img height='24' alt='card-type' src={cardsObj[cardType]} />
                      </InputGroupText>
                    )}
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

              {/* Hide existing card link when adding new card */}
              <Row className="mt-2">
                <Col sm="12">
                  <h6>
                    Use Existing Card{" "}
                    <a
                      className="ml-1 font-bold"
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowCardDetail(false)
                        // Clear new card form fields
                        setValue('cardType', null)
                        setValue('newCardNumber', '')
                        setValue('cardHolderName', '')
                        setValue('expiryDate', '')
                        setValue('newCvv', '')
                        setCardType('')
                      }}
                    >
                      Click here
                    </a>
                  </h6>
                </Col>
              </Row>
            </div>
          </Col>
        )}

        {/* Submit & Reset Buttons */}
        <Col sm='12'>
          <div className='d-flex'>
            <Button className='me-1' color='primary' type='submit'>{isProcessing ? 'Processing...' : 'Submit'}</Button>
            <Button
              outline
              color='secondary'
              type='button'
              onClick={() => {
                reset()
                setSelectedCustomer(null)
                setCardOptions([])
                setShowCardDetail(false)
                setCardType('')
              }}
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