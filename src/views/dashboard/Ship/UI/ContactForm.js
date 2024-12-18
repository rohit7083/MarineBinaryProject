// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Container,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  InputGroup,
  InputGroupText,
  CardText,
  CardHeader,
} from "reactstrap";
const colourOptions = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Ms', label: 'Ms' },
   
  ]
  
// ** Icons Imports
import { User, Mail, Smartphone, Lock } from "react-feather";
// ** Third Party Components
import Select from 'react-select'

// ** Utils
import { selectThemeColors } from '@utils'

const HorizontalFormIcons = () => {
  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle tag="h4">Contact For Franchisee
    //     </CardTitle>
    //   </CardHeader>
    //   <CardBody>
    //     <Form>
    //     <Row className="mb-1">
    //         <Label sm="3" for="nameIcons">
    //           Label
    //         </Label>
    //         <Col sm="9">
    //         <Select
    //           theme={selectThemeColors}
    //           className='react-select'
    //           classNamePrefix='select'
    //           defaultValue={colourOptions[0]}
    //           options={colourOptions}
    //           isClearable={false}
    //         />
    //       </Col>
    //       </Row>
        
    //       <Row className="mb-1">
    //         <Label sm="3" for="nameIcons">
    //           Name
    //         </Label>
    //         <Col sm="9">
    //           <InputGroup className="input-group-merge">
    //             <InputGroupText>
    //               <User size={15} />
    //             </InputGroupText>
    //             <Input
    //               type="text"
    //               name="name"
    //               id="nameIcons"
    //               placeholder="Enter Full Name"
    //             />
    //           </InputGroup>
    //         </Col>
    //       </Row>

    //       <Row className="mb-1">
    //         <Label sm="3" for="EmailIcons">
    //           Email
    //         </Label>
    //         <Col sm="9">
    //           <InputGroup className="input-group-merge">
    //             <InputGroupText>
    //               <Mail size={15} />
    //             </InputGroupText>
    //             <Input
    //               type="email"
    //               name="Email"
    //               id="EmailIcons"
    //               placeholder="Enter Email"
    //             />
    //           </InputGroup>
    //         </Col>
    //       </Row>

    //       <Row className="mb-1">
    //         <Label sm="3" for="mobileIcons">
    //           Mobile
    //         </Label>
    //         <Col sm="9">
    //           <InputGroup className="input-group-merge">
    //             <InputGroupText>
    //               <Smartphone size={15} />
    //             </InputGroupText>
    //             <Input
    //               type="number"
    //               name="mobile"
    //               id="mobileIcons"
    //               placeholder="Enter Mobile"
    //             />
    //           </InputGroup>
    //         </Col>
    //       </Row>

    //       <Row className="mb-1">
    //         <Label sm="3" for="mobileIcons">
    //           Office Number
    //         </Label>
    //         <Col sm="9">
    //           <InputGroup className="input-group-merge">
    //             <InputGroupText>
    //               <Smartphone size={15} />
    //             </InputGroupText>
    //             <Input
    //               type="number"
    //               name="mobile"
    //               id="mobileIcons"
    //               placeholder="Enter Number"
    //             />
    //           </InputGroup>
    //         </Col>
    //       </Row>

    //       <Row className="mb-1">
    //         <Label sm="3" for="passwordIcons">
    //           City
    //         </Label>
    //         <Col sm="9">
    //           <InputGroup className="input-group-merge">
    //             <InputGroupText>
    //               <Lock size={15} />
    //             </InputGroupText>
    //             <Input
    //               type="text"
    //               name="City"
    //               id="City"
    //               placeholder="Enter City"
    //             />
    //           </InputGroup>
    //         </Col>
    //       </Row>

    //       <Row className="mb-1">
    //         <Label sm="3" for="passwordIcons">
    //           Default
    //         </Label>
    //         <Col sm="9">
    //           <Input
    //             type="textarea"
    //             name="text"
    //             id="exampleText"
    //             rows="3"
    //             placeholder="Textarea"
    //           />
    //         </Col>
    //       </Row>

    //       <Row>
    //         <Col className="d-flex" md={{ size: 9, offset: 3 }}>
    //           <Button
    //             className="me-1"
    //             color="primary"
    //             type="submit"
    //             onClick={(e) => e.preventDefault()}
    //           >
    //             Submit
    //           </Button>
    //           <Button outline color="secondary" type="reset">
    //             Reset
    //           </Button>
    //         </Col>
    //       </Row>
    //     </Form>
    //   </CardBody>
    // </Card>

<Container>
<Row className="align-items-center">
  {/* Left side: Image */}
  <Col md="6">
    <img
      src="https://images.pexels.com/photos/4262170/pexels-photo-4262170.jpeg?auto=compress&cs=tinysrgb&w=600" // Replace with your image URL
      alt="Left side"
      className="img-fluid"
    />
  </Col>

  {/* Right side: Heading/Text */}
  <Col md="6">
    <h2>Your Heading Here</h2>
    <p>This is a description or any other content you want to add.</p>
<p>orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>
<Button.Ripple color='success'>Franchise details</Button.Ripple>

  </Col>
</Row>
</Container>








  );
};
export default HorizontalFormIcons;
