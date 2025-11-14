// src/components/clothing/ClothingCard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useClothing } from "../../context/ClothingContext";
import ClothingForm from "./ClothingForm";
import ClothingDetailsModal from "./ClothigDetailsModal";
import Button from "../ui/Button";
import { FiEdit, FiTrash2, FiHeart, FiEye } from "react-icons/fi";

const ClothingCard = ({ item, onClick }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { deleteClothing } = useClothing();
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteClothing(item.id);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };
  
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
  
  // Function to convert color name to hex color
  const getColorHex = (colorName) => {
    const colorMap = {
      "white": "#FFFFFF",
      "black": "#000000",
      "gray": "#808080",
      "navy": "#000080",
      "blue": "#0000FF",
      "red": "#FF0000",
      "green": "#008000",
      "yellow": "#FFFF00",
      "pink": "#FFC0CB",
      "purple": "#800080",
      "orange": "#FFA500",
      "brown": "#A52A2A",
      "beige": "#F5F5DC",
      "khaki": "#F0E68C",
      "cream": "#FFFDD0",
      "silver": "#C0C0C0"
    };
    
    return colorMap[colorName?.toLowerCase()] || "#CCCCCC";
  };
  
  return (
    <>
      <motion.div
        className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={onClick}
        style={{
          backgroundColor: item.color ? getColorHex(item.color) + "20" : "#FFFFFF"
        }}
      >
        <div className="relative h-48 bg-gray-200">
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
          
          {item.favorite && (
            <div className="absolute top-2 right-2">
              <FiHeart className="text-xl text-red-500 fill-current" />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="mb-1 text-lg font-semibold text-gray-800">{item.name}</h3>
          <p className="mb-2 text-sm text-gray-600">{item.brand}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {item.color && (
              <span 
                className="px-2 py-1 text-xs text-gray-800 rounded-full"
                style={{
                  backgroundColor: getColorHex(item.color),
                  color: item.color === "white" || item.color === "beige" || item.color === "cream" || item.color === "silver" ? "black" : "white"
                }}
              >
                {item.color}
              </span>
            )}
            {item.style && (
              <span className="px-2 py-1 text-xs text-gray-800 rounded-full">
                {item.style}
              </span>
            )}
            {item.size && (
              <span className="px-2 py-1 text-xs text-gray-800 rounded-full">
                Size: {item.size}
              </span>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailOpen(true);
              }}
            >
              <FiEye className="mr-1" /> View
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <FiTrash2 className="mr-1" /> Delete
            </Button>
          </div>
        </div>
      </motion.div>
      
      <ClothingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingItem={item}
      />
      
      <ClothingDetailsModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={item}
        onEdit={(item) => {
          setIsDetailOpen(false);
          setIsFormOpen(true);
        }}
        onDelete={(item) => {
          setIsDetailOpen(false);
          handleDelete();
        }}
      />
    </>
  );
};

export default ClothingCard;