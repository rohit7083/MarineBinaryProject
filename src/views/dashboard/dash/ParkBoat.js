import { useState } from "react";
import { Search } from "react-feather";
import { useNavigate } from "react-router-dom";
import {
    Badge,
    Card,
    CardBody,
    CardText,
    Col,
    Input,
    InputGroup,
    InputGroupText,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
    Spinner,
} from "reactstrap";
import AddBoat from "../../../../src/assets/images/addBoat.png";
import BoatNew from "../../../../src/assets/images/updatedboat2.png";

function ParkBoat({ allBoatData, loading, setLoading }) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const filteredBoatData = allBoatData.filter(
    (boat) =>
      boat?.category?.shipTypeName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      boat.slipName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boat?.member?.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBoatData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredBoatData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleView = () => {
    navigate("/marin/slip-management");
  };

  const handleAdd = (boat) => {
    navigate("/dashboard/slip_memberform", {
      state: {
        formDataFromDashboard: boat,
      },
    });

     (boat);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // reset to page 1 on search
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const visiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <Pagination className="d-flex justify-content-end mt-3">
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink first onClick={() => handlePageChange(1)} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            previous
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>
        {pageNumbers.map((page) => (
          <PaginationItem key={page} active={page === currentPage}>
            <PaginationLink onClick={() => handlePageChange(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            next
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationItem>
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink last onClick={() => handlePageChange(totalPages)} />
        </PaginationItem>
      </Pagination>
    );
  };

  return (
    <div className="mt-3">
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Spinner
            style={{ width: "5rem", height: "5rem", color: "blue" }}
            type="border"
          />
        </div>
      ) : (
        <>
          <CardBody>
            <InputGroup className="input-group-merge mb-2">
              <InputGroupText>
                <Search size={14} />
              </InputGroupText>
              <Input
                onChange={handleSearchChange}
                placeholder="search Amount, Slips, category etc."
              />
            </InputGroup>

            <Row>
              {currentItems && currentItems.length > 0 ? (
                <>
                  {currentItems.map((boat, index) => (
                    <Col
                      key={index}
                      xl="4"
                      lg="4"
                      md="4"
                      sm="12"
                      className="mb-4"
                    >
                      <Card
                        style={{}}
                        className="h-100 shadow rounded hover-card boat-card"
                      >
                        <CardBody>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="text-primary mb-0">
                              # {index + startIndex + 1}
                            </h5>
                            <Badge color="dark" pill>
                              L - {boat?.dimensions?.length || 0}
                            </Badge>
                            <Badge color="primary" pill>
                              W - {boat?.dimensions?.width || 0}
                            </Badge>
                            <Badge color="warning" pill>
                              H - {boat?.dimensions?.height || 0}
                            </Badge>
                          </div>

                          <div className="mb-2">
                            <CardText className="mb-1">
                              <strong>Type:</strong>{" "}
                              {boat?.category?.shipTypeName}
                            </CardText>
                            <CardText>
                              <strong>Slip Name:</strong> {boat.slipName}
                            </CardText>

                            {boat?.isAssigned && (
                              <>
                                <CardText>
                                  <strong>Member Name:</strong>{" "}
                                  {(boat?.member?.firstName || "") +
                                    " " +
                                    (boat?.member?.lastName || "")}
                                </CardText>
                                <CardText>
                                  <strong>Amount :</strong> {boat?.finalPayment}
                                </CardText>
                              </>
                            )}
                          </div>

                          <div className="text-center">
                            <div
                              style={{
                                width: "170px",
                                height: "150px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "auto",
                              }}
                            >
                              {boat?.isAssigned ? (
                                <img
                                  src={BoatNew}
                                  className="boat-enter-float"
                                  alt="Boat"
                                  style={{
                                    width: "170px",
                                    height: "auto",
                                    cursor: "pointer",
                                  }}
                                  onClick={handleView}
                                />
                              ) : (
                                <img
                                  width="64"
                                  height="64"
                                  className="addimg"
                                  onClick={(e) => handleAdd(boat)}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  src={AddBoat}
                                  alt="add"
                                />
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </>
              ) : (
                <>
                  <Col sm="12">
                    <div className="text-center mt-4">
                      <h5>No data found</h5>
                    </div>
                  </Col>
                </>
              )}
            </Row>

            {renderPagination()}
          </CardBody>
        </>
      )}

      <style>
        {`
      .hover-card:hover {
        transform: scale(1.03);
        transition: 0.3s ease-in-out;
        border: 2px solid rgb(19, 19, 18);
      }

      .boat-card {
        background: linear-gradient(to bottom, rgb(255, 255, 255), rgb(37, 155, 179));
        border-radius: 20px 20px 60px 60px;
        position: relative;
        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        overflow: hidden;
        border: 1px solid #b2ebf2;
      }

      .boat-card::after {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 10%;
        width: 80%;
        height: 40px;
        background: #8d6e63;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      .boat-card::before {
        content: '';
        position: absolute;
        bottom: -25px;
        left: 20%;
        width: 60%;
        height: 15px;
        background: radial-gradient(circle, rgb(36, 84, 90) 20%, transparent 80%);
        opacity: 0.6;
      }

      @keyframes enterFromTop {
        0% { transform: translateY(-100px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }

      @keyframes floatSideToSide {
        0% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(0) translateX(8px); }
        100% { transform: translateY(0) translateX(0); }
      }

      .boat-enter-float {
        animation:
          enterFromTop 0.8s ease-out forwards,
          floatSideToSide 3s ease-in-out infinite;
        animation-delay: 0s, 0.8s;
      }
    `}
      </style>
    </div>
  );
}

export default ParkBoat;
