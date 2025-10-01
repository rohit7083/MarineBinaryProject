import { Fragment } from 'react'

// ** Custom Components

// ** Third Party Components
import { Col, Row } from 'reactstrap'

// ** Other Components
import TableZeroConfig from './TableIversionSlip'



function Index() {



  return (
    <Fragment>
      <h3>Inverse Slip Rental</h3>
      <Row>
        <Col sm="12">
          <TableZeroConfig />
        </Col>
      </Row>      
    </Fragment>
  )
}

export default Index
