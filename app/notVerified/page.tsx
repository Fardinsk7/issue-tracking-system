import LogoutButton from '@/components/logout'
import { Button } from '@/components/ui/button'
import React from 'react'

const NotVerified = () => {
  return (
    <div className='flex justify-center items-center h-[100vh]'>
      Please Wait until you will get verified by the admin <LogoutButton/>
    </div>
  )
}

export default NotVerified
