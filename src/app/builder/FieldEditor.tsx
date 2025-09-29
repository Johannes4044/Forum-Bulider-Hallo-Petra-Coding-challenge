'use client'

import { useState, useEffect } from 'react'

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

type Props = {
    field: Field
    onSave: (field: Field) => void
    onCancel: () => void
}

const FIELD_TYPE_INFO: Record<FieldType, { label: string; emoji: string; needsOptions: boolean }> = {
    TEXT: { label: 'Text-Eingabe', emoji: '📝', needsOptions: false },
    EMAIL: { label: 'E-Mail', emoji: '📧', needsOptions: false },
    NUMBER: { label: 'Zahl', emoji: '🔢', needsOptions: false },
    DATE: { label: 'Datum', emoji: '📅', needsOptions: false },
    TEXTAREA: { label: 'Mehrzeiliger Text', emoji: '📄', needsOptions: false },
    SELECT: { label: 'Dropdown', emoji: '📋', needsOptions: true },
    RADIO: { label: 'Radio-Buttons', emoji: '🔘', needsOptions: true },
    CHECKBOX: { label: 'Checkbox', emoji: '☑️', needsOptions: false },
}

export default function FieldEditor({ field, onSave, onCancel }: Props) {
    const [editedField, setEditedField] = useState<Field>(field)
    const [optionsText, setOptionsText] = useState(field.options.join('\n'))
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!editedField.key && editedField.label) {
            const autoKey = editedField.label
                .toLowerCase()
                .replace(/[äöü]/g, (char) => ({ ä: 'ae', ö: 'oe', ü: 'ue' }[char] || char))
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_|_$/g, '')
            setEditedField({ ...editedField, key: autoKey })
        }
    }, [editedField.label])

    const handleSave = () => {
        setError(null)

        if (!editedField.key.trim()) {
            setError('Key ist erforderlich')
            return
        }

        if (!editedField.label.trim()) {
            setError('Label ist erforderlich')
            return
        }

        if (!/^[a-z0-9_]+$/.test(editedField.key)) {
            setError('Key darf nur Kleinbuchstaben, Zahlen und Unterstriche enthalten')
            return
        }

        let options: string[] = []
        if (FIELD_TYPE_INFO[editedField.type].needsOptions) {
            options = optionsText
                .split('\n')
                .map((opt) => opt.trim())
                .filter((opt) => opt.length > 0)

            if (options.length === 0) {
                setError(`${FIELD_TYPE_INFO[editedField.type].label}-Felder benötigen mindestens eine Option`)
                return
            }
        }

        onSave({
            ...editedField,
            options,
        })
    }

    const needsOptions = FIELD_TYPE_INFO[editedField.type].needsOptions

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl">
                            {FIELD_TYPE_INFO[editedField.type].emoji}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">Feld bearbeiten</h2>
                            <p className="text-blue-100 text-sm mt-1">Konfiguriere dein Formular-Feld</p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-lg transition"
                        >
                            <span className="text-2xl">×</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Feldtyp */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Feldtyp <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={editedField.type}
                            onChange={(e) => {
                                const newType = e.target.value as FieldType
                                setEditedField({ ...editedField, type: newType })
                                if (!FIELD_TYPE_INFO[newType].needsOptions) {
                                    setOptionsText('')
                                }
                            }}
                            className="input-base"
                        >
                            {(Object.entries(FIELD_TYPE_INFO) as [FieldType, typeof FIELD_TYPE_INFO[FieldType]][]).map(
                                ([type, info]) => (
                                    <option key={type} value={type}>
                                        {info.emoji} {info.label}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Label */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Label <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editedField.label}
                            onChange={(e) => setEditedField({ ...editedField, label: e.target.value })}
                            className="input-base"
                            placeholder="z.B. Telefonnummer"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Der Text, der dem Nutzer angezeigt wird</p>
                    </div>

                    {/* Key */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Key <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editedField.key}
                            onChange={(e) => setEditedField({ ...editedField, key: e.target.value })}
                            className="input-base font-mono text-sm"
                            placeholder="z.B. contact_phone"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                            Eindeutiger Identifier (nur Kleinbuchstaben, Zahlen, Unterstriche)
                        </p>
                    </div>

                    {/* Beschreibung */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Beschreibung (optional)
                        </label>
                        <textarea
                            value={editedField.description}
                            onChange={(e) => setEditedField({ ...editedField, description: e.target.value })}
                            className="input-base"
                            placeholder="Zusätzliche Hinweise für den Nutzer"
                            rows={2}
                        />
                    </div>

                    {/* Placeholder */}
                    {['TEXT', 'EMAIL', 'NUMBER', 'TEXTAREA'].includes(editedField.type) && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Platzhalter (optional)
                            </label>
                            <input
                                type="text"
                                value={editedField.placeholder}
                                onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })}
                                className="input-base"
                                placeholder="z.B. Hier eingeben..."
                            />
                        </div>
                    )}

                    {/* Min/Max */}
                    {editedField.type === 'NUMBER' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Minimum (optional)
                                </label>
                                <input
                                    type="number"
                                    value={editedField.min ?? ''}
                                    onChange={(e) =>
                                        setEditedField({
                                            ...editedField,
                                            min: e.target.value ? parseInt(e.target.value) : null,
                                        })
                                    }
                                    className="input-base"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Maximum (optional)
                                </label>
                                <input
                                    type="number"
                                    value={editedField.max ?? ''}
                                    onChange={(e) =>
                                        setEditedField({
                                            ...editedField,
                                            max: e.target.value ? parseInt(e.target.value) : null,
                                        })
                                    }
                                    className="input-base"
                                    placeholder="100"
                                />
                            </div>
                        </div>
                    )}

                    {/* Pflichtfeld */}
                    {editedField.type !== 'CHECKBOX' && (
                        <label className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 cursor-pointer transition-all">
                            <input
                                type="checkbox"
                                checked={editedField.required}
                                onChange={(e) => setEditedField({ ...editedField, required: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600"
                            />
                            <span className="font-semibold text-gray-900">Pflichtfeld (muss ausgefüllt werden)</span>
                        </label>
                    )}

                    {/* Optionen */}
                    {needsOptions && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Auswahloptionen <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={optionsText}
                                onChange={(e) => setOptionsText(e.target.value)}
                                className="input-base font-mono text-sm"
                                placeholder="Eine Option pro Zeile&#10;Option 1&#10;Option 2&#10;Option 3"
                                rows={6}
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Jede Zeile wird zu einer Auswahloption</p>
                            {optionsText && (
                                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="text-sm font-semibold text-blue-900 mb-2">Vorschau:</p>
                                    <div className="space-y-2">
                                        {optionsText
                                            .split('\n')
                                            .filter((opt) => opt.trim())
                                            .map((opt, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-blue-800">
                                                    <span>{editedField.type === 'RADIO' ? '🔘' : '📋'}</span>
                                                    <span>{opt.trim()}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                            <span className="text-xl flex-shrink-0">⚠️</span>
                            <span className="text-red-700 font-medium">{error}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                        ✓ Speichern
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                        Abbrechen
                    </button>
                </div>
            </div>
        </div>
    )
}