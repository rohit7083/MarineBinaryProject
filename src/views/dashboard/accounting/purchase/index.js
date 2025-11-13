import { useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import NonPosProductPurchase from "./nppp/NonPosProductPurchase";
import PosProductPurchase from "./ppp/PosProductPurchase";
import VendorManagementTable from "./vm/VendorManagementTable";

function Index() {
  const reportOptions = [
    { value: "ppp", label: "POS Product Purchase", icon: "📑" },
    { value: "nppp", label: "Non-POS Product Purchase", icon: "📊" },
    { value: "vm", label: "Vendor Management", icon: "🧾" },
  ];

  const [reportType, setReportType] = useState(null);
  console.log(reportType);

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h3" className="mb-1" style={{ fontSize: "20px" }}>
          Purchase
        </CardTitle>{" "}
        <div
          className="d-flex flex-wrap align-items-center gap-2 mb-3"
          style={{ justifyContent: "flex-start" }}
        >
          {reportOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setReportType(option)}
              style={{
                minWidth: "30%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: `2px solid ${
                  reportType?.value === option.value ? "#7367f0" : "#e8e8e8"
                }`,
                background:
                  reportType?.value === option.value ? "#f8f7ff" : "white",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "4px" }}>
                {option.icon}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color:
                    reportType?.value === option.value ? "#7367f0" : "#5e5873",
                }}
              >
                {option.label}
              </div>
            </div>
          ))}
        </div>
        {reportType?.value === "ppp" ? (
          <PosProductPurchase />
        ) : reportType?.value === "nppp" ? (
          <NonPosProductPurchase />
        ) : reportType?.value === "vm" ? (
          <VendorManagementTable />
        ) : null}
      </CardBody>
    </Card>
  );
}

export default Index;
