
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../lib/firebase';
import { Category, Post } from '../types';
import { NoticeCard } from '../components/NoticeCard';
import { SEO } from '../components/SEO';

const CategoryPage: React.FC = () => {
  const { catName } = useParams<{ catName: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const categoryMap: Record<string, Category> = {
    'government': Category.GOVERNMENT,
    'non-government': Category.NON_GOVERNMENT,
    'results': Category.RESULTS,
    'vaccine': Category.VACCINE,
    'pdfs': Category.PDFS,
    'articles': Category.ARTICLES,
    'news': Category.NEWS,
    'blog': Category.BLOG,
    'notes': Category.NOTES,
    'vacancy': Category.VACANCY
  };

  const currentCategory = catName ? categoryMap[catName.toLowerCase()] : null;

  useEffect(() => {
    // Fetch Global Recent Posts for Sidebar
    const recentQuery = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(5));
    const unsubRecent = onSnapshot(recentQuery, (snapshot) => {
      const fetched = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: String(data.title || ''),
          description: String(data.description || ''),
          category: data.category as Category,
          date: String(data.date || ''),
          imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
          pdfUrl: typeof data.pdfUrl === 'string' ? data.pdfUrl : undefined,
          author: String(data.author || 'Admin'),
          isImportant: !!data.isImportant
        } as Post;
      });
      setRecentPosts(fetched);
    });

    return () => unsubRecent();
  }, []);

  useEffect(() => {
    if (!currentCategory) return;
    setLoading(true);
    
    const qSnap = query(collection(db, 'notices'), where('category', '==', currentCategory), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(qSnap, 
      (snapshot) => {
        const fetched = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: String(data.title || ''),
            description: String(data.description || ''),
            category: data.category as Category,
            date: String(data.date || ''),
            imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
            pdfUrl: typeof data.pdfUrl === 'string' ? data.pdfUrl : undefined,
            author: String(data.author || 'Admin'),
            isImportant: !!data.isImportant,
            content: typeof data.content === 'string' ? data.content : undefined
          } as Post;
        });
        setPosts(fetched);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore Category Query Error:", err);
        if (err.message && err.message.toLowerCase().includes("index")) {
          setError("Database index required. A composite index is currently being built or missing. Please refer to FirebaseRules.md for the setup link.");
        } else {
          setError("Missing permissions to view this category. Check Firestore Rules.");
        }
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
            Home
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow">
            {error ? (
              <div className="text-center py-40 prime-card bg-red-50/50 border-red-100">
                 <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Sector Access Restricted</h3>
                 <p className="text-slate-500 mb-0 font-medium text-sm px-10">{error}</p>
                 {error.includes("index") && (
                   <a 
                     href="https://console.firebase.google.com/v1/r/project/infosewa-44646/firestore/indexes" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-block mt-8 bg-violet-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 transition-all"
                   >
                     Create Index in Console
                   </a>
                 )}
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1,2,3,4].map(i => <div key={i} className="prime-card h-80 bg-slate-100 animate-pulse border-slate-50"></div>)}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map(post => <NoticeCard key={post.id} post={post} />)}
              </div>
            ) : (
              <div className="text-center py-40 prime-card border-dashed bg-white/50">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Sector Empty</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium">No verified entries currently cataloged under {currentCategory}.</p>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-[380px] shrink-0 space-y-12">
             <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-prime sticky top-32">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10 flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Recent Global Archives
                </h3>
                <div className="space-y-8">
                   {recentPosts.map((p, i) => (
                     <Link key={i} to={`/post/${p.id}`} className="group flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-300 shrink-0 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                          0{i + 1}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 leading-snug tracking-tight">{p.title}</h4>
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{p.date}</span>
                        </div>
                     </Link>
                   ))}
                </div>
                <Link to="/" className="mt-12 block text-center text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-violet-600 transition-colors">
                   View All Entries
                </Link>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
