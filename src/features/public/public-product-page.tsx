import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"
import { getErrorMessage } from "@/lib/api-error"
import { queryKeys } from "@/lib/query-keys"
import { getPublicProduct } from "@/services/public-product"

function Block({ title, body }: { title: string; body: string }) {
  if (!body) {
    return null
  }

  return (
    <section className="flex flex-col gap-1">
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="text-sm text-muted-foreground">{body}</p>
    </section>
  )
}

export function PublicProductPage() {
  const { code = "" } = useParams()
  const query = useQuery({
    queryKey: [...queryKeys.publicProduct(code), "scan"],
    queryFn: () => getPublicProduct(code, true),
  })

  if (query.isPending) {
    return <p className="text-sm text-muted-foreground">Loading product</p>
  }

  if (query.isError || !query.data) {
    return (
      <p className="text-sm text-destructive">{getErrorMessage(query.error)}</p>
    )
  }

  const product = query.data

  return (
    <article className="flex flex-col gap-5">
      <p className="text-sm">
        {product.verified
          ? "Product verified"
          : "This product could not be verified."}
      </p>
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt=""
          className="aspect-square w-full rounded-lg object-cover"
        />
      ) : null}
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-medium">{product.name}</h1>
        <p className="text-sm text-muted-foreground">
          {product.code} · {product.batch}
        </p>
      </header>
      {product.description ? <p>{product.description}</p> : null}
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Manufactured</dt>
          <dd>{formatDate(product.manufacturedOn)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Expiry</dt>
          <dd>{formatDate(product.expiresOn)}</dd>
        </div>
      </dl>
      <Block title="Usage" body={product.usageInstructions} />
      <Block title="Storage" body={product.storageInstructions} />
      <div className="flex flex-col gap-2">
        <Button variant="outline" asChild>
          <Link to={`/p/${encodeURIComponent(product.code)}/certificate`}>
            View certificate
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/p/${encodeURIComponent(product.code)}/manual`}>
            Product manual
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/p/${encodeURIComponent(product.code)}/more`}>
            More information
          </Link>
        </Button>
      </div>
    </article>
  )
}
