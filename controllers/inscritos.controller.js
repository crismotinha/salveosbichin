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
     
        //corrigido usando upsert
        inscritos.findOneAndUpdate({ email: req.body.emailafiliacao },
            { email: req.body.emailafiliacao, afiliado: true},
            { upsert: true },
            (err, doc)=>{
                if (err) console.error(err);
                console.log(doc); 
            });
        mailer.mailAfiliacao(req.body.emailafiliacao);
        // res.render(); TODO: popup de inscrito
        callback.json({title: 'Obigado por se afiliar!', type: 'success'});
    },

    newAgendaInscrito: (req, callback) => {
        console.log(req);
        inscritos.findOneAndUpdate({ email: req.body.emailinscrito },
            { email: req.body.emailinscrito, agenda: true },
            { upsert: true },
            (err, doc) => {
                if (err) console.error(err);
                console.log(doc);
            });
        mailer.mailAgendaInscrito(req.body.emailinscrito);
        // res.render(); TODO: popup de inscrito
        callback.json({ title: 'Obrigado por se iscrever na nossa agenda!', type: 'success' });
    },
    InscristosModel: inscritos
}