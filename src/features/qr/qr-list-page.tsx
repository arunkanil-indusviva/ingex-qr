import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { FilterSelect } from "@/components/common/filter-select"
import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { formatNumber } from "@/lib/format"
import { invalidateCatalog, queryKeys } from "@/lib/query-keys"
import { queryClient } from "@/lib/query-client"
import { deactivateQr, listQrCodes } from "@/services/qr-codes"
import type { QrFilters } from "@/types/catalog"

export function QrListPage() {
  const options = useCatalogOptions()
  const [search, setSearch] = useState("")
  const [productId, setProductId] = useState("all")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [pendingId, setPendingId] = useState<string | null>(null)
  const filters: QrFilters = {
    search,
    productId,
    from,
    to,
  }
  const query = useQuery({
    queryKey: queryKeys.qrCodes(filters),
    queryFn: () => listQrCodes(filters),
  })
  const mutation = useMutation({
    mutationFn: deactivateQr,
    onSuccess: () => {
      invalidateCatalog(queryClient)
      setPendingId(null)
      toast.success("QR deactivated")
    },
  })

  return (
    <Page>
      <PageHeader
        title="QR codes"
        description="Every generated QR, with scan counts and a way to open or deactivate it."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search QR ID, code, name, or batch"
          aria-label="Search QR codes"
        />
        <FilterSelect
          label="Product"
          value={productId}
          onChange={setProductId}
          options={[
            { value: "all", label: "All products" },
            ...(options.data?.products ?? []).map((product) => ({
              value: product.id,
              label: `${product.name} (${product.code})`,
            })),
          ]}
        />
        <Input
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          aria-label="From date"
        />
        <Input
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          aria-label="To date"
        />
      </div>
      <QueryState
        query={query}
        skeleton={<Skeleton className="h-64" />}
        isEmpty={(codes) => codes.length === 0}
        emptyTitle="No QR codes match"
        emptyDescription="Generate a QR from a product, or change the filters."
      >
        {(codes) => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>QR ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Scans</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((qr) => (
                <TableRow key={qr.id}>
                  <TableCell>{qr.id}</TableCell>
                  <TableCell>{qr.productName}</TableCell>
                  <TableCell>{qr.productCode}</TableCell>
                  <TableCell>{qr.batch}</TableCell>
                  <TableCell>{formatNumber(qr.totalScans)}</TableCell>
                  <TableCell>
                    <StatusBadge value={qr.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="link" className="h-auto px-0" asChild>
                        <Link to={`/qr-codes/${qr.id}`}>View QR</Link>
                      </Button>
                      <Button variant="link" className="h-auto px-0" asChild>
                        <Link to={`/analytics?productId=${qr.productId}`}>
                          View analytics
                        </Link>
                      </Button>
                      {qr.status === "active" ? (
                        <Button
                          variant="link"
                          className="h-auto px-0"
                          onClick={() => setPendingId(qr.id)}
                        >
                          Deactivate
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </QueryState>
      <Dialog open={Boolean(pendingId)} onOpenChange={() => setPendingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate QR</DialogTitle>
            <DialogDescription>
              Customers who scan this QR will no longer see it as verified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingId(null)}>
              Cancel
            </Button>
            <Button
              disabled={mutation.isPending || !pendingId}
              onClick={() => {
                if (pendingId) {
                  mutation.mutate(pendingId)
                }
              }}
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  )
}
