const mongoose = require('mongoose');
const mailer = require('../services/mail.service');
const Inscritos = require('../controllers/inscritos.controller').InscristosModel;

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

      evento.save().then(() =>{
        Inscritos.find({}, (err, docs)=>{
          if (err) console.error(err);
          
          else
          {
            let to = [];

            docs.forEach((currentValue)=>{
              to.push(currentValue.email);
            });

            corpoEvento = 'Nome do Evento: ' + req.body.nomeevento + '\n'
              + 'Data do Evento: ' + req.body.dataevento + '\n'
              + 'Descricao do Evento: ' + req.body.descricaoevento + '\n'
              + 'Responsável: ' + req.body.responsavelevento + '\n'
              + 'E-mail de Contato: ' + req.body.emailevento + '\n'
              + 'Local: ' + req.body.localevento + '\n'
              + 'Cidade: ' + req.body.cidadeevento + '\n'
              + 'Estado: ' + req.body.estadoevento + '\n'
              + 'Link: ' + req.body.linkevento + '\n'
              + 'Observação: ' + req.body.obsevento + '\n';

          mailer.enviaEmail(to, req.body.nomeevento + ' | Salve os Bichin!', corpoEvento);
          }
        });
      });

      console.log('foi');
      res.redirect('/eventos');
    },

    EventosModel: Eventos,

    carregaEventosHomePage: (callback) => {
      Eventos.find({}).limit(3).lean().exec((err, docs) => {
        let eventos = [];
        //
        if (err || (docs === null)) {
          console.error(err);
          for (let i = 0 ; i < 3 ; i++){
            eventos.push({ nome: 'Nehum Evento Encontrado', data: 'XX/XX/XXXX', descricao: 'Sem descrição' });
          }
          //console.log(docs);
        }
        else {
          docs.forEach((current) => {
            let dataParaString = current.data.toLocaleDateString('en-GB'/*, {day: '2-digit', month: '2-digit', year: 'numeric'}*/);
            
            eventos.push({
              nome: current.nome,
              data: dataParaString,
              descricao: current.descricao
            });
          });
        }
        callback.render('index', { title: 'Salve os Bichin', eventos: eventos });
      });
    }

}