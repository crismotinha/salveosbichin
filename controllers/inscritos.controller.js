const mongoose = require('mongoose');
const mailer = require('../services/mail.service');

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const url = process.env.DB_URL


mongoose.connect(`mongodb+srv://${user}:${password}@${url}`, { useNewUrlParser: true });

// criar model inscrito-> pode ser pra agenda ou pra afiliacao
const inscritos = mongoose.model('Inscrito', new mongoose.Schema
    ({ email: { type: String, unique: true }, afiliado: Boolean, agenda: Boolean }));


module.exports = {
    newAfiliacao: (req, callback) => {
        // FIXME: não está entrando nesse IF, entra no else mas reclama de chave duplicada
        if (inscritos.findOne({ email: req.body.emailafiliacao }) == true) {
            inscritos.findOneAndUpdate({ email: req.body.emailafiliacao }, { afiliado: true });
            console.log('dei update afiliado')
        }
        else {
            const newAfiliacao = inscritos({
                email: req.body.emailafiliacao,
                afiliado: true,
                agenda: false
            });
            newAfiliacao.save().then(() => {
                console.log('new afiliacao');
            });
        }
        mailer.mailAfiliacao(req.body.emailafiliacao);
        // res.render(); TODO: popup de inscrito
        callback.render('index');
    },

    newAgendaInscrito: (req, callback) => {
        // FIXME: não está entrando nesse if, entra no else mas reclama de chave duplicada
        if (inscritos.find({ email: req.body.emailinscrito }) == true) {
            inscritos.findOneAndUpdate({ email: req.body.emailinscrito },  { agenda: true });
            console.log('dei update agenda');
        }
        else {
            console.log('entrei no else e cagou tudo');
            const newAgendaInscrito = inscritos({
                email: req.body.emailinscrito,
                afiliado: false,
                agenda: true
            });
            newAgendaInscrito.save().then(() => {
                console.log('inscrito agenda');
            });
        }
        mailer.mailAgendaInscrito(req.body.emailinscrito);
        // res.render(); TODO: popup de inscrito
        callback.render('index');
    },
    InscristosModel: inscritos
}