
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../lib/firebase';
import { Post } from '../types';
import { PDFViewer } from '../components/PDFViewer';
import { SEO } from '../components/SEO';

// Fix: Implement the full PostDetail component logic and export it as default
const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'notices', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPost({
            id: docSnap.id,
            title: String(data.title || ''),
            description: String(data.description || ''),
            category: data.category,
            date: String(data.date || ''),
            imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
            pdfUrl: typeof data.pdfUrl === 'string' ? data.pdfUrl : undefined,
            author: String(data.author || 'Admin'),
            isImportant: !!data.isImportant,
            content: typeof data.content === 'string' ? data.content : undefined
          } as Post);
        } else {
          setError("Notice not found in archive.");
        }
      } catch (err) {
        console.error("Firestore Error:", err);
        setError("Could not retrieve document from cloud node.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-44 pb-32 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-44 pb-32 px-6">
        <div className="container mx-auto max-w-2xl text-center prime-card py-20 bg-red-50/30 border-red-100">
          <div className="bg-red-100 text-red-600 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{error || "404 Not Found"}</h2>
          <Link to="/" className="inline-block mt-8 text-violet-600 font-black uppercase tracking-widest text-xs">Return to Feed</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <SEO title={post.title} description={post.description} />
      
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <img 
          src={post.imageUrl || 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=1200'} 
          className="w-full h-full object-cover"
          alt={post.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
        <div className="absolute bottom-0 w-full p-6 md:p-20">
          <div className="container mx-auto max-w-5xl">
            <div className="flex gap-4 mb-8">
              <span className="bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full">
                {post.category}
              </span>
              {post.isImportant && (
                <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full">
                  Urgent Broadcast
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-4xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-20">
          <div className="flex flex-wrap items-center justify-between gap-8 mb-16 pb-16 border-b border-slate-50">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">
                 {post.author.slice(0, 1).toUpperCase()}
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Published By</p>
                  <p className="text-lg font-bold text-slate-900">{post.author}</p>
               </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Publish Date</p>
              <p className="text-lg font-bold text-slate-900">{post.date}</p>
            </div>
          </div>

          <div className="prose prose-slate prose-xl max-w-none mb-20">
             <p className="text-2xl font-medium text-slate-600 leading-relaxed mb-12">
               {post.description}
             </p>
             {post.content && (
               <div className="text-slate-800 leading-loose text-lg whitespace-pre-wrap font-medium">
                 {post.content}
               </div>
             )}
          </div>

          {post.pdfUrl && (
            <div className="space-y-12">
               <div className="flex items-center gap-6">
                  <div className="h-0.5 flex-grow bg-slate-50"></div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">Document Archive</h3>
                  <div className="h-0.5 flex-grow bg-slate-50"></div>
               </div>
               <PDFViewer url={post.pdfUrl} title={post.title} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
