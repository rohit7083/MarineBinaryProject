import { Col, Row } from "reactstrap";
import SalesSummery from "./SalesSummery";
import WeeklySales from "./WeeklySales";
import WeeklyTime from "./WeeklyTime";
function index() {
  return (
    <>
      <Col md="12">
        <SalesSummery />
      </Col>
      <Row>
      <Col md="12">
        <WeeklySales />
      </Col>
      <Col md="12">
        <WeeklyTime />
      </Col>
      </Row>
    </>
  );
}

export default index;
