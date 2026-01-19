
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../lib/firebase';
import { Post } from '../types';
import { PDFViewer } from '../components/PDFViewer';
import { SEO } from '../components/SEO';

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
          // CRITICAL: Explicitly cast every field to a primitive string.
          // Firestore data can contain complex objects (Timestamps, Refs) that cause circular JSON errors.
          setPost({
            id: String(docSnap.id),
            title: String(data.title || ''),
            description: String(data.description || ''),
            category: String(data.category || 'General'),
            date: String(data.date || ''),
            imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
            pdfUrl: typeof data.pdfUrl === 'string' ? data.pdfUrl : undefined,
            author: String(data.author || 'Admin'),
            isImportant: !!data.isImportant,
            isLatest: data.isLatest !== undefined ? !!data.isLatest : true,
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
      <div className="min-h-screen pt-32 pb-32 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-32 pb-32 px-6">
        <div className="container mx-auto max-w-2xl text-center prime-card py-16 bg-red-50/30 border-red-100">
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
      
      <div className="relative h-[35vh] md:h-[50vh] w-full overflow-hidden">
        <img 
          src={post.imageUrl || 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=1200'} 
          className="w-full h-full object-cover"
          alt={post.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
        <div className="absolute bottom-0 w-full p-6 md:p-16">
          <div className="container mx-auto max-w-5xl">
            <div className="flex gap-3 mb-6">
              <span className="bg-violet-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                {post.category}
              </span>
              {post.isImportant && (
                <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                  Urgent Broadcast
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-4xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 -mt-16 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-16">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 pb-12 border-b border-slate-50">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Publish Date</p>
              <p className="text-base font-bold text-slate-900">{post.date}</p>
            </div>
            <Link to="/" className="text-[11px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-700 transition-colors">
              Home
            </Link>
          </div>

          <div className="prose prose-slate prose-lg max-w-none mb-16">
             <p className="text-xl font-medium text-slate-600 leading-relaxed mb-10">
               {post.description}
             </p>
             {post.content && (
               <div className="text-slate-800 leading-loose text-lg whitespace-pre-wrap font-medium">
                 {post.content}
               </div>
             )}
          </div>

          {post.pdfUrl && (
            <div className="mt-8">
               <PDFViewer url={post.pdfUrl} title={post.title} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
