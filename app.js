const http = require('http');
const port = 3000;

const NoteRouter = require('./src/Routes/Note');

// Créer et démarrer le serveur
const server = http.createServer((req, res) => {

    req
    .on('data', (chunk) => {
        if(!req.body) req.body = [];

        req.body.push(chunk);
    })
    .on('end', () => {
        if(req.body) {
            req.body = Buffer.concat(req.body).toString().split('&').reduce((acc, pair) => {
                const [key, value] = pair.split('=');

                acc[key] = value;

                return acc
            })

        }

        NoteRouter.handle(req, res);
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
