// import { Card, CardBody } from "reactstrap"

// const CartArea = () => {
//   return (
//     <>
//     <Card>
//       <CardBody>
//         Cart Area
//       </CardBody>

//     </Card>
//     </>
//   )
// }

// export default CartArea

import {
  Card,
  CardBody
} from "reactstrap";
import CartList from "./CartList";

const CartArea = () => {

  return (
  <Card className="">
  <CardBody className="">

<CartList/>
  </CardBody>
</Card>

  );
};

export default CartArea;
