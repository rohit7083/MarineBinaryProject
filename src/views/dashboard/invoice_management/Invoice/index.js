// ** Invoice Add Components
import CreateInvoice from './CreateInvoice'
import AddActions from './AddActions'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/base/pages/app-invoice.scss'
import { Fragment } from 'react'

const Index = () => {
  return (
   <Fragment>
    
     <div className='invoice-add-wrapper'>
      <Row className='invoice-add'>
        <Col xl={9} md={8} sm={12}>
          <CreateInvoice />
        </Col>
        <Col xl={3} md={4} sm={12}>
        <AddActions />   
        </Col>
      </Row>
    </div>
   </Fragment>
  )
}

export default Index
