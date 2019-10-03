const mongoose = require("mongoose");
const mailer = require("../services/mail.service");
const Inscritos = require("../controllers/inscritos.controller")
	.InscristosModel;

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const url = process.env.DB_URL;

mongoose.connect(`mongodb+srv://${user}:${password}@${url}`, {
	useNewUrlParser: true
});

const AbaixoAssinado = mongoose.model(('AbaixoAssinado'), new mongoose.Schema({
	titulo: { type: String, unique: true },
	dataLimite: Date,
	resumo: String, // descrição pequenina do abaixo assinado: para nao enfiar um textão na pagina index
	responsavel: String,
	whoSigned: [Array],
	meta: Number,
	texto: String,
	qtdAssinaturas: Number
}));


module.exports = {
	getSingleAbaixo: (req, res) => {
		console.log(req.params);
		AbaixoAssinado.findOne({ titulo: req.params.titulo }).lean().exec((err, document) => {
			if (err || (document === null)) {
				console.log(err);
			}
			else {
				res.render('abaixo-assinado/abaixo-assinado-single', { title: 'Salve os Bichin | Abaixo assinado - ' + req.params.titulo, abaixo: document });
			}
		})
	},

	getAbaixosAssinados: res => {
		AbaixoAssinado.find().limit(10).lean().exec((err, docs) => {
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

					abaixosList.push({
						titulo: current.titulo,
						dataLimite: current.dataLimite,
						resumo: current.resumo,
						responsavel: current.responsavel,
						texto: current.texto,
						meta: current.meta,
						qtdAssinaturas: current.qtdAssinaturas,
						porcentagem: (current.qtdAssinaturas * 100) / current.meta

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
			//$push: { whoSigned: req.body.emailAbaixo },
			meta: req.body.metaAbaixo,
			texto: req.body.textoAbaixo,
			qtdAssinaturas: 0
		})

		abaixo.save().then(() => {
			Inscritos.find({ afiliado: true }, (err, docs) => {
				if (err) console.error(err);
				else {
					let to = [];

					docs.forEach(currentValue => {
						to.push(currentValue.email);
					});

					mail = "Um novo abaixo assinado foi criado no nosso site! \n" +
						"Título: " + req.body.tituloAbaixo + "\n"
					"Resumo: " + req.body.resumoAbaixo + "\n"
					"Responsável: " + req.body.responsavelAbaixo + "\n"
					"Data Limite: " + req.body.dataLimiteAbaixo + "\n"
					"Meta: " + req.body.metaAbaixo + "\n"
						+ req.body.textoAbaixo + "\n";

					mailer.enviaEmail(to, "Salve os Bichin | Novo abaixo-assinado!", mail);
				}
			});
		});

		callback.json({
			title: "Abaixo-assinado Criado!",
			text:
				"Um e-mail com as informações do seu abaixo-assinado foi enviado para todos os afiliados.",
			type: "success"
		});
	},

	assinarAbaixoAssinado: (req, callback) => {
		AbaixoAssinado.findOneAndUpdate(
			{ titulo: req.body.tituloAbaixo },
			{
				$push: { whoSigned: req.body.emailAssinar },
				$inc: { qtdAssinaturas: 1 }
			},
			{ upsert: true },
			(err, res) => {
				if (err) console.log(err);
			});

		let receiver = req.body.emailAbaixo;
		let subject = "Salve os Bichin | Obrigada por ajudar essa causa!";
		let text =
			"Olá! Muito obrigada por assinar " + req.body.tituloAbaixo + ".\n" +
			"Obrigada e até a próxima! :) ";

		mailer.enviaEmail(receiver, subject, text);
		callback.json({
			title: "Obrigada pela assinatura!",
			text: "Cada assinatura conta! Estamos mais perto de alcançar a meta!",
			type: "success"
		});
	}
}