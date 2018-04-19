const knex = require('knex')({
    client: 'mssql',
    connection: {
      host : 'localhost',
      user : 'sa',
      password : 'SqlServer.2017',
      database : 'db'
    }
});

module.exports = knex;