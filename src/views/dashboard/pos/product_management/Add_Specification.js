
import React from "react";
import { Plus, PlusCircle, Trash2 } from "react-feather";
import {
  Card,
  Table,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "reactstrap";
import { Controller, useFieldArray } from "react-hook-form";

const Add_Specification = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  return (
    <>
      <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start">
        <CardTitle className="" tag="h4">
          Specifications
        </CardTitle>
       
      </CardHeader>

      <Card className="card-company-table px-1">
        <Table responsive>
          <thead>
            <tr>
              <th>Specification Name</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <Controller
                    control={control}
                    name={`specifications[${index}].name`}
                    rules={{
                      required: "Specification Name is required",
                      pattern: {
                        value: /^[A-Za-z ]+$/,
                        message: "Only alphabetic characters (A–Z) are allowed",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Specification Name"
                        invalid={!!field.error}
                        {...field}
                      />
                    )}
                  />
                </td>
                <td>
                  <Controller
                    control={control}
                    name={`specifications[${index}].value`}
                    rules={{
                      required: "Value is required",
                      pattern: {
                        value: /^[A-Za-z ]+$/,
                        message: "Only alphabetic characters (A–Z) are allowed",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Value"
                        invalid={!!field.error}
                        {...field}
                      />
                    )}
                  />
                </td>
                <td>
                  <Trash2
                    style={{ cursor: "pointer" }}
                    onClick={() => remove(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-start ms-2 mt-2 mb-1">
         
        <CardTitle
          className=""
          style={{ cursor: "pointer", color: "#607dd2" }}
          tag="h4"
          onClick={() => append({ name: "", value: "" })}

        >
          <Plus /> Add Specifications
        </CardTitle>
        </div>
      </Card>
    </>
  );
};

export default Add_Specification;
