import useJwt from "@src/auth/jwt/useJwt";
import { Mail, MapPin, Phone, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import MARinLogo from "../../../../assets/images/logo/product-logo.png";
import AddBranch from "../../../dashboard/branch_management/AddBranch";

// ** Utils
import { getUserData } from "@utils";

// ** Store & Actions
import { saveUnlockedPages } from "@store/authentication";
import { useDispatch } from "react-redux";

export default function BranchSelector() {
  const [search, setSearch] = useState("");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  // const [isFirst,setIsFirst]=useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("userData"));
        const uid = userData?.uid;

        if (!uid) {
          console.error("UID not found in userData");
          return;
        }

        const res = await useJwt.getBranch(uid);
        console.log(res);
        let resData = res?.data?.branches;

        setBranches(resData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const toggleModal = () => setIsOpen(!isOpen);

  const filtered = branches?.filter(
    (b) =>
      b.branchName.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (branch) => {
    console.log("Selected Branch:", branch);

    //  saveUnlockedPages
    // Store in localStorage
    if (branch) {
      const userData = getUserData();

      if (userData) {
        const { permissions = [] } = userData;

        const pagesUnlockedNames = {};

        permissions.forEach((item) => {
          if (item?.module) {
            pagesUnlockedNames[item.module] = true;
          }
        });

        localStorage.setItem(
          "pagesUnlockedNames",
          JSON.stringify(pagesUnlockedNames)
        );

        dispatch(saveUnlockedPages(pagesUnlockedNames));
      }
      localStorage.setItem("selectedBranch", JSON.stringify(branch));
      navigate("/dashbord");
    }
  };

  return (
    <div className="min-vh-100" style={{ background: "#7367F0" }}>
      {/* HEADER */}
      <div className="bg-white shadow-sm" style={{ padding: "20px 40px" }}>
        <div className="d-flex align-items-center">
          <Link
            className="brand-logo"
            to="/"
            onClick={(e) => e.preventDefault()}
          >
            <img
              src={MARinLogo}
              alt="Logo"
              style={{
                height: "5rem",
                width: "auto",
                marginBottom: 0,
                marginTop: 0,
              }}
            />
          </Link>
          <h2
            className="brand-text text-primary"
            style={{ fontWeight: "bold" }}
          >
            MarinaOne
          </h2>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container py-4">
        <Row className="">
          <Col className={"text-center text-white mb-2"}>
            <h1 style={{ fontWeight: 700, color: "white", fontSize: "2.5rem" }}>
              Select Your Branch
            </h1>
            <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
              Choose a location to access the dashboard
            </p>
          </Col>
        </Row>

        {/* SEARCH BAR */}
        <div className="mx-auto mb-3" style={{ maxWidth: "600px" }}>
          <div className="position-relative">
            <Search
              className="position-absolute"
              style={{
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
              size={20}
            />
            <input
              type="text"
              placeholder="Search by branch name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-100"
              style={{
                padding: "16px 20px 16px 55px",
                border: "none",
                borderRadius: "50px",
                fontSize: "1rem",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>

        {loading ? (
          <>
            <div className="text-center py-5">
              <Spinner className={"text-dark"} size={10} />
              <p
                style={{
                  color: "white",
                  fontSize: "1.2rem",
                  marginTop: "15px",
                }}
              >
                Fetching branches... please wait
              </p>
            </div>
          </>
        ) : (
          <>
            {branches?.length < 1 && (
              <Row>
                <Col className="d-flex justify-content-center mb-2">
                  <Button
                    color="light"
                    className={"rounded-pill px-2"}
                    onClick={toggleModal}
                  >
                    <strong> + Add Branch</strong>
                  </Button>
                </Col>{" "}
              </Row>
            )}
            <div className="row g-4">
              {filtered?.map((branch) => (
                <div key={branch.id} className="col-md-6 col-lg-4">
                  <div
                    onClick={() => handleSelect(branch)}
                    className="bg-white p-4 h-100"
                    style={{
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-10px)";
                      e.currentTarget.style.boxShadow =
                        "0 15px 40px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 5px 20px rgba(0,0,0,0.1)";
                    }}
                  >
                    <div className="d-flex justify-content-between mb-3">
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "15px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "24px",
                          fontWeight: 700,
                        }}
                      >
                        {branch.branchName.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <h4 style={{ fontWeight: 700, color: "#1a202c" }}>
                      {branch.branchName}
                    </h4>

                    <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      {branch.description}
                    </p>

                    {/* ADDRESS */}
                    <div className="mb-2 d-flex">
                      <MapPin
                        size={16}
                        style={{ marginRight: 8, color: "#667eea" }}
                      />
                      <span style={{ color: "#4b5563", fontSize: "0.9rem" }}>
                        {branch.address}, {branch.city}, {branch.state}{" "}
                        {branch.postalCode}
                      </span>
                    </div>

                    {/* PHONE */}
                    <div className="mb-2 d-flex">
                      <Phone
                        size={16}
                        style={{ marginRight: 8, color: "#667eea" }}
                      />
                      <span style={{ color: "#4b5563", fontSize: "0.9rem" }}>
                        {branch.countryCode} {branch.phoneNumber}
                      </span>
                    </div>

                    {/* EMAIL */}
                    <div className="d-flex">
                      <Mail
                        size={16}
                        style={{ marginRight: 8, color: "#667eea" }}
                      />
                      <span style={{ color: "#4b5563", fontSize: "0.9rem" }}>
                        {branch.email}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* MODAL */}
            <Modal isOpen={isOpen} toggle={toggleModal} centered>
              <ModalHeader toggle={toggleModal}>
                Add Your First Branch
              </ModalHeader>
              <ModalBody>
                <AddBranch isFirst={true} />
              </ModalBody>

              <ModalFooter>
                <Button color="secondary" onClick={toggleModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}
