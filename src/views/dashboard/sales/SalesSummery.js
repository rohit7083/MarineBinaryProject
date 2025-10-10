// ** Reactstrap Imports
import { useContext, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
// ** Third Party Components
import useJwt from "@src/auth/jwt/useJwt";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import "@styles/react/libs/charts/recharts.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "react-feather";
import Flatpickr from "react-flatpickr";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// ** Chart Data
const data = [
  {
    name: "7/12",
    pv: 280,
  },
  {
    name: "8/12",
    pv: 200,
  },
  {
    name: "9/12",
    pv: 220,
  },
  {
    name: "10/12",
    pv: 180,
  },
  {
    name: "11/12",
    pv: 270,
  },
  {
    name: "12/12",
    pv: 250,
  },
  {
    name: "13/12",
    pv: 70,
  },
  {
    name: "14/12",
    pv: 90,
  },
  {
    name: "15/12",
    pv: 200,
  },
  {
    name: "16/12",
    pv: 150,
  },
  {
    name: "17/12",
    pv: 160,
  },
  {
    name: "18/12",
    pv: 100,
  },
  {
    name: "19/12",
    pv: 150,
  },
  {
    name: "20/12",
    pv: 100,
  },
  {
    name: "21/12",
    pv: 50,
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload) {
    return (
      <div className="recharts-custom-tooltip">
        <span>{`${payload[0].value}%`}</span>
      </div>
    );
  }

  return null;
};

const SalesSummery = () => {
  const { colors } = useContext(ThemeColors);
  const warning = colors.primary.main;
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const formatLocalDate = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleDateChange = (selectedDates) => {
    if (selectedDates.length === 2) {
      const startDate = formatLocalDate(selectedDates[0]);
      const endDate = formatLocalDate(selectedDates[1]);
      setDateRange({ start: startDate, end: endDate });
    }
  };

 const { data, error, isLoading } = useQuery({
    queryKey: ["succPaymentData", dateRange.start, dateRange.end],
    queryFn: async () => {
      const res = await useJwt.successPaymentCharts(
        dateRange.start,
        dateRange.end
      );
      return res.data;
    },
    enabled: !!dateRange.start && !!dateRange.end, // only run when both dates exist
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{String(error)}</p>;
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle tag="h4">Sales Summery</CardTitle>
          <small className="text-muted"> 12/21 - 21-08</small>
        </div>
        <div className="d-flex align-items-center">
          <Calendar size={15} />
          <Flatpickr
            className="form-control flat-picker bg-transparent border-0 shadow-none"
            options={{
              mode: "range",
              dateFormat: "Y-m-d", // just for display in input
              defaultDate: [
                new Date(),
                new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
              ],
            }}
            onChange={handleDateChange}
          />
        </div>
      </CardHeader>

      <CardBody>
        <div className="recharts-wrapper">
          <ResponsiveContainer>
            <LineChart height={300} data={data}>
              <CartesianGrid />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={CustomTooltip} />
              <Line dataKey="pv" stroke={warning} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
export default SalesSummery;
