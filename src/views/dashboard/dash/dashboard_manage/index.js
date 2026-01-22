// // ** Reactstrap Imports
// import { Col, Row } from "reactstrap";

// import all from "../../../../assets/icons/all.png";
// import empty2 from "../../../../assets/icons/empty2.png";
// import occupie from "../../../../assets/icons/occupied.png";
// import offline2 from "../../../../assets/icons/offline2.png";
// import waitingTime from "../../../../assets/icons/waitingTime.png";
// // ** Styles
// import "@styles/react/apps/app-users.scss";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// const UsersList = ({
//   isOfflineCount,
//   waitingCount,
//   count,
//   emptySlip,
//   setClick,
//   occupied,
// }) => {
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const navigate = useNavigate();
//   const getCardStyle = (key) => ({
//     border: "1px solid black",
//     backgroundColor: "#F8F8FF",
//     transition: "all 0.3s ease",
//     transform: hoveredCard === key ? "scale(1.02)" : "scale(1)",
//     boxShadow:
//       hoveredCard === key
//         ? "0 6px 18px rgba(0, 0, 0, 0.2)"
//         : "0 2px 6px rgba(0, 0, 0, 0.1)",
//     cursor: "pointer",
//   });

//   const getIconStyle = (key) => ({
//     transition: "transform 0.4s ease",
//     transform:
//       hoveredCard === key
//         ? "rotate(15deg) scale(1.2)"
//         : "rotate(0deg) scale(1)",
//   });

//   return (
//     <div className="app-user-list">
//       <Row>
//         <Col md="3">
//           <div
//             className="d-flex align-items-center rounded p-1"
//             style={getCardStyle("all")}
//             onMouseEnter={() => setHoveredCard("all")}
//             onMouseLeave={() => setHoveredCard(null)}
//             onClick={(e) => setClick("all")}
//           >
//             <img
//               src={all}
//               height={30}
//               width={30}
//               className="me-2"
//               style={getIconStyle("all")}
//             />
//             <div>
//               <strong
//                 className="text-uppercase d-block"
//                 style={{ fontSize: "10px", marginBottom: "0.2rem" }}
//               >
//                 Total Slips
//               </strong>
//               <p className="mb-0 fw-bold fs-4">{count}</p>
//             </div>
//           </div>
//         </Col>

//         <Col md="2">
//           <div
//             className="d-flex align-items-center rounded p-1"
//             style={getCardStyle("empty")}
//             onMouseEnter={() => setHoveredCard("empty")}
//             onMouseLeave={() => setHoveredCard(null)}
//             onClick={(e) => setClick("empty")}
//           >
//             <img
//               src={empty2}
//               height={30}
//               width={30}
//               className="me-2"
//               style={getIconStyle("empty")}
//             />

//             <div>
//               <strong
//                 className="text-uppercase d-block"
//                 style={{ fontSize: "10px", marginBottom: "0.2rem" }}
//               >
//                 Empty
//               </strong>
//               <p className="mb-0 fw-bold fs-4">{emptySlip}</p>
//             </div>
//           </div>
//         </Col>

//         <Col md="2">
//           <div
//             className="d-flex align-items-center rounded p-1"
//             style={getCardStyle("occupied")}
//             onMouseEnter={() => setHoveredCard("occupied")}
//             onMouseLeave={() => setHoveredCard(null)}
//             onClick={(e) => setClick("occupied")}
//           >
//             <img
//               src={occupie}
//               height={30}
//               width={30}
//               className="me-2"
//               style={getIconStyle("occupied")}
//             />
//             <div>
//               <strong
//                 className="text-uppercase d-block"
//                 style={{ fontSize: "10px", marginBottom: "0.2rem" }}
//               >
//                 Occupied
//               </strong>
//               <p className="mb-0 fw-bold fs-4">{occupied}</p>
//             </div>
//           </div>
//         </Col>

//         <Col md="2">
//           <div
//             className="d-flex align-items-center rounded  p-1"
//             style={getCardStyle("offline")}
//             onMouseEnter={() => setHoveredCard("offline")}
//             onMouseLeave={() => setHoveredCard(null)}
//             onClick={(e) => setClick("offline")}
//           >
//             <img
//               src={offline2}
//               height={30}
//               width={30}
//               className="me-2"
//               style={getIconStyle("offline")}
//             />

//             <div>
//               <strong
//                 className="text-uppercase d-block"
//                 style={{ fontSize: "10px", marginBottom: "0.2rem" }}
//               >
//                 Offline
//               </strong>
//               <p className="mb-0 fw-bold fs-4">{isOfflineCount}</p>
//             </div>
//           </div>
//         </Col>

//         <Col md="2">
//           <div
//             className="d-flex align-items-center rounded p-1"
//             style={getCardStyle("waiting")}
//             onMouseEnter={() => setHoveredCard("waiting")}
//             onMouseLeave={() => setHoveredCard(null)}
//             onClick={() => navigate("/slip-management/waiting_slip")}
//           >
//             <img
//               src={waitingTime}
//               height={30}
//               width={30}
//               className="me-2"
//               style={getIconStyle("waiting")}
//             />

//             <div>
//               <strong
//                 className="text-uppercase d-block"
//                 style={{ fontSize: "10px", marginBottom: "0.2rem" }}
//               >
//                 Waiting
//               </strong>
//               <p className="mb-0 fw-bold fs-4">{waitingCount}</p>
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default UsersList;



// ** Reactstrap Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";

// ** Icons
import all from "../../../../assets/icons/all.png";
import empty2 from "../../../../assets/icons/empty2.png";
import occupie from "../../../../assets/icons/occupied.png";
import offline2 from "../../../../assets/icons/offline2.png";
import waitingTime from "../../../../assets/icons/waitingTime.png";

// ** Styles
import "@styles/react/apps/app-users.scss";

const UsersList = ({
  isOfflineCount,
  waitingCount,
  count,
  emptySlip,
  setClick,
  occupied,
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeCard, setActiveCard] = useState("all"); // default active
  const navigate = useNavigate();

  const getCardStyle = (key) => {
    const isActive = activeCard === key;
    const isHovered = hoveredCard === key;

    return {
      border: isActive ? "2px solid #7367f0" : "1px solid black",
      backgroundColor: isActive ? "#eae8fd" : "#F8F8FF",
      transition: "all 0.3s ease",
      transform: isHovered || isActive ? "scale(1.02)" : "scale(1)",
      boxShadow:
        isHovered || isActive
          ? "0 6px 18px rgba(115,103,240,0.35)"
          : "0 2px 6px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
    };
  };

  const getIconStyle = (key) => ({
    transition: "transform 0.4s ease",
    transform:
      hoveredCard === key || activeCard === key
        ? "rotate(15deg) scale(1.2)"
        : "rotate(0deg) scale(1)",
  });

  const handleClick = (key, action) => {
    setActiveCard(key);
    action?.();
  };

  return (
    <div className="app-user-list">
      <Row>
        <Col md="3">
          <div
            className="d-flex align-items-center rounded p-1"
            style={getCardStyle("all")}
            onMouseEnter={() => setHoveredCard("all")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleClick("all", () => setClick("all"))}
          >
            <img src={all} height={30} width={30} className="me-2" style={getIconStyle("all")} />
            <div>
              <strong className="text-uppercase d-block" style={{ fontSize: "10px" }}>
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
            onClick={() => handleClick("empty", () => setClick("empty"))}
          >
            <img src={empty2} height={30} width={30} className="me-2" style={getIconStyle("empty")} />
            <div>
              <strong className="text-uppercase d-block" style={{ fontSize: "10px" }}>
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
            onClick={() => handleClick("occupied", () => setClick("occupied"))}
          >
            <img src={occupie} height={30} width={30} className="me-2" style={getIconStyle("occupied")} />
            <div>
              <strong className="text-uppercase d-block" style={{ fontSize: "10px" }}>
                Occupied
              </strong>
              <p className="mb-0 fw-bold fs-4">{occupied}</p>
            </div>
          </div>
        </Col>

        <Col md="2">
          <div
            className="d-flex align-items-center rounded p-1"
            style={getCardStyle("offline")}
            onMouseEnter={() => setHoveredCard("offline")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleClick("offline", () => setClick("offline"))}
          >
            <img src={offline2} height={30} width={30} className="me-2" style={getIconStyle("offline")} />
            <div>
              <strong className="text-uppercase d-block" style={{ fontSize: "10px" }}>
                Offline
              </strong>
              <p className="mb-0 fw-bold fs-4">{isOfflineCount}</p>
            </div>
          </div>
        </Col>

        <Col md="2">
          <div
            className="d-flex align-items-center rounded p-1"
            style={getCardStyle("waiting")}
            onMouseEnter={() => setHoveredCard("waiting")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() =>
              handleClick("waiting", () =>
                navigate("/slip-management/waiting_slip")
              )
            }
          >
            <img src={waitingTime} height={30} width={30} className="me-2" style={getIconStyle("waiting")} />
            <div>
              <strong className="text-uppercase d-block" style={{ fontSize: "10px" }}>
                Waiting
              </strong>
              <p className="mb-0 fw-bold fs-4">{waitingCount}</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UsersList;
