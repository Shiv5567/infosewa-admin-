
import React, { useEffect } from 'react';
import { APP_SEO } from '../constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    document.title = title ? `${title} | InfoSewa` : APP_SEO.defaultTitle;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description || APP_SEO.defaultDescription);
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.setAttribute('content', keywords || APP_SEO.defaultKeywords);

    // Update JSON-LD
    const script = document.getElementById('json-ld');
    if (script) {
      const jsonLD = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "InfoSewa",
        "url": window.location.href,
        "description": description || APP_SEO.defaultDescription,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${window.location.origin}/#/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
      script.innerHTML = JSON.stringify(jsonLD);
    }
  }, [title, description, keywords]);

  return null;
};
