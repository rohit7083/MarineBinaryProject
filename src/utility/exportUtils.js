// exportUtils.js
import * as htmlToImage from "html-to-image";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Safely get nested value from object by path like "member.firstName"
const getValue = (obj, path) => {
  return path
    .split(".")
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), obj);
};

export const convertArrayOfObjectsToCSV = (data, selectedFields) => {
  if (!data || !data.length) return null;

  const headers = Object.keys(selectedFields);

  const rows = data.map((item, index) =>
    headers
      .map((header) => {
        const path = selectedFields[header];

        // handle custom fields that aren't just a path
        if (path === "__index") return index + 1; // 1-based index

        const val = getValue(item, path);
        const safeVal = String(val ?? "").replace(/"/g, '""'); // escape quotes
        return `"${safeVal}"`;
      })
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
};

export const exportToCSV = (data, filename = "report.csv") => {
  // Map your CSV headers to object paths
  const selectedFields = {
    ID: "__index", // special marker to handle numbering
    "Report Type": "paymentFrom",
    "Customer Name": "customer.firstName", // or "member.firstName" depending on structure
    "Email ID": "customer.emailId", // fallback handled by your backend ideally
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
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPDF = async (data, filename = "report.pdf") => {
  if (!data || !data.length) {
    console.warn("No data to export.");
    return;
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { height, width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 60;
  const margin = 40;
  const rowHeight = 20;
  const fontSize = 10;

  // === HEADER ===
  page.drawText("Payment Report", {
    x: margin,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 30;

  // === COLUMN HEADERS ===
  const headers = [
    "ID",
    "Payment Date",
    "Payment From",
    "Status",
    "Amount",
    "Email",
    "Customer",
    "Phone",
    "Txn ID",
  ];

  const colWidths = [25, 75, 75, 60, 60, 90, 80, 70, 70];
  let x = margin;

  headers.forEach((h, i) => {
    page.drawText(h, { x, y, size: fontSize, font: fontBold });
    x += colWidths[i];
  });

  y -= rowHeight;
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  // === TABLE ROWS ===
  y -= rowHeight / 2;

  data.forEach((item, index) => {
    if (y < 60) {
      // new page
      y = height - 60;
      const newPage = pdfDoc.addPage([595, 842]);
      page = newPage;
    }

    const customerName = item.customer
      ? [item.customer.firstName, item.customer.lastName]
          .filter(Boolean)
          .join(" ")
      : item.member
      ? [item.member.firstName, item.member.lastName].filter(Boolean).join(" ")
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

    const rowData = [
      index + 1,
      item.paymentDate || "",
      item.paymentFrom || "",
      item.paymentStatus || "",
      item.finalPayment ?? "",
      item.customer?.emailId || item.member?.emailId || "",
      customerName,
      phoneNumber,
      item.transactionId || "",
    ];

    x = margin;
    rowData.forEach((text, i) => {
      const truncated =
        String(text).length > 15
          ? String(text).slice(0, 15) + "…"
          : String(text);
      page.drawText(truncated, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      x += colWidths[i];
    });

    y -= rowHeight;
  });

  // === FOOTER ===
  page.drawText(`Generated on ${new Date().toLocaleString()}`, {
    x: margin,
    y: 30,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToImage = async (elementId, filename = "report.png") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found:", elementId);
    return;
  }

  try {
    // Convert the DOM node to a PNG blob
    const blob = await htmlToImage.toBlob(element, {
      backgroundColor: "#ffffff", // ensures white background
      quality: 1,
      pixelRatio: 2, // higher resolution
      skipAutoScale: false,
    });

    if (!blob) {
      throw new Error("Failed to create image blob");
    }

    // Trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Image export failed:", err);
  }
};



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
        ? [item.customer.firstName, item.customer.lastName].filter(Boolean).join(" ")
        : item.member
        ? [item.member.firstName, item.member.lastName].filter(Boolean).join(" ")
        : "";

      const phoneNumber = item.customer
        ? [item.customer.countryCode, item.customer.phoneNumber].filter(Boolean).join(" ")
        : item.member
        ? [item.member.countryCode, item.member.phoneNumber].filter(Boolean).join(" ")
        : "";

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.paymentDate || ""}</td>
          <td>${item.paymentFrom || ""}</td>
          <td>${item.paymentStatus || ""}</td>
          <td>${item.finalPayment ?? ""}</td>
          <td>${item.customer?.emailId || item.member?.emailId || ""}</td>
          <td>${customerName}</td>
          <td>${phoneNumber}</td>
          <td>${item.transactionId || ""}</td>
        </tr>
      `;
    })
    .join("");

  const htmlTable = `
    <table border="1">
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
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
};
