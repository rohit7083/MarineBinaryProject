// // exportUtils.js

// // Safely get nested value from object by path like "member.firstName"
// const getValue = (obj, path) => {
//   return path
//     .split(".")
//     .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), obj);
// };

// export const convertArrayOfObjectsToCSV = (data, selectedFields) => {
//   if (!data || !data.length) return null;

//   const headers = Object.keys(selectedFields);

//   const rows = data.map((item, index) =>
//     headers
//       .map((header) => {
//         const path = selectedFields[header];

//         // handle custom fields that aren't just a path
//         if (path === "__index") return index + 1; // 1-based index

//         const val = getValue(item, path);
//         const safeVal = String(val ?? "").replace(/"/g, '""'); // escape quotes
//         return `"${safeVal}"`;
//       })
//       .join(",")
//   );

//   return [headers.join(","), ...rows].join("\n");
// };

// export const exportToCSV = (data, filename = "report.csv") => {
//   // Map your CSV headers to object paths
//   const selectedFields = {
//     ID: "__index", // special marker to handle numbering
//     "Report Type": "paymentFrom",
//     "Customer Name": "customer.firstName", // or "member.firstName" depending on structure
//     "Email ID": "customer.emailId", // fallback handled by your backend ideally
//     "Phone Number": "customer.phoneNumber",
//     "Payment Date": "paymentDate",
//     "Payment TransactionID": "transactionId",
//     "Payment Status": "paymentStatus",
//     "Final Amount": "finalPayment",
//   };

//   const csv = convertArrayOfObjectsToCSV(data, selectedFields);
//   if (!csv) return;

//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = filename;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// };

// export const exportToExcelHTML = (data, filename = "report.xls") => {
//   if (!data || !data.length) {
//     console.warn("No data to export.");
//     return;
//   }

//   const headers = [
//     "ID",
//     "Payment Date",
//     "Payment From",
//     "Status",
//     "Final Amount",
//     "Email",
//     "Customer",
//     "Phone",
//     "Transaction ID",
//   ];

//   const rows = data
//     .map((item, index) => {
//       const customerName = item.customer
//         ? [item.customer.firstName, item.customer.lastName]
//             .filter(Boolean)
//             .join(" ")
//         : item.member
//         ? [item.member.firstName, item.member.lastName]
//             .filter(Boolean)
//             .join(" ")
//         : "";

//       const phoneNumber = item.customer
//         ? [item.customer.countryCode, item.customer.phoneNumber]
//             .filter(Boolean)
//             .join(" ")
//         : item.member
//         ? [item.member.countryCode, item.member.phoneNumber]
//             .filter(Boolean)
//             .join(" ")
//         : "";

//       return `
//         <tr>
//           <td>${index + 1}</td>
//           <td>${
//             item.paymentDate
//               ? (() => {
//                   const d = new Date(item.paymentDate);
//                   const year = d.getFullYear();
//                   const month = String(d.getMonth() + 1).padStart(2, "0");
//                   const day = String(d.getDate()).padStart(2, "0");

//                   let hours = d.getHours();
//                   const minutes = String(d.getMinutes()).padStart(2, "0");
//                   const ampm = hours >= 12 ? "PM" : "AM";
//                   hours = hours % 12 || 12;

//                   return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
//                 })()
//               : ""
//           }</td>
//           <td>${item.paymentFrom || ""}</td>
//           <td>${item.paymentStatus || ""}</td>
//           <td>${item.finalPayment ?? ""}</td>
//           <td>${item.customer?.emailId || item.member?.emailId || ""}</td>
//           <td>${customerName}</td>
//           <td>${phoneNumber}</td>
//           <td>${item.transactionId || ""}</td>
//         </tr>
//       `;
//     })
//     .join("");

//   const htmlTable = `
//     <table border="1">
//       <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
//       <tbody>${rows}</tbody>
//     </table>
//   `;

//   const blob = new Blob([htmlTable], {
//     type: "application/vnd.ms-excel;charset=utf-8;",
//   });

//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = filename.endsWith(".xls") ? filename : `${filename}.xls`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// ======================= exportUtils.js =======================

// --- Safe nested value getter ---
const getValue = (obj, path) =>
  path?.split(".").reduce((acc, key) => (acc == null ? "" : acc[key]), obj) ??
  "";

// --- Escape HTML for Excel safety ---
const escapeHTML = (text) =>
  String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";

  try {
    // 🧹 Clean and normalize the backend timestamp
    // Example: 2025-10-16T08:11:26.391479 → 2025-10-16T08:11:26.391Z
    const cleanStr = dateStr
      .replace(/(\.\d{3})\d*/, "$1") // keep 3 digits of ms
      .replace(" ", "T")
      .replace(/Z?$/, "Z"); // force UTC timezone

    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return dateStr; // fallback

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  } catch (err) {
    console.error("formatDateTime error:", err);
    return dateStr;
  }
};

// --- Convert objects to CSV string ---
export const convertArrayOfObjectsToCSV = (data, selectedFields) => {
  if (!data || !data.length) return null;

  const headers = Object.keys(selectedFields);

  const rows = data.map((item, index) =>
    headers
      .map((header) => {
        const path = selectedFields[header];
        if (path === "__index") return index + 1;

        let val = getValue(item, path);

        // detect any "date" field
        if (
          path.toLowerCase().includes("date") ||
          header.toLowerCase().includes("date")
        ) {
          val = formatDateTime(val);
        }

        const safeVal =
          typeof val === "object"
            ? JSON.stringify(val).replace(/"/g, '""')
            : String(val ?? "").replace(/"/g, '""');

        return `"${safeVal}"`;
      })
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
};

// --- CSV Export (downloads as .csv) ---
export const exportToCSV = (data, filename = "report.csv") => {
  const selectedFields = {
    ID: "__index",
    "Report Type": "paymentFrom",
    "Customer Name": "customer.firstName",
    "Email ID": "customer.emailId",
    "Phone Number": "customer.phoneNumber",
    "Payment Date": "paymentDate",
    "Payment TransactionID": "transactionId",
    "Payment Status": "paymentStatus",
    "Final Amount": "finalPayment",
  };

  const csv = convertArrayOfObjectsToCSV(data, selectedFields);
  if (!csv) return;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// --- Excel HTML Export (downloads as .xls) ---
export const exportToExcelHTML = (data, filename = "report.xls") => {
  if (!data || !data.length) {
    console.warn("No data to export.");
    return;
  }

  const headers = [
    "ID",
    "Payment Date",
    "Payment From",
    "Status",
    "Final Amount",
    "Email",
    "Customer",
    "Phone",
    "Transaction ID",
  ];

  const rows = data
    .map((item, index) => {
      const customerName = item.customer
        ? [item.customer.firstName, item.customer.lastName]
            .filter(Boolean)
            .join(" ")
        : item.member
        ? [item.member.firstName, item.member.lastName]
            .filter(Boolean)
            .join(" ")
        : "";

      const phoneNumber = item.customer
        ? [item.customer.countryCode, item.customer.phoneNumber]
            .filter(Boolean)
            .join(" ")
        : item.member
        ? [item.member.countryCode, item.member.phoneNumber]
            .filter(Boolean)
            .join(" ")
        : "";

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHTML(formatDateTime(item.paymentDate))}</td>
          <td>${escapeHTML(item.paymentFrom || "")}</td>
          <td>${escapeHTML(item.paymentStatus || "")}</td>
          <td>${escapeHTML(item.finalPayment ?? "")}</td>
          <td>${escapeHTML(
            item.customer?.emailId || item.member?.emailId || ""
          )}</td>
          <td>${escapeHTML(customerName)}</td>
          <td>${escapeHTML(phoneNumber)}</td>
          <td>${escapeHTML(item.transactionId || "")}</td>
        </tr>
      `;
    })
    .join("");

  const htmlTable = `
    <table border="1">
      <thead><tr>${headers
        .map((h) => `<th>${escapeHTML(h)}</th>`)
        .join("")}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  const blob = new Blob([htmlTable], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith(".xls") ? filename : `${filename}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// export const exportToPDF = (data, filename = "report.pdf") => {
//   if (!data || !data.length) {
//     console.warn("No data to export.");
//     return;
//   }

//   // Table headers
//   const headers = [
//     "ID",
//     "Payment Date",
//     "Payment From",
//     "Status",
//     "Final Amount",
//     "Email",
//     "Customer",
//     "Phone",
//     "Transaction ID",
//   ];

//   // Table rows
//   const rows = data.map((item, index) => {
//     const customerName = item.customer
//       ? [item.customer.firstName, item.customer.lastName]
//           .filter(Boolean)
//           .join(" ")
//       : item.member
//       ? [item.member.firstName, item.member.lastName].filter(Boolean).join(" ")
//       : "";

//     const phoneNumber = item.customer
//       ? [item.customer.countryCode, item.customer.phoneNumber]
//           .filter(Boolean)
//           .join(" ")
//       : item.member
//       ? [item.member.countryCode, item.member.phoneNumber]
//           .filter(Boolean)
//           .join(" ")
//       : "";

//     return [
//       index + 1,
//       formatDateTime(item.paymentDate),
//       item.paymentFrom || "",
//       item.paymentStatus || "",
//       item.finalPayment ?? "",
//       item.customer?.emailId || item.member?.emailId || "",
//       customerName,
//       phoneNumber,
//       item.transactionId || "",
//     ];
//   });

//   // Create PDF
//   const doc = new jsPDF("p", "pt");

//   doc.setFontSize(14);
//   doc.text("Payment Report", 40, 40);

//   autoTable(doc, {
//     startY: 60,
//     head: [headers],
//     body: rows,
//     styles: {
//       fontSize: 10,
//       cellPadding: 4,
//     },
//     headStyles: {
//       fillColor: [30, 30, 30],
//       textColor: 255,
//     },
//   });

//   doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
// };
