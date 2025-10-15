import useJwt from "@src/auth/jwt/useJwt";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Select from "react-select";
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Row,
  Spinner,
} from "reactstrap";

const customStyles = {
  control: (base) => ({
    ...base,
    minHeight: 30,
    fontSize: 14,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: 4,
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: 4,
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 6px",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
};

const ApexChartCard = () => {
  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [load, setLoad] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [nexData, setNextData] = useState({});
  const options = [
    { value: "3", label: "This Week vs Last Week" },
    { value: "2", label: "This Week vs Same Week Last Month" },
    { value: "1", label: "This Week vs Same Week Last Year" },
  ];

  const handleChange = (selected) => {
    setSelectedOption(selected);
  };

  useEffect(() => {
    const fetchWeeklySales = async () => {
      if (!selectedOption) return;

      setLoad(true);
      try {
        const res = await useJwt.weeklySales(selectedOption.value);
        const data = res?.data?.data || {};
        setNextData(res?.data);
        // Extract keys (week ranges)
        const weeks = Object.keys(data);
        if (weeks.length < 2) throw new Error("Unexpected API structure");

        const currentWeekData = data[weeks[0]]; // "2025-10-13 to 2025-10-19"
        const previousWeekData = data[weeks[1]]; // "2024-10-07 to 2024-10-19"

        const categories = Object.keys(currentWeekData); // ["MONDAY", "TUESDAY", ...]
        const currentSeries = categories.map(
          (day) => currentWeekData[day]?.totalAmount || 0
        );
        const previousSeries = categories.map(
          (day) => previousWeekData[day]?.totalAmount || 0
        );
        const DatesData = res?.data;
        function formatDate(dateStr) {
          if (!dateStr) return "";
          const date = new Date(dateStr);

          const day = String(date.getDate()).padStart(2, "0"); // 2-digit day
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const month = monthNames[date.getMonth()];
          const year = String(date.getFullYear()).slice(-2); // last 2 digits

          return `${day} ${month} ${year}`; // e.g., "08 Sep 25"
        }
        setChartData({
          series: [
            {
              name: `Previous (${formatDate(
                DatesData?.compareWeekStart
              )}-${formatDate(DatesData?.compareWeekEnd)})`,
              data: previousSeries,
            },
            {
              name: `Current (${formatDate(
                DatesData?.currentWeekStart
              )}-${formatDate(DatesData?.currentWeekEnd)})`,
              data: currentSeries,
            },
          ],

          options: {
            chart: { type: "bar", height: 350 },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 5,
                borderRadiusApplication: "end",
              },
            },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ["transparent"] },
            xaxis: { categories },
            yaxis: { title: { text: "$ (totalAmount)" } },
            fill: { opacity: 1 },
            tooltip: { y: { formatter: (val) => `$ ${val}` } },
          },
        });
      } catch (error) {
        console.error("Error fetching weekly sales:", error);
      } finally {
        setLoad(false);
      }
    };

    fetchWeeklySales();
  }, [selectedOption]);

  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle tag="h4">Weekly Gross Sales</CardTitle>
          </Col>

          <Col xs="auto" className="d-flex align-items-center gap-1">
            <CardText className="mb-0">Comparision:</CardText>
            <Select
              id="exampleSelect"
              name="select"
              value={selectedOption}
              onChange={handleChange}
              options={options}
              placeholder="Choose an option"
              classNamePrefix="react-select"
              styles={{
                ...customStyles,
                container: (provided) => ({
                  ...provided,
                  width: "100%",
                  minWidth: 400,
                }),
              }}
            />
          </Col>
        </Row>
      </CardHeader>

      <CardBody>
        {load ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "250px" }}
          >
            <Spinner color="primary" />
            <span className="ms-2 text-muted">Loading chart data...</span>
          </div>
        ) : (
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default ApexChartCard;
