// ** Third Party Components
import { Edit2, Eye, Trash } from "react-feather";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

// ** QR Code Type Status Colors
const qrCodeTypeColors = {
  event: "light-primary",
  payment: "light-success",
  other: "light-warning",
  default: "light-secondary",
};

// ** Format Currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

// ** Delete Confirmation Modal Component
export const DeleteConfirmationModal = ({
  isOpen,
  toggle,
  itemToDelete,
  onConfirmDelete,
}) => {
  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1040,
          }}
          onClick={toggle}
        />
      )}

      <Modal isOpen={isOpen} toggle={toggle} centered backdrop={false}>
        <ModalHeader toggle={toggle}>Confirm Delete</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete QR code for{" "}
            <strong>"{itemToDelete?.eventName || "this item"}"</strong>?
          </p>
          <p className="text-muted mb-0">This action cannot be undone.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={() => {
              onConfirmDelete(itemToDelete);
              toggle();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

// ** QR Code Table Columns
export const qrCodeColumns = ({
  onViewDetails,
  onEdit,
  onDelete,
  onDownload,
  onViewQRCode,
}) => {
  return [
    {
      name: "ID",
      sortable: true,
      minWidth: "80px",
      cell: (row, index) => (
        <span className="fw-bold text-primary">{index + 1}</span>
      ),
    },
    {
      name: "Event Name",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.eventName,
      cell: (row) => (
        <span className="fw-bold text-capitalize">
          {row.eventName || "N/A"}
        </span>
      ),
    },

    // {
    //   name: 'Event Pass Type',
    //   sortable: true,
    //   minWidth: '200px',
    //   selector: row => row.eventPassType,
    //   cell: row => <span className='fw-bold text-capitalize'>{row.eventPassType ?? 'N/A'}</span>
    // },
    // {
    //   name: 'Max People',
    //   sortable: true,
    //   minWidth: '200px',
    //   selector: row => row.maxPeopleCapacity,
    //   cell: row => <span className='fw-bold text-capitalize'>{row.maxPeopleCapacity ?? 'N/A'}</span>
    // },
    // {
    //   name: 'Pass Booked',
    //   sortable: true,
    //   minWidth: '200px',
    //   selector: row => row.successMaxPeople,
    //   cell: row => <span className='fw-bold text-capitalize'>{row.successMaxPeople ?? '0'}</span>
    // },
    {
      name: "QR Code Type",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.qrCodeType,
      cell: (row) => (
        <Badge
          color={
            qrCodeTypeColors[row.qrCodeType?.toLowerCase()] ||
            qrCodeTypeColors.default
          }
          pill
        >
          {row.qrCodeType}
        </Badge>
      ),
    },
    {
      name: "Amount",
      sortable: true,
      minWidth: "120px",
      selector: (row) => row.amount,
      cell: (row) => (
        <span>{row.amount ? formatCurrency(row.amount) : "N/A"}</span>
      ),
    },
    {
      name: "Amount Type",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.amountType,
      cell: (row) => (
        <span className="text-capitalize">{row.amountType || "N/A"}</span>
      ),
    },
    {
      name: "Actions",
      minWidth: "200px",
      cell: (row) => (
        <div className="d-flex">
          <span
            style={{ margin: "0.5rem", cursor: "pointer" }}
            onClick={() => onViewDetails(row)}
          >
            <Eye className="font-medium-3 text-body" />
          </span>
          <span
            style={{ margin: "0.5rem", cursor: "pointer" }}
            onClick={() => onEdit(row)}
          >
            <Edit2 className="font-medium-3 text-body" />
          </span>
          <span
            style={{ margin: "0.5rem", cursor: "pointer", color: "red" }}
            onClick={() => onDelete(row)}
          >
            <Trash className="font-medium-3 text-body" />
          </span>
        </div>
      ),
    },
  ];
};
