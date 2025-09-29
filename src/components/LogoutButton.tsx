'use client'

import { signOut } from 'next-auth/react'

interface LogoutButtonProps {
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className={className}
    >
      {children || '🚪 Abmelden'}
    </button>
  )
}