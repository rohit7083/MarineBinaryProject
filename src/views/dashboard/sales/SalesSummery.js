// ** React Imports
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { Card, CardBody, CardHeader, CardTitle, Spinner } from "reactstrap";

// ** Third Party Components
import useJwt from "@src/auth/jwt/useJwt";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import "@styles/react/libs/charts/recharts.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
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

// ** Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  console.log(payload);

  if (active && payload && payload.length) {
    return (
      <div
        className="recharts-custom-tooltip p-0 rounded shadow-sm border border-secondary bg-white"
        style={{
          minWidth: "100px",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#212529",
        }}
      >
        {/* Value */}
        <span className="d-block fw-bold">${payload[0]?.value ?? "-"}</span>

        {/* Date */}
        <span className="d-block text-muted" style={{ fontSize: "0.8rem" }}>
          {payload[0]?.payload?.name ?? "-"}
        </span>
      </div>
    );
  }
  return null;
};

const SalesSummery = () => {
  const { colors } = useContext(ThemeColors);
  const warning = colors.primary.main;

  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Format date for API
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

  // Handle Flatpickr date range change
  const handleDateChange = (selectedDates) => {
    if (selectedDates.length === 2) {
      const startDate = formatLocalDate(selectedDates[0]);
      const endDate = formatLocalDate(selectedDates[1]);
      setDateRange({ start: startDate, end: endDate });
    }
  };

  // Fetch data manually using useEffect
  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.start || !dateRange.end) return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await useJwt.successPaymentCharts(
          dateRange.start,
          dateRange.end
        );

        const data = res?.data || {};

        // ✅ Transform object into array for Recharts
        const formattedData = Object.entries(data).map(([date, values]) => ({
          name: date, // this will show on X-axis
          totalAmount: values.totalAmount,
          count: values.count,
        }));

        setChartData(formattedData);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setErrorMsg(err?.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);
  const options = [
    { value: { days: 0 }, label: "Today" },
    { value: { days: 1 }, label: "Yesterday" },
    { value: { days: 7 }, label: "Last 7 Days" },
    { value: { days: 15 }, label: "Last 15 Days" },
    { value: { months: 1 }, label: "Last Month" },
    { value: { months: 2 }, label: "Last 2 Months" },
    { value: { months: 6 }, label: "Last 6 Months" },
    { value: { months: 12 }, label: "Last Year" },
  ];
  const handleChange = (selectedOption) => {
    if (!selectedOption) return;

    const value = selectedOption.value;
    const end = new Date();
    let start = new Date();

    if (value.days !== undefined) start.setDate(end.getDate() - value.days);
    if (value.months !== undefined)
      start.setMonth(end.getMonth() - value.months);

    setDateRange({ start: formatLocalDate(start), end: formatLocalDate(end) });
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <CardTitle tag="h4">Sales Summary</CardTitle>
          <small className="text-muted">Select a date range to view data</small>
        </div>
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
        
          <Select
            options={options}
            onChange={handleChange}
            placeholder="Quick Select"
            isClearable
            size={"sm"}
            styles={{
              container: (base) => ({ ...base, minWidth: 150, width: "auto" }),
            }}
          />

          {/* Date range picker */}
          <div className="d-flex align-items-center gap-2 flex-grow-1 w-100 w-md-auto">
            <Calendar size={16} className="text-muted" />
            <Flatpickr
              className="form-control form-control-sm shadow-sm"
              style={{ minWidth: "200px" }}
              options={{
                mode: "range",
                dateFormat: "Y-m-d",
                defaultDate: [
                  new Date(new Date().setMonth(new Date().getMonth() - 1)),
                  new Date(),
                ],
              }}
              onChange={handleDateChange}
              placeholder="Select date range"
            />
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "250px" }}
          >
            <Spinner color="primary" />
            <span className="ms-2 text-muted">Loading chart data...</span>
          </div>
        ) : errorMsg ? (
          <div className="text-center text-danger fw-bold py-3">{errorMsg}</div>
        ) : chartData.length > 0 ? (
          <div className="recharts-wrapper" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="totalAmount"
                  stroke={warning}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-muted py-3">
            No data available for the selected range.
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default SalesSummery;
