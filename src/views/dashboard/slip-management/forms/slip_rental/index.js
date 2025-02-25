import React, { useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { Clipboard, DollarSign, FileText, Users } from "react-feather";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { Archive } from "lucide-react";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import SlipRentalManagement from "../slip_rental/SlipRenatalManagement";
import SlipRentalinfo from "../slip_rental/SlipRentalinfo";
import SlipPendingInvoice from "../slip_rental/SlipPendingInvoice";
import SlipRentalArchive from "../slip_rental/SlipRentalArchive";
// import { Book } from "lucide-react";
const TabsCentered = () => {
  const [active, setActive] = useState("1");

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  return (
    <Card>
      <CardHeader className="border-bottom">
        <CardTitle tag="h5"> Slip Rental</CardTitle>
      </CardHeader>

      <React.Fragment>
        <Nav className="justify-content-center" tabs>
          <NavItem>
            <NavLink
              active={active === "1"}
              onClick={() => {
                toggle("1");
              }}
            >
              {/* <Clipboard /> */}
              Slip Rental
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "2"}
              onClick={() => {
                toggle("2");
              }}
            >
              {/* <Users /> */}
              Slip Rental Managemaent
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "3"}
              onClick={() => {
                toggle("3");
              }}
            >
              {/* <FileText /> */}
              Slip Rental Pending Invoice
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "4"}
              onClick={() => {
                toggle("4");
              }}
            >
              {/* <Archive /> */}
              Slip Rental Archive
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent className="py-50" activeTab={active}>
          <TabPane tabId="1">
            <SlipRentalinfo />
          </TabPane>
          <TabPane tabId="2">
            <SlipRentalManagement />
          </TabPane>
          <TabPane tabId="3">
           <SlipPendingInvoice />
          </TabPane>
          <TabPane tabId="4">
           <SlipRentalArchive />
          </TabPane>
         
        </TabContent>
      </React.Fragment>
    </Card>
  );
};
export default TabsCentered;
