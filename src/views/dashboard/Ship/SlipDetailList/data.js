// ** Custom Components
import Avatar from "@components/avatar";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Third Party Components
import { AbilityContext } from "@src/utility/context/Can";

import {
  Archive,
  Edit,
  Edit2,
  Eye,
  FileText,
  MoreVertical,
  Trash,
} from "react-feather";
// ** Reactstrap Imports
import useJwt from "@src/auth/jwt/useJwt";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
import { CompactModal } from "../../CompactModal";
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

const status = {
  0: { title: "Available", color: "light-primary" },

  1: { title: "Vessel Filled", color: "light-warning" },
  2: { title: "Member Filled", color: "light-info" },

  3: { title: "Payment Filled - Asigned", color: "light-success" },
  4: { title: "Payment Failed ", color: "light-danger" },

  5: { title: "Document Filled", color: "light" },

  6: { title: "7D Overdue Charges" },
  7: { title: "15D Overdue Charges ", color: "light-primary" },
  8: { title: "30D OverDue Charges", color: "light-info" },
  9: { title: "Notice", color: "light-danger" },
  10: { title: "Auction", color: "light-dark" },
};

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

export const serverSideColumns = (currentPage, rowsPerPage) => [
  {
    sortable: true,
    name: "Id",
    //minWidth: "100px",
    selector: (row, index) => index + 1,
  },
  // {
  //   sortable: true,
  //   name: "Status",
  //   // minWidth: "170px",
  //   selector: (row) => {
  //     const checkStatus = row.stepStatus;

  //     return (
  //       <div className="d-flex justify-content-center">
  //         {checkStatus === null ? (
  //           <Badge color="light-success" className="text-capitalize">
  //             inActive
  //           </Badge>
  //         ) : (
  //           <Badge color="light-danger" pill className="text-capitalize">
  //             Active
  //           </Badge>
  //         )}
  //       </div>
  //     );
  //   },
  // },

{
    name: "Offline Status",
    minWidth: "180px",
    sortable: true,
    cell: (row) => {
      const [isOffline, setIsOffline] = useState(row.isOffline);
      const [confirmModal, setConfirmModal] = useState(false);
      const [pendingValue, setPendingValue] = useState(null);

      const handleToggleClick = (e) => {
        // open confirmation modal first, don't switch immediately
        const newStatus = e.target.checked;
        setPendingValue(newStatus);
        setConfirmModal(true);
      };
       (isOffline);

      const handleConfirm = async () => {
        try {
          // Execute API call
          const response = await useJwt.offlineSlip(row.uid);

          if (response.status === 204) {
            setIsOffline(pendingValue);
          } else {
            console.warn("Unexpected API response:", response);
          }
        } catch (error) {
          console.error("Error updating offline status:", error);
        } finally {
          setConfirmModal(false);
          setPendingValue(null);
        }
      };

      const handleCancel = () => {
        setConfirmModal(false);
        setPendingValue(null);
      };

      return (
        <>
          <div className="d-flex justify-content-center align-items-center">
            <div className="form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                checked={isOffline}
                onChange={handleToggleClick}
                style={{ cursor: "pointer" }}
              />
            </div>
            <Badge
              color={isOffline ? "light-danger" : "light-success"}
              pill
              className="ms-1 text-dark"
            >
              {isOffline ? "Offline" : "Online"}
            </Badge>
          </div>

          {/* Confirmation Modal */}
          <CompactModal
            isOpen={confirmModal}
            uid={row.uid}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            isOffline={isOffline}
          />
        </>
      );
    },
  },

  {
    sortable: true,
    name: "Slip Name",
    //minWidth: "150px",
    selector: (row) => row.slipName,
  },
  {
    sortable: true,
    name: "Slip Assigned",
    //minWidth: "170px",
    selector: (row) => {
      const SlipAssigned = row.isAssigned;

      return (
        <div className="d-flex justify-content-center">
          {SlipAssigned ? (
            <Badge color="success" className="badge-glow">
              Assigned
            </Badge>
          ) : (
            <Badge color="danger" pill className="badge-glow">
              Not Assigned
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    sortable: true,
    name: "Category",
    //minWidth: "140px",
    selector: (row) => row.category?.shipTypeName || "N/A", // Fallback to "N/A" if shipTypeName is undefined
  },

  {
    sortable: true,
    name: "Electric",
    //minWidth: "150px",
    selector: (row) => (row.electric ? "Yes" : "No"),
  },
  {
    sortable: true,
    name: "water",
    //minWidth: "150px",
    selector: (row) => (row.water ? "Yes" : "No"),
  },
  // {
  //   sortable: true,
  //   name: "AMPS",
  //   //minWidth: "150px",
  //   selector: (row) => row.amps,
  // },
  {
    sortable: true,
    name: " Add-on",
    //minWidth: "150px",
    selector: (row) => row.addOn,
  },
  {
    sortable: true,
    name: "Annual Price",
    //minWidth: "150x",
    selector: (row) => row.marketAnnualPrice,
  },
  {
    sortable: true,
    name: "Monthly Price",
    //minWidth: "250px",
    selector: (row) => row.marketMonthlyPrice,
  },
  {
    name: "Actions",
    sortable: true,
    //minWidth: "150px",
    cell: (row) => {
      const MySwal = withReactContent(Swal);
  const ability = useContext(AbilityContext);

      const handleDelete = async (uid) => {
        // Show confirmation modal
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
              const response = await useJwt.deleteslip(uid);
              if (response.status === 204) {
                MySwal.fire({
                  icon: "success",
                  title: "Deleted!",
                  text: "Your Record has been deleted.",
                  customClass: {
                    confirmButton: "btn btn-success",
                  },
                });
                window.location.reload();
              }
            } catch (error) {
              console.error("Error deleting item:", error);
              if (error.response && error.response.status === 400) {
                const errorMessage =
                  error?.response?.data?.content || "Item not found.";
                MySwal.fire({
                  icon: "error",
                  title: errorMessage,
                  customClass: {
                    confirmButton: "btn btn-danger",
                  },
                });
              }
            }
          } else if (result.dismiss === MySwal.DismissReason.cancel) {
            MySwal.fire({
              title: "Cancelled",
              text: "Your Record is safe :)",
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
            to={`/marin/slip-management`}
            state={{ slipData: row, uid: row?.uid }}
          >
            <Eye className="font-medium-3 text-body" />
          </Link>

          {/* Edit Button */}
           {ability.can("update", "slip management") ? (
         
         <Link

            style={{ margin: "0.5rem" }}
            to={`/dashboard/slip-details`}
            state={{ uid: row.uid , allData:row }}
          >
            
            <span>
              <Edit2 className="font-medium-3 text-body" />
            </span>
          </Link>
          
           ): null}
          {console.log(row)
          }
          {ability.can("delete", "slip management") ? (
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
          ) : null}
        </div>
      );
    },
  },
];

export default ExpandableTable;
