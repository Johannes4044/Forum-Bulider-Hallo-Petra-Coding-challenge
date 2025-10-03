'use client'

import { usePathname } from 'next/navigation'

export default function Navigation() {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/builder') {
            return pathname === path || pathname.startsWith('/builder/')
        }
        if (path === '/submissions') {
            return pathname === path || pathname.startsWith('/submissions/')
        }
        return pathname === path
    }

    return (
        <nav style={{
            background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
            boxShadow: '0 4px 12px rgba(11, 123, 255, 0.3)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '20px 32px'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '28px',
                    fontWeight: '800',
                    color: 'white',
                    letterSpacing: '-0.03em',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}>
                    ✨ FormBuilder
                </h1>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <a
                        href="/builder"
                        style={{
                            padding: '12px 24px',
                            backgroundColor: isActive('/builder') ? 'white' : 'rgba(255, 255, 255, 0.15)',
                            color: isActive('/builder') ? 'rgb(11, 123, 255)' : 'white',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontSize: '15px',
                            fontWeight: '700',
                            transition: 'all 0.3s ease',
                            boxShadow: isActive('/builder') ? '0 4px 16px rgba(255, 255, 255, 0.3)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: isActive('/builder') ? 'none' : '2px solid rgba(255, 255, 255, 0.2)'
                        }}
                        onMouseOver={(e) => {
                            if (!isActive('/builder')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)'
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isActive('/builder')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                            }
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>✏️</span>
                        <span>Create Form</span>
                    </a>
                    <a
                        href="/submissions"
                        style={{
                            padding: '12px 24px',
                            backgroundColor: isActive('/submissions') ? 'white' : 'rgba(255, 255, 255, 0.15)',
                            color: isActive('/submissions') ? 'rgb(11, 123, 255)' : 'white',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontSize: '15px',
                            fontWeight: '700',
                            transition: 'all 0.3s ease',
                            boxShadow: isActive('/submissions') ? '0 4px 16px rgba(255, 255, 255, 0.3)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: isActive('/submissions') ? 'none' : '2px solid rgba(255, 255, 255, 0.2)'
                        }}
                        onMouseOver={(e) => {
                            if (!isActive('/submissions')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)'
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isActive('/submissions')) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                            }
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>📊</span>
                        <span>All Forms</span>
                    </a>
                </div>
            </div>
        </nav>
    )
}
