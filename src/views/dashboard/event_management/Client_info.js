import useJwt from "@src/auth/jwt/useJwt";
import { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    FormGroup,
    Input,
    Label,
} from "reactstrap";

function AddEventTypes() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await useJwt.VendorType(data);
       (res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <Card>
        <CardBody>
          <CardTitle>
            <CardText>Create Vendor Types</CardText>
          </CardTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="12" className="mb-1">
                <Label for="typeName">Vendor Type</Label>

                <Controller
                  name="typeName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event Type is required" }}
                  render={({ field }) => (
                    <Input
                      id="typeName"
                      type="text"
                      placeholder="Enter Vendor type"
                      invalid={!!errors.typeName}
                      {...field}
                    />
                  )}
                />

                {errors.typeName && (
                  <p style={{ color: "red" }}>{errors.typeName.message}</p>
                )}
              </Col>
              <Col sm="12">
                <Label for="description">Vendor Type Description</Label>

                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Event Type Description is required" }}
                  render={({ field }) => (
                    <Input
                      id="description"
                      type="textarea"
                      rows="4"
                      placeholder="Enter Vendor type description"
                      invalid={!!errors.description}
                      {...field}
                    />
                  )}
                />

                {errors.description && (
                  <p style={{ color: "red" }}>{errors.description.message}</p>
                )}
              </Col>
            </FormGroup>

            <Button type="submit" color="primary">
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default AddEventTypes;
