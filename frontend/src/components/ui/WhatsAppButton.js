import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const whatsappNumber = '+8801325383588';
  const message = 'Hello! I am interested in your services.';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      data-testid="whatsapp-floating-btn"
    >
      <MessageCircle size={28} className="text-white fill-white" />
      <span className="absolute -top-2 -right-2 w-4 h-4 bg-brand-cyan rounded-full animate-ping" />
    </motion.a>
  );
};

export default WhatsAppButton;
