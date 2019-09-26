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
	enviaEmail: (receiver, subject, text) => {
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

	mailAfiliacao: (receiver) => {
		transporter.sendMail({
			from: email, // TODO: o from está só com o email, colocar o nome do salveosbichin
			to: receiver,
			subject: 'salveosbichin | Obrigada por se inscrever na nossa newsletter!',
			text: 'Bem vindo! Agora você receberá todas as novidades da nossa página e ficará por dentro de todas as novidades. '
			// TODO: layout bonitinho do email
		},
			(err, resp) => {
				if (err) console.log(err);
			});
	},

	mailAgendaInscrito: (receiver) => {
		transporter.sendMail({
			from: email, // TODO: o from está só com o email, colocar o nome do salveosbichin
			to: receiver,
			subject: 'salveosbichin | Obrigada por se inscrever na nossa agenda!',
			text: 'Olá! Agora você estará sabendo de todos os próximos eventos cadastrados no nosso site. Aproveite!'
			// TODO: layout bonitinho do email
		},
			(err, resp) => {
				if (err) console.log(err);
			});
	}
}