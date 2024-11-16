import React, { useState } from 'react'

import LocationAutocomplete from './LocationAutocomplete';

function CreateTrip() {

  return (
    
    <div className='sm:px-8 md:px-32 lg:px-52 xl:px-28 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell me about your travel preferences </h2>
      <p className='mt-5 text-green-700 text-xl'>Just provide some basic information, and this trip planner app will generate a customized itinerary based on your preferences</p>
    <div>
        <div className='mx-14 mt-14'>
          <h2 className='text-xl font-bold'>Give a choice of your Destination!!</h2>
          <LocationAutocomplete />
        </div>
      </div>
      
    </div>
  )
}

export default CreateTrip