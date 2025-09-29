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
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white text-lg font-bold">F</span>
                        </div>
                        <span className="font-bold text-lg">FormBuilder</span>
                    </Link>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-white">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                    📝
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
                                    {form.description && (
                                        <p className="text-blue-100 text-lg leading-relaxed opacity-90">
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