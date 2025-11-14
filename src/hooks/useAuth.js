// Example of using useAuth in a component
import { useAuth } from '../hooks/useAuth';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login page
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  return (
    <div>
      <h1>Welcome, {currentUser.displayName}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};