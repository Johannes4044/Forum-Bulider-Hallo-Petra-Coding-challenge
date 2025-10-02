import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import FormRenderer from './FormRenderer'
import Link from 'next/link'
import { SimpleLogo } from '@/components/SimpleLogo'


export default async function PublicFormPage({
                                                 params,
                                             }: {
    params: { id: string }
}) {
    const form = await prisma.form.findUnique({
        where: { id: params.id },
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
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Navigation */}
            <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '10px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <SimpleLogo size={32} />
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>HalloPetra FormBuilder</span>
                    </div>
                </div>
            </nav>

            <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ backgroundColor: '#1976d2', padding: '30px', color: 'white' }}>
                        <h1 style={{ margin: 0, marginBottom: '10px', fontSize: '28px' }}>{form.title}</h1>
                        {form.description && (
                            <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                                {form.description}
                            </p>
                        )}
                    </div>

                    {/* Form */}
                    <div style={{ padding: '30px' }}>
                        <FormRenderer form={form} />
                    </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        Powered by HalloPetra FormBuilder
                    </p>
                </div>
            </main>
        </div>
    )
}