// ** Custom Components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Third Party Components

import useJwt from "@src/auth/jwt/useJwt";
import { Edit, MoreVertical, Trash } from "react-feather";

// ** Reactstrap Imports
import { useNavigate } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

export let data;

// ** Expandable table component
const ExpandableTable = ({ data }) => {
  return (
    <div className="expandable-content p-2">
      <p>
        <span className="fw-bold">City:</span> {data.city}
      </p>
      <p>
        <span className="fw-bold">Experience:</span> {data.experience}
      </p>
      <p className="m-0">
        <span className="fw-bold">Post:</span> {data.post}
      </p>
    </div>
  );
};

// ** Table Server Side Column
export const serverSideColumns = [
  {
    sortable: true,
    name: "Id",
    // minWidth: "225px",
    selector: (row, index) => index + 1,
  },
  {
    sortable: true,
    name: "Vendor Name",
    // minWidth: "225px",
    selector: (row) => row.vendorName,
  },
  {
    sortable: true,
    name: "Address",
    // minWidth: "250px",
    selector: (row) => row.address,
  },
  {
    sortable: true,
    name: "phoneNumber",
    // minWidth: "250px",
    selector: (row) => row.phoneNumber,
  },
  {
    sortable: true,
    name: "Email",
    // minWidth: "150px",
    selector: (row) => row.emailId,
  },

  {
    name: "Actions",
    sortable: true,
    // minWidth: "150px",
    cell: (row) => {
      const MySwal = withReactContent(Swal);

      const handleDelete = async (uid) => {
        return MySwal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-danger ms-1",
          },
          buttonsStyling: false,
        }).then(async function (result) {
          if (result.value) {
            try {
              // Call delete API
              const response = await useJwt.deleteVender(uid);
              if (response.status === 204) {
                setData((prevData) => {
                  const newData = prevData.filter((item) => item.uid !== uid);
                  return newData;
                });
                // Show success message
                MySwal.fire({
                  icon: "success",
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  customClass: {
                    confirmButton: "btn btn-success",
                  },
                });
              }
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          } else if (result.dismiss === MySwal.DismissReason.cancel) {
            MySwal.fire({
              title: "Cancelled",
              text: "Your imaginary file is safe :)",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-success",
              },
            });
          }
        });
      };
      const navigate = useNavigate();
      const handleEdit = (row) => {
        navigate("/pos/VendorManage/addVendor", {
          state: {
            venderData: row,
            uid: row.uid,
          },
        });
      };
      return (
        <UncontrolledDropdown>
          <DropdownToggle
            className="icon-btn hide-arrow"
            color="transparent"
            size="sm"
            caret
          >
            <MoreVertical size={15} />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => handleEdit(row)}>
              <Edit className="me-50" size={15} />
              <span className="align-middle">Edit</span>
            </DropdownItem>
            <DropdownItem onClick={() => handleDelete(row.uid)}>
              <Trash className="me-50" size={15} />
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        // <div className="d-flex">
        //   <Link
        //     style={{ margin: "0.5rem" }}
        //     to={`/pos/VendorManage/addVendor`}
        //     state={{
        //       venderData: row,
        //       uid: row.uid,
        //     }}
        //   >
        //     <span>
        //       <Edit2 className="font-medium-3 text-body" />
        //     </span>
        //   </Link>

        //   <Link style={{ margin: "0.5rem" }}>
        //     {" "}
        //     <span
        //       color="danger"
        //       style={{ cursor: "pointer", color: "red" }}
        //       onClick={() => handleDelete(row.uid)}
        //     >
        //       <Trash className="font-medium-3 text-body" />
        //     </span>
        //   </Link>
        // </div>
      );
    },
  },
];

export default ExpandableTable;
