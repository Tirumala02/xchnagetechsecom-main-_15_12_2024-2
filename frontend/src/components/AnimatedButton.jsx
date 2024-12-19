import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AnimatedButton = () => {
  return (
    <motion.button
      className="fixed bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-400 transition duration-300"
      initial={{ opacity: 0, y: 50 }} // Initial state of the button
      animate={{ opacity: 1, y: 0 }} // Animate to these values
      transition={{ duration: 0.5 }} // Duration of the animation
      whileHover={{ scale: 1.1 }} // Scale the button when hovered
    >
      <Link to="/product-request">Can't find product?</Link>
    </motion.button>
  );
};

export default AnimatedButton;
