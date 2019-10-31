const express = require('express');
const presenteController = require('../controllers/presente-planeta.controller');

const router = express.Router();

router.post('/criarpresente', (req, res)=>{
    presenteController.createPresente(req, res);
});

router.get('/visualizar-presente', (req, res)=>{
    presenteController.getPresente(req, res);
});

module.exports = router;