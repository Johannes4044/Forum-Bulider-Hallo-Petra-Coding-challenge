'use client'

import { signOut } from 'next-auth/react'

export function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      style={{
        padding: '6px 12px',
        backgroundColor: '#f5f5f5',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      Logout
    </button>
  )
}