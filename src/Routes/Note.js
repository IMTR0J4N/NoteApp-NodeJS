const Router = require('../Core/Router');
const { getAllNotes, createNote, updateNote, deleteNote, getNoteById } = require('../App/Controllers/Note');

const NoteRouter = new Router();

NoteRouter.get('/notes', getAllNotes);

NoteRouter.put('/note/create', createNote)
NoteRouter.patch('/note/update', updateNote);
NoteRouter.delete('/note/delete', deleteNote);

NoteRouter.get('/note/:id', getNoteById);

module.exports = NoteRouter;