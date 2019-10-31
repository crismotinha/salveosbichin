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

module.exports = router;