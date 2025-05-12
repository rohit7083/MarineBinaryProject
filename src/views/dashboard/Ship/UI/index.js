// import AvatarGroup from "@components/avatar-group";
// import react from "@src/assets/images/icons/react.svg";
// import vuejs from "@src/assets/images/icons/vuejs.svg";
// import angular from "@src/assets/images/icons/angular.svg";
// import bootstrap from "@src/assets/images/icons/bootstrap.svg";
// import avatar1 from "@src/assets/images/portrait/small/avatar-s-5.jpg";
// import avatar2 from "@src/assets/images/portrait/small/avatar-s-6.jpg";
// import avatar3 from "@src/assets/images/portrait/small/avatar-s-7.jpg";
// import { MoreVertical, Edit, Trash } from "react-feather";
// import {
//   Table,
//   Badge,
//   UncontrolledDropdown,
//   DropdownMenu,
//   DropdownItem,
//   DropdownToggle,
//   Input,
// } from "reactstrap";

// const TableBasic = () => {
//   return (
//     // <Table responsive>
//     //   <thead>
//     //     <tr>
//     //       <th>Charges</th>

//     //       <th>Charges Type</th>

//     //       <th>Charges Value</th>
//     //     </tr>
//     //   </thead>
//     //   <tbody>
//     //     <tr>
//     //       <td>
//     //         <span className="align-middle fw-bold">7 Days Charges</span>
//     //       </td>
//     //       <td>
//     //         <div>
//     //           <span className="me-1">Percentage</span>
//     //           <Input  type="radio"
//     //                   name="overDueChargesFor7Days"
//     //                   value="Percentage"
//     //                   id="Percentage"
//     //                   disabled={view}
//     //                   checked={
//     //                     selections.overDueChargesFor7Days === "Percentage"
//     //                   }
//     //                   onChange={() =>
//     //                     handleSelectTypeChange(
//     //                       "overDueChargesFor7Days",
//     //                       "Percentage"
//     //                     )
//     //                   }
//     //                   invalid={!!errors.overDueChargesFor7Days}  className="me-2"  />
//     //           <span className="me-1">Flat</span>
//     //           <Input type="radio" className="me-2" name="overDueChargesFor7Days"
//     //                   value="Flat"
//     //                   id="Flat"
//     //                   disabled={view}
//     //                   checked={selections.overDueChargesFor7Days === "Flat"}
//     //                   onChange={() =>
//     //                     handleSelectTypeChange("overDueChargesFor7Days", "Flat")
//     //                   }
//     //                   invalid={!!errors.overDueChargesFor7Days} />
//     //         </div>
//     //       </td>

//     //       <td>
//     //         <Input  type="text"
//     //                   name="overDueAmountFor7Days"
//     //                   disabled={view}
//     //                   value={userData.overDueAmountFor7Days || ""}
//     //                   onChange={(e) => {
//     //                     let sevenDays = e.target.value; // Use "let" instead of "const"
//     //                     sevenDays = sevenDays.replace(/[^0-9.]/g, ""); // Apply replace correctly
                    
//     //                     setUserData((prev) => ({ ...prev, overDueAmountFor7Days: sevenDays })); // Fix state update
//     //                   }}
//     //                   placeholder="Enter 7 Days Charges"
//     //                   invalid={!!errors.overDueAmountFor7Days} />
//     //       </td>
//     //     </tr>
//     //     <tr>
//     //       <td>
//     //         <span className="align-middle fw-bold">15 Days Charges</span>
//     //       </td>
//     //       <td>
//     //         <div>
//     //           <span className="me-1">Percentage</span>
//     //           <Input type="radio" 
//     //                   disabled={view}
//     //                   checked={
//     //                     selections.overDueChargesFor15Days === "Percentage"
//     //                   }
//     //                   onChange={() =>
//     //                     handleSelectTypeChange(
//     //                       "overDueChargesFor15Days",
//     //                       "Percentage"
//     //                     )
//     //                   }
//     //                   name="overDueChargesFor15Days"
//     //                   id="basic-cb-unchecked" className="me-2" />
//     //           <span className="me-1">Flat</span>
//     //           <Input type="radio"  checked={selections.overDueChargesFor15Days === "Flat"}
//     //                   disabled={view}
//     //                   onChange={() =>
//     //                     handleSelectTypeChange(
//     //                       "overDueChargesFor15Days",
//     //                       "Flat"
//     //                     )
//     //                   }
//     //                   name="overDueChargesFor15Days "
//     //                   id="basic-cb-unchecked" className="me-2" />
//     //         </div>
//     //       </td>
//     //       <td>
//     //         <Input   type="text"
//     //                   disabled={view}
//     //                   name="overDueAmountFor15Days"
//     //                   value={userData.overDueAmountFor15Days || ""}
//     //                   onChange={(e) => {
//     //                     let fiftinDays = e.target.value; 
//     //                     fiftinDays = fiftinDays.replace(/[^0-9.]/g, ""); 
                    
//     //                     setUserData((prev) => ({ ...prev, overDueAmountFor15Days: fiftinDays })); // Fix state update
//     //                   }}
//     //                   placeholder="Enter 15 Days Charges"
//     //                   invalid={!!errors.overDueAmountFor15Days}
//     //              />
//     //       </td>
//     //     </tr>
//     //     <tr>
//     //       <td>
//     //         <span className="align-middle fw-bold">30 Days Charges</span>
//     //       </td>
//     //       <td>
//     //         <div>
//     //           <span className="me-1">Percentage</span>
//     //           <Input type="radio"   disabled={view}
//     //                   checked={
//     //                     selections.overDueChargesFor30Days === "Percentage"
//     //                   }
//     //                   onChange={() =>
//     //                     handleSelectTypeChange(
//     //                       "overDueChargesFor30Days",
//     //                       "Percentage"
//     //                     )
//     //                   }
//     //                   name="overDueChargesFor30Days"
//     //                   id="basic-cb-unchecked" className="me-2" />
//     //           <span className="me-1">Flat</span>
//     //           <Input type="radio"  disabled={view}
//     //                   checked={selections.overDueChargesFor30Days === "Flat"}
//     //                   onChange={() =>
//     //                     handleSelectTypeChange(
//     //                       "overDueChargesFor30Days",
//     //                       "Flat"
//     //                     )
//     //                   }
//     //                   name="overDueChargesFor30Days"
//     //                   id="basic-cb-unchecked" className="me-2" />
//     //         </div>
//     //       </td>
//     //       <td>
//     //         <Input  type="text"
//     //                   disabled={view}
//     //                   name="overDueAmountFor30Days"
//     //                   placeholder="Enter 30 Days Charges"
//     //                   value={userData.overDueAmountFor30Days || ""}
//     //                   onChange={(e) =>{
//     //                     let thirty = e.target.value; 
//     //                     thirty = thirty.replace(/[^0-9.]/g, ""); 
                    
//     //                     setUserData((prev) => ({ ...prev, overDueAmountFor30Days: thirty })); // Fix state update
//     //                   }}
//     //                   invalid={!!errors.overDueAmountFor30Days}
//     //                />
//     //       </td>
//     //     </tr>
//     //     <tr>
//     //       <td>
//     //         <span className="align-middle fw-bold">Notice Charges</span>
//     //       </td>
//     //       <td>
//     //         <div>
//     //           <span className="me-1">Percentage</span>
//     //           <Input type="radio"   
//     //                   disabled={view}
//     //                   checked={
//     //                     selections.overDueChargesForNotice === "Percentage"
//     //                   }
//     //                   onChange={() =>
//     //                     handleSelectTypeChange(
//     //                       "overDueChargesForNotice",
//     //                       "Percentage"
//     //                     )
//     //                   }
//     //                   name="overDueChargesForNotice"
//     //                   id="basic-cb-unchecked" className="me-2" />
//     //           <span className="me-1">Flat</span>
//     //           <Input type="radio"   disabled={view}
//     //                   checked={selections.overDueChargesForNotice === "Flat"}
//     //                   onChange={() =>
//     //                     handleSelectTypeChange(
//     //                       "overDueChargesForNotice",
//     //                       "Flat"
//     //                     )
//     //                   }
//     //                   name="overDueChargesForNotice"
//     //                   id="basic-cb-unchecked" className="me-2" />
//     //         </div>
//     //       </td>
//     //       <td>
//     //         <Input  type="text"
//     //                   disabled={view}
//     //                   name="overDueAmountForNotice"
//     //                   value={userData.overDueAmountForNotice || ""}
//     //                   onChange={(e) =>{
//     //                     let noticeCharge = e.target.value; 
//     //                     noticeCharge = noticeCharge.replace(/[^0-9.]/g, ""); 
                    
//     //                     setUserData((prev) => ({ ...prev, overDueAmountForNotice: noticeCharge })); // Fix state update
//     //                   }}
//     //                   placeholder="Enter Notice Charges"
//     //                   invalid={!!errors.overDueAmountForNotice}
//     //            />
//     //       </td>
//     //     </tr>

//     //     <tr>
//     //       <td>
//     //         <span className="align-middle fw-bold">Auction Charges</span>
//     //       </td>
//     //       <td>
//     //         <div>
//     //           <span className="me-1">Percentage</span>
//     //           <Input type="radio"  disabled={view}
//     //                   checked={
//     //                     selections.overDueChagesForAuction === "Percentage"
//     //                   }
//     //                   onChange={() =>
//     //                     handleSelectTypeChange(
//     //                       "overDueChagesForAuction",
//     //                       "Percentage"
//     //                     )
//     //                   }
//     //                   name="overDueChagesForAuction"
//     //                   id="basic-cb-unchecked" className="me-2" />
//     //           <span className="me-1">Flat</span>
//     //           <Input type="radio"  disabled={view}
//     //                   checked={selections.overDueChagesForAuction === "Flat"}
//     //                   onChange={() =>
//     //                     handleSelectTypeChange(
//     //                       "overDueChagesForAuction",
//     //                       "Flat"
//     //                     )
//     //                   }
//     //                   name="overDueChagesForAuction"
//     //                   id="basic-cb-unchecked" className="me-2" />
//     //         </div>
//     //       </td>
//     //       <td>
//     //         <Input   type="text"
//     //                   disabled={view}
//     //                   name="overDueAmountForAuction"
//     //                   placeholder="Enter Auction Charges"
//     //                   value={userData.overDueAmountForAuction || ""}
//     //                   onChange={(e) =>{
//     //                     let AuctionCharge = e.target.value; 
//     //                     AuctionCharge = AuctionCharge.replace(/[^0-9.]/g, ""); 
                    
//     //                     setUserData((prev) => ({ ...prev, overDueAmountForAuction: AuctionCharge })); // Fix state update
//     //                   }}
//     //                   invalid={!!errors.overDueAmountForAuction}/>
//     //       </td>
//     //     </tr>
//     //   </tbody>
//     // </Table>
//   );
// };

// export default TableBasic;


import React, { useState } from "react";
import { Alert, Button } from "reactstrap";
import { X } from "react-feather"; // Feather icons

const ModernInteractiveAlert = () => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {visible && (
        <Alert
          color="danger"
          className="d-flex justify-content-between align-items-center shadow-sm p-3 rounded-3"
          style={{
            background: "#ffe6e6",
            borderColor: "#ffcccc",
            color: "#b30000",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
            <div>
              <strong>Error:</strong> Something went wrong. Please check your input.
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button size="sm" color="light" onClick={() => alert("Retrying...")}>
              Retry
            </Button>
            <X
              onClick={() => setVisible(false)}
              style={{ cursor: "pointer" }}
              size={18}
            />
          </div>
        </Alert>
      )}
    </>
  );
};

export default ModernInteractiveAlert;
