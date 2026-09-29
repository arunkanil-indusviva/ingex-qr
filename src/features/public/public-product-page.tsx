import { useParams } from "react-router-dom"

import { EmptyState } from "@/components/common/empty-state"
import { PageHeader } from "@/components/common/page"

export function PublicProductPage() {
  const { code } = useParams()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Product page"
        description={
          code
            ? `Customers who scan the QR for ${code} will see the verified product information here.`
            : "Customers land here after scanning a product QR."
        }
      />
      <EmptyState
        title="Customer screen is next"
        description="This route sits outside the admin portal. It will show the product information stored for the scanned code."
      />
    </div>
  )
}
