// ** React Imports
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { Fragment, useEffect, useState } from 'react';
import Flatpickr from "react-flatpickr";

// ** Reactstrap Imports
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from 'reactstrap';

// ** Third Party Components
import CryptoJS from 'crypto-js';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';

// ** Utils
import { selectThemeColors } from '@utils';

// ** Custom Components
import PaymentModeSection from './PaymentModeSection';

//jwt import 
import useJwt from "@src/auth/jwt/useJwt";

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';

const colourOptions = [
  { value: "Monthly", label: "Monthly" },
  { value: "Annual", label: "Annual" },
];

// Secret key for encryption (move this to environment variables in production)
const SECRET_KEY = "zMWH89JA7Nix4HM+ij3sF6KO3ZumDInh/SQKutvhuO8=";

const EditUserExample = ({
  setShow,
  show,
  customerData,
  slip
}) => {
  // ** States
  const [file, setFile] = useState(null);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [cardOptions, setCardOptions] = useState([]);

  // ** Hooks
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm({});

  // Watch paidIn to update finalPayment automatically
  const watchPaidIn = watch('paidIn');

  // ** Effect to load existing cards when modal opens
  useEffect(() => {
    if (show && slip?.member) {
      updateCardOptions(slip.member);
    }
  }, [show, slip]);

  // ** Effect to update finalPayment when paidIn changes
  useEffect(() => {
    if (watchPaidIn && slip) {
      const amount = watchPaidIn.value === 'Annual' 
        ? slip.marketAnnualPrice 
        : slip.marketMonthlyPrice;
      setValue('finalPayment', amount);
    }
  }, [watchPaidIn, slip, setValue]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Encryption helper functions - CORRECTED VERSION
  function generateKey(secretKey) {
    return CryptoJS.SHA256(secretKey);
  }

  function generateIV() {
    return CryptoJS.lib.WordArray.random(16);
  }

  function encryptAES(plainText) {
    if (!plainText) return '';
    
    const key = generateKey(SECRET_KEY);
    const iv = generateIV();

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
  }

  const onSubmit = data => {
    console.log('Slip data from parent component', slip)

    // Raw values from RHF
    const rawValues = getValues();

    // Serialize values: turn Select objects into {value,label} and keep primitives as-is
    const serialized = JSON.parse(JSON.stringify(rawValues, (k, v) => {
      if (v && typeof v === 'object' && 'value' in v && 'label' in v) {
        return { value: v.value, label: v.label };
      }
      return v;
    }));

    console.log('--- onSubmit triggered ---');
    console.log('data (param):', data);
    console.log('raw getValues():', rawValues);
    console.log('serialized form values:', serialized);
    console.log('file state:', file);

    // Encrypt PIN if exists - CORRECTED
    const pinValue = serialized.pin ? serialized.pin.join('') : '';
    const encryptedPin = pinValue ? encryptAES(pinValue) : '';

    console.log('Original PIN:', pinValue);
    console.log('Encrypted PIN:', encryptedPin);

    

    // Create payload
    const payload = {
      
      SlipId: slip?.id || '',
      // ✅ Ensure memberId is a number (long)
      memberId: slip?.member?.uid ? Number(slip.member.uid) : 0,
      contractDate: serialized.contractDate || '',
      renewalDate: serialized.renewalDate || '',
      nextPaymentDate: serialized.nextPaymentDate || '',
      paidIn: serialized.paidIn?.value || '',
      finalPayment: serialized.finalPayment || 0.0,
      paymentMode: serialized.paymentMode?.value || '',
      
      // Cash payment fields - ENCRYPTED PIN
      pin: encryptedPin,
      
      // Credit Card fields (existing card)
      cardUid: serialized.existingCard?.cardData?.cardUid || '',
      cvv: serialized.cvv || '',
      
      // Credit Card fields (new card)
      cardType: serialized.cardType || '',
      cardNumber: serialized.cardNumber || '',
      cardCvv: serialized.cardCvv || '',
      cardExpiryYear: serialized.cardExpiryYear || '',
      cardExpiryMonth: serialized.cardExpiryMonth || '',
      nameOnCard: serialized.nameOnCard || '',
      
      // Address fields
      address: serialized.address || '',
      city: serialized.city || '',
      state: serialized.state || '',
      country: serialized.country || '',
      pinCode: serialized.pinCode || '',
      
      // Other payment fields
      cardSwipeTransactionId: serialized.cardSwipeTransactionId || '',
      bankName: serialized.bankName || '',
      nameOnAccount: serialized.nameOnAccount || '',
      routingNumber: serialized.routingNumber || '',
      accountNumber: serialized.accountNumber || '',
      chequeNumber: serialized.chequeNumber || '',
      accountType: serialized.accountType?.value || '',
      companyName: serialized.companyName || '',
      mtcn: serialized.mtcn || '',
      otherCompanyName: serialized.otherCompanyName || '',
      otherTransactionId: serialized.otherTransactionId || '',
      documentUid: serialized.documentUid || '',
    };

    console.log('Final payload:', payload);

    // ✅ Convert payload to FormData (added block)
    const formData = new FormData();
    for (const key in payload) {
      if (payload[key] !== undefined && payload[key] !== null) {
        formData.append(key, payload[key]);
      }
    }

    // ✅ Append file if present
    if (file) {
      formData.append('contractFile', file);
    }

    console.log('FormData prepared:', [...formData.entries()]);

    // Basic validation check
    const requiredFields = ['contractDate', 'renewalDate', 'nextPaymentDate', 'paidIn', 'finalPayment'];
    let isValid = true;

    requiredFields.forEach(field => {
      const value = getValues(field);
      if (!value || (typeof value === 'object' && !value.value)) {
        setError(field, {
          type: 'manual',
          message: 'This field is required'
        });
        isValid = false;
      }
    });

    if (isValid) {
      console.log('Form submitted successfully');
      
    try{

    
      // 🔹 Send FormData instead of JSON
      const response = useJwt.renewContract(formData)


    }catch(err){
      console.error(err

      )
    }
    }
  };


  const updateCardOptions = (member) => {
    if (member && member.cards && member.cards.length > 0) {
      const cardOpts = member.cards.map(card => ({
        value: card.cardNumber,
        label: `**** **** **** ${card.cardNumber.slice(-4)} (${card.cardType || 'Card'})`,
        cardData: card
      }));
      setCardOptions(cardOpts);
    } else {
      setCardOptions([]);
    }
    setValue('existingCard', null);
  };

  

  return (
    <Fragment>
      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Renewal Contract</h1>
            <p>Updating user details will receive a privacy audit.</p>
          </div>
          <Form tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="contractDate">
                  New Contract Date <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="contractDate"
                  control={control}
                  rules={{ required: "Contract Date is required" }}
                  render={({ field }) => (
                    <Flatpickr
                      id="contractDate"
                      className={`form-control ${errors.contractDate ? "is-invalid" : ""}`}
                      options={{
                        altInput: true,
                        altFormat: "Y-m-d",
                        dateFormat: "Y-m-d",
                      }}
                      value={field.value}
                      onChange={(date) => {
                        const formattedDate = date[0]?.toISOString().split("T")[0];
                        field.onChange(formattedDate);

                        const startDate = new Date(date[0]);
                        
                        // Set renewal date (1 year from contract date)
                        const endDate = new Date(startDate);
                        endDate.setFullYear(endDate.getFullYear() + 1);
                        const formattedEndDate = endDate.toISOString().split("T")[0];
                        setValue("renewalDate", formattedEndDate, { shouldValidate: true });

                        // Set next payment date based on paidIn value
                        const paidInValue = getValues('paidIn');
                        if (paidInValue) {
                          let nextPaymentDate = new Date(startDate);
                          if (paidInValue.value === "Monthly") {
                            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                          } else if (paidInValue.value === "Annual") {
                            nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
                          }
                          const formattedNextPaymentDate = nextPaymentDate.toISOString().split("T")[0];
                          setValue("nextPaymentDate", formattedNextPaymentDate, { shouldValidate: true });
                        }
                      }}
                    />
                  )}
                />
                {errors.contractDate && (
                  <FormFeedback className='d-block'>{errors.contractDate.message}</FormFeedback>
                )}
              </Col>

              <Col md="6" className="mb-1">
                <Label className="form-label" for="paidIn">
                  Paid In <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  control={control}
                  rules={{ required: "Paid In is required" }}
                  name="paidIn"
                  render={({ field }) => (
                    <Select
                      {...field}
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      isClearable
                      options={colourOptions}
                      onChange={(option) => {
                        field.onChange(option);
                        
                        const contractDateValue = getValues('contractDate');
                        if (contractDateValue && option) {
                          const startDate = new Date(contractDateValue);
                          let nextPaymentDate = new Date(startDate);
                          
                          if (option.value === "Monthly") {
                            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                          } else if (option.value === "Annual") {
                            nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
                          }
                          
                          const formattedNextPaymentDate = nextPaymentDate.toISOString().split("T")[0];
                          setValue("nextPaymentDate", formattedNextPaymentDate, { shouldValidate: true });
                        }
                      }}
                    />
                  )}
                />
                {errors.paidIn && (
                  <FormFeedback className='d-block'>{errors.paidIn.message}</FormFeedback>
                )}
              </Col>
            </Row>
            
            <Row>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="renewalDate">
                  Contract Renewal Date <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="renewalDate"
                  control={control}
                  rules={{ required: "Renewal date is required" }}
                  render={({ field }) => (
                    <Flatpickr
                      id="renewalDate"
                      className={`form-control ${errors.renewalDate ? "is-invalid" : ""}`}
                      options={{
                        altInput: true,
                        altFormat: "Y-m-d",
                        dateFormat: "Y-m-d",
                        clickOpens: false
                      }}
                      value={field.value}
                      onChange={() => {}}
                    />
                  )}
                />
                {errors.renewalDate && (
                  <FormFeedback className='d-block'>{errors.renewalDate.message}</FormFeedback>
                )}
              </Col>
              
              <Col md="6" className="mb-1">
                <Label className="form-label" for="nextPaymentDate">
                  Next Payment Date <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="nextPaymentDate"
                  control={control}
                  rules={{ required: "Next Payment date is required" }}
                  render={({ field }) => (
                    <Flatpickr
                      id="nextPaymentDate"
                      className={`form-control ${errors.nextPaymentDate ? "is-invalid" : ""}`}
                      options={{
                        altInput: true,
                        altFormat: "Y-m-d",
                        dateFormat: "Y-m-d",
                        minDate: "today",
                      }}
                      value={field.value}
                      onChange={(date) => {
                        const formattedDate = date[0]?.toISOString().split("T")[0];
                        field.onChange(formattedDate);
                      }}
                    />
                  )}
                />
                {errors.nextPaymentDate && (
                  <FormFeedback className='d-block'>{errors.nextPaymentDate.message}</FormFeedback>
                )}
              </Col>
            </Row>
            
            <Row>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="finalPayment">
                  Total Amount <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="finalPayment"
                  control={control}
                  rules={{ required: "Final Payment is required" }}
                  render={({ field }) => (
                    <Input
                      placeholder="Final Amount"
                      invalid={errors.finalPayment && true}
                      readOnly
                      disabled
                      {...field}
                    />
                  )}
                />
                {errors.finalPayment && (
                  <FormFeedback>{errors.finalPayment.message}</FormFeedback>
                )}
              </Col>
            </Row>
            
            <FormGroup>
              <Label for="fileInput">New Contract Upload</Label>
              <Input type="file" id="fileInput" onChange={handleFileChange} />
            </FormGroup>

            {/* Payment Mode Section Component */}
            <PaymentModeSection
              control={control}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
              showCardDetail={showCardDetail}
              setShowCardDetail={setShowCardDetail}
            />

            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='submit' className='me-1' color='primary'>
                Submit
              </Button>
              <Button 
                type='button' 
                color='secondary' 
                outline 
                onClick={() => {
                  reset();
                  setShowCardDetail(false);
                  setShow(false);
                }}
              >
                Discard
              </Button>
            </Col>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default EditUserExample;
