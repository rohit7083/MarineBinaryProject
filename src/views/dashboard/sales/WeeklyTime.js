// ** Third Party Components
import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// ** Reactstrap Imports
import { useSkin } from "@hooks/useSkin";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle, Spinner } from "reactstrap";

const HourlySales = () => {
  const { skin } = useSkin();
  const [loading, setLoading] = useState(false);

  const gridLineColor = "rgba(200, 200, 200, 0.2)";
  const success = "#28dac6";
  const labelColor = skin === "dark" ? "#b4b7bd" : "#6e6b7b";

  const [timeData, setTimeData] = useState([]);
  useEffect(() => {
    const fetchSalesByhour = async () => {
      try {
        setLoading(true);
        const res = await useJwt.salesByhour();
        console.log(res);
        setTimeData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesByhour();
  }, []);

  // Extract hours and sales data dynamically from API response
  const hours = Object.keys(timeData?.data || []).map((time) =>
    parseInt(time.split(":")[0], 10)
  );
  const salesData = Object.keys(timeData?.data || []).map(
    (hour) => timeData.data[hour].totalAmount || 0
  );

  const maxTotal = Math.max(...salesData);

  const timeKeys = Object.keys(timeData?.data || []); // ["00:00", "01:00", "12:02", ...]

  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    animation: { duration: 700 },
    scales: {
      x: {
        grid: { color: gridLineColor, borderColor: gridLineColor },
        ticks: { color: labelColor, maxRotation: 0, autoSkip: false },
        title: {
          display: true,
          text: "Time of Day",
          color: labelColor,
          font: { size: 13 },
        },
      },
      y: {
        min: 0,
        max: maxTotal + maxTotal * 0.1,
        grid: { color: gridLineColor, borderColor: gridLineColor },
        ticks: {
          stepSize: Math.ceil((maxTotal + maxTotal * 0.1) / 5),
          color: labelColor,
        },
        title: {
          display: true,
          text: "Sales Volume",
          color: labelColor,
          font: { size: 13 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: skin === "dark" ? "#283046" : "#fff",
        titleColor: skin === "dark" ? "#fff" : "#000",
        bodyColor: skin === "dark" ? "#b4b7bd" : "#6e6b7b",
        borderColor: "#ddd",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const timeString = timeKeys[index]; // exact HH:MM from API
            const [h, m] = timeString.split(":");
            const h12 = h % 12 === 0 ? 12 : h % 12;
            const ampm = h < 12 ? "AM" : "PM";
            const totalAmount = context.raw;

            return `Time: ${h12}:${m} ${ampm}, Sales: ${totalAmount}`;
          },
        },
      },
    },
    elements: {
      line: { tension: 0.4, borderWidth: 3 },
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: success,
        borderWidth: 0,
      },
    },
  };

  // ** Chart Data
  const data = {
    labels: hours,
    datasets: [
      {
        label: "Hourly Sales",
        data: salesData,
        borderColor: success,
        backgroundColor: "rgba(40, 218, 198, 0.2)",
        fill: true, // area under the line
      },
    ],
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center flex-wrap">
        <CardTitle tag="h4">Sales by Hour</CardTitle>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "150px" }}
          >
            <Spinner color="primary" />
            <span className="ms-2 text-muted">Loading chart data...</span>
          </div>
        ) : (
          <div style={{ height: "400px" }}>
            <Line data={data} options={options} />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default HourlySales;
