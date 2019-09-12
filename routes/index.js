const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const url = process.env.DB_URL
const Cat = mongoose.model('Cat', { name: String });

mongoose.connect(`mongodb+srv://${user}:${password}@${url}`, { useNewUrlParser: true });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Salve os Bichin' });
});

router.get('/testebd', function (req, res, next) {
  const kitty = new Cat({ name: 'Furia' });
  kitty.save().then(() => console.log('meow'));
  res.render('index', { title: 'FOI' });
});

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
  res.render('adote_especies/adote-uma-especie', { title: 'Salve os Bichin | Adote uma espécie!' });
})

// criar model pessoa
const personModel = mongoose.model('teste', { nome: String, email: String, nomeEspecie: String });

router.post('/adotar', function (req, res, next) {
  const newPerson = personModel({
    name: req.body.nomeadote, // TODO: entender pq não está pegando o nome
    email: req.body.emailadote,
    nomeEspecie: req.body.nomeEspecie
  });
  newPerson.save(); // TODO: colocar pra salvar numa collection certinha, de pessoas (por enquanto salva em teste)
  res.render('adote_especies/adote-uma-especie'); // TODO: popup de adotado
}); // TODO: nao deixar a pessoa adotar outra vez


module.exports = router;
