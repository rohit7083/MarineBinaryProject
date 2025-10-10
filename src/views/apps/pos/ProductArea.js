import { useState } from "react";
import { Col, Row, Spinner } from "reactstrap";
import ProductCard from "./ProductCard";

// ** Styles
import "@styles/base/pages/app-ecommerce.scss";

// ** Hooks
import { useSelector } from "react-redux";

const ProductArea = () => {
  // Total products (for now a mock array of 15)
  const products = new Array(15).fill(null);

  const { items, loading, error, filterItems } = useSelector(
    (state) => state.productSlice
  );

  // Pagination setup
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Get paginated products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const renderData = () => {
    if (filterItems.length) return filterItems;
    else return items;
  };

  // Render products
  const renderProducts = renderData().map((productDetails, index) => (
    <Col key={index} sm="6" md="4" lg="4">
      <ProductCard productDetails={productDetails} />
    </Col>
  ));

  const scrollHeight = "600px";
  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spinner color="primary" size={20} />
      </div>
    );
  } else if (!loading && error) {
    return <div>Error: {error}</div>;
  } else
    return (
      <>
        <div
          style={{
            height: "750px", // 50% of viewport height
            overflowY: "auto",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <Row className="ecommerce-application">{renderProducts}</Row>
          {/* Pagination */}
        </div>
        {/* <div className="d-flex justify-content-center mt-2">
          <Pagination>
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink
                previous
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem active={currentPage === i + 1} key={i}>
                <PaginationLink onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationLink
                next
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </Pagination>
        </div> */}
      </>
    );
};

export default ProductArea;

// checkCustomerSelected
