import React, { useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { Clipboard, DollarSign, FileText, Users } from "react-feather";
// ** Components
import SlipDetails from "./forms/SlipDetails";
import MemberInfo from "./forms/MemberInfo";
import Index  from './forms/slip_rental';
import OtherPayment from './forms/OtherPayment';
import ViewDocuments from './forms/ViewDocuments';
import { Book } from "lucide-react";
const TabsCentered = () => {
  const [active, setActive] = useState("1");

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
        <NavItem>
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
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId="1">
          <SlipDetails />
        </TabPane>
        <TabPane tabId="2">
          <MemberInfo />
        </TabPane>
        <TabPane tabId="3">
         <Index/>
        </TabPane>

        <TabPane tabId="4">
         <OtherPayment/>
        </TabPane>
        <TabPane tabId="5">
         <ViewDocuments/>
        </TabPane>

      </TabContent>
    </React.Fragment>
  );
};
export default TabsCentered;
