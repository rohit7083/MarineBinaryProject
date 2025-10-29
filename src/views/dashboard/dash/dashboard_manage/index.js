// ** Reactstrap Imports
import { Col, Row } from "reactstrap";

// ** Custom Components

// ** Icons Imports
import all from "../../../../assets/icons/all.png";
import empty2 from "../../../../assets/icons/empty2.png";
import occupie from "../../../../assets/icons/occupied.png";
import offline2 from "../../../../assets/icons/offline2.png";
import waitingTime from "../../../../assets/icons/waitingTime.png";
// ** Styles
import "@styles/react/apps/app-users.scss";
import { useState } from "react";

const UsersList = ({ count, emptySlip, occupied }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const getCardStyle = (key) => ({
    border: "1px solid black",
    backgroundColor: "#F8F8FF",
    transition: "all 0.3s ease",
    transform: hoveredCard === key ? "scale(1.02)" : "scale(1)",
    boxShadow:
      hoveredCard === key
        ? "0 6px 18px rgba(0, 0, 0, 0.2)"
        : "0 2px 6px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  });

  const getIconStyle = (key) => ({
    transition: "transform 0.4s ease",
    transform:
      hoveredCard === key
        ? "rotate(15deg) scale(1.2)"
        : "rotate(0deg) scale(1)",
  });

  return (
    <div className="app-user-list">
      <Row>
        <Col md="3">
          <div
            className="d-flex align-items-center rounded p-1"
            style={getCardStyle("all")}
            onMouseEnter={() => setHoveredCard("all")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <img
              src={all}
              height={30}
              width={30}
              className="me-2"
              style={getIconStyle("all")}
            />
            <div>
              <strong
                className="text-uppercase d-block"
                style={{ fontSize: "10px", marginBottom: "0.2rem" }}
              >
                Total Slips
              </strong>
              <p className="mb-0 fw-bold fs-4">{count}</p>
            </div>
          </div>
        </Col>

        <Col md="2">
          <div
            className="d-flex align-items-center rounded p-1"
            style={getCardStyle("empty")}
            onMouseEnter={() => setHoveredCard("empty")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <img
              src={empty2}
              height={30}
              width={30}
              className="me-2"
              style={getIconStyle("empty")}
            />

            <div>
              <strong
                className="text-uppercase d-block"
                style={{ fontSize: "10px", marginBottom: "0.2rem" }}
              >
                Empty
              </strong>
              <p className="mb-0 fw-bold fs-4">{emptySlip}</p>
            </div>
          </div>
        </Col>

        <Col md="2">
          <div
            className="d-flex align-items-center rounded p-1"
            style={getCardStyle("occupied")}
            onMouseEnter={() => setHoveredCard("occupied")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <img
              src={occupie}
              height={30}
              width={30}
              className="me-2"
              style={getIconStyle("occupied")}
            />
            <div>
              <strong
                className="text-uppercase d-block"
                style={{ fontSize: "10px", marginBottom: "0.2rem" }}
              >
                Occupied
              </strong>
              <p className="mb-0 fw-bold fs-4">{occupied}</p>
            </div>
          </div>
        </Col>

        <Col md="2">
          <div
            className="d-flex align-items-center rounded  p-1"
            style={getCardStyle("offline")}
            onMouseEnter={() => setHoveredCard("offline")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <img
              src={offline2}
              height={30}
              width={30}
              className="me-2"
              style={getIconStyle("offline")}
            />

            <div>
              <strong
                className="text-uppercase d-block"
                style={{ fontSize: "10px", marginBottom: "0.2rem" }}
              >
                Offline
              </strong>
              <p className="mb-0 fw-bold fs-4">0</p>
            </div>
          </div>
        </Col>

        <Col md="2">
          <div
            className="d-flex align-items-center rounded p-1"
            style={getCardStyle("waiting")}
            onMouseEnter={() => setHoveredCard("waiting")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <img
              src={waitingTime}
              height={30}
              width={30}
              className="me-2"
              style={getIconStyle("waiting")}
            />

            <div>
              <strong
                className="text-uppercase d-block"
                style={{ fontSize: "10px", marginBottom: "0.2rem" }}
              >
                Waiting
              </strong>
              <p className="mb-0 fw-bold fs-4">0</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UsersList;
