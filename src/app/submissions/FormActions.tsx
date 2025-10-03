'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteForm, duplicateForm } from './actions'

export default function FormActions({ formId, formTitle }: { formId: string, formTitle: string }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDuplicating, setIsDuplicating] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Möchten Sie das Formular "${formTitle}" wirklich löschen? Alle Submissions werden ebenfalls gelöscht.`)) {
            return
        }

        setIsDeleting(true)
        const result = await deleteForm(formId)

        if (result.success) {
            router.refresh()
        } else {
            alert(result.error)
            setIsDeleting(false)
        }
    }

    const handleDuplicate = async () => {
        setIsDuplicating(true)
        const result = await duplicateForm(formId)

        if (result.success) {
            router.refresh()
        } else {
            alert(result.error)
            setIsDuplicating(false)
        }
    }

    return (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
                href={`/submissions/${formId}`}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(11, 123, 255, 0.3)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(11, 123, 255, 0.4)'
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 123, 255, 0.3)'
                }}
            >
                <span style={{ fontSize: '18px' }}>📊</span>
                <span>View Submissions</span>
            </a>
            <a
                href={`/forms/${formId}`}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    background: 'white',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
            >
                <span style={{ fontSize: '18px' }}>👁️</span>
                <span>Preview</span>
            </a>
            <a
                href={`/builder/${formId}`}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    background: 'white',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
            >
                <span style={{ fontSize: '18px' }}>✏️</span>
                <span>Edit</span>
            </a>
            <button
                onClick={handleDuplicate}
                disabled={isDuplicating}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    opacity: isDuplicating ? 0.6 : 1,
                    cursor: isDuplicating ? 'not-allowed' : 'pointer'
                }}
                onMouseOver={(e) => {
                    if (!isDuplicating) {
                        e.currentTarget.style.transform = 'translateY(-3px)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)'
                    }
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
            >
                <span style={{ fontSize: '18px' }}>📋</span>
                <span>{isDuplicating ? 'Duplicating...' : 'Duplicate'}</span>
            </button>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    opacity: isDeleting ? 0.6 : 1,
                    cursor: isDeleting ? 'not-allowed' : 'pointer'
                }}
                onMouseOver={(e) => {
                    if (!isDeleting) {
                        e.currentTarget.style.transform = 'translateY(-3px)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)'
                    }
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
            >
                <span style={{ fontSize: '18px' }}>🗑️</span>
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
        </div>
    )
}
