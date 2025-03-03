// ** Custom Components
import Avatar from "@components/avatar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  MoreVertical,
  Edit,
  FileText,
  Archive,
  Trash,
  Edit2,
  Eye,
} from "react-feather";
import { Trash2 } from "react-feather";
// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// ** Vars
const states = [
  "success",
  "danger",
  "warning",
  "info",
  "dark",
  "primary",
  "secondary",
];



const PaymentTypes = {
  1: "CreditCard",
  2: "CardSwipe",
  3: "Cash",
  4: "Cheque21",
  5: "ChequeACH",
};
const status = {
  1: { title: 'Member-Pending', color: 'light-primary' },
  2: { title: 'Payment-Pending', color: 'light-info' },
  3: { title: 'Document-Pending', color: 'light-warning' },
  4: { title: 'Completed', color: 'light-success' },
  // 5: { title: 'Applied', color: '' }
};
// ** Table Zero Config Column
export const basicColumns = [
  {
    name: "ID",
    sortable: true,
    maxWidth: "100px",
    selector: (row, index) => index + 1, 
  },
  {
    name: "Name",
    sortable: true,
    minWidth: "225px",
    selector: (row) => row.full_name,
  },
  {
    name: "Email",
    sortable: true,
    minWidth: "310px",
    selector: (row) => row.email,
  },
  {
    name: "Position",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.post,
  },
  {
    name: "Age",
    sortable: true,
    minWidth: "100px",
    selector: (row) => row.age,
  },
  {
    name: "Salary",
    sortable: true,
    minWidth: "175px",
    selector: (row) => row.salary,
  },
];
// ** Table ReOrder Column
export const reOrderColumns = [
  {
    name: "ID",
    reorder: true,
    sortable: true,
    maxWidth: "100px",
    selector: (row) => row.id,
  },
  {
    name: "Name",
    reorder: true,
    sortable: true,
    minWidth: "225px",
    selector: (row) => row.full_name,
  },
  {
    name: "Email",
    reorder: true,
    sortable: true,
    minWidth: "310px",
    selector: (row) => row.email,
  },
  {
    name: "Position",
    reorder: true,
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.post,
  },
  {
    name: "Age",
    reorder: true,
    sortable: true,
    minWidth: "100px",
    selector: (row) => row.age,
  },
  {
    name: "Salary",
    reorder: true,
    sortable: true,
    minWidth: "175px",
    selector: (row) => row.salary,
  },
];

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

// ** Table Common Column
export const columns = [
  {
    name: "Name",
    minWidth: "250px",
    sortable: (row) => row.full_name,
    cell: (row) => (
      <div className="d-flex align-items-center">
        {row.avatar === "" ? (
          <Avatar
            color={`light-${states[row.status]}`}
            content={row.full_name}
            initials
          />
        ) : (
          <Avatar img={row.avatar} />
        )}
        <div className="user-info text-truncate ms-1">
          <span className="d-block fw-bold text-truncate">{row.full_name}</span>
          <small>{row.post}</small>
        </div>
      </div>
    ),
  },
  {
    name: "Email",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.email,
  },
  {
    name: "Date",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.start_date,
  },

  {
    name: "Salary",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.salary,
  },
  {
    name: "Age",
    sortable: true,
    minWidth: "100px",
    selector: (row) => row.age,
  },
  {
    name: "Status",
    minWidth: "150px",
    sortable: (row) => row.status.title,
    cell: (row) => {
      return (
        <Badge color={status[row.status].color} pill>
          {status[row.status].title}
        </Badge>
      );
    },
  },
  {
    name: "Actions",
    allowOverflow: true,
    cell: () => {
      return (
        <div className="d-flex">
          <UncontrolledDropdown>
            <DropdownToggle className="pe-1" tag="span">
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => e.preventDefault()}
              >
                <FileText size={15} />
                <span className="align-middle ms-50">Details</span>
              </DropdownItem>
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => e.preventDefault()}
              >
                <Archive size={15} />
                <span className="align-middle ms-50">Archive</span>
              </DropdownItem>
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => e.preventDefault()}
              >
                <Trash size={15} />
                <span className="align-middle ms-50">Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Edit size={15} />
        </div>
      );
    },
  },
];

// ** Table Intl Column
export const multiLingColumns = [
  {
    name: "Name",
    sortable: true,
    minWidth: "200px",
    selector: (row) => row.shipTypeName,
  },
  {
    name: "Position",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.post,
  },
  {
    name: "Email",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.email,
  },
  {
    name: "Date",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.start_date,
  },

  {
    name: "Salary",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.salary,
  },
  {
    name: "Status",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.status,
    cell: (row) => {
      console.log({ row });
      return (
        <Badge color={status[row.status].color} pill>
          {status[row.status].title}
        </Badge>
      );
    },
  },
  {
    name: "Actions",
    allowOverflow: true,
    cell: () => {
      const handleDelete = (rowId) => {
        const isConfirmed = window.confirm(
          "Are you sure you want to delete this item?"
        );
        if (isConfirmed) {
          // Call your delete function or API here to delete the row
          console.log("Deleted row with ID:", rowId);
          // For example, you could call a function like:
          // deleteData(rowId);
        }
      };
      return (
        <div className="d-flex">
          <UncontrolledDropdown>
            <DropdownToggle className="pe-1" tag="span">
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>
                <FileText size={15} />
                <span className="align-middle ms-50">Details</span>
              </DropdownItem>
              <DropdownItem>
                <Archive size={15} />
                <span className="align-middle ms-50">Archive</span>
              </DropdownItem>
              <DropdownItem>
                <Trash size={15} />
                <span className="align-middle ms-50">Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          {/* <Link to={`/dashboard/SlipCategory/${row.id}`}> */}
          <Edit size={15} />
          {/* </Link>/ */}
        </div>
      );
    },
  },
];

export const serverSideColumns =(currentPage,rowsPerPage) => [ 
  
  {
    sortable: true,
    name: "Id",
    minWidth: "150px",
    selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, 
  },
  
  {
    name: 'Status',
    minWidth: "180px",

    sortable: true,
    cell: (row) => {
      const stepStatus = row.stepStatus; 
      const statusInfo = status[stepStatus]; 
  
      return (
        <div className="d-flex justify-content-center">
          {statusInfo ? (
            <Badge color={statusInfo.color} pill className="text-dark">
              {statusInfo.title}
            </Badge>
          ) : (
            <Badge color="light-secondary" pill className="text-dark">
              Unknown
            </Badge>
          )}
        </div>
      );
    }
  },
  
  {
    sortable: true,
    name: "Slip Name",
    minWidth: "200px",
    selector: (row) => row.slipName,
  },
  {
    sortable: true,
    name: "Category",
    minWidth: "150px",
    selector: (row) => row.category?.shipTypeName || "N/A", 
  },
  {
    sortable: true,
    name: "Name",
    minWidth: "150px",
    selector: (row) => `${row.member?.firstName || ""} ${row.member?.lastName || ""}`

  },
  {
    sortable: true,
    name: "Email",
    minWidth: "250px",
    selector: (row) =>row.member?.emailId,
  },
  {
    sortable: true,
    name: "Mobile No",
    minWidth: "150px",
    selector: (row) => row.member?.phoneNumber,
  },
  {
    sortable: true,
    name: "Payment",
    minWidth: "150px",
    selector: (row) => row.finalPayment,
  },
  {
    sortable: true,
    name: "Contract Date",
    minWidth: "200px",
    selector: (row) => row.contractDate,
  },
  {
    sortable: true,
    name: " Next Payment Date",
    minWidth: "250px",
    selector: (row) =>
      row.nextPaymentDate,
  },
  {
    sortable: true,
    name: "Contract Type",
    minWidth: "150x",
    selector: (row) => row.paidIn,
  
  },


  
  {
    name: "Actions",
    sortable: true,
    minWidth: "150px",
    cell: (row) => {
      const [data, setData] = useState([]);
      console.log("row data",row)
      // console.log(" data",data)
      console.log("formData.stepStatus",row.stepStatus);

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
              const response = await useJwt.deleteslip(uid);
              if (response.status === 204) {
                setData((prevData) =>
                  prevData.filter((item) => item.uid !== uid)
                );
                // Show success message
                MySwal.fire({
                  icon: "success",
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  customClass: {
                    confirmButton: "btn btn-success",
                  },
                });
                setTimeout(() => {
                  window.location.reload(true);
                }, 2000); // 2000ms = 2 seconds
              }
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          } else if (result.dismiss === MySwal.DismissReason.cancel) {
            // Show cancellation message
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

      return (
        <div className="d-flex">
       

          <Link
            style={{ margin: "0.5rem" }}
            to={{
              pathname: `/marin/slip-management/${row.uid}`,
            }}
          >
            <Eye className="font-medium-3 text-body" />
          </Link>

          {/* Edit Button */}
          <Link
            style={{ margin: "0.5rem" }}
            to={{
            
              pathname: `/dashboard/SlipMemberForm/${row?.uid}`,
             
            }}
            state={{stepStatus:row.stepStatus}}
          >
            <span>
              <Edit2 className="font-medium-3 text-body" />
            </span>
          </Link>

          <Link style={{ margin: "0.5rem" }}>
            {" "}
            <span
              color="danger"
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDelete(row.uid)}
            >
              <Trash className="font-medium-3 text-body" />
            </span>
          </Link>
        </div>
      );
    },
  },
];

// ** Table Adv Search Column
export const advSearchColumns = [
  {
    name: "shipTypeName",
    sortable: true,
    minWidth: "200px",
    selector: (row) => row.slipName,
  },
  {
    name: "Email",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.email,
  },
  {
    name: "Post",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.post,
  },
  {
    name: "City",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.city,
  },
  {
    name: "Date",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.start_date,
  },

  {
    name: "Salary",
    sortable: true,
    minWidth: "100px",
    selector: (row) => row.salary,
  },
];

export default ExpandableTable;
