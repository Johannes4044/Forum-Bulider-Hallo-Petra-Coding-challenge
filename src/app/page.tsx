import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white text-lg font-bold">F</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              FormBuilder
            </span>
                    </div>
                    <Link
                        href="/builder"
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5"
                    >
                        Formular erstellen
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 mb-8">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        HalloPetra Coding Challenge
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Formulare erstellen.
            </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Einfach & Schnell.
            </span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Erstelle professionelle Formulare mit Drag & Drop, verschiedenen Feldtypen und automatischer Validierung.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/builder"
                            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:-translate-y-1 flex items-center gap-2"
                        >
                            <span>Jetzt starten</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <a
                            href="#features"
                            className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:shadow-lg transition-all"
                        >
                            Mehr erfahren
                        </a>
                    </div>

                    {/* Preview Image Placeholder */}
                    <div className="mt-16 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
                            <div className="space-y-4">
                                <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg"></div>
                                    <div className="h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg"></div>
                                </div>
                                <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Alles was du brauchst
                        </h2>
                        <p className="text-gray-600 text-lg">Leistungsstarke Features für professionelle Formulare</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🎨",
                                title: "8 Feldtypen",
                                desc: "Text, E-Mail, Nummer, Datum, Textarea, Select, Radio & Checkbox",
                                gradient: "from-pink-500 to-rose-500"
                            },
                            {
                                icon: "⚡",
                                title: "Echtzeit-Preview",
                                desc: "Sieh sofort wie dein Formular aussieht während du es erstellst",
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: "🔒",
                                title: "Validierung",
                                desc: "Pflichtfelder, E-Mail-Validation, Min/Max für Zahlen",
                                gradient: "from-purple-500 to-indigo-500"
                            },
                            {
                                icon: "📱",
                                title: "Responsive",
                                desc: "Perfekt auf Desktop, Tablet und Mobile",
                                gradient: "from-green-500 to-emerald-500"
                            },
                            {
                                icon: "🔗",
                                title: "Öffentliche Links",
                                desc: "Teile Formulare per Link - kein Login nötig",
                                gradient: "from-orange-500 to-amber-500"
                            },
                            {
                                icon: "💾",
                                title: "Auto-Speichern",
                                desc: "Alle Einreichungen werden automatisch gespeichert",
                                gradient: "from-teal-500 to-cyan-500"
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
                        <div className="relative">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Bereit loszulegen?
                            </h2>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Erstelle dein erstes Formular in unter 2 Minuten
                            </p>
                            <Link
                                href="/builder"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105"
                            >
                                <span>Formular erstellen</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">F</span>
                            </div>
                            <span className="text-sm text-gray-600">
                © 2025 HalloPetra Coding Challenge
              </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>Erstellt mit Next.js, Prisma & PostgreSQL</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}