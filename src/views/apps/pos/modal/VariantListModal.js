import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
} from "reactstrap";
import { addItem } from "../store/cartSlice";

import useJwt from "@src/auth/jwt/useJwt";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const VariantListModal = ({ isOpen, prDetails, toggle }) => {
  // ** Props
  const { variations = [], name, description } = prDetails || {};

  // ** Hook
  const dispatch = useDispatch();

  // ** Form Hook
  const { control, reset, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      variations: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "variations",
  });

  // Reset whenever prDetails changes
  useEffect(() => {
    if (variations?.length) {
      reset({
        variations: variations.map((v) => ({
          ...v,
          qty: 0,
        })),
      });
    }
  }, [variations, reset]);

  const watchVariations = watch("variations");

  const increaseQty = (index, stockQty) => {
    const current = watchVariations[index].qty || 0;
    setValue(`variations.${index}.qty`, Math.min(current + 1, stockQty));
  };

  const decreaseQty = (index) => {
    const current = watchVariations[index].qty || 0;
    setValue(`variations.${index}.qty`, Math.max(current - 1, 0));
  };

  const onSubmit = async (data) => {
    console.log("Submitted Data:", data);

    try {
      const res = await useJwt.qtypos({
        items: data.variations.map((item) => ({
          quantity: item.qty,
          variationUid: item.uid,
        })),
      });
      debugger;
      const response = await useJwt.getVariationUid(res.data.uid);

      data.variations.map(({ finalAmount, qty, stockQty, uid }) =>
        dispatch(
          addItem({
            id: uid,
            finalAmount,
            qty,
            stockQty,
            productId: prDetails.uid,
            productName: prDetails.name,
            posId: res.data.uid,
          })
        )
      );

      toast.success("Added Into Cart");
      toggle();
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <Modal isOpen={isOpen} className="modal-dialog-centered" size="lg">
      <ModalHeader toggle={toggle}>{name}</ModalHeader>
      <ModalBody>
        <small className="mb-2 d-block">
          Product Description : {description}
        </small>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Table
            bordered
            hover
            responsive
            className="text-center align-middle table-sm"
          >
            <thead className="table-dark">
              <tr>
                <th>SKU</th>
                <th>Color</th>
                <th>Size</th>
                <th>MRP</th>
                <th>Stock Qty</th>
                <th>Quantity</th>
                <th>Final Amount</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                const color = field.attributes?.find(
                  (attr) => attr.attributeName === "Color"
                )?.value;
                const size = field.attributes?.find(
                  (attr) => attr.attributeName === "Size"
                )?.value;
                const qty = watchVariations[index]?.qty || 0;
                const finalAmount = qty * field.mrp;

                return (
                  <tr key={field.id}>
                    <td>{field.sku}</td>
                    <td>{color || "-"}</td>
                    <td>{size || "-"}</td>
                    <td>{field.mrp}</td>
                    <td>{field.stockQty}</td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        <Button.Ripple
                          type="button"
                          size="sm"
                          onClick={() => decreaseQty(index)}
                          outline
                          color="warning"
                        >
                          -
                        </Button.Ripple>

                        <Controller
                          name={`variations.${index}.qty`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              max={field.stockQty}
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(
                                  Math.min(
                                    Math.max(Number(e.target.value), 0),
                                    field.stockQty
                                  )
                                )
                              }
                              style={{
                                width: "60px",
                                textAlign: "center",
                                margin: "0 8px",
                              }}
                            />
                          )}
                        />

                        <Button.Ripple
                          type="button"
                          size="sm"
                          onClick={() => increaseQty(index, field.stockQty)}
                          outline
                          color="success"
                        >
                          +
                        </Button.Ripple>
                      </div>
                    </td>
                    <td>{finalAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <div className="text-center mt-2">
            <Button
              type="button"
              color="secondary"
              outline
              size="sm"
              onClick={toggle}
            >
              Cancel
            </Button>
            <Button type="submit" className="mx-1" color="primary" size="sm">
              Add Item
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default VariantListModal;
