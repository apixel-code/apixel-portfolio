import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Apixel</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <Navbar />

      <main className="bg-brand-dark min-h-screen pt-20 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated 404 */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="mb-8"
            >
              <h1 className="font-syne font-bold text-[150px] md:text-[200px] leading-none gradient-text">
                404
              </h1>
            </motion.div>

            {/* Floating Particles */}
            <div className="relative mb-8">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-brand-cyan rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            <h2 className="font-syne font-semibold text-2xl md:text-3xl text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              The page you're looking for seems to have drifted into the digital void. 
              Let's get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="btn-primary inline-flex items-center justify-center gap-2"
                data-testid="404-home-btn"
              >
                <Home size={18} />
                Back to Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn-secondary inline-flex items-center justify-center gap-2"
                data-testid="404-back-btn"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default NotFound;
