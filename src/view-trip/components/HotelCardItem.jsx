import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLocationDetailsAndPhotos } from "../../service/GlobalApi";

function HotelCardItem({ hotel }) {
    const [locationDetails, setLocationDetails] = useState(null);
      const [photoUrl, setPhotoUrl] = useState("");
      const [unsplashPhotos, setUnsplashPhotos] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      
    
      useEffect(() => {
        if (hotel?.hotel_name) {
          fetchLocationDetails(hotel?.hotel_name);
        }
      }, [hotel]);
    
      const fetchLocationDetails = async (location) => {
        try {
          setIsLoading(true);
          const { locationData, unsplashPhotos } = await fetchLocationDetailsAndPhotos(location);
    
          setLocationDetails(locationData[0]);
          setUnsplashPhotos(unsplashPhotos);
    
          // Set the first image as the initial banner photo
          if (unsplashPhotos.length > 0) {
            setPhotoUrl(unsplashPhotos[3].urls.full);
          }
        } catch (error) {
          console.error("Error fetching location details and photos:", error);
        } finally {
          setIsLoading(false);
        }
      };
    
      const handlePhotoChange = (url) => {
        setPhotoUrl(url);  // Change the banner photo when a thumbnail is clicked
      };
    
      // Remove the current banner photo from the list of thumbnails
      const filteredPhotos = unsplashPhotos.filter((photo) => photo.urls.regular !== photoUrl);
    
  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        hotel?.hotel_name +
        "," +
        hotel?.hotel_address
      }
      target="_blank"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img src= {photoUrl} className="rounded-xl h-[250px] w-full object-cover" />
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium hover:underline"> {hotel?.hotel_name}</h2>
          <h2 className="text-xs text-gray-600">📍 {hotel?.hotel_address}</h2>
          <h2 className="text-xs text-gray-600">
            🪙 {hotel?.price_per_night || "N/A"}
          </h2>
          <h2 className="text-sm text-gray-600">★ {hotel?.rating} stars</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
