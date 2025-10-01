import { useSelector } from 'react-redux';


import { Trash } from "react-feather";
import {
    Button,
    CardText,
    CardTitle,
    Col,
    Row,
    Table
} from "reactstrap";


const CartList = () => {

    const cartItem=useSelector(store=>store.cartSlice);
    console.log(cartItem)
  return (
   
    <Row>
      <Col>
      <CardTitle tag="h4">Cart Summery</CardTitle>
        <CardText className="small mb-2">Selected Product</CardText>
        <Table bordered hover responsive size="sm" className="mb-0">
          <thead className="small">
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="small">
            {[].map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td style={{ maxWidth: "80px" }}>
                  {/* <Input
                    bsSize="sm"
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={e => updateQty(item.id, parseInt(e.target.value))}
                  /> */}
                </td>
                <td>${getTotal(item.price, item.qty)}</td>
                <td>
                  <Button color="danger" size="sm" onClick={() => alert(item.id)}>
                    <Trash size={14} />
                  </Button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="3" className="text-end fw-bold small">
                Grand Total
              </td>
              <td colSpan="2" className="fw-bold small">
                ${0}
              </td>
            </tr>
          </tbody>
        </Table>
       <Button.Ripple className='round mt-2' color='dark' outline block>
          Proceed to Checkout
         </Button.Ripple>
      </Col>
    </Row>
  )
}

export default CartList