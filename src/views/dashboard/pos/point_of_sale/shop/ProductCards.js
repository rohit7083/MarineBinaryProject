import useJwt from "@src/auth/jwt/useJwt";
import Lottie from "lottie-react";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toast } from "primereact/toast";
import { Fragment, useEffect, useRef, useState } from "react";
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
} from "reactstrap";
import noImgSpinner from "../../../../../assets/images/imgLoader.json";
import noImage from "../../../../../assets/images/noImage.png";
const fetchImage = async (uid) => {
  const res = await useJwt.getImages(uid);

  return URL.createObjectURL(res.data);
};

const ProductCard = (props) => {
  // ** Props
  const { product, handleAddItemClick, cart } = props;
  const toast = useRef(null);

  // ** State
  const [imageLoader, setImageLoader] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  const variationImageUid = product.variations[0].variationImages[0].uid;

  useEffect(() => {
    setImageLoader(true);
    (async () => {
      try {
        const url = await fetchImage(variationImageUid);
        setImageUrl([url]);
      } catch (error) {
        setImageUrl([noImage]);
      } finally {
        setImageLoader(false);
      }
    })();
  }, []);

  useEffect;
  return (
    <Card
      style={{
        width: "100%",
        height: "auto",
        fontSize: "14px",
        border: "1px solid black",
      }}
    >
      {imageLoader ? (
        <div className="flex justify-center items-center p-4">
          <PuffLoader color="#9086F3" />
        </div>
      ) : (
        <CardImg
          top
          src={imageUrl}
          alt="Card image"
          style={{ aspectRatio: "1 / 1" }} // fixed ratio syntax
          className="p-2 border-bottom"
        />
      )}

      <CardBody style={{ padding: "8px" }}>
        <Row>
          <Col md="9" xs="12">
            <CardTitle
              tag="h5"
              style={{ fontSize: "15px", marginBottom: "5px" }}
            >
              {product.name}
            </CardTitle>
          </Col>
          {/* <Col tag="h5" md="3" xs="12">
                            ${product?.price}
                          </Col> */}
        </Row>
        <CardText style={{ fontSize: "13px", marginBottom: "5px" }}>
          {product.description !== "undefined" || undefined
            ? product.description
            : "No description available"}
        </CardText>
      </CardBody>

      <div className="d-flex justify-content-center align-items-center mb-2">
        {Object.values(cart)
          .filter((c) => c.productId === product.id)
          .reduce((sum, c) => sum + c.quantity, 0) > 0 ? (
          <span
            style={{
              fontWeight: "500",
              color: "green",
              fontSize: "14px",
            }}
          >
            Added (
            {Object.values(cart)
              .filter((c) => c.productId === product.id)
              .reduce((sum, c) => sum + c.quantity, 0)}
            )
          </span>
        ) : (
          <Button.Ripple
            className="round m-2"
            color="primary"
            outline
            onClick={() => handleAddItemClick(product)}
          >
            Add Item
          </Button.Ripple>
        )}
      </div>
    </Card>
  );
};

const ProductPage = ({
  selectedCustomer,
  tableData,
  page,
  setPage,
  setTableData,
  loading,
}) => {
  const [productIma, setProductImages] = useState([]);

  const [cart, setCart] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [variationQty, setVariationQty] = useState({});
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const selectedCust = selectedCustomer?.selectedCustomer;
  const [imgLoading, setIsLoadingImage] = useState(false);
  const [uids, setUids] = useState([]);
  const toast = useRef(null);

  const handleAddItemClick = async (product) => {
    setSelectedProduct(product);
    setSelectedQty(1);
    setSelectedVariation(null);
    setCurrentImage(0);
    setModalOpen(true);

    const variation = product?.variations?.[0];
    const uid = variation?.variationImages?.[0]?.uid;

    if (!uid) {
      console.warn("No variation image UID found for this product.");
      setProductImages([noImage]); // fallback
      return;
    }
    setIsLoadingImage(true);
    try {
      const urlLink = await fetchImage(uid);
      setProductImages([urlLink]);
      // const res = await useJwt.getImages(uid);
      // if (res?.data instanceof Blob && res.data.size > 0) {
      //   // ✅ res.data is always a Blob
      //   const imageUrl = URL.createObjectURL(res.data);

      //   setProductImages([imageUrl]); // put inside an array for consistency
      // } else {
      //   console.warn(`No image blob found for uid: ${uid}`);
      //   setProductImages([noImage]);
      // }
    } catch (err) {
      console.error("Failed to fetch image:", err);
      setProductImages([noImage]); // fallback
    } finally {
      setIsLoadingImage(false);
    }
  };

  // Inside your component
  const handleMakePayment = () => {
  
    const selectedProducts = Object.values(cart);
    if (selectedProducts.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please add at least one product to proceed to payment.",
        life: 2000,
      });
      return;
    }
    // {{debugger}}
    navigate("/dashboard/pos/point_of_sale/shop/PayementDetails", {
      state: { selectedProducts, selectedCust, uids, productIma },
    });


  };

  const handleAddToCart = async () => {
    const items = Object.entries(variationQty)
      .filter(([_, qty]) => qty > 0)
      .map(([uid, qty]) => ({ variationUid: uid, quantity: qty }));

    if (items.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select at least one variation with quantity Greater than 0",
        life: 2000,
      });
      return;
    }

    try {
      setLoadingSubmit(true);

      // Optional: call API
      const res = await useJwt.qtypos({ items });
      const newUid = res?.data?.uid;
      if (!newUid) return;

      const allUids = [...uids, newUid];
      setUids(allUids);
      if (res?.data?.code === 201) {
        const updatedCart = { ...cart };

        items.forEach(({ variationUid, quantity }) => {
          const variation = selectedProduct.variations.find(
            (v) => v.uid === variationUid
          );
          if (variation) {
            updatedCart[variationUid] = {
              ...variation,
              productId: selectedProduct.id,
              quantity,
              name: selectedProduct.name,
              image: variation.image || selectedProduct.image,
              unitPrice: variation.finalAmount || variation.price || 0, // store unit price
              totalPrice:
                quantity * (variation.finalAmount || variation.price || 0), // store total price
            };
          }
        });

        setCart(updatedCart);
        setModalOpen(false);
        setVariationQty({}); // reset modal quantities
      } else {
        alert("Failed to add to cart.");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding to cart. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

 useEffect(() => {
  console.log("selectedCust:",selectedCust);
}, [selectedCust]);

  return (
    <Fragment>
      {/* Product List */}
      <Toast ref={toast} />

      <Row className="match-height mb-2">
        <Col md="12">
          <Row>
            {loading && page === 1 ? (
              <div className="text-center my-5">
                <Spinner color="primary" />
              </div>
            ) : (
              tableData.results.map((product, index) => {
                // {{debugger}}

                return (
                  <Col md="3" xs="12" key={index} className="mb-3">
                    <ProductCard
                      product={product}
                      handleAddItemClick={handleAddItemClick}
                      cart={cart}
                    />
                  </Col>
                );
              })
            )}
          </Row>
          {/* Load More */}
          {tableData.results.length < tableData.count && (
            <div className="text-center mt-2">
              <Button
                color="primary"
                size="sm"
                style={{ width: "150px" }}
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </Col>
      </Row>

     <div className="d-flex justify-content-end">
  <Button
    color="primary"
    size="sm"
    type="submit"
    onClick={() => handleMakePayment()}
    disabled={!selectedCust}
  >
    Make Payment
  </Button>
</div>


      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        centered
        size="lg"
      >
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {selectedProduct?.name}
        </ModalHeader>
        <ModalBody>
          <div className="row">
            {/* LEFT: Images */}
            <div className="col-md-5 d-flex flex-column align-items-center">
              {/* {productIma.length > 0 && ( */}
              <div
                style={{
                  width: "100%",
                  height: "250px",
                  position: "relative",
                }}
              >
                {imgLoading ? (
                  <>
                    {" "}
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <Lottie
                        animationData={noImgSpinner}
                        loop={true}
                        style={{ width: "100%", height: 200 }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={productIma}
                      alt={selectedProduct?.name || "Product"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "8px",
                        transition: "all 0.3s ease", // smooth transition when changing images
                      }}
                      onError={(e) => {
                        e.target.src = "img1"; // fallback if image fails to load
                      }}
                    />
                  </>
                )}
                {/* {currentImage > 0 && (
                    <Button
                      size="sm"
                      className="position-absolute top-50 start-0 translate-middle-y"
                      onClick={() => setCurrentImage(currentImage - 1)}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                  )}
                  {currentImage < productIma.length - 1 && (
                    <Button
                      size="sm"
                      className="position-absolute top-50 end-0 translate-middle-y"
                      onClick={() => setCurrentImage(currentImage + 1)}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  )} */}
              </div>
              {/* )} */}
              <div className="d-flex mt-2 gap-1 flex-wrap justify-content-center">
                {/* {productIma?.map((img, idx) => ( */}

                {imgLoading ? (
                  <>
                    {" "}
                    <div className="flex items-center justify-center w-full h-full">
                      <Lottie
                        animationData={noImgSpinner}
                        loop={true}
                        style={{ width: 50, height: 50 }}
                      />
                    </div>
                  </>
                ) : (
                  <img
                    // key={idx}
                    src={productIma}
                    alt="thumb"
                    // onClick={() => setCurrentImage(idx)}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      cursor: "pointer",
                      borderRadius: "4px",
                      // border:
                      //   idx === currentImage
                      //     ? "2px solid #007bff"
                      //     : "1px solid #ccc",
                    }}
                  />
                )}
                {/* ))} */}
              </div>
            </div>

            {/* RIGHT: Product Details */}
            <div className="col-md-7">
              <h5>
                {selectedProduct?.variations?.length > 0
                  ? (() => {
                      const prices = selectedProduct.variations.map(
                        (v) => v.finalAmount || v.price || 0
                      );
                      const minPrice = Math.min(...prices);
                      const maxPrice = Math.max(...prices);
                      return minPrice === maxPrice
                        ? `$${minPrice.toFixed(2)}`
                        : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
                    })()
                  : `$${selectedProduct?.price?.toFixed(2)}`}
              </h5>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {selectedProduct?.description}
              </p>

              {/* Specifications */}
              {selectedProduct?.specifications?.length > 0 && (
                <ul style={{ fontSize: "13px", paddingLeft: "18px" }}>
                  {selectedProduct.specifications.map((spec) => (
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
                  {selectedProduct.variations.map((variation) => {
                    const attrs = variation.attributes
                      .map((a) => `${a.attributeName}: ${a.value}`)
                      .join(" / ");
                    const qty = variationQty[variation.uid] || 0;

                    return (
                      <div
                        key={variation.uid}
                        className="d-flex flex-column mb-2"
                      >
                        <strong>{attrs}</strong>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <Button
                            size="sm"
                            outline
                            color="primary"
                            onClick={() =>
                              setVariationQty((prev) => ({
                                ...prev,
                                [variation.uid]: Math.max(
                                  0,
                                  (prev[variation.uid] || 0) - 1
                                ),
                              }))
                            }
                          >
                            −
                          </Button>
                          <span>{qty}</span>
                          <Button
                            size="sm"
                            outline
                            color="primary"
                            onClick={() =>
                              setVariationQty((prev) => ({
                                ...prev,
                                [variation.uid]: (prev[variation.uid] || 0) + 1,
                              }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="secondary"
            size="sm"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm"
            disabled={loadingSubmit}
            onClick={handleAddToCart}
          >
            {loadingSubmit ? <span>Loading...</span> : "Add to Cart"}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default ProductPage;
