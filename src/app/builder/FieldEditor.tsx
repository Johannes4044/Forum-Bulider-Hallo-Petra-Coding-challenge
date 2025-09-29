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

    // Key automatisch aus Label generieren (nur bei neuen Feldern)
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

        // Validierung
        if (!editedField.key.trim()) {
            setError('Key ist erforderlich')
            return
        }

        if (!editedField.label.trim()) {
            setError('Label ist erforderlich')
            return
        }

        // Key-Format prüfen
        if (!/^[a-z0-9_]+$/.test(editedField.key)) {
            setError('Key darf nur Kleinbuchstaben, Zahlen und Unterstriche enthalten')
            return
        }

        // Options für SELECT/RADIO-Felder
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-6">Feld bearbeiten</h2>

                <div className="space-y-4">
                    {/* Feldtyp */}
                    <div>
                        <label className="block font-medium mb-2">
                            Feldtyp <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={editedField.type}
                            onChange={(e) => {
                                const newType = e.target.value as FieldType
                                setEditedField({ ...editedField, type: newType })
                                // Optionen zurücksetzen wenn neuer Typ keine braucht
                                if (!FIELD_TYPE_INFO[newType].needsOptions) {
                                    setOptionsText('')
                                }
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        <label className="block font-medium mb-2">
                            Label <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editedField.label}
                            onChange={(e) => setEditedField({ ...editedField, label: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="z.B. Telefonnummer"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Der Text, der dem Nutzer angezeigt wird
                        </p>
                    </div>

                    {/* Key */}
                    <div>
                        <label className="block font-medium mb-2">
                            Key <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editedField.key}
                            onChange={(e) => setEditedField({ ...editedField, key: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="z.B. contact_phone"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Eindeutiger Identifier (nur Kleinbuchstaben, Zahlen, Unterstriche)
                        </p>
                    </div>

                    {/* Beschreibung */}
                    <div>
                        <label className="block font-medium mb-2">
                            Beschreibung (optional)
                        </label>
                        <textarea
                            value={editedField.description}
                            onChange={(e) =>
                                setEditedField({ ...editedField, description: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Zusätzliche Hinweise für den Nutzer"
                            rows={2}
                        />
                    </div>

                    {/* Placeholder (für Text-Felder) */}
                    {['TEXT', 'EMAIL', 'NUMBER', 'TEXTAREA'].includes(editedField.type) && (
                        <div>
                            <label className="block font-medium mb-2">Platzhalter (optional)</label>
                            <input
                                type="text"
                                value={editedField.placeholder}
                                onChange={(e) =>
                                    setEditedField({ ...editedField, placeholder: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="z.B. Hier eingeben..."
                            />
                        </div>
                    )}

                    {/* Min/Max (für Number) */}
                    {editedField.type === 'NUMBER' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium mb-2">Minimum (optional)</label>
                                <input
                                    type="number"
                                    value={editedField.min ?? ''}
                                    onChange={(e) =>
                                        setEditedField({
                                            ...editedField,
                                            min: e.target.value ? parseInt(e.target.value) : null,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-2">Maximum (optional)</label>
                                <input
                                    type="number"
                                    value={editedField.max ?? ''}
                                    onChange={(e) =>
                                        setEditedField({
                                            ...editedField,
                                            max: e.target.value ? parseInt(e.target.value) : null,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="100"
                                />
                            </div>
                        </div>
                    )}

                    {/* Pflichtfeld (nicht für Checkbox) */}
                    {editedField.type !== 'CHECKBOX' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="required"
                                checked={editedField.required}
                                onChange={(e) =>
                                    setEditedField({ ...editedField, required: e.target.checked })
                                }
                                className="w-4 h-4"
                            />
                            <label htmlFor="required" className="font-medium cursor-pointer">
                                Pflichtfeld
                            </label>
                        </div>
                    )}

                    {/* Optionen (für SELECT/RADIO) */}
                    {needsOptions && (
                        <div>
                            <label className="block font-medium mb-2">
                                Auswahloptionen <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={optionsText}
                                onChange={(e) => setOptionsText(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                placeholder="Eine Option pro Zeile"
                                rows={6}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Jede Zeile wird zu einer Auswahloption
                            </p>
                            {optionsText && (
                                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                                    <p className="text-sm font-medium mb-1">Vorschau:</p>
                                    <ul className="text-sm space-y-1">
                                        {optionsText
                                            .split('\n')
                                            .filter((opt) => opt.trim())
                                            .map((opt, i) => (
                                                <li key={i} className="text-gray-700">
                                                    {editedField.type === 'RADIO' ? '🔘' : '•'} {opt.trim()}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Speichern
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Abbrechen
                    </button>
                </div>
            </div>
        </div>
    )
}