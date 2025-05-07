// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Custom Components
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX, File } from "react-feather";
import OccupiedIcon from '../../../../assets/icons/occupied.png'
import allIcon from '../../../../assets/icons/all.png'
import emptyIcon from '../../../../../src/assets/icons/empty-set.png'
// ** Styles
import "@styles/react/apps/app-users.scss";

const UsersList = ({ count, emptySlip, occupied }) => {
  return (
    <div className="app-user-list">
      <Row>
        <Col lg="4" sm="6">
          <StatsHorizontal
 
            statTitle="Total Slips"
            icon={
              <img
                src={allIcon}
                alt="emptyIcon"
                height={40}
                width={40}
              />
            }
            renderStats={<h3 className="fw-bolder mb-75">{count}</h3>}
          />
        
        </Col>
        <Col lg="4" sm="6">
          <StatsHorizontal
            statTitle="Empty Slips"
            icon={
              <img
                src={emptyIcon}
                alt="emptySlip"
                height={40}
                width={40}
              />
            }        
                renderStats={<h3 className="fw-bolder mb-75">{emptySlip}</h3>}
          />
        </Col>
        <Col lg="4" sm="6">
          <StatsHorizontal
            statTitle="Occupied Slips"
            icon={
              <img
                src={OccupiedIcon}
                alt="Occupied"
                height={40}
                width={40}
              />
            }
            renderStats={<h3 className="fw-bolder mb-75">{occupied}</h3>}
          />
        </Col>
      </Row>
    </div>
  );
};

export default UsersList;
