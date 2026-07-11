export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ShopGrad",
    "url": "https://your-domain.vercel.app",
    "description": "Your favorite shopping destination with amazing deals on electronics, fashion, and home goods",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://your-domain.vercel.app/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
