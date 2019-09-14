const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const router = express.Router();

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const url = process.env.DB_URL
const Cat = mongoose.model('Cat', { name: String });
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'salveosbichin@gmail.com',
    pass: 'gpms2019'
  }
});

mongoose.connect(`mongodb+srv://${user}:${password}@${url}`, { useNewUrlParser: true, dbName: 'AdoptedAnimal' });

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
const personModel = mongoose.model('AdoptedAnimal', new mongoose.Schema({ name: String, email: String, nomeEspecie: String }));

router.post('/adotar', function (req, res, next) {
  const newPerson = personModel({
    name: req.body.nomeadote,
    email: req.body.emailadote,
    nomeEspecie: req.body.nomeEspecie
  });

  transporter.sendMail(
    {
      from: 'salveosbichin@gmail.com',
      to: req.body.emailadote,
      subject: 'salveosbichin | Obrigado por Adotar',
      text: 'Obrigado, ' + req.body.nomeadote + '! Você Acabou de adotar o ' + req.body.nomeEspecie + '.\n Salveosbichin agradece.'
    },
    (err, resp) => {
      if (err) console.log(err);
    });



  newPerson.save(); // TODO: colocar pra salvar numa collection certinha, de pessoas (por enquanto salva em adoptedanimal)
  res.render('adote_especies/adote-uma-especie', { title: 'Salve os Bichin | Adote uma espécie'}); // TODO: popup de adotado
});

// criar model afiliacao
const afiliacaoModel = mongoose.model('Afiliacao', new mongoose.Schema({ email: String }));


router.post('/afiliacao', function (req, res, next) {
  const newAfiliacao = afiliacaoModel({
    email: req.body.emailafiliacao
  });
  newAfiliacao.save();
  transporter.sendMail(
    {
      from: 'salveosbichin@gmail.com',
      to: req.body.emailafiliacao,
      subject: 'salveosbichin | Obrigado por se inscrever!',
      text: 'Bem vindo! Agora você receberá todas as novidades da nossa página e ficará por dentro de todas as novidades. '
      // TODO: layout bonitinho do email
    },
    (err, resp) => {
      if (err) console.log(err);
    });

  res.render('index', { title: 'Salve os Bichin'});
}); //TODO: popup de sucesso


module.exports = router;
