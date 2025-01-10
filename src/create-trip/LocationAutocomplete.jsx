import React, { useState } from 'react';


const LocationAutocomplete = ({onSelect}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      // Fetch autocomplete suggestions from LocationIQ
      fetch(`https://us1.locationiq.com/v1/autocomplete.php?key=pk.116f5f101f37c71ab287a30325be3c80&q=${value}&format=json`)
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data);
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
        });
    } else {
      setSuggestions([]);
    }
  };

  // Function to handle selection of a suggestion
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.display_name); // Set the selected suggestion in the input field
    setSuggestions([]); // Clear suggestions after selection
    onSelect(suggestion.display_name); //Notify the parent
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a location"
        className=' w-full p-2 mt-2 rounded-md border-2 focus:ring focus:ring-green-500 border-gray-300'
      />
      {suggestions.length > 0 && (
        <ul className='cursor-pointer'>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)} className='p-1'>
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
