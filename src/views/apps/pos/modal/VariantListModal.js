import useJwt from "@src/auth/jwt/useJwt";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Table,
} from "reactstrap";
import noImage from "../../../../../src/assets/images/noImages.png";
import { addItem, addProduct, updateItemQty } from "../store/cartSlice";

const VariantListModal = ({ isOpen, prDetails, toggle, isUpdate = false }) => {
  // ** Props
  const { variations = [], name, description } = prDetails || {};

  // ** Props
  const [variationsLoad, setvariationLoad] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [imageLoader, setImageLoader] = useState(false);
  const [tHead, setTHeadList] = useState([
    "SKU",
    "Image",
    "Stock",
    "Amount",
    "Quantity",
    "Final",
  ]);

  // ** Hook
  const dispatch = useDispatch();
  const { items, selectedProduct } = useSelector((store) => store.cartSlice);

  // ** Form Hook
  const { control, reset, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      variations: [],
    },
  });

  // ** Field List
  const { fields } = useFieldArray({
    control,
    name: "variations",
  });

  const findQty = (variation, productUid) => {
    if (!selectedProduct[productUid]) return { qty: 0 };
    const isVariationExist = items.find(({ vrId }) => vrId == variation.uid);
    if (isVariationExist) {
      const { qty, posId, variationId } = isVariationExist;
      return { qty, posId, variationId, oldQty: qty };
    }
    return { qty: 0 };
  };

  //** Reset whenever prDetails changes
  useEffect(() => {
    if (variations?.length) {
      const attributesList = variations[0].attributes.map(
        ({ attributeName }) => attributeName
      );
      setTHeadList([...tHead, ...attributesList]);
      reset({
        variations: variations.map((v) => ({
          ...v,
          ...(isUpdate ? { qty: v.qty } : findQty(v, prDetails.uid)),
        })),
      });
    }
  }, [variations, reset]);

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          setImageLoader(true);
          const results = await Promise.all(
            variations.map(({ variationImages }) =>
              useJwt.getImages(variationImages[0]?.uid)
            )
          );

          setImageList(
            results.map(({ data, type }) => {
              const blob = new Blob([data], { type: type || "image/jpeg" });
              return URL.createObjectURL(blob);
            })
          );
        } catch (error) {
          console.log(error);
        } finally {
          setImageLoader(false);
        }
      })();
    }
    return () => {
      setImageLoader(false);
      setImageList([]);
    };
  }, [isOpen, variations]);

  const watchVariations = watch("variations");

  const increaseQty = (index, stockQty) => {
    const current = watchVariations[index].qty || 0;
    setValue(`variations.${index}.qty`, Math.min(current + 1, stockQty));
  };

  const decreaseQty = (index) => {
    const current = watchVariations[index].qty || 0;
    setValue(`variations.${index}.qty`, Math.max(current - 1, 0));
  };

  // ** Add Into Cart
  const addIntoCart = async (data) => {
    const sentToApiList = data
      .filter((item) => item.qty > 0)
      .map((item) => ({
        quantity: item.qty,
        variationUid: item.uid,
      }));
    const res = await useJwt.qtypos({
      items: sentToApiList,
    });

    const response = await useJwt.getVariationUid(res.data.uid);

    const hash = new Map();
    response.data.content.items.map(({ variationUid, uid }) => {
      hash.set(variationUid, uid);
    });
    data.forEach(
      ({
        qty,
        stockQty,
        uid,
        attributes,
        variationImages,
        sku,
        finalAmount,
      }) => {
        if (qty > 0) {
          dispatch(
            addItem({
              vrId: uid,
              id: uid,
              finalAmount,
              sku,
              qty,
              stockQty,
              productId: prDetails.uid,
              productName: prDetails.name,
              posId: res.data.uid,
              variationId: hash.get(uid),
              attributes,
              variationImages,
            })
          );
        }
      }
    );

    const productDetails = { ...prDetails };
    delete productDetails.variations;
    dispatch(addProduct({ prId: prDetails.uid, productDetails }));

    toast.success("Added Into Cart");
  };

  const updateIntoCart = async (data) => {
    const { vrId, qty, variationId } = data[0];
    const params = `${variationId}?quantity=${qty}`;
    await useJwt.updatedQty(params);

    dispatch(updateItemQty({ id: vrId, qty }));
    toast.success("Product updated.");
  };

  const onSubmit = async (data) => {
    try {
      setvariationLoad(true);

      const { postList, updateData } = data.variations.reduce(
        (acc, items) => {
          if (
            items.qty > 0 &&
            items.variationId &&
            items.qty !== items.oldQty
          ) {
            acc.updateData.push(items);
          } else if (items.qty > 0 && !items.variationId) {
            acc.postList.push(items);
          }
          return acc;
        },
        {
          postList: [],
          updateData: [],
        }
      );
      if (updateData.length) {
        // ** Update List
        await updateIntoCart(updateData);
      } else if (postList.length) {
        // ** Create Record
        await addIntoCart(postList);
      }
      toggle();
    } catch (error) {
      console.log(error);
    } finally {
      setvariationLoad(false);
    }
  };

  return (
    <Modal isOpen={isOpen} className="modal-dialog-centered" size="lg">
      <ModalHeader toggle={toggle}>{name}</ModalHeader>
      <ModalBody>
        <small className="mb-2 d-block">
          <strong> Product Description : </strong> {description}
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
                {tHead.map((name) => (
                  <th key={name}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.length &&
                fields.map((field, index) => {
                  const qty = watchVariations[index]?.qty || 0;
                  const finalAmount = qty * field.finalAmount;

                  const attributesValue = field.attributes.map(
                    ({ value }) => value
                  );
                  return (
                    <tr key={field.id}>
                      <td>{field.sku}</td>
                      <td style={{ width: "60px" }}>
                        <img
                          src={imageList[index] ? imageList[index] : noImage}
                          // src={noImage}
                          alt={field.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                        />
                      </td>
                      <td>{field.stockQty}</td>
                      <td>{field.finalAmount}</td>

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
                      {attributesValue.map((val) => (
                        <td key={val}>{val}</td>
                      ))}
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
            <Button
              type="submit"
              className="mx-1"
              disabled={variationsLoad}
              color="primary"
              size="sm"
            >
              {variationsLoad ? (
                <>
                  Loading..
                  <Spinner size={"sm"} />
                </>
              ) : (
                "Add Item"
              )}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default VariantListModal;
