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
router.get('/abaixo-assinado/:id', (req, res) => {
    res.send(req.params).render('abaixo-assinado/show' + req.params.id);
})

module.exports = router;