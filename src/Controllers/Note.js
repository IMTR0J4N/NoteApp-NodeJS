const NoteModel = require('../Models/Note');

// GET : Récupérer toutes les notes
const getAllNotes = (req, res) => {
    try {
        const notes = NoteModel.getAllNotes();
        res.render('notes', { notes });
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
};

// GET : Récupérer une note par ID
const getNoteById = (req, res) => {
    const noteId = req.query.id;
    if (!noteId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Note ID is required' }));
    }
    
    try {
        const note = NoteModel.getNoteById(noteId);
        if (note) {
            res.render('note', { note });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Note not found' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
};

// POST : Créer une nouvelle note
const createNote = (req, res) => {
    console.log(req)
    const { title, content } = req.data.body;
    
    if (!title || !content) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Title and content are required' }));
    }
    
    try {
        const result = NoteModel.createNote(title, content);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Note created', noteId: result.lastInsertRowid }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
};

// PUT : Mettre à jour une note par ID
const updateNote = (req, res) => {
    const noteId = req.query.id;
    const { title, content } = req.body;

    if (!noteId || (!title && !content)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Note ID and at least one field (title or content) are required' }));
    }

    try {
        const result = NoteModel.updateNote(noteId, title, content);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Note with ID ${noteId} was updated successfully` }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
};

// DELETE : Supprimer une note par ID
const deleteNote = (req, res) => {
    const noteId = req.query.id;

    if (!noteId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Note ID is required' }));
    }

    try {
        const result = NoteModel.deleteNote(noteId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Note with ID ${noteId} was deleted successfully` }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
};

module.exports = {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
};
