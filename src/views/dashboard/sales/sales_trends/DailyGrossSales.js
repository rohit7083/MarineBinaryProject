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
  control: (base) => ({ ...base, minHeight: 30, fontSize: 14 }),
  dropdownIndicator: (base) => ({ ...base, padding: 4 }),
  clearIndicator: (base) => ({ ...base, padding: 4 }),
  valueContainer: (base) => ({ ...base, padding: "0 6px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0 }),
};

const ApexChart = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [load, setLoad] = useState(false);

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        height: 350,
        type: "area",
        zoom: { enabled: false },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      xaxis: { categories: [], title: { text: "" } },
      yaxis: { title: { text: "Total Amount" } },
      tooltip: { x: { format: "hh:mm a" } },
    },
  });

  const options = [
    { value: "3", label: "This Day vs Last Day" },
    { value: "2", label: "This Day vs Same Day Last Month" },
    { value: "1", label: "This Day vs Same Day Last Year" },
  ];

  const handleChange = (selected) => setSelectedOption(selected);

  const transformDataForChart = (data, todayDate, compareDate) => {
    const todayData = data[todayDate] || {};
    const compareData = data[compareDate] || {};

    const hours = Object.keys(todayData); // ["00:00", "01:00", ...]
    const formattedHours = hours.map((hour) => {
      const [h, m] = hour.split(":").map(Number);
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
    });

    const series = [
      {
        name: `Previous (${compareDate})`,
        data: hours.map((hour) => compareData[hour]?.totalAmount || 0),
      },
      {
        name: `Current (${todayDate})`,
        data: hours.map((hour) => todayData[hour]?.totalAmount || 0),
      },
    ];

    return { series, categories: formattedHours };
  };

  useEffect(() => {
    const fetchDataDaily = async () => {
      if (!selectedOption) return;
      try {
        setLoad(true);
        const res = await useJwt.dailySales(selectedOption.value);
        const data = res?.data?.data || {};
        const todayDate = res?.data?.todayDate;
        const compareDate = res?.data?.compareDate;

        const { series, categories } = transformDataForChart(
          data,
          todayDate,
          compareDate
        );

        setChartData((prev) => ({
          ...prev,
          series,
          options: {
            ...prev.options,
            xaxis: { ...prev.options.xaxis, categories },
          },
        }));
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoad(false);
      }
    };

    fetchDataDaily();
  }, [selectedOption]);

  return (
    <Row>
      <Col md="12">
        <Card>
          <CardHeader>
            <Row className="align-items-center">
              <Col>
                <CardTitle tag="h4">Daily Gross Sales</CardTitle>
              </Col>
              <Col xs="auto" className="d-flex align-items-center gap-1">
                <CardText className="mb-0">Comparison:</CardText>
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
                type="area"
                height={350}
              />
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ApexChart;
