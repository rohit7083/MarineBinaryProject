import React, { Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select'
import { selectThemeColors } from '@utils'

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
import ProductHeader from "./ProductsHeader";

function Header() {

  const colourOptions = [
    { value: 'ocean', label: 'Ocean' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' }
  ]

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
      {/* <Col md="12">
        {" "}
        <Col md="8">
          <Card className="round" style={{ padding: "20px" }}>
            <CardBody>
              <Row>
                <Col md="8">
                  <h4 className="mb-1">Search Customer</h4>
                  <FormGroup>
                    <Col></Col>
                    <Col>
                      <Label for="email">Subtotal</Label>
                      <Input
                        type="text"
                        id=""
                        placeholder="Enter your Subtotal"
                      />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="4">
          <Card className="round" style={{ padding: "20px" }}>
            <CardBody>
              <Row>
                <Col md="4">
                  <h4 className="mb-1">Search Customer</h4>
                  <FormGroup>
                    <Col></Col>
                    <Col>
                      <Label for="email">Subtotal</Label>
                    </Col>
                  </FormGroup>
                </Col>
                <Col sm='4' >


                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Col> */}




<Row>
  {/* Left Section - 8 columns */}
  <Col md="8">
    <Card className="round" >
      <CardBody>
        <h4 className="mb-1">Search Customer</h4>
        <Row>
        <Col className='mb-1' md='4' sm='8'>
            <Label className='form-label'>By Slip No
            </Label>
            <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
          </Col>
          <Col className='mb-1' md='4' sm='8'>
            <Label className='form-label'>By Contact No
            </Label>
            <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
          </Col>
          <Col className='mb-1' md='4' sm='8'>
            <Label className='form-label'>By Customer Name
            </Label>
            <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
          </Col>
          </Row>
      </CardBody>
    </Card>
  </Col>

  {/* Right Section - 4 columns */}
  <Col md="4">
      <ProductHeader/>

  </Col>
</Row>

    </Fragment>
  );
}

export default Header;
