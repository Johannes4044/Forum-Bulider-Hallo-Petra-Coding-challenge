import { prisma } from '@/lib/prisma'
import FormCard from './FormCard'
import Navigation from '@/components/Navigation'

export const dynamic = 'force-dynamic'

export default async function SubmissionsPage() {
    const forms = await prisma.form.findMany({
        include: {
            _count: {
                select: { submissions: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe, #f0f9ff)' }}>
            <Navigation />

            <div style={{ padding: '48px 24px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                        padding: '40px',
                        borderRadius: '24px',
                        marginBottom: '40px',
                        boxShadow: '0 20px 60px rgba(11, 123, 255, 0.3)',
                        textAlign: 'center'
                    }}>
                        <h1 style={{
                            margin: 0,
                            fontSize: '42px',
                            fontWeight: '900',
                            color: 'white',
                            letterSpacing: '-0.02em',
                            textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
                        }}>
                            📊 Forms & Submissions
                        </h1>
                        <p style={{
                            margin: '12px 0 0 0',
                            fontSize: '18px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: '400'
                        }}>
                            Manage all your forms and view submitted responses
                        </p>
                    </div>

                {forms.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '64px 32px',
                        background: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 10px 40px rgba(11, 123, 255, 0.15)',
                        border: '2px solid rgba(11, 123, 255, 0.1)'
                    }}>
                        <div style={{
                            fontSize: '64px',
                            marginBottom: '16px',
                            opacity: 0.6
                        }}>📋</div>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: 0
                        }}>
                            No forms yet
                        </p>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '15px',
                            margin: '8px 0 0 0'
                        }}>
                            Create your first form to get started
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {forms.map((form) => (
                            <FormCard key={form.id} form={form} />
                        ))}
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}
