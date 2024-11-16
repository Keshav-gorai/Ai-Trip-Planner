import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col text-center mx-80 gap-6'>
    <h1 className='font-extrabold text-[50px] text-center mt-15'>
      <span className='text-orange-400'> Discover your next Adventure with:</span> <br /> Ai-Trip-Planner</h1>
      <p className='text-[20px] text-green-800'>Your personal Trip Planner and travel curator, creating custom itinerories tailored to your interests and budget.</p>
      <Link to={'/create-trip'}>
        <Button>Get Started For-Free</Button>
      </Link>
    </div>

  )
}

export default Hero
