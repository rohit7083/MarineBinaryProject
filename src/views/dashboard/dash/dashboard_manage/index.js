// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Custom Components
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX, File } from "react-feather";
import OccupiedIcon from "../../../../assets/icons/occupied.png";
import all from "../../../../assets/icons/all.png";
import emptyIcon from "../../../../../src/assets/icons/empty-set.png";
import waitingIcon from "../../../../assets/icons/waiting.png";
import offlineIcon from "../../../../assets/icons/offlineIcon.png";
import occupie from '../../../../assets/icons/occupied.png';
import empty2 from '../../../../assets/icons/empty2.png';
import waitingTime from '../../../../assets/icons/waitingTime.png'

import offline2 from '../../../../assets/icons/offline2.png'
// ** Styles
import "@styles/react/apps/app-users.scss";
import { useState } from "react";

const UsersList = ({ count, emptySlip, occupied }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const getCardStyle = (key) => ({
    border:"1px solid black",
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
        {/*         
        <Col md="4">
          <div className="d-flex align-items-center rounded shadow-sm p-1">
            <img
              src={allIcon}
              height={25}
              width={25}
              className="me-2"
              style={iconStyle}
            />
            <div>
              <strong
                className="text-uppercase  d-block"
                style={{ fontSize: "10px", marginBottom: "0.2rem" }}
              >
                Total Slips
              </strong>
              <p className="mb-0 fw-bold fs-4">01</p>
            </div>
          </div>
        </Col>
        <Col md="2">
          <div
            className="d-flex align-items-center rounded p-1"
            style={cardStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={emptyIcon}
              height={25}
              width={25}
              className="me-2"
              style={iconStyle}
            />
            <div>
              <strong
                className="text-uppercase d-block"
                style={{ fontSize: "10px", marginBottom: "0.2rem" }}
              >
                Empty
              </strong>
              <p className="mb-0 fw-bold fs-4">0</p>
            </div>
          </div>
        </Col>
        <Col md="2">
          <div className="d-flex align-items-center rounded shadow-sm p-1">
            <img
              src={emptyIcon}
              height={25}
              width={25}
              className="me-2"
              style={iconStyle}
            />

            <div>
              <strong
                className="text-uppercase  d-block"
                style={{ fontSize: "10px", marginBottom: "0.2rem" }}
              >
                Occupied
              </strong>
              <p className="mb-0 fw-bold fs-4">0</p>
            </div>
          </div>
        </Col>
        <Col md="2">
          <div className="d-flex align-items-center rounded shadow-sm p-1">
            <img
              src={offlineIcon}
              height={25}
              width={25}
              className="me-2"
              style={iconStyle}
            />

            <div>
              <strong
                className="text-uppercase  d-block"
                style={{ fontSize: "10px", marginBottom: "0.2rem" }}
              >
                Offline
              </strong>
              <p className="mb-0 fw-bold fs-4">0</p>
            </div>
          </div>
        </Col>
        <Col md="2">
          <div className="d-flex align-items-center rounded shadow-sm p-1">
            <img
              src={waitingIcon}
              height={25}
              width={25}
              className="me-2"
              style={iconStyle}
            />

            <div>
              <strong
                className="text-uppercase  d-block"
                style={{ fontSize: "10px", marginBottom: "0.2rem" }}
              >
                Waiting
              </strong>
              <p className="mb-0 fw-bold fs-4">0</p>
            </div>
          </div>
        </Col> */}

        <Col md="4">

        
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

{/* <svg
                  xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="2em"
      height="2em"
className="me-2"
              style={getIconStyle("empty")}    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M4 21.4V2.6a.6.6 0 0 1 .6-.6h11.652a.6.6 0 0 1 .424.176l3.148 3.148A.6.6 0 0 1 20 5.75V21.4a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6"></path>
        <path d="M16 2v3.4a.6.6 0 0 0 .6.6H20"></path>
      </g>
    </svg> */}
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

              {/* <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="2em"
      height="2em"
      className="me-2"
                    style={getIconStyle("offline")}

    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M93.72 183.25C49.49 198.05 16 233.1 16 288c0 66 54 112 120 112h184.37m147.45-22.26C485.24 363.3 496 341.61 496 312c0-59.82-53-85.76-96-88c-8.89-89.54-71-144-144-144c-26.16 0-48.79 6.93-67.6 18.14"
      ></path>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
        d="M448 448L64 64"
      ></path>
    </svg> */}
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

              {/* <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="2em"
      height="2em"
      className="me-2"
              style={getIconStyle("waiting")}
    >
      <g fill="none" fillRule="evenodd">
        <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
        <path
          fill="currentColor"
          d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1c0 1.441-.609 2.984-1.4 4.316A14.3 14.3 0 0 1 15.533 12a14.3 14.3 0 0 1 2.065 2.684C18.391 16.016 19 17.56 19 19v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1c0-1.441.609-2.984 1.4-4.316A14.3 14.3 0 0 1 8.467 12c-.756-.767-1.48-1.7-2.065-2.684C5.609 7.984 5 6.44 5 5zm12 0H7v1c0 .929.414 2.107 1.12 3.294c.696 1.17 1.609 2.236 2.458 2.933a1 1 0 0 1 0 1.546c-.85.697-1.762 1.763-2.458 2.933C7.414 16.893 7 18.071 7 19v1h10v-1c0-.929-.414-2.107-1.12-3.294c-.696-1.17-1.609-2.236-2.458-2.933a1 1 0 0 1 0-1.546c.85-.697 1.762-1.763 2.458-2.933C16.586 7.107 17 5.929 17 5z"
        ></path>
      </g>
    </svg> */}
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
