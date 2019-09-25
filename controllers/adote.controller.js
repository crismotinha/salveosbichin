const mongoose = require("mongoose");
const mailer = require("../services/mail.service");

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const url = process.env.DB_URL;

mongoose.connect(`mongodb+srv://${user}:${password}@${url}`, {
  useNewUrlParser: true
});

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
            return animal.species == "Arara";
          })[0].moneyRaised,
          arrecadacaoGato: doc.filter(animal => {
            return animal.species == "Gato";
          })[0].moneyRaised,
          arrecadacaoMico: doc.filter(animal => {
            return animal.species == "Mico";
          })[0].moneyRaised,
          arrecadacaoOnca: doc.filter(animal => {
            return animal.species == "Onça";
          })[0].moneyRaised,
          arrecadacaoTartaruga: doc.filter(animal => {
            return animal.species == "Tartaruga";
          })[0].moneyRaised,
          arrecadacaoLobo: doc.filter(animal => {
            return animal.species == "Lobo";
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
        console.log(res); //resultado da query
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
    let subject = "salveosbichin! | Obrigado por Adotar uma espécie!";
    let text =
      "Parabéns, " +
      req.body.nomeadote +
      "! Você Acabou de adotar um(a) " +
      req.body.nomeEspecie +
      ".\n \n Obrigado também pela contribuição de: R$ " +
      req.body.valorradio +
      "\nVocê ganhará um " +
      brinde;

    mailer.enviaEmail(receiver, subject, text);
    callback.json({
      title: "Obrigado pela doação!",
      text: "As informações de pagamento serão eviadas para seu e-mail.",
      type: "sucess"
    }); // TODO: popup de adotado
  }
};
