import { useEffect } from 'react';
import { SEOData } from '@/data/seoContent';

interface SEOProps {
  data: SEOData;
}

export default function SEO({ data }: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = data.title;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', data.description);

    // 3. Update Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', data.keywords);

    // 4. Update Schema Markup (SoftwareApplication & FAQPage)
    // Remove existing dynamic scripts if they exist
    const existingScripts = document.querySelectorAll('script[data-seo-schema]');
    existingScripts.forEach(script => script.remove());

    // Create SoftwareApplication schema
    const softwareSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": data.title,
      "description": data.description,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    // Create FAQPage schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const script1 = document.createElement('script');
    script1.type = 'application/ld+json';
    script1.setAttribute('data-seo-schema', 'software');
    script1.text = JSON.stringify(softwareSchema);
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.type = 'application/ld+json';
    script2.setAttribute('data-seo-schema', 'faq');
    script2.text = JSON.stringify(faqSchema);
    document.head.appendChild(script2);

    return () => {
      // Cleanup for good practice
      script1.remove();
      script2.remove();
    };
  }, [data]);

  return null; // This component handles side effects only
}
