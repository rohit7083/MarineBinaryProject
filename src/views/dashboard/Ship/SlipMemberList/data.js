// ** Custom Components
import useJwt from "@src/auth/jwt/useJwt";
import { AbilityContext } from "@src/utility/context/Can";
import { useContext, useState } from "react";
import { Edit2, Eye, MoreVertical } from "react-feather";
import { Link } from "react-router-dom";
import {
    Badge,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
} from "reactstrap";
import { CompactModal, SuccessModal } from "../../CompactModal"; // ** Reactstrap Imports
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
    width: "70px",
    selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
  },

  {
    name: "Actions",
    sortable: true,
    // minWidth: "150px",

    cell: (row) => {
      const [data, setData] = useState([]);
      const [activeModal, setActiveModal] = useState(null); // null or uid to delete
      const [showSuccess, setShowSuccess] = useState(null); // null or uid to delete
  const ability = useContext(AbilityContext);

      return (
        <div
        // className={`d-flex ${isOffline ? "opacity-50 pointer-events-none " : ""}`}
        >
          <CompactModal
            isOpen={!!activeModal}
            uid={activeModal}
            onCancel={() => setActiveModal(null)}
          />
          <SuccessModal
            isOpen={showSuccess}
            message="Your file has been deleted successfully!"
            onClose={() => setShowSuccess(false)}
          />

          <UncontrolledDropdown>
            <DropdownToggle
              className="icon-btn hide-arrow"
              color="transparent"
              size="sm"
              caret
            >
              <MoreVertical size={15} />
            </DropdownToggle>

            <DropdownMenu end container="body">
              {/* View */}
              {ability.can("view", "slip management") ? (
                <DropdownItem
                  tag={Link}
                  //  disabled={isOffline}

                  to="/marin/slip-management"
                  state={{ slipData: row, uid: row?.uid }}
                >
                  <Eye className="me-50" size={15} />
                  <span className="align-middle">View</span>
                </DropdownItem>
              ) : null}
              {/* Edit */}
              {ability.can("update", "slip management") ? (
                <DropdownItem
                  tag={Link}
                  //  disabled={isOffline}

                  to="/dashboard/slip_memberform"
                  
                  state={{
                    stepStatus: row.stepStatus,
                    uid: row.uid,
                    isAssigned: row.isAssigned,
                    isRevenu: row.nonRevenue,
                    allData:row,
                  }}
                >
                  <Edit2 className="me-50" size={15} />
                  <span className="align-middle">Edit</span>
                </DropdownItem>
              ) : null}

              {/* Offline */}
              {/* <DropdownItem
                onClick={() => setActiveModal(row.uid)}
                //  disabled={isOffline}
              >
                <Trash className="me-50" size={15} />
                <span className="align-middle">Offline</span>
              </DropdownItem> */}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      );
    },
  },

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
