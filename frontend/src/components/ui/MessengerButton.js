import React from 'react';
import { motion } from 'framer-motion';

const MessengerButton = () => {
  const messengerUrl = 'https://m.me/apixel.net';

  return (
    <motion.a
      href={messengerUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Apixel on Messenger"
      className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-[#0084FF] rounded-full shadow-lg hover:bg-[#0074E8] transition-colors flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      data-testid="messenger-floating-btn"
      style={{
        boxShadow: '0 0 0 0 rgba(0, 132, 255, 0.65)',
        animation: 'messenger-pulse 2s infinite',
      }}
    >
      <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white" aria-hidden="true">
        <path d="M16 2.667C8.637 2.667 2.667 8.18 2.667 14.98c0 3.877 1.94 7.337 4.973 9.592v4.761l4.545-2.496c1.211.335 2.492.515 3.815.515 7.363 0 13.333-5.513 13.333-12.313S23.363 2.667 16 2.667Zm1.325 16.582-3.394-3.62-6.626 3.62 7.285-7.733 3.478 3.62 6.542-3.62-7.285 7.733Z" />
      </svg>
    </motion.a>
  );
};

export default MessengerButton;
