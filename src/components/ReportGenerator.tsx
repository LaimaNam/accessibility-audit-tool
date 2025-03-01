import React from "react";
import { jsPDF } from "jspdf";
// @ts-expect-error todo
import Papa from "papaparse";

interface ReportGeneratorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any[]>;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ data }) => {
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(JSON.stringify(data, null, 2), 10, 10);
    doc.save("report.pdf");
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={downloadJSON}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Download JSON
      </button>
      <button
        onClick={downloadCSV}
        className="p-2 bg-green-500 text-white rounded"
      >
        Download CSV
      </button>
      <button
        onClick={downloadPDF}
        className="p-2 bg-red-500 text-white rounded"
      >
        Download PDF
      </button>
    </div>
  );
};
