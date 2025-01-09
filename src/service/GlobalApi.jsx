import axios from "axios";

const UNSPLASH_API_KEY = import.meta.env.VITE_UNPLASH_API_KEY;
const UNSPLASH_BASE_URL = 'https://api.unsplash.com/search/photos';

// Function to fetch photos from Unsplash
export const getUnsplashPhotos = async (query) => {
  try {
    const response = await axios.get(UNSPLASH_BASE_URL, {
      params: {
        query,
        client_id: UNSPLASH_API_KEY,
        per_page: 10,
      },
    });
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching Unsplash photos:", error);
    throw error;
  }
};

// Combined function to fetch location details and photos
export const fetchLocationDetailsAndPhotos = async (location) => {
  try {
    // Mock location data (replace with actual location fetching logic if needed)
    const locationData = [{ lat: 40.7128, lon: -74.0060, name: location }];

    // Fetch Unsplash photos using the location name
    const unsplashPhotos = await getUnsplashPhotos(location);
    return { locationData, unsplashPhotos };
  } catch (error) {
    console.error("Error fetching location details and photos:", error);
    throw error;
  }
};
