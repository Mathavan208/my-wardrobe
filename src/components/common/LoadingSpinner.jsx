// src/components/common/LoadingSpinner.jsx
import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };
  
  return (
    <div className="flex justify-center items-center p-8">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-indigo-200 border-t-indigo-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 1,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default LoadingSpinner;