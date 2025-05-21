
import React from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';

const LogisticsForm = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      catering: '',
      decoration: '',
      soundLighting: '',
      stageSetup: '',
      powerBackup: '',
      transportParking: '',
      accommodation: ''
    }
  });

  const onSubmit = (data) => {
    console.log('Logistics & Services Submitted:', data);
  };

  return (
    <Card className="p-4">
      <CardBody>
        <h4 className="mb-4">Logistics & Services</h4>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Catering Requirements */}
          <FormGroup>
            <Label for="catering">Catering Requirements</Label>
            <Controller
              name="catering"
              control={control}
              rules={{ required: 'Please specify catering needs' }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="textarea"
                  placeholder="Cuisine types, Veg/Non-Veg, Buffet/Plated"
                />
              )}
            />
            {errors.catering && <p className="text-danger">{errors.catering.message}</p>}
          </FormGroup>

          {/* Decoration Theme */}
          <FormGroup>
            <Label for="decoration">Decoration Theme / Details</Label>
            <Controller
              name="decoration"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="textarea"
                  placeholder="Describe decoration theme or specific elements"
                />
              )}
            />
          </FormGroup>

          {/* Sound & Lighting */}
          <FormGroup>
            <Label for="soundLighting">Sound & Lighting Needs</Label>
            <Controller
              name="soundLighting"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="textarea"
                  placeholder="Microphones, DJ, lighting types, etc."
                />
              )}
            />
          </FormGroup>

          {/* Stage/Setup Requirements */}
          <FormGroup>
            <Label for="stageSetup">Stage / Setup Requirements</Label>
            <Controller
              name="stageSetup"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="textarea"
                  placeholder="Platform, backdrop, podium, etc."
                />
              )}
            />
          </FormGroup>

          {/* Power Backup Required */}
          <FormGroup>
            <Label for="powerBackup">Power Backup Required</Label>
            <Controller
              name="powerBackup"
              control={control}
              rules={{ required: 'Select Yes or No' }}
              render={({ field }) => (
                <Input {...field} type="select">
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
              )}
            />
            {errors.powerBackup && <p className="text-danger">{errors.powerBackup.message}</p>}
          </FormGroup>

          {/* Transportation/Parking Needs */}
          <FormGroup>
            <Label for="transportParking">Transportation / Parking Needs</Label>
            <Controller
              name="transportParking"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="textarea"
                  placeholder="Valet, shuttle service, guest parking, etc."
                />
              )}
            />
          </FormGroup>

          {/* Accommodation Requirements */}
          <FormGroup>
            <Label for="accommodation">Accommodation Requirements</Label>
            <Controller
              name="accommodation"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="textarea"
                  placeholder="For multi-day weddings or corporate stays"
                />
              )}
            />
          </FormGroup>

          <Button color="primary" type="submit">
            Submit
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default LogisticsForm;
