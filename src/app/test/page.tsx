import { prisma } from '@/lib/prisma'

export default async function TestPage() {
    // Teste die Verbindung
    const formCount = await prisma.form.count()

    return (
        <div>
            <h1>Database Test</h1>
            <p>Anzahl Formulare: {formCount}</p>
        </div>
    )
}