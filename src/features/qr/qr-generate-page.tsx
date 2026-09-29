import { useMutation, useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { QrPanel } from "@/features/qr/qr-panel"
import { getErrorMessage } from "@/lib/api-error"
import { invalidateCatalog, queryKeys } from "@/lib/query-keys"
import { queryClient } from "@/lib/query-client"
import { getProduct } from "@/services/products"
import { generateQr, getQrCode } from "@/services/qr-codes"

export function QrGeneratePage() {
  const { productId = "" } = useParams()
  const productQuery = useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
  })
  const qrQuery = useQuery({
    queryKey: queryKeys.qrCode(productQuery.data?.qrId ?? "none"),
    queryFn: () => getQrCode(productQuery.data?.qrId ?? ""),
    enabled: Boolean(productQuery.data?.qrId),
  })
  const mutation = useMutation({
    mutationFn: () => generateQr(productId),
    onSuccess: (qr) => {
      invalidateCatalog(queryClient)
      queryClient.setQueryData(queryKeys.qrCode(qr.id), qr)
      toast.success("QR generated")
    },
  })
  const qr = mutation.data ?? qrQuery.data

  return (
    <Page>
      <QueryState query={productQuery} skeleton={<Skeleton className="h-80" />}>
        {(product) => (
          <>
            <PageHeader
              title="Generate QR"
              description="The QR points at the secure product page. Product details stay in Ingex and can be updated later."
              actions={
                <Button variant="outline" asChild>
                  <Link to={`/products/${product.id}`}>View product</Link>
                </Button>
              }
            />
            <div className="flex flex-wrap gap-4 text-sm">
              <span>{product.name}</span>
              <span>{product.code}</span>
              <span>{product.batch}</span>
              <StatusBadge value={product.status} />
            </div>
            {qr ? <QrPanel qr={qr} /> : null}
            {!qr ? (
              <Button
                type="button"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate()}
              >
                {mutation.isPending ? "Generating" : "Generate QR"}
              </Button>
            ) : null}
            {mutation.isError ? (
              <p className="text-sm text-destructive" role="alert">
                {getErrorMessage(mutation.error)}
              </p>
            ) : null}
          </>
        )}
      </QueryState>
    </Page>
  )
}
