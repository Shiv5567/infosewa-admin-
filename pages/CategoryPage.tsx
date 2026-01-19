
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../lib/firebase';
import { Category, Post } from '../types';
import { NoticeCard } from '../components/NoticeCard';
import { SEO } from '../components/SEO';

const CategoryPage: React.FC = () => {
  const { catName } = useParams<{ catName: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const categoryMap: Record<string, Category> = {
    'government': Category.GOVERNMENT,
    'non-government': Category.NON_GOVERNMENT,
    'results': Category.RESULTS,
    'vaccine': Category.VACCINE,
    'pdfs': Category.PDFS,
    'articles': Category.ARTICLES
  };

  const currentCategory = catName ? categoryMap[catName.toLowerCase()] : null;

  useEffect(() => {
    if (!currentCategory) return;
    setLoading(true);
    
    const qSnap = query(collection(db, 'notices'), where('category', '==', currentCategory));
    const unsubscribe = onSnapshot(qSnap, 
      (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
        setPosts(fetched);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError("Missing permissions to view this category. Check Firestore Rules.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [currentCategory]);

  return (
    <div className="min-h-screen py-32 bg-slate-50/30">
      <SEO title={currentCategory || "All Notices"} />
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 border-b border-slate-100 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-extrabold text-slate-950 tracking-tight mb-4 uppercase">{currentCategory || 'All Nodes'}</h1>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">
              {loading ? 'Consulting Cloud Database...' : `Verified Entries: ${posts.length}`}
            </p>
          </div>
          <Link to="/" className="text-[11px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-700 transition-colors">
            Back to Global Feed
          </Link>
        </div>

        {error ? (
          <div className="text-center py-40 prime-card bg-red-50/50 border-red-100">
             <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Sector Access Restricted</h3>
             <p className="text-slate-500 mb-0 font-medium text-sm">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="prime-card h-80 bg-slate-100 animate-pulse border-slate-50"></div>)}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => <NoticeCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-40 prime-card border-dashed bg-white/50">
            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Sector Empty</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium">No verified entries currently cataloged under {currentCategory}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
