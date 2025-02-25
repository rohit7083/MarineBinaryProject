
// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  return (
    <div className='app-user-list'>
      <Row>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Total Slips'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>210</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Empty Slips'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>100</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Occupied Slips'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>90</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Waiting List'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>30</h3>}
          />
        </Col>
      </Row>
     
    </div>
  )
}

export default UsersList
