import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Blog from './pages/public/Blog';
import BlogPost from './pages/public/BlogPost';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Templates from './pages/public/Templates';
import TemplateDetails from './pages/public/TemplateDetails';
import NotFound from './pages/public/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminBlogForm from './pages/admin/AdminBlogForm';
import AdminServices from './pages/admin/AdminServices';
import AdminServiceForm from './pages/admin/AdminServiceForm';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminTemplateForm from './pages/admin/AdminTemplateForm';
import AdminMessages from './pages/admin/AdminMessages';

// Components
import WhatsAppButton from './components/ui/WhatsAppButton';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Router>
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
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/:slug" element={<TemplateDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
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
