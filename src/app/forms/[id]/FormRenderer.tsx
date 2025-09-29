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
            // Validierung: Pflichtfelder prüfen
            for (const field of form.fields) {
                if (field.required && !formData[field.key]) {
                    throw new Error(`${field.label} ist ein Pflichtfeld`)
                }
            }

            // Server Action aufrufen
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

    // Erfolgsmeldung nach dem Absenden
    if (submitted) {
        return (
            <div className="text-center py-8">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <h2 className="text-2xl font-bold mb-2">Vielen Dank!</h2>
                <p className="text-gray-600">
                    Ihre Angaben wurden erfolgreich übermittelt.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
                <div key={field.id}>
                    <label className="block mb-2">
            <span className="font-medium">
              {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
                    </label>

                    {field.description && (
                        <p className="text-sm text-gray-500 mb-2">{field.description}</p>
                    )}

                    {/* TEXT */}
                    {field.type === 'TEXT' && (
                        <input
                            type="text"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || field.label}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    )}

                    {/* EMAIL */}
                    {field.type === 'EMAIL' && (
                        <input
                            type="email"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || 'beispiel@email.de'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    )}

                    {/* NUMBER */}
                    {field.type === 'NUMBER' && (
                        <input
                            type="number"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || '0'}
                            min={field.min ?? undefined}
                            max={field.max ?? undefined}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    )}

                    {/* DATE */}
                    {field.type === 'DATE' && (
                        <input
                            type="date"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    )}

                    {/* TEXTAREA */}
                    {field.type === 'TEXTAREA' && (
                        <textarea
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || field.label}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    )}

                    {/* SELECT */}
                    {field.type === 'SELECT' && field.options && (
                        <select
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Bitte wählen...</option>
                            {(Array.isArray(field.options) ? field.options : []).map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* RADIO */}
                    {field.type === 'RADIO' && field.options && (
                        <div className="space-y-2">
                            {(Array.isArray(field.options) ? field.options : []).map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={field.key}
                                        value={option}
                                        checked={(formData[field.key] as string) === option}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        required={field.required}
                                        className="w-4 h-4"
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {/* CHECKBOX */}
                    {field.type === 'CHECKBOX' && (
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={(formData[field.key] as boolean) || false}
                                onChange={(e) => handleChange(field.key, e.target.checked)}
                                required={field.required}
                                className="w-5 h-5"
                            />
                            <span>{field.description || 'Zustimmen'}</span>
                        </label>
                    )}
                </div>
            ))}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
                {isSubmitting ? 'Wird gesendet...' : 'Absenden'}
            </button>
        </form>
    )
}