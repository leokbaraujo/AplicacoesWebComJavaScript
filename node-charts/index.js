const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const knex = require('knex')({
    client: 'mssql',
    connection: {
      host : 'localhost',
      user : 'sa',
      password : 'SqlServer.2017',
      database : 'db'
    }
});

app.listen(3000, () => {
    console.log('Startando Servidor Express!')
});