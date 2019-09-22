const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const eventosController = require('../controllers/eventos.controller');

router.get('/eventos-novo', function(req, res, next) {
    res.render('eventos/eventos-new', { title: 'Salve os Bichin | Criar evento'})
});

router.post('/agenda-inscrito', function(req,res,next) {
    res.render();
    res.redirect('eventos');
})
module.exports = router;
