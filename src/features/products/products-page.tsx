import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { FilterSelect } from "@/components/common/filter-select"
import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { StatusBadge } from "@/components/common/status-badge"
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
import { queryKeys } from "@/lib/query-keys"
import { listProducts } from "@/services/products"
import type { ProductFilters } from "@/types/catalog"

const all = "all"

export function ProductsPage() {
  const options = useCatalogOptions()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(all)
  const [status, setStatus] = useState(all)
  const [batch, setBatch] = useState(all)
  const [qrStatus, setQrStatus] = useState(all)

  const filters: ProductFilters = {
    search,
    category,
    status,
    batch,
    qrStatus,
  }
  const query = useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => listProducts(filters),
  })

  return (
    <Page>
      <PageHeader
        title="Products"
        description="Search the catalogue, then open a product to edit it or generate its QR."
        actions={
          <Button asChild>
            <Link to="/products/new">Add product</Link>
          </Button>
        }
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search product, code, or batch"
          aria-label="Search product, code, or batch"
        />
        <FilterSelect
          label="Category"
          value={category}
          onChange={setCategory}
          options={[
            { value: all, label: "All categories" },
            ...(options.data?.categories ?? []).map((item) => ({
              value: item,
              label: item,
            })),
          ]}
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: all, label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        <FilterSelect
          label="Batch"
          value={batch}
          onChange={setBatch}
          options={[
            { value: all, label: "All batches" },
            ...(options.data?.batches ?? []).map((item) => ({
              value: item,
              label: item,
            })),
          ]}
        />
        <FilterSelect
          label="QR status"
          value={qrStatus}
          onChange={setQrStatus}
          options={[
            { value: all, label: "All QR statuses" },
            { value: "generated", label: "Generated" },
            { value: "pending", label: "Pending" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </div>
      <QueryState
        query={query}
        skeleton={<Skeleton className="h-64" />}
        isEmpty={(products) => products.length === 0}
        emptyTitle="No products match"
        emptyDescription="Try a different search, or add a product."
      >
        {(products) => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>QR status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.batch}</TableCell>
                  <TableCell>
                    <StatusBadge value={product.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={product.qrStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="link" className="h-auto px-0" asChild>
                        <Link to={`/products/${product.id}`}>View</Link>
                      </Button>
                      <Button variant="link" className="h-auto px-0" asChild>
                        <Link to={`/products/${product.id}/edit`}>Edit</Link>
                      </Button>
                      <Button variant="link" className="h-auto px-0" asChild>
                        <Link
                          to={
                            product.qrId
                              ? `/qr-codes/${product.qrId}`
                              : `/products/${product.id}/qr`
                          }
                        >
                          QR
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </QueryState>
    </Page>
  )
}
