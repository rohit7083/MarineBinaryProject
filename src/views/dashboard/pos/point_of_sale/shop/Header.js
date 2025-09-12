import { selectThemeColors } from "@utils";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";

import { ArrowLeft } from "react-feather";
import { Button, Card, CardBody, CardTitle, Col, Label, Row } from "reactstrap";
import ProductHeader from "./ProductsHeader";

function Header() {
  const colourOptions = [
    { value: "ocean", label: "Ocean" },
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm({});
  return (
    <Fragment>
      <Row>
        <Col md="12">
          <Card className="round">
            <CardBody>
              <CardTitle tag="h4">
                {" "}
                <ArrowLeft
                  style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    transition: "color 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#9289F3")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#6E6B7B")
                  }
                  onClick={() => window.history.back()}
                />
                Point Of Sale
              </CardTitle>
              <hr />

              <Row className="align-items-start">
                {/* Left side: Title + Search Fields */}
                <Col md="8">
                  <CardTitle tag="h4" className="mb-2">
                    Search Existing Customer
                  </CardTitle>

                  <Row>
                    <Col className="mb-1" md="4" sm="12">
                      <Label className="form-label">By Slip No</Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        defaultValue={colourOptions[0]}
                        options={colourOptions}
                        isClearable={false}
                      />
                    </Col>

                    <Col className="mb-1" md="4" sm="12">
                      <Label className="form-label">By Contact No</Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        defaultValue={colourOptions[0]}
                        options={colourOptions}
                        isClearable={false}
                      />
                    </Col>

                    <Col className="mb-1" md="4" sm="12">
                      <Label className="form-label">By Customer Name</Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        defaultValue={colourOptions[0]}
                        options={colourOptions}
                        isClearable={false}
                      />
                    </Col>
                  </Row>
                </Col>

                {/* Right side: Buttons */}
                <Col
                  md="4"
                  className="text-center"
                  style={{ borderLeft: "1px solid gray" }}
                >
                  <CardTitle tag="h4" className="">
                    Add New Customer
                  </CardTitle>

                  <Button
                    color="primary"
                    size="sm"
                    style={{ width: "150px" }}
                    className=" "
                  >
                    Add Customer
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    style={{ width: "150px" }}
                    className=" mt-1"
                  >
                    Walk-In Customer
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col md="12">
          <ProductHeader />
        </Col>
      </Row>
    </Fragment>
  );
}

export default Header;
