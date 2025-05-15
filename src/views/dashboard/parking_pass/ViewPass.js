// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import React from "react";

import useJwt from "@src/auth/jwt/useJwt";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  Button,
  Input,
  CardText,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

/*
{
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
  }
*/

const ViewPass = ({ watch }) => {
  const [memberDetails, setMemberDetails] = useState(null);



  const handlefetchGuest = async () => {
    try {
      const { data } = await useJwt.guest();
      setMemberDetails(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    {{debugger}}
    if (watch("memberType") == "guest") {
      handlefetchGuest();
    }else if(watch("memberType") == "existing"){
      const details=watch("selectedMember")
      setMemberDetails(details)
    }
    return ()=> setMemberDetails(null)
  }, [watch("memberType"),watch("selectedMember")]);

  const paymentOptions = [
    { value: "Credit/debit-card", label: "Credit/debit-card" },
    { value: "Cash", label: "Cash" },
  ];
  const memberDetail = {
    firstName: null,
    lastName: null,
    memberEmail: null,
    address: null,
    countryCode: null,
    mobileNumber: null,
    state: null,
    country: null,
    postalCode: null,
  };


if(!memberDetails)return null
  return (
    <Fragment>
      <Card className="invoice-action-wrapper">
        {watch("memberType") && (<>

        <CardBody>
          <CardTitle>Member details</CardTitle>
          <Row>
            <Col xl="12" xs="12">
              <div style={{ fontSize: "12px" }}>
                <Row>
                  {/* Left Section */}
                  <Col md="6">
                    {[
                      { label: "First Name", value: memberDetails?.firstName },
                      { label: "Last Name", value: memberDetails?.lastName },
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
        </>)}

      </Card>
      {/* <div className='mt-2'>
        <div className='invoice-payment-option'>
          <p className='mb-50'>Accept payments via</p>
          <Select
            options={paymentOptions}
            id='payment-select'
            placeholder='Select Payment Method'
            className='react-select-container'
            classNamePrefix='react-select'
          />
        </div>
      
      </div> */}
    </Fragment>
  );
};

export default ViewPass;

//  <Col xl="12" xs="12">
//                                   <Row  className="mb-0"  style={{ fontSize: '12px' }}>
//                                     <Col sm="6" className=" fw-bolder mb-1" >
//                                       First Name:
//                                     </Col>
//                                     <Col tag="dd" sm="6" className="mb-1">
//                                       {/* {memberDetails?.firstName} */}
//                                     </Col>

//                                     <Col tag="dt" sm="6" className="fw-bolder mb-1">
//                                       Last Name :
//                                     </Col>
//                                     <Col tag="dd" sm="6" className="mb-1">
//                                       {/* {memberDetail?.lastName} */}
//                                     </Col>

//                                     <Col tag="dt" sm="6" className="fw-bolder mb-1">
//                                       Email:
//                                     </Col>
//                                     <Col tag="dd" sm="6" className="mb-1">
//                                       {/* {memberDetail?.memberEmail} */}
//                                     </Col>

//                                     <Col tag="dt" sm="6" className="fw-bolder mb-1">
//                                       Address:
//                                     </Col>
//                                     <Col tag="dd" sm="6" className="mb-1">
//                                       {/* {memberDetail?.address} */}
//                                     </Col>

//                                     <Col tag="dt" sm="6" className="fw-bolder mb-1">
//                                       Mobile Number :
//                                     </Col>
//                                     <Col tag="dd" sm="6" className="mb-1">
//                                       {/* {memberDetail?.countryCode} {memberDetail?.mobileNumber} */}
//                                     </Col>

//                                     <Col tag="dt" sm="6" className="fw-bolder mb-1">
//                                       State :{" "}
//                                     </Col>
//                                     <Col tag="dd" sm="6" className="mb-1">
//                                       {/* {memberDetail?.state} */}
//                                     </Col>

//                                     <Col tag="dt" sm="6" className="fw-bolder mb-1">
//                                       Country:
//                                     </Col>
//                                     <Col tag="dd" sm="6" className="mb-1">
//                                       {/* {memberDetail?.country} */}
//                                     </Col>

//                                     <Col tag="dt" sm="6" className="fw-bolder mb-1">
//                                       Postal Code :
//                                     </Col>
//                                     <Col tag="dd" sm="6" className="mb-1">
//                                       {/* {memberDetail?.postalCode} */}
//                                     </Col>
//                                   </Row>
//                                 </Col>
