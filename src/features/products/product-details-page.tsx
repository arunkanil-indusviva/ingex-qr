import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { queryKeys } from "@/lib/query-keys"
import { getProduct } from "@/services/products"

function Detail({ label, value }: { label: string; value: string }) {
  if (!value) {
    return null
  }

  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

export function ProductDetailsPage() {
  const { productId = "" } = useParams()
  const query = useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
  })

  return (
    <Page>
      <QueryState query={query} skeleton={<Skeleton className="h-96" />}>
        {(product) => (
          <>
            <PageHeader
              title={product.name}
              description={product.code}
              actions={
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" asChild>
                    <Link to={`/products/${product.id}/edit`}>Edit product</Link>
                  </Button>
                  <Button asChild>
                    <Link to={`/products/${product.id}/qr`}>Generate QR</Link>
                  </Button>
                  {product.qrId ? (
                    <Button variant="secondary" asChild>
                      <Link to={`/qr-codes/${product.qrId}`}>View QR</Link>
                    </Button>
                  ) : null}
                </div>
              }
            />
            <div className="grid gap-6 md:grid-cols-[160px_1fr]">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt=""
                  className="h-40 w-40 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                  No image
                </div>
              )}
              <dl className="grid gap-4 sm:grid-cols-2">
                <Detail label="Category" value={product.category} />
                <Detail label="Batch" value={product.batch} />
                <Detail
                  label="Manufactured"
                  value={formatDate(product.manufacturedOn)}
                />
                <Detail label="Expiry" value={formatDate(product.expiresOn)} />
                <Detail label="Colour" value={product.colour} />
                <Detail label="Type" value={product.type} />
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <StatusBadge value={product.status} />
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground">QR status</dt>
                  <dd>
                    <StatusBadge value={product.qrStatus} />
                  </dd>
                </div>
              </dl>
            </div>
            {product.description ? <p>{product.description}</p> : null}
            {product.specifications.length > 0 ? (
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-medium">Specifications</h2>
                <dl className="grid gap-2 sm:grid-cols-2">
                  {product.specifications.map((item) => (
                    <div key={item.id}>
                      <dt className="text-muted-foreground">{item.name}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
            <dl className="grid gap-4">
              <Detail label="Usage" value={product.usageInstructions} />
              <Detail label="Storage" value={product.storageInstructions} />
              <Detail label="Safety" value={product.safetyInformation} />
              <Detail label="Other information" value={product.otherInformation} />
            </dl>
          </>
        )}
      </QueryState>
    </Page>
  )
}
