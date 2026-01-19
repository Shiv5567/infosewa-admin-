
import React, { useState } from 'react';

interface PDFViewerProps {
  url: string;
  title: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // We add #toolbar=0 to standard URL to hide download/print buttons in browsers that support it.
  const secureUrl = url.includes('#') ? url : `${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <div 
      className="relative w-full h-[600px] md:h-[850px] border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900"
      role="region"
      aria-label={`Notice Document: ${title}`}
    >
      {/* Security Status Header */}
      <div className="absolute top-0 left-0 w-full h-14 bg-slate-950/90 backdrop-blur-xl text-white flex items-center justify-between px-6 z-40 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-violet-500/20 text-violet-400 p-1.5 rounded-lg shrink-0">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 truncate max-w-[200px]">
            {title} — SECURE_VIEW
          </span>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active Sync</span>
           </div>
           {/* Fallback open button only shown if visualization fails in restricted environments */}
           <a 
             href={url} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-[9px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
           >
             Open Full 
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
           </a>
        </div>
      </div>
      
      {/* Document Viewport */}
      <div className="w-full h-full pt-14 bg-slate-100 flex items-center justify-center relative">
        {!isLoaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-violet-500/20 rounded-2xl"></div>
              <div className="absolute top-0 w-16 h-1 bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-[bounce_2s_infinite]"></div>
            </div>
            <p className="mt-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse text-center px-6">
              Preparing Secure Document Stream...
            </p>
          </div>
        )}

        {/* Using a dual-strategy for maximum compatibility */}
        <object
          data={secureUrl}
          type="application/pdf"
          className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        >
          <iframe
            src={secureUrl}
            title={title}
            className="w-full h-full border-none"
            onLoad={() => setIsLoaded(true)}
          >
             <p className="text-center p-20 text-slate-500">Your browser does not support PDF embedding.</p>
          </iframe>
        </object>

        {/* Subtle status indicators instead of a full error screen */}
        <div className="absolute bottom-16 right-6 z-50">
           {!isLoaded && (
              <div className="bg-slate-950/90 text-white p-4 rounded-2xl border border-white/5 shadow-2xl max-w-[200px] animate-prime">
                 <p className="text-[9px] font-bold text-slate-400 mb-2 uppercase">Loading taking too long?</p>
                 <a href={url} target="_blank" className="text-[10px] font-black text-violet-400 hover:text-violet-300 uppercase tracking-widest flex items-center gap-2">
                    Try External View
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={3} /></svg>
                 </a>
              </div>
           )}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md text-white/50 text-[8px] font-black uppercase tracking-[0.4em] px-8 py-3 rounded-full z-40 border border-white/5 shadow-2xl pointer-events-none">
        INFOSEWA DIGITAL ARCHIVE • VERIFIED SOURCE
      </div>
    </div>
  );
};
