const nodemailer = require('nodemailer');

const email = process.env.EMAIL;
const emailPass = process.env.EMAIL_PASSWORD;


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: email,
        pass: emailPass
    }
});

module.exports = {
    enviaEmail: (receiver,subject,text)=>{
        transporter.sendMail(
            {
                from: email,
                to: receiver,
                subject: subject,
                text: text
            },
            (err, resp) => {
                if (err) console.log(err);
            });
    },

    enviaMailEventos: (evento, afiliados, inscritos)=> {
        const subject = 'salveosbichin | Um novo evento foi cadastrado!';
        for(let i = 0; i<afiliados.length; i++) {
            transporter.sendMail({
                from: email,
                to: afiliado[i].email,
                subject: this.subject,
                text: 'Informações do evento: ' + evento.nome + evento.local
            },
            (err, resp)=> { if (err) console.log(err);
            });
        }
    }
}