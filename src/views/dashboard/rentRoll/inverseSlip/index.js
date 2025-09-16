import React, { Fragment , useState ,useEffect} from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

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
