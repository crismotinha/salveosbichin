const express = require('express');
const eventos = require('../controllers/eventos.controller');

const router = express.Router();

router.get('/eventos-new', (req, res)=>{
    res.render('eventos/eventos-new');
});

router.post('/criarevento', (req, res)=>{
    eventos.createEvento(req, res);
});

module.exports = router;