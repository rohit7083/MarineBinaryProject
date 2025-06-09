// import React from 'react'

// function CheckInDetails() {
//   return (
//     <>

//     </>
//   )
// }

// export default CheckInDetails

import { useForm, Controller, set, useFieldArray } from "react-hook-form";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import useJwt from "@src/auth/jwt/useJwt";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  Row,
  Col,
  Container,
  InputGroup,
  InputGroupText,
  FormGroup,
  FormFeedback,
  Spinner,
  UncontrolledAlert,
  CardText,
  Badge,
  Table,
} from "reactstrap";
import React, { Fragment, useEffect, useState } from "react";

import { data } from "jquery";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { Trash2 } from "react-feather";

const Checkout = () => {
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const MySwal = withReactContent(Swal);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specialDays",
  });
  const [loading, setLoading] = useState(false);
  const [memberDetail, setMemberDetails] = useState();
  const { token } = useParams();
  const navigate = useNavigate();
  const [loadPayment, setLoadPayment] = useState(false);
  const [err, setErr] = useState("");
  const getMember = async () => {
    try {
      setLoading(true);
      const res = await useJwt.getMemberDetails(token);
      console.log("res", res);
      // const eventId=res?.data?.eventId;

      setMemberDetails(res?.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMember();
  }, []);

  const onSubmit = async (data) => {
    setErr("");

    try {
      setLoadPayment(true);
      const res = await useJwt.totalPayment(token, payload);
      console.log(res);
      if (res.status === 200) {
        return MySwal.fire({
          title: "  Success",
          text: "Your Payment Completed  Successfully",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
        }).then(() => {
          navigate("/dashbord");
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log("Error data", error.response.data);
        console.log("Error status", error.response.status);
        console.log("Error headers", error.response.headers);
        setErr(error.response.data.content);
      }
    } finally {
      setLoadPayment(false);
    }
    console.log(data);
  };

  const specialDays = [
  {
    id: 1,
    guestName: "John Doe",
    age: "25",
    photo: "",
    idName: "ABC1234"
  },
  {
    id: 2,
    guestName: "Jane Smith",
    age: "30",
    photo: "",
    idName: "XYZ5678"
  },
  {
    id: 3,
    guestName: "Alice Johnson",
    age: "28",
    photo: "",
    idName: "LMN9101"
  }
];

  return (
    <Row className="d-flex justify-content-center mt-3">
      <Col xs="12">
        <Row>
          <Col xl="12" xs="12">
            <Card>
              <CardBody>
                <CardTitle className="mb-1" tag="h4">
                  Check In Details
                </CardTitle>
                <Badge className="me-1" color="primary">
                  201 Delux
                </Badge>

                <Badge className="me-1" color="primary">
                  271 Delux
                </Badge>
                <Badge className="me-1" color="primary">
                  101 Delux
                </Badge>

                <hr />
                <Row>
                  <Col>
                    <CardText className="">Check In</CardText>
                    <CardTitle className="m-auto">
                      <span
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          fontSize: "2em",
                        }}
                      >
                        09
                      </span>{" "}
                      <span style={{ fontSize: "0.8em" }}>Jun 2025</span>
                    </CardTitle>
                    <CardText
                      className=""
                      style={{ fontSize: "0.8em", margin: "-1em 0.5em" }}
                    >
                      Monday
                    </CardText>
                  </Col>
                  <Col>
                    {" "}
                    <CardText className="">Check Out</CardText>
                    <CardTitle className="m-auto">
                      <span
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          fontSize: "2em",
                        }}
                      >
                        12
                      </span>{" "}
                      <span style={{ fontSize: "0.8em" }}>Jun 2025</span>{" "}
                    </CardTitle>
                    <CardText
                      className=""
                      style={{ fontSize: "0.8em", margin: "-1em 0.5em" }}
                    >
                      Saturday
                    </CardText>
                  </Col>

                  <Col>
                    {" "}
                    <CardText className="">Total Days</CardText>
                    <CardTitle className="m-auto">
                      <span
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          fontSize: "2em",
                        }}
                      >
                        03
                      </span>
                      <span style={{ fontSize: "0.8em" }}>Days</span>
                    </CardTitle>
                  </Col>

                  <Col>
                    {" "}
                    <CardText className=""> Total Amount</CardText>
                    <CardTitle className="m-auto">
                      <span
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          fontSize: "2em",
                        }}
                      >
                        $693
                      </span>
                    </CardTitle>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl="12" xs="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Guest Details</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Guest Name</th>
                      <th>Guest Age</th>
                      <th>Photo ID</th>
                      <th>Identity Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((item, index) => (
                      <tr key={item.id}>

                        <td>
                          <Controller
                            name={`specialDays.${index}.guestName`}
                            control={control}
                            rules={{
                              required: "Guest name is required",
                              pattern: {
                                value: /^\d+$/,
                                message: "Only numeric values are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Enter Guest Name "
                                {...field}
                              />
                            )}
                          />
                          {errors.specialDays?.[index]?.guestName && (
                            <span className="text-danger">
                              {errors.specialDays[index].guestName.message}
                            </span>
                          )}
                        </td>
                        <td>
                          <Controller
                            name={`specialDays.${index}.age`}
                            control={control}
                            rules={{
                              required: "Price is required",
                              pattern: {
                                value: /^\d+$/,
                                message: "Only numeric values are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Enter Guest Age "
                                {...field}
                              />
                            )}
                          />
                          {errors.specialDays?.[index]?.price && (
                            <span className="text-danger">
                              {errors.specialDays[index].price.message}
                            </span>
                          )}
                        </td>
                        <td>
                          <Controller
                            name={`specialDays.${index}.photo`}
                            control={control}
                            rules={{
                              required: "Description is required",
                              pattern: {
                                value: /^[A-Za-z]+$/,
                                message:
                                  "Only alphabetic characters (A–Z) are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                type="file"
                                name="file"
                                id="fileInput"
                                //   onChange={handleFileChange}
                              />
                            )}
                          />
                          {errors.specialDays?.[index]?.description && (
                            <span className="text-danger">
                              {errors.specialDays[index].description.message}
                            </span>
                          )}
                        </td>
                        <td>
                          <Controller
                            name={`specialDays.${index}.idName`}
                            control={control}
                            rules={{
                              required: "Description is required",
                              pattern: {
                                value: /^[A-Za-z]+$/,
                                message:
                                  "Only alphabetic characters (A–Z) are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Identity Name"
                                {...field}
                              />
                            )}
                          />
                          {errors.specialDays?.[index]?.description && (
                            <span className="text-danger">
                              {errors.specialDays[index].description.message}
                            </span>
                          )}
                        </td>

                        <td>
                          <Trash2
                            style={{ cursor: "pointer" }}
                            onClick={() => remove(index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-start ms-2 mt-2 mb-1">
                  <Button
                    color="primary"
                    type="button"
                    size="sm"
                    onClick={() =>
append({ guestName: "", age: "", photo: "", idName: "" })
                    }
                  >
                    Add New
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Button type="submit" color="primary" className="btn-next">
          Submit
        </Button>
      </Col>
    </Row>
  );
};

export default Checkout;
