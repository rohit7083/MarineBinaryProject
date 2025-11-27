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
  } = summeryData;

  const revenueTableData = [
    { label: "Total Revenue", value: grandTotal },
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

  return (
    <div className="p-0">
      <Card className="shadow-sm border-0">
        <CardBody>
         

          <Row>
            {/* Revenue and Payer Details */}
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

            {/* Occupancy Statistics */}
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
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default MarinaStatistics;
