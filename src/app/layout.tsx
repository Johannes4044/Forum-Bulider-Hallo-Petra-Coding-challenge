import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: "FormBuilder - Simple Form Management",
    description: "Simple form builder and management application",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
        <body className="antialiased font-sans bg-gray-50">
            {children}
        </body>
        </html>
    );
}