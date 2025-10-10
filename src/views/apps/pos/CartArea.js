import { Card, CardBody } from "reactstrap";
import CartList from "./CartList";
import MakePayment from "./MakePayment";

const CartArea = () => {
  return (
    <Card style={{ height: "700px" /* adjust height as needed */ }}>
      <CardBody
        style={{
          height: "100%",
          overflowY: "auto",
          paddingRight: "10px", // optional for scrollbar spacing
        }}
      >
        <CartList />
        <MakePayment />
      </CardBody>
    </Card>
  );
};

export default CartArea;
