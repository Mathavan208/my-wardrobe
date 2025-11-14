// src/components/outfit/OutfitSuggestion.jsx
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClothing } from "../../context/ClothingContext";
import Button from "../ui/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  FiRefreshCw,
  FiSave,
  FiStar,
  FiEye,
  FiMapPin,
  FiCalendar,
  FiX,
  FiThumbsUp,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiRepeat,
  FiFilter,
  FiSun,
  FiCloud,
  FiHeart,
  FiTrendingUp,
  FiClock,
  FiShoppingBag,
  FiZap
} from "react-icons/fi";

/**
 * Enhanced OutfitSuggestion Component
 * 
 * Features:
 * - Improved image handling with fallbacks and lazy loading
 * - Weather-based outfit recommendations
 * - Outfit popularity tracking
 * - Quick save functionality
 * - Advanced filtering options
 * - Outfit wear history
 * - AI-powered style recommendations
 * - Outfit shopping suggestions
 * - Improved responsive design
 */

const OutfitSuggestion = () => {
  const { clothingItems, saveOutfitCombination, savedOutfits, fetchSavedOutfits, loading: ctxLoading } = useClothing();

  // Component state
  const [suggestedOutfits, setSuggestedOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [showOutfitDetails, setShowOutfitDetails] = useState(false);
  const [showOccasionModal, setShowOccasionModal] = useState(false);
  const [occasion, setOccasion] = useState("");
  const [destination, setDestination] = useState("");
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [likedOutfits, setLikedOutfits] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'carousel'
  const [savedOutfitIds, setSavedOutfitIds] = useState(new Set());
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState("sunny");
  const [showWeatherFilter, setShowWeatherFilter] = useState(false);
  const [sortBy, setSortBy] = useState("score"); // 'score', 'popularity', 'recent'
  const [showQuickSaveToast, setShowQuickSaveToast] = useState(false);
  const [outfitHistory, setOutfitHistory] = useState([]);
  const containerRef = useRef(null);

  // Responsive items per page
  const [itemsPerPage, setItemsPerPage] = useState(12);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setItemsPerPage(6);
      else if (w < 1024) setItemsPerPage(8);
      else setItemsPerPage(12);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Color groups for compatibility
  const colorGroups = useMemo(() => ({
    neutral: ['black', 'white', 'gray', 'beige', 'tan', 'brown', 'navy'],
    warm: ['red', 'orange', 'yellow', 'pink', 'brown', 'tan'],
    cool: ['blue', 'green', 'purple', 'navy', 'teal'],
    vibrant: ['red', 'orange', 'yellow', 'pink', 'purple', 'green']
  }), []);

  // Occasion map
  const occasionMap = useMemo(() => ({
    casual: {
      tops: ['tshirt', 'shirt', 'polo'],
      bottoms: ['jeans', 'shorts', 'pants', 'casual'],
      shoes: ['sneakers', 'casual', 'sandals'],
      name: 'Casual Comfort',
      description: 'A relaxed and comfortable outfit perfect for everyday activities.'
    },
    formal: {
      tops: ['dress shirt', 'formal shirt', 'blazer'],
      bottoms: ['dress pants', 'trousers'],
      shoes: ['dress shoes', 'oxfords', 'loafers'],
      name: 'Formal Elegance',
      description: 'A sophisticated outfit suitable for formal events and professional settings.'
    },
    business: {
      tops: ['dress shirt', 'button-down', 'blazer'],
      bottoms: ['dress pants', 'slacks', 'chinos'],
      shoes: ['dress shoes', 'oxfords', 'loafers'],
      name: 'Business Professional',
      description: 'A polished outfit perfect for the office or business meetings.'
    },
    party: {
      tops: ['stylish shirt', 'fashion top', 'blazer'],
      bottoms: ['designer jeans', 'chinos', 'stylish pants'],
      shoes: ['fashionable shoes', 'stylish sneakers', 'boots'],
      name: 'Party Ready',
      description: 'A trendy outfit that will make you stand out at any social gathering.'
    },
    date: {
      tops: ['stylish shirt', 'fashion top', 'casual blazer'],
      bottoms: ['dark jeans', 'chinos', 'stylish pants'],
      shoes: ['fashionable shoes', 'stylish sneakers', 'boots'],
      name: 'Date Night Charm',
      description: 'A stylish and romantic outfit perfect for a special evening out.'
    },
    wedding: {
      tops: ['dress shirt', 'formal shirt', 'blazer'],
      bottoms: ['dress pants', 'trousers'],
      shoes: ['dress shoes', 'oxfords'],
      name: 'Wedding Guest',
      description: 'An elegant outfit appropriate for celebrating special moments.'
    },
    outdoor: {
      tops: ['casual shirt', 'tshirt', 'outdoor jacket'],
      bottoms: ['casual pants', 'jeans', 'shorts'],
      shoes: ['casual shoes', 'sneakers', 'outdoor shoes'],
      name: 'Outdoor Adventure',
      description: 'A practical and comfortable outfit for outdoor activities.'
    },
    sport: {
      tops: ['athletic shirt', 'sport tshirt', 'jersey'],
      bottoms: ['athletic pants', 'shorts', 'track pants'],
      shoes: ['athletic shoes', 'sneakers', 'running shoes'],
      name: 'Sport Active',
      description: 'A functional outfit designed for physical activities and sports.'
    }
  }), []);

  // Weather conditions
  const weatherMap = useMemo(() => ({
    sunny: {
      name: 'Sunny',
      icon: <FiSun className="text-yellow-500" />,
      recommendations: {
        tops: ['tshirt', 'shirt', 'polo', 'lightweight'],
        bottoms: ['shorts', 'light pants', 'linen'],
        shoes: ['sandals', 'sneakers', 'loafers']
      }
    },
    cloudy: {
      name: 'Cloudy',
      icon: <FiCloud className="text-gray-500" />,
      recommendations: {
        tops: ['shirt', 'light sweater', 'polo'],
        bottoms: ['jeans', 'chinos', 'casual pants'],
        shoes: ['sneakers', 'casual shoes']
      }
    },
    rainy: {
      name: 'Rainy',
      icon: <FiCloud className="text-blue-500" />,
      recommendations: {
        tops: ['shirt', 'sweater', 'jacket'],
        bottoms: ['jeans', 'pants', 'waterproof'],
        shoes: ['boots', 'waterproof shoes', 'sneakers']
      }
    }
  }), []);

  // Utility: normalize color string
  const normalizeColor = (c) => (c || "").toString().trim().toLowerCase();

  // Color compatibility
  const areColorsCompatible = (color1, color2) => {
    const c1 = normalizeColor(color1);
    const c2 = normalizeColor(color2);
    if (!c1 || !c2) return true;
    if (colorGroups.neutral.includes(c1) || colorGroups.neutral.includes(c2)) return true;
    for (const colors of Object.values(colorGroups)) {
      if (colors.includes(c1) && colors.includes(c2)) return true;
    }
    const complementaryPairs = [['blue', 'orange'], ['red', 'green'], ['purple', 'yellow']];
    if (complementaryPairs.some(([a,b]) => (c1===a && c2===b) || (c1===b && c2===a))) return true;
    return false;
  };

  // Scoring: color + occasion + weather
  const calculateOutfitScore = (top, bottom, shoes, targetOccasion, targetWeather) => {
    let score = 0;
    if (areColorsCompatible(top?.color, bottom?.color)) score += 25;
    if (shoes && areColorsCompatible(bottom?.color, shoes.color)) score += 25;

    if (targetOccasion && occasionMap[targetOccasion]) {
      const cfg = occasionMap[targetOccasion];
      if (cfg.tops.some(type => top?.type?.toLowerCase()?.includes(type.split(' ')[0]))) score += 20;
      if (cfg.bottoms.some(type => bottom?.type?.toLowerCase()?.includes(type.split(' ')[0]))) score += 20;
      if (shoes && cfg.shoes.some(type => shoes?.type?.toLowerCase()?.includes(type.split(' ')[0]))) score += 10;
    } else {
      score += 20;
    }

    // Weather bonus
    if (targetWeather && weatherMap[targetWeather]) {
      const weatherRec = weatherMap[targetWeather].recommendations;
      if (weatherRec.tops.some(type => top?.type?.toLowerCase()?.includes(type))) score += 5;
      if (weatherRec.bottoms.some(type => bottom?.type?.toLowerCase()?.includes(type))) score += 5;
      if (shoes && weatherRec.shoes.some(type => shoes?.type?.toLowerCase()?.includes(type))) score += 5;
    }

    return Math.min(100, Math.round(score));
  };

  // Create smart metadata
  const buildSmartMetadata = (top, bottom, shoes) => {
    const palette = [];
    [top, bottom, shoes].forEach(i => {
      if (!i) return;
      const c = i.color || i.colorName || i.colorHex || "";
      const n = normalizeColor(c);
      if (!n) return;
      if (!palette.includes(n)) palette.push(n);
    });

    const month = new Date().getMonth() + 1;
    let season = "Unknown";
    if ([12,1,2].includes(month)) season = "Winter";
    else if ([3,4,5].includes(month)) season = "Spring";
    else if ([6,7,8].includes(month)) season = "Summer";
    else if ([9,10,11].includes(month)) season = "Autumn";

    const styleTags = new Set();
    [top, bottom, shoes].forEach(i => {
      const t = (i?.type || "").toLowerCase();
      if (t.includes("jean") || t.includes("denim")) styleTags.add("casual");
      if (t.includes("dress") || t.includes("formal") || t.includes("blazer")) styleTags.add("formal");
      if (t.includes("sport") || t.includes("athletic")) styleTags.add("sport");
      if (t.includes("sneaker") || t.includes("sneakers")) styleTags.add("street");
    });

    const localTime = new Date().toISOString();

    return {
      palette,
      season,
      styleTags: Array.from(styleTags),
      localTime
    };
  };

  // Generate combinations
  const generateOutfits = useCallback((customOccasion = "", customDestination = "", customWeather = "sunny") => {
    if (!clothingItems || clothingItems.length < 2) {
      setError("Add at least two items to generate outfits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tops = clothingItems.filter(i => ['shirt','tshirt','blazer','top'].includes((i.type||'').toLowerCase()));
      const bottoms = clothingItems.filter(i => ['pants','jeans','shorts','trousers'].includes((i.type||'').toLowerCase()));
      const shoes = clothingItems.filter(i => (i.type||'').toLowerCase() === 'shoes');

      if (tops.length === 0 || bottoms.length === 0) {
        setError("You need at least one top and one bottom item to generate outfits.");
        setSuggestedOutfits([]);
        setLoading(false);
        return;
      }

      const targetOccasion = customOccasion || 'casual';
      const combos = [];

      for (const t of tops) {
        for (const b of bottoms) {
          let bestShoe = null;
          let bestShoeScore = -1;
          if (shoes.length === 0) {
            bestShoe = null;
            bestShoeScore = 0;
          } else {
            for (const s of shoes) {
              const sc = calculateOutfitScore(t, b, s, targetOccasion, customWeather);
              if (sc > bestShoeScore) {
                bestShoeScore = sc;
                bestShoe = s;
              }
            }
          }

          const totalScore = calculateOutfitScore(t, b, bestShoe, targetOccasion, customWeather);
          combos.push({ top: t, bottom: b, shoes: bestShoe, score: totalScore });
        }
      }

      combos.sort((a,b) => b.score - a.score);

      const newOutfits = combos.map((c, idx) => {
        const cfg = occasionMap[targetOccasion] || occasionMap['casual'];
        return {
          id: `outfit-${Date.now()}-${idx}`,
          name: `${cfg.name} ${idx + 1}`,
          description: cfg.description,
          occasion: targetOccasion,
          destination: customDestination || "",
          weather: customWeather,
          top: c.top,
          bottom: c.bottom,
          shoes: c.shoes,
          score: c.score,
          popularity: Math.floor(Math.random() * 100), // Simulated popularity
          aiDescriptions: {
            top: `This ${c.top?.color || c.top?.name || ''} ${c.top?.type || ''} pairs with ${c.bottom?.color || c.bottom?.name || ''}.`,
            bottom: `These ${c.bottom?.color || ''} ${c.bottom?.type || ''} go well with the top.`,
            shoes: c.shoes ? `Complete the look with these ${c.shoes?.color || ''} ${c.shoes?.type || ''}.` : ""
          },
          shoppingSuggestions: generateShoppingSuggestions(c.top, c.bottom, c.shoes)
        };
      });

      setSuggestedOutfits(newOutfits);
      setCurrentOutfitIndex(0);
      setCurrentPage(0);
      const existingHashes = new Set((savedOutfits || []).map(s => hashSavedSignature(s)));
      setSavedOutfitIds(existingHashes);
    } catch (err) {
      console.error(err);
      setError("Failed to generate outfits.");
    } finally {
      setLoading(false);
    }
  }, [clothingItems, occasionMap, weatherMap, savedOutfits]);

  // Generate shopping suggestions
  const generateShoppingSuggestions = (top, bottom, shoes) => {
    const suggestions = [];
    
    if (!shoes) {
      suggestions.push({
        type: "shoes",
        reason: "Complete your outfit with matching shoes",
        color: top?.color || bottom?.color || "neutral"
      });
    }
    
    if (top?.type?.toLowerCase().includes("tshirt") && !bottom?.type?.toLowerCase().includes("shorts")) {
      suggestions.push({
        type: "accessories",
        reason: "Add a watch or bracelet to elevate this casual look",
        color: "neutral"
      });
    }
    
    if (top?.type?.toLowerCase().includes("shirt") && !top?.type?.toLowerCase().includes("dress")) {
      suggestions.push({
        type: "outerwear",
        reason: "Consider a jacket or blazer for a more polished look",
        color: "neutral"
      });
    }
    
    return suggestions;
  };

  // Signature for saved outfits
  const signatureFromItems = (items) => {
    if (!items || items.length === 0) return "";
    const ids = items.map(i => i?.id || i?.itemId || "").filter(Boolean).sort();
    return ids.join("|");
  };

  const hashSavedSignature = (saved) => {
    if (!saved) return "";
    if (Array.isArray(saved.items)) return signatureFromItems(saved.items);
    const ids = [];
    ['top','bottom','shoes','shirt','pants'].forEach(k => {
      const v = saved[k];
      if (!v) return;
      if (typeof v === 'string') ids.push(v);
      else if (v.id) ids.push(v.id);
    });
    return ids.sort().join("|");
  };

  // Save outfit
  const saveOutfit = async (outfitArg = null, showToast = false) => {
    const targetOutfit = outfitArg ?? suggestedOutfits[currentOutfitIndex];
    if (!targetOutfit) return;

    setError("");
    setLoading(true);
    try {
      const snapshotItem = (it) => {
        if (!it) return null;
        const {
          id, name, brand, color, size, fit, type, imageUrl, imageBase64, material
        } = it;
        return {
          id,
          name: name || "",
          brand: brand || "",
          color: color || "",
          size: size || "",
          fit: fit || "",
          type: type || "",
          material: material || "",
          imageUrl: imageUrl || "",
          imageBase64: imageBase64 || ""
        };
      };

      const topSnap = snapshotItem(targetOutfit.top);
      const bottomSnap = snapshotItem(targetOutfit.bottom);
      const shoesSnap = snapshotItem(targetOutfit.shoes);

      const newSignature = signatureFromItems([topSnap, bottomSnap, shoesSnap]);
      const existingSignatures = new Set((savedOutfits || []).map(s => hashSavedSignature(s)));
      if (existingSignatures.has(newSignature)) {
        setError("This outfit (or identical) is already saved.");
        setLoading(false);
        return;
      }

      const smart = buildSmartMetadata(topSnap, bottomSnap, shoesSnap);

      const outfitDoc = {
        name: targetOutfit.name,
        description: targetOutfit.description,
        occasion: targetOutfit.occasion || occasion || "casual",
        destination: targetOutfit.destination || destination || "",
        weather: targetOutfit.weather || weatherCondition,
        items: [topSnap, bottomSnap].concat(shoesSnap ? [shoesSnap] : []),
        score: targetOutfit.score ?? 0,
        popularity: targetOutfit.popularity || 0,
        aiDescriptions: targetOutfit.aiDescriptions || {},
        shoppingSuggestions: targetOutfit.shoppingSuggestions || [],
        metadata: {
          ...smart,
          savedFromView: viewMode,
        },
        createdAt: new Date(),
      };

      const outfitId = await saveOutfitCombination(outfitDoc);
      setSavedOutfitIds(prev => new Set(prev).add(newSignature));
      
      // Add to outfit history
      setOutfitHistory(prev => [
        { id: outfitId, date: new Date(), name: targetOutfit.name },
        ...prev.slice(0, 9) // Keep only last 10
      ]);

      if (typeof fetchSavedOutfits === "function") {
        try { await fetchSavedOutfits(); } catch (_) { /* ignore */ }
      }

      setError("");
      setLoading(false);
      
      if (showToast) {
        setShowQuickSaveToast(true);
        setTimeout(() => setShowQuickSaveToast(false), 2000);
      }
      
      setSelectedOutfit({ ...outfitDoc, id: outfitId });
      setShowOutfitDetails(true);
    } catch (err) {
      console.error("saveOutfit error:", err);
      setError(err.message || "Failed to save outfit. Try again.");
      setLoading(false);
    }
  };

  // View outfit details
  const viewOutfitDetails = (outfit) => {
    if (outfit.items && Array.isArray(outfit.items)) {
      setSelectedOutfit(outfit);
      setShowOutfitDetails(true);
      return;
    }

    if (outfit.items && outfit.items.length) {
      const resolved = {
        ...outfit,
        items: outfit.items.map(si => {
          const found = clothingItems.find(ci => ci.id === si.id || ci.id === si.itemId);
          return found ? { ...found } : { ...si };
        })
      };
      setSelectedOutfit(resolved);
      setShowOutfitDetails(true);
      return;
    }

    setSelectedOutfit(outfit);
    setShowOutfitDetails(true);
  };

  // Toggle like
  const toggleLikeOutfit = (id) => {
    setLikedOutfits(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  // Share outfit
  const shareOutfit = async (outfit) => {
    try {
      const text = `${outfit.name} — ${outfit.description}\nItems: ${outfit.items?.map(i=>i.name).join(", ") || ""}`;
      if (navigator.share) {
        await navigator.share({ title: outfit.name, text });
      } else {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        alert("Outfit details copied to clipboard!");
      }
    } catch (err) {
      console.error("share error", err);
      alert("Could not share — copied to clipboard instead.");
    }
  };

  // Navigation for carousel
  const nextOutfit = () => {
    setCurrentOutfitIndex(i => {
      const next = Math.min(i + 1, suggestedOutfits.length - 1);
      const page = Math.floor(next / itemsPerPage);
      setCurrentPage(page);
      return next;
    });
  };
  
  const prevOutfit = () => {
    setCurrentOutfitIndex(i => {
      const prev = Math.max(i - 1, 0);
      setCurrentPage(Math.floor(prev / itemsPerPage));
      return prev;
    });
  };

  // Sort outfits
  const sortOutfits = (outfits, sortBy) => {
    const sorted = [...outfits];
    switch (sortBy) {
      case "score":
        return sorted.sort((a, b) => b.score - a.score);
      case "popularity":
        return sorted.sort((a, b) => b.popularity - a.popularity);
      case "recent":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(suggestedOutfits.length / itemsPerPage));
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, suggestedOutfits.length);
  const sortedOutfits = sortOutfits(suggestedOutfits, sortBy);
  const currentOutfits = sortedOutfits.slice(startIndex, endIndex);

  // Initial generation
  useEffect(() => {
    if (clothingItems?.length > 0) {
      generateOutfits();
    } else {
      setSuggestedOutfits([]);
    }
    const existing = new Set((savedOutfits || []).map(s => hashSavedSignature(s)));
    setSavedOutfitIds(existing);
  }, [clothingItems, generateOutfits, savedOutfits]);

  // Sync saved outfits
  useEffect(() => {
    const existing = new Set((savedOutfits || []).map(s => hashSavedSignature(s)));
    setSavedOutfitIds(existing);
  }, [savedOutfits]);

  // Type icons
  const getTypeIcon = (type) => {
    if (!type) return "👚";
    const t = type.toLowerCase();
    if (t.includes("shirt")) return "👔";
    if (t.includes("tshirt")) return "👕";
    if (t.includes("pant") || t.includes("jean") || t.includes("trouser")) return "👖";
    if (t.includes("short")) return "🩳";
    if (t.includes("shoe")) return "👟";
    if (t.includes("blazer") || t.includes("jacket")) return "🤵";
    return "👚";
  };

  // Check if outfit is already saved
  const isAlreadySaved = (outfit) => {
    const sig = signatureFromItems([outfit.top, outfit.bottom, outfit.shoes]);
    return savedOutfitIds.has(sig);
  };

  // Image component with proper handling
  const OutfitImage = ({ item, className = "" }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    useEffect(() => {
      setImageError(false);
      setImageLoaded(false);
    }, [item]);

    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    if (!item) {
      return (
        <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`}>
          <span className="text-2xl text-gray-400">No item</span>
        </div>
      );
    }

    if (imageError || (!item.imageUrl && !item.imageBase64)) {
      return (
        <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`}>
          <span className="text-3xl">{getTypeIcon(item.type)}</span>
        </div>
      );
    }

    return (
      <div className={`relative overflow-hidden bg-gray-100 rounded ${className}`}>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <LoadingSpinner size="sm" />
          </div>
        )}
        <img
          src={item.imageUrl || item.imageBase64}
          alt={item.name || item.type}
          className={`object-cover w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>
    );
  };

  // Render
  if (loading || ctxLoading) return <LoadingSpinner />;

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8" ref={containerRef}>
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md sm:p-6">
        <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Outfit Suggestions <span className="text-sm text-gray-500">({suggestedOutfits.length} combos)</span>
            </h2>
            <p className="mt-1 text-xs text-gray-500">Smart combinations from your wardrobe — save full snapshots (+metadata).</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setViewMode(vm => vm === 'grid' ? 'carousel' : 'grid'); }}>
                <FiGrid className="mr-1" /> {viewMode === 'grid' ? 'Carousel' : 'Grid'}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowFilterModal(true)}>
                <FiFilter className="mr-1" /> Filter
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowWeatherFilter(!showWeatherFilter)}>
                {weatherMap[weatherCondition].icon}
              </Button>

              <Button onClick={() => setShowOccasionModal(true)} disabled={clothingItems.length < 2} variant="outline" size="sm">
                <FiCalendar className="mr-1" /> Customize
              </Button>

              <Button onClick={() => generateOutfits(occasion, destination, weatherCondition)} disabled={clothingItems.length < 2} size="sm">
                <FiRefreshCw className="mr-1" /> Generate
              </Button>
            </div>
          </div>
        </div>

        {/* Weather filter */}
        {showWeatherFilter && (
          <div className="flex gap-2 p-3 mb-4 rounded-lg bg-blue-50">
            <span className="text-sm font-medium text-blue-800">Weather:</span>
            {Object.keys(weatherMap).map(key => (
              <button
                key={key}
                onClick={() => {
                  setWeatherCondition(key);
                  generateOutfits(occasion, destination, key);
                }}
                className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full ${
                  weatherCondition === key 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-blue-600 border border-blue-300'
                }`}
              >
                {weatherMap[key].icon} {weatherMap[key].name}
              </button>
            ))}
          </div>
        )}

        {/* Sort options */}
        <div className="flex gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          {['score', 'popularity', 'recent'].map(sort => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1 text-sm rounded-full ${
                sortBy === sort 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {sort === 'score' && 'Score'}
              {sort === 'popularity' && <><FiTrendingUp className="inline mr-1" />Popularity</>}
              {sort === 'recent' && <><FiClock className="inline mr-1" />Recent</>}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>
        )}

        {clothingItems.length < 2 ? (
          <div className="py-8 text-center text-gray-500">Add more items to your wardrobe to generate outfits!</div>
        ) : suggestedOutfits.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No suggestions yet — click Generate.</div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <>
                <div className={`grid gap-3 sm:gap-4 md:gap-6 ${
                  itemsPerPage === 6 ? 'grid-cols-1 sm:grid-cols-2' : 
                  itemsPerPage === 8 ? 'grid-cols-2 md:grid-cols-3' : 
                  'grid-cols-3 lg:grid-cols-4'
                }`}>
                  {currentOutfits.map((outfit, idx) => {
                    const absoluteIndex = startIndex + idx;
                    const alreadySaved = isAlreadySaved(outfit);
                    return (
                      <motion.div key={outfit.id}
                        className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 250, damping: 20 }}
                      >
                        <div className="p-3 sm:p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="w-2/3">
                              <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{outfit.name}</h3>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <FiStar className="mr-1 text-yellow-400" /> Score: {outfit.score}/100
                                {outfit.popularity && (
                                  <>
                                    <FiTrendingUp className="ml-2 mr-1 text-green-500" /> {outfit.popularity}%
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleLikeOutfit(outfit.id)}
                                className={`p-1 rounded-full transition-colors ${
                                  likedOutfits.has(outfit.id) 
                                    ? 'bg-red-50 text-red-500' 
                                    : 'bg-gray-50 text-gray-400 hover:text-red-500'
                                }`}
                                aria-label="Like"
                                title="Like"
                              >
                                <FiHeart size={14} />
                              </button>
                              <button
                                onClick={() => shareOutfit(outfit)}
                                className="p-1 text-gray-400 transition-colors rounded-full bg-gray-50 hover:text-blue-500"
                                aria-label="Share"
                                title="Share"
                              >
                                <FiShare2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1 mb-3">
                            <OutfitImage item={outfit.top} className="h-20" />
                            <OutfitImage item={outfit.bottom} className="h-20" />
                            <OutfitImage item={outfit.shoes} className="h-20" />
                          </div>

                          <div className="flex items-center justify-between">
                            <Button variant="outline" size="sm" onClick={() => viewOutfitDetails(outfit)}>
                              <FiEye className="mr-1" /> View
                            </Button>

                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => { 
                                  setCurrentOutfitIndex(absoluteIndex); 
                                  saveOutfit(outfit, true); 
                                }}
                                disabled={alreadySaved}
                                className={alreadySaved ? "bg-green-50 text-green-600 border-green-200" : ""}
                              >
                                <FiSave className="mr-1" /> {alreadySaved ? "Saved" : "Save"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">Showing {startIndex + 1}-{endIndex} of {suggestedOutfits.length}</div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { if (currentPage > 0) setCurrentPage(currentPage - 1); }} 
                        disabled={currentPage === 0}
                      >
                        <FiChevronLeft className="mr-1" /> Prev
                      </Button>
                      {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = i;
                        else if (currentPage < 3) pageNum = i;
                        else if (currentPage >= totalPages - 3) pageNum = totalPages - 5 + i;
                        else pageNum = currentPage - 2 + i;
                        return (
                          <button 
                            key={i} 
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-full text-xs transition-colors ${
                              pageNum === currentPage 
                                ? "bg-indigo-600 text-white" 
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1); }} 
                        disabled={currentPage >= totalPages - 1}
                      >
                        Next <FiChevronRight className="ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Carousel view
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">Carousel view — swipe or use arrows</div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { 
                        setCurrentOutfitIndex(0); 
                        setCurrentPage(0); 
                      }}
                    >
                      <FiRepeat className="mr-1" />Start
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => saveOutfit(suggestedOutfits[currentOutfitIndex], true)} 
                      disabled={isAlreadySaved(suggestedOutfits[currentOutfitIndex])}
                    >
                      <FiSave className="mr-1" /> Save
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    className="p-2 transition-shadow bg-white rounded-full shadow-md hover:shadow-lg" 
                    onClick={prevOutfit} 
                    disabled={currentOutfitIndex === 0}
                  >
                    <FiChevronLeft />
                  </button>

                  <div className="flex-1">
                    <AnimatePresence initial={false} mode="wait">
                      {suggestedOutfits[currentOutfitIndex] && (
                        <motion.div 
                          key={suggestedOutfits[currentOutfitIndex].id}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 bg-white rounded-lg shadow-md"
                        >
                          <div className="flex flex-col gap-4 md:flex-row">
                            <div className="grid grid-cols-1 gap-2 md:w-1/3">
                              <OutfitImage item={suggestedOutfits[currentOutfitIndex].top} className="h-48" />
                              <OutfitImage item={suggestedOutfits[currentOutfitIndex].bottom} className="h-28" />
                              {suggestedOutfits[currentOutfitIndex].shoes && (
                                <OutfitImage item={suggestedOutfits[currentOutfitIndex].shoes} className="h-28" />
                              )}
                            </div>

                            <div className="md:flex-1">
                              <h3 className="text-lg font-semibold">{suggestedOutfits[currentOutfitIndex].name}</h3>
                              <p className="my-2 text-sm text-gray-600">{suggestedOutfits[currentOutfitIndex].description}</p>
                              <div className="mb-3 text-sm text-gray-600">
                                Occasion: <span className="font-medium capitalize">{suggestedOutfits[currentOutfitIndex].occasion}</span>
                                {suggestedOutfits[currentOutfitIndex].destination && (
                                  <> • <FiMapPin className="inline-block ml-2 mr-1" />{suggestedOutfits[currentOutfitIndex].destination}</>
                                )}
                                <div className="flex items-center mt-1">
                                  {weatherMap[suggestedOutfits[currentOutfitIndex].weather || weatherCondition].icon}
                                  <span className="ml-1 capitalize">{suggestedOutfits[currentOutfitIndex].weather || weatherCondition}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm text-gray-600">
                                  <FiStar className="inline mr-1 text-yellow-400" /> Score: {suggestedOutfits[currentOutfitIndex].score}/100
                                </span>
                                {suggestedOutfits[currentOutfitIndex].popularity && (
                                  <span className="text-sm text-gray-600">
                                    <FiTrendingUp className="inline mr-1 text-green-500" /> {suggestedOutfits[currentOutfitIndex].popularity}% popular
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <Button 
                                  onClick={() => viewOutfitDetails(suggestedOutfits[currentOutfitIndex])} 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <FiEye className="mr-1" /> View
                                </Button>
                                <Button 
                                  onClick={() => saveOutfit(suggestedOutfits[currentOutfitIndex], true)} 
                                  size="sm" 
                                  disabled={isAlreadySaved(suggestedOutfits[currentOutfitIndex])}
                                >
                                  <FiSave className="mr-1" />{isAlreadySaved(suggestedOutfits[currentOutfitIndex]) ? "Saved" : "Save"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    className="p-2 transition-shadow bg-white rounded-full shadow-md hover:shadow-lg" 
                    onClick={nextOutfit} 
                    disabled={currentOutfitIndex >= suggestedOutfits.length - 1}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Saved outfits */}
      <div className="p-4 mt-6 bg-white rounded-lg shadow-md sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Saved Outfits</h3>
          <div className="text-sm text-gray-500">{(savedOutfits || []).length} saved</div>
        </div>

        {(savedOutfits || []).length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedOutfits.map((o) => (
              <motion.div 
                key={o.id} 
                className="p-4 transition-shadow border rounded-lg shadow-sm bg-gray-50 hover:shadow-md" 
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{o.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{o.description}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(o.createdAt?.seconds ? o.createdAt.seconds * 1000 : o.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  {(o.items || []).slice(0,3).map((it, i) => (
                    <OutfitImage key={i} item={it} className="h-20" />
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500 capitalize">{o.occasion}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => viewOutfitDetails(o)}>
                      <FiEye className="mr-1" />View
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">No saved outfits yet. Save your favorite combinations to see them here.</div>
        )}
      </div>

      {/* Outfit history */}
      {outfitHistory.length > 0 && (
        <div className="p-4 mt-6 bg-white rounded-lg shadow-md sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Recent Outfits</h3>
            <div className="text-sm text-gray-500">{outfitHistory.length} recent</div>
          </div>

          <div className="space-y-2">
            {outfitHistory.map((outfit, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <FiClock className="mr-2 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-800">{outfit.name}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(outfit.date).toLocaleDateString()} at {new Date(outfit.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => viewOutfitDetails(outfit)}>
                  <FiEye className="mr-1" />View
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div 
              initial={{ y: 20 }} 
              animate={{ y: 0 }} 
              exit={{ y: 20 }} 
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filter Options</h3>
                <button onClick={() => setShowFilterModal(false)} className="text-gray-500">
                  <FiX />
                </button>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">Sort by</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="score">Score</option>
                  <option value="popularity">Popularity</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">Weather</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(weatherMap).map(key => (
                    <button
                      key={key}
                      onClick={() => setWeatherCondition(key)}
                      className={`flex items-center justify-center gap-1 p-2 text-sm rounded ${
                        weatherCondition === key 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {weatherMap[key].icon} {weatherMap[key].name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowFilterModal(false)}>Cancel</Button>
                <Button onClick={() => { 
                  generateOutfits(occasion, destination, weatherCondition); 
                  setShowFilterModal(false); 
                }}>
                  Apply
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Occasion modal */}
      <AnimatePresence>
        {showOccasionModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div 
              initial={{ y: 20 }} 
              animate={{ y: 0 }} 
              exit={{ y: 20 }} 
              className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Customize your outfit</h3>
                <button onClick={() => setShowOccasionModal(false)} className="text-gray-500">
                  <FiX />
                </button>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">Occasion</label>
                <select 
                  value={occasion} 
                  onChange={(e) => setOccasion(e.target.value)} 
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select</option>
                  {Object.keys(occasionMap).map(k => (
                    <option key={k} value={k}>{occasionMap[k].name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">Where are you going?</label>
                <input 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)} 
                  className="w-full px-3 py-2 border rounded" 
                  placeholder="Office, Beach, Wedding..." 
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-700">Weather</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(weatherMap).map(key => (
                    <button
                      key={key}
                      onClick={() => setWeatherCondition(key)}
                      className={`flex items-center justify-center gap-1 p-2 text-sm rounded ${
                        weatherCondition === key 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {weatherMap[key].icon} {weatherMap[key].name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowOccasionModal(false)}>Cancel</Button>
                <Button onClick={() => { 
                  generateOutfits(occasion, destination, weatherCondition); 
                  setShowOccasionModal(false); 
                }}>
                  Apply & Generate
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outfit details modal */}
      <AnimatePresence>
        {showOutfitDetails && selectedOutfit && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div 
              initial={{ y: 20 }} 
              animate={{ y: 0 }} 
              exit={{ y: 20 }} 
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 overflow-auto max-h-[90vh]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedOutfit.name}</h3>
                  <p className="text-sm text-gray-600">{selectedOutfit.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Occasion: <span className="font-medium">{selectedOutfit.occasion}</span>
                    {selectedOutfit.destination && (
                      <> • <FiMapPin className="inline-block mx-1" /> {selectedOutfit.destination}</>
                    )}
                    {selectedOutfit.weather && (
                      <> • {weatherMap[selectedOutfit.weather].icon} <span className="capitalize">{selectedOutfit.weather}</span></>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { shareOutfit(selectedOutfit); }}>
                    Share
                  </Button>
                  <Button onClick={() => { saveOutfit(selectedOutfit); }}>
                    Save
                  </Button>
                  <button onClick={() => setShowOutfitDetails(false)} className="p-2 text-gray-500">
                    <FiX />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
                {selectedOutfit.items ? selectedOutfit.items.map((it, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gray-50">
                    <h4 className="mb-2 font-medium">{it.name || it.type}</h4>
                    <OutfitImage item={it} className="h-40 mb-3" />
                    <p className="text-sm text-gray-600">{it.brand}</p>
                    <p className="mt-1 text-xs text-gray-500">{it.color} • {it.fit || it.size || ""}</p>
                  </div>
                )) : (
                  <>
                    {selectedOutfit.top && (
                      <div className="p-4 rounded-lg bg-gray-50">
                        <h4 className="mb-2 font-medium">{selectedOutfit.top.name}</h4>
                        <OutfitImage item={selectedOutfit.top} className="h-40 mb-3" />
                      </div>
                    )}
                    {selectedOutfit.bottom && (
                      <div className="p-4 rounded-lg bg-gray-50">
                        <h4 className="mb-2 font-medium">{selectedOutfit.bottom.name}</h4>
                        <OutfitImage item={selectedOutfit.bottom} className="h-40 mb-3" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Shopping suggestions */}
              {selectedOutfit.shoppingSuggestions && selectedOutfit.shoppingSuggestions.length > 0 && (
                <div className="p-4 mt-6 rounded bg-blue-50">
                  <h5 className="flex items-center text-sm font-medium text-blue-800">
                    <FiShoppingBag className="mr-2" /> Shopping Suggestions
                  </h5>
                  <div className="mt-2 space-y-2">
                    {selectedOutfit.shoppingSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="p-2 bg-white rounded">
                        <p className="text-sm font-medium capitalize">{suggestion.type}</p>
                        <p className="text-xs text-gray-600">{suggestion.reason}</p>
                        <Button variant="outline" size="sm" className="mt-1">
                          <FiZap className="mr-1" /> Shop {suggestion.color} {suggestion.type}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {selectedOutfit.metadata && (
                <div className="p-4 mt-6 rounded bg-gray-50">
                  <h5 className="text-sm font-medium">Outfit Metadata</h5>
                  <div className="mt-2 text-xs text-gray-600">
                    Season: {selectedOutfit.metadata.season} • Time: {selectedOutfit.metadata.localTime}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    Palette: {selectedOutfit.metadata.palette?.join(", ") || "—"}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    Style tags: {(selectedOutfit.metadata.styleTags || []).join(", ") || "—"}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick save toast */}
      <AnimatePresence>
        {showQuickSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed z-50 px-4 py-2 text-white bg-green-600 rounded-lg shadow-lg bottom-4 right-4"
          >
            <div className="flex items-center">
              <FiSave className="mr-2" />
              Outfit saved successfully!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OutfitSuggestion;