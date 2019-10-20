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
				id: produto._id,
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
	getCarrinho: (req, res) => {
		carrinho = req.cookies['carrinho'] || [];
		num_itens = carrinho.length;
		res.render('loja/carrinho', { title: 'Salve os Bichin | Carrinho', produtos: carrinho, num_itens: num_itens })
	},
	addToCarrinho: (req, res) => {
		carrinho = req.cookies['carrinho'] || {};
		produto = req.body;
		if (carrinho[produto.id]) {
			carrinho[produto.id].qtd = parseInt(produto.qtd) + parseInt(carrinho[produto.id].qtd);
		}
		else {
			carrinho[produto.id] = {
				id: produto.id,
				qtd: produto.qtd
			}
		}

		res.cookie('carrinho', carrinho);
		res.send("Mandando o cookie");
	},
}