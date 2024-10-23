const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const url = require('url');


// Classe Router pour gérer les routes GET, PUT, PATCH, DELETE avec support EJS
class Router {
    constructor() {
        this.routes = {
            GET: {},
            PUT: {},
            PATCH: {},
            DELETE: {},
        };
    }

    // Méthode pour enregistrer une route GET
    get(path, handler) {
        this.routes.GET[path] = handler;
    }

    // Méthode pour enregistrer une route PUT (CREATE)
    put(path, handler) {
        this.routes.PUT[path] = handler;
    }

    // Méthode pour enregistrer une route PATCH (UPDATE)
    patch(path, handler) {
        this.routes.PATCH[path] = handler;
    }

    // Méthode pour enregistrer une route DELETE
    delete(path, handler) {
        this.routes.DELETE[path] = handler;
    }

    // Attacher la méthode render à l'objet response
    attachRenderMethod(res) {
        res.render = (viewPath, data = {}) => {
            const fullPath = path.join(__dirname, '..', 'views', `${viewPath}.ejs`);

            // Rendre uniquement le fichier passé en paramètre (viewPath)
            ejs.renderFile(fullPath, data, {}, (err, str) => {
                if (err) {
                    console.error('Error rendering view:', err);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    return res.end('Error rendering view');
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(str);
            });
        };
    }

    // Méthode principale pour gérer les requêtes HTTP
    handle(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const routePath = parsedUrl.pathname;
        const method = req.method.toUpperCase();

        // Vérifier si la requête concerne un fichier statique dans le dossier public
        const publicPath = path.join(__dirname, '../..', 'public', routePath);
        if (fs.existsSync(publicPath) && fs.lstatSync(publicPath).isFile()) {
            // Détecter le type MIME selon le type de fichier
            const extname = path.extname(publicPath);
            let contentType = 'text/plain';
            switch (extname) {
                case '.html':
                    contentType = 'text/html';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.js':
                    contentType = 'application/javascript';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                case '.jpeg':
                    contentType = 'image/jpeg';
                    break;
                default:
                    contentType = 'text/plain';
            }

            // Lire et servir le fichier statique
            fs.readFile(publicPath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                }
            });
            return;
        }

        // Attache la méthode render à la réponse
        this.attachRenderMethod(res);

        const handler = this.routes[method][routePath];
        if (handler) {
            handler(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('Route not found');
        }

        res.on('finish', () => {
            console.log(`[INFO] HTTP ${method} ${routePath} responded with status ${res.statusCode}`);
        });
    }
}

module.exports = Router;