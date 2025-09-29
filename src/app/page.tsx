'use client'

import Link from "next/link";
import { useState, useEffect } from "react";

const craftTypes = ["Elektriker", "Handwerker", "SHK Betriebe", "Tischler", "Baubetriebe"];

export default function HomePage() {
    const [currentCraft, setCurrentCraft] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCraft((prev) => (prev + 1) % craftTypes.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                            <span className="text-white text-xl font-bold">F</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">FormBuilder</span>
                    </Link>
                    <Link
                        href="/builder"
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        Formular erstellen
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Badge */}
                    <div className="flex justify-center mb-8 animate-slideDown">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium text-blue-700">HalloPetra Coding Challenge</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="text-center mb-8 animate-slideUp">
                        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6">
                            <span className="text-gray-900">Formulare für</span>
                            <br />
                            <span className="text-blue-600 inline-block min-w-[400px] text-left">
                {craftTypes[currentCraft]}
              </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Erstelle professionelle Formulare in wenigen Minuten – speziell für Handwerksbetriebe
                        </p>
                    </div>

                    {/* Social Proof */}
                    <div className="flex justify-center mb-10 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                            <span className="text-yellow-400">★★★★★</span>
                            <span className="text-sm font-medium text-gray-700">5,0 Sterne</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">100+ Nutzer</span>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
                        <Link
                            href="/builder"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all"
                        >
                            <span>Jetzt testen</span>
                            <span>→</span>
                        </Link>
                        <a
                            href="#features"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg transition-all"
                        >
                            Mehr erfahren
                        </a>
                    </div>

                    {/* Preview Mockup */}
                    <div className="mt-20 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-3xl"></div>
                            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 overflow-hidden">
                                <div className="space-y-4">
                                    <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg"></div>
                                        <div className="h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg"></div>
                                    </div>
                                    <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Was macht FormBuilder?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Alles was du brauchst, um professionelle Formulare zu erstellen
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: "📝",
                                title: "Formulare erstellen",
                                desc: "Erstelle individuelle Formulare mit verschiedenen Feldtypen in wenigen Minuten"
                            },
                            {
                                icon: "✓",
                                title: "Daten validieren",
                                desc: "Automatische Validierung und Pflichtfelder sorgen für vollständige Daten"
                            },
                            {
                                icon: "🔗",
                                title: "Link teilen",
                                desc: "Teile Formulare per Link mit Kunden - kein Login nötig"
                            },
                            {
                                icon: "💾",
                                title: "Antworten speichern",
                                desc: "Alle Einreichungen werden automatisch in der Datenbank gespeichert"
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Was sind die Vorteile?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Diese Vorteile überzeugen Handwerksbetriebe deutschlandweit
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "⏱️",
                                title: "Zeit sparen",
                                desc: "Keine manuellen Nachfragen mehr - alle Daten werden digital und vollständig erfasst"
                            },
                            {
                                icon: "✅",
                                title: "Fehler vermeiden",
                                desc: "Validierung stellt sicher, dass alle Daten korrekt und vollständig sind"
                            },
                            {
                                icon: "🌐",
                                title: "Immer verfügbar",
                                desc: "Formulare sind 24/7 erreichbar - auch nach Feierabend und am Wochenende"
                            },
                        ].map((benefit, i) => (
                            <div
                                key={i}
                                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 border border-blue-100"
                            >
                                <div className="text-6xl mb-6">{benefit.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                                <p className="text-gray-700 text-lg leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Nächste Schritte
                        </h2>
                    </div>

                    <div className="space-y-8">
                        {[
                            {
                                badge: "Heute",
                                title: "Starte mit deinem Test-Formular",
                                desc: "Erstelle dein erstes Formular in unter 5 Minuten - kostenlos und unverbindlich"
                            },
                            {
                                badge: "Inbetriebnahme",
                                title: "Passe es an deine Bedürfnisse an",
                                desc: "Füge Felder hinzu, konfiguriere Validierungen und gestalte dein Formular"
                            },
                            {
                                badge: "FormBuilder in deinem Betrieb",
                                title: "Teile den Link mit deinen Kunden",
                                desc: "Deine Kunden füllen das Formular aus und alle Daten landen bei dir"
                            },
                        ].map((step, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30">
                                        {i + 1}
                                    </div>
                                    {i < 2 && <div className="w-1 h-full bg-blue-200 mt-2"></div>}
                                </div>
                                <div className="flex-1 pb-8">
                                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-3">
                                        {step.badge}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-600 text-lg">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
                        <div className="absolute inset-0 bg-grid-white/10"></div>
                        <div className="relative">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Bereit loszulegen?
                            </h2>
                            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                                Erstelle dein erstes Formular in unter 2 Minuten
                            </p>
                            <Link
                                href="/builder"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 text-lg font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
                            >
                                <span>Jetzt starten</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-12 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                                <span className="text-white text-lg font-bold">F</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">FormBuilder</p>
                                <p className="text-xs text-gray-500">© 2025 HalloPetra Coding Challenge</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Erstellt mit Next.js, Prisma & PostgreSQL
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}