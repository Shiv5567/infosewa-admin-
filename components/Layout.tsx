
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Feed', path: '/' },
    { label: 'Government', path: '/category/government' },
    { label: 'Results', path: '/category/results' },
    { label: 'Academic', path: '/category/non-government' },
    { label: 'Library', path: '/category/pdfs' },
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
    <div className="min-h-screen flex flex-col selection:bg-violet-100 selection:text-violet-700">
      <header className="fixed top-0 w-full z-[100] px-6 py-6 pointer-events-none">
        <nav className="container mx-auto floating-pill px-8 py-3.5 flex items-center justify-between gap-12 pointer-events-auto shadow-xl shadow-slate-200/50 max-w-7xl">
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="bg-violet-600 text-white w-9 h-9 flex items-center justify-center rounded-2xl font-black text-sm transition-all group-hover:rotate-12">
              IS
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tighter">InfoSewa</span>
              <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-40">Portal</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all ${
                  location.pathname === item.path 
                    ? 'text-white bg-violet-600 shadow-lg shadow-violet-600/20' 
                    : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search..."
                className="bg-slate-100/50 border-none rounded-full py-2 px-10 text-[13px] font-bold outline-none w-32 focus:w-48 focus:bg-white transition-all placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </form>

            <Link to="/admin" className="hidden sm:flex bg-slate-950 text-white px-6 py-2 rounded-full text-[11px] font-black hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg shadow-slate-950/10">
              Admin
            </Link>

            <button 
              className="lg:hidden p-2 text-slate-950"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="container mx-auto mt-4 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-3 pointer-events-auto border border-slate-100 animate-prime">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`p-4 rounded-2xl text-[12px] font-black uppercase tracking-widest text-center ${location.pathname === item.path ? 'bg-violet-600 text-white' : 'bg-slate-50 text-slate-500'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 mt-20 py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-16">
            <div className="md:col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-violet-600 text-white w-8 h-8 flex items-center justify-center rounded-xl font-black text-xs">IS</div>
                <span className="text-xl font-extrabold tracking-tighter">InfoSewa</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
                The most reliable digital gateway for public notices and examination archives in Nepal. Transparent, verified, and always up-to-date.
              </p>
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 mb-6 text-sm uppercase tracking-wider">Explore</h4>
              <ul className="space-y-4 text-[13px] font-bold text-slate-500">
                <li><Link to="/category/results" className="hover:text-violet-600 transition">Latest Results</Link></li>
                <li><Link to="/category/government" className="hover:text-violet-600 transition">Gov Notices</Link></li>
                <li><Link to="/category/pdfs" className="hover:text-violet-600 transition">PDF Library</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 mb-6 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-4 text-[13px] font-bold text-slate-500">
                <li><a href="#" className="hover:text-violet-600 transition">Verification Hub</a></li>
                <li><a href="#" className="hover:text-violet-600 transition">Support Center</a></li>
                <li><a href="#" className="hover:text-violet-600 transition">Legal Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
            <p>© {new Date().getFullYear()} INFOSEWA NEPAL. PROFESSIONAL PORTAL.</p>
            <div className="flex gap-8">
              <Link to="/admin" className="hover:text-violet-600">Admin Console</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
