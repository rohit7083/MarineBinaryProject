import {
  Card,
  Input,
  Row,
  Col,
  Label,
  CardHeader,
  CardTitle,
} from "reactstrap";
import { Trash2, Plus } from "react-feather";
import { Controller, useFieldArray } from "react-hook-form";

const ProductAdd_Table = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  return (
    <>
      <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start">
        <CardTitle className="" tag="h4">
          Variants
        </CardTitle>
        <CardTitle
          className=""
          style={{ cursor: "pointer", color: "#607dd2" }}
          tag="h4"
          onClick={() =>
            append({
              mrp: "",
              stockQty: "",
              qty: "",
              image: null,
              unit: "",
              calcAmount: "",
              finalAmount: "",
            })
          }
        >
          <Plus /> Add variations
        </CardTitle>
      </CardHeader>

      <Card className="card-company-table ">
        {fields.map((field, index) => (
          <div key={field.id}>
            <Row
              className="p-2 mb-2"
            >
              <Col md="2" sm="12" className="mb-1">
                <Label className="form-label">MRP</Label>
                <Controller
                  name={`variations[${index}].mrp`}
                  control={control}
                  render={({ field }) => <Input type="text" {...field} />}
                />
              </Col>
              <Col md="2" sm="12" className="mb-1">
                <Label className="form-label">Stock QTY</Label>
                <Controller
                  name={`variations[${index}].stockQty`}
                  control={control}
                  render={({ field }) => <Input type="text" {...field} />}
                />
              </Col>
              <Col md="2" sm="12" className="mb-1">
                <Label className="form-label">QTY</Label>
                <Controller
                  name={`variations[${index}].qty`}
                  control={control}
                  render={({ field }) => <Input type="text" {...field} />}
                />
              </Col>
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label">Product Image</Label>
                <Controller
                  name={`variations[${index}].image`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />
                  )}
                />
              </Col>

              <Row>
                <Col md="2" sm="12" className="mb-1">
                  <Label className="form-label">Unit</Label>
                  <Controller
                    name={`variations[${index}].unit`}
                    control={control}
                    render={({ field }) => <Input type="text" {...field} />}
                  />
                </Col>
                <Col md="2" sm="12" className="mb-1">
                  <Label className="form-label">Calculate Amount</Label>
                  <Controller
                    name={`variations[${index}].calcAmount`}
                    control={control}
                    render={({ field }) => <Input type="text" {...field} />}
                  />
                </Col>
                <Col md="2" sm="12" className="mb-1">
                  <Label className="form-label">Final Amount</Label>
                  <Controller
                    name={`variations[${index}].finalAmount`}
                    control={control}
                    render={({ field }) => <Input type="text" {...field} />}
                  />
                </Col>
                <Col md="6" sm="12" className="mt-4 d-flex justify-content-end">
                  <Trash2
                    onClick={() => remove(index)}
                    className="d-flex"
                    style={{ cursor: "pointer" }}
                  />
                </Col>
              </Row>
            </Row>
<hr/>

          </div>
        ))}
      </Card>
    </>
  );
};

export default ProductAdd_Table;
