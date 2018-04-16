const restify = require('restify');

const server = restify.createServer({
  name: 'jogoVelha',
  version: '1.0.0'
});

const knex = require('knex')({
    client: 'mssql',
    connection: {
      host : 'localhost',
      user : 'sa',
      password : 'SqlServer.2017',
      database : 'db'
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/all', (req, res, next) => {
    knex('velha')
        .then((dados) => {
            res.send(dados);
        }, next);
});

server.post('/save', (req, res, next) => {
    knex('velha')
        .insert(req.body)
        .then((dados) => {
            return res.send(dados);
        }, next);
});

server.get(/\/(.*)?.*/,restify.plugins.serveStatic({
    directory: './dist',
    default: 'index.html',
}));

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});