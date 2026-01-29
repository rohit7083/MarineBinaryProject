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
    deposite = 0,
    totalRevenue: totalRevenueFromSummery = 0,

    // deposite=0,
  } = summeryData;

  const { totalRevenue = 0 } = summeryData?.slips?.[0] || {};

  const revenueTableData = [
    {
      label: "Total Revenue",
      value: <strong>${actualRevenueCollected?.toFixed(2)}</strong>,
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

//   const slipInformationData = [
//     { label: "Grand Total", value: actualRevenueCollected },
//     {
//       label: "Total Deposit",
//       value: deposite,
//     },
//     // { label: "", value: totalslip },

//     { label: "Total Slips", value: totalslip },
//     { label: "Occupied Slips (Physical)", value: occupied },
//     { label: "Paid Slips (Financial)", value: paidSlips },
//     { label: "Vacant Slips", value: vacantSlips },
//     { label: "Actual Revenue Collected", value: totalRevenue },
//     { label: "Occupancy Rate (Physical)", value: vacantSlips },
//     { label: "Occupancy Rate (Financial)", value: financialOccupancyRate },
//   ];

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
          {/* <Row className={"mt-2"}>
            <Col md={12}>
              <Table striped bordered hover responsive>
       
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
          </Row> */}
        </CardBody>
      </Card>
    </div>
  );
};

export default MarinaStatistics;

