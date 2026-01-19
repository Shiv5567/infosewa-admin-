
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db, isConfigReady } from '../lib/firebase';
import { Post, Category } from '../types';
import { NoticeCard } from '../components/NoticeCard';
import { SEO } from '../components/SEO';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portalSettings, setPortalSettings] = useState({
    archiveTitle: 'Critical Archive',
    showArchive: true,
    latestTitle: 'Latest Node',
    showLatest: true,
    newsTitle: 'Portal News',
    showNews: true
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    if (!isConfigReady) {
      setLoading(false);
      setError("Database connection not configured.");
      return;
    }

    const unsubSettings = onSnapshot(doc(db, 'settings', 'portal'), (docSnap) => {
      if (docSnap.exists()) setPortalSettings(docSnap.data() as any);
    });

    const qSnap = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(qSnap, 
      (snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: String(data.title || ''),
            description: String(data.description || ''),
            category: data.category as Category,
            date: String(data.date || ''),
            imageUrl: data.imageUrl,
            pdfUrl: data.pdfUrl,
            author: String(data.author || 'Admin'),
            isImportant: !!data.isImportant,
            isLatest: data.isLatest !== undefined ? !!data.isLatest : true, // Default true if missing
            content: data.content
          } as Post;
        });
        setPosts(fetchedPosts);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore Error:", err);
        setError("Synchronization failed.");
        setLoading(false);
      }
    );

    return () => { unsubscribe(); unsubSettings(); };
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q)
  );

  const newsPosts = posts.filter(p => 
    p.category === Category.NEWS || p.category === Category.BLOG
  ).slice(0, 4);

  return (
    <div className="pb-32">
      <SEO />
      <section className="relative pt-36 pb-20 px-6 overflow-hidden text-center">
        <div className="container mx-auto max-w-5xl">
          <div className="inline-block animate-prime">
             <div className="flex flex-col items-center gap-5">
                <div className="flex items-center gap-4 bg-white/80 px-8 py-4 rounded-full border border-violet-200 shadow-2xl shadow-violet-300/30 backdrop-blur-xl">
                   <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.9)]"></span>
                   <span className="dynamic-text text-[16px] font-black uppercase tracking-[0.6em] cursor-default">UP2DATE</span>
                </div>
                <div className="w-px h-12 bg-gradient-to-b from-violet-500/40 to-transparent"></div>
             </div>
          </div>
        </div>
      </section>

      <section id="feed" className="container mx-auto px-6 relative z-10 max-w-7xl scroll-mt-24">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow">
            <div className="mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 pb-2">
                  {q ? `Search: "${q}"` : "Recent Posts"}
                </h2>
                <div className="h-2 w-14 bg-violet-600 rounded-full mt-4 shadow-xl shadow-violet-600/40"></div>
            </div>

            {error ? (
              <div className="text-center py-40 prime-card bg-red-50/50 border-red-200">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Cloud Restricted</h3>
                <p className="text-slate-600">{error}</p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1,2,3,4].map(i => <div key={i} className="prime-card h-80 animate-pulse bg-violet-100/30"></div>)}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {filteredPosts.map((post) => <NoticeCard key={post.id} post={post} />)}
              </div>
            ) : (
              <div className="text-center py-40 prime-card border-dashed bg-violet-50/40 border-violet-300">
                <h3 className="text-3xl font-bold text-slate-950 mb-4">Database Empty</h3>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-[380px] shrink-0 space-y-12">
               {/* News & Blog Section with Text Snippets */}
               {portalSettings.showNews && newsPosts.length > 0 && (
                 <div className="bg-white/90 backdrop-blur-2xl p-8 rounded-[3.5rem] border border-blue-100 shadow-2xl shadow-blue-300/10 animate-prime">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-blue-600">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                      {portalSettings.newsTitle}
                    </h3>
                    <div className="space-y-6">
                       {newsPosts.map((p, i) => (
                         <Link key={i} to={`/post/${p.id}`} className="block group p-6 rounded-[2rem] bg-blue-50/30 border border-blue-50 hover:bg-white hover:border-blue-200 transition-all hover:shadow-lg">
                            <h4 className="text-[15px] font-bold text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-2 tracking-tight">
                              {p.title}
                            </h4>
                            <p className="text-[12px] font-medium text-slate-500 line-clamp-2 leading-relaxed italic">
                              "{p.description}"
                            </p>
                            <span className="text-[8px] font-black text-blue-300 uppercase tracking-widest mt-4 block">Read Story →</span>
                         </Link>
                       ))}
                    </div>
                 </div>
               )}

               {/* Archive Section with Text Snippets */}
               {portalSettings.showArchive && (
                 <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-violet-200 shadow-2xl shadow-violet-300/10 animate-prime">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-4 text-violet-600">
                      <div className="w-2.5 h-2.5 bg-violet-600 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.6)]"></div>
                      {portalSettings.archiveTitle}
                    </h3>
                    <div className="space-y-8">
                       {posts.filter(p => p.isImportant).slice(0, 5).map((p, i) => (
                         <Link key={i} to={`/post/${p.id}`} className="block group p-6 rounded-[2rem] bg-violet-50/20 border border-transparent hover:border-violet-100 hover:bg-white transition-all">
                            <h4 className="text-[15px] font-bold text-slate-950 group-hover:text-violet-600 transition-all line-clamp-2 leading-tight tracking-tight mb-2">
                              {p.title}
                            </h4>
                            <p className="text-[12px] font-medium text-slate-400 line-clamp-2 leading-relaxed mb-3">
                              {p.description}
                            </p>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{p.date}</span>
                         </Link>
                       ))}
                       {posts.filter(p => p.isImportant).length === 0 && (
                         <p className="text-[11px] font-bold text-slate-300 uppercase italic">No Critical Archives Found</p>
                       )}
                    </div>
                 </div>
               )}

               {portalSettings.showLatest && (
                 <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl animate-prime">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-4 text-emerald-400">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                      {portalSettings.latestTitle}
                    </h3>
                    <div className="space-y-8">
                       {posts.filter(p => p.isLatest).slice(0, 5).map((p, i) => (
                         <Link key={i} to={`/post/${p.id}`} className="group flex gap-5 items-start">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[10px] font-black text-emerald-400 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                              0{i + 1}
                            </div>
                            <div className="space-y-1 pt-1">
                              <h4 className="text-[14px] font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">{p.title}</h4>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{p.date}</span>
                            </div>
                         </Link>
                       ))}
                       {posts.filter(p => p.isLatest).length === 0 && (
                         <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest italic">No Recent Feed Nodes</p>
                       )}
                    </div>
                 </div>
               )}
            </aside>
        </div>
      </section>
    </div>
  );
};

export default Home;
