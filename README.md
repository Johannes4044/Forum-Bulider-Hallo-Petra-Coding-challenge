# 🚀 HalloPetra FormBuilder - Super Einfache Installation

Ein moderner Form Builder mit Admin-Panel. **Einsatzbereit in 2 Minuten!**

## ⚡ Schnellstart (Empfohlen)

### Option 1: Automatisches Setup (Einfachste Methode)

```bash
# 1. Repository klonen
git clone <repository-url>
cd hp-codeing-challenge-johannes

# 2. Setup-Script ausführen (macht alles automatisch!)
chmod +x setup.sh && ./setup.sh

# 3. Starten
npm run dev
```

**Das war's!** Die App läuft auf http://localhost:3000

### Option 2: Docker (Für Container-Fans)

```bash
# 1. Repository klonen
git clone <repository-url>
cd hp-codeing-challenge-johannes

# 2. Mit Docker starten (inkl. Database)
docker-compose up --build
```

**Fertig!** App + Database laufen automatisch auf http://localhost:3000

### Option 3: Manuell (Falls gewünscht)

```bash
# 1. Repository klonen
git clone <repository-url>
cd hp-codeing-challenge-johannes

# 2. Dependencies installieren
npm install

# 3. Database Setup
npm run setup

# 4. Starten
npm run dev
```

## 🎯 Login & Erste Schritte

1. **Öffne** http://localhost:3000
2. **Login** mit:
   - **Email:** `admin@formbuilder.local`
   - **Passwort:** `admin123`
3. **Klick** auf "New Form" um dein erstes Formular zu erstellen!

## 🛠️ Was ist installiert?

- ✅ **Next.js 15** - Modernes React Framework
- ✅ **TypeScript** - Type-sichere Entwicklung
- ✅ **Prisma** - Database ORM (SQLite für lokale Entwicklung)
- ✅ **NextAuth.js** - Authentifizierung
- ✅ **Tailwind CSS** - Styling
- ✅ **Admin Panel** - Formular-Management
- ✅ **Form Builder** - Visueller Editor
- ✅ **Public Forms** - Öffentliche Formular-Links

## 🎨 Features

### Admin Dashboard
- Alle Formulare verwalten
- Einreichungen einsehen
- Formulare duplizieren/löschen

### Form Builder
- **Drag & Drop** Editor
- **8 Feldtypen**: Text, Email, Number, Date, Textarea, Select, Radio, Checkbox
- **Validation** Rules
- **Live Preview**

### Public Forms
- Responsive Design
- Real-time Validation
- Mobile-optimiert

## 📦 Nützliche Commands

```bash
# Development
npm run dev              # Entwicklungsserver starten
npm run build           # Production Build

# Database
npm run setup           # Automatisches Database Setup
npm run db:studio       # Prisma Studio (Database GUI)

# Docker
npm run docker:up       # Mit Docker starten
npm run docker:down     # Docker stoppen
```

## 🔧 Konfiguration

### Environment Variables (.env.local)
Das Setup-Script erstellt automatisch eine `.env.local` mit:

```env
DATABASE_URL="file:./dev.db"                    # SQLite für lokale Entwicklung
NEXTAUTH_URL="http://localhost:3000"           # App URL
NEXTAUTH_SECRET="<automatisch-generiert>"      # JWT Secret
ADMIN_EMAIL="admin@formbuilder.local"          # Admin Login
ADMIN_PASSWORD="admin123"                      # Admin Passwort
```

### Für Produktion
Für Vercel/Heroku/Railway einfach PostgreSQL URL setzen:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

## 🐳 Docker Details

Das Docker Setup beinhaltet:
- **PostgreSQL 15** Database
- **Next.js App** mit Auto-Restart
- **Volumes** für persistente Daten
- **Health Checks** für zuverlässigen Start

## 🚀 Deployment

### Vercel (Empfohlen)
1. Fork das Repository
2. Mit Vercel verbinden
3. Environment Variables setzen
4. Deploy!

### Andere Plattformen
Funktioniert mit allen Node.js Hostern:
- Railway ✅
- Heroku ✅
- DigitalOcean ✅
- Netlify ✅

## 🐛 Troubleshooting

### "Command not found: node"
```bash
# Installiere Node.js 18+
# macOS: brew install node
# Windows: https://nodejs.org/
```

### Database Probleme
```bash
# Reset Database
rm -f dev.db
npm run setup
```

### Docker Probleme
```bash
# Complete Reset
docker-compose down -v
docker-compose up --build
```

### Build Fehler
```bash
# Clean Install
rm -rf node_modules .next
npm install
npm run build
```

## 💡 Projekt-Struktur

```
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── admin/     # Admin Dashboard
│   │   ├── builder/   # Form Builder
│   │   ├── forms/     # Public Forms
│   │   └── login/     # Authentication
│   ├── components/    # UI Components
│   └── lib/          # Utilities
├── prisma/           # Database Schema
├── scripts/          # Setup Scripts
├── setup.sh          # Auto-Setup Script
└── docker-compose.yml # Docker Configuration
```

## 🎯 Support

Bei Problemen:
1. **Checke** die Troubleshooting-Sektion
2. **Führe** `./setup.sh` erneut aus
3. **Öffne** ein GitHub Issue

---

**🎉 Viel Spaß mit dem HalloPetra FormBuilder!**

*Erstellt für die HalloPetra Coding Challenge*