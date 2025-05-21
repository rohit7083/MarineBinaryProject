
import React from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  Row,
  Col
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';

const VenueForm = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      venueName: '',
      capacity: '',
      seating: '',
      indoorOutdoor: '',
      backupPlan: ''
    }
  });

  const indoorOutdoor = watch('indoorOutdoor');

  const onSubmit = (data) => {
    console.log('Venue Data:', data);
  };

  return (
 
    <>
        <h4 className="mb-4">Venue & Location</h4>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Venue Name / Area */}
          <FormGroup>
            <Label for="venueName">Venue Name / Area</Label>
            <Controller
              name="venueName"
              control={control}
              rules={{ required: 'Venue name or area is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="e.g., Banquet Hall, Garden, Poolside"
                />
              )}
            />
            {errors.venueName && <p className="text-danger">{errors.venueName.message}</p>}
          </FormGroup>

          {/* Venue Capacity */}
          <FormGroup>
            <Label for="capacity">Venue Capacity</Label>
            <Controller
              name="capacity"
              control={control}
              rules={{
                required: 'Capacity is required',
                min: { value: 1, message: 'Must be at least 1' }
              }}
              render={({ field }) => (
                <Input {...field} type="number" placeholder="Enter maximum capacity" />
              )}
            />
            {errors.capacity && <p className="text-danger">{errors.capacity.message}</p>}
          </FormGroup>

          {/* Seating Arrangement */}
          <FormGroup>
            <Label for="seating">Seating Arrangement</Label>
            <Controller
              name="seating"
              control={control}
              rules={{ required: 'Seating arrangement is required' }}
              render={({ field }) => (
                <Input {...field} type="select">
                  <option value="">-- Select Arrangement --</option>
                  <option>Banquet</option>
                  <option>Theater</option>
                  <option>Round Tables</option>
                  <option>U-Shape</option>
                  <option>Classroom</option>
                </Input>
              )}
            />
            {errors.seating && <p className="text-danger">{errors.seating.message}</p>}
          </FormGroup>

          {/* Indoor/Outdoor */}
          <FormGroup>
            <Label for="indoorOutdoor">Indoor / Outdoor</Label>
            <Controller
              name="indoorOutdoor"
              control={control}
              rules={{ required: 'Please select Indoor or Outdoor' }}
              render={({ field }) => (
                <Input {...field} type="select">
                  <option value="">-- Select Option --</option>
                  <option>Indoor</option>
                  <option>Outdoor</option>
                </Input>
              )}
            />
            {errors.indoorOutdoor && <p className="text-danger">{errors.indoorOutdoor.message}</p>}
          </FormGroup>

          {/* Conditional Weather Backup Plan */}
          {indoorOutdoor === 'Outdoor' && (
            <FormGroup>
              <Label for="backupPlan">Backup Plan for Weather</Label>
              <Controller
                name="backupPlan"
                control={control}
                rules={{
                  required: 'Backup plan is required for outdoor venues'
                }}
                render={({ field }) => (
                  <Input {...field} type="text" placeholder="e.g., Indoor backup" />
                )}
              />
              {errors.backupPlan && <p className="text-danger">{errors.backupPlan.message}</p>}
            </FormGroup>
          )}

          <Button color="primary" type="submit">
            Submit
          </Button>
        </Form>
   </>
  );
};

export default VenueForm;
