import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, ChevronRight, FileText, LayoutDashboard, LayoutTemplate, LogOut, Menu, MessageSquare, Moon, Sun, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdminDark, setIsAdminDark] = useState(() => {
    const stored = localStorage.getItem('apixel_admin_theme');
    return stored ? stored === 'dark' : true;
  });

  // Force remove frontend light-mode class on admin pages
  useEffect(() => {
    document.documentElement.classList.remove('light-mode');
    document.documentElement.classList.add('dark-mode');
    return () => {};
  }, []);

  useEffect(() => {
    localStorage.setItem('apixel_admin_theme', isAdminDark ? 'dark' : 'light');
  }, [isAdminDark]);

  const toggleAdminTheme = () => setIsAdminDark((prev) => !prev);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Store', path: '/admin/templates', icon: LayoutTemplate },
    { name: 'Experts', path: '/admin/experts', icon: Users },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className={`p-4 md:p-6 border-b ${isAdminDark ? 'border-white/5' : 'border-slate-200'}`}>
        <Link to="/" className="flex items-center gap-3" aria-label="Apixel Home">
          <img
            src={isAdminDark ? '/assets/f.png' : '/assets/apixel.it.png'}
            alt="Apixel Logo"
            className={`h-10 md:h-12 w-auto object-contain ${isAdminDark ? 'mix-blend-screen' : ''}`}
            style={isAdminDark ? { filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.24))' } : undefined}
          />
          <span className={`text-xs font-dm-sans ${isAdminDark ? 'text-brand-cyan' : 'text-brand-purple'}`}>Admin</span>
        </Link>
      </div>

      <nav className="p-3 md:p-4 space-y-1 md:space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all text-sm ${
                isActive(item.path)
                  ? 'bg-brand-purple/20 text-brand-purple border-l-2 border-brand-purple'
                  : isAdminDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
              data-testid={`admin-nav-${item.name.toLowerCase()}`}
            >
              <Icon size={18} />
              <span className="font-dm-sans">{item.name}</span>
              {isActive(item.path) && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className={`p-3 md:p-4 border-t ${isAdminDark ? 'border-white/5' : 'border-slate-200'}`}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all w-full text-sm"
          data-testid="admin-logout-btn"
        >
          <LogOut size={18} />
          <span className="font-dm-sans">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className={`min-h-screen ${isAdminDark ? 'bg-[#0B0F19]' : 'bg-slate-100 admin-light'}`}>
      {/* Mobile Header */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between ${isAdminDark ? 'bg-brand-dark/95 border-white/5' : 'bg-white/95 border-slate-200'}`}>
        <button
          onClick={() => setSidebarOpen(true)}
          className={`p-2 rounded-lg transition-colors ${isAdminDark ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-200'}`}
          data-testid="admin-mobile-menu-btn"
        >
          <Menu size={22} />
        </button>
        <h1 className={`font-syne font-semibold text-base ${isAdminDark ? 'text-white' : 'text-slate-800'}`}>
          {menuItems.find(item => isActive(item.path))?.name || 'Admin'}
        </h1>
        <button
          onClick={toggleAdminTheme}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isAdminDark ? 'bg-white/10 text-brand-gold' : 'bg-slate-200 text-brand-purple'}`}
          data-testid="admin-theme-toggle-mobile"
        >
          {isAdminDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 z-50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className={`md:hidden fixed left-0 top-0 bottom-0 w-64 border-r z-50 flex flex-col ${isAdminDark ? 'bg-brand-dark border-white/5' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-end p-3">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  data-testid="admin-close-sidebar-btn"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex md:flex-col w-64 border-r fixed h-full ${isAdminDark ? 'bg-brand-dark border-white/5' : 'bg-white border-slate-200'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0">
        <header className={`hidden md:flex items-center justify-between backdrop-blur-md border-b px-8 py-4 sticky top-0 z-10 ${isAdminDark ? 'bg-brand-dark/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
          <h1 className={`font-syne font-semibold text-xl ${isAdminDark ? 'text-white' : 'text-slate-800'}`}>
            {menuItems.find(item => isActive(item.path))?.name || 'Admin'}
          </h1>
          <button
            onClick={toggleAdminTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isAdminDark ? 'bg-white/10 border border-white/10 text-brand-gold hover:bg-white/20' : 'bg-slate-100 border border-slate-200 text-brand-purple hover:bg-slate-200'}`}
            data-testid="admin-theme-toggle-btn"
          >
            {isAdminDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
