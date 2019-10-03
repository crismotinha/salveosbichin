const express = require('express');
const abaixoController = require('../controllers/abaixo-assinado.controller');

const router = express.Router();

router.get('/abaixo-assinado-new', (req, res)=>{
    res.render('abaixo-assinado/abaixo-assinado-new');
});

router.post('/criarabaixoassinado', (req, res)=>{
    abaixoController.createAbaixoAssinado(req, res);
});

// WIP 
router.get('/:titulo', async (req, res) => {
    abaixoController.getSingleAbaixo(req, res);
});

module.exports = router;