const Database = require('better-sqlite3');
const path = require('path');

// Initialiser la connexion à la base de données SQLite
const dbPath = path.resolve(__dirname, '../Data/note.db');
const db = new Database(dbPath);

// Créer une table users si elle n'existe pas déjà
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    content INTEGER NOT NULL
  )
`);

module.exports = db;