'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteForm(formId: string) {
    try {
        await prisma.form.delete({
            where: { id: formId }
        })

        revalidatePath('/submissions')
        return { success: true }
    } catch (error) {
        console.error('Error deleting form:', error)
        return {
            success: false,
            error: 'Fehler beim Löschen des Formulars',
        }
    }
}

export async function duplicateForm(formId: string) {
    try {
        const originalForm = await prisma.form.findUnique({
            where: { id: formId },
            include: {
                fields: {
                    orderBy: { order: 'asc' }
                }
            }
        })

        if (!originalForm) {
            return { success: false, error: 'Formular nicht gefunden' }
        }

        const newForm = await prisma.form.create({
            data: {
                title: `${originalForm.title} (Kopie)`,
                description: originalForm.description,
                fields: {
                    create: originalForm.fields.map((field) => ({
                        key: field.key,
                        label: field.label,
                        description: field.description,
                        type: field.type,
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

        revalidatePath('/submissions')
        return { success: true, formId: newForm.id }
    } catch (error) {
        console.error('Error duplicating form:', error)
        return {
            success: false,
            error: 'Fehler beim Duplizieren des Formulars',
        }
    }
}
