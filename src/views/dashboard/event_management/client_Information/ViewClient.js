// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const ViewPass = ({ selectedMember, memberData, updateUid }) => {
  if (!selectedMember) return null;
  const [memData, setMemData] = useState();

  useEffect(() => {
   
    if (updateUid && selectedMember?.uid === undefined) {
      setMemData(memberData);
    } else {
      setMemData(selectedMember);
    }
  }, [memberData, updateUid, selectedMember]);

  return (
    <Fragment>
      <Card className="invoice-action-wrapper">
        <>
          <CardBody>
            <CardTitle>Selected Member details</CardTitle>
            <Row>
              <Col xl="12" xs="12">
                <div style={{ fontSize: "12px" }}>
                  <Row>
                    {/* Left Section */}
                    <Col md="6">
                      {[
                        {
                          label: "First Name",
                          value: memData?.firstName,
                        },
                        {
                          label: "Last Name",
                          value: memData?.lastName,
                        },
                        { label: "Email", value: memData?.emailId }, // FIXED KEY
                        { label: "Address", value: memData?.address },
                      ].map((item, index) => (
                        <Row key={index} className="mb-1 align-items-center">
                          <Col sm="5" className="fw-bolder">
                            {item.label}:
                          </Col>
                          <Col sm="7">
                            {item.value !== undefined &&
                            item.value !== null &&
                            item.value !== ""
                              ? item.value
                              : "null"}
                          </Col>
                        </Row>
                      ))}
                    </Col>

                    {/* Right Section */}
                    <Col md="6">
                      {[
                        {
                          label: "Mobile Number",
                          value:
                            `${memData?.countryCode ?? ""} ${
                              memData?.phoneNumber ?? ""
                            }`.trim() || "null",
                        },
                        { label: "State", value: memData?.state },
                        { label: "Country", value: memData?.country },
                        {
                          label: "Zip Code",
                          value: memData?.postalCode,
                        },
                      ].map((item, index) => (
                        <Row key={index} className="mb-1 align-items-center">
                          <Col sm="5" className="fw-bolder">
                            {item.label}:
                          </Col>
                          <Col sm="7">
                            {item.value !== undefined &&
                            item.value !== null &&
                            item.value !== ""
                              ? item.value
                              : "null"}
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </CardBody>
        </>
      </Card>
    </Fragment>
  );
};

export default ViewPass;
