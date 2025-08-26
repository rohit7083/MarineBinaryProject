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
  0: { title: "Available", color: "light-primary" },

  1: { title: "Vessel Filled", color: "light-warning" },
  2: { title: "Member Filled", color: "light-info" },

  3: { title: "Payment Filled - Asigned", color: "light-success" },
  4: { title: "Payment Failed ", color: "light-danger" },

  5: { title: "Document Filled", color: "light" },

  6: { title: "7D Overdue Charges", color: "light" },
  7: { title: "15D Overdue Charges ", color: "light-primary" },
  8: { title: "30D OverDue Charges", color: "light-info" },
  9: { title: "Notice", color: "light-danger" },
  10: { title: "Auction", color: "light-primary" },
};

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

export const serverSideColumns = (currentPage, rowsPerPage) => [
  {
    sortable: true,
    name: "Id",
    width:"70px",
    selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
  },

  {
    name: "Actions",
    sortable: true,
    // minWidth: "150px",

    cell: (row) => {
      const [data, setData] = useState([]);

      console.log("row data", row);
      console.log("formData.stepStatus", row.stepStatus);

      const MySwal = withReactContent(Swal);

      // const handleDelete = async (uid) => {
      //   return MySwal.fire({
      //     title: "Are you sure?",
      //     text: "You won't be able to revert this!",
      //     icon: "warning",
      //     showCancelButton: true,
      //     confirmButtonText: "Yes, delete it!",
      //     customClass: {
      //       confirmButton: "btn btn-primary",
      //       cancelButton: "btn btn-danger ms-1",
      //     },
      //     buttonsStyling: false,
      //   }).then(async function (result) {
      //     if (result.value) {
      //       try {
      //         // Call delete API
      //         const response = await useJwt.deleteslip(uid);
      //         if (response.status === 204) {
      //           setData((prevData) => {
      //             const newData = prevData.filter((item) => item.uid !== uid);
      //             return newData;
      //           });
      //           // Show success message
      //           MySwal.fire({
      //             icon: "success",
      //             title: "Deleted!",
      //             text: "Your file has been deleted.",
      //             customClass: {
      //               confirmButton: "btn btn-success",
      //             },
      //           });
      //         }
      //       } catch (error) {
      //         console.error("Error deleting item:", error);
      //       }
      //     } else if (result.dismiss === MySwal.DismissReason.cancel) {
      //       // Show cancellation message
      //       MySwal.fire({
      //         title: "Cancelled",
      //         text: "Your imaginary file is safe :)",
      //         icon: "error",
      //         customClass: {
      //           confirmButton: "btn btn-success",
      //         },
      //       });
      //     }
      //   });
      // };

      return (
        <div className="d-flex">
          <Link
            style={{ margin: "0.5rem" }}
            to={`/marin/slip-management`}
            state={{ slipData: row, uid: row?.uid }}
          >
            <Eye className="font-medium-3 text-body" />
          </Link>

          <Link
            style={{ margin: "0.5rem" }}
            to={`/dashboard/slip_memberform`}
            state={{ stepStatus: row.stepStatus, uid: row.uid }}
          >
            <span>
              <Edit2 className="font-medium-3 text-body" />
            </span>
          </Link>

          {/* <Link style={{ margin: "0.5rem" }}>
            {" "}
            <span
              color="danger"
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDelete(row.uid)}
            >
              <Trash className="font-medium-3 text-body" />
            </span>
          </Link> */}
        </div>
      );
    },
  },

  {
    sortable: true,
    name: "Slip Name",
    // minWidth: "200px",
    selector: (row) => row.slipName,
  },

  {
    name: "Status",
    minWidth: "180px",

    sortable: true,
    cell: (row) => {
      const stepStatus = row.stepStatus;
      const statusInfo = status[stepStatus];

      return (
        <div className="d-flex justify-content-center">
          {statusInfo && (
            <Badge color={statusInfo.color} pill className="text-dark">
              {statusInfo.title}
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    sortable: true,
    name: "Category",
    // minWidth: "150px",
    selector: (row) => row.category?.shipTypeName || "N/A",
  },
  {
    sortable: true,
    name: "Name",
    // minWidth: "150px",
    selector: (row) =>
      `${row.member?.firstName || ""} ${row.member?.lastName || ""}`,
  },
  {
    sortable: true,
    name: "Email",
    // minWidth: "250px",
    selector: (row) => row.member?.emailId,
  },
  {
    sortable: true,
    name: "Mobile No",
    // minWidth: "200px",
    selector: (row) =>
      row.member?.countryCode && row.member?.phoneNumber
        ? `${row.member.countryCode} - ${row.member.phoneNumber}`
        : "",
  },
  {
    sortable: true,
    name: "Payment",
    // minWidth: "150px",
    selector: (row) => row.finalPayment,
  },
  {
    sortable: true,
    name: "Contract Date",
    // minWidth: "200px",
    selector: (row) => row.contractDate,
  },
  {
    sortable: true,
    name: " Next Payment Date",
    // minWidth: "250px",
    selector: (row) => row.nextPaymentDate,
  },
  {
    sortable: true,
    name: "Contract Type",
    // minWidth: "150x",
    selector: (row) => row.paidIn,
  },
];

export default ExpandableTable;
