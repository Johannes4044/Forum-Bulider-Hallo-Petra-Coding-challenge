'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getFormSubmissions, deleteSubmission, exportSubmissions } from './actions'
import { LogoutButton } from '@/components/LogoutButton'

type FormSubmission = {
  id: string
  data: Record<string, any>
  submittedAt: string
}

type FormWithSubmissions = {
  id: string
  title: string
  description: string | null
  fields: Array<{
    key: string
    label: string
    type: string
  }>
  submissions: FormSubmission[]
}

export default function FormSubmissionsPage() {
  const params = useParams()
  const formId = params.id as string

  const [form, setForm] = useState<FormWithSubmissions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])

  useEffect(() => {
    loadSubmissions()
  }, [formId])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const result = await getFormSubmissions(formId)
      if (result.success && result.form) {
        setForm(result.form)
      } else {
        setError(result.error || 'Fehler beim Laden der Submissions')
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Möchtest du diese Einreichung wirklich löschen?')) {
      return
    }

    try {
      const result = await deleteSubmission(submissionId)
      if (result.success) {
        await loadSubmissions()
      } else {
        setError(result.error || 'Fehler beim Löschen')
      }
    } catch (err) {
      setError('Fehler beim Löschen')
    }
  }

  const handleExport = async () => {
    try {
      const result = await exportSubmissions(formId)
      if (result.success && result.csvData) {
        // Create and download CSV file
        const blob = new Blob([result.csvData], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', `${form?.title || 'formular'}_submissions.csv`)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        setError(result.error || 'Fehler beim Exportieren')
      }
    } catch (err) {
      setError('Fehler beim Exportieren')
    }
  }

  const toggleSubmissionSelection = (submissionId: string) => {
    setSelectedSubmissions(prev =>
      prev.includes(submissionId)
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    )
  }

  const toggleAllSubmissions = () => {
    if (selectedSubmissions.length === form?.submissions.length) {
      setSelectedSubmissions([])
    } else {
      setSelectedSubmissions(form?.submissions.map(s => s.id) || [])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Submissions...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Formular nicht gefunden</h2>
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Zurück zur Übersicht
          </Link>
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FormBuilder</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              ← Admin-Übersicht
            </Link>
            <LogoutButton className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all" />
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-6 mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{form.title}</h1>
                <p className="text-lg text-gray-600">Submissions-Übersicht</p>
              </div>
              {form.submissions.length > 0 && (
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all"
                >
                  📊 Als CSV exportieren
                </button>
              )}
            </div>

            {form.description && (
              <p className="text-gray-600 bg-blue-50 p-4 rounded-lg">{form.description}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          {form.submissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="text-6xl mb-6">📭</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Noch keine Submissions</h2>
              <p className="text-gray-600 mb-6">
                Teile dein Formular, damit Nutzer es ausfüllen können
              </p>
              <Link
                href={`/forms/${form.id}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
              >
                👁️ Formular ansehen
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{form.submissions.length}</div>
                      <div className="text-sm text-gray-500">Submissions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{form.fields.length}</div>
                      <div className="text-sm text-gray-500">Felder</div>
                    </div>
                  </div>

                  {form.submissions.length > 0 && (
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={selectedSubmissions.length === form.submissions.length}
                          onChange={toggleAllSubmissions}
                          className="rounded"
                        />
                        Alle auswählen
                      </label>
                      <span className="text-sm text-gray-500">
                        ({selectedSubmissions.length} ausgewählt)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submissions Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedSubmissions.length === form.submissions.length}
                            onChange={toggleAllSubmissions}
                            className="rounded"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Eingereicht am
                        </th>
                        {form.fields.map((field) => (
                          <th
                            key={field.key}
                            className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                          >
                            {field.label}
                            <span className="block text-xs font-normal text-gray-500">
                              {field.type.toLowerCase()}
                            </span>
                          </th>
                        ))}
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                          Aktionen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {form.submissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedSubmissions.includes(submission.id)}
                              onChange={() => toggleSubmissionSelection(submission.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(submission.submittedAt).toLocaleDateString('de-DE', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          {form.fields.map((field) => (
                            <td key={field.key} className="px-6 py-4 text-sm text-gray-900">
                              <div className="max-w-xs truncate" title={String(submission.data[field.key] || '-')}>
                                {Array.isArray(submission.data[field.key])
                                  ? submission.data[field.key].join(', ')
                                  : String(submission.data[field.key] || '-')
                                }
                              </div>
                            </td>
                          ))}
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteSubmission(submission.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              🗑️ Löschen
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}