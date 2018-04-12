const restify = require('restify');
const errs = require('restify-errors');
const googleMapsClient = require('@google/maps').createClient({
    key: 'coloque a aqui sua chave de autenticacao ao google maps api js',
    Promise: Promise
  });


const server = restify.createServer({
  name: 'myapp',
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
    knex('places').then((dados) => {
        res.send(dados);
    }, next);
    return next();
});

//Teste de localizacao
/*
server.get('/geocode', (req, res, next) => {
    googleMapsClient.geocode({address: 'Mem de Sa, 310, Messejana, Fortaleza, CE'}).asPromise()
                    .then((response) => {
                        const address = response.json.results[0].formatted_address;
                        const place_id = response.json.results[0].place_id;
                        res.send({place_id, address});
                    })
                    .catch((err) => {
                        res.send(err);
                    });
})
*/

server.post('/geocode', (req, res, next) => {
    const {lat, lng} = req.body

    googleMapsClient.reverseGeocode({latlng: [lat, lng]}).asPromise()
                    .then((response) => {
                        const address = response.json.results[0].formatted_address;
                        const place_id = response.json.results[0].place_id;
                        const image = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=10&size=300x300&sensor=false`
                        
                        knex('places')
                        .insert({place_id, address, image})
                        .then(() => {
                            res.send({address, image});
                        }, next);
                    })
                    .catch((err) => {
                        res.send(err);
                    });
});

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});