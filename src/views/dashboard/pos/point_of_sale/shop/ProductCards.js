// ** Images
import img1 from "@src/assets/images/slider/03.jpg";
import { selectThemeColors } from "@utils";
import { Fragment } from "react";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import OrderDetails from "./OrderDetails";

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
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
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
          <OrderDetails />
          {/* <PayementDetails/> */}
        </Col>
      </Row>
    </Fragment>
  );
};

export default ProductPage;
