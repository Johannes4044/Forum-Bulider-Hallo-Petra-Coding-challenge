import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import FormRenderer from './FormRenderer'
import Link from 'next/link'


export default async function PublicFormPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const form = await prisma.form.findUnique({
        where: { id },
        include: {
            fields: {
                orderBy: { order: 'asc' },
            },
        },
    })

    if (!form) {
        notFound()
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe, #f0f9ff)' }}>
            {/* Navigation */}
            <nav style={{
                backgroundColor: 'white',
                borderBottom: '2px solid rgba(11, 123, 255, 0.1)',
                padding: '20px 24px',
                boxShadow: '0 4px 12px rgba(11, 123, 255, 0.08)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '28px',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em'
                    }}>
                        FormBuilder
                    </h1>
                </div>
            </nav>

            <main style={{ padding: '48px 20px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                    backgroundColor: 'white',
                    border: '2px solid rgba(11, 123, 255, 0.1)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(11, 123, 255, 0.2)'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgb(11, 123, 255) 0%, rgb(59, 130, 246) 100%)',
                        padding: '48px 40px',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '56px',
                            marginBottom: '16px'
                        }}>
                            📝
                        </div>
                        <h1 style={{
                            margin: 0,
                            marginBottom: '16px',
                            fontSize: '38px',
                            fontWeight: '900',
                            letterSpacing: '-0.02em',
                            textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
                        }}>
                            {form.title}
                        </h1>
                        {form.description && (
                            <p style={{
                                margin: 0,
                                fontSize: '18px',
                                opacity: 0.95,
                                lineHeight: '1.6',
                                fontWeight: '400'
                            }}>
                                {form.description}
                            </p>
                        )}
                    </div>

                    {/* Form */}
                    <div style={{ padding: '48px 40px' }}>
                        <FormRenderer form={form} />
                    </div>
                </div>
            </main>
        </div>
    )
}