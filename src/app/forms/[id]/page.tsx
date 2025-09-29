import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import FormRenderer from './FormRenderer'

export default async function PublicFormPage({
                                                 params,
                                             }: {
    params: { id: string }
}) {
    // Formular aus der Datenbank laden
    const form = await prisma.form.findUnique({
        where: { id: params.id },
        include: {
            fields: {
                orderBy: { order: 'asc' }, // Felder nach order sortieren
            },
        },
    })

    // Wenn Formular nicht existiert, 404 zeigen
    if (!form) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
                    {form.description && (
                        <p className="text-gray-600">{form.description}</p>
                    )}
                </div>

                <FormRenderer form={form} />
            </div>
        </main>
    )
}