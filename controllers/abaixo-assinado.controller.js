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
	titulo: String,
	dataLimite: Date,
	descricao: String, // descrição pequenina do abaixo assinado: para nao enfiar um textão na pagina index
	responsavel: String,
	whoSigned: [Array],
	meta: Number,
	texto: String,
}));


module.exports = {
	getAbaixosAssinados: res => {
		res.render("abaixo-assinado/abaixo-assinado", { title: "Salve os Bichin | Abaixo-Assinados " });
	},

	createAbaixoAssinado: (req, callback) => {
		const abaixo = new AbaixoAssinado({
			titulo: req.body.tituloAbaixo,
			dataLimite: req.body.dataLimiteAbaixo,
			descricao: req.body.descricaoAbaixo,
			responsavel: req.body.responsavelAbaixo,
			$push: { whoSigned: req.body.emailAbaixo }, //inclui o email na lista de emails
			meta: req.body.metaAbaixo,
			texto: req.body.textoAbaixo
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
					"Descrição: " + req.body.descricaoAbaixo + "\n"
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
	}
}