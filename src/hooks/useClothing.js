// Example of using useClothing in a component
import { useClothing } from '../hooks/useClothing';

const ClothingList = () => {
  const { clothingItems, loading, addClothing } = useClothing();
  
  const handleAddItem = async (itemData) => {
    try {
      await addClothing(itemData, imageFile);
      // Show success message
    } catch (error) {
      console.error('Failed to add item:', error);
      // Show error message
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {clothingItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={() => handleAddItem(newItem)}>Add Item</button>
    </div>
  );
};