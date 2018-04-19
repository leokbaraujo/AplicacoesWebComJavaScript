const express = require('express');
const knex = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/all', (req, res, next) => {
    knex('charts')
        .then((dados) => {
            res.send(dados);
        }, next);
});

router.post('/save', (req, res, next) => {
    knex('charts')
        .insert(req.body)
        .then((dados) => {
            return res.send(dados);
        }, next);
});

module.exports = router;