const http = require('http');
const port = 3000;

const NoteRouter = require('./src/Routes/Note');

// Créer et démarrer le serveur
const server = http.createServer((req, res) => {

    NoteRouter.handle(req, res);
    
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
