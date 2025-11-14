// src/components/clothing/ClothingList.jsx
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClothing } from "../../context/ClothingContext";
import ClothingCard from "./ClothingCard";
import ClothingForm from "./ClothingForm";
import Button from "../ui/Button";
import { FiPlus, FiFilter, FiSearch } from "react-icons/fi";
import LoadingSpinner from "../common/LoadingSpinner";
import ClothingDetailsModal from "./ClothigDetailsModal";
const ClothingList = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState({ type: "all", favorite: false });
  const { clothingItems, loading } = useClothing();

  // Search state with immediate clear support
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimeoutRef = useRef(null);

  // Details panel state
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Debounce query (with immediate clear support)
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!query.trim()) {
      setDebouncedQuery("");
      return;
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query]);

  // Memoized filter and search logic
  const filteredItems = useMemo(() => {
    if (!clothingItems || clothingItems.length === 0) return [];
    let result = [...clothingItems];

    // Search logic (OR search for flexibility)
    if (debouncedQuery) {
      const queryParts = debouncedQuery.split(/\s+/).filter(Boolean);
      result = result.filter(item => {
        const searchableText = [
          item.name || "",
          item.brand || "",
          item.color || "",
          item.type || "",
          item.style || "",
          item.pantsType || "",
          item.shoesType || ""
        ].join(" ").toLowerCase();
        return queryParts.some(part => searchableText.includes(part));
      });
    }

    // Type filter
    if (filter.type !== "all") {
      result = result.filter(item => item.type === filter.type);
    }
    // Favorite filter
    if (filter.favorite) {
      result = result.filter(item => item.favorite);
    }

    return result;
  }, [clothingItems, debouncedQuery, filter]);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };
  const itemVariants = {
    hidden: { y: 14, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 320, damping: 24 }
    }
  };

  // Handlers for details panel
  const openDetails = useCallback((item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
    document.documentElement.style.overflow = "hidden"; // Lock scroll
  }, []);

  const closeDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedItem(null);
    document.documentElement.style.overflow = ""; // Unlock scroll
  }, []);

  // ESC key listener for modal close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isDetailsOpen) closeDetails();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDetailsOpen, closeDetails]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header and Controls */}
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Wardrobe</h2>
        <div className="flex items-center w-full gap-2 sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 w-full sm:flex-none sm:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
              <FiSearch />
            </div>
            <input
              aria-label="Search wardrobe"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, brand, color..."
              className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {query && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setQuery("")}
              >
                ×
              </button>
            )}
          </div>
          {/* Type Filter */}
          <div className="relative">
            <select
              className="py-2 pl-4 pr-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="shirt">Shirts</option>
              <option value="tshirt">T-Shirts</option>
              <option value="pants">Pants</option>
              <option value="innerwear">Innerwear</option>
              <option value="shoes">Shoes</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
              <FiFilter />
            </div>
          </div>
          {/* Add Item */}
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center">
            <FiPlus className="mr-2" /> Add Item
          </Button>
        </div>
      </div>
      {/* Favorites toggle */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={filter.favorite}
            onChange={(e) => setFilter({ ...filter, favorite: e.target.checked })}
          />
          <span className="ml-2 text-gray-700">Show favorites only</span>
        </label>
      </div>
      {/* Results count and clear filter */}
      <div className="mb-4 text-sm text-gray-600">
        {filteredItems.length} of {clothingItems.length} items
        {(query || filter.type !== "all" || filter.favorite) && (
          <button
            type="button"
            className="ml-2 text-indigo-600 hover:text-indigo-800"
            onClick={() => {
              setQuery("");
              setFilter({ type: "all", favorite: false });
            }}
          >
            Clear filters
          </button>
        )}
      </div>
      {/* Empty / no-match messages */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-lg text-gray-500">
            {clothingItems.length === 0
              ? "Your wardrobe is empty. Add your first clothing item!"
              : debouncedQuery
                ? "No items match your search or filters."
                : "No items match your filters."}
          </p>
          {clothingItems.length === 0 && (
            <Button onClick={() => setIsFormOpen(true)}>
              <FiPlus className="mr-2" /> Add Your First Item
            </Button>
          )}
        </div>
      ) : (
        // --- AnimatePresence for grid items ---
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              >
                {/* ADD border for visualization */}
                <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                  <ClothingCard item={item} onClick={() => openDetails(item)} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      {/* Clothing form modal */}
      <ClothingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
      {/* Right side details panel */}
      <ClothingDetailsModal
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        item={selectedItem}
      />
    </div>
  );
};

export default ClothingList;
