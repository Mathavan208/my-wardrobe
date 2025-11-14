// src/utils/outfitGenerator.js

const GEMINI_API_KEY = "AIzaSyAR_1_PeHNAgE7_6B8Q0R-LC5nk3DUe4Fc" // Store safely in .env file

export const generateOutfitWithGemini = async (clothingItems) => {
  try {
    // Construct a text prompt dynamically
    const prompt = `
      Suggest a stylish outfit using the following clothing items:
      ${clothingItems.map(item => `${item.name} (${item.type})`).join(', ')}.
      Provide a JSON response with fields:
      top, bottom, shoes, name, description, and occasion.
    `;

    // Gemini API call
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract model text response
    const modelText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    // Try to parse JSON from the model response
    let parsedOutfit;
    try {
      parsedOutfit = JSON.parse(modelText);
    } catch {
      // If not valid JSON, wrap it manually
      parsedOutfit = {
        name: "AI Generated Outfit",
        description: modelText,
      };
    }

    return parsedOutfit;
  } catch (error) {
    console.error("Error generating outfit:", error);
    return {
      name: "Default Outfit",
      description: "A simple fallback outfit due to API issue.",
    };
  }
};
