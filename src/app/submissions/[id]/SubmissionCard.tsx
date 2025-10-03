'use client'

type Field = {
    id: string
    key: string
    label: string
}

type SubmissionCardProps = {
    submission: {
        id: string
        submittedAt: Date
        data: any
    }
    fields: Field[]
}

export default function SubmissionCard({ submission, fields }: SubmissionCardProps) {
    const data = submission.data as Record<string, string | boolean>

    return (
        <div
            style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(11, 123, 255, 0.15)',
                border: '2px solid rgba(11, 123, 255, 0.1)',
                padding: '32px',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(11, 123, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(11, 123, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(11, 123, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(11, 123, 255, 0.1)';
            }}
        >
            <div style={{
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '2px solid rgba(11, 123, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: '0 4px 12px rgba(11, 123, 255, 0.3)'
                }}>
                    📅
                </div>
                <p style={{ fontSize: '15px', color: '#6b7280', fontWeight: '700', margin: 0 }}>
                    Submitted: {new Date(submission.submittedAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                    })}
                </p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
                {fields.map((field) => {
                    const value = data[field.key]

                    return (
                        <div
                            key={field.id}
                            style={{
                                borderLeft: '4px solid rgb(11, 123, 255)',
                                paddingLeft: '20px',
                                background: 'linear-gradient(135deg, rgba(11, 123, 255, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <p style={{
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#111827',
                                marginBottom: '8px',
                                margin: 0
                            }}>
                                {field.label}
                            </p>
                            <p style={{ color: '#374151', fontSize: '16px', fontWeight: '500', margin: '8px 0 0 0' }}>
                                {typeof value === 'boolean'
                                    ? (value ? '✓ Yes' : '✗ No')
                                    : value || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No answer</span>
                                }
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
