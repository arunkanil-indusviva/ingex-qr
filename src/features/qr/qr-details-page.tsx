import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { Skeleton } from "@/components/ui/skeleton"
import { QrPanel } from "@/features/qr/qr-panel"
import { queryKeys } from "@/lib/query-keys"
import { getQrCode } from "@/services/qr-codes"

export function QrDetailsPage() {
  const { qrId = "" } = useParams()
  const query = useQuery({
    queryKey: queryKeys.qrCode(qrId),
    queryFn: () => getQrCode(qrId),
  })

  return (
    <Page>
      <QueryState query={query} skeleton={<Skeleton className="h-80" />}>
        {(qr) => (
          <>
            <PageHeader title={qr.id} description={qr.productName} />
            <QrPanel qr={qr} />
          </>
        )}
      </QueryState>
    </Page>
  )
}
