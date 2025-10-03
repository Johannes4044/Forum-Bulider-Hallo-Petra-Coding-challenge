'use server'

import { prisma } from '@/lib/prisma'

export async function submitForm(
    formId: string,
    data: Record<string, string | boolean>
) {
    try {
        // Formular-Submission in der Datenbank speichern
        await prisma.formSubmission.create({
            data: {
                formId,
                data, // JSON-Feld mit allen Antworten
            },
        })

        return { success: true }
    } catch (error) {
        console.error('Error submitting form:', error)
        return {
            success: false,
            error: 'Fehler beim Speichern der Daten',
        }
    }
}