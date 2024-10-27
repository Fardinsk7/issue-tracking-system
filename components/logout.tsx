"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const LogoutButton = () => {
    const { toast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
 
    const handleLogout = async () => {
        if (isLoading) return
        
        setIsLoading(true)
        try {
            const response = await axios.post('/api/logout')
            
            if (response.data.status === "success") {
                toast({
                    title: "Success",
                    description: "Logged out successfully",
                    
                })
                // Redirect to login page
                router.push('/auth')
            }
        } catch (error) {
            console.error('Logout error:', error)
            toast({
                title: "Error",
                description: "Failed to logout. Please try again.",
                variant: "destructive",
            })
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Button 
                onClick={handleLogout} 
                className='ml-2 bg-accent'
                disabled={isLoading}
            >
                {isLoading ? 'Logging out...' : 'Logout'}
            </Button>
        </div>
    )
}

export default LogoutButton