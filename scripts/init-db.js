#!/usr/bin/env node

/**
 * Automatisches Database Setup Script
 * Führt alle notwendigen Database-Operationen aus
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Farben für Console Output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function main() {
  try {
    console.log('\n🗄️  HalloPetra FormBuilder - Database Setup\n');

    // 1. Überprüfe ob .env.local existiert
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      warning('.env.local nicht gefunden - erstelle eine mit Standard-Werten');

      const envContent = `# Database URL - SQLite für lokale Entwicklung
DATABASE_URL="file:./dev.db"

# NextAuth Konfiguration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${generateRandomString(32)}"

# Admin-Zugangsdaten
ADMIN_EMAIL="admin@formbuilder.local"
ADMIN_PASSWORD="admin123"`;

      fs.writeFileSync(envPath, envContent);
      success('.env.local erstellt');
    } else {
      success('.env.local gefunden');
    }

    // 2. Prisma Generate
    info('Generiere Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    success('Prisma Client generiert');

    // 3. Database Push/Migration
    info('Erstelle Database Schema...');
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
      success('Database Schema erstellt');
    } catch (err) {
      // Falls db push fehlschlägt, versuche migrate dev
      warning('db push fehlgeschlagen, versuche migrate dev...');
      execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
      success('Database Migration durchgeführt');
    }

    // 4. Überprüfe Database Connection
    info('Teste Database Verbindung...');
    const testScript = `
      const { PrismaClient } = require('@prisma/client');
      async function test() {
        const prisma = new PrismaClient();
        try {
          await prisma.$connect();
          console.log('✓ Database Verbindung erfolgreich');
          await prisma.$disconnect();
          process.exit(0);
        } catch (error) {
          console.error('✗ Database Verbindung fehlgeschlagen:', error.message);
          process.exit(1);
        }
      }
      test();
    `;

    fs.writeFileSync('temp-db-test.js', testScript);
    try {
      execSync('node temp-db-test.js', { stdio: 'inherit' });
    } finally {
      fs.unlinkSync('temp-db-test.js');
    }

    // 5. Optional: Seed Data
    const seedPath = path.join(process.cwd(), 'prisma', 'seed.js');
    if (fs.existsSync(seedPath)) {
      info('Lade Seed-Daten...');
      try {
        execSync('npm run seed', { stdio: 'inherit' });
        success('Seed-Daten geladen');
      } catch (err) {
        warning('Seed-Daten konnten nicht geladen werden (optional)');
      }
    }

    console.log('\n🎉 Database Setup erfolgreich abgeschlossen!\n');

    info('Nächste Schritte:');
    console.log('   1. npm run dev');
    console.log('   2. Öffne http://localhost:3000');
    console.log('   3. Login mit admin@formbuilder.local / admin123\n');

  } catch (error) {
    error(`Setup fehlgeschlagen: ${error.message}`);
    process.exit(1);
  }
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Script ausführen
main().catch(console.error);