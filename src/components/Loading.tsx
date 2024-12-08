'use client'

import { useEffect, useState } from 'react'
import { Brain } from 'lucide-react'

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing AI...')

  useEffect(() => {
    const texts = [
      'Initializing AI...',
      'Loading concept mapper...',
      'Preparing your workspace...',
      'Almost ready...'
    ]
    
    let currentIndex = 0
    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length
      setLoadingText(texts[currentIndex])
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => {
      clearInterval(textInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-purple-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
            ConceptMap.AI
          </span>
        </div>

        {/* Loading Animation */}
        <div className="w-full space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{loadingText}</span>
            <span className="text-purple-600 font-medium">{progress}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1 w-full bg-purple-100 dark:bg-purple-900/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Neural Network Animation */}
        <div className="relative w-64 h-64">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 border-purple-200 dark:border-purple-800 rounded-full opacity-20"
              style={{
                animation: `ping ${2 + i * 0.2}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 animate-pulse" />
          </div>
        </div>

        {/* Loading Tips */}
        <div className="text-center text-sm text-muted-foreground animate-fade-in">
          <p>Creating intelligent concept maps in seconds</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        :global(body) {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </div>
  )
}

