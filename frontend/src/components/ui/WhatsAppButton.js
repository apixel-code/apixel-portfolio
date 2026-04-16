import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const whatsappNumber = '+8801754407239';
  const message = 'Hello! I am interested in your services.';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      data-testid="whatsapp-floating-btn"
      style={{
        boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)',
        animation: 'whatsapp-pulse 2s infinite'
      }}
    >
      <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958C9.742 30.888 12.762 32 16.004 32 24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.318 22.614c-.386 1.09-1.926 1.994-3.136 2.258-.828.178-1.908.32-5.546-1.192-4.654-1.934-7.65-6.664-7.882-6.974-.224-.31-1.834-2.442-1.834-4.66 0-2.216 1.162-3.304 1.574-3.754.386-.422.912-.598 1.218-.598.148 0 .282.008.402.014.412.018.618.042.89.688.34.804 1.162 2.836 1.264 3.042.102.206.206.476.082.766-.116.296-.22.428-.426.66-.206.232-.402.41-.608.66-.188.224-.4.464-.17.876.228.41 1.018 1.678 2.186 2.72 1.502 1.34 2.766 1.756 3.158 1.95.392.194.62.162.848-.098.236-.268 1.006-1.172 1.274-1.574.262-.402.532-.336.89-.198.364.132 2.302 1.086 2.696 1.284.394.198.658.296.754.462.096.166.096.952-.29 2.042z"/>
      </svg>
    </motion.a>
  );
};

export default WhatsAppButton;
