const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const url = process.env.DB_URL
const Cat = mongoose.model('Cat', { name: String });

mongoose.connect(`mongodb+srv://${user}:${password}@${url}`, {useNewUrlParser: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Salve os Bichin' });
});

router.get('/testebd', function(req, res, next) {

  const kitty = new Cat({ name: 'Furia' });
  kitty.save().then(() => console.log('meow'));
  res.render('index', { title: 'FOI' });
});


module.exports = router;
