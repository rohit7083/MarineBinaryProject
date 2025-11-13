// ** Third Party Components
import { Download, Eye } from "react-feather";
import { Badge } from "reactstrap";

// ** Payment Status Colors
const paymentStatusColors = {
  SUCCESS: "light-success",
  PENDING: "light-warning",
  FAILED: "light-danger",
  CANCELLED: "light-secondary",
};

// ** QR Code Type Status Colors
const qrCodeTypeColors = {
  event: "light-primary",
  payment: "light-success",
  other: "light-warning",
  default: "light-secondary",
};

// ** Format Currency (INR)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

// ** Format Date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

// ** QR Code Table Columns with Direct Action Buttons
export const qrCodeColumns = ({ onViewDetails, onEdit, onDownload }) => {
  return [
    {
      name: "Sr. No",
      sortable: false,
      minWidth: "80px",
      cell: (row, index) => <span className="fw-bold">{index + 1}</span>,
    },
    {
      name: "Date",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.transactionDate,
      cell: (row) => (
        <span className="text-nowrap">{formatDate(row.transactionDate)}</span>
      ),
    },
    {
      name: "Customer Name",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.customerName,
      cell: (row) => (
        <span className="fw-bold">{row.customerName || "N/A"}</span>
      ),
    },
    {
      name: "Customer Phone",
      sortable: true,
      minWidth: "140px",
      selector: (row) => row.customerPhone,
      cell: (row) => <span>{row.customerPhone || "N/A"}</span>,
    },
    {
      name: "Event Name",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.eventName,
      cell: (row) => (
        <span className="text-primary fw-bold">{row.eventName}</span>
      ),
    },
    {
      name: "QR Code Type",
      sortable: true,
      minWidth: "130px",
      selector: (row) => row.qrCodeType,
      cell: (row) => {
        const colorClass =
          qrCodeTypeColors[row.qrCodeType?.toLowerCase()] ||
          qrCodeTypeColors.default;
        return (
          <Badge color={colorClass} pill>
            {row.qrCodeType?.toUpperCase() || "UNKNOWN"}
          </Badge>
        );
      },
    },
    {
      name: "Amount",
      sortable: true,
      minWidth: "120px",
      selector: (row) => row.amount,
      cell: (row) => (
        <span className="fw-bold text-success">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      name: "Transaction ID",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.transactionId,
      cell: (row) => (
        <span className="font-small-2">{row.transactionId || "N/A"}</span>
      ),
    },

    {
      name: "Status",
      sortable: true,
      minWidth: "120px",
      selector: (row) => row.status,
      cell: (row) => {
        const colorClass =
          paymentStatusColors[row.status?.toUpperCase()] || "light-secondary";
        return (
          <Badge color={colorClass} pill>
            {row.status?.toUpperCase() || "UNKNOWN"}
          </Badge>
        );
      },
    },
    {
      name: "Actions",
      minWidth: "150px",
      center: true,
      cell: (row) => (
        <div className="d-flex">
          {/* View Details */}
          <span
            style={{ margin: "0.5rem", cursor: "pointer" }}
            onClick={() => onViewDetails(row)}
            title="View Details"
          >
            <Eye className="font-medium-3 text-body" />
          </span>

          {/* Download QR Code */}
          {row.qrCodeBase64 && (
            <span
              style={{ margin: "0.5rem", cursor: "pointer" }}
              onClick={() => onDownload(row)}
              title="Download QR Code"
            >
              <Download className="font-medium-3 text-success" />
            </span>
          )}
        </div>
      ),
    },
  ];
};
