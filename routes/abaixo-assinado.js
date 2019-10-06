const express = require('express');
const abaixoController = require('../controllers/abaixo-assinado.controller');

const router = express.Router();

router.get('/abaixo-assinado-new', (req, res)=>{
    res.render('abaixo-assinado/abaixo-assinado-new', { title: 'Salve os Bichin | Criar novo Abaixo-Assinado'});
});

router.post('/criarabaixoassinado', (req, res)=>{
    abaixoController.createAbaixoAssinado(req, res);
});

router.get('/:id', async (req, res) => {
    abaixoController.getSingleAbaixo(req, res);
});

router.post('/assinarabaixoassinado', (req, res) => {
    abaixoController.assinarAbaixoAssinado(req, res);
})
module.exports = router;