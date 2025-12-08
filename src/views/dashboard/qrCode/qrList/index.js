import { Fragment, memo, useContext, useEffect, useRef, useState } from "react";

// ** Custom Components
import AddQRCodeModal from "./AddQr";

// ** PrimeReact
import { Toast } from "primereact/toast";

// ** Table Columns
import { qrCodeColumns } from "./data";

// ** Third Party Components
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
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
  Spinner,
} from "reactstrap";

// ** Auth
import useJwt from "@src/auth/jwt/useJwt";
import { AbilityContext } from "@src/utility/context/Can";

// ** Delete Confirmation Modal
import { DeleteConfirmationModal } from "./data";

function Index() {
  // ** States
  const ability = useContext(AbilityContext);

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [addQRModal, setAddQRModal] = useState(false);
  const [viewQRModal, setViewQRModal] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // ** Delete modal states (moved here)
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const toast = useRef(null);

  // ** Fetch Data
  const fetchData = async (page = 1, perPage = rowsPerPage, q = "") => {
    try {
      setLoading(true);
      const response = await useJwt.getAllEventQRCode();
      const result = response?.data?.content?.result || [];

      const transformedData = result.map((item, index) => ({
        id: item.id || index + 1,
        uid: item.uid,
        eventName: item.eventName,
        qrCodeType: item.qrCodeType,
        qrCodeBase64: item.qrCodeBase64,
        amount: item.amount,
        amountType: item.amountType,
        maxPeopleCapacity: item.maxPeopleCapacity,
        eventPassType: item.eventPassType,
        successMaxPeople: item.successMaxPeople,
      }));

      let filteredData = transformedData;
      if (q) {
        filteredData = transformedData.filter(
          (item) =>
            item.eventName?.toLowerCase().includes(q.toLowerCase()) ||
            item.qrCodeType?.toLowerCase().includes(q.toLowerCase())
        );
      }

      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setData(paginatedData);
      setAllData(transformedData);
      setTotal(filteredData.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching QR Code data:", error);
      toast.current.show({
        severity: "error",
        summary: "Fetch Error",
        detail: "Failed to load QR Codes. Please try again.",
        life: 3000,
      });
      setData([]);
      setTotal(0);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, searchValue);
  }, [currentPage, rowsPerPage, searchValue]);

  // ** Handlers
  const handleFilter = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const toggleAddQRModal = () => {
    setIsEditMode(false);
    setSelectedQRCode(null);
    setAddQRModal(!addQRModal);
  };

  const handleViewQRCode = (qrData) => {
    setSelectedQRCode(qrData);
    setViewQRModal(true);
  };

  const toggleViewQRModal = () => {
    setViewQRModal(!viewQRModal);
    if (!viewQRModal) setSelectedQRCode(null);
  };

  const handleQRCodeSubmit = async (formData) => {
    try {
      let response;

      if (isEditMode && selectedQRCode) {
        const updateData = {
          eventName: formData.eventName,
          qrCodeType: formData.qrCodeType,
          amountType: formData.amountType,
          amount:
            formData.amountType === "Fixed"
              ? parseFloat(formData.amount)
              : null,
        };

        // Add fields for 'other' type - always send these fields
        if (formData.qrCodeType === "other") {
          updateData.eventPassType = formData.eventPassType || null;
          updateData.maxPeopleCapacity = formData.maxPeopleCapacity
            ? parseInt(formData.maxPeopleCapacity)
            : null;
        }

        response = await useJwt.updateQrCode(selectedQRCode.uid, updateData);

        if (response.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "QR Code Updated",
            detail: "QR Code updated successfully.",
            life: 3000,
          });
        }
      } else {
        response = await useJwt.addQrCode(formData);

        if (response.status === 200 || response.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "QR Code Created",
            detail: "QR Code created successfully.",
            life: 3000,
          });
        }
      }

      fetchData(currentPage, rowsPerPage, searchValue);
      setAddQRModal(false);
      setIsEditMode(false);
      setSelectedQRCode(null);
    } catch (error) {
      console.error("Error saving QR Code:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to ${
          isEditMode ? "update" : "create"
        } QR Code. Please try again.`,
        life: 3000,
      });
    }
  };

  const handleEdit = (row) => {
    console.log("Editing: ", row);
    setSelectedQRCode(row);
    setIsEditMode(true);
    setAddQRModal(true);
  };

  // Delete handlers
  const handleDeleteClick = (row) => {
    setItemToDelete(row);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async (row) => {
    try {
      const res = await useJwt.deleteQrCode(row.uid);
      if (res.status === 204) {
        toast.current.show({
          severity: "success",
          summary: "Deleted",
          detail: "The QR code has been removed.",
          life: 2000,
        });
        fetchData(currentPage, rowsPerPage, searchValue);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.current.show({
        severity: "error",
        summary: "Delete Failed",
        detail: "Unable to delete QR Code. Please try again.",
        life: 3000,
      });
    }
  };

  const handleDownload = (row) => {
    try {
      if (row.qrCodeBase64) {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${row.qrCodeBase64}`;
        link.download = `QR_${row.eventName}_${row.uid}.png`;
        link.click();
        toast.current.show({
          severity: "success",
          summary: "Download Started",
          detail: "Your QR Code is being downloaded.",
          life: 2000,
        });
      } else {
        throw new Error("No QR Code found");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Download Failed",
        detail: "Could not download QR Code.",
        life: 3000,
      });
    }
  };

  const handleViewDetails = (row) => {
    setSelectedQRCode(row);
    setViewQRModal(true);
  };

  const CustomPagination = () => {
    const count = Math.ceil(total / rowsPerPage);
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage - 1}
        onPageChange={handlePagination}
        pageClassName="page-item"
        breakClassName="page-item"
        nextLinkClassName="page-link"
        pageLinkClassName="page-link"
        breakLinkClassName="page-link"
        previousLinkClassName="page-link"
        nextClassName="page-item next-item"
        previousClassName="page-item prev-item"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
        }
      />
    );
  };

  const handleCloseModal = () => {
    setAddQRModal(false);
    setIsEditMode(false);
    setSelectedQRCode(null);
  };

  const downloadQRCode = () => {
    try {
      if (selectedQRCode?.qrCodeBase64) {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${selectedQRCode.qrCodeBase64}`;
        link.download = `QR_${selectedQRCode.eventName}_${selectedQRCode.qrCodeType}.png`;
        link.click();
        toast.current.show({
          severity: "success",
          summary: "Download Started",
          detail: "Your QR Code is being downloaded.",
          life: 2000,
        });
      } else {
        throw new Error("No QR Code available");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Download Failed",
        detail: "Could not download QR Code.",
        life: 3000,
      });
    }
  };

  return (
    <Fragment>
      <Toast ref={toast} />
      <Card>
        <CardHeader className="border-bottom">
          <div className="d-flex justify-content-between align-items-center w-100">
            <h3 className="mb-0">QR Code Management</h3>
            {ability.can("create", "qr code generator") ? (
              <Button color="primary" size={"sm"} onClick={toggleAddQRModal}>
                Add QR Code
              </Button>
            ) : null}
          </div>
        </CardHeader>

        <CardBody>
          <Row className="mx-0 mt-1 mb-50">
            <Col sm="6">
              <div className="d-flex align-items-center">
                <Label for="sort-select">Show</Label>
                <Input
                  className="dataTable-select"
                  type="select"
                  id="sort-select"
                  value={rowsPerPage}
                  onChange={handlePerPage}
                >
                  <option value={7}>7</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </Input>
                <Label for="sort-select">entries</Label>
              </div>
            </Col>
            <Col
              className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
              sm="6"
            >
              <Label className="me-1" for="search-input">
                Search
              </Label>
              <Input
                className="dataTable-filter"
                type="text"
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={handleFilter}
                placeholder="Search by event name or type..."
              />
            </Col>
          </Row>

          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              paginationServer
              className="react-dataTable"
              columns={qrCodeColumns({
                onViewDetails: handleViewDetails,
                onEdit: handleEdit,
                onDelete: handleDeleteClick,
                onDownload: handleDownload,
                onViewQRCode: handleViewQRCode,
              })}
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              data={data}
              progressPending={loading}
              progressComponent={
                <div className="text-center p-3">
                  <Spinner color="primary" size="2xl" />
                </div>
              }
              noDataComponent="No QR Codes found"
            />
          </div>
        </CardBody>
      </Card>

      {/* Add/Edit QR Code Modal */}
      <AddQRCodeModal
        isOpen={addQRModal}
        toggle={handleCloseModal}
        onSubmit={handleQRCodeSubmit}
        editData={selectedQRCode}
        isEditMode={isEditMode}
      />

      {/* View QR Code Modal */}
      <Modal
        isOpen={viewQRModal}
        toggle={toggleViewQRModal}
        className="modal-dialog-centered"
        size="md"
      >
        <ModalHeader toggle={toggleViewQRModal}>
          <div className="d-flex align-items-center">
            <h4 className="mb-0">QR Code Details</h4>
          </div>
        </ModalHeader>

        <ModalBody>
          {selectedQRCode && (
            <div className="text-center">
              <div className="mb-3">
                <h5 className="text-primary">{selectedQRCode.eventName}</h5>
                <p className="text-muted mb-1">
                  Type: <strong>{selectedQRCode.qrCodeType}</strong>
                </p>
                {selectedQRCode.eventPassType === "EntryPass" && (
                  <div className="d-flex justify-content-center">
                    <p className="text-muted mb-1">
                      Remaining Pass:{" "}
                      <strong>
                        {(selectedQRCode.maxPeopleCapacity ?? 0) -
                          (selectedQRCode?.successMaxPeople ?? 0)}
                      </strong>
                    </p>
                  </div>
                )}

                {selectedQRCode.amount && (
                  <p className="text-muted mb-3">
                    Amount: <strong>${selectedQRCode.amount}</strong>
                  </p>
                )}
              </div>
              <div className="qr-code-container mb-3">
                <img
                  src={`data:image/png;base64,${selectedQRCode.qrCodeBase64}`}
                  alt="QR Code"
                  className="img-fluid border rounded"
                  style={{ maxWidth: "300px", maxHeight: "300px" }}
                />
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={downloadQRCode}>
            Download QR Code
          </Button>
          <Button color="secondary" onClick={toggleViewQRModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        itemToDelete={itemToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </Fragment>
  );
}

export default memo(Index);
