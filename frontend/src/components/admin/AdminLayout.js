import { Briefcase, ChevronRight, FileText, LayoutDashboard, LayoutTemplate, LogOut, MessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  return (
    <div className="min-h-screen bg-[#0B0F19] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark border-r border-white/5 fixed h-full">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3" aria-label="Apixel Home">
            <img 
              src="/assets/f.png" 
              alt="Apixel Logo" 
              className="h-12 w-auto object-contain mix-blend-screen"
              style={{ filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.24))' }}
            />
            <span className="text-xs text-brand-cyan font-dm-sans">Admin</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-brand-purple/20 text-brand-purple border-l-2 border-brand-purple'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
                data-testid={`admin-nav-${item.name.toLowerCase()}`}
              >
                <Icon size={20} />
                <span className="font-dm-sans text-sm">{item.name}</span>
                {isActive(item.path) && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all w-full"
            data-testid="admin-logout-btn"
          >
            <LogOut size={20} />
            <span className="font-dm-sans text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <header className="bg-brand-dark/80 backdrop-blur-md border-b border-white/5 px-8 py-4 sticky top-0 z-10">
          <h1 className="font-syne font-semibold text-xl text-white">
            {menuItems.find(item => isActive(item.path))?.name || 'Admin'}
          </h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
