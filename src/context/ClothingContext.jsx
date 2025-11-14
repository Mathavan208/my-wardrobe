// src/context/ClothingContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { 
  getClothingItems, 
  addClothingItem, 
  updateClothingItem, 
  deleteClothingItem,
  getSavedOutfits,
  saveOutfit
} from "../firebase/firestoreService";

const ClothingContext = createContext();

export const useClothing = () => {
  return useContext(ClothingContext);
};

export const ClothingProvider = ({ children }) => {
  const [clothingItems, setClothingItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchClothingItems = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const items = await getClothingItems(currentUser.uid);
      setClothingItems(items);
    } catch (error) {
      console.error("Error fetching clothing items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedOutfits = async () => {
    if (!currentUser) return;
    
    try {
      const outfits = await getSavedOutfits(currentUser.uid);
      setSavedOutfits(outfits);
    } catch (error) {
      console.error("Error fetching saved outfits:", error);
    }
  };

  const addClothing = async (clothingData, imageFile) => {
    if (!currentUser) return;
    
    try {
      const itemId = await addClothingItem(currentUser.uid, clothingData, imageFile);
      await fetchClothingItems();
      return itemId;
    } catch (error) {
      console.error("Error adding clothing item:", error);
      throw error;
    }
  };

  const updateClothing = async (itemId, clothingData, imageFile) => {
    if (!currentUser) return;
    
    try {
      await updateClothingItem(currentUser.uid, itemId, clothingData, imageFile);
      await fetchClothingItems();
      return true;
    } catch (error) {
      console.error("Error updating clothing item:", error);
      throw error;
    }
  };

  const deleteClothing = async (itemId) => {
    if (!currentUser) return;
    
    try {
      await deleteClothingItem(currentUser.uid, itemId);
      await fetchClothingItems();
      return true;
    } catch (error) {
      console.error("Error deleting clothing item:", error);
      throw error;
    }
  };

  const saveOutfitCombination = async (outfitData) => {
    if (!currentUser) return;
    
    try {
      const outfitId = await saveOutfit(currentUser.uid, outfitData);
      await fetchSavedOutfits();
      return outfitId;
    } catch (error) {
      console.error("Error saving outfit:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchClothingItems();
      fetchSavedOutfits();
    } else {
      setClothingItems([]);
      setSavedOutfits([]);
    }
  }, [currentUser]);

  const value = {
    clothingItems,
    savedOutfits,
    loading,
    addClothing,
    updateClothing,
    deleteClothing,
    saveOutfitCombination,
    fetchClothingItems,
    fetchSavedOutfits
  };

  return (
    <ClothingContext.Provider value={value}>
      {children}
    </ClothingContext.Provider>
  );
};