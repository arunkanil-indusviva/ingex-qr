import { EmptyState } from "@/components/common/empty-state"
import { Page, PageHeader } from "@/components/common/page"
import { usePageHeading } from "@/hooks/use-page-heading"

export function ScreenPlaceholder() {
  const heading = usePageHeading()

  return (
    <Page>
      <PageHeader title={heading.title} description={heading.description} />
      <EmptyState
        title="This screen is next"
        description="The route is in place. We'll build the screen once this part of the flow is confirmed."
      />
    </Page>
  )
}
