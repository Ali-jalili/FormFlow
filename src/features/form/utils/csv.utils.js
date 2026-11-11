/** @format */

function escapeCsvCell(value) {
  let text = value === null || value === undefined ? "" : String(value);

  // Spreadsheet formula prefixes can be preceded by control characters.
  // eslint-disable-next-line no-control-regex
  if (/^[\u0000-\u0020\uFEFF]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return /[",\r\n]/.test(text)
    ? `"${text.replace(/"/g, '""')}"`
    : text;
}

function buildCsv(rows) {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}

export { buildCsv, escapeCsvCell };
