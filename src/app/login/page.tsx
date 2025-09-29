'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Fix callbackUrl - if it's root "/", redirect to admin instead
  const rawCallbackUrl = searchParams.get('callbackUrl') || '/admin'
  const callbackUrl = rawCallbackUrl === '/' ? '/admin' : rawCallbackUrl

  // Clear error when user starts typing
  useEffect(() => {
    if (error && (formData.email || formData.password)) {
      setError(null)
    }
  }, [formData.email, formData.password, error])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Bitte fülle alle Felder aus')
      return
    }

    setError(null)
    setLoading(true)

    try {
      console.log('Attempting login with:', formData.email)
      console.log('CallbackUrl:', callbackUrl)

      const result = await signIn('credentials', {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false,
        callbackUrl: callbackUrl
      })

      console.log('SignIn result:', result)

      if (result?.error) {
        console.log('Login error:', result.error)
        setError('Ungültige Anmeldedaten')
        setFormData(prev => ({ ...prev, password: '' }))
      } else if (result?.ok) {
        console.log('Login successful, redirecting to:', callbackUrl)
        // Small delay to ensure session is set
        setTimeout(() => {
          window.location.href = callbackUrl
        }, 100)
      } else {
        console.log('Unknown login state:', result)
        setError('Anmeldung fehlgeschlagen - bitte versuche es erneut')
      }
    } catch (err) {
      console.error('Login exception:', err)
      setError('Verbindungsfehler. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-2xl font-bold">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">FormBuilder</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin-Login</h1>
            <p className="text-gray-600">
              Melde dich an, um auf den Admin-Bereich zuzugreifen
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                E-Mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="admin@formbuilder.local"
                disabled={loading}
                autoComplete="email"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Passwort
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Passwort eingeben"
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-slideDown">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.email.trim() || !formData.password.trim()}
              className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Anmeldung läuft...
                </span>
              ) : (
                '🔐 Anmelden'
              )}
            </button>
          </form>

        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Demo-Anmeldedaten:</span><br />
              E-Mail: <code className="font-mono bg-white px-1 rounded">admin@formbuilder.local</code><br />
              Passwort: <code className="font-mono bg-white px-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}