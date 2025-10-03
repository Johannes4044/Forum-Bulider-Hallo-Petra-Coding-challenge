'use client'

import FormActions from './FormActions'

type FormCardProps = {
    form: {
        id: string
        title: string
        description: string | null
        _count: {
            submissions: number
        }
    }
}

export default function FormCard({ form }: FormCardProps) {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 10px 40px rgba(11, 123, 255, 0.15)',
                border: '2px solid rgba(11, 123, 255, 0.1)',
                transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(11, 123, 255, 0.25)'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'rgba(11, 123, 255, 0.3)'
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(11, 123, 255, 0.15)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(11, 123, 255, 0.1)'
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '24px',
                gap: '20px',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'start', gap: '16px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        boxShadow: '0 4px 12px rgba(11, 123, 255, 0.3)',
                        flexShrink: 0
                    }}>
                        📋
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            fontSize: '26px',
                            fontWeight: '800',
                            color: '#111827',
                            marginBottom: '8px',
                            letterSpacing: '-0.02em',
                            margin: 0
                        }}>
                            {form.title}
                        </h2>
                        {form.description && (
                            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: '8px 0 0 0' }}>
                                {form.description}
                            </p>
                        )}
                    </div>
                </div>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, rgba(11, 123, 255, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                    border: '2px solid rgba(11, 123, 255, 0.3)',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: 'rgb(11, 123, 255)',
                    whiteSpace: 'nowrap',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: '20px' }}>📝</span>
                    <span>{form._count.submissions} Submission{form._count.submissions !== 1 ? 's' : ''}</span>
                </div>
            </div>

            <FormActions formId={form.id} formTitle={form.title} />
        </div>
    )
}
