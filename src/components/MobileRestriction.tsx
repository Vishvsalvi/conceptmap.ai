"use client"

import React, { useState, useEffect } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MobileRestrictionProps {
  children: React.ReactNode
}

const MobileRestriction: React.FC<MobileRestrictionProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      // Check both user agent and screen size
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isSmallScreen = window.innerWidth <= 768
      
      setIsMobile(isMobileUserAgent || isSmallScreen)
      setIsLoading(false)
    }

    checkDevice()
    
    // Listen for window resize to handle dynamic screen size changes
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 768
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      setIsMobile(isMobileUserAgent || isSmallScreen)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-xl rounded-lg text-center">
          <div className="mb-6 space-y-4">
            <div className="flex justify-center items-center space-x-2">
              <Smartphone className="h-12 w-12 text-orange-500" />
              <div className="text-2xl">→</div>
              <Monitor className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Desktop Required
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            The concept mapping feature requires a desktop or laptop computer for the best experience. 
            Please switch to a desktop device to access this feature.
          </p>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Why desktop only? Our interactive concept maps work best with:
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• Larger screen for better visualization</li>
              <li>• Mouse/trackpad for precise interactions</li>
              <li>• To provide a better experience</li>
            </ul>
          </div>
          
          <div className="mt-8">
            <Link href="/" passHref>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default MobileRestriction 