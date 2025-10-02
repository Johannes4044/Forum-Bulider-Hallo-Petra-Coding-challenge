'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'

type FieldType = 'TEXT' | 'EMAIL' | 'NUMBER' | 'DATE' | 'TEXTAREA' | 'SELECT' | 'RADIO' | 'CHECKBOX'

type FieldInput = {
  id: string | null // null for new fields
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

export async function getFormForEdit(formId: string) {
  try {
    // Authentifizierung prüfen
    await requireAuth()

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!form) {
      return {
        success: false,
        error: 'Formular nicht gefunden'
      }
    }

    return {
      success: true,
      form
    }
  } catch (error) {
    console.error('Error fetching form for edit:', error)
    return {
      success: false,
      error: 'Fehler beim Laden des Formulars'
    }
  }
}

export async function updateForm(formId: string, data: FormInput) {
  try {
    // Authentifizierung prüfen
    await requireAuth()

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

    // Transaction for updating form and fields
    await prisma.$transaction(async (tx) => {
      // Update form basic info
      await tx.form.update({
        where: { id: formId },
        data: {
          title: data.title,
          description: data.description || null
        }
      })

      // Get existing fields
      const existingFields = await tx.formField.findMany({
        where: { formId },
        select: { id: true }
      })

      // Delete removed fields (fields that exist in DB but not in input)
      const inputFieldIds = data.fields.map(f => f.id).filter(id => id !== null)
      const fieldsToDelete = existingFields.filter(f => !inputFieldIds.includes(f.id))

      if (fieldsToDelete.length > 0) {
        await tx.formField.deleteMany({
          where: {
            id: { in: fieldsToDelete.map(f => f.id) }
          }
        })
      }

      // Update existing fields and create new ones
      for (const field of data.fields) {
        const fieldData = {
          key: field.key,
          label: field.label,
          description: field.description || null,
          type: field.type,
          required: field.required,
          order: field.order,
          options: field.options as any,
          placeholder: field.placeholder,
          min: field.min,
          max: field.max
        }

        if (field.id) {
          // Update existing field
          await tx.formField.update({
            where: { id: field.id },
            data: fieldData
          })
        } else {
          // Create new field
          await tx.formField.create({
            data: {
              ...fieldData,
              formId
            }
          })
        }
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating form:', error)
    return {
      success: false,
      error: 'Fehler beim Aktualisieren des Formulars'
    }
  }
}