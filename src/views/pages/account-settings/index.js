// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Third Party Components

// ** Reactstrap Imports
import { CardTitle, Col, Row, TabContent, TabPane } from "reactstrap";

// ** Demo Components
import AccountTabContent from "./AccountTabContent";
import SecurityTabContent from "./SecurityTabContent";
import Tabs from "./Tabs";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [data, setData] = useState(null);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

useEffect(() => {
  try {
    const stored = localStorage.getItem("userData");
    if (!stored) return;

    const userData = JSON.parse(stored);
    setData(userData);
  } catch (error) {
    console.error("Invalid userData in localStorage", error);
  }
}, []);


  return (
    <Fragment>
      <CardTitle>
        <h4 className="mt-1 mb-2">Accounting Settings</h4>
      </CardTitle>
      {data !== null ? (
        <Row>
          <Col xs={12}>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
            />

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <AccountTabContent data={data} />
              </TabPane>
              <TabPane tabId="2">
                <SecurityTabContent />
              </TabPane>
              {/* <TabPane tabId="3">
                <BillingTabContent />
              </TabPane>
              <TabPane tabId="4">
                <NotificationsTabContent />
              </TabPane>
              <TabPane tabId="5">
                <ConnectionsTabContent />
              </TabPane> */}
            </TabContent>
          </Col>
        </Row>
      ) : null}
    </Fragment>
  );
};

export default AccountSettings;
