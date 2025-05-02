import { Table, Card, Input, Button, Row, Col, Label } from "reactstrap";
import { useState } from "react";
// ** Icons Imports
import { Trash2 } from "react-feather";
import { Pointer } from "lucide-react";

const CompanyTable = () => {
  // ** State to hold data
  const [data, setData] = useState([{ id: 1 }]);

  // Function to add a new field
  const addField = (e) => {
    e.preventDefault(); // Prevents page refresh
    setData([...data, { id: Date.now() }]); // Unique id for key
  };
  console.log(data);

  // Function to remove a row
  const removeField = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <Card className="card-company-table p-3">
      <div className="">
        {data.map((row) => (
          <>
          <Row
            className="p-2"
            style={{ border: "2px solid black", borderRadius: "10px" }}
            key={row.id}
          >
            <Col md="2" sm="12" className="mb-1 ">
              <Label className="form-label" for="productName">
                Product Name
              </Label>
              <Input type="text" id="productName" placeholder="Product Name" />
            </Col>
            <Col md="2" sm="12" className="mb-1 ">
              <Label className="form-label" for="productName">
                Product type
              </Label>
              <Input type="text" id="productName" placeholder="Product Name" />
            </Col>
            <Col md="2" sm="12" className="mb-1 ">
              <Label className="form-label" for="productName">
                Product type
              </Label>
              <Input type="text" id="productName" placeholder="Product Name" />
            </Col>
         
            <Col md="6" sm="12" className="mb-1 ">
              <Label className="form-label" for="productImage">
                Product Image
              </Label>
              <Input type="file" id="productImage" accept="image/*" />
            </Col>
            <Row>
              <Col md="2" sm="12" className="mb-1 ">
                <Label className="form-label" for="productName">
                  Product Name
                </Label>
                <Input
                  type="text"
                  id="productName"
                  placeholder="Product Name"
                />
              </Col>
              <Col md="2" sm="12" className="mb-1 ">
                <Label className="form-label" for="productName">
                  Product type
                </Label>
                <Input
                  type="text"
                  id="productName"
                  placeholder="Product Name"
                />
              </Col>
              <Col md="2" sm="12" className="mb-1 ">
                <Label className="form-label" for="productName">
                  Product type
                </Label>
                <Input
                  type="text"
                  id="productName"
                  placeholder="Product Name"
                />
              </Col>
              <Col md="6" sm="12" className="mt-4 d-flex justify-content-end">

            <Trash2 className="d-flex" style={{ cursor: "pointer" }} />
              </Col>
            </Row>
            </Row>

          </>
        ))}
      </div>
    </Card>
  );
};

export default CompanyTable;
