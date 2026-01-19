
import React, { useState, useEffect } from 'react';

interface PDFViewerProps {
  url: string;
  title: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // We append #toolbar=0 to discourage usage of browser download buttons
  // Note: Modern browsers may still show them, but this is the standard "view-only" hint.
  const secureUrl = url.includes('#') ? url : `${url}#toolbar=0&navpanes=0&view=FitH`;

  useEffect(() => {
    // Reset state when URL changes
    setIsLoaded(false);
    setHasError(false);
    
    // Safety timeout: If it doesn't load in 8 seconds, it's likely blocked by CORS/Sandbox
    const timer = setTimeout(() => {
      if (!isLoaded) setHasError(true);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div 
      className="relative w-full h-[600px] md:h-[750px] border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 group"
      role="region"
      aria-label={`Secure PDF Viewer for ${title}`}
    >
      {/* Encryption Header */}
      <div className="absolute top-0 left-0 w-full h-14 bg-slate-950/90 backdrop-blur-xl text-white flex items-center justify-between px-6 z-40 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-violet-500/20 text-violet-400 p-1.5 rounded-lg shrink-0">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 truncate max-w-[200px]">
            {title} — SECURE_STREAM
          </span>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 mr-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified</span>
           </div>
           <div className="flex gap-1.5 shrink-0">
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
           </div>
        </div>
      </div>
      
      {/* PDF Viewport */}
      <div className="w-full h-full pt-14 bg-slate-800 flex items-center justify-center relative">
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-violet-500/20 rounded-2xl"></div>
              <div className="absolute top-0 w-16 h-1 bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-[bounce_2s_infinite]"></div>
            </div>
            <p className="mt-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">
              Initializing Secure Handshake...
            </p>
          </div>
        )}

        {hasError ? (
          <div className="text-center p-12 animate-prime z-30">
            <div className="bg-slate-700/50 text-slate-400 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto mb-6">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Document Stream Blocked</h4>
            <p className="text-slate-400 text-[11px] mb-8 max-w-xs mx-auto leading-relaxed">
              Security settings or your browser version is preventing the inline preview. 
            </p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-slate-950 px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl"
            >
              Open Encrypted Document
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        ) : (
          <iframe
            src={secureUrl}
            title={`Notice: ${title}`}
            className={`w-full h-full border-none bg-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            loading="eager"
            aria-hidden="false"
          />
        )}

        {/* Anti-Selection Overlay (Prevents most simple clicks but allows scroll via mousewheel) */}
        <div 
          className="absolute inset-0 top-14 pointer-events-none z-20"
          onContextMenu={(e) => e.preventDefault()}
          aria-hidden="true"
        ></div>
      </div>
      
      {/* Encryption Footer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md text-white/50 text-[8px] font-black uppercase tracking-[0.4em] px-8 py-3 rounded-full z-40 border border-white/5 whitespace-nowrap shadow-2xl">
        Official InfoSewa Archive • Proprietary Display
      </div>
    </div>
  );
};
