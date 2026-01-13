// import useJwt from "@src/auth/jwt/useJwt";
// import "@styles/react/libs/charts/recharts.scss";
// import "@styles/react/libs/flatpickr/flatpickr.scss";
// import { debounce } from "lodash";
// import { Filter, Search } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Download } from "react-feather";
// import {
//   Badge,
//   Card,
//   CardBody,
//   CardText,
//   CardTitle,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownToggle,
//   Input,
//   InputGroup,
//   InputGroupText,
//   Spinner,
// } from "reactstrap";
// import {
//   exportToCSV,
//   exportToExcelHTML,
// } from "../../../../utility/exportUtils";
// import Autopay from "./Autopay";

// const Index = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [pageSize, setPageSize] = useState(20);
//   const [reportType, setReportType] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [allData, setAllData] = useState({});
//   const [filteredData, setFilteredData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   const reportOptions = [
//     { value: "2", label: "All Payments", icon: "📑" },
//     { value: "1", label: "Success", icon: "✅" },
//     { value: "0", label: "Declined", icon: "❌" },

//     // { value: "event", label: "Event Report", icon: "📅" },
//     // { value: "room", label: "Room Report", icon: "🏨" },
//     // { value: "switchSlip", label: "Switch Slip", icon: "🔄" },
//     // { value: "eventQrCode", label: "Event QR Code", icon: "📱" },
//     // { value: "parkingPass", label: "Parking Pass", icon: "🅿️" },
//     // { value: "virtualTerminal", label: "Virtual Terminal", icon: "💻" },
//   ];

//    (reportType);
//    ("filteredData", filteredData);

//   // Fetch API data based on date range
//   useEffect(() => {
//     const fetchReport = async () => {
//       try {
//         setLoading(true);
//         const res = await useJwt.autoPayment(reportType?.value || 2);
//         const result = res?.data?.content?.result || [];
//          ("result", result);
//         setFilteredData(result);
//       } catch (err) {
//         console.error("Error fetching report:", err);
//         setAllData({});
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReport();
//   }, [reportType]);

//   const debouncedFilter = debounce((value) => handleFilter(value), 300);

//   const handleFilter = (value) => {
//     setSearchTerm(value);

//     if (!value) {
//       // Reset to full dataset for the selected report type
//       if (reportType?.value === "all") {
//         setFilteredData(Object.values(allData).flat());
//       } else {
//         setFilteredData(allData[reportType?.value] || []);
//       }
//       return;
//     }

//     const dataToFilter =
//       reportType?.value === "all"
//         ? Object.values(allData).flat()
//         : allData[reportType?.value] || [];

//     const filteredResults = dataToFilter.filter((row) => {
//       const search = value.toLowerCase();

//       return (
//         (row.member?.firstName?.toLowerCase()?.includes(search) ||
//           row.customer?.firstName.toLowerCase()?.includes(search) ||
//           row.customer?.lastName.toLowerCase()?.includes(search) ||
//           row.paymentStatus?.toLowerCase()?.includes(search) ||
//           row.roomNumber?.toString()?.includes(search) ||
//           row.finalAmount?.toString()?.includes(search)) ??
//         false
//       );
//     });

//     setFilteredData(filteredResults);
//   };

//   return (
//     <div className="report-container">
//       <Card>
//         <CardBody>
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <div>
//               {/* <h2 style={{ fontWeight: 700, fontSize: "28px" }}>
//                 Reports Dashboard
//               </h2> */}
//               <CardTitle tag="h3" className="mb-1" style={{ fontSize: "20px" }}>
//                 Auto payment List
//               </CardTitle>{" "}
//             </div>
//           </div>

//           <div className="d-flex align-items-center gap-2 mb-2">
//             <Filter size={18} className="text-primary" />
//             <h5 className="mb-0" style={{ fontWeight: 600 }}>
//               Filters
//             </h5>
//             {reportType && (
//               <Badge color="light-primary" className="ms-2">
//                 {reportType.label}
//               </Badge>
//             )}
//           </div>

//           {/* Report Type Selection */}
//           <div className="mb-4">
//             <label
//               className="form-label mb-2"
//               style={{ fontSize: "13px", fontWeight: 600, color: "#5e5873" }}
//             >
//               Select a type to view payments.
//             </label>
//             <div className="row g-3">
//               {reportOptions.map((option) => (
//                 <div key={option.value} className="col-md-4 col-sm-6">
//                   <div
//                     onClick={() => setReportType(option)}
//                     style={{
//                       padding: "6px",
//                       borderRadius: "10px",
//                       border: `2px solid ${
//                         reportType?.value === option.value
//                           ? "#7367f0"
//                           : "#e8e8e8"
//                       }`,
//                       background:
//                         reportType?.value === option.value
//                           ? "#f8f7ff"
//                           : "white",
//                       cursor: "pointer",
//                       transition: "all 0.2s ease",
//                       textAlign: "center",
//                     }}
//                     className="hover-lift"
//                   >
//                     <div style={{ fontSize: "32px", marginBottom: "8px" }}>
//                       {option.icon}
//                     </div>
//                     <div
//                       style={{
//                         fontSize: "14px",
//                         fontWeight: 600,
//                         color:
//                           reportType?.value === option.value
//                             ? "#7367f0"
//                             : "#5e5873",
//                       }}
//                     >
//                       {option.label}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="row g-3 mb-1 mt-2">
//             <div className="col-md-10">
//               <CardText> Search</CardText>
//               <InputGroup>
//                 <InputGroupText
//                   style={{ borderRadius: "8px 0 0 8px", background: "white" }}
//                 >
//                   <Search size={16} />
//                 </InputGroupText>
//                 <Input
//                   type="text"
//                   placeholder="Search reports..."
//                   value={searchTerm}
//                   onChange={(e) => debouncedFilter(e.target.value)}
//                   style={{ borderRadius: "0 8px 8px 0" }}
//                 />
//               </InputGroup>
//             </div>

//             <div className="col-md-2">
//               <CardText> </CardText>
//               <Dropdown
//                 isOpen={dropdownOpen}
//                 className="mt-3"
//                 toggle={toggleDropdown}
//               >
//                 <DropdownToggle color="primary" size={"sm"} caret>
//                   <Download size={16} className="me-1" /> Export
//                 </DropdownToggle>
//                 <DropdownMenu end>
//                   <DropdownItem onClick={() => exportToCSV(filteredData)}>
//                     Export as CSV
//                   </DropdownItem>
//                   {/* <DropdownItem onClick={() => exportToPDF(filteredData)}>
//                     Export as PDF
//                   </DropdownItem> */}

//                   <DropdownItem onClick={() => exportToExcelHTML(filteredData)}>
//                     Export as Excel
//                   </DropdownItem>
//                 </DropdownMenu>
//               </Dropdown>
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-center">
//               <Spinner color="primary" size="lg" />
//               <p className="mt-1 text-muted mb-0" style={{ fontSize: "14px" }}>
//                 Loading reports...
//               </p>
//             </div>
//           ) : reportType ? (
//             <div id="report-section">
//               <Autopay
//                 data={filteredData}
//                 searchTerm={searchTerm}
//                 pageSize={pageSize}
//                 reportType={reportType.value}
//               />
//             </div>
//           ) : (
//             <div className="text-center" style={{ padding: "60px 20px" }}>
//               <div
//                 style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}
//               >
//                 📊
//               </div>
//               <h5 className="mb-2" style={{ fontWeight: 600 }}>
//                 No Report Selected
//               </h5>
//               <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
//                 Please select a report type above to view your data
//               </p>
//             </div>
//           )}
//         </CardBody>
//       </Card>

//       <style jsx>{`
//         .hover-lift:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(115, 103, 240, 0.15);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Index;





import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/charts/recharts.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { debounce } from "lodash";
import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Download } from "react-feather";
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
} from "../../../../utility/exportUtils";
import Autopay from "./Autopay";

const Index = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize] = useState(20);
const [reportType, setReportType] = useState({
  value: "2",
  label: "All Payments",
  icon: "📑"
});

  const [loading, setLoading] = useState(false);

  const [fullData, setFullData] = useState([]); // full dataset from API
  const [filteredData, setFilteredData] = useState([]); // search results

  const reportOptions = [
    { value: "2", label: "All Payments", icon: "📑" },
    { value: "1", label: "Success", icon: "✅" },
    { value: "0", label: "Declined", icon: "❌" },
  ];

  // -------------------------
  // FETCH REPORT DATA
  // -------------------------
  const [ready, setReady] = useState(false);

useEffect(() => {
  const t = setTimeout(() => setReady(true), 50); // render first, fetch after
  return () => clearTimeout(t);
}, []);
 useEffect(() => {
  if (!ready || !reportType) return;

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await useJwt.autoPayment(reportType.value);
      const result = res?.data?.content?.result || [];
      setFullData(result);
      setFilteredData(result);
    } finally {
      setLoading(false);
    }
  };

  fetchReport();
}, [reportType, ready]);


  // -------------------------
  // SMOOTH SEARCH FUNCTION
  // -------------------------
  const performSearch = (value, data) => {
    const search = value.toLowerCase();
    if (!search) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((row) => {
      return (
        row.member?.firstName?.toLowerCase()?.includes(search) ||
        row.customer?.firstName?.toLowerCase()?.includes(search) ||
        row.customer?.lastName?.toLowerCase()?.includes(search) ||
        row.paymentStatus?.toLowerCase()?.includes(search) ||
        row.roomNumber?.toString()?.includes(search) ||
        row.finalAmount?.toString()?.includes(search)
      );
    });

    setFilteredData(filtered);
  };

  const debouncedSearch = debounce(performSearch, 250);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    debouncedSearch(value, fullData);
  };

  return (
    <div className="report-container">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <CardTitle tag="h3" className="mb-1" style={{ fontSize: "20px" }}>
              Auto payment List
            </CardTitle>
          </div>

          {/* FILTER TITLE */}
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

          {/* REPORT SELECTOR */}
          <div className="mb-4">
            <label
              className="form-label mb-2"
              style={{ fontSize: "13px", fontWeight: 600, color: "#5e5873" }}
            >
              Select a type to view payments.
            </label>

            <div className="row g-3">
              {reportOptions.map((option) => (
                <div key={option.value} className="col-md-4 col-sm-6">
                  <div
                    onClick={() => setReportType(option)}
                    style={{
                      padding: "6px",
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

          {/* SEARCH + EXPORT */}
          <div className="row g-3 mb-1 mt-2">
            <div className="col-md-10">
              <CardText>Search</CardText>
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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  style={{ borderRadius: "0 8px 8px 0" }}
                />
              </InputGroup>
            </div>

            <div className="col-md-2">
              <Dropdown
                isOpen={dropdownOpen}
                className="mt-3"
                toggle={toggleDropdown}
              >
                <DropdownToggle color="primary" size="sm" caret>
                  <Download size={16} className="me-1" /> Export
                </DropdownToggle>

                <DropdownMenu end>
                  <DropdownItem onClick={() => exportToCSV(filteredData)}>
                    Export as CSV
                  </DropdownItem>

                  <DropdownItem onClick={() => exportToExcelHTML(filteredData)}>
                    Export as Excel
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="text-center">
              <Spinner color="primary" size="lg" />
              <p className="mt-1 text-muted mb-0" style={{ fontSize: "14px" }}>
                Loading payment List...
              </p>
            </div>
          ) : reportType ? (
            <div id="report-section">
              <Autopay
                data={filteredData}
                searchTerm={searchTerm}
                pageSize={pageSize}
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
