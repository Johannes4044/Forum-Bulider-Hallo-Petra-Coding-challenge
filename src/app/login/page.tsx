'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { SimpleLogo } from '@/components/SimpleLogo'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill all fields')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false,
        callbackUrl: callbackUrl
      })

      if (result?.error) {
        setError('Invalid credentials')
        setFormData(prev => ({ ...prev, password: '' }))
      } else if (result?.ok) {
        window.location.href = callbackUrl
      } else {
        setError('Login failed')
      }
    } catch (err) {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', padding: '40px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>

        {/* Header mit Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
            <SimpleLogo size={48} />
            <h1 style={{ margin: 0, color: '#333', fontSize: '28px' }}>HalloPetra</h1>
          </div>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>FormBuilder Admin Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="admin@formbuilder.local"
              disabled={loading}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Password"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div style={{
              marginBottom: '20px',
              padding: '12px',
              backgroundColor: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '4px',
              color: '#d32f2f',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !formData.email.trim() || !formData.password.trim()}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading || (!formData.email.trim() || !formData.password.trim()) ? 0.6 : 1,
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          fontSize: '14px',
          border: '1px solid #90caf9'
        }}>
          <strong style={{ color: '#1565c0' }}>Demo credentials:</strong><br />
          <div style={{ marginTop: '8px', color: '#1976d2' }}>
            <div><strong>Email:</strong> admin@formbuilder.local</div>
            <div><strong>Password:</strong> admin123</div>
          </div>
        </div>
      </div>
    </div>
  )
}