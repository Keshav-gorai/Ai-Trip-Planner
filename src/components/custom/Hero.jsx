import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="flex flex-col items-center text-center px-4 sm:px-8 md:px-20 lg:px-40 xl:px-60 gap-6">
    <h1 className="font-extrabold text-[28px] sm:text-[36px] md:text-[40px] lg:text-[50px] text-center mt-8">
      <span className="text-orange-400">Discover your next Adventure with:</span> <br /> 
      Ai-Trip-Planner
    </h1>
    <p className="text-[16px] sm:text-[18px] md:text-[20px] text-green-800">
      Your personal Trip Planner and travel curator, creating custom itineraries tailored to your interests and budget.
    </p>
    <Link to={'/create-trip'}>
      <Button className="px-6 py-3 text-sm sm:text-base md:text-lg">
        Get Started For Free
      </Button>
    </Link>
    <img 
      src="/New Website.png" 
      alt="Ai-Trip-Planner" 
      className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mt-2 border-black"
    />
  </div>
  

  )
}

export default Hero;
