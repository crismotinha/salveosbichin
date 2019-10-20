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
		ids = []
		Object.keys(carrinho).forEach(prod => ids.push(mongoose.Types.ObjectId(prod)))
		Produto.find({"_id": {"$in": ids}})
		.then(produtos => {
			produtoPrecoCorrigido = [];
			produtos = produtos.forEach(produto =>
				produtoPrecoCorrigido.push({
				id: produto._id,
				img: produto.img,
				titulo: produto.titulo,
				descricao: produto.descricao,
				preco: produto.preco.toFixed(2),
				qtd: parseInt(carrinho[produto.id].qtd),
				subtotal: ((parseInt(carrinho[produto.id].qtd))*produto.preco).toFixed(2),
			}));
			res.render('loja/carrinho', { title: 'Salve os Bichin | Carrinho', produtos: produtoPrecoCorrigido })
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
		res.send({
            title: "Produto adicionado ao carrinho!",
            type: "success"
          });
	},
	removeFromCarrinho: (req, res) => {
		carrinho = req.cookies['carrinho'] || {};
		produto = req.body;
		delete carrinho[produto.id]
		res.cookie('carrinho', carrinho);
		res.send({
            title: "Produto removido!",
            type: "success"
          });
	},
	checkout: (req, res) => {
		mail = "Uma nova compra foi realizada! Esses foram os produtos escolhidos: \n\n"
		email = req.body.email;
		carrinho = req.cookies['carrinho'] || {};
		ids = []
		Object.keys(carrinho).forEach(prod => ids.push(mongoose.Types.ObjectId(prod)))
		Produto.find({"_id": {"$in": ids}})
		.then(produtos => {
			valorTotal = 0;
			produtos = produtos.forEach(produto => {
				mail += "\n\nItem: " + produto.titulo +
				"\nPreço unitário: R$" + produto.preco.toFixed(2) +
				"\nQuantidade: " + carrinho[produto.id].qtd +
				"\nSubtotal: R$" + ((parseInt(carrinho[produto.id].qtd))*produto.preco).toFixed(2);
				valorTotal += parseInt(carrinho[produto.id].qtd)*produto.preco;
			});

		mail += "\n\n\nValor total: R$"+valorTotal.toFixed(2) +
		"\nPara finalizar essa compra, efetue o pagamento do boleto de numeração:\n\n34191.79001 01043.510047 91020.150008 1 80480026000"

		mailer.enviaEmail(email, "Salve os Bichin | Nova compra realizada!", mail);
		res.send({
            title: "E-mail enviado com sucesso!",
            type: "success"
          });
		})
		.catch(err => res.send({
            title: "Erro ao enviar e-mail",
            type: "error"}));
	}
}