const mongoose = require("mongoose");
const db = require("../services/database.service");

db.dbConnect();

const Presentes = mongoose.model(('Presentes'), new mongoose.Schema({
  nome: String,
  template: String
}));

module.exports = {

  createPresente: (req, callback) => {

    let templateEscolhido = parseInt(req.body.valorTemplate);

    const presente = new Presentes({
      nome: req.body.nome,
      template: templateEscolhido,
    });

    presente.save().then(() => {
        console.log("salvou presente codigo " + presente._id);

        callback.json({
          title: "Presente Criado!",
          text:
            "O presente foi criado com código " + presente._id,
          type: "success",
          codigo: presente._id
        });
    })
    .catch(err => {
			console.log(err);
			callback.json({
				title: "Erro ao criar presente",
				text:
					"Deu ruim no presente",
				type: "error"
			});
		});
  },

  getPresente: (req, res) => {
    Presentes.findOne({ _id: req.params.codigo }).lean().exec((err, document) => {
        if (err || (document === null)) {
            console.log("Não achou codigo " + req.params.codigo);
            console.log(err);
        }
        else {
            console.log("achou codigo " + req.params.codigo);
            res.render('presente-planeta/template-presente', {
                title: 'Salve os Bichin | Presente para o planeta - Aniversário ' + document.nome,
                presente: document
            });
        }
    })
},

  PresentesModel: Presentes,

}