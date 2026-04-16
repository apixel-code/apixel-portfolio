import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, ChevronRight, FileText, LayoutDashboard, LayoutTemplate, LogOut, Menu, MessageSquare, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Store', path: '/admin/templates', icon: LayoutTemplate },
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
      <div className="p-4 md:p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3" aria-label="Apixel Home">
          <img
            src="/assets/f.png"
            alt="Apixel Logo"
            className="h-10 md:h-12 w-auto object-contain mix-blend-screen"
            style={{ filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.24))' }}
          />
          <span className="text-xs text-brand-cyan font-dm-sans">Admin</span>
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
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
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

      <div className="p-3 md:p-4 border-t border-white/5">
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
    <div className="min-h-screen bg-[#0B0F19]">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-brand-dark/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          data-testid="admin-mobile-menu-btn"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-syne font-semibold text-base text-white">
          {menuItems.find(item => isActive(item.path))?.name || 'Admin'}
        </h1>
        <Link to="/" className="flex items-center">
          <img
            src="/assets/f.png"
            alt="Apixel"
            className="h-8 w-auto object-contain mix-blend-screen"
            style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.2))' }}
          />
        </Link>
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
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-brand-dark border-r border-white/5 z-50 flex flex-col"
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
      <aside className="hidden md:flex md:flex-col w-64 bg-brand-dark border-r border-white/5 fixed h-full">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0">
        <header className="hidden md:block bg-brand-dark/80 backdrop-blur-md border-b border-white/5 px-8 py-4 sticky top-0 z-10">
          <h1 className="font-syne font-semibold text-xl text-white">
            {menuItems.find(item => isActive(item.path))?.name || 'Admin'}
          </h1>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
