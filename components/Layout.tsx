
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileExploreOpen(false);
  }, [location.pathname]);

  const exploreItems = [
    { label: 'Notes', path: '/category/notes', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { label: 'News', path: '/category/news', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: 'Blog', path: '/category/blog', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> },
    { label: 'Vacancies', path: '/category/vacancy', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745V20a2 2 0 002 2h14a2 2 0 002-2v-6.745z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8V5a2 2 0 00-2-2H10a2 2 0 00-2 2v3H4a2 2 0 00-2 2v3a2 2 0 002 2h16a2 2 0 002-2v-3a2 2 0-2h-4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 8v3h4V8h-4z" /> },
    { label: 'Results', path: '/category/results', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: 'Notices', path: '/category/government', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-violet-300 selection:text-violet-900 bg-violet-50/10">
      <header className="fixed top-0 w-full z-[100] px-4 py-3 pointer-events-none">
        <nav className="container mx-auto floating-pill px-6 py-2.5 flex items-center justify-between gap-4 pointer-events-auto shadow-2xl shadow-violet-300/20 max-w-7xl">
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="bg-violet-600 text-white w-8 h-8 flex items-center justify-center rounded-xl font-black text-xs transition-all group-hover:rotate-12 shadow-lg shadow-violet-600/30">
              IS
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-tighter dynamic-text">InfoSewa</span>
              <span className="text-[7px] font-black tracking-[0.3em] uppercase text-violet-600/60">Portal</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                location.pathname === '/' 
                  ? 'text-white bg-violet-600 shadow-lg shadow-violet-600/20 scale-105' 
                  : 'text-slate-600 hover:text-violet-600 hover:bg-violet-100/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                  exploreItems.some(i => location.pathname === i.path)
                    ? 'text-violet-600 bg-violet-100/80' 
                    : 'text-slate-600 hover:text-violet-600 hover:bg-violet-100/50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Explore
                <svg className={`w-3 h-3 transition-transform ${isExploreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {isExploreOpen && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-violet-100 rounded-[2rem] shadow-2xl p-2 animate-prime flex flex-col gap-1 ring-1 ring-violet-200/50">
                  <div className="px-4 py-2 mb-1 border-b border-violet-50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Navigation</p>
                  </div>
                  {exploreItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsExploreOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-all group"
                    >
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-violet-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                location.pathname === '/about' 
                  ? 'text-white bg-violet-600 shadow-lg shadow-violet-600/20 scale-105' 
                  : 'text-slate-600 hover:text-violet-600 hover:bg-violet-100/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              About
            </Link>

            <Link
              to="/contact"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                location.pathname === '/contact' 
                  ? 'text-white bg-violet-600 shadow-lg shadow-violet-600/20 scale-105' 
                  : 'text-slate-600 hover:text-violet-600 hover:bg-violet-100/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden xl:block">
              <input 
                type="text" 
                placeholder="Search database..."
                className="bg-violet-100/50 border border-violet-200 rounded-full py-1.5 px-9 text-[12px] font-bold outline-none w-32 focus:w-48 focus:bg-white focus:border-violet-400 transition-all placeholder:text-violet-300 text-violet-950 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-3 top-2 w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </form>

            <Link to="/admin" className="hidden sm:flex bg-slate-950 text-white px-5 py-2 rounded-full text-[10px] font-black hover:bg-violet-700 transition-all uppercase tracking-widest shadow-xl shadow-slate-950/20 hover:shadow-violet-600/40">
              Admin
            </Link>

            <button 
              className="lg:hidden p-1 text-slate-950"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="container mx-auto mt-2 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] p-5 shadow-2xl flex flex-col gap-2 pointer-events-auto border border-violet-200 animate-prime ring-1 ring-violet-200/50">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-3 ${location.pathname === '/' ? 'bg-violet-600 text-white shadow-lg' : 'bg-violet-50/50 text-violet-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </Link>
            
            <div className="flex flex-col gap-1 bg-slate-50/80 rounded-3xl border border-slate-100 overflow-hidden">
              <button 
                onClick={() => setIsMobileExploreOpen(!isMobileExploreOpen)}
                className="w-full flex items-center justify-between p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  Explore
                </div>
                <svg className={`w-4 h-4 transition-transform duration-300 ${isMobileExploreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              <div className={`grid grid-cols-1 gap-2 px-3 transition-all duration-300 origin-top overflow-hidden ${isMobileExploreOpen ? 'max-h-[500px] opacity-100 py-3' : 'max-h-0 opacity-0'}`}>
                {exploreItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl text-[10px] font-bold text-slate-600 border border-slate-100 hover:border-violet-200 transition-all"
                  >
                    <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-3 ${location.pathname === '/about' ? 'bg-violet-600 text-white shadow-lg' : 'bg-violet-50/50 text-violet-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              About InfoSewa
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={`p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-3 ${location.pathname === '/contact' ? 'bg-violet-600 text-white shadow-lg' : 'bg-violet-50/50 text-violet-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Contact Support
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-violet-100/40 border-t border-violet-200 mt-20 py-24 backdrop-blur-md">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 pb-20">
            <div className="md:col-span-2 space-y-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-violet-600 text-white w-10 h-10 flex items-center justify-center rounded-2xl font-black text-sm shadow-xl shadow-violet-600/30">IS</div>
                <span className="text-2xl font-extrabold tracking-tighter dynamic-text">InfoSewa</span>
              </Link>
            </div>
            <div>
              <h4 className="font-extrabold text-slate-950 mb-8 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-5 text-[14px] font-bold text-slate-500">
                <li><Link to="/about" className="hover:text-violet-600 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-violet-600 transition-colors">Contact Center</Link></li>
                <li><a href="#" className="hover:text-violet-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-violet-200 flex flex-col items-center text-[11px] font-black uppercase tracking-[0.4em] text-violet-400/80 text-center">
            <p>© INFOSEWA NEPAL. DIGITAL SEWA.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
