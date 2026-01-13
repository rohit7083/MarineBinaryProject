// ** Third Party Components
import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ** Reactstrap Imports
import { useSkin } from "@hooks/useSkin";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle, Spinner } from "reactstrap";

const WeeklySales = () => {
  const [weekData, setWeekData] = useState([]);
  useEffect(() => {
    const fetchDaysOfWeek = async () => {
      try {
        setLoading(true);
        const res = await useJwt.daysOfWeek();
         (res);
        setWeekData(res);
      } catch (error) {
         (error);
      } finally {
        setLoading(false);
      }
    };

    fetchDaysOfWeek();
  }, []);
  const [loading, setLoading] = useState(false);

  const { skin } = useSkin();
  const dayNames = Object.keys(weekData?.data || []);
  const formattedDays = dayNames?.map(
    (day) => day.charAt(0) + day.slice(1).toLowerCase()
  );
  const salesData = dayNames.map((day) => weekData.data[day].totalAmount || 0);
  const maxTotal = Math.max(...salesData);

  const gridLineColor = "rgba(200, 200, 200, 0.2)";
  const success = "#28dac6";
  const labelColor = skin === "dark" ? "#b4b7bd" : "#6e6b7b";

  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor,
        },
        ticks: { color: labelColor },
      },
      y: {
        min: 0,
        max: maxTotal + maxTotal * 0.1,
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor,
        },
        ticks: {
          stepSize: Math.ceil((maxTotal + maxTotal * 0.1) / 5),
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: skin === "dark" ? "#283046" : "#fff",
        titleColor: skin === "dark" ? "#fff" : "#000",
        bodyColor: skin === "dark" ? "#b4b7bd" : "#6e6b7b",
      },
    },
  };

  // ** Chart Data
  const data = {
    labels: formattedDays,
    datasets: [
      {
        label: "Sales",
        maxBarThickness: 15,
        backgroundColor: success,
        borderColor: "transparent",
        borderRadius: 10,
        data: salesData,
      },
    ],
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center flex-wrap">
        <CardTitle tag="h4">Day Of Week</CardTitle>
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
            <Bar data={data} options={options} />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default WeeklySales;
