
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface NoticeCardProps { post: Post; }

export const NoticeCard: React.FC<NoticeCardProps> = ({ post }) => {
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
            className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-900 hover:text-violet-600 transition-all uppercase tracking-widest"
          >
            Read Notice
            <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
          {post.pdfUrl && (
            <div className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-300 rounded-xl group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
