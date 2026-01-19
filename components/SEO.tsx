
import React, { useEffect } from 'react';
import { APP_SEO } from '../constants';

interface SEOProps {
  title?: any;
  description?: any;
  keywords?: any;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    // Robust sanitization: Force primitive strings to prevent circular JSON errors
    const getSafeString = (val: any, fallback: string): string => {
      if (typeof val === 'string') return val;
      if (val === null || val === undefined) return fallback;
      try {
        // Explicitly check for React elements or complex objects that String() might not catch cleanly
        const str = String(val);
        return (str === '[object Object]' || str === '[object FiberNode]') ? fallback : str;
      } catch (e) {
        return fallback;
      }
    };

    const safeTitle = getSafeString(title, '');
    const safeDescription = getSafeString(description, APP_SEO.defaultDescription);
    const safeKeywords = getSafeString(keywords, APP_SEO.defaultKeywords);

    // Update Document Meta
    document.title = safeTitle ? `${safeTitle} | InfoSewa` : APP_SEO.defaultTitle;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', safeDescription);
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.setAttribute('content', safeKeywords);

    // Update JSON-LD safely
    const script = document.getElementById('json-ld') as HTMLScriptElement | null;
    if (script) {
      try {
        const currentHref = String(window.location.href);
        const baseUrl = currentHref.split('#')[0];
        
        // Construct a clean object with ONLY primitive strings
        const jsonLD = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "InfoSewa",
          "url": currentHref,
          "description": safeDescription.slice(0, 300),
          "potentialAction": {
            "@type": "SearchAction",
            "target": baseUrl + "#/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
        
        script.innerHTML = JSON.stringify(jsonLD);
      } catch (e) {
        console.warn("SEO: JSON-LD serialization failed. Circular structure detected in environment. Fallback applied.");
        // Static fallback that is 100% safe and non-circular
        script.innerHTML = '{"@context":"https://schema.org","@type":"WebSite","name":"InfoSewa"}';
      }
    }
  }, [title, description, keywords]);

  return null;
};
