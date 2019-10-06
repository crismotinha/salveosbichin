const mongoose = require("mongoose");
const mailer = require("../services/mail.service");
const Inscritos = require("../controllers/inscritos.controller")
	.InscristosModel;
const db = require("../services/database.service");

db.dbConnect();

const AbaixoAssinado = mongoose.model(('AbaixoAssinado'), new mongoose.Schema({
	titulo: { type: String, unique: true },
	dataLimite: Date,
	resumo: String, // descrição pequenina do abaixo assinado: para nao enfiar um textão na pagina index
	responsavel: String,
	whoSigned: [Array],
	meta: Number,
	texto: String,
	qtdAssinaturas: Number,
	dataCriacao: Date
}));

var moment = require('moment');
moment.locale('pt');

module.exports = {
	getSingleAbaixo: (req, res) => {
		AbaixoAssinado.findOne({ _id: req.params.id }).lean().exec((err, document) => {
			if (err || (document === null)) {
				console.log(err);
			}
			else {
				res.render('abaixo-assinado/abaixo-assinado-single', {
					title: 'Salve os Bichin | Abaixo assinado - ' + req.params.titulo,
					abaixo: document,					
					porcentagem: Math.round((document.qtdAssinaturas * 100) / document.meta)
				});
			}
		})
	},

	getAbaixosAssinados: res => {
		AbaixoAssinado.find().sort({ 'dataCriacao': -1 }).limit(10).lean().exec((err, docs) => {
			let abaixosList = [];
			//
			if (err || (docs === null)) {
				for (let i = 0; i < 10; i++) {
					abaixosList.push({ nome: 'Nehum Abaixo-Assinado Encontrado', dataLimite: 'XX/XX/XXXX', resumo: 'Sem resumo' });
				}
			}
			else {
				docs.forEach((current) => {
					// let dataParaString = current.data.toLocaleDateString('en-GB'/*, {day: '2-digit', month: '2-digit', year: 'numeric'}*/);
					//MM/DD/YYYY
					const porcentagem = Math.round((current.qtdAssinaturas * 100) / current.meta);
					let data = moment(current.dataLimite).format('LL');

					abaixosList.push({
						id: current._id,
						titulo: current.titulo,
						dataLimite: data,
						resumo: current.resumo,
						responsavel: current.responsavel,
						texto: current.texto,
						meta: current.meta,
						qtdAssinaturas: current.qtdAssinaturas,
						porcentagem: porcentagem

					});
				});
			}
			res.render('abaixo-assinado/abaixo-assinado', { title: 'Salve os Bichin | Abaixo-Assinado', abaixosList: abaixosList });
		});
	},

	createAbaixoAssinado: (req, callback) => {
		const abaixo = new AbaixoAssinado({
			titulo: req.body.tituloAbaixo,
			dataLimite: req.body.dataLimiteAbaixo,
			resumo: req.body.resumoAbaixo,
			responsavel: req.body.responsavelAbaixo,
			meta: req.body.metaAbaixo,
			texto: req.body.textoAbaixo,
			qtdAssinaturas: 0,
			dataCriacao: new Date()
		})

		abaixo.save()
		.then(() => {
			Inscritos.find({ afiliado: true }, (err, docs) => {
				if (err) console.error(err);
				else {
					let to = [];

					docs.forEach(currentValue => {
						to.push(currentValue.email);
					});

					mail = "Um novo abaixo assinado foi criado no nosso site! \n" +
						"Título: " + req.body.tituloAbaixo + "\n" +
						"Resumo: " + req.body.resumoAbaixo + "\n" +
						"Responsável: " + req.body.responsavelAbaixo + "\n" +
						"Data Limite: " + req.body.dataLimiteAbaixo + "\n" +
						"Meta: " + req.body.metaAbaixo + "\n" +
						req.body.textoAbaixo + "\n";

					mailer.enviaEmail(to, "Salve os Bichin | Novo abaixo-assinado!", mail);
				}
			});
			callback.json({
				title: "Abaixo-assinado criado!",
				text:
					"Um e-mail com as informações do seu abaixo-assinado foi enviado para todos os afiliados.",
				type: "success"
			});
		})
		.catch(err => {
			console.log(err);
			callback.json({
				title: "Erro ao criar abaixo assinado",
				text:
					"Algo deu errado ao criar o abaixo assinado. Tente novamente!",
				type: "error"
			});
		});
	},

	assinarAbaixoAssinado: (req, callback) => {
		AbaixoAssinado.findOneAndUpdate(
			{ _id: req.body.idAssinar },
			{
				$push: { whoSigned: req.body.emailAssinar },
				$inc: { qtdAssinaturas: 1 }
			},
			{ upsert: true },
			(err, res) => {
				if (err) console.log(err);
			});

		let receiver = req.body.emailAssinar;
		let subject = "Salve os Bichin | Obrigada por ajudar essa causa!";
		let text =
			"Olá! Muito obrigada por assinar " + req.body.tituloAssinar + ".\n" +
			"Estamos juntos nessa causa! \n" +
			"Obrigada e até a próxima! :) ";

		mailer.enviaEmail(receiver, subject, text);
		callback.json({
			title: "Obrigada pela assinatura!",
			text: "Cada assinatura conta! Estamos mais perto de alcançar a meta!",
			type: "success"
		});
	}
}