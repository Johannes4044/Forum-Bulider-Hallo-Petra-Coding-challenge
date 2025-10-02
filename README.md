# HalloPetra Form Builder - Coding Challenge

Eine moderne Next.js-Anwendung für die Erstellung und Verwaltung von dynamischen Formularen mit Admin-Panel und Authentifizierung.

## ✨ Features

- **Dynamischer Form Builder**: Visueller Editor mit Drag & Drop für verschiedene Feldtypen
- **Admin-Dashboard**: Vollständige Verwaltung von Formularen und Einreichungen
- **Sichere Authentifizierung**: NextAuth.js mit Admin-Berechtigungen
- **Responsive Design**: Optimiert für Desktop und Mobile mit Tailwind CSS
- **Datenbank Integration**: PostgreSQL mit Prisma ORM
- **TypeScript**: Vollständig typisierte Codebase

## 🛠 Technologie-Stack

- **Frontend**: Next.js 15.5.4, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentifizierung**: NextAuth.js v4
- **Datenbank**: PostgreSQL mit Prisma ORM
- **Deployment**: Vercel-ready

## 📋 Voraussetzungen

- Node.js (v18 oder höher)
- npm oder yarn
- PostgreSQL-Datenbank (lokal oder cloud-basiert)

## 🚀 Installation & Setup

### 1. Repository klonen

```bash
git clone <repository-url>
cd hp-codeing-challenge-johannes
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

Erstelle eine `.env.local` Datei im Projektverzeichnis:

```env
# Datenbank-URL (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/formbuilder"

# NextAuth Konfiguration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-secret-here"

# Admin-Zugangsdaten
ADMIN_EMAIL="admin@formbuilder.local"
ADMIN_PASSWORD="admin123"
```

> **Hinweis**: Für Produktionsumgebungen sollten sichere, zufällige Werte verwendet werden!

### 4. Datenbank konfigurieren

```bash
# Prisma Client generieren
npx prisma generate

# Datenbank-Schema erstellen
npx prisma db push

# Optional: Seed-Daten laden (falls vorhanden)
npx prisma db seed
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist nun unter `http://localhost:3000` verfügbar.

## 🔧 Verfügbare Scripts

- `npm run dev` - Startet den Entwicklungsserver mit Turbopack
- `npm run build` - Erstellt eine Produktions-Build
- `npm start` - Startet den Produktionsserver
- `npx prisma studio` - Öffnet Prisma Studio für Datenbankmanagement

## 📝 Verwendung

### Admin-Anmeldung

1. Navigiere zu `http://localhost:3000`
2. Du wirst automatisch zur Login-Seite weitergeleitet
3. Verwende die Admin-Zugangsdaten aus der `.env.local`:
   - Email: `admin@formbuilder.local`
   - Passwort: `admin123`

### Formulare erstellen

1. Nach der Anmeldung gelangst du zum Admin-Dashboard
2. Klicke auf "Neues Formular erstellen"
3. Verwende den Form Builder um Felder hinzuzufügen:
   - Text, Email, Number, Date
   - Textarea, Select, Radio, Checkbox
4. Konfiguriere Feldoptionen wie Pflichtfelder, Platzhalter, etc.
5. Speichere das Formular

### Formulare verwalten

- **Übersicht**: Alle Formulare im Admin-Dashboard
- **Bearbeiten**: Formulare nachträglich anpassen
- **Duplizieren**: Bestehende Formulare als Vorlage nutzen
- **Löschen**: Nicht mehr benötigte Formulare entfernen
- **Einreichungen**: Alle Formular-Submissions einsehen

### Öffentliche Formulare

- Jedes Formular erhält eine eindeutige URL: `/forms/[id]`
- Formulare können ohne Anmeldung ausgefüllt werden
- Einreichungen werden im Admin-Panel gespeichert

## 🗃 Datenbankstruktur

Das System verwendet folgende Haupttabellen:

- **users**: Benutzer und Admin-Accounts
- **forms**: Formular-Definitionen
- **form_fields**: Einzelne Formularfelder
- **form_submissions**: Eingereichte Formulardaten

## 🚀 Deployment

### Vercel (empfohlen)

1. Repository zu GitHub pushen
2. Vercel-Account mit GitHub verbinden
3. Projekt importieren
4. Umgebungsvariablen in Vercel-Dashboard setzen:
   - `DATABASE_URL` (z.B. Vercel Postgres)
   - `NEXTAUTH_URL` (deine Produktions-Domain)
   - `NEXTAUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

### Andere Plattformen

Das Projekt ist kompatibel mit allen Node.js-Hosting-Providern:
- Railway
- Heroku
- DigitalOcean App Platform
- Netlify
- etc.

## 🔒 Sicherheitshinweise

- Ändere die Standard-Admin-Zugangsdaten in Produktionsumgebungen
- Verwende sichere, zufällige Werte für `NEXTAUTH_SECRET`
- Stelle sicher, dass die Datenbank-URL sicher ist
- Überprüfe regelmäßig die Abhängigkeiten auf Sicherheitsupdates

## 🐛 Troubleshooting

### Datenbank-Verbindungsfehler

```bash
# Prüfe die DATABASE_URL in .env.local
# Stelle sicher, dass PostgreSQL läuft
# Teste die Verbindung mit:
npx prisma db push
```

### Build-Fehler

```bash
# Lösche .next und node_modules
rm -rf .next node_modules
npm install
npm run build
```

### NextAuth-Fehler

- Überprüfe `NEXTAUTH_URL` und `NEXTAUTH_SECRET`
- Stelle sicher, dass die Domain korrekt ist

## 📦 Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin-Dashboard
│   ├── api/               # API Routes
│   ├── builder/           # Form Builder
│   ├── forms/            # Öffentliche Formulare
│   └── login/            # Authentifizierung
├── components/           # Wiederverwendbare Komponenten
├── lib/                 # Utilities und Konfiguration
└── types/              # TypeScript Definitionen
```

## 🤝 Contributing

1. Fork das Repository
2. Feature-Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request öffnen

## 📄 Lizenz

Dieses Projekt wurde als Coding Challenge entwickelt.

---

**Entwickelt für die HalloPetra Coding Challenge**