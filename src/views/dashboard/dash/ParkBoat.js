// import React from "react";
// import { Row, Col, Card, CardBody, CardText, Button, Badge } from "reactstrap";

// function ParkBoat() {

//   return (
//     <div className="p-2">
//       <Card className="bg-light">
//         <CardBody>
//           <Row>
//             {[...Array(4)].map((_, index) => (
//               <Col key={index} xl="3" lg="3" md="6" sm="12" className="mb-2">
//                 <Card className="card-congratulations-medal h-100">
//                   <CardBody>
//                     <div className="d-flex justify-content-between align-items-center mb-1">
//                       <h5># 1001</h5>

//                       <Badge color="light-secondary">H-10 W-20 L-1</Badge>
//                     </div>
//                     <CardText className="d-flex justify-content-end align-items-center font-small-6">
//                   <strong>Uncovered</strong>

//                     </CardText>
//                     <CardText className="d-flex justify-content-end align-items-center font-small-6">
//                     02-05-2024
//                     </CardText>
//                     <img width={40} height={80} src="src/assets/images/boat2.png"/>
//                   </CardBody>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </CardBody>
//       </Card>
//     </div>
//   );
// }

// export default ParkBoat;
// import React from "react";
// import { Row, Col, Card, CardBody, CardText, Button, Badge } from "reactstrap";

// function ParkBoat() {

//   return (
//     <div className="p-2">
//       <Card className="bg-light">
//         <CardBody>
//           <Row>
//             {[...Array(4)].map((_, index) => (
//               <Col key={index} xl="3" lg="3" md="6" sm="12" className="mb-2">
//                 <Card className="card-congratulations-medal h-100">
//                   <CardBody>
//                     <div className="d-flex justify-content-between align-items-center mb-1">
//                       <h5># 1001</h5>

//                       <Badge color="light-secondary">H-10 W-20 L-1</Badge>
//                     </div>
//                     <CardText className="d-flex justify-content-end align-items-center font-small-6">
//                   <strong>Uncovered</strong>

//                     </CardText>
//                     <CardText className="d-flex justify-content-end align-items-center font-small-6">
//                     02-05-2024
//                     </CardText>
//                     <img width={40} height={80} src="src/assets/images/boat2.png"/>
//                   </CardBody>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </CardBody>
//       </Card>
//     </div>
//   );
// }

// export default ParkBoat;

// import React from "react";
// import { Row, Col, Card, CardBody, CardText, Button, Badge } from "reactstrap";

// function ParkBoat() {

//   return (
//     <div className="p-2">
//       <Card className="bg-light">
//         <CardBody>
//           <Row>
//             {[...Array(4)].map((_, index) => (
//               <Col key={index} xl="3" lg="3" md="6" sm="12" className="mb-2">
//                 <Card className="card-congratulations-medal h-100">
//                   <CardBody>
//                     <div className="d-flex justify-content-between align-items-center mb-1">
//                       <h5># 1001</h5>

//                       <Badge color="light-secondary">H-10 W-20 L-1</Badge>
//                     </div>
//                     <CardText className="d-flex justify-content-end align-items-center font-small-6">
//                   <strong>Uncovered</strong>

//                     </CardText>
//                     <CardText className="d-flex justify-content-end align-items-center font-small-6">
//                     02-05-2024
//                     </CardText>
//                     <img width={40} height={80} src="src/assets/images/boat2.png"/>
//                   </CardBody>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </CardBody>
//       </Card>
//     </div>
//   );
// }

// export default ParkBoat;


import React from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Badge,
  InputGroup,
  Input,
  InputGroupText,
} from "reactstrap";
import { Search } from "react-feather";

function ParkBoat() {
  const boatData = [
    {
      id: 1001,
      h: "H-10",
      w: "W-10",
      l: "L-5",
      type: "Uncovered",
      date: "02-05-2024",
    },
    {
      id: 1002,
      h: "H-8",
      w: "W-18",
      l: "L-2",
      type: "Covered",
      date: "03-05-2024",
    },
    {
      id: 1003,
      h: "H-12",
      w: "W-22",
      l: "L-1",
      type: "Uncovered",
      date: "04-05-2024",
    },
    {
      id: 1004,
      h: "H-9",
      w: "W-19",
      l: "L-2",
      type: "Covered",
      date: "05-05-2024",
    },
  ];

  return (
    <>
      <div className="p-3">
        <Card className="bg-light shadow-sm border-0 rounded">
          <CardBody>
            <InputGroup className="input-group-merge mb-2">
              <InputGroupText>
                <Search size={14} />
              </InputGroupText>
              <Input placeholder="search..." />
            </InputGroup>
            <Row>
              {boatData.map((boat, index) => (
                <Col key={index} xl="3" lg="4" md="6" sm="12" className="mb-4">
                  <Card className="h-100 shadow rounded hover-card boat-card">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="text-primary mb-0"># {boat.id}</h5>
                        <Badge color="dark" pill>
                          {boat.h}
                        </Badge>
                        <Badge color="primary" pill>
                          {boat.w}
                        </Badge>
                        <Badge color="warning" pill>
                          {boat.l}
                        </Badge>
                      </div>

                      <div className="mb-2">
                        <CardText className="mb-1">
                          <strong>Status:</strong> {boat.type}
                        </CardText>
                        <CardText>
                          <strong>Date:</strong> {boat.date}
                        </CardText>
                      </div>

                      <div className="text-center">
                        
                        <img
                          src="src/assets/images/updatedboat2.png"
                          className="boat-enter-float"
                          alt="Boat"
                          style={{
                            width: "170px",
                            height: "auto",
                            marginTop: "10px",
                          }}
                        />
                      </div>
                      
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>

        {/* Styles */}
        <style>
  {`
    .hover-card:hover {
      transform: scale(1.03);
      transition: 0.3s ease-in-out;
      border: 1px solid rgb(19, 19, 18);
    }

    .boat-card {
      background: linear-gradient(to bottom, rgb(255, 255, 255), rgb(37, 155, 179));
      border-radius: 20px 20px 60px 60px;
      position: relative;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      overflow: hidden;
      border: 1px solid #b2ebf2;
    }

    .boat-card::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 10%;
      width: 80%;
      height: 40px;
      background: #8d6e63;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .boat-card::before {
      content: '';
      position: absolute;
      bottom: -25px;
      left: 20%;
      width: 60%;
      height: 15px;
      background: radial-gradient(circle, rgb(36, 84, 90) 20%, transparent 80%);
      opacity: 0.6;
    }

    @keyframes enterFromTop {
      0% {
        transform: translateY(-100px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes floatUpDown {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
      100% {
        transform: translateY(0);
      }
    }

    .boat-enter-float {
      animation:
        enterFromTop 0.8s ease-out forwards,
        floatUpDown 2s ease-in-out infinite;
      animation-delay: 0s, 0.8s;
    }
  `}
</style>

      </div>
    </>
  );
}

export default ParkBoat;

