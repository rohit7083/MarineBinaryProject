import React, { useEffect, useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import {
  CheckCircle,
  Clipboard,
  DollarSign,
  FileText,
  Pocket,
  Repeat,
  Users,
} from "react-feather";
// ** Components
import PartialInvoice from "./PartialInvoice";
import RecurringInvoice from "./RecurringInvoice";
import DueInvoice from "./DueInvoice";
import CancelInvoice from "./CancelInvoice";
import PaidInvoive from "./PaidInvoice";
import Send_Invoice from "./Send_Invoice";
import { Book } from "lucide-react";
import useJwt from "@src/auth/jwt/useJwt";
import { useParams } from "react-router-dom";
import { X } from "react-feather";
import { Send } from "react-feather";
const TabsCentered = () => {
  const [error, setError] = useState("");
  const [SlipData, setSlipData] = useState({});
  const [fetchLoader, setFetchLoader] = useState(false);

  const [active, setActive] = useState("1");
  const { uid } = useParams();

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const fetchSlipData = async () => {
    try {
      if (uid) {
        setFetchLoader(true);

        const resp = await useJwt.getslip(uid);
        setSlipData(resp.data.content);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetchLoader(false);
    }
  };

  useEffect(() => {
    fetchSlipData();
  }, []);


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
            <Send />
            Send Invoice
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "2"}
            onClick={() => {
              toggle("2");
            }}
          >
            <CheckCircle /> Paid Invoice
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            active={active === "3"}
            onClick={() => {
              toggle("3");
            }}
          >
            <X />
            Cancel Invoice
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "4"}
            onClick={() => {
              toggle("4");
            }}
          >
            <FileText /> Due Invoice
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "5"}
            onClick={() => {
              toggle("5");
            }}
          >
            <Repeat /> Recurring Invoice
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "6"}
            onClick={() => {
              toggle("6");
            }}
          >
            <Pocket /> partial Invoice
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId="1">
          <Send_Invoice
          // fetchLoader={fetchLoader}
          // assigned={SlipData.isAssigned}
          />
        </TabPane>

        <TabPane tabId="2">
          <PaidInvoive
          // SlipData={SlipData}
          // fetchLoader={fetchLoader}
          />
        </TabPane>

        <TabPane tabId="3">
          <CancelInvoice />
        </TabPane>

        <TabPane tabId="4">
          <DueInvoice />
        </TabPane>
        <TabPane tabId="5">
          <RecurringInvoice />
        </TabPane>
        <TabPane tabId="6">
          <PartialInvoice />
        </TabPane>
      </TabContent>
    </React.Fragment>
  );
};
export default TabsCentered;
