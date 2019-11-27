const mongoose = require("mongoose");
const db = require("../services/database.service");

db.dbConnect();

const Presentes = mongoose.model(('Presentes'), new mongoose.Schema({
  nome: String,
  template: String,
  imageSrc: String
}));

module.exports = {

  createPresente: (req, callback) => {

    //let templateEscolhido = parseInt(req.body.valorTemplate);

    console.log(req.body.nomeAniversariante);
    console.log(req.body.imagemEscolhida);
    console.log(req.body.templateEscolhido);

    const presente = new Presentes({
      nome: req.body.nomeAniversariante,
      template: req.body.templateEscolhido,
      imageSrc: req.body.imagemEscolhida
    });

    presente.save().then(() => {
        console.log("salvou presente codigo " + presente._id);

        callback.json({
          title: "Presente Criado!",
          text:
            "O presente foi criado com código " + presente._id + ".\n" + "Para acessá-lo use o link: ",
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
    Presentes.findById(req.query.codigo).lean().exec((err, document) => {
        if (err || (document === null)) {
            console.log("Não achou codigo " + req.query.codigo);
            console.log(err);
        }
        else {
            console.log("achou codigo " + req.query.codigo);
            console.log("nome " + document.nome);
            console.log("template " + document.template);
            console.log("imagem " + document.imageSrc);
            res.render('presente-planeta/template-presente', {
                title: 'Salve os Bichin | Presente para o planeta - Aniversário ' + document.nome,
                presente: document
            });
        }
    })
  },

  PresentesModel: Presentes,

}
