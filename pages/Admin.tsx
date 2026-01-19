
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { auth, db } from '../lib/firebase';
import { Category } from '../types';
import { SEO } from '../components/SEO';

// ==========================================
// ✅ CLOUDINARY LIVE CONFIGURATION
// ==========================================
const CLOUDINARY_CLOUD_NAME = 'djtrcbxjs'; 
const CLOUDINARY_UPLOAD_PRESET = 'demo.shiv'; 
// ==========================================

const Admin: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: Category.GOVERNMENT,
    description: '',
    isImportant: false
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsub();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert(`AUTH_FAILURE: ${err.message}`);
    }
  };

  /**
   * Uploads file to Cloudinary via REST API using Unsigned Preset
   */
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Cloudinary upload failed. Ensure your preset "demo.shiv" is set to UNSIGNED.');
    }

    const data = await response.json();
    return data.secure_url; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSubmitting(true);

    try {
      let pdfUrl = '';
      let imageUrl = '';

      // Upload files to Cloudinary first
      if (pdfFile) {
        pdfUrl = await uploadToCloudinary(pdfFile);
      }
      
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      // Save metadata and Cloudinary URLs to Firestore
      await addDoc(collection(db, 'notices'), {
        ...form,
        pdfUrl,
        imageUrl,
        author: currentUser.email?.split('@')[0] || 'Admin',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        createdAt: serverTimestamp()
      });

      alert('BINGO! Notice published successfully to Cloudinary & Firestore.');
      
      // Reset State
      setForm({ title: '', category: Category.GOVERNMENT, description: '', isImportant: false });
      setPdfFile(null);
      setImageFile(null);
      
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(input => input.value = '');
    } catch (err: any) {
      console.error(err);
      alert(`SYSTEM ERROR: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-50/50">
        <div className="bg-white p-12 md:p-24 rounded-[3.5rem] shadow-2xl border border-slate-100 w-full max-w-2xl text-center animate-prime">
          <div className="bg-violet-600 text-white w-20 h-20 flex items-center justify-center font-black text-3xl mx-auto mb-10 rounded-[2rem] rotate-3 shadow-xl shadow-violet-600/20">IS</div>
          <h1 className="text-4xl font-extrabold text-slate-950 mb-12 tracking-tight">Publisher Terminal</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              required
              type="email" 
              placeholder="Admin Email"
              className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl outline-none font-bold placeholder:text-slate-300 focus:ring-4 ring-violet-50 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              required
              type="password" 
              placeholder="Security Token"
              className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl outline-none font-bold placeholder:text-slate-300 focus:ring-4 ring-violet-50 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-slate-950 text-white py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition shadow-xl mt-6">
              Initialize Session
            </button>
          </form>
          <p className="mt-12 text-[10px] font-black uppercase text-slate-300 tracking-widest">Authorized Cloud Access Enabled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 py-24 px-6">
      <SEO title="Admin Hub" />
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">Cloudinary Portal</h1>
            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Session: {currentUser.email}
            </p>
          </div>
          <button onClick={() => signOut(auth)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-full font-bold text-[11px] uppercase text-slate-400 hover:text-red-500 hover:border-red-100 transition-all">
            Terminate Session
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-12 animate-prime">
          <div className="space-y-6">
            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Notice Headline</label>
            <input 
              required
              className="w-full px-8 py-6 bg-slate-50 rounded-3xl font-bold text-2xl outline-none focus:bg-white focus:ring-4 ring-violet-50 transition-all"
              placeholder="e.g. Loksewa Aayog Kharidar Result 2081..."
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Archive Sector</label>
              <select 
                className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold outline-none appearance-none cursor-pointer border-none"
                onChange={(e) => setForm({...form, category: e.target.value as Category})}
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-4 px-8 bg-slate-50 rounded-2xl h-[68px] self-end border border-transparent hover:border-violet-100 transition-colors">
              <input type="checkbox" id="urgent" className="w-6 h-6 accent-violet-600 rounded-lg" checked={form.isImportant} onChange={(e) => setForm({...form, isImportant: e.target.checked})} />
              <label htmlFor="urgent" className="font-bold text-slate-600 cursor-pointer select-none">Mark Priority Broadcast</label>
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Summary Abstract</label>
            <textarea 
              required
              rows={4}
              className="w-full px-8 py-6 bg-slate-50 rounded-3xl font-bold outline-none focus:bg-white focus:ring-4 ring-violet-50 transition-all"
              placeholder="Provide an overview for search engines..."
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
             <div className="space-y-4">
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Document Upload (PDF)</label>
                <div className="relative overflow-hidden bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-100 hover:border-violet-200 transition-all group">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-900">{pdfFile ? pdfFile.name : 'Select PDF'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Cloudinary Storage</p>
                    </div>
                  </div>
                </div>
             </div>
             <div className="space-y-4">
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Thumbnail Cover (Image)</label>
                <div className="relative overflow-hidden bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-100 hover:border-slate-300 transition-all group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-900">{imageFile ? imageFile.name : 'Select Image'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Cloudinary Optimized</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <button 
            disabled={isSubmitting}
            className={`w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] transition-all shadow-2xl ${isSubmitting ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-950 text-white hover:bg-violet-600 hover:-translate-y-1 active:translate-y-0'}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-4">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                Syncing with Cloudinary...
              </span>
            ) : 'Broadcast to Global Archive'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
