// ** Third Party Components
import { Download, Eye } from 'react-feather';
import { Badge } from 'reactstrap';

// ** Payment Status Colors
const paymentStatusColors = {
  'SUCCESS': 'success',
  'PENDING': 'warning',
  'FAILED': 'danger',
  'COMPLETED': 'success',
  'PROCESSING': 'info',
  'CANCELLED': 'secondary'
};

// ** Format Currency
const formatCurrency = (amount) => {
  const numAmount = parseFloat(amount) || 0;
  return `$ ${numAmount.toLocaleString('en-IN', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`;
};

// ** Format Date
const formatDate = (dateString) => {
  if (!dateString || dateString === '-') {
    return <span className="text-muted">-</span>;
  }
  
  try {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    return <span>{formattedDate}</span>;
  } catch (error) {
    return <span className="text-muted">-</span>;
  }
};

// ** Table ReOrder Column - MAIN COLUMNS WITH VIEW & DOWNLOAD
export const reOrderColumns = ({ onViewDetails, onDownload }) => {
  return [
    {
      name: 'ID',
      reorder: true,
      sortable: true,
      maxWidth: '80px',
      selector: row => row.id,
      cell: row => <span className="fw-bold">{row.id}</span>
    },
    {
      name: 'Transaction Id',
      reorder: true,
      sortable: true,
      minWidth: '200px',
      selector: row => row.transactionId,
      cell: row => (
        <div className="d-flex flex-column">
          <span className="fw-bold text-truncate" title={row.transactionId}>
            {row.transactionId}
          </span>
        </div>
      )
    },
    {
      name: 'Bank Ref',
      reorder: true,
      sortable: true,
      minWidth: '150px',
      selector: row => row.bankRef,
      cell: row => (
        <span className="text-muted" title={row.bankRef}>
          {row.bankRef || '-'}
        </span>
      )
    },
    {
      name: 'Amount',
      reorder: true,
      sortable: true,
      minWidth: '150px',
      selector: row => row.amount,
      cell: row => (
        <span className="fw-bold text-success">
          {formatCurrency(row.amount)}
        </span>
      )
    },
    {
      name: 'Status',
      reorder: true,
      sortable: true,
      minWidth: '140px',
      selector: row => row.status,
      cell: row => {
        const statusUpper = row.status?.toUpperCase() || 'PENDING';
        const color = paymentStatusColors[statusUpper] || 'secondary';
        return (
          <Badge color={color} pill>
            {row.status || 'Pending'}
          </Badge>
        );
      }
    },
    {
      name: 'Payment Date',
      reorder: true,
      sortable: true,
      minWidth: '160px',
      selector: row => row.paymentDate,
      cell: row => formatDate(row.paymentDate)
    },
    {
      name: 'Actions',
      reorder: true,
      minWidth: '150px',
      center: true,
      cell: row => (
        <div className="d-flex">
          {/* View Details */}
          <span
            style={{ margin: "0.5rem", cursor: "pointer" }}
            onClick={() => onViewDetails(row)}
            title="View Details"
          >
            <Eye className="font-medium-3 text-body" />
          </span>

          {/* Download Receipt */}
          <span
            style={{ margin: "0.5rem", cursor: "pointer" }}
            onClick={() => onDownload(row)}
            title="Download Receipt"
          >
            <Download className="font-medium-3 text-success" />
          </span>
        </div>
      )
    }
  ];
};

export default reOrderColumns;