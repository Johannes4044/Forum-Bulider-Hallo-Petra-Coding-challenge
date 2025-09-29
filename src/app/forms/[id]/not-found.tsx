import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md animate-slideUp">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-100 rounded-3xl mb-6 shadow-xl">
                        <span className="text-7xl">📝</span>
                    </div>
                    <h1 className="text-8xl font-extrabold text-gray-900 mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Formular nicht gefunden
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Das angeforderte Formular existiert nicht oder wurde gelöscht.
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                    <span>←</span>
                    <span>Zur Startseite</span>
                </Link>
            </div>
        </main>
    )
}