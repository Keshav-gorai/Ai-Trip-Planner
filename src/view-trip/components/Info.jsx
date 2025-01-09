import React, { useEffect, useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { fetchLocationDetailsAndPhotos } from "../../service/GlobalApi";

function Info({ trip }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [unsplashPhotos, setUnsplashPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  

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
        setPhotoUrl(unsplashPhotos[1].urls.full);
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
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[350px] w-full object-cover bg-gray-200 rounded">
          <p>Loading...</p>
        </div>
      ) : (
        <img
          src={photoUrl || "aaron.jpg"}
          className="h-[350px] w-full object-cover rounded"
          alt={trip?.userSelection?.Location || "Location image"}
        />
      )}
      <div>
        <div className="my-4 flex justify-between">
          <h2 className="font-bold text-2xl">{trip?.userSelection?.Location}</h2>
          <Button>
            <FaShareAlt />
          </Button>
        </div>
        <div className="flex gap-5">
          <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-600 text-xs md:text-lg">
            📅 {trip?.userSelection?.noOfDays} Days
          </h2>
          <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-600 text-xs md:text-lg">
            🪙 {trip?.userSelection?.budget} Budget
          </h2>
          <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-600 text-xs md:text-lg">
            🧑🏻‍🤝‍🧑🏻 No. of travellers: {trip?.userSelection?.traveller}
          </h2>
        </div>
        {unsplashPhotos.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold text-lg text-orange-700">Photos Related to this Place</h3>
            <h4 className="font-bold text-md text-gray-400 m-4">Select any Photo you want to display as a main image</h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => handlePhotoChange(photo.urls.regular)} // Change the banner photo
                  className="cursor-pointer transition-transform transform hover:scale-105"
                >
                  <img
                    src={photo.urls.small}
                    alt={photo.alt_description || "Unsplash photo"}
                    className="h-[200px] w-full object-cover rounded shadow-lg"
                    loading="lazy" // Enable lazy loading
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for viewing HD photos */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative">
            <img
              src={selectedPhoto}
              alt="HD Photo"
              className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white text-black p-1 rounded-full shadow"
              onClick={() => setSelectedPhoto(null)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Info;
