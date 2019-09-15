const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const router = express.Router();

//variáveis de ambiente
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const url = process.env.DB_URL
const email = process.env.EMAIL;
const emailPass = process.env.EMAIL_PASSWORD;

//mongoose
mongoose.connect(`mongodb+srv://${user}:${password}@${url}`, { useNewUrlParser: true });
const AdoptedSpecies = mongoose.model(('AdoptedSpecies'), new mongoose.Schema({
  species: String,
  whoAdopted: [String],
  moneyRaised: Number
}));
const Cat = mongoose.model('Cat', { name: String });

//nodemailer
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass: emailPass
  }
});

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

  const valores = AdoptedSpecies.find({}).lean().exec((err, doc)=>{
   
    res.render('adote_especies/adote-uma-especie', {
      title: 'Salve os Bichin | Adote uma espécie!',
      arrecadacaoArara: doc.filter(animal => { return animal.species == 'Arara'; })[0].moneyRaised,
      arrecadacaoGato: doc.filter(animal => { return animal.species == 'Gato'; })[0].moneyRaised,
      arrecadacaoMico: doc.filter(animal => { return animal.species == 'Mico'; })[0].moneyRaised,
      arrecadacaoOnca: doc.filter(animal => { return animal.species == 'Onça'; })[0].moneyRaised,
      arrecadacaoTartaruga: doc.filter(animal => { return animal.species == 'Tartaruga'; })[0].moneyRaised,
      arrecadacaoLobo: doc.filter(animal => { return animal.species == 'Lobo'; })[0].moneyRaised

    });
  });
  //res.render('adote_especies/adote-uma-especie', { title: 'Salve os Bichin | Adote uma espécie!', arrecadacaoArara: arrecadacaoArara});
})

router.post('/adotar', function (req, res, next) {
  let brinde;
  let valorDoacao = parseInt(req.body.valorradio);

  AdoptedSpecies.findOneAndUpdate({species: req.body.nomeEspecie}, //procura a especie no bd para atualizar
  { $push: {whoAdopted: req.body.emailadote}, //inclui o email na lista de emails
    $inc: { moneyRaised: valorDoacao}}, //aumenta o valor arrecadado
  {upsert: true}, //caso nao exista, cria a especie
  (err, res)=>{
    if(err) console.log(err);//erro, caso exista. Normalmente v em null
    console.log(res); //resultado da query
  });

  if (valorDoacao == 40) {
      brinde = 'Caderninho';
  } else if (valorDoacao == 70){
      brinde = 'Caderninho + Garrafinha';
  } else {
      brinde = 'Kit do Patrocinador'
  }

  transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: req.body.emailadote,
      subject: 'salveosbichin! | Obrigado por Adotar uma espécie!',
      text: 'Parabéns, ' + req.body.nomeadote + '! Você Acabou de adotar um(a) ' + req.body.nomeEspecie + '.\n \n Obrigado também pela contribuição de: R$ ' + req.body.valorradio + '\nVocê ganhará um ' + brinde},
    (err, resp)=>{
      if (err) console.log(err);
    });
    res.render('adote_especies/adote-uma-especie'); // TODO: popup de adotado
}); // TODO: nao deixar a pessoa adotar outra vez


module.exports = router;
