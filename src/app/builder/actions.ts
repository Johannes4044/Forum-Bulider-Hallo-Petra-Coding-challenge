'use server'

import { prisma } from '@/lib/prisma'

type FieldType = 'TEXT' | 'EMAIL' | 'NUMBER' | 'DATE' | 'TEXTAREA' | 'SELECT' | 'RADIO' | 'CHECKBOX'

type FieldInput = {
    key: string
    label: string
    description: string
    type: FieldType
    required: boolean
    options: string[] | null
    placeholder: string | null
    min: number | null
    max: number | null
    order: number
}

type FormInput = {
    title: string
    description: string
    fields: FieldInput[]
}

export async function createForm(data: FormInput) {
    try {
        // Validierung
        if (!data.title.trim()) {
            return { success: false, error: 'Titel ist erforderlich' }
        }

        if (data.fields.length === 0) {
            return { success: false, error: 'Mindestens ein Feld ist erforderlich' }
        }

        // Prüfen ob alle Keys eindeutig sind
        const keys = data.fields.map((f) => f.key)
        const uniqueKeys = new Set(keys)
        if (keys.length !== uniqueKeys.size) {
            return { success: false, error: 'Alle Keys müssen eindeutig sein' }
        }

        // Formular mit allen Feldern in einer Transaktion erstellen
        const form = await prisma.form.create({
            data: {
                title: data.title,
                description: data.description || null,
                fields: {
                    create: data.fields.map((field) => ({
                        key: field.key,
                        label: field.label,
                        description: field.description || null,
                        type: field.type,
                        required: field.required,
                        order: field.order,
                        options: field.options,
                        placeholder: field.placeholder,
                        min: field.min,
                        max: field.max,
                    })),
                },
            },
        })

        return {
            success: true,
            formId: form.id,
        }
    } catch (error) {
        console.error('Error creating form:', error)
        return {
            success: false,
            error: 'Fehler beim Erstellen des Formulars',
        }
    }
}