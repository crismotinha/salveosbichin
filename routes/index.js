const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const adoteController = require('../controllers/adote.controller');
const eventosController = require('../controllers/eventos.controller');

const Cat = mongoose.model('Cat', { name: String });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Salve os Bichin' });
});

router.get('/testebd', function (req, res, next) {
  const kitty = new Cat({ name: 'Furia' });
  kitty.save().then(() => console.log('meow'));
  res.render('index', { title: 'FOI' });
});

// Noticias pages
router.get('/noticias/agua-bom-investimento', function (req, res, next) {
  res.render('noticias/noticia1', { title: 'Salve os Bichin | Com a escassez, a água pode se tornar um bom investimento' });
});

router.get('/noticias/agricultura-aliada', function (req, res, next) {
  res.render('noticias/noticia2', { title: 'Salve os Bichin | A agricultura é aliada, não inimiga do clima' });
});

router.get('/noticias/sustentabilidade-o-que', function (req, res, next) {
  res.render('noticias/noticia3', { title: 'Salve os Bichin | O que é essa tal sustentabilidade?' });
});

router.get('/adote-uma-especie', function (req, res, next) {
  adoteController.valores(res);
})

// Adotar
router.post('/adotar', function (req, res, next) {
  adoteController.registraDoacao(req, res);  
});

// Eventos
router.get('/eventos', function(req, res, next) {
  eventosController.getEventos(res);
});

router.get('/eventos-novo', function(req, res, next) {
  eventosController.newEvento(res);
});
router.post('/criarevento', function(req, res, next) {
  eventosController.createEvento(req, res, next);
})

module.exports = router;
