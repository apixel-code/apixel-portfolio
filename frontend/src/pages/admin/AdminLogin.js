import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Force dark mode on admin login
  useEffect(() => {
    document.documentElement.classList.remove('light-mode');
    document.documentElement.classList.add('dark-mode');
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Apixel</title>
      </Helmet>

      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 bg-grid">
        <div className="absolute inset-0 bg-gradient-radial from-brand-purple/10 via-transparent to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="card-glass">
            {/* Logo */}
            <div className="text-center mb-8">
              <img 
                src="/assets/f-light.png" 
                alt="Apixel Logo" 
                className="h-16 sm:h-20 mx-auto mb-4 w-auto object-contain mix-blend-screen"
                style={{ filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.24))' }}
              />
              <h1 className="font-syne font-bold text-2xl text-white">Admin Login</h1>
              <p className="text-slate-400 text-sm mt-2">Sign in to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-dark"
                  placeholder="admin@agency.com"
                  data-testid="admin-email-input"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm text-slate-400 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-dark pr-12"
                    placeholder="Enter your password"
                    data-testid="admin-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="admin-login-btn"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                  />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="text-slate-400 text-sm hover:text-brand-cyan transition-colors">
                ← Back to Website
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
