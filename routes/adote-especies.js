const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const url = process.env.DB_URL;

mongoose.connect(`mongodb+srv://${user}:${password}@${url}`, {useNewUrlParser: true});

// Arara page
router.get('/adote-arara', function (req, res, next) {
    res.render('adote_especies/adote-arara', { title: 'Salve os Bichin | Arara azul'});
});

// Gato page
router.get('/adote-gato', function (req, res, next) {
    res.render('adote_especies/adote-gato', { title: 'Salve os Bichin | Gato Maracajá'});

});

// Mico page
router.get('/adote-mico', function (req, res, next) {
    res.render('adote_especies/adote-mico', { title: 'Salve os Bichin | Mico-leão-dourado'});
});

// Onça page
router.get('/adote-onca', function (req, res, next) {
    res.render('adote_especies/adote-onca', { title: 'Salve os Bichin | Onça Pintada'});
});

// Tartaruga page
router.get('/adote-tartaruga', function (req, res, next) {
    res.render('adote_especies/adote-tartaruga', { title: 'Salve os Bichin | Tartaruga-oliva'});
});

// Lobo page
router.get('/adote-lobo', function (req, res, next) {
    res.render('adote_especies/adote-lobo', { title: 'Salve os Bichin | Lobo-guará'});
});

module.exports = router;