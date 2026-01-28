import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Label,
} from "reactstrap";

const moduleOptions = [
  { value: "slip-management", label: "Slip Management", path: "/dashboard/slip_memberform" },
  // { value: "pos", label: "POS", path: "/dashboard/pos/point_of_sale/shop/PayementDetails" },
  { value: "room-management", label: "Room Management", path: "/addNew_room_booking" },
  { value: "event-management", label: "Event Management", path: "/CreateEvent" },
];

function AddCard() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      module: null,
    },
  });

  const onSubmit = (data) => {
    if (!data.module?.path) return;

    // 🚀 Navigate on button click
    navigate(data.module.path);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Generate Invoice</CardTitle>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Select Module</Label>

            <Controller
              name="module"
              control={control}
              rules={{ required: "Please select a module" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={moduleOptions}
                  placeholder="Select module..."
                  isClearable
                />
              )}
            />

            {errors.module && (
              <div className="text-danger mt-1">
                {errors.module.message}
              </div>
            )}
          </FormGroup>

          <Button color="primary" size="sm" type="submit">
            Add Invoice
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}

export default AddCard;
