import { AbilityContext } from "@src/utility/context/Can";
import { useContext, useState } from "react";
import { FolderPlus, Percent, PlusCircle, UserPlus } from "react-feather";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

function ProductDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ability = useContext(AbilityContext);

  const toggle = () => setDropdownOpen((prev) => !prev);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
      <DropdownToggle size="sm" caret color="primary" outline>
        Product Management
      </DropdownToggle>
      <DropdownMenu>
        {ability.can("create", "pos") ? (
          <DropdownItem
            tag={Link}
            to="/dashboard/pos/product_management/addProduct_index"
          >
            <PlusCircle size={16} className="me-2" />
            Add Product
          </DropdownItem>
        ) : null}
        <DropdownItem
          tag={Link}
          to="/dashboard/pos/product_management/addproductCategory"
        >
          <FolderPlus size={16} className="me-2" />
          Add Category
        </DropdownItem>

        <DropdownItem
          tag={Link}
          to="/dashboard/pos/product_management/addTaxes"
        >
          <Percent size={16} className="me-2" />
          Add Taxes
        </DropdownItem>
        <DropdownItem tag={Link} to="/pos/VendorManage">
          <UserPlus size={16} className="me-2" />
          Add vendor
        </DropdownItem>

        {/* <DropdownItem
          tag={Link}
          to="/dashboard/pos/product_management/AddStocks"
        >
          <Package size={16} className="me-2" />
          Add Stock
        </DropdownItem> */}
        {/* <DropdownItem
          tag={Link}
          to="/dashboard/pos/product_management/manageStocks"
        >
          <Layers size={16} className="me-2" />
          Manage Stocks
        </DropdownItem> */}
        {/* <DropdownItem
          tag={Link}
          to="/dashboard/pos/product_management/manageStocks"
        >
          <Upload size={16} className="me-2" />
          Import Product
        </DropdownItem> */}
      </DropdownMenu>
    </Dropdown>
  );
}

export default ProductDropdown;
