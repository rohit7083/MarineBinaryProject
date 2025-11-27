import { Fragment } from "react";

// ** Custom Components

// ** Third Party Components
import { Col, Row } from "reactstrap";

// ** Other Components
import TableZeroConfig from "./tableViewSlip";

function Index() {
  return (
    <Fragment>
      
      <Row>
        <Col sm="12">
          <TableZeroConfig />
        </Col>
      </Row>
    </Fragment>
  );
}

export default Index;
