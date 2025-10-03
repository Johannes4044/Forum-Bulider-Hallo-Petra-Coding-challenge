import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import SubmissionCard from './SubmissionCard'

export const dynamic = 'force-dynamic'

export default async function FormSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const form = await prisma.form.findUnique({
        where: { id },
        include: {
            fields: {
                orderBy: { order: 'asc' }
            },
            submissions: {
                orderBy: { submittedAt: 'desc' }
            }
        }
    })

    if (!form) {
        notFound()
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe, #f0f9ff)' }}>
            <Navigation />

            <div style={{ padding: '48px 20px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                        padding: '40px',
                        borderRadius: '24px',
                        marginBottom: '40px',
                        boxShadow: '0 20px 60px rgba(11, 123, 255, 0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                📊
                            </div>
                            <div>
                                <h1 style={{
                                    margin: 0,
                                    fontSize: '42px',
                                    fontWeight: '900',
                                    color: 'white',
                                    letterSpacing: '-0.02em',
                                    textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
                                }}>
                                    {form.title}
                                </h1>
                                <p style={{
                                    margin: '8px 0 0 0',
                                    fontSize: '18px',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: '600'
                                }}>
                                    {form.submissions.length} Submission{form.submissions.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                {form.submissions.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '64px 32px',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 10px 40px rgba(11, 123, 255, 0.15)',
                        border: '2px solid rgba(11, 123, 255, 0.1)'
                    }}>
                        <div style={{
                            fontSize: '64px',
                            marginBottom: '16px',
                            opacity: 0.6
                        }}>📝</div>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: 0
                        }}>
                            No submissions yet
                        </p>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '15px',
                            margin: '8px 0 0 0'
                        }}>
                            Share your form to start receiving submissions
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {form.submissions.map((submission) => (
                            <SubmissionCard
                                key={submission.id}
                                submission={submission}
                                fields={form.fields}
                            />
                        ))}
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}
