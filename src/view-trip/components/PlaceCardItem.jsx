import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLocationDetailsAndPhotos } from '../../service/GlobalApi';

function PlaceCardItem({place}) {
   const [locationDetails, setLocationDetails] = useState(null);
        const [photoUrl, setPhotoUrl] = useState("");
        const [unsplashPhotos, setUnsplashPhotos] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        
      
        useEffect(() => {
          if (place.place_name) {
            fetchLocationDetails(place.place_name);
          }
        }, [place]);
      
        const fetchLocationDetails = async (location) => {
          try {
            setIsLoading(true);
            const { locationData, unsplashPhotos } = await fetchLocationDetailsAndPhotos(location);
      
            setLocationDetails(locationData[0]);
            setUnsplashPhotos(unsplashPhotos);
      
            // Set the first image as the initial banner photo
            if (unsplashPhotos.length > 0) {
              setPhotoUrl(unsplashPhotos[0].urls.full);
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
    <Link  to={
        "https://www.google.com/maps/search/?api=1&query=" +
        place?.place_name 
      } target="_blank" >
    <div className='border rounded-xl p-3 mt-2 flex gap-6 hover:scale-105 transition-all cursor-pointer hover:shadow-lg'>
      <img src={photoUrl} className='h-[130px] w-[110px] object-cover rounded-xl ' />
      <div>
      <h2 className='font-medium hover:underline '>{place.place_name}</h2>
      <h2 className='flex flex-col '> 🕔 {place.time_to_travel} </h2>
      <p className='mt-1 text-gray-500 text-sm'>{place.place_details}</p>
      </div>
    </div>
    </Link>
  )

}

export default PlaceCardItem
