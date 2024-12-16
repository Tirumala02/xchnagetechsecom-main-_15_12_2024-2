import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
    />
  </div>
);

export default Loader;

