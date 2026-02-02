import React, { useEffect, useState } from "react";
import { Clipboard, DollarSign, Users } from "react-feather";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
// ** Components
import SlipDetails from "./forms/SlipDetails";
// import MemberInfo from "./forms/MemberInfo";
import { Book } from "lucide-react";
import { useLocation } from "react-router-dom";
import ViewDocuments from "../slip-management/forms/ViewDocuments";
import MemberIndex from "./forms/memberInfo/index";
import OtherPayment from "./forms/otherPayment/OtherPayment";
import Index from "./forms/slip_rental";
const TabsCentered = () => {
  const [error, setError] = useState("");
  const [SlipData, setSlipData] = useState({
    member: {},
    vessel: {},
    payment: {},
  });

  
  const [fetchLoader, setFetchLoader] = useState(false);
  const location = useLocation();
  const uid = location?.state?.uid;
  const dataFromDashboard = location?.state?.boatDetails;
  const allData = location?.state?.slipData || dataFromDashboard;
  const [active, setActive] = useState("1");
  

  const fromData = location?.state?.from;

  useEffect(() => {
    if (allData) setSlipData(allData);
  }, [allData]);

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
        </NavItem> */}
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
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId="1">
          <SlipDetails
            fetchLoader={fetchLoader}
            assigned={SlipData.isAssigned || dataFromDashboard?.isAssigned}
            dataFromDashboard={dataFromDashboard}
            fromData={fromData}
          />
        </TabPane>

        <TabPane tabId="2">
          {/* <MemberInfo  */}
          <MemberIndex
            SlipData={SlipData}
            fetchLoader={fetchLoader}
            fromData={fromData}
            dataFromDashboard={dataFromDashboard}
          />
        </TabPane>

        <TabPane tabId="3">
          <Index />
        </TabPane>

        <TabPane tabId="4">
          <OtherPayment SlipData={SlipData} />
        </TabPane>
        <TabPane tabId="5">
          <ViewDocuments slipData={SlipData} />
        </TabPane>
      </TabContent>
    </React.Fragment>
  );
};
export default TabsCentered;
