import { Link, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { FilterSelect } from "@/components/common/filter-select"
import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { StatCard } from "@/components/common/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useCatalogOptions } from "@/features/products/use-catalog-options"
import { formatDate, formatNumber } from "@/lib/format"
import { queryKeys } from "@/lib/query-keys"
import { getAnalytics } from "@/services/analytics"
import type { AnalyticsFilters } from "@/types/analytics"

const chartConfig = {
  scans: { label: "Scans", color: "var(--chart-1)" },
} satisfies ChartConfig

function paramFilters(params: URLSearchParams): AnalyticsFilters {
  return {
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    productId: params.get("productId") ?? "all",
    country: params.get("country") ?? "all",
    batch: params.get("batch") ?? "all",
  }
}

function ScanChart({
  title,
  data,
  labelKey,
}: {
  title: string
  data: Record<string, string | number>[]
  labelKey: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No scans in this range.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={labelKey}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) =>
                  labelKey === "date" ? formatDate(value) : value
                }
              />
              <YAxis allowDecimals={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="scans" fill="var(--color-scans)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function AnalyticsPage() {
  const options = useCatalogOptions()
  const [params, setParams] = useSearchParams()
  const filters = paramFilters(params)
  const query = useQuery({
    queryKey: queryKeys.analytics(filters),
    queryFn: () => getAnalytics(filters),
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

  const exportQuery = params.toString()

  return (
    <Page>
      <PageHeader
        title="Analytics"
        description="Scan volume, countries, and products for the selected period."
        actions={
          <Button variant="outline" asChild>
            <Link to={`/reports/qr-scans${exportQuery ? `?${exportQuery}` : ""}`}>
              Export report
            </Link>
          </Button>
        }
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Input
          type="date"
          aria-label="From date"
          value={filters.from}
          onChange={(event) => setFilter("from", event.target.value)}
        />
        <Input
          type="date"
          aria-label="To date"
          value={filters.to}
          onChange={(event) => setFilter("to", event.target.value)}
        />
        <FilterSelect
          label="Product"
          value={filters.productId || "all"}
          onChange={(value) => setFilter("productId", value)}
          options={[
            { value: "all", label: "All products" },
            ...(options.data?.products ?? []).map((product) => ({
              value: product.id,
              label: product.name,
            })),
          ]}
        />
        <FilterSelect
          label="Country"
          value={filters.country || "all"}
          onChange={(value) => setFilter("country", value)}
          options={[
            { value: "all", label: "All countries" },
            ...(options.data?.countries ?? []).map((country) => ({
              value: country,
              label: country,
            })),
          ]}
        />
        <FilterSelect
          label="Batch"
          value={filters.batch || "all"}
          onChange={(value) => setFilter("batch", value)}
          options={[
            { value: "all", label: "All batches" },
            ...(options.data?.batches ?? []).map((batch) => ({
              value: batch,
              label: batch,
            })),
          ]}
        />
      </div>
      <QueryState query={query} skeleton={<Skeleton className="h-96" />}>
        {(summary) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="QR scans" value={formatNumber(summary.totalScans)} />
              <StatCard
                label="Unique scans"
                value={formatNumber(summary.uniqueScans)}
              />
              <StatCard
                label="Active QR codes"
                value={formatNumber(summary.activeQrCodes)}
              />
              <StatCard label="Countries" value={formatNumber(summary.countries)} />
            </div>
            <ScanChart title="Scans over time" data={summary.overTime} labelKey="date" />
            <div className="grid gap-4 xl:grid-cols-2">
              <ScanChart
                title="Scans by country"
                data={summary.byCountry}
                labelKey="country"
              />
              <ScanChart
                title="Scans by product"
                data={summary.byProduct}
                labelKey="product"
              />
            </div>
          </>
        )}
      </QueryState>
    </Page>
  )
}
