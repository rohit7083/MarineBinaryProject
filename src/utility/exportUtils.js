import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

export const exportToCSV = (data, filename = "report.csv") => {
  if (!data || !data.length) {
    console.warn("No data to export.");
    return;
  }

  // Flatten + sanitize each row
  const processedData = data.map((item, index) => {
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

    return {
      ID: index + 1,
      "Report Type": item.paymentFrom || "",
      "Customer Name": customerName,
      "Email ID": item.customer?.emailId || item.member?.emailId || "",
      "Phone Number": phoneNumber,
      "Payment Date": item.paymentDate || "",
      "Payment TransactionID": item.transactionId || "",
      "Payment Status": item.paymentStatus || "",
      "Final Amount": item.finalPayment ?? "",
    };
  });

  const csv = Papa.unparse(processedData, {
    header: true,
    skipEmptyLines: true
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
};

export const exportToPDF = (data, filename = "report.pdf") => {
 
  if (!data || !data.length) {
    console.warn("No data to export.");
    return;
  }

  const doc = new jsPDF("l", "pt", "a4");

  // Define which fields you actually want in the PDF
  const fieldsToInclude = [
    "paymentDate",
    "paymentFrom",
    "paymentStatus",
    "finalAmount",
    "EmailId",
    "customerName",
    "phoneNumber",
    "TransactionID"
  ];

  // Flatten + sanitize each row
  const processedData = data.map((item) => {
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

    return {
      customerName,
      phoneNumber,
      EmailId: item.customer?.emailId || item.member?.emailId || "",
      finalAmount: item.finalPayment ?? "",
      paymentFrom: item.paymentFrom || "",
      paymentDate: item.paymentDate || "",
TransactionID: item.transactionId || "",
      paymentStatus: item.paymentStatus || "",
    };
  });

  const headers = fieldsToInclude.map((f) =>
    f
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim()
  );

  const rows = processedData.map((row) => fieldsToInclude.map((f) => row[f]));

  doc.text("Report", 40, 40);
  autoTable(doc, {
    startY: 60,
    head: [headers],
    body: rows,
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [115, 103, 240] },
  });

  doc.save(filename);
};

export const exportToImage = async (elementId, filename = "report.png") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found:", elementId);
    return;
  }

  // Clone the element so we can expand it fully without breaking the layout
  const clone = element.cloneNode(true);
  clone.style.height = "auto";
  clone.style.maxHeight = "none";
  clone.style.overflow = "visible";
  clone.style.transform = "scale(1)";
  clone.style.position = "absolute";
  clone.style.left = "-9999px"; // Hide off-screen

  document.body.appendChild(clone);

  const canvas = await html2canvas(clone, {
    scale: 2, // higher resolution
    useCORS: true,
    scrollY: -window.scrollY,
    windowWidth: clone.scrollWidth,
    windowHeight: clone.scrollHeight,
  });

  document.body.removeChild(clone);

  const imgData = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = imgData;
  link.download = filename;
  link.click();
};
