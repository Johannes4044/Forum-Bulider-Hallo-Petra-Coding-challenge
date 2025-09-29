'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createForm } from './actions'
import FieldEditor from './FieldEditor'

type FieldType = 'TEXT' | 'SELECT'

type Field = {
    tempId: string // Temporäre ID vor dem Speichern
    key: string
    label: string
    description: string
    type: FieldType
    required: boolean
    options: string[] // Für SELECT-Felder
}

export default function FormBuilderPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [fields, setFields] = useState<Field[]>([])
    const [editingField, setEditingField] = useState<Field | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Neues Feld hinzufügen
    const addField = () => {
        const newField: Field = {
            tempId: `temp_${Date.now()}`,
            key: '',
            label: '',
            description: '',
            type: 'TEXT',
            required: false,
            options: [],
        }
        setEditingField(newField)
    }

    // Feld speichern (nach Bearbeitung)
    const saveField = (field: Field) => {
        const existingIndex = fields.findIndex((f) => f.tempId === field.tempId)

        if (existingIndex >= 0) {
            // Bestehendes Feld aktualisieren
            const newFields = [...fields]
            newFields[existingIndex] = field
            setFields(newFields)
        } else {
            // Neues Feld hinzufügen
            setFields([...fields, field])
        }

        setEditingField(null)
    }

    // Feld löschen
    const deleteField = (tempId: string) => {
        setFields(fields.filter((f) => f.tempId !== tempId))
    }

    // Feld nach oben verschieben
    const moveFieldUp = (index: number) => {
        if (index === 0) return
        const newFields = [...fields]
        ;[newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]]
        setFields(newFields)
    }

    // Feld nach unten verschieben
    const moveFieldDown = (index: number) => {
        if (index === fields.length - 1) return
        const newFields = [...fields]
        ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
        setFields(newFields)
    }

    // Formular speichern
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validierung
        if (!title.trim()) {
            setError('Bitte gib einen Titel ein')
            return
        }

        if (fields.length === 0) {
            setError('Bitte füge mindestens ein Feld hinzu')
            return
        }

        // Prüfen ob alle Felder vollständig sind
        for (const field of fields) {
            if (!field.key.trim() || !field.label.trim()) {
                setError('Alle Felder müssen einen Key und Label haben')
                return
            }
            if (field.type === 'SELECT' && field.options.length === 0) {
                setError(`Select-Feld "${field.label}" benötigt mindestens eine Option`)
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
                    options: field.type === 'SELECT' ? field.options : null,
                    order: index,
                })),
            })

            if (result.success && result.formId) {
                // Weiterleitung zum erstellten Formular
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
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow p-8 mb-6">
                    <h1 className="text-3xl font-bold mb-6">Neues Formular erstellen</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Formular-Basis-Info */}
                        <div>
                            <label className="block font-medium mb-2">
                                Titel <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="z.B. Kontaktdaten"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Beschreibung</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Optionale Beschreibung für das Formular"
                                rows={3}
                            />
                        </div>

                        {/* Felder-Liste */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Felder</h2>
                                <button
                                    type="button"
                                    onClick={addField}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    + Feld hinzufügen
                                </button>
                            </div>

                            {fields.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500">Noch keine Felder vorhanden</p>
                                    <button
                                        type="button"
                                        onClick={addField}
                                        className="mt-4 text-blue-600 hover:underline"
                                    >
                                        Erstes Feld hinzufügen
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.tempId}
                                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">{field.label || 'Unbenannt'}</span>
                                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {field.type}
                            </span>
                                                        {field.required && (
                                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                Pflichtfeld
                              </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">Key: {field.key || '-'}</p>
                                                    {field.description && (
                                                        <p className="text-sm text-gray-500 mt-1">{field.description}</p>
                                                    )}
                                                    {field.type === 'SELECT' && field.options.length > 0 && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Optionen: {field.options.join(', ')}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveFieldUp(index)}
                                                        disabled={index === 0}
                                                        className="p-2 hover:bg-gray-200 rounded disabled:opacity-30"
                                                        title="Nach oben"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveFieldDown(index)}
                                                        disabled={index === fields.length - 1}
                                                        className="p-2 hover:bg-gray-200 rounded disabled:opacity-30"
                                                        title="Nach unten"
                                                    >
                                                        ↓
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingField(field)}
                                                        className="p-2 hover:bg-gray-200 rounded"
                                                        title="Bearbeiten"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteField(field.tempId)}
                                                        className="p-2 hover:bg-red-100 rounded text-red-600"
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
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Wird gespeichert...' : 'Formular erstellen'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/')}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Abbrechen
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal für Feld-Bearbeitung */}
            {editingField && (
                <FieldEditor
                    field={editingField}
                    onSave={saveField}
                    onCancel={() => setEditingField(null)}
                />
            )}
        </main>
    )
}