// ** Third Party Components
import classnames from "classnames";
import { Activity, DollarSign, User, Users } from "react-feather";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import { Card, CardBody, CardText, Col, Row } from "reactstrap";

const StatsCard = ({ cols, summeryData }) => {
  if (!summeryData) return null; // Handle initial undefined state

  const {
    annual = 0,
    grandTotal = 0,
    monthly = 0,

    totalslip = 0,
  } = summeryData;

  const data = [
    {
      title: grandTotal,

      subtitle: "Revenue",
      color: "light-success",
      icon: <DollarSign size={24} />,
    },
    {
      title: annual,
      subtitle: "Annual Payers",
      color: "light-info",
      icon: <Users size={24} />,
    },
    {
      title: monthly,
      subtitle: "Monthly Payers",
      color: "light-danger",
      icon: <User size={24} />,
    },
    {
      title: annual + monthly,
      subtitle: "Total Occupied",
      color: "light-primary",
      icon: <Activity size={24} />,
    },
  ];

  const renderData = () => {
    return data.map((item, index) => {
      const colMargin = Object.keys(cols);
      const margin = index === 2 ? "sm" : colMargin[0];
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-1 mb-${margin}-0`]: index !== data.length - 1,
          })}
        >
          <div
            className="d-flex align-items-center shadow-sm  "
            style={{
              backgroundColor: "#fff",
              border: "1px solid #6E6B7B",
              borderRadius: "8px",
              paddingTop: "14px",
              paddingBottom: "11px",
              paddingLeft: "10px",
            }}
          >
            <Avatar color={item.color} icon={item.icon} className="me-2" />
            <div className="my-auto">
              <h4 className="fw-bolder mb-0">{item.title}</h4>
              <CardText className="font-small-3 mb-0">{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      );
    });
  };

  return (
    <Card className="card-statistics">
      <CardBody className="statistics-body">
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  );
};

export default StatsCard;
