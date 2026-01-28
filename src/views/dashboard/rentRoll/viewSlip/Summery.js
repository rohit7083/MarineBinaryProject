import { Card, CardBody, Col, Row, Table } from "reactstrap";

const MarinaStatistics = ({ summeryData }) => {
  if (!summeryData) return null;

  const {
    annual = 0,
    grandTotal = 0,
    monthly = 0,
    occupancyRate = 0,
    occupied = 0,
    totalslip = 0,
    vacantSlips = 0,
    financialOccupancyRate = 0,
    actualRevenueCollected = 0,
    paidSlips = 0,
    potentialFullRevenue = 0,
    // deposite=0,
  } = summeryData;

const { deposite = 0 } = summeryData?.slips?.[0] || {};

  const revenueTableData = [
    {
      label: "Total Revenue",
      value: (
        <strong>
          $
          {/* {grandTotal != null
            ? grandTotal.toFixed(2)
            : */}{" "}
          {actualRevenueCollected?.toFixed(2)}
        </strong>
      ),
    },
    { label: "Annual Payers", value: annual },
    { label: "Monthly Payers", value: monthly },
    { label: "Total Occupied (Annual + Monthly)", value: annual + monthly },
  ];

  const occupancyTableData = [
    { label: "Occupancy Rate", value: `${occupancyRate}%` },
    { label: "Total Slips", value: totalslip },
    { label: "Occupied Slips", value: occupied },
    { label: "Vacant Slips", value: vacantSlips },
  ];

  const slipInformationData = [
    { label: "Grand Total", value: grandTotal },
    {
      label: "Total Deposit",
      value: deposite,
    },
    // { label: "", value: totalslip },

    { label: "Total Slips", value: totalslip },
    { label: "Occupied Slips (Physical)", value: occupied },
    { label: "Paid Slips (Financial)", value: paidSlips },
    { label: "Vacant Slips", value: vacantSlips },
    { label: "Actual Revenue Collected", value: grandTotal },
    { label: "Occupancy Rate (Physical)", value: vacantSlips },
    { label: "Occupancy Rate (Financial)", value: financialOccupancyRate },
  ];

  return (
    <div className="p-0">
      <Card className="shadow-sm border-0">
        <CardBody>
          {/* <Row>
            <Col md="6">
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th colSpan="2" className="text-center">
                      Revenue & Payers
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {revenueTableData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.label}</td>
                      <td>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>

            <Col md="6">
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th colSpan="2" className="text-center">
                      Occupancy Statistics
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {occupancyTableData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.label}</td>
                      <td>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            
          </Row> */}

          <Row>
            {/* Row 1: Revenue + Occupancy */}
            <Col md={6}>
              <Table striped bordered hover responsive>
                {/* <thead className="table-dark">
        <tr>
          <th>Metric</th>
          <th className="text-end">Value</th>
        </tr>
      </thead> */}
                <tbody>
                  <tr className="table-success">
                    <td colSpan="2">
                      <strong>REVENUE DETAILS</strong>
                    </td>
                  </tr>

                  {revenueTableData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.label}</td>
                      <td className="text-end">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>

            <Col md={6}>
              <Table striped bordered hover responsive>
                {/* <thead className="table-dark">
        <tr>
          <th>Metric</th>
          <th className="text-end">Value</th>
        </tr>
      </thead> */}
                <tbody>
                  <tr className="table-info">
                    <td colSpan="2">
                      <strong>OCCUPANCY RATES</strong>
                    </td>
                  </tr>

                  {occupancyTableData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.label}</td>
                      <td className="text-end">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Row 2: Slip Information */}
          <Row className={"mt-2"}>
            <Col md={12}>
              <Table striped bordered hover responsive>
                {/* <thead className="table-dark">
        <tr>
          <th>Metric</th>
          <th className="text-end">Value</th>
        </tr>
      </thead> */}
                <tbody>
                  <tr className="table-primary">
                    <td colSpan="2">
                      <strong>SLIP INFORMATION</strong>
                    </td>
                  </tr>

                  {slipInformationData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.label}</td>
                      <td className="text-end">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default MarinaStatistics;

// import { useState } from 'react';
// import { Card, CardBody, Table } from 'reactstrap';

// const MarinaStatistics = () => {
//   const [activeDesign, setActiveDesign] = useState(1);

//   // Sample data based on your metrics
//   const metrics = {
//     totalSlips: 101,
//     occupiedSlips: 6,
//     paidSlips: 5,
//     vacantSlips: 95,
//     actualRevenue: 30920,
//     potentialRevenue: 769000,
//     rentGap: 738080,
//     potentialDeposits: 95000,
//     physicalOccupancy: 5.94,
//     financialOccupancy: 4.95
//   };

//   // Design 3: Compact Single Table
//   const Design3 = () => (
//     <Card className="shadow-sm border-0">
//       <CardBody>
//         <Table striped bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>Metric</th>
//               <th className="text-end">Value</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="table-primary">
//               <td colSpan="2"><strong>SLIP INFORMATION</strong></td>
//             </tr>
//             <tr>
//               <td>Total Slips</td>
//               <td className="text-end">{metrics.totalSlips}</td>
//             </tr>
//             <tr>
//               <td>Occupied Slips (Physical)</td>
//               <td className="text-end">{metrics.occupiedSlips}</td>
//             </tr>
//             <tr>
//               <td>Paid Slips (Financial)</td>
//               <td className="text-end">{metrics.paidSlips}</td>
//             </tr>
//             <tr>
//               <td>Vacant Slips</td>
//               <td className="text-end">{metrics.vacantSlips}</td>
//             </tr>
//             <tr className="table-success">
//               <td colSpan="2"><strong>REVENUE DETAILS</strong></td>
//             </tr>
//             <tr>
//               <td>Actual Revenue Collected</td>
//               <td className="text-end">${metrics.actualRevenue.toLocaleString()}</td>
//             </tr>
//             <tr>
//               <td>Potential Full Revenue</td>
//               <td className="text-end">${metrics.potentialRevenue.toLocaleString()}</td>
//             </tr>
//             <tr>
//               <td>Rent Gap (Missed Opportunity)</td>
//               <td className="text-end text-danger"><strong>${metrics.rentGap.toLocaleString()}</strong></td>
//             </tr>
//             <tr>
//               <td>Potential Deposits (Vacant)</td>
//               <td className="text-end">${metrics.potentialDeposits.toLocaleString()}</td>
//             </tr>
//             <tr className="table-info">
//               <td colSpan="2"><strong>OCCUPANCY RATES</strong></td>
//             </tr>
//             <tr>
//               <td>Occupancy Rate (Physical)</td>
//               <td className="text-end">{metrics.physicalOccupancy}%</td>
//             </tr>
//             <tr>
//               <td>Occupancy Rate (Financial)</td>
//               <td className="text-end">{metrics.financialOccupancy}%</td>
//             </tr>
//           </tbody>
//         </Table>
//       </CardBody>
//     </Card>
//   );

//   return (
//     <div className="p-0">

//      <Design3 />

//     </div>
//   );
// };

// export default MarinaStatistics;
