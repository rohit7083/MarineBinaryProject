import useJwt from "@src/auth/jwt/useJwt";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardHeader, CardTitle, Spinner } from "reactstrap";

const ApexChartCard = () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const [yearData, setYearData] = useState({ current: {}, previous: {} });
  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const fetchYearlySales = async () => {
      try {
        setLoad(true);
        const res = await useJwt.yearlySales();
        const yearlyData = res?.data?.data || {};

        const currentYearData = yearlyData[currentYear] || {};
        const previousYearData = yearlyData[previousYear] || {};

        setYearData({
          current: currentYearData,
          previous: previousYearData,
        });
      } catch (error) {
        console.error("Error fetching yearly sales:", error);
      } finally {
        setLoad(false);
      }
    };

    fetchYearlySales();
  }, []);

  // 👇 Update chart when yearData changes
  useEffect(() => {
    const previousValues = Object.values(yearData.previous || {}).map(
      (x) => x?.totalAmount || 0
    );
    const currentValues = Object.values(yearData.current || {}).map(
      (x) => x?.totalAmount || 0
    );

    const months =
      Object.keys(yearData.current).length > 0
        ? Object.keys(yearData.current)
        : [
            "JANUARY",
            "FEBRUARY",
            "MARCH",
            "APRIL",
            "MAY",
            "JUNE",
            "JULY",
            "AUGUST",
            "SEPTEMBER",
            "OCTOBER",
            "NOVEMBER",
            "DECEMBER",
          ];

    setChartData({
      series: [
        { name: `Previous Year (${previousYear})`, data: previousValues },
        { name: `Current Year (${currentYear})`, data: currentValues },
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
        xaxis: { categories: months },
        yaxis: { title: { text: "$ (thousands)" } },
        fill: { opacity: 1 },
        tooltip: {
          y: { formatter: (val) => `$ ${val} thousands` },
        },
      },
    });
  }, [yearData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">
          Yearly Gross Sales ({previousYear} vs {currentYear})
        </CardTitle>
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
          <>
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
            />
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ApexChartCard;
