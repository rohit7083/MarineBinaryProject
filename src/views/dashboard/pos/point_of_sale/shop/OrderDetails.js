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


const OrderDetails = () => {

  return (
    <Fragment>
          <Card className="round" style={{ padding: "20px" }}>
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
          </Card>

    </Fragment>
  );
};

export default OrderDetails;
