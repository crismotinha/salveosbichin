const mailer = require("../services/mail.service");
const mongoose = require("mongoose");
const db = require("../services/database.service");

db.dbConnect();

const AdoptedSpecies = mongoose.model(
  "AdoptedSpecies",
  new mongoose.Schema({
    species: String,
    whoAdopted: [String],
    moneyRaised: Number
  })
);

module.exports = {
  valores: callback => {
    const valores = AdoptedSpecies.find({})
      .lean()
      .exec((err, doc) => {
        //só consegui tratar os valores dentro do find
        callback.render("adote_especies/adote-uma-especie", {
          title: "Salve os Bichin | Adote uma espécie!",
          arrecadacaoArara: doc.filter(animal => {
            return animal.species == "Arara-azul";
          })[0].moneyRaised,
          arrecadacaoGato: doc.filter(animal => {
            return animal.species == "Gato-maracajá";
          })[0].moneyRaised,
          arrecadacaoMico: doc.filter(animal => {
            return animal.species == "Mico-leão-dourado";
          })[0].moneyRaised,
          arrecadacaoOnca: doc.filter(animal => {
            return animal.species == "Onça-pintada";
          })[0].moneyRaised,
          arrecadacaoTartaruga: doc.filter(animal => {
            return animal.species == "Tartaruga-oliva";
          })[0].moneyRaised,
          arrecadacaoLobo: doc.filter(animal => {
            return animal.species == "Lobo-guará";
          })[0].moneyRaised
        });
      });
  },
  registraDoacao: (req, callback) => {
    let brinde;
    let valorDoacao = parseInt(req.body.valorradio);

    AdoptedSpecies.findOneAndUpdate(
      { species: req.body.nomeEspecie }, //procura a especie no bd para atualizar
      {
        $push: { whoAdopted: req.body.emailadote }, //inclui o email na lista de emails
        $inc: { moneyRaised: valorDoacao }
      }, //aumenta o valor arrecadado
      { upsert: true }, //caso nao exista, cria a especie
      (err, res) => {
        if (err) console.log(err); //erro, caso exista. Normalmente v em null
      }
    );

    if (valorDoacao == 40) {
      brinde = "Caderninho";
    } else if (valorDoacao == 70) {
      brinde = "Caderninho + Garrafinha";
    } else {
      brinde = "Kit do Patrocinador";
    }

    let receiver = req.body.emailadote;
    let subject = "salveosbichin! | Obrigada por Adotar uma espécie!";
    let text =
      "Parabéns, " +
      req.body.nomeadote +
      "! Você Acabou de adotar a espécie: " +
      req.body.nomeEspecie +
      ".\n \n Obrigada também pela contribuição de: R$ " +
      req.body.valorradio +
      "\nVocê ganhará um " +
      brinde + ", que enviaremos assim que o pagamento for confirmado. \n Para realizar o pagamento, realize uma transferência bancária com os seguintes dados:" +
      "\n CONTA: 9867-1 \n AGÊNCIA: 0001 \N BANCO: Banco do Brasil. \n" +
      "Razão Social: Salve os Bichin \n" +
      "CNPJ: 50.668.081/0001-70" + 
      "Obrigada e até a próxima! :) ";

    mailer.enviaEmail(receiver, subject, text);
    callback.json({
      title: "Obrigada pela doação!",
      text: "As informações de pagamento serão eviadas para seu e-mail.",
      type: "success"
    });
  }
};
