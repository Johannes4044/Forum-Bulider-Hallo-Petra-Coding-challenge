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
            <div className="text-center py-16 animate-scaleIn">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-4xl">✓</span>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Vielen Dank!</h2>
                <p className="text-gray-600 text-lg">
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
            <span className="text-base font-semibold text-gray-900">
              {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
                    </label>

                    {field.description && (
                        <p className="text-sm text-gray-600 mb-3">{field.description}</p>
                    )}

                    {field.type === 'TEXT' && (
                        <input
                            type="text"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || field.label}
                            className="input-base"
                        />
                    )}

                    {field.type === 'EMAIL' && (
                        <input
                            type="email"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || 'beispiel@email.de'}
                            className="input-base"
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
                            className="input-base"
                        />
                    )}

                    {field.type === 'DATE' && (
                        <input
                            type="date"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            className="input-base"
                        />
                    )}

                    {field.type === 'TEXTAREA' && (
                        <textarea
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || field.label}
                            rows={4}
                            className="input-base"
                        />
                    )}

                    {field.type === 'SELECT' && field.options && (
                        <select
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            className="input-base"
                        >
                            <option value="">Bitte wählen...</option>
                            {(Array.isArray(field.options) ? field.options : []).map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    )}

                    {field.type === 'RADIO' && field.options && (
                        <div className="space-y-2">
                            {(Array.isArray(field.options) ? field.options : []).map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl cursor-pointer transition-all group"
                                >
                                    <input
                                        type="radio"
                                        name={field.key}
                                        value={option}
                                        checked={(formData[field.key] as string) === option}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        required={field.required}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="text-gray-700 font-medium group-hover:text-gray-900">{option}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {field.type === 'CHECKBOX' && (
                        <label className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 cursor-pointer transition-all">
                            <input
                                type="checkbox"
                                checked={(formData[field.key] as boolean) || false}
                                onChange={(e) => handleChange(field.key, e.target.checked)}
                                required={field.required}
                                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600"
                            />
                            <span className="text-gray-700 font-medium leading-relaxed">{field.description || field.label}</span>
                        </label>
                    )}
                </div>
            ))}

            {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-slideDown">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <span className="text-red-700 font-medium">{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            <span>Wird gesendet...</span>
          </span>
                ) : (
                    '✓ Absenden'
                )}
            </button>
        </form>
    )
}