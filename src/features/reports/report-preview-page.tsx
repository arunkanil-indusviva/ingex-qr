import { useParams, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { FilterSelect } from "@/components/common/filter-select"
import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCatalogOptions } from "@/features/products/use-catalog-options"
import { downloadCsv, printHtml } from "@/lib/download"
import { formatDateTime } from "@/lib/format"
import { queryKeys } from "@/lib/query-keys"
import { getReport } from "@/services/reports"
import type { ReportFilters, ReportId } from "@/types/reports"

const titles: Record<string, string> = {
  products: "Product report",
  "qr-generation": "QR generation report",
  "qr-scans": "QR scan report",
  "product-scans": "Product-wise scan report",
  "country-scans": "Country-wise scan report",
}

function isReportId(value: string): value is ReportId {
  return value in titles
}

function displayCell(key: string, value: string) {
  if (key === "when" || key === "created") {
    return formatDateTime(value)
  }
  return value
}

export function ReportPreviewPage() {
  const { reportId = "" } = useParams()
  const [params, setParams] = useSearchParams()
  return <ReportBody id={reportId} params={params} setParams={setParams} />
}

function ReportBody({
  id,
  params,
  setParams,
}: {
  id: string
  params: URLSearchParams
  setParams: (next: URLSearchParams) => void
}) {
  const options = useCatalogOptions()
  const filters: ReportFilters = {
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    productId: params.get("productId") ?? "all",
    batch: params.get("batch") ?? "all",
    country: params.get("country") ?? "all",
  }
  const valid = isReportId(id)
  const query = useQuery({
    queryKey: queryKeys.report(valid ? id : "products", filters),
    queryFn: () => getReport(valid ? id : "products", filters),
    enabled: valid,
  })

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (!value || value === "all") {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setParams(next)
  }

  if (!valid) {
    return (
      <Page>
        <PageHeader title="Report" description="That report was not found." />
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader title={titles[id] ?? "Report"} description="Preview the filtered rows, then export them." />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Input type="date" aria-label="From date" value={filters.from} onChange={(event) => setFilter("from", event.target.value)} />
        <Input type="date" aria-label="To date" value={filters.to} onChange={(event) => setFilter("to", event.target.value)} />
        <FilterSelect
          label="Product"
          value={filters.productId || "all"}
          onChange={(value) => setFilter("productId", value)}
          options={[{ value: "all", label: "All products" }, ...(options.data?.products ?? []).map((product) => ({ value: product.id, label: product.name }))]}
        />
        <FilterSelect
          label="Batch"
          value={filters.batch || "all"}
          onChange={(value) => setFilter("batch", value)}
          options={[{ value: "all", label: "All batches" }, ...(options.data?.batches ?? []).map((batch) => ({ value: batch, label: batch }))]}
        />
        <FilterSelect
          label="Country"
          value={filters.country || "all"}
          onChange={(value) => setFilter("country", value)}
          options={[{ value: "all", label: "All countries" }, ...(options.data?.countries ?? []).map((country) => ({ value: country, label: country }))]}
        />
      </div>
      <QueryState query={query} skeleton={<Skeleton className="h-64" />} isEmpty={(report) => report.rows.length === 0} emptyTitle="No rows" emptyDescription="Nothing matches these filters.">
        {(report) => (
          <>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  downloadCsv(
                    `${report.id}.csv`,
                    report.columns.map((column) => column.label),
                    report.rows.map((row) =>
                      report.columns.map((column) => row[column.key] ?? "")
                    )
                  )
                }
              >
                Export Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const head = report.columns.map((column) => `<th>${column.label}</th>`).join("")
                  const body = report.rows
                    .map(
                      (row) =>
                        `<tr>${report.columns
                          .map((column) => `<td>${displayCell(column.key, row[column.key] ?? "")}</td>`)
                          .join("")}</tr>`
                    )
                    .join("")
                  printHtml(report.title, `<h1>${report.title}</h1><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`)
                }}
              >
                Export PDF
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {report.columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.rows.map((row, index) => (
                  <TableRow key={index}>
                    {report.columns.map((column) => (
                      <TableCell key={column.key}>
                        {displayCell(column.key, row[column.key] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </QueryState>
    </Page>
  )
}
