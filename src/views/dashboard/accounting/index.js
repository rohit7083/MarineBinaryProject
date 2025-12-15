import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/charts/recharts.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { debounce } from "lodash";
import { Calendar, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Download } from "react-feather";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import {
  Badge,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
} from "reactstrap";
import {
  exportToCSV,
  exportToExcelHTML,
  exportToPDF
} from "../../../utility/exportUtils";
import PosReport from "./PosReport";

const Index = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [reportType, setReportType] = useState(null);
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(),
  ]);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const reportOptions = [
    { value: "all", label: "All Reports", icon: "📑" },
    { value: "pos", label: "POS Report", icon: "📊" },
    { value: "slip", label: "Slip Report", icon: "🧾" },
    { value: "event", label: "Event Report", icon: "📅" },
    { value: "room", label: "Room Report", icon: "🏨" },
    { value: "switchSlip", label: "Switch Slip", icon: "🔄" },
    // { value: "eventQrCode", label: "Event QR Code", icon: "📱" },
    // { value: "parkingPass", label: "Parking Pass", icon: "🅿️" },
    // { value: "virtualTerminal", label: "Virtual Terminal", icon: "💻" },
  ];

  const datePresets = [
    { value: { days: 0 }, label: "Today" },
    { value: { days: 1 }, label: "Yesterday" },
    { value: { days: 7 }, label: "Last 7 Days" },
    { value: { days: 15 }, label: "Last 15 Days" },
    { value: { months: 1 }, label: "Last Month" },
    { value: { months: 3 }, label: "Last 3 Months" },
    { value: { months: 6 }, label: "Last 6 Months" },
    { value: { months: 12 }, label: "Last Year" },
  ];

  const pageSizeOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];

  const handleQuickDateSelect = (selected) => {
    if (!selected) return;
    const end = new Date();
    const start = new Date();
    if (selected.value.days !== undefined) {
      start.setDate(end.getDate() - selected.value.days);
    } else if (selected.value.months !== undefined) {
      start.setMonth(end.getMonth() - selected.value.months);
    }
    setDateRange([start, end]);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch API data based on date range
  useEffect(() => {
    if (!dateRange?.[0] || !dateRange?.[1]) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const payload = {
          startDate: formatDate(dateRange[0]),
          endDate: formatDate(dateRange[1]),
        };

        const res = await useJwt.report(payload.startDate, payload.endDate);
        const result = res?.data?.content?.result || [];

        // Group data by paymentFrom
        const grouped = {};
        result.forEach((item) => {
          const key = item.paymentFrom || "unknown";
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(item);
        });

        setAllData(grouped);

        // Filter based on selected report type
        if (reportType?.value) {
          if (reportType.value === "all") {
            setFilteredData(Object.values(grouped).flat());
          } else {
            setFilteredData(grouped[reportType.value] || []);
          }
        } else {
          setFilteredData([]);
        }
      } catch (err) {
        console.error("Error fetching report:", err);
        setAllData({});
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [dateRange]);

  // Filter when user clicks a report type card
  useEffect(() => {
    if (!reportType) return;
    if (reportType.value === "all") {
      setFilteredData(Object.values(allData).flat());
    } else {
      setFilteredData(allData[reportType.value] || []);
    }
  }, [reportType, allData]);

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      boxShadow: "none",
      minHeight: "42px",
      "&:hover": { border: "1px solid #7367f0" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#7367f0"
        : state.isFocused
        ? "#f0f0f0"
        : "white",
    }),
  };
  const debouncedFilter = debounce((value) => handleFilter(value), 300);

  const handleFilter = (value) => {
    setSearchTerm(value);

    if (!value) {
      // Reset to full dataset for the selected report type
      if (reportType?.value === "all") {
        setFilteredData(Object.values(allData).flat());
      } else {
        setFilteredData(allData[reportType?.value] || []);
      }
      return;
    }

    const dataToFilter =
      reportType?.value === "all"
        ? Object.values(allData).flat()
        : allData[reportType?.value] || [];

    const filteredResults = dataToFilter.filter((row) => {
      const search = value.toLowerCase();

      return (
        (row.member?.firstName?.toLowerCase()?.includes(search) ||
          row.customer?.firstName.toLowerCase()?.includes(search) ||
          row.customer?.lastName.toLowerCase()?.includes(search) ||
          row.paymentStatus?.toLowerCase()?.includes(search) ||
          row.roomNumber?.toString()?.includes(search) ||
          row.finalAmount?.toString()?.includes(search)) ??
        false
      );
    });

    setFilteredData(filteredResults);
  };

  return (
    <div className="report-container">
      {/* Header & Filters */}
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              {/* <h2 style={{ fontWeight: 700, fontSize: "28px" }}>
                Reports Dashboard
              </h2> */}
              <CardTitle tag="h3" className="mb-1" style={{ fontSize: "20px" }}>
                Reports Dashboard
              </CardTitle>{" "}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <Filter size={18} className="text-primary" />
            <h5 className="mb-0" style={{ fontWeight: 600 }}>
              Filters
            </h5>
            {reportType && (
              <Badge color="light-primary" className="ms-2">
                {reportType.label}
              </Badge>
            )}
          </div>

          {/* Report Type Selection */}
          <div className="mb-4">
            <label
              className="form-label mb-2"
              style={{ fontSize: "13px", fontWeight: 600, color: "#5e5873" }}
            >
              Report Type
            </label>
            <div className="row g-3">
              {reportOptions.map((option) => (
                <div key={option.value} className="col-md-2 col-sm-6">
                  <div
                    onClick={() => setReportType(option)}
                    style={{
                      padding: "16px",
                      borderRadius: "10px",
                      border: `2px solid ${
                        reportType?.value === option.value
                          ? "#7367f0"
                          : "#e8e8e8"
                      }`,
                      background:
                        reportType?.value === option.value
                          ? "#f8f7ff"
                          : "white",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                    }}
                    className="hover-lift"
                  >
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                      {option.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color:
                          reportType?.value === option.value
                            ? "#7367f0"
                            : "#5e5873",
                      }}
                    >
                      {option.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range & Quick Select */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <CardText> Date Range</CardText>
              <div className="position-relative">
                <Calendar
                  size={16}
                  className="text-muted position-absolute"
                  style={{
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }}
                />
                <Flatpickr
                  className="form-control"
                  style={{
                    paddingLeft: "36px",
                    borderRadius: "8px",
                    height: "42px",
                  }}
                  value={dateRange}
                  options={{ mode: "range", dateFormat: "Y-m-d" }}
                  onChange={setDateRange}
                  placeholder="Select date range"
                />
              </div>
            </div>
            <div className="col-md-6">
              <CardText> Period</CardText>

              <Select
                options={datePresets}
                onChange={handleQuickDateSelect}
                placeholder="Choose preset"
                isClearable
                classNamePrefix="select"
                styles={customSelectStyles}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Search, Page Size & Report Content */}
      <Card>
        <CardBody>
          <div className="row g-3 mb-1">
            <div className="col-md-10">
              <CardText> Search</CardText>
              <InputGroup>
                <InputGroupText
                  style={{ borderRadius: "8px 0 0 8px", background: "white" }}
                >
                  <Search size={16} />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => debouncedFilter(e.target.value)}
                  style={{ borderRadius: "0 8px 8px 0" }}
                />
              </InputGroup>
            </div>

            <div className="col-md-2">
              <CardText> </CardText>
              <Dropdown
                isOpen={dropdownOpen}
                className="mt-3"
                toggle={toggleDropdown}
              >
                <DropdownToggle color="primary" size={"sm"} caret>
                  <Download size={16} className="me-1" /> Export
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem onClick={() => exportToCSV(filteredData)}>
                    Export as CSV
                  </DropdownItem>
                  <DropdownItem onClick={() => exportToPDF(filteredData)}>
                    Export as PDF
                  </DropdownItem>

                  <DropdownItem onClick={() => exportToExcelHTML(filteredData)}>
                    Export as Excel
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner color="primary" size="lg" />
              <p className="mt-1 text-muted mb-0" style={{ fontSize: "14px" }}>
                Loading reports...
              </p>
            </div>
          ) : reportType ? (
            <div id="report-section">
              <PosReport
                data={filteredData}
                searchTerm={searchTerm}
                pageSize={pageSize}
                dateRange={dateRange}
                reportType={reportType.value}
              />
            </div>
          ) : (
            <div className="text-center" style={{ padding: "60px 20px" }}>
              <div
                style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}
              >
                📊
              </div>
              <h5 className="mb-2" style={{ fontWeight: 600 }}>
                No Report Selected
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                Please select a report type above to view your data
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(115, 103, 240, 0.15);
        }
      `}</style>
    </div>
  );
};

export default Index;
