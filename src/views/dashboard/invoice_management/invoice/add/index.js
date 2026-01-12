// ** Invoice Add Components
import AddCard from "./AddCard";

// ** Reactstrap Imports
import { Col, Row } from "reactstrap";

// ** Styles
import "@styles/base/pages/app-invoice.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";

const InvoiceAdd = () => {
  return (
    <div className="invoice-add-wrapper">
      <Row className="invoice-add">
        <Col xl={12} md={12} sm={12}>
          <AddCard />
        </Col>
        {/* <Col xl={3} md={4} sm={12}>
          <AddActions />
        </Col> */}
      </Row>
    </div>
  );
};

export default InvoiceAdd;
