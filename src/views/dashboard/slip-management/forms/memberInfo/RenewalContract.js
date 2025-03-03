
    // ** React Imports
    import { Fragment, useState } from 'react'
    import Flatpickr from "react-flatpickr";
    import "@styles/react/libs/flatpickr/flatpickr.scss";

    // ** Reactstrap Imports
    import {
      Card,
      Row,
      Col,
      Modal,
      Input,
      Label,
      Button,
      CardBody,
      CardText,
      CardTitle,
      ModalBody,
      ModalHeader,
      FormFeedback,
      Form,
      FormGroup
    } from 'reactstrap'
    
    // ** Third Party Components
    import Select from 'react-select'
    import { User, Check, X } from 'react-feather'
    import { useForm, Controller } from 'react-hook-form'
    
    // ** Utils
    import { selectThemeColors } from '@utils'
    
    // ** Styles
    import '@styles/react/libs/react-select/_react-select.scss'
    
   
    const colourOptions = [
        // { value: null, label: "select" },
        { value: "Monthly", label: "Monthly" },
        { value: "Annual", label: "Annual" },
      ];
    
    

    
    const EditUserExample = ({
        setShow,
        show
    }) => {
      // ** States
      const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
      // ** Hooks
      const {
        control,
        setError,
        handleSubmit,
        formState: { errors }
      } = useForm({  })
    
      const onSubmit = data => {
        if (Object.values(data).every(field => field.length > 0)) {
          return null
        } else {
          for (const key in data) {
            if (data[key].length === 0) {
              setError(key, {
                type: 'manual'
              })
            }
          }
        }
      }
    
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
                 Contract Date <span style={{ color: "red" }}>*</span>
               </Label>
               <Controller
                 name="contractDate"
                 control={control}
                 rules={{
                   required: "Contract Date is required",
                 }}
                 render={({ field }) => (
                   <Flatpickr
                     id="contractDate"
                     className={`form-control ${
                       errors.contractDate ? "is-invalid" : ""
                     }`}
                     options={{
                       altInput: true,
                       altFormat: "Y-m-d",
                       dateFormat: "Y-m-d",
                     }}
                     value={field.value}
                     onChange={(date) => {
                       const formattedDate = date[0]
                         ?.toISOString()
                         .split("T")[0];
                       field.onChange(formattedDate);

                       // Calculate Renewal Date (365 days later)
                       const renewalDate = new Date(date[0]);
                       renewalDate.setDate(renewalDate.getDate() + 365);

                       const formattedRenewalDate = renewalDate
                         .toISOString()
                         .split("T")[0];

                       // Set Renewal Date value in the form
                       setValue("renewalDate", formattedRenewalDate, {
                         shouldValidate: true,
                       });
                     }}
                   />
                 )}
               />
               {errors.contractDate && (
                 <FormFeedback>{errors.contractDate.message}</FormFeedback>
               )}
             </Col>
             <Col md="6" className="mb-1">
                <Label className="form-label" for="paidIn">
                  Paid In <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  control={control}
                  rules={{
                    required: "Paid In is required",
                  }}
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
                        console.clear();
                        console.log(option);
                        const { value } = option;
                        field.onChange(option);
                        setValue("rentalPrice", slipDetail[value]);
                        // handlePaidInChange(option); // Update rental price
                      }}
                      isInvalid={!!errors.paidIn}
                    />
                  )}
                />
                {errors.paidIn && (
                  <FormFeedback>{errors.paidIn.message}</FormFeedback>
                )}
              </Col>
             </Row>
              <Row>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="renewalDate">
                  Renewal Date <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="renewalDate"
                  control={control}
                  rules={{
                    required: "Renewal date is required",
                  }}
                  render={({ field }) => (
                    <Flatpickr
                      id="renewalDate"
                      className="form-control"
                      options={{
                        altInput: true,
                        altFormat: "Y-m-d",
                        dateFormat: "Y-m-d",
                      }}
                      value={field.value}
                      onChange={() => {}} // Disable manual changes
                        />
                  )}
                />
                {errors.renewalDate && (
                  <FormFeedback>{errors.renewalDate.message}</FormFeedback>
                )}
              </Col>
             
              <Col md="6" className="mb-1">
                <Label className="form-label" for="hf-picker">
                  Next Payment Date <span style={{ color: "red" }}>*</span>
                </Label>
                <Controller
                  name="nextPaymentDate"
                  control={control}
                  rules={{
                    required: "Next Payment date is required",
                  }}
                  render={({ field }) => (
                    <Flatpickr
                      id="hf-picker"
                      className={`form-control ${
                        errors.nextPaymentDate ? "is-invalid" : ""
                      }`}
                      options={{
                        altInput: true,
                        altFormat: "Y-m-d",
                        dateFormat: "Y-m-d",
                        minDate: "today", // Disable past dates
                      }}
                    //   value={field.value}
                    //   onChange={(date) => {
                    //     const formattedDate = format(date[0], "yyyy-MM-dd"); // Format date
                    //     field.onChange(formattedDate); // Update value in the form
                    //   }}
                    />
                  )}
                />
                {errors.nextPaymentDate && (
                  <FormFeedback>{errors.nextPaymentDate.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
             <Col md="12" className="mb-1">
                <Label className="form-label" for="landmark">
                  Total Amount <span style={{ color: "red" }}>*</span>
                </Label>

                <Controller
                  name="finalPayment"
                  control={control}
                  rules={{
                    required: "Final Payment is required",
                  }}
                  render={({ field }) => (
                    <Input
                      placeholder="Final Amount"
                      invalid={errors.finalPayment && true}
                      {...field}
                      readOnly
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

            <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="payment-card-number">
                      Card Number <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="cardNumber"
                      rules={{
                        required: "Card Number is required",
                        // maxLength: cardType === "Amex" ? 15 : 16,
                      }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter Card Number"
                          invalid={!!errors.cardNumber}
                          {...field}
                        //   onChange={(e) => handleOnchangeCardNum(e, field)}
                        />
                      )}
                    />
                    {errors.cardNumber && (
                      <FormFeedback>{errors.cardNumber.message}</FormFeedback>
                    )}
                  </Col>

                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="card-type">
                      Card Type <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="cardType"
                      rules={{
                        required: "Card Type is required",
                      }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                        //   value={cardType}
                        //   readOnly
                          invalid={!!errors.nameOnCard}
                          {...field}
                        //   style={getReadOnlyStyle()}
                        />
                      )}
                    />
                    {errors.cardType && (
                      <FormFeedback>{errors.cardType.message}</FormFeedback>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="card-expiry-year">
                      Card Expiry Year <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="cardExpiryYear"
                      control={control}
                      rules={{
                        required: "Expiry Year is required",
                        // min: currentYear,
                        message: "Expiry Year cannot be in the past",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                        //   options={years}
                          placeholder="Select Year"
                          className={`react-select ${
                            errors.cardExpiryYear ? "is-invalid" : ""
                          }`}
                          classNamePrefix="select"
                          isClearable
                          // Set the selected value
                        //   value={years.find(
                        //     (option) => option.value === field.value
                        //   )}
                          // Extract the `value` on change
                        //   onChange={(selectedOption) => {
                        //     field.onChange(selectedOption?.value || "");
                        //     handleYearChange(selectedOption); // Update available months based on year
                        //   }}
                        />
                      )}
                    />
                    {errors.cardExpiryYear && (
                      <FormFeedback>
                        {errors.cardExpiryYear.message}
                      </FormFeedback>
                    )}
                  </Col>

                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="card-expiry-month">
                      Card Expiry Month <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="cardExpiryMonth"
                      control={control}
                      rules={{
                        required: "Expiry Month is required",
                        min: 1,
                        max: 12,
                        message: "Expiry Month must be between 1 and 12",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                        //   options={availableMonths}
                          placeholder="Select Month"
                          className={`react-select ${
                            errors.cardExpiryMonth ? "is-invalid" : ""
                          }`}
                          classNamePrefix="select"
                          isClearable
                        //   value={availableMonths.find(
                        //     (option) => option.value === field.value
                        //   )}
                          // Extract the `value` on change
                          onChange={(selectedOption) =>
                            field.onChange(selectedOption?.value || "")
                          }
                        />
                      )}
                    />
                    {errors.cardExpiryMonth && (
                      <FormFeedback>
                        {errors.cardExpiryMonth.message}
                      </FormFeedback>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="payment-cvv">
                      Card CVV <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="cardCvv"
                      control={control}
                      rules={{
                        required: "CVV is required",
                        // maxLength: getCvvLength(cardType), // Dynamically set maxLength
                      }}
                      render={({ field }) => (
                        <Input
                          type="text" // Change type to text
                        //   maxLength={getCvvLength(cardType)} // Dynamically set maxLength
                          placeholder="Enter CVV Number"
                          invalid={!!errors.cardCvv}
                          {...field}
                        />
                      )}
                    />

                    {errors.cardCvv && (
                      <FormFeedback>{errors.cardCvv.message}</FormFeedback>
                    )}
                  </Col>
                  <Col md="6" className="mb-1">
                    <Label className="form-label" for="card-holder-name">
                      Card Holder's Name <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Controller
                      name="nameOnCard"
                      control={control}
                      rules={{ required: "Card Holder's Name is required" }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Enter Card Holder's Name"
                          invalid={!!errors.nameOnCard}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                    {errors.nameOnCard && (
                      <FormFeedback>{errors.nameOnCard.message}</FormFeedback>
                    )}
                  </Col>
                </Row>

    
             

                <Col xs={12} className='text-center mt-2 pt-50'>
                  <Button type='submit' className='me-1' color='primary'>
                    Submit
                  </Button>
                  <Button type='reset' color='secondary' outline onClick={() => setShow(false)}>
                    Discard
                  </Button>
                </Col>
              </Form>
            </ModalBody>
          </Modal>
        </Fragment>
      )
    }
    
    export default EditUserExample
    