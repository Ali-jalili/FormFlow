import { useState } from "react";
import toast from "react-hot-toast";

import { getAllResponses } from "../services/responsesService";
import { buildCsv } from "../utils/csv.utils";

function useResponseCsvExport(formId, fields = []) {
  const [isExporting, setIsExporting] = useState(false);

  async function exportCsv() {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const allResponses = await getAllResponses(formId);
      const header = [
        "Submission date",
        ...fields.map((field) => field.label || field.id),
      ];
      const rows = allResponses.map((response) => [
        new Date(response.created_at).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        ...fields.map((field) => response.data?.[field.id] ?? ""),
      ]);

      const blob = new Blob([`\uFEFF${buildCsv([header, ...rows])}`], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `form-${formId}-responses-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Responses exported to CSV.");
    } catch (error) {
      toast.error(error.message || "Unable to export responses.");
    } finally {
      setIsExporting(false);
    }
  }

  return { isExporting, exportCsv };
}

export default useResponseCsvExport;
