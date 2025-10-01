// ** Third Party Components
import { useState } from 'react'
import { Edit2, Eye, Trash } from 'react-feather'
import { Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

// ** QR Code Type Status Colors
const qrCodeTypeColors = {
  event: 'light-primary',
  payment: 'light-success',
  other: 'light-warning',
  default: 'light-secondary'
}

// ** Format Currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0)
}

// ** Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, toggle, itemToDelete, onConfirmDelete }) => {
  return (
    <>
      {/* Custom backdrop with blur effect */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // backgroundColor: 'rgba(255, 255, 255, 0.05)',
            // backdropFilter: 'blur(1px)',
            zIndex: 1040
          }}
          onClick={toggle}
        />
      )}
      
      <Modal isOpen={isOpen} toggle={toggle} centered backdrop={false}>
        <ModalHeader toggle={toggle}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete QR code for <strong>"{itemToDelete?.eventName || 'this item'}"</strong>?
          </p>
          <p className="text-muted mb-0">
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="danger" onClick={() => {
            onConfirmDelete(itemToDelete)
            toggle()
          }}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

// ** QR Code Table Columns with Direct Action Buttons
export const qrCodeColumns = ({ onViewDetails, onEdit, onDelete, onDownload, onViewQRCode }) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const toggleDeleteModal = () => setDeleteModal(!deleteModal)

  const handleDeleteClick = (row) => {
    setItemToDelete(row)
    setDeleteModal(true)
  }

  const handleConfirmDelete = (item) => {
    onDelete(item)
    setItemToDelete(null)
  }

  return [
    {
      name: 'ID',
      sortable: true,
      minWidth: '80px',
      selector: row => row.id,
      cell: row => <span className='fw-bold text-primary'>#{row.id}</span>
    },
    {
      name: 'Event Name',
      sortable: true,
      minWidth: '200px',
      selector: row => row.eventName,
      cell: row => <span className='fw-bold text-capitalize'>{row.eventName || 'N/A'}</span>
    },
    {
      name: 'QR Code Type',
      sortable: true,
      minWidth: '150px',
      selector: row => row.qrCodeType,
      cell: row => {
        const colorClass = qrCodeTypeColors[row.qrCodeType?.toLowerCase()] || qrCodeTypeColors.default
        return <Badge color={colorClass} pill>{row.qrCodeType?.toUpperCase() || 'UNKNOWN'}</Badge>
      }
    },
    {
      name: 'QR Code',
      minWidth: '120px',
      center: true,
      cell: row => (
        <div className='d-flex align-items-center justify-content-center'>
          {row.qrCodeBase64 ? (
            <img
              src={`data:image/png;base64,${row.qrCodeBase64}`}
              alt={`QR Code for ${row.eventName}`}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'contain',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => onViewQRCode(row)}
            />
          ) : (
            <div style={{
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed #ccc',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#999'
            }}>
              No Image
            </div>
          )}
        </div>
      )
    },
    {
      name: 'Amount',
      sortable: true,
      minWidth: '120px',
      selector: row => row.amount,
      cell: row => <span className='fw-bold text-success'>{formatCurrency(row.amount)}</span>
    },
    {
      name: 'Actions',
      minWidth: '150px',
      center: true,
      cell: row => (
        <div className="d-flex">
          {/* View Details */}
          <span
            style={{ margin: "0.5rem", cursor: "pointer" }}
            onClick={() => onViewDetails(row)}
          >
            <Eye className="font-medium-3 text-body" />
          </span>

          {/* Edit */}
          <span
            style={{ margin: "0.5rem", cursor: "pointer" }}
            onClick={() => onEdit(row)}
          >
            <Edit2 className="font-medium-3 text-body" />
          </span>

          {/* Delete */}
          <span
            style={{ margin: "0.5rem", cursor: "pointer", color: "red" }}
            onClick={() => handleDeleteClick(row)}
          >
            <Trash className="font-medium-3 text-body" />
          </span>

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={deleteModal}
            toggle={toggleDeleteModal}
            itemToDelete={itemToDelete}
            onConfirmDelete={handleConfirmDelete}
          />
        </div>
      )
    }
  ]
}