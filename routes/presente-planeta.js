const express = require('express');
const presenteController = require('../controllers/presente-planeta.controller');

const router = express.Router();

router.post('/criarpresente', (req, res)=>{
    console.log(req.params);
    console.log(req.body);
    presenteController.createPresente(req, res);
});

router.get('/visualizar-presente', async (req, res)=>{
    presenteController.getPresente(req, res);
});

router.get('/template-presente', (req, res)=>{
    var doc = {nome: "teste", template: "3"}
    res.render('presente-planeta/template-presente', {
        title: 'Salve os Bichin | Presente para o planeta - Aniversário ' + doc.nome,
        presente: doc
    });
});

module.exports = router;