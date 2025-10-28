import { CardTitle, Spinner } from "reactstrap";

function UserInfoCard({ selectedMembers, loader }) {
  console.log("loader", loader);

  return (
    <div className="card">
      {loader ? (
        <div className="card-body text-center">
          <p>Loading...</p>
          <Spinner color={"primary"} size={"sm"} />
        </div>
      ) : (
        <>
          {selectedMembers ? (
            <>
              <div className="card-body text-center">
                <CardTitle
                  tag="h4"
                  className="mb-0"
                  style={{ fontSize: "1.75rem" }}
                >
                  {selectedMembers?.label}
                </CardTitle>
                <small className="text-muted">
                  {" "}
                  {selectedMembers?.emailId}
                </small>
              </div>
              <h4 className="fw-bolder border-bottom pb-50 mx-2 mb-1">
                Details
              </h4>
              <div className="info-container mx-2">
                <ul className="list-unstyled">
                  <li className="mb-75">
                    <span className="fw-bolder me-25">Email:</span>
                    <span> {selectedMembers?.emailId}</span>
                  </li>

                  <li className="mb-75">
                    <span className="fw-bolder me-25">Mobile No:</span>
                    <span> {selectedMembers?.phoneNumber}</span>
                  </li>
                  <li className="mb-75">
                    <span className="fw-bolder me-25">Address:</span>
                    <span> {selectedMembers?.address}</span>
                  </li>
                  <li className="mb-75">
                    <span className="fw-bolder me-25">City:</span>
                    <span> {selectedMembers?.city}</span>
                  </li>
                  <li className="mb-75">
                    <span className="fw-bolder me-25">Country:</span>
                    <span>{selectedMembers?.country}</span>
                  </li>
                  <li className="mb-75">
                    <span className="fw-bolder me-25">Zip Code:</span>
                    <span>{selectedMembers?.postalCode}</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="card-body text-center ">
                <p className="text-muted my-2">No member selected.</p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default UserInfoCard;
