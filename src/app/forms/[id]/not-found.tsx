import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-2xl shadow-blue-500/30">
                        <span className="text-5xl">📝</span>
                    </div>
                    <h1 className="text-7xl font-bold text-gray-900 mb-4">404</h1>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                        Formular nicht gefunden
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Das angeforderte Formular existiert nicht oder wurde gelöscht.
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5"
                >
                    ← Zur Startseite
                </Link>
            </div>
        </main>
    )
}