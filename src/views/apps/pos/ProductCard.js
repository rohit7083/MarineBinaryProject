import { useEffect, useRef, useState } from "react";

import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { ShoppingCart } from "react-feather";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, CardText } from "reactstrap";
import noImages from "../../../assets/images/noImages.png";
import VariantListModal from "./modal/VariantListModal";

const ProductCard = ({ productDetails }) => {
  const [imagesUrl, setImagesUrl] = useState(null);
  const [imageLoader, setImageLoader] = useState(false);
  const [openVariantModal, setOpenVariantModal] = useState(false);
  const { selectedCustomerDetails } = useSelector((store) => store.cartSlice);
  const toast = useRef(null);

  // ** Fetch Images

  useEffect(() => {
    (async () => {
      try {
        setImageLoader(true);
        const res = await useJwt.getImages(
          productDetails.variations[0]?.variationImages?.[0]?.uid
        );
        setImagesUrl(URL.createObjectURL(res.data));
      } catch (e) {
        console.error(e);
      } finally {
        setImageLoader(false);
      }
    })();
    return () => {
      setImagesUrl(null);
      setImageLoader(false);
      setOpenVariantModal(false);
    };
  }, []);

  const handleAddToCartClick = () => {
    if (selectedCustomerDetails.emailId) {
      setOpenVariantModal((prev) => !prev);
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Customer Required",
        detail: "Please select a customer before proceeding",
        life: 2000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />

      <Card
        className="ecommerce-card shadow-sm"
        style={{
          maxWidth: "220px", // smaller card width
          fontSize: "0.85rem", // smaller text
          borderRadius: "10px",
        }}
      >
        <div
          className="item-img text-center mx-auto border-bottom p-1"
          style={{ padding: "0.5rem" }}
        >
          <img
            src={imagesUrl || noImages}
            alt="Sample Product"
            className="img-fluid mx-auto d-block rounded"
            style={{
              maxWidth: "120px", // reduced image size
              aspectRatio: "1 / 1",
              objectFit: "cover",
            }}
          />
        </div>

        <CardBody className="p-2">
          <div className="item-wrapper">
            <div className="item-cost mb-1">
              <h6 className="item-price mb-0" style={{ fontSize: "0.9rem" }}>
                {productDetails.variations &&
                productDetails.variations.length > 0
                  ? (() => {
                      const amounts = productDetails.variations.map(
                        (v) => v.finalAmount
                      );
                      const min = Math.min(...amounts);
                      const max = Math.max(...amounts);
                      return min === max ? `$${min}` : `$${min} - $${max}`;
                    })()
                  : null}
              </h6>
            </div>
          </div>

          <div className="item-name mb-1" style={{ fontSize: "0.9rem" }}>
            <strong>{productDetails.name}</strong>
          </div>

          <CardText
            className="item-description mb-2"
            style={{ fontSize: "0.8rem", lineHeight: "1.2" }}
          >
            {productDetails.description.length > 50
              ? productDetails.description.substring(0, 20) + "..."
              : productDetails.description}
          </CardText>
        </CardBody>

        <Button
          color="primary"
          className="btn-cart move-cart"
          block
          style={{
            borderRadius: "0 0 10px 10px",
            padding: "0.4rem 0",
            fontSize: "0.8rem",
          }}
          onClick={handleAddToCartClick}
        >
          <ShoppingCart className="me-50" size={12} />
          <span>Add To Cart</span>
        </Button>
      </Card>

      {openVariantModal ? (
        <VariantListModal
          isOpen={openVariantModal}
          toggle={() => setOpenVariantModal((boo) => !boo)}
          prDetails={productDetails}
        />
      ) : null}
    </>
  );
};

export default ProductCard;
