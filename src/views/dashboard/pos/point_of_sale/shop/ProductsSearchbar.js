// ** Icons Imports
import { Search } from "react-feather";
import Select, { components } from "react-select"; // eslint-disable-line
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  InputGroup,
  Input,
  Label,
  InputGroupText,
  Card,
  CardBody,
  CardText,
  Button,
} from "reactstrap";

const ProductsSearchbar = (props) => {
  // ** Props

  const colorOptions = [
    { value: "ocean", label: "Snaks", color: "#00B8D9", isFixed: true },
    { value: "blue", label: "Clothes", color: "#0052CC", isFixed: true },
    { value: "purple", label: "Drinks", color: "#5243AA", isFixed: true },
    { value: "red", label: "Assets", color: "#FF5630", isFixed: false },
    { value: "orange", label: "something", color: "#FF8B00", isFixed: false },
    { value: "yellow", label: "sommething", color: "#FFC400", isFixed: false },
  ];

  const groupedOptions = [
    {
      label: "Ice Creams",
      options: [
        { value: "vanilla", label: "Vanilla" },
        { value: "Dark Chocolate", label: "Dark Chocolate" },
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "salted-caramel", label: "Salted Caramel" },
      ],
    },
    {
      label: "Snacks",
      options: [
        { value: "Pizza", label: "Pizza" },
        { value: "Burger", label: "Burger" },
        { value: "Pasta", label: "Pasta" },
        { value: "Pretzel", label: "Pretzel" },
        { value: "Popcorn", label: "Popcorn" },
      ],
    },
  ];

  const formatGroupLabel = (data) => (
    <div className="d-flex justify-content-between align-center">
      <strong>
        <span>{data.label}</span>
      </strong>
      <span>{data.options.length}</span>
    </div>
  );
  return (
    <div id="ecommerce-searchbar" className="ecommerce-searchbar">
      <Row className="mt-1 mb-2">
        <Col sm="4">
          <Label className="form-label">Search Products</Label>

          <InputGroup className="input-group-merge">
            <Input className="search-product" placeholder="Search Product" />
            <InputGroupText>
              <Search className="text-muted" size={14} />
            </InputGroupText>
          </InputGroup>
        </Col>

        <Col className="mb-1" sm="4">
          <Label className="form-label">Category</Label>
          <Select
            isClearable={false}
            theme={selectThemeColors}
            // defaultValue={[colorOptions[2], colorOptions[3]]}
            isMulti
            name="colors"
            options={colorOptions}
            className="react-select"
            classNamePrefix="select"
          />
        </Col>
        <Col sm="4" className="d-flex gap-2">
          <Col md="6">
            <Label className="form-label">Invoice No
            </Label>

            <InputGroup className="input-group-merge">
              <Input className="search-product"  placeholder="LT3763" />
              
            </InputGroup>
          </Col>

          <Col md="6">
            <Label className="form-label">Invoice Date
            </Label>

            <InputGroup className="input-group-merge">
            <Input className="search-product"  placeholder="March 21 Dec" />

             
            </InputGroup>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default ProductsSearchbar;
