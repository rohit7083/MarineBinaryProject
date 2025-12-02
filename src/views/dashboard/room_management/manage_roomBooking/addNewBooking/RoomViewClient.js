// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";


// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row
} from "reactstrap";

const ViewPass = ({ selectedMember }) => {
  const [memberDetails, setMemberDetails] = useState({
    active: false,
    address: "",
    cards: null,
    city: "",
    country: "",
    countryCode: "",
    createdAt: "",
    createdBy: {
      uid: "",
      name: "",
    },
    emailId: "",
    firstName: "",
    guest: 0,
    id: null,
    isDelete: false,
    lastName: "",
    lazzerId: null,
    parkingAllocations: null,
    payment: null,
    phoneNumber: "",
    postalCode: "",
    secondaryEmail: "",
    secondaryGuestName: "",
    secondaryPhoneNumber: "",
    slipId: null,
    slips: null,
    state: "",
    uid: "",
  });
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setMemberDetails(selectedMember);
  }, [selectedMember]);

  if (!memberDetails) return null;
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
                          value: memberDetails?.firstName,
                        },
                        {
                          label: "Last Name",
                          value: memberDetails?.lastName,
                        },
                        { label: "Email", value: memberDetails?.emailId }, // FIXED KEY
                        { label: "Address", value: memberDetails?.address },
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
                            `${memberDetails?.countryCode ?? ""} ${
                              memberDetails?.phoneNumber ?? ""
                            }`.trim() || "null",
                        },
                        { label: "State", value: memberDetails?.state },
                        { label: "Country", value: memberDetails?.country },
                        {
                          label: "Postal Code",
                          value: memberDetails?.postalCode,
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
