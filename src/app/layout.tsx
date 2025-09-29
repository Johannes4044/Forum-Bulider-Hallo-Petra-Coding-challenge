import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Form Builder - HalloPetra",
    description: "Erstelle und verwalte Formulare",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
        <body>{children}</body>
        </html>
    );
}