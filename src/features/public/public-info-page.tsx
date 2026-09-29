import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/api-error"
import { queryKeys } from "@/lib/query-keys"
import { getPublicProduct } from "@/services/public-product"

const sections = {
  certificate: {
    title: "Certificate",
    pick: (product: { otherInformation: string; code: string; batch: string }) =>
      product.otherInformation ||
      `Certificate details for ${product.code}, batch ${product.batch}.`,
  },
  manual: {
    title: "Product manual",
    pick: (product: { usageInstructions: string }) =>
      product.usageInstructions || "No manual has been added for this product.",
  },
  more: {
    title: "More information",
    pick: (product: {
      safetyInformation: string
      storageInstructions: string
      specifications: { name: string; value: string }[]
    }) => {
      const specs = product.specifications
        .map((item) => `${item.name}: ${item.value}`)
        .join("\n")
      return [product.safetyInformation, product.storageInstructions, specs]
        .filter(Boolean)
        .join("\n\n") || "No further information has been published."
    },
  },
} as const

export function PublicInfoPage({
  section,
}: {
  section: keyof typeof sections
}) {
  const { code = "" } = useParams()
  const query = useQuery({
    queryKey: queryKeys.publicProduct(code),
    queryFn: () => getPublicProduct(code),
  })
  const content = sections[section]

  if (query.isPending) {
    return <p className="text-sm text-muted-foreground">Loading product</p>
  }

  if (query.isError || !query.data) {
    return (
      <p className="text-sm text-destructive">{getErrorMessage(query.error)}</p>
    )
  }

  return (
    <article className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">{content.title}</h1>
      <p className="whitespace-pre-wrap text-sm">{content.pick(query.data)}</p>
      <Button variant="outline" className="w-fit" asChild>
        <Link to={`/p/${encodeURIComponent(query.data.code)}`}>
          Back to product
        </Link>
      </Button>
    </article>
  )
}
