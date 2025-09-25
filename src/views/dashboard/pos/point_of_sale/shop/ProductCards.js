import useJwt from "@src/auth/jwt/useJwt";
import { useCallback, useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

import { useNavigate } from "react-router-dom";
import noImage from "../../../../../assets/images/noImage.png";

// Fetch image utility
const fetchImage = async (uid) => {
  try {
    const res = await useJwt.getImages(uid);

    return URL.createObjectURL(res.data);
  } catch (error) {
    console.error("Failed to fetch image:", error);
    return "/path/to/default-image.png";
  }
};

// ** Calculate
const calculateCartQuantity = (cart, productId) =>
  Object.values(cart)
    .filter((item) => item.productId === productId)
    .reduce((sum, item) => sum + item.quantity, 0);

// Product Card Component
const ProductCard = ({ product, onAddItem, cart }) => {
  const [imageLoader, setImageLoader] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  const variationImageUid = product?.variations?.[0]?.variationImages?.[0]?.uid;
  const cartQuantity = calculateCartQuantity(cart, product.id);

  useEffect(() => {
    const loadImage = async () => {
      if (!variationImageUid) {
        setImageUrl(noImage);
        setImageLoader(false);
        return;
      }

      try {
        const url = await fetchImage(variationImageUid);
        setImageUrl(url?url:noImage);
      } catch (error) {
        setImageUrl(noImage);
      } finally {
        setImageLoader(false);
      }
    };

    loadImage();
  }, [variationImageUid]);

  return (
    <Card
      className="h-100"
      style={{ fontSize: "14px", border: "1px solid black" }}
    >
      {imageLoader ? (
        <div className="d-flex justify-content-center align-items-center p-4">
          <PuffLoader color="#9086F3" />
        </div>
      ) : (
        <CardImg
          top
          src={imageUrl}
          alt={product.name}
          style={{ aspectRatio: "1 / 1" }}
          className="p-2 border-bottom"
        />
      )}

      <CardBody style={{ padding: "8px" }}>
        <CardTitle tag="h5" style={{ fontSize: "15px", marginBottom: "5px" }}>
          {product.name}
        </CardTitle>
        <CardText style={{ fontSize: "13px", marginBottom: "5px" }}>
          {product?.description && product.description !== "undefined"
            ? product.description
            : "No description available"}
        </CardText>
      </CardBody>

      <div className="d-flex justify-content-center align-items-center mb-2">
        {cartQuantity > 0 ? (
          <span style={{ fontWeight: "500", color: "green", fontSize: "14px" }}>
            Added ({cartQuantity})
          </span>
        ) : (
          <Button.Ripple
            className="round m-2"
            color="primary"
            outline
            onClick={() => onAddItem({ ...product, image: imageUrl })}
            disabled={product?.isAdded ? true : false}
          >
            {product?.isAdded ? "Added" : `Add Item`}
          </Button.Ripple>
        )}
      </div>
    </Card>
  );
};

// ** Product Modal
const ProductSelectModal = (props) => {
  // ** Props
  const {
    openModal,
    productDetails: product,
    closeProductModal,
    setSelectedProductList,
    handleSuccessFullyAdded,
  } = props;

  // ** State
  const [isOpen, setIsOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [submitLoader, setSubmitLoader] = useState(false);

  // ** On Qty Change
  const onQuantityChange = (details, action) => {
    const { idx } = details;

    const selectedVariation = { ...productDetails }.variations[idx];
    let qty = 0;

    if (action == "add") {
      if (!selectedVariation.qty) {
        selectedVariation.qty = 1;
      } else {
        selectedVariation.qty = selectedVariation.qty + 1;
      }
    } else if (selectedVariation.qty > 0) {
      selectedVariation.qty = selectedVariation.qty - 1;
    }

    const resProduct = { ...productDetails };
    resProduct.variations[idx] = selectedVariation;

    setProductDetails(resProduct);
  };

  const handleAddToCart = async () => {
    setSubmitLoader(true);
    try {
      const items = productDetails.variations.map((item) => ({
        variationUid: item.uid,
        quantity: item.qty,
      }));

      const { data } = await useJwt.qtypos({ items });

      setSelectedProductList((rest) => [
        ...rest,
        { ...productDetails, variationItemId: data.uid },
      ]);
      handleSuccessFullyAdded(productDetails.index);
      closeProductModal();
      setIsOpen(false);
      setProductDetails(null);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoader(false);
    }
  };
  useEffect(() => {
    if (openModal) {
      setIsOpen(openModal);
      setProductDetails(product);
    }
  }, [openModal]);

  return (
    <Modal isOpen={isOpen} centered size="lg">
      <ModalHeader
        toggle={() => {
          setIsOpen(false);
          closeProductModal();
        }}
      >
        {productDetails?.name}
      </ModalHeader>

      <ModalBody>
        <div className="row">
          {/* Product Image */}
          <div className="col-md-5 d-flex flex-column align-items-center">
            <div
              style={{ width: "100%", height: "250px", position: "relative" }}
            >
              <img
                src={productDetails?.image || "no-image.png"}
                alt={productDetails?.name || "Product"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </div>

            {/* Thumbnail */}
            <div className="d-flex mt-2 gap-1 justify-content-center">
              <img
                src={productDetails?.image || "no-image.png"}
                alt="thumbnail"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-7">
            <h5>{/* price range or price */}</h5>
            <p style={{ fontSize: "14px", color: "#555" }}>
              {productDetails?.description}
            </p>

            {/* Specifications */}
            {productDetails?.specifications?.length > 0 && (
              <ul style={{ fontSize: "13px", paddingLeft: "18px" }}>
                {productDetails.specifications.map((spec) => (
                  <li key={spec.uid}>
                    <strong>{spec.specKey}:</strong> {spec.specValue}
                  </li>
                ))}
              </ul>
            )}

            {productDetails?.variations?.length > 0 && (
              <>
                <h6 className="mt-2">Choose Variations</h6>
                {productDetails.variations.map((variation, idx) => (
                  <VariationItem
                    key={variation.uid}
                    variation={{ ...variation, idx }}
                    quantity={0}
                    onQuantityChange={onQuantityChange}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          color="secondary"
          size="sm"
          onClick={() => {
            /* closeModal */
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          size="sm"
          onClick={() => {
            handleAddToCart();
          }}
          disabled={submitLoader}
        >
          {!submitLoader ? "Add to Cart" : "Loading..."}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const VariationItem = ({ variation, quantity, onQuantityChange }) => {
  const attributes = variation.attributes
    .map((attr) => `${attr.attributeName}: ${attr.value}`)
    .join(" / ");

  return (
    <div className="d-flex flex-column mb-2">
      <strong>{attributes}</strong>
      <div className="d-flex align-items-center gap-2 mt-1">
        <Button
          size="sm"
          outline
          color="primary"
          onClick={() => onQuantityChange(variation, "remove")}
        >
          −
        </Button>
        <span>{variation.qty ? variation.qty : 0}</span>
        <Button
          size="sm"
          outline
          color="primary"
          onClick={() => onQuantityChange(variation, "add")}
        >
          +
        </Button>
      </div>
    </div>
  );
};

const ProductCards = ({ tableData, loading, selectedCustomer }) => {
  // ** States
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selecltedProductList, setSelectedProductList] = useState([]);
  const [products, setProducts] = useState([]);

  const navigate=useNavigate()

  // ** Toggle
  const addProduct = (product) => {
    setSelectedProduct(product);
    setOpenModal(!openModal);
  };

  const closeProductModal = useCallback(() => {
    setSelectedProduct(null);
    setOpenModal(false);
  }, []);

  const handleMakePayment = () => {
    navigate("/dashboard/pos/point_of_sale/shop/PayementDetails", {
      state: {
        selecltedProductList,
        selectedCust: `${selectedCustomer.firstName}`,
        customeUid:selectedCustomer.uid
      },
    });
  };

  const handleSuccessFullyAdded = (index) => {
    const updatedProduct = products.map((_, idx) => {
      if (idx == index) {
        return { ..._, isAdded: true };
      }
      return _;
    });
    setProducts(updatedProduct);
  };


  useEffect(()=>{

    if(tableData.results)
    setProducts(
      tableData.results.map((item, index) => ({ ...item, index, isAdded: false }))  
    );
  },[tableData])

  if (loading) return "loading....";

  return (
    <Row>
      {products.map((item, index) => (
        <Col sm="12" md="4" lg="3" key={item.uid}>
          <ProductCard
            product={{ ...item, index }}
            onAddItem={addProduct}
            cart={[]}
          />
        </Col>
      ))}
      <ProductSelectModal
        openModal={openModal}
        productDetails={selectedProduct}
        closeProductModal={closeProductModal}
        setSelectedProductList={setSelectedProductList}
        handleSuccessFullyAdded={handleSuccessFullyAdded}
      />

      <Col sm="12">
        <Button
          color="primary"
          size="sm"
          onClick={handleMakePayment}
          disabled={!selectedCustomer}
        >
          Make Payment
        </Button>
      </Col>
    </Row>
  );
};

export default ProductCards;
