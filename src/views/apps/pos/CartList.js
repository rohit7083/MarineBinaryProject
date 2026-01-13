import { useDispatch, useSelector } from "react-redux";

import useJwt from "@src/auth/jwt/useJwt";
import { useFieldArray, useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { Edit2, Trash } from "react-feather";
import toast from "react-hot-toast";
import { Button, CardText, CardTitle, Col, Row, Table } from "reactstrap";
import VariantListModal from "./modal/VariantListModal";
import { removeItem } from "./store/cartSlice";
const CartList = () => {
  // ** State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEditProduct, setSelectedEditProduct] = useState({
    variations: [],
  });

  // ** Hook
  const { items, selectedProduct } = useSelector((store) => store.cartSlice);

  const dispatch = useDispatch();
  const [deleteLoad, setDeleteload] = useState(false);
  // ** Field Array
  const { control, reset } = useForm({
    defaultValues: { slectedProducts: items },
  });

  // ** Field Array
  const { fields } = useFieldArray({
    control,
    name: "selectedProducts",
  });

  useEffect(() => {
    reset({ selectedProducts: items });
  }, [items, reset]);

  const openEditModal = (variations) => {
    setSelectedEditProduct({
      ...selectedProduct[variations.productId],
      variations: [variations],
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const { billing } = useSelector((store) => store.cartSlice);

  const handleDelete = async (uid, vuid, vrId) => {
    try {
      setDeleteload(true);
      const delres = await useJwt.deleteCartProduct(uid, vuid);
      dispatch(removeItem(vrId));

      //  vrId
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.content);
    } finally {
      setDeleteload(false);
    }
  };

  return (
    <Row>
      <Col>
        <CardTitle tag="h4">Cart Summery</CardTitle>
        <CardText className="small ">Selected Product</CardText>
        <Table bordered hover responsive size="sm" className="mb-0">
          <thead className="small">
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="small">
            {fields.map((item, i) => {
              const fnAmount = item.qty * item.finalAmount;

              return (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>${item.finalAmount}</td>
                  <td style={{ maxWidth: "80px" }}>{item?.qty}</td>
                  <td>${fnAmount}</td>
                  <td className="d-flex gap-1 mt-1">
                    <Button
                      color="primary"
                      style={{ padding: "0.15rem 0.3rem", fontSize: "0.7rem" }}
                      onClick={() => openEditModal(item)}
                    >
                      <Edit2 size={14} />{" "}
                    </Button>
                    <Button
                      color="danger"
                      style={{ padding: "0.15rem 0.3rem", fontSize: "0.7rem" }}
                      disabled={deleteLoad}
                      onClick={() =>
                        handleDelete(item.posId, item.variationId, item.vrId)
                      }
                    >
                      <Trash size={12} />{" "}
                    </Button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan="3" className="text-end fw-bold small">
                <strong> Grand Total </strong>
              </td>
              <td colSpan="2" className="fw-bold small">
                ${billing?.subtotal}
              </td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <VariantListModal
        isOpen={isOpen}
        prDetails={selectedEditProduct}
        toggle={closeModal}
        isUpdate={true}
      />
    </Row>
  );
};

export default CartList;
