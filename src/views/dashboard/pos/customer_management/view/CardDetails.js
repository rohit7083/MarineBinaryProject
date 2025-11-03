import { Trash2 } from "react-feather"; // Feather icon
import {
  PaymentIcon,
  detectCardType,
} from "react-svg-credit-card-payment-icons";
import { Button } from 'reactstrap';
function CardDisplay() {
  // 🧩 Dummy card data (normally this would come from backend)
  const cardData = {
    cardNumber: "4111111111111234", // Visa starts with 4
    expiryMonth: "08",
    expiryYear: "2027",
    name: " Rohit Sonawane",
  };

  const { cardNumber, expiryMonth, expiryYear, name } = cardData;
  const cardType = detectCardType(cardNumber) || "visa"; // detect type automatically

  return (
    <div
      className="border rounded p-1 d-flex align-items-center justify-content-between"
      style={{
        maxWidth: 400,
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <PaymentIcon
          type={cardType.toLowerCase()}
          width={80}
          style={{ background: "#fff", borderRadius: 8 }}
        />

        <div>
          <small>{name}</small>
          <p className="mb-0 fw-semibold">
            **** **** **** {cardNumber.slice(-4)}
          </p>
          <small>
            Exp: {expiryMonth}/{expiryYear}
          </small>
        </div>
      </div>

     <Button
                  color="danger"
                  size="sm"
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 36,
                    height: 36,
                    padding: 0,
                  }}
                  onClick={() => alert("Card deleted (dummy action)")}
                >
                  <Trash2 size={16} />
                </Button>
    </div>
  );
}

export default CardDisplay;
