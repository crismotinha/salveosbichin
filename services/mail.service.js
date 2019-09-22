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
    }
}