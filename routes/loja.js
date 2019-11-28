const express = require('express');
const lojaController = require('../controllers/loja.controller');

const router = express.Router();

router.get('/carrinho', (req, res) => {
	lojaController.getCarrinho(req, res);
});

module.exports = router;