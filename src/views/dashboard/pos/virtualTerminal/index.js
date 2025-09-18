import React, { Fragment , useState ,useEffect} from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Other Components
import TerminalForm from "./Form"


function Index() {

 
  return (
    <Fragment>
      <h3>Virtual Terminal</h3>
      <Row>
        <Col sm="12">
          <TerminalForm />
        </Col>
      </Row>      
    </Fragment>
  )
}

export default Index
