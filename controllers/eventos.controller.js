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

const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const Eventos = mongoose.model(('Eventos'), new mongoose.Schema({
  nome: String,
  data: Date,
  descricao: String,
  responsavel: String,
  emailContato: String,
  local: String,
  cidade: String,
  estado: String,
  linkEvento: String,
  observacao: String
}));

module.exports = {
  getEventos: res => {
    res.render("eventos/eventos", { title: "Salve os Bichin | Eventos" });
  },

  getEventosHomepage: (req, callback) => {
    const eventosHome = Eventos.find({}).sort({ data: -1 }).limit(3);
  },

  createEvento: (req, callback) => {
    const evento = new Eventos({
        nome: req.body.nomeevento,
        data: req.body.dataevento,
        descricao: req.body.descricaoevento,
        responsavel: req.body.responsavelevento,
        emailContato: req.body.emailevento,
        local: req.body.localevento,
        cidade: req.body.cidadeevento,
        estado: req.body.estadoevento,
        linkEvento: req.body.linkevento,
        observacao: req.body.obsevento
    });

    evento.save().then(() => {
      Inscritos.find({}, (err, docs) => {
        if (err) console.error(err);
        else {
          let to = [];

          docs.forEach(currentValue => {
            to.push(currentValue.email);
          });

          corpoEvento =
            "Nome do Evento: " +
            req.body.nomeevento +
            "\n" +
            "Data do Evento: " +
            req.body.dataevento +
            "\n" +
            "Descricao do Evento: " +
            req.body.descricaoevento +
            "\n" +
            "Responsável: " +
            req.body.responsavelevento +
            "\n" +
            "E-mail de Contato: " +
            req.body.emailevento +
            "\n" +
            "Local: " +
            req.body.localevento +
            "\n" +
            "Cidade: " +
            req.body.cidadeevento +
            "\n" +
            "Estado: " +
            req.body.estadoevento +
            "\n" +
            "Link: " +
            req.body.linkevento +
            "\n" +
            "Observação: " +
            req.body.obsevento +
            "\n";

          mailer.enviaEmail(
            to,
            req.body.nomeevento + " | Salve os Bichin!",
            corpoEvento
          );
        }
      });
    });

    console.log("foi");
    callback.json({
      title: "Evento Criado!",
      text:
        "Um e-mail com as informações do seu evento foi enviado para todos os inscritos na agenda.",
      type: "success"
    });
  },

  EventosModel: Eventos,

  carregaEventosHomePage: callback => {
    Eventos.find({}).sort({ 'data': -1 })
      .limit(3)
      .lean()
      .exec((err, docs) => {
        console.log("entrei");
        let eventos = [];
        //
        if (err || docs === null) {
          console.error(err);
          for (let i = 0; i < 3; i++) {
            eventos.push({
              nome: "Nehum Evento Encontrado",
              data: "XX/XX/XXXX",
              descricao: "Sem descrição"
            });
          }
          //console.log(docs);
        } else {
          docs.forEach(current => {
            let dataParaString = current.data.toLocaleDateString(
              "en-GB" /*, {day: '2-digit', month: '2-digit', year: 'numeric'}*/
            );

            eventos.push({
              nome: current.nome,
              data: dataParaString,
              descricao: current.descricao
            });
          });
        }
        callback.render("index", {
          title: "Salve os Bichin | Eventos",
          eventos: eventos
        });
      });
  },

  carregaEventosPage: (callback) => {
    Eventos.find({ 'data': { $gte: new Date() } }).sort({ 'data': 1 }).limit(10).lean().exec((err, docs) => {
      let eventoslist = [];
      //
      if (err || (docs === null)) {
        for (let i = 0; i < 10; i++) {
          eventoslist.push({ nome: 'Nehum Evento Encontrado', data: 'XX/XX/XXXX', descricao: 'Sem descrição' });
        }
      }
      else {
        docs.forEach((current) => {
          let dataParaString = current.data.toLocaleDateString('en-GB'/*, {day: '2-digit', month: '2-digit', year: 'numeric'}*/);
          //12/11/2019
          let day = dataParaString.substring(3, 5); //FIXME datas com 0?
          let month = months[parseInt(dataParaString.substring(0, 2), 10) - 1];
          let year = dataParaString.substring(6, 10);
          eventoslist.push({
            link: current.linkEvento,
            nome: current.nome,
            day: day,
            month: month,
            year: year,
            data: dataParaString,
            descricao: current.descricao,
            local: current.local,
            cidade: current.cidade,
            estado: current.estado,
            responsavel: current.responsavelevento,
            emailContato: current.emailContato,
            obs: current.observacao
          });
        });
      }
      callback.render('eventos/eventos', { title: 'Salve os Bichin | Eventos', eventoslist: eventoslist });
    });
  }

}
