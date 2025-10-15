import { useContext } from "react";
import { Col, Row } from "reactstrap";
import DailyGrossSales from "./DailyGrossSales";
import WeeklyGrossSales from "./WeeklyGrossSales";
import YearlySales from "./YearlySales";
// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";

function Index() {
  const { colors } = useContext(ThemeColors);

  return (
    <>
    
      <Col md="12">
        <DailyGrossSales />
      </Col>
      <Row>
        <Col md="12">
          <WeeklyGrossSales />
        </Col>
        <Col md="12">
          <YearlySales
            info={colors.info.main}
            warning={colors.warning.main}
          />
        </Col>
      </Row>
    </>
  );
}

export default Index;
