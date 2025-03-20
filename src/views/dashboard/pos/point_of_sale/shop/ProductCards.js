// ** Images
import React, { Fragment } from "react";
import {
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import img1 from "@src/assets/images/slider/03.jpg";
import { Minus, Plus, PlusCircle } from "react-feather";
import { color, fontWeight, height, width } from "@mui/system";
import index from ".";
import Select, { components } from "react-select";
import { selectThemeColors } from "@utils";
import OrderDetails from "./OrderDetails";
import PayementDetails from "./PayementDetails";

const ProductPage = () => {
  const colourOptions = [
    { value: "ocean", label: "1 Kg" },
    { value: "blue", label: "500 Gm" },
    { value: "purple", label: "250 GM" },
    { value: "red", label: "100 Ml" },
  ];

  return (
    <Fragment>
      <Row className="match-height mb-2">
        {/* Left Side - Product Cards */}
        <Col md="8">
          <Row>
            {[1, 2, 3,4,5,6].map((_, index) => (
              <Col md="4" xs="12" key={index} className="mb-3">
                <Card
                  style={{ width: "100%", height: "auto", fontSize: "14px" }}
                >
                  <CardImg
                    top
                    src={img1}
                    alt="Card image"
                    style={{ height: "200px" }}
                  />
                  <CardBody style={{ padding: "8px" }}>
                    <Row>
                      <Col md="9" xs="12">
                        <CardTitle
                          tag="h5"
                          style={{ fontSize: "15px", marginBottom: "5px" }}
                        >
                          Blanket Blanket
                        </CardTitle>
                      </Col>
                      <Col tag="h5" md="3" xs="12">
                        $328
                      </Col>
                    </Row>
                    <CardText style={{ fontSize: "13px", marginBottom: "5px" }}>
                      This is a short description.
                    </CardText>
                  </CardBody>

                  <Col className="mb-1 px-1" md="12" sm="12">
                    {/* <Label className='form-label'>Multi Select</Label> */}
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      defaultValue={colourOptions[0]}
                      options={colourOptions}
                      isClearable={false}
                    />
                  </Col>

                  <Button.Ripple className="round m-2" color="primary" outline>
                    Add Item
                  </Button.Ripple>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Right Side - Form */}
        <Col md="4">
          {/* <Card className="round" style={{ padding: "20px" }}>
            <CardBody>
              <h4>Order Details</h4>

              {[1, 2, 3].map((_, index) => (
                <Row className="mt-1 ">
                  <Col xs="4">
                    <CardImg
                      src={img1}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Col>

                  <Col xs="8">
                    <CardText
                      className="mb-0"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      Blanket
                    </CardText>
                    <CardText className="">500 gm</CardText>

                    <Col className="d-flex">
                      <Button
                        size="sm"
                        className="round mt-1"
                        style={{
                          width: "28px",
                          color: "white",
                          backgroundColor: "#b2babb",
                          height: "28px",
                          padding: "4px",
                        }}
                      >
                        <Minus size={14} />
                      </Button>

                      <CardText
                        className="mt-2 mx-2 "
                        style={{ fontSize: "16px", fontWeight: "bold" }}
                      >
                        2
                      </CardText>

                      <Button
                        size="sm"
                        style={{
                          width: "28px",
                          height: "28px",
                          padding: "4px",
                        }}
                        className="round mt-1"
                        color="primary"
                      >
                        <Plus size={14} />
                      </Button>

                      <CardText
                        className="mt-2 ms-3 "
                        style={{ fontSize: "16px", fontWeight: "bold" }}
                      >
                        $ 102.03
                      </CardText>
                    </Col>
                  </Col>

                  <hr className="mt-2" />
                </Row>
              ))}
            </CardBody>
          </Card> */}

<OrderDetails/>
<PayementDetails/>
          
        </Col>
      </Row>
    </Fragment>
  );
};

export default ProductPage;
