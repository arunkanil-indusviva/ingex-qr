function saveBlob(filename: string, blob: Blob) {
  const href = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = href
  link.download = filename
  link.click()
  URL.revokeObjectURL(href)
}

function escapeCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

export function downloadCsv(
  filename: string,
  columns: string[],
  rows: string[][]
) {
  const lines = [
    columns.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ]
  saveBlob(
    filename,
    new Blob([`\uFEFF${lines.join("\n")}`], {
      type: "text/csv;charset=utf-8",
    })
  )
}

export function printHtml(title: string, body: string) {
  const popup = window.open("", "_blank", "noopener,noreferrer")
  if (!popup) {
    return
  }

  popup.document.write(
    `<!doctype html><html><head><title>${title}</title><style>body{font-family:sans-serif;padding:24px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px;text-align:left}</style></head><body>${body}</body></html>`
  )
  popup.document.close()
  popup.focus()
  popup.print()
}
