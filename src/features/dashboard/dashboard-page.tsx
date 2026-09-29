import { Link } from "react-router-dom"

import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { StatCard } from "@/components/common/stat-card"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDashboard } from "@/features/dashboard/use-dashboard"
import { formatActivityKind, formatDateTime, formatNumber } from "@/lib/format"
import type { Activity } from "@/types/dashboard"

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  )
}

function ActivityTable({ activity }: { activity: Activity[] }) {
  if (activity.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing has been recorded yet.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>When</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Detail</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activity.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="whitespace-nowrap">
              {formatDateTime(item.occurredAt)}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{formatActivityKind(item.kind)}</Badge>
            </TableCell>
            <TableCell>
              {item.qrId ? (
                <Link className="underline-offset-4 hover:underline" to={`/qr-codes/${item.qrId}`}>
                  {item.summary}
                </Link>
              ) : item.productId ? (
                <Link className="underline-offset-4 hover:underline" to={`/products/${item.productId}`}>
                  {item.summary}
                </Link>
              ) : (
                item.summary
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function DashboardPage() {
  const query = useDashboard()

  return (
    <Page>
      <PageHeader
        title="Dashboard"
        description="Products, QR codes, and scan activity."
      />
      <QueryState query={query} skeleton={<DashboardSkeleton />}>
        {(summary) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Products"
                value={formatNumber(summary.totalProducts)}
              />
              <StatCard
                label="QR codes"
                value={formatNumber(summary.totalQrCodes)}
              />
              <StatCard
                label="Active products"
                value={formatNumber(summary.activeProducts)}
              />
              <StatCard
                label="QR scans"
                value={formatNumber(summary.totalScans)}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>
                  Products added, QR codes generated, and scans.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityTable activity={summary.recentActivity} />
              </CardContent>
            </Card>
          </>
        )}
      </QueryState>
    </Page>
  )
}
