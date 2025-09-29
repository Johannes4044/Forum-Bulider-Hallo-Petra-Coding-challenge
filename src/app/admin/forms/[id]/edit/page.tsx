'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getFormForEdit, updateForm } from './actions'
import FieldEditor from '@/app/builder/FieldEditor'
import Link from 'next/link'
import { LogoutButton } from '@/components/LogoutButton'

type FieldType = 'TEXT' | 'EMAIL' | 'NUMBER' | 'DATE' | 'TEXTAREA' | 'SELECT' | 'RADIO' | 'CHECKBOX'

type Field = {
  tempId: string
  key: string
  label: string
  description: string
  type: FieldType
  required: boolean
  options: string[]
  placeholder: string
  min: number | null
  max: number | null
}

type FormData = {
  id: string
  title: string
  description: string | null
  fields: Array<{
    id: string
    key: string
    label: string
    description: string | null
    type: FieldType
    required: boolean
    options: any
    placeholder: string | null
    min: number | null
    max: number | null
    order: number
  }>
}

const FIELD_ICONS: Record<FieldType, string> = {
  TEXT: '📝',
  EMAIL: '📧',
  NUMBER: '🔢',
  DATE: '📅',
  TEXTAREA: '📄',
  SELECT: '📋',
  RADIO: '🔘',
  CHECKBOX: '☑️',
}

export default function EditFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState<Field[]>([])
  const [editingField, setEditingField] = useState<Field | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadForm()
  }, [formId])

  const loadForm = async () => {
    try {
      setLoading(true)
      const result = await getFormForEdit(formId)
      if (result.success && result.form) {
        const form = result.form
        setTitle(form.title)
        setDescription(form.description || '')

        // Convert database fields to editor fields
        const convertedFields: Field[] = form.fields.map(field => ({
          tempId: field.id, // Use existing ID as tempId for tracking
          key: field.key,
          label: field.label,
          description: field.description || '',
          type: field.type,
          required: field.required,
          options: Array.isArray(field.options) ? field.options : [],
          placeholder: field.placeholder || '',
          min: field.min,
          max: field.max
        }))

        setFields(convertedFields)
      } else {
        setError(result.error || 'Formular nicht gefunden')
      }
    } catch (err) {
      setError('Fehler beim Laden des Formulars')
    } finally {
      setLoading(false)
    }
  }

  const addField = () => {
    const newField: Field = {
      tempId: `temp_${Date.now()}`,
      key: '',
      label: '',
      description: '',
      type: 'TEXT',
      required: false,
      options: [],
      placeholder: '',
      min: null,
      max: null,
    }
    setEditingField(newField)
  }

  const saveField = (field: Field) => {
    const existingIndex = fields.findIndex((f) => f.tempId === field.tempId)
    if (existingIndex >= 0) {
      const newFields = [...fields]
      newFields[existingIndex] = field
      setFields(newFields)
    } else {
      setFields([...fields, field])
    }
    setEditingField(null)
  }

  const deleteField = (tempId: string) => {
    setFields(fields.filter((f) => f.tempId !== tempId))
  }

  const moveFieldUp = (index: number) => {
    if (index === 0) return
    const newFields = [...fields]
    ;[newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]]
    setFields(newFields)
  }

  const moveFieldDown = (index: number) => {
    if (index === fields.length - 1) return
    const newFields = [...fields]
    ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
    setFields(newFields)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Bitte gib einen Titel ein')
      return
    }

    if (fields.length === 0) {
      setError('Bitte füge mindestens ein Feld hinzu')
      return
    }

    for (const field of fields) {
      if (!field.key.trim() || !field.label.trim()) {
        setError('Alle Felder müssen einen Key und Label haben')
        return
      }
      if (['SELECT', 'RADIO'].includes(field.type) && field.options.length === 0) {
        setError(`${field.type === 'SELECT' ? 'Select' : 'Radio'}-Feld "${field.label}" benötigt mindestens eine Option`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const result = await updateForm(formId, {
        title,
        description,
        fields: fields.map((field, index) => ({
          id: field.tempId.startsWith('temp_') ? null : field.tempId, // null for new fields
          key: field.key,
          label: field.label,
          description: field.description,
          type: field.type,
          required: field.required,
          options: ['SELECT', 'RADIO'].includes(field.type) ? field.options : null,
          placeholder: field.placeholder || null,
          min: field.min,
          max: field.max,
          order: index,
        })),
      })

      if (result.success) {
        router.push('/admin')
      } else {
        setError(result.error || 'Ein Fehler ist aufgetreten')
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Formular...</p>
        </div>
      </div>
    )
  }

  if (error && !title) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Fehler beim Laden</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FormBuilder</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">Formular bearbeiten</span>
            <LogoutButton className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all" />
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-slideDown">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Formular bearbeiten
            </h1>
            <p className="text-lg text-gray-600">
              Bearbeite Felder und konfiguriere dein Formular
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basis-Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-slideUp">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Formular-Informationen</h2>
                  <p className="text-sm text-gray-500">Grundlegende Details zu deinem Formular</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Titel <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-base"
                    placeholder="z.B. Kontaktanfrage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Beschreibung (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-base"
                    placeholder="Kurze Beschreibung des Formulars"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Felder Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Formular-Felder</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {fields.length === 0 ? 'Noch keine Felder' : `${fields.length} ${fields.length === 1 ? 'Feld' : 'Felder'}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addField}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-xl leading-none">+</span>
                  <span>Feld hinzufügen</span>
                </button>
              </div>

              {fields.length === 0 ? (
                <button
                  type="button"
                  onClick={addField}
                  className="w-full py-20 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📝</div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">Noch keine Felder vorhanden</p>
                  <p className="text-gray-500">Klicke hier um dein erstes Feld hinzuzufügen</p>
                </button>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.tempId}
                      className="group bg-gray-50 rounded-xl p-5 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl flex-shrink-0 mt-1">{FIELD_ICONS[field.type]}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-bold text-gray-900 text-lg">
                              {field.label || 'Unbenanntes Feld'}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                              {field.type}
                            </span>
                            {field.required && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                Pflicht
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Key: <code className="bg-gray-200 px-2 py-0.5 rounded text-xs font-mono">{field.key || 'kein-key'}</code>
                          </p>
                          {field.description && (
                            <p className="text-sm text-gray-600 mt-2">{field.description}</p>
                          )}
                          {['SELECT', 'RADIO'].includes(field.type) && field.options.length > 0 && (
                            <p className="text-xs text-gray-500 mt-2">
                              {field.options.length} Option{field.options.length !== 1 && 'en'}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => moveFieldUp(index)}
                            disabled={index === 0}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-700"
                            title="Nach oben"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveFieldDown(index)}
                            disabled={index === fields.length - 1}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-700"
                            title="Nach unten"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField(field)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-blue-100 text-blue-600 rounded-lg transition"
                            title="Bearbeiten"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteField(field.tempId)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-red-100 text-red-600 rounded-lg transition"
                            title="Löschen"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-slideDown">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >
                {isSubmitting ? '⏳ Wird gespeichert...' : '✓ Änderungen speichern'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="sm:w-auto px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      </main>

      {editingField && (
        <FieldEditor
          field={editingField}
          onSave={saveField}
          onCancel={() => setEditingField(null)}
        />
      )}
    </div>
  )
}