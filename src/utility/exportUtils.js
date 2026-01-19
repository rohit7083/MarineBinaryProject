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
      .join(","),
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
  console.log("data", data);

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
      // const customerName =/ item.customer != null
      //   ? [item.customer.firstName, item.customer.lastName]
      //       .filter(Boolean)
      //       .join(" ")
      //   :
      //   ? [item.member.firstName, item.member.lastName]
      //       .filter(Boolean)
      //       .join(" ")
      //   : "";

      // const phoneNumber = item.customer
      //   ? [item.customer.countryCode, item.customer.phoneNumber]
      //       .filter(Boolean)
      //       .join(" ")
      //   : item.member
      //   ? [item.member.countryCode, item.member.phoneNumber]
      //       .filter(Boolean)
      //       .join(" ")
      //   : "";

      const source = item.customer ?? item.member;

      const customerName = source
        ? [source.firstName, source.lastName].filter(Boolean).join(" ")
        : "";

      const phoneNumber = source
        ? [source.countryCode, source.phoneNumber].filter(Boolean).join(" ")
        : "";

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHTML(formatDateTime(item.paymentDate))}</td>
          <td>${escapeHTML(item.paymentFrom || "")}</td>
          <td>${escapeHTML(item.paymentStatus || "")}</td>
          <td>${escapeHTML(item.finalPayment ?? "")}</td>
          <td>${escapeHTML(
            item.customer?.emailId || item.member?.emailId || "",
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

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Configuration for PDF generation
 */
const PDF_CONFIG = {
  pageMargin: 25,
  fontSize: 6.5,
  lineHeight: 8,
  titleFontSize: 16,
  titleBottomMargin: 15,
  headerBottomMargin: 6,
  rowBottomMargin: 2,
  headerLineThickness: 1,
  headerLineBottomMargin: 3,
  cellPadding: 2,
  headerFontSize: 7,
};

// Optimized column widths for landscape A4
const COLUMN_WIDTHS = [22, 65, 58, 45, 55, 95, 75, 65, 85];

const TABLE_HEADERS = [
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

/**
 * Formats data row from payment item
 */
const formatDataRow = (item, index) => {
  const customer = item.customer || item.member || {};

  return [
    String(index + 1),
    formatDateTime(item.paymentDate),
    item.paymentFrom ?? "",
    item.paymentStatus ?? "",
    String(item.finalPayment ?? ""),
    customer.emailId ?? "",
    [customer.firstName, customer.lastName].filter(Boolean).join(" "),
    [customer.countryCode, customer.phoneNumber].filter(Boolean).join(" "),
    item.transactionId ?? "",
  ];
};

/**
 * PDF Generator Class
 */
class PDFGenerator {
  constructor(pdfDoc, font, boldFont) {
    this.pdfDoc = pdfDoc;
    this.font = font;
    this.boldFont = boldFont;
    this.currentPage = null;
    this.currentY = 0;
    this.pageWidth = 0;
    this.pageHeight = 0;
  }

  /**
   * Initialize new page in landscape orientation
   */
  addPage() {
    this.currentPage = this.pdfDoc.addPage([842, 595]); // A4 Landscape
    this.pageWidth = 842;
    this.pageHeight = 595;
    this.currentY = this.pageHeight - PDF_CONFIG.pageMargin;
    return this.currentPage;
  }

  /**
   * Wrap text to fit within column width with character-level precision
   */
  wrapText(text, maxWidth, font = this.font, fontSize = PDF_CONFIG.fontSize) {
    const str = String(text);
    if (!str || str.length === 0) return [""];

    const lines = [];
    let currentLine = "";

    for (let i = 0; i < str.length; i++) {
      const testLine = currentLine + str[i];
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = str[i];
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines.length > 0 ? lines : [""];
  }

  /**
   * Draw vertical grid lines for table
   */
  drawGridLines(yTop, yBottom) {
    let xPosition = PDF_CONFIG.pageMargin;

    // Draw vertical lines
    for (let i = 0; i <= COLUMN_WIDTHS.length; i++) {
      this.currentPage.drawLine({
        start: { x: xPosition, y: yTop },
        end: { x: xPosition, y: yBottom },
        thickness: 0.3,
        color: rgb(0.7, 0.7, 0.7),
      });
      if (i < COLUMN_WIDTHS.length) {
        xPosition += COLUMN_WIDTHS[i];
      }
    }
  }

  /**
   * Draw a single row of data with grid
   */
  drawRow(rowData, yPosition, isHeader = false) {
    const fontSize = isHeader ? PDF_CONFIG.headerFontSize : PDF_CONFIG.fontSize;
    const cellFont = isHeader ? this.boldFont : this.font;
    const maxWidth = COLUMN_WIDTHS.map((w) => w - PDF_CONFIG.cellPadding * 2);

    // Wrap text for each cell
    const wrappedCells = rowData.map((cell, columnIndex) => {
      return this.wrapText(cell, maxWidth[columnIndex], cellFont, fontSize);
    });

    // Calculate max lines needed
    const maxLines = Math.max(...wrappedCells.map((lines) => lines.length));
    const rowHeight =
      maxLines * PDF_CONFIG.lineHeight + PDF_CONFIG.cellPadding * 2;

    const yTop = yPosition;
    const yBottom = yPosition - rowHeight;

    // Draw background for header
    if (isHeader) {
      this.currentPage.drawRectangle({
        x: PDF_CONFIG.pageMargin,
        y: yBottom,
        width: COLUMN_WIDTHS.reduce((a, b) => a + b, 0),
        height: rowHeight,
        color: rgb(0.2, 0.4, 0.7),
      });
    } else {
      // Alternating row colors for better readability
      this.currentPage.drawRectangle({
        x: PDF_CONFIG.pageMargin,
        y: yBottom,
        width: COLUMN_WIDTHS.reduce((a, b) => a + b, 0),
        height: rowHeight,
        color: rgb(0.98, 0.98, 0.98),
      });
    }

    // Draw grid lines
    this.drawGridLines(yTop, yBottom);

    // Draw horizontal line at bottom
    this.currentPage.drawLine({
      start: { x: PDF_CONFIG.pageMargin, y: yBottom },
      end: {
        x: PDF_CONFIG.pageMargin + COLUMN_WIDTHS.reduce((a, b) => a + b, 0),
        y: yBottom,
      },
      thickness: 0.3,
      color: rgb(0.7, 0.7, 0.7),
    });

    // Draw text in each cell
    let xPosition = PDF_CONFIG.pageMargin;
    wrappedCells.forEach((lines, columnIndex) => {
      let textY =
        yPosition - PDF_CONFIG.cellPadding - PDF_CONFIG.lineHeight * 0.7;

      lines.forEach((line) => {
        this.currentPage.drawText(line, {
          x: xPosition + PDF_CONFIG.cellPadding,
          y: textY,
          size: fontSize,
          font: cellFont,
          color: isHeader ? rgb(1, 1, 1) : rgb(0.1, 0.1, 0.1),
        });
        textY -= PDF_CONFIG.lineHeight;
      });

      xPosition += COLUMN_WIDTHS[columnIndex];
    });

    return rowHeight;
  }

  /**
   * Draw table header with styling
   */
  drawTableHeader() {
    const yTop = this.currentY;
    const headerHeight = this.drawRow(TABLE_HEADERS, this.currentY, true);
    this.currentY -= headerHeight;

    // Draw top border of table
    this.currentPage.drawLine({
      start: { x: PDF_CONFIG.pageMargin, y: yTop },
      end: {
        x: PDF_CONFIG.pageMargin + COLUMN_WIDTHS.reduce((a, b) => a + b, 0),
        y: yTop,
      },
      thickness: 1,
      color: rgb(0.2, 0.4, 0.7),
    });

    this.currentY -= PDF_CONFIG.headerBottomMargin;
  }

  /**
   * Draw page title with date
   */
  drawTitle(title) {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Title
    const titleWidth = this.boldFont.widthOfTextAtSize(
      title,
      PDF_CONFIG.titleFontSize,
    );
    const centerX = (this.pageWidth - titleWidth) / 2;

    this.currentPage.drawText(title, {
      x: centerX,
      y: this.currentY,
      size: PDF_CONFIG.titleFontSize,
      font: this.boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Date subtitle
    this.currentY -= 12;
    const dateText = `Generated on ${currentDate}`;
    const dateWidth = this.font.widthOfTextAtSize(dateText, 8);
    const dateCenterX = (this.pageWidth - dateWidth) / 2;

    this.currentPage.drawText(dateText, {
      x: dateCenterX,
      y: this.currentY,
      size: 8,
      font: this.font,
      color: rgb(0.4, 0.4, 0.4),
    });

    this.currentY -= PDF_CONFIG.titleBottomMargin;
  }

  /**
   * Draw page number
   */
  drawPageNumber(pageNum, totalPages) {
    const pageText = `Page ${pageNum} of ${totalPages}`;
    const textWidth = this.font.widthOfTextAtSize(pageText, 7);

    this.currentPage.drawText(pageText, {
      x: this.pageWidth - PDF_CONFIG.pageMargin - textWidth,
      y: PDF_CONFIG.pageMargin - 15,
      size: 7,
      font: this.font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  /**
   * Calculate estimated height needed for a row
   */
  estimateRowHeight(rowData) {
    const maxWidth = COLUMN_WIDTHS.map((w) => w - PDF_CONFIG.cellPadding * 2);
    const maxLines = Math.max(
      ...rowData.map(
        (cell, columnIndex) =>
          this.wrapText(cell, maxWidth[columnIndex]).length,
      ),
    );
    return maxLines * PDF_CONFIG.lineHeight + PDF_CONFIG.cellPadding * 2;
  }

  /**
   * Check if new page is needed
   */
  ensureSpace(requiredHeight) {
    if (this.currentY - requiredHeight < PDF_CONFIG.pageMargin + 30) {
      this.addPage();
      this.drawTableHeader();
      return true;
    }
    return false;
  }

  /**
   * Generate complete PDF document
   */
  async generate(rows, title = "Payment Report") {
    // First page
    this.addPage();
    this.drawTitle(title);
    this.drawTableHeader();

    // Draw all rows
    for (const row of rows) {
      const estimatedHeight = this.estimateRowHeight(row);
      this.ensureSpace(estimatedHeight);

      const actualRowHeight = this.drawRow(row, this.currentY);
      this.currentY -= actualRowHeight + PDF_CONFIG.rowBottomMargin;
    }

    // Add page numbers to all pages
    const totalPages = this.pdfDoc.getPageCount();
    const pages = this.pdfDoc.getPages();
    pages.forEach((page, index) => {
      this.currentPage = page;
      this.drawPageNumber(index + 1, totalPages);
    });

    return await this.pdfDoc.save();
  }
}

/**
 * Download PDF file
 */
const downloadPDF = (pdfBytes, filename) => {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  link.click();

  URL.revokeObjectURL(url);
};

/**
 * Main export function
 * @param {Array} data - Array of payment data objects
 * @param {string} filename - Output PDF filename
 */
export const exportToPDF = async (data, filename = "report.pdf") => {
  // Validate input
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No data provided for PDF export");
    return;
  }

  try {
    // Prepare data rows
    const rows = data.map(formatDataRow);

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Generate PDF
    const generator = new PDFGenerator(pdfDoc, font, boldFont);
    const pdfBytes = await generator.generate(rows);

    // Download
    downloadPDF(pdfBytes, filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
