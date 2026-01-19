
import React, { useState, useEffect, useRef } from 'react';

// Using a stable CDN for PDF.js
const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

interface PDFViewerProps {
  url: string;
  title: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, title }) => {
  const [pages, setPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const renderPDF = async () => {
      setLoading(true);
      setError(null);
      setPages([]);

      try {
        // Dynamic import of PDF.js
        const pdfjs = await import(PDFJS_URL);
        pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;

        // Fetching the PDF as a blob to handle potential CORS/Redirect issues manually
        const response = await fetch(url);
        if (!response.ok) throw new Error('CORS_RESTRICTION');
        
        const data = await response.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data });
        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        const pageIndices = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
        setPages(pageIndices);
        setLoading(false);

        // Render each page
        for (const pageNum of pageIndices) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.className = "w-full h-auto mb-4 rounded-lg shadow-sm bg-white border border-slate-200";

          const renderContext = {
            canvasContext: context!,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
          
          const target = document.getElementById(`pdf-page-${pageNum}`);
          if (target) {
            target.innerHTML = '';
            target.appendChild(canvas);
          }
        }
      } catch (err: any) {
        console.error("PDF.js Error:", err);
        if (isMounted) {
          setError(err.message === 'CORS_RESTRICTION' 
            ? "Cloud security prevented direct stream. Use external viewer." 
            : "Failed to initialize document engine.");
          setLoading(false);
        }
      }
    };

    renderPDF();
    return () => { isMounted = false; };
  }, [url]);

  return (
    <div 
      className="relative w-full h-[600px] md:h-[800px] border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 flex flex-col"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="h-14 bg-slate-950/95 backdrop-blur-xl text-white flex items-center justify-between px-6 z-40 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-violet-500/20 text-violet-400 p-1.5 rounded-lg shrink-0">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 truncate max-w-[200px]">
            {title} — SECURE_STREAM
          </span>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Encrypted</span>
           </div>
           <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
           </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-slate-100 relative scroll-smooth custom-scrollbar">
        {loading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-violet-500/20 rounded-2xl"></div>
              <div className="absolute top-0 w-16 h-1 bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.8)] animate-[bounce_2s_infinite]"></div>
            </div>
            <p className="mt-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">
              Deep Scanning Document...
            </p>
          </div>
        )}

        {error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 animate-prime">
            <div className="bg-white/10 text-slate-400 w-16 h-16 flex items-center justify-center rounded-2xl mb-6">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Cloud Access Restricted</h4>
            <p className="text-slate-400 text-[10px] mb-8 max-w-xs mx-auto leading-relaxed font-bold uppercase tracking-widest">
              Direct streaming is blocked by browser security. Access via isolated archive portal.
            </p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-violet-600 text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all shadow-xl"
            >
              Open Secure Archive
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {pages.map(pageNum => (
              <div key={pageNum} id={`pdf-page-${pageNum}`} className="min-h-[400px] flex items-center justify-center bg-slate-200/50 rounded-lg animate-pulse" />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-12 bg-slate-950/95 border-t border-white/5 flex items-center justify-center px-6 shrink-0 z-40">
        <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em]">
          Official Archive Portal • Secured Display Node
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
};
