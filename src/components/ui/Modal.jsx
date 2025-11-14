// src/components/ui/Modal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  size = "md" 
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {  // Fixed: 'escape' should be 'Escape'
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };
  
  // Prevent event bubbling when clicking on the modal content
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay with lower z-index */}
            <motion.div
              className="fixed inset-0 z-10 transition-opacity"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={onClose}></div>
            </motion.div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            {/* Modal content with higher z-index and click handler to prevent closing */}
            <motion.div
              className={`relative z-20 inline-block w-full my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg ${sizeClasses[size]}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={handleModalContentClick}  // Prevent click events from bubbling up
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;