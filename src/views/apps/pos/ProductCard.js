import { useEffect, useState } from "react";

import { ShoppingCart } from "react-feather";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardText } from "reactstrap";
import noImages from "../../../assets/images/noImages.png";
import VariantListModal from "./modal/VariantListModal";

import useJwt from "@src/auth/jwt/useJwt";

const ProductCard = ({ productDetails }) => {
  const [imagesUrl, setImagesUrl] = useState(null);
  const [imageLoader, setImageLoader] = useState(false);
  const [openVariantModal, setOpenVariantModal] = useState(false);

  

  const { isCutomerSelected } = useSelector((state) => state.productSlice);

  // ** Fetch Images

  useEffect(() => {
    (async () => {
      try {
        setImageLoader(true);

        // fetch images from backend
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

  return (
    <>
      <Card className="ecommerce-card">
        <div className="item-img text-center mx-auto border-bottom p-2">
          <Link to="/apps/ecommerce/product-detail/sample-product">
            <img
              className="img-fluid"
              src={imagesUrl || noImages}
              alt="Sample Product"
            />
          </Link>
        </div>
        <CardBody>
          <div className="item-wrapper">
            <div className="item-cost">
              <h6 className="item-price">
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
          <div className="item-name">{productDetails.name}</div>
          <CardText className="item-description">
            {productDetails.description.length > 50
              ? productDetails.description.substring(0, 50) + "..."
              : productDetails.description}
          </CardText>
        </CardBody>

        <Button
          color="primary"
          className="btn-cart move-cart"
          block
          disabled={!isCutomerSelected}
          style={{ borderRadius: 0 }}
          onClick={() => setOpenVariantModal((boo) => !boo)}
        >
          <ShoppingCart className="me-50" size={14} />
          <span>Add To Cart</span>
        </Button>
      </Card>

      <VariantListModal
        isOpen={openVariantModal}
        toggle={() => setOpenVariantModal((boo) => !boo)}
        prDetails={productDetails}
      />
    </>
  );
};

export default ProductCard;
