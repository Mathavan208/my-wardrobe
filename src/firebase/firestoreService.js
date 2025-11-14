// src/firebase/firestoreService.js
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

// Helper function to convert image file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// User operations
export const createUserDocument = async (user) => {
  if (!user) return;
  
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  
  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating user document", error);
      throw error;
    }
  }
};

// Clothing operations
export const addClothingItem = async (userId, clothingData, imageFile) => {
  try {
    let imageBase64 = "";
    
    if (imageFile) {
      try {
        // Convert image to base64 string
        imageBase64 = await fileToBase64(imageFile);
      } catch (uploadError) {
        console.error("Error processing image:", uploadError);
        throw new Error("Failed to process image. Please try again.");
      }
    }
    
    const clothingRef = doc(collection(db, "users", userId, "clothing"));
    await setDoc(clothingRef, {
      ...clothingData,
      imageBase64,
      createdAt: serverTimestamp(),
    });
    
    return clothingRef.id;
  } catch (error) {
    console.error("Error adding clothing item:", error);
    throw error;
  }
};

export const getClothingItems = async (userId) => {
  try {
    const q = query(collection(db, "users", userId, "clothing"));
    const querySnapshot = await getDocs(q);
    
    const items = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert imageBase64 to imageUrl for consistency in the UI
      const item = { 
        id: doc.id, 
        ...data,
        imageUrl: data.imageBase64 || ""
      };
      items.push(item);
    });
    
    return items;
  } catch (error) {
    console.error("Error getting clothing items:", error);
    throw error;
  }
};

export const updateClothingItem = async (userId, itemId, clothingData, imageFile) => {
  try {
    let imageBase64 = clothingData.imageBase64 || "";
    
    if (imageFile) {
      try {
        // Convert image to base64 string
        imageBase64 = await fileToBase64(imageFile);
      } catch (uploadError) {
        console.error("Error processing image:", uploadError);
        throw new Error("Failed to process image. Please try again.");
      }
    }
    
    const itemRef = doc(db, "users", userId, "clothing", itemId);
    await updateDoc(itemRef, {
      ...clothingData,
      imageBase64,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error("Error updating clothing item:", error);
    throw error;
  }
};

export const deleteClothingItem = async (userId, itemId) => {
  try {
    const itemRef = doc(db, "users", userId, "clothing", itemId);
    await deleteDoc(itemRef);
    return true;
  } catch (error) {
    console.error("Error deleting clothing item:", error);
    throw error;
  }
};

// Outfit operations
export const saveOutfit = async (userId, outfitData) => {
  try {
    const outfitRef = doc(collection(db, "users", userId, "outfits"));
    await setDoc(outfitRef, {
      ...outfitData,
      createdAt: serverTimestamp(),
    });
    
    return outfitRef.id;
  } catch (error) {
    console.error("Error saving outfit:", error);
    throw error;
  }
};

export const getSavedOutfits = async (userId) => {
  try {
    const q = query(collection(db, "users", userId, "outfits"));
    const querySnapshot = await getDocs(q);
    
    const outfits = [];
    querySnapshot.forEach((doc) => {
      outfits.push({ id: doc.id, ...doc.data() });
    });
    
    return outfits;
  } catch (error) {
    console.error("Error getting saved outfits:", error);
    throw error;
  }
};