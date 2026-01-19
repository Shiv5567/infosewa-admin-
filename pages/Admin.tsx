
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { collection, addDoc, serverTimestamp, doc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { auth, db } from '../lib/firebase';
import { Category } from '../types';
import { SEO } from '../components/SEO';

const CLOUDINARY_CLOUD_NAME = 'djtrcbxjs'; 
const CLOUDINARY_UPLOAD_PRESET = 'demo.shiv'; 

const Admin: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'notices' | 'about' | 'contact' | 'settings'>('notices');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Forms State
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: Category.GENERAL as string,
    description: '',
    content: '',
    isImportant: false,
    isLatest: true
  });

  const [portalSettings, setPortalSettings] = useState({
    archiveTitle: 'Critical Archive',
    showArchive: true,
    latestTitle: 'Latest Node',
    showLatest: true,
    newsTitle: 'Portal News',
    showNews: true
  });

  const [aboutSettings, setAboutSettings] = useState({
    title: 'About InfoSewa',
    heroText: "InfoSewa is Nepal's most reliable digital platform...",
    missionText: "Our mission is to democratize access to critical information...",
    box1Title: "Verified Source",
    box1Text: "We only aggregate data from official sources...",
    box2Title: "Fast Retrieval",
    box2Text: "Optimized for low-bandwidth mobile connections...",
    footerText: "The digital heartbeat of public announcements in Nepal."
  });

  const [contactSettings, setContactSettings] = useState({
    email: 'support@infosewa.com.np',
    responseTime: 'Standard Response Time: 4-6 Hours',
    location: 'Baneshwor, Kathmandu, Nepal',
    officeHours: 'Monday - Friday: 9 AM - 5 PM'
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    
    // Listen for live updates
    const unsubPortal = onSnapshot(doc(db, 'settings', 'portal'), (s) => s.exists() && setPortalSettings(s.data() as any));
    const unsubAbout = onSnapshot(doc(db, 'settings', 'about'), (s) => s.exists() && setAboutSettings(s.data() as any));
    const unsubContact = onSnapshot(doc(db, 'settings', 'contact'), (s) => s.exists() && setContactSettings(s.data() as any));

    return () => { unsub(); unsubPortal(); unsubAbout(); unsubContact(); };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (err: any) { alert(`AUTH_FAILURE: ${err.message}`); }
  };

  const saveSettings = async (collection: string, data: any) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', collection), data);
      alert(`SYSTEM: ${collection.toUpperCase()} configuration updated successfully.`);
    } catch (err: any) { alert(`ERROR: ${err.message}`); }
    finally { setIsSaving(false); }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: formData });
    const data = await res.json();
    return data.secure_url; 
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let pdfUrl = '';
      let imageUrl = '';
      if (pdfFile) pdfUrl = await uploadToCloudinary(pdfFile);
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

      await addDoc(collection(db, 'notices'), {
        ...noticeForm,
        pdfUrl,
        imageUrl,
        author: currentUser?.email?.split('@')[0] || 'Admin',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        createdAt: serverTimestamp()
      });

      alert('SUCCESS: Notice broadcasted.');
      setNoticeForm({ title: '', category: Category.GENERAL, description: '', content: '', isImportant: false, isLatest: true });
      setPdfFile(null); setImageFile(null);
    } catch (err: any) { alert(`SYSTEM ERROR: ${err.message}`); }
    finally { setIsSubmitting(false); }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/50">
        <div className="bg-white p-12 md:p-20 rounded-[3.5rem] shadow-2xl border border-slate-100 w-full max-w-xl text-center animate-prime">
          <div className="bg-violet-600 text-white w-20 h-20 flex items-center justify-center font-black text-3xl mx-auto mb-10 rounded-[2rem] shadow-xl">IS</div>
          <h1 className="text-4xl font-extrabold text-slate-950 mb-12 tracking-tight">Access Gate</h1>
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <input required type="email" placeholder="Admin Identity" className="w-full px-8 py-5 bg-slate-50 rounded-2xl outline-none font-bold focus:ring-4 ring-violet-50 transition-all shadow-inner" onChange={(e) => setEmail(e.target.value)} />
            <input required type="password" placeholder="Passkey" className="w-full px-8 py-5 bg-slate-50 rounded-2xl outline-none font-bold focus:ring-4 ring-violet-50 transition-all shadow-inner" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="w-full bg-slate-950 text-white py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-violet-600 transition shadow-xl mt-6">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 py-24 px-6">
      <SEO title="Admin Hub" />
      <div className="container mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">Command Center</h1>
            <div className="flex gap-4 mt-3">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Authorized: {currentUser.email}
              </span>
            </div>
          </div>
          <button onClick={() => signOut(auth)} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-[11px] uppercase text-slate-400 hover:text-red-500 transition-all shadow-sm">
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-2 bg-white/50 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] w-fit shadow-lg shadow-slate-200/20">
          {[
            { id: 'notices', label: 'Broadcast', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z' },
            { id: 'about', label: 'About Page', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'contact', label: 'Contact Hub', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            { id: 'settings', label: 'Portal Config', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/30' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- NOTICES TAB --- */}
        {activeTab === 'notices' && (
          <form onSubmit={handleNoticeSubmit} className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-12 animate-prime">
            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter border-b border-slate-50 pb-8">Broadcast New Entry</h2>
            <div className="grid grid-cols-1 gap-12">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Headline</label>
                <input required className="w-full px-8 py-6 bg-slate-50 rounded-3xl font-bold text-2xl focus:bg-white focus:ring-4 ring-violet-50 outline-none transition-all shadow-inner" value={noticeForm.title} onChange={e => setNoticeForm({...noticeForm, title: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                  <select className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-violet-200" value={noticeForm.category} onChange={e => setNoticeForm({...noticeForm, category: e.target.value})}>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 px-6 bg-slate-50 rounded-2xl h-[68px] border border-transparent hover:border-violet-100 transition-colors">
                    <input type="checkbox" id="urgent" className="w-6 h-6 accent-violet-600 cursor-pointer" checked={noticeForm.isImportant} onChange={e => setNoticeForm({...noticeForm, isImportant: e.target.checked})} />
                    <label htmlFor="urgent" className="text-[10px] font-black uppercase text-slate-600 cursor-pointer select-none leading-tight tracking-tight">Add to Archive</label>
                  </div>
                  <div className="flex items-center gap-4 px-6 bg-slate-50 rounded-2xl h-[68px] border border-transparent hover:border-violet-100 transition-colors">
                    <input type="checkbox" id="latest" className="w-6 h-6 accent-violet-600 cursor-pointer" checked={noticeForm.isLatest} onChange={e => setNoticeForm({...noticeForm, isLatest: e.target.checked})} />
                    <label htmlFor="latest" className="text-[10px] font-black uppercase text-slate-600 cursor-pointer select-none leading-tight tracking-tight">Pin to Latest</label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Summary / Text Preview</label>
                <textarea required rows={3} className="w-full px-8 py-6 bg-slate-50 rounded-3xl font-bold outline-none shadow-inner" value={noticeForm.description} onChange={e => setNoticeForm({...noticeForm, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">PDF Attachment</label>
                  <input type="file" accept=".pdf" className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold" onChange={e => setPdfFile(e.target.files?.[0] || null)} />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Cover Image</label>
                  <input type="file" accept="image/*" className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </div>
              </div>
            </div>
            <button disabled={isSubmitting} className="w-full py-8 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.5em] hover:bg-violet-600 transition-all shadow-2xl disabled:bg-slate-200">
              {isSubmitting ? 'BROADCASTING...' : 'SYNC WITH DATABASE'}
            </button>
          </form>
        )}

        {/* --- PORTAL CONFIG TAB --- */}
        {activeTab === 'settings' && (
          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-12 animate-prime">
            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter border-b border-slate-50 pb-8">Homepage Layout Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Archive Widget */}
               <div className={`p-8 rounded-[2.5rem] border transition-all space-y-6 ${portalSettings.showArchive ? 'bg-violet-50/50 border-violet-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                 <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-900">Archive</label>
                    <button type="button" onClick={() => setPortalSettings({...portalSettings, showArchive: !portalSettings.showArchive})} className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${portalSettings.showArchive ? 'bg-violet-600' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${portalSettings.showArchive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                 </div>
                 <input disabled={!portalSettings.showArchive} className="w-full px-4 py-3 bg-white rounded-xl font-bold text-xs outline-none border border-violet-100" value={portalSettings.archiveTitle} onChange={e => setPortalSettings({...portalSettings, archiveTitle: e.target.value})} />
               </div>

               {/* Latest Widget */}
               <div className={`p-8 rounded-[2.5rem] border transition-all space-y-6 ${portalSettings.showLatest ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                 <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-900">Latest Feed</label>
                    <button type="button" onClick={() => setPortalSettings({...portalSettings, showLatest: !portalSettings.showLatest})} className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${portalSettings.showLatest ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${portalSettings.showLatest ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                 </div>
                 <input disabled={!portalSettings.showLatest} className="w-full px-4 py-3 bg-white rounded-xl font-bold text-xs outline-none border border-emerald-100" value={portalSettings.latestTitle} onChange={e => setPortalSettings({...portalSettings, latestTitle: e.target.value})} />
               </div>

               {/* News Widget */}
               <div className={`p-8 rounded-[2.5rem] border transition-all space-y-6 ${portalSettings.showNews ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                 <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-900">News & Blog</label>
                    <button type="button" onClick={() => setPortalSettings({...portalSettings, showNews: !portalSettings.showNews})} className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${portalSettings.showNews ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${portalSettings.showNews ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                 </div>
                 <input disabled={!portalSettings.showNews} className="w-full px-4 py-3 bg-white rounded-xl font-bold text-xs outline-none border border-blue-100" value={portalSettings.newsTitle} onChange={e => setPortalSettings({...portalSettings, newsTitle: e.target.value})} />
               </div>
            </div>

            <button onClick={() => saveSettings('portal', portalSettings)} disabled={isSaving} className="w-full py-6 bg-violet-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-950 shadow-xl transition-all">
              {isSaving ? 'UPDATING...' : 'APPLY GLOBAL CHANGES'}
            </button>
          </div>
        )}
        
        {/* About/Contact Tabs same as before */}
        {activeTab === 'about' && (
          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-12 animate-prime">
             <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter border-b border-slate-50 pb-8">About Page Content</h2>
             <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Headline</label>
                <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold outline-none" value={aboutSettings.title} onChange={e => setAboutSettings({...aboutSettings, title: e.target.value})} />
             </div>
             <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Mission Text</label>
                <textarea rows={5} className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold outline-none" value={aboutSettings.missionText} onChange={e => setAboutSettings({...aboutSettings, missionText: e.target.value})} />
             </div>
             <button onClick={() => saveSettings('about', aboutSettings)} disabled={isSaving} className="w-full py-6 bg-violet-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 shadow-xl transition-all">
               Update About Page
             </button>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-12 animate-prime">
             <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter border-b border-slate-50 pb-8">Contact Information</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Support Email</label>
                  <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold outline-none" value={contactSettings.email} onChange={e => setContactSettings({...contactSettings, email: e.target.value})} />
               </div>
               <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Office Hours</label>
                  <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold outline-none" value={contactSettings.officeHours} onChange={e => setContactSettings({...contactSettings, officeHours: e.target.value})} />
               </div>
             </div>
             <button onClick={() => saveSettings('contact', contactSettings)} disabled={isSaving} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-violet-600 shadow-xl transition-all">
               Update Contact Info
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
