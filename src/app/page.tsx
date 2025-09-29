import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 pt-12">
                    <h1 className="text-5xl font-bold mb-4 text-gray-900">
                        📋 Form Builder
                    </h1>
                    <p className="text-xl text-gray-600">
                        Erstelle professionelle Formulare in wenigen Minuten
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Link
                        href="/builder"
                        className="block bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <div className="text-4xl mb-4">✨</div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">
                            Neues Formular erstellen
                        </h2>
                        <p className="text-gray-600">
                            Erstelle ein individuelles Formular mit verschiedenen Feldtypen
                        </p>
                        <div className="mt-4 text-blue-600 font-medium">
                            Los geht's →
                        </div>
                    </Link>

                    <Link
                        href="/test"
                        className="block bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <div className="text-4xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">
                            Datenbank Test
                        </h2>
                        <p className="text-gray-600">
                            Prüfe die Datenbankverbindung und sieh gespeicherte Formulare
                        </p>
                        <div className="mt-4 text-blue-600 font-medium">
                            Testen →
                        </div>
                    </Link>
                </div>

                <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-xl font-bold mb-4">🚀 Features</h3>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Drag & Drop Feldverwaltung</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Text- und Select-Felder</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Pflichtfeld-Validierung</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Öffentliche Formular-Links</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Automatische Datenspeicherung</span>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}