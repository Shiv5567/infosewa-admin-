
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db, isConfigReady } from '../lib/firebase';
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
      if (!isConfigReady) {
        setError("Firebase project not configured.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'notices', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
          setError("Document not found in archive.");
        }
      } catch (err) {
        console.error(err);
        setError("Security rejection or connection timeout.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/30">
      <div className="flex flex-col items-center gap-6">
        <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] animate-pulse">Decrypting Archive...</p>
      </div>
    </div>
  );

  if (error || !post) {
    return (
      <div className="container mx-auto px-6 py-48 text-center animate-prime">
        <div className="bg-slate-100 text-slate-400 w-20 h-20 flex items-center justify-center rounded-[2rem] mx-auto mb-10">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h1 className="text-5xl font-extrabold text-slate-950 mb-6 tracking-tight">Entry Not Found</h1>
        <p className="text-slate-500 mb-10 font-medium">{error || "The requested notice could not be retrieved from the cloud node."}</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-slate-950 text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
          Return to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-44 pb-32 bg-slate-50/30">
      <SEO title={post.title} description={post.description} />
      
      <div className="container mx-auto px-6 max-w-5xl">
        <article className="animate-prime">
          <div className="mb-12">
            <nav className="flex items-center gap-3 mb-10 text-[10px] font-black uppercase tracking-widest text-slate-400" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-violet-600 transition">Portal</Link>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="text-violet-600">Notice Archive</span>
            </nav>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="bg-violet-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg shadow-violet-600/20">
                {post.category}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
              <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">PUBLISHED BY {post.author}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-950 leading-[1.1] tracking-tight mb-8">
              {post.title}
            </h1>
            
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 border-l-4 border-violet-100 pl-8">
              {post.description}
            </p>

            {post.imageUrl && (
              <div className="rounded-[3rem] overflow-hidden mb-12 shadow-2xl border border-slate-100">
                <img src={post.imageUrl} alt="" className="w-full h-auto object-cover" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="space-y-16">
            {post.content && (
              <div className="prose prose-slate prose-lg max-w-none font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            )}

            {post.pdfUrl && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Verified Document Stream
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure View Mode</span>
                  </div>
                </div>
                <PDFViewer url={post.pdfUrl} title={post.title} />
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
