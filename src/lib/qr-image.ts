import brandLogoUrl from "@/assets/logo.avif"

import { printHtml } from "@/lib/download"

export function downloadQrSvg(svg: SVGSVGElement, filename: string) {
  const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" })
  const href = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = href
  link.download = filename
  link.click()
  URL.revokeObjectURL(href)
}

export function printQr(svg: SVGSVGElement, title: string, url: string) {
  const logoSrc = new URL(brandLogoUrl, window.location.origin).href
  printHtml(
    title,
    `<img src="${logoSrc}" alt="Ingex Botanicals" style="height:40px" /><h1>${title}</h1><p>${url}</p>${svg.outerHTML}`
  )
}
