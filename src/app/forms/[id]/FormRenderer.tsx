'use client'

import { useState } from 'react'
import { submitForm } from './actions'

type FieldType = 'TEXT' | 'EMAIL' | 'NUMBER' | 'DATE' | 'TEXTAREA' | 'SELECT' | 'RADIO' | 'CHECKBOX'

type FormField = {
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
}

type Form = {
    id: string
    title: string
    fields: FormField[]
}

export default function FormRenderer({ form }: { form: Form }) {
    const [formData, setFormData] = useState<Record<string, string | boolean>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (key: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            for (const field of form.fields) {
                if (field.required && !formData[field.key]) {
                    throw new Error(`${field.label} ist ein Pflichtfeld`)
                }
            }

            const result = await submitForm(form.id, formData)

            if (result.success) {
                setSubmitted(true)
            } else {
                setError(result.error || 'Ein Fehler ist aufgetreten')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '64px 20px' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, rgba(11, 123, 255, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                    borderRadius: '50%',
                    marginBottom: '32px',
                    boxShadow: '0 10px 40px rgba(11, 123, 255, 0.2)'
                }}>
                    <div style={{
                        width: '96px',
                        height: '96px',
                        background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(11, 123, 255, 0.3)'
                    }}>
                        <span style={{ color: 'white', fontSize: '48px' }}>✓</span>
                    </div>
                </div>
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: '900',
                    color: '#111827',
                    marginBottom: '16px',
                    letterSpacing: '-0.02em'
                }}>
                    Thank You!
                </h2>
                <p style={{
                    color: '#6b7280',
                    fontSize: '18px',
                    lineHeight: '1.6',
                    fontWeight: '500'
                }}>
                    Your submission has been received successfully.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '28px' }}>
            {form.fields.map((field) => (
                <div key={field.id}>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>
                            {field.label}
                            {field.required && <span style={{ color: 'rgb(239, 68, 68)', marginLeft: '4px', fontSize: '18px' }}>*</span>}
                        </span>
                    </label>

                    {field.description && (
                        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.6', fontWeight: '500' }}>{field.description}</p>
                    )}

                    {field.type === 'TEXT' && (
                        <input
                            type="text"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || field.label}
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                backgroundColor: '#fafbfc',
                                fontWeight: '500'
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
                        />
                    )}

                    {field.type === 'EMAIL' && (
                        <input
                            type="email"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || 'example@email.com'}
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                backgroundColor: '#fafbfc',
                                fontWeight: '500'
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
                        />
                    )}

                    {field.type === 'NUMBER' && (
                        <input
                            type="number"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || '0'}
                            min={field.min ?? undefined}
                            max={field.max ?? undefined}
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                backgroundColor: '#fafbfc',
                                fontWeight: '500'
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
                        />
                    )}

                    {field.type === 'DATE' && (
                        <input
                            type="date"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                backgroundColor: '#fafbfc',
                                fontWeight: '500'
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
                        />
                    )}

                    {field.type === 'TEXTAREA' && (
                        <textarea
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || field.label}
                            rows={5}
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                fontFamily: 'inherit',
                                backgroundColor: '#fafbfc',
                                resize: 'vertical',
                                fontWeight: '500'
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
                        />
                    )}

                    {field.type === 'SELECT' && field.options && (
                        <select
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                backgroundColor: '#fafbfc',
                                fontWeight: '500',
                                cursor: 'pointer'
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
                        >
                            <option value="">Please select...</option>
                            {(Array.isArray(field.options) ? field.options : []).map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    )}

                    {field.type === 'RADIO' && field.options && (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {(Array.isArray(field.options) ? field.options : []).map((option) => (
                                <label
                                    key={option}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: '16px 20px',
                                        backgroundColor: '#fafbfc',
                                        border: '2px solid ' + ((formData[field.key] as string) === option ? 'rgb(11, 123, 255)' : '#e5e7eb'),
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: (formData[field.key] as string) === option ? '0 4px 12px rgba(11, 123, 255, 0.15)' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'rgb(11, 123, 255)';
                                        e.currentTarget.style.backgroundColor = 'rgba(11, 123, 255, 0.08)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 123, 255, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        const isChecked = (formData[field.key] as string) === option;
                                        e.currentTarget.style.borderColor = isChecked ? 'rgb(11, 123, 255)' : '#e5e7eb';
                                        e.currentTarget.style.backgroundColor = isChecked ? 'rgba(11, 123, 255, 0.05)' : '#fafbfc';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = isChecked ? '0 4px 12px rgba(11, 123, 255, 0.15)' : 'none';
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name={field.key}
                                        value={option}
                                        checked={(formData[field.key] as string) === option}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        required={field.required}
                                        style={{ width: '22px', height: '22px', accentColor: 'rgb(11, 123, 255)', cursor: 'pointer' }}
                                    />
                                    <span style={{ color: '#111827', fontWeight: '600', fontSize: '16px' }}>{option}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {field.type === 'CHECKBOX' && (
                        <label style={{
                            display: 'flex',
                            alignItems: 'start',
                            gap: '14px',
                            padding: '18px 20px',
                            backgroundColor: 'rgba(11, 123, 255, 0.05)',
                            border: '2px solid rgba(11, 123, 255, 0.3)',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 8px rgba(11, 123, 255, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(11, 123, 255, 0.1)';
                            e.currentTarget.style.borderColor = 'rgb(11, 123, 255)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 123, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(11, 123, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(11, 123, 255, 0.3)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(11, 123, 255, 0.1)';
                        }}
                        >
                            <input
                                type="checkbox"
                                checked={(formData[field.key] as boolean) || false}
                                onChange={(e) => handleChange(field.key, e.target.checked)}
                                required={field.required}
                                style={{
                                    width: '22px',
                                    height: '22px',
                                    marginTop: '2px',
                                    accentColor: 'rgb(11, 123, 255)',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                }}
                            />
                            <span style={{ color: '#111827', fontWeight: '600', lineHeight: '1.6', fontSize: '16px' }}>
                                {field.description || field.label}
                            </span>
                        </label>
                    )}
                </div>
            ))}

            {error && (
                <div style={{
                    padding: '20px 24px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                    border: '2px solid rgb(239, 68, 68)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '14px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                }}>
                    <span style={{ fontSize: '24px', flexShrink: 0 }}>⚠️</span>
                    <span style={{ color: '#991b1b', fontWeight: '700', fontSize: '16px' }}>{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                style={{
                    width: '100%',
                    padding: '18px 24px',
                    background: isSubmitting ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                    color: 'white',
                    fontSize: '19px',
                    fontWeight: '800',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isSubmitting ? 'none' : '0 8px 24px rgba(11, 123, 255, 0.4)',
                    letterSpacing: '-0.01em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
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
                        <span>Submitting...</span>
                    </>
                ) : (
                    <>
                        <span style={{ fontSize: '24px' }}>✓</span>
                        <span>Submit Form</span>
                    </>
                )}
            </button>
        </form>
    )
}