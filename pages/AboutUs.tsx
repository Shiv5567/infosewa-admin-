
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../lib/firebase';
import { SEO } from '../components/SEO';

const AboutUs: React.FC = () => {
  const [content, setContent] = useState({
    title: 'About InfoSewa',
    heroText: "InfoSewa is Nepal's most reliable digital platform for aggregated public notices, examination results, and verified government updates.",
    missionText: "Our mission is to democratize access to critical information in Nepal. Historically, official notices were scattered across physical bulletin boards and local newspapers. InfoSewa centralizes these updates into a verified, searchable, and lightning-fast digital archive accessible to every citizen.",
    box1Title: "Verified Source",
    box1Text: "We only aggregate data from official government gazettes, university boards, and authorized agencies.",
    box2Title: "Fast Retrieval",
    box2Text: "Optimized for low-bandwidth mobile connections, ensuring you get results instantly even in remote areas.",
    footerText: "From Loksewa PSC results to University exam routines and Myadi Police recruitments, InfoSewa serves as the digital heartbeat of public announcements in Nepal."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'about'), (s) => {
      if (s.exists()) setContent(s.data() as any);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <div className="min-h-screen pt-36 flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen pt-36 pb-32">
      <SEO title={content.title} description={content.heroText.slice(0, 150)} />
      <div className="container mx-auto max-w-4xl px-6">
        <div className="bg-white/80 backdrop-blur-2xl p-12 md:p-20 rounded-[3.5rem] border border-violet-100 shadow-2xl animate-prime">
          <div className="flex items-center gap-6 mb-12">
            <div className="bg-violet-600 text-white w-16 h-16 flex items-center justify-center rounded-[2rem] font-black text-2xl shadow-xl shadow-violet-600/30">IS</div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tighter">{content.title}</h1>
          </div>
          
          <div className="prose prose-slate prose-lg max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
            <p className="text-xl text-slate-900 font-bold leading-snug">{content.heroText}</p>
            
            <p>{content.missionText}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
              <div className="p-8 bg-violet-50 rounded-3xl border border-violet-100">
                <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center mb-6">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-violet-600 font-black uppercase text-[10px] tracking-widest mb-4">{content.box1Title}</h3>
                <p className="text-sm">{content.box1Text}</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-slate-950 font-black uppercase text-[10px] tracking-widest mb-4">{content.box2Title}</h3>
                <p className="text-sm">{content.box2Text}</p>
              </div>
            </div>

            <p>{content.footerText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
