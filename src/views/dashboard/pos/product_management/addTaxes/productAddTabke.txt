
import { Table, Card, Input, Button } from "reactstrap";
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
      {/* Move Add Row Button to Left */}
     
      <Table responsive>
        <thead>
          <tr>
            <th>Package Size</th>
            <th></th>
            <th>MRP Price</th>
            <th></th>
            <th>Stocks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>
                <Input type="text" placeholder="Product Name" />
              </td>
              <td>
                <Input type="text" placeholder="Product Name" />
              </td>
              <td>
                <Input type="text" placeholder="Product Name" />
              </td>
              <td>
                <Input type="text" placeholder="Product Name" />
              </td>
              <td>
                <Input type="text" placeholder="Product Name" />
              </td>
              <td>
              <Trash2 style={{ cursor: "pointer" }} onClick={() => removeField(row.id)} />
              </td>
            </tr>
          ))}
        </tbody>
        <div className="d-flex justify-content-start ms-2 mt-2 mb-1">
        <Button color="primary" onClick={addField}>
          Add
        </Button>
      </div>

      </Table>
    </Card>
  );
};

export default CompanyTable;
