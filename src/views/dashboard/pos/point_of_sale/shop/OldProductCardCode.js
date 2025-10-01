import useJwt from "@src/auth/jwt/useJwt";
import Lottie from "lottie-react";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toast } from "primereact/toast";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import noImgSpinner from "../../../../../assets/images/imgLoader.json";
import noImage from "../../../../../assets/images/noImage.png";

// Utility Functions
const fetchImage = async (uid) => {
  try {
    const res = await useJwt.getImages(uid);
    return URL.createObjectURL(res.data);
  } catch (error) {
    console.error("Failed to fetch image:", error);
    return noImage;
  }
};

const calculateCartQuantity = (cart, productId) =>
  Object.values(cart)
    .filter(item => item.productId === productId)
    .reduce((sum, item) => sum + item.quantity, 0);

const calculatePriceRange = (variations) => {
  if (!variations?.length) return null;
  
  const prices = variations.map(v => v.finalAmount || v.price || 0);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  return minPrice === maxPrice 
    ? `$${minPrice.toFixed(2)}` 
    : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
};

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
        setImageUrl(url);
      } catch (error) {
        setImageUrl(noImage);
      } finally {
        setImageLoader(false);
      }
    };

    loadImage();
  }, [variationImageUid]);

  return (
    <Card className="h-100" style={{ fontSize: "14px", border: "1px solid black" }}>
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
            onClick={() => onAddItem(product)}
          >
            Add Item
          </Button.Ripple>
        )}
      </div>
    </Card>
  );
};

// Variation Item Component
const VariationItem = ({ variation, quantity, onQuantityChange }) => {
  const attributes = variation.attributes
    .map(attr => `${attr.attributeName}: ${attr.value}`)
    .join(" / ");

  return (
    <div className="d-flex flex-column mb-2">
      <strong>{attributes}</strong>
      <div className="d-flex align-items-center gap-2 mt-1">
        <Button
          size="sm"
          outline
          color="primary"
          onClick={() => onQuantityChange(variation.uid, Math.max(0, quantity - 1))}
        >
          −
        </Button>
        <span>{quantity}</span>
        <Button
          size="sm"
          outline
          color="primary"
          onClick={() => onQuantityChange(variation.uid, quantity + 1)}
        >
          +
        </Button>
      </div>
    </div>
  );
};

// Main Product Page Component
const ProductPage = ({ selectedCustomer, tableData, page, setPage, setTableData, loading }) => {
  // State Management
  const [cart, setCart] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [variationQty, setVariationQty] = useState({});
  const [error, setError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [uids, setUids] = useState([]);

  const navigate = useNavigate();
  const toast = useRef(null);

  const selectedCustomerName = selectedCustomer?.firstName;

  // Event Handlers
  const showToast = useCallback((severity, summary, detail) => {
    toast.current?.show({ severity, summary, detail, life: 2000 });
  }, []);

  const handleAddItemClick = async (product) => {4
    
    setError('');
    setSelectedProduct(product);
    setVariationQty({});
    setModalOpen(true);

    const variationImageUid = product?.variations?.[0]?.variationImages?.[0]?.uid;
    
    if (!variationImageUid) {
      setProductImage(noImage);
      return;
    }

    setImgLoading(true);
    try {
      const imageUrl = await fetchImage(variationImageUid);
      setProductImage(imageUrl);
    } catch (error) {
      setProductImage(noImage);
      console.error("Failed to load product image:", error);
    } finally {
      setImgLoading(false);
    }
  };

  const handleMakePayment = () => {
    const selectedProducts = Object.values(cart);
    
    if (selectedProducts.length === 0) {
      showToast("error", "Error", "Please add at least one product to proceed to payment.");
      return;
    }

    navigate("/dashboard/pos/point_of_sale/shop/PayementDetails", {
      state: { selectedProducts, selectedCust: selectedCustomerName, uids, productImage },
    });
  };

  const handleAddToCart = async () => {
    setError("");
    
    const items = Object.entries(variationQty)
      .filter(([_, qty]) => qty > 0)
      .map(([uid, qty]) => ({ variationUid: uid, quantity: qty }));

    if (items.length === 0) {
      showToast("error", "Error", "Select at least one variation with quantity greater than 0");
      return;
    }

    setLoadingSubmit(true);
    try {
      const res = await useJwt.qtypos({ items });
      const newUid = res?.data?.uid;
      
      if (res?.data?.code === 201 && newUid) {
        setUids(prev => [...prev, newUid]);
        
        const updatedCart = { ...cart };
        items.forEach(({ variationUid, quantity }) => {
          const variation = selectedProduct.variations.find(v => v?.uid === variationUid);
          
          if (variation) {
            const unitPrice = variation.finalAmount || variation.price || 0;
            updatedCart[variationUid] = {
              ...variation,
              productId: selectedProduct.id,
              quantity,
              name: selectedProduct.name,
              unitPrice: Number(unitPrice),
              totalPrice: quantity * unitPrice,
            };
          }
        });

        setCart(updatedCart);
        setModalOpen(false);
        setVariationQty({});
        showToast("success", "Success", "Items added to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      setError(error?.response?.data?.content || "Failed to add to cart");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleQuantityChange = (uid, newQuantity) => {
    setVariationQty(prev => ({
      ...prev,
      [uid]: newQuantity
    }));
  };

  const closeModal = () => {
    setModalOpen(false);
    setVariationQty({});
    setError("");
  };

  return (
    <Fragment>
      <Toast ref={toast} />

      {/* Product Grid */}
      <Row className="match-height mb-2">
        <Col md="12">
          <Row>
            {loading && page === 1 ? (
              <div className="text-center my-5">
                <Spinner color="primary" />
              </div>
            ) : (
              tableData.results?.map((product, index) => (
                <Col md="3" xs="12" key={product.id || index} className="mb-3">
                  <ProductCard
                    product={product}
                    onAddItem={handleAddItemClick}
                    cart={cart}
                  />
                </Col>
              ))
            )}
          </Row>

          {/* Load More Button */}
          {tableData.results?.length < tableData.count && (
            <div className="text-center mt-2">
              <Button
                color="primary"
                size="sm"
                style={{ width: "150px" }}
                onClick={() => setPage(prev => prev + 1)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Make Payment Button */}
      <div className="d-flex justify-content-end">
        <Button
          color="primary"
          size="sm"
          onClick={handleMakePayment}
          disabled={!selectedCustomerName}
        >
          Make Payment
        </Button>
      </div>

      {/* Product Details Modal */}
      <Modal isOpen={modalOpen} toggle={closeModal} centered size="lg">
        <ModalHeader toggle={closeModal}>
          {selectedProduct?.name}
        </ModalHeader>
        
        <ModalBody>
          {error && (
            <UncontrolledAlert color="danger">
              <strong>Error:</strong> {error}
            </UncontrolledAlert>
          )}

          <div className="row">
            {/* Product Image */}
            <div className="col-md-5 d-flex flex-column align-items-center">
              <div style={{ width: "100%", height: "250px", position: "relative" }}>
                {imgLoading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <Lottie animationData={noImgSpinner} loop style={{ width: "100%", height: 200 }} />
                  </div>
                ) : (
                  <img
                    src={productImage || noImage}
                    alt={selectedProduct?.name || "Product"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                    onError={(e) => { e.target.src = noImage; }}
                  />
                )}
              </div>

              {/* Thumbnail */}
              {!imgLoading && (
                <div className="d-flex mt-2 gap-1 justify-content-center">
                  <img
                    src={productImage || noImage}
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
              )}
            </div>

            {/* Product Details */}
            <div className="col-md-7">
              <h5>{calculatePriceRange(selectedProduct?.variations) || `$${selectedProduct?.price?.toFixed(2)}`}</h5>
              
              <p style={{ fontSize: "14px", color: "#555" }}>
                {selectedProduct?.description}
              </p>

              {/* Specifications */}
              {selectedProduct?.specifications?.length > 0 && (
                <ul style={{ fontSize: "13px", paddingLeft: "18px" }}>
                  {selectedProduct.specifications.map(spec => (
                    <li key={spec.uid}>
                      <strong>{spec.specKey}:</strong> {spec.specValue}
                    </li>
                  ))}
                </ul>
              )}

              {/* Variations */}
              {selectedProduct?.variations?.length > 0 && (
                <>
                  <h6 className="mt-2">Choose Variations</h6>
                  {selectedProduct.variations.map(variation => (
                    <VariationItem
                      key={variation.uid}
                      variation={variation}
                      quantity={variationQty[variation.uid] || 0}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" size="sm" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm"
            disabled={loadingSubmit}
            onClick={handleAddToCart}
          >
            {loadingSubmit ? "Loading..." : "Add to Cart"}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default ProductPage;