'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'

export async function getAllForms() {
  try {
    // Authentifizierung prüfen
    await requireAuth()

    const forms = await prisma.form.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            fields: true,
            submissions: true
          }
        }
      }
    })

    return {
      success: true,
      forms: forms.map(form => ({
        ...form,
        createdAt: form.createdAt.toISOString(),
        updatedAt: form.updatedAt.toISOString()
      }))
    }
  } catch (error) {
    console.error('Error fetching forms:', error)
    return {
      success: false,
      error: 'Fehler beim Laden der Formulare'
    }
  }
}

export async function deleteForm(formId: string) {
  try {
    // Authentifizierung prüfen
    await requireAuth()

    await prisma.form.delete({
      where: { id: formId }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting form:', error)
    return {
      success: false,
      error: 'Fehler beim Löschen des Formulars'
    }
  }
}

export async function duplicateForm(formId: string) {
  try {
    // Authentifizierung prüfen
    await requireAuth()

    const originalForm = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!originalForm) {
      return {
        success: false,
        error: 'Formular nicht gefunden'
      }
    }

    const duplicatedForm = await prisma.form.create({
      data: {
        title: `${originalForm.title} (Kopie)`,
        description: originalForm.description,
        fields: {
          create: originalForm.fields.map(field => ({
            key: field.key,
            label: field.label,
            description: field.description,
            type: field.type,
            order: field.order,
            required: field.required,
            options: field.options,
            placeholder: field.placeholder,
            min: field.min,
            max: field.max
          }))
        }
      }
    })

    return {
      success: true,
      formId: duplicatedForm.id
    }
  } catch (error) {
    console.error('Error duplicating form:', error)
    return {
      success: false,
      error: 'Fehler beim Duplizieren des Formulars'
    }
  }
}