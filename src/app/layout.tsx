import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: "FormBuilder - Formulare für Handwerksbetriebe",
    description: "Erstelle professionelle Formulare einfach & schnell - speziell für Handwerksbetriebe",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de" className={inter.variable}>
        <body className="antialiased font-sans bg-gray-50">{children}</body>
        </html>
    );
}