import { selectThemeColors } from "@utils";
import { Search } from "react-feather";
import Select from "react-select";

import {
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";

const SearchBar = () => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Col md="6">
              <Label className="form-label">Invoice No</Label>
              <InputGroup className="input-group-merge">
                <Input className="search-product" placeholder="LT3763" />
              </InputGroup>
            </Col>

            <Col md="6">
              <Label className="form-label">Invoice Date</Label>
              <InputGroup className="input-group-merge">
                <Input type="date" value={today} disabled />
              </InputGroup>
            </Col>
          </Row>

          <Row className="mt-1">
            <Col sm="6">
              {" "}
              <Label className="form-label">Search Products</Label>
              <InputGroup className="input-group-merge">
                <Input
                  className="search-product"
                  placeholder="Search Product"
                  // value={searchTerm}
                  // onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputGroupText>
                  <Search className="text-muted" size={14} />
                </InputGroupText>
              </InputGroup>
            </Col>

            <Col sm="6">
              {" "}
              <Label className="form-label">Category</Label>
              <Select
                isClearable={false}
                isMulti
                theme={selectThemeColors}
                name="categories"
                // value={selectedCategories}
                // onChange={(val) => setSelectedCategories(val || [])}
                // options={categories}
                className="react-select"
                classNamePrefix="select"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default SearchBar;
