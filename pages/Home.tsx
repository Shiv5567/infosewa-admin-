
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db, isConfigReady } from '../lib/firebase';
import { Post } from '../types';
import { NoticeCard } from '../components/NoticeCard';
import { SEO } from '../components/SEO';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    if (!isConfigReady) {
      setLoading(false);
      setError("Database connection not configured.");
      return;
    }

    const qSnap = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(qSnap, 
      (snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(fetchedPosts);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore Error:", err);
        if (err.code === 'permission-denied') {
          setError("Access Restricted: Please update your Firestore Security Rules to allow public reads.");
        } else {
          setError("Cloud synchronization failed. Please check your internet connection.");
        }
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  return (
    <div className="pb-32">
      <SEO />
      
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-violet-50 text-violet-600 border border-violet-100 mb-12 animate-prime">
             <span className={`w-2 h-2 ${loading ? 'bg-amber-400' : error ? 'bg-red-500' : 'bg-emerald-500'} rounded-full animate-pulse`}></span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">
               {loading ? 'Syncing Node...' : error ? 'Security Check Required' : 'Live Archive Active'}
             </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold text-slate-950 leading-[1.05] tracking-tight mb-10 animate-prime">
            Verified Notices.<br />
            <span className="text-violet-600">Pure Information.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-16 animate-prime">
            Nepal's centralized digital vault for government notices, Loksewa results, and academic schedules. Built for the modern candidate.
          </p>
          <div className="flex flex-wrap justify-center gap-5 animate-prime">
            <Link to="/category/results" className="bg-violet-600 text-white px-10 py-5 rounded-full font-bold text-sm shadow-2xl shadow-violet-600/30 hover:bg-violet-700 transition-all uppercase tracking-widest">
              Check Results
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {q ? `Results for: "${q}"` : "Latest Feed"}
                </h2>
                <div className="h-1.5 w-12 bg-violet-600 rounded-full mt-4"></div>
              </div>
            </div>

            {error ? (
              <div className="text-center py-40 prime-card bg-red-50/30 border-red-100 animate-prime">
                <div className="bg-red-100 text-red-600 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Security Restriction</h3>
                <p className="text-slate-500 max-w-md mx-auto text-sm font-medium mb-10">{error}</p>
                <div className="bg-white p-6 rounded-2xl border border-red-100 inline-block text-left shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Solution:</p>
                  <p className="text-[11px] font-medium text-slate-600 mb-4">You need to allow public read access in your Firebase Console.</p>
                  <code className="text-[11px] font-mono text-red-500 bg-red-50 px-3 py-2 rounded-lg block">
                    allow read: if true;
                  </code>
                </div>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1,2,3,4].map(i => <div key={i} className="prime-card h-96 animate-pulse bg-slate-50 border-slate-100"></div>)}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <NoticeCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-40 prime-card border-dashed bg-white/50 animate-prime">
                <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Archive Empty</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium mb-10">No verified entries found in the cloud node for this search query.</p>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-[380px] shrink-0 space-y-12">
             <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-prime">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10 flex items-center gap-3">
                  <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                  Global Priority
                </h3>
                <div className="space-y-10">
                   {posts.filter(p => p.isImportant).slice(0, 5).map((p, i) => (
                     <Link key={i} to={`/post/${p.id}`} className="group block">
                        <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 leading-tight tracking-tight">{p.title}</h4>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 block">{p.date}</span>
                     </Link>
                   ))}
                </div>
             </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Home;
