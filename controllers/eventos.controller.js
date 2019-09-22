const mongoose = require('mongoose');
const mailer = require('../services/mail.service');

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const url = process.env.DB_URL


mongoose.connect(`mongodb+srv://${user}:${password}@${url}`, { useNewUrlParser: true });

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
    getEventos: (res) => {
      res.render('eventos/eventos', { title: 'Salve os Bichin | Eventos'});
    },

    getEventosHomepage: (req, callback) => {
        const eventosHome = Eventos.find({}).sort({'data': -1}).limit(3);
    },

    createEvento: (req, res)=> {
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

      evento.save().then(() => 
      //  mailer.enviaMailEventos(evento, ));
      console.log('foi'));
      res.redirect('eventos');
    }

}