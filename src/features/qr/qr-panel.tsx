import { useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Link } from "react-router-dom"

import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { downloadQrSvg, printQr } from "@/lib/qr-image"
import { formatDateTime, formatNumber } from "@/lib/format"
import type { QrSummary } from "@/types/catalog"

export function QrPanel({ qr }: { qr: QrSummary }) {
  const holder = useRef<HTMLDivElement>(null)

  function withSvg(action: (svg: SVGSVGElement) => void) {
    const svg = holder.current?.querySelector("svg")
    if (svg) {
      action(svg)
    }
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div ref={holder} className="rounded-lg border bg-white p-4">
        <QRCodeSVG value={qr.url} size={220} />
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Secure URL</p>
          <p className="break-all">{qr.url}</p>
        </div>
        <p>
          {qr.productName} · {qr.productCode} · {qr.batch}
        </p>
        <div className="flex gap-2">
          <StatusBadge value={qr.status} />
          <StatusBadge value={qr.productStatus} />
        </div>
        <p className="text-sm text-muted-foreground">
          {formatNumber(qr.totalScans)} scans · created{" "}
          {formatDateTime(qr.createdAt)}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              withSvg((svg) => downloadQrSvg(svg, `${qr.productCode}.svg`))
            }
          >
            Download QR
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              withSvg((svg) => printQr(svg, qr.productName, qr.url))
            }
          >
            Print QR
          </Button>
          <Button variant="secondary" asChild>
            <Link to={`/products/${qr.productId}`}>View product</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to={`/p/${encodeURIComponent(qr.productCode)}`}>
              Open customer page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
