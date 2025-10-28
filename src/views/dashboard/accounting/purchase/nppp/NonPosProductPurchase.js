import { useState } from "react";
import NonPosTableData from "./NonPosTableData";
import ServiceWiseTabledata from "./ServiceWiseTabledata";

function NonPosProductPurchase() {
  const [active, setActive] = useState("purchase");

  const toggleTab = (tabId) => {
    if (active !== tabId) setActive(tabId);
  };

  // Example tab sections (you can modify these)
  const sections = [
    {
      id: "NPPW",
      label: "Non-POS Product Wise",
      content: (
        <>
        
            <NonPosTableData />
        
        </>
      ),
    },
    {
      id: "SW",
      label: "Service Wise",
      content: (
        <>
          <ServiceWiseTabledata />
        </>
      ),
    },
  ];

  return (
    <div className="card ">
      {/* --- Tab Header --- */}
      <div className="card-header d-flex justify-content-center">
        <ul className="nav nav-tabs card-header-tabs">
          {sections.map((section) => (
            <li className="nav-item" key={section.id}>
              <button
                className={`nav-link ${active === section.id ? "active" : ""}`}
                onClick={() => toggleTab(section.id)}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Tab Body --- */}
      <div className="card-body">
        {sections.find((s) => s.id === active)?.content || (
          <p className="text-center text-muted">No information to display.</p>
        )}
      </div>
    </div>
  );
}

export default NonPosProductPurchase;
