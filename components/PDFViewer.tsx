
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

        const response = await fetch(url);
        if (!response.ok) throw new Error('FETCH_FAILED');
        
        const data = await response.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data });
        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        const pageIndices = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
        setPages(pageIndices);
        setLoading(false);

        for (const pageNum of pageIndices) {
          const page = await pdf.getPage(pageNum);
          const scale = 2.0; // High quality fixed scale
          const viewport = page.getViewport({ scale });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // Updated canvas styles to be perfectly centered and responsive
          canvas.className = "max-w-full h-auto mb-10 bg-white shadow-2xl block mx-auto rounded-sm";

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
      className={`relative w-full bg-slate-900 flex flex-col transition-all duration-500 ${
        isFullscreen ? 'fixed inset-0 z-[9999] h-screen w-screen rounded-none' : 'h-[800px] md:h-[1000px] rounded-[2rem] overflow-hidden shadow-2xl'
      }`}
    >
      {/* Minimalist Header - Only Controls */}
      <div className="h-16 bg-black/40 backdrop-blur-md text-white flex items-center justify-between px-8 z-50 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-violet-600 p-2 rounded-xl shadow-lg shadow-violet-600/20">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>
          </div>
          {/* Text removed as requested */}
        </div>
        
        <div className="flex items-center gap-6">
           <button 
             onClick={toggleFullscreen}
             className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 hover:bg-violet-600 transition-all border border-white/10 text-[10px] font-black uppercase tracking-widest"
           >
             {isFullscreen ? (
               <>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 Exit
               </>
             ) : (
               <>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                 Full Screen
               </>
             )}
           </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-grow overflow-y-auto bg-slate-950 relative custom-scrollbar p-4 md:p-12">
        {loading && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-slate-950">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
               <div className="absolute inset-0 bg-violet-600 animate-[loading-bar_2s_infinite]"></div>
            </div>
            <p className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">
              Initializing Secure Stream
            </p>
          </div>
        )}

        {error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900 text-white">
            <h4 className="font-black mb-6 text-2xl uppercase tracking-tighter">Access Denied</h4>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-violet-600 px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl"
            >
              Open in External Node
            </a>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            {pages.map(pageNum => (
              <div 
                key={pageNum} 
                id={`pdf-page-container-${pageNum}`} 
                className="w-full flex items-center justify-center min-h-[400px]" 
              >
                {!loading && <div className="w-8 h-8 border-4 border-white/5 border-t-violet-500 rounded-full animate-spin"></div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Minimalist Footer - Text removed */}
      <div className="h-2 bg-violet-600 shrink-0"></div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 0; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #7c3aed; }
      `}</style>
    </div>
  );
};
