'use client'

import Image from 'next/image'
import { useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  // If image failed to load or doesn't exist, show fallback
  if (imageError) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 ${className}`}>
        <span className={`text-white font-bold ${textSizeClasses[size]}`}>HP</span>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 overflow-hidden ${className}`}>
      <Image
        src="/hallopetra-logo.png"
        alt="HalloPetra Logo"
        width={size === 'lg' ? 56 : size === 'md' ? 40 : 32}
        height={size === 'lg' ? 56 : size === 'md' ? 40 : 32}
        className="object-cover rounded-xl"
        priority
        onError={() => setImageError(true)}
      />
    </div>
  )
}