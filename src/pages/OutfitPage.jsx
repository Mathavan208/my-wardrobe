// src/pages/OutfitPage.jsx
import { motion } from "framer-motion";
import OutfitSuggestion from "../components/outfit/OutfitSuggestion";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const OutfitPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <motion.main
        className="flex-grow container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <OutfitSuggestion />
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default OutfitPage;