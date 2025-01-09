 import React, { useEffect, useState } from 'react'
import { fetchLocationDetailsAndPhotos } from '../../service/GlobalApi';
import { Link } from 'react-router-dom';
 
 function UsertripsCardItem({trip}) {

    const [isLoading, setIsLoading] = useState(true);
    const [unsplashPhotos, setUnsplashPhotos] = useState([]);
    const [locationDetails, setLocationDetails] = useState(null);
    const [photoUrl, setPhotoUrl] = useState("");
      
    
      
    

    useEffect(() => {
        if (trip?.userSelection?.Location) {
          fetchLocationDetails(trip.userSelection.Location);
        }
      }, [trip]);
    
      const fetchLocationDetails = async (location) => {
        try {
          setIsLoading(true);
          const { locationData, unsplashPhotos } = await fetchLocationDetailsAndPhotos(location);
    
          setLocationDetails(locationData[0]);
          setUnsplashPhotos(unsplashPhotos);
    
          // Set the first image as the initial banner photo
          if (unsplashPhotos.length > 0) {
            setPhotoUrl(unsplashPhotos[2].urls.full);
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
    <Link to ={'/view-trip/' + trip.Id} >
     <div className='hover:scale-105 transition-all'>
        <img src={photoUrl || "aaron.jpg"} className="object-cover rounded-xl h-[300px] w-full"/>
        <div>
            <h2 className='font-bold font-serif text-lg text-gray-700'>{trip?.userSelection?.Location}</h2>
            <h2 className='text-sm text-gray-500 ml-2'> {trip?.userSelection?.noOfDays} days trip with {trip?.userSelection?.budget} budget</h2>
        </div>
     </div>
    </Link>
   )
 }
 
 export default UsertripsCardItem
 