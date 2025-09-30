'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllForms, deleteForm, duplicateForm } from './actions'
import { LogoutButton } from '@/components/LogoutButton'
import { Logo } from '@/components/Logo'

type FormWithStats = {
  id: string
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
  _count: {
    fields: number
    submissions: number
  }
}

export default function AdminPage() {
  const [forms, setForms] = useState<FormWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      setLoading(true)
      const result = await getAllForms()
      if (result.success && result.forms) {
        setForms(result.forms)
      } else {
        setError(result.error || 'Fehler beim Laden der Formulare')
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (formId: string, formTitle: string) => {
    if (!confirm(`Möchtest du das Formular "${formTitle}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      return
    }

    try {
      const result = await deleteForm(formId)
      if (result.success) {
        setForms(forms.filter(f => f.id !== formId))
      } else {
        setError(result.error || 'Fehler beim Löschen')
      }
    } catch (err) {
      setError('Fehler beim Löschen')
    }
  }

  const handleDuplicate = async (formId: string) => {
    try {
      const result = await duplicateForm(formId)
      if (result.success && result.formId) {
        await loadForms() // Reload to show the new form
      } else {
        setError(result.error || 'Fehler beim Duplizieren')
      }
    } catch (err) {
      setError('Fehler beim Duplizieren')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Formulare...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="text-xl font-bold text-gray-900">HalloPetra FormBuilder</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">Admin-Bereich</span>
            <Link
              href="/builder"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              Neues Formular
            </Link>
            <LogoutButton className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all" />
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Formular-Übersicht
            </h1>
            <p className="text-lg text-gray-600">
              Verwalte alle deine Formulare und deren Einreichungen
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          {forms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Noch keine Formulare</h2>
              <p className="text-gray-600 mb-6">Erstelle dein erstes Formular, um loszulegen</p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
              >
                Formular erstellen
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                          📝
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{form.title}</h3>
                          {form.description && (
                            <p className="text-gray-600 mb-2">{form.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Erstellt: {new Date(form.createdAt).toLocaleDateString('de-DE')}</span>
                            <span>•</span>
                            <span>{form._count.fields} Felder</span>
                            <span>•</span>
                            <span>{form._count.submissions} Einreichungen</span>
                          </div>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-50 px-3 py-1 rounded-full">
                          <span className="text-blue-700 text-sm font-medium">
                            📊 {form._count.submissions} Submissions
                          </span>
                        </div>
                        <div className="bg-green-50 px-3 py-1 rounded-full">
                          <span className="text-green-700 text-sm font-medium">
                            📝 {form._count.fields} Felder
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/forms/${form.id}`}
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all"
                          target="_blank"
                        >
                          👁️ Ansehen
                        </Link>
                        <Link
                          href={`/admin/forms/${form.id}/submissions`}
                          className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-all"
                        >
                          📊 Submissions ({form._count.submissions})
                        </Link>
                        <Link
                          href={`/admin/forms/${form.id}/edit`}
                          className="px-4 py-2 bg-orange-100 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-200 transition-all"
                        >
                          ✏️ Bearbeiten
                        </Link>
                        <button
                          onClick={() => handleDuplicate(form.id)}
                          className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-all"
                        >
                          📋 Duplizieren
                        </button>
                        <button
                          onClick={() => handleDelete(form.id, form.title)}
                          className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-all"
                        >
                          🗑️ Löschen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}