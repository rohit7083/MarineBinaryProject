import { Fragment, memo, useEffect, useRef, useState } from 'react';

// ** Custom Components

// ** PrimeReact
import { Toast } from "primereact/toast";

// ** Table Columns
import { qrCodeColumns } from './Data';

// ** Third Party Components
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import ReactPaginate from 'react-paginate';

// ** Third Party Components
import 'flatpickr/dist/flatpickr.css';
import Flatpickr from 'react-flatpickr';

// ** Reactstrap Imports
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from 'reactstrap';

// ** Auth
import useJwt from "@src/auth/jwt/useJwt";

function Index() {
  // ** States
  const [data, setData] = useState([])
  const [allData, setAllData] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewQRModal, setViewQRModal] = useState(false)
  const [selectedQRCode, setSelectedQRCode] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const toast = useRef(null);

  // ** Fetch Data
  const fetchData = async (page = 1, perPage = rowsPerPage, q = '') => {
    try {
      setLoading(true)
      const response = await useJwt.getEventQRPaymentList()
      const result = response?.data?.content?.result || []
      
      // Flatten the data since each event can have multiple payments
      const transformedData = result.flatMap((item) => {
        // Check if payments array exists and has items
        if (!item.payments || item.payments.length === 0) {
          return []
        }
        
        // Map each payment to a separate row
        return item.payments.map((payment, paymentIndex) => {
          const customer = payment.customer || {}
          return {
            id: `${item.id}-${payment.id}` || `${item.id}-${paymentIndex}`,
            transactionDate: payment.paymentDate,
            eventName: item.eventName,
            // FIXED: Get customer name and phone from payment.customer object
            customerName: customer.name || payment.customerName || item.customerName || 'N/A',
            customerPhone: customer.phone || customer.mobile || payment.phoneNumber || item.phoneNumber || 'N/A',
            qrCodeType: item.qrCodeType,
            qrCodeBase64: item.qrCodeBase64,
            amount: payment.finalPayment,
            status: payment.paymentStatus,
            transactionId: payment.transactionId,
            paymentMode: payment.paymentMode,
            errorMessage: payment.errorMessage,
          }
        })
      })
      
      console.log('the data is ready', transformedData)

      let filteredData = transformedData

      // Apply search filter
      if (q) {
        filteredData = filteredData.filter(item =>
          item.eventName?.toLowerCase().includes(q.toLowerCase()) ||
          item.qrCodeType?.toLowerCase().includes(q.toLowerCase()) ||
          item.customerName?.toLowerCase().includes(q.toLowerCase()) ||
          item.customerPhone?.toLowerCase().includes(q.toLowerCase()) ||
          item.transactionId?.toLowerCase().includes(q.toLowerCase())
        )
      }

      // Apply date range filter
      if (startDate || endDate) {
        filteredData = filteredData.filter(item => {
          if (!item.transactionDate) return false
          
          const itemDate = new Date(item.transactionDate)
          const start = startDate ? new Date(startDate) : null
          const end = endDate ? new Date(endDate) : null
          
          // Set time to start of day for proper comparison
          if (start) start.setHours(0, 0, 0, 0)
          if (end) end.setHours(23, 59, 59, 999)
          
          if (start && end) {
            return itemDate >= start && itemDate <= end
          } else if (start) {
            return itemDate >= start
          } else if (end) {
            return itemDate <= end
          }
          return true
        })
      }

      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedData = filteredData.slice(startIndex, endIndex)

      setData(paginatedData)
      setAllData(transformedData)
      setTotal(filteredData.length)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching QR Code data:", error)
      toast.current.show({
        severity: "error",
        summary: "Fetch Error",
        detail: "Failed to load QR Codes. Please try again.",
        life: 3000,
      })
      setData([])
      setTotal(0)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, searchValue)
  }, [currentPage, rowsPerPage, searchValue, startDate, endDate])

  // ** Handlers
  const handleFilter = e => {
    setSearchValue(e.target.value)
    setCurrentPage(1)
  }

  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }

  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  const handleDelete = async (row) => {
    try {
      const res = await useJwt.deleteQrCode(row.id)
      if (res.status === 204 || res.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Deleted",
          detail: "The QR code has been removed.",
          life: 2000,
        });
        fetchData(currentPage, rowsPerPage, searchValue)
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.current.show({
        severity: "error",
        summary: "Delete Failed",
        detail: "Unable to delete QR Code. Please try again.",
        life: 3000,
      });
    }
  }

  const handleDownload = (row) => {
    try {
      if (row.qrCodeBase64) {
        const link = document.createElement('a')
        link.href = `data:image/png;base64,${row.qrCodeBase64}`
        link.download = `QR_${row.eventName}_${row.customerName}_${row.transactionId}.png`
        link.click()
        toast.current.show({
          severity: "success",
          summary: "Download Started",
          detail: "Your QR Code is being downloaded.",
          life: 2000,
        });
      } else {
        throw new Error("No QR Code found")
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Download Failed",
        detail: "Could not download QR Code.",
        life: 3000,
      });
    }
  }

  const handleViewDetails = (row) => {
    console.log('Selected QR Code:', row) // Debug log
    setSelectedQRCode(row)
    setViewQRModal(true)
  }

  const toggleViewQRModal = () => {
    setViewQRModal(!viewQRModal)
    if (!viewQRModal) setSelectedQRCode(null)
  }

  const handleClearFilters = () => {
    setStartDate(null)
    setEndDate(null)
    setSearchValue('')
    setCurrentPage(1)
  }

  const CustomPagination = () => {
    const count = Math.ceil(total / rowsPerPage)
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage - 1}
        onPageChange={handlePagination}
        pageClassName='page-item'
        breakClassName='page-item'
        nextLinkClassName='page-link'
        pageLinkClassName='page-link'
        breakLinkClassName='page-link'
        previousLinkClassName='page-link'
        nextClassName='page-item next-item'
        previousClassName='page-item prev-item'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        }
      />
    )
  }

  const downloadQRCode = () => {
    try {
      if (selectedQRCode?.qrCodeBase64) {
        const link = document.createElement('a')
        link.href = `data:image/png;base64,${selectedQRCode.qrCodeBase64}`
        link.download = `QR_${selectedQRCode.eventName}_${selectedQRCode.customerName}_${selectedQRCode.transactionId}.png`
        link.click()
        toast.current.show({
          severity: "success",
          summary: "Download Started",
          detail: "Your QR Code is being downloaded.",
          life: 2000,
        });
      } else {
        throw new Error("No QR Code available")
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Download Failed",
        detail: "Could not download QR Code.",
        life: 3000,
      });
    }
  }

  return (
    <Fragment>
      <Toast ref={toast} />
      <Card>
        <CardHeader className="border-bottom">
          <h3 className="mb-0">Event Payment Listing</h3>
        </CardHeader>

        <CardBody>
          <Row className='mx-0 mt-1 mb-50'>
            {/* Top row: Entries selector and search */}
            <Col sm='6' className='d-flex align-items-center'>
              <Label for='sort-select'>Show</Label>
              <Input
                className='dataTable-select mx-1'
                type='select'
                id='sort-select'
                value={rowsPerPage}
                onChange={handlePerPage}
                style={{ width: '80px' }}
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              <Label for='sort-select'>entries</Label>
            </Col>

            <Col sm='6' className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1'>
              <Label className='me-1' for='search-input'>Search</Label>
              <Input
                className='dataTable-filter'
                type='text'
                bsSize='sm'
                id='search-input'
                value={searchValue}
                onChange={handleFilter}
                placeholder='Search...'
                style={{ minWidth: '200px' }}
              />
            </Col>
          </Row>

          {/* Date Range Filters */}
          <Row className='mx-0 mt-2 mb-2'>
            <Col md='5' sm='12' className='mb-1 mb-md-0'>
              <Label for='start-date'>Start Date</Label>
              <Flatpickr
                value={startDate}
                id='start-date'
                className='form-control'
                onChange={date => setStartDate(date[0])}
                options={{
                  altInput: true,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                  maxDate: endDate || null
                }}
                placeholder='Select start date'
              />
            </Col>

            <Col md='5' sm='12' className='mb-1 mb-md-0'>
              <Label for='end-date'>End Date</Label>
              <Flatpickr
                value={endDate}
                id='end-date'
                className='form-control'
                onChange={date => setEndDate(date[0])}
                options={{
                  altInput: true,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                  minDate: startDate || null
                }}
                placeholder='Select end date'
              />
            </Col>

            <Col md='2' sm='12' className='d-flex align-items-end'>
              <Button 
                color='secondary' 
                outline 
                block
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>

          <div className='react-dataTable mt-3'>
            <DataTable
              noHeader
              pagination
              paginationServer
              className='react-dataTable'
              columns={qrCodeColumns({
                onViewDetails: handleViewDetails,
                onDelete: handleDelete,
                onDownload: handleDownload
              })}
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              data={data}
              progressPending={loading}
              progressComponent={
                <div className='text-center p-3'>
                  <Spinner color='primary' />
                </div>
              }
              noDataComponent={
                <div className='text-center p-3'>
                  <p className='mb-0'>No payment records found</p>
                </div>
              }
            />
          </div>
        </CardBody>
      </Card>

      {/* View QR Code Modal - Responsive */}
      <Modal
        isOpen={viewQRModal}
        toggle={toggleViewQRModal}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalHeader toggle={toggleViewQRModal}>
          Payment Details
        </ModalHeader>

        <ModalBody>
          {selectedQRCode && (
            <Row>
              <Col xs="12" lg="6" md="12" className="text-center mb-3 mb-md-0">
                <div className="qr-code-container mb-3">
                  <img
                    src={`data:image/png;base64,${selectedQRCode.qrCodeBase64}`}
                    alt="QR Code"
                    className="img-fluid border rounded"
                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                  />
                </div>
              </Col>
              <Col xs="12" lg="6" md="12">
                <div className="payment-details">
                  <h5 className="text-primary mb-3">{selectedQRCode.eventName}</h5>
                  
                  <div className="mb-2">
                    <strong>Customer:</strong> {selectedQRCode.customerName}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Phone:</strong> {selectedQRCode.customerPhone}
                  </div>
                  
                  <div className="mb-2">
                    <strong>QR Code Type:</strong> {selectedQRCode.qrCodeType}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Amount:</strong> <span className="text-success">₹{selectedQRCode.amount}</span>
                  </div>
                  
                  <div className="mb-2">
                    <strong>Transaction ID:</strong> {selectedQRCode.transactionId || 'N/A'}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Payment Mode:</strong> { 'Credit Card'}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Status:</strong> <span className={`badge bg-${selectedQRCode.status === 'SUCCESS' ? 'success' : selectedQRCode.status === 'PENDING' ? 'warning' : 'danger'}`}>
                      {selectedQRCode.status}
                    </span>
                  </div>
                  
                  {selectedQRCode.errorMessage && (
                    <div className="mb-2">
                      <strong>Error:</strong> <span className="text-danger">{selectedQRCode.errorMessage}</span>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={downloadQRCode}>Download QR Code</Button>
          <Button color="secondary" onClick={toggleViewQRModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default memo(Index)