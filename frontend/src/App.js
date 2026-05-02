import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import About from './pages/public/About';
import Blog from './pages/public/Blog';
import BlogPost from './pages/public/BlogPost';
import Contact from './pages/public/Contact';
import Home from './pages/public/Home';
import NotFound from './pages/public/NotFound';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Services from './pages/public/Services';
import Templates from './pages/public/Templates';
import TermsOfService from './pages/public/TermsOfService';

// Admin Pages
import AdminBlogForm from './pages/admin/AdminBlogForm';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminExpertForm from './pages/admin/AdminExpertForm';
import AdminExperts from './pages/admin/AdminExperts';
import AdminLogin from './pages/admin/AdminLogin';
import AdminMessages from './pages/admin/AdminMessages';
import AdminServiceForm from './pages/admin/AdminServiceForm';
import AdminServices from './pages/admin/AdminServices';
import AdminTemplateForm from './pages/admin/AdminTemplateForm';
import AdminTemplates from './pages/admin/AdminTemplates';

// Components
import ProtectedRoute from './components/admin/ProtectedRoute';
import ScrollToTop from './components/ui/ScrollToTop';
import WhatsAppButton from './components/ui/WhatsAppButton';

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1b4b',
              color: '#F8FAFC',
              border: '1px solid rgba(147, 51, 234, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#00F5FF',
                secondary: '#020617',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#020617',
              },
            },
          }}
        />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/store" element={<Templates />} />
            <Route path="/templates" element={<Navigate to="/store" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/blogs" element={
              <ProtectedRoute><AdminBlogs /></ProtectedRoute>
            } />
            <Route path="/admin/blogs/new" element={
              <ProtectedRoute><AdminBlogForm /></ProtectedRoute>
            } />
            <Route path="/admin/blogs/edit/:id" element={
              <ProtectedRoute><AdminBlogForm /></ProtectedRoute>
            } />
            <Route path="/admin/services" element={
              <ProtectedRoute><AdminServices /></ProtectedRoute>
            } />
            <Route path="/admin/services/new" element={
              <ProtectedRoute><AdminServiceForm /></ProtectedRoute>
            } />
            <Route path="/admin/services/edit/:id" element={
              <ProtectedRoute><AdminServiceForm /></ProtectedRoute>
            } />
            <Route path="/admin/templates" element={
              <ProtectedRoute><AdminTemplates /></ProtectedRoute>
            } />
            <Route path="/admin/templates/new" element={
              <ProtectedRoute><AdminTemplateForm /></ProtectedRoute>
            } />
            <Route path="/admin/templates/edit/:id" element={
              <ProtectedRoute><AdminTemplateForm /></ProtectedRoute>
            } />
            <Route path="/admin/experts" element={
              <ProtectedRoute><AdminExperts /></ProtectedRoute>
            } />
            <Route path="/admin/experts/new" element={
              <ProtectedRoute><AdminExpertForm /></ProtectedRoute>
            } />
            <Route path="/admin/experts/edit/:id" element={
              <ProtectedRoute><AdminExpertForm /></ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
              <ProtectedRoute><AdminMessages /></ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <WhatsAppButton />
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
