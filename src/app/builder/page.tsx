'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createForm } from './actions'
import FieldEditor from './FieldEditor'
import Link from 'next/link'

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

export default function FormBuilderPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [fields, setFields] = useState<Field[]>([])
    const [editingField, setEditingField] = useState<Field | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
            const result = await createForm({
                title,
                description,
                fields: fields.map((field, index) => ({
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

            if (result.success && result.formId) {
                router.push(`/forms/${result.formId}`)
            } else {
                setError(result.error || 'Ein Fehler ist aufgetreten')
            }
        } catch (err) {
            setError('Ein Fehler ist aufgetreten')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white text-lg font-bold">F</span>
                        </div>
                        <span className="font-bold text-lg">FormBuilder</span>
                    </Link>
                    <span className="text-sm text-gray-500">Formular erstellen</span>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Header Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-start gap-4 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                                    <span className="text-2xl">✨</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Neues Formular erstellen</h1>
                                    <p className="text-gray-600">Füge Felder hinzu und konfiguriere dein Formular</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Formular-Titel <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
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
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                                        placeholder="Kurze Beschreibung des Formulars"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fields Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
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
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <span className="text-lg leading-none">+</span>
                                    <span>Feld hinzufügen</span>
                                </button>
                            </div>

                            {fields.length === 0 ? (
                                <button
                                    type="button"
                                    onClick={addField}
                                    className="w-full py-16 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                                >
                                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📝</div>
                                    <p className="text-gray-900 font-medium mb-1">Noch keine Felder vorhanden</p>
                                    <p className="text-sm text-gray-500">Klicke hier um dein erstes Feld hinzuzufügen</p>
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.tempId}
                                            className="group relative bg-gray-50 rounded-xl p-5 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 transition-all"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="text-2xl flex-shrink-0">{FIELD_ICONS[field.type]}</div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {field.label || 'Unbenanntes Feld'}
                            </span>
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              {field.type}
                            </span>
                                                        {field.required && (
                                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                Pflicht
                              </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">{field.key || 'kein-key'}</code>
                                                    </p>
                                                    {field.description && (
                                                        <p className="text-sm text-gray-600 mt-2">{field.description}</p>
                                                    )}
                                                    {['SELECT', 'RADIO'].includes(field.type) && field.options.length > 0 && (
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {field.options.length} {field.options.length === 1 ? 'Option' : 'Optionen'}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveFieldUp(index)}
                                                        disabled={index === 0}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-600"
                                                        title="Nach oben"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveFieldDown(index)}
                                                        disabled={index === fields.length - 1}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-600"
                                                        title="Nach unten"
                                                    >
                                                        ↓
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingField(field)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-blue-100 text-blue-600 rounded-lg transition"
                                                        title="Bearbeiten"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteField(field.tempId)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-red-100 text-red-600 rounded-lg transition"
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
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                <span className="text-xl flex-shrink-0">⚠️</span>
                                <span className="text-red-700 font-medium">{error}</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
                            >
                                {isSubmitting ? '⏳ Wird erstellt...' : '✓ Formular erstellen'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/')}
                                className="px-8 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-all"
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