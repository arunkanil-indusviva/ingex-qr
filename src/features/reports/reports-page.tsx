import { Link } from "react-router-dom"

import { Page, PageHeader } from "@/components/common/page"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const reports = [
  {
    id: "products",
    title: "Product report",
    description: "Products in the catalogue, with status and QR status.",
  },
  {
    id: "qr-generation",
    title: "QR generation report",
    description: "QR codes generated in the selected period.",
  },
  {
    id: "qr-scans",
    title: "QR scan report",
    description: "Individual scans, including country.",
  },
  {
    id: "product-scans",
    title: "Product-wise scan report",
    description: "Scan totals for each product.",
  },
  {
    id: "country-scans",
    title: "Country-wise scan report",
    description: "Scan totals for each country.",
  },
]

export function ReportsPage() {
  return (
    <Page>
      <PageHeader
        title="Reports"
        description="Choose a report, apply filters, then preview or export it."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
              <Button className="mt-2 w-fit" asChild>
                <Link to={`/reports/${report.id}`}>View report</Link>
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Page>
  )
}
