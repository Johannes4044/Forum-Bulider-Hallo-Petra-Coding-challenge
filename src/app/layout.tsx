import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "FormBuilder - Erstelle Formulare einfach & schnell",
    description: "Erstelle professionelle Formulare mit verschiedenen Feldtypen, Validierung und öffentlichen Links.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de" className={inter.className}>
        <body className="antialiased">{children}</body>
        </html>
    );
}