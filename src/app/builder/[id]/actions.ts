'use server'

import { prisma } from '@/lib/prisma'
import { FieldType } from '@prisma/client'

export async function getForm(formId: string) {
    try {
        const form = await prisma.form.findUnique({
            where: { id: formId },
            include: {
                fields: {
                    orderBy: { order: 'asc' }
                }
            }
        })

        if (!form) {
            return { success: false, error: 'Formular nicht gefunden' }
        }

        return { success: true, form }
    } catch (error) {
        console.error('Error fetching form:', error)
        return { success: false, error: 'Fehler beim Laden des Formulars' }
    }
}

export async function updateForm(
    formId: string,
    data: {
        title: string
        description: string
        fields: Array<{
            id?: string
            key: string
            label: string
            description: string
            type: string
            required: boolean
            options: string[] | null
            placeholder: string | null
            min: number | null
            max: number | null
            order: number
        }>
    }
) {
    try {
        // Delete all existing fields
        await prisma.formField.deleteMany({
            where: { formId }
        })

        // Update form and create new fields
        await prisma.form.update({
            where: { id: formId },
            data: {
                title: data.title,
                description: data.description || null,
                fields: {
                    create: data.fields.map((field) => ({
                        key: field.key,
                        label: field.label,
                        description: field.description || null,
                        type: field.type as FieldType,
                        required: field.required,
                        options: field.options || undefined,
                        placeholder: field.placeholder,
                        min: field.min,
                        max: field.max,
                        order: field.order,
                    }))
                }
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Error updating form:', error)
        return {
            success: false,
            error: 'Fehler beim Aktualisieren des Formulars',
        }
    }
}
