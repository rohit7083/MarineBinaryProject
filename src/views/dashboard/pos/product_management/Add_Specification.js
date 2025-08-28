
// import React from "react";
// import { Plus, PlusCircle, Trash2 } from "react-feather";
// import {
//   Card,
//   Table,
//   CardHeader,
//   CardTitle,
//   Button,
//   Input,
// } from "reactstrap";
// import { Controller, useFieldArray } from "react-hook-form";

// const Add_Specification = ({ control }) => {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "specifications",
//   });

//   return (
//     <>
//       <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start">
//         <CardTitle className="" tag="h4">
//           Specifications
//         </CardTitle>
       
//       </CardHeader>

//       <Card className="card-company-table px-1">
//         <Table responsive>
//           <thead>
//             <tr>
//               <th>Specification Name</th>
//               <th>Value</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {fields.map((item, index) => (
//               <tr key={item.id}>
//                 <td>
//                   <Controller
//                     control={control}
//                     name={`specifications[${index}].name`}
//                     rules={{
//                       required: "Specification Name is required",
//                       pattern: {
//                         value: /^[A-Za-z ]+$/,
//                         message: "Only alphabetic characters (A–Z) are allowed",
//                       },
//                     }}
//                     render={({ field }) => (
//                       <Input
//                         type="text"
//                         placeholder="Specification Name"
//                         invalid={!!field.error}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </td>
//                 <td>
//                   <Controller
//                     control={control}
//                     name={`specifications[${index}].value`}
//                     rules={{
//                       required: "Value is required",
//                       pattern: {
//                         value: /^[A-Za-z ]+$/,
//                         message: "Only alphabetic characters (A–Z) are allowed",
//                       },
//                     }}
//                     render={({ field }) => (
//                       <Input
//                         type="text"
//                         placeholder="Value"
//                         invalid={!!field.error}
//                         {...field}
//                       />
//                     )}
//                   />
//                 </td>
//                 <td>
//                   <Trash2
//                     style={{ cursor: "pointer" }}
//                     onClick={() => remove(index)}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>

//         <div className="d-flex justify-content-start ms-2 mt-2 mb-1">
         
//         <CardTitle
//           className=""
//           style={{ cursor: "pointer", color: "#607dd2" }}
//           tag="h4"
//           onClick={() => append({ name: "", value: "" })}

//         >
//           <Plus /> Add Specifications
//         </CardTitle>
//         </div>
//       </Card>
//     </>
//   );
// };

// export default Add_Specification;

import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "react-feather";
import { Controller, useFieldArray } from "react-hook-form";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  FormFeedback,
  Input,
  Table,
} from "reactstrap";

const Add_Specification = ({ control, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  return (
    <>
      {/* Header */}
      <CardHeader className="d-flex justify-content-between align-items-center">
        <CardTitle tag="h4" className="fw-bold text-primary m-0">
          📋 Specifications
        </CardTitle>
      </CardHeader>

      {/* Table */}
      <Card className="border-0 shadow-sm rounded-4">
        <Table responsive bordered hover className="align-middle mb-0">
          <thead className="bg-light text-secondary fw-semibold">
            <tr>
              <th style={{ width: "40%" }}>Specification Name</th>
              <th style={{ width: "40%" }}>Value</th>
              <th className="text-center" style={{ width: "10%" }}>
                Action
              </th>
            </tr>
          </thead>
<tbody>
          <AnimatePresence component="tbody">
            {fields.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="editable-row"
              >
                {/* Specification Name */}
                <td>
                  <Controller
                    control={control}
                    name={`specifications[${index}].name`}
                    rules={{
                      required: "Specification Name is required",
                      pattern: {
                        value: /^[A-Za-z ]+$/,
                        message: "Only letters allowed",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="e.g. Material"
                        invalid={!!errors?.specifications?.[index]?.name}
                        {...field}
                        // bsSize="sm"
                        // className="rounded-2"
                      />
                    )}
                  />
                  {errors?.specifications?.[index]?.name && (
                    <FormFeedback>
                      {errors.specifications[index].name.message}
                    </FormFeedback>
                  )}
                </td>

                {/* Specification Value */}
                <td>
                  <Controller
                    control={control}
                    name={`specifications[${index}].value`}
                    rules={{
                      required: "Value is required",
                      pattern: {
                        value: /^[A-Za-z0-9 ]+$/,
                        message: "Letters & numbers only",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="e.g. Cotton"
                        invalid={!!errors?.specifications?.[index]?.value}
                        {...field}
                        // bsSize="sm"
                        className="rounded-2"
                      />
                    )}
                  />
                  {errors?.specifications?.[index]?.value && (
                    <FormFeedback>
                      {errors.specifications[index].value.message}
                    </FormFeedback>
                  )}
                </td>

                {/* Remove Button */}
                <td className="text-center">
                  <Button
                    color="danger"
                    size="sm"
                    outline
                    className="p-1"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          </tbody>
        </Table>

        {/* Add Row Button */}
        <div className="d-flex justify-content-center p-3">
          <Button
            color="primary"
            className="rounded-pill d-flex align-items-center gap-2 shadow-sm px-4"
            onClick={() => append({ name: "", value: "" })}
          >
            <Plus size={18} /> Add Row
          </Button>
        </div>
      </Card>

      {/* Custom Styling */}
      <style jsx>{`
        .editable-row:hover {
          background: #f9fbff !important;
          transition: background 0.2s ease;
        }
        thead th {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        td {
          vertical-align: middle;
        }
      `}</style>
    </>
  );
};

export default Add_Specification;
