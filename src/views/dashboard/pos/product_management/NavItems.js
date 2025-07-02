import React from "react";
import { Plus } from "react-feather";
import { Link } from "react-router-dom";
import { Badge, Button } from "reactstrap";

function NavItems() {
  return (
    <>
      <div>
        <Link to="/dashboard/pos/product_management/addProduct">
          <div className="d-flex">
            <Button color="primary" outline size="sm">
              Add Producct
            </Button>
          </div>
        </Link>
      </div>

      <div>
        <Link to="/dashboard/pos/product_management/addproductCategory">
          <div className="d-flex">
            <Button color="primary" outline size="sm">
              Add Category
            </Button>
          </div>
        </Link>
      </div>
      <div>
        <Link to="/dashboard/pos/product_management/addTaxes">
          <div className="d-flex">
            <Button color="primary" outline size="sm">
              Add Taxes
            </Button>
          </div>
        </Link>
      </div>
      <div>
        <Link to="/dashboard/pos/product_management/AddStocks">
          <div className="d-flex">
            <Button color="primary" outline size="sm">
              Add Stock
            </Button>
          </div>
        </Link>
      </div>

      <div>
        <Link to="/dashboard/pos/product_management/manageStocks">
          <div className="d-flex">
            <Button color="primary" outline size="sm">
              Stock Manage
            </Button>
          </div>
        </Link>
      </div>
    </>
  );
}

export default NavItems;





// import React from "react";
// import { Plus } from "react-feather";
// import { Link, useLocation } from "react-router-dom";
// import { Badge, Button } from "reactstrap";



// const navLinks = [
//   { to: "/dashboard/pos/product_management/addProduct", label: "Add Product", icon: <Plus size={12} /> },
//   { to: "/dashboard/pos/product_management/addproductCategory", label: "Add Category" },
//   { to: "/dashboard/pos/product_management/addTaxes", label: "Add Taxes" },
//   { to: "/dashboard/pos/product_management/AddStocks", label: "Add Stock" },
//   { to: "/dashboard/pos/product_management/manageStocks", label: "Stock Manage" },
// ];

// function NavItems() {
//   const location = useLocation();



//   return (
// <>    <div >
//       {navLinks.map(({ to, label, icon }) => (
//         <Link key={to} to={to} className={`nav-link ${location.pathname === to ? "active" : ""}`}>
//           <Button color="primary" outline size="sm" className="nav-button">
//             {icon && <Badge color="primary" className="me-1">{icon}</Badge>}
//             {label}
//           </Button>
//         </Link>
//       ))}
//     </div>
//     </>

//   );
// }

// export default NavItems;
