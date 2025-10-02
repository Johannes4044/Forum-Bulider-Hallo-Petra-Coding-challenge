'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createForm } from './actions'
import FieldEditor from './FieldEditor'
import Link from 'next/link'
import { LogoutButton } from '@/components/LogoutButton'
import { SimpleLogo } from '@/components/SimpleLogo'


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
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Navigation */}
            <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '10px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <SimpleLogo size={32} />
                        <h1 style={{ margin: 0, fontSize: '20px' }}>HalloPetra FormBuilder</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Link
                            href="/admin"
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        >
                            Admin
                        </Link>
                        <LogoutButton />
                    </div>
                </div>
            </nav>

            <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '20px' }}>Create New Form</h2>

                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div style={{ backgroundColor: 'white', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Form Information</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                placeholder="e.g. Contact Form"
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Description (optional)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                placeholder="Brief description of the form"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Fields */}
                    <div style={{ backgroundColor: 'white', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>Form Fields ({fields.length})</h3>
                            <button
                                type="button"
                                onClick={addField}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                + Add Field
                            </button>
                        </div>

                        {fields.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', border: '2px dashed #ddd', borderRadius: '8px' }}>
                                <p>No fields yet. Click "Add Field" to create your first field.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {fields.map((field, index) => (
                                    <div
                                        key={field.tempId}
                                        style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: 0, marginBottom: '5px' }}>
                                                    {field.label || 'Unnamed Field'} ({field.type})
                                                    {field.required && <span style={{ color: '#d32f2f' }}> *</span>}
                                                </h4>
                                                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                                    Key: {field.key || 'no-key'}
                                                </p>
                                                {field.description && (
                                                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>{field.description}</p>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => moveFieldUp(index)}
                                                    disabled={index === 0}
                                                    style={{
                                                        padding: '5px',
                                                        border: '1px solid #ccc',
                                                        backgroundColor: 'white',
                                                        borderRadius: '4px',
                                                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                        opacity: index === 0 ? 0.5 : 1
                                                    }}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveFieldDown(index)}
                                                    disabled={index === fields.length - 1}
                                                    style={{
                                                        padding: '5px',
                                                        border: '1px solid #ccc',
                                                        backgroundColor: 'white',
                                                        borderRadius: '4px',
                                                        cursor: index === fields.length - 1 ? 'not-allowed' : 'pointer',
                                                        opacity: index === fields.length - 1 ? 0.5 : 1
                                                    }}
                                                >
                                                    ↓
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingField(field)}
                                                    style={{
                                                        padding: '5px 8px',
                                                        border: '1px solid #1976d2',
                                                        backgroundColor: '#1976d2',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteField(field.tempId)}
                                                    style={{
                                                        padding: '5px 8px',
                                                        border: '1px solid #d32f2f',
                                                        backgroundColor: '#d32f2f',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div style={{ backgroundColor: '#ffebee', border: '1px solid #f44336', padding: '10px', borderRadius: '4px', marginBottom: '20px', color: '#d32f2f' }}>
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                opacity: isSubmitting ? 0.6 : 1
                            }}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Form'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/admin')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
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