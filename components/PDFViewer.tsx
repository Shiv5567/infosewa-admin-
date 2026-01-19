
import React, { useState, useEffect, useRef } from 'react';

// Stable CDN for PDF.js
const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

interface PDFViewerProps {
  url: string;
  title: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, title }) => {
  const [pages, setPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const renderPDF = async () => {
      setLoading(true);
      setError(false);
      setPages([]);

      try {
        const pdfjs = await import(PDFJS_URL);
        pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;

        // Fetch with high compatibility
        const response = await fetch(url);
        if (!response.ok) throw new Error('FETCH_FAILED');
        
        const data = await response.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data });
        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        const pageIndices = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
        setPages(pageIndices);
        setLoading(false);

        // High resolution rendering (2x scale for clarity)
        for (const pageNum of pageIndices) {
          const page = await pdf.getPage(pageNum);
          const scale = window.devicePixelRatio > 1 ? 2 : 1.5;
          const viewport = page.getViewport({ scale });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.className = "w-full h-auto mb-6 bg-white shadow-md border border-slate-200 block mx-auto";

          const renderContext = {
            canvasContext: context!,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
          
          const target = document.getElementById(`pdf-page-container-${pageNum}`);
          if (target && isMounted) {
            target.innerHTML = '';
            target.appendChild(canvas);
          }
        }
      } catch (err) {
        console.error("PDF Engine Failure:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    renderPDF();
    return () => { isMounted = false; };
  }, [url]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full border border-slate-200 shadow-2xl bg-slate-50 flex flex-col transition-all duration-500 ${
        isFullscreen ? 'fixed inset-0 z-[9999] h-screen w-screen rounded-none' : 'h-[700px] md:h-[900px] rounded-[2.5rem] overflow-hidden'
      }`}
    >
      {/* Precision Header */}
      <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-6 z-50 shrink-0 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-violet-600 p-1.5 rounded-lg">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] truncate max-w-[180px] md:max-w-none">
            {title} — CRYSTAL_VIEW
          </span>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={toggleFullscreen}
             className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/5 text-[9px] font-black uppercase tracking-widest"
           >
             {isFullscreen ? (
               <>
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 Exit Full
               </>
             ) : (
               <>
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                 Fullscreen
               </>
             )}
           </button>
           <div className="hidden sm:block w-[1px] h-4 bg-white/10"></div>
           <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
           </div>
        </div>
      </div>

      {/* Viewport: CLEAN, WHITE, CLEAR */}
      <div className="flex-grow overflow-y-auto bg-slate-200 relative custom-scrollbar p-4 md:p-8">
        {loading && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-slate-50">
            <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
               <div className="absolute inset-0 bg-violet-600 animate-[loading-bar_2s_infinite]"></div>
            </div>
            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">
              Syncing Crystal Data...
            </p>
          </div>
        )}

        {error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white">
            <div className="bg-slate-100 text-slate-300 w-20 h-20 flex items-center justify-center rounded-3xl mb-8">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h4 className="text-slate-900 font-black mb-4 text-xl uppercase tracking-tight">Security Block: Connection Refused</h4>
            <p className="text-slate-500 text-[12px] mb-10 max-w-sm mx-auto leading-relaxed font-bold uppercase tracking-wider">
              The archive server (Cloudinary) has restricted direct script access. Please view using the official external bypass.
            </p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-violet-600 hover:-translate-y-1 transition-all shadow-2xl"
            >
              Access External Portal
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {pages.map(pageNum => (
              <div 
                key={pageNum} 
                id={`pdf-page-container-${pageNum}`} 
                className="min-h-[500px] flex items-center justify-center mb-6" 
              >
                {!loading && <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-300 rounded-full animate-spin"></div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear Footer */}
      <div className="h-10 bg-slate-900 border-t border-white/5 flex items-center justify-center shrink-0">
        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">
          InfoSewa Digital Records • Optimized for Precision
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #7c3aed; }
      `}</style>
    </div>
  );
};
