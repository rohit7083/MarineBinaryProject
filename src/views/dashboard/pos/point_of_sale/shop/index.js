import { useState } from "react";
import Header from "./Header";
import ProductsSearchbar from "./ProductsSearchbar";
function index() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  return (
    <div>
      {/* search bar and add new customer */}
      <Header
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
      />
      <ProductsSearchbar
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
      />
    </div>
  );
}

export default index;
