const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');


// Fonction pour récupérer toutes les notes
const getAllNotes = () => {
    const stmt = db.prepare('SELECT * FROM notes');
    return stmt.all();  // Retourne toutes les notes
};

// Fonction pour récupérer une note par ID
const getNoteById = (id) => {
    const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
    return stmt.get(id);  // Retourne une seule note
};

// Fonction pour créer une nouvelle note
const createNote = (title, content) => {
    const stmt = db.prepare('INSERT INTO notes (id, title, content) VALUES (?, ?)');
    const id = uuidv4();

    const result = stmt.run(id, title, content);
    return result;  // Retourne l'état de l'insertion
};

// Fonction pour mettre à jour une note par ID
const updateNote = (id, title, content) => {
    const stmt = db.prepare('UPDATE notes SET title = ?, content = ? WHERE id = ?');
    const result = stmt.run(title, content, id);
    return result;  // Retourne l'état de la mise à jour
};

// Fonction pour supprimer une note par ID
const deleteNote = (id) => {
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    const result = stmt.run(id);
    return result;  // Retourne l'état de la suppression
};

module.exports = {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
};
