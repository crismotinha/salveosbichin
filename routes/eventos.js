const express = require('express');
const EventosController = require('../controllers/eventos.controller');
const InscritosConstroller = require('../controllers/inscritos.controller');

const router = express.Router();

router.get('/eventos-new', (req, res)=>{
    res.render('eventos/eventos-new');
});

router.post('/criarevento', (req, res)=>{
    EventosController.createEvento(req, res);
});

router.post('/agenda-inscrito', function (req, res, next) {
    InscritosConstroller.newAgendaInscrito(req, res);
});

module.exports = router;