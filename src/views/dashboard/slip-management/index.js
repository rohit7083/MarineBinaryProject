import React, { useEffect, useState } from "react";
import { Clipboard, Users } from "react-feather";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
// ** Components
import SlipDetails from "./forms/SlipDetails";
// import MemberInfo from "./forms/MemberInfo";
import { useLocation } from "react-router-dom";
import MemberIndex from "./forms/memberInfo/index";
const TabsCentered = () => {
  const [error, setError] = useState("");
  const [SlipData, setSlipData] = useState({});
  const [fetchLoader, setFetchLoader] = useState(false);
  const location = useLocation();
  const uid = location?.state?.uid;
  const allData = location?.state?.slipData;
  const [active, setActive] = useState("1");
  console.clear();
  console.log("allData", allData);

  useEffect(() => {
    setSlipData(allData);
  }, [allData]);
  console.clear();
  console.log("SlipData", SlipData);

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  return (
    <React.Fragment>
      <Nav className="justify-content-center" tabs>
        <NavItem>
          <NavLink
            active={active === "1"}
            onClick={() => {
              toggle("1");
            }}
          >
            <Clipboard />
            Slip Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "2"}
            onClick={() => {
              toggle("2");
            }}
          >
            <Users />
            Member Details
          </NavLink>
        </NavItem>
        {/* <NavItem>
          <NavLink disabled>Disabled</NavLink>
        </NavItem> */}
        {/* <NavItem>
          <NavLink
            active={active === "3"}
            onClick={() => {
              toggle("3");
            }}
          >
            <FileText />
            Slip Rental
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "4"}
            onClick={() => {
              toggle("4");
            }}
          >
            <DollarSign />
            Other Payment
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "5"}
            onClick={() => {
              toggle("5");
            }}
          >
            <Book />
            View Documents
          </NavLink>
        </NavItem> */}
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId="1">
          <SlipDetails
            fetchLoader={fetchLoader}
            // assigned={SlipData.isAssigned}
          />
        </TabPane>

        <TabPane tabId="2">
          {/* <MemberInfo  */}
          <MemberIndex SlipData={SlipData} fetchLoader={fetchLoader} />
        </TabPane>

        {/* <TabPane tabId="3">
          <Index />
        </TabPane>

        <TabPane tabId="4">
          <OtherPayment />
        </TabPane>
        <TabPane tabId="5">
          <ViewDocuments />
        </TabPane> */}
      </TabContent>
    </React.Fragment>
  );
};
export default TabsCentered;
