const mongoose = require("mongoose");
const mailer = require("../services/mail.service");
const db = require("../services/database.service");

db.dbConnect();

// criar model inscrito-> pode ser pra agenda ou pra afiliacao
const inscritos = mongoose.model(
  "Inscrito",
  new mongoose.Schema({
    email: { type: String, unique: true },
    afiliado: Boolean,
    agenda: Boolean
  })
);

module.exports = {
  enviarInfoPresente: (req, callback) => {
    let receiver = req.body.emailpresente;
    let subject = "salveosbichin! | Obrigado por querer ajudar!";
    let text =
      "Agradecemos sua ajuda! \n Para realizar o pagamento, realize uma transferência bancária com os seguintes dados:" +
      "\n CONTA: 9867-1 \n AGÊNCIA: 0001 \N BANCO: Banco do Brasil. \n" +
      "Razão Social: Salve os Bichin \n" +
      "CNPJ: 50.668.081/0001-70" + 
      "Obrigada e até a próxima! :) ";

    mailer.enviaEmail(receiver, subject, text);
    callback.json({
      title: "Obrigado pelo apoio!",
      text: "As informações de pagamento serão eviadas para seu e-mail.",
      type: "success"
    });
  },
  
  newAfiliacao: (req, callback) => {
    //corrigido usando upsert
    inscritos.findOneAndUpdate(
      { email: req.body.emailafiliacao },
      { email: req.body.emailafiliacao, afiliado: true },
      { upsert: true },
      (err, doc) => {
        if (err) {
          console.error(err);
          callback.json({
            title: "Ocorreu um erro ao processar sua solicitação",
            type: "error"
          });
        } else if (doc != null) {
          if (doc.afiliado) {
            callback.json({
              title: "Você já é um afiliado!",
              text:
                "Inscreva-se também na nossa agenda de eventos e saiba de tudo que acontece!",
              type: "info"
            });
          } else {
            mailer.mailAfiliacao(req.body.emailafiliacao);
            callback.json({
              title: "Obrigada por se afiliar!",
              type: "success"
            });
          }
        } else {
          mailer.mailAfiliacao(req.body.emailafiliacao);
          callback.json({
            title: "Obrigada por se afiliar!",
            type: "success"
          });
        }
      }
    );
  },

  newAgendaInscrito: (req, callback) => {
    inscritos.findOneAndUpdate(
      { email: req.body.emailinscrito },
      { email: req.body.emailinscrito, agenda: true },
      { upsert: true },
      (err, doc) => {
        if (err) {
          console.error(err);
          callback.json({
            title: "Ocorreu um erro ao processar sua solicitação",
            type: "error"
          });
        } else if (doc != null) {
          if (doc.agenda) {
            callback.json({
              title: "Você já faz parte da nossa agenda!",
              text: "Afilie-se também e fique por dentro da nossa newsletter!",
              type: "info"
            });
          } else {
            mailer.mailAgendaInscrito(req.body.emailinscrito);
            callback.json({
              title: "Obrigada por se inscrever na nossa agenda!",
              type: "success"
            });
          }
        } else {
          mailer.mailAgendaInscrito(req.body.emailinscrito);
          callback.json({
            title: "Obrigada por se inscrever na nossa agenda!",
            type: "success"
          });
        }
      }
    );
    // res.render(); TODO: popup de inscrito
  },
  InscristosModel: inscritos
};
