const express = require('express');
const mongoose = require('mongoose');
const adoteController = require('../controllers/adote.controller');
const eventosController = require('../controllers/eventos.controller');
const inscritoController = require('../controllers/inscritos.controller');

const Cat = mongoose.model('Cat', { name: String });
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
 eventosController.carregaEventosHomePage(res);
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
router.get('/eventos', function (req, res, next) {
  res.render('eventos/eventos', { title: 'Salve os Bichin | Eventos'})
});

// Inscrições (agenda de eventos e afiliação)
router.post('/afiliacao', function (req, res, next) {
  inscritoController.newAfiliacao(req, res);
});

// Jogos da natureza
router.get('/jogos-natureza', function (req, res, next) {
  res.render('inovacoes/jogos-natureza', { title: 'Salve os Bichin | Jogos da natureza!' })
});

module.exports = router;
