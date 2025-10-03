'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createForm } from './actions'
import FieldEditor from './FieldEditor'
import Navigation from '@/components/Navigation'


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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe, #f0f9ff)' }}>
            <Navigation />

            <main style={{ padding: '48px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                    padding: '40px',
                    borderRadius: '24px',
                    marginBottom: '40px',
                    boxShadow: '0 20px 60px rgba(11, 123, 255, 0.3)',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '42px',
                        fontWeight: '900',
                        color: 'white',
                        letterSpacing: '-0.02em',
                        textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
                    }}>
                        ✨ Create Your Form
                    </h2>
                    <p style={{
                        margin: '12px 0 0 0',
                        fontSize: '18px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: '400'
                    }}>
                        Build beautiful forms in minutes
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '20px',
                        marginBottom: '24px',
                        boxShadow: '0 10px 40px rgba(11, 123, 255, 0.15)',
                        border: '2px solid rgba(11, 123, 255, 0.1)',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                boxShadow: '0 4px 12px rgba(11, 123, 255, 0.3)'
                            }}>
                                📋
                            </div>
                            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>Form Information</h3>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#111827', fontSize: '15px' }}>
                                Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    backgroundColor: '#fafbfc'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgb(11, 123, 255)';
                                    e.target.style.backgroundColor = 'white';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(11, 123, 255, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.backgroundColor = '#fafbfc';
                                    e.target.style.boxShadow = 'none';
                                }}
                                placeholder="e.g. Contact Form, Survey, Registration..."
                            />
                        </div>

                        <div style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#111827', fontSize: '15px' }}>
                                Description (optional)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    backgroundColor: '#fafbfc',
                                    resize: 'vertical'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgb(11, 123, 255)';
                                    e.target.style.backgroundColor = 'white';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(11, 123, 255, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.backgroundColor = '#fafbfc';
                                    e.target.style.boxShadow = 'none';
                                }}
                                placeholder="Brief description of what this form is for..."
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Fields */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '20px',
                        marginBottom: '24px',
                        boxShadow: '0 10px 40px rgba(11, 123, 255, 0.15)',
                        border: '2px solid rgba(11, 123, 255, 0.1)',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    boxShadow: '0 4px 12px rgba(11, 123, 255, 0.3)'
                                }}>
                                    ⚡
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>Form Fields</h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>{fields.length} {fields.length === 1 ? 'field' : 'fields'} added</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addField}
                                style={{
                                    padding: '14px 28px',
                                    background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '15px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 16px rgba(11, 123, 255, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(11, 123, 255, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(11, 123, 255, 0.4)';
                                }}
                            >
                                <span style={{ fontSize: '20px' }}>➕</span>
                                <span>Add Field</span>
                            </button>
                        </div>

                        {fields.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '64px 32px',
                                border: '3px dashed rgba(11, 123, 255, 0.3)',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, rgba(11, 123, 255, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
                            }}>
                                <div style={{
                                    fontSize: '64px',
                                    marginBottom: '16px',
                                    opacity: 0.6
                                }}>
                                    📝
                                </div>
                                <p style={{
                                    color: '#6b7280',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    margin: 0
                                }}>
                                    No fields yet
                                </p>
                                <p style={{
                                    color: '#9ca3af',
                                    fontSize: '15px',
                                    margin: '8px 0 0 0'
                                }}>
                                    Click "Add Field" to create your first field
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {fields.map((field, index) => (
                                    <div
                                        key={field.tempId}
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(11, 123, 255, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
                                            padding: '20px',
                                            borderRadius: '16px',
                                            border: '2px solid rgba(11, 123, 255, 0.2)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'rgb(11, 123, 255)';
                                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(11, 123, 255, 0.2)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(11, 123, 255, 0.2)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'start', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: 'white',
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '20px',
                                                    border: '2px solid rgba(11, 123, 255, 0.2)',
                                                    flexShrink: 0
                                                }}>
                                                    {FIELD_ICONS[field.type]}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ margin: 0, marginBottom: '6px', color: '#111827', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span>{field.label || 'Unnamed Field'}</span>
                                                        {field.required && <span style={{ color: 'rgb(239, 68, 68)', fontSize: '20px' }}>*</span>}
                                                    </h4>
                                                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'rgb(11, 123, 255)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        {field.type}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                                                        <span style={{ fontWeight: '600' }}>Key:</span> {field.key || 'no-key'}
                                                    </p>
                                                    {field.description && (
                                                        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>{field.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                                <button
                                                    type="button"
                                                    onClick={() => moveFieldUp(index)}
                                                    disabled={index === 0}
                                                    style={{
                                                        padding: '8px 12px',
                                                        border: '2px solid rgba(11, 123, 255, 0.3)',
                                                        backgroundColor: 'white',
                                                        borderRadius: '10px',
                                                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                        opacity: index === 0 ? 0.4 : 1,
                                                        transition: 'all 0.3s ease',
                                                        fontSize: '16px',
                                                        fontWeight: '700',
                                                        color: 'rgb(11, 123, 255)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (index !== 0) {
                                                            e.currentTarget.style.borderColor = 'rgb(11, 123, 255)';
                                                            e.currentTarget.style.backgroundColor = 'rgba(11, 123, 255, 0.1)';
                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = 'rgba(11, 123, 255, 0.3)';
                                                        e.currentTarget.style.backgroundColor = 'white';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveFieldDown(index)}
                                                    disabled={index === fields.length - 1}
                                                    style={{
                                                        padding: '8px 12px',
                                                        border: '2px solid rgba(11, 123, 255, 0.3)',
                                                        backgroundColor: 'white',
                                                        borderRadius: '10px',
                                                        cursor: index === fields.length - 1 ? 'not-allowed' : 'pointer',
                                                        opacity: index === fields.length - 1 ? 0.4 : 1,
                                                        transition: 'all 0.3s ease',
                                                        fontSize: '16px',
                                                        fontWeight: '700',
                                                        color: 'rgb(11, 123, 255)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (index !== fields.length - 1) {
                                                            e.currentTarget.style.borderColor = 'rgb(11, 123, 255)';
                                                            e.currentTarget.style.backgroundColor = 'rgba(11, 123, 255, 0.1)';
                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = 'rgba(11, 123, 255, 0.3)';
                                                        e.currentTarget.style.backgroundColor = 'white';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }}
                                                >
                                                    ↓
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingField(field)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        border: 'none',
                                                        background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                                                        color: 'white',
                                                        borderRadius: '10px',
                                                        cursor: 'pointer',
                                                        fontWeight: '700',
                                                        fontSize: '14px',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 8px rgba(11, 123, 255, 0.3)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(11, 123, 255, 0.4)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(11, 123, 255, 0.3)';
                                                    }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteField(field.tempId)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        border: 'none',
                                                        background: 'linear-gradient(135deg, rgb(239, 68, 68) 0%, rgb(220, 38, 38) 100%)',
                                                        color: 'white',
                                                        borderRadius: '10px',
                                                        cursor: 'pointer',
                                                        fontWeight: '700',
                                                        fontSize: '14px',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.4)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                                                    }}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                            border: '2px solid rgb(239, 68, 68)',
                            padding: '20px 24px',
                            borderRadius: '16px',
                            marginBottom: '24px',
                            color: '#991b1b',
                            fontSize: '15px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                        }}>
                            <span style={{ fontSize: '24px' }}>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: '18px 48px',
                                background: isSubmitting ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                fontWeight: '800',
                                fontSize: '18px',
                                transition: 'all 0.3s ease',
                                boxShadow: isSubmitting ? 'none' : '0 8px 24px rgba(11, 123, 255, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                letterSpacing: '-0.02em'
                            }}
                            onMouseEnter={(e) => {
                                if (!isSubmitting) {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(11, 123, 255, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = isSubmitting ? 'none' : '0 8px 24px rgba(11, 123, 255, 0.4)';
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <span style={{ fontSize: '24px' }}>⏳</span>
                                    <span>Creating Form...</span>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '24px' }}>✨</span>
                                    <span>Create Form</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            style={{
                                padding: '18px 48px',
                                backgroundColor: 'white',
                                color: '#6b7280',
                                border: '2px solid #e5e7eb',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '17px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
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