import { ArrowLeft } from "react-feather"; // assuming feather icons
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap"; // assuming reactstrap
import NavItems from "../NavItems"; // your component

function Heading({ updateData }) {
  return (
    <Card>
      <CardBody>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
          {/* Title with Back Button */}
          <CardTitle tag="h4" className="d-flex align-items-center gap-2">
            <ArrowLeft
              style={{
                cursor: "pointer",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9289F3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6B7B")}
              onClick={() => window.history.back()}
            />
            {/* {updateData ? "Update Product" : "Add New Products"} */}
            Add Products
          </CardTitle>

          {/* Nav Items */}
          <div className="d-flex mt-md-0 mt-2 justify-content-start gap-2">
            <NavItems />
          </div>
        </CardHeader>
      </CardBody>
    </Card>
  );
}

export default Heading;
