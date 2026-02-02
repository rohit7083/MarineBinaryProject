import { Col, Row } from "reactstrap";
import CartArea from "./CartArea";
import CustomerSearch from "./CustomerSearch";
import ProductArea from "./ProductArea";
import SearchBar from "./SearchBar";

// ** Hooks
import { useDispatch, useSelector } from "react-redux";

// ** Actions
import { useEffect, useState } from "react";
import { fetchProducts } from "./store";

const index = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.productSlice);
const [resetAll,setResetAll]=useState(false);
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <Row className="gy-2">
      {/* Top row: Search bars */}
      <Col xs={12} md={8} className="mt-2">
        <SearchBar />
      </Col>
      <Col xs={12} md={4} className="mt-2">
        <CustomerSearch />
      </Col>

      {/* Main content area */}
      <Col xs={12} md={8} className="mt-1">
        <ProductArea />
      </Col>
      <Col xs={12} md={4} className="mt-1">
        <CartArea />
      </Col>
    </Row>
  );
};

export default index;
