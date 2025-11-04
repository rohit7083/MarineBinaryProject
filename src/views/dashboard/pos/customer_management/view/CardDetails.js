import { Trash2 } from "react-feather";
import * as PaymentIcons from "react-payment-icons";
import { Button } from "reactstrap";

// simple local helper to detect card type
function detectCardType(number) {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6/,
  };
  for (const [type, regex] of Object.entries(patterns)) {
    if (regex.test(number)) return type;
  }
  return "visa"; // default fallback
}

function CardDisplay() {
  const cardData = {
    cardNumber: "4111111111111234",
    expiryMonth: "08",
    expiryYear: "2027",
    name: "Rohit Sonawane",
  };

  const { cardNumber, expiryMonth, expiryYear, name } = cardData;
  const cardType = detectCardType(cardNumber);

  // map detected card type to the proper component
  const cardTypeMap = {
    visa: PaymentIcons.Visa,
    mastercard: PaymentIcons.Mastercard,
    amex: PaymentIcons.Amex,
    discover: PaymentIcons.Discover,
  };
  const Icon = cardTypeMap[cardType] || PaymentIcons.Visa;

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
        <Icon style={{ width: 80, background: "#fff", borderRadius: 8 }} />

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
        style={{ width: 36, height: 36, padding: 0 }}
        onClick={() => alert("Card deleted (dummy action)")}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}

export default CardDisplay;
