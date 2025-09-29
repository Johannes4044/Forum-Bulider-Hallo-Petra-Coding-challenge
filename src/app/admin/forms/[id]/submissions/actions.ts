'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'

export async function getFormSubmissions(formId: string) {
  try {
    // Authentifizierung prüfen
    await requireAuth()

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          select: {
            key: true,
            label: true,
            type: true
          },
          orderBy: { order: 'asc' }
        },
        submissions: {
          orderBy: { submittedAt: 'desc' }
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
      form: {
        ...form,
        submissions: form.submissions.map(submission => ({
          ...submission,
          submittedAt: submission.submittedAt.toISOString()
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching form submissions:', error)
    return {
      success: false,
      error: 'Fehler beim Laden der Submissions'
    }
  }
}

export async function deleteSubmission(submissionId: string) {
  try {
    // Authentifizierung prüfen
    await requireAuth()

    await prisma.formSubmission.delete({
      where: { id: submissionId }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting submission:', error)
    return {
      success: false,
      error: 'Fehler beim Löschen der Submission'
    }
  }
}

export async function exportSubmissions(formId: string) {
  try {
    // Authentifizierung prüfen
    await requireAuth()

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          select: {
            key: true,
            label: true,
            type: true
          },
          orderBy: { order: 'asc' }
        },
        submissions: {
          orderBy: { submittedAt: 'desc' }
        }
      }
    })

    if (!form) {
      return {
        success: false,
        error: 'Formular nicht gefunden'
      }
    }

    // Create CSV headers
    const headers = ['Eingereicht am', ...form.fields.map(field => field.label)]

    // Create CSV rows
    const rows = form.submissions.map(submission => {
      const row = [
        new Date(submission.submittedAt).toLocaleDateString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      ]

      form.fields.forEach(field => {
        const value = submission.data[field.key]
        if (Array.isArray(value)) {
          row.push(value.join(', '))
        } else if (value !== null && value !== undefined) {
          row.push(String(value))
        } else {
          row.push('')
        }
      })

      return row
    })

    // Convert to CSV format with proper escaping
    const escapeCsvField = (field: string) => {
      if (field.includes('"') || field.includes(',') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`
      }
      return field
    }

    const csvContent = [
      headers.map(escapeCsvField).join(','),
      ...rows.map(row => row.map(escapeCsvField).join(','))
    ].join('\n')

    // Add BOM for proper UTF-8 encoding in Excel
    const csvData = '\ufeff' + csvContent

    return {
      success: true,
      csvData
    }
  } catch (error) {
    console.error('Error exporting submissions:', error)
    return {
      success: false,
      error: 'Fehler beim Exportieren der Submissions'
    }
  }
}