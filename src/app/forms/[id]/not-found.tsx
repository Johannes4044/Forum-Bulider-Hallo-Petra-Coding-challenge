import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Formular nicht gefunden</h2>
                <p className="text-gray-600 mb-8">
                    Das angeforderte Formular existiert nicht oder wurde gelöscht.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Zur Startseite
                </Link>
            </div>
        </main>
    )
}