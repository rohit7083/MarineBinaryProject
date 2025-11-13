// ** Invoice Add Components
// import SellPass from '../../../views/dashboard/parking_pass/SellPass'

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
import SellPass from "./SellPass";

const Park_Pass = () => {
  return (
    <div className="invoice-add-wrapper">
      <Row className="invoice-add">
        <Col xl={12} md={12} sm={12}>
          <SellPass />
        </Col>
        <Col xl={12} md={12} sm={12}></Col>
      </Row>
    </div>
  );
};

export default Park_Pass;
