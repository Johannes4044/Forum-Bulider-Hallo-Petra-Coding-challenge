'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllForms, deleteForm, duplicateForm } from './actions'
import { LogoutButton } from '@/components/LogoutButton'
import { SimpleLogo } from '@/components/SimpleLogo'

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading forms...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '10px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SimpleLogo size={32} />
            <h1 style={{ margin: 0, fontSize: '24px' }}>HalloPetra FormBuilder Admin</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link
              href="/builder"
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              New Form
            </Link>
            <LogoutButton className="" />
          </div>
        </div>
      </nav>

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px' }}>Forms Overview</h2>

        {error && (
          <div style={{ backgroundColor: '#ffebee', border: '1px solid #f44336', padding: '10px', borderRadius: '4px', marginBottom: '20px', color: '#d32f2f' }}>
            {error}
          </div>
        )}

        {forms.length === 0 ? (
          <div style={{ backgroundColor: 'white', padding: '40px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>No forms yet</h3>
            <p>Create your first form to get started</p>
            <Link
              href="/builder"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#1976d2',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                marginTop: '10px'
              }}
            >
              Create Form
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {forms.map((form) => (
              <div
                key={form.id}
                style={{ backgroundColor: 'white', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}
              >
                <h3 style={{ marginTop: 0, marginBottom: '10px' }}>{form.title}</h3>
                {form.description && (
                  <p style={{ color: '#666', marginBottom: '15px' }}>{form.description}</p>
                )}

                <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                  Created: {new Date(form.createdAt).toLocaleDateString()} |
                  {form._count.fields} fields |
                  {form._count.submissions} submissions
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link
                    href={`/forms/${form.id}`}
                    target="_blank"
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/forms/${form.id}/submissions`}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    Submissions ({form._count.submissions})
                  </Link>
                  <Link
                    href={`/admin/forms/${form.id}/edit`}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#fff3e0',
                      color: '#f57c00',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDuplicate(form.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#e8f5e8',
                      color: '#388e3c',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDelete(form.id, form.title)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#ffebee',
                      color: '#d32f2f',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}