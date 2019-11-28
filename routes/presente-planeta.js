const express = require('express');
const presenteController = require('../controllers/presente-planeta.controller');
const inscritoController = require('../controllers/inscritos.controller');

const router = express.Router();

router.post('/criarpresente', (req, res)=>{
    console.log(req.params);
    console.log(req.body);
    presenteController.createPresente(req, res);
});

/* router.get('/visualizar-presente', (req, res)=>{
    presenteController.getPresente(req, res);
}); */

router.get('/visualizar-presente', (req, res)=>{
    presenteController.getPresente(req, res);
});

router.post('/info', (req, res)=>{
    inscritoController.enviarInfoPresente(req, res);
});

module.exports = router;
