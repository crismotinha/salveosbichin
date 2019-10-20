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
			carrinho = req.cookies['carrinho'] || {};
			num_itens = Object.keys(carrinho).length;

			res.render('loja/loja', { title: 'Salve os Bichin | Loja', produtos: produtoPrecoCorrigido, num_itens: num_itens })})
		.catch(err => console.log(err));
		},
	getCarrinho: (req, res) => {
		carrinho = req.cookies['carrinho'] || {};
		console.log('carrinho', carrinho)
		num_itens = Object.keys(carrinho).length;
		ids = []
		Object.keys(carrinho).forEach(prod => ids.push(mongoose.Types.ObjectId(prod)))
		Produto.find({"_id": {"$in": ids}})
		.then(produtos => {
			console.log("fingerscrossed:", produtos)
			produtoPrecoCorrigido = [];
			produtos = produtos.forEach(produto =>
				produtoPrecoCorrigido.push({
				id: produto._id,
				img: produto.img,
				titulo: produto.titulo,
				descricao: produto.descricao,
				preco: produto.preco.toFixed(2),
			}));
			res.render('loja/carrinho', { title: 'Salve os Bichin | Carrinho', produtos: produtoPrecoCorrigido, num_itens: num_itens })
		})
		.catch(err => console.log(err))
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
	removeFromCarrinho: (req, res) => {
		carrinho = req.cookies['carrinho'] || {};
		produto = req.body;
		delete carrinho[produto.id]
		res.cookie('carrinho', carrinho);
		res.send("Mandando o cookie");
	},
}