import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: "HalloPetra FormBuilder - Interne Formular-Verwaltung",
    description: "HalloPetra interne Anwendung für Formular-Verwaltung und -Erstellung",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de" className={inter.variable}>
        <body className="antialiased font-sans bg-gray-50">
            <AuthProvider>{children}</AuthProvider>
        </body>
        </html>
    );
}