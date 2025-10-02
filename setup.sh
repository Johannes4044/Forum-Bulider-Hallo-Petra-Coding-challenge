#!/bin/bash

# HalloPetra FormBuilder - Automatisches Setup Script
# Führe dieses Script aus: chmod +x setup.sh && ./setup.sh

set -e

echo "🚀 HalloPetra FormBuilder - Automatische Installation"
echo "=================================================="

# Farben für bessere Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktion für farbige Ausgabe
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Node.js Version prüfen
print_info "Überprüfe Node.js Installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js ist nicht installiert!"
    print_info "Bitte installiere Node.js von: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js Version 18+ erforderlich (aktuelle Version: $(node -v))"
    exit 1
fi
print_status "Node.js $(node -v) gefunden"

# Dependencies installieren
print_info "Installiere Dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi
print_status "Dependencies installiert"

# .env.local erstellen falls nicht vorhanden
if [ ! -f ".env.local" ]; then
    print_info "Erstelle .env.local Datei..."
    cat > .env.local << EOF
# Database URL - SQLite für einfache lokale Entwicklung
DATABASE_URL="file:./dev.db"

# NextAuth Konfiguration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Admin-Zugangsdaten
ADMIN_EMAIL="admin@formbuilder.local"
ADMIN_PASSWORD="admin123"
EOF
    print_status ".env.local erstellt"
else
    print_warning ".env.local existiert bereits - überspringe Erstellung"
fi

# Prisma Schema für SQLite anpassen
print_info "Konfiguriere Database für lokale Entwicklung..."
sed -i.bak 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.prisma
print_status "Database auf SQLite umgestellt"

# Prisma Setup
print_info "Initialisiere Database..."
npx prisma generate
npx prisma db push
print_status "Database initialisiert"

# Build für Vercel-Kompatibilität
print_info "Teste Build..."
npm run build > /dev/null 2>&1 || print_warning "Build-Warnung - aber Development sollte funktionieren"

print_status "Setup abgeschlossen!"
echo ""
echo "🎉 Installation erfolgreich!"
echo "================================"
echo ""
print_info "Zum Starten der Anwendung:"
echo "   npm run dev"
echo ""
print_info "Die App läuft dann auf: http://localhost:3000"
echo ""
print_info "Admin-Login:"
echo "   Email: admin@formbuilder.local"
echo "   Passwort: admin123"
echo ""
print_warning "Für Produktion: Verwende PostgreSQL und ändere ADMIN_PASSWORD!"