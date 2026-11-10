/** @format */

export function filterResponses(responses, fields, searchTerm) {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return responses ?? [];

  const fieldLabels = new Map(
    (fields ?? []).map((field) => [field.id, field.label || field.id]),
  );

  return (responses ?? []).filter((response) =>
    Object.entries(response.data ?? {}).some(([fieldId, answer]) => {
      const label = fieldLabels.get(fieldId) ?? fieldId;
      return `${label} ${String(answer ?? "")}`.toLowerCase().includes(query);
    }),
  );
}
