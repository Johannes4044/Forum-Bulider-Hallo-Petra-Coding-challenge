import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import FormRenderer from './FormRenderer'
import Link from 'next/link'

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
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white text-xl font-bold">F</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">FormBuilder</span>
                    </Link>
                </div>
            </nav>

            <main className="pt-28 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden animate-slideUp">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                                    📝
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
                                    {form.description && (
                                        <p className="text-blue-100 text-lg leading-relaxed">
                                            {form.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            <FormRenderer form={form} />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Powered by{' '}
                            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium transition">
                                FormBuilder
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}