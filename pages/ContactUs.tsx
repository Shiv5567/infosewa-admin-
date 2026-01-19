
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../lib/firebase';
import { SEO } from '../components/SEO';

const ContactUs: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    email: 'support@infosewa.com.np',
    responseTime: 'Standard Response Time: 4-6 Hours',
    location: 'Baneshwor, Kathmandu, Nepal',
    officeHours: 'Monday - Friday: 9 AM - 5 PM'
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'contact'), (s) => {
      if (s.exists()) setInfo(s.data() as any);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  if (loading) return <div className="min-h-screen pt-36 flex items-center justify-center"><div className="w-12 h-12 border-4 border-slate-100 border-t-violet-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen pt-36 pb-32">
      <SEO title="Contact Support" description="Get in touch with the InfoSewa team." />
      <div className="container mx-auto max-w-5xl px-6">
        <div className="bg-white/80 backdrop-blur-2xl p-10 md:p-20 rounded-[3.5rem] border border-violet-100 shadow-2xl animate-prime">
          <div className="mb-16 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tighter mb-4">Contact Our Hub</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Available for verification & support</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div className="group flex items-start gap-6 p-8 bg-violet-50 rounded-[2rem] border border-violet-100 transition-all hover:shadow-xl hover:shadow-violet-200/20">
                <div className="w-14 h-14 bg-white text-violet-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="font-black text-slate-950 uppercase text-[11px] tracking-widest mb-1">Email Terminal</h3>
                  <p className="text-slate-600 font-bold text-lg">{info.email}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">{info.responseTime}</p>
                </div>
              </div>

              <div className="group flex items-start gap-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/20">
                <div className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-black text-slate-950 uppercase text-[11px] tracking-widest mb-1">Central HQ</h3>
                  <p className="text-slate-600 font-bold text-lg">{info.location}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">{info.officeHours}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              {submitted ? (
                <div className="h-full bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center animate-prime">
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-200">
                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Message Received</h3>
                  <p className="text-slate-600 font-medium">Your inquiry has been queued for processing.</p>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="Your Name" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:ring-4 ring-violet-50 transition-all placeholder:text-slate-300" />
                    <input required type="email" placeholder="Email Node" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:ring-4 ring-violet-50 transition-all placeholder:text-slate-300" />
                  </div>
                  <input required type="text" placeholder="Subject of Inquiry" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:ring-4 ring-violet-50 transition-all placeholder:text-slate-300" />
                  <textarea required rows={6} placeholder="Describe your request..." className="w-full px-6 py-6 bg-slate-50 border-none rounded-3xl outline-none font-bold text-sm focus:ring-4 ring-violet-50 transition-all placeholder:text-slate-300 resize-none"></textarea>
                  <button className="w-full bg-slate-950 text-white py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-violet-600 transition-all shadow-xl active:scale-95">
                    Transmit Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
