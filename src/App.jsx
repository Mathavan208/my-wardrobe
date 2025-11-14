// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ClothingProvider } from "./context/ClothingContext";
import AuthPage from "./pages/AuthPage";
import WardrobePage from "./pages/WardrobePage";
import OutfitPage from "./pages/OutfitPage";
import LoadingSpinner from "./components/common/LoadingSpinner";

function AppRoutes() {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner size="xl" />;
  }
  
  return (
    <Routes>
      <Route 
        path="/auth" 
        element={currentUser ? <Navigate to="/wardrobe" /> : <AuthPage />} 
      />
      <Route 
        path="/wardrobe" 
        element={currentUser ? <WardrobePage /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/outfits" 
        element={currentUser ? <OutfitPage /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={currentUser ? "/wardrobe" : "/auth"} />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ClothingProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ClothingProvider>
    </AuthProvider>
  );
}

export default App;