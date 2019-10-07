const mongoose = require("mongoose");
const mailer = require("../services/mail.service");
const db = require("../services/database.service");

db.dbConnect();

const Produto = mongoose.model(('Produto'), new mongoose.Schema({
	titulo: { type: String, unique: true },
	img: String,
	descricao: String,
	preco: Number,
}));

module.exports = {
	getProdutos: (req, res) => {
		Produto.find()
		.then(produtos => {
			produtoPrecoCorrigido = [];
			produtos = produtos.forEach(produto =>
				produtoPrecoCorrigido.push({
				img: produto.img,
				titulo: produto.titulo,
				descricao: produto.descricao,
				preco: produto.preco.toFixed(2),
			}));
			carrinho = req.cookies['carrinho'] || [];
			num_itens = carrinho.length;

			res.render('loja/loja', { title: 'Salve os Bichin | Loja', produtos: produtoPrecoCorrigido, num_itens: num_itens })})
		.catch(err => console.log(err));
		},
}