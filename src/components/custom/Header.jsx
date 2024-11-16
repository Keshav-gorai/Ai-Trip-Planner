import React from 'react'
import { Button } from '../ui/button'

function Header() {
  return (
    <div className='shadow-sm flex justify-between items-center py-3 px-3'>
      <img src = '/logo.svg'/>
      <div>
        <Button>Sign-in</Button> 
      </div>
      
    </div>
  )
}

export default Header
