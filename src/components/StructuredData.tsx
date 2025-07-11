export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CEE Market Map",
    "description": "Interactive market map of leading tech companies in Central and Eastern Europe",
    "url": "https://cee-market-map.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Market Map Team"
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Czech Republic Startups"
      },
      {
        "@type": "Thing", 
        "name": "Slovakia Tech Companies"
      },
      {
        "@type": "Thing",
        "name": "Poland Tech Ecosystem"
      }
    ],
    "keywords": "CEE tech, Central Europe startups, Czech companies, Slovak companies, Polish companies, venture capital"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}