
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface NoticeCardProps { post: Post; }

export const NoticeCard: React.FC<NoticeCardProps> = ({ post }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use HashRouter friendly URL - ensuring we get the clean base without existing hashes
    const baseUrl = window.location.href.split('#')[0];
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const shareUrl = `${cleanBaseUrl}/#/post/${post.id}`;
    
    const shareData = {
      title: post.title,
      text: post.description.slice(0, 100) + '...',
      url: shareUrl,
    };

    // Check if browser supports sharing and specifically if it can share THIS data
    if (navigator.share && typeof navigator.canShare === 'function' && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // If user cancelled, don't show error, but if it failed for other reasons, try fallback
        if ((err as Error).name !== 'AbortError') {
          console.debug('Native share failed, using clipboard fallback');
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // Fallback for desktop or non-supported mobile browsers
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Old school fallback
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Sharing failed entirely:', err);
    }
  };

  return (
    <div className="group prime-card flex flex-col h-full bg-white overflow-hidden animate-prime">
      <div className="relative h-60 shrink-0 overflow-hidden m-2 rounded-[1.5rem]">
        <img 
          src={post.imageUrl || 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800'} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {post.isImportant && (
            <span className="bg-violet-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full shadow-lg shadow-violet-600/30">
              URGENT
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full">
            {post.category.split(' ')[0]}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
          <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
          <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest truncate">{post.author}</span>
        </div>
        
        <Link to={`/post/${post.id}`} className="block mb-4">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-600 transition-colors leading-[1.4] tracking-tight line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-slate-500 text-[14px] leading-relaxed line-clamp-3 mb-8 flex-grow font-medium">
          {post.description}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
          <Link 
            to={`/post/${post.id}`} 
            className="inline-flex items-center gap-2.5 text-[11px] font-bold text-slate-900 hover:text-violet-600 transition-all uppercase tracking-widest group/btn"
          >
            <svg 
              className="w-4 h-4 text-slate-400 group-hover/btn:text-violet-600 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </Link>
          
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handleShare}
              title="Share content"
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all shadow-sm relative group/share ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 hover:bg-violet-600 hover:text-white'}`}
            >
              {copied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded font-black tracking-widest whitespace-nowrap">COPIED</span>
              )}
            </button>
            {post.pdfUrl && (
              <div className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-300 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
