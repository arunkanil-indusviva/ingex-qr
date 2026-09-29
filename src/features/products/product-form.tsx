import { useEffect, useRef, useState } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { FormField } from "@/components/common/form-field"
import { Page, PageHeader } from "@/components/common/page"
import { QueryState } from "@/components/common/query-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  emptyProductForm,
  productSchema,
  toProductInput,
  type ProductFormValues,
} from "@/features/products/product-schema"
import { FilterSelect } from "@/components/common/filter-select"
import { getErrorMessage } from "@/lib/api-error"
import { invalidateCatalog, queryKeys } from "@/lib/query-keys"
import { queryClient } from "@/lib/query-client"
import { createProduct, getProduct, updateProduct } from "@/services/products"

function ProductFields({
  mode,
  productId,
}: {
  mode: "create" | "edit"
  productId?: string
}) {
  const navigate = useNavigate()
  const existing = useQuery({
    queryKey: queryKeys.product(productId ?? "new"),
    queryFn: () => getProduct(productId ?? ""),
    enabled: mode === "edit" && Boolean(productId),
  })
  const [imageOverride, setImageOverride] = useState<{
    id: string
    url: string | null
  } | null>(null)
  const imageUrl =
    imageOverride?.id === (productId ?? "new")
      ? imageOverride.url
      : (existing.data?.imageUrl ?? null)
  const intent = useRef<"save" | "generate">("save")

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyProductForm,
  })
  const specifications = useFieldArray({
    control: form.control,
    name: "specifications",
  })
  const status = useWatch({ control: form.control, name: "status" })

  useEffect(() => {
    if (!existing.data) {
      return
    }
    form.reset({
      name: existing.data.name,
      code: existing.data.code,
      category: existing.data.category,
      description: existing.data.description,
      batch: existing.data.batch,
      manufacturedOn: existing.data.manufacturedOn,
      expiresOn: existing.data.expiresOn,
      colour: existing.data.colour,
      type: existing.data.type,
      usageInstructions: existing.data.usageInstructions,
      storageInstructions: existing.data.storageInstructions,
      safetyInformation: existing.data.safetyInformation,
      otherInformation: existing.data.otherInformation,
      status: existing.data.status,
      specifications:
        existing.data.specifications.length > 0
          ? existing.data.specifications.map((item) => ({
              name: item.name,
              value: item.value,
            }))
          : [{ name: "", value: "" }],
    })
  }, [existing.data, form])

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) => {
      const input = toProductInput(values, imageUrl)
      return mode === "create" || !productId
        ? createProduct(input)
        : updateProduct(productId, input)
    },
    onSuccess: (product) => {
      invalidateCatalog(queryClient)
      toast.success(mode === "create" ? "Product saved" : "Product updated")
      navigate(
        intent.current === "generate"
          ? `/products/${product.id}/qr`
          : `/products/${product.id}`
      )
    },
  })

  const fields = (
    <form
      className="flex flex-col gap-8"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <section className="grid gap-4 md:grid-cols-2">
        <h2 className="text-sm font-medium md:col-span-2">
          Basic product information
        </h2>
        <FormField label="Product name" htmlFor="name" error={form.formState.errors.name?.message}>
          <Input id="name" {...form.register("name")} />
        </FormField>
        <FormField label="Product code" htmlFor="code" error={form.formState.errors.code?.message}>
          <Input id="code" {...form.register("code")} />
        </FormField>
        <FormField
          label="Category"
          htmlFor="category"
          error={form.formState.errors.category?.message}
        >
          <Input id="category" {...form.register("category")} />
        </FormField>
        <FormField label="Status" htmlFor="status">
          <FilterSelect
            label="Status"
            value={status}
            onChange={(value) =>
              form.setValue("status", value === "inactive" ? "inactive" : "active")
            }
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </FormField>
        <FormField
          label="Description"
          htmlFor="description"
          error={form.formState.errors.description?.message}
        >
          <Textarea id="description" {...form.register("description")} />
        </FormField>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h2 className="text-sm font-medium md:col-span-2">Product information</h2>
        <FormField label="Batch number" htmlFor="batch" error={form.formState.errors.batch?.message}>
          <Input id="batch" {...form.register("batch")} />
        </FormField>
        <FormField label="Product type" htmlFor="type">
          <Input id="type" {...form.register("type")} />
        </FormField>
        <FormField
          label="Manufacturing date"
          htmlFor="manufacturedOn"
          error={form.formState.errors.manufacturedOn?.message}
        >
          <Input id="manufacturedOn" type="date" {...form.register("manufacturedOn")} />
        </FormField>
        <FormField
          label="Expiry date"
          htmlFor="expiresOn"
          error={form.formState.errors.expiresOn?.message}
        >
          <Input id="expiresOn" type="date" {...form.register("expiresOn")} />
        </FormField>
        <FormField label="Colour" htmlFor="colour">
          <Input id="colour" {...form.register("colour")} />
        </FormField>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Product image</h2>
        <Input
          type="file"
          accept="image/*"
          aria-label="Product image"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (!file) {
              return
            }
            const reader = new FileReader()
            reader.onload = () => {
              if (typeof reader.result === "string") {
                setImageOverride({
                  id: productId ?? "new",
                  url: reader.result,
                })
              }
            }
            reader.readAsDataURL(file)
          }}
        />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Selected product"
            className="h-32 w-32 rounded-lg object-cover"
          />
        ) : null}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Specifications</h2>
        {specifications.fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <Input
              aria-label="Specification"
              placeholder="Specification"
              {...form.register(`specifications.${index}.name`)}
            />
            <Input
              aria-label="Value"
              placeholder="Value"
              {...form.register(`specifications.${index}.value`)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => specifications.remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={() => specifications.append({ name: "", value: "" })}
        >
          Add specification
        </Button>
      </section>

      <section className="grid gap-4">
        <h2 className="text-sm font-medium">Additional information</h2>
        <FormField label="Usage instructions" htmlFor="usageInstructions">
          <Textarea id="usageInstructions" {...form.register("usageInstructions")} />
        </FormField>
        <FormField label="Storage instructions" htmlFor="storageInstructions">
          <Textarea id="storageInstructions" {...form.register("storageInstructions")} />
        </FormField>
        <FormField label="Safety information" htmlFor="safetyInformation">
          <Textarea id="safetyInformation" {...form.register("safetyInformation")} />
        </FormField>
        <FormField label="Other information" htmlFor="otherInformation">
          <Textarea id="otherInformation" {...form.register("otherInformation")} />
        </FormField>
      </section>

      {mutation.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getErrorMessage(mutation.error)}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" asChild>
          <Link to="/products">Cancel</Link>
        </Button>
        <Button
          type="submit"
          variant="secondary"
          disabled={mutation.isPending}
          onClick={() => {
            intent.current = "save"
          }}
        >
          Save product
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          onClick={() => {
            intent.current = "generate"
          }}
        >
          Save and generate QR
        </Button>
      </div>
    </form>
  )

  if (mode === "edit") {
    return (
      <QueryState query={existing} skeleton={<Skeleton className="h-96" />}>
        {() => fields}
      </QueryState>
    )
  }

  return fields
}

export function ProductFormPage() {
  const { productId } = useParams()
  const mode = productId ? "edit" : "create"

  return (
    <Page>
      <PageHeader
        title={mode === "create" ? "Add product" : "Edit product"}
        description="This information is what a customer sees after scanning the QR."
      />
      <ProductFields mode={mode} productId={productId} />
    </Page>
  )
}
