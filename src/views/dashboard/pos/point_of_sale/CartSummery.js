import {
  CreditCard,
  Filter,
  Minus,
  Package,
  Plus,
  Search,
  Tag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ShoppingCart } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

export default function POS({ data = [] }) {
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(10);
  const [showCheckout, setShowCheckout] = useState(false);

  // Handle quantity changes
  const handleQtyChange = (variation, type) => {
    setCart((prev) => {
      const currentQty = prev[variation.uid]?.qty || 0;
      let newQty = currentQty;

      if (type === "increase") newQty += 1;
      if (type === "decrease" && currentQty > 0) newQty -= 1;

      const newCart = { ...prev };
      if (newQty === 0) delete newCart[variation.uid];
      else newCart[variation.uid] = { ...variation, qty: newQty };

      return newCart;
    });
  };

  // Unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(data.map((p) => p.category || "General"))];
    return ["all", ...cats];
  }, [data]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return data.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, selectedCategory]);

  // Cart calculations
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.finalAmount * item.qty,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const total = subtotal - discountAmount + taxAmount;
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Container fluid className="my-4">
      <Row>
        {/* Product List */}
        <Col lg="8" md="12">
          <Card className="mb-3">
            <CardBody>
              {/* Search & Filter */}
              <Row className="mb-3">
                <Col sm="8" className="mb-2 mb-sm-0">
                  <div className="position-relative">
                    <Search
                      size={16}
                      className="position-absolute"
                      style={{
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: "30px" }}
                    />
                  </div>
                </Col>
                <Col sm="4">
                  <div className="d-flex align-items-center gap-2">
                    <Filter size={16} />
                    <Input
                      type="select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </option>
                      ))}
                    </Input>
                  </div>
                </Col>
              </Row>

              {/* Product Grid */}
              <Row>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Col md="6" xs="12" key={product.uid} className="mb-3">
                      <Card className="h-100">
                        <CardBody>
                          <h5>{product.name}</h5>
                          <p className="text-muted">{product.description}</p>
                          {product.category && (
                            <div className="mb-2">
                              <Tag size={12} /> {product.category}
                            </div>
                          )}

                          {/* Variations */}
                          {product.variations?.map((variation) => {
                            const qty = cart[variation.uid]?.qty || 0;
                            return (
                              <div
                                key={variation.uid}
                                className="d-flex justify-content-between align-items-center border p-2 mb-2 rounded"
                              >
                                <div>
                                  <div>{variation.sku}</div>
                                  <div className="text-muted small">
                                    {variation.attributes
                                      ?.map(
                                        (attr) =>
                                          `${attr.attributeName}: ${attr.value}`
                                      )
                                      .join(", ")}
                                  </div>
                                  <div className="fw-bold text-success">
                                    ₹{variation.finalAmount}
                                  </div>
                                </div>

                                <div className="d-flex align-items-center gap-1">
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() =>
                                      handleQtyChange(variation, "decrease")
                                    }
                                    disabled={qty === 0}
                                  >
                                    <Minus size={14} />
                                  </Button>
                                  <span>{qty}</span>
                                  <Button
                                    color="success"
                                    size="sm"
                                    onClick={() =>
                                      handleQtyChange(variation, "increase")
                                    }
                                  >
                                    <Plus size={14} />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </CardBody>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <div className="text-center p-5">
                      <Package size={48} className="mb-2" />
                      <p>No products found.</p>
                    </div>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>

        {/* Cart Summary */}
        <Col lg="4" md="12">
          <Card className="sticky-top" style={{ top: "20px" }}>
            <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <ShoppingCart size={20} /> Cart Summary
              </div>
              <div>{totalItems} items</div>
            </CardHeader>
            <CardBody style={{ maxHeight: "400px", overflowY: "auto" }}>
              {cartItems.length === 0 ? (
                <div className="text-center text-muted p-5">
                  <ShoppingCart size={48} className="mb-2" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.uid}
                      className="d-flex justify-content-between align-items-center border-bottom pb-2"
                    >
                      <div>
                        <strong>{item.sku}</strong>
                        <div className="text-muted small">
                          {item.attributes
                            ?.map(
                              (attr) => `${attr.attributeName}: ${attr.value}`
                            )
                            .join(", ")}
                        </div>
                        <div>
                          ₹{item.finalAmount} × {item.qty} = ₹
                          {(item.finalAmount * item.qty).toFixed(2)}
                        </div>
                      </div>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() =>
                          setCart((prev) => {
                            const newCart = { ...prev };
                            delete newCart[item.uid];
                            return newCart;
                          })
                        }
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>

            {cartItems.length > 0 && (
              <CardFooter>
                <Row className="mb-2">
                  <Col>
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) =>
                        setDiscount(
                          Math.max(
                            0,
                            Math.min(100, parseFloat(e.target.value) || 0)
                          )
                        )
                      }
                      placeholder="Discount %"
                    />
                  </Col>
                  <Col>
                    <Input
                      type="number"
                      value={tax}
                      onChange={(e) =>
                        setTax(Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      placeholder="Tax %"
                    />
                  </Col>
                </Row>
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between text-success">
                    <span>Discount ({discount}%):</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between">
                  <span>Tax ({tax}%):</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold mt-2">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <div className="mt-3 d-flex gap-2 flex-wrap">
                  <Button
                    color="secondary"
                    onClick={() => setCart({})}
                    className="flex-fill"
                  >
                    Clear Cart
                  </Button>
                  <Button
                    color="success"
                    className="flex-fill"
                    onClick={() => setShowCheckout(true)}
                  >
                    <CreditCard size={16} /> Checkout
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </Col>
      </Row>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        toggle={() => setShowCheckout(false)}
        centered
      >
        <ModalHeader toggle={() => setShowCheckout(false)}>
          Checkout
        </ModalHeader>
        <ModalBody className="text-center">
          <CreditCard size={48} className="text-success mb-3" />
          <h3>₹{total.toFixed(2)}</h3>
          <p>Processing payment...</p>
          <Button
            color="success"
            onClick={() => {
              alert("Payment processed successfully!");
              setCart({});
              setShowCheckout(false);
            }}
          >
            Complete Payment
          </Button>
        </ModalBody>
      </Modal>
    </Container>
  );
}
