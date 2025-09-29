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
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-6 shadow-lg shadow-green-500/30">
                    <span className="text-4xl">✓</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 text-gray-900">Vielen Dank!</h2>
                <p className="text-gray-600 text-lg">
                    Ihre Angaben wurden erfolgreich übermittelt.
                </p>
            </div>
        )
    }

    const inputBaseClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"

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
                            className={inputBaseClasses}
                        />
                    )}

                    {field.type === 'EMAIL' && (
                        <input
                            type="email"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || 'beispiel@email.de'}
                            className={inputBaseClasses}
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
                            className={inputBaseClasses}
                        />
                    )}

                    {field.type === 'DATE' && (
                        <input
                            type="date"
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            className={inputBaseClasses}
                        />
                    )}

                    {field.type === 'TEXTAREA' && (
                        <textarea
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder || field.label}
                            rows={4}
                            className={inputBaseClasses}
                        />
                    )}

                    {field.type === 'SELECT' && field.options && (
                        <select
                            value={(formData[field.key] as string) || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            className={inputBaseClasses}
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
                                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all group"
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
                                    <span className="text-gray-700 group-hover:text-gray-900 font-medium">{option}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {field.type === 'CHECKBOX' && (
                        <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-white cursor-pointer transition-all">
                            <input
                                type="checkbox"
                                checked={(formData[field.key] as boolean) || false}
                                onChange={(e) => handleChange(field.key, e.target.checked)}
                                required={field.required}
                                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600"
                            />
                            <span className="text-gray-700 leading-relaxed">{field.description || field.label}</span>
                        </label>
                    )}
                </div>
            ))}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <span className="text-red-700 font-medium">{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
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