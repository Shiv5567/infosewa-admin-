
import React, { useEffect } from 'react';
import { APP_SEO } from '../constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    // Robust sanitization: Ensure values are primitives before use
    const safeTitle = typeof title === 'string' ? title : (title ? String(title) : '');
    const safeDescription = typeof description === 'string' ? description : (description ? String(description) : APP_SEO.defaultDescription);
    const safeKeywords = typeof keywords === 'string' ? keywords : (keywords ? String(keywords) : APP_SEO.defaultKeywords);

    document.title = safeTitle ? `${safeTitle} | InfoSewa` : APP_SEO.defaultTitle;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', safeDescription);
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.setAttribute('content', safeKeywords);

    // Update JSON-LD safely
    const script = document.getElementById('json-ld');
    if (script) {
      const baseUrl = window.location.href.split('#')[0];
      
      const jsonLD = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "InfoSewa",
        "url": window.location.href.toString(),
        "description": safeDescription.slice(0, 300),
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}#/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
      
      try {
        script.innerHTML = JSON.stringify(jsonLD);
      } catch (e) {
        console.warn("SEO: JSON-LD serialization failed, falling back to safe defaults.", e);
        script.innerHTML = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "InfoSewa",
          "url": baseUrl
        });
      }
    }
  }, [title, description, keywords]);

  return null;
};
