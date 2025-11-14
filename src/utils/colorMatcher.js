// src/utils/colorMatcher.js
export const getRandomColorCombinations = () => {
  const colorCombos = [
    {
      shirtColors: ['white', 'light blue', 'light gray'],
      pantColors: ['blue', 'black', 'gray'],
      shoeColors: ['brown', 'black', 'white'],
      occasion: 'casual',
      description: 'A classic casual combination that works for most informal occasions.'
    },
    {
      shirtColors: ['white', 'light blue', 'pink'],
      pantColors: ['navy', 'charcoal', 'khaki'],
      shoeColors: ['brown', 'black', 'oxford'],
      occasion: 'business casual',
      description: 'A professional yet relaxed look perfect for business casual environments.'
    },
    {
      shirtColors: ['black', 'white', 'gray'],
      pantColors: ['black', 'gray', 'navy'],
      shoeColors: ['black', 'white'],
      occasion: 'formal',
      description: 'An elegant and sophisticated combination for formal events.'
    },
    {
      shirtColors: ['red', 'blue', 'green', 'yellow'],
      pantColors: ['blue', 'black', 'gray'],
      shoeColors: ['white', 'black', 'colorful'],
      occasion: 'sporty',
      description: 'A vibrant and energetic outfit perfect for sports activities.'
    },
    {
      shirtColors: ['white', 'beige', 'pastel colors'],
      pantColors: ['beige', 'white', 'light blue'],
      shoeColors: ['brown', 'tan', 'white'],
      occasion: 'summer',
      description: 'A light and breezy combination perfect for warm summer days.'
    }
  ];
  
  return colorCombos;
};

export const getMatchingColors = (baseColor) => {
  const colorMatches = {
    'white': ['black', 'blue', 'gray', 'red', 'green', 'brown'],
    'black': ['white', 'gray', 'red', 'blue', 'yellow', 'pink'],
    'blue': ['white', 'gray', 'black', 'brown', 'yellow', 'orange'],
    'red': ['white', 'black', 'gray', 'blue', 'pink'],
    'green': ['white', 'brown', 'black', 'blue', 'yellow'],
    'yellow': ['blue', 'black', 'white', 'gray', 'green'],
    'pink': ['white', 'black', 'gray', 'blue'],
    'purple': ['white', 'black', 'gray', 'yellow'],
    'orange': ['blue', 'white', 'black', 'brown'],
    'brown': ['white', 'blue', 'green', 'beige'],
    'gray': ['white', 'black', 'blue', 'red', 'yellow', 'pink'],
    'beige': ['white', 'brown', 'blue', 'green', 'black'],
    'navy': ['white', 'beige', 'gray', 'yellow', 'red']
  };
  
  return colorMatches[baseColor.toLowerCase()] || ['white', 'black', 'gray'];
};