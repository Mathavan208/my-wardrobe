// src/components/clothing/ClothingDetailsModal.jsx
import { motion } from "framer-motion";
import { FiX, FiEdit, FiTrash2 } from "react-icons/fi";

const ClothingDetailsModal = ({ isOpen, onClose, item, onEdit, onDelete }) => {
  if (!item) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case "shirt": return "👔";
      case "tshirt": return "👕";
      case "pants": return "👖";
      case "innerwear": return "🩲";
      case "shoes": return "👟";
      default: return "👚";
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </motion.div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <motion.div
          className="relative z-20 inline-block w-full my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg max-w-4xl max-h-[90vh]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={handleModalClick}
        >
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
              <button
                type="button"
                className="text-gray-400 bg-white hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="relative h-64 mb-4 overflow-hidden bg-gray-200 rounded-lg">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-6xl">{getTypeIcon(item.type)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {item.favorite && (
                    <span className="px-3 py-1 text-xs text-white bg-red-800 rounded-full">
                      Favorite
                    </span>
                  )}
                  {item.color && (
                    <span className="px-3 py-1 text-xs text-white bg-gray-800 rounded-full">
                      {item.color}
                    </span>
                  )}
                  {item.size && (
                    <span className="px-3 py-1 text-xs text-white bg-gray-800 rounded-full">
                      Size: {item.size}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Type</h4>
                    <p className="text-lg text-gray-900 capitalize">{item.type}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Brand</h4>
                    <p className="text-lg text-gray-900">{item.brand || 'Not specified'}</p>
                  </div>
                  
                  {item.style && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Style</h4>
                      <p className="text-lg text-gray-900">{item.style}</p>
                    </div>
                  )}
                  
                  {item.sleeveLength && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Sleeve Length</h4>
                      <p className="text-lg text-gray-900">{item.sleeveLength}</p>
                    </div>
                  )}
                  
                  {item.pantsType && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Pants Type</h4>
                      <p className="text-lg text-gray-900">{item.pantsType}</p>
                    </div>
                  )}
                  
                  {item.shoesType && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Shoes Type</h4>
                      <p className="text-lg text-gray-900">{item.shoesType}</p>
                    </div>
                  )}
                  
                  {item.pattern && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Pattern</h4>
                      <p className="text-lg text-gray-900">{item.pattern}</p>
                    </div>
                  )}
                  
                  {item.material && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Material</h4>
                      <p className="text-lg text-gray-900">{item.material}</p>
                    </div>
                  )}
                  
                  {item.fit && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Fit</h4>
                      <p className="text-lg text-gray-900">{item.fit}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Close
              </button>
              
              {onEdit && (
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Close the details modal first
                    onClose();
                    // Then open the form with the current item data
                    onEdit(item);
                  }}
                >
                  <FiEdit className="w-5 h-5 mr-2 -ml-1" />
                  Edit
                </button>
              )}
              
              {onDelete && (
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-red-700 bg-red-100 border border-transparent rounded-md shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => onDelete(item)}
                >
                  <FiTrash2 className="w-5 h-5 mr-2 -ml-1" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClothingDetailsModal;